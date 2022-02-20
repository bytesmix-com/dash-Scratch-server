import { Field, ObjectType } from '@nestjs/graphql';
import { Paginated } from 'src/utils/page-pagination';
import { PaginatedVideoModel, VideoModel } from 'src/video/models/video.model';

@ObjectType()
export class RegularPlaylistModel {
  @Field()
  id: number;

  @Field()
  name: string;

  @Field()
  isPublic: boolean;

  @Field()
  week: number;

  @Field()
  description: string;

  @Field(() => [String])
  thumbnails: string[];

  @Field(() => Number, {
    description: '현재 주차의 학습률',
    nullable: true,
  })
  progress: number;

  @Field(() => PaginatedVideoModel)
  videos: PaginatedVideoModel;

  @Field({
    nullable: true,
  })
  shareScratchWithRegularPlaylistId?: number;

  @Field()
  isScratchSharedToOtherPlaylist: boolean;

  @Field()
  updatedAt: Date;

  @Field()
  createdAt: Date;
}

@ObjectType()
export class PaginatedRegularPlaylistModel extends Paginated(
  RegularPlaylistModel,
) {}
