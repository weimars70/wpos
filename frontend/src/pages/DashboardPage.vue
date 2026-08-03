<template>
  <q-page class="q-pa-xl bg-grey-2">
    <div class="row items-center q-mb-xl">
      <div class="col flex items-center">
        <img src="/logo.png" style="max-height: 55px; max-width: 140px; object-fit: contain;" class="q-mr-md" alt="WPOS Logo" />
        <div>
          <div class="text-h4 text-weight-bold text-grey-9 q-mb-xs">Panel de Control</div>
          <div class="text-subtitle1 text-grey-6">
            Bienvenido de nuevo, <span class="text-primary text-weight-bold">{{ authStore.user?.name || 'Admin' }}</span>
          </div>
        </div>
      </div>
      <div class="col-auto">
        <q-btn flat round icon="refresh" color="grey-7" @click="fetchStats" :loading="loading" />
      </div>
    </div>

    <div class="row q-col-gutter-xl">
      <!-- Usuarios Totales -->
      <div class="col-12 col-sm-6 col-md-4">
        <q-card class="bg-primary text-white shadow-10" style="border-radius: 20px; overflow: hidden">
          <q-card-section class="q-pa-lg">
            <div class="row items-center no-wrap">
              <div class="col">
                <div class="text-overline opacity-60">USUARIOS TOTALES</div>
                <div class="text-h3 text-weight-bold">
                  <q-skeleton v-if="loading" type="text" class="bg-white-2" />
                  <span v-else>{{ stats.totalUsers }}</span>
                </div>
              </div>
              <div class="col-auto">
                <div class="q-pa-md bg-white-2 rounded-borders">
                  <q-icon name="group" size="48px" />
                </div>
              </div>
            </div>
            <div class="q-mt-md flex items-center">
              <q-icon name="info" size="xs" class="q-mr-xs opacity-60" />
              <div class="text-caption opacity-60">Usuarios activos en el sistema</div>
            </div>
          </q-card-section>
          <q-separator dark />
          <q-card-actions align="right" class="q-px-lg q-py-sm">
            <q-btn flat no-caps label="Gestionar Usuarios" to="/users" icon-right="chevron_right" />
          </q-card-actions>
        </q-card>
      </div>

      <!-- Facturación Hoy -->
      <div class="col-12 col-sm-6 col-md-4">
        <q-card flat bordered class="bg-white shadow-2" style="border-radius: 20px">
          <q-card-section class="q-pa-lg">
            <div class="row items-center no-wrap">
              <div class="col">
                <div class="text-overline text-grey-6">FACTURACIÓN HOY</div>
                <div class="text-h3 text-weight-bold text-grey-9">
                  <q-skeleton v-if="loading" type="text" />
                  <span v-else>${{ stats.todayBilling.toLocaleString() }}</span>
                </div>
              </div>
              <div class="col-auto">
                <div class="q-pa-md bg-blue-1 text-primary rounded-borders">
                  <q-icon name="payments" size="48px" />
                </div>
              </div>
            </div>
            <div class="q-mt-md flex items-center text-green">
              <q-icon name="check_circle" size="xs" class="q-mr-xs" />
              <div class="text-caption text-weight-bold">
                {{ stats.todayInvoices }} Facturas procesadas
              </div>
            </div>
          </q-card-section>
          <q-separator />
          <q-card-actions align="right" class="q-px-lg q-py-sm">
            <q-btn flat no-caps color="primary" label="Ir al facturador" to="/salidas/facturas" icon-right="receipt" />
          </q-card-actions>
        </q-card>
      </div>

      <!-- Info Sesión (Limpiada) -->
      <div class="col-12 col-md-4">
        <q-card flat bordered class="bg-white shadow-2" style="border-radius: 20px">
          <q-card-section class="q-pa-lg">
            <div class="text-overline text-grey-6">INFO DE SESIÓN</div>
            <div class="row items-center justify-between q-mt-md">
              <div>
                <div class="text-weight-bold text-grey-9">{{ authStore.user?.name || 'Administrador' }}</div>
                <div class="text-caption text-grey-6">ID Empresa: {{ authStore.user?.empresaId }}</div>
              </div>
              <img src="/logo.png" style="max-height: 40px; max-width: 80px; object-fit: contain;" alt="WPOS Logo" />
            </div>
            <div class="q-mt-xl">
              <div class="text-caption text-grey-5 q-mb-xs">Estado de conexión</div>
              <div class="text-weight-medium text-green flex items-center">
                <q-badge rounded color="green" class="q-mr-sm" /> En línea
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useAuthStore } from '../stores/auth';
import { api } from 'src/boot/axios';

const authStore = useAuthStore();
const loading = ref(true);
const stats = ref({
  totalUsers: 0,
  todayBilling: 0,
  todayInvoices: 0
});

const fetchStats = async () => {
  try {
    loading.value = true;
    const empresaId = authStore.user?.empresaId;
    if (empresaId) {
      const { data } = await api.get('/dashboard/summary', {
        params: { empresaId }
      });
      stats.value = data;
    }
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchStats();
});
</script>

<style lang="scss" scoped>
.bg-white-2 {
  background: rgba(255, 255, 255, 0.2);
}
</style>
