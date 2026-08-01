import { api } from 'src/boot/axios';

export interface ColorResult {
  codigo: number;
  descripcion: string;
}

export const coloresApi = {
  getAll: () => api.get<ColorResult[]>('/api/colores'),
};
