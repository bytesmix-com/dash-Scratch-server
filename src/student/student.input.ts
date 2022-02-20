import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class ChangePasswordInput {
  @Field()
  previousPassword: string;

  @Field()
  newPassword: string;
}
