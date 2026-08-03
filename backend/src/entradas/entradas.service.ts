import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { CreateCompraDto } from './dto/create-compra.dto';

@Injectable()
export class EntradasService implements OnModuleInit {
  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}

  async onModuleInit() {
    await this.ensureFuncRegistraCompra();
  }

  private async ensureFuncRegistraCompra() {
    try {
      const sql = `
        CREATE OR REPLACE FUNCTION public.func_registra_compra(i_enc json, i_det json)
        RETURNS text
        LANGUAGE plpgsql
        AS $function$
        DECLARE
          V_RA RECORD;
          V_ENC JSON;
          V_CODIGO INTEGER;
          V_FECHA DATE;
          V_EMPRESA_ID INTEGER;
        BEGIN
          FOR V_RA IN SELECT * FROM json_array_elements(i_enc)
          LOOP
            V_ENC := V_RA.value;
          END LOOP;

          V_EMPRESA_ID := COALESCE((V_ENC->>'empresa_id')::INTEGER, (V_ENC->>'sucursal')::INTEGER, 1);

          UPDATE public.secuencias 
          SET valor = valor + 1 
          WHERE nombre = 'compras' AND (empresa_id = V_EMPRESA_ID OR empresa_id IS NULL)
          RETURNING valor INTO V_CODIGO;

          IF V_CODIGO IS NULL THEN
            UPDATE public.secuencias 
            SET valor = valor + 1 
            WHERE nombre = 'compras'
            RETURNING valor INTO V_CODIGO;
          END IF;

          IF V_CODIGO IS NULL THEN
            V_CODIGO := 1;
          END IF;

          BEGIN
            IF (V_ENC->>'fecha') LIKE '%/%' THEN
              V_FECHA := (split_part((V_ENC->>'fecha')::text,'/',3) 
                 ||'-'||split_part((V_ENC->>'fecha')::text,'/',1)||'-'
                 ||split_part((V_ENC->>'fecha')::text,'/',2))::DATE;
            ELSE
              V_FECHA := COALESCE((V_ENC->>'fecha')::DATE, CURRENT_DATE);
            END IF;
          EXCEPTION WHEN OTHERS THEN
            V_FECHA := CURRENT_DATE;
          END;

          INSERT INTO public.compras(
            codigo, proveedor_ident, proveedor_nombre, forma_pago, plazo, factura,
            factura_fecha, subtotal, descuento, iva, total, empresa_id, total_unidades, usuario, saldo
          )
          VALUES (
            V_CODIGO,
            V_ENC->>'ident',
            V_ENC->>'nombre',
            COALESCE((V_ENC->>'forma_pago')::INTEGER, 1),
            COALESCE((V_ENC->>'plazo')::INTEGER, 0),
            COALESCE(V_ENC->>'factura', '0'),
            V_FECHA,
            COALESCE((V_ENC->>'subtotal')::NUMERIC, 0),
            COALESCE((V_ENC->>'descuento')::NUMERIC, 0),
            COALESCE((V_ENC->>'iva')::NUMERIC, 0),
            COALESCE((V_ENC->>'total')::NUMERIC, 0),
            V_EMPRESA_ID,
            COALESCE((V_ENC->>'cantidad_total')::INTEGER, 0),
            COALESCE(V_ENC->>'vendedor', 'SISTEMA'),
            COALESCE((V_ENC->>'total')::NUMERIC, 0)
          );

          FOR V_RA IN SELECT * FROM json_array_elements(i_det)
          LOOP
            IF (V_RA.value->>'color') IS NULL OR (V_RA.value->>'color') = '' THEN
              RAISE EXCEPTION 'NO SELECCIONO COLOR ITEM %', (V_RA.value->>'item')::TEXT;
            END IF;

            INSERT INTO public.compras_detalle (
              codigo, item, item_descripcion, color, talla, por_iva, pcompra, pventa, por_descuento,
              pcfinal, pc_iva, unidades, subtotal, empresa_id
            )
            VALUES (
              V_CODIGO,
              (V_RA.value->>'item')::TEXT,
              (V_RA.value->>'nombre')::TEXT,
              COALESCE((V_RA.value->>'color')::INTEGER, 0),
              COALESCE((V_RA.value->>'talla'), '0'),
              COALESCE((V_RA.value->>'por_iva')::NUMERIC, 0),
              COALESCE((V_RA.value->>'pcompra')::NUMERIC, 0),
              COALESCE((V_RA.value->>'pventa')::NUMERIC, 0),
              COALESCE((V_RA.value->>'pdesc')::NUMERIC, 0),
              COALESCE((V_RA.value->>'pcfinal')::NUMERIC, (V_RA.value->>'pcompra')::NUMERIC, 0),
              COALESCE((V_RA.value->>'pc_iva')::NUMERIC, (V_RA.value->>'pcfinaliva')::NUMERIC, 0),
              COALESCE((V_RA.value->>'cantidad')::NUMERIC, 0),
              COALESCE((V_RA.value->>'subtotal')::NUMERIC, 0),
              V_EMPRESA_ID
            );
          END LOOP;

          INSERT INTO public.compras_movimientos (codigo, factura, debito, credito, empresa_id, fecha)
          VALUES (
            V_CODIGO,
            COALESCE(V_ENC->>'factura', '0'),
            COALESCE((V_ENC->>'total')::NUMERIC, 0),
            0,
            V_EMPRESA_ID,
            V_FECHA
          );

          IF COALESCE((V_ENC->>'valor_abono')::NUMERIC, 0) > 0 THEN
            INSERT INTO public.compras_movimientos (codigo, factura, debito, credito, empresa_id, forma_pago, fecha)
            VALUES (
              V_CODIGO,
              COALESCE(V_ENC->>'factura', '0'),
              0,
              (V_ENC->>'valor_abono')::NUMERIC,
              V_EMPRESA_ID,
              1,
              V_FECHA
            );
          END IF;

          RETURN 'COMPRA :' || V_CODIGO;
        END;
        $function$;

        CREATE OR REPLACE FUNCTION public.func_registra_compra(i_enc json, i_det text)
        RETURNS text
        LANGUAGE plpgsql
        AS $function$
        BEGIN
          RETURN public.func_registra_compra(i_enc, i_det::json);
        EXCEPTION WHEN OTHERS THEN
          RETURN public.func_registra_compra(i_enc, replace(i_det, '\\', '')::json);
        END;
        $function$;
      `;
      await this.dataSource.query(sql);
      console.log('Successfully ensured func_registra_compra in PostgreSQL');
    } catch (err) {
      console.error('Error ensuring func_registra_compra:', err);
    }
  }

  async registrarCompra(dto: CreateCompraDto) {
    const encJson = JSON.stringify([dto.enc]);
    const detJson = JSON.stringify(dto.det);

    const result = await this.dataSource.query(
      `SELECT public.func_registra_compra($1::json, $2::json) as rpta`,
      [encJson, detJson],
    );

    return result[0];
  }

  async getProveedores(q: string) {
    if (!q || q.trim().length < 3) {
      return [];
    }
    const search = `%${q.trim()}%`;
    return this.dataSource.query(
      `SELECT COALESCE(ident, codigo::text) AS identificacion, nombre AS nombres, direccion
       FROM proveedores
       WHERE UPPER(COALESCE(ident, codigo::text)) LIKE UPPER($1)
          OR UPPER(nombre) LIKE UPPER($1)
          OR UPPER(COALESCE(nombre_comercial, '')) LIKE UPPER($1)
       ORDER BY nombre
       LIMIT 30`,
      [search],
    );
  }

  async getCompras(
    empresaId: number,
    cxpOnly: boolean,
    scope: string = 'tienda',
    cursor?: number,
    limit: number = 30,
    proveedor?: string,
    fechaInicio?: string,
    fechaFin?: string,
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

    if (proveedor && proveedor.trim() !== '') {
      params.push(`%${proveedor.trim()}%`);
      whereClause += ` AND (UPPER(proveedor_nombre) LIKE UPPER($${params.length}) OR UPPER(proveedor_ident) LIKE UPPER($${params.length}))`;
    }

    if (fechaInicio && fechaInicio.trim() !== '') {
      params.push(`${fechaInicio.trim()} 00:00:00`);
      whereClause += ` AND fechahora >= $${params.length}::timestamp`;
    }

    if (fechaFin && fechaFin.trim() !== '') {
      params.push(`${fechaFin.trim()} 23:59:59`);
      whereClause += ` AND fechahora <= $${params.length}::timestamp`;
    }

    if (cursor) {
      params.push(cursor);
      whereClause += ` AND codigo < $${params.length}`;
    }

    params.push(limit);
    const limitParamIndex = params.length;

    const query = `
      SELECT codigo, fechahora AS fecha, proveedor_ident AS ident, proveedor_nombre AS nombre, 
             subtotal, iva, total, saldo, empresa_id, n_sucursal, total_unidades 
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

  async getTallasByItem(item: string, empresaId: number) {
    const query = `
      SELECT DISTINCT talla
      FROM public.view_inventario
      WHERE empresa_id = $1 AND item::text = $2 AND talla IS NOT NULL AND TRIM(talla) <> ''
      ORDER BY talla
    `;
    try {
      return await this.dataSource.query(query, [empresaId, item]);
    } catch (err) {
      console.error(err);
      return [];
    }
  }

  async getColoresByItemTalla(item: string, talla: string, empresaId: number) {
    const query = `
      SELECT DISTINCT cod_color, color
      FROM public.view_inventario
      WHERE empresa_id = $1 AND item::text = $2 AND talla = $3 AND cod_color IS NOT NULL
      ORDER BY color
    `;
    try {
      return await this.dataSource.query(query, [empresaId, item, talla]);
    } catch (err) {
      console.error(err);
      return [];
    }
  }
}
