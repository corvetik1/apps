/**
 * Типы и DTO для настроек пользователя
 *
 * Этот модуль содержит все типы, связанные с настройками пользователя в системе,
 * включая режимы темы, языки, форматы валюты, основной интерфейс настроек и DTO для API.
 */

import { createBaseJsonSchema } from '../utils/json-schema';

/**
 * Режимы темы в системе
 *
 * @example
 * ```typescript
 * const themeMode = ThemeMode.Dark;
 * ```
 */
export enum ThemeMode {
  /** Светлая тема */
  Light = 'light',
  /** Темная тема */
  Dark = 'dark',
  /** Системная тема */
  System = 'system',
}

/**
 * Языки в системе
 *
 * @example
 * ```typescript
 * const language = Language.Russian;
 * ```
 */
export enum Language {
  /** Русский язык */
  Russian = 'ru',
  /** Английский язык */
  English = 'en',
}

/**
 * Форматы валюты в системе
 *
 * @example
 * ```typescript
 * const currencyFormat = CurrencyFormat.Symbol;
 * ```
 */
export enum CurrencyFormat {
  /** Символ валюты (например, ₽) */
  Symbol = 'symbol',
  /** Код валюты (например, RUB) */
  Code = 'code',
  /** Символ и код валюты (например, ₽ RUB) */
  SymbolCode = 'symbol_code',
}

/**
 * Интерфейс настроек уведомлений по электронной почте
 *
 * @example
 * ```typescript
 * const emailNotifications: EmailNotificationSettings = {
 *   enabled: true,
 *   dailySummary: true,
 *   weeklyReport: true,
 *   importantAlerts: true
 * };
 * ```
 */
export interface EmailNotificationSettings {
  /** Включены ли уведомления по электронной почте */
  enabled: boolean;
  /** Ежедневная сводка */
  dailySummary?: boolean;
  /** Еженедельный отчет */
  weeklyReport?: boolean;
  /** Важные уведомления */
  importantAlerts?: boolean;
}

/**
 * Интерфейс настроек push-уведомлений
 *
 * @example
 * ```typescript
 * const pushNotifications: PushNotificationSettings = {
 *   enabled: true,
 *   paymentReminders: true,
 *   budgetAlerts: true,
 *   newFeatures: false
 * };
 * ```
 */
export interface PushNotificationSettings {
  /** Включены ли push-уведомления */
  enabled: boolean;
  /** Напоминания о платежах */
  paymentReminders?: boolean;
  /** Уведомления о бюджете */
  budgetAlerts?: boolean;
  /** Уведомления о новых функциях */
  newFeatures?: boolean;
}

/**
 * Интерфейс настроек приватности
 *
 * @example
 * ```typescript
 * const privacySettings: PrivacySettings = {
 *   hideAmounts: false,
 *   requirePasswordForSensitiveOperations: true,
 *   sessionTimeout: 30
 * };
 * ```
 */
export interface PrivacySettings {
  /** Скрывать ли суммы */
  hideAmounts?: boolean;
  /** Требовать ли пароль для чувствительных операций */
  requirePasswordForSensitiveOperations?: boolean;
  /** Таймаут сессии в минутах */
  sessionTimeout?: number;
}

/**
 * Интерфейс настроек пользователя в системе
 *
 * @example
 * ```typescript
 * const settings: Settings = {
 *   id: '1',
 *   userId: 'user1',
 *   theme: ThemeMode.Dark,
 *   language: Language.Russian,
 *   defaultCurrency: 'RUB',
 *   currencyFormat: CurrencyFormat.Symbol,
 *   dateFormat: 'DD.MM.YYYY',
 *   timeFormat: '24h',
 *   notificationsEnabled: true,
 *   emailNotifications: {
 *     enabled: true,
 *     dailySummary: true,
 *     weeklyReport: true,
 *     importantAlerts: true
 *   },
 *   pushNotifications: {
 *     enabled: true,
 *     paymentReminders: true,
 *     budgetAlerts: true,
 *     newFeatures: false
 *   },
 *   defaultView: 'dashboard',
 *   dashboardWidgets: ['balance', 'recent-transactions', 'budget', 'goals'],
 *   privacySettings: {
 *     hideAmounts: false,
 *     requirePasswordForSensitiveOperations: true,
 *     sessionTimeout: 30
 *   },
 *   createdAt: '2023-01-01T00:00:00Z',
 *   updatedAt: '2023-01-01T00:00:00Z',
 * };
 * ```
 */
