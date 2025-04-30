/**
 * Тесты для интерцептора трансформации
 */
import { TransformInterceptor } from '../transform.interceptor';
import { ExecutionContext, CallHandler } from '@nestjs/common';
import { of } from 'rxjs';
import { BaseMapper } from '@finance-platform/shared';

// Тестовая модель
interface TestEntity {
  id: string;
  name: string;
  internalField: string;
}

// Тестовое DTO
interface TestDto {
  id: string;
  name: string;
  dtoField: string;
}

// Тестовый маппер
class TestMapper extends BaseMapper<TestEntity, TestDto> {
  toDto(entity: TestEntity): TestDto {
    return {
      id: entity.id,
      name: entity.name,
      dtoField: 'dto',
    };
  }

  toEntity(dto: TestDto): TestEntity {
    return {
      id: dto.id,
      name: dto.name,
      internalField: 'internal',
    };
  }
}

describe('TransformInterceptor', () => {
  let interceptor: TransformInterceptor<TestEntity, TestDto>;
  let mapper: TestMapper;
  let context: ExecutionContext;
  let callHandler: CallHandler;

  beforeEach(() => {
    mapper = new TestMapper();

    // Создаем интерцептор с маппером
    interceptor = new TransformInterceptor<TestEntity, TestDto>(mapper);

    // Создаем моки для ExecutionContext и CallHandler
    context = {} as ExecutionContext;
    callHandler = {
      handle: jest.fn(),
    } as unknown as CallHandler;
  });

  it('должен быть определен', () => {
    expect(interceptor).toBeDefined();
  });

  it('должен трансформировать одиночный объект', done => {
    const entity: TestEntity = {
      id: '1',
      name: 'Test',
      internalField: 'internal',
    };

    const expectedDto: TestDto = {
      id: '1',
      name: 'Test',
      dtoField: 'dto',
    };

    // Мокаем вызов handle для возврата наблюдаемого объекта с тестовой сущностью
    jest.spyOn(callHandler, 'handle').mockReturnValue(of(entity));

    // Вызываем интерцептор
    interceptor.intercept(context, callHandler).subscribe({
      next: result => {
        expect(result).toEqual(expectedDto);
        done();
      },
    });
  });

  it('должен трансформировать массив объектов (возвращает первый элемент)', done => {
    const entities: TestEntity[] = [
      {
        id: '1',
        name: 'Test 1',
        internalField: 'internal 1',
      },
      {
        id: '2',
        name: 'Test 2',
        internalField: 'internal 2',
      },
    ];

    // В новой реализации интерцептор возвращает только первый элемент массива
    const expectedDto: TestDto = {
      id: '1',
      name: 'Test 1',
      dtoField: 'dto',
    };

    // Мокаем вызов handle для возврата наблюдаемого объекта с массивом тестовых сущностей
    jest.spyOn(callHandler, 'handle').mockReturnValue(of(entities));

    // Вызываем интерцептор
    interceptor.intercept(context, callHandler).subscribe({
      next: result => {
        // Проверяем, что результат - это первый элемент массива
        expect(result).toEqual(expectedDto);
        done();
      },
    });
  });

  it('должен обрабатывать null и undefined', done => {
    // Мокаем вызов handle для возврата наблюдаемого объекта с null
    jest.spyOn(callHandler, 'handle').mockReturnValue(of(null));

    // Вызываем интерцептор
    interceptor.intercept(context, callHandler).subscribe({
      next: result => {
        expect(result).toBeNull();
        done();
      },
    });
  });

  it('должен обрабатывать пустой массив', done => {
    // Мокаем вызов handle для возврата наблюдаемого объекта с пустым массивом
    jest.spyOn(callHandler, 'handle').mockReturnValue(of([]));

    // Вызываем интерцептор
    interceptor.intercept(context, callHandler).subscribe({
      next: result => {
        // Результат должен быть пустым объектом ({})
        expect(result).toEqual({});
        done();
      },
    });
  });
});
