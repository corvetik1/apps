/**
 * Маппер для долгов
 *
 * Этот модуль содержит маппер для преобразования между
 * моделью долга и DTO долга.
 */

import { BaseMapper } from './base.mapper';
import { Debt, CreateDebtDto, UpdateDebtDto, DebtResponseDto } from '../../types/debt';

/**
 * Маппер для долгов
 *
 * @example
 * ```typescript
 * const debtMapper = new DebtMapper();
 *
 * // Преобразование модели в DTO
 * const debtDto = debtMapper.toDto(debt);
 *
 * // Преобразование DTO в модель
 * const debt = debtMapper.toEntity(createDebtDto);
 *
 * // Обновление модели данными из DTO
 * const updatedDebt = debtMapper.updateEntity(debt, updateDebtDto);
 * ```
 */
export class DebtMapper extends BaseMapper<Debt, DebtResponseDto> {
  /**
   * Преобразует модель долга в DTO ответа
   *
   * @param entity Модель долга
   * @returns DTO ответа
   */
  toDto(entity: Debt): DebtResponseDto {
    return {
      id: entity.id,
      userId: entity.userId,
      title: entity.title,
      description: entity.description,
      amount: entity.amount,
      currency: entity.currency,
      interestRate: entity.interestRate,
      startDate: entity.startDate,
      endDate: entity.endDate,
      status: entity.status,
      remainingAmount: entity.remainingAmount,
      nextPaymentDate: entity.nextPaymentDate,
      nextPaymentAmount: entity.nextPaymentAmount,
      creditorName: entity.creditorName,
      creditorContacts: entity.creditorContacts,
      documentIds: entity.documentIds,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      _responseType: 'debt',
    };
  }

  /**
   * Преобразует DTO ответа в модель долга
   *
   * @param dto DTO ответа
   * @returns Модель долга
   */
  toEntity(dto: DebtResponseDto): Debt {
    return {
      id: dto.id,
      userId: dto.userId,
      title: dto.title,
      description: dto.description,
      amount: dto.amount,
      currency: dto.currency,
      interestRate: dto.interestRate,
      startDate: dto.startDate,
      endDate: dto.endDate,
      status: dto.status,
      remainingAmount: dto.remainingAmount,
      nextPaymentDate: dto.nextPaymentDate,
      nextPaymentAmount: dto.nextPaymentAmount,
      creditorName: dto.creditorName,
      creditorContacts: dto.creditorContacts,
      documentIds: dto.documentIds,
      createdAt: dto.createdAt,
      updatedAt: dto.updatedAt,
    };
  }

  /**
   * Преобразует DTO создания долга в модель долга
   *
   * @param dto DTO создания долга
   * @returns Модель долга
   */
  fromCreateDto(dto: CreateDebtDto): Omit<Debt, 'id' | 'createdAt' | 'updatedAt'> {
    return {
      userId: dto.userId,
      title: dto.title,
      description: dto.description,
      amount: dto.amount,
      currency: dto.currency,
      interestRate: dto.interestRate,
      startDate: dto.startDate,
      endDate: dto.endDate,
      status: dto.status,
      remainingAmount: dto.remainingAmount,
      nextPaymentDate: dto.nextPaymentDate,
      nextPaymentAmount: dto.nextPaymentAmount,
      creditorName: dto.creditorName,
      creditorContacts: dto.creditorContacts,
      documentIds: dto.documentIds,
    };
  }

  /**
   * Обновляет модель долга данными из DTO обновления
   *
   * @param entity Модель долга
   * @param dto DTO обновления долга
   * @returns Обновленная модель долга
   */
  updateFromDto(entity: Debt, dto: UpdateDebtDto): Debt {
    const updated = { ...entity };

    if (dto.title !== undefined) {
      updated.title = dto.title;
    }

    if (dto.description !== undefined) {
      updated.description = dto.description;
    }

    if (dto.amount !== undefined) {
      updated.amount = dto.amount;
    }

    if (dto.currency !== undefined) {
      updated.currency = dto.currency;
    }

    if (dto.interestRate !== undefined) {
      updated.interestRate = dto.interestRate;
    }

    if (dto.startDate !== undefined) {
      updated.startDate = dto.startDate;
    }

    if (dto.endDate !== undefined) {
      updated.endDate = dto.endDate;
    }

    if (dto.status !== undefined) {
      updated.status = dto.status;
    }

    if (dto.remainingAmount !== undefined) {
      updated.remainingAmount = dto.remainingAmount;
    }

    if (dto.nextPaymentDate !== undefined) {
      updated.nextPaymentDate = dto.nextPaymentDate;
    }

    if (dto.nextPaymentAmount !== undefined) {
      updated.nextPaymentAmount = dto.nextPaymentAmount;
    }

    if (dto.creditorName !== undefined) {
      updated.creditorName = dto.creditorName;
    }

    if (dto.creditorContacts !== undefined) {
      updated.creditorContacts = dto.creditorContacts;
    }

    if (dto.documentIds !== undefined) {
      updated.documentIds = dto.documentIds;
    }

    updated.updatedAt = new Date().toISOString();

    return updated;
  }
}
