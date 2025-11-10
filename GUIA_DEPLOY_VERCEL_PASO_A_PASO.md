# 🚀 GUÍA PASO A PASO - Deploy en Vercel (SÚPER FÁCIL)

## 🎯 MÉTODO 1: Panel Web Vercel (MÁS FÁCIL - 5 MINUTOS)

### PASO 1: Ir a Vercel
1. **Abre tu navegador**
2. **Ve a**: https://vercel.com/dashboard
3. **Inicia sesión** con tu cuenta de GitHub

### PASO 2: Crear Nuevo Proyecto
1. **Click en el botón**: **"New Project"** (botón verde)
2. **Click en**: **"Import Git Repository"**
3. **Busca tu repositorio**: `ugt-towa-portal`
4. **Click**: **"Import"**

### PASO 3: Configurar Deploy (Ya viene optimizado)
**Vercel detectará automáticamente:**
- ✅ **Framework Preset**: Vite
- ✅ **Root Directory**: `./` (deja así)
- ✅ **Build Command**: `npm run build` (ya configurado)
- ✅ **Output Directory**: `dist` (ya configurado)
- ✅ **Install Command**: `npm install` (ya configurado)

**Solo necesitas:**
- Click **"Deploy"** (botón azul)
- Esperar 2-3 minutos

### PASO 4: ¡Listo!
- **Verás** una barra de progreso
- **Cuando termine** → Click **"Continue to Dashboard"**
- **Tu sitio** estará en: https://ugt.towa.cat

---

## 🎯 MÉTODO 2: Si ya tienes el proyecto en GitHub

### PASO 1: Conectar Repositorio
1. **Dashboard de Vercel** → **"Add New Project"**
2. **"Import Git Repository"** → Tu repositorio `ugt-towa-portal`
3. **Click**: **"Import"**

### PASO 2: Deploy
- **Vercel detectará automáticamente** la configuración de Vite
- **Click**: **"Deploy"**
- **Esperar** hasta que termine

---

## 🔍 VERIFICAR QUE FUNCIONA

### Después del deploy, verifica:
```
✅ https://ugt.towa.cat/robots.txt          ← Debe cargar
✅ https://ugt.towa.cat/sitemap.xml         ← Debe cargar  
✅ https://ugt.towa.cat/                    ← Tu portal principal
```

### Si todo carga → ¡PERFECTO! ✅

---

## 🚨 SI ALGO FALLA

### Error: "No se encuentra el repositorio"
- **Solución**: Confirma que el repositorio en GitHub es **PÚBLICO**
- **Verifica**: Que el nombre sea exactamente `ugt-towa-portal`

### Error: "Build failed"
- **Solución**: 
  - Ve a la pestaña **"Functions"** en Vercel
  - Revisa los logs para ver el error específico
  - Puede ser problema de dependencias

### Error: "Domain not configured"
- **Solución**: 
  - En Vercel → Project Settings → Domains
  - El dominio `ugt.towa.cat` ya está configurado
  - Vercel lo detectará automáticamente

### Error: "Page not found"
- **Solución**: 
  - Espera 1-2 minutos más (propagación DNS)
  - Verifica que `vercel.json` está en la raíz del proyecto

---

## 🔧 CONFIGURACIÓN AVANZADA (SI ES NECESARIO)

### Variables de Entorno
Si tu proyecto necesita variables de entorno:
1. **Project Settings** → **Environment Variables**
2. **Añadir**:
   - `VITE_SUPABASE_URL` = `https://zaxdscclkeytakcowgww.supabase.co`
   - `VITE_SUPABASE_ANON_KEY` = (tu clave)
3. **Redeploy** después de añadir

### Configuración Personalizada
Si necesitas cambiar algo:
1. **Project Settings** → **Build & Output Settings**
2. **Modificar**:
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

---

## 📱 CONTROL DE VERSIONES

### Deploy Previews
- **Cada commit** en GitHub crea un **"Preview URL"**
- **Para probar cambios** antes de producción
- **Ejemplo**: `https://ugt-towa-portal-abc123.vercel.app`

### Production Deploy
- **Branch principal** (`main`) = Producción
- **URL final**: https://ugt.towa.cat

---

## 🎉 RESULTADO FINAL

### Al terminar tendrás:
- ✅ **Portal funcionando**: https://ugt.towa.cat
- ✅ **SEO optimizado**: robots.txt, sitemap.xml
- ✅ **Deploy automático**: cada push en GitHub
- ✅ **URLs personalizadas**: dominio propio
- ✅ **Performance optimizado**: CDN global

### Próximos pasos:
1. **Añadir archivo Google**: `google[ID].html` a carpeta `public/`
2. **Google Search Console**: Verificar propiedad
3. **Enviar sitemap**: `sitemap.xml`
4. **¡Esperar indexación!** (24-48 horas)

---

## 💡 TIPS IMPORTANTES

### ✅ **DO** (Hacer):
- Usar repositorio público en GitHub
- Esperar a que termine completamente el deploy
- Verificar las URLs después del deploy

### ❌ **DON'T** (No hacer):
- Interrumpir el proceso de deploy
- Cambiar configuraciones sin saber qué hacen
- Olvidar añadir el archivo de verificación Google

---

## 🆘 SOPORTE RÁPIDO

**¿No encuentras "New Project"?**
- Verifica que estás logueado en Vercel
- Asegúrate de que tu cuenta de GitHub está conectada

**¿El botón está gris/deshabilitado?**
- Confirma que has seleccionado un repositorio
- Revisa que el repositorio no esté vacío

**¿El deploy toma mucho tiempo?**
- Es normal: 2-3 minutos primera vez
- Más rápido en deploys posteriores
- No cierres la ventana

**¿Dudas específicas?** ¿En qué paso exacto tienes problemas?