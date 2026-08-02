<template>
  <q-page class="q-pa-md column no-wrap overflow-hidden bg-grey-2" style="min-height: unset !important; height: calc(100vh - 95px); max-height: calc(100vh - 95px);">
    
    <!-- Top Header -->
    <div class="col-auto row items-center justify-between q-mb-md">
      <div class="row items-center q-gutter-sm">
        <div>
          <div class="row items-center q-gutter-sm">
            <div class="text-h5 text-negative text-weight-bold">Items Sin Inventario</div>
            <q-chip color="negative" text-color="white" dense class="text-weight-bold q-px-sm" icon="warning">
              {{ pagination.rowsNumber }} Registros
            </q-chip>
          </div>
          <div class="text-caption text-grey-7">Listado de ítems sin existencias o con saldo negativo (public.view_items_sin_inventario)</div>
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
          <q-tooltip>Descargar listado en CSV</q-tooltip>
        </q-btn>
        <q-btn
          flat
          round
          color="negative"
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
      <div class="col-12 col-sm-6 col-md-3">
        <q-card flat class="rounded-borders bg-white shadow-1 border-left-negative">
          <q-card-section class="q-pa-sm row items-center justify-between">
            <div>
              <div class="text-caption text-grey-6 text-weight-medium">ITEMS SIN STOCK</div>
              <div class="text-h6 text-weight-bolder text-negative">
                {{ formatNumber(stats.totalRegistros) }}
              </div>
            </div>
            <q-avatar color="red-1" text-color="negative" icon="remove_shopping_cart" size="40px" />
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-sm-6 col-md-3">
        <q-card flat class="rounded-borders bg-white shadow-1 border-left-warning">
          <q-card-section class="q-pa-sm row items-center justify-between">
            <div>
              <div class="text-caption text-grey-6 text-weight-medium">UNIDADES FALTANTES</div>
              <div class="text-h6 text-weight-bolder text-amber-9">
                {{ formatNumber(stats.totalUnidades) }}
              </div>
            </div>
            <q-avatar color="amber-1" text-color="amber-9" icon="inventory" size="40px" />
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-sm-6 col-md-3">
        <q-card flat class="rounded-borders bg-white shadow-1 border-left-info">
          <q-card-section class="q-pa-sm row items-center justify-between">
            <div>
              <div class="text-caption text-grey-6 text-weight-medium">VALOR EN COMPRA</div>
              <div class="text-h6 text-weight-bolder text-indigo-9">
                {{ formatCurrency(stats.valorTotalCompra) }}
              </div>
            </div>
            <q-avatar color="indigo-1" text-color="indigo-9" icon="shopping_bag" size="40px" />
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-sm-6 col-md-3">
        <q-card flat class="rounded-borders bg-white shadow-1 border-left-purple">
          <q-card-section class="q-pa-sm row items-center justify-between">
            <div>
              <div class="text-caption text-grey-6 text-weight-medium">VALOR EN VENTA</div>
              <div class="text-h6 text-weight-bolder text-purple-9">
                {{ formatCurrency(stats.valorTotalVenta) }}
              </div>
            </div>
            <q-avatar color="purple-1" text-color="purple-9" icon="payments" size="40px" />
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- Card de Filtros -->
    <q-card flat class="col-auto rounded-borders q-mb-md bg-white shadow-1">
      <q-card-section class="q-py-sm">
        <div class="row items-center q-col-gutter-md">
          <!-- Buscador principal -->
          <div class="col-12 col-sm-6 col-md-6">
            <q-input
              v-model="searchTerm"
              dense
              outlined
              clearable
              placeholder="Buscar por Ítem, Nombre, Talla, Color o Empresa..."
              label="Buscar ítem sin inventario"
              debounce="350"
              @update:model-value="onFilterChange"
            >
              <template v-slot:prepend>
                <q-icon name="search" />
              </template>
            </q-input>
          </div>

          <!-- Filtro Empresa Scope -->
          <div class="col-12 col-sm-4 col-md-4">
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
          <div class="col-12 col-sm-2 col-md-2 text-right">
            <q-btn flat round color="grey-7" icon="clear_all" dense @click="clearFilters">
              <q-tooltip>Limpiar Filtros</q-tooltip>
            </q-btn>
          </div>
        </div>
      </q-card-section>
    </q-card>

    <!-- Tabla Principal con Paginación Servidor -->
    <q-card flat class="col column no-wrap overflow-hidden rounded-borders bg-white shadow-1">
      <q-table
        :rows="rows"
        :columns="columns"
        row-key="item"
        class="col header-tablet border-table border-row full-height-table"
        :loading="loading"
        no-data-label="No hay ítems sin inventario que mostrar"
        v-model:pagination="pagination"
        @request="onRequest"
        binary-state-sort
        flat
      >
        <!-- Cell: Item Code -->
        <template v-slot:body-cell-item="props">
          <q-td :props="props">
            <q-chip dense color="red-1" text-color="negative" class="text-weight-bold font-mono">
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
        <template v-slot:body-cell-color="props">
          <q-td :props="props" align="center">
            <q-chip v-if="props.row.color" dense color="teal-1" text-color="teal-9" icon="palette" class="text-weight-medium">
              {{ props.row.color }}
            </q-chip>
            <span v-else class="text-grey-5">-</span>
          </q-td>
        </template>

        <!-- Cell: Unidades -->
        <template v-slot:body-cell-unidades="props">
          <q-td :props="props" align="right">
            <q-chip
              dense
              color="negative"
              text-color="white"
              class="text-weight-bold q-px-sm"
            >
              {{ formatNumber(props.row.unidades) }}
            </q-chip>
          </q-td>
        </template>

        <!-- Cell: Precio Compra -->
        <template v-slot:body-cell-precio_compra="props">
          <q-td :props="props" align="right">
            <span class="text-grey-8 font-mono">{{ formatCurrency(props.row.precio_compra) }}</span>
          </q-td>
        </template>

        <!-- Cell: Precio Venta -->
        <template v-slot:body-cell-precio_venta="props">
          <q-td :props="props" align="right">
            <span class="text-weight-bold text-primary font-mono">{{ formatCurrency(props.row.precio_venta) }}</span>
          </q-td>
        </template>

        <!-- Cell: Empresa -->
        <template v-slot:body-cell-empresa="props">
          <q-td :props="props">
            <q-chip dense color="blue-grey-1" text-color="blue-grey-9" icon="business" class="text-caption">
              {{ props.row.empresa || '-' }}
            </q-chip>
          </q-td>
        </template>

      </q-table>
    </q-card>

  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useQuasar } from 'quasar';
