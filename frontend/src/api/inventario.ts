import { api } from 'src/boot/axios';

export interface InventarioItem {
  item: string;
  nombre?: string;
  unidades?: number | string;
  talla?: string;
  cod_color?: number;
  color?: string;
  precio_compra?: number | string;
  precio_venta?: number | string;
  empresa?: string;
  empresa_id?: number;
  por_iva?: number | string;
  imagen?: string;
  [key: string]: any;
}

export interface AjusteInventarioItem {
  id: number;
  fecha: string;
  item: string;
  nombre?: string;
  talla?: string;
  color?: number;
  n_color?: string;
  empresa_id?: number;
  usuario?: string;
  unidades_antes?: number | string;
  unidades_despues?: number | string;
  [key: string]: any;
}

export interface InventarioStats {
  totalRegistros: number;
  totalUnidades: number;
  valorTotalCompra: number;
  valorTotalVenta: number;
}

export interface AjustesStats {
  totalRegistros: number;
  totalIncrementos: number;
  totalDecrementos: number;
}

export interface SedeItem {
  id: number;
  nombre: string;
}

export interface ListadoInventarioResponse {
  data: InventarioItem[];
  total: number;
  page: number;
  limit: number;
  stats: InventarioStats;
}

export interface ListadoAjustesResponse {
  data: AjusteInventarioItem[];
  total: number;
  page: number;
  limit: number;
  stats: AjustesStats;
}

export interface GetInventarioParams {
  empresa_id?: number;
  search?: string;
  page?: number;
  limit?: number;
  sort_by?: string;
  sort_order?: string;
}

export interface GetInventarioGeneralParams {
  empresa_id?: number;
  nombre?: string;
  referencia?: string;
  search?: string;
  page?: number;
  limit?: number;
  sort_by?: string;
  sort_order?: string;
}

export interface GetAjustesParams {
  empresa_id?: number;
  search?: string;
  fecha_inicio?: string;
  fecha_fin?: string;
  page?: number;
  limit?: number;
  sort_by?: string;
  sort_order?: string;
}

export const inventarioApi = {
  getSedes: () =>
    api.get<SedeItem[]>('/inventario/sedes'),

  getListado: (params?: GetInventarioParams) =>
    api.get<ListadoInventarioResponse>('/inventario/listado', { params }),

  getGeneral: (params?: GetInventarioGeneralParams) =>
    api.get<ListadoInventarioResponse>('/inventario/general', { params }),

  getSinInventario: (params?: GetInventarioParams) =>
    api.get<ListadoInventarioResponse>('/inventario/sin-inventario', { params }),

  getAjustes: (params?: GetAjustesParams) =>
    api.get<ListadoAjustesResponse>('/inventario/ajustes', { params }),
};
