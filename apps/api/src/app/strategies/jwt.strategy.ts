/**
 * JWT стратегия аутентификации
 *
 * Этот модуль содержит стратегию для проверки JWT-токенов
 * и извлечения информации о пользователе из них.
 */

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from '../services/users.service';

/**
 * Интерфейс для полезной нагрузки JWT-токена
 */
interface JwtPayload {
  /** Идентификатор пользователя */
  userId: string;
  /** Роль пользователя */
  role: string;
  /** Время истечения токена */
  exp: number;
}

/**
 * JWT стратегия аутентификации
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  /**
   * Конструктор
   *
   * @param usersService - Сервис для работы с пользователями
   */
  constructor(private readonly usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'secret',
    });
  }

  /**
   * Валидация JWT-токена
   *
   * @param payload - Полезная нагрузка JWT-токена
   * @returns Пользователь
   * @throws UnauthorizedException - Если пользователь не найден
   */
  async validate(payload: JwtPayload) {
    const user = await this.usersService.findOne(payload.userId);

    if (!user) {
      throw new UnauthorizedException('Пользователь не найден');
    }

    // Возвращаем объект пользователя, который будет доступен в запросе
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    };
  }
}
