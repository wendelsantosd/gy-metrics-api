import { IsEnum, IsNotEmpty } from 'class-validator';

export class GetMeasuresDTO {
  @IsNotEmpty()
  metricId: number;

  @IsEnum(['day', 'month', 'year'], {
    message: 'aggType must be "day" | "month" | "year"',
  })
  aggType: 'day' | 'month' | 'year';

  initialDate: string;

  finalDate: string;
}
