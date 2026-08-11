# Docker

- `compose.yml` y `compose.override.yml` forman el entorno local.
- `compose.test.yml` proporciona PostgreSQL aislado para pruebas.
- `docker/compose.prod.yml` documenta el target productivo portable.
- Las migraciones se ejecutan como tarea separada con el perfil `tools`.
