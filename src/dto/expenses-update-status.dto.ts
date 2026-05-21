import { PickType } from '@nestjs/mapped-types';
import { ExpensesCreateDTO } from './expenses-create.dto';

export class ExpensesUpdateStatusDTO extends PickType(ExpensesCreateDTO, [
  'status',
] as const) {}
