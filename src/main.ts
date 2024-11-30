import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './shared/app.module';
import { server } from '@shared/config/server';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  await app.listen(server.port ?? 3000);
}

bootstrap();
