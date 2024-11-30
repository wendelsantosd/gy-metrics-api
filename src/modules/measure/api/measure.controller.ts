import {
  Body,
  Controller,
  Get,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response, Express } from 'express';
import { MeasureService } from '../app/measure.service';
import { GetMeasuresDTO } from './dtos/get-measures-dto';

@Controller('measure')
export class MeasureController {
  constructor(private readonly measureService: MeasureService) {}
  @Get()
  async getAll(@Body() data: GetMeasuresDTO, @Res() response: Response) {
    return response.json(await this.measureService.getAll(data));
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
