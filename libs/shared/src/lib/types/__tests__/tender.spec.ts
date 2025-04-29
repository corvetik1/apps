import { describe, it, expect } from '@jest/globals';
import {
  TenderStatus,
  Tender,
  CreateTenderDto,
  UpdateTenderDto,
  TenderResponseDto,
} from '../tender';

describe('Tender типы', () => {
  describe('TenderStatus enum', () => {
    it('должен содержать все необходимые статусы тендеров', () => {
      expect(TenderStatus.Open).toBe('open');
      expect(TenderStatus.Closed).toBe('closed');
      expect(TenderStatus.Cancelled).toBe('cancelled');
      expect(TenderStatus.Draft).toBe('draft');
      expect(TenderStatus.Published).toBe('published');
    });
  });

  describe('Tender интерфейс', () => {
    it('должен позволять создавать корректные объекты тендера', () => {
      const tender: Tender = {
        id: '1',
        title: 'Тендер на поставку оборудования',
        description: 'Поставка компьютерного оборудования',
        status: TenderStatus.Open,
        amount: 100000,
        currency: 'RUB',
        startDate: '2023-01-01',
        endDate: '2023-02-01',
        createdAt: '2023-01-01T00:00:00Z',
        updatedAt: '2023-01-01T00:00:00Z',
      };

      expect(tender.id).toBe('1');
      expect(tender.title).toBe('Тендер на поставку оборудования');
      expect(tender.description).toBe('Поставка компьютерного оборудования');
      expect(tender.status).toBe(TenderStatus.Open);
      expect(tender.amount).toBe(100000);
      expect(tender.currency).toBe('RUB');
      expect(tender.startDate).toBe('2023-01-01');
      expect(tender.endDate).toBe('2023-02-01');
      expect(tender.createdAt).toBe('2023-01-01T00:00:00Z');
      expect(tender.updatedAt).toBe('2023-01-01T00:00:00Z');
    });

    it('должен позволять создавать тендеры с опциональными полями', () => {
      const tender: Tender = {
        id: '1',
        title: 'Тендер на поставку оборудования',
        description: 'Поставка компьютерного оборудования',
        status: TenderStatus.Open,
        amount: 100000,
        currency: 'RUB',
        startDate: '2023-01-01',
        endDate: '2023-02-01',
        createdAt: '2023-01-01T00:00:00Z',
        updatedAt: '2023-01-01T00:00:00Z',
        categoryId: 'category1',
        location: 'Москва',
        organizerId: 'user1',
        participants: ['user2', 'user3'],
        winnerId: 'user2',
        documents: ['doc1', 'doc2'],
        tags: ['оборудование', 'компьютеры'],
      };

      expect(tender.id).toBe('1');
      expect(tender.title).toBe('Тендер на поставку оборудования');
      expect(tender.description).toBe('Поставка компьютерного оборудования');
      expect(tender.status).toBe(TenderStatus.Open);
      expect(tender.amount).toBe(100000);
      expect(tender.currency).toBe('RUB');
      expect(tender.startDate).toBe('2023-01-01');
      expect(tender.endDate).toBe('2023-02-01');
      expect(tender.createdAt).toBe('2023-01-01T00:00:00Z');
      expect(tender.updatedAt).toBe('2023-01-01T00:00:00Z');
      expect(tender.categoryId).toBe('category1');
      expect(tender.location).toBe('Москва');
      expect(tender.organizerId).toBe('user1');
      expect(tender.participants).toEqual(['user2', 'user3']);
      expect(tender.winnerId).toBe('user2');
      expect(tender.documents).toEqual(['doc1', 'doc2']);
      expect(tender.tags).toEqual(['оборудование', 'компьютеры']);
    });
  });

  describe('CreateTenderDto', () => {
    it('должен позволять создавать DTO без id и временных меток', () => {
      const createTenderDto: CreateTenderDto = {
        title: 'Тендер на поставку оборудования',
        description: 'Поставка компьютерного оборудования',
        status: TenderStatus.Draft,
        amount: 100000,
        currency: 'RUB',
        startDate: '2023-01-01',
        endDate: '2023-02-01',
      };

      expect(createTenderDto.title).toBe('Тендер на поставку оборудования');
      expect(createTenderDto.description).toBe('Поставка компьютерного оборудования');
      expect(createTenderDto.status).toBe(TenderStatus.Draft);
      expect(createTenderDto.amount).toBe(100000);
      expect(createTenderDto.currency).toBe('RUB');
      expect(createTenderDto.startDate).toBe('2023-01-01');
      expect(createTenderDto.endDate).toBe('2023-02-01');
      // @ts-expect-error - id не должен быть в CreateTenderDto
      expect(createTenderDto.id).toBeUndefined();
      // @ts-expect-error - createdAt не должен быть в CreateTenderDto
      expect(createTenderDto.createdAt).toBeUndefined();
      // @ts-expect-error - updatedAt не должен быть в CreateTenderDto
      expect(createTenderDto.updatedAt).toBeUndefined();
    });

    it('должен позволять создавать DTO с опциональными полями', () => {
      const createTenderDto: CreateTenderDto = {
        title: 'Тендер на поставку оборудования',
        description: 'Поставка компьютерного оборудования',
        status: TenderStatus.Draft,
        amount: 100000,
        currency: 'RUB',
        startDate: '2023-01-01',
        endDate: '2023-02-01',
        categoryId: 'category1',
        location: 'Москва',
        organizerId: 'user1',
        tags: ['оборудование', 'компьютеры'],
      };

      expect(createTenderDto.title).toBe('Тендер на поставку оборудования');
      expect(createTenderDto.description).toBe('Поставка компьютерного оборудования');
      expect(createTenderDto.status).toBe(TenderStatus.Draft);
      expect(createTenderDto.amount).toBe(100000);
      expect(createTenderDto.currency).toBe('RUB');
      expect(createTenderDto.startDate).toBe('2023-01-01');
      expect(createTenderDto.endDate).toBe('2023-02-01');
      expect(createTenderDto.categoryId).toBe('category1');
      expect(createTenderDto.location).toBe('Москва');
      expect(createTenderDto.organizerId).toBe('user1');
      expect(createTenderDto.tags).toEqual(['оборудование', 'компьютеры']);
    });
  });

  describe('UpdateTenderDto', () => {
    it('должен позволять обновлять только некоторые поля', () => {
      const updateTenderDto: UpdateTenderDto = {
        title: 'Обновленный тендер',
        status: TenderStatus.Closed,
      };

      expect(updateTenderDto.title).toBe('Обновленный тендер');
      expect(updateTenderDto.status).toBe(TenderStatus.Closed);
      // Все поля должны быть опциональными
      const emptyUpdateDto: UpdateTenderDto = {};
      expect(emptyUpdateDto).toEqual({});
    });
  });

  describe('TenderResponseDto', () => {
    it('должен содержать все поля Tender', () => {
      const tenderResponseDto: TenderResponseDto = {
        id: '1',
        title: 'Тендер на поставку оборудования',
        description: 'Поставка компьютерного оборудования',
        status: TenderStatus.Open,
        amount: 100000,
        currency: 'RUB',
        startDate: '2023-01-01',
        endDate: '2023-02-01',
        createdAt: '2023-01-01T00:00:00Z',
        updatedAt: '2023-01-01T00:00:00Z',
      };

      expect(tenderResponseDto.id).toBe('1');
      expect(tenderResponseDto.title).toBe('Тендер на поставку оборудования');
      expect(tenderResponseDto.description).toBe('Поставка компьютерного оборудования');
      expect(tenderResponseDto.status).toBe(TenderStatus.Open);
      expect(tenderResponseDto.amount).toBe(100000);
      expect(tenderResponseDto.currency).toBe('RUB');
      expect(tenderResponseDto.startDate).toBe('2023-01-01');
      expect(tenderResponseDto.endDate).toBe('2023-02-01');
      expect(tenderResponseDto.createdAt).toBe('2023-01-01T00:00:00Z');
      expect(tenderResponseDto.updatedAt).toBe('2023-01-01T00:00:00Z');
    });
  });
});
