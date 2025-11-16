# Comandos de Verificación para UGT Towa Portal

**Fecha:** 17 de noviembre de 2025  
**Propósito:** Guía para futuras verificaciones y mantenimiento

---

## 🚀 COMANDOS ESENCIALES PARA VERIFICACIÓN

### 1. Compilación y Build
```bash
# Build de producción
cd /workspace/ugt-towa-portal
npm run build

# Verificación de tipos sin compilar
npx tsc --noEmit

# Servidor de desarrollo
npm run dev
```

### 2. Verificación de PWA
```bash
# Verificar que el manifest esté presente
curl -I http://localhost:5173/manifest.json

# Verificar service worker
curl -I http://localhost:5173/sw.js

# Verificar iconos PWA
curl -I http://localhost:5173/ugt-towa-icon-192.png
```

### 3. Linting y Formato
```bash
# Linting ESLint
npm run lint

# Formateo con Prettier (si está configurado)
npm run format
```

---

## 🔍 VERIFICACIONES AUTOMÁTICAS

### Checklist de Verificación Rápida

```bash
#!/bin/bash
# Script de verificación rápida

echo "🔍 Iniciando verificación UGT Towa Portal..."

# 1. Verificar compilación
echo "📦 Verificando compilación..."
cd /workspace/ugt-towa-portal
npm run build > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo "✅ Build exitoso"
else
    echo "❌ Error en build"
    exit 1
fi

# 2. Verificar tipos TypeScript
echo "🔤 Verificando tipos TypeScript..."
npx tsc --noEmit > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo "✅ Tipos correctos"
else
    echo "❌ Error en tipos"
    exit 1
fi

# 3. Verificar archivos PWA
echo "📱 Verificando archivos PWA..."
if [ -f "public/manifest.json" ]; then
    echo "✅ Manifest.json presente"
else
    echo "❌ Manifest.json faltante"
fi

if [ -f "public/sw.js" ]; then
    echo "✅ Service Worker presente"
else
    echo "❌ Service Worker faltante"
fi

# 4. Verificar hooks PWA
echo "🎣 Verificando hooks PWA..."
if [ -f "src/hooks/usePWA_Inteligente.ts" ]; then
    echo "✅ Hook PWA inteligente presente"
else
    echo "❌ Hook PWA inteligente faltante"
fi

if [ ! -f "src/hooks/usePWA.ts" ]; then
    echo "✅ Hook PWA obsoleto eliminado"
else
    echo "❌ Hook PWA obsoleto aún presente"
fi

echo "🎉 Verificación completada"
```

### Script de Verificación Completa

```bash
#!/bin/bash
# Script de verificación completa

echo "🔍 VERIFICACIÓN COMPLETA UGT Towa Portal"
echo "========================================="

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

cd /workspace/ugt-towa-portal

echo -e "\n📦 1. VERIFICANDO COMPILACIÓN..."
npm run build > build.log 2>&1
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Build exitoso${NC}"
    echo "   Tamaño del bundle:"
    du -sh dist/
else
    echo -e "${RED}❌ Error en build${NC}"
    tail -10 build.log
fi

echo -e "\n🔤 2. VERIFICANDO TIPOS TYPESCRIPT..."
npx tsc --noEmit > types.log 2>&1
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Tipos correctos${NC}"
else
    echo -e "${RED}❌ Error en tipos${NC}"
    cat types.log
fi

echo -e "\n📱 3. VERIFICANDO PWA..."
# Verificar archivos PWA
files=("public/manifest.json" "public/sw.js" "public/ugt-towa-icon-192.png" "public/ugt-towa-icon-512.png")
for file in "${files[@]}"; do
    if [ -f "$file" ]; then
        echo -e "${GREEN}✅ $file${NC}"
    else
        echo -e "${RED}❌ $file faltante${NC}"
    fi
done

echo -e "\n🎣 4. VERIFICANDO HOOKS Y COMPONENTES..."
# Verificar hooks PWA
if [ ! -f "src/hooks/usePWA.ts" ] && [ ! -f "src/hooks/usePWA.ts.backup.20251116_094734" ]; then
    echo -e "${GREEN}✅ Hooks PWA obsoletos eliminados${NC}"
else
    echo -e "${RED}❌ Hooks PWA obsoletos presentes${NC}"
fi

if [ -f "src/hooks/usePWA_Inteligente.ts" ]; then
    echo -e "${GREEN}✅ Hook PWA inteligente presente${NC}"
else
    echo -e "${RED}❌ Hook PWA inteligente faltante${NC}"
fi

echo -e "\n🗄️ 5. VERIFICANDO ESQUEMA BD..."
# Verificar archivos de esquema
if [ -f "src/lib/supabase.ts" ]; then
    echo -e "${GREEN}✅ Tipos Supabase presentes${NC}"
    # Verificar interfaces de citas
    grep -q "Appointment" src/lib/supabase.ts && echo -e "${GREEN}✅ Interface Appointment presente${NC}"
    grep -q "AppointmentSlot" src/lib/supabase.ts && echo -e "${GREEN}✅ Interface AppointmentSlot presente${NC}"
else
    echo -e "${RED}❌ Tipos Supabase faltantes${NC}"
fi

echo -e "\n🧭 6. VERIFICANDO NAVEGACIÓN..."
if [ -f "src/components/Navbar.tsx" ]; then
    echo -e "${GREEN}✅ Navbar presente${NC}"
else
    echo -e "${RED}❌ Navbar faltante${NC}"
fi

echo -e "\n📋 7. RESUMEN DE ERRORES..."
error_count=$(grep -c "error" build.log types.log 2>/dev/null || echo "0")
if [ "$error_count" -eq "0" ]; then
    echo -e "${GREEN}✅ Sin errores detectados${NC}"
else
    echo -e "${RED}⚠️  $error_count errores detectados${NC}"
fi

echo -e "\n🎉 Verificación completa"
```

