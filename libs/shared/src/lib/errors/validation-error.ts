/**
 * Класс ошибки валидации
 *
 * Используется для представления ошибок валидации данных
 * на основе JSON-схем.
 */

import { ValidationErrorItem } from './validation-error-item';

/**
 * Класс ошибки валидации
 *
 * @example
 * ```typescript
 * throw new ValidationError('Ошибка валидации данных', [
 *   { path: '/email', message: 'должен быть валидным email' },
 *   { path: '/age', message: 'должен быть больше или равен 18' }
 * ]);
 * ```
 */
export class ValidationError extends Error {
  /**
   * Создает экземпляр ошибки валидации
   *
   * @param message Общее сообщение об ошибке
   * @param errors Список конкретных ошибок валидации
   */
  constructor(message: string, public readonly errors: ValidationErrorItem[]) {
    super(message);
    this.name = 'ValidationError';

    // Для корректной работы instanceof в ES5
    Object.setPrototypeOf(this, ValidationError.prototype);
  }

  /**
   * Возвращает строковое представление ошибок валидации
   *
   * @returns Строковое представление ошибок
   */
  getErrorsString(): string {
    return this.errors.map(err => `${err.path}: ${err.message}`).join('; ');
  }

  /**
   * Преобразует ошибку в объект для ответа API
   *
   * @returns Объект с ошибками для ответа API
   */
  toResponse() {
    return {
      status: 'error',
      message: this.message,
      errors: this.errors,
    };
  }
}
