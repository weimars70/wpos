<template>
  <q-page padding class="bg-grey-2">
    <div class="row items-center justify-between q-mb-md">
      <div>
        <div class="text-h5 text-negative text-weight-bold">Cuentas por Pagar (CXP)</div>
        <div class="text-caption text-grey-7">Listado de compras con saldo pendiente (view_compras)</div>
      </div>
      <q-btn
        flat
        round
        color="negative"
        icon="refresh"
        @click="fetchRows"
        :loading="loading"
      >
        <q-tooltip>Refrescar datos</q-tooltip>
      </q-btn>
    </div>

    <!-- Tabla CXP -->
    <q-table
      :rows="rows"
      :columns="columns"
      row-key="codigo"
      class="rounded-borders shadow-1 bg-white"
      :loading="loading"
      :filter="filter"
      no-data-label="No hay facturas con saldo pendiente (CXP)"
      :pagination="{ rowsPerPage: 15, sortBy: 'saldo', descending: true }"
    >
      <template v-slot:top-right>
        <q-input
          borderless
          dense
          debounce="300"
          v-model="filter"
          placeholder="Buscar proveedor o ID..."
          style="min-width: 300px"
        >
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </template>

      <!-- Slot para ID -->
      <template v-slot:body-cell-codigo="props">
        <q-td :props="props">
          <div class="text-weight-bold text-negative">
            ID: {{ props.row.codigo }}
          </div>
        </q-td>
      </template>

      <!-- Slot para Proveedor -->
      <template v-slot:body-cell-proveedor="props">
        <q-td :props="props">
          <div class="text-weight-medium">{{ props.row.nombre }}</div>
          <div class="text-caption text-grey-6">{{ props.row.ident }}</div>
        </q-td>
      </template>

      <!-- Slot para Totales -->
      <template v-slot:body-cell-total="props">
        <q-td :props="props" class="text-right">
          {{ formatCurrency(props.row.total) }}
        </q-td>
      </template>

      <!-- Slot para SALDO (Lo resaltamos más en CXP) -->
      <template v-slot:body-cell-saldo="props">
        <q-td :props="props" class="text-weight-bold text-right">
          <q-chip
            color="red-1"
            text-color="red-7"
            dense
            size="sm"
            class="text-weight-bold"
          >
            {{ formatCurrency(props.row.saldo) }}
          </q-chip>
        </q-td>
      </template>
    </q-table>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useQuasar, date } from 'quasar';
import { useAuthStore } from 'src/stores/auth';
import { entradasApi } from 'src/api/entradas';

const $q = useQuasar();
const authStore = useAuthStore();

const loading = ref(false);
const rows = ref<any[]>([]);
const filter = ref('');

const columns = [
  { name: 'codigo', label: 'Código', field: 'codigo', align: 'left', sortable: true },
  { name: 'fecha', label: 'Fecha', field: 'fecha', align: 'left', sortable: true, format: (val: string) => date.formatDate(val, 'DD/MM/YYYY') },
  { name: 'proveedor', label: 'Proveedor', field: 'nombre', align: 'left', sortable: true },
  { name: 'total', label: 'Total Factura', field: 'total', align: 'right', sortable: true },
  { name: 'saldo', label: 'SALDO PENDIENTE', field: 'saldo', align: 'right', sortable: true },
] as any[];

onMounted(() => {
  fetchRows();
});

async function fetchRows() {
  loading.value = true;
  try {
    const empresaId = authStore.user?.empresaId;
    if (!empresaId) return;
    const { data } = await entradasApi.getCompras(Number(empresaId), true);
    rows.value = data;
  } catch (error) {
    console.error('Error fetching CXP:', error);
    $q.notify({ type: 'negative', message: 'Error al consultar las cuentas por pagar (CXP)' });
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
