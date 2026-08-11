# Decision Log - Notifications Domain

## Strategy & Core Architecture

### Decoupled Dispatcher (Ports & Adapters)
- **Decision**: All messaging services are dispatched through a unified `NotificationDispatcher` resolving runtime adapters via `NotificationProviderPort`.
- **Alternatives**: Coupling with a default third-party SMS or Email client package.
- **Riesgo**: Introducing a third-party coupling makes switching gateways later painful and compromises the pure DDD separation.
- **Alternativa elegida**: Ports & Adapters. Any concrete SMS, WhatsApp, push or email handler must implement the port and register inside the module.

### Dynamic Templates Renderer
- **Decision**: Variable substitution layouts `{{variable_name}}` compiled dynamically on-the-fly.
- **Alternative**: Distributing layout logic inside external dispatchers.
- **Rationale**: Isolating templating logic makes layout updates and translation handling completely localized to the Notifications Domain DB records, making it SaaS-ready out-of-the-box.
