import { api } from 'src/boot/axios';

export interface User {
  id: string | number;
  name: string;
  email: string;
  empresaId?: number;
  empresaNombre?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserPayload {
  name: string;
  email: string;
  password: string;
  empresaIds?: number[];
}

export interface UpdateUserPayload {
  name?: string;
  email?: string;
  password?: string;
  empresaIds?: number[];
}

export interface EmpresaGrupo {
  id: number;
  nombre: string;
  codigo?: string;
  nit?: string;
  ciudad?: string;
}

export const usersApi = {
  getAll: () => api.get<User[]>('/users'),
  getOne: (id: string | number) => api.get<User>(`/users/${id}`),
  getEmpresasGrupo: () => api.get<EmpresaGrupo[]>('/users/empresas-grupo'),
  getUserEmpresas: (email: string) =>
    api.get<number[]>(`/users/user-empresas?email=${encodeURIComponent(email)}`),
  create: (payload: CreateUserPayload) => api.post<User>('/users', payload),
  update: (id: string | number, payload: UpdateUserPayload) =>
    api.put<User>(`/users/${id}`, payload),
  remove: (id: string | number) => api.delete(`/users/${id}`),
};
