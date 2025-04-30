/**
 * Конфигурация Swagger для API
 *
 * Этот модуль содержит настройки для автоматической генерации
 * документации API с использованием Swagger/OpenAPI.
 */

import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';

/**
 * Настраивает Swagger для приложения NestJS
 *
 * @param app Экземпляр приложения NestJS
 * @returns Экземпляр документа Swagger
 */
export function setupSwagger(app: INestApplication) {
  // Создаем конфигурацию Swagger
  const config = new DocumentBuilder()
    .setTitle('Финансовая платформа API')
    .setDescription('API для финансовой платформы')
    .setVersion('1.0')
    .addTag('auth', 'Аутентификация и авторизация')
    .addTag('users', 'Управление пользователями')
    .addTag('transactions', 'Финансовые транзакции')
    .addTag('analytics', 'Аналитика и отчеты')
    .addTag('debts', 'Управление долгами')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'Authorization',
        description: 'JWT токен авторизации',
        in: 'header',
      },
      'JWT',
    )
    .build();

  // Создаем документ Swagger
  const document = SwaggerModule.createDocument(app, config);

  // Настраиваем UI Swagger
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
    },
    customSiteTitle: 'Финансовая платформа API',
    customCss: '.swagger-ui .topbar { display: none }',
  });

  return document;
}
