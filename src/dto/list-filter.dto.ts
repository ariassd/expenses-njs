import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsOptional, IsString } from 'class-validator';
import { PaginationDTO } from './pagination.dto';

export class ListFilterDTO {
  @ApiProperty({ required: false, description: 'Search term across multiple fields' })
  @IsString()
  @IsOptional()
  queryFilter?: string;

  @ApiProperty({ required: false, description: 'Filter by start date' })
  @IsDateString()
  @IsOptional()
  fromDate?: Date;

  @ApiProperty({ required: false, description: 'Filter by end date' })
  @IsDateString()
  @IsOptional()
  toDate?: Date;

  @ApiProperty({ type: PaginationDTO, required: false })
  @IsOptional()
  pagination: PaginationDTO = new PaginationDTO();
}
