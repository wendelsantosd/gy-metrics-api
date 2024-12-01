import {
  Body,
  Controller,
  Get,
  Query,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response, Express } from 'express';
import { MeasureService } from '../app/measure.service';
import { GetMeasuresDTO } from './dtos/get-measures.dto';
import { ExportMeasureDTO } from './dtos/export-measure.dto';

@Controller('measure')
export class MeasureController {
  constructor(private readonly measureService: MeasureService) {}
  @Get()
  async getAll(@Body() data: GetMeasuresDTO, @Res() response: Response) {
    return response.json(await this.measureService.getAll(data));
  }

  @Get('export')
  async export(@Query() query: ExportMeasureDTO, @Res() response: Response) {
    response.set({
      'Content-Type':
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': `attachment; filename=measures.xlsx`,
    });

    return response.send(await this.measureService.export(query));
  }

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Res() response: Response,
  ) {
    await this.measureService.processCSV(file);

    return response.json({
      message: 'CSV processing started',
    });
  }
}
