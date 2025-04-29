import { describe, it, expect } from '@jest/globals';
import { AIAnalysisResponse } from '../ai-analysis';

describe('AIAnalysisResponse типы', () => {
  describe('AIAnalysisResponse интерфейс', () => {
    it('должен позволять создавать корректные объекты ответа AI-анализа', () => {
      const response: AIAnalysisResponse = {
        id: 'analysis1',
        userId: 'user1',
        requestId: 'req1',
        result: {
          text: 'За последний месяц ваши основные расходы были на продукты (1000 руб). Общий доход составил 5000 руб.',
          insights: [
            {
              title: 'Расходы на продукты',
              description: 'Вы потратили 1000 руб на продукты',
              importance: 5,
            },
          ],
          recommendations: [
            {
              title: 'Увеличьте сбережения',
              description: 'Рекомендуем увеличить сбережения',
              priority: 1,
            },
            {
              title: 'Инвестирование',
              description: 'Рассмотрите возможность инвестирования',
              priority: 2,
            },
          ],
          summary: 'За последний месяц ваши основные расходы были на продукты',
        },
        metadata: {
          processingTime: 0.5,
          modelVersion: '1.0',
          tokensUsed: 150,
        },
        createdAt: '2023-01-31T12:00:00Z',
      };

      expect(response.id).toBe('analysis1');
      expect(response.userId).toBe('user1');
      expect(response.requestId).toBe('req1');
      expect(response.result.text).toContain('За последний месяц');
      expect(response.result.insights).toHaveLength(1);
      expect(response.result.recommendations).toHaveLength(2);
      expect(response.result.recommendations?.[0].title).toBe('Увеличьте сбережения');
      expect(response.result.summary).toContain('За последний месяц');
      expect(response.metadata.processingTime).toBe(0.5);
      expect(response.metadata.modelVersion).toBe('1.0');
      expect(response.metadata.tokensUsed).toBe(150);
      expect(response.createdAt).toBe('2023-01-31T12:00:00Z');
    });

    it('должен позволять создавать ответ с минимальными параметрами', () => {
      const response: AIAnalysisResponse = {
        id: 'analysis2',
        userId: 'user1',
        requestId: 'req1',
        result: {
          text: 'Анализ завершен',
          insights: [],
          summary: 'Анализ завершен',
        },
        metadata: {
          processingTime: 0.1,
          modelVersion: '1.0',
          tokensUsed: 10,
        },
        createdAt: '2023-01-31T12:00:00Z',
      };

      expect(response.id).toBe('analysis2');
      expect(response.userId).toBe('user1');
      expect(response.requestId).toBe('req1');
      expect(response.result.text).toBe('Анализ завершен');
      expect(response.createdAt).toBe('2023-01-31T12:00:00Z');
    });
  });
});
