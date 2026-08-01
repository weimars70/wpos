import os

FRONTEND_DIR = "d:/huellas/frontend"
PAGES_DIR = os.path.join(FRONTEND_DIR, "src", "pages", "maestros")

maestros_config = {
    "MediosPagoPage": {
        "title": "Medios de pago",
        "pk": "codigo",
        "pk_type": "number",
        "fields": [
            {"name": "codigo", "label": "Código", "type": "number", "required": True},
            {"name": "descripcion", "label": "Descripción", "type": "string", "required": True},
            {"name": "abonos", "label": "Abonos", "type": "boolean", "required": False},
            {"name": "facturas", "label": "Facturas", "type": "boolean", "required": False},
            {"name": "devoluciones", "label": "Devoluciones", "type": "boolean", "required": False},
        ]
    },
    "ColoresPage": {
        "title": "Colores",
        "pk": "id",
        "pk_type": "number",
        "fields": [
            {"name": "id", "label": "ID", "type": "number", "required": False}, # auto
            {"name": "nombre", "label": "Nombre", "type": "string", "required": True},
        ]
    }
}

def get_default_value(field_type):
    if field_type == "number": return "null"
    if field_type == "boolean": return "false"
    return "''"

def ts_type(field_type):
    if field_type == "number": return "number | null"
    if field_type == "boolean": return "boolean"
    return "string"

def build_template(component, config):
    title = config["title"]
    pk = config["pk"]
    
    # 1. Generate columns definition
    columns_str = []
    for f in config["fields"]:
        columns_str.append(f"  {{ name: '{f['name']}', label: '{f['label']}', field: '{f['name']}', align: 'left', sortable: true }}")
    columns_str.append(f"  {{ name: 'actions', label: 'Acciones', field: 'actions', align: 'center' }}")
    columns_code = ",\n".join(columns_str)

    # 2. Generate formData definition
    form_data_str = []
    for f in config["fields"]:
        form_data_str.append(f"  {f['name']}: {get_default_value(f['type'])} as {ts_type(f['type'])}")
    form_data_code = ",\n".join(form_data_str)

    # 3. Generate form inputs (HTML)
    inputs_html = []
    for f in config["fields"]:
        if f["name"] == pk:
            # Si el campo es la PK, deshabilitar en edición si se entra manual. En Colores el ID suele ser auto (lo omitimos o lo dejamos read-only).
            if pk == "codigo":
                # Manual insertion
                inputs_html.append(f"""            <q-input v-model.number="formData.{f['name']}" type="number" label="{f['label']}" outlined dense :disable="isEditing" lazy-rules :rules="[val => val !== null || 'Obligatorio']" />""")
            else:
                # Omit for creation, read-only maybe
                pass # usually ID is not on form
        else:
            if f["type"] == "string":
                req_rule = "lazy-rules :rules=\"[val => !!val || 'El campo es obligatorio']\"" if f["required"] else ""
                inputs_html.append(f"""            <q-input v-model="formData.{f['name']}" label="{f['label']}" outlined dense {req_rule} />""")
            elif f["type"] == "number":
                req_rule = "lazy-rules :rules=\"[val => val !== null || 'Obligatorio']\"" if f["required"] else ""
                inputs_html.append(f"""            <q-input v-model.number="formData.{f['name']}" type="number" label="{f['label']}" outlined dense {req_rule} />""")
            elif f["type"] == "boolean":
                inputs_html.append(f"""            <q-toggle v-model="formData.{f['name']}" label="{f['label']}" color="primary" />""")
    
    inputs_code = "\n".join(inputs_html)

    # 4. Assignment logic (editRow, saveData)
    assignments_edit = "\n".join([f"  formData.{f['name']} = row.{f['name']};" for f in config["fields"]])
    
    # Construir row en saveData
    save_row_props = []
    for f in config["fields"]:
        if f["name"] != pk:
            save_row_props.append(f"      {f['name']}: formData.{f['name']}")
    save_row_props_str = ",\n".join(save_row_props)
    
    # Reset
    reset_logic = "\n".join([f"  formData.{f['name']} = {get_default_value(f['type'])};" for f in config["fields"]])

    # PK Gen logic si es nuevo
    if pk == "codigo":
        # manual pkg insert from form
        pk_new = f"formData.{pk}"
    else:
        # id auto
        pk_new = f"rows.value.length > 0 ? Math.max(...rows.value.map(r => r.{pk})) + 1 : 1"

    vue_content = f"""<template>
  <q-page padding>
    <div class="row items-center justify-between q-mb-md">
      <div class="text-h5 text-primary text-weight-bold">{title}</div>
      <q-btn color="primary" icon="add" label="Agregar {title}" @click="showForm = true" class="shadow-1 q-px-md rounded-borders"/>
    </div>

    <!-- Tabla CRUD -->
    <q-table
      :rows="rows"
      :columns="columns"
      row-key="{pk}"
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
          <div class="text-h6">{{{{ isEditing ? 'Editar' : 'Nuevo' }}}} {title}</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section class="q-pt-md">
          <q-form @submit="saveData" class="q-gutter-md">
{inputs_code}
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
{form_data_code}
}});

// Definición de tabla
const columns = [
{columns_code}
] as any[];

const rows = ref<any[]>([]);

// Acciones
function editRow(row: any) {{
  isEditing.value = true;
{assignments_edit}
  showForm.value = true;
}}

function deleteRow(row: any) {{
  $q.dialog({{
    title: 'Confirmar eliminación',
    message: `¿Estás seguro que deseas eliminar el registro seleccionado?`,
    cancel: true,
    persistent: true
  }}).onOk(() => {{
    rows.value = rows.value.filter(r => r.{pk} !== row.{pk});
    $q.notify({{ type: 'positive', message: 'Registro eliminado' }});
  }});
}}

function saveData() {{
  if (isEditing.value) {{
    const index = rows.value.findIndex(r => r.{pk} === formData.{pk});
    if (index !== -1) {{
      rows.value[index] = {{ ...rows.value[index],
{save_row_props_str}
      }};
    }}
    $q.notify({{ type: 'positive', message: 'Registro actualizado' }});
  }} else {{
    rows.value.push({{
      {pk}: {pk_new},
{save_row_props_str}
    }});
    $q.notify({{ type: 'positive', message: 'Registro creado' }});
  }}
  
  showForm.value = false;
  // Reset
{reset_logic}
  isEditing.value = false;
}}
</script>

<style scoped>
.rounded-borders {{
  border-radius: 8px;
}}
</style>
"""
    return vue_content

def generar():
    for component, config in maestros_config.items():
        filepath = os.path.join(PAGES_DIR, f"{component}.vue")
        content = build_template(component, config)
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Modificado {component}.vue según DDL.")

if __name__ == '__main__':
    generar()
