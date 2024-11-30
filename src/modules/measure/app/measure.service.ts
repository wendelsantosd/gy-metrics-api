import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { MeasureRepository } from '../repository/measure.repository';
import { Output } from '../repository/measure.interface';
import { parse } from 'date-fns';

type IMeasureGetAll = {
  metricId: number;
  aggType: 'day' | 'month' | 'year';
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
