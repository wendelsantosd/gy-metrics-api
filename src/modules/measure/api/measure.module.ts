import { Module } from '@nestjs/common';
import { MeasureController } from './measure.controller';
import { MeasureService } from '../app/measure.service';
import { SharedModule } from '@shared/shared.module';
import { MeasureRepository } from '../repository/measure.repository';
import { PrismaModule } from '@shared/database/prisma.module';
import { BullModule } from '@nestjs/bull';
import { MeasureProcessor } from '../app/measure.processor';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'measure',
    }),
    SharedModule,
    PrismaModule,
  ],
  controllers: [MeasureController],
  providers: [MeasureService, MeasureRepository, MeasureProcessor],
})
export class MeasureModule {}
