/**
 * Модуль для работы с пользователями
 *
 * Этот модуль демонстрирует использование middleware валидации
 * на основе JSON-схем.
 */

import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { UsersController } from '../controllers/users.controller';
import { UsersService } from '../services/users.service';
import { ValidationMiddleware } from '../middleware/validation.middleware';
import { createUserSchema, updateUserSchema } from '@finance-platform/shared';

/**
 * Модуль для работы с пользователями
 */
@Module({
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {
  /**
   * Настройка middleware
   *
   * @param consumer Потребитель middleware
   */
  configure(consumer: MiddlewareConsumer) {
    // Валидация тела запроса при создании пользователя
    consumer
      .apply(ValidationMiddleware.create({ schema: createUserSchema, target: 'body' }))
      .forRoutes({ path: 'v1/users', method: RequestMethod.POST });

    // Валидация тела запроса при обновлении пользователя
    consumer
      .apply(ValidationMiddleware.create({ schema: updateUserSchema, target: 'body' }))
      .forRoutes({ path: 'v1/users/:id', method: RequestMethod.PUT });
  }
}
