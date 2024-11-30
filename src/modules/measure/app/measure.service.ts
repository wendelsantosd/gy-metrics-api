import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

@Injectable()
export class MeasureService {
  constructor(@InjectQueue('measure') private readonly measureQueue: Queue) {}
  async processCSV(file: Express.Multer.File): Promise<void> {
    await this.measureQueue.add('process-csv', {
      buffer: file.buffer,
    });
  }
}
