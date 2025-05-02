# Тестирование в финансовой платформе

## Изменения в тестах (02.05.2025)

### Исправления в тестах аутентификации

1. **Исправлены предупреждения act() в интеграционных тестах**
   - Все вызовы `fireEvent` обернуты в `await act(async () => {...})`
   - Добавлено ожидание завершения асинхронных операций

2. **Исправлены матчеры в соответствии с принятым подходом**
   - Заменены матчеры `toBeInTheDocument()` на `toBeTruthy()`
   - Заменены проверки `toBeDisabled()` на `hasAttribute('disabled')`

3. **Добавлены проверки ошибок в состоянии**
   - Добавлена явная проверка наличия ошибки в состоянии после неудачного входа
   - Добавлены проверки состояния аутентификации и загрузки

4. **Изменен подход к тестированию состояния загрузки**
   - Вместо проверки текста кнопки используется проверка состояния Redux
   - Более устойчивый подход, не зависящий от изменений в UI

5. **Создана документация по тестированию асинхронных операций**
   - Описаны правила использования `act()` и `waitFor()`
   - Добавлены примеры мокирования RTK Query с методом `unwrap()`
   - Добавлены примеры тестирования ошибок и асинхронных операций

### Результаты

- Все 46 тестов в 6 тестовых наборах проходят успешно
- Устранены все предупреждения act() и другие ошибки линтера
- Тесты стали более надежными и устойчивыми к изменениям в UI

## Общие принципы

1. Минимальное покрытие тестами — 90% (lines / branches / functions / statements)
2. Тесты должны быть надежными и не давать ложных срабатываний в CI
3. Используем прагматичный подход к типизации в тестах
4. Все внешние зависимости мокируются

## Тестирование асинхронных операций

### Использование act() для предотвращения предупреждений

Чтобы избежать предупреждений "An update to X inside a test was not wrapped in act(...)", следуйте этим правилам:

```typescript
// ❌ Неправильно: может вызвать предупреждения act()
fireEvent.click(button);
await waitFor(() => expect(result).toBeTruthy());

// ✅ Правильно: оборачиваем события в act()
await act(async () => {
  fireEvent.click(button);
});
await waitFor(() => expect(result).toBeTruthy());
```

Основные правила:

1. Оборачивайте все вызовы `fireEvent` в `act(async () => {...})`
2. Используйте `await act()` для ожидания завершения асинхронных операций
3. После `act()` используйте `waitFor()` для проверки результатов

### Проверка DOM-элементов

Используем стандартные матчеры Jest вместо специализированных матчеров Testing Library:

```typescript
// ❌ Избегаем из-за проблем с типизацией
expect(element).toBeInTheDocument();
expect(element).toBeVisible();

// ✅ Используем стандартные матчеры
expect(element).toBeTruthy();
expect(window.getComputedStyle(element).display).not.toBe('none');
```

### Тестирование RTK Query

#### Моки для хуков RTK Query

```typescript
// Глобальные моки
const mockTrigger: any = jest.fn();
const mockHook: any = [mockTrigger, { isLoading: false, reset: jest.fn() }];

// Важно: добавляем метод unwrap() для корректного тестирования
mockTrigger.mockImplementation((...args) => {
  return {
    unwrap: () => Promise.resolve({ data: mockResponse }),
  };
});

// Связываем с локальными моками в тестах
const mockLocalFunction = jest.fn();
mockTrigger.mockImplementation((...args) => {
  mockLocalFunction(...args);
  return {
    unwrap: () => Promise.resolve({ data: mockResponse }),
  };
});

// Мокируем хук RTK Query
jest.spyOn(api, 'useApiMethod').mockImplementation(() => mockHook);
```

#### Тестирование ошибок

```typescript
// Мок для ошибки
mockTrigger.mockImplementation(() => {
  return {
    unwrap: () => Promise.reject(new Error('Ошибка')),
  };
});

// Проверка ошибки в тесте
await act(async () => {
  // Действие, вызывающее ошибку
});

await waitFor(() => {
  expect(result.current.error).toBe('Ошибка');
  expect(result.current.isAuthenticated).toBe(false);
});
```

## Интеграционные тесты

### Настройка окружения

```typescript
// Компонент для тестирования с Redux и React Router
const TestApp = ({ initialEntries = ['/'], initialState = {} }) => {
  const store = configureStore({
    reducer: {
      auth: authReducer,
      [api.reducerPath]: api.reducer,
    },
    middleware: getDefaultMiddleware => 
      getDefaultMiddleware().concat(api.middleware),
    preloadedState: initialState,
  });

  return (
    <Provider store={store}>
      <MemoryRouter initialEntries={initialEntries}>
        <Routes>
          <Route path="/" element={<TestedComponent />} />
          {/* Другие маршруты */}
        </Routes>
      </MemoryRouter>
    </Provider>
  );
};
```

### Тестирование формы

```typescript
it('должен отправлять форму с правильными данными', async () => {
  render(<TestApp />);

  // Заполняем форму внутри act
  await act(async () => {
    fireEvent.change(screen.getByLabelText('Email'), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByLabelText('Пароль'), {
      target: { value: 'password123' },
    });
  });

  // Отправляем форму внутри act
  await act(async () => {
    fireEvent.click(screen.getByRole('button', { name: 'Войти' }));
  });

  // Проверяем результат
  await waitFor(() => {
    expect(mockSubmit).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password123',
    });
  });
});
```

## Рекомендации по отладке тестов

1. Если тест падает с таймаутом, проверьте асинхронные операции и убедитесь, что все промисы разрешаются
2. Для отладки используйте `screen.debug()` для вывода текущего состояния DOM
3. При предупреждениях act() оборачивайте все события и асинхронные операции в `act()`
4. Для сложных компонентов с множеством асинхронных операций используйте `jest.useFakeTimers()`
