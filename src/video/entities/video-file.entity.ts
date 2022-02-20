import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { VideoEntity } from './video.entity';

@Entity()
export class VideoFileEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  url: string;

  @Column()
  fileName: string;

  @Column()
  videoId: number;

  @ManyToOne(() => VideoEntity, (video) => video.files, {
    onDelete: 'CASCADE',
    orphanedRowAction: 'delete',
  })
  video: VideoEntity;
}
