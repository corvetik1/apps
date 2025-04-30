/**
 * Тесты для декораторов интеграции с Swagger
 */
import * as swaggerDecorators from '@nestjs/swagger';
import {
  ApiJsonBody,
  ApiJsonResponse,
  ApiJsonOperation,
  ApiPropertyFromSchema,
} from '../api-schema.decorator';

// Мокаем декораторы Swagger
jest.mock('@nestjs/swagger', () => ({
  applyDecorators: jest.fn((...decorators) => decorators),
  ApiBody: jest.fn(),
  ApiOkResponse: jest.fn(),
  ApiCreatedResponse: jest.fn(),
  ApiOperation: jest.fn(),
  ApiProperty: jest.fn(),
}));

describe('Декораторы Swagger', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('ApiJsonBody', () => {
    it('должен вызывать ApiBody с преобразованной схемой', () => {
      const schema = {
        type: 'object',
        description: 'Тестовая схема',
        properties: {
          name: {
            type: 'string',
            description: 'Имя пользователя',
          },
          age: {
            type: 'integer',
            description: 'Возраст пользователя',
          },
        },
        required: ['name'],
      };

      ApiJsonBody(schema);

      expect(swaggerDecorators.ApiBody).toHaveBeenCalledWith({
        schema: expect.objectContaining({
          type: 'object',
          description: 'Тестовая схема',
          properties: expect.objectContaining({
            name: expect.objectContaining({
              type: 'string',
              description: 'Имя пользователя',
            }),
            age: expect.objectContaining({
              type: 'integer',
              description: 'Возраст пользователя',
            }),
          }),
          required: ['name'],
        }),
        description: 'Тестовая схема',
        required: true,
      });
    });

    it('должен использовать пользовательские опции', () => {
      const schema = {
        type: 'object',
        description: 'Тестовая схема',
      };

      const options = {
        description: 'Пользовательское описание',
        required: false,
      };

      ApiJsonBody(schema, options);

      expect(swaggerDecorators.ApiBody).toHaveBeenCalledWith(
        expect.objectContaining({
          description: 'Пользовательское описание',
          required: false,
        }),
      );
    });
  });

  describe('ApiJsonResponse', () => {
    it('должен вызывать ApiOkResponse с преобразованной схемой', () => {
      const schema = {
        type: 'object',
        description: 'Тестовая схема ответа',
        properties: {
          id: {
            type: 'string',
            description: 'ID пользователя',
          },
          name: {
            type: 'string',
            description: 'Имя пользователя',
          },
        },
      };

      ApiJsonResponse(schema);

      expect(swaggerDecorators.ApiOkResponse).toHaveBeenCalledWith({
        schema: expect.objectContaining({
          type: 'object',
          description: 'Тестовая схема ответа',
          properties: expect.objectContaining({
            id: expect.objectContaining({
              type: 'string',
              description: 'ID пользователя',
            }),
            name: expect.objectContaining({
              type: 'string',
              description: 'Имя пользователя',
            }),
          }),
        }),
        description: 'Тестовая схема ответа',
      });
    });

    it('должен вызывать ApiCreatedResponse для статуса 201', () => {
      const schema = {
        type: 'object',
        description: 'Тестовая схема ответа',
      };

      ApiJsonResponse(schema, { status: 201 });

      expect(swaggerDecorators.ApiCreatedResponse).toHaveBeenCalled();
      expect(swaggerDecorators.ApiOkResponse).not.toHaveBeenCalled();
    });

    it('должен оборачивать схему в массив, если isArray = true', () => {
      const schema = {
        type: 'object',
        description: 'Тестовая схема ответа',
      };

      ApiJsonResponse(schema, { isArray: true });

      expect(swaggerDecorators.ApiOkResponse).toHaveBeenCalledWith({
        schema: expect.objectContaining({
          type: 'array',
          items: expect.objectContaining({
            type: 'object',
            description: 'Тестовая схема ответа',
          }),
        }),
        description: 'Тестовая схема ответа',
      });
    });
  });

  describe('ApiJsonOperation', () => {
    it('должен вызывать ApiOperation с данными из схемы', () => {
      const schema = {
        title: 'Тестовая операция',
        description: 'Описание тестовой операции',
        deprecated: true,
      };

      ApiJsonOperation(schema);

      expect(swaggerDecorators.ApiOperation).toHaveBeenCalledWith({
        summary: 'Тестовая операция',
        description: 'Описание тестовой операции',
        deprecated: true,
      });
    });

    it('должен использовать summary, если title отсутствует', () => {
      const schema = {
        summary: 'Тестовая операция',
        description: 'Описание тестовой операции',
      };

      ApiJsonOperation(schema);

      expect(swaggerDecorators.ApiOperation).toHaveBeenCalledWith({
        summary: 'Тестовая операция',
        description: 'Описание тестовой операции',
        deprecated: undefined,
      });
    });
  });

  describe('ApiPropertyFromSchema', () => {
    it('должен создавать опции для ApiProperty на основе схемы свойства', () => {
      const propertySchema = {
        type: 'string',
        description: 'Имя пользователя',
        example: 'John Doe',
        format: 'text',
        required: true,
      };

      ApiPropertyFromSchema(propertySchema);

      expect(swaggerDecorators.ApiProperty).toHaveBeenCalledWith({
        type: 'string',
        description: 'Имя пользователя',
        example: 'John Doe',
        format: 'text',
        required: true,
        default: undefined,
        enum: undefined,
        deprecated: undefined,
      });
    });

    it('должен корректно обрабатывать массивы', () => {
      const propertySchema = {
        type: 'array',
        description: 'Список ролей',
        items: {
          type: 'string',
          enum: ['admin', 'user', 'guest'],
        },
      };

      ApiPropertyFromSchema(propertySchema);

      expect(swaggerDecorators.ApiProperty).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'array',
          description: 'Список ролей',
          isArray: true,
          items: { type: 'string' },
        }),
      );
    });
  });
});
