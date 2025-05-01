/**
 * Тесты для middleware валидации запросов
 */
import { jest } from '@jest/globals';

// Мокируем валидатор и класс ошибки
const mockValidate = jest.fn();
const mockValidationErrorToResponse = jest.fn();

class MockValidationError extends Error {
  constructor(public errors: Array<{ path: string; message: string }>) {
    super('Validation Error');
    this.name = 'ValidationError';
  }

  toResponse = mockValidationErrorToResponse;
}

// Мокируем импорты в мидлвари
jest.mock('@finance-platform/shared', () => ({
  ValidationError: MockValidationError,
  validate: mockValidate,
}));

// Импортируем тестируемый модуль
import { ValidationMiddleware, ValidationOptions } from '../validation.middleware';

// Типы для моков
interface MockRequest {
  body?: Record<string, unknown>;
  query?: Record<string, unknown>;
  params?: Record<string, unknown>;
}

interface MockResponse {
  status: jest.Mock;
  json: jest.Mock;
}

// === ТЕСТЫ ===

describe('ValidationMiddleware', () => {
  // Переменные для тестов
  let req: MockRequest;
  let res: MockResponse;
  let next: jest.Mock;

  // Тестовая JSON-схема
  const schema = {
    type: 'object',
    properties: {
      name: {
        type: 'string',
      },
    },
    required: ['name'],
  };

  // Опции для middleware
  const options: ValidationOptions = {
    schema,
    target: 'body',
  };

  beforeEach(() => {
    // Сбрасываем моки перед каждым тестом
    jest.clearAllMocks();

    // Создаем тестовые данные
    req = {
      body: { name: 'John' },
      query: { search: 'test' },
      params: { id: '123' },
    };

    // Создаем моки с правильной типизацией
    const statusMock = jest.fn().mockReturnThis();
    const jsonMock = jest.fn();

    res = {
      status: statusMock,
      json: jsonMock,
    };

    next = jest.fn();

    // По умолчанию валидация проходит успешно
    mockValidate.mockReturnValue({ name: 'John' });

    // Настраиваем мок для toResponse
    mockValidationErrorToResponse.mockReturnValue({
      statusCode: 400,
      error: 'Bad Request',
      message: 'Validation Error',
      errors: [{ path: 'name', message: 'Name is required' }],
    });
  });

  it('должен создаваться с опциями', () => {
    const middleware = new ValidationMiddleware(options);
    expect(middleware).toBeDefined();
  });

  it('должен использовать body по умолчанию, если target не указан', () => {
    const middleware = new ValidationMiddleware({ schema });

    const privateOptions = (middleware as any).options;
    expect(privateOptions.target).toBe('body');
  });

  it('должен валидировать данные и вызывать next', () => {
    const middleware = new ValidationMiddleware(options);
    middleware.use(req as any, res as any, next as any);

    expect(mockValidate).toHaveBeenCalledWith(schema, { name: 'John' });
    expect(next).toHaveBeenCalled();
  });

  it('должен заменять данные в запросе на валидированные', () => {
    const validatedData = { name: 'John Doe' };
    mockValidate.mockReturnValue(validatedData);

    const middleware = new ValidationMiddleware(options);
    middleware.use(req as any, res as any, next as any);

    expect(req.body).toBe(validatedData);
  });

  it('должен валидировать query, если target = query', () => {
    const middleware = new ValidationMiddleware({
      schema,
      target: 'query',
    });
    middleware.use(req as any, res as any, next as any);

    expect(mockValidate).toHaveBeenCalledWith(schema, { search: 'test' });
  });

  it('должен валидировать params, если target = params', () => {
    const middleware = new ValidationMiddleware({
      schema,
      target: 'params',
    });
    middleware.use(req as any, res as any, next as any);

    expect(mockValidate).toHaveBeenCalledWith(schema, { id: '123' });
  });

  it('должен возвращать 400 Bad Request при ошибке валидации', () => {
    // Мокируем ошибку валидации
    const validationError = new MockValidationError([
      { path: 'name', message: 'Name is required' },
    ]);

    mockValidate.mockImplementation(() => {
      throw validationError;
    });

    const middleware = new ValidationMiddleware(options);
    middleware.use(req as any, res as any, next as any);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(mockValidationErrorToResponse());
    expect(next).not.toHaveBeenCalled();
  });

  it('должен передавать другие ошибки дальше', () => {
    // Мокируем другую ошибку
    const error = new Error('Другая ошибка');

    mockValidate.mockImplementation(() => {
      throw error;
    });

    const middleware = new ValidationMiddleware(options);
    middleware.use(req as any, res as any, next as any);

    expect(next).toHaveBeenCalledWith(error);
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });

  it('должен создаваться статическим методом create', () => {
    const middleware = ValidationMiddleware.create(options);
    // Проверяем, что middleware является функцией
    expect(typeof middleware).toBe('function');
    // Проверяем, что функция принимает 3 аргумента (req, res, next)
    expect(middleware.length).toBe(3);
  });
});
