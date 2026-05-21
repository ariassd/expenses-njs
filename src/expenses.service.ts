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

  async list(): Promise<Expenses[]> {
    return (await this.repository.find()).flat();
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
      throw new NotFoundException('Expense not found or its status is not valid');
    }
    return updated;
  }
}
