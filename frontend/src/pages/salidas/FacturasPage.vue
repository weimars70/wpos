<template>
  <q-page class="column aurora-animate" style="min-height: 100vh; padding: 24px;">
    <!-- Main Billing Container -->
    <div class="glass-card q-pa-lg shadow-24 full-width no-border" style="border-radius: 20px;">
      
      <!-- Premium Header -->
      <div class="row items-center q-mb-lg">
        <q-icon name="receipt_long" size="md" color="blue-2" class="q-mr-md" />
        <div>
          <div class="text-h4 text-weight-bold text-gradient">Nueva Factura</div>
          <div class="text-blue-2 opacity-70">Emisión de comprobante de venta</div>
        </div>
        <q-space />
        <div class="row q-gutter-sm">
          <q-btn
            color="primary"
            icon="save"
            label="Guardar"
            class="premium-btn"
            @click="guardar"
          />
          <q-btn
            color="secondary"
            outline
            icon="save_as"
            label="Guardar Otros"
            class="premium-btn"
            @click="guardarOtros"
          />
        </div>
      </div>

      <!-- Header section -->
      <div class="row q-col-gutter-lg q-mb-xl">
        <div class="col-12 col-md-4">
          <q-select
            v-model="factura.clienteObj"
            :options="clienteOptions"
            option-label="label"
            option-value="value"
            label="Cliente*"
            dark
            label-color="blue-2"
            outlined
            dense
            use-input
            input-debounce="300"
            class="q-input-premium"
            @filter="filterClientes"
            @update:model-value="onClienteSelected"
          >
            <template #prepend><q-icon name="person" color="blue-2" /></template>
            <template #no-option>
              <q-item>
                <q-item-section class="text-grey">Sin resultados</q-item-section>
              </q-item>
            </template>
          </q-select>
        </div>
        <div class="col-12 col-md-4">
          <q-input
            v-model="factura.direccion"
            label="Dirección"
            dark
            label-color="blue-2"
            outlined
            dense
            class="q-input-premium"
          >
            <template #prepend><q-icon name="place" color="blue-2" /></template>
          </q-input>
        </div>
        <div class="col-12 col-md-4 row q-col-gutter-sm">
          <div class="col-6">
            <q-select
              v-model="factura.formaPago"
              :options="mediosPago"
              option-label="descripcion"
              option-value="codigo"
              emit-value
              map-options
              label="Forma pago*"
              dark
              label-color="blue-2"
              outlined
              dense
              class="q-input-premium"
            />
          </div>
          <div class="col-6">
            <q-input
              v-model.number="factura.plazo"
              label="Plazo (días)*"
              type="number"
              dark
              label-color="blue-2"
              outlined
              dense
              class="q-input-premium"
            />
          </div>
        </div>
      </div>

      <q-separator dark class="q-my-lg opacity-20" />

      <!-- Item entry row -->
      <div class="row q-col-gutter-md items-end q-mb-lg">
        <div class="col-12 col-md-3">
          <q-select
            v-model="itemRow.item"
            :options="productoOptions"
            option-label="label"
            option-value="value"
            label="Buscar Item*"
            dark
            label-color="blue-2"
            outlined
            dense
            use-input
            input-debounce="300"
            class="q-input-premium"
            @filter="filterProductos"
            @update:model-value="onItemSelected"
          >
            <template #prepend><q-icon name="search" color="blue-2" /></template>
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
            label-color="blue-2"
            outlined
            dense
            :disable="tallaOptions.length === 0"
            class="q-input-premium text-center"
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
            label-color="blue-2"
            outlined
            dense
            :disable="colorOptions.length === 0"
            class="q-input-premium"
            @update:model-value="onColorSelected"
          />
        </div>
        <div class="col-12 col-md-1">
          <q-input
            v-model.number="itemRow.iva"
            label="%Iva"
            type="number"
            dark
            label-color="blue-2"
            outlined
            dense
            class="q-input-premium"
            @update:model-value="recalcItem"
          />
        </div>
        <div class="col-12 col-md-2">
          <q-input
            v-model.number="itemRow.precio"
            label="Precio Venta"
            type="number"
            dark
            label-color="blue-2"
            outlined
            dense
            class="q-input-premium"
            prefix="$"
            @update:model-value="recalcItem"
          />
        </div>
        <div class="col-12 col-md-1">
          <q-input
            v-model.number="itemRow.descuento"
            label="%Desc"
            type="number"
            dark
            label-color="blue-2"
            outlined
            dense
            class="q-input-premium"
            @update:model-value="recalcItem"
          />
        </div>
        <div class="col-12 col-md-1">
          <q-input
            ref="inputCantidad"
            v-model.number="itemRow.cantidad"
            label="Cant.*"
            type="number"
            dark
            label-color="blue-2"
            outlined
            dense
            class="q-input-premium"
            :color="stockDisponible !== null && itemRow.cantidad > stockDisponible ? 'red-5' : 'blue-2'"
            @update:model-value="recalcItem"
            @keyup.enter="addItem"
          >
            <template v-if="stockDisponible !== null" #append>
              <q-badge
                :color="stockDisponible === 0 ? 'red-7' : itemRow.cantidad > stockDisponible ? 'orange-7' : 'green-7'"
                :label="String(stockDisponible)"
              >
                <q-tooltip>Unidades disponibles en esta sucursal</q-tooltip>
              </q-badge>
            </template>
          </q-input>
          <div
            v-if="stockDisponible !== null"
            class="text-caption q-mt-xs"
            :class="stockDisponible === 0 ? 'text-red-5' : itemRow.cantidad > stockDisponible ? 'text-orange-5' : 'text-green-5'"
          >
            Disp: {{ stockDisponible }} uds
          </div>
        </div>
        <div class="col-12 col-md-2">
          <q-input
            v-model="itemRow.subtotal"
            label="Subtotal"
            dark
            label-color="blue-2"
            outlined
            dense
            readonly
            class="q-input-premium bg-blue-grey-10"
            prefix="$"
          />
        </div>
        <div class="col-auto">
          <q-btn
            color="primary"
            icon="add"
            flat
            round
            dense
            size="lg"
            class="q-ml-sm"
            @click="addItem"
          >
            <q-tooltip>Agregar a la lista</q-tooltip>
          </q-btn>
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
          no-data-label="Aún no has agregado productos"
        >
          <template #body-cell-item="props">
            <q-td :props="props">
              <div class="text-weight-bold text-blue-2">{{ props.row.item }}</div>
              <div class="text-caption opacity-70">{{ props.row.descripcion }}</div>
            </q-td>
          </template>
          <template #body-cell-acciones="props">
            <q-td :props="props" auto-width>
              <q-btn
                icon="delete"
                color="red-5"
                flat
                dense
                round
                @click="removeItem(props.rowIndex)"
              />
            </q-td>
          </template>
        </q-table>
      </div>

      <!-- Footer totals -->
      <div class="row justify-end">
        <div class="col-12 col-md-4 glass-card q-pa-lg" style="background: rgba(255,255,255,0.05)">
          <div class="row q-mb-sm">
            <div class="text-blue-2 opacity-70">Subtotal</div>
            <q-space />
            <div class="text-weight-bold">$ {{ totales.subtotal }}</div>
          </div>
          <div class="row q-mb-sm">
            <div class="text-blue-2 opacity-70">Iva</div>
            <q-space />
            <div class="text-weight-bold">$ {{ totales.iva }}</div>
          </div>
          <div class="row q-mb-md">
            <div class="text-blue-2 opacity-70">Descuento</div>
            <q-space />
            <div class="text-weight-bold text-red-4">-$ {{ totales.descuento }}</div>
          </div>
          <q-separator dark class="q-my-sm opacity-20" />
          <div class="row items-center q-mt-sm">
            <div class="text-h6 text-blue-2 text-weight-bold">TOTAL</div>
            <q-space />
            <div class="text-h4 text-weight-bold text-gradient">$ {{ totales.total }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- ===== MODAL EFECTIVO ===== -->
    <q-dialog v-model="showEfectivoDialog" persistent>
      <q-card dark style="min-width: 360px; max-width: 420px; border-radius: 16px; background: #1a2035;">
        <q-card-section class="row items-center q-pb-none">
          <q-icon name="payments" color="green-4" size="md" class="q-mr-sm" />
          <div class="text-h6 text-green-4 text-weight-bold">Pago en Efectivo</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section>
          <!-- Total -->
          <div class="rounded-borders q-pa-md q-mb-md" style="background: rgba(255,255,255,0.05);">
            <div class="text-caption text-blue-3 q-mb-xs">TOTAL A COBRAR</div>
            <div class="text-h4 text-weight-bold text-white">$ {{ totales.total }}</div>
          </div>

          <!-- Recibido -->
          <q-input
            v-model.number="efectivoPagado"
            label="Recibido del cliente"
            type="number"
            dark
            outlined
            label-color="blue-2"
            prefix="$"
            autofocus
            class="q-mb-sm"
            input-class="text-h5 text-weight-bold"
            @keyup.enter="confirmarEfectivo"
          />

          <!-- Botones de montos rápidos -->
          <div class="row q-gutter-xs q-mb-md">
            <q-btn
              v-for="monto in montosRapidos"
              :key="monto"
              :label="`$${monto.toLocaleString()}`"
              outline
              dense
              color="blue-3"
              size="sm"
              @click="efectivoPagado = monto"
            />
          </div>

          <!-- Devuelta -->
          <div
            class="rounded-borders q-pa-md"
            :style="devuelta >= 0 ? 'background: rgba(76,175,80,0.15)' : 'background: rgba(244,67,54,0.15)'"
          >
            <div class="text-caption q-mb-xs" :class="devuelta >= 0 ? 'text-green-3' : 'text-red-3'">
              {{ devuelta >= 0 ? 'DEVUELTA' : 'FALTA' }}
            </div>
            <div class="text-h4 text-weight-bold" :class="devuelta >= 0 ? 'text-green-4' : 'text-red-4'">
              $ {{ Math.abs(devuelta).toFixed(2) }}
            </div>
          </div>
        </q-card-section>

        <q-card-actions align="right" class="q-px-md q-pb-md">
          <q-btn flat label="Cancelar" color="grey-5" v-close-popup />
          <q-btn
            label="Confirmar y Guardar"
            color="green-6"
            icon="check_circle"
            :disable="devuelta < 0"
            @click="confirmarEfectivo"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- ===== MODAL OTROS PAGOS ===== -->
    <q-dialog v-model="showOtrosPagosDialog" persistent>
      <q-card dark style="min-width: 500px; max-width: 600px; border-radius: 16px; background: #1a2035;">
        <q-card-section class="row items-center q-pb-none">
          <q-icon name="account_balance_wallet" color="purple-4" size="md" class="q-mr-sm" />
          <div class="text-h6 text-purple-4 text-weight-bold">Pagos Combinados</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section>
          <!-- Total y pendiente -->
          <div class="row q-gutter-sm q-mb-md">
            <div class="col rounded-borders q-pa-sm" style="background: rgba(255,255,255,0.05);">
              <div class="text-caption text-blue-3">TOTAL</div>
              <div class="text-h6 text-weight-bold">$ {{ totales.total }}</div>
            </div>
            <div class="col rounded-borders q-pa-sm" :style="restanteOtrosPagos > 0 ? 'background: rgba(255,152,0,0.15)' : 'background: rgba(76,175,80,0.15)'">
              <div class="text-caption" :class="restanteOtrosPagos > 0 ? 'text-orange-3' : 'text-green-3'">PENDIENTE</div>
              <div class="text-h6 text-weight-bold" :class="restanteOtrosPagos > 0 ? 'text-orange-4' : 'text-green-4'">
                $ {{ restanteOtrosPagos.toFixed(2) }}
              </div>
            </div>
          </div>

          <!-- Fila nueva -->
          <div class="row q-gutter-sm items-end q-mb-md">
            <div class="col">
              <q-select
                v-model="otrosPagoNuevo.fpago"
                :options="mediosPago"
                option-label="descripcion"
                option-value="codigo"
                emit-value
                map-options
                label="Medio de pago"
                dark
                outlined
                dense
                label-color="blue-2"
                @update:model-value="onOtroPagoMedioSelected"
              />
            </div>
            <div class="col">
              <q-input
                v-model.number="otrosPagoNuevo.valor_pago"
                label="Valor"
                type="number"
                dark
                outlined
                dense
                label-color="blue-2"
                prefix="$"
              />
            </div>
            <q-btn icon="add" color="primary" round dense @click="agregarOtroPago" />
          </div>

          <!-- Lista de pagos -->
          <q-list dark bordered separator class="rounded-borders q-mb-sm" style="min-height: 60px;">
            <q-item v-if="otrosPagos.length === 0">
              <q-item-section class="text-grey text-caption text-center">Sin pagos agregados</q-item-section>
            </q-item>
            <q-item v-for="(p, i) in otrosPagos" :key="i">
              <q-item-section>
                <q-item-label>{{ p.descripcion }}</q-item-label>
              </q-item-section>
              <q-item-section side>
                <div class="text-weight-bold text-green-4">$ {{ p.valor_pago.toFixed(2) }}</div>
              </q-item-section>
              <q-item-section side>
                <q-btn icon="delete" flat dense round color="red-4" size="sm" @click="otrosPagos.splice(i, 1)" />
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>

        <q-card-actions align="right" class="q-px-md q-pb-md">
          <q-btn flat label="Cancelar" color="grey-5" v-close-popup />
          <q-btn
            label="Confirmar y Guardar"
            color="purple-6"
            icon="check_circle"
            :disable="Math.abs(restanteOtrosPagos) > 0.01 || otrosPagos.length === 0"
            @click="confirmarOtrosPagos"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

  </q-page>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch, onMounted } from 'vue';
