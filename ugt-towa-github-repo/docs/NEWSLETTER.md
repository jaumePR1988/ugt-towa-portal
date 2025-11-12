# Sistema de Newsletter - Documentación Completa

Sistema automatizado de newsletter mensual para el Portal Sindical UGT Towa.

## Tabla de Contenidos

1. [Descripción General](#descripción-general)
2. [Arquitectura](#arquitectura)
3. [Flujo de Trabajo](#flujo-de-trabajo)
4. [Configuración](#configuración)
5. [Uso del Panel Admin](#uso-del-panel-admin)
6. [Generación de PDF](#generación-de-pdf)
7. [Personalización](#personalización)
8. [Troubleshooting](#troubleshooting)

---

## Descripción General

El sistema de newsletter automatizado genera mensualmente un boletín informativo que incluye:
- Comunicados sindicales del mes
- Eventos y actividades
- Documentos relevantes
- Código QR de afiliación
- Datos de contacto de la sección sindical

### Características Principales

- Generación automática mensual (día 1 a las 9 AM)
- Editor visual de contenido
- Vista previa en tiempo real
- Generación de PDF profesional
- Sistema de plantillas personalizables
- Estadísticas de suscriptores
- Gráficos de crecimiento
- Exportación a Excel

---

## Arquitectura

### Componentes del Sistema

```
Sistema Newsletter
├── Base de Datos
│   ├── newsletter_editions (ediciones generadas)
│   ├── newsletter_templates (plantillas)
│   ├── newsletter_config (configuración)
│   ├── newsletter_subscribers (suscriptores)
│   └── newsletter_content (contenido)
├── Edge Functions
│   ├── generate-monthly-draft (generación automática)
│   ├── send-newsletter (envío de emails)
│   └── upload-newsletter-image (subida de imágenes)
├── Frontend
│   ├── AdminNewsletter.tsx (panel de administración)
│   └── NewsletterPage.tsx (página de suscripción)
└── Cron Jobs
    └── monthly-newsletter-generation (trigger mensual)
```

### Tablas de Base de Datos

#### newsletter_editions
```sql
CREATE TABLE newsletter_editions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  month INTEGER NOT NULL,
  year INTEGER NOT NULL,
  content JSONB NOT NULL,
  status TEXT DEFAULT 'draft',
  pdf_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  sent_at TIMESTAMPTZ,
  created_by UUID REFERENCES profiles(id)
);
```

#### newsletter_templates
```sql
CREATE TABLE newsletter_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  html_template TEXT NOT NULL,
  is_active BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### newsletter_config
```sql
CREATE TABLE newsletter_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  auto_generate BOOLEAN DEFAULT true,
  generation_day INTEGER DEFAULT 1,
  generation_hour INTEGER DEFAULT 9,
  active_template_id UUID REFERENCES newsletter_templates(id),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### newsletter_subscribers
```sql
CREATE TABLE newsletter_subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  status TEXT DEFAULT 'active',
  subscribed_at TIMESTAMPTZ DEFAULT NOW(),
  unsubscribed_at TIMESTAMPTZ
);
```

#### newsletter_content
```sql
CREATE TABLE newsletter_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  content_type TEXT NOT NULL,
  image_url TEXT,
  status TEXT DEFAULT 'draft',
  published_at TIMESTAMPTZ,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## Flujo de Trabajo

### 1. Generación Automática Mensual

**Proceso:**
```
Día 1 del mes, 9:00 AM
    ↓
Cron Job dispara Edge Function
    ↓
generate-monthly-draft se ejecuta
    ↓
Obtiene contenido publicado del mes anterior
    ↓
Obtiene código QR activo
    ↓
Genera borrador de newsletter
    ↓
Guarda en newsletter_editions con status='draft'
```

**Código del Cron Job:**
```sql
SELECT cron.schedule(
  'generate-monthly-newsletter',
  '0 9 1 * *',
  $$
  SELECT net.http_post(
    url:='https://{project-id}.supabase.co/functions/v1/generate-monthly-draft',
    headers:='{"Content-Type": "application/json", "Authorization": "Bearer {service-role-key}"}'::jsonb
  );
  $$
);
```

### 2. Revisión y Edición por Admin

**Acciones disponibles:**
1. Ver lista de newsletters generados
2. Editar contenido del borrador
3. Vista previa en modal
4. Generar PDF
5. Marcar como listo para envío

### 3. Generación de PDF

**Proceso:**
```
Admin hace clic en "Generar PDF"
    ↓
Frontend crea HTML profesional
    ↓
html2canvas convierte a imagen
    ↓
jsPDF crea documento PDF
    ↓
Descarga automática al navegador
```

### 4. Envío Manual (Opcional)

**Proceso:**
```
Admin hace clic en "Enviar Newsletter"
    ↓
Confirmación de envío
    ↓
Edge Function send-newsletter se ejecuta
    ↓
Obtiene suscriptores activos
    ↓
Envía email a cada suscriptor via Resend
    ↓
Registra envío en newsletters_sent
    ↓
Actualiza status a 'sent'
```

---

## Configuración

### 1. Configurar Resend API

```bash
# Obtener API Key de https://resend.com
# Configurar en Supabase
supabase secrets set RESEND_API_KEY=re_xxxxxxxxxxxxxxxx
```

### 2. Configurar Cron Job

En Supabase Dashboard > Database > Cron:

```sql
-- Newsletter mensual
Schedule: 0 9 1 * *
Command: SELECT net.http_post(...)
```

### 3. Crear Configuración Inicial

```sql
INSERT INTO newsletter_config (
  auto_generate,
  generation_day,
  generation_hour
) VALUES (
  true,
  1,
  9
);
```

### 4. Insertar Template Base

```sql
INSERT INTO newsletter_templates (
  name,
  html_template,
  is_active
) VALUES (
  'Template UGT Towa 2025',
  '<html>...</html>',
  true
);
```

---

## Uso del Panel Admin

### Acceder al Panel

1. Iniciar sesión como administrador
2. Ir a `/admin/newsletter`
3. Ver 3 pestañas disponibles:
   - **Dashboard:** Métricas y estadísticas
   - **Contenido:** Gestión de contenido
   - **Newsletters Generados:** Ediciones creadas

### Dashboard

**Métricas Visibles:**
- Total de Suscriptores
- Suscriptores Activos
- Nuevos este mes
- Tasa de actividad
- Contenidos publicados
- PDFs generados

**Gráfico de Crecimiento:**
- Últimos 12 meses
- Línea de tendencia
- Tasa de crecimiento vs mes anterior

**Funcionalidades:**
- Auto-actualización cada 30 segundos
- Exportar suscriptores a Excel
- Filtros de fecha

### Pestaña Contenido

**Crear Nuevo Contenido:**
1. Clic en "Nuevo Contenido"
2. Completar formulario:
   - Título (requerido)
   - Descripción
   - Tipo: Comunicado / Evento / Documento
   - Imagen (opcional)
3. Guardar como borrador o publicar

**Gestionar Contenido:**
- Ver lista de contenidos
- Editar contenidos existentes
- Eliminar contenidos
- Cambiar status: draft / published

**Subir Imagen:**
1. Hacer clic en "Subir Imagen"
2. Seleccionar archivo (PNG, JPG, WEBP)
3. Máximo 5MB
4. Se guarda en bucket `newsletter-images`

### Pestaña Newsletters Generados

**Ver Ediciones:**
- Lista de newsletters generados
- Ordenados por más reciente
- Muestra: título, mes/año, status

**Acciones Disponibles:**

**1. Vista Previa:**
- Abre modal con HTML renderizado
- Muestra diseño profesional
- Incluye QR y footer con datos reales

**2. Generar PDF:**
- Crea PDF profesional
- Incluye todo el contenido
- Descarga automática
- Formato optimizado para impresión

**3. Editar:**
- Modificar título
- Editar contenido
- Cambiar status

---

## Generación de PDF

### Proceso Técnico

```javascript
// 1. Crear HTML profesional
const htmlContent = createProfessionalNewsletterHTML(newsletter);

// 2. Crear contenedor temporal
const container = document.createElement('div');
container.innerHTML = htmlContent;
document.body.appendChild(container);

// 3. Esperar renderizado de QR
await new Promise(resolve => setTimeout(resolve, 2000));

// 4. Convertir a imagen con html2canvas
const canvas = await html2canvas(container, {
  scale: 2.5,
  useCORS: true,
  allowTaint: true,
  backgroundColor: '#ffffff'
});

// 5. Crear PDF con jsPDF
const pdf = new jsPDF('p', 'mm', 'a4');
const imgData = canvas.toDataURL('image/png');

// 6. Calcular dimensiones
const pdfWidth = pdf.internal.pageSize.getWidth();
const pdfHeight = pdf.internal.pageSize.getHeight();
const imgHeight = (canvas.height * pdfWidth) / canvas.width;

// 7. Añadir páginas si es necesario
let heightLeft = imgHeight;
let position = 0;

pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight);
heightLeft -= pdfHeight;

while (heightLeft > 0) {
  position = heightLeft - imgHeight;
  pdf.addPage();
  pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight);
  heightLeft -= pdfHeight;
}

// 8. Descargar
pdf.save(`Newsletter_UGT_Towa_${month}_${year}.pdf`);

// 9. Limpiar
document.body.removeChild(container);
```

### Diseño del PDF

**Estructura:**
```
┌─────────────────────────────────┐
│ LOGO UGT                        │
│                                 │
│ NEWSLETTER UGT TOWA             │
│ Noviembre 2025 - Edición #123   │
├─────────────────────────────────┤
│                                 │
│ COMUNICADOS                     │
│ • Título comunicado 1           │
│   Descripción...                │
│                                 │
│ • Título comunicado 2           │
│   Descripción...                │
├─────────────────────────────────┤
│                                 │
│ EVENTOS                         │
│ • Título evento 1               │
│   Descripción...                │
├─────────────────────────────────┤
│                                 │
│ AFILIATE A UGT                  │
│ [QR CODE]                       │
├─────────────────────────────────┤
│ CONTACTO                        │
│ jpedragosa@towapharmaceutical...│
│ Polígono Industrial...          │
│                                 │
│ © 2025 UGT Towa                 │
└─────────────────────────────────┘
```

**Colores Corporativos:**
- Rojo UGT: `#e50000`
- Texto: `#1f2937`
- Gris claro: `#f3f4f6`

---

## Personalización

### Modificar Template HTML

Editar en `supabase/functions/generate-monthly-draft/index.ts`:

```typescript
const htmlTemplate = `
  <div style="font-family: Arial, sans-serif;">
    <header style="background-color: #e50000; color: white; padding: 20px;">
      <h1>${title}</h1>
    </header>
    <main>
      ${contentHTML}
    </main>
    <footer>
      ${footerHTML}
    </footer>
  </div>
`;
```

### Cambiar Colores

En `AdminNewsletter.tsx`:

```typescript
const UGT_RED = '#e50000'; // Cambiar aquí
```

### Modificar Frecuencia de Generación

En configuración del cron job:

```sql
-- Mensual: '0 9 1 * *'
-- Quincenal: '0 9 1,15 * *'
-- Semanal: '0 9 * * 1'  -- Cada lunes
```

### Agregar Secciones al Newsletter

En `generate-monthly-draft/index.ts`:

```typescript
// Agregar nueva sección
const newSection = await supabase
  .from('nueva_tabla')
  .select('*')
  .gte('created_at', startDate)
  .lte('created_at', endDate);

content.nueva_seccion = newSection.data;
```

---

## Troubleshooting

### Error: "No se generó el newsletter automáticamente"

**Causas posibles:**
1. Cron job no configurado
2. Edge function no desplegada
3. Fallo en la función

**Solución:**
```bash
# Verificar logs del cron job
# En Supabase Dashboard > Database > Cron > View Logs

# Verificar Edge Function
supabase functions deploy generate-monthly-draft

# Probar manualmente
curl -X POST https://{project-id}.supabase.co/functions/v1/generate-monthly-draft \
  -H "Authorization: Bearer {service-role-key}"
```

### Error: "PDF no se genera correctamente"

**Causas posibles:**
1. html2canvas no puede renderizar el QR
2. Contenido demasiado largo
3. Imágenes no cargan

**Solución:**
```javascript
// Aumentar tiempo de espera para QR
await new Promise(resolve => setTimeout(resolve, 3000));

// Verificar que las imágenes usen CORS
scale: 2.5,
useCORS: true,
allowTaint: true
```

### Error: "Emails no se envían"

**Causas posibles:**
1. RESEND_API_KEY no configurado
2. API key inválida
3. Rate limit excedido

**Solución:**
```bash
# Verificar secret
supabase secrets list

# Actualizar si es necesario
supabase secrets set RESEND_API_KEY=nueva-key

# Verificar logs
# Dashboard > Edge Functions > send-newsletter > Logs
```

### Error: "Suscriptores no aparecen"

**Causas posibles:**
1. RLS policies bloqueando lectura
2. Status no es 'active'

**Solución:**
```sql
-- Verificar policies
SELECT * FROM pg_policies WHERE tablename = 'newsletter_subscribers';

-- Verificar datos
SELECT * FROM newsletter_subscribers WHERE status = 'active';
```

---

## Estadísticas y Analytics

### Métricas Disponibles

1. **Total de Suscriptores:** Count de newsletter_subscribers
2. **Suscriptores Activos:** Filtrado por status='active'
3. **Nuevos Este Mes:** Filtrado por subscribed_at este mes
4. **Tasa de Actividad:** (Activos / Total) * 100
5. **Contenidos Publicados:** Count de newsletter_content con status='published'
6. **PDFs Generados:** Count de newsletter_editions con pdf_url

### Gráfico de Crecimiento

```typescript
// Obtener datos de últimos 12 meses
const months = Array.from({ length: 12 }, (_, i) => {
  const date = new Date();
  date.setMonth(date.getMonth() - (11 - i));
  return date;
});

const data = await Promise.all(
  months.map(async (month) => {
    const { count } = await supabase
      .from('newsletter_subscribers')
      .select('*', { count: 'exact', head: true })
      .lte('subscribed_at', month.toISOString());
    return count || 0;
  })
);

// Renderizar con Chart.js
<Line
  data={{
    labels: months.map(m => format(m, 'MMM yyyy', { locale: es })),
    datasets: [{
      label: 'Suscriptores',
      data: data,
      borderColor: '#e50000',
      backgroundColor: 'rgba(229, 0, 0, 0.1)'
    }]
  }}
/>
```

---

## Mejores Prácticas

### Gestión de Contenido

1. **Publicar contenido regularmente** durante el mes
2. **Marcar como "published"** el contenido listo para newsletter
3. **Usar imágenes optimizadas** (< 500KB cada una)
4. **Revisar borrador** antes de generar PDF
5. **Testear PDF** en diferentes dispositivos

### Diseño del Newsletter

1. **Mantener diseño simple** y profesional
2. **Usar colores corporativos** consistentemente
3. **Incluir siempre** el QR de afiliación
4. **Verificar que todas las imágenes carguen**
5. **Optimizar para impresión** (A4)

### Seguridad

1. **No exponer Service Role Key** en frontend
2. **Validar todos los inputs** de usuarios
3. **Sanitizar HTML** antes de renderizar
4. **Usar HTTPS** para todas las URLs
5. **Revisar logs** regularmente

---

## Roadmap Futuro

### Features Planificados

- [ ] Envío automático de newsletters (actualmente manual)
- [ ] Sistema de plantillas visuales (drag & drop)
- [ ] A/B testing de subject lines
- [ ] Segmentación de suscriptores
- [ ] Analytics avanzados (open rate, click rate)
- [ ] Integración con redes sociales
- [ ] Newsletter archive público
- [ ] RSS feed automático

---

## Recursos Adicionales

- [Resend Documentation](https://resend.com/docs)
- [jsPDF Documentation](https://rawgit.com/MrRio/jsPDF/master/docs/)
- [html2canvas Documentation](https://html2canvas.hertzen.com/)
- [Chart.js Documentation](https://www.chartjs.org/docs/)

---

## Contacto y Soporte

Para soporte técnico o consultas:
- **Email:** jpedragosa@towapharmaceutical.com
- **Dashboard Admin:** https://tu-dominio.com/admin/newsletter

---

**Sistema Newsletter v2.0**  
Última actualización: Noviembre 2025
