# Portal Sindical UGT TOWA - Requisitos Técnicos e Implementación

## 📋 Resumen Ejecutivo

Este documento define los requisitos técnicos y checklist de implementación para el Portal Sindical UGT TOWA, un sistema completo de gestión sindical con funcionalidades avanzadas de comunicación, administración de citas, encuestas y sistema de afiliados.

---

## 🖥️ 1. REQUISITOS MÍNIMOS DEL SISTEMA

### 1.1 Arquitectura General
- **Frontend**: React 18.3.1 + TypeScript + Vite 6.0.1
- **Backend**: Supabase (PostgreSQL + Edge Functions + Storage + Auth)
- **Styling**: Tailwind CSS v3.4.16 + Radix UI
- **Package Manager**: pnpm

### 1.2 Dependencias Principales

#### Frontend Core
```json
{
  "react": "^18.3.1",
  "react-dom": "^18.3.1",
  "typescript": "~5.6.2",
  "vite": "^6.0.1",
  "@vitejs/plugin-react": "^4.3.4"
}
```

#### UI & Styling
```json
{
  "tailwindcss": "v3.4.16",
  "postcss": "8.4.49",
  "autoprefixer": "10.4.20",
  "@radix-ui/react-*": "versiones múltiples",
  "lucide-react": "^0.364.0"
}
```

#### Backend & Data
```json
{
  "@supabase/supabase-js": "^2.78.0",
  "chart.js": "^4.5.1",
  "react-chartjs-2": "^5.3.1",
  "date-fns": "^3.0.0",
  "zod": "^3.24.1"
}
```

#### Forms & Validation
```json
{
  "react-hook-form": "^7.54.2",
  "@hookform/resolvers": "^3.10.0",
  "clsx": "^2.1.1",
  "class-variance-authority": "^0.7.1"
}
```

#### Additional Features
```json
{
  "react-router-dom": "^6",
  "jspdf": "^3.0.3",
  "html2canvas": "^1.4.1",
  "xlsx": "^0.18.5",
  "sonner": "^1.7.2"
}
```

### 1.3 Versiones Mínimas Requeridas

| Herramienta | Versión Mínima | Versión Recomendada |
|-------------|----------------|---------------------|
| Node.js     | 18.0.0         | 18.17.0+            |
| pnpm        | 8.0.0          | 8.15.0+             |
| npm         | 9.0.0          | 9.6.0+              |
| Git         | 2.30.0         | 2.40.0+             |

### 1.4 Supabase Configuration

#### Proyecto Supabase
- **URL**: `https://zaxdscclkeytakcowgww.supabase.co`
- **Database**: PostgreSQL 15+
- **Storage**: 1GB incluido
- **Edge Functions**: 500,000 invocations/mes

#### Edge Functions Requeridas
- `validate-email-domain`
- `upload-delegate-photo`
- `generate-newsletter-pdf`
- `send-notifications`
- `generate-reminders`
- `upload-communique-image`
- `upload-event-image`
- `upload-qr-code`

#### Storage Buckets
- `delegate-photos`
- `communique-images`
- `event-images`
- `documents`
- `syndical-documents`
- `qr-codes`

### 1.5 Base de Datos

#### Tablas Principales (27 tablas)
1. `profiles` - Perfiles de usuarios
2. `delegates` - Delegados sindicales
3. `site_content` - Contenido del sitio
4. `communiques` - Comunicados
5. `comments` - Comentarios
6. `appointments` - Citas
7. `appointment_slots` - Slots de disponibilidad
8. `surveys` - Encuestas
9. `survey_responses` - Respuestas de encuestas
10. `newsletter_subscribers` - Suscriptores newsletter
11. `newsletters_sent` - Newsletters enviados
12. `suggestions` - Sugerencias
13. `email_analytics` - Analytics de email
14. `document_categories` - Categorías de documentos
15. `documents` - Documentos
16. `qr_codes` - Códigos QR
17. `event_images` - Imágenes de eventos
18. `comment_replies` - Respuestas a comentarios
19. `affiliate_benefits` - Beneficios de afiliados
20. `appointment_conflict_management` - Gestión de conflictos
21. `categories` - Categorías
22. `email_notifications` - Notificaciones por email
23. `negotiation_status` - Estado de negociaciones
24. `appointment_slots_system` - Sistema de slots
25. `profiles_trigger` - Trigger de perfiles
26. `rls_policies_*` - Políticas RLS
27. `delegates_content` - Contenido de delegados

