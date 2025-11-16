# 🚀 Guía Completa de Configuración Vercel - UGT Towa Portal

## 📋 Descripción del Proyecto
- **Tipo:** PWA (Progressive Web App) con React + Vite + TypeScript
- **Framework:** Vite + React
- **PWA:** Service Worker, Manifest, Cache Strategy
- **Base de datos:** Supabase
- **Mapa:** Google Maps API
- **Notificaciones:** VAPID Keys

---

## 🔧 1. CONECTAR REPOSITORIO GITHUB A VERCEL

### Paso 1.1: Preparar el Repositorio
```bash
# Verificar que tienes el código en GitHub
git status
git push origin main  # Si hay cambios pendientes
```

### Paso 1.2: Acceder a Vercel
1. Ve a **https://vercel.com**
2. Inicia sesión con tu cuenta de GitHub
3. Haz clic en **"New Project"**

### Paso 1.3: Importar Repositorio
1. Vercel detectará automáticamente tus repositorios
2. Busca tu repositorio `ugt-towa-portal` (o similar)
3. Haz clic en **"Import"**

### Paso 1.4: Configuración Inicial del Proyecto
- **Project Name:** `ugt-towa-portal`
- **Framework Preset:** Selecciona **"Vite"**
- **Root Directory:** `/` (dejar vacío)
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Install Command:** `npm install`

---

## 🔐 2. VARIABLES DE ENTORNO REQUERIDAS

### Paso 2.1: Agregar Variables en Vercel
1. En la pantalla de configuración, desplázate hasta **"Environment Variables"**
2. Agrega cada variable una por una:

### Variables Principales:

#### 🔑 VITE_VAPID_PUBLIC_KEY
- **Name:** `VITE_VAPID_PUBLIC_KEY`
- **Value:** `[Tu clave pública VAPID]`
- **Environment:** Production, Preview, Development

#### 🗄️ VITE_SUPABASE_URL
- **Name:** `VITE_SUPABASE_URL`
- **Value:** `[Tu URL de Supabase]`
- **Environment:** Production, Preview, Development

#### 🔐 VITE_SUPABASE_ANON_KEY
- **Name:** `VITE_SUPABASE_ANON_KEY`
- **Value:** `[Tu clave anónima de Supabase]`
- **Environment:** Production, Preview, Development

#### 🗺️ VITE_GOOGLE_MAPS_API_KEY
- **Name:** `VITE_GOOGLE_MAPS_API_KEY`
- **Value:** `[Tu API Key de Google Maps]`
- **Environment:** Production, Preview, Development

### Variables Adicionales (Opcionales pero Recomendadas):

#### 📧 VITE_CONTACT_EMAIL
- **Name:** `VITE_CONTACT_EMAIL`
- **Value:** `jpedragosa@towapharmaceutical.com`
- **Environment:** Production, Preview, Development

#### 📞 VITE_CONTACT_PHONE
- **Name:** `VITE_CONTACT_PHONE`
- **Value:** `629931957`
- **Environment:** Production, Preview, Development

#### 🌐 VITE_APP_URL
- **Name:** `VITE_APP_URL`
- **Value:** `https://ugt.towa.cat`
- **Environment:** Production, Preview, Development

### Paso 2.2: Obtener las Claves Reales

#### Para VAPID Keys:
```bash
# Generar claves VAPID (solo si no las tienes)
npx web-push generate-vapid-keys
# Te dará publicKey y privateKey
```

#### Para Supabase:
1. Ve a tu proyecto en https://supabase.com
2. Settings → API
3. Copia:
   - **Project URL** → VITE_SUPABASE_URL
   - **anon public** → VITE_SUPABASE_ANON_KEY

#### Para Google Maps:
1. Ve a Google Cloud Console
2. Habilita Maps JavaScript API
3. Crea credenciales (API Key)
4. Restringe el dominio: `*.vercel.app/*`

---

## ⚙️ 3. COMANDOS DE BUILD Y CONFIGURACIÓN PWA

### Paso 3.1: Configuración Automática de Vercel
El archivo `vercel.json` ya está configurado:

```json
{
  "installCommand": "npm install",
  "buildCommand": "npm run build",
  "framework": "vite",
  "outputDirectory": "dist",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

### Paso 3.2: Scripts de Build Disponibles
```bash
# Build estándar
npm run build

# Build para producción
npm run build:prod

# Desarrollo local
npm run dev

# Preview del build
npm run preview
```

### Paso 3.3: Configuración PWA Específica

#### Archivos PWA Incluidos:
- ✅ `public/manifest.json` - Configuración de la PWA
- ✅ `public/sw.js` - Service Worker
- ✅ `public/sw-notifications.js` - Manejo de notificaciones
- ✅ Iconos PWA en múltiples resoluciones (96x96, 144x144, 192x192, 512x512)

#### Características PWA:
- **Display Mode:** Standalone
- **Orientation:** Portrait
- **Theme Color:** #e50000 (Rojo UGT)
- **Background Color:** #ffffff
- **Service Worker:** Cache + Notificaciones
- **Shortcuts:** Comunicados, Citas, Encuestas

---

## 🚀 4. PROCESO DE DEPLOY

### Paso 4.1: Primer Deploy
1. Después de configurar las variables
2. Haz clic en **"Deploy"**
3. Vercel ejecutará automáticamente:
   - `npm install`
   - `npm run build`
   - Deploy del directorio `dist`

### Paso 4.2: Tiempo de Build
- **Duración:** 3-5 minutos
- **Ver logs:** Puedes ver el progreso en tiempo real

### Paso 4.3: URLs Resultantes
- **URL de Vercel:** `https://tu-proyecto.vercel.app`
- **Preview URL:** Para cada commit/PR
- **Producción:** URL principal del proyecto

