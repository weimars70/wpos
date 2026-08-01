# Directiva: Generación del Módulo Maestros (SOP)

## Objetivo
Implementar la sección "Maestros" en el Navbar lateral del frontend y generar 11 vistas individuales con su propio CRUD básico, listado y formulario, listos para ser conectados a un backend o DLL de base de datos futuro.

## Entidades
Las 11 entidades a crear son:
1. Medios de pago (medios-pago)
2. Colores (colores)
3. Documentos (documentos)
4. Empleados (empleados)
5. Grupos Items (grupos-items)
6. Tipo Iva (tipo-iva)
7. Listado Items (listado-items)
8. Listado Items Inactivos (listado-items-inactivos)
9. Items (items)
10. Proveedores (proveedores)
11. Clientes (clientes)

## Lógica y Pasos a Ejecutar (Vía Script Python `generar_maestros.py`)

1. **Inyectar Rutas en `router/index.ts`**
   - Leer `frontend/src/router/index.ts`.
   - Localizar el grupo `children` de `MainLayout.vue` donde están inyectadas las rutas `dashboard`, `users`, etc.
   - Insertar dinámicamente el objeto de rutas para Maestros si no existen.

2. **Inyectar Menú Lateral en `layouts/MainLayout.vue`**
   - Buscar `<q-list padding class="q-mt-md">` o buscar la línea del Dashboard.
   - Insertar un `<q-expansion-item label="Maestros" icon="folder_special">` conteniendo las 11 redirecciones `<q-item to="/maestros/...">`.

3. **Generar Archivos VUE**
   - Por cada una de las 11 entidades, crear el archivo en `frontend/src/pages/maestros/EntidadPage.vue`.
   - El contenido de cada vista deberá ser un componente `<script setup>` que incluya:
     - Un `<q-table>` estándar para el listado.
     - Un `<q-btn label="Agregar">` que despliegue un modal o dialogo.
     - Un `<q-dialog>` con un `<q-card>` sirviendo de formulario base.
     - Simular el estado de las filas y columnas (`ref`, `reactive`) en Vue3 (Composition API).

## Salidas
- `frontend/src/router/index.ts` (modificado)
- `frontend/src/layouts/MainLayout.vue` (modificado)
- 11 archivos nuevos en `frontend/src/pages/maestros/`

## Restricciones / Casos Borde
- Asegurarse de realizar inyecciones idempotentes en el código, evitando que si se corre el script dos veces duplique el menú o las rutas.
- Manejar correctamente la indentación Vue y TypeScript.
- Prevenir conflictos importando los componentes adecuadamente en el router mediante carga paulatina `() => import(...)`.
- **CRÍTICO:** Cuando se busque inyectar en `MainLayout.vue`, no buscar simplemente `</q-list>`, ya que el layout principal tiene múltiples listas (por ejemplo, en el dropdown de usuario). Se debe buscar específicamente la zona del drawer `<q-drawer>`, o anclar la inyección después de un elemento conocido del menú lateral (ej. `<q-expansion-item icon="shopping_cart" label="Salidas"...`).
