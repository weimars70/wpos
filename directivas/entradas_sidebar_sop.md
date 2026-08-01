# Directiva: Implementación del Módulo de Entradas en el Sidebar

## Objetivo
Agregar una nueva sección llamada "Entradas" en la barra lateral (sidebar) que contenga las opciones visualizadas en la imagen de referencia, manteniendo el diseño de "sanduche" (expansion-item) y la coherencia visual del sistema.

## Entradas
- Imagen de referencia con las opciones: Listado Compras, Nueva Compra, Listado CXP, Movimiento facturas.
- Estructura actual de `MainLayout.vue` y `router/index.ts`.

## Lógica de Implementación

### 1. Interfaz de Usuario (MainLayout.vue)
- Crear un componente `q-expansion-item` para "Entradas".
- Usar el icono `login` o `input` para "Entradas" (representa ingreso de datos/mercancía).
- Agregar los sub-items (q-item):
    - Listado Compras
    - Nueva Compra
    - Listado CXP
    - Movimiento facturas

### 2. Enrutamiento (router/index.ts)
- Definir las rutas con el prefijo `/entradas/`.
- Rutas sugeridas:
    - `/entradas/listado-compras`
    - `/entradas/nueva-compra`
    - `/entradas/listado-cxp`
    - `/entradas/movimiento-facturas`

### 3. Componentes Base (pages/entradas/...)
- Crear archivos `.vue` básicos para cada página.
- Mantener el estilo "glass-card" consistente con el módulo de Inventario para indicaciones de WIP.

## Restricciones y Casos Borde
- **Consistencia:** Usar `active-class="bg-blue-1 text-primary"` y `icon="arrow_right"` con `size="xs"`.
- **Ubicación:** Colocar el módulo "Entradas" antes de "Salidas" o después de "Inventario" según orden lógico de flujo (Entradas -> Inventario -> Salidas). Lo colocaré antes de "Salidas" para un flujo lógico de mercancía.

## Verificación
1. Validar visualmente en el sidebar.
2. Confirmar navegación a los placeholders.
