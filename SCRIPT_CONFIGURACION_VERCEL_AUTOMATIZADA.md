# 🚀 SCRIPT DE CONFIGURACIÓN AUTOMATIZADA - VERCEL UGT-TOWA

## 📋 ESTADO ACTUAL DEL REPOSITORIO

```bash
# Verificar estado del repositorio GitHub
git status
```

**✅ ESTADO CONFIRMADO:**
- Repositorio sincronizado con origin/master
- Todas las configuraciones de Vite y React en su lugar
- Archivo `vercel.json` configurado correctamente
- Dependencias actualizadas en package.json

---

## 🤖 SCRIPT DE CONFIGURACIÓN AUTOMATIZADA

### Crear Script de Deploy Automatizado

```bash
#!/bin/bash

# SCRIPT_DEPLOY_VERCEL.sh - Automatización completa para Vercel
echo "🚀 INICIANDO CONFIGURACIÓN AUTOMATIZADA VERCEL UGT-TOWA"
echo "======================================================"

# 1. Verificar estructura del proyecto
echo "📁 Verificando estructura del proyecto..."
if [ ! -f "vercel.json" ]; then
    echo "❌ ERROR: vercel.json no encontrado"
    exit 1
fi

if [ ! -f "package.json" ]; then
    echo "❌ ERROR: package.json no encontrado"
    exit 1
fi

echo "✅ Estructura verificada"

# 2. Configurar variables de entorno locales
echo "🔧 Configurando variables de entorno..."

# Crear archivo .env.local si no existe
if [ ! -f ".env.local" ]; then
    cat > .env.local << EOL
# Variables de entorno UGT-TOWA Portal
VITE_SUPABASE_URL=https://zaxdscclkeytakcowgww.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpheGRzY2Nsa2V5dGFrY293Z3d3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIwMTUxMTIsImV4cCI6MjA3NzU5MTExMn0.MQMePYqEhW9xhCipC-MeU8Z_dXqvyBKH5e0vtgaS9xQ
VITE_CONTACT_EMAIL=jpedragosa@towapharmaceutical.com
VITE_CONTACT_PHONE=629931957
VITE_APP_URL=https://ugt.towa.cat
EOL
    echo "✅ Archivo .env.local creado"
else
    echo "⚠️  .env.local ya existe, saltando creación"
fi

# 3. Ejecutar build local para verificar
echo "🔨 Ejecutando build de prueba..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build local exitoso"
else
    echo "❌ ERROR: Build local falló"
    exit 1
fi

# 4. Verificar archivos PWA
echo "📱 Verificando archivos PWA..."
if [ -f "public/manifest.json" ] && [ -f "public/sw.js" ]; then
    echo "✅ Archivos PWA verificados"
else
    echo "❌ ERROR: Archivos PWA faltantes"
    exit 1
fi

echo "🎉 ¡CONFIGURACIÓN LOCAL COMPLETADA!"
echo "📋 PRÓXIMOS PASOS:"
echo "1. Subir a GitHub (git push)"
echo "2. Conectar proyecto en Vercel.com"
echo "3. Configurar variables de entorno en Vercel"
echo "4. Deploy automático"
```

---

## 🔧 COMANDOS PARA EJECUTAR AUTOMATIZACIÓN

### 1. Ejecutar Script de Configuración
```bash
chmod +x SCRIPT_DEPLOY_VERCEL.sh
./SCRIPT_DEPLOY_VERCEL.sh
```

### 2. Verificar Estado Final
```bash
# Verificar que todo esté listo
npm run build
echo "✅ Build verificado"

# Verificar PWA
ls -la public/manifest.json public/sw.js
echo "✅ PWA verificada"

# Estado final del proyecto
git status
echo "✅ Git estado verificado"
```

---

## 📦 CONFIGURACIÓN EN VERCEL DASHBOARD

### Variables de Entorno a Configurar
| Nombre | Valor | Entorno |
|--------|-------|---------|
| `VITE_SUPABASE_URL` | `https://zaxdscclkeytakcowgww.supabase.co` | Production, Preview, Development |
| `VITE_SUPABASE_ANON_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpheGRzY2Nsa2V5dGFrY293Z3d3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIwMTUxMTIsImV4cCI6MjA3NzU5MTExMn0.MQMePYqEhW9xhCipC-MeU8Z_dXqvyBKH5e0vtgaS9xQ` | Production, Preview, Development |
| `VITE_CONTACT_EMAIL` | `jpedragosa@towapharmaceutical.com` | Production, Preview, Development |
| `VITE_CONTACT_PHONE` | `629931957` | Production, Preview, Development |
| `VITE_APP_URL` | `https://ugt.towa.cat` | Production, Preview, Development |

---

## ⚡ CONFIGURACIÓN AUTOMÁTICA CON VERCEL CLI

### Instalar Vercel CLI (Opcional)
```bash
npm install -g vercel
```

### Deploy Automático
```bash
# Login en Vercel
vercel login

# Deploy desde directorio
vercel --prod

# Configurar proyecto
vercel --prod --confirm
```

---

## 🎯 VERIFICACIÓN AUTOMATIZADA POST-DEPLOY

### Script de Verificación
```bash
#!/bin/bash

echo "🔍 VERIFICACIÓN POST-DEPLOY UGT-TOWA"
echo "=================================="

# URL base del proyecto
BASE_URL="https://ugt.towa.cat"

# Verificar que la página carga
echo "🌐 Verificando carga de página..."
curl -I "$BASE_URL" > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo "✅ Página principal carga correctamente"
else
    echo "❌ ERROR: Página principal no carga"
fi

# Verificar PWA
echo "📱 Verificando PWA..."
if curl -s "$BASE_URL/manifest.json" | grep -q "name"; then
    echo "✅ Manifest PWA detectado"
else
    echo "❌ ERROR: Manifest PWA no encontrado"
fi

# Verificar Service Worker
echo "⚡ Verificando Service Worker..."
if curl -s "$BASE_URL/sw.js" | grep -q "install"; then
    echo "✅ Service Worker detectado"
else
    echo "❌ ERROR: Service Worker no encontrado"
fi

# Verificar sitemap
echo "🗺️  Verificando sitemap..."
if curl -s "$BASE_URL/sitemap.xml" | grep -q "urlset"; then
    echo "✅ Sitemap XML detectado"
else
    echo "⚠️  Sitemap XML no encontrado"
fi

echo "🎉 VERIFICACIÓN COMPLETADA"
```

---

## 🚨 COMANDOS DE EMERGENCIA

### Redeploy Rápido
```bash
# Via Git
git add . && git commit -m "redeploy: quick fix" && git push

# Via Vercel CLI
vercel --prod
```

### Rollback a Deploy Anterior
1. Ve a Vercel Dashboard
2. Tab "Deployments"
3. Selecciona deploy anterior
4. Click "Promote to Production"

### Ver Logs en Tiempo Real
```bash
# Via Vercel CLI
vercel logs [deployment-url]
```

---

## 📊 MÉTRICAS Y MONITOREO

### URLs de Monitoreo
- **Dashboard Principal:** https://vercel.com/dashboard
- **Proyecto UGT-TOWA:** https://vercel.com/dashboard/projects/[project-id]
- **Deployments:** https://vercel.com/dashboard/deployments
- **Analytics:** https://vercel.com/analytics

### Comandos de Estado
```bash
# Ver estado del proyecto
vercel ls

# Ver deploys recientes
vercel list

# Ver logs
vercel logs

# Ver estado de build
vercel inspect [deployment-url]
```

---

**🎯 ¡SCRIPT LISTO PARA AUTOMATIZAR TODO EL PROCESO!**