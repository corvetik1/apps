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
  constructor(message: string, public readonly errors: Array<ValidationErrorItem | { path: string; message: string }>) {
    super(message);
    this.name = 'ValidationError';

    // Преобразуем объекты в экземпляры класса ValidationErrorItem
    this.errors = errors.map(err => {
      if (!(err instanceof ValidationErrorItem)) {
        return new ValidationErrorItem(err.path, err.message);
      }
      return err;
    }) as ValidationErrorItem[];

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
