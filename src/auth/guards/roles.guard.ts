import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AdminEntity } from 'src/admin/admin.entity';
import { StudentEntity } from 'src/student/entities/student.entity';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!roles) {
      return true;
    }

    const user = context.getArgs()[2].req.user;

    if (roles.includes('admin')) {
      if (user instanceof AdminEntity) {
        return true;
      } else {
        return false;
      }
    } else if (roles.includes('student')) {
      if (user instanceof StudentEntity) {
        return true;
      } else {
        return false;
      }
    }

    return true;
  }
}
