import { Args, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { filter } from 'domutils';
import { PaginationArgs } from 'src/utils/page-pagination';
import { PaginatedVideoModel } from 'src/video/models/video.model';
import { VideoService } from 'src/video/video.service';
import { PlaylistEntity } from '../entities/playlist.entity';
import { RecommendedPlaylistModel } from '../models/recommended-playlist.model';
import { RecommendedPlaylistVideosFilterInput } from '../playlist.input';
import { PlaylistService } from '../playlist.service';

@Resolver(() => RecommendedPlaylistModel)
export class RecommendedPlaylistResolver {
  constructor(
    private readonly playlistService: PlaylistService,
    private readonly videoService: VideoService,
  ) {}

  @Query(() => RecommendedPlaylistModel)
  recommendedPlaylist() {
    return this.playlistService.getById(1);
  }

  @ResolveField(() => [String])
  thumbnails(@Parent() parent: PlaylistEntity) {
    return this.playlistService.getThumbnails(parent.id);
  }

  @ResolveField(() => PaginatedVideoModel)
  videos(
    @Parent() parent: PlaylistEntity,
    @Args() pagination: PaginationArgs,
    @Args('filter', { nullable: true })
    filter: RecommendedPlaylistVideosFilterInput,
  ) {
    return this.videoService.paginatedVideos(pagination, {
      playlistIdFilter: parent.id,
      filter,
    });
  }
}
