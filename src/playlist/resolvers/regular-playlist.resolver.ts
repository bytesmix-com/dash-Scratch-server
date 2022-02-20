import { UseGuards } from '@nestjs/common';
import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { VoidResolver } from 'graphql-scalars';
import { CurrentStudent } from 'src/auth/guards/current-student.decorator';
import { GqlJwtAuthGuard } from 'src/auth/guards/gql-jwt.guard';
import { Roles } from 'src/auth/guards/roles.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { StudentEntity } from 'src/student/entities/student.entity';
import { StudentService } from 'src/student/student.service';
import { PaginationArgs } from 'src/utils/page-pagination';
import { PaginatedVideoModel } from 'src/video/models/video.model';
import { VideoService } from 'src/video/video.service';
import { PlaylistEntity } from '../entities/playlist.entity';
import { RecommendedPlaylistModel } from '../models/recommended-playlist.model';
import {
  PaginatedRegularPlaylistModel,
  RegularPlaylistModel,
} from '../models/regular-playlist.model';
import { AddOrModifyRegularPlaylistInput } from '../playlist.input';
import { PlaylistService } from '../playlist.service';

@Resolver(() => RegularPlaylistModel)
@UseGuards(GqlJwtAuthGuard, RolesGuard)
export class RegularPlaylistResolver {
  constructor(
    private readonly playlistService: PlaylistService,
    private readonly videoService: VideoService,
  ) {}

  @Query(() => [Number], {
    description: '이미 존재하는 정규 강의 재생목록 주차 목록',
  })
  existingRegularPlaylistWeeks() {
    return this.playlistService.existingRegularPlaylistWeeks();
  }

  @Query(() => PaginatedRegularPlaylistModel, {
    description: '정규 강의 재생목록 리스트',
  })
  paginatedRegularPlaylist(
    @Args() pagination: PaginationArgs,
    @Args('nameFilter', {
      nullable: true,
    })
    nameFilter?: string,
  ) {
    return this.playlistService.paginatedRegularPlaylist(pagination, {
      nameFilter,
    });
  }

  @Query(() => [RegularPlaylistModel], {
    description: '정규 강의 재생목록 리스트',
  })
  regularPlaylists() {
    return this.playlistService.regularPlaylists();
  }

  @Query(() => RegularPlaylistModel)
  regularPlaylist(@Args('id') id: number) {
    return this.playlistService.getById(id);
  }

  @Query(() => RegularPlaylistModel)
  regularPlaylistByWeek(@Args('week') week: number) {
    return this.playlistService.getByWeek(week);
  }

  @Mutation(() => VoidResolver, {
    nullable: true,
  })
  deleteRegularPlaylist(@Args('ids', { type: () => [Number] }) ids: number[]) {
    return this.playlistService.deleteRegularPlaylist(ids);
  }

  @Mutation(() => RegularPlaylistModel, {
    nullable: true,
  })
  addOrModifyRegularPlaylist(
    @Args('input') input: AddOrModifyRegularPlaylistInput,
  ) {
    return this.playlistService.addOrModifyRegularPlaylist(input);
  }

  @ResolveField(() => [String])
  thumbnails(@Parent() parent: PlaylistEntity) {
    return this.playlistService.getThumbnails(parent.id);
  }

  @ResolveField(() => Number, {
    nullable: true,
  })
  @Roles('student')
  progress(
    @Parent() parent: PlaylistEntity,
    @CurrentStudent() student: StudentEntity,
  ) {
    if (!student) {
      return null;
    }
    return this.playlistService.getWeekPlaylistProgress(parent.id, student.id);
  }

  @ResolveField(() => PaginatedVideoModel)
  videos(@Parent() parent: PlaylistEntity, @Args() pagination: PaginationArgs) {
    return this.videoService.paginatedVideos(pagination, {
      playlistIdFilter: parent.id,
    });
  }

  @ResolveField(() => Boolean)
  isScratchSharedToOtherPlaylist(@Parent() parent: PlaylistEntity) {
    return this.playlistService.isScratchSharedToOtherPlaylist(parent.id);
  }
}