#### Características de Seguridad
- **RLS (Row Level Security)**: Habilitado en todas las tablas
- **Triggers**: Automáticos para creación de perfiles
- **Políticas**: RLS configuradas por rol (admin/user)

---

## 📝 2. CHECKLIST PASO A PASO DE CONFIGURACIÓN TÉCNICA

### 2.1 Preparación del Entorno de Desarrollo

#### ✅ Paso 1: Instalación de Herramientas Base
- [ ] Instalar Node.js v18.17.0 o superior
- [ ] Instalar pnpm globalmente: `npm install -g pnpm`
- [ ] Verificar versiones: `node --version`, `pnpm --version`
- [ ] Instalar Git si no está disponible

#### ✅ Paso 2: Clonar/Descargar Proyecto
- [ ] Obtener código fuente del proyecto
- [ ] Verificar estructura de directorios:
  ```
  workspace/
  ├── ugt-towa-portal/          # Frontend
  ├── supabase/                 # Backend
  │   ├── functions/            # Edge Functions
  │   ├── migrations/           # Migraciones DB
  │   ├── tables/               # Esquemas de tablas
  │   └── cron_jobs/            # Tareas programadas
  └── [otros archivos]
  ```

#### ✅ Paso 3: Configuración del Frontend
- [ ] Navegar a `ugt-towa-portal/`
- [ ] Ejecutar `pnpm install` para instalar dependencias
- [ ] Verificar que no hay errores en la instalación
- [ ] Ejecutar `pnpm run dev` para probar desarrollo local
- [ ] Verificar que el servidor inicia en http://localhost:5173

### 2.2 Configuración de Supabase

#### ✅ Paso 4: Configurar Proyecto Supabase
- [ ] Acceder a https://supabase.com/dashboard
- [ ] Crear cuenta o usar credenciales existentes
- [ ] Configurar proyecto con las credenciales:
  - URL: `https://zaxdscclkeytakcowgww.supabase.co`
  - Anon Key: `[Configurada en package.json]`

#### ✅ Paso 5: Configurar Base de Datos
- [ ] Aplicar migraciones en orden cronológico:
  - [ ] `1762032785_enable_rls_all_tables.sql`
  - [ ] `1762032801_create_rls_policies_profiles.sql`
  - [ ] `1762032815_create_rls_policies_delegates_content.sql`
  - [ ] [Continuar con todas las migraciones...]
- [ ] Verificar que todas las 27 tablas se crearon correctamente
- [ ] Ejecutar scripts de `tables/` para crear esquemas base
- [ ] Verificar triggers automáticos

#### ✅ Paso 6: Configurar Storage Buckets
- [ ] Crear bucket `delegate-photos` con política pública
- [ ] Crear bucket `communique-images` con política pública
- [ ] Crear bucket `event-images` con política pública
- [ ] Crear bucket `documents` con política pública
- [ ] Crear bucket `syndical-documents` con política pública
- [ ] Crear bucket `qr-codes` con política pública
- [ ] Verificar políticas RLS para cada bucket

#### ✅ Paso 7: Desplegar Edge Functions
- [ ] Desplegar `validate-email-domain`
- [ ] Desplegar `upload-delegate-photo`
- [ ] Desplegar `generate-newsletter-pdf`
- [ ] Desplegar `send-notifications`
- [ ] Desplegar `generate-reminders`
- [ ] Desplegar `upload-communique-image`
- [ ] Desplegar `upload-event-image`
- [ ] Desplegar `upload-qr-code`
- [ ] Verificar que todas las funciones responden correctamente
- [ ] Probar cada función con datos de test

### 2.3 Configuración del Frontend

#### ✅ Paso 8: Variables de Entorno
- [ ] Crear archivo `.env.local` en `ugt-towa-portal/`
- [ ] Configurar variables:
  ```
  VITE_SUPABASE_URL=https://zaxdscclkeytakcowgww.supabase.co
  VITE_SUPABASE_ANON_KEY=[your-anon-key]
  VITE_APP_ENV=development
  ```
- [ ] Verificar que las variables se cargan correctamente
- [ ] NO commitear el archivo `.env.local`

