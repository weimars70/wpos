import { Controller, Get, Post, Body, Put, Param, Delete } from '@nestjs/common';
import { MedioPagoService } from './medios_pago.service';

@Controller('api/medios-pago')
export class MedioPagoController {
  constructor(private readonly service: MedioPagoService) {}

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(+id);
  }

  @Post()
  create(@Body() data: any) {
    return this.service.create(data);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() data: any) {
    return this.service.update(+id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(+id);
  }
}
