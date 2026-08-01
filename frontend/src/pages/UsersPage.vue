<template>
  <q-page class="q-pa-lg">
    <div class="row items-center q-mb-lg">
      <div class="col">
        <div class="text-h4 text-weight-bold">Usuarios</div>
        <div class="text-subtitle2 text-grey-6">Gestión de usuarios del sistema</div>
      </div>
      <div class="col-auto">
        <q-btn color="primary" icon="add" label="Nuevo usuario" unelevated @click="openDialog(null)" />
      </div>
    </div>

    <q-card flat bordered>
      <q-table
        :rows="users"
        :columns="columns"
        row-key="id"
        :loading="loading"
        flat
        :pagination="{ rowsPerPage: 10 }"
      >
        <template #body-cell-actions="props">
          <q-td :props="props" class="q-gutter-xs">
            <q-btn flat round dense icon="edit" color="primary" size="sm" @click="openDialog(props.row)">
              <q-tooltip>Editar</q-tooltip>
            </q-btn>
            <q-btn flat round dense icon="delete" color="negative" size="sm" @click="confirmDelete(props.row)">
              <q-tooltip>Eliminar</q-tooltip>
            </q-btn>
          </q-td>
        </template>
        <template #no-data>
          <div class="full-width row flex-center q-pa-lg text-grey q-gutter-sm">
            <q-icon name="people_outline" size="32px" />
            <span>No hay usuarios registrados</span>
          </div>
        </template>
      </q-table>
    </q-card>

    <UserFormDialog v-model="dialogOpen" :user="selectedUser" @saved="loadUsers" />
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useQuasar } from 'quasar';
import { usersApi, User } from 'src/api/users';
import UserFormDialog from 'src/components/UserFormDialog.vue';

const $q = useQuasar();
const users = ref<User[]>([]);
const loading = ref(false);
const dialogOpen = ref(false);
const selectedUser = ref<User | null>(null);

const columns = [
  { name: 'name', label: 'Nombre', field: 'name', align: 'left' as const, sortable: true },
  { name: 'email', label: 'Email', field: 'email', align: 'left' as const, sortable: true },
  {
    name: 'createdAt', label: 'Creado', field: 'createdAt', align: 'left' as const,
    format: (v: string) => new Date(v).toLocaleDateString('es-ES'),
  },
  { name: 'actions', label: 'Acciones', field: 'actions', align: 'center' as const },
];

async function loadUsers() {
  loading.value = true;
  try {
    const { data } = await usersApi.getAll();
    users.value = data;
  } catch {
    $q.notify({ type: 'negative', message: 'Error al cargar usuarios' });
  } finally {
    loading.value = false;
  }
}

function openDialog(user: User | null) {
  selectedUser.value = user;
  dialogOpen.value = true;
}

function confirmDelete(user: User) {
  $q.dialog({
    title: 'Eliminar usuario',
    message: `¿Eliminar a <strong>${user.name}</strong>?`,
    html: true,
    cancel: { label: 'Cancelar', flat: true },
    ok: { label: 'Eliminar', color: 'negative' },
    persistent: true,
  }).onOk(async () => {
    try {
      await usersApi.remove(user.id);
      $q.notify({ type: 'positive', message: 'Usuario eliminado' });
      loadUsers();
    } catch {
      $q.notify({ type: 'negative', message: 'Error al eliminar' });
    }
  });
}

onMounted(loadUsers);
</script>
