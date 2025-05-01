/**
 * Типы для системы разрешений
 *
 * Этот модуль содержит типы для системы разрешений на основе CASL,
 * включая определения действий, субъектов и условий.
 */

/**
 * Действия, которые могут выполнять пользователи
 */
export enum Action {
  Manage = 'manage', // Полный доступ (все действия)
  Create = 'create', // Создание
  Read = 'read', // Чтение
  Update = 'update', // Обновление
  Delete = 'delete', // Удаление
  Approve = 'approve', // Утверждение
  Reject = 'reject', // Отклонение
  Export = 'export', // Экспорт данных
  Import = 'import', // Импорт данных
}

/**
 * Субъекты, над которыми выполняются действия
 */
export enum Subject {
  User = 'User', // Пользователь
  Account = 'Account', // Счет
  Transaction = 'Transaction', // Транзакция
  Tender = 'Tender', // Тендер
  Report = 'Report', // Отчет
  Dashboard = 'Dashboard', // Дашборд
  Settings = 'Settings', // Настройки
  All = 'all', // Все субъекты
}

/**
 * Тип для определения условий доступа
 */
export type ConditionFn<T = any> = (user: any, resource: T) => boolean;

/**
 * Тип для определения разрешения
 */
export interface Permission {
  action: Action | Action[];
  subject: Subject | Subject[];
  conditions?: Record<string, ConditionFn>;
}
