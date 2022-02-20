import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { UserType } from '../auth.enum';
import { StudentService } from 'src/student/student.service';
import { AdminService } from 'src/admin/admin.service';

@Injectable()
export class GqlJwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly studentService: StudentService,
    private readonly adminService: AdminService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        ExtractJwt.fromAuthHeaderAsBearerToken(),
        (request) => {
          return request?.cookies?.statoken;
        },
      ]),
      secretOrKey: process.env.JWT_ACCESS_TOKEN_SECRET,
    });
  }

  async validate(payload: any) {
    if (payload.userType === UserType.STUDENT) {
      return await this.studentService.getById(payload.id);
    } else {
      return await this.adminService.adminById(payload.id);
    }
  }
}
