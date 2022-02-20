import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class FileInput {
  @Field()
  url: string;

  @Field()
  fileName: string;
}
@InputType()
export class AddOrModifyVideoInput {
  @Field({
    nullable: true,
  })
  id?: number;

  @Field({
    nullable: true,
  })
  video_url?: string;

  @Field({
    nullable: true,
  })
  video_title?: string;

  @Field({
    nullable: true,
  })
  video_createdAt?: Date;

  @Field({
    nullable: true,
  })
  video_channelName?: string;

  @Field({
    nullable: true,
  })
  video_lengthInSeconds?: number;

  @Field({
    nullable: true,
  })
  video_thumbnail?: string;

  @Field()
  isRegularPlaylist: boolean;

  @Field({
    nullable: true,
  })
  title?: string;

  @Field(() => [Number], {
    nullable: true,
  })
  recommendWeeks: number[];

  @Field({
    defaultValue: false,
  })
  shareScratchInRegularPlaylist: boolean;

  @Field({
    nullable: true,
  })
  description?: string;

  @Field({
    nullable: true,
  })
  sort?: number;

  @Field({
    nullable: true,
  })
  isPublic?: boolean;

  @Field({
    nullable: true,
  })
  tags?: string;

  @Field({
    nullable: true,
  })
  playlistId?: number;

  @Field(() => [FileInput], {
    nullable: true,
    defaultValue: [],
  })
  files?: FileInput[];
}
