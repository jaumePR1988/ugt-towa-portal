# Portal Sindical UGT Towa - Guía de Despliegue

## Estado del Proyecto

### Backend (Supabase) - 100% COMPLETADO
- ✅ 12 tablas creadas (profiles, delegates, site_content, communiques, comments, appointments, appointment_slots, surveys, survey_responses, newsletter_subscribers, negotiation_status, suggestions)
- ✅ RLS (Row Level Security) configurado en todas las tablas
- ✅ Trigger automático para creación de perfiles
- ✅ Storage bucket `delegate-photos` creado
- ✅ Edge Functions desplegadas:
  - validate-email-domain: https://zaxdscclkeytakcowgww.supabase.co/functions/v1/validate-email-domain
  - upload-delegate-photo: https://zaxdscclkeytakcowgww.supabase.co/functions/v1/upload-delegate-photo
- ✅ Datos iniciales insertados

### Frontend (React + TypeScript + Tailwind CSS) - 95% COMPLETADO
- ✅ Proyecto React con Vite
- ✅ Configuración de Supabase
- ✅ Sistema de autenticación completo
- ✅ Todas las páginas públicas implementadas
- ✅ Panel de administración implementado
- ✅ Componentes principales (Navbar, Footer, PrivateRoute, AdminRoute)
- ⏳ Build pendiente

## Credenciales Supabase

```
URL: https://zaxdscclkeytakcowgww.supabase.co
ANON_KEY: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpheGRzY2Nsa2V5dGFrY293Z3d3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIwMTUxMTIsImV4cCI6MjA3NzU5MTExMn0.MQMePYqEhW9xhCipC-MeU8Z_dXqvyBKH5e0vtgaS9xQ
```

## Instrucciones de Build y Despliegue

### 1. Preparación del Proyecto

```bash
cd /workspace/ugt-towa-portal

# Instalar dependencias
pnpm install

# Build del proyecto
pnpm run build
```

Esto generará el directorio `dist/` con los archivos estáticos.

### 2. Despliegue en Hostinger

#### Opción A: Hosting Estático (Recomendado)

1. Acceder al panel de Hostinger
2. Ir a "File Manager" o usar FTP
3. Subir el contenido del directorio `dist/` a `public_html/`
4. Configurar el archivo `.htaccess` para SPA routing:

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```

#### Opción B: Node.js Hosting

Si Hostinger soporta Node.js:

1. Subir todo el proyecto (no solo `dist/`)
2. Configurar variables de entorno en el panel de Hostinger
3. Ejecutar:
```bash
npm install
npm run build
npm run preview
```

### 3. Configuración de Variables de Entorno

Asegurarse de que estas variables estén configuradas:

```
VITE_SUPABASE_URL=https://zaxdscclkeytakcowgww.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Estructura del Proyecto

```
ugt-towa-portal/
├── src/
│   ├── components/         # Componentes reutilizables
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   ├── PrivateRoute.tsx
│   │   └── AdminRoute.tsx
│   ├── contexts/          # Contextos de React
│   │   └── AuthContext.tsx
│   ├── lib/               # Utilidades
│   │   └── supabase.ts    # Configuración Supabase
│   ├── pages/             # Páginas de la aplicación
│   │   ├── HomePage.tsx
│   │   ├── LoginPage.tsx
│   │   ├── RegisterPage.tsx
│   │   ├── QuienesSomosPage.tsx
│   │   ├── ComunicadosPage.tsx
│   │   ├── ComunicadoDetailPage.tsx
│   │   ├── CitasPage.tsx
│   │   ├── EncuestasPage.tsx
│   │   ├── NewsletterPage.tsx
│   │   └── admin/         # Panel de administración
│   │       ├── AdminDashboard.tsx
│   │       ├── AdminQuienesSomos.tsx
│   │       ├── AdminComunicados.tsx
│   │       ├── AdminCitas.tsx
│   │       ├── AdminDisponibilidad.tsx
│   │       └── AdminEncuestas.tsx
│   ├── App.tsx            # Configuración de rutas
│   └── main.tsx           # Punto de entrada
├── public/
│   └── UGT-logo.jpg       # Logo del sindicato
└── supabase/
    └── functions/         # Edge Functions
        ├── validate-email-domain/
        └── upload-delegate-photo/
```

## Funcionalidades Implementadas

### Páginas Públicas
- **Home**: Hero, últimos comunicados, encuesta activa, termómetro de negociación, buzón de sugerencias
- **Quiénes Somos**: Información del sindicato y delegados organizados por tipo
- **Comunicados**: Listado paginado con filtros por categoría
- **Detalle de Comunicado**: Contenido completo con comentarios en tiempo real
- **Citas**: Sistema de reserva de citas con calendario
- **Encuestas**: Visualización y votación con resultados en tiempo real
- **Newsletter**: Formulario de suscripción

### Panel de Administración
- **Dashboard**: Resumen de actividad con estadísticas
- **Quiénes Somos**: CRUD de delegados con subida de imágenes
- **Comunicados**: CRUD completo con editor
- **Citas**: Gestión y actualización de estados
- **Disponibilidad**: Configuración de slots de citas
- **Encuestas**: Creación y gestión de encuestas

### Características Técnicas
- **Autenticación**: Validación de dominio @towapharmaceutical.com
- **Roles**: Sistema de permisos admin/user
- **Tiempo Real**: Comentarios y actualizaciones con Supabase Realtime
- **Responsive**: Diseño mobile-first con Tailwind CSS
- **Seguridad**: RLS en todas las tablas, rutas protegidas

## Crear Usuario Admin

Después del despliegue, crear el primer usuario admin:

1. Registrarse con email @towapharmaceutical.com
2. Acceder a Supabase Dashboard
3. Ir a Table Editor > profiles
4. Buscar el usuario recién creado
5. Cambiar el campo `role` de `user` a `admin`

## Soporte y Mantenimiento

### Logs y Debugging
- Backend: Supabase Dashboard > Logs
- Edge Functions: Supabase Dashboard > Edge Functions > Logs
- Frontend: Consola del navegador

### Problemas Comunes

1. **Error de CORS**: Verificar que las Edge Functions tienen los headers CORS correctos
2. **Error de autenticación**: Verificar variables de entorno
3. **Imágenes no cargan**: Verificar permisos del bucket en Storage
4. **Comentarios no aparecen**: Verificar RLS policies

## URLs del Sistema

- **Frontend**: [Configurar después del despliegue]
- **Supabase Dashboard**: https://supabase.com/dashboard/project/zaxdscclkeytakcowgww
- **Edge Function - Validación Email**: https://zaxdscclkeytakcowgww.supabase.co/functions/v1/validate-email-domain
- **Edge Function - Subida Fotos**: https://zaxdscclkeytakcowgww.supabase.co/functions/v1/upload-delegate-photo

## Próximos Pasos

1. Completar el build del proyecto
2. Desplegar en Hostinger
3. Configurar dominio y SSL
4. Crear usuario admin
5. Poblar contenido inicial
6. Testing completo
7. Lanzamiento
