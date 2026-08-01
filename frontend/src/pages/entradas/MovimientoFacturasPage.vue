<template>
  <q-page padding class="bg-grey-2 aurora-animate">
    <div class="row items-center justify-between q-mb-md">
      <div>
        <div class="text-h5 text-primary text-weight-bold">Movimientos de Facturas</div>
        <div class="text-caption text-grey-7">Registro detallado de transacciones (salidas_movimientos)</div>
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

    <!-- Tabla de Movimientos -->
    <q-table
      :rows="rows"
      :columns="columns"
      row-key="id"
      class="rounded-borders shadow-1 bg-white"
      :loading="loading"
      :filter="filter"
      no-data-label="No se encontraron movimientos de facturas"
      :pagination="{ rowsPerPage: 15, sortBy: 'id', descending: true }"
    >
      <template v-slot:top-right>
        <q-input
          borderless
          dense
          debounce="300"
          v-model="filter"
          placeholder="Buscar factura, medio o nota..."
          style="min-width: 300px"
        >
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </template>

      <!-- Slot para Código Salida (Factura Relacionada) -->
      <template v-slot:body-cell-codigo_salida="props">
        <q-td :props="props">
          <div class="text-weight-bold text-primary">
            Ref: {{ props.row.codigo_salida || 'N/A' }}
          </div>
          <div class="text-caption text-grey-6">ID Mov: {{ props.row.id }}</div>
        </q-td>
      </template>

      <!-- Slot para Valores (Débito/Crédito) -->
      <template v-slot:body-cell-valores="props">
        <q-td :props="props">
          <div v-if="props.row.debito > 0" class="text-green text-weight-medium">
            + {{ formatCurrency(props.row.debito) }} (D)
          </div>
          <div v-if="props.row.credito > 0" class="text-red text-weight-medium">
            - {{ formatCurrency(props.row.credito) }} (C)
          </div>
        </q-td>
      </template>

      <!-- Slot para Medio de Pago -->
      <template v-slot:body-cell-medio_pago="props">
        <q-td :props="props">
          <q-chip
            outline
            dense
            color="blue-7"
            text-color="white"
            icon="payments"
            size="sm"
          >
            {{ props.row.medio_pago }}
          </q-chip>
          <div v-if="props.row.banco" class="text-caption text-grey-7">{{ props.row.banco }} ({{ props.row.cuenta }})</div>
        </q-td>
      </template>

      <!-- Slot para Nota / Detalles -->
      <template v-slot:body-cell-nota="props">
        <q-td :props="props" style="max-width: 250px; white-space: normal;">
          <div class="text-body2 text-grey-9">{{ props.row.nota }}</div>
          <div v-if="props.row.transaccion" class="text-caption text-grey-6">TX: {{ props.row.transaccion }}</div>
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
  { name: 'fecha', label: 'Fecha Trx', field: 'fecha', align: 'left', sortable: true, format: (val: string) => date.formatDate(val, 'DD/MM/YYYY') },
  { name: 'codigo_salida', label: 'Factura/Referencia', field: 'codigo_salida', align: 'left', sortable: true },
  { name: 'valores', label: 'Débito/Crédito', align: 'right', sortable: true },
  { name: 'medio_pago', label: 'Medio / Banco', field: 'medio_pago', align: 'left', sortable: true },
  { name: 'nota', label: 'Detalles / Nota', field: 'nota', align: 'left', sortable: true },
  { name: 'fecha_registro', label: 'Registro Sist.', field: 'fecha_registro', align: 'left', sortable: true, format: (val: string) => date.formatDate(val, 'DD/MM/YYYY HH:mm') },
] as any[];

onMounted(() => {
  fetchRows();
});

async function fetchRows() {
  loading.value = true;
  try {
    const empresaId = authStore.user?.empresaId;
    if (!empresaId) return;
    const { data } = await entradasApi.getMovimientos(Number(empresaId));
    rows.value = data;
  } catch (error) {
    console.error('Error fetching movimientos:', error);
    $q.notify({ type: 'negative', message: 'Error al consultar el listado de movimientos' });
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
