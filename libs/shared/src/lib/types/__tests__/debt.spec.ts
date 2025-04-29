import { describe, it, expect } from '@jest/globals';
import { DebtStatus, Debt, CreateDebtDto, UpdateDebtDto, DebtResponseDto } from '../debt';

describe('Debt типы', () => {
  describe('DebtStatus enum', () => {
    it('должен содержать все необходимые статусы долга', () => {
      expect(DebtStatus.Active).toBe('active');
      expect(DebtStatus.Paid).toBe('paid');
      expect(DebtStatus.Overdue).toBe('overdue');
      expect(DebtStatus.Restructured).toBe('restructured');
      expect(DebtStatus.WrittenOff).toBe('written_off');
    });
  });

  describe('Debt интерфейс', () => {
    it('должен позволять создавать корректные объекты долга', () => {
      const debt: Debt = {
        id: '1',
        userId: 'user1',
        title: 'Долг по кредиту',
        description: 'Задолженность по кредитному договору №123',
        amount: 50000,
        currency: 'RUB',
        interestRate: 12.5,
        startDate: '2023-01-01',
        endDate: '2023-12-31',
        status: DebtStatus.Active,
        remainingAmount: 40000,
        nextPaymentDate: '2023-02-01',
        nextPaymentAmount: 5000,
        creditorName: 'Банк Открытие',
        creditorContacts: 'info@open.ru',
        documentIds: ['doc1', 'doc2'],
        createdAt: '2023-01-01T00:00:00Z',
        updatedAt: '2023-01-01T00:00:00Z',
      };

      expect(debt.id).toBe('1');
      expect(debt.userId).toBe('user1');
      expect(debt.title).toBe('Долг по кредиту');
      expect(debt.description).toBe('Задолженность по кредитному договору №123');
      expect(debt.amount).toBe(50000);
      expect(debt.currency).toBe('RUB');
      expect(debt.interestRate).toBe(12.5);
      expect(debt.startDate).toBe('2023-01-01');
      expect(debt.endDate).toBe('2023-12-31');
      expect(debt.status).toBe(DebtStatus.Active);
      expect(debt.remainingAmount).toBe(40000);
      expect(debt.nextPaymentDate).toBe('2023-02-01');
      expect(debt.nextPaymentAmount).toBe(5000);
      expect(debt.creditorName).toBe('Банк Открытие');
      expect(debt.creditorContacts).toBe('info@open.ru');
      expect(debt.documentIds).toEqual(['doc1', 'doc2']);
      expect(debt.createdAt).toBe('2023-01-01T00:00:00Z');
      expect(debt.updatedAt).toBe('2023-01-01T00:00:00Z');
    });

    it('должен позволять создавать долги с опциональными полями', () => {
      const debt: Debt = {
        id: '1',
        userId: 'user1',
        title: 'Долг по кредиту',
        description: 'Задолженность по кредитному договору №123',
        amount: 50000,
        currency: 'RUB',
        interestRate: 12.5,
        startDate: '2023-01-01',
        endDate: '2023-12-31',
        status: DebtStatus.Active,
        remainingAmount: 40000,
        nextPaymentDate: '2023-02-01',
        nextPaymentAmount: 5000,
        createdAt: '2023-01-01T00:00:00Z',
        updatedAt: '2023-01-01T00:00:00Z',
      };

      expect(debt.id).toBe('1');
      expect(debt.userId).toBe('user1');
      expect(debt.creditorName).toBeUndefined();
      expect(debt.creditorContacts).toBeUndefined();
      expect(debt.documentIds).toBeUndefined();
    });
  });

  describe('CreateDebtDto', () => {
    it('должен позволять создавать DTO без id и временных меток', () => {
      const createDebtDto: CreateDebtDto = {
        userId: 'user1',
        title: 'Долг по кредиту',
        description: 'Задолженность по кредитному договору №123',
        amount: 50000,
        currency: 'RUB',
        interestRate: 12.5,
        startDate: '2023-01-01',
        endDate: '2023-12-31',
        status: DebtStatus.Active,
        remainingAmount: 50000,
        nextPaymentDate: '2023-02-01',
        nextPaymentAmount: 5000,
        creditorName: 'Банк Открытие',
        creditorContacts: 'info@open.ru',
        documentIds: ['doc1', 'doc2'],
      };

      expect(createDebtDto.userId).toBe('user1');
      expect(createDebtDto.title).toBe('Долг по кредиту');
      expect(createDebtDto.description).toBe('Задолженность по кредитному договору №123');
      expect(createDebtDto.amount).toBe(50000);
      expect(createDebtDto.currency).toBe('RUB');
      expect(createDebtDto.interestRate).toBe(12.5);
      expect(createDebtDto.startDate).toBe('2023-01-01');
      expect(createDebtDto.endDate).toBe('2023-12-31');
      expect(createDebtDto.status).toBe(DebtStatus.Active);
      expect(createDebtDto.remainingAmount).toBe(50000);
      expect(createDebtDto.nextPaymentDate).toBe('2023-02-01');
      expect(createDebtDto.nextPaymentAmount).toBe(5000);
      expect(createDebtDto.creditorName).toBe('Банк Открытие');
      expect(createDebtDto.creditorContacts).toBe('info@open.ru');
      expect(createDebtDto.documentIds).toEqual(['doc1', 'doc2']);
      // @ts-expect-error - id не должен быть в CreateDebtDto
      expect(createDebtDto.id).toBeUndefined();
      // @ts-expect-error - createdAt не должен быть в CreateDebtDto
      expect(createDebtDto.createdAt).toBeUndefined();
      // @ts-expect-error - updatedAt не должен быть в CreateDebtDto
      expect(createDebtDto.updatedAt).toBeUndefined();
    });
  });

  describe('UpdateDebtDto', () => {
    it('должен позволять обновлять только некоторые поля', () => {
      const updateDebtDto: UpdateDebtDto = {
        status: DebtStatus.Paid,
        remainingAmount: 0,
        nextPaymentDate: null,
        nextPaymentAmount: 0,
      };

      expect(updateDebtDto.status).toBe(DebtStatus.Paid);
      expect(updateDebtDto.remainingAmount).toBe(0);
      expect(updateDebtDto.nextPaymentDate).toBeNull();
      expect(updateDebtDto.nextPaymentAmount).toBe(0);
      // Все поля должны быть опциональными
      const emptyUpdateDto: UpdateDebtDto = {};
      expect(emptyUpdateDto).toEqual({});
    });
  });

  describe('DebtResponseDto', () => {
    it('должен содержать все поля Debt', () => {
      const debtResponseDto: DebtResponseDto = {
        id: '1',
        userId: 'user1',
        title: 'Долг по кредиту',
        description: 'Задолженность по кредитному договору №123',
        amount: 50000,
        currency: 'RUB',
        interestRate: 12.5,
        startDate: '2023-01-01',
        endDate: '2023-12-31',
        status: DebtStatus.Active,
        remainingAmount: 40000,
        nextPaymentDate: '2023-02-01',
        nextPaymentAmount: 5000,
        creditorName: 'Банк Открытие',
        creditorContacts: 'info@open.ru',
        documentIds: ['doc1', 'doc2'],
        createdAt: '2023-01-01T00:00:00Z',
        updatedAt: '2023-01-01T00:00:00Z',
      };

      expect(debtResponseDto.id).toBe('1');
      expect(debtResponseDto.userId).toBe('user1');
      expect(debtResponseDto.title).toBe('Долг по кредиту');
      expect(debtResponseDto.description).toBe('Задолженность по кредитному договору №123');
      expect(debtResponseDto.amount).toBe(50000);
      expect(debtResponseDto.currency).toBe('RUB');
      expect(debtResponseDto.interestRate).toBe(12.5);
      expect(debtResponseDto.startDate).toBe('2023-01-01');
      expect(debtResponseDto.endDate).toBe('2023-12-31');
      expect(debtResponseDto.status).toBe(DebtStatus.Active);
      expect(debtResponseDto.remainingAmount).toBe(40000);
      expect(debtResponseDto.nextPaymentDate).toBe('2023-02-01');
      expect(debtResponseDto.nextPaymentAmount).toBe(5000);
      expect(debtResponseDto.creditorName).toBe('Банк Открытие');
      expect(debtResponseDto.creditorContacts).toBe('info@open.ru');
      expect(debtResponseDto.documentIds).toEqual(['doc1', 'doc2']);
      expect(debtResponseDto.createdAt).toBe('2023-01-01T00:00:00Z');
      expect(debtResponseDto.updatedAt).toBe('2023-01-01T00:00:00Z');
    });
  });
});
