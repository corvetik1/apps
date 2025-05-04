/**
 * DTO для аутентификации
 *
 * Этот модуль содержит классы DTO для использования в Swagger документации
 * контроллера аутентификации.
 */

import { ApiProperty } from '@nestjs/swagger';

/**
 * DTO для ответа аутентификации
 */
export class AuthResponseDto {
  @ApiProperty({
    description: 'Токен доступа',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  accessToken: string;

  @ApiProperty({
    description: 'Токен обновления',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  refreshToken: string;

  @ApiProperty({
    description: 'Время истечения токена доступа (в секундах)',
    example: 3600,
  })
  expiresIn: number;

  @ApiProperty({
    description: 'Информация о пользователе',
    type: 'object',
    properties: {
      id: { type: 'string', example: '123e4567-e89b-12d3-a456-426614174000' },
      email: { type: 'string', example: 'user@example.com' },
      firstName: { type: 'string', example: 'Иван' },
      lastName: { type: 'string', example: 'Иванов' },
      role: { type: 'string', example: 'user' }
    },
    additionalProperties: false,
    example: {
      id: '123e4567-e89b-12d3-a456-426614174000',
      email: 'user@example.com',
      firstName: 'Иван',
      lastName: 'Иванов',
      role: 'user',
    }
  })
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
  };
}

/**
 * DTO для ответа с информацией о сессии
 */
export class SessionResponseDto {
  @ApiProperty({
    description: 'Идентификатор пользователя',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  userId: string;

  @ApiProperty({
    description: 'Email пользователя',
    example: 'user@example.com',
  })
  email: string;

  @ApiProperty({
    description: 'Имя пользователя',
    example: 'Иван',
  })
  firstName: string;

  @ApiProperty({
    description: 'Фамилия пользователя',
    example: 'Иванов',
  })
  lastName: string;

  @ApiProperty({
    description: 'Роль пользователя',
    example: 'user',
  })
  role: string;

  @ApiProperty({
    description: 'Разрешения пользователя',
    type: [String],
    example: ['read:users', 'write:users'],
  })
  permissions: string[];
}

/**
 * DTO для запроса входа
 */
export class LoginRequestDto {
  @ApiProperty({
    description: 'Email пользователя',
    example: 'user@example.com',
  })
  email: string;

  @ApiProperty({
    description: 'Пароль пользователя',
    example: 'password123',
  })
  password: string;
}

/**
 * DTO для запроса обновления токена
 */
export class RefreshTokenRequestDto {
  @ApiProperty({
    description: 'Токен обновления',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  refreshToken: string;
}
