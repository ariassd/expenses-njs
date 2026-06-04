import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class AggregationFilterDTO {
  @ApiProperty({ required: false, description: 'Filter by client ID' })
  @IsOptional()
  @IsString()
  clientId?: string;

  @ApiProperty({ required: false, description: 'Filter by category' })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiProperty({ required: false, description: 'Filter by currency', example: 'USD' })
  @IsOptional()
  @IsString()
  currency?: string;

  @ApiProperty({ required: false, description: 'Filter by year', example: 2026 })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  year?: number;

  @ApiProperty({ required: false, description: 'Filter by month (1-12)', example: 6 })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  month?: number;

  @ApiProperty({ required: false, description: 'Filter by day', example: 3 })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  day?: number;
}
