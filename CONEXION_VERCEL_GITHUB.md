# 🚀 Conexión Vercel + GitHub - UGT Towa Portal

## ✅ Estado Actual
- ✅ Proyecto subido a GitHub: `tu-usuario/ugt-towa-portal`
- ✅ Archivo ZIP con etiqueta Google Search Console incluido
- 🔄 **SIGUIENTE PASO:** Conectar Vercel con GitHub

## 📋 Pasos para Conectar Vercel

### 1. Ir a Vercel
1. Ve a **https://vercel.com**
2. Haz clic en **"Sign up"** (si no tienes cuenta) o **"Sign in"** (si ya tienes cuenta)
3. **Importante:** Usa la misma cuenta de GitHub que subiste el proyecto

### 2. Conectar con GitHub
1. Una vez dentro de Vercel, haz clic en **"New Project"**
2. Vercel detectará automáticamente tu repositorio `ugt-towa-portal`
3. Haz clic en **"Import"** junto a tu repositorio

### 3. Configurar el Proyecto
1. **Project Name:** `ugt-towa-portal` (o déjalo como está)
2. **Framework Preset:** Debería detectar **"Vite"** automáticamente
3. **Root Directory:** Déjalo vacío (/)
4. **Build Command:** `npm run build` (se pone automáticamente)
5. **Output Directory:** `dist` (se pone automáticamente)
6. **Install Command:** `npm install` (se pone automáticamente)

### 4. Configurar Variables de Entorno
Antes de hacer deploy, necesitamos añadir las variables de Supabase:

1. En la sección **"Environment Variables"**, añade estas 3 variables:

**Variable 1:**
- **Name:** `VITE_SUPABASE_URL`
- **Value:** `https://zaxdscclkeytakcowgww.supabase.co`

**Variable 2:**
- **Name:** `VITE_SUPABASE_ANON_KEY`
- **Value:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpheGRzY2Nsa2V5dGFrY293Z3d3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTI3MzkxMjAsImV4cCI6MjAyODMxNTEyMH0.VjzXQKQBb2XM8g8-qtIjj8XFpN7xO8qCPrrJDb7WmV8`

**Variable 3:**
- **Name:** `VITE_APP_URL`
- **Value:** `https://ugt.towa.cat`

### 5. Deploy
1. Haz clic en **"Deploy"**
2. Vercel will start building the project
3. Espera 2-3 minutos mientras se construye
4. ¡Obtendrás una URL como: `https://ugt-towa-portal-abc123.vercel.app`

### 6. Configurar Dominio Personalizado
1. En el dashboard de Vercel, ve a **"Settings"** del proyecto
2. Haz clic en **"Domains"**
3. Añade el dominio: `ugt.towa.cat`
4. Vercel te dará instrucciones DNS (cambiar en tu proveedor de dominio)

## ⚠️ IMPORTANTE: Verificar que Funciona
Una vez deployado:
1. **Accede a la URL de Vercel:** `https://ugt-towa-portal-abc123.vercel.app`
2. **Verifica que:**
   - La página carga correctamente
   - No hay errores en consola (F12)
   - Puedes hacer login con tus credenciales
   - Los estilos se ven bien

## 🔄 Siguiente Paso
Una vez que el deploy esté funcionando, te ayudo con:
1. ✅ Verificación final
2. 🔍 Probar Google Search Console
3. 📄 Subir sitemap.xml a Vercel
4. 🎯 Indexación de Google

## ❓ ¿Necesitas Ayuda?
Si algo no funciona o tienes dudas, compárteme:
1. La URL del proyecto deployado
2. Cualquier error que veas
3. El estado del deploy en Vercel

**¿Ya estás en Vercel o necesitas crear una cuenta primero?**
