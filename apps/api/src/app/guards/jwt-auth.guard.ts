/**
 * Guard для JWT-аутентификации
 *
 * Этот модуль содержит guard для защиты маршрутов, требующих аутентификации.
 */

import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';

/**
 * Guard для JWT-аутентификации
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  /**
   * Проверка возможности выполнения запроса
   *
   * @param context - Контекст выполнения
   * @returns Результат проверки
   */
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    // Вызываем родительский метод для проверки токена
    return super.canActivate(context);
  }

  /**
   * Обработка ошибок аутентификации
   *
   * @param error - Ошибка
   */
  handleRequest(err: any, user: any) {
    // Если произошла ошибка или пользователь не найден, выбрасываем исключение
    if (err || !user) {
      throw err || new UnauthorizedException('Не авторизован');
    }

    // Возвращаем пользователя
    return user;
  }
}
