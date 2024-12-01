import { AggType } from '@modules/measure/app/measure.service';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class GetMeasuresDTO {
  @IsNotEmpty()
  metricId: number;

  @IsEnum(['day', 'month', 'year'], {
    message: 'aggType must be "day" | "month" | "year"',
  })
  @IsNotEmpty()
  aggType: AggType;

  @IsString()
  @IsNotEmpty()
  initialDate: string;

  @IsString()
  @IsNotEmpty()
  finalDate: string;
}
