<template>  
  <q-page class="q-pa-md column no-wrap overflow-hidden" style="min-height: unset !important; height: calc(100vh - 95px); max-height: calc(100vh - 95px);">
    <div class="col-auto row items-center justify-between q-mb-md">
      <div class="row items-center q-gutter-md">
        <div class="text-h5 text-primary text-weight-bold">Items</div>
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
      <q-btn color="primary" icon="add" label="Agregar Items" @click="openNew" class="shadow-1 q-px-md rounded-borders"/>
    </div>

    <!-- Tabla CRUD -->
    <q-table
      :rows="rows"      
      :columns="columns"
      row-key="item"      
      class="col header-tablet border-table border-row full-height-table"      
      :loading="loading"
      no-data-label="No hay datos disponibles"
      :pagination="{ rowsPerPage: 0 }"
      virtual-scroll  
    >
      <template v-slot:body-cell-imagen="props">
        <q-td :props="props" align="center">
          <div
            v-if="props.row.imagen && normalizeImagePath(props.row.imagen)"
            class="cursor-pointer inline-block"
            @click="ampliarImagen(props.row.imagen)"
          >
            <q-avatar square size="42px" class="rounded-borders overflow-hidden bg-grey-3 shadow-1">
              <q-img :src="normalizeImagePath(props.row.imagen)" fit="cover" />
            </q-avatar>
            <q-tooltip>Clic para ampliar imagen</q-tooltip>
          </div>
          <q-icon v-else name="image" color="grey-5" size="24px">
            <q-tooltip>Sin imagen</q-tooltip>
          </q-icon>
        </q-td>
      </template>
      <template v-slot:body-cell-actions="props">
        <q-td :props="props" align="center">
          <div class="row items-center justify-center no-wrap q-gutter-xs">
            <q-btn
              unelevated
              round
              dense
              size="sm"
              color="indigo-1"
              text-color="indigo-9"
              icon="edit_note"
              @click="editRow(props.row)"
              class="action-btn shadow-1"
            >
              <q-tooltip class="bg-indigo-9 text-caption">Editar Item</q-tooltip>
            </q-btn>
            <q-btn
              unelevated
              round
              dense
              size="sm"
              color="pink-1"
              text-color="pink-8"
              icon="delete_forever"
              @click="deleteRow(props.row)"
              class="action-btn shadow-1"
            >
              <q-tooltip class="bg-pink-9 text-caption">Eliminar Item</q-tooltip>
            </q-btn>
          </div>
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
                <div v-if="formData.imagen || localPreviewUrl" class="row items-center q-gutter-sm">
                  <div class="cursor-pointer" @click="ampliarImagen(localPreviewUrl || formData.imagen)">
                    <q-img :src="imagenUrl" style="width: 90px; height: 90px; border-radius: 8px;" fit="cover">
                      <template v-slot:error>
                        <div class="absolute-full flex flex-center bg-grey-3 text-grey-7" style="font-size: 10px; text-align: center;">
                          Imagen no encontrada
                        </div>
                      </template>
                    </q-img>
                    <q-tooltip>Clic para ampliar imagen</q-tooltip>
                  </div>
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

    <!-- Modal Zoom de Imagen -->
    <q-dialog v-model="showZoomDialog">
      <q-card style="max-width: 90vw; max-height: 90vh; border-radius: 12px; overflow: hidden;">
        <q-card-section class="row items-center q-pb-none bg-primary text-white">
          <div class="text-subtitle1 text-weight-bold">Vista previa de imagen</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>
        <q-card-section class="q-pa-md flex flex-center bg-grey-1" style="min-width: 280px; min-height: 280px;">
          <q-img
            :src="zoomImageUrl"
            style="max-width: 80vw; max-height: 75vh; border-radius: 8px; object-fit: contain;"
          >
            <template v-slot:error>
              <div class="text-subtitle2 text-grey-7 q-pa-md">No se pudo cargar la imagen</div>
            </template>
          </q-img>
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

