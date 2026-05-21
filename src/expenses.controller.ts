import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ExpensesService } from './expenses.service';
import { Expenses } from './expenses.entity';

@Controller('v1/expenses')
export class ExpensesController {
  constructor(private readonly service: ExpensesService) {}

  @Post()
  create(@Body() dto): Promise<Expenses> {
    return this.service.create(dto);
  }

  @Get()
  async list(): Promise<Expenses[]> {
    return this.service.list();
  }

  @Get(':id')
  async getOne(@Param('id') id: string): Promise<Expenses | null> {
    return this.service.getOne(id);
  }
}
