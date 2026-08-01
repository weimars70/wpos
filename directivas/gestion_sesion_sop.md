# Directiva: Gestión de Sesión y Empresa (SOP)

## Objetivo
Permitir que los usuarios seleccionen una empresa (sucursal) específica al iniciar sesión y asegurar que todas las operaciones de la base de datos (INSERT, SELECT, UPDATE) utilicen el `empresa_id` de la sesión activa.

## Registro de Operaciones

### 1. Flujo de Autenticación en 2 Pasos
- **Paso 1: Validación de Credenciales (Usuario + Contraseña).** El frontend solicita el nombre de usuario y la contraseña. Al enviar, el backend valida las credenciales (`POST /auth/validate`).
- **Paso 2: Obtención de Empresas Válidas.** El backend comprueba la contraseña mediante bcrypt y retorna únicamente las empresas a las que pertenece el usuario y para las cuales las credenciales son correctas.
- **Paso 3: Selección y Auto-Login.**
  - Si el usuario tiene **1 sola empresa**, el sistema realiza auto-login directo.
  - Si el usuario posee **múltiples empresas**, el sistema pasa al Paso 2 permitiéndole elegir la empresa a la que desea ingresar.
- **Paso 4: Token JWT.** El token generado DEBE incluir el `empresa_id`.

### 2. Persistencia en Sesión y Grupo Empresarial
- El `empresa_id` y el `grupo_empresarial` deben almacenarse en el store de autenticación del frontend (Pinia).
- El JWT debe incluir tanto el `empresaId` activo como el `grupoEmpresarial` extraído de la sucursal seleccionada.
- Debe incluirse en los headers de las peticiones API o extraerse del JWT en el backend en `req.user`.

### 3. Permisos Multi-Empresa por Grupo Empresarial
- En la creación de usuarios, el administrador puede listar todas las sucursales/tiendas del `grupo_empresarial` (`GET /users/empresas-grupo`) y asignar permisos de acceso seleccionando múltiples sucursales.
- Toda consulta SQL o guardado debe filtrar por `empresa_id` o `grupo_empresarial` según corresponda el alcance del módulo.
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
