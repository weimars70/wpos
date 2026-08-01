<template>
  <q-page padding class="bg-grey-2">
    <div class="row items-center justify-between q-mb-md">
      <div>
        <div class="text-h5 text-primary text-weight-bold">Control de Salidas</div>
        <div class="text-caption text-grey-7">Listado histórico basado en view_salidas</div>
      </div>
      <q-btn
        flat
        round
        color="primary"
        icon="refresh"
        @click="fetchRows"
        :loading="loading"
      >
        <q-tooltip>Refrescar datos</q-tooltip>
      </q-btn>
    </div>

    <!-- Tabla Detallada -->
    <q-table
      :rows="rows"
      :columns="columns"
      row-key="codigo"
      class="rounded-borders shadow-1 bg-white"
      :loading="loading"
      :filter="filter"
      no-data-label="No se encontraron registros de salidas"
      :pagination="{ rowsPerPage: 15, sortBy: 'codigo', descending: true }"
    >
      <template v-slot:top-right>
        <q-input
          borderless
          dense
          debounce="300"
          v-model="filter"
          placeholder="Buscar prefijo, factura o cliente..."
          style="min-width: 300px"
        >
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </template>

      <!-- Slot para No. Factura -->
      <template v-slot:body-cell-factura="props">
        <q-td :props="props">
          <div class="text-weight-bold text-primary">
            {{ props.row.prefijo }} {{ props.row.factura }}
          </div>
          <div class="text-caption text-grey-6">ID: {{ props.row.codigo }}</div>
        </q-td>
      </template>

      <!-- Slot para Cliente -->
      <template v-slot:body-cell-cliente="props">
        <q-td :props="props">
          <div class="text-weight-medium">{{ props.row.nombre }}</div>
          <div class="text-caption text-grey-6">{{ props.row.ident }}</div>
        </q-td>
      </template>

      <!-- Slot para Estado/Anulado -->
      <template v-slot:body-cell-estado="props">
        <q-td :props="props" class="text-center">
          <q-chip
            :color="props.row.anulado === 'SI' ? 'red-1' : 'green-1'"
            :text-color="props.row.anulado === 'SI' ? 'red' : 'green'"
            dense
            size="sm"
            class="text-weight-bold"
          >
            {{ props.row.anulado === 'SI' ? 'ANULADA' : props.row.estado || 'ACTIVA' }}
          </q-chip>
        </q-td>
      </template>

      <!-- Slot para Totales -->
      <template v-slot:body-cell-total="props">
        <q-td :props="props" class="text-weight-bold text-right">
          {{ formatCurrency(props.row.total) }}
        </q-td>
      </template>
    </q-table>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useQuasar, date } from 'quasar';
import { useAuthStore } from 'src/stores/auth';
import { salidasApi } from 'src/api/salidas';

const $q = useQuasar();
const authStore = useAuthStore();

const loading = ref(false);
const rows = ref<any[]>([]);
const filter = ref('');

const columns = [
  { name: 'factura', label: 'Factura', field: row => `${row.prefijo}${row.factura}`, align: 'left', sortable: true },
  { name: 'fecha', label: 'Fecha', field: 'fecha', align: 'left', sortable: true, format: (val: string) => date.formatDate(val, 'DD/MM/YYYY') },
  { name: 'cliente', label: 'Cliente', field: 'nombre', align: 'left', sortable: true },
  { name: 'forma_pago', label: 'Pago', field: 'forma_pago', align: 'left', sortable: true },
  { name: 'total', label: 'Total', field: 'total', align: 'right', sortable: true },
  { name: 'estado', label: 'Estado', field: 'estado', align: 'center', sortable: true },
  { name: 'vendedor', label: 'Vendedor', field: 'vendedor', align: 'left', sortable: true },
] as any[];

onMounted(() => {
  fetchRows();
});

async function fetchRows() {
  loading.value = true;
  try {
    const empresaId = authStore.user?.empresaId;
    if (!empresaId) return;
    const response = await salidasApi.getFacturas(Number(empresaId));
    rows.value = response.data;
  } catch (error) {
    console.error('Error fetching billing view:', error);
    $q.notify({ type: 'negative', message: 'Error al consultar la vista de facturación' });
  } finally {
    loading.value = false;
  }
}

function formatCurrency(val: number) {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0
  }).format(val || 0);
}
</script>

<style scoped>
.rounded-borders {
  border-radius: 12px;
}
</style>