import { useQuasar } from 'quasar';
import { useAuthStore } from 'src/stores/auth';
import { salidasApi, type ClienteResult, type MedioPago } from 'src/api/salidas';

const $q = useQuasar();
const authStore = useAuthStore();

// ---- Factura header ----
interface ClienteOption {
  label: string;
  value: string;
  data: ClienteResult;
}

const factura = reactive({
  clienteObj: null as ClienteOption | null,
  cliente: '',
  direccion: '',
  formaPago: null as number | null,
  plazo: 0,
  tipo: 1,
  vendedor: null as string | null,
});

const mediosPago = ref<MedioPago[]>([]);

// ---- Cliente AJAX select ----
const clienteOptions = ref<ClienteOption[]>([]);

async function filterClientes(val: string, update: (cb: () => void) => void) {
  const q = val.trim() === '' ? '22222222222' : val;
  try {
    const { data } = await salidasApi.getClientes(q);
    update(() => {
      clienteOptions.value = data.map((c: ClienteResult) => ({
        label: c.identificacion + ' - ' + c.nombres,
        value: c.identificacion,
        data: c,
      }));
    });
  } catch (err) {
    console.error('Error al buscar clientes:', err);
    update(() => { clienteOptions.value = []; });
  }
}

function onClienteSelected(selected: ClienteOption | null) {
  if (!selected) return;
  factura.cliente = selected.value;
  factura.direccion = selected.data?.direccion ?? '';
}

