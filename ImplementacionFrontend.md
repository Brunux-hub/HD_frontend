PLAN: FRONTEND REACT + SHADCN - HealthyPets
1. CONTEXTO DEL PROYECTO
Backend: Spring Boot 4.0.6 con PostgreSQL (Supabase)
Base de datos: 10 tablas en esquema healthy_pets_bd
APIs: 11 controladores REST con operaciones CRUD completas
Autenticación: JWT con access token (1h) + refresh token (7d), Spring Security + BCrypt
Formato JSON: snake_case global (id_user, last_names, phone_number, etc.)
CORS: Solo permite localhost:3000 y localhost:5173

2. ARQUITECTURA PROPUESTA
frontend/
├── src/
│   ├── api/                    # Servicios HTTP (axios/fetch)
│   ├── components/             # Componentes reutilizables (shadcn/ui)
│   ├── features/               # Módulos por dominio
│   │   ├── auth/
│   │   ├── appointments/
│   │   ├── pets/
│   │   ├── owners/
│   │   ├── veterinarians/
│   │   ├── receptionists/
│   │   ├── medical-history/
│   │   ├── vaccines/
│   │   ├── services/
│   │   └── reports/
│   ├── hooks/                  # Custom hooks
│   ├── layouts/                # Layouts por rol
│   ├── pages/                  # Páginas/rutas
│   ├── store/                  # Estado global (Zustand/Context)
│   ├── types/                  # TypeScript interfaces
│   └── utils/                  # Helpers

3. MÓDULO DE AUTENTICACIÓN
3.1 Pantalla de Login
- Formulario: username + password
- Botón "Iniciar sesión"
- Mensajes de error (credenciales incorrectas → 401)
- Logo del sistema

3.2 Manejo de Sesión (JWT Real)
- POST /auth/login con { username, password } → recibe { access_token, refresh_token, token_type, expires_in, user }
- Guardar access_token y refresh_token en localStorage
- Enviar header Authorization: Bearer <access_token> en cada request (interceptor axios)
- Cuando el access_token expire (expires_in segundos), llamar POST /auth/refresh enviando el refresh_token como raw string en el body
- GET /auth/me para validar sesión activa y obtener datos del usuario
- Logout: eliminar tokens del frontend (no hay endpoint de logout en backend)

3.3 Roles y Permisos
El backend tiene ADMIN y WORKER en el enum UserType:
Rol Frontend   UserType Backend   Permisos
Administrador  ADMIN             CRUD total + Reportes + Gestión de usuarios
Recepcionista  WORKER            Citas, Dueños, Mascotas, Reportes limitados
Veterinario    WORKER            Citas asignadas, Historial médico, Vacunas

4. INTERFACES POR ROL
4.1 ADMINISTRADOR
Dashboard:
- Resumen: Total mascotas, citas hoy, veterinarios activos
- Gráficas: Citas por estado, servicios más solicitados
- Accesos rápidos a todas las secciones
Gestión de Usuarios:
- Tabla de usuarios (username, tipo)
- Crear/Editar/Eliminar usuarios
- Asignar roles (ADMIN / WORKER)
Gestión de Veterinarios:
- Tabla con: nombre, apellido, licencia, especialidad, email, teléfono
- CRUD completo
- Asociar con usuario del sistema
Gestión de Recepcionistas:
- Tabla con: nombre, apellido, email, teléfono
- CRUD completo
- Asociar con usuario del sistema
Reportes:
- Servicios completados (citas CLOSED)
- Citas por estado
- Estadísticas generales

4.2 RECEPCIONISTA
Dashboard:
- Citas del día
- Citas próximas (semana)
- Accesos rápidos: Nueva cita, Buscar mascota
Gestión de Dueños (Owners):
- Tabla: nombre, apellido, email, teléfono, dirección
- Buscar por nombre/email
- Crear/Editar/Eliminar
Gestión de Mascotas (Pets):
- Tabla: nombre, especie, raza, fecha nacimiento, sexo, peso
- Relación con dueño
- Crear/Editar/Eliminar
Gestión de Citas (Appointments):
- Calendario o lista de citas
- Crear cita:
  - Seleccionar mascota (buscar por nombre)
  - Seleccionar veterinario disponible (filtro por fecha)
  - Fecha y hora
  - Duración (minutos)
  - Motivo
- Editar cita: Cambiar fecha, motivo, notas
- Estados: OPENED → CLOSED / CANCELED / RESCHEDULED
- Ver veterinarios disponibles por fecha: GET /veterinarian/available?date=
Reportes Limitados:
- Citas por estado
- Servicios completados

