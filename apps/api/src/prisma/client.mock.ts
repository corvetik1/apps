/**
 * Заглушка для PrismaClient
 * Будет заменена на реальную реализацию на этапе I (Инициализация БД)
 */
export class PrismaClient {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  constructor(_options?: any) {
    // Игнорируем параметры в заглушке
  }
  
  $connect(): Promise<void> {
    return Promise.resolve();
  }

  $disconnect(): Promise<void> {
    return Promise.resolve();
  }
  
  // Заглушки для основных моделей
  transaction = {
    findMany: () => Promise.resolve([]),
    findUnique: () => Promise.resolve(null),
    create: () => Promise.resolve({}),
    update: () => Promise.resolve({}),
    delete: () => Promise.resolve({})
  }
}
