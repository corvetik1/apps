/**
 * Базовый класс для маппинга между DTO и моделями
 *
 * Этот модуль содержит базовый класс для маппинга между DTO и моделями,
 * а также интерфейсы для маппинга.
 */

/**
 * Интерфейс для маппера
 *
 * @template TEntity Тип сущности (модель)
 * @template TDto Тип DTO
 */
export interface IMapper<TEntity, TDto> {
  /**
   * Преобразует модель в DTO
   *
   * @param entity Модель
   * @returns DTO
   */
  toDto(entity: TEntity): TDto;

  /**
   * Преобразует DTO в модель
   *
   * @param dto DTO
   * @returns Модель
   */
  toEntity(dto: TDto): TEntity;

  /**
   * Преобразует массив моделей в массив DTO
   *
   * @param entities Массив моделей
   * @returns Массив DTO
   */
  toDtoList(entities: TEntity[]): TDto[];

  /**
   * Преобразует массив DTO в массив моделей
   *
   * @param dtos Массив DTO
   * @returns Массив моделей
   */
  toEntityList(dtos: TDto[]): TEntity[];
}

/**
 * Базовый класс для маппинга между DTO и моделями
 *
 * @template TEntity Тип сущности (модель)
 * @template TDto Тип DTO
 *
 * @example
 * ```typescript
 * class UserMapper extends BaseMapper<User, UserDto> {
 *   toDto(entity: User): UserDto {
 *     return {
 *       id: entity.id,
 *       name: entity.name,
 *       email: entity.email,
 *       role: entity.role
 *     };
 *   }
 *
 *   toEntity(dto: UserDto): User {
 *     return {
 *       id: dto.id,
 *       name: dto.name,
 *       email: dto.email,
 *       role: dto.role,
 *       password: '', // Поле, которого нет в DTO
 *       createdAt: new Date(),
 *       updatedAt: new Date()
 *     };
 *   }
 * }
 * ```
 */
export abstract class BaseMapper<TEntity, TDto> implements IMapper<TEntity, TDto> {
  /**
   * Преобразует модель в DTO
   *
   * @param entity Модель
   * @returns DTO
   */
  abstract toDto(entity: TEntity): TDto;

  /**
   * Преобразует DTO в модель
   *
   * @param dto DTO
   * @returns Модель
   */
  abstract toEntity(dto: TDto): TEntity;

  /**
   * Преобразует массив моделей в массив DTO
   *
   * @param entities Массив моделей
   * @returns Массив DTO
   */
  toDtoList(entities: TEntity[]): TDto[] {
    return entities.map(entity => this.toDto(entity));
  }

  /**
   * Преобразует массив DTO в массив моделей
   *
   * @param dtos Массив DTO
   * @returns Массив моделей
   */
  toEntityList(dtos: TDto[]): TEntity[] {
    return dtos.map(dto => this.toEntity(dto));
  }

  /**
   * Пакетно преобразует массив моделей в массив DTO с оптимизацией для больших наборов данных
   *
   * @param entities Массив моделей
   * @param batchSize Размер пакета (по умолчанию 100)
   * @returns Массив DTO
   */
  batchToDtoList(entities: TEntity[], batchSize = 100): TDto[] {
    const result: TDto[] = [];

    // Обрабатываем данные пакетами для оптимизации памяти и производительности
    for (let i = 0; i < entities.length; i += batchSize) {
      const batch = entities.slice(i, i + batchSize);
      const dtos = batch.map(entity => this.toDto(entity));
      result.push(...dtos);
    }

    return result;
  }

  /**
   * Пакетно преобразует массив DTO в массив моделей с оптимизацией для больших наборов данных
   *
   * @param dtos Массив DTO
   * @param batchSize Размер пакета (по умолчанию 100)
   * @returns Массив моделей
   */
  batchToEntityList(dtos: TDto[], batchSize = 100): TEntity[] {
    const result: TEntity[] = [];

    // Обрабатываем данные пакетами для оптимизации памяти и производительности
    for (let i = 0; i < dtos.length; i += batchSize) {
      const batch = dtos.slice(i, i + batchSize);
      const entities = batch.map(dto => this.toEntity(dto));
      result.push(...entities);
    }

    return result;
  }

  /**
   * Обновляет модель данными из DTO
   *
   * @param entity Модель для обновления
   * @param dto DTO с новыми данными
   * @returns Обновленная модель
   */
  updateEntity(entity: TEntity, dto: Partial<TDto>): TEntity {
    return { ...entity, ...dto };
  }
}
