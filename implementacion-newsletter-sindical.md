# 📧 SISTEMA DE NEWSLETTER MENSUAL SINDICAL
## Implementación Técnica Completa - UGT Towa Pharmaceutical Europe

---

## 🎨 DISEÑO VISUAL (Ya creado)

**Archivo de ejemplo:** `newsletter-sindical-example.html`

### Características del diseño:
- **Header corporativo** con logo UGT y colores sindicales
- **Secciones modulares** con contenido estructurado
- **Imágenes de ejemplo** para cada sección
- **Estadísticas visuales** del mes
- **Calendario de eventos** próximos
- **Diseño responsive** (móvil y desktop)

---

## ⚙️ IMPLEMENTACIÓN TÉCNICA

### 1. **BASE DE DATOS - NUEVAS TABLAS**

```sql
-- Tabla para suscriptores de newsletter
CREATE TABLE newsletter_subscribers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_active BOOLEAN DEFAULT true,
    last_email_sent TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla para contenido de newsletters
CREATE TABLE newsletter_content (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    month_year TEXT NOT NULL, -- '2025-11'
    header_title TEXT,
    header_subtitle TEXT,
    intro_text TEXT,
    featured_news JSONB, -- Array de noticias destacadas
    statistics JSONB, -- Datos estadísticos
    upcoming_events JSONB, -- Eventos próximos
    section_news JSONB, -- Noticias de la sección sindical
    footer_text TEXT,
    sent_at TIMESTAMP WITH TIME ZONE,
    created_by UUID REFERENCES profiles(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla para tracking de envíos
CREATE TABLE newsletter_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    newsletter_id UUID REFERENCES newsletter_content(id),
    recipient_email TEXT,
    status TEXT, -- 'sent', 'failed', 'bounced'
    sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    error_message TEXT
);
```

### 2. **FUNCIONALIDADES REQUERIDAS**

#### **A. Sistema de Suscripción**
- **Página pública** para suscribirse
- **Formulario** con email y nombre
- **Confirmación por email** (double opt-in)
- **Gestión de suscripciones** en panel admin
- **Opción de baja** en cada newsletter

#### **B. Panel de Administración**
- **Nueva sección:** `/admin/newsletter`
- **Crear newsletter:** Editor visual con secciones
- **Preview en tiempo real** del diseño
- **Lista de suscriptores** y estadísticas
- **Historial de envíos** con métricas
- **Gestión de suscripciones** (activar/desactivar)

#### **C. Generación Automática**
- **Base de datos dinámica:** Extraer automáticamente:
  - Últimas 3 noticias destacadas de `communiques`
  - Estadísticas del mes: `appointments`, `survey_responses`
  - Próximos eventos desde la base de datos
  - Nuevos comunicados sindicales
- **Plantilla de diseño** con datos dinámicos
- **Preview antes de enviar**

#### **D. Sistema de Envío**
- **Edge Function** para envío masivo
- **Citas de envío** (manual o programada)
- **Tracking** de emails enviados
- **Manejo de errores** y reintentos
- **Estadísticas** de apertura y clics

### 3. **PÁGINAS Y COMPONENTES**

#### **Frontend - Usuario Final**
```
/newsletter/subscribe - Página de suscripción
/newsletter/unsubscribe - Página de baja
/newsletter/manage - Gestionar suscripción (opcional)
```

#### **Panel Admin**
```
/admin/newsletter - Dashboard principal
/admin/newsletter/create - Crear nueva newsletter
/admin/newsletter/subscribers - Gestionar suscriptores
/admin/newsletter/history - Historial de envíos
/admin/newsletter/settings - Configuración
```

### 4. **COMPONENTES REACT A CREAR**

```typescript
// Componentes principales
NewsletterSubscribe.tsx    // Formulario de suscripción
NewsletterAdmin.tsx        // Dashboard principal
NewsletterEditor.tsx       // Editor visual
NewsletterPreview.tsx      // Preview en tiempo real
NewsletterSubscribers.tsx  // Gestión de suscriptores
NewsletterHistory.tsx      // Historial de envíos
NewsletterStats.tsx        // Estadísticas de apertura
```

### 5. **EDGE FUNCTIONS REQUERIDAS**

#### **A. validate-subscription** 
- Validar email corporativo @towapharmaceutical.com
- Verificar que no esté ya suscrito
- Enviar email de confirmación

