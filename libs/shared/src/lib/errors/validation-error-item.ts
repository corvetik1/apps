/**
 * Класс для элемента ошибки валидации
 */
export class ValidationErrorItem {
  /** Путь к свойству с ошибкой */
  path: string;
  /** Сообщение об ошибке */
  message: string;

  /**
   * Создает новый экземпляр элемента ошибки валидации
   * @param path Путь к свойству с ошибкой
   * @param message Сообщение об ошибке
   */
  constructor(path: string, message: string) {
    this.path = path;
    this.message = message;
  }
}
