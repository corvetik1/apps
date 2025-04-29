/**
 * Вспомогательные утилиты и типы для тестирования JSON-схем
 */
import { expect } from '@jest/globals';

/**
 * Интерфейс для типизации свойств JSON-схемы
 */
export interface SchemaProperty {
  type: string;
  format?: string;
  enum?: string[];
  items?: {
    type: string;
    properties?: Record<string, SchemaProperty>;
    required?: string[];
  };
  properties?: Record<string, SchemaProperty>;
  required?: string[];
  description?: string;
  examples?: unknown[];
  minimum?: number;
  maximum?: number;
  minLength?: number;
  maxLength?: number;
  pattern?: string;
}

/**
 * Интерфейс для JSON-схемы
 */
export interface JsonSchema {
  $schema: string;
  title: string;
  description?: string;
  type: string;
  additionalProperties: boolean;
  properties: Record<string, SchemaProperty>;
  required?: string[];
}

/**
 * Типизированный доступ к свойствам схемы
 * @param schema JSON-схема для проверки
 * @returns Типизированный объект свойств схемы
 */
export function getSchemaProperties(schema: JsonSchema): Record<string, SchemaProperty> {
  return schema.properties;
}

/**
 * Проверяет базовую структуру JSON-схемы
 * @param schema JSON-схема для проверки
 * @param title Ожидаемое название схемы
 */
export function expectValidJsonSchema(schema: JsonSchema, title: string): void {
  expect(schema.$schema).toBe('http://json-schema.org/draft-07/schema#');
  expect(schema.title).toBe(title);
  expect(schema.type).toBe('object');
  expect(schema.additionalProperties).toBe(false);
}

/**
 * Проверяет свойство схемы на соответствие типу строки
 * @param properties Свойства схемы
 * @param propertyName Имя проверяемого свойства
 * @param format Опциональный формат строки (например, 'date-time')
 */
export function expectStringProperty(
  properties: Record<string, SchemaProperty>,
  propertyName: string,
  format?: string,
): void {
  expect(properties[propertyName]).toBeDefined();
  expect(properties[propertyName].type).toBe('string');
  if (format) {
    expect(properties[propertyName].format).toBe(format);
  }
}

/**
 * Проверяет свойство схемы на соответствие типу числа
 * @param properties Свойства схемы
 * @param propertyName Имя проверяемого свойства
 */
export function expectNumberProperty(
  properties: Record<string, SchemaProperty>,
  propertyName: string,
): void {
  expect(properties[propertyName]).toBeDefined();
  expect(properties[propertyName].type).toBe('number');
}

/**
 * Проверяет свойство схемы на соответствие типу булева
 * @param properties Свойства схемы
 * @param propertyName Имя проверяемого свойства
 */
export function expectBooleanProperty(
  properties: Record<string, SchemaProperty>,
  propertyName: string,
): void {
  expect(properties[propertyName]).toBeDefined();
  expect(properties[propertyName].type).toBe('boolean');
}

/**
 * Проверяет свойство схемы на соответствие типу массива
 * @param properties Свойства схемы
 * @param propertyName Имя проверяемого свойства
 * @param itemType Тип элементов массива
 */
export function expectArrayProperty(
  properties: Record<string, SchemaProperty>,
  propertyName: string,
  itemType: string,
): void {
  expect(properties[propertyName]).toBeDefined();
  expect(properties[propertyName].type).toBe('array');
  expect(properties[propertyName].items?.type).toBe(itemType);
}

/**
 * Проверяет свойство схемы на соответствие типу объекта
 * @param properties Свойства схемы
 * @param propertyName Имя проверяемого свойства
 */
export function expectObjectProperty(
  properties: Record<string, SchemaProperty>,
  propertyName: string,
): void {
  expect(properties[propertyName]).toBeDefined();
  expect(properties[propertyName].type).toBe('object');
}

/**
 * Проверяет свойство схемы на соответствие перечислению
 * @param properties Свойства схемы
 * @param propertyName Имя проверяемого свойства
 * @param enumValues Ожидаемые значения перечисления
 */
export function expectEnumProperty(
  properties: Record<string, SchemaProperty>,
  propertyName: string,
  enumValues: string[],
): void {
  expect(properties[propertyName]).toBeDefined();
  expect(properties[propertyName].type).toBe('string');
  expect(properties[propertyName].enum).toEqual(enumValues);
}
