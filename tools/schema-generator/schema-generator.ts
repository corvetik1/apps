/**
 * Генератор JSON-схем на основе TypeScript-интерфейсов
 *
 * Этот модуль анализирует TypeScript-интерфейсы и генерирует соответствующие JSON-схемы.
 * Также может опционально генерировать тесты для схем.
 */

import * as ts from 'typescript';
import * as fs from 'fs';
import * as path from 'path';
import * as glob from 'glob';

/**
 * Конфигурация генератора схем
 */
interface SchemaGeneratorConfig {
  /** Путь к директории с исходными TypeScript-файлами */
  sourcePath: string;
  /** Паттерн для поиска файлов с интерфейсами */
  sourcePattern: string;
  /** Путь для сохранения сгенерированных JSON-схем */
  outputPath: string;
  /** Генерировать ли тесты для схем */
  generateTests: boolean;
  /** Путь для сохранения сгенерированных тестов */
  testsPath?: string;
  /** Игнорировать ли определенные интерфейсы */
  ignoreInterfaces?: string[];
  /** Дополнительные метаданные для схем */
  additionalMetadata?: Record<string, unknown>;
}

/**
 * Информация об интерфейсе
 */
interface InterfaceInfo {
  /** Имя интерфейса */
  name: string;
  /** Описание интерфейса (из JSDoc) */
  description: string;
  /** Свойства интерфейса */
  properties: PropertyInfo[];
  /** Обязательные свойства */
  required: string[];
  /** Наследуемые интерфейсы */
  extends: string[];
  /** Примеры использования (из JSDoc) */
  examples: string[];
}

/**
 * Информация о свойстве интерфейса
 */
interface PropertyInfo {
  /** Имя свойства */
  name: string;
  /** Тип свойства */
  type: string;
  /** Описание свойства (из JSDoc) */
  description: string;
  /** Является ли свойство опциональным */
  optional: boolean;
  /** Значения перечисления (если тип - enum) */
  enumValues?: string[];
  /** Примеры значений (из JSDoc) */
  examples?: unknown[];
  /** Формат значения (например, date-time) */
  format?: string;
}

/**
 * Генерирует JSON-схемы на основе TypeScript-интерфейсов
 */
export class SchemaGenerator {
  private config: SchemaGeneratorConfig;
  private program: ts.Program;
  private typeChecker: ts.TypeChecker;

  /**
   * Создает экземпляр генератора схем
   *
   * @param config Конфигурация генератора
   */
  constructor(config: SchemaGeneratorConfig) {
    this.config = config;

    // Создаем программу TypeScript
    const compilerOptions = {
      target: ts.ScriptTarget.ES2020,
      module: ts.ModuleKind.CommonJS,
      moduleResolution: ts.ModuleResolutionKind.NodeJs,
      esModuleInterop: true,
      strict: true,
    };

    // Находим все файлы по паттерну
    const sourceFiles = glob.sync(path.join(config.sourcePath, config.sourcePattern));

    // Создаем программу и получаем TypeChecker
    this.program = ts.createProgram(sourceFiles, compilerOptions);
    this.typeChecker = this.program.getTypeChecker();
  }

  /**
   * Запускает генерацию схем
   */
  public generate(): void {
    console.log('Запуск генерации JSON-схем...');

    // Создаем директорию для схем, если она не существует
    if (!fs.existsSync(this.config.outputPath)) {
      fs.mkdirSync(this.config.outputPath, { recursive: true });
    }

    // Создаем директорию для тестов, если нужно
    if (
      this.config.generateTests &&
      this.config.testsPath &&
      !fs.existsSync(this.config.testsPath)
    ) {
      fs.mkdirSync(this.config.testsPath, { recursive: true });
    }

    // Обрабатываем каждый исходный файл
    this.program.getSourceFiles().forEach(sourceFile => {
      // Пропускаем файлы из node_modules и декларации
      if (sourceFile.fileName.includes('node_modules') || sourceFile.fileName.endsWith('.d.ts')) {
        return;
      }

      // Пропускаем файлы, не соответствующие паттерну
      if (!sourceFile.fileName.includes(this.config.sourcePath)) {
        return;
      }

      console.log(`Обработка файла: ${sourceFile.fileName}`);
      this.processSourceFile(sourceFile);
    });

    console.log('Генерация JSON-схем завершена.');
  }

