<template>
  <q-page padding class="bg-grey-2 aurora-animate">
    <div class="row items-center justify-between q-mb-md">
      <div>
        <div class="text-h5 text-primary text-weight-bold">Control de Compras (Entradas)</div>
        <div class="text-caption text-grey-7">Listado histórico basado en view_compras</div>
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

    <!-- Tabla de Compras -->
    <q-table
      :rows="rows"
      :columns="columns"
      row-key="codigo"
      class="rounded-borders shadow-1 bg-white"
      :loading="loading"
      :filter="filter"
      no-data-label="No se encontraron registros de compras"
      :pagination="{ rowsPerPage: 15, sortBy: 'codigo', descending: true }"
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

      <!-- Slot para ID / Código -->
      <template v-slot:body-cell-codigo="props">
        <q-td :props="props">
          <div class="text-weight-bold text-primary">
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
        <q-td :props="props" class="text-weight-bold text-right">
          {{ formatCurrency(props.row.total) }}
        </q-td>
      </template>

      <!-- Slot para Saldo -->
      <template v-slot:body-cell-saldo="props">
        <q-td :props="props" class="text-right">
          <q-chip
            :color="props.row.saldo > 0 ? 'orange-1' : 'green-1'"
            :text-color="props.row.saldo > 0 ? 'orange-8' : 'green-8'"
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
  { name: 'total', label: 'Total', field: 'total', align: 'right', sortable: true },
  { name: 'saldo', label: 'Saldo Pendiente', field: 'saldo', align: 'right', sortable: true },
] as any[];

onMounted(() => {
  fetchRows();
});

async function fetchRows() {
  loading.value = true;
  try {
    const empresaId = authStore.user?.empresaId;
    if (!empresaId) return;
    const { data } = await entradasApi.getCompras(Number(empresaId), false);
    rows.value = data;
  } catch (error) {
    console.error('Error fetching compras:', error);
    $q.notify({ type: 'negative', message: 'Error al consultar el listado de compras' });
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
