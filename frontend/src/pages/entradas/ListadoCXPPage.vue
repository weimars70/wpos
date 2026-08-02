<template>
  <q-page class="q-pa-md column no-wrap overflow-hidden bg-grey-2" style="min-height: unset !important; height: calc(100vh - 95px); max-height: calc(100vh - 95px);">
    <div class="col-auto row items-center justify-between q-mb-md">
      <div class="row items-center q-gutter-sm">
        <div>
          <div class="row items-center q-gutter-sm">
            <div class="text-h5 text-primary text-weight-bold">Cuentas por pagar: 
              <q-chip color="primary" text-color="white" class="text-weight q-px-sm q-chip-compras" icon="request_quote">
              {{ rows.length }} Facturas
            </q-chip>
            </div>
           
          </div>
          <div class="text-caption text-grey-7">Listado de compras con saldo pendiente (Scroll Infinito por Cursor)</div>
        </div>
      </div>
      <q-btn        
        round
        color="primary"
        icon="refresh"
        @click="resetAndFetch"
        :loading="loading"
      >
        <q-tooltip>Refrescar datos</q-tooltip>
      </q-btn>
    </div>

    <!-- Card de Filtros Avanzados -->
    <q-card flat class="col-auto rounded-borders q-mb-md bg-white shadow-1">
      <q-card-section class="q-py-sm">
        <div class="row items-center q-col-gutter-md">
          <div class="col-12 col-sm-2 col-md-2">
            <q-input
              v-model="proveedorFilter"
              dense
              outlined
              clearable
              placeholder="Proveedor o NIT"
              label="Buscar por Proveedor"
              debounce="400"
              @update:model-value="resetAndFetch"
            >
              <template v-slot:prepend>
                <q-icon name="person_search" />
              </template>
            </q-input>
          </div>
          <div class="col-12 col-sm-2 col-md-2">
            <q-input
              v-model="fechaInicio"
              type="date"
              dense
              outlined
              label="Fecha Desde"
              stack-label
              @change="resetAndFetch"
            />
          </div>
          <div class="col-12 col-sm-2 col-md-2">
            <q-input
              v-model="fechaFin"
              type="date"
              dense
              outlined
              label="Fecha Hasta"
              stack-label
              @change="resetAndFetch"
            />
          </div>
          <div class="col-12 col-sm-2 col-md-2 row items-center q-gutter-xs">
            <q-btn outline icon="search" label="Buscar" dense @click="resetAndFetch" class="btn-buscar"/>
            <q-btn outline icon="clear" dense @click="clearFilters" class="btn-clear-filter">
              <q-tooltip>Limpiar Filtros</q-tooltip>
            </q-btn>
          </div>
          <div class="col-12 col-sm-4 col-md-4 row items-center q-gutter-xs">           
            <q-btn-toggle
              v-model="scope"
              color="white"
              toggle-color="white"
              text-color="black"
              toggle-text-color="black" 
              :options="[
                { label: 'Esta Tienda', value: 'tienda' },
                { label: 'Todas las Tiendas del Grupo', value: 'grupo' }
              ]"
              @update:model-value="resetAndFetch"
            />
          </div>
        </div>
      </q-card-section>
    </q-card>

    <!-- Scroll Infinito + Tabla CXP -->
    <q-infinite-scroll @load="onLoad" :offset="250" :disable="!hasMore || loading" class="col column no-wrap overflow-hidden">
      <q-table
        :rows="rows"
        :columns="columns"
        row-key="codigo"
        class="col rounded-borders header-tablet border-table border-row full-height-table"
        :loading="loading"
        :filter="filter"
        no-data-label="No hay facturas con saldo pendiente (CXP)"
        :pagination="{ rowsPerPage: 0 }"
        hide-bottom
      >       
        
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

        <!-- Slot para Cant. Unidades -->
        <template v-slot:body-cell-total_unidades="props">
          <q-td :props="props" class="text-right text-weight-medium">
            <q-chip dense color="grey-2" text-color="grey-9">
              {{ props.row.total_unidades || 0 }}
            </q-chip>
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

const proveedorFilter = ref('');
const fechaInicio = ref('');
const fechaFin = ref('');

const nextCursor = ref<number | null>(null);
const hasMore = ref(true);

const columns = [
  { name: 'codigo', label: 'Código', field: 'codigo', align: 'left', sortable: true },
  { name: 'fecha', label: 'Fecha', field: 'fecha', align: 'left', sortable: true, format: (val: string) => date.formatDate(val, 'DD/MM/YYYY') },
  { name: 'sucursal', label: 'Tienda / Sucursal', field: 'n_sucursal', align: 'left', sortable: true },
  { name: 'proveedor', label: 'Proveedor', field: 'nombre', align: 'left', sortable: true },
  { name: 'total_unidades', label: 'Cant. Unidades', field: 'total_unidades', align: 'right', sortable: true },
  { name: 'total', label: 'Total Factura', field: 'total', align: 'right', sortable: true },
  { name: 'saldo', label: 'SALDO PENDIENTE', field: 'saldo', align: 'right', sortable: true },
] as any[];

onMounted(() => {
  resetAndFetch();
});

function clearFilters() {
  proveedorFilter.value = '';
  fechaInicio.value = '';
  fechaFin.value = '';
  filter.value = '';
  resetAndFetch();
}

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
      proveedorFilter.value || undefined,
      fechaInicio.value || undefined,
      fechaFin.value || undefined,
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

.border-table{
    background:white; 
    border: 1px blueviolet solid;   
    color: black;
}

.border-row :deep(thead tr), .border-row :deep(td) {
  border-bottom: 1px blue solid;  
}

.header-tablet :deep(thead th) {
  background-color: #adc2ad;
  color: black;
  font-weight: bold;
  position: sticky;
  top: 0;
  z-index: 1;
}

.btn-buscar{
  width: 8vw;
  height: 42px;
  border-radius: 5px;
}

.q-chip-compras{
  height: 30px;
}

.btn-clear-filter{
  width: 3vw;
  height: 42px;
}

.full-height-table {
  display: flex;
  flex-direction: column;
  height: 100%;
  max-height: 100%;
  overflow: hidden;
}

.full-height-table :deep(.q-table__container) {
  display: flex;
  flex-direction: column;
  height: 100%;
  max-height: 100%;
}

.full-height-table :deep(.q-table__middle) {
  flex: 1 1 auto;
  max-height: calc(100vh - 235px);
  overflow-y: auto;
}
</style>
