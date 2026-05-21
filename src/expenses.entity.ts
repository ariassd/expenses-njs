import { Column, Entity, PrimaryColumn } from 'typeorm';
import { Status } from './expenses.dto';

@Entity()
export class Expenses {
  @PrimaryColumn({ type: 'uuid' })
  id: string; // UUID

  @Column('int')
  amount: number; // Greater than 0

  @Column({ type: 'varchar', length: 100 })
  category: string;

  @Column({ type: 'varchar', length: 500 })
  description: string;

  @Column({ type: 'varchar', length: 20 })
  status: Status;

  @Column({ type: 'date' })
  date: Date; // Cannot be in the future
}
