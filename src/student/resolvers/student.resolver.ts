import { PreconditionFailedException, UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { VoidResolver } from 'graphql-scalars';
import { CurrentStudent } from 'src/auth/guards/current-student.decorator';
import { GqlJwtAuthGuard } from 'src/auth/guards/gql-jwt.guard';
import { Roles } from 'src/auth/guards/roles.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { PaginationArgs } from 'src/utils/page-pagination';
import { StudentEntity } from '../entities/student.entity';
import { PaginatedDeleteStudentRequestModel } from '../models/delete-student-request.model';
import { PaginatedStudentModel, StudentModel } from '../models/student.model';
import { ChangePasswordInput } from '../student.input';
import { StudentService } from '../student.service';

@Resolver(() => StudentModel)
@UseGuards(GqlJwtAuthGuard, RolesGuard)
export class StudentResolver {
  constructor(private readonly studentService: StudentService) {}

  @Mutation(() => Number, {
    description: '학생 추가하기',
  })
  @Roles('admin')
  addStudentIds(
    @Args('studentNumbers', { type: () => [String] }) studentNumbers: string[],
  ) {
    // 학번으로 학생 추가하기
    return this.studentService.addStudentNumbers(studentNumbers);
  }

  @Query(() => PaginatedStudentModel, {
    description: '학생 리스트',
  })
  @Roles('admin')
  paginatedStudents(
    @Args() pagination: PaginationArgs,
    @Args('idFilter', {
      nullable: true,
    })
    studentNumberFilter: string,
  ) {
    return this.studentService.paginatedStudents(pagination, {
      studentNumberFilter,
    });
  }

  @Mutation(() => VoidResolver, {
    nullable: true,
    description: '비밀번호 변경하기',
  })
  @Roles('student')
  async changeStudentPassword(
    @Args('input') input: ChangePasswordInput,
    @CurrentStudent() student: StudentEntity,
  ) {
    return this.studentService.changeStudentPassword(input, student.id);
  }

  @Query(() => StudentModel)
  @Roles('student')
  async studentMe(@CurrentStudent() student: StudentEntity) {
    return this.studentService.getById(student.id);
  }
}
