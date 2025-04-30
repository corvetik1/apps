/**
 * Middleware для валидации запросов на основе JSON-схем
 *
 * Этот middleware проверяет входящие запросы на соответствие
 * JSON-схемам и отклоняет невалидные запросы.
 */

import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { ValidationError } from '@finance-platform/shared';
import { validate } from '@finance-platform/shared';

/**
 * Опции для middleware валидации
 */
export interface ValidationOptions {
  /** JSON-схема для валидации */
  schema: Record<string, unknown>;
  /** Часть запроса для валидации (body, query, params) */
  target?: 'body' | 'query' | 'params';
}

/**
 * Middleware для валидации запросов на основе JSON-схем
 *
 * @example
 * ```typescript
 * // В модуле NestJS
 * configure(consumer: MiddlewareConsumer) {
 *   consumer
 *     .apply(ValidationMiddleware.create({ schema: userSchema }))
 *     .forRoutes({ path: 'users', method: RequestMethod.POST });
 * }
 * ```
 */
@Injectable()
export class ValidationMiddleware implements NestMiddleware {
  /**
   * Создает экземпляр middleware с указанными опциями
   *
   * @param options Опции валидации
   * @returns Middleware для валидации запросов
   */
  static create(options: ValidationOptions) {
    return new ValidationMiddleware(options);
  }

  /**
   * Создает экземпляр middleware
   *
   * @param options Опции валидации
   */
  constructor(private readonly options: ValidationOptions) {
    this.options.target = this.options.target || 'body';
  }

  /**
   * Обрабатывает запрос
   *
   * @param req Запрос Express
   * @param res Ответ Express
   * @param next Функция для продолжения обработки запроса
   */
  use(req: Request, res: Response, next: NextFunction) {
    try {
      // Получаем данные для валидации
      const target = this.options.target as keyof Request;
      const data = req[target];

      // Валидируем данные
      const validatedData = validate(this.options.schema, data);

      // Заменяем данные в запросе на валидированные
      // Используем безопасный подход для изменения свойств запроса
      // Примечание: использование any необходимо, так как свойства Request из Express являются только для чтения
      if (target === 'body') {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (req as any).body = validatedData;
      } else if (target === 'query') {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (req as any).query = validatedData;
      } else if (target === 'params') {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (req as any).params = validatedData;
      }

      // Продолжаем обработку запроса
      next();
    } catch (error) {
      // Если ошибка валидации, отправляем 400 Bad Request
      if (error instanceof ValidationError) {
        return res.status(400).json(error.toResponse());
      }

      // Если другая ошибка, передаем ее дальше
      next(error);
    }
  }
}
