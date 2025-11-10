#!/bin/bash

# Script de Restauración - Portal UGT Towa
# Fecha: 2025-11-10 23:24:21
# Backup: backup_version_2025_11_10/

set -e  # Salir en caso de error

echo "=== RESTAURACIÓN PORTAL UGT TOWA ==="
echo "Fecha: $(date)"
echo "Backup: backup_version_2025_11_10/"
echo ""

# Verificar que existe la carpeta de backup
if [ ! -d "backup_version_2025_11_10" ]; then
    echo "❌ Error: No se encuentra la carpeta backup_version_2025_11_10/"
    exit 1
fi

# Verificar que existe el proyecto en el backup
if [ ! -d "backup_version_2025_11_10/ugt-towa-portal" ]; then
    echo "❌ Error: No se encuentra ugt-towa-portal en el backup"
    exit 1
fi

echo "🔍 Verificando integridad del backup..."
echo ""

# Preguntar al usuario qué desea restaurar
echo "¿Qué desea restaurar?"
echo "1) Proyecto completo (código + Supabase + docs)"
echo "2) Solo el proyecto web (ugt-towa-portal)"
echo "3) Solo configuraciones de Supabase"
echo ""
read -p "Seleccione una opción (1-3): " option

case $option in
    1)
        echo "🔄 Restaurando proyecto completo..."
        
        # Hacer backup del proyecto actual si existe
        if [ -d "ugt-towa-portal" ]; then
            echo "📦 Creando backup del proyecto actual..."
            mv ugt-towa-portal ugt-towa-portal-$(date +%Y%m%d_%H%M%S)
        fi
        
        # Restaurar proyecto
        echo "📁 Copiando proyecto web..."
        cp -r backup_version_2025_11_10/ugt-towa-portal ./
        
        # Restaurar configuraciones de Supabase
        if [ -d "backup_version_2025_11_10/supabase" ]; then
            echo "🗄️ Restaurando configuraciones de Supabase..."
            cp -r backup_version_2025_11_10/supabase ./
        fi
        
        # Restaurar documentación
        if [ -d "backup_version_2025_11_10" ]; then
            echo "📚 Restaurando documentación..."
            cp backup_version_2025_11_10/*.md ./
        fi
        
        echo "✅ Proyecto completo restaurado"
        ;;
        
    2)
        echo "🔄 Restaurando solo el proyecto web..."
        
        # Hacer backup del proyecto actual si existe
        if [ -d "ugt-towa-portal" ]; then
            echo "📦 Creando backup del proyecto actual..."
            mv ugt-towa-portal ugt-towa-portal-$(date +%Y%m%d_%H%M%S)
        fi
        
        # Restaurar proyecto
        echo "📁 Copiando proyecto web..."
        cp -r backup_version_2025_11_10/ugt-towa-portal ./
        
        echo "✅ Proyecto web restaurado"
        ;;
        
    3)
        echo "🔄 Restaurando solo configuraciones de Supabase..."
        
        # Restaurar configuraciones de Supabase
        if [ -d "backup_version_2025_11_10/supabase" ]; then
            echo "🗄️ Restaurando configuraciones de Supabase..."
            rm -rf supabase 2>/dev/null || true
            cp -r backup_version_2025_11_10/supabase ./
            echo "✅ Configuraciones de Supabase restauradas"
        else
            echo "❌ No se encontraron configuraciones de Supabase en el backup"
            exit 1
        fi
        ;;
        
    *)
        echo "❌ Opción no válida"
        exit 1
        ;;
esac

# Instalar dependencias si se restauró el proyecto web
if [ -d "ugt-towa-portal" ]; then
    echo ""
    echo "📦 Instalando dependencias..."
    cd ugt-towa-portal
    
    if command -v pnpm &> /dev/null; then
        pnpm install
    elif command -v npm &> /dev/null; then
        npm install
    else
        echo "⚠️  Advertencia: No se encontró pnpm ni npm"
        echo "   Instale las dependencias manualmente"
    fi
    
    cd ..
fi

echo ""
echo "🎉 ¡Restauración completada!"
echo ""
echo "📋 Próximos pasos:"
if [ -d "ugt-towa-portal" ]; then
    echo "   1. Verificar que el código se restauró correctamente"
    echo "   2. Verificar configuraciones de Supabase"
    echo "   3. Probar la aplicación localmente"
    echo "   4. Reconstruir si es necesario: cd ugt-towa-portal && pnpm build"
fi
echo ""
echo "=== RESTAURACIÓN FINALIZADA ==="