onMounted(async () => {
  try {
    const [clientesRes, mediosRes] = await Promise.all([
      salidasApi.getClientes('22222222222'),
      salidasApi.getMediosPago(),
    ]);

    mediosPago.value = mediosRes.data;

    if (clientesRes.data.length > 0) {
      const cf = clientesRes.data[0];
      const opt: ClienteOption = {
        label: cf.identificacion + ' - ' + cf.nombres,
        value: cf.identificacion,
        data: cf,
      };
      clienteOptions.value = [opt];
      factura.clienteObj = opt;
      factura.cliente = cf.identificacion;
      factura.direccion = cf.direccion ?? '';
    }
  } catch (err) {
    console.error('Error al cargar datos iniciales:', err);
  }
});

// ---- Productos AJAX select ----
const productoOptions = ref<any[]>([]);

// ---- Inventario (talla/color dinámicos) ----
const inventarioRows = ref<any[]>([]);
const tallaOptions = ref<{ label: string; value: string }[]>([]);
const colorOptions = ref<{ label: string; value: string; unidades: number }[]>([]);
const stockDisponible = ref<number | null>(null);

async function filterProductos(val: string, update: (cb: () => void) => void) {
  try {
    const { data } = await salidasApi.getItems(val);
    update(() => {
      productoOptions.value = data.map((i: any) => ({
        label: `${i.item} — ${i.descripcion}`,
        value: i.item,
        data: i,
      }));
    });
  } catch (err) {
    console.error('Error al buscar items:', err);
    update(() => {
      productoOptions.value = [];
    });
  }
}

