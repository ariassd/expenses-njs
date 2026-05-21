import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
import { ExpensesDTO } from './expenses.dto';
import { Expenses } from './expenses.entity';

@Injectable()
export class ExpensesService {
  constructor(
    @InjectRepository(Expenses)
    private repository: Repository<Expenses>,
  ) {}

  async create(dto: ExpensesDTO): Promise<Expenses> {
    const n = this.repository.create(dto);

    // save por defecto lo que hace es hacer un upsert, si se envia un producto con el mismo Id lo va a sobre escribir
    // por eso use el query builder, para asegurarme que la BD no haga upsert si no mas bien insert or exception
    const r = await this.repository
      .createQueryBuilder()
      .insert()
      .values(dto)
      .returning("*")
      .execute();

    const ne = (await r).raw[0];

    if (!ne) throw new ConflictException('Already exists');
    return ne;
  }

  async list(): Promise<Expenses[]> {
    return (await this.repository.find()).flat()
  }

  async getOne(id: string): Promise<Expenses | null> {
    return this.repository.findOneBy({id})
  }


  async changeStatus(id: string): Promise<Expenses | null> {
    return this.repository.findOneBy({id})
  }
}
