import { Field, InputType } from '@nestjs/graphql';
import { CreateDateColumn } from 'typeorm';

@InputType()
export class AddOrModifyRegularPlaylistInput {
  @Field({
    nullable: true,
  })
  id: number;

  @Field()
  name: string;

  @Field()
  isPublic: boolean;

  @Field()
  week: number;

  @Field({
    nullable: true,
  })
  shareScratchWithRegularPlaylistId?: number;

  @Field({
    nullable: true,
  })
  description: string;
}

@InputType()
export class RecommendedPlaylistVideosFilterInput {
  @Field()
  week: number;
}
