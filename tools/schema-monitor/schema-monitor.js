/**
 * Утилита для мониторинга изменений в JSON-схемах и их тестах
 *
 * Эта утилита сканирует все JSON-схемы в директории docs/json-schema,
 * проверяет наличие соответствующих тестов и сравнивает свойства схем
 * с проверками в тестах. Генерирует отчет о несоответствиях.
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

/**
 * Загружает JSON-схему из файла
 * @param {string} filePath Путь к файлу схемы
 * @returns {Object} Объект JSON-схемы
 */
function loadSchema(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(content);
  } catch (error) {
    console.error(`Ошибка при загрузке схемы ${filePath}:`, error);
    throw error;
  }
}

/**
 * Находит тест для схемы
 * @param {string} schemaPath Путь к файлу схемы
 * @returns {string|null} Путь к файлу теста или null, если тест не найден
 */
function findTestForSchema(schemaPath) {
  const schemaName = path.basename(schemaPath, '.schema.json');
  const testsDir = path.resolve(
    process.cwd(),
    'libs',
    'shared',
    'src',
    'lib',
    'types',
    '__tests__',
  );

  // Список возможных вариантов именования файлов тестов
  const possibleTestFiles = [
    `${schemaName}-schema.spec.ts`,
    `${schemaName}-schemas.spec.ts`,
    `${schemaName}-schema-test.spec.ts`,
    `${schemaName}.spec.ts`,
    `${schemaName}.test.ts`,
    `${schemaName.replace(/-/g, '_')}-schema.spec.ts`,
    `${schemaName.replace(/-/g, '_')}-schemas.spec.ts`,
  ];

  // Проверяем все возможные варианты
  for (const testFile of possibleTestFiles) {
    const testPath = path.join(testsDir, testFile);
    if (fs.existsSync(testPath)) {
      return testPath;
    }
  }

  // Если не нашли по имени, проверим все файлы в директории тестов
  try {
    const files = fs.readdirSync(testsDir);
    // Ищем файлы, в которых есть имя схемы
    const matchingFile = files.find(
      file => file.includes(schemaName) && (file.endsWith('.spec.ts') || file.endsWith('.test.ts')),
    );

    if (matchingFile) {
      return path.join(testsDir, matchingFile);
    }
  } catch (error) {
    console.error('Ошибка при чтении директории тестов:', error);
  }

  return null;
}

/**
 * Извлекает проверяемые свойства из файла теста
 * @param {string} testPath Путь к файлу теста
 * @returns {string[]} Список свойств, проверяемых в тесте
 */
function extractTestedProperties(testPath) {
  if (!testPath) return [];

  try {
    const content = fs.readFileSync(testPath, 'utf-8');
    const properties = new Set();

    // Паттерны для поиска проверяемых свойств
    const patterns = [
      // Утилиты из schema-test-utils.ts
      /expect\w*Property\(properties,\s*['"]([^'"]+)['"](?:\s*,\s*[^)]+)?\)/g,
      // Прямые проверки через expect
      /expect\(properties\[['"]([^'"]+)['"]\)/g,
      /expect\(properties\.([a-zA-Z0-9_]+)\)/g,
      // Проверки в required
      /expect\([^)]+\.required\)\.toContain\(['"]([^'"]+)['"]\)/g,
      // Проверки через прямое обращение к свойствам
      /properties\[['"]([^'"]+)['"]\]/g,
      /properties\.([a-zA-Z0-9_]+)/g,
    ];

    // Применяем все паттерны
    patterns.forEach(pattern => {
      let match;
      while ((match = pattern.exec(content)) !== null) {
        if (match[1]) {
          properties.add(match[1]);
        }
      }
    });

    return Array.from(properties);
  } catch (error) {
    console.error(`Ошибка при анализе теста ${testPath}:`, error);
    return [];
  }
}

/**
 * Извлекает проверяемые перечисления из файла теста
 * @param {string} testPath Путь к файлу теста
 * @returns {Object} Объект с перечислениями, проверяемыми в тесте
 */
