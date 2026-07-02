PREREQUISITOS DEL BACKEND (ACCIONES REQUERIDAS)

| # | Requerimiento | Estado |
| --- | --- | --- |
| 1 | Implementar Spring Security + JWT | ❌ No existe |
| 2 | Crear endpoint POST /auth/login | ❌ No existe |
| 3 | Crear endpoint GET /auth/me | ❌ No existe |
| 4 | Hashear contraseñas (BCrypt) | ❌ Almacena en texto plano |
| 5 | Agregar rol VET y RECEPTIONIST al enum UserType | ❌ Solo ADMIN/WORKER |
| 6 | Implementar @ControllerAdvice global | ❌ Errores 500 genéricos |
| 7 | Corregir bug GET /user/{idUser} | ❌ Retorna todos |
| 8 | Implementar reportes pendientes | ❌ patients y active-veterinarians |
| 9 | Agregar CORS para frontend | ⚠️ Verificar configuración |
| 10 | Documentar Swagger actualizado | ⚠️ Solo auto-generado |