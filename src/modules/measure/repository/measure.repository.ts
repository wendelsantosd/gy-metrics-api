import { PrismaService } from '@shared/database/prisma.service';
import {
  IMeasureRepository,
  Input,
  InputExport,
  InputGetAll,
  OutputGetAll,
  OutputExport,
} from './measure.interface';
import { Injectable } from '@nestjs/common';
import { format } from 'date-fns';

type IResult = {
  value: number;
  created_at: Date;
};
@Injectable()
export class MeasureRepository implements IMeasureRepository {
  constructor(private prismaService: PrismaService) {}
  async toExport(data: InputExport): Promise<OutputExport[]> {
    try {
      const measures = await this.prismaService.measure.findMany({
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

      const aggDay = measures.reduce((acc, measure) => {
        const day = this.getTruncatedDate(new Date(measure.created_at), 'day');
        acc[day] = (acc[day] || 0) + measure.value;
        return acc;
      }, {});

      const aggMonth = measures.reduce((acc, measure) => {
        const month = this.getTruncatedDate(
          new Date(measure.created_at),
          'month',
        );
        acc[month] = (acc[month] || 0) + measure.value;
        return acc;
      }, {});

      const aggYear = measures.reduce((acc, measure) => {
        const year = this.getTruncatedDate(
          new Date(measure.created_at),
          'year',
        );
        acc[year] = (acc[year] || 0) + measure.value;
        return acc;
      }, {});

      const result: OutputExport[] = [];

      Object.keys(aggDay).forEach((day) => {
        const month = day.slice(0, 7);
        const year = day.slice(0, 4);
        result.push({
          metricId: data.metricId,
          dateTime: format(new Date(day), 'dd-MM-yyyy'),
          aggDay: aggDay[day],
          aggMonth: aggMonth[month] || 0,
          aggYear: aggYear[year] || 0,
        });
      });

      return result;
    } catch (error) {
      console.log('Error Database', error);
    }
  }

  async getAll(data: InputGetAll): Promise<OutputGetAll[]> {
    try {
      return await this.prismaService.measure.findMany({
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
