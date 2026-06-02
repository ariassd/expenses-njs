import { PaginationDTO } from './pagination.dto';

export class ListFilterDTO {
  queryFilter?: string;
  pagination: PaginationDTO = new PaginationDTO();
}
