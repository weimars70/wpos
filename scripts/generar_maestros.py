import os
import re

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
ROUTER_FILE = os.path.join(FRONTEND_DIR, "src", "router", "index.ts")
LAYOUT_FILE = os.path.join(FRONTEND_DIR, "src", "layouts", "MainLayout.vue")

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

const rows = ref<any[]>([
  {{ id: 1, nombre: 'Registro de ejemplo 1' }},
  {{ id: 2, nombre: 'Registro de ejemplo 2' }}
]);

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

def generate_vue_files():
    if not os.path.exists(PAGES_DIR):
        os.makedirs(PAGES_DIR)
        
    for entity in entities:
        filepath = os.path.join(PAGES_DIR, f"{entity['component']}.vue")
        content = vue_template.format(name=entity["name"])
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Creado: {filepath}")

def update_router():
    with open(ROUTER_FILE, 'r', encoding='utf-8') as f:
        content = f.read()

    # Si ya contiene las rutas, no hacer nada
    if '/maestros/' in content:
        print("El router ya contiene rutas de maestros.")
        return

    routes_str = "\n".join([
        f"      {{ path: '/maestros/{e['path']}', component: () => import('pages/maestros/{e['component']}.vue') }},"
        for e in entities
    ])

    search_str = "children: ["
    if search_str in content:
        parts = content.split(search_str)
        new_content = parts[0] + search_str + "\n" + routes_str + parts[1]
        with open(ROUTER_FILE, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print("Router actualizado correctamente.")
    else:
        print("No se encontró el array 'children' en el router.")

def update_layout():
    with open(LAYOUT_FILE, 'r', encoding='utf-8') as f:
        content = f.read()
        
    if 'label="Maestros"' in content:
        print("El layout ya contiene el menú de Maestros.")
        return
        
    menu_items = "\n".join([
        f"""          <q-item clickable v-ripple to="/maestros/{e['path']}" active-class="bg-blue-1 text-primary" class="rounded-borders q-ml-md q-mr-sm q-mb-xs">
            <q-item-section avatar><q-icon name="arrow_right" size="xs" /></q-item-section>
            <q-item-section>{e['name']}</q-item-section>
          </q-item>"""
        for e in entities
    ])
    
    expansion_menu = f"""
        <q-expansion-item
          icon="folder_special"
          label="Maestros"
          class="q-mx-sm rounded-borders"
          header-class="text-weight-medium text-grey-8"
        >
{menu_items}
        </q-expansion-item>
"""

    search_str = "</q-list>"
    if search_str in content:
        parts = content.split(search_str)
        new_content = parts[0] + expansion_menu + search_str + parts[1]
        with open(LAYOUT_FILE, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print("Layout MainLayout.vue actualizado correctamente.")
    else:
        print("No se encontró </q-list> en MainLayout.vue")

if __name__ == '__main__':
    generate_vue_files()
    update_router()
    update_layout()
    print("Módulo Maestros inyectado.")
