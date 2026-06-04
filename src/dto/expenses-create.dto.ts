import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsIn, IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export enum Status {
  pending = 'pending',
  reviewed = 'reviewed',
  voided = 'voided',
}

const CURRENCIES = process.env.CURRENCIES?.split(',') || ['USD'];

export class ExpensesCreateDTO {
  @ApiProperty({ description: 'Client identifier (UUID, MongoID, or other string identifier)' })
  @IsString()
  clientId: string;

  @ApiProperty({ description: 'Expense amount', example: 100.5 })
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  amount: number;

  @ApiProperty({ description: 'ISO 4217 currency code', example: 'USD' })
  @IsString()
  @IsNotEmpty()
  @IsIn(CURRENCIES, { message: 'Invalid ISO 4217 currency code' })
  currency: string;

  @ApiProperty({ description: 'Expense category', example: 'Food' })
  @IsString()
  category: string;

  @ApiProperty({ description: 'Expense description', example: 'Lunch at restaurant' })
  @IsString()
  description: string;

  @ApiProperty({ description: 'Expense status', enum: Status, default: Status.pending })
  @IsEnum(Status)
  status: Status;
}
