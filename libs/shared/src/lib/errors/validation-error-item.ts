/**
 * Интерфейс для элемента ошибки валидации
 */
export interface ValidationErrorItem {
  /** Путь к свойству с ошибкой */
  path: string;
  /** Сообщение об ошибке */
  message: string;
}
