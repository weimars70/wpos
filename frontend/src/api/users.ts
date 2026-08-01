import { api } from 'src/boot/axios';

export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserPayload { name: string; email: string; password: string }
export interface UpdateUserPayload { name?: string; email?: string; password?: string }

export const usersApi = {
  getAll: () => api.get<User[]>('/users'),
  getOne: (id: string) => api.get<User>(`/users/${id}`),
  create: (payload: CreateUserPayload) => api.post<User>('/users', payload),
  update: (id: string, payload: UpdateUserPayload) => api.put<User>(`/users/${id}`, payload),
  remove: (id: string) => api.delete(`/users/${id}`),
};
