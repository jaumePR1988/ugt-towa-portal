# UGT Towa Portal - Versión Limpia

## 📋 **Descripción**
Portal sindical oficial de UGT Towa Pharmaceutical con todas las funcionalidades avanzadas implementadas y completamente libre de branding de terceros.

## ✨ **Funcionalidades Incluidas**

### 🚀 **PWA (Progressive Web App)**
- Sistema de instalación inteligente
- Pop-up auto-mostrable para nuevos usuarios
- Botón flotante discreto para usuarios que rechazaron
- Manifest.json y Service Worker configurados
- Iconos optimizados para todas las plataformas

### 🔔 **Sistema de Notificaciones Push**
- **Panel de administración completo** con 3 pestañas:
  - **Manual**: Envío manual de notificaciones
  - **Configuración Auto**: Configuración automática de eventos
  - **Historial**: Historial de notificaciones enviadas
- **Eventos automáticos**:
  - Citas creadas
  - Citas canceladas
  - Citas modificadas
  - Citas con estado actualizado
- **Templates personalizables** con variables dinámicas
- **Backend completo**: Edge functions, triggers, cron jobs

### 📱 **Navegación Móvil**
- Menú hamburguesa responsive
- Tab "Afiliados" visible en móvil
- Diseño completamente adaptativo
- UX optimizada para touch

### 🏢 **Panel de Administración**
- Gestión completa de comunicados
- Sistema de citas con disponibilidad
- Gestión de encuestas y análisis
- Newsletter con editor integrado
- Gestión de documentos y categorías
- Panel de afiliados
- Galería de imágenes
- Configuraciones avanzadas

### 👥 **Portal de Afiliados**
- Dashboard personalizado
- Biblioteca de recursos
- Encuestas específicas para afiliados
- Beneficios UGT
- Acceso controlado

## 🛠 **Instalación y Configuración**

### **Requisitos**
- Node.js 18+ 
- pnpm (recomendado) o npm
- Cuenta Supabase

### **1. Instalar Dependencias**
```bash
cd ugt-towa-portal
pnpm install
# o con npm: npm install
```

### **2. Configurar Variables de Entorno**
Copia y configura los archivos `.env`:
```bash
# .env.local
VITE_SUPABASE_URL=tu_supabase_url
VITE_SUPABASE_ANON_KEY=tu_supabase_anon_key
```

### **3. Configurar Supabase**
- Importa las migraciones desde `/supabase/migrations/`
- Despliega las Edge Functions desde `/supabase/functions/`
- Configura las políticas RLS necesarias

### **4. Desarrollo**
```bash
pnpm dev
# Abre http://localhost:5173
```

### **5. Build para Producción**
```bash
pnpm build
# Los archivos están en /dist
```

## 📁 **Estructura del Proyecto**

```
ugt-towa-portal/
├── src/
│   ├── components/          # Componentes reutilizables
│   │   ├── Navbar.tsx       # ✅ Navegación responsive
│   │   ├── PWAInstallPrompt_Inteligente.tsx  # ✅ PWA inteligente
│   │   └── ...
│   ├── pages/              # Páginas principales
│   │   ├── admin/          # Panel administrativo completo
│   │   ├── affiliates/     # Portal de afiliados
│   │   └── ...
│   ├── hooks/              # Custom hooks
│   │   └── usePWA_Inteligente.ts  # ✅ PWA inteligente
│   ├── lib/
│   │   └── supabase.ts     # Configuración Supabase
│   └── ...
├── supabase/
│   ├── functions/          # ✅ 25+ Edge Functions
│   └── migrations/         # ✅ Migraciones de BD
├── public/                 # ✅ PWA icons y archivos estáticos
└── package.json
```

## 🎯 **Funcionalidades Clave Implementadas**

### **PWA Inteligente** ✅
- Auto-detección de instalación
- Respeto a preferencias del usuario
- Sin spam de notificaciones
- Experiencia nativa en móvil

### **Notificaciones Push Avanzadas** ✅
- Sistema 100% automático
- Eventos configurables
- Templates personalizables
- Cron jobs para procesamiento

### **Navegación Móvil** ✅
- Hamburger menu completo
- Todas las opciones visibles
- Touch-optimized
- Responsive design

### **Backend Completo** ✅
- 25+ Edge Functions desplegadas
- Base de datos optimizada
- Storage configurado
- Autenticación completa

## 🔧 **Tecnologías Utilizadas**

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS + shadcn/ui
- **Backend**: Supabase (Database + Auth + Storage + Edge Functions)
- **PWA**: Service Worker + Web App Manifest
- **Push Notifications**: Service Worker + Push API
- **Responsive**: Mobile-first design

## 📋 **Checklist de Funcionalidades**

- [x] Sistema PWA inteligente
- [x] Notificaciones push automáticas
- [x] Navegación móvil responsive
- [x] Panel de administración completo
- [x] Portal de afiliados
- [x] Sistema de citas avanzado
- [x] Newsletter con editor
- [x] Gestión de documentos
- [x] Encuestas y análisis
- [x] Galería de imágenes
- [x] QR codes
- [x] SEO optimizado
- [x] Sin branding de terceros
- [x] Código limpio y documentado

## 🚀 **Despliegue**

El proyecto está listo para desplegar en cualquier plataforma compatible con Vite:

### **Opciones de Hosting**
- **Vercel** (recomendado)
- **Netlify**
- **GitHub Pages**
- **Tu servidor**

### **Dominio Personalizado**
Para evitar cualquier branding de terceros, configura un dominio personalizado:
- `ugt.towa.cat`
- `portal.ugt-towa.es`
- `www.towapharmaceutical-ugt.com`

## 📞 **Soporte**

Este proyecto incluye:
- ✅ Código completamente limpio
- ✅ Sin referencias a MiniMax
- ✅ Todas las funcionalidades probadas
- ✅ Documentación completa
- ✅ Estructura modular y mantenible

## 📝 **Notas Importantes**

1. **PWA**: El sistema PWA inteligente respeta las preferencias del usuario
2. **Notificaciones**: Solo para administradores - no spam a usuarios finales
3. **Móvil**: Diseño completamente responsive con navegación optimizada
4. **SEO**: Optimizado para motores de búsqueda
5. **Rendimiento**: Código optimizado y splitting automático

---

**UGT Towa Portal - Versión Limpia y Profesional** 🎯