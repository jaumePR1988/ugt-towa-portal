#!/bin/bash
# Script de Despliegue Automatizado para Vercel
# Portal UGT-TOWA

set -e

echo "==================================="
echo "Portal UGT-TOWA - Despliegue Vercel"
echo "==================================="
echo ""

# Verificar que estamos en el directorio correcto
if [ ! -f "package.json" ]; then
    echo "ERROR: Este script debe ejecutarse desde /workspace/ugt-towa-portal"
    exit 1
fi

# Verificar que el build existe
if [ ! -d "dist" ]; then
    echo "Build no encontrado. Ejecutando build..."
    pnpm build
fi

echo "✓ Build verificado"
echo ""

# Configurar variables de entorno para Vercel
echo "Configurando variables de entorno..."
cat > .env.production << 'EOF'
VITE_SUPABASE_URL=https://zaxdscclkeytakcowgww.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpheGRzY2Nsa2V5dGFrY293Z3d3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIwMTUxMTIsImV4cCI6MjA3NzU5MTExMn0.MQMePYqEhW9xhCipC-MeU8Z_dXqvyBKH5e0vtgaS9xQ
EOF

echo "✓ Variables de entorno configuradas"
echo ""

echo "======================================"
echo "IMPORTANTE: Ejecuta estos comandos"
echo "======================================"
echo ""
echo "1. Login en Vercel:"
echo "   npx vercel login"
echo ""
echo "2. Desplegar en Vercel:"
echo "   npx vercel --name ugt-towa --prod"
echo ""
echo "3. Cuando Vercel te pida configuración:"
echo "   - Set up and deploy? YES"
echo "   - Which scope? [Tu cuenta]"
echo "   - Link to existing project? NO"
echo "   - What's your project's name? ugt-towa"
echo "   - In which directory is your code located? ./"
echo "   - Want to override the settings? NO"
echo ""
echo "4. Después del despliegue, configura las variables de entorno:"
echo "   Ve a: https://vercel.com/dashboard"
echo "   → Tu proyecto 'ugt-towa'"
echo "   → Settings → Environment Variables"
echo "   → Añade las 2 variables del archivo .env.production"
echo ""
echo "5. Redesplegar con variables:"
echo "   npx vercel --prod"
echo ""
echo "======================================"
echo "Resultado esperado: https://ugt-towa.vercel.app"
echo "======================================"
