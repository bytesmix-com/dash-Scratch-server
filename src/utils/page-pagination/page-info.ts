import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class PageInfo {
  @Field({
    description: '현재 가져온 개수',
  })
  countCurrent: number;

  @Field({
    description: '전체 개수',
  })
  countTotal: number;

  @Field({
    description: '현재 Page',
  })
  currentPage: number;

  @Field({
    description: '다음 페이지 유무',
  })
  hasNextPage: boolean;

  @Field({
    description: '이전 페이지 유무',
  })
  hasPreviousPage: boolean;
}
