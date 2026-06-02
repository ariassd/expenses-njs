import { IsDateString, IsOptional, IsString } from 'class-validator';
import { PaginationDTO } from './pagination.dto';

export class ListFilterDTO {

  @IsString()
  @IsOptional()
  queryFilter?: string;

  @IsDateString()
  @IsOptional()
  fromDate: Date | undefined;

  @IsDateString()
  @IsOptional()
  toDate: Date | undefined;

  @IsOptional()
  pagination: PaginationDTO = new PaginationDTO();
}
