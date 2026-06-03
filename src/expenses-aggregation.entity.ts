import { Column, CreateDateColumn, Entity, Index, PrimaryColumn, UpdateDateColumn } from 'typeorm';

@Entity({
  name: "expenses_aggregation"
})
@Index(['clientId', 'category', 'year', 'month', 'day', 'currency'], { unique: true })
export class ExpensesAggregation {
  @PrimaryColumn({ type: 'varchar', length: 255 })
  clientId: string;

  @PrimaryColumn({ type: 'varchar', length: 100 })
  category: string;

  @PrimaryColumn({ type: 'int' })
  year: number;

  @PrimaryColumn({ type: 'int' })
  month: number;

  @PrimaryColumn({ type: 'int' })
  day: number;

  @PrimaryColumn({ type: 'varchar', length: 3 })
  currency: string;

  @Column({ type: 'int', default: 0 })
  count: number;

  @Column({ type: 'numeric', precision: 12, scale: 4, default: 0 })
  totalAmount: number;

  @CreateDateColumn({ type: 'timestamptz' })
  creationDate: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}
