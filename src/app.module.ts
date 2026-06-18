import { Logger, Module, OnApplicationShutdown } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Expenses } from './expenses.entity';
import { ExpensesAggregation } from './expenses-aggregation.entity';
import { ExpensesController } from './expenses.controller';
import { ExpensesService } from './expenses.service';
import { RabbitMQConfig, RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { ExpensesHandler } from './expenses.handler';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        url: configService.get<string>('DB_HOST'),
        autoLoadEntities: true,
        synchronize: configService.get<string>('TYPEORM_SYNCHRONIZE') === 'true',
        logging: configService.get<string>('TYPEORM_LOGGING') === 'true',
      }),
    }),
    TypeOrmModule.forFeature([Expenses, ExpensesAggregation]),
    RabbitMQModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService): RabbitMQConfig => ({
        uri: configService.get<string>('AMQP_URI'),
        prefetchCount: parseInt(configService.get<string>('AMQP_PREFETCH_COUNT') || '10'),
        connectionInitOptions: { wait: true },
        exchanges: [
          {
            name: configService.get<string>('AMQP_EXCHANGE') || 'com.my_company',
            type: 'topic',
          },
          { name: `${process.env.AMQP_EXCHANGE || 'com.my_company'}.dead_letter`, type: 'fanout' },
        ],
        queues: [
          {
            name: `${process.env.AMQP_REGISTER_EXPENSES_ROUTING_KEY || 'com.my_company.expenses.create'}.dead_letter`,
            exchange: `${process.env.AMQP_EXCHANGE || 'com.my_company'}.dead_letter`,
            routingKey: '',
          },
        ],
      }),
    }),
  ],
  controllers: [ExpensesController],
  providers: [Logger, ExpensesService, ExpensesHandler],
})
export class AppModule implements OnApplicationShutdown {
  private logger = new Logger();
  constructor(private readonly dataSource: DataSource) {}

  async onApplicationShutdown() {
    this.logger.log('Starting graceful shutdown...');

    try {
      await this.dataSource.destroy();
      this.logger.log('Database connection closed successfully.');
    } catch (error) {
      this.logger.error('Error closing database connection:', error);
    }

    this.logger.log('Application is fully shut down.');
  }
}
