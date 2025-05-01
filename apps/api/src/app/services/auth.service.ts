/**
 * Сервис для аутентификации
 *
 * Этот модуль содержит сервис для аутентификации пользователей,
 * включая методы для входа, выхода и обновления токена.
 */

import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from './users.service';
import {
  LoginRequest,
  AuthResponse,
  RefreshTokenRequest,
  SessionInfo,
  Role,
} from '@finance-platform/shared';
import * as bcrypt from 'bcrypt';

/**
 * Сервис для аутентификации
 */
@Injectable()
export class AuthService {
  /**
   * Конструктор
   *
   * @param usersService - Сервис для работы с пользователями
   * @param jwtService - Сервис для работы с JWT
   */
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * Вход в систему
   *
   * @param loginRequest - Данные для входа
   * @returns Ответ с токенами и информацией о пользователе
   * @throws UnauthorizedException - Если email или пароль неверны
   */
  async login(loginRequest: LoginRequest): Promise<AuthResponse> {
    const { email, password } = loginRequest;

    // Ищем пользователя по email
    const user = await this.usersService.findByEmail(email);

    if (!user) {
      throw new UnauthorizedException('Неверный email или пароль');
    }

    // Проверяем пароль
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Неверный email или пароль');
    }

    // Генерируем токены
    const tokens = this.generateTokens(user.id, user.role);

    // Формируем ответ
    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role as Role,
      },
      ...tokens,
    };
  }

  /**
   * Обновление токена
   *
   * @param refreshTokenRequest - Данные для обновления токена
   * @returns Ответ с новыми токенами и информацией о пользователе
   * @throws UnauthorizedException - Если токен обновления недействителен
   */
  async refreshToken(refreshTokenRequest: RefreshTokenRequest): Promise<AuthResponse> {
    const { refreshToken } = refreshTokenRequest;

    try {
      // Проверяем токен обновления
      const payload = this.jwtService.verify(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET || 'refresh-secret',
      });

      // Ищем пользователя по идентификатору из токена
      const user = await this.usersService.findOne(payload.userId);

      if (!user) {
        throw new UnauthorizedException('Пользователь не найден');
      }

      // Генерируем новые токены
      const tokens = this.generateTokens(user.id, user.role);

      // Формируем ответ
      return {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role as Role,
        },
        ...tokens,
      };
    } catch (error) {
      throw new UnauthorizedException('Недействительный токен обновления');
    }
  }

  /**
   * Получение информации о сессии
   *
   * @param userId - Идентификатор пользователя
   * @returns Информация о сессии
   */
  async getSessionInfo(userId: string): Promise<SessionInfo> {
    // Ищем пользователя по идентификатору
    const user = await this.usersService.findOne(userId);

    if (!user) {
      throw new UnauthorizedException('Пользователь не найден');
    }

    // Формируем список разрешений в зависимости от роли
    let permissions: string[] = [];

    switch (user.role) {
      case Role.Admin:
        permissions = [
          'admin:all',
          'users:manage',
          'accounts:manage',
          'transactions:manage',
          'tenders:manage',
        ];
        break;
      case Role.Manager:
        permissions = [
          'users:read',
          'users:create',
          'users:update',
          'accounts:manage',
          'transactions:manage',
          'tenders:manage',
        ];
        break;
      case Role.User:
        permissions = [
          'users:read:own',
          'users:update:own',
          'accounts:read',
          'transactions:create',
          'transactions:read:own',
          'tenders:read',
        ];
        break;
      case Role.Guest:
        permissions = ['reports:read:public', 'dashboards:read:public'];
        break;
    }

    // Формируем информацию о сессии
    return {
      userId: user.id,
      role: user.role as Role,
      permissions,
      expiresAt: Date.now() + 3600000, // Текущее время + 1 час
    };
  }

  /**
   * Генерация токенов
   *
   * @param userId - Идентификатор пользователя
   * @param role - Роль пользователя
   * @returns Токены доступа и обновления
   */
  private generateTokens(userId: string, role: string) {
    // Генерируем токен доступа
    const accessToken = this.jwtService.sign(
      { userId, role },
      {
        secret: process.env.JWT_SECRET || 'secret',
        expiresIn: '1h',
      },
    );

    // Генерируем токен обновления
    const refreshToken = this.jwtService.sign(
      { userId },
      {
        secret: process.env.JWT_REFRESH_SECRET || 'refresh-secret',
        expiresIn: '7d',
      },
    );

    return {
      accessToken,
      refreshToken,
      expiresIn: 3600, // 1 час
    };
  }
}
