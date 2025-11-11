# ✅ Checklist Pre-Deploy Vercel

## 📋 Verificaciones Antes de Hacer Deploy

### 1. GitHub ✅
- [ ] Repositorio `ugt-towa-portal` creado en GitHub
- [ ] Todos los archivos subidos correctamente
- [ ] Etiqueta de Google Search Console incluida en index.html

### 2. Vercel ✅
- [ ] Cuenta de Vercel creada/activa
- [ ] Conectado con la misma cuenta de GitHub
- [ ] Proyecto `ugt-towa-portal` importado

### 3. Variables de Entorno ⚠️
**IMPORTANTE:** Estas 3 variables son CRÍTICAS para el funcionamiento:

- [ ] `VITE_SUPABASE_URL` = `https://zaxdscclkeytakcowgww.supabase.co`
- [ ] `VITE_SUPABASE_ANON_KEY` = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (clave larga)
- [ ] `VITE_APP_URL` = `https://ugt.towa.cat`

### 4. Configuración del Proyecto ✅
- [ ] **Framework:** Vite (detectado automáticamente)
- [ ] **Build Command:** `npm run build` 
- [ ] **Output Directory:** `dist`
- [ ] **Install Command:** `npm install`

## 🚨 Errores Comunes a Evitar

### ❌ Error 1: Variables de entorno faltantes
**Síntoma:** Página carga pero no funciona la autenticación
**Solución:** Revisar que las 3 variables estén añadidas

### ❌ Error 2: Build fallido
**Síntoma:** Deploy se cancela con error rojo
**Solución:** Verificar que package.json y dependencias estén bien

### ❌ Error 3: Dominio no funciona
**Síntoma:** URL de Vercel funciona pero ugt.towa.cat no
**Solución:** Necesitamos configurar DNS después del deploy

## 🎯 Resultado Esperado
Al final tendrás:
- ✅ **URL temporal:** `https://ugt-towa-portal-xyz123.vercel.app`
- ✅ **Dominio final:** `https://ugt.towa.cat` (después de configurar DNS)
- ✅ **Funcionamiento completo:** Login, páginas, estilos
- ✅ **SEO optimizado:** Meta tags, robots.txt, sitemap.xml

## 📞 ¿Qué Hacer si Algo Falla?
1. **No hay deploy:** Envíame el error de Vercel
2. **Deploy pero no funciona:** Envíame la URL y el error en consola (F12)
3. **Build falla:** Revisa que las variables de entorno estén bien
4. **Todo parece bien pero algo está mal:** Describe exactamente qué no funciona

## 🚀 Comando de Emergencia
Si el deploy falla, puedes usar este comando local para probar:
```bash
cd ugt-towa-portal
npm install
npm run build
npm run preview
```

**¿Ya tienes todo listo para hacer el deploy?**
