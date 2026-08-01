import { api } from 'src/boot/axios';

export interface LoginPayload { email: string; password: string }
export interface RegisterPayload { name: string; email: string; password: string }

export const authApi = {
  login: (payload: LoginPayload) =>
    api.post<{ access_token: string; user: any }>('/auth/login', payload),
  register: (payload: RegisterPayload) =>
    api.post('/auth/register', payload),
};
