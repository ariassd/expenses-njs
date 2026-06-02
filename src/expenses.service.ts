import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
import { ExpensesCreateDTO } from './dto/expenses-create.dto';
import { Expenses } from './expenses.entity';
import { ExpensesUpdateStatusDTO } from './dto/expenses-update-status.dto';
import { ListFilterDTO } from './dto/list-filter.dto';
import { PaginationResult } from './dto/pagination-result.dto';
import { SortOrder } from './dto/pagination.dto';

@Injectable()
export class ExpensesService {
  constructor(
    @InjectRepository(Expenses)
    private repository: Repository<Expenses>,
  ) {}

  async create(dto: ExpensesCreateDTO): Promise<Expenses> {
    dto['year'] = new Date().getFullYear();
    dto['month'] = new Date().getMonth();
    dto['day'] = new Date().getDate();

    const r = await this.repository
      .createQueryBuilder()
      .insert()
      .into(Expenses)
      .values(dto)
      .orIgnore()
      .returning('*')
      .execute();

    const ne = (await r).raw[0];

    if (!ne) throw new ConflictException('Already exists');
    return ne;
  }

  async list(dto: ListFilterDTO): Promise<PaginationResult<Expenses>> {
    const { pagination, queryFilter, fromDate, toDate } = dto;
    const { page, limit, sort } = pagination;

    const queryBuilder = this.repository.createQueryBuilder('expense');

    if (queryFilter) {
      queryBuilder.andWhere(
        '( CAST(expense.id AS TEXT) ILIKE :query OR ' +
          'CAST(expense.amount AS TEXT) ILIKE :query OR ' +
          'CAST(expense.description AS TEXT) ILIKE :query OR ' +
          'CAST(expense.status AS TEXT) ILIKE :query OR ' +
          'CAST(expense.category AS TEXT) ILIKE :query)',
        { query: `%${queryFilter}%` },
      );
    }

    if (fromDate) {
      const fdYear = (new Date(fromDate)).getFullYear();
      queryBuilder.andWhere('expense.year >= :fdYear', { fdYear });
      queryBuilder.andWhere('expense.creationDate >= :fromDate', { fromDate });
    }

    if (toDate) {
      const tdYear = (new Date(toDate)).getFullYear();
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
    return this.repository.findOneBy({ id });
  }

  async changeStatus(id: string, dto: ExpensesUpdateStatusDTO): Promise<Expenses | null> {
    const r = await this.repository
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
}
