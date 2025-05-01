/**
 * Guard для проверки ролей
 *
 * Этот модуль содержит guard для проверки ролей пользователей
 * и ограничения доступа к маршрутам на основе ролей.
 */

import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '@finance-platform/shared';

/**
 * Guard для проверки ролей
 */
@Injectable()
export class RolesGuard implements CanActivate {
  /**
   * Конструктор
   *
   * @param reflector - Рефлектор для получения метаданных
   */
  constructor(private readonly reflector: Reflector) {}

  /**
   * Проверка возможности выполнения запроса
   *
   * @param context - Контекст выполнения
   * @returns Результат проверки
   */
  canActivate(context: ExecutionContext): boolean {
    // Получаем требуемые роли из метаданных
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);

    // Если роли не указаны, разрешаем доступ
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    // Получаем пользователя из запроса
    const { user } = context.switchToHttp().getRequest();

    // Если пользователь не определен, запрещаем доступ
    if (!user) {
      throw new ForbiddenException('Доступ запрещен');
    }

    // Проверяем, имеет ли пользователь требуемую роль
    const hasRequiredRole = this.hasRole(user.role, requiredRoles);

    if (!hasRequiredRole) {
      throw new ForbiddenException('Недостаточно прав для выполнения операции');
    }

    return true;
  }

  /**
   * Проверка наличия роли у пользователя
   *
   * @param userRole - Роль пользователя
   * @param requiredRoles - Требуемые роли
   * @returns Результат проверки
   */
  private hasRole(userRole: Role, requiredRoles: Role[]): boolean {
    // Администратор имеет доступ ко всему
    if (userRole === Role.Admin) {
      return true;
    }

    // Менеджер имеет доступ ко всему, кроме админских функций
    if (userRole === Role.Manager && !requiredRoles.includes(Role.Admin)) {
      return true;
    }

    // Для остальных ролей - проверяем наличие роли в списке требуемых
    return requiredRoles.includes(userRole);
  }
}
