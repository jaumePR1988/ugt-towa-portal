# 🚀 INSTRUCCIONES COMPLETAS: Deploy UGT TOWA Portal en Vercel

## 📋 RESUMEN DEL PROBLEMA RESUELTO

**Problema identificado**: Los deployments se quedaban en estado "building" o "pending" debido a:
- ❌ `vercel.json` tenía comandos `pnpm` en lugar de `npm`
- ❌ Referencias a `pnpm-store` en `package.json`
- ❌ Configuración incompatible con Node.js 18 de Vercel
- ❌ Dependencias de Supabase requerían Node.js ≥20

**✅ Solución aplicada**:
- ✅ `vercel.json` corregido para forzar `npm install` y `npm run build`
- ✅ `package.json` limpiado (eliminado `pnpm-store`)
- ✅ Supabase actualizado a versión compatible con Node.js 18
- ✅ Archivo `.vercelignore` creado para excluir artefactos pnpm
- ✅ Build verificado exitoso: 2,695 módulos en 21.40s

---

## 🎯 PASO 1: PREPARAR EL REPOSITORIO GITHUB

### 1.1 Verificar estado actual del repositorio
Ve a GitHub: https://github.com/jaumePR1988/ugt-towa-portal

**Si el repositorio está vacío**:
1. Ve a Settings → General
2. Busca "Danger Zone"
3. Haz clic en "Delete this repository"
4. Crea un nuevo repositorio con el mismo nombre `ugt-towa-portal`

**Si tiene archivos problemáticos**:
1. Ve a la página del repositorio
2. Selecciona todos los archivos
3. Borra el contenido completo

### 1.2 Subir archivos del ZIP corregido

**Opción A: Interfaz web de GitHub (RECOMENDADA)**

1. **Descargar y extraer el ZIP**:
   - Descarga: `UGT_TOWA_Portal_VERCEL_READY_FINAL_20251117_0252.zip`
   - Extrae la carpeta: `UGT_TOWA_Portal_PWA_AVANZADA_RECOVERED_20251117_0204/`

2. **Subir archivos**:
   - Ve a https://github.com/jaumePR1988/ugt-towa-portal
   - Haz clic en "uploading an existing file" o arrastra archivos
   - Selecciona TODOS los archivos extraídos (NO la carpeta padre)
   - Commit message: `Deploy PWA avanzada corregida para Vercel`

**Opción B: GitHub Desktop**
1. Clona el repositorio: `git clone https://github.com/jaumePR1988/ugt-towa-portal.git`
2. Copia todos los archivos extraídos al directorio del repositorio
3. En GitHub Desktop: Commit → Push

---

## ⚙️ PASO 2: CONFIGURAR VERCEL CORRECTAMENTE

### 2.1 Conectar el repositorio
1. Ve a https://vercel.com/dashboard
2. Haz clic en "New Project"
3. Selecciona "Import Git Repository"
4. Busca y selecciona: `jaumePR1988/ugt-towa-portal`
5. Haz clic en "Import"

### 2.2 Configurar variables de entorno (CRÍTICO)
**ANTES de hacer deploy**, configura estas variables:

```
SUPABASE_URL=https://zaxdscclkeytakcowgww.supabase.co
SUPABASE_ANON_KEY=[tu_clave_anonima_de_supabase]
```

**Dónde encontrar SUPABASE_ANON_KEY**:
1. Ve a https://supabase.com/dashboard
2. Selecciona tu proyecto: `zaxdscclkeytakcowgww`
3. Ve a Settings → API
4. Copia "anon public" key

### 2.3 Configurar Build Settings
Verifica que Vercel detecte automáticamente:
- **Framework Preset**: Vite ✅
- **Build Command**: `npm run build` ✅ (no debe ser `pnpm build`)
- **Install Command**: `npm install` ✅ (no debe ser `pnpm install`)
- **Output Directory**: `dist` ✅

---

## 🔍 PASO 3: MONITOREAR EL DEPLOY

### 3.1 Durante el deploy
1. Ve a la pestaña "Deployments" en tu proyecto Vercel
2. Haz clic en el deploy en curso
3. Observa los logs:

