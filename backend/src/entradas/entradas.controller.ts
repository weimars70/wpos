import { Controller, Post, Body, Get, Query } from '@nestjs/common';
import { EntradasService } from './entradas.service';
import { CreateCompraDto } from './dto/create-compra.dto';

@Controller('entradas')
export class EntradasController {
  constructor(private readonly entradasService: EntradasService) {}

  @Post('registrar-compra')
  async registrarCompra(@Body() dto: CreateCompraDto) {
    return this.entradasService.registrarCompra(dto);
  }

  @Get('compras')
  async findCompras(@Query('empresa_id') empresaId: number, @Query('cxp') cxp: string) {
    return this.entradasService.getCompras(empresaId, cxp === 'true');
  }

  @Get('movimientos')
  async findMovimientos(@Query('empresa_id') empresaId: number) {
    return this.entradasService.getMovimientos(empresaId);
  }

  @Get('proveedores')
  async searchProveedores(@Query('q') q: string) {
    return this.entradasService.getProveedores(q || '');
  }
}
