<template>
  <q-layout>
    <q-page-container>
      <q-page class="flex flex-center aurora-animate" style="min-height: 100vh">
        <div class="glass-card q-pa-xl shadow-24" style="width: 100%; max-width: 450px; border: 1px solid rgba(255,255,255,0.1)">
          <div class="text-center q-mb-xl">
            <div class="text-h3 text-weight-bold text-gradient q-mb-sm">WOPOS</div>
            <div class="text-white text-body1 text-weight-light opacity-80">
              Gestión Inteligente de Negocios
            </div>
          </div>

          <q-form @submit.prevent="handleLogin" class="q-gutter-y-lg">
            <q-input
              v-model="form.usuario"
              label="Usuario"
              dark
              label-color="blue-2"
              outlined
              dense
              class="q-input-premium"
              :rules="[(v: any) => !!v || '']"
              hide-bottom-space
              @blur="loadEmpresas"
            >
              <template #prepend><q-icon name="person" color="blue-2" /></template>
            </q-input>

            <q-select
              v-model="form.empresaId"
              :options="empresaOptions"
              label="Seleccionar Empresa"
              dark
              label-color="blue-2"
              outlined
              dense
              emit-value
              map-options
              :loading="loadingEmpresas"
              :disable="!empresaOptions.length"
              :rules="[(v: any) => !!v || '']"
              hide-bottom-space
            >
              <template #prepend><q-icon name="business" color="blue-2" /></template>
            </q-select>

            <q-input
              v-model="form.password"
              :type="showPass ? 'text' : 'password'"
              label="Contraseña"
              dark
              label-color="blue-2"
              outlined
              dense
              :rules="[(v: any) => !!v || '']"
              hide-bottom-space
            >
              <template #prepend><q-icon name="lock" color="blue-2" /></template>
              <template #append>
                <q-icon
                  :name="showPass ? 'visibility_off' : 'visibility'"
                  class="cursor-pointer text-blue-2"
                  @click="showPass = !showPass"
                />
              </template>
            </q-input>

            <transition
              appear
              enter-active-class="animated fadeIn"
              leave-active-class="animated fadeOut"
            >
              <q-banner v-if="errorMsg" class="bg-red-9 text-white rounded-borders" dense>
                <template #avatar><q-icon name="error_outline" color="white" /></template>
                {{ errorMsg }}
              </q-banner>
            </transition>

            <q-btn
              type="submit"
              label="INICIAR SESIÓN"
              color="primary"
              class="full-width q-py-md text-weight-bold"
              size="md"
              unelevated
              :loading="loading"
              style="border-radius: 12px; background: linear-gradient(45deg, #1d4ed8, #3b82f6) !important;"
            />
          </q-form>

          <div class="text-center q-mt-xl">
            <div class="text-blue-2 text-caption opacity-60">
              © 2026 Huellas Technology. Todos los derechos reservados.
            </div>
          </div>
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';

const router = useRouter();
const authStore = useAuthStore();

const empresaOptions = ref<{ label: string; value: number }[]>([]);
const loadingEmpresas = ref(false);

const form = reactive({ usuario: '', empresaId: null as number | null, password: '' });
const showPass = ref(false);
const loading = ref(false);
const errorMsg = ref('');

// Watcher para cargar empresas mientras escribe (debounce simple con setTimeout)
let timer: ReturnType<typeof setTimeout>;
watch(() => form.usuario, (val) => {
  clearTimeout(timer);
  if (val && val.length >= 2) {
    timer = setTimeout(() => {
      loadEmpresas();
    }, 500);
  } else {
    empresaOptions.value = [];
    form.empresaId = null;
  }
});

async function loadEmpresas() {
  const usuario = form.usuario?.trim();
  if (!usuario || usuario.length < 2) {
    empresaOptions.value = [];
    return;
  }
  
  loadingEmpresas.value = true;
  console.log(`[LoginPage] Solicitando empresas para: "${usuario}"...`);
  
  try {
    const empresas = await authStore.getEmpresas(usuario);
    console.log('[LoginPage] Empresas recibidas:', empresas);
    
    empresaOptions.value = empresas.map((e: { id: number; nombre: string }) => ({
      label: e.nombre,
      value: e.id,
    }));
    
    if (empresaOptions.value.length === 1) {
      form.empresaId = empresaOptions.value[0].value;
    } else if (empresaOptions.value.length === 0) {
      errorMsg.value = 'El usuario no tiene empresas asociadas o no existe.';
    } else {
      errorMsg.value = '';
    }
  } catch (err) {
    console.error('[LoginPage] Error al cargar empresas:', err);
    errorMsg.value = 'Error al conectar con el servidor.';
  } finally {
    loadingEmpresas.value = false;
  }
}

async function handleLogin() {
  console.log('[LoginPage] Botón login pulsado. Form:', { ...form });
  if (!form.empresaId) {
    errorMsg.value = 'Por favor, selecciona una empresa.';
    return;
  }
  loading.value = true;
  errorMsg.value = '';
  try {
    await authStore.login(form.usuario, form.empresaId, form.password);
    console.log('[LoginPage] Login exitoso en el store. Redirigiendo a /dashboard...');
    void router.push('/dashboard');
  } catch (err: unknown) {
    console.error('[LoginPage] Error en handleLogin:', err);
    const e = err as { response?: { data?: { message?: string } } };
    errorMsg.value = e.response?.data?.message || 'Error de conexión o credenciales.';
  } finally {
    loading.value = false;
  }
}
</script>
