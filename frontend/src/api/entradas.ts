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
    api.post<{ rpta: string | number }>('/entradas/registrar-compra', payload),

  getCompras: (empresaId: number, cxp: boolean) =>
    api.get<any[]>('/entradas/compras', { params: { empresa_id: empresaId, cxp: cxp.toString() } }),

  getMovimientos: (empresaId: number) =>
    api.get<any[]>('/entradas/movimientos', { params: { empresa_id: empresaId } }),

  getProveedores: (q: string) =>
    api.get<ProveedorResult[]>('/entradas/proveedores', { params: { q } }),
};
