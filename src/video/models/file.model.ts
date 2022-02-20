import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class FileModel {
  @Field()
  id: number;

  @Field()
  url: string;

  @Field()
  fileName: string;
}
