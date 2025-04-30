/**
 * Экспорт всех мапперов для удобного импорта
 *
 * Этот модуль экспортирует все мапперы из директории mapping,
 * чтобы упростить их импорт в других частях приложения.
 */

// Базовые мапперы
export * from './base.mapper';
export * from './nested.mapper';

// Мапперы для основных сущностей
export * from './user.mapper';
export * from './transaction.mapper';
export * from './account.mapper';
export * from './debt.mapper';
export * from './investment.mapper';
export * from './tender.mapper';
export * from './transaction.mapper';

// Мапперы для сложных сущностей с вложенными объектами
export * from './user-with-transactions.mapper';
