import {
  Args,
  Mutation,
  Resolver,
  Query,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { VideoMetadata } from './models/video-metadata.model';
import * as _ from 'lodash';
import { AddOrModifyVideoInput } from './video.input';
import { PaginatedVideoModel, VideoModel } from './models/video.model';
import { VoidResolver } from 'graphql-scalars';
import { PaginationArgs } from 'src/utils/page-pagination';
import { VideoService } from './video.service';
import { UseGuards } from '@nestjs/common';
import { GqlJwtAuthGuard } from 'src/auth/guards/gql-jwt.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/guards/roles.decorator';
import { RegularPlaylistModel } from 'src/playlist/models/regular-playlist.model';
import { VideoEntity } from './entities/video.entity';
import { CurrentStudent } from 'src/auth/guards/current-student.decorator';
import { StudentEntity } from 'src/student/entities/student.entity';
import { FileModel } from './models/file.model';
@Resolver(() => VideoModel)
@UseGuards(GqlJwtAuthGuard, RolesGuard)
export class VideoResolver {
  constructor(private readonly videoService: VideoService) {}

  @Mutation(() => VideoMetadata)
  @Roles('admin')
  async scrapeYoutubeVideoLink(@Args('youtubeUrl') youtubeUrl: string) {
    return await this.videoService.scrapYoutubeVideoLink(youtubeUrl);
  }

  @Query(() => PaginatedVideoModel, {
    description: '콘텐츠 리스트',
  })
  @Roles('admin')
  async paginatedVideos(
    @Args() pagination: PaginationArgs,
    @Args('titleFilter', {
      nullable: true,
    })
    titleFilter?: string,
    @Args('playlistFilter', {
      nullable: true,
    })
    playlistIdFilter?: number,
  ) {
    return await this.videoService.paginatedVideos(pagination, {
      titleFilter,
      playlistIdFilter,
    });
  }

  @Query(() => [VideoModel], {
    description: '플레이리스트의 콘텐츠 리스트 (페이지네이션 없음)',
  })
  @Roles('admin')
  videosByPlaylist(@Args('playlistId') playlistId: number) {
    return this.videoService.videosByPlaylist(playlistId);
  }

  @Query(() => VideoModel, {
    description: '비디오 단일 조회',
  })
  video(@Args('id') id: number) {
    return this.videoService.getVideoById(id);
  }

  @Mutation(() => VideoModel, {
    description: 'null 로 들어온 값은 업데이트 하지 않습니다',
  })
  @Roles('admin')
  addOrModifyVideo(@Args('input') input: AddOrModifyVideoInput) {
    return this.videoService.addOrModifyVideo(input);
  }

  @Mutation(() => VoidResolver, {
    nullable: true,
  })
  @Roles('admin')
  deleteVideo(@Args('ids', { type: () => [Number] }) ids: number[]) {
    return this.videoService.deleteVideo(ids);
  }

  @Mutation(() => VoidResolver, {
    nullable: true,
    description: '한 비디오의 진척도를 기록합니다',
  })
  @Roles('student')
  markVideoProgress(
    @CurrentStudent() student: StudentEntity,
    @Args('videoId', { type: () => Number }) videoId: number,
    @Args('progress', { type: () => Number }) progress: number,
  ) {
    return this.videoService.markVideoProgress(student.id, videoId, progress);
  }

  @ResolveField(() => RegularPlaylistModel)
  async playlist(@Parent() parent: VideoEntity) {
    const video = await this.videoService.getVideoById(parent.id, ['playlist']);
    if (video.playlist.playlistType == '정규') {
      return video.playlist;
    }
    return null;
  }

  @ResolveField(() => Number, {
    nullable: true,
  })
  @Roles('student')
  async progress(
    @CurrentStudent() student: StudentEntity,
    @Parent() parent: VideoEntity,
  ) {
    return await this.videoService.getProgress(student.id, parent.id);
  }

  @ResolveField(() => [FileModel], {
    nullable: true,
  })
  files(@Parent() parent: VideoEntity) {
    return this.videoService.getFiles(parent.id);
  }

  @Query(() => VideoModel, {
    nullable: true,
    description: '마지막으로 학습한 영상',
  })
  @Roles('student')
  lastAccessedVideo(@CurrentStudent() student: StudentEntity) {
    return this.videoService.getLastAccessedVideo(student.id);
  }

  @Query(() => Number, {
    nullable: true,
    description: '전체 학습률',
  })
  @Roles('student')
  totalAverageProgress(@CurrentStudent() student: StudentEntity) {
    return this.videoService.getTotalAverageProgress(student.id);
  }

  @ResolveField(() => Number, {
    description: '강의 목록 내에서의 순서',
  })
  orderInPlaylist(@Parent() parent: VideoEntity) {
    return this.videoService.getOrderInPlaylistByVideoId(parent.id);
  }

  @ResolveField(() => [Number], {
    nullable: true,
  })
  recommendWeeks(@Parent() parent: VideoEntity) {
    const splitted = (parent.recommendWeeks ?? ',').split(',');
    return splitted
      .filter((i) => Number.isInteger(parseInt(i)))
      .map((i) => parseInt(i));
  }
}
