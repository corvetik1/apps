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
 * Создает объект abilities для пользователя
 * 
 * @param user Пользователь, для которого создаются способности
 * @returns Объект AppAbility с определенными разрешениями
 */
export const defineAbilitiesFor = (user: any): AppAbility => {
  const { can, cannot, build } = new AbilityBuilder<AppAbility>(createMongoAbility);

  // Если пользователь не определен, возвращаем пустые способности
  if (!user) {
    return build();
  }

  // Для администратора - полный доступ ко всему
  if (user.role === Role.Admin) {
    can(Action.Manage, 'all');
    return build();
  }

  // Для менеджера - расширенные права, но с ограничениями
  if (user.role === Role.Manager) {
    // Менеджер может управлять всеми субъектами
    can(Action.Manage, Subject.User);
    can(Action.Manage, Subject.Account);
    can(Action.Manage, Subject.Transaction);
    can(Action.Manage, Subject.Tender);
    can(Action.Manage, Subject.Report);
    can(Action.Manage, Subject.Dashboard);
    can(Action.Read, Subject.Settings);
    can(Action.Update, Subject.Settings);

    // Менеджер не может удалять настройки
    // Менеджер не может управлять администраторами
    cannot(Action.Delete, Subject.Settings);
    cannot(Action.Manage, Subject.User, { role: Role.Admin } as any);

    return build();
  }

  // Для обычного пользователя - доступ только к своим ресурсам
  if (user.role === Role.User) {
    // Пользователь может читать и обновлять свой профиль
    can(Action.Read, Subject.User, { userId: user.id } as any);
    can(Action.Update, Subject.User, { userId: user.id } as any);
    // Добавляем проверку по id для совместимости с тестами
    can(Action.Read, Subject.User, { id: user.id } as any);
    can(Action.Update, Subject.User, { id: user.id } as any);

    // Пользователь может читать счета своего отдела
    if (user.departmentId) {
      can(Action.Read, Subject.Account, { departmentId: user.departmentId } as any);
    }

    // Пользователь может создавать транзакции в пределах лимита
    if (user.transactionLimit) {
      can(Action.Create, Subject.Transaction, {
        amount: { $lte: user.transactionLimit },
      } as any);
    }

    // Пользователь может читать тендеры, отчеты и дашборды
    can(Action.Read, Subject.Tender);
    can(Action.Read, Subject.Report);
    can(Action.Read, Subject.Dashboard);

    return build();
  }

  // Для гостя - только чтение публичных отчетов и дашбордов
  if (user.role === Role.Guest) {
    can(Action.Read, Subject.Report, { isPublic: true } as any);
    can(Action.Read, Subject.Dashboard, { isPublic: true } as any);
    return build();
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
export const hasPermission = (user: any, action: Action, subject: Subject, resource?: any): boolean => {
  // Создаем способности для данного пользователя
  const ability = defineAbilitiesFor(user);

  // Если ресурс передан, проверяем доступ к конкретному ресурсу
  if (resource) {
    return ability.can(action, subject, resource);
  }
  
  // Если ресурс не передан, проверяем доступ к субъекту
  return ability.can(action, subject);
};

/**
 * Хук для использования способностей в компонентах
 */
export const useAbility = (user: any): AppAbility => {
  return defineAbilitiesFor(user);
};
