# 🐾 Healthy Pets - Backend API

API REST empresarial para el sistema de gestión veterinaria **Healthy Pets**, desarrollada con **Node.js**, **NestJS**, **Prisma ORM** y **PostgreSQL**.

---

## 🚀 Arquitectura y Tecnologías

* **Framework:** [NestJS](https://nestjs.com/) v10 (Arquitectura modular, controladores, servicios, DTOs y Guards).
* **ORM:** [Prisma ORM](https://www.prisma.io/) v5 (Tipado estricto, relaciones declarativas y migraciones).
* **Base de Datos:** [PostgreSQL](https://www.postgresql.org/) 16+ (Compatible con Supabase, Neon y Docker local).
* **Seguridad:** JWT (JSON Web Tokens) con Passport, bcrypt y control de acceso basado en roles (RBAC: `ADMIN`, `VETERINARIAN`, `RECEPTIONIST`, `CLIENT`, `WORKER`).
* **Documentación:** Swagger / OpenAPI 3.0 auto-generado en `/api/docs`.

---

## 📋 Requisitos Previos

* Node.js v18+ o v20+ (LTS recomendado).
* Docker Desktop (para la base de datos PostgreSQL local) o una URL de PostgreSQL en Supabase / Neon.

---

## ⚙️ Configuración y Variables de Entorno

Crea un archivo `.env` en la raíz de `backend/` basado en `.env.example`:

```env
# Puerto del servidor (por defecto 8080 para emparejar con el frontend de Next.js)
PORT=8080
NODE_ENV=development

# Cadena de conexión a PostgreSQL
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/healthy_pets_db?schema=public"

# Clave secreta para firma de tokens JWT
JWT_SECRET="healthy-pets-super-secure-jwt-production-ready-key-2026"
JWT_EXPIRATION="24h"

# URL del Frontend (CORS)
FRONTEND_URL="http://localhost:3000"
```

---

## 🛠️ Instalación y Puesta en Marcha

### 1. Iniciar Base de Datos Local con Docker
Desde la raíz del repositorio (`HD_frontend/`):
```bash
docker compose up -d
```

### 2. Instalar Dependencias del Backend
```bash
cd backend
npm install
```

### 3. Generar Cliente Prisma y Poblar la Base de Datos (Seed)
```bash
npm run prisma:generate
npm run prisma:seed
```

### 4. Iniciar Servidor en Desarrollo
```bash
npm run start:dev
```
El servidor escuchará en `http://localhost:8080`.

---

## 📖 Documentación Interactiva (Swagger)

Una vez iniciado el servidor, accede a la documentación interactiva en:
👉 **[http://localhost:8080/api/docs](http://localhost:8080/api/docs)**

---

## 🔑 Cuentas de Prueba Preconfiguradas (Seed)

| Rol | Username | Password | Propósito |
| :--- | :--- | :--- | :--- |
| **Administrador** | `admin` | `password123` | Control total del sistema y gestión de usuarios. |
| **Veterinario** | `vet_alejandro` | `password123` | Consultas, historiales médicos y vacunas. |
| **Veterinaria** | `vet_lucia` | `password123` | Cirugías y consultas médicas. |
| **Recepcionista** | `recep_maria` | `password123` | Registro de clientes, mascotas y citas. |
| **Cliente** | `client_carlos` | `password123` | Portal de autoservicio y carnet de vacunas. |

---

## 📡 Módulos y Endpoints Principales

| Módulo | Endpoint Base | Descripción |
| :--- | :--- | :--- |
| **Auth** | `/auth` | `/auth/login`, `/auth/me`, `/auth/register` (público de clientes). |
| **Usuarios** | `/user` | CRUD de cuentas de acceso del sistema. |
| **Dueños** | `/owner` | CRUD de clientes, `/owner/me` y búsqueda por `/owner/dni/:dni`. |
| **Mascotas** | `/pet` | Pacientes caninos, felinos y especies atendidas. |
| **Recepcionistas**| `/receptionist` | Personal de atención al cliente y recepción. |
| **Veterinarios** | `/veterinarian` | Médicos veterinarios con número de colegiatura. |
| **Servicios** | `/services` | Catálogo de precios y servicios clínicos. |
| **Citas** | `/appointment` | Agenda de citas y estados (`OPENED`, `CLOSED`, etc.). |
| **Historiales** | `/medical_history`| Ficha clínica de atención y diagnóstico SOAP. |
| **Vacunas** | `/vaccine` | Catálogo de biológicos e inmunizaciones. |
| **Vacunación** | `/vaccination` | Carnet de vacunas aplicadas y refuerzos. |
| **Reportes** | `/reports` | `/reports/completed-services` y citas por estado. |