  /**
   * Обрабатывает исходный файл и генерирует схемы для интерфейсов
   *
   * @param sourceFile Исходный файл TypeScript
   */
  private processSourceFile(sourceFile: ts.SourceFile): void {
    // Обходим все узлы в файле
    ts.forEachChild(sourceFile, node => {
      // Ищем интерфейсы и типы
      if (ts.isInterfaceDeclaration(node) || ts.isTypeAliasDeclaration(node)) {
        const interfaceName = node.name.text;

        // Пропускаем игнорируемые интерфейсы
        if (this.config.ignoreInterfaces?.includes(interfaceName)) {
          return;
        }

        console.log(`Найден интерфейс: ${interfaceName}`);

        // Получаем информацию об интерфейсе
        const interfaceInfo = this.extractInterfaceInfo(node);

        // Генерируем JSON-схему
        const schema = this.generateSchema(interfaceInfo);

        // Сохраняем схему в файл
        this.saveSchema(interfaceName, schema);

        // Генерируем тест для схемы, если нужно
        if (this.config.generateTests && this.config.testsPath) {
          this.generateTest(interfaceName, interfaceInfo);
        }
      }
    });
  }

  /**
   * Извлекает информацию об интерфейсе
   *
   * @param node Узел интерфейса или типа
   * @returns Информация об интерфейсе
   */
  private extractInterfaceInfo(
    node: ts.InterfaceDeclaration | ts.TypeAliasDeclaration,
  ): InterfaceInfo {
    const name = node.name.text;
    let description = '';
    const examples: string[] = [];
    const properties: PropertyInfo[] = [];
    const required: string[] = [];
    const extendsTypes: string[] = [];

    // Получаем JSDoc комментарии
    const jsDocTags = ts.getJSDocTags(node);

    // Извлекаем описание и примеры из JSDoc
    jsDocTags.forEach(tag => {
      if (tag.tagName && tag.tagName.text === 'example') {
        const commentText = typeof tag.comment === 'string' ? tag.comment : '';
        examples.push(commentText);
      }
    });

    // Получаем описание из JSDoc
    const jsDoc = ts.getJSDocCommentsAndTags(node)[0];
    if (jsDoc && ts.isJSDoc(jsDoc)) {
      description = typeof jsDoc.comment === 'string' ? jsDoc.comment : '';
    }

    // Обрабатываем интерфейс
    if (ts.isInterfaceDeclaration(node)) {
      // Получаем наследуемые интерфейсы
      if (node.heritageClauses) {
        node.heritageClauses.forEach(clause => {
          if (clause.token === ts.SyntaxKind.ExtendsKeyword) {
            clause.types.forEach(type => {
              extendsTypes.push(type.expression.getText());
            });
          }
        });
      }

      // Получаем свойства интерфейса
      node.members.forEach(member => {
        if (ts.isPropertySignature(member)) {
          const propertyName = member.name.getText();
          const optional = member.questionToken !== undefined;

          if (!optional) {
            required.push(propertyName);
          }

          const propertyType = member.type
            ? this.typeChecker.typeToString(this.typeChecker.getTypeFromTypeNode(member.type))
            : 'any';

          let propertyDescription = '';
          const propertyExamples: unknown[] = [];
          let propertyFormat: string | undefined;
          let enumValues: string[] | undefined;

          // Получаем JSDoc для свойства
          const propJsDocTags = ts.getJSDocTags(member);
          propJsDocTags.forEach(tag => {
            if (tag.tagName) {
              if (tag.tagName.text === 'example') {
                const commentText = typeof tag.comment === 'string' ? tag.comment : '';
                propertyExamples.push(commentText);
              } else if (tag.tagName.text === 'format') {
                propertyFormat = typeof tag.comment === 'string' ? tag.comment : undefined;
              }
            }
          });

          // Получаем описание свойства из JSDoc
          const propJsDoc = ts.getJSDocCommentsAndTags(member)[0];
          if (propJsDoc && ts.isJSDoc(propJsDoc)) {
            propertyDescription = typeof propJsDoc.comment === 'string' ? propJsDoc.comment : '';
          }

          // Проверяем, является ли тип перечислением
          if (member.type && ts.isTypeReferenceNode(member.type)) {
            // Получаем символ типа
            const typeSymbol = this.typeChecker.getSymbolAtLocation(member.type.typeName);

            if (typeSymbol) {
              const typeDeclaration = typeSymbol.declarations?.[0];

              if (typeDeclaration && ts.isEnumDeclaration(typeDeclaration)) {
                enumValues = [];
                typeDeclaration.members.forEach(enumMember => {
                  const enumValue = this.typeChecker.getConstantValue(enumMember);
                  if (typeof enumValue === 'string' && enumValues) {
                    enumValues.push(enumValue);
                  }
                });
              }
            }
          }

          properties.push({
            name: propertyName,
            type: propertyType,
            description: propertyDescription,
            optional,
            enumValues,
            examples: propertyExamples,
            format: propertyFormat,
          });
        }
      });
    }

    return {
      name,
      description,
      properties,
      required,
      extends: extendsTypes,
      examples,
    };
  }

