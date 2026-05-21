import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';
import { Status } from './dto/expenses-create.dto';

@Entity()
export class Expenses {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'int' })
  amount: number;

  @Column({ type: 'varchar', length: 100 })
  category: string;

  @Column({ type: 'varchar', length: 500 })
  description: string;

  @Column({ type: 'varchar', length: 20 })
  status: Status;

  @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  date: Date;
}
