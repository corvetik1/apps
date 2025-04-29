import { describe, it, expect } from '@jest/globals';
import {
  AnalyticsPeriod,
  ChartData,
  AnalyticsMetrics,
  AnalyticsRequest,
  AnalyticsResponse,
} from '../analytics';

describe('Analytics типы', () => {
  describe('AnalyticsPeriod enum', () => {
    it('должен содержать все необходимые периоды аналитики', () => {
      expect(AnalyticsPeriod.Day).toBe('day');
      expect(AnalyticsPeriod.Week).toBe('week');
      expect(AnalyticsPeriod.Month).toBe('month');
      expect(AnalyticsPeriod.Quarter).toBe('quarter');
      expect(AnalyticsPeriod.Year).toBe('year');
    });
  });

  describe('ChartData интерфейс', () => {
    it('должен позволять создавать корректные объекты данных для графиков', () => {
      const chartData: ChartData = {
        labels: ['Январь', 'Февраль', 'Март'],
        datasets: [
          {
            label: 'Доходы',
            data: [1000, 1500, 2000],
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
          },
          {
            label: 'Расходы',
            data: [800, 1200, 1800],
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderColor: 'rgba(255, 99, 132, 1)',
          },
        ],
      };

      expect(chartData.labels).toEqual(['Январь', 'Февраль', 'Март']);
      expect(chartData.datasets).toHaveLength(2);
      expect(chartData.datasets[0].label).toBe('Доходы');
      expect(chartData.datasets[0].data).toEqual([1000, 1500, 2000]);
      expect(chartData.datasets[1].label).toBe('Расходы');
      expect(chartData.datasets[1].data).toEqual([800, 1200, 1800]);
    });
  });

  describe('AnalyticsMetrics интерфейс', () => {
    it('должен позволять создавать корректные объекты метрик', () => {
      const metrics: AnalyticsMetrics = {
        totalIncome: 10000,
        totalExpense: 8000,
        balance: 2000,
        transactionCount: 50,
        averageTransaction: 200,
        topCategories: [
          { name: 'Продукты', amount: 3000 },
          { name: 'Транспорт', amount: 2000 },
        ],
      };

      expect(metrics.totalIncome).toBe(10000);
      expect(metrics.totalExpense).toBe(8000);
      expect(metrics.balance).toBe(2000);
      expect(metrics.transactionCount).toBe(50);
      expect(metrics.averageTransaction).toBe(200);
      expect(metrics.topCategories).toHaveLength(2);
      expect(metrics.topCategories[0].name).toBe('Продукты');
      expect(metrics.topCategories[0].amount).toBe(3000);
    });
  });

  describe('AnalyticsRequest интерфейс', () => {
    it('должен позволять создавать корректные запросы на аналитику', () => {
      const request: AnalyticsRequest = {
        userId: 'user1',
        period: AnalyticsPeriod.Month,
        startDate: '2023-01-01',
        endDate: '2023-01-31',
        includeCharts: true,
        includeMetrics: true,
        categories: ['Продукты', 'Транспорт'],
      };

      expect(request.userId).toBe('user1');
      expect(request.period).toBe(AnalyticsPeriod.Month);
      expect(request.startDate).toBe('2023-01-01');
      expect(request.endDate).toBe('2023-01-31');
      expect(request.includeCharts).toBe(true);
      expect(request.includeMetrics).toBe(true);
      expect(request.categories).toEqual(['Продукты', 'Транспорт']);
    });

    it('должен позволять создавать запросы с минимальными параметрами', () => {
      const request: AnalyticsRequest = {
        userId: 'user1',
        period: AnalyticsPeriod.Month,
      };

      expect(request.userId).toBe('user1');
      expect(request.period).toBe(AnalyticsPeriod.Month);
      expect(request.startDate).toBeUndefined();
      expect(request.endDate).toBeUndefined();
      expect(request.includeCharts).toBeUndefined();
      expect(request.includeMetrics).toBeUndefined();
      expect(request.categories).toBeUndefined();
    });
  });

  describe('AnalyticsResponse интерфейс', () => {
    it('должен позволять создавать корректные ответы с аналитикой', () => {
      const response: AnalyticsResponse = {
        userId: 'user1',
        period: AnalyticsPeriod.Month,
        startDate: '2023-01-01',
        endDate: '2023-01-31',
        metrics: {
          totalIncome: 10000,
          totalExpense: 8000,
          balance: 2000,
          transactionCount: 50,
          averageTransaction: 200,
          topCategories: [
            { name: 'Продукты', amount: 3000 },
            { name: 'Транспорт', amount: 2000 },
          ],
        },
        charts: {
          income: {
            labels: ['Неделя 1', 'Неделя 2', 'Неделя 3', 'Неделя 4'],
            datasets: [
              {
                label: 'Доходы',
                data: [2000, 3000, 2500, 2500],
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
              },
            ],
          },
          expense: {
            labels: ['Неделя 1', 'Неделя 2', 'Неделя 3', 'Неделя 4'],
            datasets: [
              {
                label: 'Расходы',
                data: [1800, 2200, 2000, 2000],
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderColor: 'rgba(255, 99, 132, 1)',
              },
            ],
          },
          categories: {
            labels: ['Продукты', 'Транспорт', 'Развлечения', 'Прочее'],
            datasets: [
              {
                label: 'Расходы по категориям',
                data: [3000, 2000, 1500, 1500],
                backgroundColor: [
                  'rgba(255, 99, 132, 0.2)',
                  'rgba(54, 162, 235, 0.2)',
                  'rgba(255, 206, 86, 0.2)',
                  'rgba(75, 192, 192, 0.2)',
                ],
                borderColor: [
                  'rgba(255, 99, 132, 1)',
                  'rgba(54, 162, 235, 1)',
                  'rgba(255, 206, 86, 1)',
                  'rgba(75, 192, 192, 1)',
                ],
              },
            ],
          },
        },
      };

      expect(response.userId).toBe('user1');
      expect(response.period).toBe(AnalyticsPeriod.Month);
      expect(response.startDate).toBe('2023-01-01');
      expect(response.endDate).toBe('2023-01-31');

      // Проверка метрик
      expect(response.metrics.totalIncome).toBe(10000);
      expect(response.metrics.totalExpense).toBe(8000);
      expect(response.metrics.balance).toBe(2000);

      // Проверка графиков
      expect(response.charts.income.labels).toEqual([
        'Неделя 1',
        'Неделя 2',
        'Неделя 3',
        'Неделя 4',
      ]);
      expect(response.charts.expense.datasets[0].label).toBe('Расходы');
      expect(response.charts.categories.datasets[0].data).toEqual([3000, 2000, 1500, 1500]);
    });
  });
});
