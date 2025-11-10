# Manual de Recuperación de Emergencia
## Sistema de Backup y Protección UGT-TOWA

---

## 📋 Tabla de Contenidos

1. [Introducción](#introducción)
2. [Escenarios de Emergencia](#escenarios-de-emergencia)
3. [Preparación para la Recuperación](#preparación-para-la-recuperación)
4. [Procedimientos de Recuperación](#procedimientos-de-recuperación)
5. [Recuperación por Ubicaciones](#recuperación-por-ubicaciones)
6. [Verificación Post-Recuperación](#verificación-post-recuperación)
7. [Comandos de Emergencia](#comandos-de-emergencia)
8. [Contactos de Soporte](#contactos-de-soporte)

---

## 🚨 Introducción

Este manual proporciona procedimientos detallados para la recuperación de emergencia del sistema de replicación UGT-TOWA en caso de fallas críticas, pérdida de datos, o desastres que afecten la operación normal del sistema.

### Objetivo
- **RTO (Recovery Time Objective)**: 4 horas máximo
- **RPO (Recovery Point Objective)**: 24 horas máximo de pérdida de datos
- **Disponibilidad objetivo**: 99.5%

### ⚠️ ADVERTENCIAS CRÍTICAS
- **NUNCA** ejecute procedimientos de recuperación sin autorización
- **SIEMPRE** documente todas las acciones realizadas
- **VERIFIQUE** la integridad de los backups antes de iniciar
- **COMUNIQUE** el inicio de recuperación a todos los stakeholders

---

## 🔥 Escenarios de Emergencia

### Escenario 1: Falla Completa del Servidor
**Síntomas:**
- Servidor inaccesible
- Pérdida de energía
- Hardware dañado
- Catástrofe natural

**Impacto**: Sistema completamente inoperativo
**Prioridad**: CRÍTICA

### Escenario 2: Corrupción de Base de Datos
**Síntomas:**
- Errores de conexión a BD
- Datos inconsistentes
- Tablas corruptas
- Logs de errores de base de datos

**Impacto**: Funcionalidad de datos comprometida
**Prioridad**: ALTA

### Escenario 3: Compromiso de Seguridad
**Síntomas:**
- Acceso no autorizado detectado
- Credenciales comprometidas
- Modificaciones maliciosas
- Alertas de seguridad

**Impacto**: Seguridad del sistema comprometida
**Prioridad**: CRÍTICA

### Escenario 4: Falla de Actualización
**Síntomas:**
- Sistema no inicia después de actualización
- Errores de aplicación
- Funcionalidades rotas
- Configuraciones incorrectas

**Impacto**: Funcionalidad parcialmente disponible
**Prioridad**: MEDIA

### Escenario 5: Pérdida de Conectividad
**Síntomas:**
- Servicios cloud inaccesibles
- Problemas de red
- DNS no funciona
- APIs no responden

**Impacto**: Funcionalidad limitada o degradada
**Prioridad**: MEDIA

---

## 🛠️ Preparación para la Recuperación

### Kit de Herramientas de Emergencia
Antes de cualquier emergencia, asegúrese de tener disponible:

```bash
# Herramientas del sistema
- Node.js (versión 18+)
- Git
- Acceso SSH
- Cliente FTP/SFTP
- Navegador web actualizado

# Scripts de recuperación
- coordinador-backup.js
- backup-automatico.js
- sistema-proteccion.js
- sistema-almacenamiento.js

# Configuraciones
- backup-config.yaml
- proteccion-config.yaml
- almacenamiento-config.yaml

# Credenciales de acceso
- Passphrase de clave maestra
- Credenciales de administrador
- Tokens de API
- Claves de acceso a cloud
```

### Verificación de Accesos
Antes de iniciar la recuperación, verifique:

1. **Acceso físico al servidor**
   - ¿Puede acceder al centro de datos?
   - ¿Tiene las credenciales necesarias?

2. **Acceso remoto**
   - ¿SSH funciona?
   - ¿Puede acceder por VPN?
   - ¿Los DNS resuelven correctamente?

3. **Credenciales**
   - ¿Tiene la clave maestra?
   - ¿Conoce las contraseñas de admin?
   - ¿Tiene acceso a los servicios de almacenamiento?

---

## 🔄 Procedimientos de Recuperación

### Procedimiento 1: Recuperación Completa del Sistema

#### Paso 1: Evaluación Inicial (15 min)
```bash
# Verificar estado del servidor
ping -c 3 ugt-towa-servidor
ssh admin@ugt-towa-servidor "uptime && df -h"

# Verificar servicios críticos
systemctl status nginx
systemctl status postgresql
systemctl status nodejs

# Verificar logs
tail -50 /var/log/nginx/error.log
tail -50 /var/log/postgresql/postgresql-*.log
```

#### Paso 2: Identificación del Backup (10 min)
```bash
# Listar backups disponibles
ls -la /storage/local/
ls -la /storage/cloud/
git tag | grep backup

# Verificar integridad
node backup-protection/scripts/sistema-proteccion.js verificar-integridad
```

#### Paso 3: Descarga del Backup (30-60 min)
```bash
# Descargar desde cloud storage
aws s3 sync s3://ugt-towa-backup-principal/backups/ ./downloads/

# O desde repositorio Git
git clone backup-repo /tmp/restore
cd /tmp/restore
git checkout backup-[timestamp]

# Verificar hash de integridad
sha256sum backup-*.tar.gz
```

#### Paso 4: Preparación del Entorno (20 min)
```bash
# Crear directorio de restauración
mkdir -p /tmp/restauracion
cd /tmp/restauracion

# Detener servicios
sudo systemctl stop nginx
sudo systemctl stop postgresql
sudo systemctl stop ugt-towa-app

# Respaldar estado actual (por si acaso)
sudo cp -r /var/www/ugt-towa /var/www/ugt-towa-backup-emergencia
```

#### Paso 5: Desencriptación y Extracción (15 min)
```bash
# Desencriptar backup
node backup-protection/scripts/sistema-proteccion.js desencriptar backup-*.tar.gz.enc

# Extraer backup
tar -xzf backup-*.tar.gz
cd backup-*/

# Verificar contenido
ls -la
```

#### Paso 6: Restauración de Archivos (30 min)
```bash
# Restaurar código fuente
cp -r template-base/* /var/www/ugt-towa/
cp -r herramientas/* /var/www/ugt-towa/tools/
cp -r plantillas/* /var/www/ugt-towa/templates/
cp -r documentacion/* /var/www/ugt-towa/docs/

# Restaurar configuraciones
cp config/* /var/www/ugt-towa/config/

# Establecer permisos
chown -R www-data:www-data /var/www/ugt-towa
chmod -R 755 /var/www/ugt-towa
```

#### Paso 7: Restauración de Base de Datos (45 min)
```bash
# Restaurar PostgreSQL
sudo systemctl start postgresql
sudo -u postgres createdb ugt_towa_restauracion
sudo -u postgres psql ugt_towa_restauracion < database/postgres_backup_*.sql

# Verificar restauración
sudo -u postgres psql ugt_towa_restauracion -c "\\dt"
```

#### Paso 8: Configuración de Servicios (20 min)
```bash
# Configurar variables de entorno
cp .env.example .env
nano .env  # Editar con credenciales correctas

# Reiniciar servicios
sudo systemctl start ugt-towa-app
sudo systemctl start nginx
sudo systemctl start postgresql

# Verificar estado
systemctl status nginx
systemctl status ugt-towa-app
```

#### Paso 9: Verificación Final (15 min)
```bash
# Verificar conectividad web
curl -I http://localhost

# Verificar base de datos
sudo -u postgres psql ugt_towa_restauracion -c "SELECT COUNT(*) FROM profiles;"

# Verificar logs
tail -50 /var/log/nginx/access.log
tail -50 /var/log/ugt-towa/app.log
```

### Procedimiento 2: Recuperación de Base de Datos Únicamente

#### Cuando solo se corrupte la base de datos:

```bash
# 1. Detener aplicación
sudo systemctl stop ugt-towa-app

# 2. Respaldar BD corrupta (para análisis)
sudo -u postgres pg_dump ugt_towa_production > /tmp/bd_corrupta_$(date +%Y%m%d_%H%M%S).sql

# 3. Restaurar desde backup
sudo -u postgres dropdb ugt_towa_production
sudo -u postgres createdb ugt_towa_production
sudo -u postgres psql ugt_towa_production < /storage/local/database/postgres_backup_*.sql

# 4. Verificar integridad
sudo -u postgres psql ugt_towa_production -c "SELECT version();"
sudo -u postgres psql ugt_towa_production -c "\\dt"

# 5. Reiniciar aplicación
sudo systemctl start ugt-towa-app

# 6. Verificar funcionamiento
curl -I http://localhost/health
```

### Procedimiento 3: Recuperación de Archivos de Configuración

#### Cuando solo se pierdan configuraciones:

```bash
# 1. Identificar backup de config
ls -la /storage/local/backup-*/config/

# 2. Extraer solo configuraciones
tar -xzf /storage/local/backup-*.tar.gz --wildcards '*/config/*'

# 3. Restaurar configuraciones
cp backup-*/config/* /var/www/ugt-towa/config/

# 4. Verificar sintaxis
node -c /var/www/ugt-towa/config/database.js
node -c /var/www/ugt-towa/config/auth.js

# 5. Reiniciar servicios
sudo systemctl restart ugt-towa-app
```

---

## ☁️ Recuperación por Ubicaciones

### Desde Almacenamiento Local

```bash
# 1. Localizar backup más reciente
ls -lt /storage/local/backup-*/ | head -1

# 2. Verificar integridad
node backup-protection/scripts/sistema-proteccion.js verificar-integridad

# 3. Restaurar
node backup-protection/scripts/coordinador-backup.js recuperacion /storage/local/backup-latest.tar.gz local
```

### Desde Cloud Storage (AWS S3)

```bash
# 1. Configurar credenciales AWS
aws configure

# 2. Listar backups disponibles
aws s3 ls s3://ugt-towa-backup-principal/backups/

# 3. Descargar backup
aws s3 cp s3://ugt-towa-backup-principal/backups/backup-latest.tar.gz ./

# 4. Verificar y restaurar
node backup-protection/scripts/coordinador-backup.js recuperacion ./backup-latest.tar.gz aws
```

### Desde Repositorio Git

```bash
# 1. Clonar repositorio de backup
git clone https://github.com/ugt-towa/backups.git /tmp/backup-repo
cd /tmp/backup-repo

# 2. Verificar tags de backup
git tag | grep backup

# 3. Checkout del backup específico
git checkout backup-2024-11-11

# 4. Verificar integridad
git log --oneline -5

# 5. Restaurar desde repo
node backup-protection/scripts/coordinador-backup.js recuperacion ./backup-2024-11-11.tar.gz git
```

### Desde FTP/SFTP

```bash
# 1. Conectar por SFTP
sftp backup-server:/backups/ugt-towa/

# 2. Descargar backup
get backup-latest.tar.gz /tmp/

# 3. Verificar descarga
ls -la /tmp/backup-latest.tar.gz

# 4. Restaurar
node backup-protection/scripts/coordinador-backup.js recuperacion /tmp/backup-latest.tar.gz ftp
```

---

## ✅ Verificación Post-Recuperación

### Checklist de Verificación

#### 1. Verificación de Servicios
```bash
# Servicios web
systemctl status nginx
curl -I http://localhost

# Servicios de aplicación
systemctl status ugt-towa-app
curl http://localhost/api/health

# Base de datos
systemctl status postgresql
sudo -u postgres psql -c "SELECT version();"

# Logs sin errores
tail -100 /var/log/nginx/error.log | grep -i error
```

#### 2. Verificación de Funcionalidad
```bash
# Portal principal
curl -s http://localhost | grep "Portal UGT-TOWA"

# API de autenticación
curl -X POST http://localhost/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test"}'

# Base de datos
sudo -u postgres psql -d ugt_towa_production -c "SELECT COUNT(*) FROM profiles;"
```

#### 3. Verificación de Seguridad
```bash
# Permisos de archivos
ls -la /var/www/ugt-towa/
find /var/www/ugt-towa -type f -name "*.env" -exec ls -la {} \;

# Certificados SSL
openssl x509 -in /etc/ssl/certs/ugt-towa.crt -text -noout

# Conexiones activas
netstat -tulpn | grep :80
netstat -tulpn | grep :443
```

#### 4. Verificación de Performance
```bash
# Tiempo de respuesta
time curl -s http://localhost > /dev/null

# Uso de recursos
htop
df -h
free -h

# Logs de performance
tail -50 /var/log/nginx/access.log | grep -E "(200|500|502)"
```

### Tests Automatizados Post-Recuperación

```bash
#!/bin/bash
# test-recuperacion.sh

echo "🧪 Ejecutando tests post-recuperación..."

# Test 1: Servicios activos
if systemctl is-active --quiet nginx; then
    echo "✅ Nginx: Activo"
else
    echo "❌ Nginx: Inactivo"
fi

# Test 2: Conectividad web
if curl -s http://localhost | grep -q "Portal"; then
    echo "✅ Portal web: Funcionando"
else
    echo "❌ Portal web: No funciona"
fi

# Test 3: Base de datos
if sudo -u postgres psql -d ugt_towa_production -c "SELECT 1;" > /dev/null 2>&1; then
    echo "✅ Base de datos: Conectada"
else
    echo "❌ Base de datos: Error de conexión"
fi

# Test 4: API
if curl -s http://localhost/api/health | grep -q "ok"; then
    echo "✅ API: Funcionando"
else
    echo "❌ API: No responde"
fi

echo "🏁 Tests completados"
```

---

## 💻 Comandos de Emergencia

### Comandos de Diagnóstico Rápido

```bash
# Estado general del sistema
./backup-protection/scripts/diagnostico-rapido.sh

# Verificar integridad completa
node backup-protection/scripts/sistema-proteccion.js verificar-integridad

# Generar reporte de estado
node backup-protection/scripts/generar-reporte-estado.sh
```

### Comandos de Recuperación Automatizada

```bash
# Recuperación completa
node backup-protection/scripts/coordinador-backup.js completo

# Recuperación desde backup específico
node backup-protection/scripts/coordinador-backup.js recuperacion backup-archivo.tar.gz

# Recuperación urgente (sin verificaciones)
node backup-protection/scripts/coordinador-backup.js recuperacion-urgente backup-archivo.tar.gz
```

### Comandos de Monitoreo en Tiempo Real

```bash
# Monitoreo de logs
tail -f /var/log/ugt-towa/app.log
tail -f /var/log/nginx/access.log
tail -f /var/log/postgresql/postgresql-*.log

# Monitoreo de recursos
watch -n 5 'htop'
watch -n 10 'df -h'
```

### Comandos de Rollback

```bash
# Rollback a versión anterior
git checkout anterior-version-stable
sudo systemctl restart ugt-towa-app

# Rollback de base de datos
sudo -u postgres psql ugt_towa_production < backup-previo.sql
```

---

## 📞 Contactos de Soporte

### Equipo Técnico Interno
- **Administrador Principal**: admin@ugt-towa.org
- **Desarrollador de Sistemas**: dev@ugt-towa.org
- **Especialista en Base de Datos**: dba@ugt-towa.org
- **Especialista en Seguridad**: security@ugt-towa.org

### Proveedores Externos
- **Hosting/Infraestructura**: soporte@hosting-provider.com
- **Cloud Storage (AWS)**: https://aws.amazon.com/support/
- **CDN**: https://cloudflare.com/support/
- **SSL/TLS**: https://letsencrypt.org/support/

### Horarios de Atención
- **Horario laboral**: 8:00 - 18:00 (L-V)
- **Emergencias 24/7**: Solo para fallas críticas
- **Tiempo de respuesta esperado**: 2 horas

### Escalación
1. **Nivel 1**: Administrador de sistemas
2. **Nivel 2**: Desarrollador senior
3. **Nivel 3**: Consultor externo especializado
4. **Nivel 4**: Proveedor de infraestructura

---

## 📋 Plantillas de Documentación

### Reporte de Incidente
```
REPORTE DE INCIDENTE - RECUPERACIÓN DE EMERGENCIA

ID del Incidente: [INC-YYYY-MM-DD-HHMM]
Fecha/Hora de Detección: [YYYY-MM-DD HH:MM]
Fecha/Hora de Inicio de Recuperación: [YYYY-MM-DD HH:MM]
Fecha/Hora de Resolución: [YYYY-MM-DD HH:MM]
Duración Total: [HH:MM]

Síntomas Detectados:
- [Síntoma 1]
- [Síntoma 2]
- [Síntoma 3]

Causa Raíz:
[Causa identificada]

Acciones Realizadas:
1. [Acción 1] - [Tiempo]
2. [Acción 2] - [Tiempo]
3. [Acción 3] - [Tiempo]

Resultados:
- [Resultado 1]
- [Resultado 2]

Lecciones Aprendidas:
- [Lección 1]
- [Lección 2]

Prevención Futura:
- [Acción preventiva 1]
- [Acción preventiva 2]

Responsable: [Nombre]
```

### Checklist de Recuperación
```
CHECKLIST DE RECUPERACIÓN DE EMERGENCIA

□ 1. Evaluación inicial completada
□ 2. Backup de estado actual creado
□ 3. Backup de recuperación identificado
□ 4. Integridad del backup verificada
□ 5. Servicios críticos detenidos
□ 6. Archivos restaurados
□ 7. Base de datos restaurada
□ 8. Configuraciones aplicadas
□ 9. Servicios reiniciados
□ 10. Verificación de funcionalidad
□ 11. Tests de integración ejecutados
□ 12. Notificaciones de estado enviadas
□ 13. Documentación de incidente completada

Observaciones:
[Notas durante el proceso]

Firma: [Nombre del técnico]
Fecha: [YYYY-MM-DD]
```

---

## 🔄 Procedimientos de Mejora Continua

### Revisión Post-Incidente
- Análisis de causa raíz
- Evaluación de tiempos de respuesta
- Identificación de mejoras en procesos
- Actualización de documentación
- Capacitación adicional del equipo

### Simulacros de Recuperación
- **Frecuencia**: Trimestral
- **Participantes**: Equipo técnico completo
- **Documentación**: Actualizar este manual según resultados
- **Métricas**: Tiempo de recuperación, efectividad de procedimientos

### Actualización del Manual
- Revisar procedimientos después de cada incidente
- Incorporar feedback del equipo técnico
- Actualizar comandos y rutas según cambios del sistema
- Mantener contactos de soporte actualizados

---

**© 2024 UGT-TOWA - Sistema de Backup y Protección**  
*Este documento es confidencial y de uso interno exclusivo*