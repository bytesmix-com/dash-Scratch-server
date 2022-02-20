import { PageInfo } from './page-info';

import { SelectQueryBuilder, MoreThan, LessThan } from 'typeorm';
import { PaginationArgs } from './pagination.args';
import { of } from 'rxjs';

export { PageInfo } from './page-info';
export { Paginated } from './paginated';
export { PaginationArgs } from './pagination.args';
/**
 * Based on https://gist.github.com/VojtaSim/6b03466f1964a6c81a3dbf1f8cec8d5c
 */
export async function paginate<T>(
  query: SelectQueryBuilder<T>,
  paginationArgs: PaginationArgs,
  order: 'DESC' | 'ASC' = 'DESC',
  cursorColumn = 'id',
  defaultLimit = 25,
  preventDefaultOrdering = false,
): Promise<any> {
  if (!preventDefaultOrdering) {
    query.expressionMap.orderBys = {
      ...(query.expressionMap.orderBys || {}),
      [cursorColumn]: order,
    };
  }

  if (paginationArgs.page === null) {
    paginationArgs.page = 1;
  }

  const totalCountQuery = query.clone();

  paginationArgs.size = paginationArgs.size || defaultLimit;

  query.skip(Math.max((paginationArgs.page - 1) * paginationArgs.size, 0));
  query.take(paginationArgs.size);

  const result = await query.getMany();

  const pageInfo = new PageInfo();
  pageInfo.countCurrent = result.length;
  pageInfo.countTotal = await totalCountQuery.getCount();
  pageInfo.hasNextPage =
    Math.max((paginationArgs.page - 1) * paginationArgs.size, 0) +
      pageInfo.countCurrent <
    pageInfo.countTotal;

  pageInfo.hasPreviousPage = Math.max(paginationArgs.page, 1) != 1;
  pageInfo.currentPage = Math.max(paginationArgs.page, 1);

  return { nodes: result, pageInfo };
}
