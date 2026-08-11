# Storage & Media Processing Architecture

Esta sección describe el manejo físico de archivos y el procesamiento de recursos multimedia.

## 1. Storage Provider
El almacenamiento está desacoplado mediante una interfaz de servicio de almacenamiento (`StorageService` y `StorageProvider` port):
- **Local Storage Provider**: Utilizado para entornos de desarrollo y pruebas unitarias, almacenando archivos de manera estructurada en disco local.
- **S3 Storage Provider**: Preparado para producción, delegando las cargas físicas al servicio S3 (AWS o proveedores compatibles como Cloudflare R2).

---

## 2. Media Domain
El módulo `Media` actúa como catálogo inteligente de todos los assets cargados:
- **Metadatos completos**: Almacena resolución, peso, formato de archivo, hash de integridad y estado de procesamiento.
- **Generación de miniaturas (Optimización)**: Al recibir imágenes en alta resolución, el sistema genera de forma automática versiones aligeradas (thumbnails) para acelerar la carga en las galerías de los clientes.
- **Seguridad de descargas**: Las descargas en alta resolución se realizan mediante URLs firmadas por token o validadas a nivel del controlador HTTP, protegiendo la propiedad intelectual de los fotógrafos hasta confirmación de pago.
