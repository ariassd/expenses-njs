import { NestFactory } from '@nestjs/core';
import { AppModule } from './src/app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { writeFileSync, mkdirSync } from 'fs';
import * as yaml from 'js-yaml';

async function generateDocs() {
  // 1. Crear una instancia mínima de la aplicación
  const app = await NestFactory.create(AppModule);

  // 2. Configurar el Builder (el mismo que usas en main.ts)
  const config = new DocumentBuilder()
    .setTitle('Expenses API')
    .setDescription('Expenses management microservice')
    .setVersion('1.0')
    .addTag('expenses')
    .build();

  // 3. Generar el documento (objeto JSON)
  const document = SwaggerModule.createDocument(app, config);

  // 4. Asegurar carpeta
  mkdirSync('./api-docs', { recursive: true });

  // 5. Guardar JSON
  const jsonPath = './api-docs/swagger.json';
  writeFileSync(jsonPath, JSON.stringify(document, null, 2));

  // 6. Generar YAML
  const yamlSpec = yaml.dump(document);
  writeFileSync('./api-docs/swagger.yaml', yamlSpec);

  console.log('Documentación generada exitosamente en la carpeta ./api-docs/');
  
  await app.close();

}

generateDocs().catch(err => {
  console.error(err);
  process.exit(1);
});