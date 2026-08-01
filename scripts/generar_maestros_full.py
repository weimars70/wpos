import os
import re

BACKEND_DIR = "d:/huellas/backend"
FRONTEND_DIR = "d:/huellas/frontend"

configuraciones = [
    {
        "endpoint": "medios-pago",
        "entity_name": "MedioPago",
        "entity_table": "medios_pago",
        "pk": "codigo",
        "auto_pk": False,
        "frontend_component": "MediosPagoPage",
        "frontend_title": "Medios de pago",
        "fields": [
            {"name": "codigo", "label": "Código", "type": "number", "required": "True", "db_type": "int"},
            {"name": "descripcion", "label": "Descripción", "type": "string", "required": "True", "db_type": "varchar"},
            {"name": "abonos", "label": "Abonos", "type": "boolean", "required": "False", "db_type": "boolean"},
            {"name": "facturas", "label": "Facturas", "type": "boolean", "required": "False", "db_type": "boolean"},
            {"name": "devoluciones", "label": "Devoluciones", "type": "boolean", "required": "False", "db_type": "boolean"}
        ]
    },
    {
        "endpoint": "colores",
        "entity_name": "Color",
        "entity_table": "colores",
        "pk": "id",
        "auto_pk": True,
        "frontend_component": "ColoresPage",
        "frontend_title": "Colores",
        "fields": [
            {"name": "id", "label": "ID", "type": "number", "required": "False", "db_type": "int"},
            {"name": "nombre", "label": "Nombre", "type": "string", "required": "True", "db_type": "varchar"},
        ]
    },
    {
        "endpoint": "empleados",
        "entity_name": "Empleado",
        "entity_table": "empleados",
        "pk": "codigo",
        "auto_pk": False,
        "frontend_component": "EmpleadosPage",
        "frontend_title": "Empleados",
        "fields": [
            {"name": "codigo", "label": "Código", "type": "number", "required": "True", "db_type": "int"},
            {"name": "tipoident", "label": "Tipo Ident.", "type": "string", "required": "False", "db_type": "varchar"},
            {"name": "ident", "label": "Identificación", "type": "string", "required": "False", "db_type": "varchar"},
            {"name": "nombre", "label": "Nombre", "type": "string", "required": "True", "db_type": "varchar"},
            {"name": "direccion", "label": "Dirección", "type": "string", "required": "False", "db_type": "varchar"},
            {"name": "telefono", "label": "Teléfono", "type": "string", "required": "False", "db_type": "varchar"},
            {"name": "movil", "label": "Móvil", "type": "string", "required": "False", "db_type": "varchar"},
            {"name": "fecha", "label": "Fecha", "type": "string", "required": "False", "db_type": "date"},
            {"name": "usuario", "label": "Usuario", "type": "string", "required": "False", "db_type": "varchar"},
            {"name": "firma", "label": "Firma", "type": "string", "required": "False", "db_type": "text"},
            {"name": "profesion", "label": "Profesión", "type": "string", "required": "False", "db_type": "varchar"},
            {"name": "activo", "label": "Activo", "type": "boolean", "required": "False", "db_type": "boolean"}
        ]
    },
    {
        "endpoint": "grupos-items",
        "entity_name": "GrupoItem",
        "entity_table": "items_grupos",
        "pk": "codigo",
        "auto_pk": False,
        "frontend_component": "GruposItemsPage",
        "frontend_title": "Grupos Items",
        "fields": [
            {"name": "codigo", "label": "Código", "type": "number", "required": "True", "db_type": "int"},
            {"name": "descripcion", "label": "Descripción", "type": "string", "required": "True", "db_type": "varchar"}
        ]
    },
    {
        "endpoint": "items",
        "entity_name": "Item",
        "entity_table": "items",
        "pk": "item",
        "auto_pk": False,
        "frontend_component": "ItemsPage",
        "frontend_title": "Items",
        "fields": [
            {"name": "item", "label": "Item (Código)", "type": "string", "required": "True", "db_type": "varchar"},
            {"name": "descripcion", "label": "Descripción", "type": "string", "required": "True", "db_type": "varchar"},
            {"name": "grupo_codigo", "label": "Grupo", "type": "number", "required": "False", "db_type": "int"},
            {"name": "por_iva", "label": "% IVA", "type": "number", "required": "False", "db_type": "numeric"},
            {"name": "por_ganmin", "label": "% Gan. Min", "type": "number", "required": "False", "db_type": "numeric"},
            {"name": "por_ganmax", "label": "% Gan. Max", "type": "number", "required": "False", "db_type": "numeric"},
            {"name": "activo", "label": "Activo", "type": "boolean", "required": "False", "db_type": "boolean"},
            {"name": "item_tipo_iva", "label": "Tipo IVA", "type": "string", "required": "False", "db_type": "varchar"},
            {"name": "imagen", "label": "Imagen", "type": "string", "required": "False", "db_type": "varchar"},
            {"name": "color", "label": "Color ID", "type": "number", "required": "False", "db_type": "int"},
            {"name": "ult_pcompra", "label": "Ult. Prm. Compra", "type": "number", "required": "False", "db_type": "numeric"},
            {"name": "ult_pventa", "label": "Ult. Prm. Venta", "type": "number", "required": "False", "db_type": "numeric"},
            {"name": "tallas", "label": "Tallas", "type": "string", "required": "False", "db_type": "varchar"},
            {"name": "precio_venta2", "label": "Precio Venta 2", "type": "number", "required": "False", "db_type": "numeric"},
            {"name": "precio_venta3", "label": "Precio Venta 3", "type": "number", "required": "False", "db_type": "numeric"},
            {"name": "promocion", "label": "Promoción", "type": "number", "required": "False", "db_type": "numeric"}
        ]
    },
    {
        "endpoint": "proveedores",
        "entity_name": "Proveedor",
        "entity_table": "proveedores",
        "pk": "codigo",
        "auto_pk": False,
        "frontend_component": "ProveedoresPage",
        "frontend_title": "Proveedores",
        "fields": [
            {"name": "codigo", "label": "Código", "type": "string", "required": "True", "db_type": "varchar"},
            {"name": "ident", "label": "Identificación", "type": "string", "required": "False", "db_type": "varchar"},
            {"name": "nombre", "label": "Nombre", "type": "string", "required": "True", "db_type": "varchar"},
            {"name": "nombre_comercial", "label": "Nombre Comercial", "type": "string", "required": "False", "db_type": "varchar"},
            {"name": "contacto", "label": "Contacto", "type": "string", "required": "False", "db_type": "varchar"},
            {"name": "telefono1", "label": "Teléfono 1", "type": "string", "required": "False", "db_type": "varchar"},
            {"name": "telefono2", "label": "Teléfono 2", "type": "string", "required": "False", "db_type": "varchar"},
            {"name": "fax", "label": "Fax", "type": "string", "required": "False", "db_type": "varchar"},
            {"name": "email", "label": "Email", "type": "string", "required": "False", "db_type": "varchar"},
            {"name": "observaciones", "label": "Observaciones", "type": "string", "required": "False", "db_type": "text"},
            {"name": "fecha", "label": "Fecha", "type": "string", "required": "False", "db_type": "date"},
            {"name": "usuario", "label": "Usuario", "type": "string", "required": "False", "db_type": "varchar"},
            {"name": "tipo_ident", "label": "Tipo Ident.", "type": "string", "required": "False", "db_type": "varchar"},
            {"name": "direccion", "label": "Dirección", "type": "string", "required": "False", "db_type": "varchar"}
        ]
    },
    {
        "endpoint": "tipo-iva",
        "entity_name": "TipoIva",
        "entity_table": "items_tipo_iva",
        "pk": "codigo",
        "auto_pk": False,
        "frontend_component": "TipoIvaPage",
        "frontend_title": "Tipo Iva",
        "fields": [
            {"name": "codigo", "label": "Código", "type": "string", "required": "True", "db_type": "varchar"},
            {"name": "descripcion", "label": "Descripción", "type": "string", "required": "True", "db_type": "varchar"}
        ]
    },
    {
        "endpoint": "listado-items",
        "entity_name": "ListadoItem",
        "entity_table": "view_items",
        "pk": "item",
        "auto_pk": False,
        "frontend_component": "ListadoItemsPage",
        "frontend_title": "Listado de Items",
        "fields": [
            {"name": "item", "label": "Item (Código)", "type": "string", "required": "True", "db_type": "varchar"},
            {"name": "descripcion", "label": "Descripción", "type": "string", "required": "True", "db_type": "varchar"},
            {"name": "grupo_codigo", "label": "Grupo Cód.", "type": "number", "required": "False", "db_type": "int"},
            {"name": "grupo", "label": "Grupo", "type": "string", "required": "False", "db_type": "varchar"},
            {"name": "por_iva", "label": "% IVA", "type": "number", "required": "False", "db_type": "numeric"},
            {"name": "por_ganmin", "label": "% Gan. Min", "type": "number", "required": "False", "db_type": "numeric"},
            {"name": "por_ganmax", "label": "% Gan. Max", "type": "number", "required": "False", "db_type": "numeric"},
            {"name": "activo", "label": "Activo", "type": "boolean", "required": "False", "db_type": "boolean"},
            {"name": "item_tipo_iva", "label": "Cód. Tipo IVA", "type": "string", "required": "False", "db_type": "varchar"},
            {"name": "tipo_iva", "label": "Tipo IVA", "type": "string", "required": "False", "db_type": "varchar"},
            {"name": "imagen", "label": "Imagen", "type": "string", "required": "False", "db_type": "varchar"},
            {"name": "ult_pcompra", "label": "Ult. Prm. Compra", "type": "number", "required": "False", "db_type": "numeric"},
            {"name": "ult_pventa", "label": "Ult. Prm. Venta", "type": "number", "required": "False", "db_type": "numeric"},
            {"name": "precio2", "label": "Precio Venta 2", "type": "number", "required": "False", "db_type": "numeric"},
            {"name": "precio3", "label": "Precio Venta 3", "type": "number", "required": "False", "db_type": "numeric"},
            {"name": "promocion", "label": "Promoción", "type": "number", "required": "False", "db_type": "numeric"}
        ]
    },
    {
        "endpoint": "documentos",
        "entity_name": "Documento",
        "entity_table": "tipo_ident",
        "pk": "codigo",
        "auto_pk": False,
        "frontend_component": "DocumentosPage",
        "frontend_title": "Documentos",
        "fields": [
            {"name": "codigo", "label": "Código", "type": "string", "required": "True", "db_type": "varchar"},
            {"name": "nombre", "label": "Nombre", "type": "string", "required": "True", "db_type": "varchar"},
            {"name": "abreviado", "label": "Abreviado", "type": "string", "required": "False", "db_type": "varchar"}
        ]
    },
    {
        "endpoint": "listado-items-inactivos",
        "entity_name": "ListadoItemInactivo",
        "entity_table": "view_items",
        "pk": "item",
        "auto_pk": False,
        "frontend_component": "ListadoItemsInactivosPage",
        "frontend_title": "Listado de Items Inactivos",
        "fields": [
            {"name": "item", "label": "Item (Código)", "type": "string", "required": "True", "db_type": "varchar"},
            {"name": "descripcion", "label": "Descripción", "type": "string", "required": "True", "db_type": "varchar"},
            {"name": "grupo_codigo", "label": "Grupo Cód.", "type": "number", "required": "False", "db_type": "int"},
            {"name": "grupo", "label": "Grupo", "type": "string", "required": "False", "db_type": "varchar"},
            {"name": "por_iva", "label": "% IVA", "type": "number", "required": "False", "db_type": "numeric"},
            {"name": "por_ganmin", "label": "% Gan. Min", "type": "number", "required": "False", "db_type": "numeric"},
            {"name": "por_ganmax", "label": "% Gan. Max", "type": "number", "required": "False", "db_type": "numeric"},
            {"name": "activo", "label": "Activo", "type": "boolean", "required": "False", "db_type": "boolean"},
            {"name": "item_tipo_iva", "label": "Cód. Tipo IVA", "type": "string", "required": "False", "db_type": "varchar"},
            {"name": "tipo_iva", "label": "Tipo IVA", "type": "string", "required": "False", "db_type": "varchar"},
            {"name": "imagen", "label": "Imagen", "type": "string", "required": "False", "db_type": "varchar"},
            {"name": "ult_pcompra", "label": "Ult. Prm. Compra", "type": "number", "required": "False", "db_type": "numeric"},
            {"name": "ult_pventa", "label": "Ult. Prm. Venta", "type": "number", "required": "False", "db_type": "numeric"},
            {"name": "precio2", "label": "Precio Venta 2", "type": "number", "required": "False", "db_type": "numeric"},
            {"name": "precio3", "label": "Precio Venta 3", "type": "number", "required": "False", "db_type": "numeric"},
            {"name": "promocion", "label": "Promoción", "type": "number", "required": "False", "db_type": "numeric"}
        ]
    }
]

