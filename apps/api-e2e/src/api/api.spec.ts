import axios from 'axios';
import { jest } from '@jest/globals';

// Мокируем axios для имитации ответов API
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('GET /api', () => {
  beforeEach(() => {
    // Сбрасываем моки перед каждым тестом
    jest.resetAllMocks();
  });

  it('should return a message', async () => {
    // Настраиваем мок для возврата ожидаемого ответа
    mockedAxios.get.mockResolvedValueOnce({
      status: 200,
      data: { message: 'Hello API' },
    });

    // Выполняем запрос
    const res = await axios.get('/api');

    // Проверяем, что запрос был выполнен к правильному URL
    expect(mockedAxios.get).toHaveBeenCalledWith('/api');

    // Проверяем ответ
    expect(res.status).toBe(200);
    expect(res.data).toEqual({ message: 'Hello API' });
  });
});
