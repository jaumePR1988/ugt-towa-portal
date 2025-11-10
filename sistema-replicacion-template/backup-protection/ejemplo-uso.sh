#!/bin/bash

# Script de Ejemplo - Uso del Sistema de Backup y Protección
# Sistema de replicación UGT-TOWA
# 
# Este script demuestra las operaciones más comunes del sistema
# de backup y protección.

set -e  # Salir en caso de error

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuración
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
BACKUP_SCRIPT="$SCRIPT_DIR/backup-automatico.js"
PROTECCION_SCRIPT="$SCRIPT_DIR/sistema-proteccion.js"
ALMACENAMIENTO_SCRIPT="$SCRIPT_DIR/sistema-almacenamiento.js"
COORDINADOR_SCRIPT="$SCRIPT_DIR/coordinador-backup.js"

# Función para mostrar ayuda
mostrar_ayuda() {
    echo -e "${BLUE}Sistema de Backup y Protección UGT-TOWA${NC}"
    echo ""
    echo "Uso: $0 [COMANDO] [OPCIONES]"
    echo ""
    echo "Comandos disponibles:"
    echo "  install     - Instalar y configurar el sistema"
    echo "  backup      - Ejecutar backup completo"
    echo "  proteccion  - Gestionar sistema de protección"
    echo "  almacenamiento - Gestionar almacenamiento"
    echo "  recuperacion - Procedimientos de recuperación"
    echo "  test        - Ejecutar tests del sistema"
    echo "  monitor     - Iniciar monitoreo en tiempo real"
    echo "  status      - Ver estado del sistema"
    echo "  help        - Mostrar esta ayuda"
    echo ""
    echo "Ejemplos:"
    echo "  $0 backup                    # Backup completo"
    echo "  $0 backup emergency          # Backup de emergencia"
    echo "  $0 proteccion rotate         # Rotar claves"
    echo "  $0 recuperacion archivo.tar.gz  # Recuperar desde archivo"
    echo "  $0 monitor                   # Monitorear sistema"
}