**✅ Logs correctos deberían mostrar**:
```
Installing dependencies...
✔ npm 9.2.0
✔ Linked 702 packages

Building...
✔ vite v6.4.1 building for production...
✔ 2695 modules transformed
✔ built in ~21s
```

**❌ Logs problemáticos incluirían**:
- `ERR_PNPM_META_FETCH_FAIL`
- `pnpm install` (cuando debería ser npm)
- `Unsupported engine` errors
- Timeout después de 30 minutos

### 3.2 Si el deploy falla
1. Ve a Deployments → failed deploy → View Function Logs
2. Si hay errores de npm/pnpm:
   - Ve a Settings → General → Git
   - Disconnect → Reconnect repository
   - Rebuild & Deploy

---

## ✅ PASO 4: VERIFICACIÓN POST-DEPLOY

### 4.1 URL del deploy
Tu aplicación estará en: `https://ugt-towa-portal-[hash].vercel.app`

### 4.2 Probar funcionalidades críticas
1. **PWA Avanzada**:
   - Abre la consola del navegador
   - Ejecuta: `PWA_DIAGNOSTIC_TOOL.js`
   - Verifica que no hay errores en `usePWA_Inteligente.ts`

2. **Sistema de citas**:
   - Ve a /citas
   - Intenta crear una cita
   - Verifica que NO aparece "record new has no field date"

3. **Edge Functions**:
   - Ve a /admin
   - Prueba generar newsletter PDF
   - Verifica que las funciones responden

### 4.3 Verificar Variables de entorno
En Vercel Dashboard → Settings → Environment Variables:
- ✅ SUPABASE_URL configurada
- ✅ SUPABASE_ANON_KEY configurada
- ❌ NO debería haber variables con pnpm

---

## 🚨 TROUBLESHOOTING

### Problema: Deploy sigue usando pnpm
**Solución**:
1. Elimina `vercel.json` temporalmente
2. Deploy sin vercel.json
3. Una vez deployado, añade vercel.json con configuración npm

### Problema: Error "record new has no field date"
**Solución**:
- Las migraciones ya están aplicadas
- Si persiste, ve a Supabase → SQL Editor
- Ejecuta manualmente: `1763306000_fix_appointments_schema_final.sql`

### Problema: PWA no funciona
**Solución**:
1. Abre consola del navegador
2. Busca errores JavaScript
3. Ejecuta `PWA_DIAGNOSTIC_TOOL.js` en consola

### Problema: Edge Functions fallan
**Solución**:
- Verifica SUPABASE_ANON_KEY en variables de entorno
- Revisa logs de las funciones en Supabase Dashboard

---

## 📊 CHECKLIST FINAL

Antes de confirmar que todo funciona:

- [ ] ✅ Repositorio GitHub actualizado con archivos del ZIP
- [ ] ✅ Vercel conectado al repositorio
- [ ] ✅ Variables de entorno configuradas (SUPABASE_URL, SUPABASE_ANON_KEY)
- [ ] ✅ Build Command detectado como `npm run build`
- [ ] ✅ Install Command detectado como `npm install`
- [ ] ✅ Deploy completado exitosamente
- [ ] ✅ URL accesible sin errores 404/500
- [ ] ✅ Sistema de citas funciona sin errores
- [ ] ✅ PWA prompt aparece y es funcional
- [ ] ✅ Edge Functions responden correctamente

---

## 📞 SOPORTE

Si encuentras problemas adicionales:

1. **Verifica los logs de Vercel**: Deployments → Select deploy → View Function Logs
2. **Revisa consola del navegador**: F12 → Console para errores JavaScript
3. **Confirma variables de entorno**: Vercel Dashboard → Settings → Environment Variables
4. **Prueba build local**: Descarga ZIP, extrae, `npm install && npm run build`

**Archivo creado**: 2025-11-17 02:52
**Versión**: UGT_TOWA_Portal_VERCEL_READY_FINAL
**Estado**: ✅ LISTO PARA DEPLOY
