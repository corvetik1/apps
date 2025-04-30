/**
 * Тесты для кеша скомпилированных JSON-схем
 */
import {
  getValidator,
  clearSchemaCache,
  getSchemaCacheSize,
  removeSchemaFromCache,
  isSchemaInCache,
} from '../schema-cache';

describe('SchemaCache', () => {
  // Очищаем кеш перед каждым тестом
  beforeEach(() => {
    clearSchemaCache();
  });

  const testSchema = {
    type: 'object',
    properties: {
      name: { type: 'string' },
      age: { type: 'number' },
    },
    required: ['name'],
  };

  it('должен кешировать скомпилированные схемы', () => {
    // Первый вызов добавляет схему в кеш
    const validator1 = getValidator(testSchema);
    expect(getSchemaCacheSize()).toBe(1);

    // Второй вызов должен вернуть ту же функцию из кеша
    const validator2 = getValidator(testSchema);
    expect(getSchemaCacheSize()).toBe(1);

    // Функции должны быть идентичны
    expect(validator1).toBe(validator2);
  });

  it('должен корректно проверять наличие схемы в кеше', () => {
    expect(isSchemaInCache(testSchema)).toBe(false);

    getValidator(testSchema);

    expect(isSchemaInCache(testSchema)).toBe(true);
  });

  it('должен удалять схему из кеша', () => {
    getValidator(testSchema);
    expect(getSchemaCacheSize()).toBe(1);

    const removed = removeSchemaFromCache(testSchema);
    expect(removed).toBe(true);
    expect(getSchemaCacheSize()).toBe(0);

    // Повторное удаление должно вернуть false
    const removedAgain = removeSchemaFromCache(testSchema);
    expect(removedAgain).toBe(false);
  });

  it('должен очищать весь кеш', () => {
    // Добавляем несколько схем в кеш
    getValidator(testSchema);
    getValidator({
      type: 'object',
      properties: {
        id: { type: 'string' },
      },
    });

    expect(getSchemaCacheSize()).toBe(2);

    clearSchemaCache();
    expect(getSchemaCacheSize()).toBe(0);
  });

  it('должен корректно валидировать данные с использованием кешированной схемы', () => {
    const validator = getValidator(testSchema);

    // Валидные данные
    const validData = { name: 'John', age: 30 };
    expect(validator(validData)).toBe(true);

    // Невалидные данные (отсутствует обязательное поле name)
    const invalidData = { age: 25 };
    expect(validator(invalidData)).toBe(false);
    expect(validator.errors).toBeTruthy();
  });
});
