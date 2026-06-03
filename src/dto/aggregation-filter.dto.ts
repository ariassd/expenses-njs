import { Transform, Type } from "class-transformer";
import { IsNumber, IsOptional, IsString } from "class-validator";

export class AggregationFilterDTO {

  @IsOptional()
  @IsString()
  clientId?: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsString()
  currency?: string;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  year?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  month?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  day?: number;
}
