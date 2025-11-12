# Portal Sindical UGT Towa

Portal web completo para la Sección Sindical UGT en Towa Pharmaceutical Europe. Sistema integral de gestión sindical con funcionalidades avanzadas de comunicación, administración y gestión de afiliados.

## Descripción del Proyecto

Portal sindical moderno y completo que incluye:
- Sistema de comunicados con categorías y comentarios
- Gestión de citas con delegados (sindicales y de prevención)
- Sistema de newsletter mensual automatizado con generación de PDF
- Módulo de afiliados con biblioteca de documentos, votaciones internas y beneficios
- Panel de administración completo con múltiples funcionalidades
- Sistema de notificaciones automatizadas por email
- Galería de eventos con carrusel animado
- Tema oscuro/claro
- Sistema de sugerencias anónimas con código QR

## Tecnologías Utilizadas

### Frontend
- **React 18.3** con TypeScript
- **Vite** como build tool
- **TailwindCSS** para estilos
- **React Router** para navegación
- **Chart.js** para gráficos y estadísticas
- **Lucide React** para iconos
- **date-fns** para manejo de fechas
- **html2canvas** y **jsPDF** para generación de PDFs
- **xlsx** para exportación a Excel

### Backend
- **Supabase** como plataforma Backend-as-a-Service
  - PostgreSQL Database
  - Authentication
  - Storage
  - Edge Functions
  - Real-time subscriptions
- **Resend** para envío de emails transaccionales

## Características Principales

### Para Usuarios Públicos
- Visualización de comunicados sindicales con categorías
- Comentarios y reacciones en comunicados
- Sistema de citas con delegados
- Suscripción a newsletter mensual
- Buzón de sugerencias anónimas
- Galería de eventos fotográficos
- Tema oscuro/claro personalizable

### Para Afiliados
- Dashboard exclusivo con información personal
- Biblioteca de documentos sindicales
- Sistema de votaciones internas con resultados en tiempo real
- Catálogo de beneficios y descuentos exclusivos
- Acceso a comunicados y eventos prioritarios

### Para Administradores
- Gestión completa de comunicados y categorías
- Administración de citas y disponibilidad de delegados
- Panel de newsletter con generación automática mensual
- Gestión de contenido de newsletter con editor visual
- Generación de PDF de newsletter con un clic
- Sistema de notificaciones con filtros avanzados
- Gestión de usuarios y afiliados
- Control de documentos sindicales
- Creación de votaciones internas
- Gestión de beneficios para afiliados
- Administración de códigos QR
- Estadísticas y reportes con gráficos
- Exportación de datos a PDF y Excel

## Estructura del Proyecto

```
ugt-towa-portal/
├── public/                    # Archivos estáticos
│   ├── images/               # Imágenes del sitio
│   ├── UGT-logo.jpg         # Logo oficial
│   └── robots.txt           # SEO
├── src/
│   ├── components/          # Componentes reutilizables
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   ├── ImageGallery.tsx
│   │   ├── ThemeToggle.tsx
│   │   └── ProtectedRoute.tsx
│   ├── pages/               # Páginas de la aplicación
│   │   ├── HomePage.tsx
│   │   ├── ComunicadosPage.tsx
│   │   ├── CitasPage.tsx
│   │   ├── NewsletterPage.tsx
│   │   ├── LoginPage.tsx
│   │   ├── RegisterPage.tsx
│   │   └── admin/          # Páginas de administración
│   │       ├── AdminDashboard.tsx
│   │       ├── AdminComunicados.tsx
│   │       ├── AdminCitas.tsx
│   │       ├── AdminNewsletter.tsx
│   │       ├── AdminAfiliados.tsx
│   │       └── ... (más páginas admin)
│   ├── contexts/           # Contextos de React
│   │   └── AuthContext.tsx
│   ├── lib/                # Configuraciones y utilidades
│   │   └── supabase.ts
│   ├── hooks/              # Custom hooks
│   ├── types/              # Definiciones de tipos TypeScript
│   ├── App.tsx             # Componente principal
│   └── main.tsx            # Punto de entrada
├── supabase/
│   ├── functions/          # Edge Functions
│   │   ├── generate-monthly-draft/
│   │   ├── send-newsletter/
│   │   ├── generate-reminders/
│   │   └── send-notifications/
│   └── migrations/         # Migraciones de base de datos
├── docs/                   # Documentación adicional
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.js
└── README.md
```

## Instalación y Configuración

### Prerequisitos
- Node.js 18+ y pnpm
- Cuenta de Supabase
- Cuenta de Resend (para emails)

