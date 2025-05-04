/**
 * Контроллер для аутентификации
 *
 * Этот модуль содержит контроллер для обработки запросов аутентификации,
 * включая вход, выход и обновление токена.
 */

import { Controller, Post, Body, HttpCode, HttpStatus, UseGuards, Get, Req } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import {
  LoginRequest,
  AuthResponse,
  RefreshTokenRequest,
  SessionInfo,
} from '@finance-platform/shared';
import { AuthResponseDto, SessionResponseDto, LoginRequestDto, RefreshTokenRequestDto } from '../dto/auth.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { Request } from 'express';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { Validate } from '../decorators/validate.decorator';
import { loginSchema, refreshTokenSchema } from '@finance-platform/shared';

/**
 * Контроллер для аутентификации
 */
@ApiTags('auth')
@Controller('auth')
export class AuthController {
  /**
   * Конструктор
   *
   * @param authService - Сервис для аутентификации
   */
  constructor(private readonly authService: AuthService) {}

  /**
   * Вход в систему
   *
   * @param loginRequest - Данные для входа
   * @returns Ответ с токенами и информацией о пользователе
   */
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Вход в систему' })
  @ApiBody({ type: LoginRequestDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Успешный вход',
    type: AuthResponseDto
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Неверный email или пароль',
  })
  @Validate(loginSchema)
  async login(@Body() loginRequest: LoginRequest): Promise<AuthResponse> {
    return this.authService.login(loginRequest);
  }

  /**
   * Выход из системы
   *
   * @returns Сообщение об успешном выходе
   */
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Выход из системы' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Успешный выход',
  })
  async logout(): Promise<{ message: string }> {
    // В реальном приложении здесь будет логика для инвалидации токена
    return { message: 'Выход выполнен успешно' };
  }

  /**
   * Обновление токена
   *
   * @param refreshTokenRequest - Данные для обновления токена
   * @returns Ответ с новыми токенами и информацией о пользователе
   */
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Обновление токена' })
  @ApiBody({ type: RefreshTokenRequestDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Успешное обновление токена',
    type: AuthResponseDto
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Недействительный токен обновления',
  })
  @Validate(refreshTokenSchema)
  async refreshToken(@Body() refreshTokenRequest: RefreshTokenRequest): Promise<AuthResponse> {
    return this.authService.refreshToken(refreshTokenRequest);
  }

  /**
   * Получение информации о текущей сессии
   *
   * @param req - Запрос Express
   * @returns Информация о сессии
   */
  @Get('session')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Получение информации о текущей сессии' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Информация о сессии',
    type: SessionResponseDto
  })
  async getSession(@Req() req: Request): Promise<SessionInfo> {
    const user = req.user as { id: string };
    return this.authService.getSessionInfo(user.id);
  }
}
