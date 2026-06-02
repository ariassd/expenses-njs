export enum SortOrder {
  ASC = 'asc',
  DESC = 'desc',
}

export class PaginationDTO {
  page: number = 1;
  limit: number = 25;
  sort: SortOrder = SortOrder.ASC;
}
