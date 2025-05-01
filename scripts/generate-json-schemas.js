/**
 * Скрипт для генерации JSON-схем из схем валидации
 *
 * Этот скрипт экспортирует все схемы валидации из библиотеки shared
 * в формате JSON для использования в документации API.
 */

const fs = require('fs');
const path = require('path');

// Импортируем схемы из библиотеки shared
const {
  createUserSchema,
  updateUserSchema,
  loginSchema,
  authResponseSchema,
  refreshTokenSchema,
  sessionInfoSchema,
} = require('../dist/libs/shared');

// Схемы для экспорта
const schemas = {
  'user-create.schema.json': createUserSchema,
  'user-update.schema.json': updateUserSchema,
  'auth-login.schema.json': loginSchema,
  'auth-response.schema.json': authResponseSchema,
  'auth-refresh.schema.json': refreshTokenSchema,
  'auth-session.schema.json': sessionInfoSchema,
};

// Директория для сохранения схем
const outputDir = path.join(__dirname, '../docs/json-schema');

// Создаем директорию, если она не существует
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Экспортируем схемы в JSON-файлы
Object.entries(schemas).forEach(([filename, schema]) => {
  const filePath = path.join(outputDir, filename);
  fs.writeFileSync(filePath, JSON.stringify(schema, null, 2));
  console.log(`Schema exported to ${filePath}`);
});

console.log('JSON schemas generation completed successfully!');
