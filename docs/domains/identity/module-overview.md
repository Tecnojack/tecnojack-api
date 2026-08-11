# Module Overview - Identity & Access Domain (IAM)

## Qué hace el dominio
El dominio **Identity & Access Management (IAM)** es el núcleo de seguridad y control de acceso de TECNOJACK. Es el propietario absoluto de la autenticación de usuarios (locales y de terceros como Google, GitHub, SAML), la autorización basada en un modelo híbrido de Roles y Políticas Dinámicas, y la administración del ciclo de vida de Sesiones e API Keys.

## Qué problemas resuelve
1. **Seguridad Centralizada**: Elimina la dispersión de credenciales y asegura que todas las peticiones HTTP y accesos API sean verificados uniformemente.
2. **Autorización Fina y Dinámica**: Permite definir políticas a nivel de recurso (ej. "el fotógrafo X solo puede ver las galerías asociadas a su estudio") combinando permisos atómicos con atributos variables en tiempo de ejecución.
3. **Control de Acceso Programático**: Otorga API Keys revocables e independientes para automatizaciones externas de los estudios fotográficos.

## Quién lo consume
1. **Client Portal / Frontend Aplicaciones**: Para login, registro de usuarios, y verificación.
2. **Controladores y Fachadas del Backend**: Para restringir el acceso a los recursos del CRM, Contratos o Eventos de forma segura.

## Qué APIs expone
- `POST /auth/login`: Autentica y genera par de tokens (Access y Refresh).
- `POST /auth/refresh`: Intercambia un Refresh Token válido para obtener un nuevo Access Token.
- `POST /auth/register`: Registra un nuevo usuario en la base de datos.
- `POST /access/roles`: Registra y configura roles del sistema.
- `POST /access/permissions`: Registra capacidades atómicas permitidas.
- `POST /access/policies`: Registra políticas dinámicas de evaluación ABAC.
- `POST /access/users/:userId/api-keys`: Crea y emite tokens programáticos.
- `DELETE /access/sessions/:id`: Cierre forzado de sesiones de dispositivo.

## Qué eventos publica
- `identity.user_created`: Publicado al registrar un nuevo usuario.
- `identity.session_started`: Publicado al crear un nuevo agregado Session.
- `identity.session_revoked`: Publicado al expirar o revocar forzadamente una sesión.
- `identity.api_key_issued`: Publicado al generar un nuevo token programático.

## Qué eventos consume
Este dominio no consume eventos de negocio externo para mantener su autonomía fundacional.

## Ejemplos de uso
1. **Acceso Seguro a Eventos Propios**:
   Un fotógrafo realiza una solicitud de lectura sobre galerías. El guard de políticas dinámicas verifica que el `studioId` del recurso coincida con el `studioId` del claim del token JWT firmado del usuario.
2. **Rotación programática**:
   El sistema de desarrollo de un estudio fotográfico solicita la rotación de su API Key inactiva para refrescar sus credenciales de carga de deliverables.
