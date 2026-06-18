import { ExpensesService } from './expenses.service';
import { ExpensesUpdateStatusDTO } from './dto/expenses-update-status.dto';
import { ExpensesCreateDTO } from './dto/expenses-create.dto';
import { Injectable, Logger } from '@nestjs/common';
import { RabbitSubscribe, Nack } from '@golevelup/nestjs-rabbitmq';

@Injectable()
export class ExpensesHandler {
  constructor(
    private readonly service: ExpensesService,
    private logger: Logger,
  ) {}

  @RabbitSubscribe({
    exchange: process.env.AMQP_EXCHANGE || 'com.my_company',
    queue: process.env.AMQP_REGISTER_EXPENSES_QUEUE || 'com.my_company.expenses.create',
    routingKey: process.env.AMQP_REGISTER_EXPENSES_ROUTING_KEY || 'com.my_company.expenses.create',
    queueOptions: {
      deadLetterExchange: `${process.env.AMQP_EXCHANGE || 'com.my_company'}.dead_letter`,
      deadLetterRoutingKey: `${process.env.AMQP_REGISTER_EXPENSES_ROUTING_KEY || 'com.my_company.expenses.create'}.dead_letter`,
    },
  })
  async create(payload: ExpensesCreateDTO): Promise<Nack|void> {
    try {
      await this.service.create(payload);
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'Unknown error occurred';
      this.logger.error('Failed to process message in "register_expenses"', errorMessage);
      return new Nack(false);
    }
  }

  @RabbitSubscribe({
    exchange: process.env.AMQP_EXCHANGE || 'com.my_company',
    queue: process.env.AMQP_UPDATE_EXPENSES_STATUS_QUEUE || 'com.my_company.expenses.update_status',
    routingKey: process.env.AMQP_UPDATE_EXPENSES_STATUS_ROUTING_KEY || 'com.my_company.expenses.update_status',
    queueOptions: {
      deadLetterExchange: `${process.env.AMQP_EXCHANGE || 'com.my_company'}.dead_letter`,
    },
  })
  async updateStatus(payload: { id: string; dto: ExpensesUpdateStatusDTO }): Promise<Nack|void> {
    try {
      await this.service.changeStatus(payload.id, payload.dto);
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'Unknown error occurred';
      this.logger.error('Failed to process message in "update_status"', errorMessage);
      return new Nack(false);
    }
  }
}
