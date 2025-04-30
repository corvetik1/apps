/**
 * Маппер для пользователя с транзакциями
 *
 * Этот модуль содержит маппер для преобразования между
 * моделью пользователя с транзакциями и соответствующим DTO.
 */

import { NestedMapper, RelationConfig } from './nested.mapper';
import { BaseMapper } from './base.mapper';
import { UserMapper } from './user.mapper';
import { TransactionMapper } from './transaction.mapper';
import { UserWithTransactions, UserWithTransactionsDto } from '../../types/user-with-transactions';
import { Transaction, TransactionResponseDto } from '../../types/transaction';

/**
 * Маппер для пользователя с транзакциями
 *
 * @example
 * ```typescript
 * const userWithTransactionsMapper = new UserWithTransactionsMapper();
 *
 * // Преобразование модели в DTO
 * const userWithTransactionsDto = userWithTransactionsMapper.toDto(userWithTransactions);
 *
 * // Преобразование DTO в модель
 * const userWithTransactions = userWithTransactionsMapper.toEntity(userWithTransactionsDto);
 * ```
 */
export class UserWithTransactionsMapper extends NestedMapper<
  UserWithTransactions,
  UserWithTransactionsDto
> {
  /**
   * Создает экземпляр маппера для пользователя с транзакциями
   */
  constructor() {
    // Создаем базовые мапперы
    const userMapper = new UserMapper();
    const transactionMapper = new TransactionMapper();

    // Определяем отношения
    const relations: RelationConfig<UserWithTransactions, Transaction, TransactionResponseDto>[] = [
      {
        field: 'transactions',
        mapper: transactionMapper,
        isArray: true,
      },
    ];

    // Инициализируем базовый класс
    super(
      userMapper as unknown as BaseMapper<UserWithTransactions, UserWithTransactionsDto>,
      relations,
    );
  }

  /**
   * Преобразует модель пользователя с транзакциями в DTO
   *
   * @param entity Модель пользователя с транзакциями
   * @returns DTO пользователя с транзакциями
   */
  override toDto(entity: UserWithTransactions): UserWithTransactionsDto {
    // Получаем базовое DTO
    const dto = super.toDto(entity) as UserWithTransactionsDto;

    // Устанавливаем тип ответа
    dto._responseType = 'user_with_transactions';

    return dto;
  }
}
