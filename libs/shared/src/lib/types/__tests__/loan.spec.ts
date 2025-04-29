import { describe, it, expect } from '@jest/globals';
import { LoanStatus, LoanType, Loan, CreateLoanDto, UpdateLoanDto, LoanResponseDto } from '../loan';

describe('Loan типы', () => {
  describe('LoanStatus enum', () => {
    it('должен содержать все необходимые статусы кредита', () => {
      expect(LoanStatus.Active).toBe('active');
      expect(LoanStatus.Paid).toBe('paid');
      expect(LoanStatus.Overdue).toBe('overdue');
      expect(LoanStatus.Restructured).toBe('restructured');
      expect(LoanStatus.Approved).toBe('approved');
      expect(LoanStatus.Rejected).toBe('rejected');
      expect(LoanStatus.Pending).toBe('pending');
    });
  });

  describe('LoanType enum', () => {
    it('должен содержать все необходимые типы кредита', () => {
      expect(LoanType.Mortgage).toBe('mortgage');
      expect(LoanType.Car).toBe('car');
      expect(LoanType.Consumer).toBe('consumer');
      expect(LoanType.Business).toBe('business');
      expect(LoanType.Education).toBe('education');
      expect(LoanType.Other).toBe('other');
    });
  });

  describe('Loan интерфейс', () => {
    it('должен позволять создавать корректные объекты кредита', () => {
      const loan: Loan = {
        id: '1',
        userId: 'user1',
        title: 'Ипотека',
        description: 'Ипотечный кредит на квартиру',
        type: LoanType.Mortgage,
        amount: 5000000,
        currency: 'RUB',
        interestRate: 9.5,
        term: 240, // 20 лет в месяцах
        startDate: '2023-01-01',
        endDate: '2043-01-01',
        status: LoanStatus.Active,
        remainingAmount: 4950000,
        nextPaymentDate: '2023-02-01',
        nextPaymentAmount: 45000,
        paymentSchedule: [
          { date: '2023-02-01', amount: 45000, principal: 25000, interest: 20000 },
          { date: '2023-03-01', amount: 45000, principal: 25500, interest: 19500 },
        ],
        lenderName: 'Сбербанк',
        lenderContacts: 'info@sberbank.ru',
        collateral: 'Квартира по адресу г. Москва, ул. Примерная, д. 1, кв. 1',
        documentIds: ['doc1', 'doc2'],
        createdAt: '2023-01-01T00:00:00Z',
        updatedAt: '2023-01-01T00:00:00Z',
      };

      expect(loan.id).toBe('1');
      expect(loan.userId).toBe('user1');
      expect(loan.title).toBe('Ипотека');
      expect(loan.description).toBe('Ипотечный кредит на квартиру');
      expect(loan.type).toBe(LoanType.Mortgage);
      expect(loan.amount).toBe(5000000);
      expect(loan.currency).toBe('RUB');
      expect(loan.interestRate).toBe(9.5);
      expect(loan.term).toBe(240);
      expect(loan.startDate).toBe('2023-01-01');
      expect(loan.endDate).toBe('2043-01-01');
      expect(loan.status).toBe(LoanStatus.Active);
      expect(loan.remainingAmount).toBe(4950000);
      expect(loan.nextPaymentDate).toBe('2023-02-01');
      expect(loan.nextPaymentAmount).toBe(45000);
      expect(loan.paymentSchedule).toBeDefined();
      expect(loan.paymentSchedule?.length).toBe(2);
      expect(loan.paymentSchedule?.[0]?.date).toBe('2023-02-01');
      expect(loan.paymentSchedule?.[0]?.amount).toBe(45000);
      expect(loan.lenderName).toBe('Сбербанк');
      expect(loan.lenderContacts).toBe('info@sberbank.ru');
      expect(loan.collateral).toBe('Квартира по адресу г. Москва, ул. Примерная, д. 1, кв. 1');
      expect(loan.documentIds).toEqual(['doc1', 'doc2']);
      expect(loan.createdAt).toBe('2023-01-01T00:00:00Z');
      expect(loan.updatedAt).toBe('2023-01-01T00:00:00Z');
    });

    it('должен позволять создавать кредиты с опциональными полями', () => {
      const loan: Loan = {
        id: '1',
        userId: 'user1',
        title: 'Потребительский кредит',
        description: 'Кредит на бытовую технику',
        type: LoanType.Consumer,
        amount: 100000,
        currency: 'RUB',
        interestRate: 15.5,
        term: 24, // 2 года в месяцах
        startDate: '2023-01-01',
        endDate: '2025-01-01',
        status: LoanStatus.Active,
        remainingAmount: 95000,
        nextPaymentDate: '2023-02-01',
        nextPaymentAmount: 4800,
        createdAt: '2023-01-01T00:00:00Z',
        updatedAt: '2023-01-01T00:00:00Z',
      };

      expect(loan.id).toBe('1');
      expect(loan.userId).toBe('user1');
      expect(loan.paymentSchedule).toBeUndefined();
      expect(loan.lenderName).toBeUndefined();
      expect(loan.lenderContacts).toBeUndefined();
      expect(loan.collateral).toBeUndefined();
      expect(loan.documentIds).toBeUndefined();
    });
  });

  describe('CreateLoanDto', () => {
    it('должен позволять создавать DTO без id и временных меток', () => {
      const createLoanDto: CreateLoanDto = {
        userId: 'user1',
        title: 'Ипотека',
        description: 'Ипотечный кредит на квартиру',
        type: LoanType.Mortgage,
        amount: 5000000,
        currency: 'RUB',
        interestRate: 9.5,
        term: 240,
        startDate: '2023-01-01',
        endDate: '2043-01-01',
        status: LoanStatus.Active,
        remainingAmount: 5000000,
        nextPaymentDate: '2023-02-01',
        nextPaymentAmount: 45000,
        paymentSchedule: [
          { date: '2023-02-01', amount: 45000, principal: 25000, interest: 20000 },
          { date: '2023-03-01', amount: 45000, principal: 25500, interest: 19500 },
        ],
        lenderName: 'Сбербанк',
        lenderContacts: 'info@sberbank.ru',
        collateral: 'Квартира по адресу г. Москва, ул. Примерная, д. 1, кв. 1',
        documentIds: ['doc1', 'doc2'],
      };

      expect(createLoanDto.userId).toBe('user1');
      expect(createLoanDto.title).toBe('Ипотека');
      expect(createLoanDto.description).toBe('Ипотечный кредит на квартиру');
      expect(createLoanDto.type).toBe(LoanType.Mortgage);
      expect(createLoanDto.amount).toBe(5000000);
      expect(createLoanDto.currency).toBe('RUB');
      expect(createLoanDto.interestRate).toBe(9.5);
      expect(createLoanDto.term).toBe(240);
      expect(createLoanDto.startDate).toBe('2023-01-01');
      expect(createLoanDto.endDate).toBe('2043-01-01');
      expect(createLoanDto.status).toBe(LoanStatus.Active);
      expect(createLoanDto.remainingAmount).toBe(5000000);
      expect(createLoanDto.nextPaymentDate).toBe('2023-02-01');
      expect(createLoanDto.nextPaymentAmount).toBe(45000);
      expect(createLoanDto.paymentSchedule).toHaveLength(2);
      expect(createLoanDto.lenderName).toBe('Сбербанк');
      expect(createLoanDto.lenderContacts).toBe('info@sberbank.ru');
      expect(createLoanDto.collateral).toBe(
        'Квартира по адресу г. Москва, ул. Примерная, д. 1, кв. 1',
      );
      expect(createLoanDto.documentIds).toEqual(['doc1', 'doc2']);
      // @ts-expect-error - id не должен быть в CreateLoanDto
      expect(createLoanDto.id).toBeUndefined();
      // @ts-expect-error - createdAt не должен быть в CreateLoanDto
      expect(createLoanDto.createdAt).toBeUndefined();
      // @ts-expect-error - updatedAt не должен быть в CreateLoanDto
      expect(createLoanDto.updatedAt).toBeUndefined();
    });
  });

  describe('UpdateLoanDto', () => {
    it('должен позволять обновлять только некоторые поля', () => {
      const updateLoanDto: UpdateLoanDto = {
        status: LoanStatus.Paid,
        remainingAmount: 0,
        nextPaymentDate: null,
        nextPaymentAmount: 0,
      };

      expect(updateLoanDto.status).toBe(LoanStatus.Paid);
      expect(updateLoanDto.remainingAmount).toBe(0);
      expect(updateLoanDto.nextPaymentDate).toBeNull();
      expect(updateLoanDto.nextPaymentAmount).toBe(0);
      // Все поля должны быть опциональными
      const emptyUpdateDto: UpdateLoanDto = {};
      expect(emptyUpdateDto).toEqual({});
    });
  });

  describe('LoanResponseDto', () => {
    it('должен содержать все поля Loan', () => {
      const loanResponseDto: LoanResponseDto = {
        id: '1',
        userId: 'user1',
        title: 'Ипотека',
        description: 'Ипотечный кредит на квартиру',
        type: LoanType.Mortgage,
        amount: 5000000,
        currency: 'RUB',
        interestRate: 9.5,
        term: 240,
        startDate: '2023-01-01',
        endDate: '2043-01-01',
        status: LoanStatus.Active,
        remainingAmount: 4950000,
        nextPaymentDate: '2023-02-01',
        nextPaymentAmount: 45000,
        paymentSchedule: [
          { date: '2023-02-01', amount: 45000, principal: 25000, interest: 20000 },
          { date: '2023-03-01', amount: 45000, principal: 25500, interest: 19500 },
        ],
        lenderName: 'Сбербанк',
        lenderContacts: 'info@sberbank.ru',
        collateral: 'Квартира по адресу г. Москва, ул. Примерная, д. 1, кв. 1',
        documentIds: ['doc1', 'doc2'],
        createdAt: '2023-01-01T00:00:00Z',
        updatedAt: '2023-01-01T00:00:00Z',
      };

      expect(loanResponseDto.id).toBe('1');
      expect(loanResponseDto.userId).toBe('user1');
      expect(loanResponseDto.title).toBe('Ипотека');
      expect(loanResponseDto.description).toBe('Ипотечный кредит на квартиру');
      expect(loanResponseDto.type).toBe(LoanType.Mortgage);
      expect(loanResponseDto.amount).toBe(5000000);
      expect(loanResponseDto.currency).toBe('RUB');
      expect(loanResponseDto.interestRate).toBe(9.5);
      expect(loanResponseDto.term).toBe(240);
      expect(loanResponseDto.startDate).toBe('2023-01-01');
      expect(loanResponseDto.endDate).toBe('2043-01-01');
      expect(loanResponseDto.status).toBe(LoanStatus.Active);
      expect(loanResponseDto.remainingAmount).toBe(4950000);
      expect(loanResponseDto.nextPaymentDate).toBe('2023-02-01');
      expect(loanResponseDto.nextPaymentAmount).toBe(45000);
      expect(loanResponseDto.paymentSchedule).toHaveLength(2);
      expect(loanResponseDto.lenderName).toBe('Сбербанк');
      expect(loanResponseDto.lenderContacts).toBe('info@sberbank.ru');
      expect(loanResponseDto.collateral).toBe(
        'Квартира по адресу г. Москва, ул. Примерная, д. 1, кв. 1',
      );
      expect(loanResponseDto.documentIds).toEqual(['doc1', 'doc2']);
      expect(loanResponseDto.createdAt).toBe('2023-01-01T00:00:00Z');
      expect(loanResponseDto.updatedAt).toBe('2023-01-01T00:00:00Z');
    });
  });
});
