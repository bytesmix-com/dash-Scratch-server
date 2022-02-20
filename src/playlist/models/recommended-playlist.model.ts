import { Field, ObjectType } from '@nestjs/graphql';
import { PaginatedVideoModel } from 'src/video/models/video.model';

@ObjectType()
export class RecommendedPlaylistModel {
  @Field()
  id: number;

  @Field()
  name: string;

  @Field(() => [String])
  thumbnails: string[];

  @Field(() => PaginatedVideoModel)
  videos: PaginatedVideoModel;

  @Field()
  updatedAt: Date;

  @Field()
  createdAt: Date;
}
