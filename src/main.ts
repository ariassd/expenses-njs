import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { types } from 'pg';

async function bootstrap() {
  const logger = new Logger('Expenses');
  const app = await NestFactory.create(AppModule);

  // 1700 is the OID for the NUMERIC type in PostgreSQL
  types.setTypeParser(1700, (val) => parseFloat(val));
  
  app.enableShutdownHooks();
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      
    }),
  );
  const port = process.env.PORT ?? 3000;
  await app.listen(port, () => {
    logger.verbose(`Server is running on port ${port}`);
  });
}
bootstrap();
