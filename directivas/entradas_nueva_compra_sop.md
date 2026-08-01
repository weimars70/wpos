# Directiva: Implementación de Nueva Compra (Entradas)

## Objetivo
Implementar la funcionalidad de "Nueva Compra" que permita capturar un encabezado ($enc) y múltiples detalles de productos ($det) y registrarlos en la base de datos a través de la función `func_registra_compra`.

## Entradas
- Función DB: `SELECT func_registra_compra('$enc', '$det') as rpta`.
- Entidades relacionadas: Proveedores, Items.

## Lógica de Implementación

### 1. Backend (NestJS)
- Crear el módulo `entradas`.
- Implementar un DTO `CreateCompraDto` con:
    - `enc`: Objeto con `ident`, `empresa_id`, `nombre`, `tipo`, `forma_pago`, `plazo`, `total`, `subtotal`, `iva`, etc.
    - `det`: Array de objetos con `item`, `nombre`, `cantidad`, `pcompra`, `pdesc`, `por_iva`, `subtotal`.
- Implementar un servicio `EntradasService`:
    - El método será similar a `SalidasService.registrarSalida` pero llamando a `func_registra_compra`.
    - `enc` se debe enviar como un array stringificado `JSON.stringify([dto.enc])` si el SP así lo requiere (como ocurre en Salidas).
    - `det` se envía stringificado.
- Exponer un controlador `EntradasController` con la ruta `POST /api/entradas/registrar-compra`.

### 2. Frontend (Quasar/Vue)
- Actualizar `NuevaCompraPage.vue`:
    - Formulario de encabezado:
        - Búsqueda de Proveedor (ident, nombre).
        - Tipo de compra, Forma de pago, Plazo.
    - Captura de Detalles:
        - Buscador de Items.
        - Captura de cantidad, precio de compra, talla, color.
        - Tabla dinámica de items agregados.
        - Cálculo automático de totales (subtotal, IVA, total).
    - Acción Guardar:
        - Validar que haya al menos un item.
        - Enviar datos al endpoint `/api/entradas/registrar-compra`.

## Restricciones y Casos Borde
- **Precisión Numérica:** Asegurar redondeo correcto a 2 decimales en totales.
- **Validaciones:** Identificación de proveedor válida, al menos un item con cantidad > 0.
- **Mapeo de Datos:** Las claves en el JSON deben coincidir con lo esperado por el SP (verificar si es `pcompra` o `pvfinal` dependiendo de si es entrada o salida).

## Verificación
1. Registrar una compra con 1-2 items.
2. Confirmar que la función `func_registra_compra` retorne un éxito (o error controlado).
3. Validar que la compra aparezca en el listado de compras (siguiente paso).
