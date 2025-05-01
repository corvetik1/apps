import { Injectable } from '@nestjs/common';
import { User, CreateUserDto, UpdateUserDto, Role } from '@finance-platform/shared';

/**
 * Сервис для работы с пользователями
 */
@Injectable()
export class UsersService {
  // В реальном приложении здесь будет взаимодействие с БД через Prisma
  private users: User[] = [
    {
      id: '1',
      email: 'admin@example.com',
      name: 'Admin User',
      role: Role.Admin,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: '2',
      email: 'manager@example.com',
      name: 'Manager User',
      role: Role.Manager,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: '3',
      email: 'user@example.com',
      name: 'Regular User',
      role: Role.User,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  /**
   * Получить всех пользователей
   */
  findAll(): User[] {
    return this.users;
  }

  /**
   * Найти пользователя по ID
   */
  findById(id: string): User | undefined {
    return this.users.find(user => user.id === id);
  }

  /**
   * Найти пользователя по email
   */
  findByEmail(email: string): User | undefined {
    return this.users.find(user => user.email === email);
  }

  /**
   * Создать нового пользователя
   */
  create(createUserDto: CreateUserDto): User {
    const newUser: User = {
      id: (this.users.length + 1).toString(),
      ...createUserDto,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.users.push(newUser);
    return newUser;
  }

  /**
   * Обновить данные пользователя
   */
  update(id: string, updateUserDto: UpdateUserDto): User | undefined {
    const userIndex = this.users.findIndex(user => user.id === id);

    if (userIndex === -1) {
      return undefined;
    }

    const updatedUser: User = {
      ...this.users[userIndex],
      ...updateUserDto,
      updatedAt: new Date().toISOString(),
    };

    this.users[userIndex] = updatedUser;
    return updatedUser;
  }

  /**
   * Удалить пользователя
   */
  remove(id: string): boolean {
    const userIndex = this.users.findIndex(user => user.id === id);

    if (userIndex === -1) {
      return false;
    }

    this.users.splice(userIndex, 1);
    return true;
  }
}
