import { VideoEntity } from 'src/video/entities/video.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class PlaylistEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    comment: '정규 또는 추천',
    default: '정규',
  })
  playlistType: string;

  @Column()
  name: string;

  @Column()
  isPublic: boolean;

  @Column({
    nullable: true,
  })
  week?: number;

  @Column({
    nullable: true,
  })
  shareScratchWithRegularPlaylistId?: number;

  @Column({
    type: 'text',
    nullable: true,
  })
  description: string;

  @OneToMany(() => VideoEntity, (video) => video.playlist, {
    cascade: true,
  })
  videos: VideoEntity[];

  @UpdateDateColumn()
  updatedAt: Date;

  @CreateDateColumn()
  createdAt: Date;
}
