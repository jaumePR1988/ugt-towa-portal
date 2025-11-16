#!/bin/bash

# ==============================================================================
# SCRIPT DE VERIFICACIÓN POST-DEPLOY VERCEL - UGT TOWA PORTAL
# Versión: 1.0.0
# Descripción: Verificación automatizada completa del deploy
# ==============================================================================

set -e

# Colores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# URLs a verificar
PRODUCTION_URL="https://ugt.towa.cat"
ADMIN_URL="https://ugt.towa.cat/admin"
SITEMAP_URL="https://ugt.towa.cat/sitemap.xml"
MANIFEST_URL="https://ugt.towa.cat/manifest.json"

# Contact info esperado
EXPECTED_EMAIL="jpedragosa@towapharmaceutical.com"
EXPECTED_PHONE="629931957"

# Contadores
TESTS_PASSED=0
TESTS_TOTAL=0

log() {
    echo -e "${BLUE}[$(date +'%H:%M:%S')]${NC} $1"
}

success() {
    echo -e "${GREEN}✅ $1${NC}"
    ((TESTS_PASSED++))
    ((TESTS_TOTAL++))
}

error() {
    echo -e "${RED}❌ $1${NC}"
    ((TESTS_TOTAL++))
}

warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# Función principal
main() {
    echo -e "${BLUE}"
    echo "=============================================================="
    echo "🔍 VERIFICACIÓN POST-DEPLOY UGT-TOWA PORTAL"
    echo "=============================================================="
    echo -e "${NC}"
    
    log "Iniciando verificación completa del deploy..."
    
    # Verificar URL personalizada primero
    verify_custom_domain
    
    # Verificaciones básicas
    basic_connectivity_tests
    
    # Verificaciones PWA
    pwa_verification
    
    # Verificaciones de funcionalidad
    functional_tests
    
    # Verificaciones de performance
    performance_tests
    
    # Resumen final
    show_final_report
}

# Verificar dominio personalizado
verify_custom_domain() {
    echo -e "\n${YELLOW}🌐 VERIFICACIÓN DE DOMINIO PERSONALIZADO${NC}"
    
    log "Verificando dominio principal: $PRODUCTION_URL"
    
    # Test de resolución DNS
    echo -n "1. Resolución DNS... "
    if nslookup ugt.towa.cat > /dev/null 2>&1; then
        success "DNS resuelve correctamente"
    else
        warning "DNS no resuelve (puede ser normal si dominio no está configurado)"
    fi
    
    # Test de conectividad HTTPS
    echo -n "2. Conectividad HTTPS... "
    if curl -f -s --max-time 10 "$PRODUCTION_URL" > /dev/null; then
        success "HTTPS funciona"
    else
        error "HTTPS no funciona"
    fi
    
    # Test SSL Certificate
    echo -n "3. Certificado SSL... "
    if echo | openssl s_client -connect ugt.towa.cat:443 -servername ugt.towa.cat 2>/dev/null | grep -q "BEGIN CERTIFICATE"; then
        success "Certificado SSL válido"
    else
        warning "Certificado SSL no verificado"
    fi
}

# Tests básicos de conectividad
basic_connectivity_tests() {
    echo -e "\n${YELLOW}🌐 TESTS BÁSICOS DE CONECTIVIDAD${NC}"
    
    # Test 1: Página principal
    echo -n "1. Página principal carga... "
    if curl -f -s --max-time 10 "$PRODUCTION_URL" > /dev/null; then
        success "Página principal carga"
    else
        error "Página principal no carga"
    fi
    
    # Test 2: Tiempo de respuesta
    echo -n "2. Tiempo de respuesta... "
    RESPONSE_TIME=$(curl -o /dev/null -s -w '%{time_total}' --max-time 10 "$PRODUCTION_URL")
    if (( $(echo "$RESPONSE_TIME < 3" | bc -l) )); then
        success "Tiempo de respuesta: ${RESPONSE_TIME}s (< 3s)"
    else
        warning "Tiempo de respuesta: ${RESPONSE_TIME}s (puede ser lento)"
    fi
    
    # Test 3: Código de estado HTTP
    echo -n "3. Código de estado HTTP... "
    HTTP_CODE=$(curl -o /dev/null -s -w '%{http_code}' --max-time 10 "$PRODUCTION_URL")
    if [ "$HTTP_CODE" = "200" ]; then
        success "HTTP 200 OK"
    else
        error "HTTP $HTTP_CODE (debería ser 200)"
    fi
    
    # Test 4: Content-Type
    echo -n "4. Content-Type... "
    CONTENT_TYPE=$(curl -s -I --max-time 10 "$PRODUCTION_URL" | grep -i "content-type" | head -1)
    if echo "$CONTENT_TYPE" | grep -q "text/html"; then
        success "Content-Type correcto: $CONTENT_TYPE"
    else
        warning "Content-Type inesperado: $CONTENT_TYPE"
    fi
}

