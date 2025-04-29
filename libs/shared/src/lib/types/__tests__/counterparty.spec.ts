import { describe, it, expect } from '@jest/globals';
import {
  CounterpartyType,
  CounterpartyStatus,
  Counterparty,
  CreateCounterpartyDto,
  UpdateCounterpartyDto,
  CounterpartyResponseDto,
} from '../counterparty';

describe('Counterparty типы', () => {
  describe('CounterpartyType enum', () => {
    it('должен содержать все необходимые типы контрагентов', () => {
      expect(CounterpartyType.Individual).toBe('individual');
      expect(CounterpartyType.Company).toBe('company');
      expect(CounterpartyType.Government).toBe('government');
      expect(CounterpartyType.Bank).toBe('bank');
      expect(CounterpartyType.Other).toBe('other');
    });
  });

  describe('CounterpartyStatus enum', () => {
    it('должен содержать все необходимые статусы контрагентов', () => {
      expect(CounterpartyStatus.Active).toBe('active');
      expect(CounterpartyStatus.Inactive).toBe('inactive');
      expect(CounterpartyStatus.Blocked).toBe('blocked');
    });
  });

  describe('Counterparty интерфейс', () => {
    it('должен позволять создавать корректные объекты контрагента', () => {
      const counterparty: Counterparty = {
        id: '1',
        userId: 'user1',
        name: 'ООО "Рога и Копыта"',
        type: CounterpartyType.Company,
        status: CounterpartyStatus.Active,
        inn: '7707083893',
        kpp: '770701001',
        ogrn: '1027700132195',
        address: 'г. Москва, ул. Примерная, д. 1',
        contactPerson: 'Иванов Иван Иванович',
        phone: '+7 (999) 123-45-67',
        email: 'info@example.com',
        website: 'https://example.com',
        bankDetails: {
          accountNumber: '40702810100000000123',
          bik: '044525225',
          bankName: 'Сбербанк',
          correspondentAccount: '30101810400000000225',
        },
        description: 'Поставщик канцелярских товаров',
        category: 'supplier',
        tags: ['поставщик', 'канцтовары'],
        documentIds: ['doc1', 'doc2'],
        createdAt: '2023-01-01T00:00:00Z',
        updatedAt: '2023-01-01T00:00:00Z',
      };

      expect(counterparty.id).toBe('1');
      expect(counterparty.userId).toBe('user1');
      expect(counterparty.name).toBe('ООО "Рога и Копыта"');
      expect(counterparty.type).toBe(CounterpartyType.Company);
      expect(counterparty.status).toBe(CounterpartyStatus.Active);
      expect(counterparty.inn).toBe('7707083893');
      expect(counterparty.kpp).toBe('770701001');
      expect(counterparty.ogrn).toBe('1027700132195');
      expect(counterparty.address).toBe('г. Москва, ул. Примерная, д. 1');
      expect(counterparty.contactPerson).toBe('Иванов Иван Иванович');
      expect(counterparty.phone).toBe('+7 (999) 123-45-67');
      expect(counterparty.email).toBe('info@example.com');
      expect(counterparty.website).toBe('https://example.com');
      expect(counterparty.bankDetails).toEqual({
        accountNumber: '40702810100000000123',
        bik: '044525225',
        bankName: 'Сбербанк',
        correspondentAccount: '30101810400000000225',
      });
      expect(counterparty.description).toBe('Поставщик канцелярских товаров');
      expect(counterparty.category).toBe('supplier');
      expect(counterparty.tags).toEqual(['поставщик', 'канцтовары']);
      expect(counterparty.documentIds).toEqual(['doc1', 'doc2']);
      expect(counterparty.createdAt).toBe('2023-01-01T00:00:00Z');
      expect(counterparty.updatedAt).toBe('2023-01-01T00:00:00Z');
    });

    it('должен позволять создавать контрагентов с опциональными полями', () => {
      const counterparty: Counterparty = {
        id: '1',
        userId: 'user1',
        name: 'Иванов Иван Иванович',
        type: CounterpartyType.Individual,
        status: CounterpartyStatus.Active,
        phone: '+7 (999) 123-45-67',
        email: 'ivanov@example.com',
        createdAt: '2023-01-01T00:00:00Z',
        updatedAt: '2023-01-01T00:00:00Z',
      };

      expect(counterparty.id).toBe('1');
      expect(counterparty.userId).toBe('user1');
      expect(counterparty.name).toBe('Иванов Иван Иванович');
      expect(counterparty.inn).toBeUndefined();
      expect(counterparty.kpp).toBeUndefined();
      expect(counterparty.ogrn).toBeUndefined();
      expect(counterparty.address).toBeUndefined();
      expect(counterparty.contactPerson).toBeUndefined();
      expect(counterparty.website).toBeUndefined();
      expect(counterparty.bankDetails).toBeUndefined();
      expect(counterparty.description).toBeUndefined();
      expect(counterparty.category).toBeUndefined();
      expect(counterparty.tags).toBeUndefined();
      expect(counterparty.documentIds).toBeUndefined();
    });
  });

  describe('CreateCounterpartyDto', () => {
    it('должен позволять создавать DTO без id и временных меток', () => {
      const createCounterpartyDto: CreateCounterpartyDto = {
        userId: 'user1',
        name: 'ООО "Рога и Копыта"',
        type: CounterpartyType.Company,
        status: CounterpartyStatus.Active,
        inn: '7707083893',
        kpp: '770701001',
        ogrn: '1027700132195',
        address: 'г. Москва, ул. Примерная, д. 1',
        contactPerson: 'Иванов Иван Иванович',
        phone: '+7 (999) 123-45-67',
        email: 'info@example.com',
        website: 'https://example.com',
        bankDetails: {
          accountNumber: '40702810100000000123',
          bik: '044525225',
          bankName: 'Сбербанк',
          correspondentAccount: '30101810400000000225',
        },
        description: 'Поставщик канцелярских товаров',
        category: 'supplier',
        tags: ['поставщик', 'канцтовары'],
        documentIds: ['doc1', 'doc2'],
      };

      expect(createCounterpartyDto.userId).toBe('user1');
      expect(createCounterpartyDto.name).toBe('ООО "Рога и Копыта"');
      expect(createCounterpartyDto.type).toBe(CounterpartyType.Company);
      expect(createCounterpartyDto.status).toBe(CounterpartyStatus.Active);
      expect(createCounterpartyDto.inn).toBe('7707083893');
      expect(createCounterpartyDto.kpp).toBe('770701001');
      expect(createCounterpartyDto.ogrn).toBe('1027700132195');
      expect(createCounterpartyDto.address).toBe('г. Москва, ул. Примерная, д. 1');
      expect(createCounterpartyDto.contactPerson).toBe('Иванов Иван Иванович');
      expect(createCounterpartyDto.phone).toBe('+7 (999) 123-45-67');
      expect(createCounterpartyDto.email).toBe('info@example.com');
      expect(createCounterpartyDto.website).toBe('https://example.com');
      expect(createCounterpartyDto.bankDetails).toEqual({
        accountNumber: '40702810100000000123',
        bik: '044525225',
        bankName: 'Сбербанк',
        correspondentAccount: '30101810400000000225',
      });
      expect(createCounterpartyDto.description).toBe('Поставщик канцелярских товаров');
      expect(createCounterpartyDto.category).toBe('supplier');
      expect(createCounterpartyDto.tags).toEqual(['поставщик', 'канцтовары']);
      expect(createCounterpartyDto.documentIds).toEqual(['doc1', 'doc2']);
      // @ts-expect-error - id не должен быть в CreateCounterpartyDto
      expect(createCounterpartyDto.id).toBeUndefined();
      // @ts-expect-error - createdAt не должен быть в CreateCounterpartyDto
      expect(createCounterpartyDto.createdAt).toBeUndefined();
      // @ts-expect-error - updatedAt не должен быть в CreateCounterpartyDto
      expect(createCounterpartyDto.updatedAt).toBeUndefined();
    });
  });

  describe('UpdateCounterpartyDto', () => {
    it('должен позволять обновлять только некоторые поля', () => {
      const updateCounterpartyDto: UpdateCounterpartyDto = {
        status: CounterpartyStatus.Inactive,
        phone: '+7 (999) 987-65-43',
        email: 'new@example.com',
        contactPerson: 'Петров Петр Петрович',
      };

      expect(updateCounterpartyDto.status).toBe(CounterpartyStatus.Inactive);
      expect(updateCounterpartyDto.phone).toBe('+7 (999) 987-65-43');
      expect(updateCounterpartyDto.email).toBe('new@example.com');
      expect(updateCounterpartyDto.contactPerson).toBe('Петров Петр Петрович');
      // Все поля должны быть опциональными
      const emptyUpdateDto: UpdateCounterpartyDto = {};
      expect(emptyUpdateDto).toEqual({});
    });
  });

  describe('CounterpartyResponseDto', () => {
    it('должен содержать все поля Counterparty', () => {
      const counterpartyResponseDto: CounterpartyResponseDto = {
        id: '1',
        userId: 'user1',
        name: 'ООО "Рога и Копыта"',
        type: CounterpartyType.Company,
        status: CounterpartyStatus.Active,
        inn: '7707083893',
        kpp: '770701001',
        ogrn: '1027700132195',
        address: 'г. Москва, ул. Примерная, д. 1',
        contactPerson: 'Иванов Иван Иванович',
        phone: '+7 (999) 123-45-67',
        email: 'info@example.com',
        website: 'https://example.com',
        bankDetails: {
          accountNumber: '40702810100000000123',
          bik: '044525225',
          bankName: 'Сбербанк',
          correspondentAccount: '30101810400000000225',
        },
        description: 'Поставщик канцелярских товаров',
        category: 'supplier',
        tags: ['поставщик', 'канцтовары'],
        documentIds: ['doc1', 'doc2'],
        createdAt: '2023-01-01T00:00:00Z',
        updatedAt: '2023-01-01T00:00:00Z',
      };

      expect(counterpartyResponseDto.id).toBe('1');
      expect(counterpartyResponseDto.userId).toBe('user1');
      expect(counterpartyResponseDto.name).toBe('ООО "Рога и Копыта"');
      expect(counterpartyResponseDto.type).toBe(CounterpartyType.Company);
      expect(counterpartyResponseDto.status).toBe(CounterpartyStatus.Active);
      expect(counterpartyResponseDto.inn).toBe('7707083893');
      expect(counterpartyResponseDto.kpp).toBe('770701001');
      expect(counterpartyResponseDto.ogrn).toBe('1027700132195');
      expect(counterpartyResponseDto.address).toBe('г. Москва, ул. Примерная, д. 1');
      expect(counterpartyResponseDto.contactPerson).toBe('Иванов Иван Иванович');
      expect(counterpartyResponseDto.phone).toBe('+7 (999) 123-45-67');
      expect(counterpartyResponseDto.email).toBe('info@example.com');
      expect(counterpartyResponseDto.website).toBe('https://example.com');
      expect(counterpartyResponseDto.bankDetails).toEqual({
        accountNumber: '40702810100000000123',
        bik: '044525225',
        bankName: 'Сбербанк',
        correspondentAccount: '30101810400000000225',
      });
      expect(counterpartyResponseDto.description).toBe('Поставщик канцелярских товаров');
      expect(counterpartyResponseDto.category).toBe('supplier');
      expect(counterpartyResponseDto.tags).toEqual(['поставщик', 'канцтовары']);
      expect(counterpartyResponseDto.documentIds).toEqual(['doc1', 'doc2']);
      expect(counterpartyResponseDto.createdAt).toBe('2023-01-01T00:00:00Z');
      expect(counterpartyResponseDto.updatedAt).toBe('2023-01-01T00:00:00Z');
    });
  });
});
