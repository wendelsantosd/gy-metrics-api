import { PrismaService } from '@shared/database/prisma.service';
import {
  IMeasureRepository,
  Input,
  InputGetAll,
  Output,
} from './measure.interface';
import { Injectable } from '@nestjs/common';

type IResult = {
  value: number;
  created_at: Date;
};
@Injectable()
export class MeasureRepository implements IMeasureRepository {
  constructor(private prismaService: PrismaService) {}

  async getAll(data: InputGetAll): Promise<Output[]> {
    try {
      const result = await this.prismaService.measure.findMany({
        where: {
          metricId: data.metricId,
          created_at: {
            gte: data.initialDate,
            lte: data.finalDate,
          },
        },
        select: {
          created_at: true,
          value: true,
        },
      });

      const groupedArray = this.groupByDate(result, data.aggType);

      return groupedArray.map((item) => ({
        date: item.date,
        value: item.value,
      }));
    } catch (error) {
      console.log('Error Database', error);
    }
  }
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

  private getTruncatedDate(date: Date, aggType: string): string {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();

    switch (aggType) {
      case 'day':
        return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
      case 'month':
        return `${year}-${month.toString().padStart(2, '0')}-01`;
      case 'year':
        return `${year}-01-01`;
      default:
        return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
    }
  }

  private groupByDate(
    result: IResult[],
    aggType: string,
  ): Record<string, any>[] {
    const grouped = result.reduce((acc, measure) => {
      const truncatedDate = this.getTruncatedDate(
        new Date(measure.created_at),
        aggType,
      );

      if (!acc[truncatedDate]) {
        acc[truncatedDate] = {
          date: truncatedDate,
          value: 0,
        };
      }

      acc[truncatedDate].value += measure.value;

      return acc;
    }, {});

    return Object.values(grouped).sort(
      (a: { date: string }, b: { date: string }) =>
        new Date(a.date).getTime() - new Date(b.date).getTime(),
    );
  }
}
