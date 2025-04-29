import { describe, it, expect } from '@jest/globals';
import {
  ThemeMode,
  Language,
  CurrencyFormat,
  Settings,
  UpdateSettingsDto,
  SettingsResponseDto,
} from '../settings';

describe('Settings типы', () => {
  describe('ThemeMode enum', () => {
    it('должен содержать все необходимые режимы темы', () => {
      expect(ThemeMode.Light).toBe('light');
      expect(ThemeMode.Dark).toBe('dark');
      expect(ThemeMode.System).toBe('system');
    });
  });

  describe('Language enum', () => {
    it('должен содержать все необходимые языки', () => {
      expect(Language.Russian).toBe('ru');
      expect(Language.English).toBe('en');
    });
  });

  describe('CurrencyFormat enum', () => {
    it('должен содержать все необходимые форматы валюты', () => {
      expect(CurrencyFormat.Symbol).toBe('symbol');
      expect(CurrencyFormat.Code).toBe('code');
      expect(CurrencyFormat.SymbolCode).toBe('symbol_code');
    });
  });

  describe('Settings интерфейс', () => {
    it('должен позволять создавать корректные объекты настроек', () => {
      const settings: Settings = {
        id: '1',
        userId: 'user1',
        theme: ThemeMode.Dark,
        language: Language.Russian,
        defaultCurrency: 'RUB',
        currencyFormat: CurrencyFormat.Symbol,
        dateFormat: 'DD.MM.YYYY',
        timeFormat: '24h',
        notificationsEnabled: true,
        emailNotifications: {
          enabled: true,
          dailySummary: true,
          weeklyReport: true,
          importantAlerts: true,
        },
        pushNotifications: {
          enabled: true,
          paymentReminders: true,
          budgetAlerts: true,
          newFeatures: false,
        },
        defaultView: 'dashboard',
        dashboardWidgets: ['balance', 'recent-transactions', 'budget', 'goals'],
        privacySettings: {
          hideAmounts: false,
          requirePasswordForSensitiveOperations: true,
          sessionTimeout: 30,
        },
        createdAt: '2023-01-01T00:00:00Z',
        updatedAt: '2023-01-01T00:00:00Z',
      };

      expect(settings.id).toBe('1');
      expect(settings.userId).toBe('user1');
      expect(settings.theme).toBe(ThemeMode.Dark);
      expect(settings.language).toBe(Language.Russian);
      expect(settings.defaultCurrency).toBe('RUB');
      expect(settings.currencyFormat).toBe(CurrencyFormat.Symbol);
      expect(settings.dateFormat).toBe('DD.MM.YYYY');
      expect(settings.timeFormat).toBe('24h');
      expect(settings.notificationsEnabled).toBe(true);
      expect(settings.emailNotifications).toEqual({
        enabled: true,
        dailySummary: true,
        weeklyReport: true,
        importantAlerts: true,
      });
      expect(settings.pushNotifications).toEqual({
        enabled: true,
        paymentReminders: true,
        budgetAlerts: true,
        newFeatures: false,
      });
      expect(settings.defaultView).toBe('dashboard');
      expect(settings.dashboardWidgets).toEqual([
        'balance',
        'recent-transactions',
        'budget',
        'goals',
      ]);
      expect(settings.privacySettings).toEqual({
        hideAmounts: false,
        requirePasswordForSensitiveOperations: true,
        sessionTimeout: 30,
      });
      expect(settings.createdAt).toBe('2023-01-01T00:00:00Z');
      expect(settings.updatedAt).toBe('2023-01-01T00:00:00Z');
    });

    it('должен позволять создавать настройки с опциональными полями', () => {
      const settings: Settings = {
        id: '1',
        userId: 'user1',
        theme: ThemeMode.Light,
        language: Language.English,
        defaultCurrency: 'USD',
        currencyFormat: CurrencyFormat.Code,
        dateFormat: 'MM/DD/YYYY',
        timeFormat: '12h',
        notificationsEnabled: false,
        createdAt: '2023-01-01T00:00:00Z',
        updatedAt: '2023-01-01T00:00:00Z',
      };

      expect(settings.id).toBe('1');
      expect(settings.userId).toBe('user1');
      expect(settings.theme).toBe(ThemeMode.Light);
      expect(settings.emailNotifications).toBeUndefined();
      expect(settings.pushNotifications).toBeUndefined();
      expect(settings.defaultView).toBeUndefined();
      expect(settings.dashboardWidgets).toBeUndefined();
      expect(settings.privacySettings).toBeUndefined();
    });
  });

  describe('UpdateSettingsDto', () => {
    it('должен позволять обновлять только некоторые поля', () => {
      const updateSettingsDto: UpdateSettingsDto = {
        theme: ThemeMode.Dark,
        language: Language.Russian,
        notificationsEnabled: true,
        emailNotifications: {
          enabled: true,
          dailySummary: false,
          weeklyReport: true,
          importantAlerts: true,
        },
      };

      expect(updateSettingsDto.theme).toBe(ThemeMode.Dark);
      expect(updateSettingsDto.language).toBe(Language.Russian);
      expect(updateSettingsDto.notificationsEnabled).toBe(true);
      expect(updateSettingsDto.emailNotifications).toEqual({
        enabled: true,
        dailySummary: false,
        weeklyReport: true,
        importantAlerts: true,
      });
      // Все поля должны быть опциональными
      const emptyUpdateDto: UpdateSettingsDto = {};
      expect(emptyUpdateDto).toEqual({});
    });
  });

  describe('SettingsResponseDto', () => {
    it('должен содержать все поля Settings', () => {
      const settingsResponseDto: SettingsResponseDto = {
        id: '1',
        userId: 'user1',
        theme: ThemeMode.Dark,
        language: Language.Russian,
        defaultCurrency: 'RUB',
        currencyFormat: CurrencyFormat.Symbol,
        dateFormat: 'DD.MM.YYYY',
        timeFormat: '24h',
        notificationsEnabled: true,
        emailNotifications: {
          enabled: true,
          dailySummary: true,
          weeklyReport: true,
          importantAlerts: true,
        },
        pushNotifications: {
          enabled: true,
          paymentReminders: true,
          budgetAlerts: true,
          newFeatures: false,
        },
        defaultView: 'dashboard',
        dashboardWidgets: ['balance', 'recent-transactions', 'budget', 'goals'],
        privacySettings: {
          hideAmounts: false,
          requirePasswordForSensitiveOperations: true,
          sessionTimeout: 30,
        },
        createdAt: '2023-01-01T00:00:00Z',
        updatedAt: '2023-01-01T00:00:00Z',
      };

      expect(settingsResponseDto.id).toBe('1');
      expect(settingsResponseDto.userId).toBe('user1');
      expect(settingsResponseDto.theme).toBe(ThemeMode.Dark);
      expect(settingsResponseDto.language).toBe(Language.Russian);
      expect(settingsResponseDto.defaultCurrency).toBe('RUB');
      expect(settingsResponseDto.currencyFormat).toBe(CurrencyFormat.Symbol);
      expect(settingsResponseDto.dateFormat).toBe('DD.MM.YYYY');
      expect(settingsResponseDto.timeFormat).toBe('24h');
      expect(settingsResponseDto.notificationsEnabled).toBe(true);
      expect(settingsResponseDto.emailNotifications).toEqual({
        enabled: true,
        dailySummary: true,
        weeklyReport: true,
        importantAlerts: true,
      });
      expect(settingsResponseDto.pushNotifications).toEqual({
        enabled: true,
        paymentReminders: true,
        budgetAlerts: true,
        newFeatures: false,
      });
      expect(settingsResponseDto.defaultView).toBe('dashboard');
      expect(settingsResponseDto.dashboardWidgets).toEqual([
        'balance',
        'recent-transactions',
        'budget',
        'goals',
      ]);
      expect(settingsResponseDto.privacySettings).toEqual({
        hideAmounts: false,
        requirePasswordForSensitiveOperations: true,
        sessionTimeout: 30,
      });
      expect(settingsResponseDto.createdAt).toBe('2023-01-01T00:00:00Z');
      expect(settingsResponseDto.updatedAt).toBe('2023-01-01T00:00:00Z');
    });
  });
});
