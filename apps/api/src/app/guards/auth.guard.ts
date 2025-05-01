import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Observable } from 'rxjs';

/**
 * Guard для проверки аутентификации пользователя
 *
 * В MVP-1 этот guard будет использоваться для защиты маршрутов,
 * требующих аутентификации пользователя.
 */
@Injectable()
export class AuthGuard implements CanActivate {
  /**
   * Проверяет, аутентифицирован ли пользователь
   */
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();

    // В MVP-0 просто проверяем наличие заголовка Authorization
    // В будущем здесь будет проверка JWT токена
    const isAuthenticated = !!request.headers.authorization;

    if (!isAuthenticated) {
      throw new UnauthorizedException('Пользователь не аутентифицирован');
    }

    return true;
  }
}
