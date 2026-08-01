# Directiva: Gestión de Sesión y Empresa (SOP)

## Objetivo
Permitir que los usuarios seleccionen una empresa (sucursal) específica al iniciar sesión y asegurar que todas las operaciones de la base de datos (INSERT, SELECT, UPDATE) utilicen el `empresa_id` de la sesión activa.

## Registro de Operaciones

### 1. Flujo de Autenticación con Selección de Empresa
- **Paso 1: Identificación del Usuario.** El frontend solicita el nombre de usuario.
- **Paso 2: Obtención de Empresas.** El backend debe proveer un endpoint para listar las empresas asociadas a ese nombre de usuario (sin requerir contraseña aún).
- **Paso 3: Selección y Login.** El usuario selecciona la empresa, ingresa su contraseña y el login se procesa con `(usuario, password, empresa_id)`.
- **Paso 4: Token JWT.** El token generado DEBE incluir el `empresa_id`.

### 2. Persistencia en Sesión
- El `empresa_id` debe almacenarse en el store de autenticación del frontend (Pinia).
- Debe incluirse en los headers de las peticiones API o extraerse del JWT en el backend.

### 3. Integración en Operaciones de DB
- Toda consulta SQL o guardado debe filtrar por `empresa_id` o `sucursal` según corresponda la tabla.
- **Caso Salidas:** El endpoint de facturación debe usar el `empresa_id` del token JWT en lugar de un parámetro manual si es posible, para mayor seguridad.

## Restricciones y Casos Borde
- **Error Conocido:** Si el usuario no selecciona empresa, el login debe fallar con un mensaje claro.
- **Seguridad:** No confiar en el `empresa_id` enviado por el frontend en el cuerpo de la petición si ya existe en el JWT; usar siempre el del JWT (extraído en el `JwtStrategy`).
- **Configuración Frontend (Error Pinia):** Recientemente se resolvió el error `"getActivePinia()" was called but there was no active Pinia` al cargar `LoginPage.vue`.
  - *Nota: No usar el store de Pinia en componentes si no existe el archivo `src/stores/index.ts` que exporta la instancia. En Quasar CLI con Vue 3, es obligatorio este archivo de entrada para que el framework inyecte la instancia de Pinia globalmente de forma automática. De lo contrario, causa el error mencionado al instanciar `useAuthStore()`.*
- **Error Frontend (QPage):** `"QPage needs to be a deep child of QLayout"`.
  - *Nota: Todo componente `<q-page>` en Quasar (como el `LoginPage.vue` independiente) DEBE estar siempre envuelto por un elemento padre `<q-page-container>` y a su vez en un `<q-layout>`. Si las rutas no incluyen un layout envolvente (`children`), el propio componente debe tener `<q-layout><q-page-container>...</q-page-container></q-layout>` como esqueleto raíz.*

## Mantenimiento
- Si se agrega una nueva tabla que requiera multi-tenancy, debe incluir la columna `empresa_id` y actualizar esta directiva si hay lógica especial de filtrado.
