# 🏆 Informe Final de Arquitectura, Base de Datos y Despliegue: "Healthy Pets"

**Rol:** Arquitecto de Software Senior y Experto en Bases de Datos  
**Fecha:** Octubre 2026  
**Proyecto:** Sistema de Gestión Veterinaria "Healthy Pets"  
**Repositorio Base:** [`HD_frontend`](https://github.com/Brunux-hub/HD_frontend.git)  

---

## 1. Resumen Ejecutivo

El presente informe documenta el diseño, la construcción, la integración y la verificación completa del backend y la base de datos para la plataforma de gestión clínica veterinaria **"Healthy Pets"**.

El sistema digitaliza íntegramente el flujo de una clínica veterinaria: desde el registro y control de clientes (`owners`) y pacientes (`pets`), la programación y seguimiento de citas (`appointments`), la emisión de historiales clínicos con diagnóstico SOAP (`medical_histories`), hasta el carnet y control de inmunizaciones (`vaccines` y `vaccinations`), el catálogo de servicios clínicos (`services`) y el control de accesos de personal y clientes mediante autenticación JWT y políticas de seguridad a nivel de fila (**Row Level Security - RLS**).

---

## 2. Decisiones Técnicas y Justificación Arquitectónica

### 2.1. Backend: NestJS vs Next.js API Routes
* **Decisión:** **NestJS (Node.js + TypeScript)** en arquitectura desacoplada ejecutándose en el puerto `8080`.
* **Justificación:**
  1. **Arquitectura Empresarial Limpia:** NestJS provee inyección de dependencias nativa, separación estricta de capas (Controladores, Servicios, Módulos, DTOs, Guards e Interceptores) y validación declarativa mediante `class-validator`, facilitando el mantenimiento a largo plazo.
  2. **Gestión de Conexiones a Base de Datos:** Las funciones serverless de Next.js API Routes en entornos como Vercel abren y cierran conexiones efímeras, saturando rápidamente los pools de PostgreSQL. NestJS opera como un proceso persistente con un pool optimizado y reutilizable.
  3. **Desacoplamiento Front/Back:** Mantiene el frontend enfocado en la experiencia de usuario (SSR, React Server Components) y delega la lógica clínica y transaccional a un microservicio backend independiente.
  4. **Documentación Swagger / OpenAPI Integrada:** Generación automática de especificación OpenAPI interactiva disponible en `/api/docs`.

### 2.2. ORM: Prisma ORM vs Drizzle
* **Decisión:** **Prisma ORM**.
* **Justificación:**
  1. **Mapeo de Relaciones Jerárquicas Complejas:** El frontend requiere respuestas con relaciones anidadas profundas (ejemplo: un carnet de vacunación requiere `Vaccination -> MedicalHistory -> Appointment -> Pet -> Owner`). Prisma resuelve esto con tipado estricto en tiempo de compilación y directivas `include`.
  2. **Ecosistema y Migraciones:** Soporte out-of-the-box para NestJS con ciclo de vida `onModuleInit`/`onModuleDestroy` y comandos de migración y seeding (`prisma migrate`, `prisma seed`).

### 2.3. Base de Datos & Seguridad: PostgreSQL 16 + RLS
* **Decisión:** **PostgreSQL 16+** (alojable en Supabase, Neon o contenedor local Docker).
* **Justificación:**
  1. Integridad referencial con restricciones `CASCADE` y `RESTRICT` para proteger registros médicos de eliminaciones accidentales.
  2. 21 Índices B-Tree estratégicos para garantizar consultas en tiempos sub-milisegundo en campos críticos (`dni`, `id_owner`, `date`, `status`).
  3. Triggers PL/pgSQL automatizados para auditoría de timestamp `updated_at`.
  4. **Row Level Security (RLS)** granular que aísla los datos de clientes (`CLIENT`), permitiendo que solo vean sus propias mascotas, citas e historiales, mientras que el personal clínico (`ADMIN`, `VETERINARIAN`, `RECEPTIONIST`) cuenta con permisos acordes a su rol operativo.

### 2.4. Resolución de Casos Especiales del Frontend
Durante la inspección de código del frontend se identificaron particularidades del contrato que el backend implementó fielmente:
* **Enrutamiento Singular vs Plural:** Soporte exacto para `/appointment`, `/owner`, `/pet`, `/medical_history`, `/receptionist`, `/veterinarian`, `/services`, `/user`, `/vaccine`, `/vaccination`.
* **Mapeo de Propiedades:**
  * En `/pet`: El frontend envía `sex` (`MALE`/`FEMALE`) en las peticiones de creación/edición, pero espera recibir `pet_gender` en las respuestas. El servicio realiza la transformación bidireccional de manera transparente.
  * En `/veterinarian`: El usuario asociado se expone como `user_response: User`.
  * En `/medical_history`: El servicio médico asociado se expone como `services: Service`.
* **Flujo de Registro de Cliente:** El endpoint `POST /auth/register` crea de forma transaccional la cuenta de acceso (`users`) y la ficha médica del propietario (`owners`), devolviendo la entidad `Owner`.
* **Endpoints Personalizados:** `/owner/me` (perfil del usuario autenticado) y `/owner/dni/:dni` (búsqueda rápida por documento).

---

## 3. Estructura de Entregables Generados

```
HD_frontend/
├── schema/                                 # Directorio SQL multi-archivo
│   ├── 01_types_and_extensions.sql         # Extensiones (pgcrypto) y ENUMs
│   ├── 02_tables.sql                       # DDL completo con PK, FK, CHECKs y defaults
│   ├── 03_indexes.sql                      # 21 Índices B-Tree optimizados
│   ├── 04_triggers.sql                     # Triggers PL/pgSQL para updated_at
│   ├── 05_rls_policies.sql                 # Políticas RLS para Supabase/PostgreSQL
│   ├── 06_seed_initial.sql                 # Inserción de datos sintéticos iniciales
│   ├── apply_all.sql                       # Script maestro de inicialización en lote
│   └── ER_DIAGRAM.md                       # Diagrama ER en Mermaid y diccionario de datos
│
├── backend/                                # Código fuente completo del backend
│   ├── prisma/
│   │   ├── schema.prisma                   # Esquema Prisma sincronizado con PostgreSQL
│   │   └── seed.ts                         # Script de seeding en TypeScript (bcrypt)
│   ├── src/
│   │   ├── main.ts                         # Bootstrap NestJS con Swagger, CORS y Pipes
│   │   ├── app.module.ts                   # Módulo raíz de la aplicación
│   │   ├── common/                         # Decoradores, Guards (JWT, Roles) y Filtros
│   │   ├── prisma/                         # PrismaService global
│   │   └── modules/                        # Módulos de dominio (Auth, Users, Owners, Pets,
│   │                                       # Appointments, MedicalHistories, Vaccines, etc.)
│   ├── .env                                # Variables de entorno locales
│   ├── .env.example                        # Plantilla de variables de entorno
│   ├── package.json                        # Dependencias de NestJS y Prisma
│   └── README.md                           # Guía de ejecución del backend
│
├── docker-compose.yml                      # Orquestador Docker para PostgreSQL 16
├── tests/
│   └── verify_backend_api.py               # Suite automatizada de pruebas HTTP
└── docs/
    ├── ARCHITECTURE_AND_RESEARCH.md        # Documento de investigación de Fase 1
    └── FINAL_ARCHITECTURE_REPORT.md        # Copia del informe final en el proyecto
```

---

## 4. Resultados de Verificación y Pruebas (Fase 4)

Se ejecutó la suite de verificación automatizada `tests/verify_backend_api.py` contra la instancia en ejecución en `http://localhost:8080`, cubriendo todos los flujos de autenticación, autorización por roles, consultas de dominio y contratos específicos:

| # | Caso de Prueba | Método / Endpoint | Resultado | Detalle |
| :-: | :--- | :--- | :-: | :--- |
| 1 | Catálogo público de servicios | `GET /services` | **PASS** | 200 OK, catálogo retornado sin requerir token |
| 2 | Catálogo público de vacunas | `GET /vaccine` | **PASS** | 200 OK, catálogo de vacunas retornado |
| 3 | Login con contraseña errónea | `POST /auth/login` | **PASS** | 401 Unauthorized verificado |
| 4 | Login de Administrador | `POST /auth/login` | **PASS** | 200 OK, token JWT generado correctamente |
| 5 | Login de Cliente | `POST /auth/login` | **PASS** | 200 OK, token JWT de cliente generado |
| 6 | Consulta de rol propio (Admin) | `GET /auth/me` | **PASS** | 200 OK, rol `ADMIN` confirmado |
| 7 | Consulta de rol propio (Cliente)| `GET /auth/me` | **PASS** | 200 OK, rol `CLIENT` confirmado |
| 8 | Listado de usuarios del sistema | `GET /user` | **PASS** | 200 OK, acceso autorizado a Admin |
| 9 | Listado general de clientes | `GET /owner` | **PASS** | 200 OK, listado de dueños retornado |
| 10 | Búsqueda de cliente por DNI | `GET /owner/dni/72849102` | **PASS** | 200 OK, cliente Carlos Mendoza ubicado |
| 11 | Ficha propia del cliente | `GET /owner/me` | **PASS** | 200 OK, resuelve ficha con token de cliente |
| 12 | Listado de mascotas con dueño | `GET /pet` | **PASS** | 200 OK, incluye `owner` anidado y `pet_gender` |
| 13 | Listado de veterinarios | `GET /veterinarian` | **PASS** | 200 OK, incluye `user_response` con usuario |
| 14 | Listado de recepcionistas | `GET /receptionist` | **PASS** | 200 OK, incluye cuenta `user` asociada |
| 15 | Agenda de citas clínicas | `GET /appointment` | **PASS** | 200 OK, incluye paciente, veterinario y recepción |
| 16 | Historiales médicos | `GET /medical_history` | **PASS** | 200 OK, incluye objeto `services` y `appointment` |
| 17 | Registro de vacunaciones | `GET /vaccination` | **PASS** | 200 OK, incluye `medical_history` y `vaccine` |
| 18 | Reporte de servicios completados | `GET /reports/completed-services` | **PASS** | 200 OK, atenciones con estado `CLOSED` |
| 19 | Reporte de citas por estado | `GET /reports/appointments?status=CLOSED` | **PASS** | 200 OK, filtro de estado verificado |
| 20 | Registro público de nuevo cliente | `POST /auth/register` | **PASS** | 201 Created, transacción User + Owner exitosa |
| 21 | Login con nuevo cliente | `POST /auth/login` | **PASS** | 200 OK, autenticación inmediata |
| 22 | Consulta `/owner/me` nuevo cliente| `GET /owner/me` | **PASS** | 200 OK, vinculación cuenta-ficha validada |
| 23 | Alta de mascota con campo `sex` | `POST /pet` | **PASS** | 201 Created, `sex` mapeado a `pet_gender` en DB |

**Resumen de la Suite:** **23 / 23 Pruebas Exitosas (100.0%)**.

---

## 5. Guía de Despliegue en Producción

### 5.1. Despliegue de la Base de Datos en Supabase
1. Crear un nuevo proyecto en [Supabase](https://supabase.com/).
2. En el menú **SQL Editor**, copiar y ejecutar el contenido de [`schema/01_types_and_extensions.sql`](file:///c:/Users/TK/Documents/Proyectos-antigravity/Taller%20Tics/HD_frontend/schema/01_types_and_extensions.sql) hasta [`schema/05_rls_policies.sql`](file:///c:/Users/TK/Documents/Proyectos-antigravity/Taller%20Tics/HD_frontend/schema/05_rls_policies.sql), o ejecutar el script maestro [`schema/apply_all.sql`](file:///c:/Users/TK/Documents/Proyectos-antigravity/Taller%20Tics/HD_frontend/schema/apply_all.sql).
3. Obtener la cadena de conexión en modo **Session / Direct Connection**:
   ```
   DATABASE_URL="postgresql://postgres.[project-ref]:[password]@aws-0-[region].pooler.supabase.com:5432/postgres?schema=public"
   ```

### 5.2. Despliegue del Backend en la Nube (Render, Railway o Container App)
1. Conectar el repositorio en la plataforma elegida (ej. [Render](https://render.com/) o [Railway](https://railway.app/)).
2. Configurar el Root Directory como `backend`.
3. Especificar los comandos de build y start:
   * **Build Command:** `npm install && npm run prisma:generate && npm run build`
   * **Start Command:** `npm run start:prod`
4. Configurar las variables de entorno en el panel de la nube:
   * `PORT`: `8080`
   * `NODE_ENV`: `production`
   * `DATABASE_URL`: URL de conexión de Supabase.
   * `JWT_SECRET`: Cadena aleatoria de 256 bits generada con `openssl rand -base64 32`.
   * `FRONTEND_URL`: URL del frontend en Vercel (ej. `https://hd-frontend-ten.vercel.app`).

### 5.3. Conexión del Frontend en Vercel
1. En el proyecto de Vercel del frontend (`HD_frontend`):
2. Ir a **Settings > Environment Variables**.
3. Añadir la variable de entorno:
   * `BACKEND_URL`: URL pública de la API desplegada (ej. `https://healthy-pets-api.onrender.com`).
4. Re-desplegar el frontend para que el rewrite de `next.config.ts` reenvíe las peticiones `/api/*` al nuevo backend.

---

## 6. Conclusión

El backend y la base de datos de **Healthy Pets** han quedado completamente diseñados, implementados, securizados y verificados. Cumplen al 100% con los requerimientos técnicos y arquitectónicos solicitados, respetando con fidelidad las expectativas de contratos del frontend existente y dejando la plataforma lista para su escalamiento y puesta en producción.
