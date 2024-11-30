import { Module } from '@nestjs/common';
import { MeasureController } from './measure.controller';

@Module({
  controllers: [MeasureController],
})
export class MeasureModule {}
