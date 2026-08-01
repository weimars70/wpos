<template>
  <q-page padding>
    <div class="row items-center justify-between q-mb-md">
      <div class="text-h5 text-primary text-weight-bold">Items</div>
      <q-btn color="primary" icon="add" label="Agregar Items" @click="openNew" class="shadow-1 q-px-md rounded-borders"/>
    </div>

    <div class="row items-center q-mb-md">
      <q-btn-toggle
        v-model="estadoFiltro"
        toggle-color="primary"
        outline
        dense
        :options="[
          { label: 'Activos', value: 'activos' },
          { label: 'Inactivos', value: 'inactivos' },
          { label: 'Todos', value: 'todos' },
        ]"
        @update:model-value="fetchRows"
      />
    </div>

    <!-- Tabla CRUD -->
    <q-table
      :rows="rows"
      :columns="columns"
      row-key="item"
      class="rounded-borders shadow-1"
      :loading="loading"
      no-data-label="No hay datos disponibles"
    >
      <template v-slot:body-cell-actions="props">
        <q-td :props="props" class="q-gutter-sm">
          <q-btn flat round color="blue" icon="edit" size="sm" @click="editRow(props.row)">
            <q-tooltip>Editar</q-tooltip>
          </q-btn>
          <q-btn flat round color="red" icon="delete" size="sm" @click="deleteRow(props.row)">
            <q-tooltip>Eliminar</q-tooltip>
          </q-btn>
        </q-td>
      </template>
    </q-table>

    <!-- Modal Formulario -->
    <q-dialog v-model="showForm" persistent>
      <q-card style="width: 1100px; max-width: 95vw; border-radius: 12px;">
        <q-card-section class="bg-primary text-white row items-center">
          <div class="text-h6">{{ isEditing ? 'Editar' : 'Nuevo' }} Item</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section class="q-pt-md" style="max-height: 75vh; overflow-y: auto;">
          <q-form @submit="saveData">

            <div class="text-subtitle2 text-primary q-mb-sm">Identificación</div>
            <div class="row q-col-gutter-md q-mb-md">
              <div class="col-12 col-md-4">
                <q-input v-model.number="formData.item" type="number" label="Item (Código)" outlined dense :disable="isEditing" lazy-rules :rules="[val => val !== null || 'Obligatorio']" />
              </div>
              <div class="col-12 col-md-8">
                <q-input v-model="formData.descripcion" label="Descripción" outlined dense lazy-rules :rules="[val => !!val || 'Obligatorio']" />
              </div>
              <div class="col-12 col-md-4">
                <q-select v-model="formData.grupo_codigo" :options="grupoOptions" option-value="value" option-label="label" emit-value map-options label="Grupo" outlined dense clearable />
              </div>
              <div class="col-12 col-md-4">
                <q-select v-model="formData.item_tipo_iva" :options="tipoIvaOptions" option-value="value" option-label="label" emit-value map-options label="Tipo IVA" outlined dense clearable />
              </div>
              <div class="col-12 col-md-4 flex items-center">
                <q-toggle v-model="formData.activo" label="Activo" color="primary" />
              </div>
            </div>

            <q-separator class="q-mb-md" />

            <div class="text-subtitle2 text-primary q-mb-sm">Precios y márgenes</div>
            <div class="row q-col-gutter-md q-mb-md">
              <div class="col-12 col-md-4">
                <q-input v-model.number="formData.por_iva" type="number" label="% IVA" outlined dense />
              </div>
              <div class="col-12 col-md-4">
                <q-input v-model.number="formData.por_ganmin" type="number" label="% Gan. Min" outlined dense />
              </div>
              <div class="col-12 col-md-4">
                <q-input v-model.number="formData.por_ganmax" type="number" label="% Gan. Max" outlined dense />
              </div>
              <div class="col-12 col-md-4">
                <q-input v-model.number="formData.ult_pcompra" type="number" label="Ult. Prm. Compra" outlined dense />
              </div>
              <div class="col-12 col-md-4">
                <q-input v-model.number="formData.ult_pventa" type="number" label="Ult. Prm. Venta" outlined dense />
              </div>
              <div class="col-12 col-md-4">
                <q-input v-model.number="formData.promocion" type="number" label="Promoción" outlined dense />
              </div>
              <div class="col-12 col-md-4">
                <q-input v-model.number="formData.precio_venta2" type="number" label="Precio Venta 2" outlined dense />
              </div>
              <div class="col-12 col-md-4">
                <q-input v-model.number="formData.precio_venta3" type="number" label="Precio Venta 3" outlined dense />
              </div>
            </div>

            <q-separator class="q-mb-md" />

            <div class="text-subtitle2 text-primary q-mb-sm">Clasificación (tallas y colores que maneja este item)</div>
            <div class="row q-col-gutter-md q-mb-md">
              <div class="col-12 col-md-6">
                <q-select
                  v-model="coloresSeleccionados"
                  :options="colorOptions"
                  option-value="value"
                  option-label="label"
                  emit-value
                  map-options
                  multiple
                  use-chips
                  label="Colores"
                  outlined
                  dense
                  hint="Selecciona todos los colores que maneja el item"
                />
              </div>
              <div class="col-12 col-md-6">
                <q-select
                  v-model="tallasSeleccionadas"
                  :options="tallaOptions"
                  option-value="value"
                  option-label="label"
                  emit-value
                  map-options
                  multiple
                  use-chips
                  label="Tallas"
                  outlined
                  dense
                  hint="Selecciona todas las tallas que maneja el item"
                />
              </div>
            </div>

            <q-separator class="q-mb-md" />

            <div class="text-subtitle2 text-primary q-mb-sm">Imagen</div>
            <div class="row q-col-gutter-md q-mb-md items-center">
              <div class="col-12 col-md-6">
                <q-file
                  v-model="imagenFile"
                  label="Subir imagen"
                  outlined
                  dense
                  accept="image/*"
                  :loading="uploadingImagen"
                  @update:model-value="onImagenSeleccionada"
                >
                  <template #prepend>
                    <q-icon name="image" />
                  </template>
                </q-file>
              </div>
              <div class="col-12 col-md-6">
                <div v-if="formData.imagen" class="row items-center q-gutter-sm">
                  <q-img :src="imagenUrl" style="width: 90px; height: 90px; border-radius: 8px;" fit="cover" />
                  <q-btn flat dense round icon="close" color="red" @click="quitarImagen">
                    <q-tooltip>Quitar imagen</q-tooltip>
                  </q-btn>
                </div>
                <div v-else class="text-grey">Sin imagen</div>
              </div>
            </div>

            <div class="row justify-end q-mt-lg">
              <q-btn label="Cancelar" color="grey" flat v-close-popup class="q-mr-sm" />
              <q-btn label="Guardar" type="submit" color="primary" unelevated class="rounded-borders q-px-md" :loading="saving"/>
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>

  </q-page>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue';
