import { api } from 'src/boot/axios';

export interface EncCompraPayload {
  ident: string;
  empresa_id: number;
  nombre: string;
  direccion?: string;
  forma_pago: number;
  plazo: number;
  tipo: number;
  total: number;
  subtotal: number;
  iva: number;
  descuento: number;
  vendedor: string;
  observaciones?: string;
}

export interface DetRowCompra {
  item: string;
  nombre: string;
  talla: string;
  color: number;
  cantidad: number;
  pcompra: number;
  pdesc: number;
  por_iva: number;
  subtotal: number;
  pfinaliva?: number;
}

export interface CreateCompraPayload {
  enc: EncCompraPayload;
  det: DetRowCompra[];
}

export interface ProveedorResult {
  identificacion: string;
  nombres: string;
  direccion: string;
}

export const entradasApi = {
  registrarCompra: (payload: CreateCompraPayload) =>
    api.post<{ rpta: string | number }>('/api/entradas/registrar-compra', payload),

  getCompras: (
    empresaId: number,
    cxp: boolean,
    scope: string = 'tienda',
    cursor?: number,
    limit: number = 30,
    proveedor?: string,
    fechaInicio?: string,
    fechaFin?: string,
  ) =>
    api.get<{ items: any[]; nextCursor: number | null; hasMore: boolean }>('/api/entradas/compras', {
      params: {
        empresa_id: empresaId,
        cxp: cxp.toString(),
        scope,
        cursor,
        limit,
        proveedor: proveedor || undefined,
        fecha_inicio: fechaInicio || undefined,
        fecha_fin: fechaFin || undefined,
      },
    }),

  getMovimientos: (empresaId: number) =>
    api.get<any[]>('/api/entradas/movimientos', { params: { empresa_id: empresaId } }),

  getProveedores: (q: string) =>
    api.get<ProveedorResult[]>('/api/entradas/proveedores', { params: { q } }),

  getTallasByItem: (item: string, empresaId: number) =>
    api.get<{ talla: string }[]>('/api/entradas/item-tallas', {
      params: { item, empresa_id: empresaId },
    }),

  getColoresByItemTalla: (item: string, talla: string, empresaId: number) =>
    api.get<{ cod_color: number; color: string }[]>('/api/entradas/item-colores', {
      params: { item, talla, empresa_id: empresaId },
    }),
};
