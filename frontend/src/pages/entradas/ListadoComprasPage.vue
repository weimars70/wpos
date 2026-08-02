<template>
  <q-page padding class="bg-grey-2 aurora-animate">
    <div class="row items-center justify-between q-mb-md">
      <div>
        <div class="text-h5 text-primary text-weight-bold">Control de Compras (Entradas)</div>
        <div class="text-caption text-grey-7">Listado histórico (Scroll Infinito por Cursor)</div>
      </div>
      <q-btn
        flat
        round
        color="primary"
        icon="refresh"
        @click="resetAndFetch"
        :loading="loading"
      >
        <q-tooltip>Refrescar datos</q-tooltip>
      </q-btn>
    </div>

    <!-- Scroll Infinito + Tabla de Compras -->
    <q-infinite-scroll @load="onLoad" :offset="250" :disable="!hasMore || loading">
      <q-table
        :rows="rows"
        :columns="columns"
        row-key="codigo"
        class="rounded-borders  header-tablet border-tablet border-row scroll-tablet"
        :loading="loading"
        :filter="filter"
        no-data-label="No se encontraron registros de compras"
        :pagination="{ rowsPerPage: 0 }"  
        virtual-scroll      
       >
        <template v-slot:top-left>
          <div class="row items-center q-gutter-sm">
            <span class="text-caption text-grey-8 text-weight-bold">Ver:</span>
            <q-btn-toggle
              v-model="scope"
              toggle-color="primary"
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

        <!-- Slot para ID / Código -->
        <template v-slot:body-cell-codigo="props">
          <q-td :props="props">
            <div class="text-weight-bold text-primary">
              ID: {{ props.row.codigo }}
            </div>
          </q-td>
        </template>

        <!-- Slot para Sucursal -->
        <template v-slot:body-cell-sucursal="props">
          <q-td :props="props">
            <q-chip dense color="blue-1" text-color="blue-9" icon="store">
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
    </q-infinite-scroll>   
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
  { name: 'total', label: 'Total', field: 'total', align: 'right', sortable: true },
  { name: 'saldo', label: 'Saldo Pendiente', field: 'saldo', align: 'right', sortable: true },
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
      false,
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
    console.error('Error fetching compras:', error);
    $q.notify({ type: 'negative', message: 'Error al consultar el listado de compras' });
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

.scroll-tablet :deep(.q-table__middle) {
  max-height:59vh;
  overflow-y: auto;
}

.border-tablet{
    background:white; 
    border: 1px blueviolet solid;   
    color: black;
}

.border-row :deep(thead tr), .border-row :deep(td) {
  border-bottom: 1px blue solid;  
}

.header-tablet :deep(thead th) {
  background-color:#adc2ad;
  color:black;
  font: bold;
}

.scroll-tablet :deep(.q-table__middle) {
  overflow-y: auto;
}

@media (max-width: 1365px) {
  .scroll-tablet :deep(.q-table__middle) {
    max-height: 50vh;
  }
}

@media (min-width: 1366px) and (max-width: 1920px) {
  .scroll-tablet :deep(.q-table__middle) {
    max-height: 55vh;
  }
}
</style>
