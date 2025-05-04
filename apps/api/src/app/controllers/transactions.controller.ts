/**
 * Контроллер для работы с финансовыми транзакциями
 *
 * Этот контроллер демонстрирует использование валидации DTO,
 * маппинга и интеграции с Swagger.
 */

import {
  Controller,
  Get,
  Post,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  Put,
  Delete,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  Body,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  Param,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  Query,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiTags,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  ApiOperation,
} from '@nestjs/swagger';
import {
  CreateTransactionDto,
  TransactionResponseDto,
} from '@finance-platform/shared';
import { TransformInterceptor } from '../interceptors/array-transform.interceptor';
import { ValidateBody, ValidateParams, ValidateQuery } from '../decorators/validate.decorator';
import { ApiJsonBody, ApiJsonResponse, ApiJsonOperation } from '../decorators/api-schema.decorator';
import { TransactionsService } from '../services/transactions.service';

// Импортируем JSON-схемы
import { transactionSchema } from '@finance-platform/shared';

// Временные схемы для валидации
const createTransactionSchema = transactionSchema;
const transactionResponseSchema = transactionSchema;

// Временные схемы для валидации
const idParamsSchema = {
  type: 'object',
  required: ['id'],
  properties: {
    id: { type: 'string', format: 'uuid' },
  },
};

const transactionQuerySchema = {
  type: 'object',
  properties: {
    accountId: { type: 'string', format: 'uuid' },
    startDate: { type: 'string', format: 'date-time' },
    endDate: { type: 'string', format: 'date-time' },
    type: { type: 'string', enum: ['income', 'expense', 'transfer'] },
    category: { type: 'string' },
    minAmount: { type: 'number' },
    maxAmount: { type: 'number' },
    status: { type: 'string', enum: ['pending', 'completed', 'failed', 'cancelled'] },
  },
};

/**
 * Интерфейс для параметров запроса транзакций
 */
interface TransactionQuery {
  startDate?: string;
  endDate?: string;
  type?: string;
  limit?: number;
  offset?: number;
}

/**
 * Интерфейс для параметров с ID
 */
interface IdParams {
  id: string;
}

/**
 * Контроллер для работы с финансовыми транзакциями
 */
@ApiTags('transactions')
@Controller('v1/transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  /**
   * Получение списка транзакций с фильтрацией
   *
   * @param query Параметры запроса для фильтрации транзакций
   * @returns Список транзакций
   */
  @Get()
  @ApiJsonOperation({
    summary: 'Получение списка транзакций',
    description: 'Возвращает список транзакций с возможностью фильтрации по дате и типу',
  })
  @ApiJsonResponse(transactionResponseSchema, { isArray: true })
  @UseInterceptors(
    new TransformInterceptor({
      mapper: (data) => data,
      isArray: true,
    }),
  )
  async findAll(
    @ValidateQuery(transactionQuerySchema) query: TransactionQuery,
  ): Promise<TransactionResponseDto[]> {
    return this.transactionsService.findAll(query);
  }

  /**
   * Получение транзакции по ID
   *
   * @param params Параметры запроса с ID транзакции
   * @returns Данные транзакции
   */
  @Get(':id')
  @ApiJsonOperation({
    summary: 'Получение транзакции по ID',
    description: 'Возвращает детальную информацию о транзакции по её идентификатору',
  })
  @ApiJsonResponse(transactionResponseSchema)
  @UseInterceptors(
    new TransformInterceptor({
      mapper: (data) => data,
    }),
  )
  async findById(
    @ValidateParams(idParamsSchema) params: IdParams,
  ): Promise<TransactionResponseDto> {
    return this.transactionsService.findOne(params.id);
  }

  /**
   * Создание новой транзакции
   *
   * @param createTransactionDto DTO для создания транзакции
   * @returns Созданная транзакция
   */
  @Post()
  @ApiJsonOperation({
    summary: 'Создание новой транзакции',
    description: 'Создает новую финансовую транзакцию и возвращает её данные',
  })
  @ApiJsonBody(createTransactionSchema)
  @ApiJsonResponse(transactionResponseSchema, { status: 201 })
  @UseInterceptors(
    new TransformInterceptor({
      mapper: (data) => data,
    }),
  )
  async create(
    @ValidateBody(createTransactionSchema) createTransactionDto: CreateTransactionDto,
  ): Promise<TransactionResponseDto> {
    return this.transactionsService.create(createTransactionDto);
  }

  /**
   * Удаление транзакции
   *
   * @param params Параметры запроса с ID транзакции
   * @returns Удаленная транзакция
   */
  @Delete(':id')
  @ApiJsonOperation({
    summary: 'Удаление транзакции',
    description: 'Удаляет транзакцию по её идентификатору и возвращает удаленные данные',
  })
  @ApiJsonResponse(transactionResponseSchema)
  @UseInterceptors(
    new TransformInterceptor({
      mapper: (data) => data,
    }),
  )
  async remove(@ValidateParams(idParamsSchema) params: IdParams): Promise<void> {
    await this.transactionsService.remove(params.id);
    return;
  }
}
