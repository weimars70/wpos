import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { CreateCompraDto } from './dto/create-compra.dto';

@Injectable()
export class EntradasService {
  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}

  async registrarCompra(dto: CreateCompraDto) {
    // Normalmente estas SPs esperan el encabezado en un array de un solo elemento stringificado
    const encJson = JSON.stringify([dto.enc]);
    const detJson = JSON.stringify(dto.det);

    const result = await this.dataSource.query(
      `SELECT public.func_registra_compra($1, $2) as rpta`,
      [encJson, detJson],
    );

    return result[0];
  }

  async getProveedores(q: string) {
    return this.dataSource.query(
      `SELECT identificacion, nombres || ' ' || apellido1 || ' ' || apellido2 AS nombres, direccion
       FROM proveedores
       WHERE UPPER(identificacion) LIKE UPPER('%' || $1 || '%')
          OR UPPER(nombres) LIKE UPPER('%' || $1 || '%')
       LIMIT 20`,
      [q],
    );
  }

  async getCompras(
    empresaId: number,
    cxpOnly: boolean,
    scope: string = 'tienda',
    cursor?: number,
    limit: number = 30,
  ) {
    let whereClause = `WHERE empresa_id = $1`;
    if (scope === 'grupo') {
      whereClause = `WHERE empresa_id IN (
        SELECT id FROM public.empresas 
        WHERE grupo_empresarial = (SELECT grupo_empresarial FROM public.empresas WHERE id = $1)
      )`;
    }

    const params: any[] = [empresaId];

    if (cxpOnly) {
      whereClause += ` AND saldo > 0`;
    }

    if (cursor) {
      params.push(cursor);
      whereClause += ` AND codigo < $${params.length}`;
    }

    params.push(limit);
    const limitParamIndex = params.length;

    const query = `
      SELECT codigo, fechahora AS fecha, proveedor_ident AS ident, proveedor_nombre AS nombre, 
             subtotal, iva, total, saldo, empresa_id, n_sucursal 
      FROM public.view_compras 
      ${whereClause} 
      ORDER BY codigo DESC 
      LIMIT $${limitParamIndex}
    `;

    try {
      const items = await this.dataSource.query(query, params);
      const nextCursor = items.length > 0 ? Number(items[items.length - 1].codigo) : null;
      const hasMore = items.length === Number(limit);
      return { items, nextCursor, hasMore };
    } catch (err) {
      console.error(err);
      return { items: [], nextCursor: null, hasMore: false };
    }
  }

  async getMovimientos(empresaId: number) {
    const query = `
      SELECT id, codigo_salida, debito, credito, efectivo, cambio, fecha, empresa_id, medio_pago, cuenta, banco, transaccion, nota, fecha_registro
      FROM public.salidas_movimientos
      WHERE empresa_id = $1
      ORDER BY id DESC
      LIMIT 100
    `;
    try {
      return await this.dataSource.query(query, [empresaId]);
    } catch (err) {
      console.error(err);
      return [];
    }
  }
}
