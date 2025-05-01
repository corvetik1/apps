/**
 * Утилиты для валидации данных на основе JSON-схем
 *
 * Этот модуль содержит функции для валидации данных с использованием
 * JSON-схем и библиотеки Ajv с поддержкой кеширования скомпилированных схем.
 */

import { ValidationError } from '../errors/validation-error';
import { ValidationErrorItem } from '../errors/validation-error-item';
import { getValidator } from './validation/schema-cache';

/**
 * Валидирует данные по JSON-схеме
 *
 * @param schema JSON-схема для валидации
 * @param data Данные для валидации
 * @returns Валидированные данные (с удаленными дополнительными свойствами и приведенными типами)
 * @throws ValidationError если данные не соответствуют схеме
 *
 * @example
 * ```typescript
 * import { userSchema } from '../types/user';
 * import { validate } from './validation';
 *
 * try {
 *   const validUser = validate(userSchema, userData);
 *   // Используем валидированные данные
 * } catch (error) {
 *   if (error instanceof ValidationError) {
 *     // Обрабатываем ошибки валидации
 *     console.error(error.errors);
 *   }
 * }
 * ```
 */
export function validate<T>(schema: Record<string, unknown>, data: unknown): T {
  // Получаем скомпилированную функцию валидации из кеша
  const validateFn = getValidator(schema);

  // Валидируем данные
  const valid = validateFn(data);

  // Если данные не валидны, формируем ошибки
  if (!valid) {
    const errors: ValidationErrorItem[] = (validateFn.errors || []).map(err => ({
      path: err.instancePath || '/',
      message: err.message || 'Неизвестная ошибка валидации',
    }));

    throw new ValidationError('Ошибка валидации данных', errors);
  }

  // Возвращаем валидированные данные
  return data as T;
}

/**
 * Проверяет, валидны ли данные по JSON-схеме
 *
 * @param schema JSON-схема для валидации
 * @param data Данные для валидации
 * @returns true, если данные валидны, иначе false
 *
 * @example
 * ```typescript
 * import { userSchema } from '../types/user';
 * import { isValid } from './validation';
 *
 * const valid = isValid(userSchema, userData);
 * if (valid) {
 *   // Данные валидны
 * } else {
 *   // Данные не валидны
 * }
 * ```
 */
export function isValid(schema: Record<string, unknown>, data: unknown): boolean {
  try {
    validate(schema, data);
    return true;
  } catch {
    return false;
  }
}

/**
 * Валидирует данные по JSON-схеме и возвращает ошибки
 *
 * @param schema JSON-схема для валидации
 * @param data Данные для валидации
 * @returns Массив ошибок валидации или null, если данные валидны
 *
 * @example
 * ```typescript
 * import { userSchema } from '../types/user';
 * import { validateWithErrors } from './validation';
 *
 * const errors = validateWithErrors(userSchema, userData);
 * if (errors) {
 *   // Обрабатываем ошибки
 *   errors.forEach(err => console.error(`${err.path}: ${err.message}`));
 * } else {
 *   // Данные валидны
 * }
 * ```
 */
export function validateWithErrors(
  schema: Record<string, unknown>,
  data: unknown,
): ValidationErrorItem[] | null {
  try {
    validate(schema, data);
    return null;
  } catch (error) {
    if (error instanceof ValidationError) {
      return error.errors;
    }
    return [{ path: '/', message: 'Неизвестная ошибка валидации' }];
  }
}

/**
 * Создает валидатор для конкретной схемы
 *
 * @param schema JSON-схема для валидации
 * @returns Функция-валидатор для данной схемы
 *
 * @example
 * ```typescript
 * import { userSchema } from '../types/user';
 * import { createValidator } from './validation';
 *
 * const validateUser = createValidator<User>(userSchema);
 *
 * try {
 *   const validUser = validateUser(userData);
 *   // Используем валидированные данные
 * } catch (error) {
 *   // Обрабатываем ошибки валидации
 * }
 * ```
 */
export function createValidator<T>(schema: Record<string, unknown>) {
  return (data: unknown): T => validate<T>(schema, data);
}
