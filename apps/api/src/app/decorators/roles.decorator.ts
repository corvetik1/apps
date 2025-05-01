/**
 * Декоратор для указания ролей
 *
 * Этот модуль содержит декоратор для указания ролей, необходимых
 * для доступа к маршрутам или методам контроллера.
 */

import { SetMetadata } from '@nestjs/common';
import { Role } from '@finance-platform/shared';

/**
 * Ключ для метаданных ролей
 */
export const ROLES_KEY = 'roles';

/**
 * Декоратор для указания ролей
 *
 * @param roles - Роли, необходимые для доступа
 * @returns Декоратор
 *
 * @example
 * ```typescript
 * @Roles(Role.Admin)
 * @Get('users')
 * getUsers() {
 *   // ...
 * }
 * ```
 */
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);