### Paso 1: Clonar el Repositorio
```bash
git clone https://github.com/tu-usuario/ugt-towa-portal.git
cd ugt-towa-portal
```

### Paso 2: Instalar Dependencias
```bash
pnpm install
```

### Paso 3: Configurar Variables de Entorno
Copia el archivo `.env.example` a `.env`:
```bash
cp .env.example .env
```

Edita el archivo `.env` con tus credenciales:
```env
VITE_SUPABASE_URL=https://tu-proyecto-id.supabase.co
VITE_SUPABASE_ANON_KEY=tu-clave-anonima-aqui
RESEND_API_KEY=tu-resend-api-key-aqui
```

### Paso 4: Configurar Supabase

#### 4.1 Crear Proyecto en Supabase
1. Ve a https://app.supabase.com
2. Crea un nuevo proyecto
3. Anota la URL y la ANON KEY del proyecto

#### 4.2 Ejecutar Migraciones
```bash
# Instalar Supabase CLI
npm install -g supabase

# Inicializar Supabase en el proyecto
supabase init

# Vincular con tu proyecto
supabase link --project-ref tu-proyecto-id

# Ejecutar migraciones
supabase db push
```

#### 4.3 Desplegar Edge Functions
```bash
# Desplegar todas las funciones
supabase functions deploy generate-monthly-draft
supabase functions deploy send-newsletter
supabase functions deploy generate-reminders
supabase functions deploy send-notifications
supabase functions deploy upload-communique-image
supabase functions deploy upload-delegate-photo
supabase functions deploy upload-event-image
supabase functions deploy upload-newsletter-image
supabase functions deploy upload-qr-code
```

#### 4.4 Configurar Secretos de Edge Functions
```bash
supabase secrets set RESEND_API_KEY=tu-resend-api-key
```

#### 4.5 Configurar Cron Jobs
En el Dashboard de Supabase, ve a Database > Cron Jobs y crea:

1. **Newsletter Mensual Automático**
   - Schedule: `0 9 1 * *` (día 1 de cada mes a las 9 AM)
   - Command: Llamar a edge function `generate-monthly-draft`

2. **Recordatorios de Citas**
   - Schedule: `0 * * * *` (cada hora)
   - Command: Llamar a edge function `generate-reminders`

### Paso 5: Desarrollo Local
```bash
# Iniciar servidor de desarrollo
pnpm dev

# La aplicación estará disponible en http://localhost:5173
```

### Paso 6: Build para Producción
```bash
# Generar build optimizado
pnpm build

# Vista previa del build
pnpm preview
```

## Scripts Disponibles

```json
{
  "dev": "vite",                    // Servidor de desarrollo
  "build": "tsc -b && vite build", // Build de producción
  "preview": "vite preview",       // Vista previa del build
  "lint": "eslint ."              // Linter de código
}
```

## Base de Datos

### Tablas Principales

#### Autenticación y Usuarios
- `profiles` - Perfiles de usuarios con roles y datos personales

#### Comunicados y Contenido
- `communiques` - Comunicados sindicales
- `categories` - Categorías de comunicados
- `comments` - Comentarios en comunicados
- `comment_reactions` - Reacciones (like/dislike) a comentarios
- `comment_replies` - Respuestas a comentarios

#### Sistema de Citas
- `appointments` - Citas reservadas
- `appointment_slots` - Slots de disponibilidad
- `appointments_config` - Configuración del sistema

#### Newsletter
- `newsletter_editions` - Ediciones generadas del newsletter
- `newsletter_templates` - Plantillas de newsletter
- `newsletter_config` - Configuración del sistema
- `newsletter_subscribers` - Suscriptores
- `newsletter_content` - Contenido para incluir

#### Afiliados
- `syndical_documents` - Documentos exclusivos para afiliados
- `internal_polls` - Votaciones internas
- `poll_votes` - Votos registrados
- `affiliate_benefits` - Beneficios y descuentos

#### Otros
- `delegates` - Información de delegados sindicales
- `event_images` - Galería de eventos
- `qr_codes` - Códigos QR para afiliación
- `suggestions` - Buzón de sugerencias
- `notifications` - Sistema de notificaciones
- `documents` - Documentos públicos
- `document_categories` - Categorías de documentos

### Storage Buckets
- `communique-images` - Imágenes de comunicados
- `delegate-photos` - Fotos de delegados
- `event-images` - Imágenes de eventos
- `newsletter-images` - Imágenes para newsletter
- `qr-codes` - Códigos QR
- `syndical-documents` - Documentos sindicales
- `documents` - Documentos públicos

