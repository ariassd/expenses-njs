import { Module } from '@nestjs/common';

import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Expenses } from './expenses.entity';
import { ExpensesController } from './expenses.controller';
import { ExpensesService } from './expenses.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        url: configService.get<string>('DB_HOST'),
        database: 'expenses',
        autoLoadEntities: true,
        synchronize: true,
      }),
    }),
    TypeOrmModule.forFeature([Expenses]),
  ],
  controllers: [ExpensesController],
  providers: [ExpensesService],
})
export class AppModule {}
