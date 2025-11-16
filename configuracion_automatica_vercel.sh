#!/bin/bash

# ==============================================================================
# SCRIPT DE CONFIGURACIÓN AUTOMATIZADA VERCEL - UGT TOWA PORTAL
# Versión: 1.0.0
# Fecha: 2025-11-17
# Descripción: Automatiza completamente la configuración y verificación del deploy
# ==============================================================================

set -e  # Salir en cualquier error

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuración del proyecto
PROJECT_NAME="ugt-towa-portal"
GITHUB_REPO="tu-usuario/ugt-towa-portal"
SUPABASE_URL="https://zaxdscclkeytakcowgww.supabase.co"
SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpheGRzY2Nsa2V5dGFrY293Z3d3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIwMTUxMTIsImV4cCI6MjA3NzU5MTExMn0.MQMePYqEhW9xhCipC-MeU8Z_dXqvyBKH5e0vtgaS9xQ"
CONTACT_EMAIL="jpedragosa@towapharmaceutical.com"
CONTACT_PHONE="629931957"
PRODUCTION_URL="https://ugt.towa.cat"

# Función para logging
log() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"
}

success() {
    echo -e "${GREEN}✅ $1${NC}"
}

error() {
    echo -e "${RED}❌ $1${NC}"
}

warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

# Función principal de configuración
main() {
    echo -e "${BLUE}"
    echo "=============================================================="
    echo "🚀 CONFIGURACIÓN AUTOMATIZADA VERCEL - UGT TOWA PORTAL"
    echo "=============================================================="
    echo -e "${NC}"
    
    log "Iniciando configuración automatizada..."
    
    # Paso 1: Verificar prerequisitos
    check_prerequisites
    
    # Paso 2: Configurar variables de entorno
    setup_environment_variables
    
    # Paso 3: Verificar estructura del proyecto
    verify_project_structure
    
    # Paso 4: Ejecutar build de prueba
    test_build
    
    # Paso 5: Verificar PWA
    verify_pwa
    
    # Paso 6: Preparar para deploy
    prepare_deploy
    
    # Paso 7: Mostrar instrucciones finales
    show_final_instructions
}

# Verificar prerequisitos
check_prerequisites() {
    log "Verificando prerequisitos del sistema..."
    
    # Verificar Node.js
    if ! command -v node &> /dev/null; then
        error "Node.js no está instalado. Por favor instala Node.js 18+ primero."
        exit 1
    fi
    
    NODE_VERSION=$(node -v | sed 's/v//')
    log "Node.js version: $NODE_VERSION"
    
    # Verificar npm
    if ! command -v npm &> /dev/null; then
        error "npm no está instalado."
        exit 1
    fi
    
    # Verificar git
    if ! command -v git &> /dev/null; then
        error "git no está instalado."
        exit 1
    fi
    
    # Verificar que estamos en directorio del proyecto
    if [ ! -f "package.json" ]; then
        error "No se encontró package.json. Asegúrate de estar en el directorio raíz del proyecto."
        exit 1
    fi
    
    success "Todos los prerequisitos verificados"
}

# Configurar variables de entorno
setup_environment_variables() {
    log "Configurando variables de entorno..."
    
    # Crear .env.local
    cat > .env.local << EOL
# Configuración UGT-TOWA Portal - Generado automáticamente
VITE_SUPABASE_URL=$SUPABASE_URL
VITE_SUPABASE_ANON_KEY=$SUPABASE_ANON_KEY
VITE_CONTACT_EMAIL=$CONTACT_EMAIL
VITE_CONTACT_PHONE=$CONTACT_PHONE
VITE_APP_URL=$PRODUCTION_URL

# Configuración adicional para desarrollo
NODE_ENV=development
VITE_BUILD_MODE=development
EOL
    
    success "Archivo .env.local creado con variables de entorno"
    
    # Mostrar variables configuradas
    log "Variables de entorno configuradas:"
    echo "  - SUPABASE_URL: $SUPABASE_URL"
    echo "  - SUPABASE_ANON_KEY: ${SUPABASE_ANON_KEY:0:20}..."
    echo "  - CONTACT_EMAIL: $CONTACT_EMAIL"
    echo "  - CONTACT_PHONE: $CONTACT_PHONE"
    echo "  - PRODUCTION_URL: $PRODUCTION_URL"
}

