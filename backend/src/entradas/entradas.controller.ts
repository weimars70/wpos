import { Controller, Post, Body, Get, Query } from '@nestjs/common';
import { EntradasService } from './entradas.service';
import { CreateCompraDto } from './dto/create-compra.dto';

@Controller('api/entradas')
export class EntradasController {
  constructor(private readonly entradasService: EntradasService) {}

  @Post('registrar-compra')
  async registrarCompra(@Body() dto: CreateCompraDto) {
    return this.entradasService.registrarCompra(dto);
  }

  @Get('compras')
  async findCompras(
    @Query('empresa_id') empresaId: number,
    @Query('cxp') cxp: string,
    @Query('scope') scope?: string,
    @Query('cursor') cursor?: string,
    @Query('limit') limit?: string,
    @Query('proveedor') proveedor?: string,
    @Query('fecha_inicio') fechaInicio?: string,
    @Query('fecha_fin') fechaFin?: string,
  ) {
    return this.entradasService.getCompras(
      Number(empresaId),
      cxp === 'true',
      scope || 'tienda',
      cursor ? Number(cursor) : undefined,
      limit ? Number(limit) : 30,
      proveedor,
      fechaInicio,
      fechaFin,
    );
  }

  @Get('movimientos')
  async findMovimientos(@Query('empresa_id') empresaId: number) {
    return this.entradasService.getMovimientos(empresaId);
  }

  @Get('proveedores')
  async searchProveedores(@Query('q') q: string) {
    return this.entradasService.getProveedores(q || '');
  }

  @Get('item-tallas')
  async getTallasByItem(
    @Query('item') item: string,
    @Query('empresa_id') empresaId: number,
  ) {
    return this.entradasService.getTallasByItem(item, Number(empresaId));
  }

  @Get('item-colores')
  async getColoresByItemTalla(
    @Query('item') item: string,
    @Query('talla') talla: string,
    @Query('empresa_id') empresaId: number,
  ) {
    return this.entradasService.getColoresByItemTalla(
      item,
      talla,
      Number(empresaId),
    );
  }
}
