/**
 * Обработчики MSW для эндпоинтов аутентификации
 *
 * Этот модуль содержит моки для эндпоинтов аутентификации,
 * включая вход, выход и обновление токена.
 */

import { rest } from 'msw';
import { Role } from '@finance-platform/shared';
import { db } from '../db';
import { API_URL } from '../constants';
import { generateToken, delay } from '../utils';

/**
 * Обработчики для эндпоинтов аутентификации
 */
export const authHandlers = [
  /**
   * Обработчик для входа в систему
   */
  rest.post(`${API_URL}/auth/login`, async (req, res, ctx) => {
    // Имитация задержки сети
    await delay();

    // Получаем данные из запроса
    const { email, password } = await req.json();

    // Проверяем наличие обязательных полей
    if (!email || !password) {
      return res(
        ctx.status(400),
        ctx.json({
          message: 'Email и пароль обязательны',
          errors: {
            email: !email ? ['Email обязателен'] : [],
            password: !password ? ['Пароль обязателен'] : [],
          },
        }),
      );
    }

    // Ищем пользователя в базе данных
    const user = db.user.findFirst({
      where: {
        email: {
          equals: email,
        },
      },
    });

    // Если пользователь не найден или пароль неверный
    if (!user || user.password !== password) {
      return res(
        ctx.status(401),
        ctx.json({
          message: 'Неверный email или пароль',
        }),
      );
    }

    // Генерируем токены
    const accessToken = generateToken({ userId: user.id, role: user.role });
    const refreshToken = generateToken({ userId: user.id }, '7d');

    // Формируем ответ
    return res(
      ctx.status(200),
      ctx.json({
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        },
        accessToken,
        refreshToken,
        expiresIn: 3600, // 1 час
      }),
    );
  }),

  /**
   * Обработчик для выхода из системы
   */
  rest.post(`${API_URL}/auth/logout`, async (req, res, ctx) => {
    // Имитация задержки сети
    await delay();

    // В реальном приложении здесь будет логика для инвалидации токена
    return res(
      ctx.status(200),
      ctx.json({
        message: 'Выход выполнен успешно',
      }),
    );
  }),

  /**
   * Обработчик для обновления токена
   */
  rest.post(`${API_URL}/auth/refresh`, async (req, res, ctx) => {
    // Имитация задержки сети
    await delay();

    // Получаем данные из запроса
    const { refreshToken } = await req.json();

    // Проверяем наличие токена
    if (!refreshToken) {
      return res(
        ctx.status(400),
        ctx.json({
          message: 'Токен обновления обязателен',
        }),
      );
    }

    // В реальном приложении здесь будет проверка токена
    // и получение информации о пользователе из него

    // Для мока просто берем первого пользователя
    const user = db.user.findFirst();

    if (!user) {
      return res(
        ctx.status(401),
        ctx.json({
          message: 'Недействительный токен обновления',
        }),
      );
    }

    // Генерируем новые токены
    const accessToken = generateToken({ userId: user.id, role: user.role });
    const newRefreshToken = generateToken({ userId: user.id }, '7d');

    // Формируем ответ
    return res(
      ctx.status(200),
      ctx.json({
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        },
        accessToken,
        refreshToken: newRefreshToken,
        expiresIn: 3600, // 1 час
      }),
    );
  }),

  /**
   * Обработчик для получения информации о текущей сессии
   */
  rest.get(`${API_URL}/auth/session`, async (req, res, ctx) => {
    // Имитация задержки сети
    await delay();

    // Получаем токен из заголовка
    const authHeader = req.headers.get('Authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res(
        ctx.status(401),
        ctx.json({
          message: 'Не авторизован',
        }),
      );
    }

    // В реальном приложении здесь будет проверка токена
    // и получение информации о пользователе из него

    // Для мока просто берем первого пользователя
    const user = db.user.findFirst();

    if (!user) {
      return res(
        ctx.status(401),
        ctx.json({
          message: 'Не авторизован',
        }),
      );
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

    // Формируем ответ
    return res(
      ctx.status(200),
      ctx.json({
        userId: user.id,
        role: user.role,
        permissions,
        expiresAt: Date.now() + 3600000, // Текущее время + 1 час
      }),
    );
  }),
];
