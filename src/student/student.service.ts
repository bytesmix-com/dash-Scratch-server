import { Injectable, PreconditionFailedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Like, Not, Repository } from 'typeorm';
import { DeleteStudentRequestEntity } from './entities/delete-student-request.entity';
import { StudentEntity } from './entities/student.entity';
import * as crypto from 'crypto';
import { paginate, PaginationArgs } from 'src/utils/page-pagination';
import { ChangePasswordInput } from './student.input';

@Injectable()
export class StudentService {
  constructor(
    @InjectRepository(StudentEntity)
    private readonly studentRepository: Repository<StudentEntity>,
    @InjectRepository(DeleteStudentRequestEntity)
    private readonly deleteStudentRequestRepository: Repository<DeleteStudentRequestEntity>,
  ) {}

  async getById(id: number) {
    return this.studentRepository.findOne(id);
  }

  async setStudentActivated(id: number) {
    if (!(await this.studentRepository.findOne(id)).activatedAt) {
      await this.studentRepository.update(id, {
        activatedAt: new Date(),
      });
    }
  }

  async addStudentNumbers(numbers: string[]) {
    let addedCount = 0;
    await Promise.all(
      numbers.map(async (number) => {
        if (
          !(await this.studentRepository.findOne({ studentNumber: number }))
        ) {
          addedCount++;
          await this.studentRepository.save({
            studentNumber: number,
            password: crypto
              .createHash('sha512')
              .update(number)
              .digest('base64'),
          });
        }
      }),
    );
    return addedCount;
  }

  async changeStudentPassword(input: ChangePasswordInput, studentId: number) {
    const student = await this.studentRepository.findOne(studentId);
    if (
      student.password ===
      crypto
        .createHash('sha512')
        .update(input.previousPassword)
        .digest('base64')
    ) {
      student.password = crypto
        .createHash('sha512')
        .update(input.newPassword)
        .digest('base64');
    } else {
      throw new PreconditionFailedException(
        '기존 비밀번호가 일치하지 않습니다. ',
      );
    }

    await this.studentRepository.save(student);
  }

  async setCurrentRefreshToken(refreshToken: string, id: string) {
    const currentHashedRefreshToken = await crypto
      .createHash('sha512')
      .update(refreshToken)
      .digest('base64');
    await this.studentRepository.update(id, { currentHashedRefreshToken });
  }

  async getStudentIfRefreshTokenMatches(
    refreshToken: string,
    studentId: number,
  ) {
    const user = await this.getById(studentId);

    const isRefreshTokenMatching =
      crypto.createHash('sha512').update(refreshToken).digest('base64') ===
      user.currentHashedRefreshToken;

    if (isRefreshTokenMatching) {
      return user;
    } else {
      throw new PreconditionFailedException('Refresh token does not match');
    }
  }

  async verifyStudent(studentNumber: string, password: string) {
    return await this.studentRepository.findOne({
      studentNumber,
      password: crypto.createHash('sha512').update(password).digest('base64'),
    });
  }

  async paginatedStudents(
    pagination: PaginationArgs,
    options?: { studentNumberFilter?: string },
  ) {
    const query = this.studentRepository.createQueryBuilder();

    if (options?.studentNumberFilter) {
      query.andWhere({
        studentNumber: Like(`%${options.studentNumberFilter}%`),
      });
    }

    return paginate(query, pagination);
  }

  async paginatedDeleteStudentRequests(
    pagination: PaginationArgs,
    options?: {
      studentNumberFilter?: string;
      statusFilter?: number;
    },
  ) {
    const query = this.deleteStudentRequestRepository.createQueryBuilder('dsr');

    if (options?.studentNumberFilter) {
      query.andWhere(
        `dsr.studentNumber like '%${options.studentNumberFilter}%'`,
      );
    }

    if (options?.statusFilter) {
      if (options.statusFilter === 1) {
        query.andWhere({
          status: 1,
        });
      } else {
        query.andWhere({
          status: Not(1),
        });
      }
    }

    return paginate(query, pagination, 'DESC', 'dsr.id', undefined);
  }

  async getStudentFromDeleteStudentRequest(id: number) {
    const request = await this.deleteStudentRequestRepository.findOne({
      where: { id: id },
      relations: ['student'],
    });
    return request.student;
  }

  async processDeleteStudentRequests(ids: number[], status: number) {
    const requests = await this.deleteStudentRequestRepository.find({
      where: { id: In(ids) },
      relations: ['student'],
    });

    await this.deleteStudentRequestRepository.update(
      {
        id: In(requests.map((req) => req.id)),
      },
      { status },
    );

    if (status === 3) {
      await this.deleteStudents(requests.map((req) => req.student.id));
    }
  }

  async deleteStudents(studentIds: number[]) {
    await this.studentRepository.delete({
      id: In(studentIds),
    });
  }

  async addDeleteStudentRequest(studentId: number) {
    const preexisting = await this.deleteStudentRequestRepository.findOne({
      student: {
        id: studentId,
      },
      status: 1,
    });
    if (preexisting) {
      throw new PreconditionFailedException('이미 전달된 요청이 있습니다');
    }
    const student = await this.studentRepository.findOne(studentId);
    await this.deleteStudentRequestRepository.save(
      this.deleteStudentRequestRepository.create({
        studentNumber: student.studentNumber,
        studentId: studentId,
      }),
    );
  }
}
