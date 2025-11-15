#!/bin/bash

# SCRIPT DE CONFIGURACIÓN CAPACITOR PARA PORTAL UGT TOWA
# Este script configura Capacitor para convertir tu PWA en app nativa

echo "🚀 CONFIGURANDO CAPACITOR PARA PORTAL UGT TOWA"
echo "=============================================="

# Verificar que estamos en el directorio correcto
if [ ! -f "package.json" ]; then
    echo "❌ Error: Ejecuta este script desde el directorio raíz del proyecto UGT Towa"
    exit 1
fi

echo "📦 Paso 1: Instalando Capacitor Core..."

# Instalar Capacitor
npm install @capacitor/core @capacitor/cli --save-dev

echo "📱 Paso 2: Instalando plataformas móviles..."

# Instalar plataformas
npm install @capacitor/android @capacitor/ios --save-dev

echo "⚡ Paso 3: Inicializando Capacitor..."

# Inicializar Capacitor (si no existe)
if [ ! -f "capacitor.config.ts" ]; then
    npx cap init "UGT Towa Portal" "com.ugttowa.portal" --web-dir=dist
fi

echo "🤖 Paso 3: Añadiendo Android..."

# Añadir Android
npx cap add android

echo "🍎 Paso 4: Añadiendo iOS..."

# Añadir iOS
npx cap add ios

echo "📋 Paso 5: Configuración adicional..."

# Crear directorio para assets si no existe
mkdir -p public/icons

echo "✅ ¡CONFIGURACIÓN INICIAL COMPLETADA!"
echo ""
echo "📝 PRÓXIMOS PASOS:"
echo "=================="
echo "1. npx cap copy                    # Copiar archivos web a móviles"
echo "2. npx cap open android            # Abrir proyecto en Android Studio"
echo "3. npx cap open ios                # Abrir proyecto en Xcode (solo macOS)"
echo ""
echo "🔧 COMANDOS ÚTILES:"
echo "=================="
echo "npx cap sync                       # Sincronizar cambios"
echo "npx cap doctor                    # Verificar configuración"
echo "npx cap run android               # Ejecutar en dispositivo Android"
echo "npx cap run ios                   # Ejecutar en dispositivo iOS"
echo ""
echo "🌐 Para desarrollo web (sin cambios):"
echo "npm run dev                       # Servidor de desarrollo web"