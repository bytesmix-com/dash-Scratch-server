import { Field, ObjectType } from '@nestjs/graphql';
import { Paginated } from 'src/utils/page-pagination';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { StudentModel } from './student.model';

@ObjectType()
export class DeleteStudentRequestModel {
  @Field()
  id: number;

  @Field({
    description: '1: 대기중, 2: 거절, 3: 승인',
  })
  status: number;

  @Field()
  studentNumber: string;

  @Field(() => StudentModel, {
    nullable: true,
  })
  student: StudentModel;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}

@ObjectType()
export class PaginatedDeleteStudentRequestModel extends Paginated(
  DeleteStudentRequestModel,
) {}
