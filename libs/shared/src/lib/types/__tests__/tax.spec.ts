import { describe, it, expect } from '@jest/globals';
import { TaxType, TaxStatus, Tax, CreateTaxDto, UpdateTaxDto, TaxResponseDto } from '../tax';

describe('Tax типы', () => {
  describe('TaxType enum', () => {
    it('должен содержать все необходимые типы налогов', () => {
      expect(TaxType.Income).toBe('income');
      expect(TaxType.Property).toBe('property');
      expect(TaxType.VAT).toBe('vat');
      expect(TaxType.Transport).toBe('transport');
      expect(TaxType.Land).toBe('land');
      expect(TaxType.SelfEmployed).toBe('self_employed');
      expect(TaxType.Corporate).toBe('corporate');
      expect(TaxType.Other).toBe('other');
    });
  });

  describe('TaxStatus enum', () => {
    it('должен содержать все необходимые статусы налогов', () => {
      expect(TaxStatus.Pending).toBe('pending');
      expect(TaxStatus.Paid).toBe('paid');
      expect(TaxStatus.Overdue).toBe('overdue');
      expect(TaxStatus.Calculated).toBe('calculated');
      expect(TaxStatus.Disputed).toBe('disputed');
    });
  });

  describe('Tax интерфейс', () => {
    it('должен позволять создавать корректные объекты налога', () => {
      const tax: Tax = {
        id: '1',
        userId: 'user1',
        title: 'НДФЛ за 2023 год',
        description: 'Налог на доходы физических лиц',
        type: TaxType.Income,
        status: TaxStatus.Pending,
        amount: 65000,
        currency: 'RUB',
        taxRate: 13,
        taxableAmount: 500000,
        taxPeriod: '2023',
        taxPeriodStart: '2023-01-01',
        taxPeriodEnd: '2023-12-31',
        dueDate: '2024-04-30',
        paymentDate: null,
        taxAuthority: 'ФНС России',
        taxIdentifier: 'НДФЛ-2023',
        documentIds: ['doc1', 'doc2'],
        relatedEntityId: 'income1',
        relatedEntityType: 'income',
        createdAt: '2023-01-01T00:00:00Z',
        updatedAt: '2023-01-01T00:00:00Z',
      };

      expect(tax.id).toBe('1');
      expect(tax.userId).toBe('user1');
      expect(tax.title).toBe('НДФЛ за 2023 год');
      expect(tax.description).toBe('Налог на доходы физических лиц');
      expect(tax.type).toBe(TaxType.Income);
      expect(tax.status).toBe(TaxStatus.Pending);
      expect(tax.amount).toBe(65000);
      expect(tax.currency).toBe('RUB');
      expect(tax.taxRate).toBe(13);
      expect(tax.taxableAmount).toBe(500000);
      expect(tax.taxPeriod).toBe('2023');
      expect(tax.taxPeriodStart).toBe('2023-01-01');
      expect(tax.taxPeriodEnd).toBe('2023-12-31');
      expect(tax.dueDate).toBe('2024-04-30');
      expect(tax.paymentDate).toBeNull();
      expect(tax.taxAuthority).toBe('ФНС России');
      expect(tax.taxIdentifier).toBe('НДФЛ-2023');
      expect(tax.documentIds).toEqual(['doc1', 'doc2']);
      expect(tax.relatedEntityId).toBe('income1');
      expect(tax.relatedEntityType).toBe('income');
      expect(tax.createdAt).toBe('2023-01-01T00:00:00Z');
      expect(tax.updatedAt).toBe('2023-01-01T00:00:00Z');
    });

    it('должен позволять создавать налоги с опциональными полями', () => {
      const tax: Tax = {
        id: '1',
        userId: 'user1',
        title: 'Транспортный налог',
        description: 'Налог на автомобиль',
        type: TaxType.Transport,
        status: TaxStatus.Calculated,
        amount: 5000,
        currency: 'RUB',
        taxPeriod: '2023',
        dueDate: '2024-12-01',
        createdAt: '2023-01-01T00:00:00Z',
        updatedAt: '2023-01-01T00:00:00Z',
      };

      expect(tax.id).toBe('1');
      expect(tax.userId).toBe('user1');
      expect(tax.title).toBe('Транспортный налог');
      expect(tax.taxRate).toBeUndefined();
      expect(tax.taxableAmount).toBeUndefined();
      expect(tax.taxPeriodStart).toBeUndefined();
      expect(tax.taxPeriodEnd).toBeUndefined();
      expect(tax.paymentDate).toBeUndefined();
      expect(tax.taxAuthority).toBeUndefined();
      expect(tax.taxIdentifier).toBeUndefined();
      expect(tax.documentIds).toBeUndefined();
      expect(tax.relatedEntityId).toBeUndefined();
      expect(tax.relatedEntityType).toBeUndefined();
    });
  });

  describe('CreateTaxDto', () => {
    it('должен позволять создавать DTO без id и временных меток', () => {
      const createTaxDto: CreateTaxDto = {
        userId: 'user1',
        title: 'НДФЛ за 2023 год',
        description: 'Налог на доходы физических лиц',
        type: TaxType.Income,
        status: TaxStatus.Pending,
        amount: 65000,
        currency: 'RUB',
        taxRate: 13,
        taxableAmount: 500000,
        taxPeriod: '2023',
        taxPeriodStart: '2023-01-01',
        taxPeriodEnd: '2023-12-31',
        dueDate: '2024-04-30',
        paymentDate: null,
        taxAuthority: 'ФНС России',
        taxIdentifier: 'НДФЛ-2023',
        documentIds: ['doc1', 'doc2'],
        relatedEntityId: 'income1',
        relatedEntityType: 'income',
      };

      expect(createTaxDto.userId).toBe('user1');
      expect(createTaxDto.title).toBe('НДФЛ за 2023 год');
      expect(createTaxDto.description).toBe('Налог на доходы физических лиц');
      expect(createTaxDto.type).toBe(TaxType.Income);
      expect(createTaxDto.status).toBe(TaxStatus.Pending);
      expect(createTaxDto.amount).toBe(65000);
      expect(createTaxDto.currency).toBe('RUB');
      expect(createTaxDto.taxRate).toBe(13);
      expect(createTaxDto.taxableAmount).toBe(500000);
      expect(createTaxDto.taxPeriod).toBe('2023');
      expect(createTaxDto.taxPeriodStart).toBe('2023-01-01');
      expect(createTaxDto.taxPeriodEnd).toBe('2023-12-31');
      expect(createTaxDto.dueDate).toBe('2024-04-30');
      expect(createTaxDto.paymentDate).toBeNull();
      expect(createTaxDto.taxAuthority).toBe('ФНС России');
      expect(createTaxDto.taxIdentifier).toBe('НДФЛ-2023');
      expect(createTaxDto.documentIds).toEqual(['doc1', 'doc2']);
      expect(createTaxDto.relatedEntityId).toBe('income1');
      expect(createTaxDto.relatedEntityType).toBe('income');
      // @ts-expect-error - id не должен быть в CreateTaxDto
      expect(createTaxDto.id).toBeUndefined();
      // @ts-expect-error - createdAt не должен быть в CreateTaxDto
      expect(createTaxDto.createdAt).toBeUndefined();
      // @ts-expect-error - updatedAt не должен быть в CreateTaxDto
      expect(createTaxDto.updatedAt).toBeUndefined();
    });
  });

  describe('UpdateTaxDto', () => {
    it('должен позволять обновлять только некоторые поля', () => {
      const updateTaxDto: UpdateTaxDto = {
        status: TaxStatus.Paid,
        paymentDate: '2024-04-15',
        amount: 65000,
      };

      expect(updateTaxDto.status).toBe(TaxStatus.Paid);
      expect(updateTaxDto.paymentDate).toBe('2024-04-15');
      expect(updateTaxDto.amount).toBe(65000);
      // Все поля должны быть опциональными
      const emptyUpdateDto: UpdateTaxDto = {};
      expect(emptyUpdateDto).toEqual({});
    });
  });

  describe('TaxResponseDto', () => {
    it('должен содержать все поля Tax', () => {
      const taxResponseDto: TaxResponseDto = {
        id: '1',
        userId: 'user1',
        title: 'НДФЛ за 2023 год',
        description: 'Налог на доходы физических лиц',
        type: TaxType.Income,
        status: TaxStatus.Pending,
        amount: 65000,
        currency: 'RUB',
        taxRate: 13,
        taxableAmount: 500000,
        taxPeriod: '2023',
        taxPeriodStart: '2023-01-01',
        taxPeriodEnd: '2023-12-31',
        dueDate: '2024-04-30',
        paymentDate: null,
        taxAuthority: 'ФНС России',
        taxIdentifier: 'НДФЛ-2023',
        documentIds: ['doc1', 'doc2'],
        relatedEntityId: 'income1',
        relatedEntityType: 'income',
        createdAt: '2023-01-01T00:00:00Z',
        updatedAt: '2023-01-01T00:00:00Z',
      };

      expect(taxResponseDto.id).toBe('1');
      expect(taxResponseDto.userId).toBe('user1');
      expect(taxResponseDto.title).toBe('НДФЛ за 2023 год');
      expect(taxResponseDto.description).toBe('Налог на доходы физических лиц');
      expect(taxResponseDto.type).toBe(TaxType.Income);
      expect(taxResponseDto.status).toBe(TaxStatus.Pending);
      expect(taxResponseDto.amount).toBe(65000);
      expect(taxResponseDto.currency).toBe('RUB');
      expect(taxResponseDto.taxRate).toBe(13);
      expect(taxResponseDto.taxableAmount).toBe(500000);
      expect(taxResponseDto.taxPeriod).toBe('2023');
      expect(taxResponseDto.taxPeriodStart).toBe('2023-01-01');
      expect(taxResponseDto.taxPeriodEnd).toBe('2023-12-31');
      expect(taxResponseDto.dueDate).toBe('2024-04-30');
      expect(taxResponseDto.paymentDate).toBeNull();
      expect(taxResponseDto.taxAuthority).toBe('ФНС России');
      expect(taxResponseDto.taxIdentifier).toBe('НДФЛ-2023');
      expect(taxResponseDto.documentIds).toEqual(['doc1', 'doc2']);
      expect(taxResponseDto.relatedEntityId).toBe('income1');
      expect(taxResponseDto.relatedEntityType).toBe('income');
      expect(taxResponseDto.createdAt).toBe('2023-01-01T00:00:00Z');
      expect(taxResponseDto.updatedAt).toBe('2023-01-01T00:00:00Z');
    });
  });
});
