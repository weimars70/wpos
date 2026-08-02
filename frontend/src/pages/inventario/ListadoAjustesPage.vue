<template>
  <q-page class="q-pa-md column no-wrap overflow-hidden bg-grey-2" style="min-height: unset !important; height: calc(100vh - 95px); max-height: calc(100vh - 95px);">
    
    <!-- Top Header -->
    <div class="col-auto row items-center justify-between q-mb-md">
      <div class="row items-center q-gutter-sm">
        <div>
          <div class="row items-center q-gutter-sm">
            <div class="text-h5 text-primary text-weight-bold">Listado de Ajustes</div>
            <q-chip color="primary" text-color="white" dense class="text-weight-bold q-px-sm" icon="tune">
              {{ pagination.rowsNumber }} Registros
            </q-chip>
          </div>
          <div class="text-caption text-grey-7">Historial de modificaciones de existencias (public.view_ajustes_inventario)</div>
        </div>
      </div>

      <div class="row items-center q-gutter-xs">
        <q-btn
          color="positive"
          icon="file_download"
          label="Exportar CSV"
          unelevated
          dense
          class="q-px-sm"
          @click="exportCSV"
          :disable="loading || rows.length === 0"
        >
          <q-tooltip>Descargar listado de ajustes en CSV</q-tooltip>
        </q-btn>
        <q-btn
          flat
          round
          color="primary"
          icon="refresh"
          @click="fetchData"
          :loading="loading"
        >
          <q-tooltip>Refrescar datos</q-tooltip>
        </q-btn>
      </div>
    </div>

    <!-- Cards de Métricas / Resumen -->
    <div class="col-auto row q-col-gutter-md q-mb-md">
      <div class="col-12 col-sm-6 col-md-4">
        <q-card flat class="rounded-borders bg-white shadow-1 border-left-primary">
          <q-card-section class="q-pa-sm row items-center justify-between">
            <div>
              <div class="text-caption text-grey-6 text-weight-medium">TOTAL AJUSTES</div>
              <div class="text-h6 text-weight-bolder text-grey-9">
                {{ formatNumber(stats.totalRegistros) }}
              </div>
            </div>
            <q-avatar color="blue-1" text-color="primary" icon="history" size="40px" />
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-sm-6 col-md-4">
        <q-card flat class="rounded-borders bg-white shadow-1 border-left-positive">
          <q-card-section class="q-pa-sm row items-center justify-between">
            <div>
              <div class="text-caption text-grey-6 text-weight-medium">TOTAL INCREMENTOS (+ UNIDS)</div>
              <div class="text-h6 text-weight-bolder text-positive">
                +{{ formatNumber(stats.totalIncrementos) }}
              </div>
            </div>
            <q-avatar color="green-1" text-color="positive" icon="trending_up" size="40px" />
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-sm-6 col-md-4">
        <q-card flat class="rounded-borders bg-white shadow-1 border-left-negative">
          <q-card-section class="q-pa-sm row items-center justify-between">
            <div>
              <div class="text-caption text-grey-6 text-weight-medium">TOTAL DECREMENTOS (- UNIDS)</div>
              <div class="text-h6 text-weight-bolder text-negative">
                -{{ formatNumber(stats.totalDecrementos) }}
              </div>
            </div>
            <q-avatar color="red-1" text-color="negative" icon="trending_down" size="40px" />
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- Card de Filtros Avanzados -->
    <q-card flat class="col-auto rounded-borders q-mb-md bg-white shadow-1">
      <q-card-section class="q-py-sm">
        <div class="row items-center q-col-gutter-md">
          <!-- Buscador principal -->
          <div class="col-12 col-sm-4 col-md-4">
            <q-input
              v-model="searchTerm"
              dense
              outlined
              clearable
              placeholder="Ítem, Nombre, Talla, Color o Usuario..."
              label="Buscar en ajustes"
              debounce="350"
              @update:model-value="onFilterChange"
            >
              <template v-slot:prepend>
                <q-icon name="search" />
              </template>
            </q-input>
          </div>

          <!-- Rango de Fechas -->
          <div class="col-12 col-sm-3 col-md-2">
            <q-input
              v-model="fechaInicio"
              type="date"
              dense
              outlined
              label="Fecha Desde"
              stack-label
              @change="onFilterChange"
            />
          </div>

          <div class="col-12 col-sm-3 col-md-2">
            <q-input
              v-model="fechaFin"
              type="date"
              dense
              outlined
              label="Fecha Hasta"
              stack-label
              @change="onFilterChange"
            />
          </div>

          <!-- Filtro Empresa Scope -->
          <div class="col-12 col-sm-4 col-md-3">
            <q-select
              v-model="empresaScope"
              dense
              outlined
              emit-value
              map-options
              label="Empresa / Sede"
              :options="[
                { label: 'Mi Empresa', value: 'actual' },
                { label: 'Todas las Empresas', value: 'todas' }
              ]"
              @update:model-value="onFilterChange"
            >
              <template v-slot:prepend>
                <q-icon name="store" />
              </template>
            </q-select>
          </div>

          <!-- Botón Limpiar -->
          <div class="col-12 col-sm-2 col-md-1 text-right">
            <q-btn flat round color="grey-7" icon="clear_all" dense @click="clearFilters">
              <q-tooltip>Limpiar Filtros</q-tooltip>
            </q-btn>
          </div>
        </div>
      </q-card-section>
    </q-card>

    <!-- Tabla Principal de Ajustes con Paginación Servidor -->
    <q-card flat class="col column no-wrap overflow-hidden rounded-borders bg-white shadow-1">
      <q-table
        :rows="rows"
        :columns="columns"
        row-key="id"
        class="col header-tablet border-table border-row full-height-table"
        :loading="loading"
        no-data-label="No se encontraron ajustes de inventario"
        v-model:pagination="pagination"
        @request="onRequest"
        binary-state-sort
        flat
      >
        <!-- Cell: ID -->
        <template v-slot:body-cell-id="props">
          <q-td :props="props">
            <span class="text-caption font-mono text-grey-8">#{{ props.row.id }}</span>
          </q-td>
        </template>

        <!-- Cell: Fecha -->
        <template v-slot:body-cell-fecha="props">
          <q-td :props="props">
            <div class="text-caption text-grey-9 font-mono">{{ formatDate(props.row.fecha) }}</div>
          </q-td>
        </template>

        <!-- Cell: Item Code -->
        <template v-slot:body-cell-item="props">
          <q-td :props="props">
            <q-chip dense color="indigo-1" text-color="indigo-9" class="text-weight-bold font-mono">
              {{ props.row.item }}
            </q-chip>
          </q-td>
        </template>

        <!-- Cell: Nombre -->
        <template v-slot:body-cell-nombre="props">
          <q-td :props="props">
            <div class="text-weight-medium text-grey-9">{{ props.row.nombre || '-' }}</div>
          </q-td>
        </template>

        <!-- Cell: Talla -->
        <template v-slot:body-cell-talla="props">
          <q-td :props="props" align="center">
            <q-chip v-if="props.row.talla" dense outline color="purple-7" class="text-weight-bold">
              {{ props.row.talla }}
            </q-chip>
            <span v-else class="text-grey-5">-</span>
          </q-td>
        </template>

        <!-- Cell: Color -->
        <template v-slot:body-cell-n_color="props">
          <q-td :props="props" align="center">
            <q-chip v-if="props.row.n_color" dense color="teal-1" text-color="teal-9" icon="palette" class="text-weight-medium">
              {{ props.row.n_color }}
            </q-chip>
            <span v-else class="text-grey-5">-</span>
          </q-td>
        </template>

        <!-- Cell: Unidades Antes -->
        <template v-slot:body-cell-unidades_antes="props">
          <q-td :props="props" align="right">
            <span class="text-grey-7 font-mono">{{ formatNumber(props.row.unidades_antes) }}</span>
          </q-td>
        </template>

        <!-- Cell: Unidades Después -->
        <template v-slot:body-cell-unidades_despues="props">
          <q-td :props="props" align="right">
            <span class="text-weight-bold text-grey-9 font-mono">{{ formatNumber(props.row.unidades_despues) }}</span>
          </q-td>
        </template>

        <!-- Cell: Diferencia -->
        <template v-slot:body-cell-diferencia="props">
          <q-td :props="props" align="center">
            <q-chip
              dense
              :color="getDiferenciaColor(props.row)"
              text-color="white"
              class="text-weight-bold font-mono"
            >
              {{ getDiferenciaFormatted(props.row) }}
            </q-chip>
          </q-td>
        </template>

        <!-- Cell: Usuario -->
        <template v-slot:body-cell-usuario="props">
          <q-td :props="props">
            <q-chip dense color="blue-grey-1" text-color="blue-grey-9" icon="account_circle" class="text-caption">
              {{ props.row.usuario || '-' }}
            </q-chip>
          </q-td>
        </template>

      </q-table>
    </q-card>

  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useQuasar, date } from 'quasar';
