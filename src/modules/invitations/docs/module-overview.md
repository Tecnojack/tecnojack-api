# Module Overview - Invitations Domain

## Qué hace el dominio
El dominio **INVITATIONS** es el encargado de administrar la experiencia completa de invitaciones digitales para eventos de la plataforma TECNOJACK. Permite a los anfitriones diseñar, personalizar y publicar portales interactivos web para sus invitados, controlar la visibilidad, y recibir confirmaciones de asistencia (RSVP) en tiempo real con control de acompañantes, notas y preferencias alimentarias.

## Qué problemas resuelve
1. **Pérdida de control en la asistencia**: Automatiza la confirmación de invitados (RSVP) y limita el número máximo de acompañantes permitidos por persona, previniendo sobrecupos en banquetes y salones.
2. **Inflexibilidad en el diseño**: Resuelve la rigidez de plantillas estáticas permitiendo configurar dinámicamente secciones habilitadas (ej. código de vestimenta, mesa de regalos, itinerario de actividades, mapas, etc.) y temas visuales (colores, tipografías, banners de portada).
3. **Seguridad y Acceso**: Proporciona control de expiración automática y visibilidad restringida (pública, protegida por contraseña o exclusiva por lista de invitados registrados).

## Quién lo consume
1. **Client Portal / Anfitrión**: Para crear la invitación del evento, configurar el tema visual, activar o desactivar secciones dinámicas de información y registrar a los invitados principales.
2. **Invitado Final (Guest Portal)**: Para visualizar los detalles del itinerario, mapas de locación y responder a la confirmación de asistencia (RSVP).

## Qué APIs expone
- `POST /invitations`: Registra una nueva invitación vinculada a un evento.
- `GET /invitations/:id_or_slug`: Consulta los detalles completos (incluye secciones activas, itinerario de horarios e invitados registrados).
- `PATCH /invitations/:id`: Actualiza la configuración general del tema (colores, música de fondo, portadas y expiración).
- `POST /invitations/:id/sections`: Sobrescribe las secciones dinámicas activadas.
- `POST /invitations/:id/schedules`: Configura el itinerario cronológico del día del evento.
- `POST /invitations/:id/guests`: Registra un nuevo destinatario o anfitrión en la lista de asistencia.
- `POST /invitations/:id/guests/:guestId/rsvp`: Registra la respuesta del invitado (Confirmado/Declinado) y sus acompañantes.

## Qué eventos publica
- `invitations.invitation_created`: Emitido al registrar una nueva invitación en borrador.
- `invitations.invitation_published`: Emitido cuando el portal de la invitación pasa a estado activo público.
- `invitations.guest_rsvp_updated`: Emitido inmediatamente cuando un invitado confirma o declina asistencia.

## Qué eventos consume
Este dominio opera de forma reactiva y expone su funcionalidad para ser consumida por otros módulos (como el portal del cliente final).

## Ejemplos de uso
1. **Creación de Invitación Corporativa**:
   Un anfitrión crea una invitación con slug `/conferencia-tecnologica-2026`, agrega una sección de mapa de locación y un itinerario horario con 3 actividades de conferencistas.
2. **RSVP de Boda**:
   Un invitado recibe el enlace por correo, accede al portal protegido, confirma su asistencia con 1 acompañante, especifica "restricción alimentaria: vegetariano" y deja una nota de agradecimiento que se registra en la base de datos de invitaciones.
