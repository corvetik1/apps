/**
 * Типы для работы с элементами галереи
 *
 * Этот модуль содержит типы для работы с галереей изображений и других медиа-файлов,
 * которые могут быть прикреплены к различным сущностям в системе.
 */

/**
 * Тип медиа-файла
 */
export enum MediaType {
  /** Изображение */
  Image = 'image',
  /** Документ */
  Document = 'document',
  /** Видео */
  Video = 'video',
  /** Аудио */
  Audio = 'audio',
}

/**
 * Статус элемента галереи
 */
export enum GalleryItemStatus {
  /** Загружается */
  Uploading = 'uploading',
  /** Обрабатывается */
  Processing = 'processing',
  /** Активен */
  Active = 'active',
  /** Архивирован */
  Archived = 'archived',
  /** Удален */
  Deleted = 'deleted',
}

/**
 * Интерфейс элемента галереи
 */
export interface GalleryItem {
  /** Уникальный идентификатор элемента */
  id: string;
  /** Название элемента */
  name: string;
  /** Описание элемента */
  description?: string;
  /** Тип медиа-файла */
  mediaType: MediaType;
  /** MIME-тип файла */
  mimeType: string;
  /** Размер файла в байтах */
  size: number;
  /** URL для доступа к файлу */
  url: string;
  /** URL для доступа к миниатюре (для изображений и видео) */
  thumbnailUrl?: string;
  /** Статус элемента */
  status: GalleryItemStatus;
  /** Теги для категоризации */
  tags?: string[];
  /** Метаданные файла (зависит от типа файла) */
  metadata?: Record<string, unknown>;
  /** Идентификатор связанной сущности */
  entityId?: string;
  /** Тип связанной сущности */
  entityType?: string;
  /** Идентификатор пользователя, загрузившего файл */
  uploadedBy: string;
  /** Дата загрузки */
  uploadedAt: string;
  /** Дата последнего обновления */
  updatedAt: string;
}

/**
 * Интерфейс для создания элемента галереи
 */
export type CreateGalleryItemRequest = Omit<GalleryItem, 'id' | 'url' | 'thumbnailUrl' | 'status' | 'uploadedAt' | 'updatedAt'> & {
  /** Файл для загрузки (используется в форме) */
  file?: File;
  /** Base64-кодированные данные файла (используется в API) */
  fileData?: string;
};

/**
 * Интерфейс для обновления элемента галереи
 */
export type UpdateGalleryItemRequest = Partial<Omit<GalleryItem, 'id' | 'uploadedAt' | 'updatedAt' | 'uploadedBy' | 'mediaType' | 'mimeType' | 'size' | 'url' | 'thumbnailUrl'>>;

/**
 * Интерфейс для фильтрации элементов галереи
 */
export interface GalleryItemFilter {
  /** Тип медиа-файла */
  mediaType?: MediaType;
  /** Статус элемента */
  status?: GalleryItemStatus;
  /** Теги для фильтрации */
  tags?: string[];
  /** Идентификатор связанной сущности */
  entityId?: string;
  /** Тип связанной сущности */
  entityType?: string;
  /** Идентификатор пользователя, загрузившего файл */
  uploadedBy?: string;
  /** Начальная дата загрузки */
  uploadedAfter?: string;
  /** Конечная дата загрузки */
  uploadedBefore?: string;
  /** Минимальный размер файла в байтах */
  minSize?: number;
  /** Максимальный размер файла в байтах */
  maxSize?: number;
  /** Поисковый запрос (для поиска по названию или описанию) */
  searchQuery?: string;
}
