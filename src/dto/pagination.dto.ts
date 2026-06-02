import { IsBoolean, IsEnum, IsNumber, Min } from "class-validator";

export enum SortOrder {
  ASC = 'asc',
  DESC = 'desc',
}

export class PaginationDTO {
  @IsNumber()
  @Min(1)
  page: number = 1;

  @IsNumber()
  limit: number = 25;

  @IsEnum(SortOrder)
  sort: SortOrder = SortOrder.ASC;

  @IsBoolean()
  countTotal: boolean = true;
}
