# Directiva: Generación Full Stack Maestros (SOP)

## Objetivo
Implementar la generación automática de los modulos CRUD para la sección de "Maestros", lo que implica inyectar la lógica de persistencia y enrutamiento tanto en el Backend (NestJS) como en el Frontend (Vue 3 / Quasar). Esto asegura que al recibir el DDL (CREATE/SELECT) de cada tabla maestra, podamos de forma automatizada generar el CRUD 100% funcional y conectado.

## Arquitectura y Lógica a Ejecutar (Vía Python `generar_maestros_full.py`)

### 1. Backend (NestJS + TypeORM)
- **Directorio Base**: `backend/src/<maestro>/`
- **Componentes generados**:
  - `entity.ts`: Definición `@Entity` de TypeORM y sus columnas (ej. `@PrimaryGeneratedColumn`, `@Column`).
  - `controller.ts`: Rutas GET (listar un maestro u obtener uno), POST (crear), PUT o PATCH (actualizar), DELETE (borrar). Deberán recibir `empresa_id` dinámicamente o por sesión más adelante si es requerido.
  - `service.ts`: Interactuar con el repositorio inyectado (`@InjectRepository`).
  - `module.ts`: Declarar el componente, exportar el servicio.
- **Inyección en `app.module.ts`**: El script debe importar automáticamente la Entity y el Module, e inyectarlos en los arrays de `imports` e `entities` para asegurar el arranque exitoso de TypeORM y la API.

### 2. Frontend (Vue 3, Quasar)
- **Directorio Base**: `frontend/src/pages/maestros/<Componente>.vue`
- **Reemplazo del CRUD Local**:
  - Cambiar el almacenamiento efímero `rows.push()` por consultas asincrónicas a la API (endpoint backend `/<maestro>`).
  - **Librería Cliente**: `import { api } from 'src/boot/axios';`
  - **Métodos requeridos**: `fetchRows()`, `saveData()` interceptando `api.post` o `api.put`, y `deleteRow()` llamando `api.delete`.
  - Recargar lista tras guardados exitosos o en montaje.

## Restricciones y Casos Borde
- Manejo seguro de Primary Keys (PKs). Si el PK no es autoincremental (`auto_pk`: false), la sentencia en TypeORM debe ser `@PrimaryColumn()`. Si es autoincremental (`id`), debe ser `@PrimaryGeneratedColumn()`.
- Respetar los nombres convencionales de base de datos (`snake_case` para el nombre de tabla como `medios_pago` y `camelCase`/PascalCase para TypeScript).
- **Nota: No hacer inyección con Regex genérico en `app.module.ts`**, porque causa error al chocar con arrays anidados como `inject: [ConfigService]` de TypeORM. En su lugar, hacer reemplazos estrictos por palabras ancla (e.g. `UserModule,`) o simplemente solicitar la inyección manual si el AST no está disponible.
- Los módulos recién creados deben proveer un log de confirmación en la consola para confirmar su adición a NestJS.