async function onItemSelected(selected: any) {
  if (!selected) return;
  // selected puede ser el objeto opción completo (cuando no tiene emit-value)
  const opt = typeof selected === 'object' && selected.data
    ? selected
    : productoOptions.value.find((o) => o.value === selected);
  if (!opt?.data) return;
  const i = opt.data;
  itemRow.item = opt.value;
  itemRow.descripcion = i.descripcion ?? '';
  itemRow.iva = i.por_iva ?? 0;
  itemRow.precio = i.ult_pventa ?? 0;
  itemRow.talla = '';
  itemRow.cod_color = '';
  itemRow.color = '';
  colorOptions.value = [];
  stockDisponible.value = null;
  recalcItem();

  // Cargar inventario para tallas/colores dinámicos
  const empresaId = authStore.user?.empresaId ?? 0;
  try {
    const { data } = await salidasApi.getInventario(opt.value, empresaId);
    inventarioRows.value = data;

    if (data.length === 0) {
      $q.notify({
        type: 'warning',
        icon: 'inventory_2',
        message: `Sin stock disponible`,
        caption: `El item "${opt.value} — ${i.descripcion}" no tiene existencias en esta sucursal.`,
        timeout: 4000,
      });
      tallaOptions.value = [];
      return;
    }

    // Verificar si hay stock real (unidades > 0)
    const conStock = data.filter((r: any) => Number(r.unidades) > 0);
    if (conStock.length === 0) {
      $q.notify({
        type: 'warning',
        icon: 'remove_shopping_cart',
        message: `Stock agotado`,
        caption: `El item "${opt.value}" tiene registros pero con 0 unidades en esta sucursal.`,
        timeout: 4000,
      });
    }

    tallaOptions.value = [...new Set(data.map((r: any) => r.talla))]
      .filter(Boolean)
      .map((t: any) => ({ label: String(t), value: String(t) }));
  } catch (err) {
    console.error('Error al cargar inventario:', err);
    inventarioRows.value = [];
    tallaOptions.value = [];
  }

  setTimeout(() => {
    if (inputCantidad.value) {
      inputCantidad.value.focus();
      (inputCantidad.value as any).select?.();
    }
  }, 100);
}

