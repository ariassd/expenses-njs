import { Type } from "class-transformer";
import { IsDateString, IsEnum, IsNumber, IsString, IsUUID, Min, MIN } from "class-validator";

export enum Status {
  pending = "pending",
  reviewed = "reviewed",
  voided = "voided"
}

export class ExpensesDTO {
  @IsUUID()
  id: string; // UUID

  @IsNumber()
  @Type(() => Number)
  @Min(0)
  amount: number; // Greater than 0

  @IsString()
  category: string;

  @IsString()
  description: string;

  @IsEnum(Status)
  status: Status;

  @IsDateString()
  date: Date; // Cannot be in the future
}
