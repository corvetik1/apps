// Экспортируем базовые модули
export * from './lib/shared';

// Экспортируем типы
export * from './lib/types/user';
export * from './lib/types/auth';
export * from './lib/types/account';
export * from './lib/types/transaction';
export * from './lib/types/tender';
export * from './lib/types/debt';
export * from './lib/types/investment';
export * from './lib/types/analytics';

// Экспортируем модули валидации
export { validate, validateWithErrors, isValid } from './lib/utils/validation';
export { createBaseJsonSchema } from './lib/utils/json-schema';
// Экспортируем ValidationError и ValidationErrorItem из отдельных файлов
export { ValidationError } from './lib/errors/validation-error';
export { ValidationErrorItem } from './lib/errors/validation-error-item';
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

// Экспортируем схемы
export { createUserSchema, updateUserSchema } from './lib/schemas/user';
export {
  loginSchema,
  authResponseSchema,
  refreshTokenSchema,
  sessionInfoSchema,
} from './lib/schemas/auth';
