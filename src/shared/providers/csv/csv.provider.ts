import { Readable } from 'stream';
import { ICSVProvider, Input } from './csv.interface';
import * as csv from 'csv-parser';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CSVProvider implements ICSVProvider {
  async parse({
    headers,
    separator,
    buffer,
  }: Input): Promise<Record<string, any>[]> {
    const stream = Readable.from(buffer);
    const results: Record<string, any>[] = [];

    return new Promise((resolve, reject) => {
      stream
        .on('data', (chunk: Buffer) => {
          const cleanedData = chunk.toString().replace(/^\uFEFF/, '');
          const cleanedBuffer = Buffer.from(cleanedData);

          Readable.from(cleanedBuffer).pipe(
            csv({ separator })
              .on('data', (data) => {
                results.push(
                  headers.reduce((acc, header) => {
                    acc[header] = data[header];
                    return acc;
                  }, {}),
                );
              })
              .on('end', () => resolve(results))
              .on('error', (error) => reject(error)),
          );
        })
        .on('error', (error) => reject(error));
    });
  }
}
