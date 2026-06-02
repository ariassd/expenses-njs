import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';
import { Status } from './dto/expenses-create.dto';

@Entity()
@Index(['clientId'])
@Index(['status'])
@Index(['category'])
@Index(['year'])
@Index(['month'])
@Index(['day'])
export class Expenses {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'numeric', precision: 12, scale: 4 })
  amount: number;

  @Column({ type: 'varchar', length: 3 })
  currency: string;

  @Column({ type: 'varchar', length: 100 })
  category: string;

  @Column({ type: 'varchar', length: 500 })
  description: string;

  @Column({ type: 'varchar', length: 255 })
  clientId: string;

  @Column({ type: 'varchar', length: 20 })
  status: Status;

  @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  creationDate: Date;

  @Column({ type: 'int'})
  year: number;

  @Column({ type: 'int'})
  month: number;

  @Column({ type: 'int'})
  day: number;
}
