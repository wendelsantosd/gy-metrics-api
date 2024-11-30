import { Module } from '@nestjs/common';
import { CSVProvider } from './providers/csv/csv.provider';

@Module({
  providers: [CSVProvider],
  exports: [CSVProvider],
})
export class SharedModule {}
