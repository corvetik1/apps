import { Injectable } from '@nestjs/common';
// Импортируем только необходимые типы
import { 
  CreateTransactionDto, 
  TransactionResponseDto
} from '@finance-platform/shared';
// Временная заглушка для PrismaService до этапа I (Инициализация БД)
// @ts-expect-error - ожидаем ошибку импорта для заглушки
import { PrismaService } from '../../prisma/prisma.service.mock';

/**
 * Сервис для работы с транзакциями
 */
@Injectable()
export class TransactionsService {
  constructor(private prisma: PrismaService) {}

  /**
   * Получить список транзакций с возможностью фильтрации
   * @param query Параметры запроса для фильтрации
   */
  async findAll(query?: { startDate?: string; endDate?: string; type?: string; limit?: number; offset?: number }): Promise<TransactionResponseDto[]> {
    // Создаем базовый фильтр
    const filter: any = {};
    
    // Добавляем условия фильтрации, если они указаны
    if (query) {
      // Фильтрация по дате
      if (query.startDate || query.endDate) {
        filter.date = {};
        
        if (query.startDate) {
          filter.date.gte = new Date(query.startDate);
        }
        
        if (query.endDate) {
          filter.date.lte = new Date(query.endDate);
        }
      }
      
      // Фильтрация по типу транзакции
      if (query.type) {
        filter.type = query.type;
      }
    }

    // Применяем пагинацию, если указаны параметры
    const pagination = {};
    if (query && query.limit !== undefined) {
      pagination['take'] = Number(query.limit);
      
      if (query.offset !== undefined) {
        pagination['skip'] = Number(query.offset);
      }
    }
    
    const transactions = await this.prisma.transaction.findMany({
      where: filter,
      include: {
        account: true,
        category: true,
      },
      ...pagination,
      orderBy: {
        date: 'desc',
      },
    });
    
    return transactions.map(transaction => ({
      id: transaction.id,
      tenderId: transaction.tenderId,
      amount: transaction.amount,
      currency: transaction.currency,
      description: transaction.description,
      date: transaction.date,
      accountId: transaction.accountId,
      categoryId: transaction.categoryId,
      type: transaction.type,
      createdAt: transaction.createdAt,
      updatedAt: transaction.updatedAt
    }));
  }

  /**
   * Получить транзакцию по ID
   */
  async findOne(id: string): Promise<TransactionResponseDto> {
    const transaction = await this.prisma.transaction.findUnique({
      where: { id },
      include: {
        account: true,
        category: true,
      },
    });

    if (!transaction) {
      return null;
    }

    return {
      id: transaction.id,
      tenderId: transaction.tenderId || '',
      amount: transaction.amount,
      currency: transaction.currency || 'RUB',
      description: transaction.description,
      date: transaction.date,
      accountId: transaction.accountId,
      categoryId: transaction.categoryId,
      type: transaction.type,
      createdAt: transaction.createdAt || new Date(),
      updatedAt: transaction.updatedAt || new Date()
    };
  }

  /**
   * Создать новую транзакцию
   */
  async create(createTransactionDto: CreateTransactionDto): Promise<TransactionResponseDto> {
    const { tenderId, accountId, categoryId, amount, currency, description, date, type } = createTransactionDto;

    const transaction = await this.prisma.transaction.create({
      data: {
        tenderId,
        amount,
        currency,
        description,
        date: new Date(date),
        type,
        account: {
          connect: { id: accountId }
        },
        category: categoryId ? {
          connect: { id: categoryId }
        } : undefined
      },
      include: {
        account: true,
        category: true,
      },
    });

    return {
      id: transaction.id,
      tenderId: transaction.tenderId || '',
      amount: transaction.amount,
      currency: transaction.currency || 'RUB',
      description: transaction.description,
      date: transaction.date,
      accountId: transaction.accountId,
      categoryId: transaction.categoryId,
      type: transaction.type,
      createdAt: transaction.createdAt || new Date(),
      updatedAt: transaction.updatedAt || new Date()
    };
  }

  /**
   * Обновить существующую транзакцию
   */
  async update(id: string, updateTransactionDto: Partial<CreateTransactionDto>): Promise<TransactionResponseDto> {
    const { tenderId, accountId, categoryId, amount, currency, description, date, type } = updateTransactionDto;

    const transaction = await this.prisma.transaction.update({
      where: { id },
      data: {
        tenderId,
        amount,
        currency,
        description,
        date: date ? new Date(date) : undefined,
        type,
        account: accountId ? {
          connect: { id: accountId }
        } : undefined,
        category: categoryId ? {
          connect: { id: categoryId }
        } : undefined
      },
      include: {
        account: true,
        category: true,
      },
    });

    return {
      id: transaction.id,
      tenderId: transaction.tenderId || '',
      amount: transaction.amount,
      currency: transaction.currency || 'RUB',
      description: transaction.description,
      date: transaction.date,
      accountId: transaction.accountId,
      categoryId: transaction.categoryId,
      type: transaction.type,
      createdAt: transaction.createdAt || new Date(),
      updatedAt: transaction.updatedAt || new Date()
    };
  }

  /**
   * Удалить транзакцию
   */
  async remove(id: string): Promise<void> {
    await this.prisma.transaction.delete({
      where: { id },
    });
  }
}
