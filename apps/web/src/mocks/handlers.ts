import { http, HttpResponse } from 'msw';

interface LoginRequest {
  email: string;
  password: string;
}

export const handlers = [
  // Обработчик для проверки здоровья API
  http.get('/api/health', () => {
    return HttpResponse.json({ status: 'ok' });
  }),

  // Заглушка для аутентификации (будет использоваться в MVP-1)
  http.post('/api/auth/login', async ({ request }) => {
    const { email, password } = (await request.json()) as LoginRequest;

    // Простая проверка для демонстрации
    if (email === 'user@example.com' && password === 'password') {
      return HttpResponse.json({
        user: {
          id: '1',
          email: 'user@example.com',
          firstName: 'Test',
          lastName: 'User',
          role: {
            id: '1',
            name: 'USER',
            permissions: [],
          },
        },
        accessToken: 'mock-jwt-token',
        refreshToken: 'mock-refresh-token',
      });
    }

    return new HttpResponse(JSON.stringify({ message: 'Invalid credentials' }), { status: 401 });
  }),
];
