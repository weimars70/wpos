import { Controller, Get, Query } from '@nestjs/common';
import { InventarioService } from './inventario.service';

@Controller('inventario')
export class InventarioController {
  constructor(private readonly inventarioService: InventarioService) {}

  @Get('sedes')
  async getSedes() {
    return this.inventarioService.getSedes();
  }

  @Get('listado')
  async getListado(
    @Query('empresa_id') empresaId?: number,
    @Query('search') search?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('sort_by') sortBy?: string,
    @Query('sort_order') sortOrder?: string,
  ) {
    return this.inventarioService.getListadoInventario(
      empresaId ? Number(empresaId) : undefined,
      search,
      page ? Number(page) : 1,
      limit ? Number(limit) : 50,
      sortBy || 'item',
      sortOrder || 'ASC',
    );
  }

  @Get('general')
  async getGeneral(
    @Query('empresa_id') empresaId?: number,
    @Query('nombre') nombre?: string,
    @Query('referencia') referencia?: string,
    @Query('search') search?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('sort_by') sortBy?: string,
    @Query('sort_order') sortOrder?: string,
  ) {
    return this.inventarioService.getInventarioGeneral(
      empresaId ? Number(empresaId) : undefined,
      nombre,
      referencia,
      search,
      page ? Number(page) : 1,
      limit ? Number(limit) : 50,
      sortBy || 'item',
      sortOrder || 'ASC',
    );
  }

  @Get('sin-inventario')
  async getSinInventario(
    @Query('empresa_id') empresaId?: number,
    @Query('search') search?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('sort_by') sortBy?: string,
    @Query('sort_order') sortOrder?: string,
  ) {
    return this.inventarioService.getItemsSinInventario(
      empresaId ? Number(empresaId) : undefined,
      search,
      page ? Number(page) : 1,
      limit ? Number(limit) : 50,
      sortBy || 'item',
      sortOrder || 'ASC',
    );
  }

  @Get('ajustes')
  async getAjustes(
    @Query('empresa_id') empresaId?: number,
    @Query('search') search?: string,
    @Query('fecha_inicio') fechaInicio?: string,
    @Query('fecha_fin') fechaFin?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('sort_by') sortBy?: string,
    @Query('sort_order') sortOrder?: string,
  ) {
    return this.inventarioService.getAjustesInventario(
      empresaId ? Number(empresaId) : undefined,
      search,
      fechaInicio,
      fechaFin,
      page ? Number(page) : 1,
      limit ? Number(limit) : 50,
      sortBy || 'id',
      sortOrder || 'DESC',
    );
  }
}
