/**
 * Декораторы для валидации данных на основе JSON-схем
 *
 * Этот модуль содержит декораторы для валидации входящих данных
 * в контроллерах NestJS с использованием JSON-схем.
 */

import { ExecutionContext, BadRequestException, createParamDecorator } from '@nestjs/common';
import { validate, ValidationError } from '@finance-platform/shared';

/**
 * Фабричная функция для валидации тела запроса (request.body).
 * @param schema - JSON Schema для валидации.
 */
export const createValidateBodyFactory =
  (schema: Record<string, unknown>) =>
  (_data: unknown, ctx: ExecutionContext): unknown => {
    const request = ctx.switchToHttp().getRequest<{ body: unknown }>();
    try {
      return validate(schema, request.body);
    } catch (error) {
      if (error instanceof ValidationError) {
        throw new BadRequestException(error.toResponse());
      }
      throw error;
    }
  };

/**
 * Декоратор параметра для валидации `request.body` с использованием JSON Schema.
 * @param schema - JSON Schema.
 */
export const ValidateBody = (schema: Record<string, unknown>) =>
  createParamDecorator(createValidateBodyFactory(schema))();

/**
 * Фабричная функция для валидации параметров запроса (request.query).
 * @param schema - JSON Schema для валидации.
 */
export const createValidateQueryFactory =
  (schema: Record<string, unknown>) =>
  (_data: unknown, ctx: ExecutionContext): unknown => {
    const request = ctx.switchToHttp().getRequest<{ query: unknown }>();
    try {
      return validate(schema, request.query);
    } catch (error) {
      if (error instanceof ValidationError) {
        throw new BadRequestException(error.toResponse());
      }
      throw error;
    }
  };

/**
 * Декоратор параметра для валидации `request.query` с использованием JSON Schema.
 * @param schema - JSON Schema.
 */
export const ValidateQuery = (schema: Record<string, unknown>) =>
  createParamDecorator(createValidateQueryFactory(schema))();

/**
 * Фабричная функция для валидации параметров пути (request.params).
 * @param schema - JSON Schema для валидации.
 */
export const createValidateParamsFactory =
  (schema: Record<string, unknown>) =>
  (_data: unknown, ctx: ExecutionContext): unknown => {
    const request = ctx.switchToHttp().getRequest<{ params: unknown }>();
    try {
      return validate(schema, request.params);
    } catch (error) {
      if (error instanceof ValidationError) {
        throw new BadRequestException(error.toResponse());
      }
      throw error;
    }
  };

/**
 * Декоратор параметра для валидации `request.params` с использованием JSON Schema.
 * @param schema - JSON Schema.
 */
export const ValidateParams = (schema: Record<string, unknown>) =>
  createParamDecorator(createValidateParamsFactory(schema))();
