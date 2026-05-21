import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { ExpensesService } from './expenses.service';
import { Expenses } from './expenses.entity';
import { ExpensesUpdateStatusDTO } from './dto/expenses-update-status.dto';

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

  @Put(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body() dto: ExpensesUpdateStatusDTO,
  ): Promise<Expenses | null> {
    return this.service.changeStatus(id, dto);
  }
}