function onTallaSelected(talla: string) {
  const rowsForTalla = inventarioRows.value.filter((r) => r.talla === talla);
  colorOptions.value = rowsForTalla.map((r) => ({
    label: `${r.color}${Number(r.unidades) === 0 ? ' (agotado)' : ` — ${r.unidades} uds`}`,
    value: r.cod_color,
    unidades: Number(r.unidades),
  }));
  itemRow.cod_color = '';
  itemRow.color = '';
  stockDisponible.value = null;

  if (colorOptions.value.length === 0) {
    $q.notify({
      type: 'warning',
      icon: 'palette',
      message: 'Sin colores disponibles',
      caption: `No hay colores registrados para la talla ${talla} en esta sucursal.`,
      timeout: 3000,
    });
  }
}

function onColorSelected(cod_color: string) {
  const found = colorOptions.value.find((c) => c.value === cod_color);
  const invRow = inventarioRows.value.find((r) => r.cod_color === cod_color && r.talla === itemRow.talla);
  itemRow.color = invRow?.color ?? '';
  stockDisponible.value = found ? found.unidades : null;

  if (found && found.unidades === 0) {
    $q.notify({
      type: 'negative',
      icon: 'block',
      message: 'Color agotado',
      caption: `No hay unidades disponibles para este color en la talla ${itemRow.talla}.`,
      timeout: 3000,
    });
  } else if (found) {
    $q.notify({
      type: 'info',
      icon: 'inventory',
      message: `Stock disponible: ${found.unidades} unidades`,
      timeout: 2000,
    });
  }
}

