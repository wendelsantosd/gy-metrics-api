import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class GetMeasuresDTO {
  @IsNotEmpty()
  metricId: number;

  @IsEnum(['day', 'month', 'year'], {
    message: 'aggType must be "day" | "month" | "year"',
  })
  @IsNotEmpty()
  aggType: 'day' | 'month' | 'year';

  @IsString()
  @IsNotEmpty()
  initialDate: string;

  @IsString()
  @IsNotEmpty()
  finalDate: string;
}