---

## 📋 CHECKLIST DE VERIFICACIÓN MANUAL

### Antes de Deploy
- [ ] Ejecutar build de producción
- [ ] Verificar que no hay errores TypeScript
- [ ] Comprobar manifest.json
- [ ] Verificar service worker
- [ ] Probar instalación PWA
- [ ] Verificar iconos PWA
- [ ] Comprobar navegación móvil
- [ ] Probar sistema de citas

### Después de Actualizaciones
- [ ] Verificar esquema de BD
- [ ] Comprobar que no hay imports rotos
- [ ] Verificar hooks PWA
- [ ] Comprobar políticas RLS
- [ ] Verificar triggers de BD
- [ ] Probar funcionalidad PWA

---

## 🛠️ COMANDOS ÚTILES DE DESARROLLO

### Análisis de Bundle
```bash
# Analizar tamaño del bundle
npx vite-bundle-analyzer dist

# Ver chunks generados
ls -la dist/assets/

# Verificar gzip sizes
gzip -t dist/assets/*.js
```

### Debug de PWA
```bash
# Verificar registro de Service Worker
# En DevTools > Application > Service Workers

# Verificar manifest
# En DevTools > Application > Manifest

# Verificar cache
# En DevTools > Application > Cache Storage
```

### Verificación de BD
```bash
# Conectar a Supabase (si tienes CLI)
supabase db reset

# Verificar migraciones
supabase migration list

# Aplicar migraciones
supabase db push
```

---

## 🚨 COMANDOS DE EMERGENCIA

### Rollback de Changes
```bash
# Si algo sale mal, restaurar desde backup
git checkout HEAD~1

# Limpiar node_modules y reinstalar
rm -rf node_modules package-lock.json
npm install

# Limpiar cache de build
rm -rf dist
npm run build
```

### Reset Completo
```bash
# Reset completo del proyecto
cd /workspace/ugt-towa-portal
rm -rf node_modules dist .vite
npm install
npm run build
```

---

## 📞 SOPORTE Y TROUBLESHOOTING

### Problemas Comunes

#### Build falla con errores de memoria
```bash
# Aumentar límite de memoria Node.js
NODE_OPTIONS="--max-old-space-size=4096" npm run build
```

#### Service Worker no se registra
```bash
# Verificar que sw.js está en /public/
# Limpiar cache del navegador
# DevTools > Application > Clear Storage
```

#### PWA no se puede instalar
```bash
# Verificar manifest.json válido
# Verificar que start_url es correcto
# Verificar iconos presentes
```

#### Tipos TypeScript fallan
```bash
# Limpiar cache de TypeScript
rm -rf node_modules/.cache
npx tsc --build --clean
npm run build
```

---

## 📊 MÉTRICAS DE RENDIMIENTO

### Objetivos de Rendimiento
- **Build time:** < 20s ✅ (Actual: 14.85s)
- **Bundle size:** < 3MB ✅ (Actual: ~3MB)
- **First Load:** < 5s
- **Time to Interactive:** < 3s

### Herramientas de Monitoreo
```bash
# Lighthouse CI
npm install -g @lhci/cli
lhci autorun

# Web Vitals
npm install web-vitals
# Usar en la aplicación para medir métricas reales
```

---

**Documento actualizado:** 17 de noviembre de 2025  
**Versión:** 1.0  
**Mantenido por:** Sistema de Verificación Automática