// ---- Item entry row ----
const defaultItemRow = () => ({
  item: null as string | null,
  descripcion: '',
  talla: '',
  cod_color: '' as string,
  color: '' as string,
  iva: 0,
  precio: 0,
  descuento: 0,
  pvFinal: '0.00',
  pvIva: '0.00',
  cantidad: 1,
  subtotal: '0.00',
});

const itemRow = reactive(defaultItemRow());
const inputCantidad = ref<any>(null);


function recalcItem() {
  const precio = Number(itemRow.precio) || 0;
  const desc = Number(itemRow.descuento) || 0;
  const iva = Number(itemRow.iva) || 0;
  const cant = Number(itemRow.cantidad) || 0;

  const pvFinal = precio * (1 - desc / 100);
  const pvIva = pvFinal * (iva / 100);
  const subtotal = pvFinal * cant;

  itemRow.pvFinal = pvFinal.toFixed(2);
  itemRow.pvIva = pvIva.toFixed(2);
  itemRow.subtotal = subtotal.toFixed(2);
}

// ---- Items list ----
interface ItemFactura {
  item: string | null;
  descripcion: string;
  talla: string;
  cod_color: string | number;
  color: string;
  iva: number;
  precio: number;
  descuento: number;
  pvFinal: number;
  pvIva: number;
  cantidad: number;
  subtotal: number;
}

const items = ref<ItemFactura[]>([]);

function addItem() {
  if (!itemRow.item) {
    $q.notify({ type: 'warning', message: 'Seleccione un item antes de agregar.' });
    return;
  }
  if (tallaOptions.value.length > 0 && !itemRow.talla) {
    $q.notify({ type: 'warning', icon: 'straighten', message: 'Seleccione una talla.' });
    return;
  }
  if (colorOptions.value.length > 0 && !itemRow.cod_color) {
    $q.notify({ type: 'warning', icon: 'palette', message: 'Seleccione un color.' });
    return;
  }
  if (stockDisponible.value !== null && stockDisponible.value === 0) {
    $q.notify({ type: 'negative', icon: 'block', message: 'Stock agotado', caption: 'No hay unidades disponibles para este color y talla en esta sucursal.' });
    return;
  }
  if (stockDisponible.value !== null && Number(itemRow.cantidad) > stockDisponible.value) {
    $q.notify({
      type: 'negative',
      icon: 'production_quantity_limits',
      message: `Cantidad excede el stock`,
      caption: `Solo hay ${stockDisponible.value} unidades disponibles. Solicitaste ${itemRow.cantidad}.`,
      timeout: 4000,
    });
    return;
  }
  if (Number(itemRow.cantidad) <= 0) {
    $q.notify({ type: 'warning', message: 'La cantidad debe ser mayor a 0.' });
    return;
  }
  items.value.push({
    item: itemRow.item,
    descripcion: '',
    talla: itemRow.talla,
    cod_color: itemRow.cod_color,
    color: itemRow.color,
    iva: Number(itemRow.iva),
    precio: Number(itemRow.precio),
    descuento: Number(itemRow.descuento),
    pvFinal: parseFloat(itemRow.pvFinal),
    pvIva: parseFloat(itemRow.pvIva),
    cantidad: Number(itemRow.cantidad),
    subtotal: parseFloat(itemRow.subtotal),
  });
  Object.assign(itemRow, defaultItemRow());
  inventarioRows.value = [];
  tallaOptions.value = [];
  colorOptions.value = [];
  stockDisponible.value = null;
}

function removeItem(index: number) {
  items.value.splice(index, 1);
}

