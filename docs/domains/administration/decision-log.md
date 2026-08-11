# Decision Log - Administration Domain (CMS)

## Architectural Decisions

### 1. Modelado de SystemSetting
- **Decisión**: Guardar todas las configuraciones generales del sistema (branding, tema, monedas, idiomas) en la base de datos a través de una entidad parametrizada única key-value.
- **Justificación**: Permite a los administradores actualizar la interfaz y los datos de la empresa sin requerir despliegues físicos o paradas del backend.

### 2. Feature Flags Persistidos
- **Decisión**: Modelar Feature Flags en la base de datos en lugar de un servicio en la nube estático.
- **Justificación**: Brinda autonomía local para habilitar o deshabilitar flujos pesados (ej. sincronizaciones, facturación) en tiempo real mediante base de datos sin incurrir en costes externos ni retardos de red.

### 3. Dashboard Dinámico mediante Widgets
- **Decisión**: Los widgets del panel administrativo se configuran dinámicamente como registros en base de datos.
- **Justificación**: Evita codificar estáticamente tarjetas de estadísticas, permitiendo agregar, mover, redimensionar y restringir por permisos las vistas del dashboard en tiempo de ejecución.
