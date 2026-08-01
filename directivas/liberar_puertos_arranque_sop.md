# Directiva: Liberar Puertos en Arranque de Proyectos (SOP)

## Objetivo
Configurar los comandos de inicio de los proyectos (Frontend y Backend) para que, antes de levantar el servidor, aseguren que los puertos requeridos están libres (matando cualquier proceso existente en esos puertos).

## Entradas
- `frontend/package.json` (Puerto 9000 para el comando `dev`)
- `backend/package.json` (Puerto 3000 para los comandos `start` y `start:dev`)

## Lógica y Pasos a Ejecutar
1. Leer el archivo `package.json` del frontend localizado en `d:/huellas/frontend/package.json`.
2. Modificar el script `dev` agregando `npx kill-port 9000 && ` si no lo contiene.
3. Guardar el archivo `frontend/package.json`.
4. Leer el archivo `package.json` del backend localizado en `d:/huellas/backend/package.json`.
5. Modificar el script `start` agregando `npx kill-port 3000 && ` si no lo contiene.
6. Asegurarse que el script `start:dev` incluye `npx kill-port 3000 && `.
7. Guardar el archivo `backend/package.json`.

## Salidas
- Archivos `package.json` actualizados para el backend y frontend.

## Restricciones / Casos Borde
- Se asume el uso de `npx kill-port <puerto>` ya que es funcional y multiplataforma en entornos con Node.js.
- Se debe preservar el resto de las propiedades JSON (usando `json.dump` con indent=2) para asegurar que el archivo no quede corrupto.