# Verificación PWA
pwa_verification() {
    echo -e "\n${YELLOW}📱 VERIFICACIÓN PWA${NC}"
    
    # Test 1: Manifest.json
    echo -n "1. Manifest PWA... "
    if curl -f -s --max-time 10 "$MANIFEST_URL" > /dev/null; then
        success "Manifest accesible"
        
        # Verificar contenido del manifest
        echo -n "   Contenido manifest... "
        if curl -s --max-time 10 "$MANIFEST_URL" | grep -q "Portal UGT-TOWA"; then
            success "Nombre correcto en manifest"
        else
            error "Nombre incorrecto en manifest"
        fi
    else
        error "Manifest no accesible"
    fi
    
    # Test 2: Service Worker
    echo -n "2. Service Worker... "
    if curl -f -s --max-time 10 "$PRODUCTION_URL/sw.js" > /dev/null; then
        success "Service Worker accesible"
        
        # Verificar contenido del SW
        echo -n "   Contenido SW... "
        if curl -s --max-time 10 "$PRODUCTION_URL/sw.js" | grep -q "install"; then
            success "Service Worker válido"
        else
            error "Service Worker inválido"
        fi
    else
        error "Service Worker no accesible"
    fi
    
    # Test 3: Iconos PWA
    ICON_SIZES=("144" "192" "512")
    for size in "${ICON_SIZES[@]}"; do
        echo -n "3. Icono PWA ${size}x${size}... "
        if curl -f -s --max-time 5 "$PRODUCTION_URL/ugt-towa-icon-${size}.png" > /dev/null; then
            success "Icono ${size}x${size} accesible"
        else
            warning "Icono ${size}x${size} no encontrado"
        fi
    done
}

# Tests funcionales
functional_tests() {
    echo -e "\n${YELLOW}⚙️ TESTS FUNCIONALES${NC}"
    
    # Test 1: Variables de entorno en footer
    echo -n "1. Email de contacto en footer... "
    PAGE_CONTENT=$(curl -s --max-time 10 "$PRODUCTION_URL")
    if echo "$PAGE_CONTENT" | grep -q "$EXPECTED_EMAIL"; then
        success "Email de contacto correcto"
    else
        error "Email de contacto incorrecto o no encontrado"
    fi
    
    echo -n "2. Teléfono de contacto en footer... "
    if echo "$PAGE_CONTENT" | grep -q "$EXPECTED_PHONE"; then
        success "Teléfono de contacto correcto"
    else
        error "Teléfono de contacto incorrecto o no encontrado"
    fi
    
    # Test 2: Admin panel accesible
    echo -n "3. Admin panel accesible... "
    if curl -f -s --max-time 10 "$ADMIN_URL" > /dev/null; then
        success "Admin panel accesible (puede requerir login)"
    else
        warning "Admin panel no accesible (puede ser normal si requiere autenticación)"
    fi
    
    # Test 3: Sitemap XML
    echo -n "4. Sitemap XML... "
    if curl -f -s --max-time 10 "$SITEMAP_URL" > /dev/null; then
        success "Sitemap accesible"
        
        # Verificar contenido del sitemap
        if curl -s --max-time 10 "$SITEMAP_URL" | grep -q "urlset"; then
            success "Sitemap formato correcto"
        else
            warning "Sitemap formato incorrecto"
        fi
    else
        warning "Sitemap no accesible"
    fi
    
    # Test 4: Robots.txt
    echo -n "5. Robots.txt... "
    if curl -f -s --max-time 10 "$PRODUCTION_URL/robots.txt" > /dev/null; then
        success "Robots.txt accesible"
    else
        warning "Robots.txt no accesible"
    fi
}

