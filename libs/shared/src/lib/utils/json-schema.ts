/**
 * Утилиты для работы с JSON-схемами
 *
 * Этот модуль содержит функции для генерации и валидации JSON-схем
 * на основе TypeScript типов.
 */

/**
 * Интерфейс для метаданных JSON-схемы
 */
export interface JsonSchemaMetadata {
  /** Название схемы */
  title: string;
  /** Описание схемы */
  description: string;
  /** Версия схемы */
  version?: string;
  /** Дополнительные свойства */
  [key: string]: unknown;
}

/**
 * Функция для создания базовой JSON-схемы
 *
 * @param metadata Метаданные схемы
 * @returns Базовая JSON-схема
 */
export function createBaseJsonSchema(metadata: JsonSchemaMetadata) {
  const { title, description, ...restMetadata } = metadata;
  return {
    $schema: 'http://json-schema.org/draft-07/schema#',
    title,
    description,
    type: 'object',
    additionalProperties: false,
    required: [],
    properties: {},
    ...restMetadata,
  };
}

/**
 * Функция для валидации JSON-схемы
 *
 * @param schema JSON-схема
 * @param data Данные для валидации
 * @returns Результат валидации
 */
export function validateJsonSchema(schema: Record<string, unknown>, data: unknown): boolean {
  // В реальном приложении здесь будет использоваться библиотека для валидации
  // Например, ajv или json-schema
  console.log('Validating JSON schema', { schema, data });
  return true;
}
