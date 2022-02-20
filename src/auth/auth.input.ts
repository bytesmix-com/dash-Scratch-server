import { Field, InputType } from '@nestjs/graphql';
import { UserType } from './auth.enum';

@InputType()
export class LoginInput {
  @Field()
  loginId: string;

  @Field()
  password: string;

  @Field(() => UserType)
  userType: UserType;
}