// ---- Table columns ----
const columns = [
  { name: 'item', label: 'Item', field: 'item', align: 'left' as const },
  { name: 'descripcion', label: 'Descripción', field: 'descripcion', align: 'left' as const },
  { name: 'talla', label: 'Talla', field: 'talla', align: 'center' as const },
  { name: 'color', label: 'Color', field: 'color', align: 'center' as const },
  { name: 'iva', label: '%Iva', field: 'iva', align: 'center' as const },
  { name: 'precio', label: 'P/Venta', field: 'precio', align: 'right' as const, format: (v: number) => `$${v.toFixed(2)}` },
  { name: 'descuento', label: '% Desc', field: 'descuento', align: 'center' as const },
  { name: 'pvFinal', label: 'P/Final', field: 'pvFinal', align: 'right' as const, format: (v: number) => `$${v.toFixed(2)}` },
  { name: 'pvIva', label: 'P/Iva', field: 'pvIva', align: 'right' as const, format: (v: number) => `$${v.toFixed(2)}` },
  { name: 'cantidad', label: 'Cant', field: 'cantidad', align: 'center' as const },
  { name: 'subtotal', label: 'Subtotal', field: 'subtotal', align: 'right' as const, format: (v: number) => `$${v.toFixed(2)}` },
  { name: 'acciones', label: '', field: 'acciones', align: 'center' as const },
];

// ---- Totals ----
const totales = reactive({
  subtotal: '0.00',
  descuento: '0.00',
  iva: '0.00',
  total: '0.00',
});

watch(
  items,
  (list) => {
    let subtotal = 0;
    let descuento = 0;
    let iva = 0;

    for (const it of list) {
      subtotal += it.pvFinal * it.cantidad;
      descuento += (it.precio * (it.descuento / 100)) * it.cantidad;
      iva += it.pvIva * it.cantidad;
    }

    const total = subtotal + iva;
    totales.subtotal = subtotal.toFixed(2);
    totales.descuento = descuento.toFixed(2);
    totales.iva = iva.toFixed(2);
    totales.total = total.toFixed(2);
  },
  { deep: true }
);

// ---- Efectivo modal ----
const showEfectivoDialog = ref(false);
const efectivoPagado = ref(0);
const devuelta = computed(() => efectivoPagado.value - parseFloat(totales.total));
const montosRapidos = computed(() => {
  const total = parseFloat(totales.total);
  const bases = [1000, 2000, 5000, 10000, 20000, 50000, 100000];
  const result = [parseFloat(total.toFixed(0))];
  for (const b of bases) {
    const r = Math.ceil(total / b) * b;
    if (r > total && !result.includes(r)) result.push(r);
    if (result.length >= 6) break;
  }
  return result.slice(0, 6);
});

// ---- Otros pagos modal ----
const showOtrosPagosDialog = ref(false);
interface OtroPago { fpago: number; descripcion: string; valor_pago: number; }
const otrosPagos = ref<OtroPago[]>([]);
const otrosPagoNuevo = reactive({ fpago: null as number | null, descripcion: '', valor_pago: 0 });
const totalOtrosPagos = computed(() => otrosPagos.value.reduce((s, p) => s + p.valor_pago, 0));
const restanteOtrosPagos = computed(() => parseFloat(totales.total) - totalOtrosPagos.value);

function onOtroPagoMedioSelected(codigo: number) {
  const mp = mediosPago.value.find((m) => m.codigo === codigo);
  otrosPagoNuevo.descripcion = mp?.descripcion ?? '';
  // Pre-fill con el restante
  otrosPagoNuevo.valor_pago = parseFloat(Math.max(0, restanteOtrosPagos.value).toFixed(2));
}

function agregarOtroPago() {
  if (!otrosPagoNuevo.fpago) {
    $q.notify({ type: 'warning', message: 'Seleccione un medio de pago.' });
    return;
  }
  if (!otrosPagoNuevo.valor_pago || otrosPagoNuevo.valor_pago <= 0) {
    $q.notify({ type: 'warning', message: 'Ingrese un valor mayor a 0.' });
    return;
  }
  otrosPagos.value.push({
    fpago: otrosPagoNuevo.fpago,
    descripcion: otrosPagoNuevo.descripcion,
    valor_pago: otrosPagoNuevo.valor_pago,
  });
  otrosPagoNuevo.fpago = null;
  otrosPagoNuevo.descripcion = '';
  otrosPagoNuevo.valor_pago = 0;
}

