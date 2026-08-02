<template>
  <q-page padding class="bg-grey-2">
    <div class="row items-center justify-between q-mb-md">
      <div>
        <div class="text-h5 text-negative text-weight-bold">Cuentas por Pagar (CXP)</div>
        <div class="text-caption text-grey-7">Listado de compras con saldo pendiente (Scroll Infinito por Cursor)</div>
      </div>
      <q-btn
        flat
        round
        color="negative"
        icon="refresh"
        @click="resetAndFetch"
        :loading="loading"
      >
        <q-tooltip>Refrescar datos</q-tooltip>
      </q-btn>
    </div>

    <!-- Scroll Infinito + Tabla CXP -->
    <q-infinite-scroll @load="onLoad" :offset="250" :disable="!hasMore || loading">
      <q-table
        :rows="rows"
        :columns="columns"
        row-key="codigo"
        class="rounded-borders shadow-1 bg-white"
        :loading="loading"
        :filter="filter"
        no-data-label="No hay facturas con saldo pendiente (CXP)"
        :pagination="{ rowsPerPage: 0 }"
        hide-bottom
      >
        <template v-slot:top-left>
          <div class="row items-center q-gutter-sm">
            <span class="text-caption text-grey-8 text-weight-bold">Ver:</span>
            <q-btn-toggle
              v-model="scope"
              toggle-color="negative"
              flat
              dense
              rounded
              unelevated
              :options="[
                { label: 'Esta Tienda', value: 'tienda' },
                { label: 'Todas las Tiendas del Grupo', value: 'grupo' }
              ]"
              @update:model-value="resetAndFetch"
            />
          </div>
        </template>

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

        <!-- Slot para Sucursal -->
        <template v-slot:body-cell-sucursal="props">
          <q-td :props="props">
            <q-chip dense color="red-1" text-color="red-9" icon="store">
              {{ props.row.n_sucursal || ('Tienda #' + props.row.empresa_id) }}
            </q-chip>
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

      <template v-slot:loading>
        <div class="row justify-center q-my-md">
          <q-spinner-dots color="negative" size="40px" />
        </div>
      </template>
    </q-infinite-scroll>

    <div v-if="!hasMore && rows.length > 0" class="text-center text-grey-6 q-pa-md text-caption">
      No hay más facturas con saldo pendiente para mostrar
    </div>
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
const scope = ref<'tienda' | 'grupo'>('tienda');

const nextCursor = ref<number | null>(null);
const hasMore = ref(true);

const columns = [
  { name: 'codigo', label: 'Código', field: 'codigo', align: 'left', sortable: true },
  { name: 'fecha', label: 'Fecha', field: 'fecha', align: 'left', sortable: true, format: (val: string) => date.formatDate(val, 'DD/MM/YYYY') },
  { name: 'sucursal', label: 'Tienda / Sucursal', field: 'n_sucursal', align: 'left', sortable: true },
  { name: 'proveedor', label: 'Proveedor', field: 'nombre', align: 'left', sortable: true },
  { name: 'total', label: 'Total Factura', field: 'total', align: 'right', sortable: true },
  { name: 'saldo', label: 'SALDO PENDIENTE', field: 'saldo', align: 'right', sortable: true },
] as any[];

onMounted(() => {
  resetAndFetch();
});

async function resetAndFetch() {
  rows.value = [];
  nextCursor.value = null;
  hasMore.value = true;
  loading.value = true;
  await loadNextBatch();
  loading.value = false;
}

async function loadNextBatch(done?: (stop?: boolean) => void) {
  if (!hasMore.value) {
    if (done) done(true);
    return;
  }
  const empresaId = authStore.user?.empresaId;
  if (!empresaId) {
    if (done) done(true);
    return;
  }

  try {
    const { data } = await entradasApi.getCompras(
      Number(empresaId),
      true,
      scope.value,
      nextCursor.value ?? undefined,
      30,
    );

    if (data && data.items && data.items.length > 0) {
      rows.value.push(...data.items);
      nextCursor.value = data.nextCursor;
      hasMore.value = data.hasMore;
    } else {
      hasMore.value = false;
    }

    if (done) done(!hasMore.value);
  } catch (error) {
    console.error('Error fetching CXP:', error);
    $q.notify({ type: 'negative', message: 'Error al consultar las cuentas por pagar (CXP)' });
    if (done) done(true);
  }
}

async function onLoad(index: number, done: (stop?: boolean) => void) {
  if (loading.value) {
    done();
    return;
  }
  await loadNextBatch(done);
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
