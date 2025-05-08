/**
 * Основной файл с обработчиками MSW
 *
 * Этот модуль экспортирует все обработчики MSW для использования в браузере.
 */

import { authHandlers } from './auth';
import { usersHandlers } from './users';

/**
 * Все обработчики MSW
 */
export const handlers = [
  ...authHandlers,
  ...usersHandlers,
  // Здесь будут добавляться другие обработчики
];
