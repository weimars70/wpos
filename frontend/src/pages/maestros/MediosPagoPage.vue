<template>
  <q-page padding>
    <div class="row items-center justify-between q-mb-md">
      <div class="text-h5 text-primary text-weight-bold">Medios de pago</div>
      <q-btn color="primary" icon="add" label="Agregar Medios de pago" @click="openNew" class="shadow-1 q-px-md rounded-borders"/>
    </div>

    <!-- Tabla CRUD -->
    <q-table
      :rows="rows"
      :columns="columns"
      row-key="codigo"
      class="col header-tablet border-table border-row width-tablet full-height-table"
      :loading="loading"
      no-data-label="No hay datos disponibles"
      :pagination="{ rowsPerPage: 0 }"
      virtual-scroll
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
      <q-card style="min-width: 400px; border-radius: 12px;">
        <q-card-section class="bg-primary text-white row items-center">
          <div class="text-h6">{{ isEditing ? 'Editar' : 'Nuevo' }} Medios de pago</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section class="q-pt-md">
          <q-form @submit="saveData" class="q-gutter-md">
            <q-input v-model.number="formData.codigo" type="number" label="Código" outlined dense :disable="isEditing" lazy-rules :rules="[val => val !== null || 'Obligatorio']" />
            <q-input v-model="formData.descripcion" label="Descripción" outlined dense lazy-rules :rules="[val => !!val || 'Obligatorio']" />
            <q-toggle v-model="formData.abonos" label="Abonos" color="primary" />
            <q-toggle v-model="formData.facturas" label="Facturas" color="primary" />
            <q-toggle v-model="formData.devoluciones" label="Devoluciones" color="primary" />
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
import { ref, reactive, onMounted } from 'vue';
import { useQuasar } from 'quasar';
import { api } from 'src/boot/axios';

const $q = useQuasar();

// Estado
const loading = ref(false);
const saving = ref(false);
const showForm = ref(false);
const isEditing = ref(false);

const formData = reactive({
  codigo: null as number | null,
  descripcion: '' as string,
  abonos: false as boolean,
  facturas: false as boolean,
  devoluciones: false as boolean
});

// Definición de tabla
const columns = [
  { name: 'codigo', label: 'Código', field: 'codigo', align: 'left', sortable: true },
  { name: 'descripcion', label: 'Descripción', field: 'descripcion', align: 'left', sortable: true },
  { name: 'abonos', label: 'Abonos', field: 'abonos', align: 'left', sortable: true },
  { name: 'facturas', label: 'Facturas', field: 'facturas', align: 'left', sortable: true },
  { name: 'devoluciones', label: 'Devoluciones', field: 'devoluciones', align: 'left', sortable: true },
  { name: 'actions', label: 'Acciones', field: 'actions', align: 'center' }
] as any[];

const rows = ref<any[]>([]);

onMounted(() => {
  fetchRows();
});

async function fetchRows() {
  loading.value = true;
  try {
    const response = await api.get('/api/medios-pago');
    rows.value = response.data;
  } catch (error) {
    $q.notify({ type: 'negative', message: 'Error cargando datos' });
  } finally {
    loading.value = false;
  }
}

function openNew() {
  isEditing.value = false;
  formData.codigo = null;
  formData.descripcion = '';
  formData.abonos = false;
  formData.facturas = false;
  formData.devoluciones = false;
  showForm.value = true;
}

function editRow(row: any) {
  isEditing.value = true;
  formData.codigo = row.codigo;
  formData.descripcion = row.descripcion;
  formData.abonos = row.abonos;
  formData.facturas = row.facturas;
  formData.devoluciones = row.devoluciones;
  showForm.value = true;
}

function deleteRow(row: any) {
  $q.dialog({
    title: 'Confirmar eliminación',
    message: `¿Estás seguro que deseas eliminar el registro?`,
    cancel: true,
    persistent: true
  }).onOk(async () => {
    try {
      await api.delete(`/api/medios-pago/${row.codigo}`);
      $q.notify({ type: 'positive', message: 'Registro eliminado' });
      fetchRows();
    } catch (error) {
      $q.notify({ type: 'negative', message: 'Error al eliminar' });
    }
  });
}

async function saveData() {
  saving.value = true;
  try {
    const payload = {
      codigo: formData.codigo,
      descripcion: formData.descripcion,
      abonos: formData.abonos,
      facturas: formData.facturas,
      devoluciones: formData.devoluciones
    };
    if (isEditing.value) {
      await api.put(`/api/medios-pago/${formData.codigo}`, payload);
      $q.notify({ type: 'positive', message: 'Registro actualizado' });
    } else {
      await api.post(`/api/medios-pago`, payload);
      $q.notify({ type: 'positive', message: 'Registro creado' });
    }
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

.width-tablet {
  width: 50vw;
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