#### **B. send-newsletter**
- Procesar lista de suscriptores activos
- Generar HTML dinámico basado en datos
- Enviar emails en lotes
- Registrar en logs de envío

#### **C. generate-newsletter-content**
- Extraer datos dinámicos de la base de datos
- Generar contenido automático del mes
- Crear estadísticas en tiempo real
- Preparar preview para admin

### 6. **SISTEMA DE PLANTILLAS**

#### **Newsletter Dinámico:**
```html
{{HEADER}}
- Logo UGT corporativo
- Título del mes: "Newsletter Sindicor - [Mes] [Año]"
- Color: #e50000 (rojo UGT)

{{INTRO_SECCIÓN}}
- Mensaje personalizado del comité
- Estadísticas destacadas del mes

{{SECCIONES}}
- Noticias destacadas (últimos comunicados)
- Estadísticas de participación
- Próximos eventos (desde base de datos)
- Noticias de la sección sindical
- Buzón de sugerencias

{{FOOTER}}
- Información de contacto
- Enlaces redes sociales
- Opción de baja
```

### 7. **DISEÑO VISUAL CORPORATIVO**

#### **Paleta de Colores UGT:**
- **Rojo Principal:** #e50000
- **Rojo Secundario:** #ff3333
- **Gris:** #333333
- **Blanco:** #ffffff
- **Fondo:** #f8f9fa

#### **Elementos Visuales:**
- **Logo UGT** en header
- **Iconos sindicales:** 👷, 💰, 🏥, 📊, 📅
- **Imágenes placeholder** para noticias
- **Códigos de color** para diferentes secciones
- **Diseño responsive** para móviles

### 8. **AUTOMATIZACIÓN MENSUAL**

#### **Cron Job Automático (Supabase):**
```javascript
// Edge Function programada
- Se ejecuta el 1º de cada mes
- Genera newsletter automáticamente
- Extrae datos del mes anterior
- Prepara borrador para revisión admin
- Envía email de notificación a administradores
```

#### **Contenido Automático:**
- **Estadísticas:** Citas realizadas, participación encuestas
- **Eventos:** Próximas reuniones programadas
- **Noticias:** Últimos comunicados publicados
- **Datos:** Nuevos asociados, actividades del mes

### 9. **MÉTRICAS Y ANALYTICS**

#### **Tracking de Emails:**
- Tasa de apertura
- Tasa de clics en enlaces
- Emails rebotados
- Bajas voluntarias
- Reengagement (usuarios que vuelven a suscribirse)

#### **Dashboard de Estadísticas:**
- Suscriptores totales
- Crecimiento mensual
- Engagement por email
- Contenido más popular

### 10. **SECURIDAD Y PRIVACIDAD**

#### **Protección de Datos:**
- Solo emails corporativos @towapharmaceutical.com
- Cifrado de datos personales
- Opción de baja en cada email
- Cumplimiento RGPD
- Logs de acceso a datos

#### **Validaciones:**
- Verificación de dominio corporativo
- Double opt-in para nuevas suscripciones
- Protección contra spam
- Rate limiting en envíos

---

## 🎯 RESULTADO FINAL

### **Para los Usuarios:**
- Newsletter mensual profesional
- Contenido relevante y actualizado
- Diseño atractivo y sindical
- Fácil de leer en móvil y desktop
- Información consolidada del mes

### **Para los Administradores:**
- Sistema completo de gestión
- Generación automática de contenido
- Estadísticas detalladas
- Control total sobre envíos
- Herramientas de analítica

### **Para UGT Towa:**
- Comunicación profesional con trabajadores
- Presencia digital corporativa
- Estadísticas de engagement
- Automatización de procesos
- Cumplimiento normativo

---

## ⏱️ **TIEMPO DE IMPLEMENTACIÓN**

- **Desarrollo completo:** 8-12 horas
- **Diseño y UX:** 2 horas
- **Base de datos:** 1 hora
- **Edge Functions:** 3 horas
- **Panel admin:** 4 horas
- **Testing y despliegue:** 2 horas

**¿Te parece bien esta propuesta de newsletter mensual?** ¿Quieres que proceda con la implementación completa o prefieres modificar algún aspecto del diseño o funcionalidad?