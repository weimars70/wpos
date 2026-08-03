import { api } from 'src/boot/axios';

export interface EncPayload {
  ident: string;
  empresa_id: number;
  nombre: string;
  direccion: string;
  forma_pago: number;
  plazo: number;
  tipo: number;
  total: number;
  subtotal: number;
  iva: number;
  descuento: number;
  vendedor: string;
  efectivo?: number;
  cambio?: number;
}

export interface DetRow {
  item: string;
  nombre: string;
  talla: string;
  color: number;
  cantidad: number;
  pventa: number;
  pdesc: number;
  pvfinal: number;
  pvfinaliva: number;
  por_iva: number;
  subtotal: number;
}

export interface MedioPago {
  codigo: number;
  descripcion: string;
}

export interface CreateFacturaPayload {
  enc: EncPayload;
  det: { rows: DetRow[] };
  detotrospagos?: any[];
}

export interface ClienteResult {
  identificacion: string;
  nombres: string;
  direccion: string;
  tipoident: string;
}

export const salidasApi = {
  registrarFactura: (payload: CreateFacturaPayload) =>
    api.post<{ rpta: string | number }>('/api/salidas/facturas', payload),

  getFacturas: (empresaId: number) =>
    api.get('/api/salidas/facturas', { params: { empresaId } }),

  getItems: (q: string) =>
    api.get<any[]>('/api/salidas/items', { params: { q } }),

  getClientes: (q: string) =>
    api.get<ClienteResult[]>('/api/salidas/clientes', { params: { q } }),

  getInventario: (item: string, empresa_id: number) =>
    api.get<any[]>('/api/salidas/inventario', { params: { item, empresa_id } }),

  getMediosPago: () =>
    api.get<MedioPago[]>('/api/salidas/medios-pago'),
};
