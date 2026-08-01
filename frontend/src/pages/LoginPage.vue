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

          <!-- PASO 1: Validación de Usuario y Contraseña -->
          <q-form v-if="step === 1" @submit.prevent="handleValidateStep1" class="q-gutter-y-lg">
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
            >
              <template #prepend><q-icon name="person" color="blue-2" /></template>
            </q-input>

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
              label="CONTINUAR"
              color="primary"
              class="full-width q-py-md text-weight-bold"
              size="md"
              unelevated
              :loading="loading"
              style="border-radius: 12px; background: linear-gradient(45deg, #1d4ed8, #3b82f6) !important;"
            />
          </q-form>

          <!-- PASO 2: Selección de Empresa -->
          <q-form v-else @submit.prevent="handleLoginStep2" class="q-gutter-y-lg">
            <div class="text-white text-subtitle2 text-center q-mb-sm opacity-90">
              Bienvenido, <strong class="text-blue-2">{{ form.usuario }}</strong>.<br />
              Selecciona la empresa para ingresar:
            </div>

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
              :rules="[(v: any) => !!v || '']"
              hide-bottom-space
            >
              <template #prepend><q-icon name="business" color="blue-2" /></template>
            </q-select>

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

            <div class="row q-col-gutter-sm">
              <div class="col-4">
                <q-btn
                  label="Volver"
                  flat
                  color="blue-2"
                  class="full-width q-py-md text-weight-bold"
                  size="md"
                  @click="resetStep1"
                  style="border-radius: 12px;"
                />
              </div>
              <div class="col-8">
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
              </div>
            </div>
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
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';

const router = useRouter();
const authStore = useAuthStore();

const step = ref<1 | 2>(1);
const empresaOptions = ref<{ label: string; value: number }[]>([]);

const form = reactive({ usuario: '', password: '', empresaId: null as number | null });
const showPass = ref(false);
const loading = ref(false);
const errorMsg = ref('');

async function handleValidateStep1() {
  const usuario = form.usuario?.trim();
  const password = form.password;

  if (!usuario || !password) {
    errorMsg.value = 'Por favor, ingresa tu usuario y contraseña.';
    return;
  }

  loading.value = true;
  errorMsg.value = '';

  try {
    const empresas = await authStore.validateCredentials(usuario, password);
    console.log('[LoginPage] Credenciales válidas. Empresas recibidas:', empresas);

    if (!empresas || empresas.length === 0) {
      errorMsg.value = 'Usuario o contraseña incorrectos.';
      return;
    }

    empresaOptions.value = empresas.map((e: { id: number; nombre: string }) => ({
      label: e.nombre,
      value: e.id,
    }));

    form.empresaId = empresaOptions.value[0].value;
    step.value = 2;
  } catch (err: any) {
    console.error('[LoginPage] Error en handleValidateStep1:', err);
    errorMsg.value = err.response?.data?.message || 'Usuario o contraseña incorrectos.';
  } finally {
    loading.value = false;
  }
}

async function handleLoginStep2() {
  if (!form.empresaId) {
    errorMsg.value = 'Por favor, selecciona una empresa.';
    return;
  }
  await executeLogin(form.empresaId);
}

async function executeLogin(empresaId: number) {
  loading.value = true;
  errorMsg.value = '';
  try {
    await authStore.login(form.usuario, empresaId, form.password);
    console.log('[LoginPage] Login exitoso. Redirigiendo a /dashboard...');
    void router.push('/dashboard');
  } catch (err: any) {
    console.error('[LoginPage] Error en executeLogin:', err);
    errorMsg.value = err.response?.data?.message || 'Error de conexión o autenticación.';
  } finally {
    loading.value = false;
  }
}

function resetStep1() {
  step.value = 1;
  errorMsg.value = '';
}
</script>
