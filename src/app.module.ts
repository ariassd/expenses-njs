import { Logger, Module, OnApplicationShutdown } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Expenses } from './expenses.entity';
import { ExpensesAggregation } from './expenses-aggregation.entity';
import { ExpensesController } from './expenses.controller';
import { ExpensesService } from './expenses.service';
import { RabbitMQConfig, RabbitMQExchangeConfig, RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
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
        connectionInitOptions: { wait: true },
        exchanges: [
          {
            name: configService.get<string>('AMQP_EXCHANGE') || 'com.my_company',
            type: 'topic',
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
