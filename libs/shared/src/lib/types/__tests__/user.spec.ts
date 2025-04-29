import { describe, it, expect } from '@jest/globals';
import { Role, User, CreateUserDto, UpdateUserDto, UserResponseDto } from '../user';

describe('User типы', () => {
  describe('Role enum', () => {
    it('должен содержать все необходимые роли', () => {
      expect(Role.Admin).toBe('admin');
      expect(Role.Manager).toBe('manager');
      expect(Role.User).toBe('user');
      expect(Role.Guest).toBe('guest');
    });
  });

  describe('User интерфейс', () => {
    it('должен позволять создавать корректные объекты пользователя', () => {
      const user: User = {
        id: '1',
        email: 'test@example.com',
        name: 'Test User',
        role: Role.User,
        createdAt: '2023-01-01T00:00:00Z',
        updatedAt: '2023-01-01T00:00:00Z',
      };

      expect(user.id).toBe('1');
      expect(user.email).toBe('test@example.com');
      expect(user.name).toBe('Test User');
      expect(user.role).toBe(Role.User);
      expect(user.createdAt).toBe('2023-01-01T00:00:00Z');
      expect(user.updatedAt).toBe('2023-01-01T00:00:00Z');
    });
  });

  describe('CreateUserDto', () => {
    it('должен позволять создавать DTO без id и временных меток', () => {
      const createUserDto: CreateUserDto = {
        email: 'test@example.com',
        name: 'Test User',
        role: Role.User,
        password: 'password123',
      };

      expect(createUserDto.email).toBe('test@example.com');
      expect(createUserDto.name).toBe('Test User');
      expect(createUserDto.role).toBe(Role.User);
      expect(createUserDto.password).toBe('password123');
      // @ts-expect-error - id не должен быть в CreateUserDto
      expect(createUserDto.id).toBeUndefined();
      // @ts-expect-error - createdAt не должен быть в CreateUserDto
      expect(createUserDto.createdAt).toBeUndefined();
      // @ts-expect-error - updatedAt не должен быть в CreateUserDto
      expect(createUserDto.updatedAt).toBeUndefined();
    });
  });

  describe('UpdateUserDto', () => {
    it('должен позволять обновлять только некоторые поля', () => {
      const updateUserDto: UpdateUserDto = {
        name: 'Updated User',
      };

      expect(updateUserDto.name).toBe('Updated User');
      // Все поля должны быть опциональными
      const emptyUpdateDto: UpdateUserDto = {};
      expect(emptyUpdateDto).toEqual({});
    });
  });

  describe('UserResponseDto', () => {
    it('должен содержать все поля User кроме пароля', () => {
      const userResponseDto: UserResponseDto = {
        id: '1',
        email: 'test@example.com',
        name: 'Test User',
        role: Role.User,
        createdAt: '2023-01-01T00:00:00Z',
        updatedAt: '2023-01-01T00:00:00Z',
      };

      expect(userResponseDto.id).toBe('1');
      expect(userResponseDto.email).toBe('test@example.com');
      expect(userResponseDto.name).toBe('Test User');
      expect(userResponseDto.role).toBe(Role.User);
      expect(userResponseDto.createdAt).toBe('2023-01-01T00:00:00Z');
      expect(userResponseDto.updatedAt).toBe('2023-01-01T00:00:00Z');
      // @ts-expect-error - password не должен быть в UserResponseDto
      expect(userResponseDto.password).toBeUndefined();
    });
  });
});
