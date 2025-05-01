/**
 * Декораторы для интеграции с Swagger на основе JSON-схем
 *
 * Этот модуль содержит декораторы для автоматического документирования API
 * с использованием JSON-схем.
 */

import { applyDecorators } from '@nestjs/common';
import {
  ApiBody,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiOperation,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getSchemaPath,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  ApiExtraModels,
  ApiProperty,
  ApiPropertyOptions,
} from '@nestjs/swagger';
import { SchemaObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';

/**
 * Преобразует JSON-схему в схему Swagger
 *
 * @param schema JSON-схема
 * @returns Схема Swagger
 */
function convertJsonSchemaToSwagger(schema: Record<string, any>): SchemaObject {
  const swaggerSchema: SchemaObject = {
    type: schema.type,
    description: schema.description,
    example: schema.example,
    default: schema.default,
    format: schema.format,
  };

  // Обрабатываем свойства объекта
  if (schema.type === 'object' && schema.properties) {
    swaggerSchema.properties = {};
    swaggerSchema.required = schema.required || [];

    for (const [propName, propSchema] of Object.entries<any>(schema.properties)) {
      swaggerSchema.properties[propName] = convertJsonSchemaToSwagger(propSchema);
    }
  }

  // Обрабатываем массивы
  if (schema.type === 'array' && schema.items) {
    swaggerSchema.items = convertJsonSchemaToSwagger(schema.items);
  }

  // Обрабатываем enum
  if (schema.enum) {
    swaggerSchema.enum = schema.enum;
  }

  return swaggerSchema;
}

/**
 * Декоратор для документирования тела запроса на основе JSON-схемы
 *
 * @param schema JSON-схема для тела запроса
 * @param options Дополнительные опции
 * @returns Декоратор
 *
 * @example
 * ```typescript
 * @Post()
 * @ApiJsonBody(createUserSchema)
 * createUser(@Body() createUserDto: CreateUserDto) {
 *   // ...
 * }
 * ```
 */
export function ApiJsonBody(
  schema: Record<string, any>,
  options: { description?: string; required?: boolean } = {},
) {
  const swaggerSchema = convertJsonSchemaToSwagger(schema);

  return applyDecorators(
    ApiBody({
      schema: swaggerSchema,
      description: options.description || schema.description,
      required: options.required !== undefined ? options.required : true,
    }),
  );
}

/**
 * Декоратор для документирования успешного ответа на основе JSON-схемы
 *
 * @param schema JSON-схема для ответа
 * @param options Дополнительные опции
 * @returns Декоратор
 *
 * @example
 * ```typescript
 * @Get(':id')
 * @ApiJsonResponse(userSchema)
 * findById(@Param('id') id: string) {
 *   // ...
 * }
 * ```
 */
export function ApiJsonResponse(
  schema: Record<string, any>,
  options: { description?: string; status?: number; isArray?: boolean } = {},
) {
  const swaggerSchema = convertJsonSchemaToSwagger(schema);

  // Определяем, какой декоратор использовать в зависимости от статуса
  const ResponseDecorator = options.status === 201 ? ApiCreatedResponse : ApiOkResponse;

  // Если ответ - массив, оборачиваем схему
  const responseSchema = options.isArray ? { type: 'array', items: swaggerSchema } : swaggerSchema;

  return applyDecorators(
    ResponseDecorator({
      schema: responseSchema,
      description: options.description || schema.description,
    }),
  );
}

/**
 * Декоратор для документирования операции API
 *
 * @param schema JSON-схема для документирования операции
 * @returns Декоратор
 *
 * @example
 * ```typescript
 * @Get()
 * @ApiJsonOperation(userListOperationSchema)
 * findAll() {
 *   // ...
 * }
 * ```
 */
export function ApiJsonOperation(schema: Record<string, any>) {
  return applyDecorators(
    ApiOperation({
      summary: schema.title || schema.summary,
      description: schema.description,
      deprecated: schema.deprecated,
    }),
  );
}

/**
 * Создает декоратор ApiProperty на основе свойства JSON-схемы
 *
 * @param propertySchema Схема свойства
 * @returns Опции для декоратора ApiProperty
 *
 * @example
 * ```typescript
 * // В классе DTO
 * @ApiPropertyFromSchema(userSchema.properties.email)
 * email: string;
 * ```
 */
export function ApiPropertyFromSchema(propertySchema: Record<string, any>) {
  const options: ApiPropertyOptions = {
    description: propertySchema.description,
    required: propertySchema.required,
    type: propertySchema.type,
    example: propertySchema.example,
    default: propertySchema.default,
    format: propertySchema.format,
    enum: propertySchema.enum,
    deprecated: propertySchema.deprecated,
  };

  if (propertySchema.type === 'array' && propertySchema.items) {
    options.isArray = true;
    options.items = { type: propertySchema.items.type };
  }

  return ApiProperty(options);
}
