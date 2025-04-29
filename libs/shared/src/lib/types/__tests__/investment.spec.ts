import { describe, it, expect } from '@jest/globals';
import {
  InvestmentType,
  InvestmentStatus,
  Investment,
  CreateInvestmentDto,
  UpdateInvestmentDto,
  InvestmentResponseDto,
} from '../investment';

describe('Investment типы', () => {
  describe('InvestmentType enum', () => {
    it('должен содержать все необходимые типы инвестиций', () => {
      expect(InvestmentType.Stock).toBe('stock');
      expect(InvestmentType.Bond).toBe('bond');
      expect(InvestmentType.ETF).toBe('etf');
      expect(InvestmentType.MutualFund).toBe('mutual_fund');
      expect(InvestmentType.RealEstate).toBe('real_estate');
      expect(InvestmentType.Deposit).toBe('deposit');
      expect(InvestmentType.Cryptocurrency).toBe('cryptocurrency');
      expect(InvestmentType.Other).toBe('other');
    });
  });

  describe('InvestmentStatus enum', () => {
    it('должен содержать все необходимые статусы инвестиций', () => {
      expect(InvestmentStatus.Active).toBe('active');
      expect(InvestmentStatus.Sold).toBe('sold');
      expect(InvestmentStatus.Pending).toBe('pending');
      expect(InvestmentStatus.Frozen).toBe('frozen');
      expect(InvestmentStatus.Closed).toBe('closed');
    });
  });

  describe('Investment интерфейс', () => {
    it('должен позволять создавать корректные объекты инвестиции', () => {
      const investment: Investment = {
        id: '1',
        userId: 'user1',
        title: 'Акции Сбербанк',
        description: 'Инвестиции в акции Сбербанка',
        type: InvestmentType.Stock,
        status: InvestmentStatus.Active,
        amount: 100000,
        currency: 'RUB',
        purchaseDate: '2023-01-01',
        purchasePrice: 250.5,
        currentPrice: 270.8,
        quantity: 400,
        ticker: 'SBER',
        exchange: 'MOEX',
        profit: 8120,
        profitPercentage: 8.12,
        dividends: 2000,
        fees: 500,
        taxes: 1000,
        maturityDate: '2025-01-01',
        interestRate: 7.5,
        accountId: 'account1',
        documentIds: ['doc1', 'doc2'],
        tags: ['акции', 'банк', 'голубые фишки'],
        createdAt: '2023-01-01T00:00:00Z',
        updatedAt: '2023-01-01T00:00:00Z',
      };

      expect(investment.id).toBe('1');
      expect(investment.userId).toBe('user1');
      expect(investment.title).toBe('Акции Сбербанк');
      expect(investment.description).toBe('Инвестиции в акции Сбербанка');
      expect(investment.type).toBe(InvestmentType.Stock);
      expect(investment.status).toBe(InvestmentStatus.Active);
      expect(investment.amount).toBe(100000);
      expect(investment.currency).toBe('RUB');
      expect(investment.purchaseDate).toBe('2023-01-01');
      expect(investment.purchasePrice).toBe(250.5);
      expect(investment.currentPrice).toBe(270.8);
      expect(investment.quantity).toBe(400);
      expect(investment.ticker).toBe('SBER');
      expect(investment.exchange).toBe('MOEX');
      expect(investment.profit).toBe(8120);
      expect(investment.profitPercentage).toBe(8.12);
      expect(investment.dividends).toBe(2000);
      expect(investment.fees).toBe(500);
      expect(investment.taxes).toBe(1000);
      expect(investment.maturityDate).toBe('2025-01-01');
      expect(investment.interestRate).toBe(7.5);
      expect(investment.accountId).toBe('account1');
      expect(investment.documentIds).toEqual(['doc1', 'doc2']);
      expect(investment.tags).toEqual(['акции', 'банк', 'голубые фишки']);
      expect(investment.createdAt).toBe('2023-01-01T00:00:00Z');
      expect(investment.updatedAt).toBe('2023-01-01T00:00:00Z');
    });

    it('должен позволять создавать инвестиции с опциональными полями', () => {
      const investment: Investment = {
        id: '1',
        userId: 'user1',
        title: 'Вклад в банке',
        description: 'Срочный депозит',
        type: InvestmentType.Deposit,
        status: InvestmentStatus.Active,
        amount: 500000,
        currency: 'RUB',
        purchaseDate: '2023-01-01',
        currentPrice: 500000,
        interestRate: 7.5,
        maturityDate: '2024-01-01',
        createdAt: '2023-01-01T00:00:00Z',
        updatedAt: '2023-01-01T00:00:00Z',
      };

      expect(investment.id).toBe('1');
      expect(investment.userId).toBe('user1');
      expect(investment.title).toBe('Вклад в банке');
      expect(investment.purchasePrice).toBeUndefined();
      expect(investment.quantity).toBeUndefined();
      expect(investment.ticker).toBeUndefined();
      expect(investment.exchange).toBeUndefined();
      expect(investment.profit).toBeUndefined();
      expect(investment.profitPercentage).toBeUndefined();
      expect(investment.dividends).toBeUndefined();
      expect(investment.fees).toBeUndefined();
      expect(investment.taxes).toBeUndefined();
      expect(investment.accountId).toBeUndefined();
      expect(investment.documentIds).toBeUndefined();
      expect(investment.tags).toBeUndefined();
    });
  });

  describe('CreateInvestmentDto', () => {
    it('должен позволять создавать DTO без id и временных меток', () => {
      const createInvestmentDto: CreateInvestmentDto = {
        userId: 'user1',
        title: 'Акции Сбербанк',
        description: 'Инвестиции в акции Сбербанка',
        type: InvestmentType.Stock,
        status: InvestmentStatus.Active,
        amount: 100000,
        currency: 'RUB',
        purchaseDate: '2023-01-01',
        purchasePrice: 250.5,
        currentPrice: 270.8,
        quantity: 400,
        ticker: 'SBER',
        exchange: 'MOEX',
        profit: 8120,
        profitPercentage: 8.12,
        dividends: 2000,
        fees: 500,
        taxes: 1000,
        maturityDate: '2025-01-01',
        interestRate: 7.5,
        accountId: 'account1',
        documentIds: ['doc1', 'doc2'],
        tags: ['акции', 'банк', 'голубые фишки'],
      };

      expect(createInvestmentDto.userId).toBe('user1');
      expect(createInvestmentDto.title).toBe('Акции Сбербанк');
      expect(createInvestmentDto.description).toBe('Инвестиции в акции Сбербанка');
      expect(createInvestmentDto.type).toBe(InvestmentType.Stock);
      expect(createInvestmentDto.status).toBe(InvestmentStatus.Active);
      expect(createInvestmentDto.amount).toBe(100000);
      expect(createInvestmentDto.currency).toBe('RUB');
      expect(createInvestmentDto.purchaseDate).toBe('2023-01-01');
      expect(createInvestmentDto.purchasePrice).toBe(250.5);
      expect(createInvestmentDto.currentPrice).toBe(270.8);
      expect(createInvestmentDto.quantity).toBe(400);
      expect(createInvestmentDto.ticker).toBe('SBER');
      expect(createInvestmentDto.exchange).toBe('MOEX');
      expect(createInvestmentDto.profit).toBe(8120);
      expect(createInvestmentDto.profitPercentage).toBe(8.12);
      expect(createInvestmentDto.dividends).toBe(2000);
      expect(createInvestmentDto.fees).toBe(500);
      expect(createInvestmentDto.taxes).toBe(1000);
      expect(createInvestmentDto.maturityDate).toBe('2025-01-01');
      expect(createInvestmentDto.interestRate).toBe(7.5);
      expect(createInvestmentDto.accountId).toBe('account1');
      expect(createInvestmentDto.documentIds).toEqual(['doc1', 'doc2']);
      expect(createInvestmentDto.tags).toEqual(['акции', 'банк', 'голубые фишки']);
      // @ts-expect-error - id не должен быть в CreateInvestmentDto
      expect(createInvestmentDto.id).toBeUndefined();
      // @ts-expect-error - createdAt не должен быть в CreateInvestmentDto
      expect(createInvestmentDto.createdAt).toBeUndefined();
      // @ts-expect-error - updatedAt не должен быть в CreateInvestmentDto
      expect(createInvestmentDto.updatedAt).toBeUndefined();
    });
  });

  describe('UpdateInvestmentDto', () => {
    it('должен позволять обновлять только некоторые поля', () => {
      const updateInvestmentDto: UpdateInvestmentDto = {
        status: InvestmentStatus.Sold,
        currentPrice: 280.5,
        profit: 12000,
        profitPercentage: 12.0,
      };

      expect(updateInvestmentDto.status).toBe(InvestmentStatus.Sold);
      expect(updateInvestmentDto.currentPrice).toBe(280.5);
      expect(updateInvestmentDto.profit).toBe(12000);
      expect(updateInvestmentDto.profitPercentage).toBe(12.0);
      // Все поля должны быть опциональными
      const emptyUpdateDto: UpdateInvestmentDto = {};
      expect(emptyUpdateDto).toEqual({});
    });
  });

  describe('InvestmentResponseDto', () => {
    it('должен содержать все поля Investment', () => {
      const investmentResponseDto: InvestmentResponseDto = {
        id: '1',
        userId: 'user1',
        title: 'Акции Сбербанк',
        description: 'Инвестиции в акции Сбербанка',
        type: InvestmentType.Stock,
        status: InvestmentStatus.Active,
        amount: 100000,
        currency: 'RUB',
        purchaseDate: '2023-01-01',
        purchasePrice: 250.5,
        currentPrice: 270.8,
        quantity: 400,
        ticker: 'SBER',
        exchange: 'MOEX',
        profit: 8120,
        profitPercentage: 8.12,
        dividends: 2000,
        fees: 500,
        taxes: 1000,
        maturityDate: '2025-01-01',
        interestRate: 7.5,
        accountId: 'account1',
        documentIds: ['doc1', 'doc2'],
        tags: ['акции', 'банк', 'голубые фишки'],
        createdAt: '2023-01-01T00:00:00Z',
        updatedAt: '2023-01-01T00:00:00Z',
      };

      expect(investmentResponseDto.id).toBe('1');
      expect(investmentResponseDto.userId).toBe('user1');
      expect(investmentResponseDto.title).toBe('Акции Сбербанк');
      expect(investmentResponseDto.description).toBe('Инвестиции в акции Сбербанка');
      expect(investmentResponseDto.type).toBe(InvestmentType.Stock);
      expect(investmentResponseDto.status).toBe(InvestmentStatus.Active);
      expect(investmentResponseDto.amount).toBe(100000);
      expect(investmentResponseDto.currency).toBe('RUB');
      expect(investmentResponseDto.purchaseDate).toBe('2023-01-01');
      expect(investmentResponseDto.purchasePrice).toBe(250.5);
      expect(investmentResponseDto.currentPrice).toBe(270.8);
      expect(investmentResponseDto.quantity).toBe(400);
      expect(investmentResponseDto.ticker).toBe('SBER');
      expect(investmentResponseDto.exchange).toBe('MOEX');
      expect(investmentResponseDto.profit).toBe(8120);
      expect(investmentResponseDto.profitPercentage).toBe(8.12);
      expect(investmentResponseDto.dividends).toBe(2000);
      expect(investmentResponseDto.fees).toBe(500);
      expect(investmentResponseDto.taxes).toBe(1000);
      expect(investmentResponseDto.maturityDate).toBe('2025-01-01');
      expect(investmentResponseDto.interestRate).toBe(7.5);
      expect(investmentResponseDto.accountId).toBe('account1');
      expect(investmentResponseDto.documentIds).toEqual(['doc1', 'doc2']);
      expect(investmentResponseDto.tags).toEqual(['акции', 'банк', 'голубые фишки']);
      expect(investmentResponseDto.createdAt).toBe('2023-01-01T00:00:00Z');
      expect(investmentResponseDto.updatedAt).toBe('2023-01-01T00:00:00Z');
    });
  });
});
