import { SortOrder } from './pagination.dto';

export interface PaginationResult<T> {
  data: T[];
  page: number;
  limit: number;
  sort: SortOrder;
  totalItems: number;
}
