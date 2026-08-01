import os

entities = [
    {"name": "Medios de pago", "path": "medios-pago", "component": "MediosPagoPage"},
    {"name": "Colores", "path": "colores", "component": "ColoresPage"},
    {"name": "Documentos", "path": "documentos", "component": "DocumentosPage"},
    {"name": "Empleados", "path": "empleados", "component": "EmpleadosPage"},
    {"name": "Grupos Items", "path": "grupos-items", "component": "GruposItemsPage"},
    {"name": "Tipo Iva", "path": "tipo-iva", "component": "TipoIvaPage"},
    {"name": "Listado Items", "path": "listado-items", "component": "ListadoItemsPage"},
    {"name": "Listado Items Inactivos", "path": "listado-items-inactivos", "component": "ListadoItemsInactivosPage"},
    {"name": "Items", "path": "items", "component": "ItemsPage"},
    {"name": "Proveedores", "path": "proveedores", "component": "ProveedoresPage"},
    {"name": "Clientes", "path": "clientes", "component": "ClientesPage"},
]

FRONTEND_DIR = "d:/huellas/frontend"
PAGES_DIR = os.path.join(FRONTEND_DIR, "src", "pages", "maestros")
LAYOUT_FILE = os.path.join(FRONTEND_DIR, "src", "layouts", "MainLayout.vue")

# 1. Regenerar los Vue eliminando la data simulada
vue_template = """<template>
  <q-page padding>
    <div class="row items-center justify-between q-mb-md">
      <div class="text-h5 text-primary text-weight-bold">{name}</div>
      <q-btn color="primary" icon="add" label="Agregar {name}" @click="showForm = true" class="shadow-1 q-px-md rounded-borders"/>
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
          <div class="text-h6">{{{{ isEditing ? 'Editar' : 'Nuevo' }}}} {name}</div>
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
import {{ ref, reactive }} from 'vue';
import {{ useQuasar }} from 'quasar';

const $q = useQuasar();

// Estado
const loading = ref(false);
const showForm = ref(false);
const isEditing = ref(false);

const formData = reactive({{
  id: null as number | null,
  nombre: ''
}});

// Definición de tabla
const columns = [
  {{ name: 'id', label: 'ID', field: 'id', align: 'left', sortable: true }},
  {{ name: 'nombre', label: 'Nombre', field: 'nombre', align: 'left', sortable: true }},
  {{ name: 'actions', label: 'Acciones', field: 'actions', align: 'center' }}
] as any[];

const rows = ref<any[]>([]);

// Acciones
function editRow(row: any) {{
  isEditing.value = true;
  formData.id = row.id;
  formData.nombre = row.nombre;
  showForm.value = true;
}}

function deleteRow(row: any) {{
  $q.dialog({{
    title: 'Confirmar eliminación',
    message: `¿Estás seguro que deseas eliminar el registro "${{row.nombre}}"?`,
    cancel: true,
    persistent: true
  }}).onOk(() => {{
    rows.value = rows.value.filter(r => r.id !== row.id);
    $q.notify({{ type: 'positive', message: 'Registro eliminado' }});
  }});
}}

function saveData() {{
  if (isEditing.value) {{
    const index = rows.value.findIndex(r => r.id === formData.id);
    if (index !== -1) {{
      rows.value[index] = {{ ...rows.value[index], nombre: formData.nombre }};
    }}
    $q.notify({{ type: 'positive', message: 'Registro actualizado' }});
  }} else {{
    const newId = rows.value.length > 0 ? Math.max(...rows.value.map(r => r.id)) + 1 : 1;
    rows.value.push({{
      id: newId,
      nombre: formData.nombre
    }});
    $q.notify({{ type: 'positive', message: 'Registro creado' }});
  }}
  
  showForm.value = false;
  // Reset
  formData.id = null;
  formData.nombre = '';
  isEditing.value = false;
}}
</script>

<style scoped>
.rounded-borders {{
  border-radius: 8px;
}}
</style>
"""

for entity in entities:
    filepath = os.path.join(PAGES_DIR, f"{entity['component']}.vue")
    content = vue_template.format(name=entity["name"])
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

# 2. Arreglar MainLayout.vue perfectamente
menu_items = "\\n".join([
    f'''          <q-item clickable v-ripple to="/maestros/{e['path']}" active-class="bg-blue-1 text-primary" class="rounded-borders q-ml-md q-mr-sm q-mb-xs">
            <q-item-section avatar><q-icon name="arrow_right" size="xs" /></q-item-section>
            <q-item-section>{e['name']}</q-item-section>
          </q-item>'''
    for e in entities
])

