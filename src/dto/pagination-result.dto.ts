import { ApiProperty } from '@nestjs/swagger';
import { SortOrder } from './pagination.dto';

export class PaginationResult<T> {
  @ApiProperty({ description: 'List of items', isArray: true })
  data: T[];

  @ApiProperty({ description: 'Current page number' })
  page: number;

  @ApiProperty({ description: 'Items per page' })
  limit: number;

  @ApiProperty({ description: 'Sort order', enum: SortOrder })
  sort: SortOrder;

  @ApiProperty({ description: 'Total number of items' })
  totalItems: number;
}