4.3 VETERINARIO
Dashboard:
- Mis citas del día
- Citas pendientes (OPENED)
- Resumen de pacientes atendidos
Gestión de Citas Asignadas:
- Lista de citas donde yo soy el veterinario
- Filtrar por: fecha, estado
- Detalles de cita: mascota, dueño, motivo, notas
- Cambiar estado: OPENED → CLOSED (cuando atienda)
Historial Médico (Medical History):
- Crear historial al cerrar cita:
  - Seleccionar servicio (de la tabla services)
  - Descripción del diagnóstico/tratamiento
  - Fecha
- Ver historial de una mascota:
  - Lista de consultas anteriores
  - Servicios aplicados
  - Notas y descripciones
Vacunación (Vaccination):
- Registrar vacuna aplicada:
  - Seleccionar tipo de vacuna (de la tabla vaccines)
  - Fecha de aplicación
  - Próxima fecha de aplicación
  - Observaciones
- Ver vacunas de una mascota:
  - Calendario de vacunación
  - Próximas vacunas pendientes
Catálogo de Vacunas:
- Ver vacunas disponibles (nombre, fabricante, dosis requeridas)
- Solo lectura (CRUD lo maneja admin)

5. APIs A CONSUMIR (Mapeo Completo)
NOTA IMPORTANTE: Todos los JSON usan snake_case (configuración global de Jackson).
Ejemplo: id_user, last_names, phone_number, birthdate → "2026-06-23", date → "2026-06-23T14:30:00"
Todas las rutas requieren header Authorization: Bearer <token> excepto /auth/login y POST /user.

Autenticación
POST   /auth/login          → LoginResponse { access_token, refresh_token, token_type, expires_in, user }
POST   /auth/refresh        → LoginResponse (body: raw string del refresh_token)
GET    /auth/me             → UserResponse

Usuarios
GET    /user                → List<UserResponse>
GET    /user/{idUser}       → UserResponse
POST   /user                → UserResponse (201) —⚠️ Endpoint público (no requiere auth)
PUT    /user/{idUser}       → UserResponse
DELETE /user/{idUser}       → 204

Dueños
GET    /owner               → List<OwnerResponse>
GET    /owner/{idOwner}     → OwnerResponse
POST   /owner               → OwnerResponse (201)
PUT    /owner/{idOwner}     → OwnerResponse
DELETE /owner/{idOwner}     → 204

Mascotas
GET    /pet                 → List<PetResponse>
GET    /pet/{idPet}         → PetResponse
POST   /pet                 → PetResponse (201)
PUT    /pet/{idPet}         → PetResponse
DELETE /pet/{idPet}         → 204

Veterinarios
GET    /veterinarian                 → List<VeterinarianResponse>
GET    /veterinarian/{idVeterinarian} → VeterinarianResponse
GET    /veterinarian/available?date= → List<VeterinarianResponse> (date en formato ISO)
POST   /veterinarian                 → VeterinarianResponse (201)
PUT    /veterinarian/{idVeterinarian} → VeterinarianResponse
DELETE /veterinarian/{idVeterinarian} → 204

Recepcionistas
GET    /receptionist                 → List<ReceptionistResponse>
GET    /receptionist/{idReceptionist} → ReceptionistResponse
POST   /receptionist                 → ReceptionistResponse (201)
PUT    /receptionist/{idReceptionist} → ReceptionistResponse
DELETE /receptionist/{idReceptionist} → 204

Citas
GET    /appointment                  → List<AppointmentResponse>
GET    /appointment/{idAppointment}  → AppointmentResponse
POST   /appointment                  → AppointmentResponse (201)
PUT    /appointment/{idAppointment}  → AppointmentResponse
DELETE /appointment/{idAppointment}  → 204

Servicios
GET    /services                     → List<ServiceResponse>
GET    /services/{idService}         → ServiceResponse
POST   /services                     → ServiceResponse (201)
PUT    /services/{idService}         → ServiceResponse
DELETE /services/{idService}         → 204

Historial Médico
GET    /medical_history              → List<MedicalHistoryResponse>
GET    /medical_history/{idMedicalHistory} → MedicalHistoryResponse
POST   /medical_history              → MedicalHistoryResponse (201)
PUT    /medical_history/{idMedicalHistory} → MedicalHistoryResponse
DELETE /medical_history/{idMedicalHistory} → 204

