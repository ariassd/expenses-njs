import { IsOptional, IsString } from 'class-validator';
import { PaginationDTO } from './pagination.dto';

export class ListFilterDTO {

  @IsString()
  queryFilter?: string;

  @IsOptional()
  pagination: PaginationDTO = new PaginationDTO();
}
