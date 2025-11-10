# Guía de Instalación y Configuración
## Sistema de Backup y Protección UGT-TOWA

---

## 📋 Tabla de Contenidos

1. [Requisitos del Sistema](#requisitos-del-sistema)
2. [Instalación de Dependencias](#instalación-de-dependencias)
3. [Configuración Inicial](#configuración-inicial)
4. [Configuración de Protección](#configuración-de-protección)
5. [Configuración de Almacenamiento](#configuración-de-almacenamiento)
6. [Configuración de Backup](#configuración-de-backup)
7. [Configuración de Notificaciones](#configuración-de-notificaciones)
8. [Verificación de Instalación](#verificación-de-instalación)
9. [Configuración de Automatización](#configuración-de-automatización)
10. [Solución de Problemas](#solución-de-problemas)

---

## 💻 Requisitos del Sistema

### Requisitos Mínimos
- **Sistema Operativo**: Ubuntu 20.04+ / CentOS 8+ / Debian 11+
- **Node.js**: 18.0.0 o superior
- **Memoria RAM**: 4GB mínimo, 8GB recomendado
- **Espacio en Disco**: 20GB mínimo, 100GB recomendado
- **Conexión a Internet**: Banda ancha para sincronización con cloud

### Requisitos de Software
```bash
# Verificar versión de Node.js
node --version  # Debe ser >= 18.0.0

# Verificar versión de npm
npm --version   # Debe ser >= 8.0.0

# Verificar Git
git --version   # Debe estar instalado
```

### Dependencias del Sistema
```bash
# Ubuntu/Debian
sudo apt update
sudo apt install -y build-essential git curl wget zip unzip tar

# CentOS/RHEL
sudo yum update
sudo yum groupinstall -y "Development Tools"
sudo yum install -y git curl wget zip unzip tar
```

---

## 📦 Instalación de Dependencias

### 1. Instalar Node.js (si no está instalado)

#### En Ubuntu/Debian:
```bash
# Instalar Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verificar instalación
node --version
npm --version
```

#### En CentOS/RHEL:
```bash
# Instalar Node.js 18
curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
sudo yum install -y nodejs

# Verificar instalación
node --version
npm --version
```

### 2. Instalar Dependencias de Node.js
```bash
# Navegar al directorio del proyecto
cd sistema-replicacion-template/backup-protection

# Instalar dependencias
npm install

# Instalar dependencias globales necesarias
sudo npm install -g pm2
sudo npm install -g yarn
```

### 3. Verificar Dependencias
```bash
# Verificar instalación de módulos requeridos
node -e "console.log('✅ Node.js funcionando correctamente')"

# Verificar módulos específicos
node -e "
try {
    require('fs');
    require('path');
    require('crypto');
    require('yaml');
    require('child_process');
    console.log('✅ Todos los módulos requeridos están disponibles');
} catch (error) {
    console.error('❌ Módulo faltante:', error.message);
}
"
```

---

## ⚙️ Configuración Inicial

### 1. Estructura de Directorios
```bash
# Crear estructura de directorios
mkdir -p storage/{local,claves,credenciales,auditoria,reportes,metricas}
mkdir -p storage/cloud
mkdir -p storage/repo
mkdir -p config
mkdir -p docs
mkdir -p scripts

# Establecer permisos
chmod 755 storage
chmod 700 storage/claves
chmod 700 storage/credenciales
chmod 755 storage/auditoria
chmod 755 storage/reportes
```

### 2. Configuración de Permisos
```bash
# Crear grupo de usuarios para backup
sudo groupadd ugt-backup
sudo usermod -aG ugt-backup $USER

# Establecer permisos de grupo
sudo chgrp -R ugt-backup storage/
sudo chmod -R 750 storage/
sudo chmod -R 700 storage/claves/
sudo chmod -R 700 storage/credenciales/
sudo chmod 755 scripts/

# Hacer scripts ejecutables
chmod +x scripts/*.js
```

### 3. Configuración de Variables de Entorno
```bash
# Crear archivo de variables de entorno
cp config/.env.example config/.env

# Editar con valores reales
nano config/.env
```

**Ejemplo de .env:**
```bash
# Configuración general
NODE_ENV=production
LOG_LEVEL=info

# Base de datos
DB_HOST=localhost
DB_PORT=5432
DB_NAME=ugt_towa_production
DB_USER=ugt_admin
DB_PASSWORD=tu_password_seguro_aqui

# Claves de seguridad
JWT_SECRET=tu_jwt_secret_muy_seguro_aqui
ENCRYPTION_KEY=tu_encryption_key_32_chars
SESSION_SECRET=tu_session_secret_muy_largo

# Servicios externos
AWS_ACCESS_KEY=tu_access_key_aqui
AWS_SECRET_KEY=tu_secret_key_aqui
AWS_REGION=us-east-1
STORAGE_BUCKET=ugt-towa-backup

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=tu_email@gmail.com
SMTP_PASSWORD=tu_password_email

# Notificaciones
ADMIN_EMAIL=admin@ugt-towa.org
SLACK_WEBHOOK=tu_slack_webhook_url
DISCORD_WEBHOOK=tu_discord_webhook_url
```

---

## 🔐 Configuración de Protección

### 1. Inicializar Sistema de Protección
```bash
# Ejecutar inicialización
node scripts/sistema-proteccion.js inicializar config/proteccion-config.yaml
```

**Durante la inicialización se pedirá:**
- Passphrase para la clave maestra
- Confirmación de la passphrase
- Verificación de permisos

### 2. Configurar Credenciales Seguras
```bash
# Establecer credenciales de base de datos
node scripts/sistema-proteccion.js establecer-credencial baseDatos postgres password 'password_real'
node scripts/sistema-proteccion.js establecer-credencial baseDatos mongodb password 'password_mongo'

# Establecer claves del sistema
node scripts/sistema-proteccion.js establecer-credencial sistema jwtSecret 'jwt_secret_value'
node scripts/sistema-proteccion.js establecer-credencial sistema encryptionKey 'encryption_key_32_chars'

# Establecer credenciales de servicios
node scripts/sistema-proteccion.js establecer-credencial servicios email apiKey 'email_api_key'
node scripts/sistema-proteccion.js establecer-credencial servicios storage accessKey 'aws_access_key'
```

### 3. Verificar Sistema de Protección
```bash
# Verificar integridad
node scripts/sistema-proteccion.js verificar-integridad

# Generar reporte de seguridad
node scripts/sistema-proteccion.js reporte-seguridad
```

---

## ☁️ Configuración de Almacenamiento

### 1. Configurar Almacenamiento Local
```yaml
# En config/almacenamiento-config.yaml
ubicaciones:
  local:
    habilitada: true
    rutaBase: './storage/local'
    subdirectorios:
      - 'principal'
      - 'respaldo'
      - 'temporal'
    rotacion: 30
    espacioMinimo: '1GB'
```

### 2. Configurar Repositorio Git
```bash
# Inicializar repositorio de backup (si no existe)
cd storage/repo
git init
git config user.name "UGT-TOWA Backup System"
git config user.email "backup@ugt-towa.org"

# Crear archivo .gitignore
cat > .gitignore << EOF
*.log
*.tmp
node_modules/
.env*
*.key
*.pem
EOF

git add .
git commit -m "Inicializar repositorio de backup"
```

### 3. Configurar Cloud Storage (AWS S3)
```bash
# Instalar AWS CLI
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
sudo ./aws/install

# Configurar credenciales AWS
aws configure
# Proporcionar:
# - AWS Access Key ID
# - AWS Secret Access Key
# - Default region name (ej: us-east-1)
# - Default output format (ej: json)

# Verificar configuración
aws s3 ls
```

### 4. Crear Buckets de S3 (si es necesario)
```bash
# Crear bucket principal
aws s3 mb s3://ugt-towa-backup-principal

# Crear bucket de respaldo
aws s3 mb s3://ugt-towa-backup-respaldo

# Configurar encriptación
aws s3api put-bucket-encryption \
  --bucket ugt-towa-backup-principal \
  --server-side-encryption-configuration '{
    "Rules": [{
      "ApplyServerSideEncryptionByDefault": {
        "SSEAlgorithm": "AES256"
      }
    }]
  }'

# Configurar lifecycle (opcional)
aws s3api put-bucket-lifecycle-configuration \
  --bucket ugt-towa-backup-principal \
  --lifecycle-configuration '{
    "Rules": [{
      "ID": "LifecycleRule",
      "Status": "Enabled",
      "Transitions": [{
        "Days": 30,
        "StorageClass": "STANDARD_IA"
      }, {
        "Days": 90,
        "StorageClass": "GLACIER"
      }]
    }]
  }'
```

### 5. Verificar Configuración de Almacenamiento
```bash
# Test de conexión local
node scripts/sistema-almacenamiento.js test-local

# Test de conexión Git
cd storage/repo && git status

# Test de conexión S3
aws s3 ls s3://ugt-towa-backup-principal/
```

---

## 💾 Configuración de Backup

### 1. Personalizar Configuración de Backup
```bash
# Editar configuración de backup
nano config/backup-config.yaml
```

**Configuraciones importantes a revisar:**
```yaml
backup:
  rutaLocal: './storage/local'  # Cambiar si es necesario
  mantenerBackups: 30           # Número de backups a mantener
  comprimir: true               # Habilitar compresión
  encriptar: true               # Habilitar encriptación

versionado:
  sistemaGit: true              # Usar Git para versionado
  tags: true                    # Crear tags
  pushAutomatico: true          # Push automático

programacion:
  frecuencia: 'diario'          # Frecuencia de backup
  hora: '02:00'                 # Hora de ejecución
  diasSemana: [1,2,3,4,5,6,7]  # Días de la semana
```

### 2. Configurar Rutas de Backup
```yaml
# Definir qué incluir y excluir
backup:
  rutasIncluir:
    - './template-base'
    - './herramientas'
    - './plantillas'
    - './documentacion'
    - './backup-protection'
  
  rutasExcluir:
    - 'node_modules'
    - '.git'
    - 'dist'
    - '*.log'
    - '.env*'
    - 'backup-*'
```

### 3. Configurar Base de Datos
```yaml
# Configurar backup de base de datos
baseDatos:
  incluir: true
  tipos:
    - 'postgres'
    - 'mongodb'
  
  postgres:
    host: '${DB_HOST}'
    port: '${DB_PORT}'
    database: '${DB_NAME}'
    user: '${DB_USER}'
    password: '${DB_PASSWORD}'
```

### 4. Test de Backup Completo
```bash
# Ejecutar backup de prueba
node scripts/backup-automatico.js config/backup-config.yaml
```

**Si todo funciona correctamente, debería ver:**
```
🚀 Iniciando proceso de backup automático...
📁 Directorio de backup creado: ./storage/local/backup-2024-11-11-...
💻 Iniciando backup de código fuente...
🗄️  Iniciando backup de base de datos...
⚙️  Iniciando backup de configuraciones...
📄 Iniciando backup de archivos estáticos...
🔐 Generando hashes de integridad...
🗜️  Comprimiendo backup...
✅ Backup completado exitosamente
```

---

## 📧 Configuración de Notificaciones

### 1. Configurar Email (SMTP)
```yaml
# En config/backup-config.yaml
notificacion:
  email: true
  emailAdministrador: '${ADMIN_EMAIL}'
  
  smtp:
    host: '${SMTP_HOST}'
    puerto: '${SMTP_PORT}'
    usuario: '${SMTP_USER}'
    password: '${SMTP_PASSWORD}'
    usarTLS: true
```

### 2. Configurar Webhooks
```yaml
notificacion:
  webhooks:
    - '${WEBHOOK_SLACK}'
    - '${WEBHOOK_DISCORD}'
```

### 3. Configurar Slack
```bash
# Crear webhook de Slack
# 1. Ir a https://api.slack.com/apps
# 2. Crear nueva app
# 3. Activar Incoming Webhooks
# 4. Crear webhook para canal #backups
# 5. Copiar URL del webhook
```

### 4. Configurar Discord
```bash
# Crear webhook de Discord
# 1. Ir a configuración del servidor
# 2. Integraciones > Webhooks
# 3. Crear webhook para canal #sistema
# 4. Copiar URL del webhook
```

### 5. Test de Notificaciones
```bash
# Test de email
echo "Test de configuración de email" | mail -s "Test Backup System" admin@ugt-towa.org

# Test de webhook
curl -X POST -H 'Content-type: application/json' \
  --data '{"text":"Test de webhook desde sistema de backup"}' \
  $WEBHOOK_SLACK
```

---

## ✅ Verificación de Instalación

### 1. Verificación de Integridad del Sistema
```bash
# Ejecutar verificación completa
node scripts/sistema-proteccion.js verificar-integridad
```

### 2. Test de Backup Completo
```bash
# Ejecutar backup de prueba completo
node scripts/coordinador-backup.js completo
```

**Resultado esperado:**
```
🚀 Iniciando proceso completo de backup y protección
🆔 ID del proceso: backup-20241111-1234567890
🔧 FASE 1: Preparación del sistema
💾 FASE 2: Backup automático con versionado
☁️  FASE 3: Almacenamiento en múltiples ubicaciones
🔐 FASE 4: Verificación de protección de datos
🧹 FASE 5: Limpieza y optimización
📊 FASE 6: Generación de reportes consolidados
📧 FASE 7: Notificaciones finales
✅ Proceso completo de backup y protección finalizado exitosamente
```

### 3. Verificar Archivos Generados
```bash
# Verificar backups creados
ls -la storage/local/backup-*/
cat storage/reportes/reporte_consolidado_*.json

# Verificar integridad
node scripts/sistema-proteccion.js reporte-seguridad
```

### 4. Test de Recuperación (opcional)
```bash
# Test de recuperación en entorno de pruebas
# (Solo en entorno de pruebas, NO en producción)
node scripts/coordinador-backup.js recuperacion storage/local/backup-*.tar.gz
```

---

## ⏰ Configuración de Automatización

### 1. Configurar Cron para Backup Automático
```bash
# Editar crontab
crontab -e

# Agregar línea para backup diario a las 2:00 AM
0 2 * * * cd /ruta/completa/sistema-replicacion-template/backup-protection && node scripts/coordinador-backup.js completo >> storage/logs/cron-backup.log 2>&1

# Backup adicional dominical a las 3:00 AM
0 3 * * 0 cd /ruta/completa/sistema-replicacion-template/backup-protection && node scripts/backup-automatico.js config/backup-config.yaml >> storage/logs/cron-backup-additional.log 2>&1

# Rotación de claves mensual (día 1 de cada mes a las 1:00 AM)
0 1 1 * * cd /ruta/completa/sistema-replicacion-template/backup-protection && node scripts/sistema-proteccion.js rotar-claves >> storage/logs/cron-rotation.log 2>&1

# Reporte de seguridad semanal (domingo a las 4:00 AM)
0 4 * * 0 cd /ruta/completa/sistema-replicacion-template/backup-protection && node scripts/sistema-proteccion.js reporte-seguridad >> storage/logs/cron-security-report.log 2>&1
```

### 2. Configurar Rotación de Logs
```bash
# Crear archivo de configuración de logrotate
sudo nano /etc/logrotate.d/ugt-backup
```

**Contenido del archivo:**
```
/ruta/completa/sistema-replicacion-template/backup-protection/storage/logs/*.log {
    daily
    rotate 30
    compress
    delaycompress
    missingok
    notifempty
    create 644 www-data www-data
    postrotate
        # Opcional: reiniciar aplicación si es necesario
    endscript
}
```

### 3. Configurar PM2 para Monitoreo
```bash
# Crear archivo de configuración PM2
nano ecosystem.config.js
```

**Contenido:**
```javascript
module.exports = {
  apps: [{
    name: 'ugt-backup-monitor',
    script: 'scripts/monitor-backup.js',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      LOG_LEVEL: 'info'
    },
    log_file: './storage/logs/pm2-backup.log',
    out_file: './storage/logs/pm2-backup-out.log',
    error_file: './storage/logs/pm2-backup-error.log',
    time: true
  }]
};
```

**Iniciar con PM2:**
```bash
# Instalar PM2 globally (si no está instalado)
npm install -g pm2

# Iniciar aplicación de monitoreo
pm2 start ecosystem.config.js

# Configurar para inicio automático
pm2 startup
pm2 save
```

### 4. Configurar Alertas del Sistema
```bash
# Script para verificar espacio en disco
nano scripts/verificar-espacio.sh

#!/bin/bash
UMbral=90
Espacio=$(df / | grep -vE '^Filesystem|tmpfs|cdrom' | awk '{ print $5 }' | cut -d'%' -f1)
if [ $Espacio -gt $UMbral ]; then
    echo "ALERTA: Espacio en disco al ${Espacio}%" | mail -s "Alerta Espacio en Disco UGT-TOWA" admin@ugt-towa.org
fi
```

**Agregar a crontab:**
```bash
# Verificar espacio cada 30 minutos
*/30 * * * * /ruta/completa/sistema-replicacion-template/backup-protection/scripts/verificar-espacio.sh
```

---

## 🔧 Solución de Problemas

### Problemas Comunes

#### 1. Error de Permisos
```bash
# Problema: Permission denied al acceder a archivos
# Solución:
sudo chown -R www-data:www-data /ruta/sistema-replicacion-template/backup-protection/
sudo chmod -R 755 /ruta/sistema-replicacion-template/backup-protection/
sudo chmod 700 /ruta/sistema-replicacion-template/backup-protection/storage/claves/
```

#### 2. Error de Dependencias de Node.js
```bash
# Problema: Module not found
# Solución:
cd /ruta/sistema-replicacion-template/backup-protection
rm -rf node_modules package-lock.json
npm install

# O instalar dependencias faltantes individualmente
npm install fs path crypto yaml child_process
```

#### 3. Error de Conexión a Base de Datos
```bash
# Problema: Cannot connect to database
# Solución:
# Verificar credenciales en config/.env
# Verificar que PostgreSQL esté ejecutándose
sudo systemctl status postgresql
sudo systemctl start postgresql

# Test de conexión manual
psql -h localhost -U ugt_admin -d ugt_towa_production
```

#### 4. Error de Cloud Storage
```bash
# Problema: AWS credentials not found
# Solución:
aws configure
# O configurar variables de entorno
export AWS_ACCESS_KEY_ID=tu_access_key
export AWS_SECRET_ACCESS_KEY=tu_secret_key
```

#### 5. Error de Git
```bash
# Problema: git push failed
# Solución:
# Verificar configuración de git
git config --list
git config user.name "UGT-TOWA Backup System"
git config user.email "backup@ugt-towa.org"

# Verificar remote
git remote -v
git remote set-url origin nueva_url_del_repo
```

### Logs de Diagnóstico
```bash
# Ver logs del sistema de backup
tail -f storage/logs/backup-*.log

# Ver logs de errores
tail -f storage/logs/error-*.log

# Ver logs de cron
tail -f /var/log/cron

# Ver logs de sistema
journalctl -u cron
journalctl -f
```

### Comandos de Diagnóstico
```bash
# Verificar estado del sistema
node scripts/diagnostico-sistema.js

# Verificar configuración
node scripts/verificar-configuracion.js

# Test de conectividad
node scripts/test-conectividad.js

# Verificar integridad de archivos
find . -name "*.js" -exec node -c {} \;
```

### Contacto para Soporte
- **Email**: support@ugt-towa.org
- **Slack**: #backup-support
- **Documentación**: Ver `docs/` directory
- **Logs**: Revisar `storage/logs/` directory

---

## ✅ Checklist de Instalación Completa

- [ ] Node.js 18+ instalado
- [ ] Dependencias npm instaladas
- [ ] Estructura de directorios creada
- [ ] Permisos configurados correctamente
- [ ] Variables de entorno configuradas
- [ ] Sistema de protección inicializado
- [ ] Credenciales seguras almacenadas
- [ ] Almacenamiento local configurado
- [ ] Repositorio Git configurado
- [ ] Cloud storage (AWS S3) configurado
- [ ] Backup de prueba ejecutado exitosamente
- [ ] Notificaciones configuradas y probadas
- [ ] Cron jobs configurados
- [ ] Verificación de instalación completada
- [ ] Documentación revisada
- [ ] Equipo capacitado en el sistema

**¡Felicidades! El sistema de backup y protección está completamente instalado y configurado.**