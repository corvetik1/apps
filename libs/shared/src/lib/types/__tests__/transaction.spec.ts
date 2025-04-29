import { describe, it, expect } from '@jest/globals';
import {
  TransactionType,
  Transaction,
  CreateTransactionDto,
  TransactionResponseDto,
} from '../transaction';

describe('Transaction типы', () => {
  describe('TransactionType enum', () => {
    it('должен содержать все необходимые типы транзакций', () => {
      expect(TransactionType.Income).toBe('income');
      expect(TransactionType.Expense).toBe('expense');
    });
  });

  describe('Transaction интерфейс', () => {
    it('должен позволять создавать корректные объекты транзакции', () => {
      const transaction: Transaction = {
        id: '1',
        tenderId: 'tender1',
        amount: 1000,
        currency: 'RUB',
        date: '2023-01-01T00:00:00Z',
        type: TransactionType.Income,
        description: 'Зарплата',
        accountId: 'account1',
        createdAt: '2023-01-01T00:00:00Z',
        updatedAt: '2023-01-01T00:00:00Z',
      };

      expect(transaction.id).toBe('1');
      expect(transaction.tenderId).toBe('tender1');
      expect(transaction.amount).toBe(1000);
      expect(transaction.currency).toBe('RUB');
      expect(transaction.date).toBe('2023-01-01T00:00:00Z');
      expect(transaction.type).toBe(TransactionType.Income);
      expect(transaction.description).toBe('Зарплата');
      expect(transaction.accountId).toBe('account1');
      expect(transaction.createdAt).toBe('2023-01-01T00:00:00Z');
      expect(transaction.updatedAt).toBe('2023-01-01T00:00:00Z');
    });

    it('должен позволять создавать транзакции с опциональными полями', () => {
      const transaction: Transaction = {
        id: '1',
        tenderId: 'tender1',
        amount: 1000,
        currency: 'RUB',
        date: '2023-01-01T00:00:00Z',
        type: TransactionType.Expense,
        description: 'Покупка',
        accountId: 'account1',
        categoryId: 'category1',
        counterpartyId: 'counterparty1',
        tags: ['покупка', 'электроника'],
        createdAt: '2023-01-01T00:00:00Z',
        updatedAt: '2023-01-01T00:00:00Z',
      };

      expect(transaction.id).toBe('1');
      expect(transaction.tenderId).toBe('tender1');
      expect(transaction.amount).toBe(1000);
      expect(transaction.currency).toBe('RUB');
      expect(transaction.date).toBe('2023-01-01T00:00:00Z');
      expect(transaction.type).toBe(TransactionType.Expense);
      expect(transaction.description).toBe('Покупка');
      expect(transaction.accountId).toBe('account1');
      expect(transaction.categoryId).toBe('category1');
      expect(transaction.counterpartyId).toBe('counterparty1');
      expect(transaction.tags).toEqual(['покупка', 'электроника']);
      expect(transaction.createdAt).toBe('2023-01-01T00:00:00Z');
      expect(transaction.updatedAt).toBe('2023-01-01T00:00:00Z');
    });
  });

  describe('CreateTransactionDto', () => {
    it('должен позволять создавать DTO без id и временных меток', () => {
      const createTransactionDto: CreateTransactionDto = {
        tenderId: 'tender1',
        amount: 1000,
        currency: 'RUB',
        date: '2023-01-01T00:00:00Z',
        type: TransactionType.Income,
        description: 'Зарплата',
        accountId: 'account1',
      };

      expect(createTransactionDto.tenderId).toBe('tender1');
      expect(createTransactionDto.amount).toBe(1000);
      expect(createTransactionDto.currency).toBe('RUB');
      expect(createTransactionDto.date).toBe('2023-01-01T00:00:00Z');
      expect(createTransactionDto.type).toBe(TransactionType.Income);
      expect(createTransactionDto.description).toBe('Зарплата');
      expect(createTransactionDto.accountId).toBe('account1');
      // @ts-expect-error - id не должен быть в CreateTransactionDto
      expect(createTransactionDto.id).toBeUndefined();
      // @ts-expect-error - createdAt не должен быть в CreateTransactionDto
      expect(createTransactionDto.createdAt).toBeUndefined();
      // @ts-expect-error - updatedAt не должен быть в CreateTransactionDto
      expect(createTransactionDto.updatedAt).toBeUndefined();
    });

    it('должен позволять создавать DTO с опциональными полями', () => {
      const createTransactionDto: CreateTransactionDto = {
        tenderId: 'tender1',
        amount: 1000,
        currency: 'RUB',
        date: '2023-01-01T00:00:00Z',
        type: TransactionType.Expense,
        description: 'Покупка',
        accountId: 'account1',
        categoryId: 'category1',
        counterpartyId: 'counterparty1',
        tags: ['покупка', 'электроника'],
      };

      expect(createTransactionDto.tenderId).toBe('tender1');
      expect(createTransactionDto.amount).toBe(1000);
      expect(createTransactionDto.currency).toBe('RUB');
      expect(createTransactionDto.date).toBe('2023-01-01T00:00:00Z');
      expect(createTransactionDto.type).toBe(TransactionType.Expense);
      expect(createTransactionDto.description).toBe('Покупка');
      expect(createTransactionDto.accountId).toBe('account1');
      expect(createTransactionDto.categoryId).toBe('category1');
      expect(createTransactionDto.counterpartyId).toBe('counterparty1');
      expect(createTransactionDto.tags).toEqual(['покупка', 'электроника']);
    });
  });

  describe('TransactionResponseDto', () => {
    it('должен содержать все поля Transaction', () => {
      const transactionResponseDto: TransactionResponseDto = {
        id: '1',
        tenderId: 'tender1',
        amount: 1000,
        currency: 'RUB',
        date: '2023-01-01T00:00:00Z',
        type: TransactionType.Income,
        description: 'Зарплата',
        accountId: 'account1',
        createdAt: '2023-01-01T00:00:00Z',
        updatedAt: '2023-01-01T00:00:00Z',
      };

      expect(transactionResponseDto.id).toBe('1');
      expect(transactionResponseDto.tenderId).toBe('tender1');
      expect(transactionResponseDto.amount).toBe(1000);
      expect(transactionResponseDto.currency).toBe('RUB');
      expect(transactionResponseDto.date).toBe('2023-01-01T00:00:00Z');
      expect(transactionResponseDto.type).toBe(TransactionType.Income);
      expect(transactionResponseDto.description).toBe('Зарплата');
      expect(transactionResponseDto.accountId).toBe('account1');
      expect(transactionResponseDto.createdAt).toBe('2023-01-01T00:00:00Z');
      expect(transactionResponseDto.updatedAt).toBe('2023-01-01T00:00:00Z');
    });
  });
});
