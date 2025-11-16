#!/bin/bash

echo "🚀 Iniciando deploy completo de UGT Towa Portal con Notificaciones Push..."

# 1. Limpiar y preparar directorio de trabajo
rm -rf /tmp/ugt-towa-portal 2>/dev/null || true
rm -rf /tmp/new-portal 2>/dev/null || true

# 2. Clonar repositorio
cd /tmp
echo "📥 Clonando repositorio GitHub..."
if git clone https://github.com/jaumePR1988/ugt-towa-portal.git; then
    echo "✅ Repositorio clonado exitosamente"
else
    echo "❌ Error al clonar repositorio"
    exit 1
fi

# 3. Preparar contenido del nuevo portal
echo "📁 Preparando contenido mejorado..."
cd /tmp
cp -r UGT_TOWA_Portal_PWA_AVANZADA_RECOVERED_20251117_0204 new-portal

# 4. Configurar variables de entorno
echo "🔧 Configurando variables de entorno..."
cat > new-portal/.env.local << 'EOF'
# Variables de entorno para UGT Towa Portal con Notificaciones Push

# Claves VAPID para Web Push Notifications (Claves de Prueba)
VITE_VAPID_PUBLIC_KEY=BEl62iUYgUivxIkv69yViEuiBIa40HI80NQDcdMhI0v5C5D5tV6C5bC9nJ6dS8vQ1lK9mN2pR6sF5tV3wL9hY6dJ8vS4pQ2mN8

# Credenciales Supabase (Ya configuradas)
VITE_SUPABASE_URL=https://zaxdscclkeytakcowgww.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpheGRzY2Nsa2V5dGFrY293Z3d3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIwMTUxMTIsImV4cCI6MjA3NzU5MTExMn0.MQMePYqEhW9xhCipC-MeU8Z_dXqvyBKH5e0vtgaS9xQ

# Google Maps API Key (ya configurada)
VITE_GOOGLE_MAPS_API_KEY=AIzaSyCO0kKndUNlmQi3B5mxy4dblg_8WYcuKuk

# Configuración adicional para PWA
VITE_APP_NAME=UGT Towa Portal
VITE_APP_VERSION=2.1.0
EOF

# 5. Configurar git
cd ugt-towa-portal
git config user.email "deploy@ugt-towa.com"
git config user.name "MiniMax Agent Deploy"

# 6. Remover contenido anterior y agregar nuevo
echo "📝 Actualizando archivos..."
# Eliminar archivos existentes (excepto .git)
find . -maxdepth 1 -type f ! -name '.git' ! -name '.gitignore' -delete
find . -maxdepth 1 -type d ! -name '.git' -exec rm -rf {} + 2>/dev/null || true

# Copiar nuevos archivos
cp -r ../new-portal/* .

# 7. Crear commit
echo "💾 Creando commit..."
git add .
git commit -m "🚀 Deploy completo con sistema de notificaciones push y mejoras PWA

✨ Nuevas características:
- Sistema completo de notificaciones push con Web Push API
- Service Worker mejorado para notificaciones en background
- Interfaz de configuración de notificaciones
- Guías de instalación PWA por navegador
- Mejoras en la experiencia de usuario

🔧 Configuración:
- VAPID keys de prueba configuradas
- Variables de entorno para Supabase configuradas
- Edge functions preparadas para deploy

🧪 Testing listo para verificar notificaciones push"

# 8. Hacer push
echo "🚀 Haciendo push a GitHub..."
if git push origin main; then
    echo "✅ Deploy exitoso a GitHub!"
else
    echo "❌ Error al hacer push"
    exit 1
fi

echo "🎉 Deploy completado exitosamente!"
echo "📋 Próximos pasos:"
echo "1. Configurar variables de entorno en Vercel"
echo "2. Deployar edge functions en Supabase"
echo "3. Verificar funcionamiento de notificaciones"