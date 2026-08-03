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
            @update:model-value="onTallaSelected"
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
            v-model="itemRow.pcompraDisplay"
            label="Precio Compra"
            dark
            label-color="green-2"
            outlined
            dense
            class="q-input-premium"
            input-class="text-right"
            prefix="$"
            @update:model-value="onPcompraInput"
            @blur="onPcompraBlur"
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
            input-class="text-right"
            @update:model-value="recalcItem"
            @keyup.enter="addItem"
          />
        </div>
        <div class="col-12 col-md-2">
          <q-input
            :model-value="subtotalDisplay"
            label="Subtotal"
            dark
            label-color="green-2"
            outlined
            dense
            readonly
            class="q-input-premium bg-blue-grey-10"
            input-class="text-right"
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
            <div class="text-weight-bold">$ {{ formatCurrency(totales.subtotal) }}</div>
          </div>
          <div class="row q-mb-sm">
            <div class="text-green-2 opacity-70">Iva</div>
            <q-space />
            <div class="text-weight-bold">$ {{ formatCurrency(totales.iva) }}</div>
          </div>
          <q-separator dark class="q-my-sm opacity-20" />
          <div class="row items-center q-mt-sm">
            <div class="text-h6 text-green-2 text-weight-bold">TOTAL COMPRA</div>
            <q-space />
            <div class="text-h4 text-weight-bold text-gradient">$ {{ formatCurrency(totales.total) }}</div>
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

function formatCurrency(val: number | string): string {
  const num = Number(val) || 0;
  return new Intl.NumberFormat('es-CO', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }).format(num);
}

function parseFormattedNumber(val: string): number {
  if (!val) return 0;
  let cleaned = val.toString().trim();
  if (cleaned.includes('.') && cleaned.includes(',')) {
    cleaned = cleaned.replace(/\./g, '').replace(',', '.');
  } else if (cleaned.includes('.')) {
    const parts = cleaned.split('.');
    if (parts.length > 2) {
      cleaned = cleaned.replace(/\./g, '');
    } else if (parts.length === 2 && parts[1].length === 3 && Number(parts[0]) > 0) {
      cleaned = cleaned.replace(/\./g, '');
    }
  } else if (cleaned.includes(',')) {
    cleaned = cleaned.replace(',', '.');
  }
  cleaned = cleaned.replace(/[^0-9.]/g, '');
  const parsed = parseFloat(cleaned);
  return isNaN(parsed) ? 0 : parsed;
}

// --- Items ---
const items = ref<any[]>([]);
const itemRow = reactive({
  itemObj: null as any,
  item: '',
  nombre: '',
  talla: '',
  cod_color: '' as any,
  cantidad: 1,
  pcompraDisplay: '',
  pcompra: 0,
  iva: 0,
  subtotal: 0
});

const subtotalDisplay = computed(() => {
  return formatCurrency(itemRow.subtotal);
});

const productoOptions = ref<any[]>([]);
const tallaOptions = ref<any[]>([]);
const colorOptions = ref<any[]>([]);

onMounted(async () => {
  try {
    const mediosRes = await salidasApi.getMediosPago();
    mediosPago.value = mediosRes.data;
  } catch (err) {
    console.error(err);
  }
});

// --- Logic ---
function onPcompraInput(val: string) {
  itemRow.pcompraDisplay = val;
  itemRow.pcompra = parseFormattedNumber(val);
  recalcItem();
}

function onPcompraBlur() {
  if (itemRow.pcompra > 0) {
    itemRow.pcompraDisplay = formatCurrency(itemRow.pcompra);
  } else {
    itemRow.pcompraDisplay = '';
  }
}

async function filterProveedores(val: string, update: any) {
  if (!val || val.trim().length < 3) {
    update(() => {
      proveedorOptions.value = [];
    });
    return;
  }
  try {
    const { data } = await entradasApi.getProveedores(val.trim());
    update(() => {
      proveedorOptions.value = (data || []).map(p => ({
        label: `${p.identificacion || ''} - ${p.nombres || ''}`,
        value: p.identificacion,
        data: p
      }));
    });
  } catch (err) {
    console.error('Error al cargar proveedores:', err);
    update(() => {
      proveedorOptions.value = [];
    });
  }
}

