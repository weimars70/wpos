<template>
  <q-page padding>
    <div class="row items-center justify-between q-mb-md">
      <div class="text-h5 text-primary text-weight-bold">Proveedores</div>
      <q-btn color="primary" icon="add" label="Agregar Proveedores" @click="openNew" class="shadow-1 q-px-md rounded-borders"/>
    </div>

    <!-- Tabla CRUD -->
    <q-table
      :rows="rows"
      :columns="columns"
      row-key="codigo"
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
      <q-card style="min-width: 400px; border-radius: 12px;">
        <q-card-section class="bg-primary text-white row items-center">
          <div class="text-h6">{{ isEditing ? 'Editar' : 'Nuevo' }} Proveedores</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section class="q-pt-md">
          <q-form @submit="saveData" class="q-gutter-md">
            <q-input v-model.number="formData.codigo" type="number" label="Código" outlined dense :disable="isEditing" lazy-rules :rules="[val => val !== null || 'Obligatorio']" />
            <q-input v-model="formData.ident" label="Identificación" outlined dense  />
            <q-input v-model="formData.nombre" label="Nombre" outlined dense lazy-rules :rules="[val => !!val || 'Obligatorio']" />
            <q-input v-model="formData.nombre_comercial" label="Nombre Comercial" outlined dense  />
            <q-input v-model="formData.contacto" label="Contacto" outlined dense  />
            <q-input v-model="formData.telefono1" label="Teléfono 1" outlined dense  />
            <q-input v-model="formData.telefono2" label="Teléfono 2" outlined dense  />
            <q-input v-model="formData.fax" label="Fax" outlined dense  />
            <q-input v-model="formData.email" label="Email" outlined dense  />
            <q-input v-model="formData.observaciones" label="Observaciones" outlined dense  />
            <q-input v-model="formData.fecha" label="Fecha" outlined dense  />
            <q-input v-model="formData.usuario" label="Usuario" outlined dense  />
            <q-input v-model="formData.tipo_ident" label="Tipo Ident." outlined dense  />
            <q-input v-model="formData.direccion" label="Dirección" outlined dense  />
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
  codigo: '' as string,
  ident: '' as string,
  nombre: '' as string,
  nombre_comercial: '' as string,
  contacto: '' as string,
  telefono1: '' as string,
  telefono2: '' as string,
  fax: '' as string,
  email: '' as string,
  observaciones: '' as string,
  fecha: '' as string,
  usuario: '' as string,
  tipo_ident: '' as string,
  direccion: '' as string
});

// Definición de tabla
const columns = [
  { name: 'codigo', label: 'Código', field: 'codigo', align: 'left', sortable: true },
  { name: 'ident', label: 'Identificación', field: 'ident', align: 'left', sortable: true },
  { name: 'nombre', label: 'Nombre', field: 'nombre', align: 'left', sortable: true },
  { name: 'nombre_comercial', label: 'Nombre Comercial', field: 'nombre_comercial', align: 'left', sortable: true },
  { name: 'contacto', label: 'Contacto', field: 'contacto', align: 'left', sortable: true },
  { name: 'telefono1', label: 'Teléfono 1', field: 'telefono1', align: 'left', sortable: true },
  { name: 'telefono2', label: 'Teléfono 2', field: 'telefono2', align: 'left', sortable: true },
  { name: 'fax', label: 'Fax', field: 'fax', align: 'left', sortable: true },
  { name: 'email', label: 'Email', field: 'email', align: 'left', sortable: true },
  { name: 'observaciones', label: 'Observaciones', field: 'observaciones', align: 'left', sortable: true },
  { name: 'fecha', label: 'Fecha', field: 'fecha', align: 'left', sortable: true },
  { name: 'usuario', label: 'Usuario', field: 'usuario', align: 'left', sortable: true },
  { name: 'tipo_ident', label: 'Tipo Ident.', field: 'tipo_ident', align: 'left', sortable: true },
  { name: 'direccion', label: 'Dirección', field: 'direccion', align: 'left', sortable: true },
  { name: 'actions', label: 'Acciones', field: 'actions', align: 'center' }
] as any[];

const rows = ref<any[]>([]);

onMounted(() => {
  fetchRows();
});

async function fetchRows() {
  loading.value = true;
  try {
    const response = await api.get('/api/proveedores');
    rows.value = response.data;
  } catch (error) {
    $q.notify({ type: 'negative', message: 'Error cargando datos' });
  } finally {
    loading.value = false;
  }
}

function openNew() {
  isEditing.value = false;
  formData.codigo = '';
  formData.ident = '';
  formData.nombre = '';
  formData.nombre_comercial = '';
  formData.contacto = '';
  formData.telefono1 = '';
  formData.telefono2 = '';
  formData.fax = '';
  formData.email = '';
  formData.observaciones = '';
  formData.fecha = '';
  formData.usuario = '';
  formData.tipo_ident = '';
  formData.direccion = '';
  showForm.value = true;
}

function editRow(row: any) {
  isEditing.value = true;
  formData.codigo = row.codigo;
  formData.ident = row.ident;
  formData.nombre = row.nombre;
  formData.nombre_comercial = row.nombre_comercial;
  formData.contacto = row.contacto;
  formData.telefono1 = row.telefono1;
  formData.telefono2 = row.telefono2;
  formData.fax = row.fax;
  formData.email = row.email;
  formData.observaciones = row.observaciones;
  formData.fecha = row.fecha;
  formData.usuario = row.usuario;
  formData.tipo_ident = row.tipo_ident;
  formData.direccion = row.direccion;
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
      await api.delete(`/api/proveedores/${row.codigo}`);
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
      ident: formData.ident,
      nombre: formData.nombre,
      nombre_comercial: formData.nombre_comercial,
      contacto: formData.contacto,
      telefono1: formData.telefono1,
      telefono2: formData.telefono2,
      fax: formData.fax,
      email: formData.email,
      observaciones: formData.observaciones,
      fecha: formData.fecha,
      usuario: formData.usuario,
      tipo_ident: formData.tipo_ident,
      direccion: formData.direccion
    };
    if (isEditing.value) {
      await api.put(`/api/proveedores/${formData.codigo}`, payload);
      $q.notify({ type: 'positive', message: 'Registro actualizado' });
    } else {
      await api.post(`/api/proveedores`, payload);
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
</style>
