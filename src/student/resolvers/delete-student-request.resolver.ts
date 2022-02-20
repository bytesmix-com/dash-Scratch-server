import { UseGuards } from '@nestjs/common';
import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { VoidResolver } from 'graphql-scalars';
import { CurrentStudent } from 'src/auth/guards/current-student.decorator';
import { GqlJwtAuthGuard } from 'src/auth/guards/gql-jwt.guard';
import { Roles } from 'src/auth/guards/roles.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { PaginationArgs } from 'src/utils/page-pagination';
import { DeleteStudentRequestEntity } from '../entities/delete-student-request.entity';
import { StudentEntity } from '../entities/student.entity';
import {
  DeleteStudentRequestModel,
  PaginatedDeleteStudentRequestModel,
} from '../models/delete-student-request.model';
import { PaginatedStudentModel, StudentModel } from '../models/student.model';
import { StudentService } from '../student.service';

@Resolver(() => DeleteStudentRequestModel)
@UseGuards(GqlJwtAuthGuard, RolesGuard)
export class DeleteStudentRequestResolver {
  constructor(private readonly studentService: StudentService) {}

  @Query(() => PaginatedDeleteStudentRequestModel, {
    description: '계정 삭제 요청 리스트',
  })
  @Roles('admin')
  paginatedDeleteStudentRequests(
    @Args() pagination: PaginationArgs,
    @Args('idFilter', {
      nullable: true,
    })
    studentNumberFilter: string,
    @Args('statusFilter', {
      nullable: true,
      description: '처리전: 1, 처리후: 2',
    })
    statusFilter: number,
  ) {
    return this.studentService.paginatedDeleteStudentRequests(pagination, {
      studentNumberFilter,
      statusFilter,
    });
  }

  @Mutation(() => VoidResolver, {
    nullable: true,
    description: '계정 삭제 요청',
  })
  @Roles('student')
  addDeleteStudentRequest(@CurrentStudent() student: StudentEntity) {
    return this.studentService.addDeleteStudentRequest(student.id);
  }

  @Mutation(() => VoidResolver, {
    nullable: true,
    description: '계정 삭제 요청 처리',
  })
  @Roles('admin')
  processDeleteStudentRequests(
    @Args('ids', { type: () => [Number] }) ids: number[],
    @Args('status') status: number,
  ) {
    return this.studentService.processDeleteStudentRequests(ids, status);
  }

  @Mutation(() => VoidResolver, {
    nullable: true,
    description: '학생 계정 삭제',
  })
  @Roles('admin')
  deleteStudents(
    @Args('studentIds', { type: () => [Number] }) studentIds: number[],
  ) {
    return this.studentService.deleteStudents(studentIds);
  }

  @ResolveField(() => StudentModel, {
    nullable: true,
  })
  student(@Parent() parent: DeleteStudentRequestEntity) {
    return this.studentService.getStudentFromDeleteStudentRequest(parent.id);
  }
}
