# Gallery Domain Design v1

## Especificación oficial del dominio GALLERY de TECNOJACK

**Estado:** Aprobado como especificación oficial  
**Versión:** 1.0  
**Dominio:** GALLERY  
**Repositorio:** <https://github.com/Tecnojack/tecnojack-api.git>  
**Última actualización:** 11 de agosto de 2026

---

## 1. Propósito del dominio

El dominio **GALLERY** es responsable exclusivamente de la organización, estructuración, curaduría y presentación de colecciones digitales de medios (`GalleryAssetReference`) asociadas a Eventos (`Event`).

**Diferenciación estricta con MEDIA y STORAGE:**
- **STORAGE**: Administra binarios y almacenamiento físico.
- **MEDIA**: Administra archivos individuales y metadatos técnicos (`MediaAsset`).
- **GALLERY**: Administra colecciones organizadas en álbumes, secciones y galerías de presentación para clientes.

---

## 2. Ubiquitous Language

- **Gallery**: Colección curada de activos multimedia vinculada a un único Evento. Aggregate Root de este dominio.
- **GalleryAlbum**: Sub-colección o agrupación temática dentro de una Galería (ej. "Preparación", "Ceremonia", "Fiesta").
- **GalleryAssetReference**: Apuntador liviano a un `MediaAsset` dentro de una Galería o Álbum. No duplica el binario ni sus metadatos.
- **GalleryStatus**: Estado del ciclo de vida de la galería (`DRAFT`, `PUBLISHED`, `UNPUBLISHED`, `ARCHIVED`).
- **GalleryVisibility**: Control de acceso y privacidad (`PUBLIC`, `PRIVATE`, `PASSWORD_PROTECTED`).
- **GallerySettings**: Configuración de capacidades habilitadas para la galería (descargas, favoritos, comentarios).

---

## 3. Límites y Reglas de Negocio

1. **Una Galería pertenece a un único Evento** (`eventId`).
2. **Un Evento puede tener múltiples Galerías** (ej. Galería Privada de Novios, Galería Pública para Invitados).
3. **Una Galería sólo contiene referencias a `MediaAsset`**. Nunca almacena archivos ni binarios.
4. **Desacoplamiento total**: `GALLERY` consulta la existencia de Eventos a través de `EventsFacade` y la existencia de activos multimedia a través de `MediaFacade`. Nunca accede a bases de datos o repositorios externos.

---

## 4. Modelo Conceptual

```text
Gallery (Aggregate Root)
├── Settings (Value Object: download, favorites, comments, password)
├── Album [0..*] (Sub-colección temática)
└── AssetReference [0..*] (Referencias a MediaAssetId)
```

---

## 5. Future Extension Points

Esta sección documenta formalmente las capacidades futuras previstas que interactuarán con el dominio GALLERY sin alterar su Aggregate Root ni el modelo base de datos:

1. **Selección de Fotografías (Proofing / Selection Portal)**:
   - Permite a los clientes seleccionar y aprobar fotos para impresión o álbumes físicos.
   - *Extensión*: Sub-dominio `GALLERY_SELECTION` asociando `GalleryAssetReference` con estados de aprobación y notas por cliente.

2. **Favoritos por Cliente (Client Favorites)**:
   - Permite a distintos participantes (`PeopleFacade`) marcar imágenes favoritas de forma independiente.
   - *Extensión*: Colecciones `ClientFavorites` indexadas por `participantId` y `galleryAssetReferenceId`.

3. **Comentarios y Anotaciones Funcionales**:
   - Comentarios y notas de revisión sobre activos específicos para retoques.
   - *Extensión*: Entidad `AssetComment` vinculada a `galleryAssetReferenceId`.

4. **Likes & Interacciones Sociales**:
   - Reacciones livianas de invitados en galerías públicas.
   - *Extensión*: Servicio de contadores de interacción en caché.

5. **Descargas Masivas ZIP (ZIP Bundler Service)**:
   - Empaquetamiento asíncrono de álbumes en alta o baja resolución.
   - *Extensión*: Integración vía eventos con `STORAGE` y `NOTIFICATIONS`.

6. **Inteligencia Artificial y Reconocimiento Facial (AI Face Tagging)**:
   - Agrupación automática de fotos por rostros identificados.
   - *Extensión*: Servicio desacoplado `AI_VISION_SERVICE` enriqueciendo índices de búsqueda en `GALLERY`.

7. **Marcas de Agua Dinámicas (Watermark Generator)**:
   - Renderizado al vuelo de marcas de agua según la visibilidad del usuario.
   - *Extensión*: Capa de entrega CDN / Proxy en `MEDIA`.

8. **Integración con Client Portal**:
   - Autenticación y experiencia inmersiva para clientes finales.
   - *Extensión*: Módulo `CLIENT_PORTAL` consumiendo `GalleryFacade`.