import { useQuasar } from 'quasar';
import { api } from 'src/boot/axios';

const $q = useQuasar();

// Estado
const loading = ref(false);
const saving = ref(false);
const showForm = ref(false);
const isEditing = ref(false);
const estadoFiltro = ref('activos');
const uploadingImagen = ref(false);
const imagenFile = ref<File | null>(null);

const formData = reactive({
  item: '' as string,
  descripcion: '' as string,
  grupo_codigo: null as number | null,
  por_iva: null as number | null,
  por_ganmin: null as number | null,
  por_ganmax: null as number | null,
  activo: false as boolean,
  item_tipo_iva: '' as string,
  imagen: '' as string,
  ult_pcompra: null as number | null,
  ult_pventa: null as number | null,
  precio_venta2: null as number | null,
  precio_venta3: null as number | null,
  promocion: null as number | null
});

const coloresSeleccionados = ref<number[]>([]);
const tallasSeleccionadas = ref<string[]>([]);

const imagenUrl = computed(() => {
  if (!formData.imagen) return '';
  if (formData.imagen.startsWith('http')) return formData.imagen;
  return `${api.defaults.baseURL}${formData.imagen}`;
});

// Definición de tabla (lee de view_items)
const columns = [
  { name: 'item', label: 'Item (Código)', field: 'item', align: 'left', sortable: true },
  { name: 'descripcion', label: 'Descripción', field: 'descripcion', align: 'left', sortable: true },
  { name: 'grupo', label: 'Grupo', field: 'grupo', align: 'left', sortable: true },
  { name: 'tipo_iva', label: 'Tipo IVA', field: 'tipo_iva', align: 'left', sortable: true },
  { name: 'por_iva', label: '% IVA', field: 'por_iva', align: 'left', sortable: true },
  { name: 'por_ganmin', label: '% Gan. Min', field: 'por_ganmin', align: 'left', sortable: true },
  { name: 'por_ganmax', label: '% Gan. Max', field: 'por_ganmax', align: 'left', sortable: true },
  { name: 'activo', label: 'Activo', field: 'activo', align: 'left', sortable: true },
  { name: 'ult_pcompra', label: 'Ult. Prm. Compra', field: 'ult_pcompra', align: 'left', sortable: true },
  { name: 'ult_pventa', label: 'Ult. Prm. Venta', field: 'ult_pventa', align: 'left', sortable: true },
  { name: 'precio2', label: 'Precio Venta 2', field: 'precio2', align: 'left', sortable: true },
  { name: 'precio3', label: 'Precio Venta 3', field: 'precio3', align: 'left', sortable: true },
  { name: 'promocion', label: 'Promoción', field: 'promocion', align: 'left', sortable: true },
  { name: 'actions', label: 'Acciones', field: 'actions', align: 'center' }
] as any[];

