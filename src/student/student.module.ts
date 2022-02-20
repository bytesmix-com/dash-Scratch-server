import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DeleteStudentRequestEntity } from './entities/delete-student-request.entity';
import { StudentEntity } from './entities/student.entity';
import { DeleteStudentRequestResolver } from './resolvers/delete-student-request.resolver';
import { StudentResolver } from './resolvers/student.resolver';
import { StudentService } from './student.service';

@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([DeleteStudentRequestEntity, StudentEntity]),
  ],
  providers: [StudentResolver, StudentService, DeleteStudentRequestResolver],
  exports: [StudentService],
})
export class StudentModule {}
