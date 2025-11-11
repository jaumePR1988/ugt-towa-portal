# 🚀 CONEXIÓN VERCEL - SISTEMA NEWSLETTER COMPLETO

## ✅ Estado Actual
- ✅ Repositorio GitHub creado con estructura correcta
- ✅ Sistema de newsletter restaurado (298KB)
- ✅ Google Search Console verificado
- 🔄 **AHORA:** Conectar Vercel y configurar variables

## 📋 PASOS PARA CONECTAR VERCEL

### 1️⃣ Conectar Repositorio

1. **Ir a Vercel:** https://vercel.com/dashboard
2. **Click:** "New Project"
3. **Import Git Repository** → Seleccionar `jaumePR1988/ugt-towa-portal`
4. **Project Settings:**
   - Framework: `Vite`
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Root Directory: `./` (dejar vacío)

### 2️⃣ Variables de Entorno (CRÍTICO)

**Antes de hacer Deploy, añadir estas 3 variables:**

#### Variables a Configurar:
```
Name: VITE_SUPABASE_URL
Value: https://zaxdscclkeytakcowgww.supabase.co

Name: VITE_SUPABASE_ANON_KEY  
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpheGRzY2Nsa2V5dGFrY293Z3d3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTI3MzkxMjAsImV4cCI6MjAyODMxNTEyMH0.VjzXQKQBb2XM8g8-qtIjj8XFpN7xO8qCPrrJDb7WmV8

Name: VITE_APP_URL
Value: https://ugt.towa.cat
```

#### Ubicación en Vercel:
1. En el proyecto, ir a **Settings** → **Environment Variables**
2. **Add New** para cada variable
3. **Environment:** Production, Preview, Development (todas)

### 3️⃣ Deploy

1. **Click:** "Deploy"
2. **Esperar** a que termine el build (2-3 minutos)
3. **Verificar** que no hay errores

## 🔍 VERIFICACIÓN POST-DEPLOY

### ✅ Checklist de Verificación:

**🌐 Web Principal:**
- [ ] https://ugt.towa.cat carga correctamente
- [ ] No hay errores en consola del navegador
- [ ] Navegación funciona (Inicio, Quiénes Somos, etc.)

**📧 Sistema de Newsletter:**
- [ ] Página `/newsletter` accesible (suscripción pública)
- [ ] Admin `/admin/newsletter` funciona con login de admin
- [ ] Puede crear contenido de newsletter
- [ ] Reportes mensuales disponibles
- [ ] Exportación de usuarios funciona

**🔍 Google Search Console:**
- [ ] Verificación del sitio exitosa
- [ ] `google04273cafa2bc9d12.html` accesible en: https://ugt.towa.cat/google04273cafa2bc9d12.html
- [ ] Meta tag verificado: https://ugt.towa.cat

### 🧪 Test del Sistema Newsletter

1. **Login como admin:** `jpedragosa@towapharmaceutical.com` / `towa2022`
2. **Ir a Admin → Newsletter**
3. **Verificar funcionalidades:**
   - ✅ Crear contenido (noticias, eventos, estadísticas)
   - ✅ Generar borrador mensual
   - ✅ Exportar suscriptores a PDF/Excel
   - ✅ Gráficos y analytics

## ⚠️ POSIBLES PROBLEMAS Y SOLUCIONES

### Error: "Build failed"
- **Causa:** Variables de entorno no configuradas
- **Solución:** Añadir las 3 variables en Vercel Settings

### Error: "Page not found" en /newsletter
- **Causa:** Build no incluyó las rutas
- **Solución:** Verificar que el repositorio tiene la estructura correcta

### Error: "Supabase connection failed"
- **Causa:** Variables de Supabase incorrectas
- **Solución:** Verificar VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY

## 📱 URLs IMPORTANTES

**Una vez desplegado:**
- 🏠 **Web principal:** https://ugt.towa.cat
- 📧 **Newsletter:** https://ugt.towa.cat/newsletter
- 🔧 **Admin Newsletter:** https://ugt.towa.cat/admin/newsletter
- 🔍 **Google Verificación:** https://ugt.towa.cat/google04273cafa2bc9d12.html

## 🎉 ¡RESULTADO ESPERADO!

Al final tendrás:
- ✅ Portal sindical completamente funcional
- ✅ Sistema de newsletter con reportes automáticos mensuales
- ✅ Exportación de usuarios registrados
- ✅ Google Search Console verificado
- ✅ Deploy sin errores en Vercel

**¿Necesitas ayuda con algún paso específico?**