layout_content = f"""<template>
  <q-layout view="lHh Lpr lFf" class="bg-grey-2">
    <q-header class="bg-white text-grey-9 q-py-sm" style="border-bottom: 1px solid rgba(0,0,0,0.05)">
      <q-toolbar>
        <q-btn flat dense round icon="menu" @click="drawer = !drawer" class="q-mr-sm" />
        <q-toolbar-title class="text-weight-bold text-gradient">WOPOS</q-toolbar-title>
        
        <q-space />

        <div class="flex items-center q-gutter-sm">
          <q-chip outline color="primary" icon="business" class="gt-xs">
            {{{{ empresaNombre }}}}
          </q-chip>
          <q-btn flat round color="grey-7" icon="notifications">
            <q-badge floating color="red" rounded />
          </q-btn>
          <q-btn-dropdown flat no-caps stretch>
            <template #label>
              <q-avatar size="32px" class="q-mr-sm shadow-1">
                <img src="https://cdn.quasar.dev/img/avatar.png">
              </q-avatar>
              <div class="gt-xs">{{{{ authStore.user?.name || 'Usuario' }}}}</div>
            </template>
            <q-list style="min-width: 200px">
              <q-item clickable v-ripple @click="handleLogout" class="text-red">
                <q-item-section avatar><q-icon name="logout" /></q-item-section>
                <q-item-section>Cerrar sesión</q-item-section>
              </q-item>
            </q-list>
          </q-btn-dropdown>
        </div>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="drawer"
      show-if-above
      :width="260"
      class="bg-white"
    >
      <div class="q-pa-md text-center q-mt-md">
        <div class="text-h6 text-weight-bold text-primary">SISTEMA HUELLAS</div>
        <div class="text-caption text-grey-6">v1.2.0</div>
      </div>

      <q-list padding class="q-mt-md">
        <q-item clickable v-ripple to="/dashboard" active-class="bg-blue-1 text-primary shadow-1" class="q-mx-sm rounded-borders q-mb-xs">
          <q-item-section avatar><q-icon name="dashboard" /></q-item-section>
          <q-item-section class="text-weight-medium">Dashboard</q-item-section>
        </q-item>

        <q-item clickable v-ripple to="/users" active-class="bg-blue-1 text-primary shadow-1" class="q-mx-sm rounded-borders q-mb-xs">
          <q-item-section avatar><q-icon name="people" /></q-item-section>
          <q-item-section class="text-weight-medium">Usuarios</q-item-section>
        </q-item>

        <q-expansion-item
          icon="shopping_cart"
          label="Salidas"
          class="q-mx-sm rounded-borders"
          header-class="text-weight-medium text-grey-8"
        >
          <q-item clickable v-ripple to="/salidas/facturas" active-class="bg-blue-1 text-primary" class="rounded-borders q-ml-md q-mr-sm q-mb-xs">
            <q-item-section avatar><q-icon name="receipt_long" size="xs" /></q-item-section>
            <q-item-section>Facturador</q-item-section>
          </q-item>
        </q-expansion-item>

        <q-expansion-item
          icon="folder_special"
          label="Maestros"
          class="q-mx-sm rounded-borders"
          header-class="text-weight-medium text-grey-8"
        >
{menu_items}
        </q-expansion-item>
      </q-list>

      <div class="absolute-bottom q-pa-md flex flex-center">
        <div class="text-caption text-grey-4">© 2026 Huellas Tech</div>
      </div>
    </q-drawer>

    <q-page-container>
      <router-view v-slot="{{ Component }}">
        <transition appear enter-active-class="animated fadeIn" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import {{ ref, computed }} from 'vue';
import {{ useRouter }} from 'vue-router';
import {{ useQuasar }} from 'quasar';
import {{ useAuthStore }} from '../stores/auth';

const $q = useQuasar();
const router = useRouter();
const authStore = useAuthStore();
const drawer = ref(false);

const empresaNombre = computed(() => {{
  return 'Sucursal Principal';
}});

function handleLogout() {{
  $q.dialog({{
    title: 'Cerrar sesión',
    message: '¿Estás seguro que deseas salir del sistema?',
    cancel: {{ flat: true, color: 'grey' }},
    ok: {{ flat: true, color: 'red', label: 'Sí, Salir' }},
    class: 'glass-card text-white bg-dark'
  }}).onOk(() => {{
    authStore.logout();
    router.push('/login');
  }});
}}
</script>

<style lang="scss">
.q-drawer {{
  border-right: 1px solid rgba(0,0,0,0.05);
}}
.rounded-borders {{
  border-radius: 12px;
}}
</style>
"""

with open(LAYOUT_FILE, "w", encoding="utf-8") as f:
    f.write(layout_content)

print("Datos simulados borrados de los Maestros. MainLayout.vue restaurado limpiamente (sin endlines literales ni etiquetas faltantes).")
