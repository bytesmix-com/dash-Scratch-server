import { registerEnumType } from '@nestjs/graphql';

export enum UserType {
  ADMIN = 'ADMIN',
  STUDENT = 'STUDENT',
}

registerEnumType(UserType, { name: 'UserType' });
