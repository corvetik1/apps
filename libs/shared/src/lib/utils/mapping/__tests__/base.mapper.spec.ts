/**
 * Тесты для базового маппера
 */
import { BaseMapper } from '../base.mapper';
import { jest } from '@jest/globals';

// Тестовая модель
interface TestEntity {
  id: string;
  name: string;
  createdAt: string;
  internalField: string;
}

// Тестовое DTO
interface TestDto {
  id: string;
  name: string;
  createdAt: string;
}

// Тестовый маппер
class TestMapper extends BaseMapper<TestEntity, TestDto> {
  toDto(entity: TestEntity): TestDto {
    return {
      id: entity.id,
      name: entity.name,
      createdAt: entity.createdAt,
    };
  }

  toEntity(dto: TestDto): TestEntity {
    return {
      id: dto.id,
      name: dto.name,
      createdAt: dto.createdAt,
      internalField: 'default',
    };
  }
}

describe('BaseMapper', () => {
  let mapper: TestMapper;

  beforeEach(() => {
    mapper = new TestMapper();
  });

  describe('toDto', () => {
    it('должен преобразовывать модель в DTO', () => {
      const entity: TestEntity = {
        id: '1',
        name: 'Test',
        createdAt: '2023-01-01',
        internalField: 'internal',
      };

      const dto = mapper.toDto(entity);

      expect(dto).toEqual({
        id: '1',
        name: 'Test',
        createdAt: '2023-01-01',
      });

      // Проверяем, что внутреннее поле не попало в DTO
      expect(dto).not.toHaveProperty('internalField');
    });
  });

  describe('toEntity', () => {
    it('должен преобразовывать DTO в модель', () => {
      const dto: TestDto = {
        id: '1',
        name: 'Test',
        createdAt: '2023-01-01',
      };

      const entity = mapper.toEntity(dto);

      expect(entity).toEqual({
        id: '1',
        name: 'Test',
        createdAt: '2023-01-01',
        internalField: 'default',
      });

      // Проверяем, что внутреннее поле добавлено в модель
      expect(entity.internalField).toBe('default');
    });
  });

  describe('toDtoList', () => {
    it('должен преобразовывать массив моделей в массив DTO', () => {
      const entities: TestEntity[] = [
        {
          id: '1',
          name: 'Test 1',
          createdAt: '2023-01-01',
          internalField: 'internal 1',
        },
        {
          id: '2',
          name: 'Test 2',
          createdAt: '2023-01-02',
          internalField: 'internal 2',
        },
      ];

      const dtos = mapper.toDtoList(entities);

      expect(dtos).toEqual([
        {
          id: '1',
          name: 'Test 1',
          createdAt: '2023-01-01',
        },
        {
          id: '2',
          name: 'Test 2',
          createdAt: '2023-01-02',
        },
      ]);

      // Проверяем, что внутренние поля не попали в DTO
      dtos.forEach(dto => {
        expect(dto).not.toHaveProperty('internalField');
      });
    });

    it('должен возвращать пустой массив для пустого массива моделей', () => {
      const entities: TestEntity[] = [];

      const dtos = mapper.toDtoList(entities);

      expect(dtos).toEqual([]);
    });
  });

  describe('toEntityList', () => {
    it('должен преобразовывать массив DTO в массив моделей', () => {
      const dtos: TestDto[] = [
        {
          id: '1',
          name: 'Test 1',
          createdAt: '2023-01-01',
        },
        {
          id: '2',
          name: 'Test 2',
          createdAt: '2023-01-02',
        },
      ];

      const entities = mapper.toEntityList(dtos);

      expect(entities).toEqual([
        {
          id: '1',
          name: 'Test 1',
          createdAt: '2023-01-01',
          internalField: 'default',
        },
        {
          id: '2',
          name: 'Test 2',
          createdAt: '2023-01-02',
          internalField: 'default',
        },
      ]);

      // Проверяем, что внутренние поля добавлены в модели
      entities.forEach(entity => {
        expect(entity.internalField).toBe('default');
      });
    });

    it('должен возвращать пустой массив для пустого массива DTO', () => {
      const dtos: TestDto[] = [];

      const entities = mapper.toEntityList(dtos);

      expect(entities).toEqual([]);
    });
  });

  describe('updateEntity', () => {
    it('должен обновлять модель данными из DTO', () => {
      const entity: TestEntity = {
        id: '1',
        name: 'Old Name',
        createdAt: '2023-01-01',
        internalField: 'internal',
      };

      const dto: Partial<TestDto> = {
        name: 'New Name',
      };

      const updatedEntity = mapper.updateEntity(entity, dto);

      expect(updatedEntity).toEqual({
        id: '1',
        name: 'New Name',
        createdAt: '2023-01-01',
        internalField: 'internal',
      });

      // Проверяем, что внутреннее поле не изменилось
      expect(updatedEntity.internalField).toBe('internal');
    });

    it('должен сохранять исходную модель без изменений', () => {
      const entity: TestEntity = {
        id: '1',
        name: 'Old Name',
        createdAt: '2023-01-01',
        internalField: 'internal',
      };

      const dto: Partial<TestDto> = {
        name: 'New Name',
      };

      mapper.updateEntity(entity, dto);

      // Проверяем, что исходная модель не изменилась
      expect(entity).toEqual({
        id: '1',
        name: 'Old Name',
        createdAt: '2023-01-01',
        internalField: 'internal',
      });
    });
  });

  describe('batchToDtoList', () => {
    it('должен пакетно преобразовывать массив моделей в массив DTO', () => {
      // Создаем большой массив сущностей
      const entities: TestEntity[] = Array.from({ length: 150 }, (_, i) => ({
        id: `${i + 1}`,
        name: `Test ${i + 1}`,
        createdAt: `2023-01-${String((i % 30) + 1).padStart(2, '0')}`,
        internalField: `internal ${i + 1}`,
      }));

      // Спай на метод toDto для проверки пакетной обработки
      const toDtoSpy = jest.spyOn(mapper, 'toDto');

      // Вызываем метод с размером пакета 50
      const dtos = mapper.batchToDtoList(entities, 50);

      // Проверяем, что результат имеет правильную длину
      expect(dtos.length).toBe(entities.length);

      // Проверяем, что метод toDto был вызван для каждой сущности
      expect(toDtoSpy).toHaveBeenCalledTimes(entities.length);

      // Проверяем первый и последний элементы
      expect(dtos[0]).toEqual({
        id: '1',
        name: 'Test 1',
        createdAt: '2023-01-01',
      });

      expect(dtos[dtos.length - 1]).toEqual({
        id: '150',
        name: 'Test 150',
        createdAt: '2023-01-30',
      });

      // Проверяем, что внутренние поля не попали в DTO
      dtos.forEach(dto => {
        expect(dto).not.toHaveProperty('internalField');
      });

      // Восстанавливаем мок
      toDtoSpy.mockRestore();
    });

    it('должен работать с пустым массивом', () => {
      const entities: TestEntity[] = [];
      const dtos = mapper.batchToDtoList(entities);
      expect(dtos).toEqual([]);
    });
  });

  describe('batchToEntityList', () => {
    it('должен пакетно преобразовывать массив DTO в массив моделей', () => {
      // Создаем большой массив DTO
      const dtos: TestDto[] = Array.from({ length: 150 }, (_, i) => ({
        id: `${i + 1}`,
        name: `Test ${i + 1}`,
        createdAt: `2023-01-${String((i % 30) + 1).padStart(2, '0')}`,
      }));

      // Спай на метод toEntity для проверки пакетной обработки
      const toEntitySpy = jest.spyOn(mapper, 'toEntity');

      // Вызываем метод с размером пакета 50
      const entities = mapper.batchToEntityList(dtos, 50);

      // Проверяем, что результат имеет правильную длину
      expect(entities.length).toBe(dtos.length);

      // Проверяем, что метод toEntity был вызван для каждого DTO
      expect(toEntitySpy).toHaveBeenCalledTimes(dtos.length);

      // Проверяем первый и последний элементы
      expect(entities[0]).toEqual({
        id: '1',
        name: 'Test 1',
        createdAt: '2023-01-01',
        internalField: 'default',
      });

      expect(entities[entities.length - 1]).toEqual({
        id: '150',
        name: 'Test 150',
        createdAt: '2023-01-30',
        internalField: 'default',
      });

      // Проверяем, что внутренние поля добавлены в модели
      entities.forEach(entity => {
        expect(entity.internalField).toBe('default');
      });

      // Восстанавливаем мок
      toEntitySpy.mockRestore();
    });

    it('должен работать с пустым массивом', () => {
      const dtos: TestDto[] = [];
      const entities = mapper.batchToEntityList(dtos);
      expect(entities).toEqual([]);
    });
  });
});
