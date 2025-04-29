import { describe, it, expect } from '@jest/globals';
import {
  DebitCard,
  CreateDebitCardDto,
  UpdateDebitCardDto,
  DebitCardResponseDto,
} from '../debit-card';

describe('DebitCard типы', () => {
  describe('DebitCard интерфейс', () => {
    it('должен позволять создавать корректные объекты дебетовой карты', () => {
      const debitCard: DebitCard = {
        id: '1',
        accountId: 'account1',
        userId: 'user1',
        cardNumber: '1234 5678 9012 3456',
        cardHolder: 'IVAN IVANOV',
        expiryDate: '12/25',
        cvv: '123',
        isActive: true,
        balance: 5000,
        currency: 'RUB',
        bank: 'Сбербанк',
        paymentSystem: 'Visa',
        createdAt: '2023-01-01T00:00:00Z',
        updatedAt: '2023-01-01T00:00:00Z',
      };

      expect(debitCard.id).toBe('1');
      expect(debitCard.accountId).toBe('account1');
      expect(debitCard.userId).toBe('user1');
      expect(debitCard.cardNumber).toBe('1234 5678 9012 3456');
      expect(debitCard.cardHolder).toBe('IVAN IVANOV');
      expect(debitCard.expiryDate).toBe('12/25');
      expect(debitCard.cvv).toBe('123');
      expect(debitCard.isActive).toBe(true);
      expect(debitCard.balance).toBe(5000);
      expect(debitCard.currency).toBe('RUB');
      expect(debitCard.bank).toBe('Сбербанк');
      expect(debitCard.paymentSystem).toBe('Visa');
      expect(debitCard.createdAt).toBe('2023-01-01T00:00:00Z');
      expect(debitCard.updatedAt).toBe('2023-01-01T00:00:00Z');
    });

    it('должен позволять создавать карты с опциональными полями', () => {
      const debitCard: DebitCard = {
        id: '1',
        accountId: 'account1',
        userId: 'user1',
        cardNumber: '1234 5678 9012 3456',
        cardHolder: 'IVAN IVANOV',
        expiryDate: '12/25',
        cvv: '123',
        isActive: true,
        balance: 5000,
        currency: 'RUB',
        createdAt: '2023-01-01T00:00:00Z',
        updatedAt: '2023-01-01T00:00:00Z',
      };

      expect(debitCard.id).toBe('1');
      expect(debitCard.accountId).toBe('account1');
      expect(debitCard.bank).toBeUndefined();
      expect(debitCard.paymentSystem).toBeUndefined();
    });
  });

  describe('CreateDebitCardDto', () => {
    it('должен позволять создавать DTO без id и временных меток', () => {
      const createDebitCardDto: CreateDebitCardDto = {
        accountId: 'account1',
        userId: 'user1',
        cardNumber: '1234 5678 9012 3456',
        cardHolder: 'IVAN IVANOV',
        expiryDate: '12/25',
        cvv: '123',
        isActive: true,
        balance: 5000,
        currency: 'RUB',
        bank: 'Сбербанк',
        paymentSystem: 'Visa',
      };

      expect(createDebitCardDto.accountId).toBe('account1');
      expect(createDebitCardDto.userId).toBe('user1');
      expect(createDebitCardDto.cardNumber).toBe('1234 5678 9012 3456');
      expect(createDebitCardDto.cardHolder).toBe('IVAN IVANOV');
      expect(createDebitCardDto.expiryDate).toBe('12/25');
      expect(createDebitCardDto.cvv).toBe('123');
      expect(createDebitCardDto.isActive).toBe(true);
      expect(createDebitCardDto.balance).toBe(5000);
      expect(createDebitCardDto.currency).toBe('RUB');
      expect(createDebitCardDto.bank).toBe('Сбербанк');
      expect(createDebitCardDto.paymentSystem).toBe('Visa');
      // @ts-expect-error - id не должен быть в CreateDebitCardDto
      expect(createDebitCardDto.id).toBeUndefined();
      // @ts-expect-error - createdAt не должен быть в CreateDebitCardDto
      expect(createDebitCardDto.createdAt).toBeUndefined();
      // @ts-expect-error - updatedAt не должен быть в CreateDebitCardDto
      expect(createDebitCardDto.updatedAt).toBeUndefined();
    });
  });

  describe('UpdateDebitCardDto', () => {
    it('должен позволять обновлять только некоторые поля', () => {
      const updateDebitCardDto: UpdateDebitCardDto = {
        isActive: false,
        balance: 6000,
      };

      expect(updateDebitCardDto.isActive).toBe(false);
      expect(updateDebitCardDto.balance).toBe(6000);
      // Все поля должны быть опциональными
      const emptyUpdateDto: UpdateDebitCardDto = {};
      expect(emptyUpdateDto).toEqual({});
    });
  });

  describe('DebitCardResponseDto', () => {
    it('должен содержать все поля DebitCard кроме cvv', () => {
      const debitCardResponseDto: DebitCardResponseDto = {
        id: '1',
        accountId: 'account1',
        userId: 'user1',
        cardNumber: '1234 5678 9012 3456',
        cardHolder: 'IVAN IVANOV',
        expiryDate: '12/25',
        isActive: true,
        balance: 5000,
        currency: 'RUB',
        bank: 'Сбербанк',
        paymentSystem: 'Visa',
        createdAt: '2023-01-01T00:00:00Z',
        updatedAt: '2023-01-01T00:00:00Z',
      };

      expect(debitCardResponseDto.id).toBe('1');
      expect(debitCardResponseDto.accountId).toBe('account1');
      expect(debitCardResponseDto.userId).toBe('user1');
      expect(debitCardResponseDto.cardNumber).toBe('1234 5678 9012 3456');
      expect(debitCardResponseDto.cardHolder).toBe('IVAN IVANOV');
      expect(debitCardResponseDto.expiryDate).toBe('12/25');
      expect(debitCardResponseDto.isActive).toBe(true);
      expect(debitCardResponseDto.balance).toBe(5000);
      expect(debitCardResponseDto.currency).toBe('RUB');
      expect(debitCardResponseDto.bank).toBe('Сбербанк');
      expect(debitCardResponseDto.paymentSystem).toBe('Visa');
      expect(debitCardResponseDto.createdAt).toBe('2023-01-01T00:00:00Z');
      expect(debitCardResponseDto.updatedAt).toBe('2023-01-01T00:00:00Z');
      // @ts-expect-error - cvv не должен быть в DebitCardResponseDto
      expect(debitCardResponseDto.cvv).toBeUndefined();
    });
  });
});