def capitalize_first(s):
    return s[0].upper() + s[1:] if s else ""

def generate_backend_module(cfg):
    module_name = cfg["entity_name"] + "Module"
    service_name = cfg["entity_name"] + "Service"
    controller_name = cfg["entity_name"] + "Controller"
    entity_name = cfg["entity_name"]
    folder_name = cfg["endpoint"].replace('-', '_')
    table_name = cfg["entity_table"]
    
    maestros_dir = os.path.join(BACKEND_DIR, "src", folder_name)
    os.makedirs(maestros_dir, exist_ok=True)
    
    # 1. Entity
    columns_code = []
    for f in cfg["fields"]:
        if f["name"] == cfg["pk"]:
            ts_type = "string" if f["type"] == "string" else ("boolean" if f["type"] == "boolean" else "number")
            if cfg["auto_pk"]:
                columns_code.append(f"  @PrimaryGeneratedColumn()\n  {f['name']}: {ts_type};")
            else:
                columns_code.append(f"  @PrimaryColumn()\n  {f['name']}: {ts_type};")
        else:
            ts_type = "string" if f["type"] == "string" else ("boolean" if f["type"] == "boolean" else "number")
            columns_code.append(f"  @Column({{ name: '{f['name']}', nullable: {str(False if f['required'] == 'True' else True).lower()} }})\n  {f['name']}: {ts_type};")

    entity_code = f"""import {{ Entity, Column, PrimaryGeneratedColumn, PrimaryColumn }} from 'typeorm';

@Entity('{table_name}')
export class {entity_name} {{
{str.join(chr(10), columns_code)}
}}
"""
    with open(os.path.join(maestros_dir, f"{folder_name}.entity.ts"), "w", encoding="utf-8") as file:
        file.write(entity_code)

    # 2. Service
    service_code = f"""import {{ Injectable }} from '@nestjs/common';
import {{ InjectRepository }} from '@nestjs/typeorm';
import {{ Repository }} from 'typeorm';
import {{ {entity_name} }} from './{folder_name}.entity';

@Injectable()
export class {service_name} {{
  constructor(
    @InjectRepository({entity_name})
    private repo: Repository<{entity_name}>,
  ) {{}}

  findAll() {{
    return this.repo.find();
  }}

  findOne(id: any) {{
    return this.repo.findOneBy({{ {cfg["pk"]}: id }} as any);
  }}

  create(data: any) {{
    const newEntity = this.repo.create(data as Partial<{entity_name}>);
    return this.repo.save(newEntity);
  }}

  async update(id: any, data: any) {{
    await this.repo.update(id, data);
    return this.findOne(id);
  }}

  remove(id: any) {{
    return this.repo.delete(id);
  }}
}}
"""
    with open(os.path.join(maestros_dir, f"{folder_name}.service.ts"), "w", encoding="utf-8") as file:
        file.write(service_code)

    pk_is_number = any(f["name"] == cfg["pk"] and f["type"] == "number" for f in cfg["fields"])
    id_cast = "+" if pk_is_number else ""

    # 3. Controller
    controller_code = f"""import {{ Controller, Get, Post, Body, Put, Param, Delete }} from '@nestjs/common';
import {{ {service_name} }} from './{folder_name}.service';

@Controller('api/{cfg["endpoint"]}')
export class {controller_name} {{
  constructor(private readonly service: {service_name}) {{}}

  @Get()
  findAll() {{
    return this.service.findAll();
  }}

  @Get(':id')
  findOne(@Param('id') id: string) {{
    return this.service.findOne({id_cast}id);
  }}

  @Post()
  create(@Body() data: any) {{
    return this.service.create(data);
  }}

  @Put(':id')
  update(@Param('id') id: string, @Body() data: any) {{
    return this.service.update({id_cast}id, data);
  }}

  @Delete(':id')
  remove(@Param('id') id: string) {{
    return this.service.remove({id_cast}id);
  }}
}}
"""
    with open(os.path.join(maestros_dir, f"{folder_name}.controller.ts"), "w", encoding="utf-8") as file:
        file.write(controller_code)

    # 4. Module
    module_code = f"""import {{ Module }} from '@nestjs/common';
import {{ TypeOrmModule }} from '@nestjs/typeorm';
import {{ {entity_name} }} from './{folder_name}.entity';
import {{ {service_name} }} from './{folder_name}.service';
import {{ {controller_name} }} from './{folder_name}.controller';

@Module({{
  imports: [TypeOrmModule.forFeature([{entity_name}])],
  controllers: [{controller_name}],
  providers: [{service_name}],
  exports: [{service_name}]
}})
export class {module_name} {{}}
"""
    with open(os.path.join(maestros_dir, f"{folder_name}.module.ts"), "w", encoding="utf-8") as file:
        file.write(module_code)

    print(f"Backend module {module_name} generated.")

