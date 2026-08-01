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

  async getCompras(empresaId: number, cxpOnly: boolean) {
    let query = `SELECT codigo, fechahora AS fecha, proveedor_ident AS ident, proveedor_nombre AS nombre, subtotal, iva, total, saldo, empresa_id FROM public.view_compras WHERE empresa_id = $1`;
    const params = [empresaId];

    if (cxpOnly) {
      query += ` AND saldo > 0`;
    }

    query += ` ORDER BY codigo DESC LIMIT 100`;

    try {
      const result = await this.dataSource.query(query, params);
      return result;
    } catch (err) {
      console.error(err);
      return [];
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
