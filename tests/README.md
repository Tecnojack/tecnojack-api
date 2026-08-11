# Estrategia de pruebas

- Las pruebas unitarias `*.spec.ts` viven junto al código.
- `integration/` valida PostgreSQL y adaptadores reales.
- `e2e/` valida la aplicación desde HTTP.
- `support/` contiene setup, builders, factories y fixtures exclusivos de pruebas.

Las pruebas de integración y E2E requieren la base `tecnojack_test`, disponible mediante `compose.test.yml`.