function extractTestedEnums(testPath) {
  if (!testPath) return {};

  try {
    const content = fs.readFileSync(testPath, 'utf-8');
    const enumMatches = content.match(
      /expectEnumProperty\(properties,\s*['"]([^'"]+)['"],\s*\[([^\]]+)\]/g,
    );

    if (!enumMatches) return {};

    const result = {};

    enumMatches.forEach(match => {
      const propertyMatch = match.match(/['"]([^'"]+)['"]/);
      const enumValuesMatch = match.match(/\[(.*)\]/);

      if (propertyMatch && enumValuesMatch) {
        const propertyName = propertyMatch[1];
        const enumValues = enumValuesMatch[1]
          .split(',')
          .map(val => val.trim().replace(/['"]/g, ''))
          .filter(Boolean);

        result[propertyName] = enumValues;
      }
    });

    return result;
  } catch (error) {
    console.error(`Ошибка при анализе перечислений в тесте ${testPath}:`, error);
    return {};
  }
}

/**
 * Проверяет соответствие между схемой и тестом
 * @param {Object} schema Объект JSON-схемы
 * @param {string[]} testedProperties Список свойств, проверяемых в тесте
 * @param {Object} testedEnums Объект с перечислениями, проверяемыми в тесте
 * @param {string} schemaPath Путь к файлу схемы
 * @param {Object} options Опции проверки
 * @returns {Object} Информация о несоответствиях
 */
function checkSchemaTestConsistency(schema, testedProperties, testedEnums, schemaPath, options) {
  const schemaProperties = Object.keys(schema.properties);
  const schemaFileName = path.basename(schemaPath);

  // Получаем список игнорируемых свойств для этой схемы
  const ignored = [...(ignoredProperties['*'] || []), ...(ignoredProperties[schemaFileName] || [])];

  // Определяем необязательные свойства (не входящие в required)
  const optionalProperties = options.ignoreOptionalProperties
    ? schemaProperties.filter(prop => !schema.required.includes(prop))
    : [];

  // Свойства, которые есть в схеме, но отсутствуют в тесте
  const missingProperties = schemaProperties.filter(
    prop =>
      !testedProperties.includes(prop) &&
      !ignored.includes(prop) &&
      !(options.ignoreOptionalProperties && optionalProperties.includes(prop)),
  );

  // Свойства, которые есть в тесте, но отсутствуют в схеме
  const extraProperties = testedProperties.filter(prop => !schemaProperties.includes(prop));

  // Несоответствия в перечислениях
  const enumMismatches = {};

  Object.entries(testedEnums).forEach(([prop, testedEnum]) => {
    const schemaProperty = schema.properties[prop];

    if (schemaProperty && schemaProperty.enum) {
      const schemaEnum = schemaProperty.enum;

      // Проверяем, совпадают ли перечисления
      if (JSON.stringify(schemaEnum.sort()) !== JSON.stringify(testedEnum.sort())) {
        enumMismatches[prop] = {
          expected: schemaEnum,
          actual: testedEnum,
        };
      }
    }
  });

  return { missingProperties, extraProperties, enumMismatches };
}

/**
 * Список игнорируемых свойств для каждой схемы
 * Эти свойства не будут учитываться при проверке на отсутствие в тестах
 */
const ignoredProperties = {
  // Общие свойства для всех схем
  '*': ['_responseType', 'metadata', 'options'],

  // Свойства для конкретных схем
  'ai-analysis-request.schema.json': ['options', 'userId', 'prompt', 'data'],
  'ai-analysis-response.schema.json': [
    'metadata',
    'userId',
    'requestId',
    'result',
    'data',
    'createdAt',
  ],
  'analytics-request.schema.json': [
    'userId',
    'period',
    'startDate',
    'endDate',
    'includeCharts',
    'includeMetrics',
    'categories',
  ],
  'analytics-response.schema.json': [
    'userId',
    'period',
    'startDate',
    'endDate',
    'metrics',
    'charts',
  ],
  'user.schema.json': ['avatar', 'phoneNumber'],
  'tender.schema.json': ['attachments'],
  'transaction.schema.json': ['attachments'],
  'account.schema.json': ['linkedCards'],
  'document.schema.json': ['tags'],
};

/**
 * Мониторит изменения в схемах и их тестах
 * @param {Object} options Опции мониторинга
 * @param {boolean} options.ignoreOptionalProperties Игнорировать ли необязательные свойства
 * @returns {Object[]} Список информации о несоответствиях
 */
function monitorSchemaChanges(options = { ignoreOptionalProperties: true }) {
  const schemaDir = path.resolve(process.cwd(), 'docs', 'json-schema');
  console.log('Поиск JSON-схем в директории:', schemaDir);

  // Используем прямой паттерн для Windows
  const schemaFiles = glob.sync(schemaDir + '\\*.schema.json');

  if (schemaFiles.length === 0) {
    // Попробуем альтернативный способ с прямым чтением директории
    try {
      const files = fs.readdirSync(schemaDir);
      schemaFiles.push(
        ...files
          .filter(file => file.endsWith('.schema.json'))
          .map(file => path.join(schemaDir, file)),
      );
    } catch (error) {
      console.error('Ошибка при чтении директории:', error);
    }
  }

  console.log('Найдено JSON-схем:', schemaFiles.length);

  const results = [];

  schemaFiles.forEach(schemaPath => {
    const schema = loadSchema(schemaPath);
    const testPath = findTestForSchema(schemaPath);
    const testedProperties = testPath ? extractTestedProperties(testPath) : [];
    const testedEnums = testPath ? extractTestedEnums(testPath) : {};

    const { missingProperties, extraProperties, enumMismatches } = checkSchemaTestConsistency(
      schema,
      testedProperties,
      testedEnums,
      schemaPath,
      options,
    );

    results.push({
      schemaPath,
      testPath,
      missingTest: !testPath,
      missingProperties,
      extraProperties,
      enumMismatches,
    });
  });

  return results;
}

/**
 * Генерирует отчет о несоответствиях между схемами и тестами
 * @returns {string} Строка с отчетом
 */
function generateSchemaMonitorReport() {
  const results = monitorSchemaChanges();
  let report = '# Отчет о мониторинге JSON-схем и их тестов\n\n';

  report += `Дата: ${new Date().toISOString()}\n\n`;
  report += `Всего проверено схем: ${results.length}\n`;

  const schemasWithIssues = results.filter(
    r =>
      r.missingTest ||
      r.missingProperties.length > 0 ||
      r.extraProperties.length > 0 ||
      Object.keys(r.enumMismatches).length > 0,
  );

  report += `Схемы с проблемами: ${schemasWithIssues.length}\n\n`;

  if (schemasWithIssues.length > 0) {
    report += '## Детали проблем\n\n';

    schemasWithIssues.forEach(result => {
      const schemaName = path.basename(result.schemaPath);
      report += `### ${schemaName}\n\n`;

      if (result.missingTest) {
        report += '- ❌ Отсутствует тест для схемы\n';
      } else {
        report += `- ✅ Тест: ${path.basename(result.testPath)}\n`;
      }

      if (result.missingProperties.length > 0) {
        report += '- ❌ Свойства, отсутствующие в тесте:\n';
        result.missingProperties.forEach(prop => {
          report += `  - \`${prop}\`\n`;
        });
      }

      if (result.extraProperties.length > 0) {
        report += '- ⚠️ Свойства в тесте, отсутствующие в схеме:\n';
        result.extraProperties.forEach(prop => {
          report += `  - \`${prop}\`\n`;
        });
      }

      if (Object.keys(result.enumMismatches).length > 0) {
        report += '- ❌ Несоответствия в перечислениях:\n';
        Object.entries(result.enumMismatches).forEach(([prop, { expected, actual }]) => {
          report += `  - \`${prop}\`:\n`;
          report += `    - Ожидается: ${JSON.stringify(expected)}\n`;
          report += `    - Фактически: ${JSON.stringify(actual)}\n`;
        });
      }

      report += '\n';
    });
  } else {
    report += '✅ Все схемы имеют соответствующие тесты без проблем\n';
  }

  return report;
}

/**
 * Запускает мониторинг схем и сохраняет отчет в файл
 */
function runSchemaMonitor() {
  const report = generateSchemaMonitorReport();
  const reportPath = path.resolve(process.cwd(), 'docs', 'schema-monitor-report.md');

  fs.writeFileSync(reportPath, report, 'utf-8');
  console.log(`Отчет о мониторинге схем сохранен в ${reportPath}`);

  // Проверяем наличие проблем
  const results = monitorSchemaChanges();
  const schemasWithIssues = results.filter(
    r =>
      r.missingTest ||
      r.missingProperties.length > 0 ||
      r.extraProperties.length > 0 ||
      Object.keys(r.enumMismatches).length > 0,
  );

  if (schemasWithIssues.length > 0) {
    console.error(`\n❌ Обнаружены проблемы в ${schemasWithIssues.length} схемах:`);

    schemasWithIssues.forEach(result => {
      const schemaName = path.basename(result.schemaPath);
      console.error(`\n- ${schemaName}:`);

      if (result.missingTest) {
        console.error('  ❌ Отсутствует тест для схемы');
      }

      if (result.missingProperties.length > 0) {
        console.error('  ❌ Свойства, отсутствующие в тесте:');
        result.missingProperties.forEach(prop => {
          console.error(`    - ${prop}`);
        });
      }

      if (result.extraProperties.length > 0) {
        console.error('  ⚠️ Свойства в тесте, отсутствующие в схеме:');
        result.extraProperties.forEach(prop => {
          console.error(`    - ${prop}`);
        });
      }

      if (Object.keys(result.enumMismatches).length > 0) {
        console.error('  ❌ Несоответствия в перечислениях:');
        Object.entries(result.enumMismatches).forEach(([prop, { expected, actual }]) => {
          console.error(`    - ${prop}:`);
          console.error(`      - Ожидается: ${JSON.stringify(expected)}`);
          console.error(`      - Фактически: ${JSON.stringify(actual)}`);
        });
      }
    });

    console.error('\nПодробный отчет доступен в файле:', reportPath);
    console.error(
      '\nПожалуйста, обновите тесты для соответствия схемам или схемы для соответствия тестам.',
    );

    // Возвращаем ненулевой код выхода для CI/CD
    process.exit(1);
  } else {
    console.log('\n✅ Все схемы имеют соответствующие тесты без проблем');

    // Возвращаем нулевой код выхода
    process.exit(0);
  }
}

// Экспортируем функции для использования в других модулях
module.exports = {
  monitorSchemaChanges,
  generateSchemaMonitorReport,
  runSchemaMonitor,
};

// Если файл запущен напрямую, запускаем мониторинг
if (require.main === module) {
  runSchemaMonitor();
}
