<template>
  <q-page class="column aurora-animate" style="min-height: 100vh; padding: 24px;">
    <!-- Main Purchase Container -->
    <div class="glass-card q-pa-lg shadow-24 full-width no-border" style="border-radius: 20px;">
      
      <!-- Premium Header -->
      <div class="row items-center q-mb-lg">
        <q-icon name="shopping_bag" size="md" color="green-2" class="q-mr-md" />
        <div>
          <div class="text-h4 text-weight-bold text-gradient">Nueva Compra</div>
          <div class="text-green-2 opacity-70">Ingreso de mercancía por compra a proveedores</div>
        </div>
        <q-space />
        <div class="row q-gutter-sm">
          <q-btn
            color="positive"
            icon="save"
            label="Guardar Compra"
            class="premium-btn"
            @click="guardar"
            :loading="guardando"
          />
        </div>
      </div>

      <!-- Header section: Suppplier & Metadata -->
      <div class="row q-col-gutter-lg q-mb-xl">
        <div class="col-12 col-md-4">
          <q-select
            v-model="compra.proveedorObj"
            :options="proveedorOptions"
            option-label="label"
            option-value="value"
            label="Proveedor*"
            dark
            label-color="green-2"
            outlined
            dense
            use-input
            input-debounce="300"
            class="q-input-premium"
            @filter="filterProveedores"
            @update:model-value="onProveedorSelected"
          >
            <template #prepend><q-icon name="business" color="green-2" /></template>
            <template #no-option>
              <q-item>
                <q-item-section class="text-grey">Sin resultados</q-item-section>
              </q-item>
            </template>
          </q-select>
        </div>
        <div class="col-12 col-md-2">
          <q-select
            v-model="compra.formaPago"
            :options="mediosPago"
            option-label="descripcion"
            option-value="codigo"
            emit-value
            map-options
            label="Forma pago*"
            dark
            label-color="green-2"
            outlined
            dense
            class="q-input-premium"
          />
        </div>
        <div class="col-12 col-md-2">
          <q-input
            v-model.number="compra.plazo"
            label="Plazo (días)*"
            type="number"
            dark
            label-color="green-2"
            outlined
            dense
            class="q-input-premium"
          />
        </div>
        <div class="col-12 col-md-4">
          <q-input
            v-model="compra.observaciones"
            label="Observaciones"
            dark
            label-color="green-2"
            outlined
            dense
            class="q-input-premium"
          >
            <template #prepend><q-icon name="comment" color="green-2" /></template>
          </q-input>
        </div>
      </div>

      <q-separator dark class="q-my-lg opacity-20" />

      <!-- Item entry row -->
      <div class="row q-col-gutter-md items-end q-mb-lg">
        <div class="col-12 col-md-3">
          <q-select
            v-model="itemRow.itemObj"
            :options="productoOptions"
            option-label="label"
            option-value="value"
            label="Buscar Item*"
            dark
            label-color="green-2"
            outlined
            dense
            use-input
            input-debounce="300"
            class="q-input-premium"
            @filter="filterProductos"
            @update:model-value="onItemSelected"
          >
            <template #prepend><q-icon name="search" color="green-2" /></template>
            <template #no-option>
              <q-item>
                <q-item-section class="text-grey">Sin resultados</q-item-section>
              </q-item>
            </template>
          </q-select>
        </div>
        <div class="col-12 col-md-1">
          <q-select
            v-model="itemRow.talla"
            :options="tallaOptions"
            option-label="label"
            option-value="value"
            emit-value
            map-options
            label="Talla"
            dark
            label-color="green-2"
            outlined
            dense
            class="q-input-premium"
          />
        </div>
        <div class="col-12 col-md-1">
          <q-select
            v-model="itemRow.cod_color"
            :options="colorOptions"
            option-label="label"
            option-value="value"
            emit-value
            map-options
            label="Color"
            dark
            label-color="green-2"
            outlined
            dense
            class="q-input-premium"
          />
        </div>
        <div class="col-12 col-md-1">
          <q-input
            v-model.number="itemRow.iva"
            label="%Iva"
            type="number"
            dark
            label-color="green-2"
            outlined
            dense
            class="q-input-premium"
            @update:model-value="recalcItem"
          />
        </div>
        <div class="col-12 col-md-2">
          <q-input
            v-model.number="itemRow.pcompra"
            label="Precio Compra"
            type="number"
            dark
            label-color="green-2"
            outlined
            dense
            class="q-input-premium"
            prefix="$"
            @update:model-value="recalcItem"
          />
        </div>
        <div class="col-12 col-md-1">
          <q-input
            v-model.number="itemRow.cantidad"
            label="Cant.*"
            type="number"
            dark
            label-color="green-2"
            outlined
            dense
            class="q-input-premium"
            @update:model-value="recalcItem"
            @keyup.enter="addItem"
          />
        </div>
        <div class="col-12 col-md-2">
          <q-input
            v-model="itemRow.subtotal"
            label="Subtotal"
            dark
            label-color="green-2"
            outlined
            dense
            readonly
            class="q-input-premium bg-blue-grey-10"
            prefix="$"
          />
        </div>
        <div class="col-auto">
          <q-btn
            color="positive"
            icon="add"
            flat
            round
            dense
            size="lg"
            class="q-ml-sm"
            @click="addItem"
          />
        </div>
      </div>

      <!-- Items table -->
      <div class="q-mb-xl">
        <q-table
          :rows="items"
          :columns="columns"
          row-key="__index"
          dark
          flat
          class="glass-table"
          :rows-per-page-options="[0]"
          hide-pagination
          no-data-label="No hay items en esta compra"
        >
          <template #body-cell-item="props">
            <q-td :props="props">
              <div class="text-weight-bold text-green-2">{{ props.row.item }}</div>
              <div class="text-caption opacity-70">{{ props.row.nombre }}</div>
            </q-td>
          </template>
          <template #body-cell-acciones="props">
            <q-td :props="props" auto-width>
              <q-btn icon="delete" color="red-5" flat dense round @click="removeItem(props.rowIndex)" />
            </q-td>
          </template>
        </q-table>
      </div>

      <!-- Footer totals -->
      <div class="row justify-end">
        <div class="col-12 col-md-4 glass-card q-pa-lg" style="background: rgba(255,255,255,0.05)">
          <div class="row q-mb-sm">
            <div class="text-green-2 opacity-70">Subtotal</div>
            <q-space />
            <div class="text-weight-bold">$ {{ totales.subtotal }}</div>
          </div>
          <div class="row q-mb-sm">
            <div class="text-green-2 opacity-70">Iva</div>
            <q-space />
            <div class="text-weight-bold">$ {{ totales.iva }}</div>
          </div>
          <q-separator dark class="q-my-sm opacity-20" />
          <div class="row items-center q-mt-sm">
            <div class="text-h6 text-green-2 text-weight-bold">TOTAL COMPRA</div>
            <q-space />
            <div class="text-h4 text-weight-bold text-gradient">$ {{ totales.total }}</div>
          </div>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue';
