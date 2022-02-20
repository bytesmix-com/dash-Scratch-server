import { Field, ObjectType } from '@nestjs/graphql';
import { Paginated } from 'src/utils/page-pagination';

@ObjectType()
export class StudentModel {
  @Field()
  id: number;

  @Field()
  studentNumber: string;

  @Field({
    nullable: true,
  })
  activatedAt: Date;

  @Field()
  createdAt: Date;
}

@ObjectType()
export class PaginatedStudentModel extends Paginated(StudentModel) {}
