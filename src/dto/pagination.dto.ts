import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsNumber, Min } from 'class-validator';

export enum SortOrder {
  ASC = 'asc',
  DESC = 'desc',
}

export class PaginationDTO {
  @ApiProperty({ description: 'Page number', example: 1, default: 1 })
  @IsNumber()
  @Min(1)
  page: number = 1;

  @ApiProperty({ description: 'Items per page', example: 25, default: 25 })
  @IsNumber()
  limit: number = 25;

  @ApiProperty({ description: 'Sort order', enum: SortOrder, default: SortOrder.ASC })
  @IsEnum(SortOrder)
  sort: SortOrder = SortOrder.ASC;

  @ApiProperty({ description: 'Whether to count total items', default: true })
  @IsBoolean()
  countTotal: boolean = true;
}
