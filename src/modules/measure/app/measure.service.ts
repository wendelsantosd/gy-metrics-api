import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { MeasureRepository } from '../repository/measure.repository';
import { OutputGetAll, OutputExport } from '../repository/measure.interface';
import { format, parse } from 'date-fns';
import xlsx from 'xlsx-creator';

type IMeasureGetAll = {
  metricId: number;
  aggType: 'day' | 'month' | 'year';
  initialDate: string;
  finalDate: string;
};

type IExportMeasure = {
  metricId: string;
  initialDate: string;
  finalDate: string;
};

type IResponseGetAll = {
  date: string;
  value: number;
}[];

export type AggType = 'day' | 'month' | 'year';

@Injectable()
export class MeasureService {
  constructor(
    @InjectQueue('measure') private readonly measureQueue: Queue,
    private readonly measureRepository: MeasureRepository,
  ) {}
  async processCSV(file: Express.Multer.File): Promise<void> {
    await this.measureQueue.add('process-csv', {
      buffer: file.buffer,
    });
  }

  async export(query: IExportMeasure): Promise<Buffer> {
    const formatedDate = {
      metricId: +query.metricId,
      initialDate: parse(query.initialDate, 'yyyy-MM-dd', new Date()),
      finalDate: parse(query.finalDate, 'yyyy-MM-dd', new Date()),
    };

    const measures = await this.measureRepository.getAll(formatedDate);

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
      const year = this.getTruncatedDate(new Date(measure.created_at), 'year');
      acc[year] = (acc[year] || 0) + measure.value;
      return acc;
    }, {});

    const result: OutputExport[] = [];

    Object.keys(aggDay).forEach((date) => {
      const month = format(date, 'yyyy-MM');
      const year = format(date, 'yyyy');
      result.push({
        metricId: +query.metricId,
        dateTime: format(new Date(date), 'dd-MM-yyyy'),
        aggDay: aggDay[date],
        aggMonth: aggMonth[month] || 0,
        aggYear: aggYear[year] || 0,
      });
    });

    const buffer: Buffer = xlsx.build([
      {
        name: 'measures',
        data: [
          ['MetricId', 'DateTime', 'AggDay', 'AggMonth', 'AggYear'],
          ...(result?.map((item: OutputExport) => Object.values(item)) || []),
        ],
      },
    ]);

    return Buffer.from(buffer);
  }

  async getAll(data: IMeasureGetAll): Promise<IResponseGetAll> {
    const formatedDate = {
      ...data,
      initialDate: parse(data.initialDate, 'yyyy-MM-dd', new Date()),
      finalDate: parse(data.finalDate, 'yyyy-MM-dd', new Date()),
    };

    const measures = await this.measureRepository.getAll(formatedDate);

    const measuresGroup = this.groupByDate(measures, data.aggType);

    return measuresGroup as IResponseGetAll;
  }

  private getTruncatedDate(date: Date, aggType: AggType): string {
    switch (aggType) {
      case 'day':
        return format(date, 'yyyy-MM-dd');
      case 'month':
        return format(date, 'yyyy-MM');
      case 'year':
        return format(date, 'yyyy');
      default:
        return format(date, 'yyyy-MM-dd');
    }
  }

  private groupByDate(
    measures: OutputGetAll[],
    aggType: AggType,
  ): Record<string, any>[] {
    const grouped = measures.reduce((acc, measure) => {
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
