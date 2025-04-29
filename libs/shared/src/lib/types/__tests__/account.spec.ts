import { describe, it, expect } from '@jest/globals';
import {
  AccountType,
  Account,
  CreateAccountDto,
  UpdateAccountDto,
  AccountResponseDto,
} from '../account';

describe('Account типы', () => {
  describe('AccountType enum', () => {
    it('должен содержать все необходимые типы счетов', () => {
      expect(AccountType.Debit).toBe('debit');
      expect(AccountType.Credit).toBe('credit');
    });
  });

  describe('Account интерфейс', () => {
    it('должен позволять создавать корректные объекты дебетового счета', () => {
      const debitAccount: Account = {
        id: '1',
        name: 'Основной счет',
        type: AccountType.Debit,
        balance: 1000,
        userId: 'user1',
        createdAt: '2023-01-01T00:00:00Z',
        updatedAt: '2023-01-01T00:00:00Z',
      };

      expect(debitAccount.id).toBe('1');
      expect(debitAccount.name).toBe('Основной счет');
      expect(debitAccount.type).toBe(AccountType.Debit);
      expect(debitAccount.balance).toBe(1000);
      expect(debitAccount.userId).toBe('user1');
      expect(debitAccount.createdAt).toBe('2023-01-01T00:00:00Z');
      expect(debitAccount.updatedAt).toBe('2023-01-01T00:00:00Z');
    });

    it('должен позволять создавать корректные объекты кредитного счета', () => {
      const creditAccount: Account = {
        id: '2',
        name: 'Кредитная карта',
        type: AccountType.Credit,
        balance: 5000,
        userId: 'user1',
        creditLimit: 10000,
        debt: 5000,
        gracePeriod: '30',
        minPayment: 500,
        paymentDueDate: '2023-02-01',
        isPaid: false,
        createdAt: '2023-01-01T00:00:00Z',
        updatedAt: '2023-01-01T00:00:00Z',
      };

      expect(creditAccount.id).toBe('2');
      expect(creditAccount.name).toBe('Кредитная карта');
      expect(creditAccount.type).toBe(AccountType.Credit);
      expect(creditAccount.balance).toBe(5000);
      expect(creditAccount.userId).toBe('user1');
      expect(creditAccount.creditLimit).toBe(10000);
      expect(creditAccount.debt).toBe(5000);
      expect(creditAccount.gracePeriod).toBe('30');
      expect(creditAccount.minPayment).toBe(500);
      expect(creditAccount.paymentDueDate).toBe('2023-02-01');
      expect(creditAccount.isPaid).toBe(false);
      expect(creditAccount.createdAt).toBe('2023-01-01T00:00:00Z');
      expect(creditAccount.updatedAt).toBe('2023-01-01T00:00:00Z');
    });
  });

  describe('CreateAccountDto', () => {
    it('должен позволять создавать DTO без id и временных меток', () => {
      const createAccountDto: CreateAccountDto = {
        name: 'Новый счет',
        type: AccountType.Debit,
        balance: 0,
        userId: 'user1',
      };

      expect(createAccountDto.name).toBe('Новый счет');
      expect(createAccountDto.type).toBe(AccountType.Debit);
      expect(createAccountDto.balance).toBe(0);
      expect(createAccountDto.userId).toBe('user1');
      // @ts-expect-error - id не должен быть в CreateAccountDto
      expect(createAccountDto.id).toBeUndefined();
      // @ts-expect-error - createdAt не должен быть в CreateAccountDto
      expect(createAccountDto.createdAt).toBeUndefined();
      // @ts-expect-error - updatedAt не должен быть в CreateAccountDto
      expect(createAccountDto.updatedAt).toBeUndefined();
    });

    it('должен позволять создавать DTO для кредитного счета', () => {
      const createCreditAccountDto: CreateAccountDto = {
        name: 'Новая кредитная карта',
        type: AccountType.Credit,
        balance: 0,
        userId: 'user1',
        creditLimit: 10000,
        gracePeriod: '30',
        minPayment: 500,
      };

      expect(createCreditAccountDto.name).toBe('Новая кредитная карта');
      expect(createCreditAccountDto.type).toBe(AccountType.Credit);
      expect(createCreditAccountDto.balance).toBe(0);
      expect(createCreditAccountDto.userId).toBe('user1');
      expect(createCreditAccountDto.creditLimit).toBe(10000);
      expect(createCreditAccountDto.gracePeriod).toBe('30');
      expect(createCreditAccountDto.minPayment).toBe(500);
    });
  });

  describe('UpdateAccountDto', () => {
    it('должен позволять обновлять только некоторые поля', () => {
      const updateAccountDto: UpdateAccountDto = {
        name: 'Обновленный счет',
        balance: 2000,
      };

      expect(updateAccountDto.name).toBe('Обновленный счет');
      expect(updateAccountDto.balance).toBe(2000);
      // Все поля должны быть опциональными
      const emptyUpdateDto: UpdateAccountDto = {};
      expect(emptyUpdateDto).toEqual({});
    });
  });

  describe('AccountResponseDto', () => {
    it('должен содержать все поля Account', () => {
      const accountResponseDto: AccountResponseDto = {
        id: '1',
        name: 'Основной счет',
        type: AccountType.Debit,
        balance: 1000,
        userId: 'user1',
        createdAt: '2023-01-01T00:00:00Z',
        updatedAt: '2023-01-01T00:00:00Z',
      };

      expect(accountResponseDto.id).toBe('1');
      expect(accountResponseDto.name).toBe('Основной счет');
      expect(accountResponseDto.type).toBe(AccountType.Debit);
      expect(accountResponseDto.balance).toBe(1000);
      expect(accountResponseDto.userId).toBe('user1');
      expect(accountResponseDto.createdAt).toBe('2023-01-01T00:00:00Z');
      expect(accountResponseDto.updatedAt).toBe('2023-01-01T00:00:00Z');
    });
  });
});
