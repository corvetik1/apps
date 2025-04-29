#!/usr/bin/env node

/**
 * Точка входа для генератора JSON-схем
 *
 * Этот скрипт запускает генератор JSON-схем с настройками по умолчанию.
 * Можно передать дополнительные параметры через командную строку.
 */

const { execSync } = require('child_process');

// Компилируем TypeScript-файл генератора схем
console.log('Компиляция генератора схем...');
try {
  execSync('tsc --project tsconfig.json', {
    cwd: __dirname,
    stdio: 'inherit',
  });
} catch (error) {
  console.error('Ошибка при компиляции генератора схем:', error);
  process.exit(1);
}

// Запускаем скомпилированный генератор схем
console.log('Запуск генератора схем...');
try {
  // Импортируем скомпилированный модуль
  const { runSchemaGenerator } = require('./dist/schema-generator');

  // Запускаем генератор схем
  runSchemaGenerator();

  console.log('Генерация JSON-схем успешно завершена.');
  process.exit(0);
} catch (error) {
  console.error('Ошибка при генерации JSON-схем:', error);
  process.exit(1);
}
