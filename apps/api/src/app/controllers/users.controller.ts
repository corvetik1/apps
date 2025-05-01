/**
 * Контроллер для работы с пользователями
 *
 * Этот контроллер демонстрирует использование валидации DTO
 * на основе JSON-схем.
 */

import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  HttpCode,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDto, UpdateUserDto, UserResponseDto } from '@finance-platform/shared';
import { UsersService } from '../services/users.service';
import { AuthGuard } from '../guards/auth.guard';

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
   * @param id ID пользователя
   * @returns Данные пользователя
   */
  @Get(':id')
  async findById(@Param('id') id: string): Promise<UserResponseDto> {
    return this.usersService.findById(id);
  }

  /**
   * Создание нового пользователя
   *
   * @param createUserDto DTO для создания пользователя
   * @returns Созданный пользователь
   */
  @Post()
  async create(@Body() createUserDto: CreateUserDto): Promise<UserResponseDto> {
    return this.usersService.create(createUserDto);
  }

  /**
   * Обновление пользователя
   *
   * @param id ID пользователя
   * @param updateUserDto DTO для обновления пользователя
   * @returns Обновленный пользователь
   */
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    return this.usersService.update(id, updateUserDto);
  }

  /**
   * Удаление пользователя
   *
   * @param id ID пользователя
   * @returns Ничего не возвращает (204 No Content)
   */
  @Delete(':id')
  @HttpCode(204)
  async remove(@Param('id') id: string): Promise<void> {
    await this.usersService.remove(id);
  }
}
