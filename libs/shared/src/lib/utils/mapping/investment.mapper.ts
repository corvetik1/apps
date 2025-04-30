/**
 * Маппер для инвестиций
 *
 * Этот модуль содержит маппер для преобразования между
 * моделью инвестиции и DTO инвестиции.
 */

import { BaseMapper } from './base.mapper';
import {
  Investment,
  CreateInvestmentDto,
  UpdateInvestmentDto,
  InvestmentResponseDto,
} from '../../types/investment';

/**
 * Маппер для инвестиций
 *
 * @example
 * ```typescript
 * const investmentMapper = new InvestmentMapper();
 *
 * // Преобразование модели в DTO
 * const investmentDto = investmentMapper.toDto(investment);
 *
 * // Преобразование DTO в модель
 * const investment = investmentMapper.toEntity(createInvestmentDto);
 *
 * // Обновление модели данными из DTO
 * const updatedInvestment = investmentMapper.updateEntity(investment, updateInvestmentDto);
 * ```
 */
export class InvestmentMapper extends BaseMapper<Investment, InvestmentResponseDto> {
  /**
   * Преобразует модель инвестиции в DTO ответа
   *
   * @param entity Модель инвестиции
   * @returns DTO ответа
   */
  toDto(entity: Investment): InvestmentResponseDto {
    return {
      id: entity.id,
      userId: entity.userId,
      title: entity.title,
      description: entity.description,
      type: entity.type,
      status: entity.status,
      amount: entity.amount,
      currency: entity.currency,
      purchaseDate: entity.purchaseDate,
      purchasePrice: entity.purchasePrice,
      currentPrice: entity.currentPrice,
      quantity: entity.quantity,
      ticker: entity.ticker,
      exchange: entity.exchange,
      profit: entity.profit,
      profitPercentage: entity.profitPercentage,
      dividends: entity.dividends,
      fees: entity.fees,
      taxes: entity.taxes,
      maturityDate: entity.maturityDate,
      interestRate: entity.interestRate,
      accountId: entity.accountId,
      documentIds: entity.documentIds,
      tags: entity.tags,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      _responseType: 'investment',
    };
  }

  /**
   * Преобразует DTO ответа в модель инвестиции
   *
   * @param dto DTO ответа
   * @returns Модель инвестиции
   */
  toEntity(dto: InvestmentResponseDto): Investment {
    return {
      id: dto.id,
      userId: dto.userId,
      title: dto.title,
      description: dto.description,
      type: dto.type,
      status: dto.status,
      amount: dto.amount,
      currency: dto.currency,
      purchaseDate: dto.purchaseDate,
      purchasePrice: dto.purchasePrice,
      currentPrice: dto.currentPrice,
      quantity: dto.quantity,
      ticker: dto.ticker,
      exchange: dto.exchange,
      profit: dto.profit,
      profitPercentage: dto.profitPercentage,
      dividends: dto.dividends,
      fees: dto.fees,
      taxes: dto.taxes,
      maturityDate: dto.maturityDate,
      interestRate: dto.interestRate,
      accountId: dto.accountId,
      documentIds: dto.documentIds,
      tags: dto.tags,
      createdAt: dto.createdAt,
      updatedAt: dto.updatedAt,
    };
  }

  /**
   * Преобразует DTO создания инвестиции в модель инвестиции
   *
   * @param dto DTO создания инвестиции
   * @returns Модель инвестиции
   */
  fromCreateDto(dto: CreateInvestmentDto): Omit<Investment, 'id' | 'createdAt' | 'updatedAt'> {
    return {
      userId: dto.userId,
      title: dto.title,
      description: dto.description,
      type: dto.type,
      status: dto.status,
      amount: dto.amount,
      currency: dto.currency,
      purchaseDate: dto.purchaseDate,
      purchasePrice: dto.purchasePrice,
      currentPrice: dto.currentPrice,
      quantity: dto.quantity,
      ticker: dto.ticker,
      exchange: dto.exchange,
      profit: dto.profit,
      profitPercentage: dto.profitPercentage,
      dividends: dto.dividends,
      fees: dto.fees,
      taxes: dto.taxes,
      maturityDate: dto.maturityDate,
      interestRate: dto.interestRate,
      accountId: dto.accountId,
      documentIds: dto.documentIds,
      tags: dto.tags,
    };
  }

  /**
   * Обновляет модель инвестиции данными из DTO обновления
   *
   * @param entity Модель инвестиции
   * @param dto DTO обновления инвестиции
   * @returns Обновленная модель инвестиции
   */
  updateFromDto(entity: Investment, dto: UpdateInvestmentDto): Investment {
    const updated = { ...entity };

    // Обновляем все поля, которые присутствуют в DTO
    Object.keys(dto).forEach(key => {
      if (dto[key as keyof UpdateInvestmentDto] !== undefined) {
        (updated as any)[key] = dto[key as keyof UpdateInvestmentDto];
      }
    });

    // Обновляем дату изменения
    updated.updatedAt = new Date().toISOString();

    return updated;
  }
}
