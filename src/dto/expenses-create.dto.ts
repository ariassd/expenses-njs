import { Type } from 'class-transformer';
import { IsEnum, IsIn, IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';
export enum Status {
  pending = 'pending',
  reviewed = 'reviewed',
  voided = 'voided',
}

const CURRENCIES = process.env.CURRENCIES?.split(",") || ["USD"];

export class ExpensesCreateDTO {
  @IsString()
  clientId: string;

  @IsNumber()
  @Type(() => Number)
  @Min(0)
  amount: number;

  @IsString()
  @IsNotEmpty()
  @IsIn(CURRENCIES, { message: 'Invalid ISO 4217 currency code' })
  currency: string;

  @IsString()
  category: string;

  @IsString()
  description: string;

  @IsEnum(Status)
  status: Status;
}
