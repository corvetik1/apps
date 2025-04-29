/**
 * Индексный файл для экспорта всех типов
 *
 * Этот файл экспортирует все типы, используемые в финансовой платформе.
 * Импортируйте типы из этого файла, а не из отдельных файлов типов.
 */

// Базовые сущности
export * from './user';
export * from './account';
export * from './transaction';
export * from './tender';

// Финансовые сущности
export * from './debit-card';
export * from './credit-card';
export * from './debt';
export * from './loan';
export * from './investment';
export * from './tax';
export * from './kudir';

// Аналитические сущности
export * from './analytics';
export * from './report';

// AI сущности
export * from './ai-analysis-request';
export * from './ai-analysis-response';

// Прочие сущности
export * from './document';
export * from './note';
export * from './gallery-item';
export * from './counterparty';
export * from './settings';
