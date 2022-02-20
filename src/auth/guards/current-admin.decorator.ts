import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AdminEntity } from 'src/admin/admin.entity';

export const CurrentAdmin = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const ctx = GqlExecutionContext.create(context);
    if (ctx.getContext().req.user instanceof AdminEntity) {
      return ctx.getContext().req.user;
    }
    return null;
  },
);
