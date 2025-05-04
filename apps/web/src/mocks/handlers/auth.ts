/**
 * Обработчики MSW для эндпоинтов аутентификации
 *
 * Этот модуль содержит моки для эндпоинтов аутентификации,
 * включая вход, выход и обновление токена.
 */

import { http, HttpResponse, delay as mswDelay } from 'msw';
import { Role } from '@finance-platform/shared';
import { db } from '../db';
import { API_URL } from '../constants';
import { generateToken } from '../utils';

/**
 * Обработчики для эндпоинтов аутентификации
 */
export const authHandlers = [
  /**
   * Обработчик для входа в систему
   */
  http.post(`${API_URL}/auth/login`, async ({ request }) => {
    // Имитация задержки сети
    await mswDelay();

    // Получаем данные из запроса
    const { email, password } = await request.json() as { email: string; password: string };

    // Проверяем наличие обязательных полей
    if (!email || !password) {
      return HttpResponse.json(
        {
          message: 'Email и пароль обязательны',
          errors: [
            {
              path: !email ? 'email' : 'password',
              message: !email ? 'Email обязателен' : 'Пароль обязателен',
            },
          ],
        },
        { status: 400 }
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

    // Для отладки выводим информацию о попытке входа
    console.log(`[MSW] Попытка входа: ${email}, пароль: ${password}`);
    
    // Если пользователь не найден
    if (!user) {
      console.error(`[MSW] Пользователь с email ${email} не найден`);
      return HttpResponse.json(
        {
          message: 'Неверный email или пароль',
        },
        { status: 401 }
      );
    }
    
    // В целях упрощения тестирования принимаем любой пароль для известных пользователей
    // В реальном приложении здесь была бы проверка пароля
    // if (user.password !== password) {
    //   console.error(`[MSW] Неверный пароль для пользователя ${email}`);
    //   return HttpResponse.json(
    //     {
    //       message: 'Неверный email или пароль',
    //     },
    //     { status: 401 }
    //   );
    // }

    // Генерируем токены
    const accessToken = generateToken({ userId: user.id, role: user.role });
    const refreshToken = generateToken({ userId: user.id }, '7d');

    // Формируем ответ
    return HttpResponse.json(
      {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        },
        accessToken,
        refreshToken,
        expiresIn: 3600, // 1 час
      },
      { status: 200 }
    );
  }),

  /**
   * Обработчик для выхода из системы
   */
  http.post(`${API_URL}/auth/logout`, async () => {
    // Имитация задержки сети
    await mswDelay();

    // В реальном приложении здесь будет логика для инвалидации токена
    return HttpResponse.json(
      {
        message: 'Выход выполнен успешно',
      },
      { status: 200 }
    );
  }),

  /**
   * Обработчик для обновления токена
   */
  http.post(`${API_URL}/auth/refresh`, async ({ request }) => {
    // Имитация задержки сети
    await mswDelay();

    // Получаем данные из запроса
    const { refreshToken } = await request.json() as { refreshToken: string };

    // Проверяем наличие токена
    if (!refreshToken) {
      return HttpResponse.json(
        {
          message: 'Токен обновления обязателен',
        },
        { status: 400 }
      );
    }

    // В реальном приложении здесь будет проверка токена
    // и получение информации о пользователе из него

    // Для мока просто берем первого пользователя
    const user = db.user.findFirst({
      where: {}
    });

    if (!user) {
      return HttpResponse.json(
        {
          message: 'Недействительный токен обновления',
        },
        { status: 401 }
      );
    }

    // Генерируем новые токены
    const accessToken = generateToken({ userId: user.id, role: user.role });
    const newRefreshToken = generateToken({ userId: user.id }, '7d');

    // Формируем ответ
    return HttpResponse.json(
      {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        },
        accessToken,
        refreshToken: newRefreshToken,
        expiresIn: 3600, // 1 час
      },
      { status: 200 }
    );
  }),

  /**
   * Обработчик для получения информации о текущей сессии
   */
  http.get(`${API_URL}/auth/session`, async ({ request }) => {
    // Имитация задержки сети
    await mswDelay();

    // Получаем токен из заголовка
    const authHeader = request.headers.get('Authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return HttpResponse.json(
        {
          message: 'Не авторизован',
        },
        { status: 401 }
      );
    }

    // В реальном приложении здесь будет проверка токена
    // и получение информации о пользователе из него

    // Для мока просто берем первого пользователя
    const user = db.user.findFirst({
      where: {}
    });

    if (!user) {
      return HttpResponse.json(
        {
          message: 'Не авторизован',
        },
        { status: 401 }
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
        permissions = ['accounts:view', 'transactions:manage', 'tenders:manage'];
        break;
      case Role.User:
        permissions = ['accounts:view', 'transactions:view', 'tenders:view'];
        break;
      default:
        permissions = [];
    }

    // Формируем ответ
    return HttpResponse.json(
      {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          departmentId: user.departmentId,
          permissions,
        },
      },
      { status: 200 }
    );
  }),
];
