import { PrismaService } from '@shared/database/prisma.service';
import { IMeasureRepository, Input } from './measure.interface';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MeasureRepository implements IMeasureRepository {
  constructor(private prismaService: PrismaService) {}
  async save(inputs: Input): Promise<void> {
    try {
      const ids = [...new Set(inputs.map((input) => input.metricId))];

      await this.prismaService.metric.createMany({
        data: ids.map((id) => ({ id })),
        skipDuplicates: true,
      });

      await this.prismaService.measure.createMany({
        data: inputs.map((input) => ({
          metricId: input.metricId,
          value: input.value,
          created_at: input.dateTime,
          updated_at: input.dateTime,
        })),
      });
    } catch (error) {
      console.log('Error Database', error);
    }
  }
}
