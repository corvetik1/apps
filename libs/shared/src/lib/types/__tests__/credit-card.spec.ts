import { describe, it, expect } from '@jest/globals';
import {
  CreditCard,
  CreateCreditCardDto,
  UpdateCreditCardDto,
  CreditCardResponseDto,
} from '../credit-card';

describe('CreditCard типы', () => {
  describe('CreditCard интерфейс', () => {
    it('должен позволять создавать корректные объекты кредитной карты', () => {
      const creditCard: CreditCard = {
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
        creditLimit: 100000,
        debt: 5000,
        gracePeriod: 30,
        interestRate: 19.9,
        minPayment: 1000,
        paymentDueDate: '2023-02-01',
        isPaid: false,
        createdAt: '2023-01-01T00:00:00Z',
        updatedAt: '2023-01-01T00:00:00Z',
      };

      expect(creditCard.id).toBe('1');
      expect(creditCard.accountId).toBe('account1');
      expect(creditCard.userId).toBe('user1');
      expect(creditCard.cardNumber).toBe('1234 5678 9012 3456');
      expect(creditCard.cardHolder).toBe('IVAN IVANOV');
      expect(creditCard.expiryDate).toBe('12/25');
      expect(creditCard.cvv).toBe('123');
      expect(creditCard.isActive).toBe(true);
      expect(creditCard.balance).toBe(5000);
      expect(creditCard.currency).toBe('RUB');
      expect(creditCard.bank).toBe('Сбербанк');
      expect(creditCard.paymentSystem).toBe('Visa');
      expect(creditCard.creditLimit).toBe(100000);
      expect(creditCard.debt).toBe(5000);
      expect(creditCard.gracePeriod).toBe(30);
      expect(creditCard.interestRate).toBe(19.9);
      expect(creditCard.minPayment).toBe(1000);
      expect(creditCard.paymentDueDate).toBe('2023-02-01');
      expect(creditCard.isPaid).toBe(false);
      expect(creditCard.createdAt).toBe('2023-01-01T00:00:00Z');
      expect(creditCard.updatedAt).toBe('2023-01-01T00:00:00Z');
    });

    it('должен позволять создавать карты с опциональными полями', () => {
      const creditCard: CreditCard = {
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
        creditLimit: 100000,
        debt: 5000,
        gracePeriod: 30,
        interestRate: 19.9,
        minPayment: 1000,
        paymentDueDate: '2023-02-01',
        isPaid: false,
        createdAt: '2023-01-01T00:00:00Z',
        updatedAt: '2023-01-01T00:00:00Z',
      };

      expect(creditCard.id).toBe('1');
      expect(creditCard.accountId).toBe('account1');
      expect(creditCard.bank).toBeUndefined();
      expect(creditCard.paymentSystem).toBeUndefined();
    });
  });

  describe('CreateCreditCardDto', () => {
    it('должен позволять создавать DTO без id и временных меток', () => {
      const createCreditCardDto: CreateCreditCardDto = {
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
        creditLimit: 100000,
        gracePeriod: 30,
        interestRate: 19.9,
        minPayment: 1000,
        paymentDueDate: '2023-02-01',
      };

      expect(createCreditCardDto.accountId).toBe('account1');
      expect(createCreditCardDto.userId).toBe('user1');
      expect(createCreditCardDto.cardNumber).toBe('1234 5678 9012 3456');
      expect(createCreditCardDto.cardHolder).toBe('IVAN IVANOV');
      expect(createCreditCardDto.expiryDate).toBe('12/25');
      expect(createCreditCardDto.cvv).toBe('123');
      expect(createCreditCardDto.isActive).toBe(true);
      expect(createCreditCardDto.balance).toBe(5000);
      expect(createCreditCardDto.currency).toBe('RUB');
      expect(createCreditCardDto.bank).toBe('Сбербанк');
      expect(createCreditCardDto.paymentSystem).toBe('Visa');
      expect(createCreditCardDto.creditLimit).toBe(100000);
      expect(createCreditCardDto.gracePeriod).toBe(30);
      expect(createCreditCardDto.interestRate).toBe(19.9);
      expect(createCreditCardDto.minPayment).toBe(1000);
      expect(createCreditCardDto.paymentDueDate).toBe('2023-02-01');
      // @ts-expect-error - id не должен быть в CreateCreditCardDto
      expect(createCreditCardDto.id).toBeUndefined();
      // @ts-expect-error - createdAt не должен быть в CreateCreditCardDto
      expect(createCreditCardDto.createdAt).toBeUndefined();
      // @ts-expect-error - updatedAt не должен быть в CreateCreditCardDto
      expect(createCreditCardDto.updatedAt).toBeUndefined();
    });
  });

  describe('UpdateCreditCardDto', () => {
    it('должен позволять обновлять только некоторые поля', () => {
      const updateCreditCardDto: UpdateCreditCardDto = {
        isActive: false,
        balance: 6000,
        debt: 4000,
        isPaid: true,
      };

      expect(updateCreditCardDto.isActive).toBe(false);
      expect(updateCreditCardDto.balance).toBe(6000);
      expect(updateCreditCardDto.debt).toBe(4000);
      expect(updateCreditCardDto.isPaid).toBe(true);
      // Все поля должны быть опциональными
      const emptyUpdateDto: UpdateCreditCardDto = {};
      expect(emptyUpdateDto).toEqual({});
    });
  });

  describe('CreditCardResponseDto', () => {
    it('должен содержать все поля CreditCard кроме cvv', () => {
      const creditCardResponseDto: CreditCardResponseDto = {
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
        creditLimit: 100000,
        debt: 5000,
        gracePeriod: 30,
        interestRate: 19.9,
        minPayment: 1000,
        paymentDueDate: '2023-02-01',
        isPaid: false,
        createdAt: '2023-01-01T00:00:00Z',
        updatedAt: '2023-01-01T00:00:00Z',
      };

      expect(creditCardResponseDto.id).toBe('1');
      expect(creditCardResponseDto.accountId).toBe('account1');
      expect(creditCardResponseDto.userId).toBe('user1');
      expect(creditCardResponseDto.cardNumber).toBe('1234 5678 9012 3456');
      expect(creditCardResponseDto.cardHolder).toBe('IVAN IVANOV');
      expect(creditCardResponseDto.expiryDate).toBe('12/25');
      expect(creditCardResponseDto.isActive).toBe(true);
      expect(creditCardResponseDto.balance).toBe(5000);
      expect(creditCardResponseDto.currency).toBe('RUB');
      expect(creditCardResponseDto.bank).toBe('Сбербанк');
      expect(creditCardResponseDto.paymentSystem).toBe('Visa');
      expect(creditCardResponseDto.creditLimit).toBe(100000);
      expect(creditCardResponseDto.debt).toBe(5000);
      expect(creditCardResponseDto.gracePeriod).toBe(30);
      expect(creditCardResponseDto.interestRate).toBe(19.9);
      expect(creditCardResponseDto.minPayment).toBe(1000);
      expect(creditCardResponseDto.paymentDueDate).toBe('2023-02-01');
      expect(creditCardResponseDto.isPaid).toBe(false);
      expect(creditCardResponseDto.createdAt).toBe('2023-01-01T00:00:00Z');
      expect(creditCardResponseDto.updatedAt).toBe('2023-01-01T00:00:00Z');
      // @ts-expect-error - cvv не должен быть в CreditCardResponseDto
      expect(creditCardResponseDto.cvv).toBeUndefined();
    });
  });
});
