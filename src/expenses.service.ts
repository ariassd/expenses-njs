import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
import { ExpensesCreateDTO } from './dto/expenses-create.dto';
import { Expenses } from './expenses.entity';
import { ExpensesAggregation } from './expenses-aggregation.entity';
import { ExpensesUpdateStatusDTO } from './dto/expenses-update-status.dto';
import { ListFilterDTO } from './dto/list-filter.dto';
import { PaginationResult } from './dto/pagination-result.dto';
import { SortOrder } from './dto/pagination.dto';
import { AggregationFilterDTO } from './dto/aggregation-filter.dto';

@Injectable()
export class ExpensesService {
  constructor(
    @InjectRepository(Expenses)
    private expensesRepository: Repository<Expenses>,
    @InjectRepository(ExpensesAggregation)
    private aggregationRepository: Repository<ExpensesAggregation>,
  ) {}

  async create(dto: ExpensesCreateDTO): Promise<Expenses> {
    dto['year'] = new Date().getFullYear();
    dto['month'] = new Date().getMonth() + 1;
    dto['day'] = new Date().getDate();

    const r = await this.expensesRepository
      .createQueryBuilder()
      .insert()
      .into(Expenses)
      .values(dto)
      .orIgnore()
      .returning('*')
      .execute();

    const ne: Expenses = (await r).raw[0];

    if (!ne) throw new ConflictException('Already exists');

    await this.updateAggregation(ne);

    return ne;
  }

  async updateAggregation(expense: Expenses): Promise<void> {
    await this.aggregationRepository.query(
      `
    INSERT INTO expenses_aggregation ("clientId", "category", "year", "month", "day", "currency", "count", "totalAmount")
    VALUES ($1, $2, $3, $4, $5, $6, 1, $7)
    ON CONFLICT ("clientId", "category", "year", "month", "day", "currency")
    DO UPDATE SET 
      "count" = expenses_aggregation."count" + 1,
      "totalAmount" = expenses_aggregation."totalAmount" + $7
    `,
      [expense.clientId, expense.category, expense.year, expense.month, expense.day, expense.currency, expense.amount],
    );
  }

  async list(dto: ListFilterDTO): Promise<PaginationResult<Expenses>> {
    const { pagination, queryFilter, fromDate, toDate } = dto;
    const { page, limit, sort } = pagination;

    const queryBuilder = this.expensesRepository.createQueryBuilder('expense');

    if (queryFilter) {
      queryBuilder.andWhere(
        '( CAST(expense.id AS TEXT) ILIKE :query OR ' +
          'CAST(expense.amount AS TEXT) ILIKE :query OR ' +
          'CAST(expense.description AS TEXT) ILIKE :query OR ' +
          'CAST(expense.status AS TEXT) ILIKE :query OR ' +
          'CAST(expense.category AS TEXT) ILIKE :query OR ' +
          'expense.clientId ILIKE :query)',
        { query: `%${queryFilter}%` },
      );
    }

    if (fromDate) {
      const fdYear = new Date(fromDate).getFullYear();
      queryBuilder.andWhere('expense.year >= :fdYear', { fdYear });
      queryBuilder.andWhere('expense.creationDate >= :fromDate', { fromDate });
    }

    if (toDate) {
      const tdYear = new Date(toDate).getFullYear();
      queryBuilder.andWhere('expense.year <= :tdYear', { tdYear });
      queryBuilder.andWhere('expense.creationDate <= :toDate', { toDate });
    }

    const [items, totalItems] = await queryBuilder
      .orderBy('expense.creationDate', sort == SortOrder.ASC ? 'ASC' : 'DESC')
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return {
      data: items,
      page,
      limit,
      sort,
      totalItems,
    };
  }

  async getOne(id: string): Promise<Expenses | null> {
    return this.expensesRepository.findOneBy({ id });
  }

  async changeStatus(id: string, dto: ExpensesUpdateStatusDTO): Promise<Expenses | null> {
    const r = await this.expensesRepository
      .createQueryBuilder()
      .update()
      .set(dto)
      .where(`id = :id and status != 'voided'`, { id })
      .returning('*')
      .execute();

    const updated = r.raw[0];
    if (!updated) {
      throw new NotFoundException('Expense not found or its status is not valid');
    }
    return updated;
  }

  async getAggregations(filter: AggregationFilterDTO): Promise<ExpensesAggregation[]> {
    const queryBuilder = this.aggregationRepository.createQueryBuilder('agg');

    if (filter.clientId) {
      queryBuilder.andWhere('agg.clientId = :clientId', { clientId: filter.clientId });
    }

    if (filter.category) {
      queryBuilder.andWhere('agg.category = :category', { category: filter.category });
    }

    if (filter.currency) {
      queryBuilder.andWhere('agg.currency = :currency', { currency: filter.currency });
    }

    if (filter.year) {
      queryBuilder.andWhere('agg.year = :year', { year: filter.year });
    }

    if (filter.month) {
      queryBuilder.andWhere('agg.month = :month', { month: filter.month });
    }

    if (filter.day) {
      queryBuilder.andWhere('agg.day = :day', { day: filter.day });
    }

    return queryBuilder.getMany();
  }
}