def inject_in_app_module(cfg):
    app_module_path = os.path.join(BACKEND_DIR, "src", "app.module.ts")
    with open(app_module_path, "r", encoding="utf-8") as f:
        content = f.read()

    entity_name = cfg["entity_name"]
    folder_name = cfg["endpoint"].replace('-', '_')
    module_name = entity_name + "Module"

    import_entity = f"import {{ {entity_name} }} from './{folder_name}/{folder_name}.entity';"
    import_module = f"import {{ {module_name} }} from './{folder_name}/{folder_name}.module';"
    
    # Chequeo seguro para prevenir matches parciales ("ItemModule" inside "GrupoItemModule")
    # Buscamos si existe la importacion estricta:
    if f"import {{ {module_name} }}" not in content:
        # Añadir importaciones arriba
        content = import_entity + "\n" + import_module + "\n" + content
        
        # Inyectar entidad en entities: [User, ...] o similar (buscando de forma segura)
        if 'entities: [' in content:
            content = content.replace("entities: [", f"entities: [\n        {entity_name},")
        
        # Inyectar module en el array de imports de AppModule
        if 'SalidasModule,' in content:
             content = content.replace("SalidasModule,", f"SalidasModule,\n    {module_name},")

        with open(app_module_path, "w", encoding="utf-8") as f:
            f.write(content)
        print(f"Injected {module_name} and {entity_name} into app.module.ts safely")

