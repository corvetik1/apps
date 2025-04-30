/**
 * Тесты для класса ошибки валидации
 */
import { ValidationError, ValidationErrorItem } from '../validation-error';

describe('ValidationError', () => {
  const errorItems: ValidationErrorItem[] = [
    { path: '/email', message: 'должен быть валидным email' },
    { path: '/age', message: 'должен быть больше или равен 18' },
  ];

  it('должна создаваться с сообщением и списком ошибок', () => {
    const error = new ValidationError('Ошибка валидации данных', errorItems);

    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(ValidationError);
    expect(error.message).toBe('Ошибка валидации данных');
    expect(error.errors).toEqual(errorItems);
    expect(error.name).toBe('ValidationError');
  });

  it('должна корректно форматировать ошибки в строку', () => {
    const error = new ValidationError('Ошибка валидации данных', errorItems);
    const errorString = error.getErrorsString();

    expect(errorString).toBe(
      '/email: должен быть валидным email; /age: должен быть больше или равен 18',
    );
  });

  it('должна корректно преобразовываться в объект для ответа API', () => {
    const error = new ValidationError('Ошибка валидации данных', errorItems);
    const response = error.toResponse();

    expect(response).toEqual({
      status: 'error',
      message: 'Ошибка валидации данных',
      errors: errorItems,
    });
  });

  it('должна работать с пустым списком ошибок', () => {
    const error = new ValidationError('Ошибка валидации данных', []);

    expect(error.errors).toEqual([]);
    expect(error.getErrorsString()).toBe('');
    expect(error.toResponse()).toEqual({
      status: 'error',
      message: 'Ошибка валидации данных',
      errors: [],
    });
  });

  it('должна корректно работать с instanceof', () => {
    const error = new ValidationError('Ошибка валидации данных', errorItems);

    expect(error instanceof Error).toBe(true);
    expect(error instanceof ValidationError).toBe(true);

    function isValidationError(err: Error): boolean {
      return err instanceof ValidationError;
    }

    expect(isValidationError(error)).toBe(true);
    expect(isValidationError(new Error('Обычная ошибка'))).toBe(false);
  });
});
