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
   * Создает функцию middleware с указанными опциями
   *
   * @param options Опции валидации
   * @returns Функция middleware для валидации запросов
   */
  static create(options: ValidationOptions) {
    const middleware = new ValidationMiddleware(options);
    return (req: Request, res: Response, next: NextFunction) => {
      middleware.use(req, res, next);
    };
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
        (req as any).body = validatedData;
      } else if (target === 'query') {
        (req as any).query = validatedData;
      } else if (target === 'params') {
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
