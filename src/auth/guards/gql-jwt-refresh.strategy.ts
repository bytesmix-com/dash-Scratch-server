import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { add, isBefore } from 'date-fns';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AdminService } from 'src/admin/admin.service';
import { StudentService } from 'src/student/student.service';
import { UserType } from '../auth.enum';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh-token',
) {
  constructor(
    private readonly adminService: AdminService,
    private readonly studentService: StudentService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request) => {
          return request?.cookies?.strtoken;
        },
      ]),
      secretOrKey: process.env.JWT_REFRESH_TOKEN_SECRET,
      passReqToCallback: true,
    });
  }

  async validate(req, payload: any) {
    const refreshToken = req.cookies?.strtoken;
    let user;
    if (payload.userType === UserType.STUDENT) {
      user = await this.studentService.getStudentIfRefreshTokenMatches(
        refreshToken,
        payload.id,
      );
    } else {
      user = await this.adminService.getAdminIfRefreshTokenMatches(
        refreshToken,
        payload.id,
      );
    }

    const shouldReassignRefreshToken = isBefore(
      new Date(),
      add(new Date(payload.exp * 1000), { days: 3 }),
    );

    return { user, shouldReassignRefreshToken };
  }
}