export interface Settings {
  /** Уникальный идентификатор настроек */
  id: string;
  /** Идентификатор пользователя */
  userId: string;
  /** Режим темы */
  theme: ThemeMode | string;
  /** Язык */
  language: Language | string;
  /** Валюта по умолчанию */
  defaultCurrency: string;
  /** Формат валюты */
  currencyFormat: CurrencyFormat | string;
  /** Формат даты */
  dateFormat: string;
  /** Формат времени */
  timeFormat: string;
  /** Включены ли уведомления */
  notificationsEnabled: boolean;
  /** Настройки уведомлений по электронной почте (опционально) */
  emailNotifications?: EmailNotificationSettings;
  /** Настройки push-уведомлений (опционально) */
  pushNotifications?: PushNotificationSettings;
  /** Представление по умолчанию (опционально) */
  defaultView?: string;
  /** Виджеты на панели управления (опционально) */
  dashboardWidgets?: string[];
  /** Настройки приватности (опционально) */
  privacySettings?: PrivacySettings;
  /** Дата и время создания настроек */
  createdAt: string;
  /** Дата и время последнего обновления настроек */
  updatedAt: string;
}

/**
 * DTO для обновления настроек пользователя
 *
 * @example
 * ```typescript
 * const updateSettingsDto: UpdateSettingsDto = {
 *   theme: ThemeMode.Dark,
 *   language: Language.Russian,
 *   notificationsEnabled: true,
 *   emailNotifications: {
 *     enabled: true,
 *     dailySummary: false,
 *     weeklyReport: true,
 *     importantAlerts: true
 *   }
 * };
 * ```
 */
export interface UpdateSettingsDto {
  /** Режим темы */
  theme?: ThemeMode | string;
  /** Язык */
  language?: Language | string;
  /** Валюта по умолчанию */
  defaultCurrency?: string;
  /** Формат валюты */
  currencyFormat?: CurrencyFormat | string;
  /** Формат даты */
  dateFormat?: string;
  /** Формат времени */
  timeFormat?: string;
  /** Включены ли уведомления */
  notificationsEnabled?: boolean;
  /** Настройки уведомлений по электронной почте */
  emailNotifications?: EmailNotificationSettings;
  /** Настройки push-уведомлений */
  pushNotifications?: PushNotificationSettings;
  /** Представление по умолчанию */
  defaultView?: string;
  /** Виджеты на панели управления */
  dashboardWidgets?: string[];
  /** Настройки приватности */
  privacySettings?: PrivacySettings;
}

/**
 * DTO для ответа с данными настроек пользователя
 *
 * @example
 * ```typescript
 * const settingsResponseDto: SettingsResponseDto = {
 *   id: '1',
 *   userId: 'user1',
 *   theme: ThemeMode.Dark,
 *   language: Language.Russian,
 *   defaultCurrency: 'RUB',
 *   currencyFormat: CurrencyFormat.Symbol,
 *   dateFormat: 'DD.MM.YYYY',
 *   timeFormat: '24h',
 *   notificationsEnabled: true,
 *   emailNotifications: {
 *     enabled: true,
 *     dailySummary: true,
 *     weeklyReport: true,
 *     importantAlerts: true
 *   },
 *   pushNotifications: {
 *     enabled: true,
 *     paymentReminders: true,
 *     budgetAlerts: true,
 *     newFeatures: false
 *   },
 *   defaultView: 'dashboard',
 *   dashboardWidgets: ['balance', 'recent-transactions', 'budget', 'goals'],
 *   privacySettings: {
 *     hideAmounts: false,
 *     requirePasswordForSensitiveOperations: true,
 *     sessionTimeout: 30
 *   },
 *   createdAt: '2023-01-01T00:00:00Z',
 *   updatedAt: '2023-01-01T00:00:00Z',
 * };
 * ```
 */
export interface SettingsResponseDto extends Settings {
  // Добавляем служебное поле для отличия от базового интерфейса
  _responseType?: 'settings';
}

/**
 * JSON-схема для настроек пользователя
 *
 * Используется для валидации данных и документации API
 */
