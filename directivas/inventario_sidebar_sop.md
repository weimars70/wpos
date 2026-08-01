# Directiva: Implementación del Módulo de Inventario en el Sidebar

## Objetivo
Agregar una nueva sección llamada "Inventario" en la barra lateral (sidebar) que contenga todas las opciones visualizadas en la imagen de referencia, manteniendo la consistencia de diseño con los módulos existentes (Salidas y Maestros).

## Entradas
- Imagen de referencia con las opciones del menú.
- Estructura actual de `MainLayout.vue`.
- Patrones de diseño de Quasar (`q-expansion-item`, `q-item`).

## Lógica de Implementación

### 1. Interfaz de Usuario (MainLayout.vue)
- Crear un componente `q-expansion-item` para "Inventario".
- Usar el icono `inventory_2` o similar para representar el módulo.
- Agregar los siguientes sub-items (q-item):
    - Ajuste Inventario
    - Inventario General
    - Listado Ajustes
    - Listado Inventario
    - Listado Traslados
    - Movimiento Items
    - Movimiento Items Filtrar
    - Recibir Traslado Inventario
    - Valor Inventario
    - Traslado Inventario

### 2. Enrutamiento (router/index.ts o routes.ts)
- Definir las rutas correspondientes en el frontend para cada una de las opciones anteriores.
- Las rutas deben seguir el prefijo `/inventario/`.

### 3. Componentes Base (pages/Inventario/...)
- Crear archivos `.vue` básicos para cada página que sirvan como placeholders.
- Estos componentes deben heredar el estilo visual del sistema (usando `q-page`, encabezados consistentes, etc.).

## Restricciones y Casos Borde
- **Nombres de Rutas:** Asegurarse de que coincidan exactamente con lo definido en el Sidebar.
- **Iconos:** Usar `arrow_right` con tamaño `xs` para los sub-items para mantener consistencia con el módulo "Maestros".
- **Estado Activo:** Configurar `active-class="bg-blue-1 text-primary"` para resaltar la opción seleccionada.

## Verificación
1. Abrir la aplicación y verificar que el desplegable "Inventario" aparezca en el sidebar.
2. Hacer clic en cada opción y confirmar que navega a una página (aunque sea un placeholder).
3. Validar que visualmente sea idéntico a "Maestros".
