/**
 * Маппер для счетов
 *
 * Этот модуль содержит маппер для преобразования между
 * моделью счета и DTO счета.
 */

import { BaseMapper } from './base.mapper';
import {
  Account,
  CreateAccountDto,
  UpdateAccountDto,
  AccountResponseDto,
} from '../../types/account';

/**
 * Маппер для счетов
 *
 * @example
 * ```typescript
 * const accountMapper = new AccountMapper();
 *
 * // Преобразование модели в DTO
 * const accountDto = accountMapper.toDto(account);
 *
 * // Преобразование DTO в модель
 * const account = accountMapper.toEntity(createAccountDto);
 *
 * // Обновление модели данными из DTO
 * const updatedAccount = accountMapper.updateEntity(account, updateAccountDto);
 * ```
 */
export class AccountMapper extends BaseMapper<Account, AccountResponseDto> {
  /**
   * Преобразует модель счета в DTO ответа
   *
   * @param entity Модель счета
   * @returns DTO ответа
   */
  toDto(entity: Account): AccountResponseDto {
    return {
      id: entity.id,
      name: entity.name,
      type: entity.type,
      balance: entity.balance,
      userId: entity.userId,
      creditLimit: entity.creditLimit,
      debt: entity.debt,
      gracePeriod: entity.gracePeriod,
      minPayment: entity.minPayment,
      paymentDueDate: entity.paymentDueDate,
      isPaid: entity.isPaid,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      _responseType: 'account',
    };
  }

  /**
   * Преобразует DTO ответа в модель счета
   *
   * @param dto DTO ответа
   * @returns Модель счета
   */
  toEntity(dto: AccountResponseDto): Account {
    return {
      id: dto.id,
      name: dto.name,
      type: dto.type,
      balance: dto.balance,
      userId: dto.userId,
      creditLimit: dto.creditLimit,
      debt: dto.debt,
      gracePeriod: dto.gracePeriod,
      minPayment: dto.minPayment,
      paymentDueDate: dto.paymentDueDate,
      isPaid: dto.isPaid,
      createdAt: dto.createdAt,
      updatedAt: dto.updatedAt,
    };
  }

  /**
   * Преобразует DTO создания счета в модель счета
   *
   * @param dto DTO создания счета
   * @returns Модель счета
   */
  fromCreateDto(
    dto: CreateAccountDto,
  ): Omit<Account, 'id' | 'createdAt' | 'updatedAt' | 'debt' | 'isPaid'> {
    return {
      name: dto.name,
      type: dto.type,
      balance: dto.balance,
      userId: dto.userId,
      creditLimit: dto.creditLimit,
      gracePeriod: dto.gracePeriod,
      minPayment: dto.minPayment,
      paymentDueDate: dto.paymentDueDate,
    };
  }

  /**
   * Обновляет модель счета данными из DTO обновления
   *
   * @param entity Модель счета
   * @param dto DTO обновления счета
   * @returns Обновленная модель счета
   */
  updateFromDto(entity: Account, dto: UpdateAccountDto): Account {
    const updated = { ...entity };

    if (dto.name !== undefined) {
      updated.name = dto.name;
    }

    if (dto.type !== undefined) {
      updated.type = dto.type;
    }

    if (dto.balance !== undefined) {
      updated.balance = dto.balance;
    }

    if (dto.creditLimit !== undefined) {
      updated.creditLimit = dto.creditLimit;
    }

    if (dto.debt !== undefined) {
      updated.debt = dto.debt;
    }

    if (dto.gracePeriod !== undefined) {
      updated.gracePeriod = dto.gracePeriod;
    }

    if (dto.minPayment !== undefined) {
      updated.minPayment = dto.minPayment;
    }

    if (dto.paymentDueDate !== undefined) {
      updated.paymentDueDate = dto.paymentDueDate;
    }

    if (dto.isPaid !== undefined) {
      updated.isPaid = dto.isPaid;
    }

    updated.updatedAt = new Date().toISOString();

    return updated;
  }
}
