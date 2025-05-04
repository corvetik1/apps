import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from './client.mock';

/**
 * Сервис для работы с Prisma ORM
 */
@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    super({
      log: process.env.NODE_ENV === 'development' 
        ? ['query', 'info', 'warn', 'error'] 
        : ['error'],
    });
  }

  /**
   * Подключение к базе данных при инициализации модуля
   */
  async onModuleInit() {
    await this.$connect();
  }

  /**
   * Отключение от базы данных при завершении работы модуля
   */
  async onModuleDestroy() {
    await this.$disconnect();
  }
}
