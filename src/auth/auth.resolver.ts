import { PreconditionFailedException, UseGuards } from '@nestjs/common';
import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { JwtService } from '@nestjs/jwt';
import { VoidResolver } from 'graphql-scalars';
import { AdminEntity } from 'src/admin/admin.entity';
import { AdminService } from 'src/admin/admin.service';
import { StudentService } from 'src/student/student.service';

import { UserType } from './auth.enum';
import { LoginInput } from './auth.input';
import { JwtRefreshGuard } from './guards/gql-jwt-refresh.guard';

@Resolver()
export class AuthResolver {
  constructor(
    private readonly jwtService: JwtService,
    private readonly studentService: StudentService,
    private readonly adminService: AdminService,
  ) {}

  @Mutation(() => VoidResolver, {
    nullable: true,
  })
  async login(@Args('input') input: LoginInput, @Context() context) {
    let id;
    if (input.userType === UserType.STUDENT) {
      const student = await this.studentService.verifyStudent(
        input.loginId,
        input.password,
      );
      if (!student) {
        return new PreconditionFailedException('계정정보가 올바르지 않습니다');
      }
      id = student.id;
      await this.studentService.setStudentActivated(id);
    } else {
      const admin = await this.adminService.verifyAdmin(
        input.loginId,
        input.password,
      );
      if (!admin) {
        return new PreconditionFailedException('계정정보가 올바르지 않습니다');
      }
      id = admin.id;
    }

    const accessToken = this.jwtService.sign(
      {
        userType: input.userType,
        id: id,
      },
      {
        secret: process.env.JWT_ACCESS_TOKEN_SECRET,
        expiresIn: 60 * 60 + 's',
      },
    );

    const refreshToken = this.jwtService.sign(
      {
        userType: input.userType,
        id: id,
      },
      {
        secret: process.env.JWT_ACCESS_TOKEN_SECRET,
        expiresIn: 60 * 60 * 24 * 7 + 's',
      },
    );

    if (input.userType == UserType.ADMIN) {
      await this.adminService.setCurrentRefreshToken(refreshToken, id);
    } else {
      await this.studentService.setCurrentRefreshToken(refreshToken, id);
    }

    context.res
      .cookie('statoken', accessToken, {
        domain: process.env.COOKIE_BASE_DOMAIN,
        path: '/',
        httpOnly: true,
        maxAge: Number(60 * 60) * 1000,
        sameSite: 'none',
        secure: true,
      })
      .cookie('strtoken', refreshToken, {
        domain: process.env.COOKIE_BASE_DOMAIN,
        path: '/',
        httpOnly: true,
        maxAge: Number(60 * 60 * 24 * 7) * 1000,
        sameSite: 'none',
        secure: true,
      });
    return;
  }

  @Mutation(() => Boolean)
  @UseGuards(JwtRefreshGuard)
  async refresh(@Context() context) {
    const { user, shouldReassignRefreshToken } = context.req.refresh;

    const userType =
      user instanceof AdminEntity ? UserType.ADMIN : UserType.STUDENT;

    if (user) {
      const accessToken = this.jwtService.sign(
        {
          userType: userType,
          id: user.id,
        },
        {
          secret: process.env.JWT_ACCESS_TOKEN_SECRET,
          expiresIn: 60 * 60 + 's',
        },
      );

      if (shouldReassignRefreshToken) {
        const refreshToken = this.jwtService.sign(
          {
            userType: userType,
            id: user.id,
          },
          {
            secret: process.env.JWT_ACCESS_TOKEN_SECRET,
            expiresIn: 60 * 60 * 24 * 7 + 's',
          },
        );

        if (user.userType == UserType.ADMIN) {
          await this.adminService.setCurrentRefreshToken(refreshToken, user.id);
        } else {
          await this.studentService.setCurrentRefreshToken(
            refreshToken,
            user.id,
          );
        }

        context.res
          .cookie('statoken', accessToken, {
            domain: process.env.COOKIE_BASE_DOMAIN,
            path: '/',
            httpOnly: true,
            maxAge: Number(60 * 60) * 1000,
            sameSite: 'none',
            secure: true,
          })
          .cookie('strtoken', refreshToken, {
            domain: process.env.COOKIE_BASE_DOMAIN,
            path: '/',
            httpOnly: true,
            maxAge: Number(60 * 60 * 24 * 7) * 1000,
            sameSite: 'none',
            secure: true,
          });
      } else {
        context.res.cookie('statoken', accessToken, {
          domain: process.env.COOKIE_BASE_DOMAIN,
          path: '/',
          httpOnly: true,
          maxAge: Number(60 * 60) * 1000,
          sameSite: 'none',
          secure: true,
        });
      }

      return true;
    } else {
      return false;
    }
  }

  @Mutation(() => VoidResolver, {
    nullable: true,
  })
  async logout(@Context() context) {
    context.res
      .cookie('statoken', '', {
        domain: process.env.COOKIE_BASE_DOMAIN,
        path: '/',
        httpOnly: true,
        maxAge: 0,
        sameSite: 'none',
        secure: true,
      })
      .cookie('strtoken', '', {
        domain: process.env.COOKIE_BASE_DOMAIN,
        path: '/',
        httpOnly: true,
        maxAge: 0,
        sameSite: 'none',
        secure: true,
      });
    return;
  }

  // @Mutation(() => VoidResolver, {
  //   nullable: true,
  // })
  // @Roles('student')
  // async requestAccountRemoval() {
  //   throw new PreconditionFailedException('already-requested');
  // }
}
