#!/bin/bash
# Script de verificación rápida PWA
# Ejecuta después de aplicar las correcciones

echo "🔧 VERIFICACIÓN RÁPIDA - BOTÓN PWA UGT-TOWA"
echo "=========================================="

# Verificar archivos corregidos
echo ""
echo "1️⃣ Verificando archivos corregidos..."

FILES=(
    "usePWA_Inteligente.ts"
    "PWAInstallPrompt_Inteligente.tsx"
    "PWA_DIAGNOSTIC_TOOL.js"
    "PWA_INSTALL_BUTTON_FIX_REPORT.md"
)

for file in "${FILES[@]}"; do
    if [ -f "/workspace/$file" ]; then
        echo "✅ $file encontrado"
    else
        echo "❌ $file NO encontrado"
    fi
done

# Verificar copias en directorios de proyecto
echo ""
echo "2️⃣ Verificando copias en proyectos..."

PROJECTS=(
    "ugt-towa-npm-fixed"
    "deploy-work/ugt-towa-portal-limpio-github-final"
)

for project in "${PROJECTS[@]}"; do
    if [ -d "/workspace/$project/src/hooks" ]; then
        if [ -f "/workspace/$project/src/hooks/usePWA_Inteligente.ts" ]; then
            echo "✅ Hook en $project"
        else
            echo "❌ Hook NO en $project"
        fi
    fi
    
    if [ -d "/workspace/$project/src/components" ]; then
        if [ -f "/workspace/$project/src/components/PWAInstallPrompt_Inteligente.tsx" ]; then
            echo "✅ Componente en $project"
        else
            echo "❌ Componente NO en $project"
        fi
    fi
done

echo ""
echo "3️⃣ Verificando manifest.json..."
if [ -f "/workspace/ugt-towa-portal/public/manifest.json" ]; then
    echo "✅ manifest.json encontrado"
    
    # Verificar campos críticos
    if grep -q '"name"' "/workspace/ugt-towa-portal/public/manifest.json"; then
        echo "✅ Campo 'name' presente"
    fi
    
    if grep -q '"start_url"' "/workspace/ugt-towa-portal/public/manifest.json"; then
        echo "✅ Campo 'start_url' presente"
    fi
    
    if grep -q '"display"' "/workspace/ugt-towa-portal/public/manifest.json"; then
        echo "✅ Campo 'display' presente"
    fi
else
    echo "❌ manifest.json NO encontrado"
fi

echo ""
echo "4️⃣ Verificando index.html..."
if [ -f "/workspace/ugt-towa-portal/index.html" ]; then
    if grep -q 'manifest.json' "/workspace/ugt-towa-portal/index.html"; then
        echo "✅ Manifest referenciado en index.html"
    else
        echo "❌ Manifest NO referenciado en index.html"
    fi
else
    echo "❌ index.html NO encontrado"
fi

echo ""
echo "🎯 PRÓXIMOS PASOS:"
echo "=================="
echo "1. Abrir proyecto en navegador"
echo "2. Abrir consola (F12)"
echo "3. Ejecutar: window.runPWADiagnostic()"
echo "4. Verificar que aparecen logs de inicialización"
echo "5. Probar botón de instalación"
echo "6. Ver logs en consola"

echo ""
echo "📋 HERRAMIENTAS DISPONIBLES:"
echo "============================"
echo "- window.runPWADiagnostic()     # Diagnóstico completo"
echo "- window.clearPWAData()         # Limpiar datos PWA"
echo "- window.forcePWAReset()        # Forzar reinicio PWA"
echo "- window.testManualInstall()    # Probar instalación manual"

echo ""
echo "✅ VERIFICACIÓN COMPLETADA"
echo "=========================="
echo "Si todas las verificaciones son ✅, las correcciones están aplicadas."
echo "Si alguna es ❌, revisar el archivo correspondiente."