// Экспортируем базовые модули
export * from './lib/shared';

// Экспортируем типы
export * from './lib/types/user';
export * from './lib/types/account';
export * from './lib/types/transaction';
export * from './lib/types/tender';
export * from './lib/types/debt';
export * from './lib/types/investment';
export * from './lib/types/analytics';

// Экспортируем модули валидации
// Исключаем ValidationErrorItem для избежания дублирования
export { validate, validateWithErrors, isValid } from './lib/utils/validation';
export { createBaseJsonSchema } from './lib/utils/json-schema';
export { ValidationError, ValidationErrorItem } from './lib/errors/validation-error';
export {
  clearSchemaCache,
  getSchemaCacheSize,
  isSchemaInCache,
  getValidator,
} from './lib/utils/validation/schema-cache';

// Экспортируем модули маппинга
export * from './lib/utils/mapping/base.mapper';
export * from './lib/utils/mapping/user.mapper';
export * from './lib/utils/mapping/account.mapper';
export * from './lib/utils/mapping/transaction.mapper';
export * from './lib/utils/mapping/tender.mapper';
export * from './lib/utils/mapping/debt.mapper';
export * from './lib/utils/mapping/investment.mapper';
export * from './lib/utils/mapping/user-with-transactions.mapper';

// Экспортируем модули ошибок
export * from './lib/errors/validation-error';
