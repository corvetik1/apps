/**
 * Контроллер для работы с пользователями
 *
 * Этот контроллер демонстрирует использование валидации DTO
 * на основе JSON-схем.
 */

import { Controller, Get, Post, Put, Delete, Param, HttpCode, UseGuards } from '@nestjs/common';
import {
  User,
  CreateUserDto,
  UpdateUserDto,
  UserResponseDto,
} from '@finance-platform/shared/lib/types/user';
import {
  userSchema,
  createUserSchema,
  updateUserSchema,
  idParamsSchema,
} from '@finance-platform/shared/lib/schemas/user';
import { ValidateBody, ValidateParams } from '../decorators/validate.decorator';
import { UsersService } from '../services/users.service';
import { AuthGuard } from '../guards/auth.guard';

/**
 * Интерфейс для параметров с ID
 */
interface IdParams {
  id: string;
}

/**
 * Контроллер для работы с пользователями
 */
@Controller('v1/users')
@UseGuards(AuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /**
   * Получение списка всех пользователей
   *
   * @returns Список пользователей
   */
  @Get()
  async findAll(): Promise<UserResponseDto[]> {
    return this.usersService.findAll();
  }

  /**
   * Получение пользователя по ID
   *
   * @param params Параметры запроса с ID пользователя
   * @returns Данные пользователя
   */
  @Get(':id')
  async findById(@ValidateParams(idParamsSchema) params: IdParams): Promise<UserResponseDto> {
    return this.usersService.findById(params.id);
  }

  /**
   * Создание нового пользователя
   *
   * @param createUserDto DTO для создания пользователя
   * @returns Созданный пользователь
   */
  @Post()
  async create(
    @ValidateBody(createUserSchema) createUserDto: CreateUserDto,
  ): Promise<UserResponseDto> {
    return this.usersService.create(createUserDto);
  }

  /**
   * Обновление пользователя
   *
   * @param params Параметры запроса с ID пользователя
   * @param updateUserDto DTO для обновления пользователя
   * @returns Обновленный пользователь
   */
  @Put(':id')
  async update(
    @ValidateParams(idParamsSchema) params: IdParams,
    @ValidateBody(updateUserSchema) updateUserDto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    return this.usersService.update(params.id, updateUserDto);
  }

  /**
   * Удаление пользователя
   *
   * @param params Параметры запроса с ID пользователя
   * @returns Ничего не возвращает (204 No Content)
   */
  @Delete(':id')
  @HttpCode(204)
  async remove(@ValidateParams(idParamsSchema) params: IdParams): Promise<void> {
    await this.usersService.remove(params.id);
  }
}
