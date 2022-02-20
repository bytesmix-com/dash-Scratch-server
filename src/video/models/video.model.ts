import { Field, ObjectType } from '@nestjs/graphql';
import { RegularPlaylistModel } from 'src/playlist/models/regular-playlist.model';
import { Paginated } from 'src/utils/page-pagination';
import { FileModel } from './file.model';

@ObjectType()
export class VideoModel {
  @Field()
  id: number;

  @Field()
  video_url: string;

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

  @Field()
  title: string;

  @Field({
    nullable: true,
  })
  description: string;

  @Field()
  isPublic: boolean;

  @Field({
    nullable: true,
  })
  tags: string;

  @Field(() => [Number], {
    nullable: true,
    description: '추천 강의리스트에 속한 강의 일 경우, 추천 될 주 목록',
  })
  recommendWeeks: number[];

  @Field()
  shareScratchInRegularPlaylist: boolean;

  @Field(() => RegularPlaylistModel, {
    nullable: true,
  })
  playlist: RegularPlaylistModel;

  @Field(() => [FileModel], {
    defaultValue: [],
  })
  files: FileModel[];

  @Field({
    description: '한 강의 목록 내에서 강의 순서 값 asc',
  })
  sort: number;

  @Field({
    description: '한 강의 목록 내에서 강의 순서 값 asc',
  })
  orderInPlaylist: number;

  @Field({
    nullable: true,
    description: '학생 계정으로 호출시 진척도 내려옴',
  })
  progress?: number;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}

@ObjectType()
export class PaginatedVideoModel extends Paginated(VideoModel) {}
