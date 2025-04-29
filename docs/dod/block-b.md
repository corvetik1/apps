# Definition of Done: Блок B - Типы и DTO

## Цель блока

Реализация всех доменных типов, DTO и JSON-схем для финансовой платформы.

## Выполненные задачи

### Базовая структура

- [x] Создана директория `libs/shared/src/lib/types` для типов и DTO
- [x] Создана директория `libs/shared/src/lib/types/__tests__` для тестов
- [x] Создана директория `docs/json-schema` для JSON-схем
- [x] Создан индексный файл `libs/shared/src/lib/types/index.ts`
- [x] Создана утилита для работы с JSON-схемами `libs/shared/src/lib/utils/json-schema.ts`

### Реализованные типы

#### Базовые сущности

- [x] User (пользователь)

  - Enum: `Role`
  - Интерфейсы: `User`, `CreateUserDto`, `UpdateUserDto`, `UserResponseDto`
  - JSON-схема: `user.schema.json`
  - Тесты: для enum, интерфейсов и схемы

- [x] Account (счет)

  - Enum: `AccountType`
  - Интерфейсы: `Account`, `CreateAccountDto`, `UpdateAccountDto`, `AccountResponseDto`
  - JSON-схема: `account.schema.json`
  - Тесты: для enum, интерфейсов и схемы

- [x] Transaction (транзакция)

  - Enum: `TransactionType`
  - Интерфейсы: `Transaction`, `CreateTransactionDto`, `TransactionResponseDto`
  - JSON-схема: `transaction.schema.json`
  - Тесты: для enum, интерфейсов и схемы

- [x] Tender (тендер)
  - Enum: `TenderStatus`
  - Интерфейсы: `Tender`, `CreateTenderDto`, `UpdateTenderDto`, `TenderResponseDto`
  - JSON-схема: `tender.schema.json`
  - Тесты: для enum, интерфейсов и схемы

#### Финансовые сущности

- [x] DebitCard (дебетовая карта)

  - Интерфейсы: `DebitCard`, `CreateDebitCardDto`, `UpdateDebitCardDto`, `DebitCardResponseDto`
  - JSON-схема: `debit-card.schema.json`
  - Тесты: для интерфейсов и схемы

- [x] CreditCard (кредитная карта)

  - Интерфейсы: `CreditCard`, `CreateCreditCardDto`, `UpdateCreditCardDto`, `CreditCardResponseDto`
  - JSON-схема: `credit-card.schema.json`
  - Тесты: для интерфейсов и схемы

- [x] Debt (долг)

  - Enum: `DebtStatus`
  - Интерфейсы: `Debt`, `CreateDebtDto`, `UpdateDebtDto`, `DebtResponseDto`
  - JSON-схема: `debt.schema.json`
  - Тесты: для enum, интерфейсов и схемы

- [x] Loan (кредит)

  - Enum: `LoanStatus`, `LoanType`
  - Интерфейсы: `Loan`, `LoanPayment`, `CreateLoanDto`, `UpdateLoanDto`, `LoanResponseDto`
  - JSON-схема: `loan.schema.json`
  - Тесты: для enum, интерфейсов и схемы

- [x] Investment (инвестиция)

  - Enum: `InvestmentType`, `InvestmentStatus`
  - Интерфейсы: `Investment`, `CreateInvestmentDto`, `UpdateInvestmentDto`, `InvestmentResponseDto`
  - JSON-схема: `investment.schema.json`
  - Тесты: для enum, интерфейсов и схемы

- [x] Tax (налог)
  - Enum: `TaxType`, `TaxStatus`
  - Интерфейсы: `Tax`, `CreateTaxDto`, `UpdateTaxDto`, `TaxResponseDto`
  - JSON-схема: `tax.schema.json`
  - Тесты: для enum, интерфейсов и схемы

#### Аналитические сущности

- [x] Analytics (аналитика)

  - Enum: `AnalyticsPeriod`
  - Интерфейсы: `ChartData`, `ChartDataset`, `AnalyticsMetrics`, `AnalyticsRequest`, `AnalyticsResponse`
  - JSON-схемы: `analytics-request.schema.json`, `analytics-response.schema.json`
  - Тесты: для enum, интерфейсов и схем

- [x] Report (отчет)
  - Enum: `ReportType`, `ReportFormat`, `ReportStatus`
  - Интерфейсы: `Report`, `ReportParameters`, `ReportFilters`, `CreateReportDto`, `UpdateReportDto`, `ReportResponseDto`
  - JSON-схема: `report.schema.json`
  - Тесты: для enum, интерфейсов и схемы

#### AI сущности

- [x] AIAnalysisRequest (запрос на AI-анализ)

  - Интерфейсы: `AIAnalysisRequest` и вложенные типы
  - JSON-схема: `ai-analysis-request.schema.json`
  - Тесты: для интерфейсов и схемы

- [x] AIAnalysisResponse (ответ на AI-анализ)
  - Интерфейсы: `AIAnalysisResponse` и вложенные типы
  - JSON-схема: `ai-analysis-response.schema.json`
  - Тесты: для интерфейсов и схемы

#### Прочие сущности

- [x] Document (документ)

  - Enum: `DocumentType`, `DocumentStatus`
  - Интерфейсы: `Document`, `CreateDocumentDto`, `UpdateDocumentDto`, `DocumentResponseDto`
  - JSON-схема: `document.schema.json`
  - Тесты: для enum, интерфейсов и схемы

- [x] Note (заметка)

  - Enum: `NoteType`, `NotePriority`
  - Интерфейсы: `Note`, `CreateNoteDto`, `UpdateNoteDto`, `NoteResponseDto`
  - JSON-схема: `note.schema.json`
  - Тесты: для enum, интерфейсов и схемы

- [x] Counterparty (контрагент)

  - Enum: `CounterpartyType`, `CounterpartyStatus`
  - Интерфейсы: `Counterparty`, `BankDetails`, `CreateCounterpartyDto`, `UpdateCounterpartyDto`, `CounterpartyResponseDto`
  - JSON-схема: `counterparty.schema.json`
  - Тесты: для enum, интерфейсов и схемы

- [x] Settings (настройки)
  - Enum: `ThemeMode`, `Language`, `CurrencyFormat`
  - Интерфейсы: `Settings`, `EmailNotificationSettings`, `PushNotificationSettings`, `PrivacySettings`, `UpdateSettingsDto`, `SettingsResponseDto`
  - JSON-схема: `settings.schema.json`
  - Тесты: для enum, интерфейсов и схемы

### Тестирование

- [x] Написаны тесты для всех типов и DTO
- [x] Написаны тесты для всех JSON-схем
- [x] Покрытие тестами ≥ 90%

## Критерии приемки

- [x] Все типы и DTO соответствуют требованиям технического задания
- [x] Все типы и DTO имеют подробную JSDoc-документацию
- [x] Все типы и DTO экспортируются из индексного файла
- [x] Все JSON-схемы валидны и соответствуют типам
- [x] Все тесты проходят успешно
- [x] Покрытие тестами ≥ 90%

## Дополнительная информация

- Все типы и DTO разработаны с учетом возможности расширения в будущем
- Все типы и DTO имеют примеры использования в JSDoc-документации
- Все JSON-схемы содержат примеры значений для каждого поля