  /**
   * Генерирует JSON-схему на основе информации об интерфейсе
   *
   * @param interfaceInfo Информация об интерфейсе
   * @returns JSON-схема
   */
  private generateSchema(interfaceInfo: InterfaceInfo): Record<string, unknown> {
    const schema: Record<string, unknown> = {
      $schema: 'http://json-schema.org/draft-07/schema#',
      title: interfaceInfo.name,
      description: interfaceInfo.description,
      type: 'object',
      additionalProperties: false,
      required: interfaceInfo.required,
      properties: {},
    };

    // Добавляем дополнительные метаданные, если они есть
    if (this.config.additionalMetadata) {
      Object.assign(schema, this.config.additionalMetadata);
    }

    // Добавляем свойства
    const properties = schema.properties as Record<string, unknown>;

    interfaceInfo.properties.forEach(prop => {
      const property: Record<string, unknown> = {
        description: prop.description,
      };

      // Определяем тип свойства
      if (prop.type.includes('string')) {
        property.type = 'string';

        // Добавляем формат, если он есть
        if (prop.format) {
          property.format = prop.format;
        }

        // Добавляем перечисление, если оно есть
        if (prop.enumValues) {
          property.enum = prop.enumValues;
        }
      } else if (prop.type.includes('number')) {
        property.type = 'number';
      } else if (prop.type.includes('boolean')) {
        property.type = 'boolean';
      } else if (prop.type.includes('Date')) {
        property.type = 'string';
        property.format = 'date-time';
      } else if (prop.type.includes('[]') || prop.type.includes('Array')) {
        property.type = 'array';

        // Определяем тип элементов массива
        const itemType = prop.type.replace('[]', '').replace('Array<', '').replace('>', '');

        if (itemType.includes('string')) {
          property.items = { type: 'string' };
        } else if (itemType.includes('number')) {
          property.items = { type: 'number' };
        } else if (itemType.includes('boolean')) {
          property.items = { type: 'boolean' };
        } else {
          property.items = { type: 'object' };
        }
      } else if (prop.type.includes('Record<') || prop.type.includes('object')) {
        property.type = 'object';
      } else {
        property.type = 'object';
      }

      // Добавляем примеры, если они есть
      if (prop.examples && prop.examples.length > 0) {
        property.examples = prop.examples;
      }

      properties[prop.name] = property;
    });

    return schema;
  }

