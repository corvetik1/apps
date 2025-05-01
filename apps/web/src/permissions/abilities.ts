/**
 * Система разрешений на основе CASL
 *
 * Этот модуль содержит функции для создания и проверки разрешений
 * пользователей на основе библиотеки CASL.
 */

import { createMongoAbility, MongoAbility, AbilityBuilder } from '@casl/ability';
import { Role } from '@finance-platform/shared';
import { Action, Subject } from './types';
import { getPermissionsByRole } from './roles';

/**
 * Тип способностей пользователя
 */
export type AppAbility = MongoAbility<[Action, Subject | 'all']>;

/**
 * Создает объект способностей для пользователя на основе его роли
 */
export const defineAbilitiesFor = (user: any): AppAbility => {
  const { can, build } = new AbilityBuilder<AppAbility>(createMongoAbility);

  // Если пользователь не определен, возвращаем пустые способности
  if (!user || !user.role) {
    return build();
  }

  // Получаем разрешения для роли пользователя
  const permissions = getPermissionsByRole(user.role as Role);

  // Определяем способности на основе разрешений
  permissions.forEach(permission => {
    const actions = Array.isArray(permission.action) ? permission.action : [permission.action];

    const subjects = Array.isArray(permission.subject) ? permission.subject : [permission.subject];

    subjects.forEach(subject => {
      actions.forEach(action => {
        if (permission.conditions) {
          can(action, subject, resource => {
            // Проверяем все условия
            return Object.values(permission.conditions!).every(condition =>
              condition(user, resource),
            );
          });
        } else {
          can(action, subject);
        }
      });
    });
  });

  return build();
};

/**
 * Хук для использования способностей в компонентах
 */
export const useAbility = (user: any): AppAbility => {
  return defineAbilitiesFor(user);
};

/**
 * Проверяет, имеет ли пользователь указанное разрешение
 */
export const hasPermission = (
  user: any,
  action: Action,
  subject: Subject,
  resource?: any,
): boolean => {
  const ability = defineAbilitiesFor(user);
  return ability.can(action, resource ? resource : subject);
};
