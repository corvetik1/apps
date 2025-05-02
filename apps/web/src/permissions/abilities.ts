/**
 * Система разрешений на основе CASL
 *
 * Этот модуль содержит функции для создания и проверки разрешений
 * пользователей на основе библиотеки CASL.
 */

import { createMongoAbility, MongoAbility, AbilityBuilder } from '@casl/ability';
import { Role } from '@finance-platform/shared';
import { Action, Subject } from './types';

/**
 * Тип способностей пользователя
 */
export type AppAbility = MongoAbility<[Action, Subject | 'all']>;

/**
 * Создает объект способностей для пользователя на основе его роли
 * @param user Пользователь
 * @returns Объект способностей CASL
 */
export const defineAbilitiesFor = (user: any): AppAbility => {
  const { can, build } = new AbilityBuilder<AppAbility>(createMongoAbility);

  // Если пользователь не определен, возвращаем пустые способности
  if (!user || !user.role) {
    return build();
  }

  // Для администратора можно сразу дать полный доступ
  if (user.role === Role.Admin) {
    can(Action.Manage, 'all');
    return build();
  }

  // Для менеджера и других ролей используем упрощенный подход
  // без динамических предикатов, которые вызывают ошибки типизации

  // Менеджер
  if (user.role === Role.Manager) {
    can([Action.Read, Action.Create, Action.Update], 'all');
    can(Action.Manage, [Subject.Account, Subject.Transaction, Subject.Tender]);
    can([Action.Read, Action.Update], Subject.Settings);
    can(Action.Manage, Subject.User);
  }
  // Обычный пользователь
  else if (user.role === Role.User) {
    // Доступ к своему профилю и ресурсам
    if (user.id) {
      can([Action.Read, Action.Update], Subject.User, { userId: user.id } as any);
    }

    // Доступ к счетам своего отдела
    if (user.departmentId) {
      can(Action.Read, Subject.Account, { departmentId: user.departmentId } as any);
    }

    // Создание транзакций в пределах лимита
    if (user.transactionLimit) {
      can(Action.Create, Subject.Transaction, { amount: { $lte: user.transactionLimit } } as any);
    }

    // Доступ к тендерам, отчетам и дашбордам
    can(Action.Read, Subject.Tender);
    can(Action.Read, [Subject.Report, Subject.Dashboard]);
  }
  // Гость
  else if (user.role === Role.Guest) {
    // Только чтение публичных отчетов и дашбордов
    can(Action.Read, [Subject.Report, Subject.Dashboard], { isPublic: true } as any);
  }

  return build();
};

/**
 * Проверяет, есть ли у пользователя конкретное разрешение
 *
 * @param user Пользователь
 * @param action Действие (например, Action.Read)
 * @param subject Субъект (например, Subject.User)
 * @param resource Конкретный ресурс (опционально)
 * @returns true, если есть разрешение, иначе false
 */
export const hasPermission = (
  user: any,
  action: Action,
  subject: Subject,
  resource?: any,
): boolean => {
  const ability = defineAbilitiesFor(user);
  return ability.can(action, resource || subject);
};

/**
 * Хук для использования способностей в компонентах
 */
export const useAbility = (user: any): AppAbility => {
  return defineAbilitiesFor(user);
};
