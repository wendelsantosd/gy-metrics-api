import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';

@Controller('measure')
export class MeasureController {
  @Get()
  async getAll(@Res() response: Response) {
    return response.json({
      message: 'This position is mine',
    });
  }
}
