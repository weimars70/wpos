<template>
  <q-page padding>
    <div class="row items-center justify-between q-mb-md">
      <div class="text-h5 text-primary text-weight-bold">Empleados</div>
      <q-btn color="primary" icon="add" label="Agregar Empleados" @click="openNew" class="shadow-1 q-px-md rounded-borders"/>
    </div>

    <!-- Tabla CRUD -->
    <q-table
      :rows="rows"
      :columns="columns"
      row-key="codigo"
      class="rounded-borders shadow-1 header-tablet border-table border-row scroll-tablet"
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
      <q-card style="min-width: 400px; border-radius: 12px;">
        <q-card-section class="bg-primary text-white row items-center">
          <div class="text-h6">{{ isEditing ? 'Editar' : 'Nuevo' }} Empleados</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section class="q-pt-md">
          <q-form @submit="saveData" class="q-gutter-md">
            <q-input v-model.number="formData.codigo" type="number" label="Código" outlined dense :disable="isEditing" lazy-rules :rules="[val => val !== null || 'Obligatorio']" />
            <q-input v-model="formData.tipoident" label="Tipo Ident." outlined dense  />
            <q-input v-model="formData.ident" label="Identificación" outlined dense  />
            <q-input v-model="formData.nombre" label="Nombre" outlined dense lazy-rules :rules="[val => !!val || 'Obligatorio']" />
            <q-input v-model="formData.direccion" label="Dirección" outlined dense  />
            <q-input v-model="formData.telefono" label="Teléfono" outlined dense  />
            <q-input v-model="formData.movil" label="Móvil" outlined dense  />
            <q-input v-model="formData.fecha" label="Fecha" outlined dense  />
            <q-input v-model="formData.usuario" label="Usuario" outlined dense  />
            <q-input v-model="formData.firma" label="Firma" outlined dense  />
            <q-input v-model="formData.profesion" label="Profesión" outlined dense  />
            <q-toggle v-model="formData.activo" label="Activo" color="primary" />
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
  tipoident: '' as string,
  ident: '' as string,
  nombre: '' as string,
  direccion: '' as string,
  telefono: '' as string,
  movil: '' as string,
  fecha: '' as string,
  usuario: '' as string,
  firma: '' as string,
  profesion: '' as string,
  activo: false as boolean
});

// Definición de tabla
const columns = [
  { name: 'codigo', label: 'Código', field: 'codigo', align: 'left', sortable: true },
  { name: 'tipoident', label: 'Tipo Ident.', field: 'tipoident', align: 'left', sortable: true },
  { name: 'ident', label: 'Identificación', field: 'ident', align: 'left', sortable: true },
  { name: 'nombre', label: 'Nombre', field: 'nombre', align: 'left', sortable: true },
  { name: 'direccion', label: 'Dirección', field: 'direccion', align: 'left', sortable: true },
  { name: 'telefono', label: 'Teléfono', field: 'telefono', align: 'left', sortable: true },
  { name: 'movil', label: 'Móvil', field: 'movil', align: 'left', sortable: true },
  { name: 'fecha', label: 'Fecha', field: 'fecha', align: 'left', sortable: true },
  { name: 'usuario', label: 'Usuario', field: 'usuario', align: 'left', sortable: true },
  { name: 'firma', label: 'Firma', field: 'firma', align: 'left', sortable: true },
  { name: 'profesion', label: 'Profesión', field: 'profesion', align: 'left', sortable: true },
  { name: 'activo', label: 'Activo', field: 'activo', align: 'left', sortable: true },
  { name: 'actions', label: 'Acciones', field: 'actions', align: 'center' }
] as any[];

const rows = ref<any[]>([]);

onMounted(() => {
  fetchRows();
});

async function fetchRows() {
  loading.value = true;
  try {
    const response = await api.get('/api/empleados');
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
  formData.tipoident = '';
  formData.ident = '';
  formData.nombre = '';
  formData.direccion = '';
  formData.telefono = '';
  formData.movil = '';
  formData.fecha = '';
  formData.usuario = '';
  formData.firma = '';
  formData.profesion = '';
  formData.activo = false;
  showForm.value = true;
}

function editRow(row: any) {
  isEditing.value = true;
  formData.codigo = row.codigo;
  formData.tipoident = row.tipoident;
  formData.ident = row.ident;
  formData.nombre = row.nombre;
  formData.direccion = row.direccion;
  formData.telefono = row.telefono;
  formData.movil = row.movil;
  formData.fecha = row.fecha;
  formData.usuario = row.usuario;
  formData.firma = row.firma;
  formData.profesion = row.profesion;
  formData.activo = row.activo;
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
      await api.delete(`/api/empleados/${row.codigo}`);
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
      tipoident: formData.tipoident,
      ident: formData.ident,
      nombre: formData.nombre,
      direccion: formData.direccion,
      telefono: formData.telefono,
      movil: formData.movil,
      fecha: formData.fecha,
      usuario: formData.usuario,
      firma: formData.firma,
      profesion: formData.profesion,
      activo: formData.activo
    };
    if (isEditing.value) {
      await api.put(`/api/empleados/${formData.codigo}`, payload);
      $q.notify({ type: 'positive', message: 'Registro actualizado' });
    } else {
      await api.post(`/api/empleados`, payload);
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
  background-color:#adc2ad;
  color:black;
  font: bold;
}

.scroll-tablet :deep(.q-table__middle) {
  overflow-y: auto;
}

@media (max-width: 1365px) {
  .scroll-tablet :deep(.q-table__middle) {
    max-height: 42vh;
  }
}

@media (min-width: 1366px) and (max-width: 1920px) {
  .scroll-tablet :deep(.q-table__middle) {
    max-height: 55vh;
  }
}
</style>