# Verificar estructura del proyecto
verify_project_structure() {
    log "Verificando estructura del proyecto..."
    
    # Archivos críticos que deben existir
    CRITICAL_FILES=(
        "package.json"
        "vercel.json"
        "vite.config.ts"
        "tsconfig.json"
        "index.html"
        "public/manifest.json"
        "public/sw.js"
        "src/main.tsx"
    )
    
    for file in "${CRITICAL_FILES[@]}"; do
        if [ -f "$file" ]; then
            success "$file existe"
        else
            error "$file no encontrado"
            exit 1
        fi
    done
    
    # Verificar directorios críticos
    CRITICAL_DIRS=(
        "src"
        "public"
        "dist"
    )
    
    for dir in "${CRITICAL_DIRS[@]}"; do
        if [ -d "$dir" ]; then
            success "Directorio $dir existe"
        else
            warning "Directorio $dir no existe, creando..."
            mkdir -p "$dir"
        fi
    done
}

# Ejecutar build de prueba
test_build() {
    log "Ejecutando build de prueba..."
    
    # Limpiar instalación anterior si existe
    if [ -d "node_modules" ]; then
        log "Limpiando node_modules anterior..."
        rm -rf node_modules
    fi
    
    # Instalar dependencias
    log "Instalando dependencias..."
    if npm install; then
        success "Dependencias instaladas correctamente"
    else
        error "Error instalando dependencias"
        exit 1
    fi
    
    # Ejecutar build
    log "Ejecutando build de producción..."
    if npm run build; then
        success "Build completado exitosamente"
    else
        error "Error en build de producción"
        exit 1
    fi
    
    # Verificar que se generó dist
    if [ -d "dist" ] && [ -f "dist/index.html" ]; then
        success "Directorio dist generado correctamente"
    else
        error "Directorio dist no generado correctamente"
        exit 1
    fi
}

# Verificar PWA
verify_pwa() {
    log "Verificando configuración PWA..."
    
    # Verificar manifest.json
    if [ -f "public/manifest.json" ]; then
        if grep -q "Portal UGT-TOWA" "public/manifest.json"; then
            success "Manifest PWA configurado correctamente"
        else
            warning "Manifest PWA existe pero puede necesitar ajustes"
        fi
    else
        error "Manifest PWA no encontrado"
        exit 1
    fi
    
    # Verificar service worker
    if [ -f "public/sw.js" ]; then
        if grep -q "install" "public/sw.js"; then
            success "Service Worker configurado correctamente"
        else
            warning "Service Worker existe pero puede necesitar ajustes"
        fi
    else
        error "Service Worker no encontrado"
        exit 1
    fi
    
    # Verificar iconos PWA
    ICON_FILES=(
        "public/ugt-towa-icon-144.png"
        "public/ugt-towa-icon-192.png"
        "public/ugt-towa-icon-512.png"
    )
    
    for icon in "${ICON_FILES[@]}"; do
        if [ -f "$icon" ]; then
            success "Icono PWA $icon existe"
        else
            warning "Icono PWA $icon no encontrado"
        fi
    done
}

# Preparar para deploy
prepare_deploy() {
    log "Preparando para deploy..."
    
    # Verificar que todo está en git
    if git status | grep -q "nothing to commit"; then
        success "Repositorio Git está limpio"
    else
        warning "Hay cambios sin commitear. Commitando automáticamente..."
        git add .
        git commit -m "Auto-commit: Preparación para deploy automatizado - $(date)"
        success "Cambios commitados"
    fi
    
    # Crear archivo de configuración Vercel si no existe
    if [ ! -f "vercel.json" ] || ! grep -q "installCommand" "vercel.json"; then
        log "Creando/actualizando vercel.json..."
        cat > vercel.json << EOL
{
  "installCommand": "npm install",
  "buildCommand": "npm run build",
  "framework": "vite",
  "outputDirectory": "dist",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        }
      ]
    }
  ]
}
EOL
        success "Archivo vercel.json configurado"
    fi
}

