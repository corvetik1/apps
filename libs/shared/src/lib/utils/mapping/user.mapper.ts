/**
 * Маппер для пользователей
 *
 * Этот модуль содержит маппер для преобразования между
 * моделью пользователя и DTO пользователя.
 */

import { BaseMapper } from './base.mapper';
import { User, CreateUserDto, UpdateUserDto, UserResponseDto } from '../../types/user';

/**
 * Маппер для пользователей
 *
 * @example
 * ```typescript
 * const userMapper = new UserMapper();
 *
 * // Преобразование модели в DTO
 * const userDto = userMapper.toDto(user);
 *
 * // Преобразование DTO в модель
 * const user = userMapper.toEntity(createUserDto);
 *
 * // Обновление модели данными из DTO
 * const updatedUser = userMapper.updateEntity(user, updateUserDto);
 * ```
 */
export class UserMapper extends BaseMapper<User, UserResponseDto> {
  /**
   * Преобразует модель пользователя в DTO ответа
   *
   * @param entity Модель пользователя
   * @returns DTO ответа
   */
  toDto(entity: User): UserResponseDto {
    return {
      id: entity.id,
      email: entity.email,
      name: entity.name,
      role: entity.role,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      _responseType: 'user',
    };
  }

  /**
   * Преобразует DTO ответа в модель пользователя
   *
   * @param dto DTO ответа
   * @returns Модель пользователя
   */
  toEntity(dto: UserResponseDto): User {
    return {
      id: dto.id,
      email: dto.email,
      name: dto.name,
      role: dto.role,
      createdAt: dto.createdAt,
      updatedAt: dto.updatedAt,
    };
  }

  /**
   * Преобразует DTO создания пользователя в модель пользователя
   *
   * @param dto DTO создания пользователя
   * @returns Модель пользователя
   */
  /**
   * Создает частичную модель пользователя из DTO создания
   * Примечание: password не включается в модель User, но используется при создании
   *
   * @param dto DTO создания пользователя
   * @returns Частичная модель пользователя
   */
  fromCreateDto(dto: CreateUserDto): Omit<User, 'id' | 'createdAt' | 'updatedAt'> {
    return {
      email: dto.email,
      name: dto.name,
      role: dto.role,
      // password обрабатывается отдельно в сервисе аутентификации
    };
  }

  /**
   * Обновляет модель пользователя данными из DTO обновления
   *
   * @param entity Модель пользователя
   * @param dto DTO обновления пользователя
   * @returns Обновленная модель пользователя
   */
  /**
   * Обновляет модель пользователя данными из DTO обновления
   * Примечание: password не включается в модель User, но может быть в UpdateUserDto
   *
   * @param entity Модель пользователя
   * @param dto DTO обновления пользователя
   * @returns Обновленная модель пользователя
   */
  updateFromDto(entity: User, dto: UpdateUserDto): User {
    const updated = { ...entity };

    if (dto.name !== undefined) {
      updated.name = dto.name;
    }

    if (dto.email !== undefined) {
      updated.email = dto.email;
    }

    if (dto.role !== undefined) {
      updated.role = dto.role;
    }

    // password обрабатывается отдельно в сервисе аутентификации

    updated.updatedAt = new Date().toISOString();

    return updated;
  }
}
