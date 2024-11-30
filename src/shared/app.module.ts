import { MeasureModule } from '@modules/measure/api/measure.module';
import { Module } from '@nestjs/common';
import { SharedModule } from './shared.module';
import { PrismaModule } from './database/prisma.module';
import { BullModule } from '@nestjs/bull';

@Module({
  imports: [
    BullModule.forRoot({
      redis: {
        host: process.env.REDIS_HOST || 'localhost',
        port: +process.env.REDIS_PORT || 6379,
      },
    }),
    MeasureModule,
    SharedModule,
    PrismaModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
