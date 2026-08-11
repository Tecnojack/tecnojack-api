# Decision Log - Identity & Access Domain (IAM)

## Architectural Decisions

### 1. Role & Permission como Agregados Independientes
- **Decisión**: Extraer `Role` y `Permission` como Aggregate Roots independientes del agregado `User`.
- **Justificación**: Los roles y permisos definen el esquema general de seguridad y la configuración del sistema. Vincularlos al agregado de `User` obligaría a cargar y guardar todo el árbol de permisos del sistema cada vez que un usuario edite su perfil, además de impedir la gestión independiente de roles del sistema.

### 2. Policy como Agregado Independiente
- **Decisión**: Modelar `Policy` como un agregado independiente que contiene reglas (`PolicyRule`) y condiciones (`PolicyCondition`).
- **Justificación**: Las políticas dinámicas representan reglas lógicas transversales de la organización. Mantenerlas como agregados permite crear, modificar e invalidar políticas de acceso por consola de administración sin tocar el código de los servicios del sistema.

### 3. Session como Aggregate Root
- **Decisión**: Session se promueve a Aggregate Root independiente.
- **Justificación**: Las sesiones tienen un ciclo de vida con eventos propios de auditoría y seguridad. Convertirla en Aggregate Root permite realizar expiraciones, revocaciones inmediatas (por ejemplo, por brecha de seguridad) e historiales de acceso (`login history`) sin necesidad de mutar ni cargar en memoria al agregado `User`.

### 4. APIKey como Aggregate Root
- **Decisión**: APIKey se promueve a Aggregate Root independiente.
- **Justificación**: Las API Keys operan de forma desacoplada y sin estado de las sesiones web normales. Como agregado independiente, permite rotaciones automáticas de claves y validación ágil por llave en la base de datos de manera altamente escalable.

### 5. Hashing de API Keys en Base de Datos
- **Decisión**: Solo persistir el hash SHA-256 de las llaves API y mostrarlas en crudo una sola vez.
- **Justificación**: Evita que una filtración de base de datos comprometa la seguridad de los tokens de desarrollador.

### 6. Estrategia Multitenancy (SaaS Ready)
- **Decisión**: Introducir una propiedad nativa `tenantId` en todos los agregados clave del dominio (User, Role, Policy, Session, APIKey).
- **Justificación**: Permite un aislamiento lógico y estructurado por inquilino en la capa de persistencia y servicios, asegurando que la transición futura a un modelo SaaS multi-estudio sea transparente y libre de refactorizaciones profundas.
