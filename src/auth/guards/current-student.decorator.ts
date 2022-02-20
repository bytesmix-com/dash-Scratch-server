import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { StudentEntity } from 'src/student/entities/student.entity';

export const CurrentStudent = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const ctx = GqlExecutionContext.create(context);
    if (ctx.getContext().req.user instanceof StudentEntity) {
      return ctx.getContext().req.user;
    }
    return null;
  },
);
