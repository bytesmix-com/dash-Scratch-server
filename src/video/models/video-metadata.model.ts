import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class VideoMetadata {
  @Field()
  video_link: string;

  @Field()
  video_title: string;

  @Field()
  video_createdAt: Date;

  @Field()
  video_channelName: string;

  @Field()
  video_lengthInSeconds: number;

  @Field({
    nullable: true,
  })
  video_thumbnail: string;
}
