#!/bin/bash

# Script para actualizar portal UGT-TOWA automáticamente
# Solo tienes que hacer doble click en este archivo

echo "🚀 Actualizando portal UGT-TOWA en Vercel..."
echo "=================================================="

# Verificar que estamos en la carpeta correcta
if [ ! -f "package.json" ]; then
    echo "❌ Error: No estamos en la carpeta del proyecto"
    echo "Por favor, ejecuta este script desde la carpeta ugt-towa-portal"
    pause
    exit 1
fi

echo "✅ Proyecto encontrado"

# Actualizar en Vercel
echo "🔄 Desplegando en Vercel..."
npx vercel --prod

echo ""
echo "=================================================="
echo "✅ ¡Portal actualizado!"
echo "URL: https://ugt-towa.vercel.app"
echo "=================================================="

pause