import { useAuthStore } from 'src/stores/auth';
import { inventarioApi, InventarioItem, InventarioStats } from 'src/api/inventario';

const $q = useQuasar();
const authStore = useAuthStore();

// Reactive State
const loading = ref(false);
const rows = ref<InventarioItem[]>([]);
const searchTerm = ref('');
const empresaScope = ref<'actual' | 'todas'>('actual');

const stats = ref<InventarioStats>({
  totalRegistros: 0,
  totalUnidades: 0,
  valorTotalCompra: 0,
  valorTotalVenta: 0,
});

const pagination = ref({
  sortBy: 'item',
  descending: false,
  page: 1,
  rowsPerPage: 50,
  rowsNumber: 0,
});

// Table Columns definition
const columns = [
  { name: 'item', label: 'Ítem (Código)', field: 'item', align: 'left' as const, sortable: true },
  { name: 'nombre', label: 'Descripción / Nombre', field: 'nombre', align: 'left' as const, sortable: true },
  { name: 'talla', label: 'Talla', field: 'talla', align: 'center' as const, sortable: true },
  { name: 'color', label: 'Color', field: 'color', align: 'center' as const, sortable: true },
  { name: 'unidades', label: 'Stock (Unids)', field: 'unidades', align: 'right' as const, sortable: true },
  { name: 'precio_compra', label: 'P. Compra', field: 'precio_compra', align: 'right' as const, sortable: true },
  { name: 'precio_venta', label: 'P. Venta', field: 'precio_venta', align: 'right' as const, sortable: true },
  { name: 'empresa', label: 'Empresa / Sede', field: 'empresa', align: 'left' as const, sortable: true },
];

// Helper Formatter Functions
function formatCurrency(value: number | string | undefined): string {
  const num = Number(value) || 0;
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(num);
}

function formatNumber(value: number | string | undefined): string {
  const num = Number(value) || 0;
  return new Intl.NumberFormat('es-CO', {
    maximumFractionDigits: 2,
  }).format(num);
}

// Data Fetching logic
async function fetchData() {
  loading.value = true;
  try {
    const empresaId = empresaScope.value === 'actual' ? authStore.user?.empresaId || 1 : undefined;

    const res = await inventarioApi.getSinInventario({
      empresa_id: empresaId,
      search: searchTerm.value || undefined,
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
    console.error('Error cargando items sin inventario:', error);
    $q.notify({
      type: 'negative',
      message: 'Error al cargar los ítems sin inventario',
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
  empresaScope.value = 'actual';
  pagination.value.page = 1;
  fetchData();
}

// CSV Export function
function exportCSV() {
  if (rows.value.length === 0) return;

  const headers = ['Item', 'Nombre', 'Talla', 'Color', 'Unidades', 'Precio Compra', 'Precio Venta', 'Empresa'];
  const csvRows = [headers.join(',')];

  rows.value.forEach((row) => {
    const line = [
      `"${(row.item || '').replace(/"/g, '""')}"`,
      `"${(row.nombre || '').replace(/"/g, '""')}"`,
      `"${(row.talla || '').replace(/"/g, '""')}"`,
      `"${(row.color || '').replace(/"/g, '""')}"`,
      row.unidades || 0,
      row.precio_compra || 0,
      row.precio_venta || 0,
      `"${(row.empresa || '').replace(/"/g, '""')}"`,
    ];
    csvRows.push(line.join(','));
  });

  const csvContent = '\uFEFF' + csvRows.join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `items_sin_inventario_${new Date().toISOString().slice(0,10)}.csv`);
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

.border-left-negative {
  border-left: 4px solid #C62828;
}

.border-left-warning {
  border-left: 4px solid #F57C00;
}

.border-left-info {
  border-left: 4px solid #1976D2;
}

.border-left-purple {
  border-left: 4px solid #7B1FA2;
}
</style>
