/**
 * Главный файл приложения API
 *
 * Этот файл инициализирует NestJS приложение,
 * настраивает глобальные префиксы, middleware и Swagger.
 */

import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { setupSwagger } from './app/config/swagger.config';

/**
 * Функция инициализации приложения
 */
async function bootstrap() {
  // Создаем экземпляр приложения
  const app = await NestFactory.create(AppModule);

  // Настраиваем глобальный префикс для всех маршрутов
  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);

  // Настраиваем CORS
  app.enableCors({
    origin: process.env.CORS_ORIGIN || '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  // Настраиваем глобальный ValidationPipe
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  // Настраиваем Swagger
  setupSwagger(app);

  // Запускаем приложение
  const port = process.env.PORT || 3000;
  await app.listen(port);

  // Выводим информацию о запуске
  Logger.log(`🚀 Application is running on: http://localhost:${port}/${globalPrefix}`);
  Logger.log(`📚 Swagger documentation: http://localhost:${port}/${globalPrefix}/docs`);
}

bootstrap();
