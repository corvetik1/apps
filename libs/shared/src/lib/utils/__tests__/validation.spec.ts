/**
 * Тесты для утилит валидации данных
 */
import { validate, isValid, validateWithErrors, createValidator } from '../validation';
import { ValidationError } from '../../errors/validation-error';

// Тестовая схема для пользователя
const userSchema = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  title: 'User',
  type: 'object',
  additionalProperties: false,
  required: ['email', 'name', 'age'],
  properties: {
    email: {
      type: 'string',
      format: 'email',
      description: 'Email пользователя',
    },
    name: {
      type: 'string',
      minLength: 2,
      description: 'Имя пользователя',
    },
    age: {
      type: 'integer',
      minimum: 18,
      description: 'Возраст пользователя',
    },
    role: {
      type: 'string',
      enum: ['admin', 'user', 'guest'],
      default: 'user',
      description: 'Роль пользователя',
    },
  },
};

// Интерфейс пользователя для типизации
interface User {
  email: string;
  name: string;
  age: number;
  role?: string;
}

describe('Утилиты валидации', () => {
  describe('validate', () => {
    it('должна успешно валидировать корректные данные', () => {
      const userData = {
        email: 'test@example.com',
        name: 'John Doe',
        age: 25,
      };

      const result = validate<User>(userSchema, userData);

      expect(result).toEqual({
        email: 'test@example.com',
        name: 'John Doe',
        age: 25,
        role: 'user', // Добавлено значение по умолчанию из схемы
      });
    });

    it('должна выбрасывать ValidationError для некорректных данных', () => {
      const userData = {
        email: 'invalid-email',
        name: 'J', // Слишком короткое имя
        age: 16, // Возраст меньше минимального
      };

      expect(() => validate<User>(userSchema, userData)).toThrow(ValidationError);
    });

    it('должна удалять дополнительные свойства', () => {
      const userData = {
        email: 'test@example.com',
        name: 'John Doe',
        age: 25,
        extraField: 'should be removed',
      };

      const result = validate<User>(userSchema, userData);

      expect(result).not.toHaveProperty('extraField');
    });

    it('должна приводить типы данных', () => {
      const userData = {
        email: 'test@example.com',
        name: 'John Doe',
        age: '25', // Строка вместо числа
      };

      const result = validate<User>(userSchema, userData);

      expect(typeof result.age).toBe('number');
      expect(result.age).toBe(25);
    });
  });

  describe('isValid', () => {
    it('должна возвращать true для валидных данных', () => {
      const userData = {
        email: 'test@example.com',
        name: 'John Doe',
        age: 25,
      };

      expect(isValid(userSchema, userData)).toBe(true);
    });

    it('должна возвращать false для невалидных данных', () => {
      const userData = {
        email: 'invalid-email',
        name: 'John Doe',
        age: 16,
      };

      expect(isValid(userSchema, userData)).toBe(false);
    });
  });

  describe('validateWithErrors', () => {
    it('должна возвращать null для валидных данных', () => {
      const userData = {
        email: 'test@example.com',
        name: 'John Doe',
        age: 25,
      };

      expect(validateWithErrors(userSchema, userData)).toBeNull();
    });

    it('должна возвращать массив ошибок для невалидных данных', () => {
      const userData = {
        email: 'invalid-email',
        name: 'J',
        age: 16,
      };

      const errors = validateWithErrors(userSchema, userData);

      expect(errors).not.toBeNull();
      expect(Array.isArray(errors)).toBe(true);
      expect(errors?.length).toBeGreaterThan(0);
    });

    it('должна включать путь и сообщение для каждой ошибки', () => {
      const userData = {
        email: 'invalid-email',
        name: 'J',
        age: 16,
      };

      const errors = validateWithErrors(userSchema, userData);

      errors?.forEach(error => {
        expect(error).toHaveProperty('path');
        expect(error).toHaveProperty('message');
        expect(typeof error.path).toBe('string');
        expect(typeof error.message).toBe('string');
      });
    });
  });

  describe('createValidator', () => {
    it('должна создавать функцию-валидатор для схемы', () => {
      const validateUser = createValidator<User>(userSchema);

      expect(typeof validateUser).toBe('function');
    });

    it('созданный валидатор должен успешно валидировать корректные данные', () => {
      const validateUser = createValidator<User>(userSchema);
      const userData = {
        email: 'test@example.com',
        name: 'John Doe',
        age: 25,
      };

      const result = validateUser(userData);

      expect(result).toEqual({
        email: 'test@example.com',
        name: 'John Doe',
        age: 25,
        role: 'user',
      });
    });

    it('созданный валидатор должен выбрасывать ValidationError для некорректных данных', () => {
      const validateUser = createValidator<User>(userSchema);
      const userData = {
        email: 'invalid-email',
        name: 'J',
        age: 16,
      };

      expect(() => validateUser(userData)).toThrow(ValidationError);
    });
  });
});
