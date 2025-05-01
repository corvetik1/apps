/**
 * Определения ролей и их разрешений
 *
 * Этот модуль содержит определения ролей пользователей и их разрешений
 * для системы контроля доступа на основе ролей (RBAC).
 */

import { Role } from '@finance-platform/shared';
import { Action, Subject, Permission } from './types';
import * as conditions from './conditions';

/**
 * Разрешения для роли администратора
 */
export const adminPermissions: Permission[] = [
  // Администратор имеет полный доступ ко всем ресурсам
  {
    action: Action.Manage,
    subject: Subject.All,
  },
];

/**
 * Разрешения для роли менеджера
 */
export const managerPermissions: Permission[] = [
  // Управление пользователями (кроме администраторов)
  {
    action: [Action.Read, Action.Create, Action.Update],
    subject: Subject.User,
    conditions: {
      isNotAdmin: (_, user) => user?.role !== Role.Admin,
    },
  },

  // Полный доступ к счетам
  {
    action: Action.Manage,
    subject: Subject.Account,
  },

  // Полный доступ к транзакциям
  {
    action: Action.Manage,
    subject: Subject.Transaction,
  },

  // Полный доступ к тендерам
  {
    action: Action.Manage,
    subject: Subject.Tender,
  },

  // Полный доступ к отчетам и дашбордам
  {
    action: Action.Manage,
    subject: [Subject.Report, Subject.Dashboard],
  },

  // Доступ к настройкам (только чтение и обновление)
  {
    action: [Action.Read, Action.Update],
    subject: Subject.Settings,
  },
];

/**
 * Разрешения для роли обычного пользователя
 */
export const userPermissions: Permission[] = [
  // Чтение и обновление своего профиля
  {
    action: [Action.Read, Action.Update],
    subject: Subject.User,
    conditions: {
      isOwner: conditions.isOwner,
    },
  },

  // Чтение счетов своего отдела
  {
    action: Action.Read,
    subject: Subject.Account,
    conditions: {
      isInSameDepartment: conditions.isInSameDepartment,
    },
  },

  // Создание и чтение своих транзакций
  {
    action: [Action.Create, Action.Read],
    subject: Subject.Transaction,
    conditions: {
      isWithinLimit: conditions.isWithinTransactionLimit,
    },
  },

  // Чтение и участие в активных тендерах
  {
    action: Action.Read,
    subject: Subject.Tender,
    conditions: {
      isActive: conditions.isTenderActive,
    },
  },

  // Чтение отчетов и дашбордов
  {
    action: Action.Read,
    subject: [Subject.Report, Subject.Dashboard],
  },
];

/**
 * Разрешения для роли гостя
 */
export const guestPermissions: Permission[] = [
  // Чтение публичной информации
  {
    action: Action.Read,
    subject: [Subject.Report, Subject.Dashboard],
    conditions: {
      isPublic: (_, resource) => resource?.isPublic === true,
    },
  },
];

/**
 * Получение разрешений для указанной роли
 */
export const getPermissionsByRole = (role: Role): Permission[] => {
  switch (role) {
    case Role.Admin:
      return adminPermissions;
    case Role.Manager:
      return managerPermissions;
    case Role.User:
      return userPermissions;
    case Role.Guest:
      return guestPermissions;
    default:
      return [];
  }
};
