import { IsNotEmpty, IsString } from 'class-validator';

export class ExportMeasureDTO {
  @IsNotEmpty()
  @IsString()
  metricId: string;

  @IsNotEmpty()
  @IsString()
  initialDate: string;

  @IsNotEmpty()
  @IsString()
  finalDate: string;
}
