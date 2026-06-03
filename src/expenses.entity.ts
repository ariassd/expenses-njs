import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';
import { Status } from './dto/expenses-create.dto';
import { Transform } from 'class-transformer';

@Entity()
@Index(['clientId'])
@Index(['status'])
@Index(['category'])
@Index(['year'])
@Index(['month'])
@Index(['day'])
export class Expenses {
  @ApiProperty({ description: 'Unique identifier (UUID)' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'Expense amount', example: 100.50 })
  @Column({ type: 'numeric', precision: 12, scale: 4 })
  amount: number;

  @ApiProperty({ description: 'ISO 4217 currency code', example: 'USD' })
  @Column({ type: 'varchar', length: 3 })
  currency: string;

  @ApiProperty({ description: 'Expense category', example: 'Food' })
  @Column({ type: 'varchar', length: 100 })
  category: string;

  @ApiProperty({ description: 'Expense description', example: 'Lunch at restaurant' })
  @Column({ type: 'varchar', length: 500 })
  description: string;

  @ApiProperty({ description: 'Client identifier', example: 'uuid-or-mongoid' })
  @Column({ type: 'varchar', length: 255 })
  clientId: string;

  @ApiProperty({ description: 'Expense status', enum: Status })
  @Column({ type: 'varchar', length: 20 })
  status: Status;

  @ApiProperty({ description: 'Creation timestamp' })
  @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  creationDate: Date;

  @ApiProperty({ description: 'Year of expense', example: 2026 })
  @Column({ type: 'int'})
  year: number;

  @ApiProperty({ description: 'Month of expense (1-12)', example: 6 })
  @Column({ type: 'int'})
  month: number;

  @ApiProperty({ description: 'Day of month', example: 3 })
  @Column({ type: 'int'})
  day: number;
}
