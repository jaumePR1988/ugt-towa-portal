# Variables de Entorno - Portal UGT-TOWA

## Variables Actuales Configuradas

### 🔧 Variables de Supabase
```env
VITE_SUPABASE_URL=https://zaxdscclkeytakcowgww.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpheGRzY2Nsa2V5dGFrY293Z3d3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIwMTUxMTIsImV4cCI6MjA3NzU5MTExMn0.MQMePYqEhW9xhCipC-MeU8Z_dXqvyBKH5e0vtgaS9xQ
```

### 📧 Variables de Contacto
```env
VITE_CONTACT_EMAIL=jpedragosa@towapharmaceutical.com
VITE_CONTACT_PHONE=629931957
```

## 🏗️ Configuración en Vercel

### Pasos para configurar estas variables en Vercel:

1. **Acceder al Dashboard de Vercel**
   - Ir a: https://vercel.com/dashboard
   - Seleccionar proyecto "ugt-towa"

2. **Configurar Variables**
   - Ir a **Settings** > **Environment Variables**
   - Agregar cada variable una por una:

| Nombre | Valor | Entornos |
|--------|-------|----------|
| `VITE_SUPABASE_URL` | `https://zaxdscclkeytakcowgww.supabase.co` | Production, Preview, Development |
| `VITE_SUPABASE_ANON_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` | Production, Preview, Development |
| `VITE_CONTACT_EMAIL` | `jpedragosa@towapharmaceutical.com` | Production, Preview, Development |
| `VITE_CONTACT_PHONE` | `629931957` | Production, Preview, Development |

3. **Redeployar**
   - Ir a **Deployments**
   - Seleccionar el deploy más reciente
   - Hacer clic en **Redeploy**

## 📁 Archivo .env.example

```env
# Configuración de Supabase
VITE_SUPABASE_URL=https://zaxdscclkeytakcowgww.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpheGRzY2Nsa2V5dGFrY293Z3d3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIwMTUxMTIsImV4cCI6MjA3NzU5MTExMn0.MQMePYqEhW9xhCipC-MeU8Z_dXqvyBKH5e0vtgaS9xQ

# Datos de contacto (pueden modificarse sin tocar el código)
VITE_CONTACT_EMAIL=jpedragosa@towapharmaceutical.com
VITE_CONTACT_PHONE=629931957
```

## ❓ Sobre la funcionalidad "seguimos"

No he encontrado referencias a una funcionalidad específica llamada "seguimos" en:
- Código fuente (componentes, páginas, rutas)
- Archivos de configuración
- Base de datos (tablas, esquemas)
- Documentación del proyecto

Si necesitas implementar esta funcionalidad, podrías especificar:
- ¿Es una nueva página/sección?
- ¿Qué tipo de contenido debe mostrar?
- ¿Cuáles serían sus variables de entorno específicas?

## 🔍 Verificación Actual

**Archivos revisados:**
- ✅ `.env.example` - Variables de entorno de ejemplo
- ✅ `CONFIGURACION_VARIABLES_VERCEL.md` - Guía de configuración
- ✅ Código fuente completo (páginas, componentes, rutas)
- ✅ Base de datos (tablas y esquemas)
- ✅ Documentación del proyecto

**Estado:** Las variables de entorno actuales están completas para el funcionamiento del portal, pero no hay información específica sobre la funcionalidad "seguimos".