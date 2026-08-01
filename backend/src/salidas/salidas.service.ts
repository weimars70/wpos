import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { CreateFacturaDto } from './dto/create-factura.dto';

@Injectable()
export class SalidasService {
  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}

  async registrarSalida(dto: CreateFacturaDto) {
    // SP usa json_array_elements(i_enc), por eso el enc va envuelto en array
    const encJson = JSON.stringify([dto.enc]);
    const detJson = JSON.stringify(dto.det);
    const otrosJson = JSON.stringify(dto.detotrospagos || []);

    const result = await this.dataSource.query(
      `SELECT public.func_registra_salida($1, $2, $3) as rpta`,
      [encJson, detJson, otrosJson],
    );

    return result[0];
  }

  async getFacturas(empresaId: number) {
    try {
      const result = await this.dataSource.query(
        `SELECT codigo, fecha, ident, nombre, direccion, prefijo, factura,
                subtotal, descuento, iva, total, usuario, observaciones,
                vendedor, estado, tipo, forma_pago, plazo, saldo, anulado,
                empresa_id, empresa
         FROM public.view_salidas
         WHERE empresa_id = $1
         LIMIT 100`,
        [empresaId],
      );
      return result;
    } catch {
      return [];
    }
  }


  async searchItems(q: string, empresa_id: number) {
    return this.dataSource.query(
      `SELECT DISTINCT ON (item) item, nombre AS descripcion, por_iva, precio_compra AS ult_pcompra, precio_venta AS ult_pventa
       FROM public.view_inventario
       WHERE empresa_id = $1
         AND (UPPER(item::text) LIKE UPPER('%' || $2 || '%')
              OR UPPER(nombre) LIKE UPPER('%' || $2 || '%'))
       ORDER BY item
       LIMIT 20`,
      [empresa_id, q],
    );
  }

  async searchClientes(q: string) {
    return this.dataSource.query(
      `SELECT identificacion,
              nombres || ' ' || apellido1 || ' ' || apellido2 AS nombres,
              direccion,
              tipoident
       FROM clientes
       WHERE UPPER(identificacion) LIKE UPPER('%' || $1 || '%')
          OR UPPER(nombres) LIKE UPPER('%' || $1 || '%')
       LIMIT 20`,
      [q],
    );
  }

  async getInventario(item: string, empresa_id: number) {
    return this.dataSource.query(
      `SELECT item, nombre, unidades, talla, cod_color, color, precio_compra, precio_venta, empresa, empresa_id, por_iva
       FROM public.view_inventario
       WHERE empresa_id = $1 AND item = $2`,
      [empresa_id, item],
    );
  }

  async getMediosPago() {
    return this.dataSource.query(
      `SELECT codigo, descripcion FROM medios_pago WHERE facturas IS NOT FALSE ORDER BY codigo`,
    );
  }
}