const rows = ref<any[]>([]);

// Opciones para los selects (maestros)
const grupoOptions = ref<any[]>([]);
const tipoIvaOptions = ref<any[]>([]);
const colorOptions = ref<any[]>([]);
const tallaOptions = ref<any[]>([]);

onMounted(() => {
  fetchRows();
  fetchOptions();
});

async function fetchOptions() {
  try {
    const [grupos, tiposIva, colores, tallas] = await Promise.all([
      api.get('/api/grupos-items'),
      api.get('/api/tipo-iva'),
      api.get('/api/colores'),
      api.get('/api/tallas'),
    ]);
    grupoOptions.value = grupos.data.map((g: any) => ({ label: `${g.codigo} - ${g.descripcion}`, value: g.codigo }));
    tipoIvaOptions.value = tiposIva.data.map((t: any) => ({ label: `${t.codigo} - ${t.descripcion}`, value: t.codigo }));
    colorOptions.value = colores.data.map((c: any) => ({ label: c.nombre, value: c.id }));
    tallaOptions.value = tallas.data.map((t: any) => ({ label: t.nombre, value: t.codigo }));
  } catch (error) {
    $q.notify({ type: 'negative', message: 'Error cargando maestros de apoyo' });
  }
}

async function fetchRows() {
  loading.value = true;
  try {
    const response = await api.get('/api/items', { params: { estado: estadoFiltro.value } });
    rows.value = response.data;
  } catch (error) {
    $q.notify({ type: 'negative', message: 'Error cargando datos' });
  } finally {
    loading.value = false;
  }
}

function resetForm() {
  formData.item = '';
  formData.descripcion = '';
  formData.grupo_codigo = null;
  formData.por_iva = null;
  formData.por_ganmin = null;
  formData.por_ganmax = null;
  formData.activo = false;
  formData.item_tipo_iva = '';
  formData.imagen = '';
  formData.ult_pcompra = null;
  formData.ult_pventa = null;
  formData.precio_venta2 = null;
  formData.precio_venta3 = null;
  formData.promocion = null;
  coloresSeleccionados.value = [];
  tallasSeleccionadas.value = [];
  imagenFile.value = null;
}

function openNew() {
  isEditing.value = false;
  resetForm();
  showForm.value = true;
}

