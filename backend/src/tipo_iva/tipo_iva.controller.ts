import { Controller, Get, Post, Body, Put, Param, Delete } from '@nestjs/common';
import { TipoIvaService } from './tipo_iva.service';

@Controller('api/tipo-iva')
export class TipoIvaController {
  constructor(private readonly service: TipoIvaService) {}

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Post()
  create(@Body() data: any) {
    return this.service.create(data);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() data: any) {
    return this.service.update(id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
