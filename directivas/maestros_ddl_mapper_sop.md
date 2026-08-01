# Directiva: Mapeo de DDL a Vistas Maestros (SOP)

## Objetivo
Actualizar los archivos `.vue` de la carpeta `src/pages/maestros/` basándose en las sentencias DDL (CREATE / SELECT) provistas de la base de datos PostgreSQL, inyectando código personalizado a cada maestro en lugar del genérico (`id`, `nombre`).

## Lógica y Pasos a Ejecutar (Vía Python `mapper_maestros.py`)

1. **Diccionario de Configuración**:
   Se declararán configuraciones para cada tabla en base a los DDL que se vayan recibiendo. Cada maestro tendrá:
   - `component`: Nombre del archivo (ej. `MediosPagoPage`).
   - `fields`: Array de diccionarios describiendo nombre, tipo de dato (`string`, `number`, `boolean`), y si es Primary Key o Autoincremental.

2. **Generador de Layout Vue**:
   Por cada maestro, el script generará:
   - **`formData` en Vue (`reactive`)**: Asigna `null` a enteros opcionales/numericos, `""` a textos y `false` a booleanos.
   - **`columns` de Quasar (`q-table`)**: Etiquetas y alineaciones según tipo de dato.
   - **Inputs de Formulario (`q-form`)**: 
     - Para `number`: `<q-input type="number"...>`
     - Para `string`/`text`: `<q-input type="text"...>`
     - Para `boolean`: `<q-toggle>`
   - **Lógica `saveData()`**: Asegurar que la key primaria real sea utilizada en la búsqueda de edición (`row.codigo === formData.codigo`).

## Restricciones y Casos Borde
- Si la primary key es `id` o `codigo`, la lógica de "Guardar nuevo" generadora automática temporal debe buscar sobre esa propiedad (ej. `Math.max(...rows.map(r => r.codigo))`).
- Si la key debe ser ingresada a mano (como en `codigo INTEGER NOT NULL` sin SERIAL), dejar el input habilitado en modo "Nuevo" pero inhabilitado en "Edición" (usando `:disable="isEditing"`).
- Respetar formato y estilo del framework actual Vue 3 `<script setup>`.