function onProveedorSelected(val: any) {
  if (!val) return;
  compra.ident = val.data.identificacion;
  compra.nombre = val.data.nombres;
}

async function filterProductos(val: string, update: any) {
  if (!val || val.trim().length < 3) {
    update(() => {
      productoOptions.value = [];
    });
    return;
  }
  try {
    const { data } = await salidasApi.getItems(val.trim());
    update(() => {
      productoOptions.value = (data || []).map(p => ({
        label: `${p.item} - ${p.descripcion}`,
        value: p.item,
        data: p
      }));
    });
  } catch (err) {
    console.error('Error al cargar productos:', err);
    update(() => {
      productoOptions.value = [];
    });
  }
}

async function onItemSelected(val: any) {
  if (!val) return;
  itemRow.item = val.data.item;
  itemRow.nombre = val.data.descripcion;
  itemRow.iva = val.data.por_iva || 0;
  itemRow.pcompra = val.data.ult_pcompra || 0;
  itemRow.pcompraDisplay = itemRow.pcompra > 0 ? formatCurrency(itemRow.pcompra) : '';
  itemRow.talla = '';
  itemRow.cod_color = null;
  tallaOptions.value = [];
  colorOptions.value = [];
  recalcItem();

  const empresaId = authStore.user?.empresaId || 0;
  if (empresaId && itemRow.item) {
    try {
      const { data } = await entradasApi.getTallasByItem(String(itemRow.item), Number(empresaId));
      tallaOptions.value = data.map((t: any) => ({ label: t.talla, value: t.talla }));
      if (tallaOptions.value.length === 1) {
        itemRow.talla = tallaOptions.value[0].value;
        await onTallaSelected(itemRow.talla);
      }
    } catch (err) {
      console.error('Error al obtener tallas:', err);
    }
  }
}

async function onTallaSelected(talla: string) {
  itemRow.cod_color = null;
  colorOptions.value = [];
  if (!talla || !itemRow.item) return;

  const empresaId = authStore.user?.empresaId || 0;
  if (empresaId) {
    try {
      const { data } = await entradasApi.getColoresByItemTalla(String(itemRow.item), talla, Number(empresaId));
      colorOptions.value = data.map((c: any) => ({
        label: `${c.cod_color} - ${c.color || 'Sin nombre'}`,
        value: c.cod_color
      }));
      if (colorOptions.value.length === 1) {
        itemRow.cod_color = colorOptions.value[0].value;
      }
    } catch (err) {
      console.error('Error al obtener colores:', err);
    }
  }
}

function recalcItem() {
  itemRow.subtotal = itemRow.cantidad * itemRow.pcompra;
}

function addItem() {
  if (!itemRow.item) return;
  items.value.push({
    item: String(itemRow.item),
    nombre: String(itemRow.nombre || ''),
    talla: String(itemRow.talla || '0'),
    color: Number(itemRow.cod_color) || 0,
    cantidad: Number(itemRow.cantidad) || 1,
    pcompra: Number(itemRow.pcompra) || 0,
    pdesc: 0,
    por_iva: Number(itemRow.iva) || 0,
    subtotal: Number(itemRow.subtotal) || 0
  });
  // Reset
  itemRow.itemObj = null;
  itemRow.item = '';
  itemRow.cantidad = 1;
  itemRow.pcompra = 0;
  itemRow.pcompraDisplay = '';
  itemRow.subtotal = 0;
}

function removeItem(index: number) {
  items.value.splice(index, 1);
}

const totales = computed(() => {
  const sub = items.value.reduce((acc, curr) => acc + (Number(curr.subtotal) || 0), 0);
  const iva = items.value.reduce((acc, curr) => acc + ((Number(curr.subtotal) || 0) * ((Number(curr.por_iva) || 0) / 100)), 0);
  return {
    subtotal: sub,
    iva: iva,
    total: sub + iva
  };
});

