/**
 * Расширенный маппер для поддержки вложенных объектов и отношений
 *
 * Этот модуль содержит расширенный базовый маппер, который поддерживает
 * вложенные объекты и отношения между сущностями.
 */

import { BaseMapper } from './base.mapper';

/**
 * Интерфейс для отношений между сущностями
 */
export interface RelationConfig<TParent, TChild, TChildDto> {
  /** Имя поля в родительской сущности */
  field: keyof TParent;
  /** Маппер для дочерней сущности */
  mapper: BaseMapper<TChild, TChildDto>;
  /** Флаг, указывающий, что отношение представляет собой массив */
  isArray?: boolean;
}

/**
 * Расширенный маппер для поддержки вложенных объектов и отношений
 *
 * @template TEntity Тип сущности (модель)
 * @template TDto Тип DTO
 *
 * @example
 * ```typescript
 * // Определяем отношения
 * const userWithTransactionsMapper = new NestedMapper<UserWithTransactions, UserWithTransactionsDto>(
 *   userMapper,
 *   [
 *     {
 *       field: 'transactions',
 *       mapper: transactionMapper,
 *       isArray: true
 *     }
 *   ]
 * );
 *
 * // Преобразование модели в DTO с вложенными объектами
 * const userWithTransactionsDto = userWithTransactionsMapper.toDto(userWithTransactions);
 * ```
 */
export class NestedMapper<TEntity, TDto> extends BaseMapper<TEntity, TDto> {
  /**
   * Создает экземпляр расширенного маппера
   *
   * @param baseMapper Базовый маппер для основной сущности
   * @param relations Конфигурация отношений между сущностями
   */
  constructor(
    private readonly baseMapper: BaseMapper<TEntity, TDto>,
    private readonly relations: RelationConfig<TEntity, unknown, unknown>[] = [],
  ) {
    super();
  }

  /**
   * Преобразует модель в DTO с учетом вложенных объектов
   *
   * @param entity Модель
   * @returns DTO с вложенными объектами
   */
  override toDto(entity: TEntity): TDto {
    // Сначала преобразуем основную сущность
    const dto = this.baseMapper.toDto(entity);

    // Затем обрабатываем отношения
    this.relations.forEach(relation => {
      const fieldValue = entity[relation.field];

      if (fieldValue !== undefined && fieldValue !== null) {
        if (relation.isArray && Array.isArray(fieldValue)) {
          // Если отношение - массив, преобразуем каждый элемент
          (dto as Record<string, unknown>)[relation.field as string] =
            relation.mapper.toDtoList(fieldValue);
        } else {
          // Если отношение - одиночный объект, преобразуем его
          (dto as Record<string, unknown>)[relation.field as string] =
            relation.mapper.toDto(fieldValue);
        }
      }
    });

    return dto;
  }

  /**
   * Преобразует DTO в модель с учетом вложенных объектов
   *
   * @param dto DTO
   * @returns Модель с вложенными объектами
   */
  override toEntity(dto: TDto): TEntity {
    // Сначала преобразуем основное DTO
    const entity = this.baseMapper.toEntity(dto);

    // Затем обрабатываем отношения
    this.relations.forEach(relation => {
      const fieldValue = (dto as any)[relation.field];

      if (fieldValue !== undefined && fieldValue !== null) {
        if (relation.isArray && Array.isArray(fieldValue)) {
          // Если отношение - массив, преобразуем каждый элемент
          (entity as Record<string, unknown>)[relation.field as string] =
            relation.mapper.toEntityList(fieldValue);
        } else {
          // Если отношение - одиночный объект, преобразуем его
          (entity as Record<string, unknown>)[relation.field as string] =
            relation.mapper.toEntity(fieldValue);
        }
      }
    });

    return entity;
  }

  /**
   * Преобразует массив моделей в массив DTO с учетом вложенных объектов
   *
   * @param entities Массив моделей
   * @returns Массив DTO с вложенными объектами
   */
  override toDtoList(entities: TEntity[]): TDto[] {
    return entities.map(entity => this.toDto(entity));
  }

  /**
   * Преобразует массив DTO в массив моделей с учетом вложенных объектов
   *
   * @param dtos Массив DTO
   * @returns Массив моделей с вложенными объектами
   */
  override toEntityList(dtos: TDto[]): TEntity[] {
    return dtos.map(dto => this.toEntity(dto));
  }
}
