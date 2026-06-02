import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common';
import { ExpensesService } from './expenses.service';
import { Expenses } from './expenses.entity';
import { ExpensesUpdateStatusDTO } from './dto/expenses-update-status.dto';
import { ListFilterDTO } from './dto/list-filter.dto';
import { PaginationResult } from './dto/pagination-result.dto';

@Controller('v1/expenses')
export class ExpensesController {
  constructor(private readonly service: ExpensesService) {}

  @Post()
  create(@Body() dto): Promise<Expenses> {
    return this.service.create(dto);
  }

  @Get()
  async list(@Query() dto: ListFilterDTO): Promise<PaginationResult<Expenses>> {
    return this.service.list(dto);
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
