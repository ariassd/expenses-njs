import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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
    const { pagination, queryFilter } = dto;
    const { page, limit, sort } = pagination;

    const queryBuilder = this.repository.createQueryBuilder('expense');

    if (queryFilter) {
      queryBuilder.andWhere(
        '(expense.id ILIKE :query OR expense.amount::text ILIKE :query OR expense.description ILIKE :query OR expense.status ILIKE :query OR expense.category ILIKE :query)',
        { query: `%${queryFilter}%` },
      );
    }

    const [items, totalItems] = await queryBuilder
      .orderBy('expense.date', sort == SortOrder.ASC ? 'ASC' : 'DESC')
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

  async changeStatus(
    id: string,
    dto: ExpensesUpdateStatusDTO,
  ): Promise<Expenses | null> {
    const r = await this.repository
      .createQueryBuilder()
      .update()
      .set(dto)
      .where(`id = :id and status != 'voided'`, { id })
      .returning('*')
      .execute();

    const updated = r.raw[0];
    if (!updated) {
      throw new NotFoundException(
        'Expense not found or its status is not valid',
      );
    }
    return updated;
  }
}