import { useQuasar } from 'quasar';
import { useAuthStore } from 'src/stores/auth';
import { entradasApi, type ProveedorResult, type CreateCompraPayload } from 'src/api/entradas';
import { salidasApi } from 'src/api/salidas';
import { coloresApi } from 'src/api/colores';

const $q = useQuasar();
const authStore = useAuthStore();

// --- Header ---
const compra = reactive({
  proveedorObj: null as any,
  ident: '',
  nombre: '',
  formaPago: 1,
  plazo: 0,
  observaciones: '',
});

const guardando = ref(false);
const mediosPago = ref<any[]>([]);
const proveedorOptions = ref<any[]>([]);

// --- Items ---
const items = ref<any[]>([]);
const itemRow = reactive({
  itemObj: null as any,
  item: '',
  nombre: '',
  talla: '',
  cod_color: '' as any,
  cantidad: 1,
  pcompra: 0,
  iva: 0,
  subtotal: '0.00'
});

const productoOptions = ref<any[]>([]);
const tallaOptions = ref<any[]>([]);
const colorOptions = ref<any[]>([]);

onMounted(async () => {
  try {
    const [mediosRes, coloresRes] = await Promise.all([
      salidasApi.getMediosPago(),
      coloresApi.getAll()
    ]);
    mediosPago.value = mediosRes.data;
    colorOptions.value = coloresRes.data.map(c => ({ label: c.descripcion, value: c.codigo }));
    
    // Tallas quemadas por ahora o cargar de algún lugar
    tallaOptions.value = ['S', 'M', 'L', 'XL', '28', '30', '32', '34'].map(t => ({ label: t, value: t }));
  } catch (err) {
    console.error(err);
  }
});

// --- Logic ---
async function filterProveedores(val: string, update: any) {
  const { data } = await entradasApi.getProveedores(val);
  update(() => {
    proveedorOptions.value = data.map(p => ({
      label: `${p.identificacion} - ${p.nombres}`,
      value: p.identificacion,
      data: p
    }));
  });
}

function onProveedorSelected(val: any) {
  if (!val) return;
  compra.ident = val.data.identificacion;
  compra.nombre = val.data.nombres;
}