## Credenciales de Acceso

### Usuario Administrador
- **Email:** jpedragosa@towapharmaceutical.com
- **Password:** towa2022
- **Rol:** Admin y Afiliado

### Registro de Nuevos Usuarios
- Solo emails con dominio `@towapharmaceutical.com` son válidos
- Los nuevos usuarios requieren verificación por email
- El rol de admin debe asignarse manualmente en la base de datos

## Sistema de Newsletter Automatizado

### Funcionamiento
1. **Generación Automática:** Cada día 1 del mes a las 9 AM, se genera automáticamente un borrador del newsletter
2. **Contenido:** El borrador incluye todo el contenido marcado como "published" del mes anterior
3. **Revisión Admin:** El administrador revisa y edita el borrador en `/admin/newsletter`
4. **Generación PDF:** Con un clic se genera el PDF profesional del newsletter
5. **Envío Manual:** El administrador decide cuándo enviar (sin envío automático de emails)

### Generación de PDF
- Diseño profesional con colores corporativos UGT
- Incluye logo, fecha y número de edición
- Secciones organizadas con títulos y descripciones
- Footer con datos de contacto reales
- Código QR de afiliación incluido
- Funciones de impresión directa

## Despliegue

### Vercel (Recomendado)

1. **Instalar Vercel CLI:**
```bash
npm install -g vercel
```

2. **Desplegar:**
```bash
vercel
```

3. **Configurar Variables de Entorno:**
En el dashboard de Vercel, agrega:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

4. **Desplegar a Producción:**
```bash
vercel --prod
```

### Otras Plataformas
El proyecto es compatible con:
- Netlify
- AWS Amplify
- Firebase Hosting
- GitHub Pages (con configuración adicional)

## Documentación Adicional

### API Reference
Ver `/docs/API.md` para documentación completa de las Edge Functions

### Supabase Configuration
Ver `/docs/SUPABASE.md` para detalles de configuración de base de datos y RLS policies

### Newsletter System
Ver `/docs/NEWSLETTER.md` para documentación del sistema de newsletter

### Deployment Guide
Ver `/docs/DEPLOYMENT.md` para guías detalladas de despliegue

## Funcionalidades Destacadas

### Sistema de Notificaciones Automatizadas
- Confirmación automática de citas por email
- Recordatorios 24h y 2h antes de las citas
- Notificaciones a delegados cuando se reservan citas
- Panel de administración con filtros avanzados

### Búsqueda y Filtros Avanzados
- Búsqueda por texto en citas y notificaciones
- Filtros por usuario con autocompletado
- Filtros por rango de fechas con date picker
- Filtros por horario (mañana/tarde)
- Combinación de múltiples filtros simultáneos

### Estadísticas y Reportes
- Gráficos de crecimiento de suscriptores
- Análisis de encuestas con Chart.js
- Exportación a PDF y Excel
- Dashboard en tiempo real

### Seguridad
- Row Level Security (RLS) en todas las tablas
- Autenticación con Supabase Auth
- Validación de dominio de email
- Protección de rutas por roles
- HTTPS obligatorio en producción

## Contribución

1. Fork el repositorio
2. Crea una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -am 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Crea un Pull Request

## Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## Soporte y Contacto

Para soporte técnico o consultas sobre el proyecto:
- **Email:** jpedragosa@towapharmaceutical.com
- **Ubicación:** Polígono Industrial, Carrer de Sant Martí, 75-97, 08107 Martorelles, Barcelona

## Estado del Proyecto

**Versión Actual:** 2.0.0
**Estado:** En Producción
**Última Actualización:** Noviembre 2025

### Funcionalidades Implementadas
- Portal público con comunicados y galería
- Sistema de citas con delegados
- Sistema de newsletter mensual automatizado
- Panel de administración completo
- Módulo de afiliados con votaciones y beneficios
- Sistema de notificaciones automatizadas
- Tema oscuro/claro
- Exportación de datos a PDF y Excel
- Sistema de códigos QR
- Galería de eventos animada
- Búsqueda y filtros avanzados
- Estadísticas en tiempo real

### Roadmap Futuro
- App móvil nativa (React Native)
- Sistema de chat en vivo
- Integración con redes sociales
- Módulo de formación sindical
- Sistema de firmas digitales
- Calendario compartido de eventos

## Agradecimientos

Desarrollado para la Sección Sindical UGT en Towa Pharmaceutical Europe.

---

**UGT Towa** - Unión General de Trabajadores  
Comprometidos con los derechos laborales y el bienestar de los trabajadores.
