import { describe, it, expect } from '@jest/globals';
import {
  ReportType,
  ReportFormat,
  ReportStatus,
  Report,
  CreateReportDto,
  UpdateReportDto,
  ReportResponseDto,
} from '../report';

describe('Report типы', () => {
  describe('ReportType enum', () => {
    it('должен содержать все необходимые типы отчетов', () => {
      expect(ReportType.Financial).toBe('financial');
      expect(ReportType.Tax).toBe('tax');
      expect(ReportType.Budget).toBe('budget');
      expect(ReportType.Investment).toBe('investment');
      expect(ReportType.Expense).toBe('expense');
      expect(ReportType.Income).toBe('income');
      expect(ReportType.Custom).toBe('custom');
    });
  });

  describe('ReportFormat enum', () => {
    it('должен содержать все необходимые форматы отчетов', () => {
      expect(ReportFormat.PDF).toBe('pdf');
      expect(ReportFormat.Excel).toBe('excel');
      expect(ReportFormat.CSV).toBe('csv');
      expect(ReportFormat.JSON).toBe('json');
      expect(ReportFormat.HTML).toBe('html');
    });
  });

  describe('ReportStatus enum', () => {
    it('должен содержать все необходимые статусы отчетов', () => {
      expect(ReportStatus.Pending).toBe('pending');
      expect(ReportStatus.Generated).toBe('generated');
      expect(ReportStatus.Failed).toBe('failed');
      expect(ReportStatus.Expired).toBe('expired');
    });
  });

  describe('Report интерфейс', () => {
    it('должен позволять создавать корректные объекты отчета', () => {
      const report: Report = {
        id: '1',
        userId: 'user1',
        title: 'Финансовый отчет за 2023 год',
        description: 'Годовой финансовый отчет',
        type: ReportType.Financial,
        format: ReportFormat.PDF,
        status: ReportStatus.Generated,
        parameters: {
          startDate: '2023-01-01',
          endDate: '2023-12-31',
          includeCategories: ['income', 'expense', 'investment'],
          groupBy: 'month',
        },
        fileUrl: 'https://example.com/reports/financial-2023.pdf',
        fileSize: 1024000,
        generatedAt: '2024-01-05T10:00:00Z',
        expiresAt: '2025-01-05T10:00:00Z',
        filters: {
          accounts: ['account1', 'account2'],
          categories: ['salary', 'rent', 'food'],
          minAmount: 1000,
          maxAmount: 50000,
        },
        tags: ['годовой', 'финансы', '2023'],
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-05T10:00:00Z',
      };

      expect(report.id).toBe('1');
      expect(report.userId).toBe('user1');
      expect(report.title).toBe('Финансовый отчет за 2023 год');
      expect(report.description).toBe('Годовой финансовый отчет');
      expect(report.type).toBe(ReportType.Financial);
      expect(report.format).toBe(ReportFormat.PDF);
      expect(report.status).toBe(ReportStatus.Generated);
      expect(report.parameters).toEqual({
        startDate: '2023-01-01',
        endDate: '2023-12-31',
        includeCategories: ['income', 'expense', 'investment'],
        groupBy: 'month',
      });
      expect(report.fileUrl).toBe('https://example.com/reports/financial-2023.pdf');
      expect(report.fileSize).toBe(1024000);
      expect(report.generatedAt).toBe('2024-01-05T10:00:00Z');
      expect(report.expiresAt).toBe('2025-01-05T10:00:00Z');
      expect(report.filters).toEqual({
        accounts: ['account1', 'account2'],
        categories: ['salary', 'rent', 'food'],
        minAmount: 1000,
        maxAmount: 50000,
      });
      expect(report.tags).toEqual(['годовой', 'финансы', '2023']);
      expect(report.createdAt).toBe('2024-01-01T00:00:00Z');
      expect(report.updatedAt).toBe('2024-01-05T10:00:00Z');
    });

    it('должен позволять создавать отчеты с опциональными полями', () => {
      const report: Report = {
        id: '1',
        userId: 'user1',
        title: 'Налоговый отчет',
        description: 'Отчет по налогам',
        type: ReportType.Tax,
        format: ReportFormat.Excel,
        status: ReportStatus.Pending,
        parameters: {
          year: '2023',
          taxTypes: ['income', 'property'],
        },
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      };

      expect(report.id).toBe('1');
      expect(report.userId).toBe('user1');
      expect(report.title).toBe('Налоговый отчет');
      expect(report.fileUrl).toBeUndefined();
      expect(report.fileSize).toBeUndefined();
      expect(report.generatedAt).toBeUndefined();
      expect(report.expiresAt).toBeUndefined();
      expect(report.filters).toBeUndefined();
      expect(report.tags).toBeUndefined();
    });
  });

  describe('CreateReportDto', () => {
    it('должен позволять создавать DTO без id и временных меток', () => {
      const createReportDto: CreateReportDto = {
        userId: 'user1',
        title: 'Финансовый отчет за 2023 год',
        description: 'Годовой финансовый отчет',
        type: ReportType.Financial,
        format: ReportFormat.PDF,
        parameters: {
          startDate: '2023-01-01',
          endDate: '2023-12-31',
          includeCategories: ['income', 'expense', 'investment'],
          groupBy: 'month',
        },
        filters: {
          accounts: ['account1', 'account2'],
          categories: ['salary', 'rent', 'food'],
          minAmount: 1000,
          maxAmount: 50000,
        },
        tags: ['годовой', 'финансы', '2023'],
      };

      expect(createReportDto.userId).toBe('user1');
      expect(createReportDto.title).toBe('Финансовый отчет за 2023 год');
      expect(createReportDto.description).toBe('Годовой финансовый отчет');
      expect(createReportDto.type).toBe(ReportType.Financial);
      expect(createReportDto.format).toBe(ReportFormat.PDF);
      expect(createReportDto.parameters).toEqual({
        startDate: '2023-01-01',
        endDate: '2023-12-31',
        includeCategories: ['income', 'expense', 'investment'],
        groupBy: 'month',
      });
      expect(createReportDto.filters).toEqual({
        accounts: ['account1', 'account2'],
        categories: ['salary', 'rent', 'food'],
        minAmount: 1000,
        maxAmount: 50000,
      });
      expect(createReportDto.tags).toEqual(['годовой', 'финансы', '2023']);
      // @ts-expect-error - id не должен быть в CreateReportDto
      expect(createReportDto.id).toBeUndefined();
      // @ts-expect-error - status не должен быть в CreateReportDto
      expect(createReportDto.status).toBeUndefined();
      // @ts-expect-error - fileUrl не должен быть в CreateReportDto
      expect(createReportDto.fileUrl).toBeUndefined();
      // @ts-expect-error - fileSize не должен быть в CreateReportDto
      expect(createReportDto.fileSize).toBeUndefined();
      // @ts-expect-error - generatedAt не должен быть в CreateReportDto
      expect(createReportDto.generatedAt).toBeUndefined();
      // @ts-expect-error - expiresAt не должен быть в CreateReportDto
      expect(createReportDto.expiresAt).toBeUndefined();
      // @ts-expect-error - createdAt не должен быть в CreateReportDto
      expect(createReportDto.createdAt).toBeUndefined();
      // @ts-expect-error - updatedAt не должен быть в CreateReportDto
      expect(createReportDto.updatedAt).toBeUndefined();
    });
  });

  describe('UpdateReportDto', () => {
    it('должен позволять обновлять только некоторые поля', () => {
      const updateReportDto: UpdateReportDto = {
        title: 'Обновленный финансовый отчет за 2023 год',
        status: ReportStatus.Generated,
        fileUrl: 'https://example.com/reports/financial-2023-updated.pdf',
        fileSize: 1048576,
        generatedAt: '2024-01-10T15:30:00Z',
      };

      expect(updateReportDto.title).toBe('Обновленный финансовый отчет за 2023 год');
      expect(updateReportDto.status).toBe(ReportStatus.Generated);
      expect(updateReportDto.fileUrl).toBe(
        'https://example.com/reports/financial-2023-updated.pdf',
      );
      expect(updateReportDto.fileSize).toBe(1048576);
      expect(updateReportDto.generatedAt).toBe('2024-01-10T15:30:00Z');
      // Все поля должны быть опциональными
      const emptyUpdateDto: UpdateReportDto = {};
      expect(emptyUpdateDto).toEqual({});
    });
  });

  describe('ReportResponseDto', () => {
    it('должен содержать все поля Report', () => {
      const reportResponseDto: ReportResponseDto = {
        id: '1',
        userId: 'user1',
        title: 'Финансовый отчет за 2023 год',
        description: 'Годовой финансовый отчет',
        type: ReportType.Financial,
        format: ReportFormat.PDF,
        status: ReportStatus.Generated,
        parameters: {
          startDate: '2023-01-01',
          endDate: '2023-12-31',
          includeCategories: ['income', 'expense', 'investment'],
          groupBy: 'month',
        },
        fileUrl: 'https://example.com/reports/financial-2023.pdf',
        fileSize: 1024000,
        generatedAt: '2024-01-05T10:00:00Z',
        expiresAt: '2025-01-05T10:00:00Z',
        filters: {
          accounts: ['account1', 'account2'],
          categories: ['salary', 'rent', 'food'],
          minAmount: 1000,
          maxAmount: 50000,
        },
        tags: ['годовой', 'финансы', '2023'],
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-05T10:00:00Z',
      };

      expect(reportResponseDto.id).toBe('1');
      expect(reportResponseDto.userId).toBe('user1');
      expect(reportResponseDto.title).toBe('Финансовый отчет за 2023 год');
      expect(reportResponseDto.description).toBe('Годовой финансовый отчет');
      expect(reportResponseDto.type).toBe(ReportType.Financial);
      expect(reportResponseDto.format).toBe(ReportFormat.PDF);
      expect(reportResponseDto.status).toBe(ReportStatus.Generated);
      expect(reportResponseDto.parameters).toEqual({
        startDate: '2023-01-01',
        endDate: '2023-12-31',
        includeCategories: ['income', 'expense', 'investment'],
        groupBy: 'month',
      });
      expect(reportResponseDto.fileUrl).toBe('https://example.com/reports/financial-2023.pdf');
      expect(reportResponseDto.fileSize).toBe(1024000);
      expect(reportResponseDto.generatedAt).toBe('2024-01-05T10:00:00Z');
      expect(reportResponseDto.expiresAt).toBe('2025-01-05T10:00:00Z');
      expect(reportResponseDto.filters).toEqual({
        accounts: ['account1', 'account2'],
        categories: ['salary', 'rent', 'food'],
        minAmount: 1000,
        maxAmount: 50000,
      });
      expect(reportResponseDto.tags).toEqual(['годовой', 'финансы', '2023']);
      expect(reportResponseDto.createdAt).toBe('2024-01-01T00:00:00Z');
      expect(reportResponseDto.updatedAt).toBe('2024-01-05T10:00:00Z');
    });
  });
});
