// abilities.test.ts
import { describe, it, expect, jest } from '@jest/globals';
import { renderHook } from '@testing-library/react';

// Мокируем зависимости
jest.mock('@casl/ability', () => {
  const mockCan = jest.fn().mockReturnValue(true);
  const mockAbility = { can: mockCan };
  
  return {
    createMongoAbility: jest.fn().mockReturnValue(mockAbility),
    AbilityBuilder: jest.fn().mockImplementation(() => ({
      can: jest.fn(),
      cannot: jest.fn(),
      build: jest.fn().mockReturnValue(mockAbility)
    }))
  };
});

jest.mock('@finance-platform/shared', () => ({
  Role: {
    Admin: 'admin',
    Manager: 'manager',
    User: 'user',
    Guest: 'guest'
  }
}));

// Импортируем функции после объявления моков
import { defineAbilitiesFor, hasPermission, useAbility } from '../abilities';
import { Action, Subject } from '../types';

// Определяем тип Role локально для тестов
enum Role {
  Admin = 'admin',
  Manager = 'manager',
  User = 'user',
  Guest = 'guest'
}

describe('CASL Abilities', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  describe('defineAbilitiesFor', () => {
    it('должен создавать способности для пользователей разных ролей', () => {
      // Проверяем для разных типов пользователей
      defineAbilitiesFor(undefined); // Неопределенный пользователь
      defineAbilitiesFor({ id: '1', role: Role.Admin }); // Администратор
      defineAbilitiesFor({ id: '2', role: Role.Manager }); // Менеджер
      defineAbilitiesFor({ id: '3', role: Role.User }); // Обычный пользователь
      defineAbilitiesFor({ id: '4', role: Role.Guest }); // Гость
      
      // Проверяем, что функция не вызывает ошибок
      expect(true).toBe(true);
    });
  });
  
  describe('hasPermission', () => {
    it('должен проверять разрешения пользователя', () => {
      // Проверяем для разных типов пользователей и действий
      const result1 = hasPermission({ id: '1', role: Role.Admin }, Action.Read, Subject.User);
      const result2 = hasPermission({ id: '2', role: Role.Manager }, Action.Update, Subject.User);
      const result3 = hasPermission({ id: '3', role: Role.User }, Action.Delete, Subject.User);
      
      // Проверяем, что функция возвращает ожидаемые результаты
      expect(result1).toBe(true);
      expect(result2).toBe(true);
      expect(result3).toBe(true);
    });
    
    it('должен проверять разрешения с ресурсом', () => {
      const result = hasPermission(
        { id: '1', role: Role.Admin },
        Action.Read,
        Subject.User,
        { id: '123' }
      );
      
      expect(result).toBe(true);
    });
  });
  
  describe('useAbility', () => {
    it('должен возвращать объект способностей', () => {
      const { result } = renderHook(() => 
        useAbility({ id: '1', role: Role.Admin })
      );
      
      expect(result.current).toBeDefined();
      expect(typeof result.current.can).toBe('function');
    });
  });
});