export const settingsSchema = createBaseJsonSchema({
  title: 'Settings',
  description: 'Настройки пользователя в системе',
  required: [
    'id',
    'userId',
    'theme',
    'language',
    'defaultCurrency',
    'currencyFormat',
    'dateFormat',
    'timeFormat',
    'notificationsEnabled',
    'createdAt',
    'updatedAt',
  ],
  properties: {
    id: {
      type: 'string',
      description: 'Уникальный идентификатор настроек',
      examples: ['1', 'a1b2c3d4'],
    },
    userId: {
      type: 'string',
      description: 'Идентификатор пользователя',
      examples: ['user1'],
    },
    theme: {
      type: 'string',
      enum: Object.values(ThemeMode),
      description: 'Режим темы',
      examples: ['light', 'dark', 'system'],
    },
    language: {
      type: 'string',
      enum: Object.values(Language),
      description: 'Язык',
      examples: ['ru', 'en'],
    },
    defaultCurrency: {
      type: 'string',
      description: 'Валюта по умолчанию',
      examples: ['RUB', 'USD', 'EUR'],
    },
    currencyFormat: {
      type: 'string',
      enum: Object.values(CurrencyFormat),
      description: 'Формат валюты',
      examples: ['symbol', 'code', 'symbol_code'],
    },
    dateFormat: {
      type: 'string',
      description: 'Формат даты',
      examples: ['DD.MM.YYYY', 'MM/DD/YYYY', 'YYYY-MM-DD'],
    },
    timeFormat: {
      type: 'string',
      description: 'Формат времени',
      examples: ['24h', '12h'],
    },
    notificationsEnabled: {
      type: 'boolean',
      description: 'Включены ли уведомления',
      examples: [true, false],
    },
    emailNotifications: {
      type: 'object',
      required: ['enabled'],
      properties: {
        enabled: {
          type: 'boolean',
          description: 'Включены ли уведомления по электронной почте',
          examples: [true, false],
        },
        dailySummary: {
          type: 'boolean',
          description: 'Ежедневная сводка',
          examples: [true, false],
        },
        weeklyReport: {
          type: 'boolean',
          description: 'Еженедельный отчет',
          examples: [true, false],
        },
        importantAlerts: {
          type: 'boolean',
          description: 'Важные уведомления',
          examples: [true, false],
        },
      },
      description: 'Настройки уведомлений по электронной почте',
    },
    pushNotifications: {
      type: 'object',
      required: ['enabled'],
      properties: {
        enabled: {
          type: 'boolean',
          description: 'Включены ли push-уведомления',
          examples: [true, false],
        },
        paymentReminders: {
          type: 'boolean',
          description: 'Напоминания о платежах',
          examples: [true, false],
        },
        budgetAlerts: {
          type: 'boolean',
          description: 'Уведомления о бюджете',
          examples: [true, false],
        },
        newFeatures: {
          type: 'boolean',
          description: 'Уведомления о новых функциях',
          examples: [true, false],
        },
      },
      description: 'Настройки push-уведомлений',
    },
    defaultView: {
      type: 'string',
      description: 'Представление по умолчанию',
      examples: ['dashboard', 'accounts', 'transactions'],
    },
    dashboardWidgets: {
      type: 'array',
      items: {
        type: 'string',
      },
      description: 'Виджеты на панели управления',
      examples: [['balance', 'recent-transactions', 'budget', 'goals']],
    },
    privacySettings: {
      type: 'object',
      properties: {
        hideAmounts: {
          type: 'boolean',
          description: 'Скрывать ли суммы',
          examples: [true, false],
        },
        requirePasswordForSensitiveOperations: {
          type: 'boolean',
          description: 'Требовать ли пароль для чувствительных операций',
          examples: [true, false],
        },
        sessionTimeout: {
          type: 'number',
          description: 'Таймаут сессии в минутах',
          examples: [30, 60, 120],
        },
      },
      description: 'Настройки приватности',
    },
    createdAt: {
      type: 'string',
      format: 'date-time',
      description: 'Дата и время создания настроек',
      examples: ['2023-01-01T00:00:00Z'],
    },
    updatedAt: {
      type: 'string',
      format: 'date-time',
      description: 'Дата и время последнего обновления настроек',
      examples: ['2023-01-01T00:00:00Z'],
    },
  },
});
