import { StudentEntity } from 'src/student/entities/student.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { VideoEntity } from './video.entity';

@Entity()
export class VideoProgressEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  progress: number;

  @Column()
  studentId: number;

  @ManyToOne(() => StudentEntity, (student) => student.progresses, {
    onDelete: 'CASCADE',
  })
  student: StudentEntity;

  @Column()
  videoId: number;

  @ManyToOne(() => VideoEntity, (video) => video.progresses, {
    onDelete: 'CASCADE',
  })
  video: VideoEntity;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
