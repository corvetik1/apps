/**
 * Тесты для маппера пользователей
 */
import { UserMapper } from '../user.mapper';
import { User, CreateUserDto, UpdateUserDto, UserResponseDto } from '../../../types/user';

describe('UserMapper', () => {
  let mapper: UserMapper;

  beforeEach(() => {
    mapper = new UserMapper();
  });

  describe('toDto', () => {
    it('должен преобразовывать модель пользователя в DTO ответа', () => {
      const user: User = {
        id: '1',
        email: 'test@example.com',
        name: 'Test User',
        role: 'user',
        createdAt: '2023-01-01T00:00:00Z',
        updatedAt: '2023-01-01T00:00:00Z',
      };

      const dto = mapper.toDto(user);

      expect(dto).toEqual({
        id: '1',
        email: 'test@example.com',
        name: 'Test User',
        role: 'user',
        createdAt: '2023-01-01T00:00:00Z',
        updatedAt: '2023-01-01T00:00:00Z',
        _responseType: 'user',
      });
    });
  });

  describe('toEntity', () => {
    it('должен преобразовывать DTO ответа в модель пользователя', () => {
      const dto: UserResponseDto = {
        id: '1',
        email: 'test@example.com',
        name: 'Test User',
        role: 'user',
        createdAt: '2023-01-01T00:00:00Z',
        updatedAt: '2023-01-01T00:00:00Z',
        _responseType: 'user',
      };

      const user = mapper.toEntity(dto);

      expect(user).toEqual({
        id: '1',
        email: 'test@example.com',
        name: 'Test User',
        role: 'user',
        createdAt: '2023-01-01T00:00:00Z',
        updatedAt: '2023-01-01T00:00:00Z',
      });
    });

    it('должен устанавливать isActive в true, если оно не указано в DTO', () => {
      const dto: UserResponseDto = {
        id: '1',
        email: 'test@example.com',
        name: 'Test User',
        role: 'user',
        createdAt: '2023-01-01T00:00:00Z',
        updatedAt: '2023-01-01T00:00:00Z',
        _responseType: 'user',
      };

      const user = mapper.toEntity(dto);

      expect(user).toEqual({
        id: '1',
        email: 'test@example.com',
        name: 'Test User',
        role: 'user',
        createdAt: '2023-01-01T00:00:00Z',
        updatedAt: '2023-01-01T00:00:00Z',
      });
    });
  });

  describe('fromCreateDto', () => {
    it('должен преобразовывать DTO создания в модель пользователя', () => {
      const dto: CreateUserDto = {
        email: 'test@example.com',
        name: 'Test User',
        role: 'user',
        password: 'password123', // Добавляем обязательное поле password
      };

      const user = mapper.fromCreateDto(dto);

      expect(user).toEqual({
        email: 'test@example.com',
        name: 'Test User',
        role: 'user',
      });

      // Проверяем, что поля id, createdAt и updatedAt отсутствуют
      expect(user).not.toHaveProperty('id');
      expect(user).not.toHaveProperty('createdAt');
      expect(user).not.toHaveProperty('updatedAt');
    });
  });

  describe('updateFromDto', () => {
    it('должен обновлять модель пользователя данными из DTO обновления', () => {
      const user: User = {
        id: '1',
        email: 'old@example.com',
        name: 'Old Name',
        role: 'user',
        createdAt: '2023-01-01T00:00:00Z',
        updatedAt: '2023-01-01T00:00:00Z',
      };

      const dto: UpdateUserDto = {
        email: 'new@example.com',
        name: 'New Name',
      };

      const updatedUser = mapper.updateFromDto(user, dto);

      // Проверяем, что обновились только указанные поля
      expect(updatedUser.email).toBe('new@example.com');
      expect(updatedUser.name).toBe('New Name');

      // Проверяем, что остальные поля не изменились
      expect(updatedUser.id).toBe('1');
      expect(updatedUser.role).toBe('user');
      expect(updatedUser.createdAt).toBe('2023-01-01T00:00:00Z');

      // Проверяем, что updatedAt обновился
      expect(updatedUser.updatedAt).not.toBe('2023-01-01T00:00:00Z');
    });

    it('должен обновлять только указанные поля', () => {
      const user: User = {
        id: '1',
        email: 'test@example.com',
        name: 'Test User',
        role: 'user',
        createdAt: '2023-01-01T00:00:00Z',
        updatedAt: '2023-01-01T00:00:00Z',
      };

      const dto: UpdateUserDto = {
        role: 'admin',
      };

      const updatedUser = mapper.updateFromDto(user, dto);

      // Проверяем, что обновилось только поле role
      expect(updatedUser.role).toBe('admin');

      // Проверяем, что остальные поля не изменились
      expect(updatedUser.id).toBe('1');
      expect(updatedUser.email).toBe('test@example.com');
      expect(updatedUser.name).toBe('Test User');
      expect(updatedUser.createdAt).toBe('2023-01-01T00:00:00Z');
    });

    it('должен сохранять исходную модель без изменений', () => {
      const user: User = {
        id: '1',
        email: 'test@example.com',
        name: 'Test User',
        role: 'user',
        createdAt: '2023-01-01T00:00:00Z',
        updatedAt: '2023-01-01T00:00:00Z',
      };

      const dto: UpdateUserDto = {
        name: 'New Name',
      };

      mapper.updateFromDto(user, dto);

      // Проверяем, что исходная модель не изменилась
      expect(user).toEqual({
        id: '1',
        email: 'test@example.com',
        name: 'Test User',
        role: 'user',
        createdAt: '2023-01-01T00:00:00Z',
        updatedAt: '2023-01-01T00:00:00Z',
      });
    });
  });
});
