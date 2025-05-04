/**
 * Интерцептор для трансформации массивов и одиночных объектов
 *
 * Этот интерцептор автоматически преобразует данные ответа
 * в соответствующие DTO с использованием мапперов, поддерживая
 * как одиночные объекты, так и массивы.
 */

import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

/**
 * Опции для интерцептора трансформации
 */
export interface TransformOptions {
  /** Функция маппера для преобразования данных */
  mapper: (data: any) => any;
  /** Флаг, указывающий, что ответ является массивом */
  isArray?: boolean;
}

/**
 * Интерцептор для трансформации данных с поддержкой массивов
 */
@Injectable()
export class TransformInterceptor implements NestInterceptor {
  private readonly options: TransformOptions;

  /**
   * Конструктор
   * 
   * @param options - Опции для интерцептора
   */
  constructor(options: TransformOptions) {
    this.options = options;
  }

  /**
   * Метод для перехвата и трансформации ответа
   * 
   * @param context - Контекст выполнения
   * @param next - Обработчик вызова
   * @returns Трансформированный ответ
   */
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data: any) => {
        if (!data) {
          return data;
        }

        if (this.options.isArray && Array.isArray(data)) {
          return data.map(item => this.options.mapper(item));
        } else if (Array.isArray(data)) {
          return data.map(item => this.options.mapper(item));
        } else {
          return this.options.mapper(data);
        }
      }),
    );
  }
}