---

## ✅ 5. VERIFICACIÓN DEL DEPLOY

### Paso 5.1: Verificación Básica
1. **Accede a la URL generada**
2. **Verifica que la página carga:**
   - Sin errores 404
   - Estilos correctos
   - Navegación funcional

### Paso 5.2: Verificar PWA
1. **Abre la DevTools (F12)**
2. **Console:**
   ```bash
   # No debe haber errores críticos
   # Service Worker registrado exitosamente
   ```

3. **Application Tab → Service Workers:**
   - ✅ Status: Running
   - ✅ Scope: /

4. **Application Tab → Manifest:**
   - ✅ Manifest detected
   - ✅ Icons loads
   - ✅ PWA installable

### Paso 5.3: Verificar Funcionalidades Específicas

#### Base de Datos (Supabase):
```javascript
// En la consola del navegador
console.log(import.meta.env.VITE_SUPABASE_URL);
// Debe mostrar tu URL de Supabase
```

#### Maps (Google Maps):
- Navega a secciones con mapas
- Verifica que cargan correctamente
- No debe haber errores de API Key

#### Notificaciones:
```javascript
// En la consola
if ('serviceWorker' in navigator) {
  console.log('Service Worker disponible');
}
```

### Paso 5.4: Testing de Performance
1. **Lighthouse (DevTools):**
   - Performance: >90
   - PWA: 100
   - Best Practices: >90
   - SEO: >90

2. **Mobile Testing:**
   - Abrir en móvil
   - Verificar que es "Add to Home Screen"
   - Test de instalación PWA

---

## 🌐 6. CONFIGURACIÓN DE DOMINIO PERSONALIZADO

### Paso 6.1: Configurar Dominio
1. **En Vercel Dashboard → Settings → Domains**
2. **Agregar dominio:** `ugt.towa.cat`
3. **Seguir instrucciones DNS:**
   - CNAME o A record
   - Verificación DNS

### Paso 6.2: Configurar HTTPS
- ✅ **Automático:** Vercel proporciona SSL/TLS
- ✅ **Let's Encrypt:** Renovación automática

---

## 🛠️ 7. MANTENIMIENTO Y ACTUALIZACIONES

### Paso 7.1: Auto-Deploy con Git
- ✅ **Push a main:** Auto-deploy
- ✅ **Pull Requests:** Preview deployments
- ✅ **Commits:** Nuevas builds automáticas

### Paso 7.2: Variables de Entorno - Actualizar
1. **Vercel Dashboard → Settings → Environment Variables**
2. **Edit:** Modifica valores
3. **Redeploy:** Manual o automático

### Paso 7.3: Rollback
1. **Vercel Dashboard → Deployments**
2. **Selecciona deploy anterior**
3. **Click:** "Promote to Production"

---

## 🚨 8. TROUBLESHOOTING COMÚN

### Error: "Build failed"
```bash
# Verificar en Vercel logs:
- Dependencies correctas
- Variables de entorno presentes
- Build command: npm run build
```

### Error: PWA no se instala
```bash
# Verificar:
1. Manifest.json válido
2. Service Worker registrado
3. HTTPS habilitado
4. Iconos en resoluciones correctas
```

### Error: Maps no carga
```bash
# Verificar:
1. API Key válida
2. Dominio restringido correctamente
3. Billing habilitado en Google Cloud
4. Maps JavaScript API activada
```

### Error: Supabase no conecta
```bash
# Verificar:
1. VITE_SUPABASE_URL correcta
2. VITE_SUPABASE_ANON_KEY válida
3. RLS policies configuradas
4. Proyecto Supabase activo
```

---

## 📞 9. SOPORTE Y RECURSOS

### Enlaces Útiles:
- **Vercel Docs:** https://vercel.com/docs
- **Vite Docs:** https://vitejs.dev/
- **PWA Guide:** https://web.dev/progressive-web-apps/
- **Supabase Docs:** https://supabase.com/docs

### Comandos de Verificación Local:
```bash
# Antes de push, verificar:
npm run build        # Build sin errores
npm run preview      # Preview local
npm run lint         # Sin errores lint

# PWA testing:
npm run dev          # Modo desarrollo
# Abrir en móvil para probar PWA
```

---

## ✅ CHECKLIST FINAL DE VERIFICACIÓN

- [ ] Repositorio conectado a Vercel
- [ ] Variables de entorno configuradas:
  - [ ] VITE_VAPID_PUBLIC_KEY
  - [ ] VITE_SUPABASE_URL
  - [ ] VITE_SUPABASE_ANON_KEY
  - [ ] VITE_GOOGLE_MAPS_API_KEY
- [ ] Build exitoso en Vercel
- [ ] Página carga sin errores
- [ ] PWA instalable
- [ ] Service Worker registrado
- [ ] Base de datos conectada
- [ ] Maps funcionando
- [ ] Dominio personalizado configurado
- [ ] HTTPS activo
- [ ] Performance Lighthouse >90
- [ ] Testing en móvil

---

**🎯 ¡Listo! Tu Portal UGT-TOWA PWA está desplegado y funcionando en Vercel.**

Para soporte adicional, proporciona:
1. URL del proyecto desplegado
2. Logs de error específicos
3. Capturas de pantalla del problema