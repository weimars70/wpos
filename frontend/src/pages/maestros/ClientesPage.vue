<template>
  <q-page padding>
    <div class="row items-center justify-between q-mb-md">
      <div class="text-h5 text-primary text-weight-bold">Clientes</div>
      <q-btn color="primary" icon="add" label="Agregar Clientes" @click="showForm = true" class="shadow-1 q-px-md rounded-borders"/>
    </div>

    <!-- Tabla CRUD -->
    <q-table
      :rows="rows"
      :columns="columns"
      row-key="id"
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
          <div class="text-h6">{{ isEditing ? 'Editar' : 'Nuevo' }} Clientes</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section class="q-pt-md">
          <q-form @submit="saveData" class="q-gutter-md">
            <!-- Campos genéricos provisionales -->
            <q-input v-model="formData.nombre" label="Nombre" outlined dense
                     lazy-rules :rules="[val => !!val || 'El campo es obligatorio']" />
                     
            <div class="row justify-end q-mt-lg">
              <q-btn label="Cancelar" color="grey" flat v-close-popup class="q-mr-sm" />
              <q-btn label="Guardar" type="submit" color="primary" unelevated class="rounded-borders q-px-md"/>
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>

  </q-page>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useQuasar } from 'quasar';

const $q = useQuasar();

// Estado
const loading = ref(false);
const showForm = ref(false);
const isEditing = ref(false);

const formData = reactive({
  id: null as number | null,
  nombre: ''
});

// Definición de tabla
const columns = [
  { name: 'id', label: 'ID', field: 'id', align: 'left', sortable: true },
  { name: 'nombre', label: 'Nombre', field: 'nombre', align: 'left', sortable: true },
  { name: 'actions', label: 'Acciones', field: 'actions', align: 'center' }
] as any[];

const rows = ref<any[]>([]);

// Acciones
function editRow(row: any) {
  isEditing.value = true;
  formData.id = row.id;
  formData.nombre = row.nombre;
  showForm.value = true;
}

function deleteRow(row: any) {
  $q.dialog({
    title: 'Confirmar eliminación',
    message: `¿Estás seguro que deseas eliminar el registro "${row.nombre}"?`,
    cancel: true,
    persistent: true
  }).onOk(() => {
    rows.value = rows.value.filter(r => r.id !== row.id);
    $q.notify({ type: 'positive', message: 'Registro eliminado' });
  });
}

function saveData() {
  if (isEditing.value) {
    const index = rows.value.findIndex(r => r.id === formData.id);
    if (index !== -1) {
      rows.value[index] = { ...rows.value[index], nombre: formData.nombre };
    }
    $q.notify({ type: 'positive', message: 'Registro actualizado' });
  } else {
    const newId = rows.value.length > 0 ? Math.max(...rows.value.map(r => r.id)) + 1 : 1;
    rows.value.push({
      id: newId,
      nombre: formData.nombre
    });
    $q.notify({ type: 'positive', message: 'Registro creado' });
  }
  
  showForm.value = false;
  // Reset
  formData.id = null;
  formData.nombre = '';
  isEditing.value = false;
}
</script>

<style scoped>
.rounded-borders {
  border-radius: 8px;
}
</style>
