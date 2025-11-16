# 🚀 CONFIGURACIÓN MANUAL VERCEL - UGT TOWA PORTAL

## ✅ **REPOSITORIO GITHUB ACTUALIZADO:**
- **URL**: `https://github.com/jaumePR1988/ugt-towa-portal.git`
- **Estado**: ✅ Actualizado con todas las mejoras
- **Commit Hash**: `9410a77aeb45841c673eac5b40c5868724defec1`

---

## 📋 **PASO 1: CONECTAR REPOSITORIO A VERCEL**

1. **Ir a Vercel**: https://vercel.com
2. **Login** con tu cuenta de GitHub
3. **Click "New Project"**
4. **Importar Repositorio**: 
   - Buscar `jaumePR1988/ugt-towa-portal`
   - Click "Import"
5. **Configuración del Proyecto**:
   - **Project Name**: `ugt-towa-portal`
   - **Framework**: Vite (detectado automáticamente)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

---

## 🔧 **PASO 2: VARIABLES DE ENTORNO EN VERCEL**

**IMPORTANT**: Configura estas variables en Vercel → Project Settings → Environment Variables

### **Variables Requeridas (6 variables):**

```env
# 1. VAPID Key para Notificaciones Push
VITE_VAPID_PUBLIC_KEY=BEl62iUYgUivxIkv69yViEuiBIa40HI80NQDcdMhI0v5C5D5tV6C5bC9nJ6dS8vQ1lK9mN2pR6sF5tV3wL9hY6dJ8vS4pQ2mN8

# 2. Supabase URL
VITE_SUPABASE_URL=https://zaxdscclkeytakcowgww.supabase.co

# 3. Supabase Anonymous Key
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpheGRzY2Nsa2V5dGFrY293Z3d3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIwMTUxMTIsImV4cCI6MjA3NzU5MTExMn0.MQMePYqEhW9xhCipC-MeU8Z_dXqvyBKH5e0vtgaS9xQ

# 4. Google Maps API Key
VITE_GOOGLE_MAPS_API_KEY=AIzaSyCO0kKndUNlmQi3B5mxy4dblg_8WYcuKuk

# 5. Contacto Email
VITE_CONTACT_EMAIL=jpedragosa@towapharmaceutical.com

# 6. Contacto Teléfono
VITE_CONTACT_PHONE=629931957
```

### **Configuración de Variables:**
- **Environment**: Production, Preview, Development (todas)
- **Name**: Usar exactamente los nombres de arriba
- **Value**: Usar exactamente los valores de arriba

---

## ⚡ **PASO 3: DEPLOY AUTOMÁTICO**

1. **Click "Deploy"** en Vercel
2. **Esperar** el build (2-5 minutos)
3. **Verificar** que no hay errores en el build log

---

## ✅ **PASO 4: VERIFICACIÓN INICIAL**

### **URLs a Verificar:**
- **Portal Principal**: `https://ugt-towa-portal.vercel.app` (o tu dominio personalizado)
- **Admin Dashboard**: `https://ugt-towa-portal.vercel.app/admin`

### **Funciones a Probar:**
1. **Página Principal** se carga correctamente
2. **Sistema de Citas** funciona
3. **Mapa de Google** se muestra
4. **Notificaciones PWA** aparecen (prompt de instalación)
5. **Panel Admin** es accesible

---

## 🎯 **RESULTADO ESPERADO:**

Una vez completado, tendrás:
- ✅ Portal UGT Towa funcionando en Vercel
- ✅ Notificaciones push operativas con VAPID keys
- ✅ PWA instalable
- ✅ Edge functions en Supabase activas
- ✅ Sistema completo de citas y comunicación

---

## 🆘 **SOPORTE:**

Si encuentras algún problema:
1. **Build Error**: Verificar que todas las variables de entorno están configuradas
2. **Notificaciones no funcionan**: Verificar VAPID key y permisos del navegador
3. **Maps no cargan**: Verificar Google Maps API key

**¡Tu portal con notificaciones estará operativo en 5-10 minutos!**