import { useAuthStore } from 'src/stores/auth';
import { inventarioApi, AjusteInventarioItem, AjustesStats } from 'src/api/inventario';

const $q = useQuasar();
const authStore = useAuthStore();

// Reactive State
const loading = ref(false);
const rows = ref<AjusteInventarioItem[]>([]);
const searchTerm = ref('');
const fechaInicio = ref('');
const fechaFin = ref('');
const empresaScope = ref<'actual' | 'todas'>('actual');

const stats = ref<AjustesStats>({
  totalRegistros: 0,
  totalIncrementos: 0,
  totalDecrementos: 0,
});

const pagination = ref({
  sortBy: 'id',
  descending: true,
  page: 1,
  rowsPerPage: 50,
  rowsNumber: 0,
});

// Table Columns definition
const columns = [
  { name: 'id', label: 'ID', field: 'id', align: 'left' as const, sortable: true },
  { name: 'fecha', label: 'Fecha / Hora', field: 'fecha', align: 'left' as const, sortable: true },
  { name: 'item', label: 'Ítem (Código)', field: 'item', align: 'left' as const, sortable: true },
  { name: 'nombre', label: 'Descripción / Nombre', field: 'nombre', align: 'left' as const, sortable: true },
  { name: 'talla', label: 'Talla', field: 'talla', align: 'center' as const, sortable: true },
  { name: 'n_color', label: 'Color', field: 'n_color', align: 'center' as const, sortable: true },
  { name: 'unidades_antes', label: 'Stock Antes', field: 'unidades_antes', align: 'right' as const, sortable: true },
  { name: 'unidades_despues', label: 'Stock Después', field: 'unidades_despues', align: 'right' as const, sortable: true },
  { name: 'diferencia', label: 'Ajuste / Dif', field: (row: AjusteInventarioItem) => Number(row.unidades_despues || 0) - Number(row.unidades_antes || 0), align: 'center' as const, sortable: false },
  { name: 'usuario', label: 'Usuario', field: 'usuario', align: 'left' as const, sortable: true },
];

