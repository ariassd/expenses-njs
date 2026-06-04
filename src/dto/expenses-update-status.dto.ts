import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { Status } from './expenses-create.dto';

export class ExpensesUpdateStatusDTO {
  @ApiProperty({ description: 'Expense status', enum: Status, default: Status.pending })
  @IsEnum(Status)
  status: Status;
}
