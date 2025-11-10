#!/bin/bash

# Script para actualizar sitemap automáticamente
# Uso: ./update-sitemap.sh

echo "🔄 Actualizando sitemap para UGT Towa..."

# Verificar si estamos en el directorio correcto
if [ ! -f "package.json" ]; then
    echo "❌ Error: Ejecuta este script desde el directorio ugt-towa-portal"
    exit 1
fi

# Verificar si existe Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Error: Node.js no está instalado"
    exit 1
fi

# Verificar variables de entorno
if [ -z "$SUPABASE_SERVICE_ROLE_KEY" ]; then
    echo "❌ Error: SUPABASE_SERVICE_ROLE_KEY no está configurada"
    echo "💡 Configúrala con: export SUPABASE_SERVICE_ROLE_KEY='tu_clave'"
    exit 1
fi

# Instalar dependencias si no existen
if [ ! -d "node_modules" ]; then
    echo "📦 Instalando dependencias..."
    npm install @supabase/supabase-js
fi

# Generar nuevo sitemap
echo "🌐 Generando sitemap.xml..."
node generate-sitemap.js

if [ $? -eq 0 ]; then
    echo "✅ Sitemap actualizado exitosamente"
    echo "📊 Revisa el nuevo sitemap en: public/sitemap.xml"
    echo ""
    echo "🔄 Para aplicar cambios:"
    echo "1. Despliega la aplicación: npm run build"
    echo "2. El sitemap estará disponible en: https://ugt.towa.cat/sitemap.xml"
    echo ""
    echo "📋 No olvides:"
    echo "- Verificar en Google Search Console"
    echo "- Enviar sitemap actualizado"
    echo "- Revisar páginas indexadas"
else
    echo "❌ Error generando sitemap"
    exit 1
fi

echo "🎉 ¡Listo para indexación en Google!"