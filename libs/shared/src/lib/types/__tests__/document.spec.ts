import { describe, it, expect } from '@jest/globals';
import {
  DocumentType,
  DocumentStatus,
  Document,
  CreateDocumentDto,
  UpdateDocumentDto,
  DocumentResponseDto,
} from '../document';

describe('Document типы', () => {
  describe('DocumentType enum', () => {
    it('должен содержать все необходимые типы документов', () => {
      expect(DocumentType.Contract).toBe('contract');
      expect(DocumentType.Invoice).toBe('invoice');
      expect(DocumentType.Receipt).toBe('receipt');
      expect(DocumentType.Report).toBe('report');
      expect(DocumentType.Certificate).toBe('certificate');
      expect(DocumentType.ID).toBe('id');
      expect(DocumentType.Other).toBe('other');
    });
  });

  describe('DocumentStatus enum', () => {
    it('должен содержать все необходимые статусы документов', () => {
      expect(DocumentStatus.Active).toBe('active');
      expect(DocumentStatus.Archived).toBe('archived');
      expect(DocumentStatus.Pending).toBe('pending');
      expect(DocumentStatus.Rejected).toBe('rejected');
      expect(DocumentStatus.Expired).toBe('expired');
    });
  });

  describe('Document интерфейс', () => {
    it('должен позволять создавать корректные объекты документа', () => {
      const document: Document = {
        id: '1',
        userId: 'user1',
        title: 'Договор кредита',
        description: 'Кредитный договор №123-456',
        type: DocumentType.Contract,
        status: DocumentStatus.Active,
        fileUrl: 'https://example.com/files/contract.pdf',
        fileSize: 1024000,
        fileType: 'application/pdf',
        fileName: 'contract.pdf',
        tags: ['кредит', 'договор', 'банк'],
        entityId: 'loan1',
        entityType: 'loan',
        validFrom: '2023-01-01',
        validUntil: '2025-01-01',
        issuedBy: 'Сбербанк',
        issuedTo: 'Иванов Иван Иванович',
        createdAt: '2023-01-01T00:00:00Z',
        updatedAt: '2023-01-01T00:00:00Z',
      };

      expect(document.id).toBe('1');
      expect(document.userId).toBe('user1');
      expect(document.title).toBe('Договор кредита');
      expect(document.description).toBe('Кредитный договор №123-456');
      expect(document.type).toBe(DocumentType.Contract);
      expect(document.status).toBe(DocumentStatus.Active);
      expect(document.fileUrl).toBe('https://example.com/files/contract.pdf');
      expect(document.fileSize).toBe(1024000);
      expect(document.fileType).toBe('application/pdf');
      expect(document.fileName).toBe('contract.pdf');
      expect(document.tags).toEqual(['кредит', 'договор', 'банк']);
      expect(document.entityId).toBe('loan1');
      expect(document.entityType).toBe('loan');
      expect(document.validFrom).toBe('2023-01-01');
      expect(document.validUntil).toBe('2025-01-01');
      expect(document.issuedBy).toBe('Сбербанк');
      expect(document.issuedTo).toBe('Иванов Иван Иванович');
      expect(document.createdAt).toBe('2023-01-01T00:00:00Z');
      expect(document.updatedAt).toBe('2023-01-01T00:00:00Z');
    });

    it('должен позволять создавать документы с опциональными полями', () => {
      const document: Document = {
        id: '1',
        userId: 'user1',
        title: 'Квитанция',
        description: 'Квитанция об оплате',
        type: DocumentType.Receipt,
        status: DocumentStatus.Active,
        fileUrl: 'https://example.com/files/receipt.pdf',
        fileSize: 512000,
        fileType: 'application/pdf',
        fileName: 'receipt.pdf',
        createdAt: '2023-01-01T00:00:00Z',
        updatedAt: '2023-01-01T00:00:00Z',
      };

      expect(document.id).toBe('1');
      expect(document.userId).toBe('user1');
      expect(document.title).toBe('Квитанция');
      expect(document.tags).toBeUndefined();
      expect(document.entityId).toBeUndefined();
      expect(document.entityType).toBeUndefined();
      expect(document.validFrom).toBeUndefined();
      expect(document.validUntil).toBeUndefined();
      expect(document.issuedBy).toBeUndefined();
      expect(document.issuedTo).toBeUndefined();
    });
  });

  describe('CreateDocumentDto', () => {
    it('должен позволять создавать DTO без id и временных меток', () => {
      const createDocumentDto: CreateDocumentDto = {
        userId: 'user1',
        title: 'Договор кредита',
        description: 'Кредитный договор №123-456',
        type: DocumentType.Contract,
        status: DocumentStatus.Active,
        fileUrl: 'https://example.com/files/contract.pdf',
        fileSize: 1024000,
        fileType: 'application/pdf',
        fileName: 'contract.pdf',
        tags: ['кредит', 'договор', 'банк'],
        entityId: 'loan1',
        entityType: 'loan',
        validFrom: '2023-01-01',
        validUntil: '2025-01-01',
        issuedBy: 'Сбербанк',
        issuedTo: 'Иванов Иван Иванович',
      };

      expect(createDocumentDto.userId).toBe('user1');
      expect(createDocumentDto.title).toBe('Договор кредита');
      expect(createDocumentDto.description).toBe('Кредитный договор №123-456');
      expect(createDocumentDto.type).toBe(DocumentType.Contract);
      expect(createDocumentDto.status).toBe(DocumentStatus.Active);
      expect(createDocumentDto.fileUrl).toBe('https://example.com/files/contract.pdf');
      expect(createDocumentDto.fileSize).toBe(1024000);
      expect(createDocumentDto.fileType).toBe('application/pdf');
      expect(createDocumentDto.fileName).toBe('contract.pdf');
      expect(createDocumentDto.tags).toEqual(['кредит', 'договор', 'банк']);
      expect(createDocumentDto.entityId).toBe('loan1');
      expect(createDocumentDto.entityType).toBe('loan');
      expect(createDocumentDto.validFrom).toBe('2023-01-01');
      expect(createDocumentDto.validUntil).toBe('2025-01-01');
      expect(createDocumentDto.issuedBy).toBe('Сбербанк');
      expect(createDocumentDto.issuedTo).toBe('Иванов Иван Иванович');
      // @ts-expect-error - id не должен быть в CreateDocumentDto
      expect(createDocumentDto.id).toBeUndefined();
      // @ts-expect-error - createdAt не должен быть в CreateDocumentDto
      expect(createDocumentDto.createdAt).toBeUndefined();
      // @ts-expect-error - updatedAt не должен быть в CreateDocumentDto
      expect(createDocumentDto.updatedAt).toBeUndefined();
    });
  });

  describe('UpdateDocumentDto', () => {
    it('должен позволять обновлять только некоторые поля', () => {
      const updateDocumentDto: UpdateDocumentDto = {
        status: DocumentStatus.Archived,
        tags: ['кредит', 'договор', 'банк', 'архив'],
      };

      expect(updateDocumentDto.status).toBe(DocumentStatus.Archived);
      expect(updateDocumentDto.tags).toEqual(['кредит', 'договор', 'банк', 'архив']);
      // Все поля должны быть опциональными
      const emptyUpdateDto: UpdateDocumentDto = {};
      expect(emptyUpdateDto).toEqual({});
    });
  });

  describe('DocumentResponseDto', () => {
    it('должен содержать все поля Document', () => {
      const documentResponseDto: DocumentResponseDto = {
        id: '1',
        userId: 'user1',
        title: 'Договор кредита',
        description: 'Кредитный договор №123-456',
        type: DocumentType.Contract,
        status: DocumentStatus.Active,
        fileUrl: 'https://example.com/files/contract.pdf',
        fileSize: 1024000,
        fileType: 'application/pdf',
        fileName: 'contract.pdf',
        tags: ['кредит', 'договор', 'банк'],
        entityId: 'loan1',
        entityType: 'loan',
        validFrom: '2023-01-01',
        validUntil: '2025-01-01',
        issuedBy: 'Сбербанк',
        issuedTo: 'Иванов Иван Иванович',
        createdAt: '2023-01-01T00:00:00Z',
        updatedAt: '2023-01-01T00:00:00Z',
      };

      expect(documentResponseDto.id).toBe('1');
      expect(documentResponseDto.userId).toBe('user1');
      expect(documentResponseDto.title).toBe('Договор кредита');
      expect(documentResponseDto.description).toBe('Кредитный договор №123-456');
      expect(documentResponseDto.type).toBe(DocumentType.Contract);
      expect(documentResponseDto.status).toBe(DocumentStatus.Active);
      expect(documentResponseDto.fileUrl).toBe('https://example.com/files/contract.pdf');
      expect(documentResponseDto.fileSize).toBe(1024000);
      expect(documentResponseDto.fileType).toBe('application/pdf');
      expect(documentResponseDto.fileName).toBe('contract.pdf');
      expect(documentResponseDto.tags).toEqual(['кредит', 'договор', 'банк']);
      expect(documentResponseDto.entityId).toBe('loan1');
      expect(documentResponseDto.entityType).toBe('loan');
      expect(documentResponseDto.validFrom).toBe('2023-01-01');
      expect(documentResponseDto.validUntil).toBe('2025-01-01');
      expect(documentResponseDto.issuedBy).toBe('Сбербанк');
      expect(documentResponseDto.issuedTo).toBe('Иванов Иван Иванович');
      expect(documentResponseDto.createdAt).toBe('2023-01-01T00:00:00Z');
      expect(documentResponseDto.updatedAt).toBe('2023-01-01T00:00:00Z');
    });
  });
});
