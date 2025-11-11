# 🚀 Instrucciones Finales - Conexión Vercel

## Paso 1: Conectar Vercel
1. Ve a https://vercel.com/dashboard
2. Click "Add New Project"
3. Select: **github.com/jaumePR1988/ugt-towa-portal**
4. Click "Import"

## Paso 2: Configurar Build Settings
- **Framework Preset:** Vite ✅
- **Build Command:** `npm run build` ✅
- **Output Directory:** `dist` ✅
- Click "Deploy"

## Paso 3: Configurar Variables de Entorno
Ve a **Settings** → **Environment Variables** y añade estas 3:

### Variable 1:
- **Name:** `VITE_SUPABASE_URL`
- **Value:** `https://zaxdscclkeytakcowgww.supabase.co`

### Variable 2:
- **Name:** `VITE_SUPABASE_ANON_KEY`
- **Value:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpheGRzY2Nsa2V5dGFrY293Z3d3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTI3MzkxMjAsImV4cCI6MjAyODMxNTEyMH0.VjzXQKQBb2XM8g8-qtIjj8XFpN7xO8qCPrrJDb7WmV8`

### Variable 3:
- **Name:** `VITE_APP_URL`
- **Value:** `https://ugt.towa.cat`

## Paso 4: Redeploy
Después de añadir las variables:
1. Click "Redeploy"
2. Espera a que termine el build (sin errores)

## ✅ Verificación Final
Una vez completado, verifica:
- ✅ La web carga en: https://ugt.towa.cat
- ✅ La navegación funciona
- ✅ El sistema de newsletter está accesible
- ✅ Google Search Console reconoce la verificación

¡Tu portal sindical estará completamente funcional! 🎉