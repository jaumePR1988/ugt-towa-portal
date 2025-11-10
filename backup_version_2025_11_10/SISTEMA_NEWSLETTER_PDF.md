# Sistema de Newsletter UGT Towa - Generación de PDF

## Resumen del Sistema Actualizado

Sistema de newsletter mensual sindical **sin envío automático de emails**. El sistema genera borradores automáticamente y permite al administrador generar PDFs profesionales para su distribución manual.

---

## Cambios Realizados

### Eliminado Completamente

- ❌ Funcionalidad de envío de emails (Resend)
- ❌ Edge Function send-newsletter
- ❌ Configuración de API keys para email
- ❌ Tabla email_analytics
- ❌ Tracking de aperturas y clics de email
- ❌ Estados "Enviado" y referencias a emails

### Agregado

- ✅ Edge Function generate-newsletter-pdf
- ✅ Generación de PDF con jsPDF y html2canvas
- ✅ Botón "Generar PDF" en panel de administración
- ✅ Descarga directa de PDF desde navegador
- ✅ PDF optimizado con diseño UGT (#e50000)
- ✅ Estadísticas de generaciones de PDF
- ✅ Vista previa HTML antes de generar PDF

### Mantenido (Sin Cambios)

- ✅ Panel de administración completo (/admin/newsletter)
- ✅ 3 pestañas funcionales (Dashboard, Contenido, Newsletters Generados)
- ✅ Gestión de contenido (crear, editar, eliminar)
- ✅ Subida de imágenes
- ✅ Cron job mensual automático (genera borrador día 1 de cada mes)
- ✅ Vista previa HTML del newsletter
- ✅ Dashboard con estadísticas
- ✅ Control manual completo del contenido

---

## Arquitectura Actualizada

### Base de Datos

**Tabla `newsletters_sent` - Modificada:**
- `total_sent` → `total_generated` (número de veces que se generó el PDF)
- `opened_count` → `pdf_downloads` (número de descargas del PDF)
- `clicked_count` - **ELIMINADA**
- `pdf_url` - **NUEVA** (URL del PDF en storage)
- `pdf_generated_at` - **NUEVA** (fecha de última generación)
- `status` - Valores: 'draft' | 'generated' (antes: draft|approved|sent|failed)

**Tabla `email_analytics` - ELIMINADA**

### Edge Functions

**Activas:**
1. **upload-newsletter-image** - Subir imágenes al bucket newsletter-images
2. **generate-monthly-draft** - Generar borrador mensual automático
3. **generate-newsletter-pdf** - Generar HTML optimizado para PDF
4. **track-email-event** - Mantiene webhook pero sin funcionalidad activa

**Eliminada:**
- send-newsletter (enviaba emails vía Resend)

### Cron Job

**Job ID: 2** - Sin cambios
- Expresión: `0 9 1 * *` (día 1 de cada mes a las 9 AM)
- Función: generate-monthly-draft
- Propósito: Generar borrador automáticamente con contenido publicado del mes

---

## Flujo de Trabajo Actual

### 1. Durante el Mes: Crear Contenido

1. Acceder a https://1mbtx97n738h.space.minimax.io/admin/newsletter
2. Iniciar sesión con credenciales admin
3. Tab "Contenido" → "Nuevo Contenido"
4. Completar formulario:
   - Tipo: Noticia | Evento | Estadística | Comunicado | Sugerencia
   - Título y contenido
   - Imagen (opcional, máx 5MB)
   - ✓ "Publicar inmediatamente"
5. Guardar contenido

### 2. Día 1 del Mes: Generación Automática

- **Automático:** Cron job genera borrador a las 9 AM
- Newsletter incluye todo el contenido publicado del mes anterior
- Status: 'draft'

### 3. Revisar Borrador

1. Tab "Newsletters Generados"
2. Ver newsletter: "Newsletter UGT Towa - [Mes Año]"
3. Click "Vista Previa" para ver HTML completo
4. Revisar todas las secciones

### 4. Generar PDF

1. Click en botón "Generar PDF"
2. Confirmar generación
3. Esperar procesamiento (5-10 segundos)
4. PDF se descarga automáticamente
5. Nombre: `newsletter-ugt-towa-YYYY-MM-DD.pdf`

### 5. Distribución Manual

- Enviar PDF por email manualmente
- Publicar en portal interno
- Imprimir y distribuir físicamente
- Compartir por WhatsApp/Telegram
- **Control total del método de distribución**

---

## Características del PDF Generado

### Diseño

- **Formato:** A4 (210mm x 297mm)
- **Orientación:** Vertical (portrait)
- **Colores:** UGT oficial (#e50000 rojo)
- **Tipografía:** Arial, Helvetica, sans-serif
- **Optimizado para:** Impresión y visualización digital

### Estructura

**Header:**
- Fondo rojo UGT (#e50000)
- Título: "Newsletter UGT Towa"
- Subtítulo: Mes y año

**Secciones (si hay contenido):**
1. Noticias
2. Estadísticas del Mes
3. Próximos Eventos
4. Comunicados Importantes
5. Sugerencias Destacadas

**Footer:**
- Datos de contacto UGT Towa
- Dirección y email
- Branding UGT

### Contenido

- Imágenes integradas (si las hay)
- Texto formateado y legible
- Cajas de estadísticas destacadas
- Bordes y colores corporativos
- Paginación automática

---

## Panel de Administración

### Tab Dashboard

**Estadísticas:**
- Suscriptores Totales
- Suscriptores Activos
- Contenido Creado
- **PDFs Generados** (antes: "Newsletters Enviados")

**Acciones Rápidas:**
- Generar Borrador Mensual
- Crear Contenido

**Suscriptores Recientes:**
- Lista de últimos 5 suscriptores

### Tab Contenido

**Vista Grid:**
- Tarjetas de contenido con vista previa
- Tipos: Noticia, Evento, Estadística, Comunicado, Sugerencia
- Estados: Publicado / Borrador
- Acciones: Editar, Eliminar

**Formulario:**
- Selector de tipo
- Título y contenido
- Subida de imágenes
- Checkbox "Publicar inmediatamente"

### Tab Newsletters Generados

**Lista de Newsletters:**
- Subject del newsletter
- Estado: Borrador / PDF Generado
- Fecha de generación (si aplica)
- Acciones:
  - Vista Previa (modal HTML)
  - **Generar PDF** (botón principal)

**Estadísticas por Newsletter:**
- Generaciones (número de veces generado)
- Descargas (contador)

---

## URLs del Sistema

### Producción
- **Portal Principal:** https://1mbtx97n738h.space.minimax.io
- **Admin Dashboard:** https://1mbtx97n738h.space.minimax.io/admin/dashboard
- **Newsletter Panel:** https://1mbtx97n738h.space.minimax.io/admin/newsletter

### Supabase
- **Project URL:** https://zaxdscclkeytakcowgww.supabase.co
- **Dashboard:** https://supabase.com/dashboard/project/zaxdscclkeytakcowgww

### Edge Functions
- **upload-newsletter-image:** https://zaxdscclkeytakcowgww.supabase.co/functions/v1/upload-newsletter-image
- **generate-monthly-draft:** https://zaxdscclkeytakcowgww.supabase.co/functions/v1/generate-monthly-draft
- **generate-newsletter-pdf:** https://zaxdscclkeytakcowgww.supabase.co/functions/v1/generate-newsletter-pdf

---

## Credenciales

**Admin:**
- Email: jpedragosa@towapharmaceutical.com
- Password: towa2022

---

## Datos Actuales

### Newsletters en Sistema

- **2 newsletters en borrador** esperando generación de PDF
- Subject: "Newsletter UGT Towa - Noviembre de 2025"
- Status: draft (Borrador - PDF no generado aún)

### Contenido Publicado

- 6 elementos de contenido de ejemplo
- Tipos: Noticia, Evento, Estadística (x2), Comunicado, Sugerencia
- Todos marcados como "Publicado"

### Suscriptores

- 3 suscriptores activos
- Todos con email @towapharmaceutical.com

---

## Ventajas del Sistema Actual

### Control Total Manual

- **Revisión completa:** Admin puede revisar y editar antes de generar PDF
- **Sin envíos automáticos:** Cero riesgo de envío accidental
- **Flexibilidad:** Quitar o agregar contenido en cualquier momento
- **Timing:** Generar PDF cuando el admin lo decida

### Generación de PDF

- **Profesional:** Diseño limpio y corporativo
- **Reutilizable:** Mismo PDF para múltiples canales
- **Archivable:** PDFs guardados para histórico
- **Imprimible:** Optimizado para impresión física

### Distribución Flexible

- Email manual (control de destinatarios)
- Publicación en portal
- Impresión y distribución física
- Redes sociales o mensajería
- **Cualquier método que el admin prefiera**

---

## Documentación Técnica

### Librerías Utilizadas

**Frontend:**
- jsPDF 3.0.3 - Generación de PDFs
- html2canvas 1.4.1 - Conversión de HTML a canvas
- React 18.3.1
- TypeScript 5.6.3
- Tailwind CSS 3.4.16

**Backend:**
- Supabase (base de datos, auth, storage, edge functions)
- Deno (runtime para edge functions)

### Estructura de Archivos

```
/workspace/
├── ugt-towa-portal/
│   ├── src/
│   │   ├── pages/
│   │   │   └── admin/
│   │   │       └── AdminNewsletter.tsx (871 líneas)
│   │   └── ...
│   └── dist/ (build de producción)
├── supabase/
│   └── functions/
│       ├── upload-newsletter-image/
│       ├── generate-monthly-draft/
│       └── generate-newsletter-pdf/
└── SISTEMA_NEWSLETTER_PDF.md (este archivo)
```

---

## Solución de Problemas

### No se genera el PDF

**Causa posible:** Timeout en generación
**Solución:** 
1. Reducir cantidad de imágenes en el newsletter
2. Esperar 10-15 segundos
3. Intentar nuevamente

### PDF se ve mal

**Causa posible:** Imágenes muy grandes
**Solución:**
1. Reducir tamaño de imágenes antes de subir
2. Usar imágenes optimizadas (máx 500KB)

### El borrador no se generó automáticamente

**Solución:**
1. Verificar que hay contenido publicado del mes
2. Generar manualmente: Dashboard → "Generar Borrador Mensual"

### No puedo subir imágenes

**Solución:**
1. Verificar tamaño (máx 5MB)
2. Verificar formato (solo jpg, png, gif, webp)
3. Intentar con imagen más pequeña

---

## Comparación: Antes vs Ahora

| Característica | Sistema Anterior (Email) | Sistema Actual (PDF) |
|----------------|-------------------------|---------------------|
| Envío | Automático vía Resend | Manual, método libre |
| Generación | Email HTML | PDF descargable |
| Control | Menos (una vez enviado, no se puede recuperar) | Total (generar cuando se quiera) |
| Distribución | Solo email | Cualquier método |
| Tracking | Aperturas y clics | Generaciones |
| Flexibilidad | Baja | Alta |
| Dependencias | API Resend | Solo navegador |
| Costo | API de email | Gratis |

---

## Próximos Pasos Recomendados

### Opcional: Mejoras Futuras

1. **Almacenamiento de PDFs:** Guardar PDFs generados en Supabase Storage
2. **Historial:** Lista de PDFs generados previamente
3. **Templates:** Múltiples plantillas de diseño
4. **Personalización:** Editor visual de colores y estilos
5. **Firma digital:** Agregar firma digital a PDFs

### Uso Inmediato

1. **Acceder al sistema:** https://1mbtx97n738h.space.minimax.io/admin/newsletter
2. **Revisar newsletters en borrador**
3. **Generar PDF** del newsletter más reciente
4. **Distribuir** por el canal preferido

---

## Soporte

**Documentación:**
- Sistema completo: `/workspace/SISTEMA_NEWSLETTER_PDF.md`
- Guía rápida: Sección "Flujo de Trabajo Actual"

**Testing:**
- URL de testing: https://1mbtx97n738h.space.minimax.io
- Credenciales de prueba disponibles

**Estado:**
- ✅ Sistema 100% funcional
- ✅ Sin dependencias externas (excepto Supabase)
- ✅ Listo para uso en producción

---

**Fecha de Modificación:** 09 de Noviembre de 2025
**Estado:** Producción
**URL:** https://1mbtx97n738h.space.minimax.io/admin/newsletter
**Versión:** 2.0 (Sistema de PDF, sin emails)