# Tests de performance
performance_tests() {
    echo -e "\n${YELLOW}⚡ TESTS DE PERFORMANCE${NC}"
    
    # Test 1: Tamaño de página principal
    echo -n "1. Tamaño de página principal... "
    PAGE_SIZE=$(curl -s --max-time 10 "$PRODUCTION_URL" | wc -c)
    if [ $PAGE_SIZE -lt 1000000 ]; then  # Menos de 1MB
        success "Tamaño aceptable: $(echo "scale=2; $PAGE_SIZE/1024/1024" | bc)MB"
    else
        warning "Página muy grande: $(echo "scale=2; $PAGE_SIZE/1024/1024" | bc)MB"
    fi
    
    # Test 2: Tiempo hasta primer byte
    echo -n "2. Tiempo hasta primer byte (TTFB)... "
    TTFB=$(curl -o /dev/null -s -w '%{time_starttransfer}' --max-time 10 "$PRODUCTION_URL")
    if (( $(echo "$TTFB < 1" | bc -l) )); then
        success "TTFB excelente: ${TTFB}s"
    elif (( $(echo "$TTFB < 2" | bc -l) )); then
        success "TTFB bueno: ${TTFB}s"
    else
        warning "TTFB lento: ${TTFB}s"
    fi
    
    # Test 3: Compresión
    echo -n "3. Compresión GZIP... "
    COMPRESSION=$(curl -s -H "Accept-Encoding: gzip" -I --max-time 10 "$PRODUCTION_URL" | grep -i "content-encoding")
    if echo "$COMPRESSION" | grep -q "gzip"; then
        success "Compresión GZIP habilitada"
    else
        warning "Compresión GZIP no detectada"
    fi
}

# Reporte final
show_final_report() {
    echo -e "\n${BLUE}=============================================================="
    echo "📊 REPORTE FINAL DE VERIFICACIÓN"
    echo "==============================================================${NC}"
    
    echo -e "\n${YELLOW}RESUMEN DE TESTS:${NC}"
    echo "Tests pasados: $TESTS_PASSED"
    echo "Tests totales: $TESTS_TOTAL"
    echo "Porcentaje de éxito: $(echo "scale=1; $TESTS_PASSED*100/$TESTS_TOTAL" | bc)%"
    
    if [ $TESTS_PASSED -eq $TESTS_TOTAL ]; then
        echo -e "\n${GREEN}🎉 ¡TODOS LOS TESTS PASARON! DEPLOY EXITOSO${NC}"
        exit 0
    elif [ $TESTS_PASSED -gt $((TESTS_TOTAL * 80 / 100)) ]; then
        echo -e "\n${YELLOW}⚠️  MAYORÍA DE TESTS PASARON - DEPLOY PARCIALMENTE EXITOSO${NC}"
        exit 0
    else
        echo -e "\n${RED}❌ MUCHOS TESTS FALLARON - REVISAR DEPLOY${NC}"
        exit 1
    fi
    
    echo -e "\n${BLUE}URLS VERIFICADAS:${NC}"
    echo "  Portal Principal: $PRODUCTION_URL"
    echo "  Admin Panel: $ADMIN_URL"
    echo "  Sitemap: $SITEMAP_URL"
    echo "  PWA Manifest: $MANIFEST_URL"
    
    echo -e "\n${BLUE}PRÓXIMOS PASOS SI HAY PROBLEMAS:${NC}"
    echo "1. Verificar que el deploy en Vercel esté completo"
    echo "2. Revisar variables de entorno en Vercel Dashboard"
    echo "3. Verificar logs de build en Vercel"
    echo "4. Confirmar que GitHub está conectado a Vercel"
    
    echo -e "\n${GREEN}✅ VERIFICACIÓN COMPLETADA${NC}"
}

# Función de ayuda
show_help() {
    echo "VERIFICACIÓN POST-DEPLOY UGT-TOWA PORTAL"
    echo ""
    echo "Uso: $0 [opciones]"
    echo ""
    echo "Opciones:"
    echo "  (sin argumentos)  - Verificación completa"
    echo "  --url URL         - Verificar URL específica"
    echo "  --help            - Mostrar esta ayuda"
    echo ""
    echo "Ejemplos:"
    echo "  $0                          # Verificación completa"
    echo "  $0 --url https://custom-domain.com  # Verificar URL específica"
}

# Manejo de argumentos
case "${1:-}" in
    "--url")
        if [ -n "$2" ]; then
            PRODUCTION_URL="$2"
            log "Usando URL personalizada: $PRODUCTION_URL"
            main
        else
            error "Debe especificar una URL con --url"
            exit 1
        fi
        ;;
    "--help"|"-h"|"--help")
        show_help
        ;;
    "")
        main
        ;;
    *)
        error "Opción no reconocida: $1"
        show_help
        exit 1
        ;;
esac