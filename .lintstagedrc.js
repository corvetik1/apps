// Упрощенная конфигурация lint-staged для работы с Nx
module.exports = {
  // Форматирование с помощью Prettier (без запуска тестов)
  '**/*.{js,jsx,ts,tsx,json,css,scss,md}': ['prettier --write'],
};
