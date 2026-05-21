import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger('Expenses');
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  );
  const port = process.env.PORT ?? 3000
  await app.listen(port, () => {
    logger.verbose(`Server is running on port ${port}`);
  });
}
bootstrap();
