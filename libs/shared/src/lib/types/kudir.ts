/**
 * Типы для книги учета доходов и расходов (КУДиР)
 *
 * Этот модуль содержит типы для работы с книгой учета доходов и расходов,
 * используемой индивидуальными предпринимателями и организациями на УСН.
 */

/**
 * Тип операции в КУДиР
 */
export enum KudirOperationType {
  /** Доход */
  Income = 'income',
  /** Расход */
  Expense = 'expense',
}

/**
 * Статус операции в КУДиР
 */
export enum KudirOperationStatus {
  /** Черновик */
  Draft = 'draft',
  /** Проведена */
  Completed = 'completed',
  /** Отменена */
  Cancelled = 'cancelled',
}

/**
 * Интерфейс операции в КУДиР
 */
export interface KudirOperation {
  /** Уникальный идентификатор операции */
  id: string;
  /** Дата операции */
  date: string;
  /** Тип операции */
  type: KudirOperationType;
  /** Статус операции */
  status: KudirOperationStatus;
  /** Номер документа */
  documentNumber: string;
  /** Содержание операции */
  description: string;
  /** Сумма операции */
  amount: number;
  /** Налоговая ставка (в процентах) */
  taxRate: number;
  /** Сумма налога */
  taxAmount: number;
  /** Идентификатор контрагента */
  counterpartyId?: string;
  /** Идентификатор пользователя, создавшего операцию */
  createdBy: string;
  /** Дата создания */
  createdAt: string;
  /** Дата последнего обновления */
  updatedAt: string;
}

/**
 * Интерфейс для создания операции в КУДиР
 */
export type CreateKudirOperationRequest = Omit<KudirOperation, 'id' | 'createdAt' | 'updatedAt' | 'taxAmount'> & {
  /** Сумма налога (опционально, рассчитывается автоматически) */
  taxAmount?: number;
};

/**
 * Интерфейс для обновления операции в КУДиР
 */
export type UpdateKudirOperationRequest = Partial<Omit<KudirOperation, 'id' | 'createdAt' | 'updatedAt' | 'createdBy'>>;

/**
 * Интерфейс для фильтрации операций в КУДиР
 */
export interface KudirOperationFilter {
  /** Начальная дата периода */
  startDate?: string;
  /** Конечная дата периода */
  endDate?: string;
  /** Тип операции */
  type?: KudirOperationType;
  /** Статус операции */
  status?: KudirOperationStatus;
  /** Минимальная сумма */
  minAmount?: number;
  /** Максимальная сумма */
  maxAmount?: number;
  /** Идентификатор контрагента */
  counterpartyId?: string;
  /** Поисковый запрос (для поиска по описанию или номеру документа) */
  searchQuery?: string;
}

/**
 * Интерфейс для итогов КУДиР за период
 */
export interface KudirSummary {
  /** Начальная дата периода */
  startDate: string;
  /** Конечная дата периода */
  endDate: string;
  /** Общая сумма доходов */
  totalIncome: number;
  /** Общая сумма расходов */
  totalExpense: number;
  /** Налогооблагаемая база */
  taxableIncome: number;
  /** Сумма налога */
  taxAmount: number;
  /** Налоговая ставка (в процентах) */
  taxRate: number;
}
