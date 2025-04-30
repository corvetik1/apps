/**
 * Интерцептор для трансформации ответов
 *
 * Этот интерцептор автоматически преобразует данные ответа
 * в соответствующие DTO с использованием мапперов.
 */

import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BaseMapper } from '@finance-platform/shared';

/**
 * Generic interceptor to transform response data using a specified mapper.
 * Handles both single objects and arrays of objects.
 */
@Injectable()
export class TransformInterceptor<TEntity, TDto> implements NestInterceptor<TEntity, TDto> {
  constructor(private readonly mapper: BaseMapper<TEntity, TDto>) {}

  intercept(context: ExecutionContext, next: CallHandler<TEntity>): Observable<TDto> {
    return next.handle().pipe(
      map((data: TEntity | TEntity[]) => {
        if (Array.isArray(data)) {
          console.warn(
            'TransformInterceptor received an array, but NestInterceptor expects a single entity. Mapping first element or empty.',
          );
          return data.length > 0 ? this.mapper.toDto(data[0]) : ({} as TDto);
        } else if (data) {
          return this.mapper.toDto(data);
        }
        return data as unknown as TDto;
      }),
    );
  }
}
