# Business Processes - Core Operations Lifecycle

Este documento mapea el ciclo de vida completo de un cliente y sus eventos fotográficos dentro del ecosistema de TECNOJACK.

---

## 1. El Pipeline Comercial y de Ejecución

```
   [Lead Registrado en CRM] 
              ↓
  Oportunidad ganada (Cotización aceptada)
              ↓
    Contrato Emitido en Contracts
              ↓
      Contrato Firmado por Cliente
              ↓
  Pago Inicial Procesado en Payments
              ↓
     Logística del Evento agendada
              ↓
    Invitación Digital interactiva enviada
              ↓
        Evento ejecutado (Fotos tomadas)
              ↓
   Assets cargados y optimizados en Media
              ↓
  Galería Virtual expuesta para el Cliente
              ↓
    Álbumes / Entregables finalizados
```

---

## 2. Descripción Detallada de los Flujos de Negocio

1. **Captura y Negociación (CRM)**:
   El lead ingresa en estado `NEW_LEAD`. Se interactúa mediante bitácoras de actividades (`CRMActivity`). Se generan cotizaciones (`Quotation`) hasta ganar la oportunidad.
2. **Formalización Legal (Contracts)**:
   Al ganar la oportunidad, se genera el contrato referenciando los servicios cotizados. El cliente firma digitalmente el contrato, disparando eventos que transitan el contrato a estado `SIGNED`.
3. **Facturación y Finanzas (Payments)**:
   Tras la firma, se emiten los comprobantes de pago. Se procesan abonos y saldos hasta cubrir la totalidad del costo del evento.
4. **Logística y Asistencia (Invitations & Events)**:
   Se crea el Evento (`Event`). Se liga una Invitación Digital (`Invitation`) donde los invitados del cliente consultan ubicaciones, cronogramas de secciones y confirman asistencia vía RSVP.
5. **Carga, Revelado y Selección (Media & Gallery)**:
   Los fotógrafos cargan las imágenes a `Media`. El sistema procesa miniaturas optimizadas. Se crea la `Gallery` donde el cliente selecciona las fotos de su preferencia.
6. **Entrega del Servicio (Deliverables)**:
   Se coordinan entregas digitales de alta resolución y productos impresos (álbumes fotográficos, ampliaciones), cerrando el proceso.
