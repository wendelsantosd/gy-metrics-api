import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './shared/app.module';
import { server } from '@shared/config/server';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors();
  await app.listen(server.port ?? 3000);
}

bootstrap();