# Función para instalar el sistema
instalar_sistema() {
    echo -e "${YELLOW}🚀 Instalando Sistema de Backup y Protección...${NC}"
    
    # Verificar Node.js
    if ! command -v node &> /dev/null; then
        echo -e "${RED}❌ Node.js no está instalado${NC}"
        exit 1
    fi
    
    NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$NODE_VERSION" -lt 18 ]; then
        echo -e "${RED}❌ Se requiere Node.js 18 o superior${NC}"
        exit 1
    fi
    
    echo -e "${GREEN}✅ Node.js $(node --version) detectado${NC}"
    
    # Instalar dependencias
    echo -e "${YELLOW}📦 Instalando dependencias...${NC}"
    npm install
    
    # Crear estructura de directorios
    echo -e "${YELLOW}📁 Creando estructura de directorios...${NC}"
    mkdir -p storage/{local,claves,credenciales,auditoria,reportes,metricas,logs}
    mkdir -p config
    
    # Establecer permisos
    echo -e "${YELLOW}🔐 Configurando permisos...${NC}"
    chmod 755 scripts/*.js
    chmod 700 storage/claves/
    chmod 700 storage/credenciales/
    chmod 755 storage/
    
    # Inicializar sistema de protección
    echo -e "${YELLOW}🔐 Inicializando sistema de protección...${NC}"
    if [ -f "$PROTECCION_SCRIPT" ]; then
        node "$PROTECCION_SCRIPT" inicializar
    fi
    
    echo -e "${GREEN}✅ Sistema instalado correctamente${NC}"
    echo -e "${BLUE}📖 Consulte la documentación en docs/${NC}"
}

# Función para ejecutar backup
ejecutar_backup() {
    local tipo="${1:-completo}"
    
    case $tipo in
        "completo")
            echo -e "${YELLOW}💾 Ejecutando backup completo...${NC}"
            if [ -f "$COORDINADOR_SCRIPT" ]; then
                node "$COORDINADOR_SCRIPT" completo
            else
                echo -e "${RED}❌ Script coordinador no encontrado${NC}"
                exit 1
            fi
            ;;
        "emergency"|"urgente")
            echo -e "${RED}🚨 Ejecutando backup de emergencia...${NC}"
            if [ -f "$BACKUP_SCRIPT" ]; then
                node "$BACKUP_SCRIPT" --emergency
            else
                echo -e "${RED}❌ Script de backup no encontrado${NC}"
                exit 1
            fi
            ;;
        "incremental")
            echo -e "${YELLOW}📊 Ejecutando backup incremental...${NC}"
            if [ -f "$BACKUP_SCRIPT" ]; then
                node "$BACKUP_SCRIPT" --incremental
            else
                echo -e "${RED}❌ Script de backup no encontrado${NC}"
                exit 1
            fi
            ;;
        *)
            echo -e "${YELLOW}💾 Ejecutando backup estándar...${NC}"
            if [ -f "$BACKUP_SCRIPT" ]; then
                node "$BACKUP_SCRIPT"
            else
                echo -e "${RED}❌ Script de backup no encontrado${NC}"
                exit 1
            fi
            ;;
    esac
    
    echo -e "${GREEN}✅ Backup completado${NC}"
}

# Función para gestionar protección
gestionar_proteccion() {
    local accion="${1}"
    
    case $accion in
        "init"|"inicializar")
            echo -e "${YELLOW}🔐 Inicializando sistema de protección...${NC}"
            if [ -f "$PROTECCION_SCRIPT" ]; then
                node "$PROTECCION_SCRIPT" inicializar
            else
                echo -e "${RED}❌ Script de protección no encontrado${NC}"
                exit 1
            fi
            ;;
        "rotate"|"rotar")
            echo -e "${YELLOW}🔄 Rotando claves...${NC}"
            if [ -f "$PROTECCION_SCRIPT" ]; then
                node "$PROTECCION_SCRIPT" rotar-claves
            else
                echo -e "${RED}❌ Script de protección no encontrado${NC}"
                exit 1
            fi
            ;;
        "verify"|"verificar")
            echo -e "${YELLOW}🔍 Verificando integridad...${NC}"
            if [ -f "$PROTECCION_SCRIPT" ]; then
                node "$PROTECCION_SCRIPT" verificar-integridad
            else
                echo -e "${RED}❌ Script de protección no encontrado${NC}"
                exit 1
            fi
            ;;
        "report"|"reporte")
            echo -e "${YELLOW}📊 Generando reporte de seguridad...${NC}"
            if [ -f "$PROTECCION_SCRIPT" ]; then
                node "$PROTECCION_SCRIPT" reporte-seguridad
            else
                echo -e "${RED}❌ Script de protección no encontrado${NC}"
                exit 1
            fi
            ;;
        *)
            echo -e "${YELLOW}🔐 Mostrando opciones de protección...${NC}"
            echo "Acciones disponibles:"
            echo "  init    - Inicializar sistema"
            echo "  rotate  - Rotar claves"
            echo "  verify  - Verificar integridad"
            echo "  report  - Generar reporte"
            ;;
    esac
}

# Función para gestionar almacenamiento
gestionar_almacenamiento() {
    local accion="${1}"
    local archivo="${2}"
    
    case $accion in
        "sync"|"sincronizar")
            if [ -z "$archivo" ]; then
                echo -e "${RED}❌ Se requiere especificar archivo de backup${NC}"
                echo "Uso: $0 almacenamiento sync archivo.tar.gz"
                exit 1
            fi
            
            echo -e "${YELLOW}☁️  Sincronizando archivo: $archivo${NC}"
            if [ -f "$ALMACENAMIENTO_SCRIPT" ]; then
                node "$ALMACENAMIENTO_SCRIPT" "$archivo"
            else
                echo -e "${RED}❌ Script de almacenamiento no encontrado${NC}"
                exit 1
            fi
            ;;
        "test"|"probar")
            echo -e "${YELLOW}🧪 Probando conectividad...${NC}"
            if [ -f "$ALMACENAMIENTO_SCRIPT" ]; then
                node "$ALMACENAMIENTO_SCRIPT" test-all
            else
                echo -e "${RED}❌ Script de almacenamiento no encontrado${NC}"
                exit 1
            fi
            ;;
        *)
            echo -e "${YELLOW}☁️  Mostrando opciones de almacenamiento...${NC}"
            echo "Acciones disponibles:"
            echo "  sync [archivo] - Sincronizar archivo"
            echo "  test           - Probar conectividad"
            ;;
    esac
}

# Función para recuperación
recuperar_sistema() {
    local archivo="${1}"
    local ubicaciones="${2:-local git cloud}"
    
    if [ -z "$archivo" ]; then
        echo -e "${RED}❌ Se requiere especificar archivo de backup${NC}"
        echo "Uso: $0 recuperacion archivo.tar.gz [ubicaciones...]"
        exit 1
    fi
    
    echo -e "${RED}🚨 Iniciando recuperación de emergencia${NC}"
    echo -e "${YELLOW}📦 Archivo: $archivo${NC}"
    echo -e "${YELLOW}📍 Ubicaciones: $ubicaciones${NC}"
    
    # Verificar que el archivo existe
    if [ ! -f "$archivo" ]; then
        echo -e "${RED}❌ Archivo no encontrado: $archivo${NC}"
        exit 1
    fi
    
    if [ -f "$COORDINADOR_SCRIPT" ]; then
        echo -e "${YELLOW}⏳ Ejecutando recuperación...${NC}"
        node "$COORDINADOR_SCRIPT" recuperacion "$archivo" $ubicaciones
    else
        echo -e "${RED}❌ Script coordinador no encontrado${NC}"
        exit 1
    fi
    
    echo -e "${GREEN}✅ Recuperación completada${NC}"
}

# Función para ejecutar tests
ejecutar_tests() {
    echo -e "${YELLOW}🧪 Ejecutando tests del sistema...${NC}"
    
    # Test de sintaxis de scripts
    echo "📝 Verificando sintaxis de scripts..."
    for script in "$SCRIPT_DIR"/*.js; do
        if [ -f "$script" ]; then
            if node -c "$script"; then
                echo -e "${GREEN}✅ $(basename "$script") - Sintaxis OK${NC}"
            else
                echo -e "${RED}❌ $(basename "$script") - Error de sintaxis${NC}"
            fi
        fi
    done
    
    # Test de configuración
    echo -e "${YELLOW}⚙️  Verificando configuración...${NC}"
    if [ -d "config" ]; then
        echo -e "${GREEN}✅ Directorio de configuración existe${NC}"
    else
        echo -e "${RED}❌ Directorio de configuración no encontrado${NC}"
    fi
    
    # Test de dependencias
    echo -e "${YELLOW}📦 Verificando dependencias...${NC}"
    if command -v node &> /dev/null; then
        echo -e "${GREEN}✅ Node.js disponible${NC}"
    else
        echo -e "${RED}❌ Node.js no disponible${NC}"
    fi
    
    if command -v npm &> /dev/null; then
        echo -e "${GREEN}✅ npm disponible${NC}"
    else
        echo -e "${RED}❌ npm no disponible${NC}"
    fi
    
    echo -e "${GREEN}✅ Tests completados${NC}"
}

# Función para monitoreo
monitorear_sistema() {
    echo -e "${YELLOW}📊 Iniciando monitoreo del sistema...${NC}"
    echo "Presiona Ctrl+C para salir"
    echo ""
    
    # Monitor en tiempo real
    while true; do
        clear
        echo -e "${BLUE}=== MONITOR SISTEMA BACKUP UGT-TOWA ===${NC}"
        echo "Fecha: $(date)"
        echo ""
        
        # Estado de servicios
        echo -e "${YELLOW}Estado de Servicios:${NC}"
        if systemctl is-active --quiet nginx; then
            echo -e "${GREEN}✅ Nginx: Activo${NC}"
        else
            echo -e "${RED}❌ Nginx: Inactivo${NC}"
        fi
        
        if systemctl is-active --quiet postgresql; then
            echo -e "${GREEN}✅ PostgreSQL: Activo${NC}"
        else
            echo -e "${RED}❌ PostgreSQL: Inactivo${NC}"
        fi
        
        echo ""
        
        # Espacio en disco
        echo -e "${YELLOW}Espacio en Disco:${NC}"
        df -h | grep -E "(Filesystem|/dev/)" | head -5
        
        echo ""
        
        # Últimos backups
        echo -e "${YELLOW}Últimos Backups:${NC}"
        if [ -d "storage/local" ]; then
            ls -lt storage/local/backup-*/ 2>/dev/null | head -3 | while read line; do
                echo "  $line"
            done
        else
            echo "  Directorio de backups no encontrado"
        fi
        
        echo ""
        
        # Procesos relacionados
        echo -e "${YELLOW}Procesos del Sistema:${NC}"
        ps aux | grep -E "(node|backup|ugt)" | grep -v grep || echo "  No hay procesos relacionados activos"
        
        sleep 5
    done
}

