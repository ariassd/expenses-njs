import { ExpensesService } from './expenses.service';
import { ExpensesUpdateStatusDTO } from './dto/expenses-update-status.dto';
import { ExpensesCreateDTO } from './dto/expenses-create.dto';
import { Injectable, Logger } from '@nestjs/common';
import { RabbitSubscribe, Nack } from '@golevelup/nestjs-rabbitmq';
import { ConsumeMessage } from 'amqplib';

@Injectable()
export class ExpensesHandler {
  constructor(
    private readonly service: ExpensesService,
    private logger: Logger,
  ) {}

  @RabbitSubscribe({
    exchange: process.env.AMQP_EXCHANGE || 'com.my_company',
    queue: process.env.AMQP_REGISTER_EXPENSES_QUEUE || 'com.my_company.expenses',
    routingKey: process.env.AMQP_REGISTER_EXPENSES_ROUTING_KEY || 'com.my_company.expenses.register_expenses',
  })
  async create(dto: ExpensesCreateDTO, amqpMsg: ConsumeMessage): Promise<Nack> {
    const retryCount = (amqpMsg.properties.headers?.['x-retry-count'] ?? 0) as number;
    try {
      await this.service.create(dto);
      return new Nack(true);
    } catch (e) {
      this.logger.warn('Failed to process message in "register_expenses"', e);
      if (retryCount < 3) {
        return new Nack(true);
      }
      return new Nack(false);
    }
  }

  @RabbitSubscribe({
    exchange: process.env.AMQP_EXCHANGE || 'com.my_company',
    queue: process.env.AMQP_UPDATE_EXPENSES_STATUS_QUEUE || 'com.my_company.expenses',
    routingKey: process.env.AMQP_UPDATE_EXPENSES_STATUS_ROUTING_KEY || 'com.my_company.expenses.update_expenses_status',
  })
  async updateStatus(msg: { id: string; dto: ExpensesUpdateStatusDTO }, amqpMsg: ConsumeMessage): Promise<Nack> {
    const retryCount = (amqpMsg.properties.headers?.['x-retry-count'] ?? 0) as number;
    try {
      await this.service.changeStatus(msg.id, msg.dto);
      return new Nack(true);
    } catch (e) {
      this.logger.warn('Failed to process message in "update_expenses_status"', e);
      if (retryCount < 3) {
        return new Nack(true);
      }
      return new Nack(false);
    }
  }
}