# Mostrar instrucciones finales
show_final_instructions() {
    echo -e "${GREEN}"
    echo "🎉 ¡CONFIGURACIÓN AUTOMATIZADA COMPLETADA!"
    echo "============================================"
    echo -e "${NC}"
    
    log "Resumen de configuración:"
    echo "  ✅ Variables de entorno configuradas"
    echo "  ✅ Build de prueba exitoso"
    echo "  ✅ PWA verificada"
    echo "  ✅ Estructura del proyecto validada"
    echo "  ✅ Configuración Vercel lista"
    
    echo -e "\n${BLUE}🚀 PRÓXIMOS PASOS PARA DEPLOY:${NC}"
    echo "1. ${YELLOW}Subir a GitHub:${NC}"
    echo "   git push origin master"
    
    echo -e "\n2. ${YELLOW}Conectar en Vercel:${NC}"
    echo "   - Ve a https://vercel.com/dashboard"
    echo "   - Click 'New Project'"
    echo "   - Import desde GitHub: $GITHUB_REPO"
    
    echo -e "\n3. ${YELLOW}Configurar variables en Vercel:${NC}"
    echo "   - VITE_SUPABASE_URL: $SUPABASE_URL"
    echo "   - VITE_SUPABASE_ANON_KEY: [usar la key completa]"
    echo "   - VITE_CONTACT_EMAIL: $CONTACT_EMAIL"
    echo "   - VITE_CONTACT_PHONE: $CONTACT_PHONE"
    echo "   - VITE_APP_URL: $PRODUCTION_URL"
    
    echo -e "\n4. ${YELLOW}Deploy:${NC}"
    echo "   - Click 'Deploy' en Vercel"
    echo "   - Esperar 2-3 minutos"
    
    echo -e "\n5. ${YELLOW}Verificar deploy:${NC}"
    echo "   - Ejecutar: ./verificar_deploy.sh"
    
    echo -e "\n${GREEN}📋 URLS FINALES ESPERADAS:${NC}"
    echo "   Portal Principal: $PRODUCTION_URL"
    echo "   Admin Dashboard: $PRODUCTION_URL/admin"
    echo "   PWA Manifest: $PRODUCTION_URL/manifest.json"
    
    echo -e "\n${BLUE}🛠️ HERRAMIENTAS ADICIONALES:${NC}"
    echo "   - Verificación rápida: ./verificar_deploy.sh"
    echo "   - Redeploy: git push (conecta automático con Vercel)"
    echo "   - Logs: https://vercel.com/dashboard"
    
    echo -e "\n${GREEN}✅ ¡TODO LISTO PARA DEPLOY!${NC}"
}

# Ejecutar verificación post-deploy
verify_deploy() {
    echo -e "${BLUE}"
    echo "🔍 VERIFICACIÓN POST-DEPLOY"
    echo "============================"
    echo -e "${NC}"
    
    BASE_URL=${1:-$PRODUCTION_URL}
    
    log "Verificando deploy en: $BASE_URL"
    
    # Test 1: Conectividad
    echo -n "1. Test de conectividad... "
    if curl -f -s "$BASE_URL" > /dev/null; then
        success "Portal accesible"
    else
        error "Portal NO accesible"
        return 1
    fi
    
    # Test 2: PWA Manifest
    echo -n "2. PWA Manifest... "
    if curl -s "$BASE_URL/manifest.json" | grep -q "Portal UGT-TOWA"; then
        success "PWA manifest OK"
    else
        error "PWA manifest ERROR"
    fi
    
    # Test 3: Service Worker
    echo -n "3. Service Worker... "
    if curl -s "$BASE_URL/sw.js" | grep -q "install"; then
        success "Service Worker OK"
    else
        error "Service Worker ERROR"
    fi
    
    # Test 4: Variables de entorno
    echo -n "4. Contact email... "
    if curl -s "$BASE_URL" | grep -q "$CONTACT_EMAIL"; then
        success "Contact email OK"
    else
        error "Contact email ERROR"
    fi
    
    echo -n "5. Contact phone... "
    if curl -s "$BASE_URL" | grep -q "$CONTACT_PHONE"; then
        success "Contact phone OK"
    else
        error "Contact phone ERROR"
    fi
    
    # Test 5: Admin panel
    echo -n "6. Admin panel... "
    if curl -s "$BASE_URL/admin" | grep -q "Dashboard"; then
        success "Admin panel OK"
    else
        warning "Admin panel puede necesitar autenticación"
    fi
    
    echo -e "\n${GREEN}🎉 VERIFICACIÓN COMPLETADA${NC}"
}

# Función de ayuda
show_help() {
    echo "SCRIPT DE CONFIGURACIÓN AUTOMATIZADA VERCEL - UGT TOWA PORTAL"
    echo ""
    echo "Uso: $0 [comando]"
    echo ""
    echo "Comandos disponibles:"
    echo "  (sin argumentos)  - Ejecutar configuración completa"
    echo "  verify           - Verificar deploy existente"
    echo "  verify URL       - Verificar URL específica"
    echo "  help             - Mostrar esta ayuda"
    echo ""
    echo "Ejemplos:"
    echo "  $0                  # Configuración completa"
    echo "  $0 verify           # Verificar deploy en producción"
    echo "  $0 verify https://mi-proyecto.vercel.app  # Verificar URL específica"
}

# Manejo de argumentos
case "${1:-}" in
    "verify")
        if [ -n "$2" ]; then
            verify_deploy "$2"
        else
            verify_deploy
        fi
        ;;
    "help"|"-h"|"--help")
        show_help
        ;;
    "")
        main
        ;;
    *)
        error "Comando no reconocido: $1"
        show_help
        exit 1
        ;;
esac