#### ✅ Paso 9: Configuración de Build
- [ ] Ejecutar `pnpm run build` para verificar build
- [ ] Verificar que se genera directorio `dist/`
- [ ] Verificar que no hay errores de TypeScript
- [ ] Ejecutar `pnpm run preview` para probar build local
- [ ] Verificar que todas las páginas cargan correctamente

#### ✅ Paso 10: Configuración de Rutas
- [ ] Verificar que el routing funciona correctamente
- [ ] Configurar `.htaccess` para SPA routing (Apache)
- [ ] Probar navegación entre páginas
- [ ] Verificar rutas protegidas (/admin)
- [ ] Verificar rutas públicas

### 2.4 Configuración de Funcionalidades

#### ✅ Paso 11: Sistema de Autenticación
- [ ] Probar registro con email @towapharmaceutical.com
- [ ] Probar login con credenciales válidas
- [ ] Probar acceso a rutas protegidas
- [ ] Verificar que se crea perfil automáticamente
- [ ] Probar logout

#### ✅ Paso 12: Sistema de Roles
- [ ] Verificar que usuarios nuevos tienen rol 'user'
- [ ] Cambiar manualmente primer usuario a 'admin'
- [ ] Verificar acceso a panel de administración
- [ ] Probar permisos por rol

#### ✅ Paso 13: Funcionalidades CRUD
- [ ] Probar gestión de comunicados (CRUD)
- [ ] Probar gestión de delegados (CRUD)
- [ ] Probar sistema de citas (reservar/cancelar)
- [ ] Probar gestión de encuestas
- [ ] Probar comentarios en tiempo real
- [ ] Probar subida de imágenes

#### ✅ Paso 14: Sistema de Newsletter
- [ ] Probar suscripción a newsletter
- [ ] Probar generación de PDF
- [ ] Probar envío de emails
- [ ] Verificar analytics de email

#### ✅ Paso 15: Sistema de Afiliados
- [ ] Verificar conversión de usuario a afiliado
- [ ] Probar visualización de beneficios
- [ ] Probar contenido exclusivo para afiliados
- [ ] Verificar permisos RLS

### 2.5 Testing y Validación

#### ✅ Paso 16: Testing Frontend
- [ ] Probar responsive design en móvil
- [ ] Probar en diferentes navegadores (Chrome, Firefox, Safari)
- [ ] Verificar que no hay errores en consola
- [ ] Probar formularios con validación
- [ ] Verificar performance (tiempos de carga)

#### ✅ Paso 17: Testing Backend
- [ ] Probar todas las Edge Functions
- [ ] Verificar logs en Supabase
- [ ] Probar RLS policies con diferentes roles
- [ ] Verificar que los triggers funcionan
- [ ] Probar timeouts y errores

#### ✅ Paso 18: Testing de Integración
- [ ] Probar flujo completo de registro/login
- [ ] Probar creación y edición de comunicados
- [ ] Probar sistema de citas end-to-end
- [ ] Probar comentarios en tiempo real
- [ ] Probar newsletter completo

### 2.6 Preparación para Producción

#### ✅ Paso 19: Build de Producción
- [ ] Ejecutar `pnpm run build:prod`
- [ ] Verificar que el build es exitoso
- [ ] Optimizar assets (imágenes, CSS, JS)
- [ ] Verificar tamaño de bundle
- [ ] Configurar variables de entorno de producción

#### ✅ Paso 20: Configuración de Hosting
- [ ] Configurar servidor web (Apache/Nginx)
- [ ] Subir archivos del directorio `dist/`
- [ ] Configurar certificado SSL
- [ ] Configurar dominio
- [ ] Probar HTTPS

#### ✅ Paso 21: Configuración de Monitoreo
- [ ] Configurar logs de Supabase
- [ ] Configurar alertas de errores
- [ ] Configurar backups automáticos
- [ ] Configurar analytics (opcional)

---

## ⏱️ 3. TIMELINE ESTIMADO DE IMPLEMENTACIÓN

### 3.1 Distribución de Tiempo (3-4 horas total)

