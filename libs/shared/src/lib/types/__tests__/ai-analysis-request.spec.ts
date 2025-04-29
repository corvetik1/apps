import { describe, it, expect } from '@jest/globals';
import { AIAnalysisRequest } from '../ai-analysis';

describe('AIAnalysisRequest типы', () => {
  describe('AIAnalysisRequest интерфейс', () => {
    it('должен позволять создавать корректные объекты запроса на AI-анализ', () => {
      const request: AIAnalysisRequest = {
        userId: 'user1',
        prompt: 'Проанализируй мои расходы за последний месяц',
        data: {
          transactions: [
            {
              id: '1',
              amount: 1000,
              date: '2023-01-01',
              description: 'Продукты',
              type: 'expense',
            },
            {
              id: '2',
              amount: 5000,
              date: '2023-01-15',
              description: 'Зарплата',
              type: 'income',
            },
          ],
          period: {
            start: '2023-01-01',
            end: '2023-01-31',
          },
        },
        options: {
          language: 'ru',
          format: 'text',
          maxTokens: 500,
        },
      };

      expect(request.userId).toBe('user1');
      expect(request.prompt).toBe('Проанализируй мои расходы за последний месяц');
      expect(request.data.transactions).toHaveLength(2);
      expect(request.data.transactions?.[0].amount).toBe(1000);
      expect(request.data.transactions?.[1].description).toBe('Зарплата');
      expect(request.data.period?.start).toBe('2023-01-01');
      expect(request.data.period?.end).toBe('2023-01-31');
      expect(request.options?.language).toBe('ru');
      expect(request.options?.format).toBe('text');
      expect(request.options?.maxTokens).toBe(500);
    });

    it('должен позволять создавать запрос с минимальными параметрами', () => {
      const request: AIAnalysisRequest = {
        userId: 'user1',
        prompt: 'Проанализируй мои финансы',
        data: {},
      };

      expect(request.userId).toBe('user1');
      expect(request.prompt).toBe('Проанализируй мои финансы');
      expect(request.data).toEqual({});
      expect(request.options).toBeUndefined();
    });
  });
});
