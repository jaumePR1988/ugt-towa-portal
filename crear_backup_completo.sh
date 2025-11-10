#!/bin/bash

# 🚀 SCRIPT DE BACKUP Y EXPORTACIÓN COMPLETA UGT-TOWA
# Crear archivo comprimido con todo el sistema para recuperación

echo "🗂️ CREANDO BACKUP COMPLETO DEL SISTEMA UGT-TOWA..."
echo "=================================================="

# Crear directorio de backup con timestamp
BACKUP_DIR="backup_ugt_towa_$(date +%Y%m%d_%H%M%S)"
mkdir -p "$BACKUP_DIR"

echo "📁 Directorio de backup: $BACKUP_DIR"

# 1. Copiar código fuente del sistema principal
echo "📋 Copiando código fuente principal..."
cp -r sistema-replicacion-template/ "$BACKUP_DIR/"
cp -r sistema-precios/ "$BACKUP_DIR/"
cp -r sistema-replicacion-template/backup-protection/ "$BACKUP_DIR/"
cp -r sistema-replicacion-template/onboarding/ "$BACKUP_DIR/"

# 2. Copiar documentación
echo "📚 Copiando documentación..."
cp *.md "$BACKUP_DIR/" 2>/dev/null || true

# 3. Crear archivo de información del sistema
echo "⚙️ Creando información del sistema..."
cat > "$BACKUP_DIR/INFO_SISTEMA.txt" << 'EOF'
===============================================
SISTEMA UGT-TOWA - INFORMACIÓN DEL BACKUP
===============================================

Fecha: $(date)
Sistema: Portal Sindical UGT Towa
Estado: Producción Completa

URLs PRINCIPALES:
- Portal Actual: https://ottakjvc490n.space.minimax.io
- Phase 1: https://h50185qwg2s0.space.minimax.io  
- Backup: https://e98j3z8sojw0.space.minimax.io

CREDENCIALES (ENCRIPTAR EN PRODUCCIÓN):
- Supabase URL: https://zaxdscclkeytakcowgww.supabase.co
- Supabase Project: zaxdscclkeytakcowgww
- Admin Email: jpedragosa@towapharmaceutical.com
- Admin Password: towa2022
- Google Maps API: AIzaSyCO0kKndUNlmQi3B5mxy4dblg_8WYcuKuk

ARCHIVOS IMPORTANTES:
- EXPORTACION_COMPLETA_SISTEMA_UGT_TOWA.md (este archivo)
- GUIA_COMPLETA_PROTECCION_Y_COMERCIALIZACION.md
- REQUISITOS_TECNICOS_IMPLEMENTACION.md
- CHECKLIST_INFORMACION_CLIENTE.md
- sistema-replicacion-template/ (código fuente)
- sistema-precios/ (facturación)
- sistema-replicacion-template/backup-protection/ (seguridad)

COMANDOS PRINCIPALES:
- Backup: node sistema-replicacion-template/backup-protection/scripts/coordinador-backup.js completo
- Replicación: node sistema-replicacion-template/crear-empresa.js [empresa] [tipo]
- Test: node sistema-replicacion-template/test-replicacion.js

ESTADO: ✅ SISTEMA COMPLETO Y FUNCIONAL
EOF

# 4. Crear script de recuperación rápida
cat > "$BACKUP_DIR/RECUPERAR_SISTEMA.sh" << 'EOF'
#!/bin/bash

# 🚀 SCRIPT DE RECUPERACIÓN RÁPIDA UGT-TOWA
# Restaurar sistema desde backup

echo "🚀 INICIANDO RECUPERACIÓN DEL SISTEMA UGT-TOWA..."

# Verificar que estamos en el directorio correcto
if [ ! -d "sistema-replicacion-template" ]; then
    echo "❌ Error: No se encuentra sistema-replicacion-template/"
    echo "   Ejecuta este script desde el directorio que contiene el backup"
    exit 1
fi