| Fase | Duración | Actividades |
|------|----------|-------------|
| **Preparación** | 30 min | Instalación herramientas, verificación entorno |
| **Configuración Backend** | 60 min | Supabase setup, migraciones, edge functions |
| **Configuración Frontend** | 45 min | Variables entorno, build, testing local |
| **Funcionalidades Core** | 60 min | Auth, CRUD, sistema de citas, newsletter |
| **Testing Completo** | 30 min | Testing frontend, backend, integración |
| **Producción** | 30 min | Build prod, deployment, configuración final |
| **Buffer** | 15 min | Resolución problemas, ajustes finales |

### 3.2 Cronograma Detallado

#### Hora 1: Fundación (60 min)
- **0-15 min**: Instalación y verificación de herramientas
- **15-30 min**: Configuración del proyecto frontend
- **30-45 min**: Configuración Supabase y variables de entorno
- **45-60 min**: Aplicación de migraciones y verificación de tablas

#### Hora 2: Backend Completo (60 min)
- **60-75 min**: Creación y configuración de Storage Buckets
- **75-90 min**: Despliegue de Edge Functions (3-4 funciones)
- **90-105 min**: Despliegue de Edge Functions restantes
- **105-120 min**: Testing de Edge Functions y verificación RLS

#### Hora 3: Frontend y Funcionalidades (60 min)
- **120-135 min**: Build y testing de frontend
- **135-150 min**: Configuración de autenticación y roles
- **150-165 min**: Testing de funcionalidades CRUD
- **165-180 min**: Testing de sistema de citas y comentarios

#### Hora 4: Finalización (60 min)
- **180-195 min**: Testing completo de integración
- **195-210 min**: Build de producción y preparación deployment
- **210-225 min**: Deployment y configuración final
- **225-240 min**: Testing final y documentación

### 3.3 Hitos Críticos

#### ✅ Hito 1 (30 min): Entorno Operativo
- **Criterio**: Frontend carga en desarrollo, Supabase conectado
- **Verificación**: `http://localhost:5173` responde, no errores en consola

#### ✅ Hito 2 (90 min): Backend Funcional
- **Criterio**: Todas las tablas creadas, Edge Functions operativas
- **Verificación**: CRUD funciona, autenticación activa, RLS aplicado

#### ✅ Hito 3 (150 min): Frontend Completo
- **Criterio**: Todas las páginas cargan, routing funcional
- **Verificación**: Navegación completa, formularios operativos

#### ✅ Hito 4 (210 min): Sistema Integrado
- **Criterio**: Flujos end-to-end funcionan
- **Verificación**: Registro → Login → CRUD → Comentarios → Citas

#### ✅ Hito 5 (240 min): Producción Lista
- **Criterio**: Build exitoso, deployment completado
- **Verificación**: Sitio en producción funcional

---

## 👥 4. RECURSOS NECESARIOS

### 4.1 Personal Requerido

#### 👨‍💻 Desarrollador Frontend (Principal)
- **Perfil**: Desarrollador React/TypeScript
- **Experiencia requerida**: 2+ años con React, Vite, Tailwind CSS
- **Responsabilidades**:
  - Configuración del entorno de desarrollo
  - Build y deployment del frontend
  - Configuración de variables de entorno
  - Testing de funcionalidades frontend
- **Tiempo dedicado**: 2.5 horas

#### 👨‍💼 Administrador de Base de Datos
- **Perfil**: Administrador Supabase/PostgreSQL
- **Experiencia requerida**: 1+ años con Supabase, RLS, Edge Functions
- **Responsabilidades**:
  - Configuración de proyecto Supabase
  - Aplicación de migraciones
  - Configuración de Storage y RLS
  - Despliegue de Edge Functions
- **Tiempo dedicado**: 1.5 horas

#### 👨‍🔧 DevOps/Ingeniero de Deployment
- **Perfil**: Especialista en deployment y hosting
- **Experiencia requerida**: 1+ años con hosting web, SSL, dominios
- **Responsabilidades**:
  - Configuración de servidor web
  - Deployment a producción
  - Configuración de SSL y dominio
  - Monitoreo inicial
- **Tiempo dedicado**: 0.5 horas

### 4.2 Herramientas y Licencias

#### 💻 Software Requerido (Sin Costo)
- **Node.js** v18.17.0+ (Open Source)
- **pnpm** (Open Source)
- **Git** (Open Source)
- **Editor de código**: VS Code (Recomendado, gratuito)
- **Supabase Dashboard** (Gratuito hasta límites)

