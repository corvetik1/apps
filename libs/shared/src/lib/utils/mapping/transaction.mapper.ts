/**
 * Маппер для транзакций
 *
 * Этот модуль содержит маппер для преобразования между
 * моделью транзакции и DTO транзакции.
 */

import { BaseMapper } from './base.mapper';
import { Transaction, CreateTransactionDto, TransactionResponseDto } from '../../types/transaction';

/**
 * Маппер для транзакций
 *
 * @example
 * ```typescript
 * const transactionMapper = new TransactionMapper();
 *
 * // Преобразование модели в DTO
 * const transactionDto = transactionMapper.toDto(transaction);
 *
 * // Преобразование DTO в модель
 * const transaction = transactionMapper.toEntity(createTransactionDto);
 *
 * // Обновление модели данными из DTO
 * const updatedTransaction = transactionMapper.updateEntity(transaction, updateTransactionDto);
 * ```
 */
export class TransactionMapper extends BaseMapper<Transaction, TransactionResponseDto> {
  /**
   * Преобразует модель транзакции в DTO ответа
   *
   * @param entity Модель транзакции
   * @returns DTO ответа
   */
  toDto(entity: Transaction): TransactionResponseDto {
    return {
      id: entity.id,
      tenderId: entity.tenderId,
      amount: entity.amount,
      currency: entity.currency,
      date: entity.date,
      type: entity.type,
      description: entity.description,
      accountId: entity.accountId,
      categoryId: entity.categoryId,
      counterpartyId: entity.counterpartyId,
      tags: entity.tags,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      _responseType: 'transaction',
    };
  }

  /**
   * Преобразует DTO ответа в модель транзакции
   *
   * @param dto DTO ответа
   * @returns Модель транзакции
   */
  toEntity(dto: TransactionResponseDto): Transaction {
    return {
      id: dto.id,
      tenderId: dto.tenderId,
      amount: dto.amount,
      currency: dto.currency,
      date: dto.date,
      type: dto.type,
      description: dto.description,
      accountId: dto.accountId,
      categoryId: dto.categoryId,
      counterpartyId: dto.counterpartyId,
      tags: dto.tags || [],
      createdAt: dto.createdAt,
      updatedAt: dto.updatedAt,
    };
  }

  /**
   * Преобразует DTO создания транзакции в модель транзакции
   *
   * @param dto DTO создания транзакции
   * @returns Модель транзакции
   */
  fromCreateDto(dto: CreateTransactionDto): Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'> {
    return {
      tenderId: dto.tenderId,
      amount: dto.amount,
      currency: dto.currency,
      date: dto.date,
      type: dto.type,
      description: dto.description,
      accountId: dto.accountId,
      categoryId: dto.categoryId,
      counterpartyId: dto.counterpartyId,
      tags: dto.tags || [],
    };
  }
}
