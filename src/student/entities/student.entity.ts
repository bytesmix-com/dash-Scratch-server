import { VideoProgressEntity } from 'src/video/entities/video-progress.entity';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { DeleteStudentRequestModel } from '../models/delete-student-request.model';
import { DeleteStudentRequestEntity } from './delete-student-request.entity';

@Entity()
export class StudentEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  studentNumber: string;

  @OneToMany(() => DeleteStudentRequestEntity, (request) => request.student, {
    cascade: true,
  })
  deleteStudentRequests: DeleteStudentRequestEntity[];

  @Column()
  password: string;

  @Column({
    nullable: true,
  })
  currentHashedRefreshToken: string;

  @Column({
    nullable: true,
    comment: '활동 시작일',
  })
  activatedAt: Date;

  @OneToMany(() => VideoProgressEntity, (progress) => progress.student, {
    cascade: true,
  })
  progresses: VideoProgressEntity[];

  @CreateDateColumn()
  createdAt: Date;
}
