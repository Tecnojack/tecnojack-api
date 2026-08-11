# Module Overview - Administration Domain (CMS)

## Qué hace el dominio
El dominio **Administration (CMS)** es el backend de soporte para el Panel Administrativo de TECNOJACK. Se encarga de gestionar la parametrización de configuraciones del sistema (logo, branding corporativo, formatos numéricos), control de catálogos generales (países, idiomas, monedas, etiquetas globales), feature flags dinámicos, widgets del panel del administrador, y monitoreo de la salud general del backend.

## Qué problemas resuelve
1. **Configuraciones Modificables**: Permite cambiar aspectos clave (ej. logos de branding) sin cambiar código fuente.
2. **Control de Funcionalidades (Toggles)**: Permite encender o apagar integraciones de pago o invitaciones instantáneamente.
3. **Dashboard adaptable**: Provee la metadata estructurada para que la UI renderice widgets de gráficos y estadísticas.

## Quién lo consume
1. **CMS Panel / Admin Frontend**: Para pintar el panel administrativo y configurar el comportamiento de la app.
2. **Facades del Core**: Para validar si una funcionalidad en particular se encuentra activa.

## Qué APIs expone
- `PUT /admin/settings`: Modifica configuraciones clave del sistema.
- `GET /admin/settings`: Obtiene configuraciones por categoría.
- `POST /admin/feature-flags`: Registra un flag.
- `PUT /admin/feature-flags/:key/toggle`: Habilita/deshabilita el flag.
- `POST /admin/catalogs`: Agrega monedas, lenguajes, o países.
- `POST /admin/widgets`: Crea widgets para el dashboard.
- `GET /admin/health`: Comprueba el estado de la base de datos y almacenamiento.
