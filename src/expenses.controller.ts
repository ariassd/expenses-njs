import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { ExpensesService } from './expenses.service';
import { Expenses } from './expenses.entity';
import { ExpensesAggregation } from './expenses-aggregation.entity';
import { ExpensesUpdateStatusDTO } from './dto/expenses-update-status.dto';
import { ListFilterDTO } from './dto/list-filter.dto';
import { PaginationResult } from './dto/pagination-result.dto';
import { ExpensesCreateDTO } from './dto/expenses-create.dto';
import { AggregationFilterDTO } from './dto/aggregation-filter.dto';

@ApiTags('expenses')
@Controller('v1/expenses')
export class ExpensesController {
  constructor(private readonly service: ExpensesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new expense' })
  @ApiBody({ type: ExpensesCreateDTO })
  @ApiResponse({ status: 201, description: 'Expense created', type: Expenses })
  @ApiResponse({ status: 409, description: 'Conflict - already exists' })
  create(@Body() dto: ExpensesCreateDTO): Promise<Expenses> {
    return this.service.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'List expenses with pagination and filtering' })
  @ApiQuery({ type: ListFilterDTO })
  @ApiResponse({
    status: 200,
    description: 'Paginated list of expenses',
    type: PaginationResult<Expenses>,
  })
  async list(@Query() dto: ListFilterDTO): Promise<PaginationResult<Expenses>> {
    return this.service.list(dto);
  }

  @Get('aggregations')
  @ApiOperation({ summary: 'Get expense aggregations by filters' })
  @ApiQuery({ type: AggregationFilterDTO })
  @ApiResponse({
    status: 200,
    description: 'List of expense aggregations',
    type: ExpensesAggregation,
    isArray: true,
  })
  async getAggregations(
    @Query() filter: AggregationFilterDTO,
  ): Promise<ExpensesAggregation[]> {
    return this.service.getAggregations(filter);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get expense by ID' })
  @ApiParam({ name: 'id', type: String, description: 'Expense UUID' })
  @ApiResponse({ status: 200, description: 'Expense details', type: Expenses })
  @ApiResponse({ status: 404, description: 'Expense not found' })
  async getOne(@Param('id') id: string): Promise<Expenses | null> {
    return this.service.getOne(id);
  }

  @Put(':id/status')
  @ApiOperation({ summary: 'Update expense status' })
  @ApiParam({ name: 'id', type: String, description: 'Expense UUID' })
  @ApiBody({ type: ExpensesUpdateStatusDTO })
  @ApiResponse({ status: 200, description: 'Expense updated', type: Expenses })
  @ApiResponse({
    status: 404,
    description: 'Expense not found or invalid status',
  })
  async updateStatus(
    @Param('id') id: string,
    @Body() dto: ExpensesUpdateStatusDTO,
  ): Promise<Expenses | null> {
    return this.service.changeStatus(id, dto);
  }
}
