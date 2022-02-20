import { PlaylistEntity } from 'src/playlist/entities/playlist.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { VideoFileEntity } from './video-file.entity';
import { VideoProgressEntity } from './video-progress.entity';

@Entity()
export class VideoEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  video_url: string;

  @Column()
  video_title: string;

  @Column()
  video_createdAt: Date;

  @Column()
  video_channelName: string;

  @Column()
  video_lengthInSeconds: number;

  @Column()
  video_thumbnail: string;

  @Column()
  title: string;

  @Column({
    nullable: true,
  })
  description: string;

  @Column()
  isPublic: boolean;

  @Column({
    comment: '한 강의 목록 내에서 강의 순서 값 asc',
    default: 0,
  })
  sort: number;

  @Column({
    nullable: true,
  })
  tags: string;

  @Column({
    default: false,
  })
  shareScratchInRegularPlaylist: boolean;

  @Column({
    nullable: true,
    comment: '구분자 ,',
  })
  recommendWeeks: string;

  @Column()
  playlistId: number;

  @ManyToOne(() => PlaylistEntity, (playlist) => playlist.videos, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  playlist: PlaylistEntity;

  @OneToMany(() => VideoFileEntity, (file) => file.video, {
    cascade: true,
  })
  files: VideoFileEntity[];

  @OneToMany(() => VideoProgressEntity, (progress) => progress.video, {
    cascade: true,
  })
  progresses: VideoProgressEntity[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