# Función para ver estado
ver_estado() {
    echo -e "${BLUE}=== ESTADO DEL SISTEMA ===${NC}"
    echo ""
    
    # Información general
    echo -e "${YELLOW}Información General:${NC}"
    echo "  Directorio del proyecto: $PROJECT_DIR"
    echo "  Node.js: $(node --version 2>/dev/null || echo 'No instalado')"
    echo "  npm: $(npm --version 2>/dev/null || echo 'No instalado')"
    echo "  Sistema operativo: $(uname -a)"
    echo ""
    
    # Estructura de archivos
    echo -e "${YELLOW}Estructura de Archivos:${NC}"
    if [ -d "scripts" ]; then
        echo -e "${GREEN}✅ Directorio scripts: $(ls scripts/*.js 2>/dev/null | wc -l) archivos${NC}"
    else
        echo -e "${RED}❌ Directorio scripts: No encontrado${NC}"
    fi
    
    if [ -d "config" ]; then
        echo -e "${GREEN}✅ Directorio config: $(ls config/*.yaml 2>/dev/null | wc -l) archivos${NC}"
    else
        echo -e "${RED}❌ Directorio config: No encontrado${NC}"
    fi
    
    if [ -d "storage" ]; then
        echo -e "${GREEN}✅ Directorio storage: Existe${NC}"
        echo -e "${BLUE}  Espacio usado: $(du -sh storage/ 2>/dev/null | cut -f1)${NC}"
    else
        echo -e "${RED}❌ Directorio storage: No encontrado${NC}"
    fi
    
    echo ""
    
    # Último backup
    echo -e "${YELLOW}Último Backup:${NC}"
    if [ -d "storage/local" ] && [ "$(ls storage/local/backup-* 2>/dev/null | wc -l)" -gt 0 ]; then
        ultimo_backup=$(ls -t storage/local/backup-*/ 2>/dev/null | head -1)
        echo -e "${GREEN}✅ Último backup: $ultimo_backup${NC}"
        echo "  Fecha: $(stat -c %y "$ultimo_backup" 2>/dev/null | cut -d' ' -f1,2)"
        echo "  Tamaño: $(du -sh "$ultimo_backup" 2>/dev/null | cut -f1)"
    else
        echo -e "${YELLOW}⚠️  No se encontraron backups${NC}"
    fi
    
    echo ""
    
    # Permisos
    echo -e "${YELLOW}Permisos Críticos:${NC}"
    if [ -d "storage/claves" ] && [ "$(stat -c %a storage/claves/ 2>/dev/null)" = "700" ]; then
        echo -e "${GREEN}✅ storage/claves: 700 (Correcto)${NC}"
    else
        echo -e "${RED}❌ storage/claves: Permisos incorrectos${NC}"
    fi
    
    if [ -d "storage/credenciales" ] && [ "$(stat -c %a storage/credenciales/ 2>/dev/null)" = "700" ]; then
        echo -e "${GREEN}✅ storage/credenciales: 700 (Correcto)${NC}"
    else
        echo -e "${RED}❌ storage/credenciales: Permisos incorrectos${NC}"
    fi
}

# Función principal
main() {
    local comando="${1:-help}"
    local param1="${2}"
    local param2="${3}"
    
    case $comando in
        "install"|"setup")
            instalar_sistema
            ;;
        "backup")
            ejecutar_backup "$param1"
            ;;
        "proteccion")
            gestionar_proteccion "$param1"
            ;;
        "almacenamiento")
            gestionar_almacenamiento "$param1" "$param2"
            ;;
        "recuperacion")
            recuperar_sistema "$param1" "$param2"
            ;;
        "test")
            ejecutar_tests
            ;;
        "monitor")
            monitorear_sistema
            ;;
        "status")
            ver_estado
            ;;
        "help"|"--help"|"-h")
            mostrar_ayuda
            ;;
        *)
            echo -e "${RED}❌ Comando no reconocido: $comando${NC}"
            echo ""
            mostrar_ayuda
            exit 1
            ;;
    esac
}

# Verificar que estamos en el directorio correcto
if [ ! -f "$PROJECT_DIR/package.json" ]; then
    echo -e "${RED}❌ Error: No se encontró package.json${NC}"
    echo "   Asegúrese de ejecutar este script desde el directorio del proyecto"
    exit 1
fi

# Ejecutar función principal con todos los argumentos
main "$@"