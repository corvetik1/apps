// libs/shared/src/lib/utils/mapping/__tests__/tender.mapper.spec.ts
import { Tender, TenderResponseDto, TenderStatus } from '../../../types/tender';
import { TenderMapper } from '../tender.mapper';

describe('TenderMapper', () => {
  let mapper: TenderMapper;
  let mockTenderEntity: Tender;
  let mockTenderDto: TenderResponseDto;

  beforeEach(() => {
    mapper = new TenderMapper();

    mockTenderEntity = {
      id: 'tender-123',
      title: 'Test Tender',
      description: 'Description for test tender',
      status: TenderStatus.Open,
      amount: 50000,
      currency: 'USD',
      startDate: '2024-01-01',
      endDate: '2024-02-01',
      categoryId: 'cat-456',
      location: 'New York',
      organizerId: 'org-789',
      participants: ['part-1', 'part-2'],
      winnerId: 'part-1',
      documents: ['doc-1', 'doc-2'],
      tags: ['urgent', 'equipment'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // DTO идентичен entity в данном случае, кроме _responseType
    mockTenderDto = {
      ...mockTenderEntity,
      _responseType: 'tender',
    };
  });

  it('should be defined', () => {
    expect(mapper).toBeDefined();
  });

  describe('toDto', () => {
    it('should map Tender entity to TenderResponseDto correctly', () => {
      const resultDto = mapper.toDto(mockTenderEntity);

      // Проверяем все поля, включая опциональное _responseType
      expect(resultDto).toEqual({
        ...mockTenderEntity,
        status: TenderStatus.Open, // Убедимся, что статус сохранился как enum значение
        _responseType: 'tender',
      });
    });

    it('should handle minimal Tender entity', () => {
      const minimalEntity: Tender = {
        id: 'minimal-1',
        title: 'Minimal',
        description: 'Minimal desc',
        status: TenderStatus.Draft,
        amount: 100,
        currency: 'EUR',
        startDate: '2024-03-01',
        endDate: '2024-03-10',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      const expectedDto: TenderResponseDto = {
        ...minimalEntity,
        status: TenderStatus.Draft,
        _responseType: 'tender',
      };
      expect(mapper.toDto(minimalEntity)).toEqual(expectedDto);
    });
  });

  describe('toEntity', () => {
    it('should map TenderResponseDto to Tender entity correctly', () => {
      const resultEntity = mapper.toEntity(mockTenderDto);

      // Убираем _responseType перед сравнением
      const { _responseType, ...expectedEntityData } = mockTenderDto;

      expect(resultEntity).toEqual({
        ...expectedEntityData,
        status: TenderStatus.Open, // Убедимся, что статус сохранился
      });
      // Дополнительно убедимся, что служебное поле DTO отсутствует
      expect(resultEntity).not.toHaveProperty('_responseType');
    });

    it('should handle minimal TenderResponseDto', () => {
      const minimalDto: TenderResponseDto = {
        id: 'minimal-1',
        title: 'Minimal',
        description: 'Minimal desc',
        status: TenderStatus.Draft,
        amount: 100,
        currency: 'EUR',
        startDate: '2024-03-01',
        endDate: '2024-03-10',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        _responseType: 'tender',
      };
      const { _responseType, ...expectedEntityData } = minimalDto;
      const expectedEntity: Tender = {
        ...expectedEntityData,
        status: TenderStatus.Draft,
      };
      expect(mapper.toEntity(minimalDto)).toEqual(expectedEntity);
    });
  });
});
