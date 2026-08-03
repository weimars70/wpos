import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import { SalidasService } from './salidas.service';
import { CreateFacturaDto } from './dto/create-factura.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('api/salidas')
export class SalidasController {
  constructor(private readonly salidasService: SalidasService) {}

  @UseGuards(JwtAuthGuard)
  @Post('facturas')
  async registrarFactura(@Body() dto: CreateFacturaDto) {
    return this.salidasService.registrarSalida(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('facturas')
  async getFacturas(@Req() req: any) {
    const empresaId = req.user.empresaId;
    return this.salidasService.getFacturas(Number(empresaId));
  }

  @UseGuards(JwtAuthGuard)
  @Get('items')
  async searchItems(@Query('q') q: string = '', @Req() req: any) {
    const empresa_id = Number(req.user.empresaId);
    return this.salidasService.searchItems(q, empresa_id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('clientes')
  async searchClientes(@Query('q') q: string = '') {
    return this.salidasService.searchClientes(q);
  }

  @Get('inventario')
  @UseGuards(JwtAuthGuard)
  getInventario(@Query('item') item: string, @Query('empresa_id') empresa_id: string) {
    return this.salidasService.getInventario(item, Number(empresa_id));
  }

  @Get('medios-pago')
  @UseGuards(JwtAuthGuard)
  getMediosPago() {
    return this.salidasService.getMediosPago();
  }
}
