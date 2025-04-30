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
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import {
  Transaction,
  CreateTransactionDto,
  TransactionResponseDto,
} from '@finance-platform/shared/lib/types/transaction';
import { TransformInterceptor } from '../interceptors/transform.interceptor';
import { ValidateBody, ValidateParams, ValidateQuery } from '../decorators/validate.decorator';
import { ApiJsonBody, ApiJsonResponse, ApiJsonOperation } from '../decorators/api-schema.decorator';
import { TransactionsService } from '../services/transactions.service';

// Импортируем JSON-схемы
import {
  transactionSchema,
  createTransactionSchema,
  transactionResponseSchema,
  idParamsSchema,
  transactionQuerySchema,
} from '@finance-platform/shared/lib/schemas/transaction';

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
      mapper: TransactionsService.transactionMapper,
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
      mapper: TransactionsService.transactionMapper,
    }),
  )
  async findById(
    @ValidateParams(idParamsSchema) params: IdParams,
  ): Promise<TransactionResponseDto> {
    return this.transactionsService.findById(params.id);
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
      mapper: TransactionsService.transactionMapper,
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
      mapper: TransactionsService.transactionMapper,
    }),
  )
  async remove(@ValidateParams(idParamsSchema) params: IdParams): Promise<TransactionResponseDto> {
    return this.transactionsService.remove(params.id);
  }
}