#### 🌐 Servicios Cloud (Costo Variable)
- **Supabase Pro** ($25/mes recomendado para producción)
  - 8GB Database storage
  - 100GB Bandwidth
  - 2M Edge Function invocations
  - 50GB File storage
- **Hosting Web** ($5-20/mes)
  - Hostinger (Recomendado)
  - O alternativas: Netlify, Vercel, AWS S3

#### 🔧 Herramientas de Desarrollo (Opcionales)
- **Postman** (Gratuito) - Testing de API
- **pgAdmin** (Open Source) - Administración DB
- **Chrome DevTools** (Gratuito) - Debug frontend
- **Supabase CLI** (Open Source) - Gestión local

### 4.3 Accesos y Credenciales Requeridos

#### 🔑 Accesos Esenciales
- [ ] **Cuenta Supabase** (credenciales de proyecto)
  - URL: `https://zaxdscclkeytakcowgww.supabase.co`
  - Service Role Key (para administración)
  - Anon Key (para frontend)

- [ ] **Panel de Hosting** (credenciales FTP/cPanel)
  - Acceso a File Manager
  - Credenciales FTP
  - Panel de control de dominio

- [ ] **Dominio y DNS**
  - Acceso a configuración DNS
  - Certificado SSL (Let's Encrypt o comercial)
  - Configuración de subdominios (opcional)

#### 🔐 Configuraciones de Seguridad
- [ ] **SSH Keys** (si se requiere acceso por SSH)
- [ ] **API Keys** para servicios externos
- [ ] **Configuración CORS** en Supabase
- [ ] **Políticas de seguridad** del hosting

### 4.4 Hardware y Infraestructura

#### 🖥️ Requisitos Mínimos del Desarrollador
- **RAM**: 8GB (mínimo), 16GB (recomendado)
- **CPU**: Dual-core 2.0GHz (mínimo), Quad-core 3.0GHz+ (recomendado)
- **Almacenamiento**: 10GB libres
- **OS**: Windows 10+, macOS 10.15+, Ubuntu 20.04+
- **Internet**: Conexión estable 10 Mbps+

#### 🌐 Infraestructura de Producción
- **Servidor Web**: Apache 2.4+ o Nginx 1.18+
- **SSL**: Certificado válido (Let's Encrypt recomendado)
- **CDN**: Opcional para optimización global
- **Backup**: Sistema de backup automático diario

### 4.5 Documentación y Referencias

#### 📚 Documentación Técnica
- [ ] **React 18 Documentation**: https://react.dev
- [ ] **Vite Documentation**: https://vitejs.dev
- [ ] **Supabase Documentation**: https://supabase.com/docs
- [ ] **Tailwind CSS Documentation**: https://tailwindcss.com/docs
- [ ] **TypeScript Handbook**: https://www.typescriptlang.org/docs

#### 🔗 APIs y Endpoints
- [ ] **Supabase REST API**: `https://zaxdscclkeytakcowgww.supabase.co/rest/v1/`
- [ ] **Supabase Auth API**: `https://zaxdscclkeytakcowgww.supabase.co/auth/v1/`
- [ ] **Edge Functions Base**: `https://zaxdscclkeytakcowgww.supabase.co/functions/v1/`

#### 📋 Listas de Verificación
- [ ] **Checklist de deployment** completo
- [ ] **Lista de testing** para cada funcionalidad
- [ ] **Configuración de monitoreo** y alertas
- [ ] **Procedimientos de backup** y recuperación

---

## 📊 5. MÉTRICAS DE ÉXITO

### 5.1 Criterios de Aceptación Técnica

#### ✅ Funcionalidad (100% requerido)
- [ ] Todas las páginas cargan en < 3 segundos
- [ ] Autenticación funciona sin errores
- [ ] CRUD operations completan exitosamente
- [ ] Sistema de comentarios en tiempo real
- [ ] Responsive design en móviles y desktop
- [ ] Formularios con validación correcta

#### ✅ Performance (Métricas clave)
- [ ] **First Contentful Paint**: < 1.5s
- [ ] **Largest Contentful Paint**: < 2.5s
- [ ] **Cumulative Layout Shift**: < 0.1
- [ ] **Time to Interactive**: < 3.0s
- [ ] **Bundle size**: < 2MB total

#### ✅ Seguridad (Requisitos mínimos)
- [ ] RLS habilitado en todas las tablas
- [ ] HTTPS configurado correctamente
- [ ] Variables de entorno seguras
- [ ] Validación de entrada en todos los formularios
- [ ] CORS configurado apropiadamente

#### ✅ Compatibilidad (Navegadores)
- [ ] Chrome 90+
- [ ] Firefox 88+
- [ ] Safari 14+
- [ ] Edge 90+

### 5.2 Testing Automatizado Recomendado

#### 🧪 Unit Testing
```bash
# Configuración recomendada
pnpm add -D vitest @testing-library/react @testing-library/jest-dom
```

#### 🔄 Integration Testing
- Testing de autenticación
- Testing de CRUD operations
- Testing de Edge Functions

#### 🌍 E2E Testing (Opcional)
```bash
# Configuración recomendada
pnpm add -D @playwright/test
```

---

## 🚨 6. PROBLEMAS COMUNES Y SOLUCIONES

### 6.1 Errores Frecuentes de Configuración

#### ❌ Error: "Invalid API key"
**Causa**: Variables de entorno mal configuradas
**Solución**: Verificar `.env.local` y restart del servidor

#### ❌ Error: "CORS policy"
**Causa**: Edge Functions sin headers CORS
**Solución**: Verificar configuración en cada function

#### ❌ Error: "RLS Policy violation"
**Causa**: Políticas RLS mal configuradas
**Solución**: Revisar políticas en Supabase Dashboard

#### ❌ Error: "Build failed"
**Causa**: Dependencias faltantes o incompatibles
**Solución**: `pnpm install` y verificar versiones

#### ❌ Error: "Storage upload failed"
**Causa**: Permisos de bucket incorrectos
**Solución**: Verificar políticas de Storage en Supabase

### 6.2 Troubleshooting Workflow

#### 🔍 Diagnóstico Paso a Paso
1. **Verificar logs del navegador** (F12 → Console)
2. **Revisar Supabase Dashboard → Logs**
3. **Verificar variables de entorno**
4. **Probar Edge Functions individualmente**
5. **Verificar conectividad a la base de datos**

#### 📞 Escalación
- **Problemas de Supabase**: https://supabase.com/docs/guides/troubleshooting
- **Problemas de React**: https://reactjs.org/docs/error-boundaries.html
- **Problemas de Vite**: https://vitejs.dev/guide/troubleshooting.html

---

## 📝 7. CHECKLIST FINAL DE ENTREGA

### ✅ Verificación Pre-Launch

#### Sistema Completo
- [ ] **Frontend**: Todas las páginas funcionan
- [ ] **Backend**: Todas las APIs responden
- [ ] **Base de datos**: Datos consistentes
- [ ] **Autenticación**: Login/logout operativo
- [ ] **Autorización**: Roles y permisos correctos

#### Funcionalidades Core
- [ ] **Comunicados**: CRUD completo
- [ ] **Delegados**: Gestión completa
- [ ] **Citas**: Sistema de reservas
- [ ] **Encuestas**: Votación y resultados
- [ ] **Newsletter**: Suscripción y envío
- [ ] **Comentarios**: Tiempo real
- [ ] **Afiliados**: Sistema completo

#### Producción
- [ ] **Deployment**: Sitio en producción
- [ ] **SSL**: Certificado válido
- [ ] **Dominio**: Configurado correctamente
- [ ] **Performance**: Métricas dentro de rangos
- [ ] **Monitoreo**: Logs y alertas activos

#### Documentación
- [ ] **Credenciales**: Documentadas y seguras
- [ ] **Accesos**: Documentados para el cliente
- [ ] **Manual de usuario**: Creado
- [ ] **Contacto de soporte**: Establecido

---

## 📞 8. CONTACTO Y SOPORTE

### 🆘 Soporte Técnico
- **Documentación**: Este documento y README del proyecto
- **Supabase**: https://supabase.com/docs
- **React**: https://react.dev
- **Vite**: https://vitejs.dev

### 📋 Información del Proyecto
- **Versión**: 1.0.0
- **Última actualización**: 11 de Noviembre, 2025
- **Estado**: Producción Ready
- **Próxima revisión**: 3 meses post-deployment

---

*Este documento debe ser actualizado con cada cambio significativo en la arquitectura o requerimientos del sistema.*