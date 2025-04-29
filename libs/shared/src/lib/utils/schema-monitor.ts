/**
 * Утилита для мониторинга изменений в JSON-схемах и их тестах
 *
 * Эта утилита сканирует все JSON-схемы в директории docs/json-schema,
 * проверяет наличие соответствующих тестов и сравнивает свойства схем
 * с проверками в тестах. Генерирует отчет о несоответствиях.
 */

import * as fs from 'fs';
import * as path from 'path';
import * as glob from 'glob';

// Импортируем типы из проекта
type JsonSchemaType = 'string' | 'number' | 'boolean' | 'object' | 'array' | 'null';
type JsonSchemaFormat = 'date-time' | 'date' | 'time' | 'email' | 'uri' | 'uuid' | string;

interface SchemaProperty {
  type: JsonSchemaType | JsonSchemaType[] | string | string[];
  enum?: string[];
  format?: JsonSchemaFormat;
  items?: {
    type: JsonSchemaType | string;
  };
  properties?: Record<string, SchemaProperty>;
  required?: string[];
  additionalProperties?: boolean;
}

interface JsonSchema {
  $schema: string;
  title: string;
  description: string;
  type: string;
  additionalProperties: boolean;
  required: string[];
  properties: Record<string, SchemaProperty>;
}

interface SchemaTestInfo {
  schemaPath: string;
  testPath: string | null;
  missingTest: boolean;
  missingProperties: string[];
  extraProperties: string[];
  enumMismatches: Record<string, { expected: string[]; actual: string[] }>;
}

/**
 * Загружает JSON-схему из файла
 * @param filePath Путь к файлу схемы
 * @returns Объект JSON-схемы
 */
function loadSchema(filePath: string): JsonSchema {
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
 * @param schemaPath Путь к файлу схемы
 * @returns Путь к файлу теста или null, если тест не найден
 */
function findTestForSchema(schemaPath: string): string | null {
  const schemaName = path.basename(schemaPath, '.schema.json');
  const testPattern = path.resolve(
    __dirname,
    '..',
    'types',
    '__tests__',
    `${schemaName}-schema.spec.ts`,
  );

  // Проверяем альтернативные имена файлов тестов
  const alternativePattern = path.resolve(
    __dirname,
    '..',
    'types',
    '__tests__',
    `${schemaName}-schemas.spec.ts`,
  );

  if (fs.existsSync(testPattern)) {
    return testPattern;
  } else if (fs.existsSync(alternativePattern)) {
    return alternativePattern;
  }

  return null;
}

/**
 * Извлекает проверяемые свойства из файла теста
 * @param testPath Путь к файлу теста
 * @returns Список свойств, проверяемых в тесте
 */
function extractTestedProperties(testPath: string): string[] {
  if (!testPath) return [];

  try {
    const content = fs.readFileSync(testPath, 'utf-8');
    const propertyMatches = content.match(/expect\w*Property\(properties,\s*['"]([^'"]+)['"]/g);

    if (!propertyMatches) return [];

    return propertyMatches
      .map(match => {
        const propertyMatch = match.match(/['"]([^'"]+)['"]/);
        return propertyMatch ? propertyMatch[1] : '';
      })
      .filter(Boolean);
  } catch (error) {
    console.error(`Ошибка при анализе теста ${testPath}:`, error);
    return [];
  }
}

/**
 * Извлекает проверяемые перечисления из файла теста
 * @param testPath Путь к файлу теста
 * @returns Объект с перечислениями, проверяемыми в тесте
 */
function extractTestedEnums(testPath: string): Record<string, string[]> {
  if (!testPath) return {};

  try {
    const content = fs.readFileSync(testPath, 'utf-8');
    const enumMatches = content.match(
      /expectEnumProperty\(properties,\s*['"]([^'"]+)['"],\s*\[([^\]]+)\]/g,
    );

    if (!enumMatches) return {};

    const result: Record<string, string[]> = {};

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
 * @param schema Объект JSON-схемы
 * @param testedProperties Список свойств, проверяемых в тесте
 * @param testedEnums Объект с перечислениями, проверяемыми в тесте
 * @returns Информация о несоответствиях
 */
function checkSchemaTestConsistency(
  schema: JsonSchema,
  testedProperties: string[],
  testedEnums: Record<string, string[]>,
): {
  missingProperties: string[];
  extraProperties: string[];
  enumMismatches: Record<string, { expected: string[]; actual: string[] }>;
} {
  const schemaProperties = Object.keys(schema.properties);

  // Свойства, которые есть в схеме, но отсутствуют в тесте
  const missingProperties = schemaProperties.filter(prop => !testedProperties.includes(prop));

  // Свойства, которые есть в тесте, но отсутствуют в схеме
  const extraProperties = testedProperties.filter(prop => !schemaProperties.includes(prop));

  // Несоответствия в перечислениях
  const enumMismatches: Record<string, { expected: string[]; actual: string[] }> = {};

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
 * Мониторит изменения в схемах и их тестах
 * @returns Список информации о несоответствиях
 */
export function monitorSchemaChanges(): SchemaTestInfo[] {
  const schemaDir = path.resolve(__dirname, '..', '..', '..', '..', '..', 'docs', 'json-schema');
  const schemaFiles = glob.sync(path.join(schemaDir, '*.schema.json'));

  const results: SchemaTestInfo[] = [];

  schemaFiles.forEach(schemaPath => {
    const schema = loadSchema(schemaPath);
    const testPath = findTestForSchema(schemaPath);
    const testedProperties = testPath ? extractTestedProperties(testPath) : [];
    const testedEnums = testPath ? extractTestedEnums(testPath) : {};

    const { missingProperties, extraProperties, enumMismatches } = checkSchemaTestConsistency(
      schema,
      testedProperties,
      testedEnums,
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
 * @returns Строка с отчетом
 */
export function generateSchemaMonitorReport(): string {
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
      } else if (result.testPath) {
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
export function runSchemaMonitor(): void {
  const report = generateSchemaMonitorReport();
  const reportPath = path.resolve(
    __dirname,
    '..',
    '..',
    '..',
    '..',
    '..',
    'docs',
    'schema-monitor-report.md',
  );

  fs.writeFileSync(reportPath, report, 'utf-8');
  console.log(`Отчет о мониторинге схем сохранен в ${reportPath}`);
}

// Если файл запущен напрямую, запускаем мониторинг
if (require.main === module) {
  runSchemaMonitor();
}