def get_default_value(f_type):
    if f_type == "number": return "null"
    if f_type == "boolean": return "false"
    return "''"

def ts_type(f_type):
    if f_type == "number": return "number | null"
    if f_type == "boolean": return "boolean"
    return "string"

def generate_frontend_vue(cfg):
    pk = cfg["pk"]
    
    # Cols
    columns_str = []
    for f in cfg["fields"]:
        columns_str.append(f"  {{ name: '{f['name']}', label: '{f['label']}', field: '{f['name']}', align: 'left', sortable: true }}")
    columns_str.append(f"  {{ name: 'actions', label: 'Acciones', field: 'actions', align: 'center' }}")
    columns_code = ",\n".join(columns_str)

    # Form
    form_data_str = []
    for f in cfg["fields"]:
        form_data_str.append(f"  {f['name']}: {get_default_value(f['type'])} as {ts_type(f['type'])}")
    form_data_code = ",\n".join(form_data_str)

    # Inputs HTML
    inputs_html = []
    for f in cfg["fields"]:
        if f["name"] == pk:
            if not cfg["auto_pk"]:
                inputs_html.append(f"""            <q-input v-model.number="formData.{f['name']}" type="number" label="{f['label']}" outlined dense :disable="isEditing" lazy-rules :rules="[val => val !== null || 'Obligatorio']" />""")
        else:
            if f["type"] == "string":
                req_rule = "lazy-rules :rules=\"[val => !!val || 'Obligatorio']\"" if f["required"] == "True" else ""
                inputs_html.append(f"""            <q-input v-model="formData.{f['name']}" label="{f['label']}" outlined dense {req_rule} />""")
            elif f["type"] == "number":
                req_rule = "lazy-rules :rules=\"[val => val !== null || 'Obligatorio']\"" if f["required"] == "True" else ""
                inputs_html.append(f"""            <q-input v-model.number="formData.{f['name']}" type="number" label="{f['label']}" outlined dense {req_rule} />""")
            elif f["type"] == "boolean":
                inputs_html.append(f"""            <q-toggle v-model="formData.{f['name']}" label="{f['label']}" color="primary" />""")
    
    inputs_code = "\n".join(inputs_html)

    assignments_edit = "\n".join([f"  formData.{f['name']} = row.{f['name']};" for f in cfg["fields"]])
    
    save_row_props = []
    for f in cfg["fields"]:
        save_row_props.append(f"      {f['name']}: formData.{f['name']}")
    save_row_props_str = ",\n".join(save_row_props)
    
    reset_logic = "\n".join([f"  formData.{f['name']} = {get_default_value(f['type'])};" for f in cfg["fields"]])

    vue_content = f"""<template>
  <q-page padding>
    <div class="row items-center justify-between q-mb-md">
      <div class="text-h5 text-primary text-weight-bold">{cfg["frontend_title"]}</div>
      <q-btn color="primary" icon="add" label="Agregar {cfg["frontend_title"]}" @click="openNew" class="shadow-1 q-px-md rounded-borders"/>
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
          <div class="text-h6">{{{{ isEditing ? 'Editar' : 'Nuevo' }}}} {cfg["frontend_title"]}</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section class="q-pt-md">
          <q-form @submit="saveData" class="q-gutter-md">
{inputs_code}
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
import {{ ref, reactive, onMounted }} from 'vue';
import {{ useQuasar }} from 'quasar';
import {{ api }} from 'src/boot/axios';

const $q = useQuasar();

// Estado
const loading = ref(false);
const saving = ref(false);
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

onMounted(() => {{
  fetchRows();
}});

async function fetchRows() {{
  loading.value = true;
  try {{
    const response = await api.get('/api/{cfg["endpoint"]}');
    rows.value = response.data;
  }} catch (error) {{
    $q.notify({{ type: 'negative', message: 'Error cargando datos' }});
  }} finally {{
    loading.value = false;
  }}
}}

function openNew() {{
  isEditing.value = false;
{reset_logic}
  showForm.value = true;
}}

function editRow(row: any) {{
  isEditing.value = true;
{assignments_edit}
  showForm.value = true;
}}

function deleteRow(row: any) {{
  $q.dialog({{
    title: 'Confirmar eliminación',
    message: `¿Estás seguro que deseas eliminar el registro?`,
    cancel: true,
    persistent: true
  }}).onOk(async () => {{
    try {{
      await api.delete(`/api/{cfg["endpoint"]}/${{row.{pk}}}`);
      $q.notify({{ type: 'positive', message: 'Registro eliminado' }});
      fetchRows();
    }} catch (error) {{
      $q.notify({{ type: 'negative', message: 'Error al eliminar' }});
    }}
  }});
}}

async function saveData() {{
  saving.value = true;
  try {{
    const payload = {{
{save_row_props_str}
    }};
    if (isEditing.value) {{
      await api.put(`/api/{cfg["endpoint"]}/${{formData.{pk}}}`, payload);
      $q.notify({{ type: 'positive', message: 'Registro actualizado' }});
    }} else {{
      await api.post(`/api/{cfg["endpoint"]}`, payload);
      $q.notify({{ type: 'positive', message: 'Registro creado' }});
    }}
    showForm.value = false;
    fetchRows();
  }} catch (error) {{
    $q.notify({{ type: 'negative', message: 'Error al procesar el guardado' }});
  }} finally {{
    saving.value = false;
  }}
}}
</script>

<style scoped>
.rounded-borders {{
  border-radius: 8px;
}}
</style>
"""
    filepath = os.path.join(FRONTEND_DIR, "src", "pages", "maestros", f'{cfg["frontend_component"]}.vue')
    with open(filepath, 'w', encoding='utf-8') as f:
         f.write(vue_content)
    print(f"Frontend Vue component {cfg['frontend_component']} connected and generated.")


def main():
    for cfg in configuraciones:
        print(f"=== Creando el módulo Full Stack: {cfg['frontend_title']} ===")
        generate_backend_module(cfg)
        inject_in_app_module(cfg)
        generate_frontend_vue(cfg)
        print("Done.")

if __name__ == "__main__":
    main()