// Helper Formatter Functions
function formatDate(val: string | undefined): string {
  if (!val) return '-';
  return date.formatDate(val, 'DD/MM/YYYY HH:mm');
}

function formatNumber(value: number | string | undefined): string {
  const num = Number(value) || 0;
  return new Intl.NumberFormat('es-CO', {
    maximumFractionDigits: 2,
  }).format(num);
}

function getDiferencia(row: AjusteInventarioItem): number {
  const antes = Number(row.unidades_antes) || 0;
  const despues = Number(row.unidades_despues) || 0;
  return despues - antes;
}

function getDiferenciaFormatted(row: AjusteInventarioItem): string {
  const diff = getDiferencia(row);
  if (diff > 0) return `+${formatNumber(diff)}`;
  return formatNumber(diff);
}

function getDiferenciaColor(row: AjusteInventarioItem): string {
  const diff = getDiferencia(row);
  if (diff > 0) return 'positive';
  if (diff < 0) return 'negative';
  return 'grey-6';
}

// Data Fetching logic
async function fetchData() {
  loading.value = true;
  try {
    const empresaId = empresaScope.value === 'actual' ? authStore.user?.empresaId || 1 : undefined;

    const res = await inventarioApi.getAjustes({
      empresa_id: empresaId,
      search: searchTerm.value || undefined,
      fecha_inicio: fechaInicio.value || undefined,
      fecha_fin: fechaFin.value || undefined,
      page: pagination.value.page,
      limit: pagination.value.rowsPerPage,
      sort_by: pagination.value.sortBy,
      sort_order: pagination.value.descending ? 'DESC' : 'ASC',
    });

    rows.value = res.data.data;
    pagination.value.rowsNumber = res.data.total;
    if (res.data.stats) {
      stats.value = res.data.stats;
    }
  } catch (error) {
    console.error('Error cargando listado de ajustes:', error);
    $q.notify({
      type: 'negative',
      message: 'Error al cargar el listado de ajustes de inventario',
      position: 'top',
    });
  } finally {
    loading.value = false;
  }
}

function onRequest(props: any) {
  const { page, rowsPerPage, sortBy, descending } = props.pagination;
  pagination.value.page = page;
  pagination.value.rowsPerPage = rowsPerPage;
  pagination.value.sortBy = sortBy;
  pagination.value.descending = descending;
  fetchData();
}

function onFilterChange() {
  pagination.value.page = 1;
  fetchData();
}

function clearFilters() {
  searchTerm.value = '';
  fechaInicio.value = '';
  fechaFin.value = '';
  empresaScope.value = 'actual';
  pagination.value.page = 1;
  fetchData();
}

// CSV Export function
function exportCSV() {
  if (rows.value.length === 0) return;

  const headers = ['ID', 'Fecha', 'Item', 'Nombre', 'Talla', 'Color', 'Unidades Antes', 'Unidades Despues', 'Diferencia', 'Usuario'];
  const csvRows = [headers.join(',')];

  rows.value.forEach((row) => {
    const diff = getDiferencia(row);
    const line = [
      row.id,
      `"${formatDate(row.fecha)}"`,
      `"${(row.item || '').replace(/"/g, '""')}"`,
      `"${(row.nombre || '').replace(/"/g, '""')}"`,
      `"${(row.talla || '').replace(/"/g, '""')}"`,
      `"${(row.n_color || '').replace(/"/g, '""')}"`,
      row.unidades_antes || 0,
      row.unidades_despues || 0,
      diff,
      `"${(row.usuario || '').replace(/"/g, '""')}"`,
    ];
    csvRows.push(line.join(','));
  });

  const csvContent = '\uFEFF' + csvRows.join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `ajustes_inventario_${new Date().toISOString().slice(0,10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  $q.notify({
    type: 'positive',
    message: 'Exportación a CSV iniciada con éxito',
    position: 'top',
  });
}

onMounted(() => {
  fetchData();
});
</script>

<style scoped>
.font-mono {
  font-family: 'Fira Code', 'Courier New', Courier, monospace;
}

.border-left-primary {
  border-left: 4px solid #1976D2;
}

.border-left-positive {
  border-left: 4px solid #2E7D32;
}

.border-left-negative {
  border-left: 4px solid #C62828;
}
</style>
