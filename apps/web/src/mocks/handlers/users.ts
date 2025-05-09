/**
 * Обработчики MSW для эндпоинтов пользователей
 *
 * Этот модуль содержит моки для эндпоинтов управления пользователями,
 * включая получение списка, создание, обновление и удаление.
 */

import { http, HttpResponse, delay as mswDelay } from 'msw';
import { Role } from '@finance-platform/shared';
import { db } from '../db';
import { API_URL } from '../constants';

// Интерфейс для данных пользователя в запросах
interface UserRequestData {
  email?: string;
  name?: string;
  role?: string;
  password?: string;
  departmentId?: string;
  transactionLimit?: number;
}

/**
 * Обработчики для эндпоинтов пользователей
 */
export const usersHandlers = [
  /**
   * Обработчик для получения списка пользователей
   */
  http.get(`${API_URL}/users`, async ({ request }) => {
    // Имитация задержки сети
    await mswDelay();

    // Получаем параметры запроса
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1', 10);
    const limit = parseInt(url.searchParams.get('limit') || '10', 10);
    const sortBy = url.searchParams.get('sortBy') || 'createdAt';
    const sortOrder = url.searchParams.get('sortOrder') || 'desc';
    const name = url.searchParams.get('name') || '';
    const email = url.searchParams.get('email') || '';
    const role = url.searchParams.get('role') || '';

    // Получаем всех пользователей
    const allUsers = db.user.getAll();

    // Фильтруем пользователей
    const filteredUsers = allUsers.filter((user) => {
      const nameMatch = name ? user.name.toLowerCase().includes(name.toLowerCase()) : true;
      const emailMatch = email ? user.email.toLowerCase().includes(email.toLowerCase()) : true;
      const roleMatch = role ? user.role === role : true;
      return nameMatch && emailMatch && roleMatch;
    });

    // Сортируем пользователей
    const sortedUsers = [...filteredUsers].sort((a, b) => {
      const aValue = a[sortBy as keyof typeof a];
      const bValue = b[sortBy as keyof typeof b];
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortOrder === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }
      
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
      }
      
      return 0;
    });

    // Пагинация
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedUsers = sortedUsers.slice(startIndex, endIndex);

    // Формируем ответ
    const response = {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      items: paginatedUsers.map(({ password, ...user }) => user), // Исключаем пароль из ответа
      total: filteredUsers.length,
      page,
      limit,
      pages: Math.ceil(filteredUsers.length / limit),
    };

    return HttpResponse.json(response, { status: 200 });
  }),

  /**
   * Обработчик для получения пользователя по ID
   */
  http.get(`${API_URL}/users/:id`, async ({ params }) => {
    // Имитация задержки сети
    await mswDelay();

    const { id } = params;

    // Ищем пользователя в базе данных
    const user = db.user.findFirst({
      where: {
        id: {
          equals: id as string,
        },
      },
    });

    // Если пользователь не найден, возвращаем ошибку
    if (!user) {
      return HttpResponse.json(
        {
          message: `Пользователь с ID ${id} не найден`,
        },
        { status: 404 }
      );
    }

    // Исключаем пароль из ответа
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userWithoutPassword } = user;

    return HttpResponse.json(userWithoutPassword, { status: 200 });
  }),

  /**
   * Обработчик для создания нового пользователя
   */
  http.post(`${API_URL}/users`, async ({ request }) => {
    // Имитация задержки сети
    await mswDelay();

    // Получаем данные из запроса
    const userData = await request.json() as UserRequestData;

    // Проверяем наличие обязательных полей
    if (!userData.email || !userData.name || !userData.role || !userData.password) {
      return HttpResponse.json(
        {
          message: 'Не все обязательные поля заполнены',
          errors: {
            ...(userData.email ? {} : { email: ['Email обязателен'] }),
            ...(userData.name ? {} : { name: ['Имя обязательно'] }),
            ...(userData.role ? {} : { role: ['Роль обязательна'] }),
            ...(userData.password ? {} : { password: ['Пароль обязателен'] }),
          },
        },
        { status: 400 }
      );
    }

    // Проверяем уникальность email
    const existingUser = db.user.findFirst({
      where: {
        email: {
          equals: userData.email,
        },
      },
    });

    if (existingUser) {
      return HttpResponse.json(
        {
          message: 'Пользователь с таким email уже существует',
          errors: {
            email: ['Пользователь с таким email уже существует'],
          },
        },
        { status: 400 }
      );
    }

    // Проверяем валидность роли
    const validRoles = Object.values(Role);
    if (!validRoles.includes(userData.role as Role)) {
      return HttpResponse.json(
        {
          message: 'Указана недопустимая роль',
          errors: {
            role: ['Указана недопустимая роль'],
          },
        },
        { status: 400 }
      );
    }

    // Создаем нового пользователя
    const now = new Date().toISOString();
    const newUser = db.user.create({
      id: Date.now().toString(),
      email: userData.email,
      name: userData.name,
      password: userData.password,
      role: userData.role,
      departmentId: userData.departmentId || '1',
      transactionLimit: userData.transactionLimit || 10000,
      createdAt: now,
      updatedAt: now,
    });

    // Исключаем пароль из ответа
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userWithoutPassword } = newUser;

    return HttpResponse.json(userWithoutPassword, { status: 201 });
  }),

  /**
   * Обработчик для обновления существующего пользователя
   */
  http.put(`${API_URL}/users/:id`, async ({ params, request }) => {
    // Имитация задержки сети
    await mswDelay();

    const { id } = params;
    const updateData = await request.json() as UserRequestData;

    // Ищем пользователя в базе данных
    const user = db.user.findFirst({
      where: {
        id: {
          equals: id as string,
        },
      },
    });

    // Если пользователь не найден, возвращаем ошибку
    if (!user) {
      return HttpResponse.json(
        {
          message: `Пользователь с ID ${id} не найден`,
        },
        { status: 404 }
      );
    }

    // Проверяем уникальность email, если он меняется
    if (updateData.email && updateData.email !== user.email) {
      const existingUser = db.user.findFirst({
        where: {
          email: {
            equals: updateData.email,
          },
        },
      });

      if (existingUser) {
        return HttpResponse.json(
          {
            message: 'Пользователь с таким email уже существует',
            errors: {
              email: ['Пользователь с таким email уже существует'],
            },
          },
          { status: 400 }
        );
      }
    }

    // Проверяем валидность роли, если она меняется
    if (updateData.role) {
      const validRoles = Object.values(Role);
      if (!validRoles.includes(updateData.role as Role)) {
        return HttpResponse.json(
          {
            message: 'Указана недопустимая роль',
            errors: {
              role: ['Указана недопустимая роль'],
            },
          },
          { status: 400 }
        );
      }
    }

    // Обновляем пользователя
    const updatedUser = db.user.update({
      where: {
        id: {
          equals: id as string,
        },
      },
      data: {
        ...updateData,
        updatedAt: new Date().toISOString(),
      },
    });

    // Если обновление не удалось, возвращаем ошибку
    if (!updatedUser) {
      return HttpResponse.json(
        {
          message: 'Не удалось обновить пользователя',
        },
        { status: 500 }
      );
    }

    // Исключаем пароль из ответа
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userWithoutPassword } = updatedUser;

    return HttpResponse.json(userWithoutPassword, { status: 200 });
  }),

  /**
   * Обработчик для удаления пользователя
   */
  http.delete(`${API_URL}/users/:id`, async ({ params }) => {
    // Имитация задержки сети
    await mswDelay();

    const { id } = params;

    // Ищем пользователя в базе данных
    const user = db.user.findFirst({
      where: {
        id: {
          equals: id as string,
        },
      },
    });

    // Если пользователь не найден, возвращаем ошибку
    if (!user) {
      return HttpResponse.json(
        {
          message: `Пользователь с ID ${id} не найден`,
        },
        { status: 404 }
      );
    }

    // Удаляем пользователя
    db.user.delete({
      where: {
        id: {
          equals: id as string,
        },
      },
    });

    // Возвращаем успешный ответ без содержимого
    return new HttpResponse(null, { status: 204 });
  }),
];