async function editRow(row: any) {
  try {
    const [itemResp, coloresResp, tallasResp] = await Promise.all([
      api.get(`/api/items/${row.item}`),
      api.get(`/api/items/${row.item}/colores`),
      api.get(`/api/items/${row.item}/tallas`),
    ]);
    const item = itemResp.data;
    isEditing.value = true;
    formData.item = item.item;
    formData.descripcion = item.descripcion;
    formData.grupo_codigo = item.grupo_codigo;
    formData.por_iva = item.por_iva;
    formData.por_ganmin = item.por_ganmin;
    formData.por_ganmax = item.por_ganmax;
    formData.activo = item.activo;
    formData.item_tipo_iva = item.item_tipo_iva;
    formData.imagen = item.imagen;
    formData.ult_pcompra = item.ult_pcompra;
    formData.ult_pventa = item.ult_pventa;
    formData.precio_venta2 = item.precio_venta2;
    formData.precio_venta3 = item.precio_venta3;
    formData.promocion = item.promocion;
    coloresSeleccionados.value = coloresResp.data.map((c: any) => c.color_codigo);
    tallasSeleccionadas.value = tallasResp.data.map((t: any) => t.talla);
    imagenFile.value = null;
    showForm.value = true;
  } catch (error) {
    $q.notify({ type: 'negative', message: 'Error cargando el item' });
  }
}

function deleteRow(row: any) {
  $q.dialog({
    title: 'Confirmar eliminación',
    message: `¿Estás seguro que deseas eliminar el registro?`,
    cancel: true,
    persistent: true
  }).onOk(async () => {
    try {
      await api.delete(`/api/items/${row.item}`);
      $q.notify({ type: 'positive', message: 'Registro eliminado' });
      fetchRows();
    } catch (error) {
      $q.notify({ type: 'negative', message: 'Error al eliminar' });
    }
  });
}

async function onImagenSeleccionada(file: File | null) {
  if (!file) return;
  uploadingImagen.value = true;
  try {
    const form = new FormData();
    form.append('file', file);
    if (formData.imagen) {
      form.append('oldUrl', formData.imagen);
    }
    const response = await api.post('/api/items/upload-imagen', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    formData.imagen = response.data.url;
  } catch (error) {
    $q.notify({ type: 'negative', message: 'Error al subir la imagen' });
  } finally {
    uploadingImagen.value = false;
  }
}

function quitarImagen() {
  formData.imagen = '';
  imagenFile.value = null;
}

async function saveData() {
  saving.value = true;
  try {
    const payload = {
      item: formData.item,
      descripcion: formData.descripcion,
      grupo_codigo: formData.grupo_codigo,
      por_iva: formData.por_iva,
      por_ganmin: formData.por_ganmin,
      por_ganmax: formData.por_ganmax,
      activo: formData.activo,
      item_tipo_iva: formData.item_tipo_iva,
      imagen: formData.imagen,
      ult_pcompra: formData.ult_pcompra,
      ult_pventa: formData.ult_pventa,
      precio_venta2: formData.precio_venta2,
      precio_venta3: formData.precio_venta3,
      promocion: formData.promocion
    };
    if (isEditing.value) {
      await api.put(`/api/items/${formData.item}`, payload);
      $q.notify({ type: 'positive', message: 'Registro actualizado' });
    } else {
      await api.post(`/api/items`, payload);
      $q.notify({ type: 'positive', message: 'Registro creado' });
    }
    await Promise.all([
      api.put(`/api/items/${formData.item}/colores`, { colores: coloresSeleccionados.value }),
      api.put(`/api/items/${formData.item}/tallas`, { tallas: tallasSeleccionadas.value }),
    ]);
    showForm.value = false;
    fetchRows();
  } catch (error) {
    $q.notify({ type: 'negative', message: 'Error al procesar el guardado' });
  } finally {
    saving.value = false;
  }
}
</script>

<style scoped>
.rounded-borders {
  border-radius: 8px;
}
</style>