Vacunas
GET    /vaccine                      → List<VaccineResponse>
GET    /vaccine/{idVaccine}          → VaccineResponse
POST   /vaccine                      → VaccineResponse (201)
PUT    /vaccine/{idVaccine}          → VaccineResponse
DELETE /vaccine/{idVaccine}          → 204

Vacunaciones
GET    /vaccination                  → List<VaccinationResponse>
GET    /vaccination/{idVaccination}  → VaccinationResponse
POST   /vaccination                  → VaccinationResponse (201)
PUT    /vaccination/{idVaccination}  → VaccinationResponse
DELETE /vaccination/{idVaccination}  → 204

Reportes
GET    /reports/completed-services   → List<MedicalHistoryResponse>
GET    /reports/appointments?status= → List<AppointmentResponse> (status: OPENED|CLOSED|CANCELED|RESCHEDULED)
GET    /reports/patients             → Pendiente
GET    /reports/active-veterinarians → Pendiente

6. TIPOS DE RESPUESTA (TypeScript Interfaces)
NOTA: Los fields en JSON usan snake_case. Las interfaces en TypeScript pueden usar camelCase si el cliente HTTP (axios) transforma, o snake_case si se mapea directo.
Se recomienda configurar axios para transformar snake_case ↔ camelCase automáticamente.

interface LoginResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;  // segundos
  user: User;
}

interface User {
  id_user: number;
  username: string;
  type: 'ADMIN' | 'WORKER';
}

interface Owner {
  id_owner: number;
  names: string;
  last_names: string;
  email: string;
  phone_number: string;
  address: string;
}

interface Pet {
  id_pet: number;
  owner: Owner;
  name: string;
  species: string;
  race: string;
  birthdate: string;      // "yyyy-MM-dd"
  sex: 'MALE' | 'FEMALE';
  weight: string;
}

interface Veterinarian {
  id_veterinarian: number;
  user: User;
  names: string;
  last_names: string;
  number_license: string;
  specialty: string;
  email: string;
  phone_number: string;
}

interface Receptionist {
  id_receptionist: number;
  user: User;
  names: string;
  last_names: string;
  email: string;
  phone_number: string;
}

interface Appointment {
  id_appointment: number;
  receptionist: Receptionist;
  pet: Pet;
  veterinarian: Veterinarian;
  date: string;                    // "yyyy-MM-ddTHH:mm:ss"
  time_minutes: number;
  reason: string;
  notes: string;
  status: 'OPENED' | 'CLOSED' | 'CANCELED' | 'RESCHEDULED';
}

interface MedicalHistory {
  id_medical_history: number;
  appointment: Appointment;
  services: Services;
  description: string;
  date: string;                    // "yyyy-MM-ddTHH:mm:ss"
}

interface Vaccine {
  id_vaccine: number;
  name: string;
  description: string;
  manufacturer: string;
  required_dose: number;
}

interface Vaccination {
  id_vaccination: number;
  medical_history: MedicalHistory;
  vaccine: Vaccine;
  application_date: string;        // "yyyy-MM-dd"
  next_application_date: string;   // "yyyy-MM-dd"
  observation: string;
}

interface Services {
  id_service: number;
  name: string;
  description: string;
  price: number;
}

7. COMPONENTES SHADCN REQUERIDOS
Componente     Uso
Button         Acciones generales
Card           Dashboards, resúmenes
Table          Listados de datos
Dialog         Formularios modales
Form           Formularios con validación (react-hook-form + zod)
Input          Campos de texto
Select         Combos (especialidad, estado, etc.)
Calendar       Selector de fechas
Badge          Estados (OPENED, CLOSED, etc.)
Tabs           Navegación por secciones
Sheet          Paneles laterales
Toast/Alert    Notificaciones
DropdownMenu   Menús de usuario, acciones
Sidebar        Navegación principal
Avatar         Perfil de usuario
Command        Búsqueda global (Cmd+K)

8. RUTAS PROPUSTAS
/login                          → Pantalla de login
/dashboard                      → Dashboard (varía por rol)

/admin/
  /users                        → Gestión de usuarios
  /veterinarians                → Gestión de veterinarios
  /receptionists                → Gestión de recepcionistas
  /services                     → Gestión de servicios
  /vaccines                     → Catálogo de vacunas
  /reports                      → Reportes completos

/receptionist/
  /owners                       → Gestión de dueños
  /pets                         → Gestión de mascotas
  /appointments                 → Gestión de citas
  /reports                      → Reportes limitados

/veterinarian/
  /appointments                 → Mis citas
  /medical-history/:petId       → Historial de mascota
  /vaccinations                 → Registrar vacunas
  /catalog/vaccines             → Ver catálogo vacunas