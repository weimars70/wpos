import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import axios from 'axios';

export interface AuthUser {
  id: number;
  empresaId: number;
  roleId: number;
  name: string;
}

const getApiUrl = () => {
  if (typeof window !== 'undefined') {
    // Si estamos en el navegador, usamos el hostname actual pero puerto 3000
    return `http://${window.location.hostname}:3000`;
  }
  return 'http://localhost:3000';
};

const API_URL = getApiUrl();

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(localStorage.getItem('token'));
  const user = ref<AuthUser | null>(
    JSON.parse(localStorage.getItem('user') || 'null'),
  );

  const isLoggedIn = computed(() => !!token.value);

  async function login(usuario: string, empresaId: number, password: string) {
    console.log(`[AuthStore] Intentando login para ${usuario} en empresa ${empresaId}...`);
    try {
      const { data } = await axios.post<{ access_token: string }>(
        `${API_URL}/auth/login`,
        { usuario, empresaId, password },
      );
      console.log('[AuthStore] Login exitoso, recibiendo token.');
      token.value = data.access_token;

      // Decode payload from JWT (base64 middle part)
      const payload = JSON.parse(atob(data.access_token.split('.')[1]));
      const authUser: AuthUser = {
        id: payload.sub,
        empresaId: payload.empresaId,
        roleId: payload.roleId,
        name: payload.name,
      };
      user.value = authUser;
      localStorage.setItem('token', data.access_token);
      localStorage.setItem('user', JSON.stringify(authUser));
    } catch (error) {
      console.error('[AuthStore] Error en login:', error);
      throw error;
    }
  }

  async function getEmpresas(usuario: string) {
    console.log(`[AuthStore] GET ${API_URL}/auth/empresas/${usuario}`);
    try {
      const { data } = await axios.get(`${API_URL}/auth/empresas/${usuario}`);
      return data as { id: number; nombre: string }[];
    } catch (error) {
      console.error('[AuthStore] Error en getEmpresas:', error);
      throw error;
    }
  }

  async function validateCredentials(usuario: string, password: string) {
    console.log(`[AuthStore] Validando credenciales para ${usuario}...`);
    try {
      const { data } = await axios.post<{ id: number; nombre: string }[]>(
        `${API_URL}/auth/validate`,
        { usuario, password },
      );
      return data;
    } catch (error) {
      console.error('[AuthStore] Error en validateCredentials:', error);
      throw error;
    }
  }

  function logout() {
    token.value = null;
    user.value = null;
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  return { token, user, isLoggedIn, login, getEmpresas, validateCredentials, logout };
});
