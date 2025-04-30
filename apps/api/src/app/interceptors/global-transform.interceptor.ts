/**
 * Глобальный интерцептор для трансформации ответов
 *
 * Этот интерцептор автоматически определяет тип ответа
 * и применяет соответствующий маппер для трансформации данных.
 */

import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
// Импортируем интерфейсы и типы
import { User, UserResponseDto } from '@finance-platform/shared/lib/types/user';

// Импортируем мапперы
import { UserMapper } from '@finance-platform/shared/lib/utils/mapping/user.mapper';

/**
 * Тип для объектов с типом ответа
 */
interface ResponseWithType {
  _responseType?: string;
  [key: string]: any;
}

/**
 * Глобальный интерцептор для трансформации ответов
 */
@Injectable()
export class GlobalTransformInterceptor implements NestInterceptor<unknown, unknown> {
  // Инициализируем мапперы
  private readonly userMapper = new UserMapper();

  /**
   * Перехватывает ответ и трансформирует его
   *
   * @param context Контекст выполнения
   * @param next Обработчик вызова
   * @returns Наблюдаемый объект с трансформированным ответом
   */
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    return next.handle().pipe(
      map(data => {
        // Если данные не определены, возвращаем их как есть
        if (data === undefined || data === null) {
          return data;
        }

        // Если данные представляют собой массив
        if (Array.isArray(data)) {
          return this.transformArray(data);
        }

        // Если данные представляют собой объект
        return this.transformObject(data);
      }),
    );
  }

  /**
   * Трансформирует массив объектов
   *
   * @param data Массив объектов для трансформации
   * @returns Трансформированный массив объектов
   */
  private transformArray(data: ResponseWithType[]): ResponseWithType[] {
    // Если массив пустой, возвращаем его как есть
    if (data.length === 0) {
      return data;
    }

    // Трансформируем каждый элемент массива

    // Трансформируем каждый элемент массива
    return data.map(item => this.transformObject(item));
  }

  /**
   * Трансформирует объект
   *
   * @param data Объект для трансформации
   * @returns Трансформированный объект
   */
  private transformObject(data: ResponseWithType): ResponseWithType {
    // Если объект не имеет свойства _responseType, возвращаем его как есть
    if (!data || typeof data !== 'object' || !data._responseType) {
      return data;
    }

    // Определяем тип объекта и применяем соответствующий маппер
    switch (data._responseType) {
      case 'user':
        return this.userMapper.toDto(data as unknown as User) as unknown as ResponseWithType;
      // Добавьте другие типы ответов по мере необходимости
      default:
        return data;
    }
  }
}
