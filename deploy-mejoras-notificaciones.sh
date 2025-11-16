#!/bin/bash

# 🚀 Script de Deploy Automático - UGT TOWA Portal
# Mejoras: Notificaciones Push + PWA Inteligente

echo "🚀 Iniciando deploy de UGT TOWA Portal con mejoras..."
echo "📦 Versión: Notificaciones Push + PWA Inteligente"
echo "📅 Fecha: $(date)"
echo ""

# Ir al directorio con las mejoras
cd /workspace/UGT_TOWA_Portal_PWA_AVANZADA_RECOVERED_20251117_0204 || {
    echo "❌ Error: No se encontró el directorio con las mejoras"
    echo "📁 Directorios disponibles:"
    ls -la /workspace/ | grep UGT_TOWA
    exit 1
}

echo "📂 Directorio actual: $(pwd)"
echo ""

# Verificar si ya existe un repositorio git
if [ ! -d ".git" ]; then
    echo "🔧 Inicializando repositorio Git..."
    git init
else
    echo "✅ Repositorio Git ya inicializado"
fi

# Verificar si ya existe el remote
if ! git remote get-url origin &> /dev/null; then
    echo "🔗 Conectando con repositorio remoto..."
    git remote add origin https://github.com/jaumePR1988/ugt-towa-portal.git
else
    echo "✅ Remote origin ya configurado"
fi

echo ""
echo "📤 Preparando archivos para commit..."
echo ""

# Añadir todos los archivos
git add .

# Crear commit con mensaje descriptivo
COMMIT_MSG="🚀 Implementar sistema completo de notificaciones push y guía PWA inteligente

✅ Nuevas funcionalidades:
- Sistema completo de notificaciones push para administradores
- Hook useNotifications para gestión de suscripciones
- Componente NotificationSetup con interfaz intuitiva
- Service Worker mejorado para notificaciones
- Guía PWA inteligente con detección de navegador
- Integración completa en AdminCitas

🔧 Archivos añadidos:
- src/hooks/useNotifications.ts (218 líneas)
- src/components/NotificationSetup.tsx (112 líneas)
- src/components/PWAInstallGuide.tsx (208 líneas)
- public/sw-notifications.js (155 líneas)

🗃️ Backend configurado:
- Trigger database corregido
- Edge functions desplegadas
- CRON jobs activos

📅 Commit: $(date)
👤 Autor: MiniMax Agent"

echo "💾 Creando commit..."
git commit -m "$COMMIT_MSG"

echo ""
echo "📤 Subiendo cambios al repositorio..."
git push -u origin main

echo ""
echo "🎉 ¡DEPLOY COMPLETADO!"
echo ""
echo "📋 Próximos pasos:"
echo "1. ✅ Cambios subidos a GitHub"
echo "2. 🔄 Vercel debería redeployar automáticamente"
echo "3. ⚙️ Configurar VAPID_PUBLIC_KEY en Vercel (ver GENERAR_VAPID_KEYS.md)"
echo "4. 🧪 Probar notificaciones en Admin > Citas"
echo "5. 📱 Probar guía PWA en la página principal"
echo ""
echo "🔗 Enlaces útiles:"
echo "- GitHub: https://github.com/jaumePR1988/ugt-towa-portal"
echo "- Vercel: https://vercel.com/dashboard"
echo "- Live Site: https://ugt.towa.cat"
echo ""
echo "📝 Variables de entorno necesarias en Vercel:"
echo "VITE_SUPABASE_URL=https://zaxdscclkeytakcowgww.supabase.co"
echo "VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpheGRzY2Nsa2V5dGFrY293Z3d3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIwMTUxMTIsImV4cCI6MjA3NzU5MTExMn0.MQMePYqEhW9xhCipC-MeU8Z_dXqvyBKH5e0vtgaS9xQ"
echo "VITE_VAPID_PUBLIC_KEY=TU_PUBLIC_KEY_AQUI (ver GENERAR_VAPID_KEYS.md)"
echo ""
