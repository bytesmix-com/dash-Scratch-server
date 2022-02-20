import { ArgsType, Int, Field } from '@nestjs/graphql';

@ArgsType()
export class PaginationArgs {
  @Field(() => Int, {
    nullable: true,
    description: '가져올 개수 (기본값 25개)',
    defaultValue: 25,
  })
  size: number;

  @Field(() => Int, {
    nullable: true,
    defaultValue: 1,
    description: '가져올 페이지 (기본 1 페이지)',
  })
  page: number;
}
