import { Injectable } from '@nestjs/common';
import { PrismaClient } from './client.mock';

/**
 * Заглушка сервиса для работы с Prisma ORM
 * 
 * Будет заменена на реальную реализацию на этапе I (Инициализация БД)
 */
@Injectable()
export class PrismaService extends PrismaClient {
  constructor() {
    super();
  }
}