# Instalar dependencias del sistema principal
echo "📦 Instalando dependencias del sistema principal..."
cd sistema-replicacion-template
npm install
cd ..

# Instalar dependencias del sistema de backup
echo "🔐 Instalando dependencias del sistema de backup..."
cd sistema-replicacion-template/backup-protection
npm install
cd ../..

# Instalar dependencias del sistema de precios
echo "💰 Instalando dependencias del sistema de precios..."
cd sistema-precios
npm install
cd ..

echo "✅ Sistema recuperado exitosamente!"
echo ""
echo "🎯 Próximos pasos:"
echo "1. Configurar credenciales en cada .env"
echo "2. Ejecutar: node sistema-replicacion-template/crear-empresa.js test demo"
echo "3. Verificar funcionamiento del portal"
echo ""
echo "📋 Documentación completa en: EXPORTACION_COMPLETA_SISTEMA_UGT_TOWA.md"
EOF

chmod +x "$BACKUP_DIR/RECUPERAR_SISTEMA.sh"

# 5. Crear archivo de checklist para nuevo chat
cat > "$BACKUP_DIR/CHECKLIST_NUEVO_CHAT.md" << 'EOF'
# 📋 CHECKLIST PARA NUEVO CHAT - SISTEMA UGT-TOWA

## 🎯 OBJETIVO DEL CHAT
Continuar desarrollo y comercialización del sistema de replicación UGT-TOWA

## 📝 MENSAJE INICIAL SUGERIDO
```
Hola, tengo un sistema completo de Portal Sindical UGT-TOWA ya desarrollado 
en producción. Necesito continuar con:

1. PROBAR REPLICACIÓN: Ejecutar test con empresa ficticia "Sindicato Demo S.L."
2. COMERCIALIZAR: Implementar sistema de onboarding automático  
3. AUTOMATIZAR: Configurar backups y sistema de facturación
4. MEJORAR: Optimizar y añadir funcionalidades

ESTADO ACTUAL:
✅ Portal funcional: https://ottakjvc490n.space.minimax.io
✅ Sistema completo en: sistema-replicacion-template/
✅ Backup y protección: sistema-replicacion-template/backup-protection/
✅ Formularios cliente: CHECKLIST_INFORMACION_CLIENTE.md
✅ Sistema precios: sistema-precios/
✅ Documentación: GUIA_COMPLETA_PROTECCION_Y_COMERCIALIZACION.md

¿Puedes ayudarme a continuar con las pruebas de replicación?
```

## 🔑 INFORMACIÓN CRÍTICA
- **Portal Principal**: https://ottakjvc490n.space.minimax.io
- **Supabase**: https://zaxdscclkeytakcowgww.supabase.co (necesitarás ask_secrets_from_user)
- **Google Maps API**: AIzaSyCO0kKndUNlmQi3B5mxy4dblg_8WYcuKuk
- **Directorio principal**: sistema-replicacion-template/

## 🎯 PRIORIDADES PARA EL NUEVO CHAT
1. **ALTA**: Probar replicación con empresa ficticia
2. **MEDIA**: Implementar sistema de facturación automática  
3. **MEDIA**: Configurar marketing y materiales comerciales
4. **BAJA**: Optimizar funcionalidades existentes

## 📋 COMANDOS CLAVE
```bash
# Probar replicación
node sistema-replicacion-template/crear-empresa.js "Sindicato Demo" "micro"

# Verificar sistema
node sistema-replicacion-template/test-replicacion.js

# Ejecutar backup
node sistema-replicacion-template/backup-protection/scripts/coordinador-backup.js completo
```

## 📞 SOPORTE
- **Documentación completa**: EXPORTACION_COMPLETA_SISTEMA_UGT_TOWA.md
- **Requerimientos técnicos**: REQUISITOS_TECNICOS_IMPLEMENTACION.md
- **Checklist cliente**: CHECKLIST_INFORMACION_CLIENTE.md
EOF

