import { ApiProperty } from '@nestjs/swagger';
import { Column, CreateDateColumn, Entity, Index, PrimaryColumn, UpdateDateColumn } from 'typeorm';

@Entity({
  name: 'expenses_aggregation',
})
@Index(['clientId', 'category', 'year', 'month', 'day', 'currency'], { unique: true })
export class ExpensesAggregation {
  @ApiProperty({ description: 'Client identifier' })
  @PrimaryColumn({ type: 'varchar', length: 255 })
  clientId: string;

  @ApiProperty({ description: 'Expense category' })
  @PrimaryColumn({ type: 'varchar', length: 100 })
  category: string;

  @ApiProperty({ description: 'Year of expense' })
  @PrimaryColumn({ type: 'int' })
  year: number;

  @ApiProperty({ description: 'Month of expense (1-12)' })
  @PrimaryColumn({ type: 'int' })
  month: number;

  @ApiProperty({ description: 'Day of month' })
  @PrimaryColumn({ type: 'int' })
  day: number;

  @ApiProperty({ description: 'ISO 4217 currency code' })
  @PrimaryColumn({ type: 'varchar', length: 3 })
  currency: string;

  @ApiProperty({ description: 'Number of expenses in this group' })
  @Column({ type: 'int', default: 0 })
  count: number;

  @ApiProperty({ description: 'Total amount of expenses in this group' })
  @Column({ type: 'numeric', precision: 12, scale: 4, default: 0 })
  totalAmount: number;

  @ApiProperty({ description: 'Creation timestamp' })
  @CreateDateColumn({ type: 'timestamptz' })
  creationDate: Date;

  @ApiProperty({ description: 'Last update timestamp' })
  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}
