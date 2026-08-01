# Setup — Huellas

## 1. Requisitos
- Node.js >= 18
- PostgreSQL >= 14
- npm o yarn

## 2. Base de datos

```bash
# Crear base de datos
psql -U postgres -c "CREATE DATABASE huellas_db;"

# Ejecutar schema (opcional — TypeORM synchronize:true lo hace automáticamente)
psql -U postgres -d huellas_db -f schema.sql

# Cargar datos de prueba
psql -U postgres -d huellas_db -f seed.sql
```

> **Nota**: Con `synchronize: true` en TypeORM, las tablas se crean automáticamente al arrancar el backend. No necesitas ejecutar `schema.sql` en desarrollo.

## 3. Backend (NestJS)

```bash
cd backend
cp .env.example .env
# Edita .env con tus credenciales de PostgreSQL

npm install
npm run start:dev
# API disponible en http://localhost:3000
```

## 4. Frontend (Vue + Quasar)

```bash
cd frontend
cp .env.example .env
# Si el backend corre en otro puerto, edita VITE_API_URL

npm install
npm run dev
# App disponible en http://localhost:9000
```

## 5. Credenciales de prueba

| Email | Password |
|-------|----------|
| admin@huellas.com | Admin123! |
| juan@huellas.com | Test123! |

## 6. Endpoints disponibles

| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| POST | /auth/login | No | Login → retorna access_token |
| POST | /auth/register | No | Registrar nuevo usuario |
| GET | /users | JWT | Listar usuarios |
| GET | /users/:id | JWT | Obtener usuario |
| POST | /users | JWT | Crear usuario |
| PUT | /users/:id | JWT | Actualizar usuario |
| DELETE | /users/:id | JWT | Eliminar usuario |
