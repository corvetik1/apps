/**
 * Главный модуль приложения API
 *
 * Этот модуль объединяет все модули приложения
 * и настраивает глобальные провайдеры и мидлвары.
 */

import { Module, MiddlewareConsumer } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './modules/users.module';

// Импортируем интерцепторы
import { GlobalTransformInterceptor } from './interceptors/global-transform.interceptor';

/**
 * Главный модуль приложения
 */
@Module({
  imports: [
    // Настраиваем модуль конфигурации
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
    }),

    // Подключаем модули приложения
    UsersModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    // Регистрируем глобальный интерцептор для трансформации ответов
    {
      provide: APP_INTERCEPTOR,
      useClass: GlobalTransformInterceptor,
    },
  ],
})
export class AppModule {
  /**
   * Настраиваем глобальные middleware
   *
   * @param consumer Потребитель middleware
   */
  configure(consumer: MiddlewareConsumer) {
    // Здесь можно добавить глобальные middleware
    if (consumer) {
      // Пример использования consumer
      // consumer.apply(LoggerMiddleware).forRoutes('*');
    }
  }
}
