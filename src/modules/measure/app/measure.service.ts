import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { MeasureRepository } from '../repository/measure.repository';
import { Output, OutputExport } from '../repository/measure.interface';
import { parse } from 'date-fns';
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

    const result = await this.measureRepository.toExport(formatedDate);

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

  async getAll(data: IMeasureGetAll): Promise<Output[]> {
    const formatedDate = {
      ...data,
      initialDate: parse(data.initialDate, 'yyyy-MM-dd', new Date()),
      finalDate: parse(data.finalDate, 'yyyy-MM-dd', new Date()),
    };

    const measures = await this.measureRepository.getAll(formatedDate);

    return measures;
  }
}
