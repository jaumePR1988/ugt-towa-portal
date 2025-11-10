#!/bin/bash

# 🎯 SCRIPT DE VERIFICACIÓN PRE-DEPLOY UGT TOWA
# Ejecuta este script para verificar que todo está listo antes del deploy

echo "🔍 VERIFICANDO CONFIGURACIÓN PARA DEPLOY EN VERCEL..."
echo "=================================================="

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Función para verificar archivos
check_file() {
    if [ -f "$1" ]; then
        echo -e "${GREEN}✅ $1${NC} - OK"
        return 0
    else
        echo -e "${RED}❌ $1${NC} - FALTA"
        return 1
    fi
}

# Función para verificar directorios
check_directory() {
    if [ -d "$1" ]; then
        echo -e "${GREEN}✅ Directorio $1${NC} - OK"
        return 0
    else
        echo -e "${RED}❌ Directorio $1${NC} - FALTA"
        return 1
    fi
}

echo -e "${BLUE}📁 Verificando estructura del proyecto...${NC}"
echo ""

# Verificar archivos críticos
echo -e "${YELLOW}🔧 Archivos de configuración:${NC}"
check_file "package.json"
check_file "index.html"
check_file "vercel.json"
check_file "vite.config.ts"
check_file ".env.example"
echo ""

# Verificar directorios
echo -e "${YELLOW}📁 Directorios:${NC}"
check_directory "src"
check_directory "public"
check_directory "supabase"
echo ""

# Verificar archivos SEO
echo -e "${YELLOW}🔍 Archivos SEO para Google:${NC}"
check_file "public/robots.txt"
check_file "public/sitemap.xml"
echo ""

# Verificar configuración de Supabase
echo -e "${YELLOW}🗄️ Configuración de base de datos:${NC}"
if grep -q "VITE_SUPABASE_URL" .env.example 2>/dev/null; then
    echo -e "${GREEN}✅ Configuración Supabase${NC} - OK"
else
    echo -e "${RED}❌ Configuración Supabase${NC} - Revisar .env.example"
fi
echo ""

# Verificar package.json
echo -e "${YELLOW}📦 Verificando package.json...${NC}"
if grep -q '"build"' package.json 2>/dev/null; then
    echo -e "${GREEN}✅ Script build${NC} - OK"
else
    echo -e "${RED}❌ Script build${NC} - FALTA"
fi

if grep -q '"dev"' package.json 2>/dev/null; then
    echo -e "${GREEN}✅ Script dev${NC} - OK"
else
    echo -e "${RED}❌ Script dev${NC} - FALTA"
fi

if grep -q '"preview"' package.json 2>/dev/null; then
    echo -e "${GREEN}✅ Script preview${NC} - OK"
else
    echo -e "${RED}❌ Script preview${NC} - FALTA"
fi
echo ""

# Verificar index.html
echo -e "${YELLOW}🏷️ Verificando index.html...${NC}"
if grep -q '<title>' index.html 2>/dev/null; then
    echo -e "${GREEN}✅ Título de página${NC} - OK"
else
    echo -e "${RED}❌ Título de página${NC} - FALTA"
fi

if grep -q 'meta name="description"' index.html 2>/dev/null; then
    echo -e "${GREEN}✅ Meta descripción${NC} - OK"
else
    echo -e "${RED}❌ Meta descripción${NC} - FALTA"
fi

if grep -q 'meta name="robots"' index.html 2>/dev/null; then
    echo -e "${GREEN}✅ Meta robots${NC} - OK"
else
    echo -e "${RED}❌ Meta robots${NC} - FALTA"
fi
echo ""

# Verificar contenido de public/
echo -e "${YELLOW}🖼️ Verificando archivos públicos...${NC}"
if ls public/*.txt 1> /dev/null 2>&1; then
    echo -e "${GREEN}✅ Archivos de texto${NC} - $(ls public/*.txt | wc -l) archivos"
else
    echo -e "${YELLOW}⚠️  Archivos de texto${NC} - No encontrados"
fi

if ls public/*.jpg 1> /dev/null 2>&1; then
    echo -e "${GREEN}✅ Imágenes${NC} - $(ls public/*.jpg | wc -l) imágenes"
else
    echo -e "${YELLOW}⚠️  Imágenes${NC} - No encontradas"
fi
echo ""

# Resumen final
echo -e "${BLUE}📊 RESUMEN DE VERIFICACIÓN${NC}"
echo "=================================================="

ERRORS=0

# Contar errores
if [ ! -f "package.json" ]; then ((ERRORS++)); fi
if [ ! -f "index.html" ]; then ((ERRORS++)); fi
if [ ! -f "vercel.json" ]; then ((ERRORS++)); fi
if [ ! -f "public/robots.txt" ]; then ((ERRORS++)); fi
if [ ! -f "public/sitemap.xml" ]; then ((ERRORS++)); fi

if [ $ERRORS -eq 0 ]; then
    echo -e "${GREEN}🎉 ¡PERFECTO! Tu proyecto está listo para deploy en Vercel${NC}"
    echo ""
    echo -e "${BLUE}📋 PRÓXIMOS PASOS:${NC}"
    echo "1. Sube el proyecto a GitHub (si no lo has hecho)"
    echo "2. Ve a https://vercel.com/dashboard"
    echo "3. Click 'New Project' → 'Import Git Repository'"
    echo "4. Selecciona tu repositorio: ugt-towa-portal"
    echo "5. Click 'Import' y espera 2-3 minutos"
    echo "6. ¡Tu portal estará en https://ugt.towa.cat!"
    echo ""
    echo -e "${YELLOW}⚠️  IMPORTANTE:${NC}"
    echo "- Asegúrate de que tu repositorio en GitHub es PÚBLICO"
    echo "- Configura las variables de entorno en Vercel si es necesario"
    echo "- Añade tu archivo de verificación Google a public/ después del deploy"
    echo ""
else
    echo -e "${RED}❌ Se encontraron $ERRORS errores críticos${NC}"
    echo ""
    echo -e "${YELLOW}🔧 DEBES SOLUCIONAR ESTOS PROBLEMAS:${NC}"
    
    if [ ! -f "package.json" ]; then
        echo "- Crear package.json con scripts de build"
    fi
    if [ ! -f "index.html" ]; then
        echo "- Crear index.html optimizado para SEO"
    fi
    if [ ! -f "vercel.json" ]; then
        echo "- Crear vercel.json para configuración de deploy"
    fi
    if [ ! -f "public/robots.txt" ]; then
        echo "- Crear public/robots.txt para Google"
    fi
    if [ ! -f "public/sitemap.xml" ]; then
        echo "- Crear public/sitemap.xml para indexación"
    fi
    
    echo ""
    echo -e "${BLUE}💡 TIP:${NC} Re-ejecuta este script después de solucionar los errores"
fi

echo ""
echo -e "${BLUE}📞 SOPORTE:${NC} Si tienes problemas, consulta las guías de deploy en el workspace"
echo "=================================================="