async function guardar() {
  if (!compra.ident || items.value.length === 0) {
    $q.notify({ type: 'warning', message: 'Falta proveedor o items' });
    return;
  }
  
  guardando.value = true;
  try {
    const now = new Date();
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const dd = String(now.getDate()).padStart(2, '0');
    const yyyy = now.getFullYear();
    const fechaStr = `${mm}/${dd}/${yyyy}`;

    const totalCant = items.value.reduce((acc, curr) => acc + (Number(curr.cantidad) || 0), 0);
    const empresaId = Number(authStore.user?.empresaId || 0);

    const payload: any = {
      enc: {
        ident: String(compra.ident),
        empresa_id: empresaId,
        sucursal: empresaId,
        nombre: String(compra.nombre || ''),
        forma_pago: Number(compra.formaPago || 1),
        plazo: Number(compra.plazo || 0),
        tipo: 1, // Tipo compra
        total: Number(totales.value.total.toFixed(2)),
        subtotal: Number(totales.value.subtotal.toFixed(2)),
        iva: Number(totales.value.iva.toFixed(2)),
        descuento: 0,
        vendedor: String(authStore.user?.name || 'SISTEMA'),
        observaciones: String(compra.observaciones || ''),
        fecha: fechaStr,
        factura: '0',
        cantidad_total: totalCant,
        valor_abono: 0
      },
      det: items.value.map(i => ({
        item: String(i.item),
        nombre: String(i.nombre || ''),
        talla: String(i.talla || '0'),
        color: Number(i.color) || 0,
        cantidad: Number(i.cantidad) || 0,
        pcompra: Number(Number(i.pcompra || 0).toFixed(2)),
        pventa: Number(Number(i.pcompra || 0).toFixed(2)),
        pdesc: Number(i.pdesc || 0),
        por_iva: Number(i.por_iva || 0),
        subtotal: Number(Number(i.subtotal || 0).toFixed(2)),
        pcfinal: Number(Number(i.pcompra || 0).toFixed(2)),
        pcfinaliva: Number((Number(i.pcompra || 0) * (1 + Number(i.por_iva || 0) / 100)).toFixed(2)),
        pfinaliva: Number((Number(i.pcompra || 0) * (1 + Number(i.por_iva || 0) / 100)).toFixed(2))
      }))
    };
    
    const { data } = await entradasApi.registrarCompra(payload);
    if (data.rpta) {
      $q.notify({ type: 'positive', message: 'Compra registrada con éxito: ' + data.rpta });
      // Limpiar datos
      items.value = [];
      compra.proveedorObj = null;
      compra.ident = '';
      compra.nombre = '';
      compra.observaciones = '';
    }
  } catch (err: any) {
    console.error('Error al registrar compra:', err);
    const apiMsg = err.response?.data?.message;
    const msgToShow = Array.isArray(apiMsg) ? apiMsg.join(', ') : (apiMsg || 'Error al registrar compra');
    $q.notify({ type: 'negative', message: 'Error: ' + msgToShow });
  } finally {
    guardando.value = false;
  }
}

const columns = [
  { name: 'item', label: 'Item/Descripción', align: 'left', field: 'item' },
  { name: 'talla', label: 'Talla', align: 'center', field: 'talla' },
  { name: 'color', label: 'Color', align: 'center', field: 'color' },
  { name: 'cantidad', label: 'Cant', align: 'center', field: 'cantidad' },
  { name: 'pcompra', label: 'P. Compra', align: 'right', field: 'pcompra', format: (val: any) => `$ ${formatCurrency(val)}` },
  { name: 'por_iva', label: '%IVA', align: 'center', field: 'por_iva' },
  { name: 'subtotal', label: 'Subtotal', align: 'right', field: 'subtotal', format: (val: any) => `$ ${formatCurrency(val)}` },
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