async function filterProductos(val: string, update: any) {
  const { data } = await salidasApi.getItems(val);
  update(() => {
    productoOptions.value = data.map(p => ({
      label: `${p.item} - ${p.descripcion}`,
      value: p.item,
      data: p
    }));
  });
}

function onItemSelected(val: any) {
  if (!val) return;
  itemRow.item = val.data.item;
  itemRow.nombre = val.data.descripcion;
  itemRow.iva = val.data.por_iva || 0;
  itemRow.pcompra = val.data.ult_pcompra || 0;
  recalcItem();
}

function recalcItem() {
  const sub = itemRow.cantidad * itemRow.pcompra;
  itemRow.subtotal = sub.toFixed(2);
}

function addItem() {
  if (!itemRow.item) return;
  items.value.push({
    item: itemRow.item,
    nombre: itemRow.nombre,
    talla: itemRow.talla || '0',
    color: itemRow.cod_color || 0,
    cantidad: itemRow.cantidad,
    pcompra: itemRow.pcompra,
    pdesc: 0,
    por_iva: itemRow.iva,
    subtotal: Number(itemRow.subtotal)
  });
  // Reset
  itemRow.itemObj = null;
  itemRow.item = '';
  itemRow.cantidad = 1;
  itemRow.pcompra = 0;
  itemRow.subtotal = '0.00';
}

function removeItem(index: number) {
  items.value.splice(index, 1);
}

const totales = computed(() => {
  const sub = items.value.reduce((acc, curr) => acc + curr.subtotal, 0);
  const iva = items.value.reduce((acc, curr) => acc + (curr.subtotal * (curr.por_iva / 100)), 0);
  return {
    subtotal: sub.toFixed(2),
    iva: iva.toFixed(2),
    total: (sub + iva).toFixed(2)
  };
});

async function guardar() {
  if (!compra.ident || items.value.length === 0) {
    $q.notify({ type: 'warning', message: 'Falta proveedor o items' });
    return;
  }
  
  guardando.value = true;
  try {
    const payload: CreateCompraPayload = {
      enc: {
        ident: compra.ident,
        empresa_id: authStore.user?.empresaId || 0,
        nombre: compra.nombre,
        forma_pago: compra.formaPago,
        plazo: compra.plazo,
        tipo: 1, // Tipo compra
        total: Number(totales.value.total),
        subtotal: Number(totales.value.subtotal),
        iva: Number(totales.value.iva),
        descuento: 0,
        vendedor: authStore.user?.name || 'SISTEMA',
        observaciones: compra.observaciones
      },
      det: items.value.map(i => ({
        ...i,
        pfinaliva: i.pcompra * (1 + i.por_iva / 100)
      }))
    };
    
    const { data } = await entradasApi.registrarCompra(payload);
    if (data.rpta) {
      $q.notify({ type: 'positive', message: 'Compra registrada con éxito: ' + data.rpta });
      // Limpiar formalmente si se requiere
    }
  } catch (err) {
    console.error(err);
    $q.notify({ type: 'negative', message: 'Error al registrar compra' });
  } finally {
    guardando.value = false;
  }
}

const columns = [
  { name: 'item', label: 'Item/Descripción', align: 'left', field: 'item' },
  { name: 'talla', label: 'Talla', align: 'center', field: 'talla' },
  { name: 'color', label: 'Color', align: 'center', field: 'color' },
  { name: 'cantidad', label: 'Cant', align: 'center', field: 'cantidad' },
  { name: 'pcompra', label: 'P. Compra', align: 'right', field: 'pcompra', format: (val: any) => `$${val.toFixed(2)}` },
  { name: 'por_iva', label: '%IVA', align: 'center', field: 'por_iva' },
  { name: 'subtotal', label: 'Subtotal', align: 'right', field: 'subtotal', format: (val: any) => `$${val.toFixed(2)}` },
  { name: 'acciones', label: '', align: 'center' },
];
</script>

<style scoped>
.aurora-animate {
  background: linear-gradient(-45deg, #0f172a, #1a2e35, #064e3b, #0f172a);
  background-size: 400% 400%;
  animation: aurora 20s ease infinite;
}

@keyframes aurora {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

.glass-card {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(15px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: white;
}

.text-gradient {
  background: linear-gradient(to right, #4ade80, #22d3ee);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.premium-btn {
  border-radius: 12px;
  font-weight: 600;
  letter-spacing: 0.5px;
  text-transform: none;
}

.q-input-premium :deep(.q-field__control) {
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.03);
}

.glass-table :deep(thead tr th) {
  color: #4ade80;
  font-weight: bold;
}
</style>
