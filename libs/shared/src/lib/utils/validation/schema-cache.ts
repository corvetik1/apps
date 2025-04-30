/**
 * Кеш для скомпилированных JSON-схем
 *
 * Этот модуль содержит утилиты для кеширования скомпилированных
 * JSON-схем, чтобы избежать повторной компиляции одних и тех же схем.
 */

import Ajv, { ValidateFunction } from 'ajv';
import addFormats from 'ajv-formats';

/**
 * Экземпляр Ajv с настройками
 */
const ajv = new Ajv({
  allErrors: true, // Собирать все ошибки, а не останавливаться на первой
  removeAdditional: true, // Удалять дополнительные свойства
  useDefaults: true, // Использовать значения по умолчанию из схемы
  coerceTypes: true, // Приводить типы (например, строку '123' к числу 123)
});

// Добавляем поддержку форматов (date, date-time, email и т.д.)
addFormats(ajv);

/**
 * Кеш для скомпилированных схем
 */
const schemaCache = new Map<string, ValidateFunction>();

/**
 * Получает хеш для схемы
 *
 * @param schema JSON-схема
 * @returns Хеш схемы
 */
function getSchemaHash(schema: Record<string, unknown>): string {
  // Простой способ получить хеш - использовать JSON.stringify
  // В реальном приложении можно использовать более эффективный алгоритм хеширования
  return JSON.stringify(schema);
}

/**
 * Получает скомпилированную функцию валидации для схемы
 *
 * @param schema JSON-схема
 * @returns Скомпилированная функция валидации
 */
export function getValidator(schema: Record<string, unknown>): ValidateFunction {
  const schemaHash = getSchemaHash(schema);

  // Проверяем, есть ли схема в кеше
  let validator = schemaCache.get(schemaHash);

  // Если схемы нет в кеше, компилируем ее и добавляем в кеш
  if (!validator) {
    validator = ajv.compile(schema);
    schemaCache.set(schemaHash, validator);
  }

  return validator;
}

/**
 * Очищает кеш скомпилированных схем
 */
export function clearSchemaCache(): void {
  schemaCache.clear();
}

/**
 * Получает размер кеша (количество скомпилированных схем)
 *
 * @returns Размер кеша
 */
export function getSchemaCacheSize(): number {
  return schemaCache.size;
}

/**
 * Удаляет схему из кеша
 *
 * @param schema JSON-схема
 * @returns true, если схема была удалена, иначе false
 */
export function removeSchemaFromCache(schema: Record<string, unknown>): boolean {
  const schemaHash = getSchemaHash(schema);
  return schemaCache.delete(schemaHash);
}

/**
 * Проверяет, есть ли схема в кеше
 *
 * @param schema JSON-схема
 * @returns true, если схема есть в кеше, иначе false
 */
export function isSchemaInCache(schema: Record<string, unknown>): boolean {
  const schemaHash = getSchemaHash(schema);
  return schemaCache.has(schemaHash);
}
