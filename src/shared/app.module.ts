import { MetricController } from '@modules/metric/api/metric.controller';
import { Module } from '@nestjs/common';

@Module({
  imports: [],
  controllers: [MetricController],
  providers: [],
})
export class AppModule {}