  /**
   * Сохраняет JSON-схему в файл
   *
   * @param interfaceName Имя интерфейса
   * @param schema JSON-схема
   */
  private saveSchema(interfaceName: string, schema: Record<string, unknown>): void {
    // Преобразуем имя интерфейса в kebab-case
    const schemaName = interfaceName
      .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
      .replace(/([A-Z])([A-Z][a-z])/g, '$1-$2')
      .toLowerCase();

    // Формируем путь к файлу схемы
    const schemaPath = path.join(this.config.outputPath, `${schemaName}.schema.json`);

    // Сохраняем схему в файл
    fs.writeFileSync(schemaPath, JSON.stringify(schema, null, 2));

    console.log(`Схема сохранена: ${schemaPath}`);
  }

  /**
   * Генерирует тест для схемы
   *
   * @param interfaceName Имя интерфейса
   * @param interfaceInfo Информация об интерфейсе
   */
  private generateTest(interfaceName: string, interfaceInfo: InterfaceInfo): void {
    if (!this.config.testsPath) {
      return;
    }

    // Преобразуем имя интерфейса в kebab-case
    const schemaName = interfaceName
      .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
      .replace(/([A-Z])([A-Z][a-z])/g, '$1-$2')
      .toLowerCase();

    // Формируем имя переменной схемы
    const schemaVarName = `${schemaName.replace(/-/g, '')}Schema`;

    // Формируем путь к файлу теста
    const testPath = path.join(this.config.testsPath, `${schemaName}-schema.spec.ts`);

    // Генерируем код теста
    let testCode = `import { ${schemaVarName} } from '../${schemaName}';\n`;
    testCode += `import {\n`;
    testCode += `  expectValidJsonSchema,\n`;
    testCode += `  expectStringProperty,\n`;
    testCode += `  expectNumberProperty,\n`;
    testCode += `  expectBooleanProperty,\n`;
    testCode += `  expectArrayProperty,\n`;
    testCode += `  expectObjectProperty,\n`;
    testCode += `  expectEnumProperty,\n`;
    testCode += `  getSchemaProperties\n`;
    testCode += `} from './schema-test-utils';\n\n`;

    testCode += `describe('${interfaceName} JSON Schema', () => {\n`;
    testCode += `  it('должна быть валидной JSON-схемой', () => {\n`;
    testCode += `    expectValidJsonSchema(${schemaVarName}, '${interfaceName}');\n`;
    testCode += `  });\n\n`;

    testCode += `  it('должна иметь правильные обязательные поля', () => {\n`;
    interfaceInfo.required.forEach(prop => {
      testCode += `    expect(${schemaVarName}.required).toContain('${prop}');\n`;
    });
    testCode += `  });\n\n`;

    testCode += `  it('должна иметь правильные свойства с правильными типами', () => {\n`;
    testCode += `    const properties = getSchemaProperties(${schemaVarName});\n\n`;

    // Группируем свойства по типам
    const stringProps: string[] = [];
    const numberProps: string[] = [];
    const booleanProps: string[] = [];
    const arrayProps: Record<string, string> = {};
    const objectProps: string[] = [];
    const enumProps: Record<string, string[]> = {};

    interfaceInfo.properties.forEach(prop => {
      if (prop.enumValues && prop.enumValues.length > 0) {
        enumProps[prop.name] = prop.enumValues;
      } else if (prop.type.includes('string') || prop.type.includes('Date')) {
        stringProps.push(prop.name);
      } else if (prop.type.includes('number')) {
        numberProps.push(prop.name);
      } else if (prop.type.includes('boolean')) {
        booleanProps.push(prop.name);
      } else if (prop.type.includes('[]') || prop.type.includes('Array')) {
        const itemType = prop.type.replace('[]', '').replace('Array<', '').replace('>', '');
        if (itemType.includes('string')) {
          arrayProps[prop.name] = 'string';
        } else if (itemType.includes('number')) {
          arrayProps[prop.name] = 'number';
        } else if (itemType.includes('boolean')) {
          arrayProps[prop.name] = 'boolean';
        } else {
          arrayProps[prop.name] = 'object';
        }
      } else if (prop.type.includes('Record<') || prop.type.includes('object')) {
        objectProps.push(prop.name);
      } else {
        objectProps.push(prop.name);
      }
    });

    // Добавляем проверки для строковых свойств
    if (stringProps.length > 0) {
      testCode += `    // Проверка строковых свойств\n`;
      stringProps.forEach(prop => {
        testCode += `    expectStringProperty(properties, '${prop}');\n`;
      });
      testCode += `\n`;
    }

    // Добавляем проверки для числовых свойств
    if (numberProps.length > 0) {
      testCode += `    // Проверка числовых свойств\n`;
      numberProps.forEach(prop => {
        testCode += `    expectNumberProperty(properties, '${prop}');\n`;
      });
      testCode += `\n`;
    }

    // Добавляем проверки для булевых свойств
    if (booleanProps.length > 0) {
      testCode += `    // Проверка булевых свойств\n`;
      booleanProps.forEach(prop => {
        testCode += `    expectBooleanProperty(properties, '${prop}');\n`;
      });
      testCode += `\n`;
    }

    // Добавляем проверки для массивов
    if (Object.keys(arrayProps).length > 0) {
      testCode += `    // Проверка массивов\n`;
      Object.entries(arrayProps).forEach(([prop, itemType]) => {
        testCode += `    expectArrayProperty(properties, '${prop}', '${itemType}');\n`;
      });
      testCode += `\n`;
    }

    // Добавляем проверки для объектов
    if (objectProps.length > 0) {
      testCode += `    // Проверка объектов\n`;
      objectProps.forEach(prop => {
        testCode += `    expectObjectProperty(properties, '${prop}');\n`;
      });
      testCode += `\n`;
    }

    // Добавляем проверки для перечислений
    if (Object.keys(enumProps).length > 0) {
      testCode += `    // Проверка перечислений\n`;
      Object.entries(enumProps).forEach(([prop, values]) => {
        testCode += `    expectEnumProperty(properties, '${prop}', [\n`;
        values.forEach(value => {
          testCode += `      '${value}',\n`;
        });
        testCode += `    ]);\n`;
      });
      testCode += `\n`;
    }

    testCode += `  });\n`;
    testCode += `});\n`;

    // Сохраняем тест в файл
    fs.writeFileSync(testPath, testCode);

    console.log(`Тест сохранен: ${testPath}`);
  }
}

/**
 * Запускает генерацию схем с настройками по умолчанию
 */
export function runSchemaGenerator(config?: Partial<SchemaGeneratorConfig>): void {
  const defaultConfig: SchemaGeneratorConfig = {
    sourcePath: path.resolve(process.cwd(), 'libs', 'shared', 'src', 'lib', 'types'),
    sourcePattern: '*.ts',
    outputPath: path.resolve(process.cwd(), 'docs', 'json-schema'),
    generateTests: true,
    testsPath: path.resolve(process.cwd(), 'libs', 'shared', 'src', 'lib', 'types', '__tests__'),
    ignoreInterfaces: ['SchemaProperty', 'JsonSchema', 'JsonSchemaMetadata'],
    additionalMetadata: {},
  };

  const finalConfig: SchemaGeneratorConfig = { ...defaultConfig, ...config };
  const generator = new SchemaGenerator(finalConfig);
  generator.generate();
}

// Если файл запущен напрямую, запускаем генерацию схем
if (require.main === module) {
  runSchemaGenerator();
}