const localPreviewUrl = ref<string>('');
const showZoomDialog = ref(false);
const zoomImageUrl = ref<string>('');

function extractStringFromImage(img: any): string {
  if (!img) return '';
  if (typeof img === 'string') return img;
  if (typeof img === 'object') {
    if (Array.isArray(img.data)) {
      return img.data.map((c: number) => String.fromCharCode(c)).join('');
    }
    if (Array.isArray(img)) {
      return img.map((c: number) => String.fromCharCode(c)).join('');
    }
  }
  return String(img);
}

function normalizeImagePath(img: any): string {
  if (!img) return '';
  const str = extractStringFromImage(img);
  const clean = str.trim();
  if (!clean || clean === 'null' || clean === 'undefined' || clean === '[object Object]') return '';
  if (clean.startsWith('http://') || clean.startsWith('https://') || clean.startsWith('data:') || clean.startsWith('blob:')) {
    return clean;
  }
  const filename = clean.split(/[/\\]/).pop() || '';
  if (!filename || filename === 'null' || filename === 'undefined' || filename === '[object Object]') return '';

  const baseUrl = (api.defaults.baseURL || 'http://localhost:3000').replace(/\/+$/, '');
  return `${baseUrl}/uploads/items/${filename}`;
}

function ampliarImagen(img: any) {
  const url = normalizeImagePath(img);
  if (url) {
    zoomImageUrl.value = url;
    showZoomDialog.value = true;
  }
}

const imagenUrl = computed(() => {
  if (localPreviewUrl.value) return localPreviewUrl.value;
  return normalizeImagePath(formData.imagen);
});

// Definición de tabla (lee de view_items)
const columns = [
  { name: 'actions', label: 'Acciones', field: 'actions', align: 'center' },
  { name: 'imagen', label: 'Imagen', field: 'imagen', align: 'center' },
  { name: 'item', label: 'Item (Código)', field: 'item', align: 'left', sortable: true },
  { name: 'descripcion', label: 'Descripción', field: 'descripcion', align: 'left', sortable: true },
  { name: 'grupo', label: 'Grupo', field: 'grupo', align: 'left', sortable: true },
  { name: 'tipo_iva', label: 'Tipo IVA', field: 'tipo_iva', align: 'left', sortable: true },
  { name: 'por_iva', label: '% IVA', field: 'por_iva', align: 'left', sortable: true },
  { name: 'por_ganmin', label: '% Gan. Min', field: 'por_ganmin', align: 'left', sortable: true },
  { name: 'por_ganmax', label: '% Gan. Max', field: 'por_ganmax', align: 'left', sortable: true },
  { name: 'activo', label: 'Activo', field: 'activo', align: 'left', sortable: true },
  { name: 'promocion', label: 'Promoción', field: 'promocion', align: 'left', sortable: true }
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
  if (localPreviewUrl.value) {
    URL.revokeObjectURL(localPreviewUrl.value);
    localPreviewUrl.value = '';
  }
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
    const imgVal = item.imagen ?? row.imagen;
    formData.imagen = imgVal ? extractStringFromImage(imgVal) : '';
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
  if (!file) {
    if (localPreviewUrl.value) {
      URL.revokeObjectURL(localPreviewUrl.value);
      localPreviewUrl.value = '';
    }
    return;
  }
  if (localPreviewUrl.value) {
    URL.revokeObjectURL(localPreviewUrl.value);
  }
  localPreviewUrl.value = URL.createObjectURL(file);
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
  if (localPreviewUrl.value) {
    URL.revokeObjectURL(localPreviewUrl.value);
    localPreviewUrl.value = '';
  }
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
.action-btn {
  transition: transform 0.18s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.18s cubic-bezier(0.4, 0, 0.2, 1);
}
.action-btn:hover {
  transform: translateY(-2px) scale(1.12);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15) !important;
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
