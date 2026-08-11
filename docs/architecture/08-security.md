# Security & Authorization - IAM Specifications

Este documento detalla la arquitectura de seguridad del backend de TECNOJACK.

---

## 1. Autenticación y Tokens
El sistema implementa autenticación sin estado mediante **Tokens JWT**:
- **Access Tokens**: Firmados simétricamente mediante algoritmo HMAC SHA-256. Poseen un tiempo de vida corto (15 minutos).
- **Refresh Tokens**: UUIDs aleatorios almacenados como hash SHA-256 en base de datos (`SessionModel`). Poseen rotación obligatoria en cada solicitud de refresco (`Refresh Token Rotation`) y expiración a los 30 días.
- **Revocación asíncrona**: Es posible invalidar de forma inmediata una sesión web específica o todas las sesiones activas de un usuario forzando el borrado lógico del token de refresco correspondiente.

---

## 2. API Keys
Para automatizaciones externas y accesos programáticos sin estado:
- Las llaves API se generan en crudo una sola vez al creador (`tk_xxxxxx`).
- El backend almacena de forma segura únicamente su hash SHA-256 (`APIKeyModel`).
- Soportan scopes atómicos y expiración customizable.
- Se validan mediante la cabecera HTTP `X-API-KEY`.

---

## 3. Autorización Híbrida (RBAC & ABAC)
La autorización combina asignación de roles con evaluación dinámica de condiciones contextuales:
1. **RBAC (Control de Acceso Basado en Roles)**:
   - Los usuarios tienen asignados `RoleIds`.
   - Cada `Role` mapea un conjunto de `PermissionIds` (atómicos resource+action, ej: `galleries:write`).
   - El `PermissionGuard` evalúa si el usuario cuenta con el permiso base para la ruta.
2. **ABAC (Control de Acceso Basado en Atributos)**:
   - Si cuenta con el permiso base, el `PermissionGuard` obtiene las `Policies` dinámicas configuradas.
   - Las políticas evalúan reglas complejas sobre atributos del recurso (ej: `resource.ownerId == user.id`) combinándolos con los `Claims` del usuario.

---

## 4. Guards y Decoradores de NestJS
- `@CurrentUser()`: Extrae de forma tipada el usuario autenticado.
- `@RequirePermissions(resource, action)`: Especifica la restricción atómica requerida por endpoint.
- `AuthGuard`: Valida la firma del token JWT o de la cabecera `X-API-KEY`.
- `PermissionGuard`: Comprueba permisos y evalúa políticas dinámicas ABAC asociadas a los endpoints.
