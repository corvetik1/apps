/**
 * Типы для пользователя с транзакциями
 *
 * Этот модуль содержит типы для представления пользователя
 * с его транзакциями (пример вложенных объектов).
 */

import { User, UserResponseDto } from './user';
import { Transaction, TransactionResponseDto } from './transaction';

/**
 * Интерфейс пользователя с транзакциями
 *
 * @example
 * ```typescript
 * const userWithTransactions: UserWithTransactions = {
 *   ...user,
 *   transactions: [transaction1, transaction2]
 * };
 * ```
 */
export interface UserWithTransactions extends User {
  /** Транзакции пользователя */
  transactions: Transaction[];
}

/**
 * DTO для ответа с данными пользователя и его транзакциями
 *
 * @example
 * ```typescript
 * const userWithTransactionsDto: UserWithTransactionsDto = {
 *   ...userDto,
 *   transactions: [transactionDto1, transactionDto2],
 *   _responseType: 'user_with_transactions'
 * };
 * ```
 */
export interface UserWithTransactionsDto extends Omit<UserResponseDto, '_responseType'> {
  /** Транзакции пользователя */
  transactions: TransactionResponseDto[];
  /** Тип ответа */
  _responseType?: 'user_with_transactions';
}
