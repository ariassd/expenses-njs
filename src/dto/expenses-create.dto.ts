import { Type } from 'class-transformer';
import { IsEnum, IsNumber, IsString, IsUUID, Min, MIN } from 'class-validator';

export enum Status {
  pending = 'pending',
  reviewed = 'reviewed',
  voided = 'voided',
}

export class ExpensesCreateDTO {
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  amount: number;

  @IsString()
  category: string;

  @IsString()
  description: string;

  @IsEnum(Status)
  status: Status;
}