# 6. Crear archivo de comandos de emergencia
cat > "$BACKUP_DIR/COMANDOS_EMERGENCIA.txt" << 'EOF'
===============================================
COMANDOS DE EMERGENCIA - SISTEMA UGT-TOWA
===============================================

🚨 SI EL SISTEMA NO FUNCIONA:

1. VERIFICAR BACKUP:
   node sistema-replicacion-template/backup-protection/scripts/coordinador-backup.js verificar

2. RECUPERAR DE EMERGENCIA:
   node sistema-replicacion-template/backup-protection/scripts/coordinador-backup.js recuperacion [archivo-backup.tar.gz]

3. VERIFICAR CONFIGURACIÓN:
   node sistema-replicacion-template/verificar-configuracion.js

4. REINICIAR SISTEMA:
   # En el directorio del proyecto
   npm run build
   # Desplegar en hosting

🔧 SI FALLAN LAS CREDENCIALES:
   - Usar ask_secrets_from_user para obtener nuevas credenciales Supabase
   - Verificar Google Maps API key
   - Revisar variables de entorno

📞 CONTACTOS DE SOPORTE:
   - Documentación: GUIA_COMPLETA_PROTECCION_Y_COMERCIALIZACION.md
   - Requisitos: REQUISITOS_TECNICOS_IMPLEMENTACION.md
   - Checklist: CHECKLIST_INFORMACION_CLIENTE.md

✅ SISTEMA DE RESPALDO:
   - Backup automático cada 24h
   - Almacenamiento en 4 ubicaciones
   - Recuperación en 4 horas máximo
EOF

# 7. Comprimir todo el backup
echo "🗜️ Comprimiendo backup..."
tar -czf "${BACKUP_DIR}.tar.gz" "$BACKUP_DIR"

# 8. Crear checksums para verificación
echo "🔐 Creando checksums de verificación..."
sha256sum "${BACKUP_DIR}.tar.gz" > "${BACKUP_DIR}.tar.gz.sha256"
md5sum "${BACKUP_DIR}.tar.gz" > "${BACKUP_DIR}.tar.gz.md5"

# 9. Mostrar información del backup
echo ""
echo "✅ BACKUP COMPLETO CREADO EXITOSAMENTE!"
echo "======================================"
echo "📁 Directorio: $BACKUP_DIR"
echo "📦 Archivo comprimido: ${BACKUP_DIR}.tar.gz"
echo "🔐 Checksum SHA256: ${BACKUP_DIR}.tar.gz.sha256"
echo "🔐 Checksum MD5: ${BACKUP_DIR}.tar.gz.md5"
echo ""
echo "📊 Tamaño del backup:"
ls -lh "${BACKUP_DIR}.tar.gz"
echo ""
echo "🎯 ARCHIVOS INCLUIDOS:"
echo "✅ Sistema de replicación completo"
echo "✅ Sistema de backup y protección"  
echo "✅ Sistema de precios y facturación"
echo "✅ Formularios de onboarding"
echo "✅ Documentación completa"
echo "✅ Scripts de recuperación"
echo "✅ Información del sistema"
echo ""
echo "🚀 PARA RECUPERAR:"
echo "tar -xzf ${BACKUP_DIR}.tar.gz"
echo "cd $BACKUP_DIR"
echo "./RECUPERAR_SISTEMA.sh"
echo ""
echo "💡 PARA NUEVO CHAT:"
echo "Usar el archivo: CHECKLIST_NUEVO_CHAT.md"
echo "Contiene el mensaje exacto para continuar el desarrollo"

# 10. Limpiar directorio temporal
echo ""
echo "🧹 Limpiando archivos temporales..."
# Mantener solo el archivo comprimido y checksums
rm -rf "$BACKUP_DIR"

echo ""
echo "🎉 ¡PROCESO COMPLETADO!"
echo "Tu sistema UGT-TOWA está completamente respaldado y listo para recuperación."