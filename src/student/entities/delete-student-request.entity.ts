import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { StudentEntity } from './student.entity';

@Entity()
export class DeleteStudentRequestEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    comment: '1: 대기중, 2: 거절, 3: 승인',
    default: 1,
  })
  status: number;

  @Column()
  studentNumber: string;

  @Column({
    nullable: true,
  })
  studentId: number;

  @ManyToOne(() => StudentEntity, (student) => student.deleteStudentRequests, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  student?: StudentEntity;

  @UpdateDateColumn()
  updatedAt: Date;

  @CreateDateColumn()
  createdAt: Date;
}
