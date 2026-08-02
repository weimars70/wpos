import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class InventarioService {
  constructor(private readonly dataSource: DataSource) {}

  /**
   * Listado de Sedes / Empresas presentes en el inventario
   */
  async getSedes() {
    try {
      const sql = `
        SELECT DISTINCT empresa_id AS id, empresa AS nombre
        FROM public.view_inventario
        WHERE empresa IS NOT NULL AND TRIM(empresa) <> ''
        ORDER BY empresa ASC
      `;
      return await this.dataSource.query(sql);
    } catch (error) {
      console.error('Error fetching sedes from view_inventario:', error);
      return [];
    }
  }

  /**
   * Listado de Inventario filtrado (por defecto empresa actual si se pasa empresa_id)
   */
  async getListadoInventario(
    empresaId?: number,
    search?: string,
    page: number = 1,
    limit: number = 50,
    sortBy: string = 'item',
    sortOrder: string = 'ASC',
  ) {
    return this.queryInventarioView({
      viewName: 'public.view_inventario',
      empresaId,
      search,
      page,
      limit,
      sortBy,
      sortOrder,
    });
  }

  /**
   * Inventario General (sin filtrar por empresa_id de inicio, filtrado por nombre, referencia y/o sede)
   */
  async getInventarioGeneral(
    empresaId?: number,
    nombre?: string,
    referencia?: string,
    search?: string,
    page: number = 1,
    limit: number = 50,
    sortBy: string = 'item',
    sortOrder: string = 'ASC',
  ) {
    return this.queryInventarioView({
      viewName: 'public.view_inventario',
      empresaId,
      nombre,
      referencia,
      search,
      page,
      limit,
      sortBy,
      sortOrder,
    });
  }

  /**
   * Listado de Items sin inventario / existencias <= 0 (public.view_items_sin_inventario)
   */
  async getItemsSinInventario(
    empresaId?: number,
    search?: string,
    page: number = 1,
    limit: number = 50,
    sortBy: string = 'item',
    sortOrder: string = 'ASC',
  ) {
    return this.queryInventarioView({
      viewName: 'public.view_items_sin_inventario',
      empresaId,
      search,
      page,
      limit,
      sortBy,
      sortOrder,
    });
  }

  /**
   * Listado de Ajustes de Inventario (public.view_ajustes_inventario)
   */
  async getAjustesInventario(
    empresaId?: number,
    search?: string,
    fechaInicio?: string,
    fechaFin?: string,
    page: number = 1,
    limit: number = 50,
    sortBy: string = 'id',
    sortOrder: string = 'DESC',
  ) {
    try {
      let whereClause = 'WHERE 1=1';
      const params: any[] = [];
      let paramIndex = 1;

      if (empresaId && Number(empresaId) > 0) {
        whereClause += ` AND empresa_id = $${paramIndex}`;
        params.push(Number(empresaId));
        paramIndex++;
      }

      if (search && search.trim() !== '') {
        const term = `%${search.trim()}%`;
        whereClause += ` AND (
          UPPER(item::text) LIKE UPPER($${paramIndex}) OR
          UPPER(nombre::text) LIKE UPPER($${paramIndex}) OR
          UPPER(talla::text) LIKE UPPER($${paramIndex}) OR
          UPPER(n_color::text) LIKE UPPER($${paramIndex}) OR
          UPPER(usuario::text) LIKE UPPER($${paramIndex})
        )`;
        params.push(term);
        paramIndex++;
      }

      if (fechaInicio && fechaInicio.trim() !== '') {
        whereClause += ` AND fecha >= $${paramIndex}::timestamp`;
        params.push(`${fechaInicio.trim()} 00:00:00`);
        paramIndex++;
      }

      if (fechaFin && fechaFin.trim() !== '') {
        whereClause += ` AND fecha <= $${paramIndex}::timestamp`;
        params.push(`${fechaFin.trim()} 23:59:59`);
        paramIndex++;
      }

      const allowedSortCols = [
        'id',
        'fecha',
        'item',
        'nombre',
        'talla',
        'n_color',
        'usuario',
        'unidades_antes',
        'unidades_despues',
        'empresa_id',
      ];
      const sanitizedSortBy = allowedSortCols.includes(sortBy) ? sortBy : 'id';
      const sanitizedOrder = sortOrder.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

      // Query total rows
      const countSql = `SELECT COUNT(*) AS total FROM public.view_ajustes_inventario ${whereClause}`;
      const countRes = await this.dataSource.query(countSql, params);
      const total = parseInt(countRes[0]?.total || '0', 10);

      // Query page data
      const offset = Math.max(0, (page - 1) * limit);
      const dataSql = `
        SELECT *
        FROM public.view_ajustes_inventario
        ${whereClause}
        ORDER BY ${sanitizedSortBy} ${sanitizedOrder}, id DESC
        LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
      `;
      const dataParams = [...params, limit, offset];
      const data = await this.dataSource.query(dataSql, dataParams);

      // Query stats
      const statsSql = `
        SELECT
          COUNT(*) as total_registros,
          COALESCE(SUM(CASE WHEN unidades_despues > unidades_antes THEN (unidades_despues - unidades_antes) ELSE 0 END), 0) as total_incrementos,
          COALESCE(SUM(CASE WHEN unidades_despues < unidades_antes THEN (unidades_antes - unidades_despues) ELSE 0 END), 0) as total_decrementos
        FROM public.view_ajustes_inventario
        ${whereClause}
      `;
      const statsRes = await this.dataSource.query(statsSql, params);
      const stats = statsRes[0] || {};

      return {
        data,
        total,
        page: Number(page),
        limit: Number(limit),
        stats: {
          totalRegistros: Number(stats.total_registros || 0),
          totalIncrementos: Number(stats.total_incrementos || 0),
          totalDecrementos: Number(stats.total_decrementos || 0),
        },
      };
    } catch (error) {
      console.error('Error querying public.view_ajustes_inventario:', error);
      throw error;
    }
  }

  private async queryInventarioView(options: {
    viewName: string;
    empresaId?: number;
    nombre?: string;
    referencia?: string;
    search?: string;
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: string;
  }) {
    const {
      viewName,
      empresaId,
      nombre,
      referencia,
      search,
      page = 1,
      limit = 50,
      sortBy = 'item',
      sortOrder = 'ASC',
    } = options;

    try {
      let whereClause = 'WHERE 1=1';
      const params: any[] = [];
      let paramIndex = 1;

      if (empresaId && Number(empresaId) > 0) {
        whereClause += ` AND empresa_id = $${paramIndex}`;
        params.push(Number(empresaId));
        paramIndex++;
      }

      if (referencia && referencia.trim() !== '') {
        whereClause += ` AND UPPER(item::text) LIKE UPPER($${paramIndex})`;
        params.push(`%${referencia.trim()}%`);
        paramIndex++;
      }

      if (nombre && nombre.trim() !== '') {
        whereClause += ` AND UPPER(nombre::text) LIKE UPPER($${paramIndex})`;
        params.push(`%${nombre.trim()}%`);
        paramIndex++;
      }

      if (search && search.trim() !== '') {
        const term = `%${search.trim()}%`;
        whereClause += ` AND (
          UPPER(item::text) LIKE UPPER($${paramIndex}) OR
          UPPER(nombre::text) LIKE UPPER($${paramIndex}) OR
          UPPER(talla::text) LIKE UPPER($${paramIndex}) OR
          UPPER(color::text) LIKE UPPER($${paramIndex}) OR
          UPPER(empresa::text) LIKE UPPER($${paramIndex})
        )`;
        params.push(term);
        paramIndex++;
      }

      // Validating sort column
      const allowedSortCols = [
        'item',
        'nombre',
        'unidades',
        'talla',
        'color',
        'precio_compra',
        'precio_venta',
        'empresa',
        'por_iva',
      ];
      const sanitizedSortBy = allowedSortCols.includes(sortBy) ? sortBy : 'item';
      const sanitizedOrder = sortOrder.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';

      // Query total rows
      const countSql = `SELECT COUNT(*) AS total FROM ${viewName} ${whereClause}`;
      const countRes = await this.dataSource.query(countSql, params);
      const total = parseInt(countRes[0]?.total || '0', 10);

      // Query page data
      const offset = Math.max(0, (page - 1) * limit);
      const dataSql = `
        SELECT *
        FROM ${viewName}
        ${whereClause}
        ORDER BY ${sanitizedSortBy} ${sanitizedOrder}, item ASC, talla ASC
        LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
      `;
      const dataParams = [...params, limit, offset];
      const data = await this.dataSource.query(dataSql, dataParams);

      // Query totals/stats
      const statsSql = `
        SELECT
          COUNT(*) as total_registros,
          COALESCE(SUM(unidades), 0) as total_unidades,
          COALESCE(SUM(unidades * precio_compra), 0) as valor_total_compra,
          COALESCE(SUM(unidades * precio_venta), 0) as valor_total_venta
        FROM ${viewName}
        ${whereClause}
      `;
      const statsRes = await this.dataSource.query(statsSql, params);
      const stats = statsRes[0] || {};

      return {
        data,
        total,
        page: Number(page),
        limit: Number(limit),
        stats: {
          totalRegistros: Number(stats.total_registros || 0),
          totalUnidades: Number(stats.total_unidades || 0),
          valorTotalCompra: Number(stats.valor_total_compra || 0),
          valorTotalVenta: Number(stats.valor_total_venta || 0),
        },
      };
    } catch (error) {
      console.error(`Error querying ${viewName}:`, error);
      throw error;
    }
  }
}
