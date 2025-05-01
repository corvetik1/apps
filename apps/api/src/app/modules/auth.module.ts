/**
 * Модуль аутентификации
 *
 * Этот модуль содержит компоненты для аутентификации пользователей,
 * включая контроллеры, сервисы, стратегии и guards.
 */

import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from '../controllers/auth.controller';
import { AuthService } from '../services/auth.service';
import { JwtStrategy } from '../strategies/jwt.strategy';
import { UsersModule } from './users.module';

/**
 * Модуль аутентификации
 */
@Module({
  imports: [
    // Импортируем модуль пользователей для доступа к сервису пользователей
    UsersModule,

    // Настраиваем Passport для использования JWT
    PassportModule.register({ defaultStrategy: 'jwt' }),

    // Настраиваем JWT
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'secret',
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
