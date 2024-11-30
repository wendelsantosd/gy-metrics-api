import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { CSVProvider } from '@shared/providers/csv/csv.provider';
import { MeasureRepository } from '../repository/measure.repository';
import { parse } from 'date-fns';
import { Injectable } from '@nestjs/common';

@Injectable()
@Processor('measure')
export class MeasureProcessor {
  constructor(
    private readonly csvProvider: CSVProvider,
    private readonly measureRepository: MeasureRepository,
  ) {}

  @Process('process-csv')
  async handleProcessCSV(job: Job<{ buffer: string }>) {
    const { buffer } = job.data;
    let total = 0;
    let current = 0;
    try {
      const csvProcessed = await this.csvProvider.parse({
        headers: ['metricId', 'dateTime', 'value'],
        separator: ';',
        buffer: Buffer.from(buffer, 'utf-8'),
      });
      const batchSize = 1000;

      total = csvProcessed.length;

      for (let i = 0; i < csvProcessed.length; i += batchSize) {
        const batch = csvProcessed.slice(i, i + batchSize);
        current += batchSize;
        const inputs = batch.map((input) => ({
          metricId: +input.metricId,
          dateTime: parse(input.dateTime, 'dd/MM/yyyy HH:mm', new Date()),
          value: +input.value,
        }));

        console.log(
          `Processing CSV (${current > total ? total : current}/${total})`,
        );

        await this.measureRepository.save(inputs);
      }

      console.log('Done!');
    } catch (error) {
      console.error('Error processing CSV:', error.message);
    }
  }
}