// ---- Payload builder ----
function buildPayload(efectivo = 0, cambio = 0, otrosPagosArr: OtroPago[] = []) {
  const empresaId = authStore.user?.empresaId ?? 0;
  return {
    enc: {
      ident: factura.cliente || factura.clienteObj?.value || '',
      empresa_id: empresaId,
      nombre: factura.clienteObj?.data?.nombres ?? factura.cliente ?? '',
      direccion: factura.direccion ?? '',
      forma_pago: factura.formaPago!,
      plazo: factura.plazo ?? 0,
      tipo: factura.tipo,
      total: parseFloat(totales.total),
      subtotal: parseFloat(totales.subtotal),
      iva: parseFloat(totales.iva),
      descuento: parseFloat(totales.descuento),
      vendedor: factura.vendedor ?? '',
      efectivo,
      cambio,
    },
    det: {
      rows: items.value.map((it) => ({
        item: it.item ?? '',
        nombre: it.descripcion ?? '',
        talla: it.talla,
        color: Number(it.cod_color),
        cantidad: it.cantidad,
        pventa: it.precio,
        pdesc: it.descuento,
        pvfinal: it.pvFinal,
        pvfinaliva: it.pvFinal + it.pvIva,
        por_iva: it.iva,
        subtotal: it.subtotal,
      })),
    },
    detotrospagos: otrosPagosArr.map((p) => ({
      fpago: p.fpago,
      valor_pago: p.valor_pago,
      nro_nota: 0,
    })),
  };
}

async function ejecutarGuardar(payload: ReturnType<typeof buildPayload>) {
  try {
    const { data } = await salidasApi.registrarFactura(payload);
    $q.notify({ type: 'positive', icon: 'receipt', message: `Factura guardada: #${data.rpta}` });
    showEfectivoDialog.value = false;
    showOtrosPagosDialog.value = false;
    // Reset form
    items.value = [];
    otrosPagos.value = [];
  } catch {
    $q.notify({ type: 'negative', message: 'Error al guardar la factura.' });
  }
}

// ---- Save ----
function validarFormulario(): boolean {
  if (!items.value.length) {
    $q.notify({ type: 'warning', message: 'Agregue al menos un item antes de guardar.' });
    return false;
  }
  if (!factura.formaPago) {
    $q.notify({ type: 'warning', message: 'Seleccione una forma de pago.' });
    return false;
  }
  return true;
}

async function guardar() {
  if (!validarFormulario()) return;

  // Si es efectivo (código 1), mostrar modal calculadora
  if (factura.formaPago === 1) {
    efectivoPagado.value = parseFloat(totales.total);
    showEfectivoDialog.value = true;
  } else {
    await ejecutarGuardar(buildPayload());
  }
}

async function confirmarEfectivo() {
  if (devuelta.value < 0) {
    $q.notify({ type: 'warning', message: 'El monto recibido es menor al total.' });
    return;
  }
  await ejecutarGuardar(buildPayload(efectivoPagado.value, devuelta.value));
}

async function guardarOtros() {
  if (!validarFormulario()) return;
  otrosPagos.value = [];
  otrosPagoNuevo.fpago = null;
  otrosPagoNuevo.valor_pago = parseFloat(totales.total);
  showOtrosPagosDialog.value = true;
}

async function confirmarOtrosPagos() {
  if (Math.abs(restanteOtrosPagos.value) > 0.01) {
    $q.notify({ type: 'warning', message: 'Los pagos no suman el total de la factura.' });
    return;
  }
  await ejecutarGuardar(buildPayload(0, 0, otrosPagos.value));
}
</script>

<style scoped>
.border-top {
  border-top: 1px solid #e0e0e0;
}
</style>
