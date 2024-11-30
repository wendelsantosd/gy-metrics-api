import { IsEnum, IsNotEmpty } from 'class-validator';

export class GetMeasuresDTO {
  @IsNotEmpty()
  metricId: number;

  @IsEnum(['day', 'month', 'year'], {
    message: 'aggType must be "day" | "month" | "year"',
  })
  @IsNotEmpty()
  aggType: 'day' | 'month' | 'year';

  @IsNotEmpty()
  initialDate: string;

  @IsNotEmpty()
  finalDate: string;
}
