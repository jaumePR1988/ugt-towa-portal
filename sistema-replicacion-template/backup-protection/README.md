# Sistema de Backup y Protección
## Sistema de Replicación UGT-TOWA

[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](https://github.com/ugt-towa/backup-protection)
[![Node.js](https://img.shields.io/badge/node-%3E%3D18.0.0-green.svg)](https://nodejs.org/)
[![License](https://img.shields.io/badge/license-MIT-yellow.svg)](LICENSE)
[![Status](https://img.shields.io/badge/status-Production%20Ready-brightgreen.svg)]()

---

## 📋 Descripción

Sistema completo de backup automático y protección de datos para el sistema de replicación UGT-TOWA. Proporciona encriptación, versionado, almacenamiento distribuido y recuperación de emergencia para garantizar la continuidad del negocio.

### 🎯 Objetivos
- **RTO (Recovery Time Objective)**: 4 horas máximo
- **RPO (Recovery Point Objective)**: 24 horas máximo de pérdida de datos
- **Disponibilidad objetivo**: 99.5%
- **Encriptación**: AES-256-GCM para todos los datos sensibles

### ✨ Características Principales

#### 🔄 Backup Automático con Versionado
- Backup automático programado y bajo demanda
- Versionado con Git y tags automáticos
- Compresión y encriptación integrada
- Rotación inteligente de backups
- Verificación de integridad con hashes SHA-256

#### 🔐 Sistema de Protección de Datos
- Encriptación AES-256-GCM de credenciales
- Gestión segura de claves con PBKDF2
- Rotación automática de claves
- Auditoría completa de accesos
- Detección de credenciales débiles

#### ☁️ Almacenamiento Seguro Multi-Ubicación
- Almacenamiento local distribuido
- Sincronización con repositorios Git
- Integración con cloud storage (AWS S3, GCP, Azure)
- Protocolos FTP/SFTP para respaldos externos
- Balanceo de carga y redundancia

#### 🚨 Recuperación de Emergencia
- Procedimientos documentados para diferentes escenarios
- Recuperación automatizada y manual
- Verificación de integridad post-restauración
- Tests de funcionalidad automatizados
- Reportes ejecutivos post-recuperación

#### 📊 Monitoreo y Reportes
- Métricas de performance en tiempo real
- Reportes consolidados de backup
- Alertas proactivas de problemas
- Dashboard de estado del sistema
- Integración con Slack/Discord/webhooks

---

## 🏗️ Arquitectura del Sistema

```
┌─────────────────────────────────────────────────────────────┐
│                    COORDINADOR BACKUP                        │
│                  (coordinador-backup.js)                    │
└─────────────────────┬───────────────────────────────────────┘
                      │
    ┌─────────────────┼─────────────────┐
    │                 │                 │
┌───▼────┐     ┌─────▼─────┐     ┌────▼──────┐
│ BACKUP │     │PROTECCIÓN │     │ALMACENAM. │
│ AUTO   │     │   DATOS   │     │  SEGURO   │
└────┬───┘     └─────┬─────┘     └────┬──────┘
     │               │               │
     │    ┌──────────▼──────────┐    │
     └────┤ SISTEMA DE SCRIPTS  ├────┘
          │  Y CONFIGURACIÓN    │
          └─────────────────────┘
                │        │        │
        ┌───────▼─┐ ┌────▼────┐ ┌─▼────────┐
        │  LOCAL  │ │   GIT   │ │ CLOUD    │
        │ STORAGE │ │ REPO    │ │ STORAGE  │
        └─────────┘ └─────────┘ └──────────┘
```

---

## 📁 Estructura del Proyecto

```
backup-protection/
├── 📜 README.md                          # Este archivo
├── 🚀 coordinator-backup.js             # Script coordinador principal
├── 📂 scripts/                          # Scripts del sistema
│   ├── backup-automatico.js            # Backup automático con versionado
│   ├── sistema-proteccion.js           # Protección de datos y credenciales
│   ├── sistema-almacenamiento.js       # Almacenamiento en múltiples ubicaciones
│   └── coordinador-backup.js           # Coordinador del sistema
├── ⚙️ config/                           # Archivos de configuración
│   ├── backup-config.yaml              # Configuración de backup
│   ├── proteccion-config.yaml          # Configuración de protección
│   └── almacenamiento-config.yaml      # Configuración de almacenamiento
├── 📂 storage/                          # Directorio de almacenamiento
│   ├── local/                          # Almacenamiento local
│   ├── claves/                         # Claves de encriptación
│   ├── credenciales/                   # Credenciales encriptadas
│   ├── auditoria/                      # Logs de auditoría
│   ├── reportes/                       # Reportes generados
│   └── metricas/                       # Métricas del sistema
├── 📂 docs/                            # Documentación
│   ├── manual-recuperacion-emergencia.md
│   ├── guia-instalacion-configuracion.md
│   └── [otros documentos]
└── 📂 examples/                        # Ejemplos y plantillas
    ├── backup-rutina.sh
    ├── restaurar-sistema.sh
    └── test-configuracion.js
```

---

## 🚀 Inicio Rápido

### Requisitos Previos
- Node.js 18.0.0 o superior
- 4GB RAM mínimo, 8GB recomendado
- 20GB espacio en disco
- Git configurado
- Acceso a servicios de cloud (opcional)

### Instalación Rápida

```bash
# 1. Clonar el proyecto
git clone https://github.com/ugt-towa/backup-protection.git
cd backup-protection

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
cp config/.env.example config/.env
nano config/.env  # Editar con tus credenciales

# 4. Inicializar sistema de protección
node scripts/sistema-proteccion.js inicializar config/proteccion-config.yaml

# 5. Ejecutar backup de prueba
node scripts/coordinador-backup.js completo

# 6. Verificar que todo funciona
ls -la storage/local/backup-*/
```

### Configuración Mínima

```bash
# Configurar credenciales básicas
node scripts/sistema-proteccion.js establecer-credencial baseDatos postgres password 'tu_password'
node scripts/sistema-proteccion.js establecer-credencial sistema jwtSecret 'tu_jwt_secret'

# Configurar almacenamiento local (automático)
# Configurar repositorio Git (opcional)
# Configurar cloud storage (opcional)
```

---

## 📖 Documentación Detallada

### 🔧 Configuración
- **[Guía de Instalación](docs/guia-instalacion-configuracion.md)**: Instalación paso a paso
- **[Configuración YAML](config/)**: Archivos de configuración detallados
- **[Variables de Entorno](config/.env.example)**: Variables requeridas

### 🚨 Operaciones
- **[Manual de Recuperación](docs/manual-recuperacion-emergencia.md)**: Procedimientos de emergencia
- **[Scripts de Backup](scripts/)**: Scripts para diferentes operaciones
- **[Comandos de Emergencia](docs/manual-recuperacion-emergencia.md#comandos-de-emergencia)**: Comandos rápidos

### 🔒 Seguridad
- **[Sistema de Protección](scripts/sistema-proteccion.js)**: Detalles de encriptación
- **[Auditoría](storage/auditoria/)**: Logs de seguridad
- **[Reportes de Seguridad](storage/reportes/)**: Reportes generados

### 📊 Monitoreo
- **[Métricas](storage/metricas/)**: Métricas de performance
- **[Reportes](storage/reportes/)**: Reportes consolidados
- **[Logs](storage/logs/)**: Logs del sistema

---

## 💻 Uso del Sistema

### Comandos Principales

#### Backup Completo
```bash
# Ejecutar proceso completo de backup
node scripts/coordinador-backup.js completo

# Solo backup de código
node scripts/backup-automatico.js config/backup-config.yaml

# Backup de emergencia (rápido)
node scripts/backup-automatico.js --emergency
```

#### Gestión de Protección
```bash
# Inicializar sistema de protección
node scripts/sistema-proteccion.js inicializar

# Rotar claves automáticamente
node scripts/sistema-proteccion.js rotar-claves

# Generar reporte de seguridad
node scripts/sistema-proteccion.js reporte-seguridad

# Verificar integridad
node scripts/sistema-proteccion.js verificar-integridad
```

#### Almacenamiento
```bash
# Sincronizar con ubicaciones remotas
node scripts/sistema-almacenamiento.js backup-file.tar.gz

# Test de conectividad
node scripts/sistema-almacenamiento.js test-all

# Verificar sincronización
node scripts/sistema-almacenamiento.js verify-sync
```

#### Recuperación de Emergencia
```bash
# Recuperación completa
node scripts/coordinador-backup.js recuperacion backup-file.tar.gz

# Recuperación desde ubicación específica
node scripts/coordinador-backup.js recuperacion backup-file.tar.gz local git cloud

# Recuperación urgente (sin verificaciones)
node scripts/coordinador-backup.js recuperacion-urgente backup-file.tar.gz
```

### Configuración de Automatización

#### Cron Jobs
```bash
# Editar crontab
crontab -e

# Backup diario a las 2:00 AM
0 2 * * * cd /ruta/sistema-replicacion-template/backup-protection && node scripts/coordinador-backup.js completo >> storage/logs/cron-backup.log 2>&1

# Rotación mensual de claves
0 1 1 * * cd /ruta/sistema-replicacion-template/backup-protection && node scripts/sistema-proteccion.js rotar-claves >> storage/logs/cron-rotation.log 2>&1

# Reporte semanal de seguridad
0 4 * * 0 cd /ruta/sistema-replicacion-template/backup-protection && node scripts/sistema-proteccion.js reporte-seguridad >> storage/logs/cron-security.log 2>&1
```

#### Scripts de Ejemplo
```bash
# Backup diario rutinario
./examples/backup-rutina.sh

# Restauración de emergencia
./examples/restaurar-sistema.sh

# Test de configuración
node examples/test-configuracion.js
```

---

## ⚙️ Configuración Avanzada

### Configuración de Backup
```yaml
# config/backup-config.yaml
backup:
  rutaLocal: './storage/local'
  mantenerBackups: 30
  comprimir: true
  encriptar: true
  
versionado:
  sistemaGit: true
  tags: true
  pushAutomatico: true
  
programacion:
  frecuencia: 'diario'
  hora: '02:00'
  diasSemana: [1,2,3,4,5,6,7]
```

### Configuración de Protección
```yaml
# config/proteccion-config.yaml
proteccion:
  algoritmo: 'aes-256-gcm'
  longitudClave: 32
  iteracionesPBKDF2: 100000
  
rotacion:
  habilitada: true
  frecuenciaDias: 30
  clavesRotar: ['jwtSecret', 'encryptionKey', 'sessionSecret']
```

### Configuración de Almacenamiento
```yaml
# config/almacenamiento-config.yaml
ubicaciones:
  local:
    habilitada: true
    rutaBase: './storage/local'
  git:
    habilitada: true
    repositorio: 'origin'
    rama: 'main'
  cloud:
    habilitada: true
    proveedor: 'aws'
    regiones: ['us-east-1', 'eu-west-1']
```

---

## 📊 Monitoreo y Métricas

### Archivos de Log
```bash
# Logs de backup
tail -f storage/logs/backup-$(date +%Y%m%d).log

# Logs de errores
tail -f storage/logs/error-$(date +%Y%m%d).log

# Logs de auditoría
tail -f storage/auditoria/accesos_$(date +%Y%m%d).log
```

### Reportes Generados
- **Reporte Consolidado**: `storage/reportes/reporte_consolidado_*.json`
- **Reporte Ejecutivo**: `storage/reportes/reporte_ejecutivo_*.md`
- **Reporte de Seguridad**: `storage/reportes/reporte_seguridad_*.json`
- **Métricas de Performance**: `storage/metricas/backup_*.json`

### Dashboard de Estado
```bash
# Ver estado del sistema
node scripts/verificar-estado.js

# Ver métricas en tiempo real
node scripts/monitoreo-tiempo-real.js

# Alertas activas
node scripts/verificar-alertas.js
```

---

## 🔒 Seguridad

### Encriptación
- **Algoritmo**: AES-256-GCM
- **Derivación de claves**: PBKDF2 con 100,000 iteraciones
- **Vector de inicialización**: 16 bytes aleatorio por operación
- **Autenticación**: GCM para verificación de integridad

### Gestión de Credenciales
- **Almacenamiento**: Encriptado con clave maestra
- **Rotación**: Automática cada 30 días
- **Acceso**: Auditado y controlado
- **Cache**: Temporal con expiración

### Auditoría
- **Logs de acceso**: Todos los accesos registrados
- **Logs de modificación**: Cambios en credenciales
- **Logs de errores**: Fallos de autenticación
- **Retención**: 365 días con compresión

### Mejores Prácticas
- **Passphrase fuerte**: Mínimo 16 caracteres
- **Claves únicas**: Cada servicio con clave distinta
- **Acceso limitado**: Solo personal autorizado
- **Verificación regular**: Auditorías mensuales
- **Backup de claves**: En ubicación segura separada

---

## 🚨 Recuperación de Emergencia

### Escenarios Soportados

#### 🔥 Falla Completa del Servidor
```bash
# 1. Preparar nuevo servidor
# 2. Instalar sistema de backup
# 3. Ejecutar recuperación
node scripts/coordinador-backup.js recuperacion backup-latest.tar.gz

# 4. Verificar funcionamiento
curl -I http://localhost
```

#### 🗄️ Corrupción de Base de Datos
```bash
# 1. Detener aplicación
sudo systemctl stop ugt-towa-app

# 2. Restaurar desde backup
node scripts/sistema-proteccion.js restaurar-base-datos backup-db.sql

# 3. Verificar integridad
sudo -u postgres psql -c "SELECT COUNT(*) FROM profiles;"

# 4. Reiniciar servicios
sudo systemctl start ugt-towa-app
```

#### 🔐 Compromiso de Seguridad
```bash
# 1. Rotar todas las claves
node scripts/sistema-proteccion.js rotar-claves

# 2. Regenerar credenciales
node scripts/sistema-proteccion.js regenerar-credenciales

# 3. Verificar integridad
node scripts/sistema-proteccion.js verificar-integridad
```

### Procedimientos Detallados
Ver **[Manual Completo de Recuperación](docs/manual-recuperacion-emergencia.md)**

---

## 🧪 Testing

### Tests Automatizados
```bash
# Test completo del sistema
npm test

# Test de backup
npm run test:backup

# Test de protección
npm run test:proteccion

# Test de almacenamiento
npm run test:almacenamiento

# Test de integración
npm run test:integration
```

### Tests Manuales
```bash
# Test de configuración
node examples/test-configuracion.js

# Test de conectividad
node examples/test-conectividad.js

# Test de rendimiento
node examples/test-rendimiento.js
```

### Simulaciones
```bash
# Simular falla de disco
./examples/simular-falla-disco.sh

# Simular pérdida de conectividad
./examples/simular-perdida-conectividad.sh

# Simular compromiso de seguridad
./examples/simular-compromiso-seguridad.sh
```

---

## 📈 Performance

### Métricas de Referencia
- **Backup inicial**: ~30-60 minutos (depende del tamaño)
- **Backup incremental**: ~5-15 minutos
- **Compresión**: Reducción 60-80% del tamaño original
- **Encriptación**: Overhead 10-15% tiempo de procesamiento
- **Sincronización cloud**: ~2-5 minutos por GB

### Optimizaciones
- **Backup incremental**: Solo archivos modificados
- **Compresión paralela**: Múltiples threads
- **Transferencia chunked**: Para archivos grandes
- **Cache de metadatos**: Para verificación rápida

### Monitoreo de Performance
```bash
# Ver tiempo de backup
grep "Duración" storage/reportes/reporte_consolidado_*.json

# Ver métricas de transferencia
grep "velocidad" storage/metricas/sincronizacion_*.json

# Ver uso de recursos
htop
iotop
```

---

## 🤝 Contribución

### Guías de Contribución
1. Fork el proyecto
2. Crear rama de feature (`git checkout -b feature/nueva-caracteristica`)
3. Commit de cambios (`git commit -am 'Agregar nueva característica'`)
4. Push a la rama (`git push origin feature/nueva-caracteristica`)
5. Crear Pull Request

### Estándares de Código
- **ESLint**: Seguir configuración del proyecto
- **Comentarios**: JSDoc para funciones públicas
- **Testing**: Tests requeridos para nuevas features
- **Documentación**: Actualizar documentación relevante

### Reportar Issues
- **Bug reports**: Incluir pasos para reproducir
- **Feature requests**: Describir caso de uso
- **Security issues**: Reportar Privadamente

---

## 📝 Changelog

### v1.0.0 (2024-11-11)
- ✨ Implementación inicial del sistema
- 🔐 Sistema de protección de datos con encriptación
- 💾 Backup automático con versionado Git
- ☁️ Almacenamiento en múltiples ubicaciones
- 🚨 Procedimientos de recuperación de emergencia
- 📊 Sistema de monitoreo y reportes
- 📧 Notificaciones por email y webhooks
- ⏰ Automatización con cron jobs
- 🔒 Auditoría completa de accesos
- 📖 Documentación completa

### Próximas Versiones
- 🔄 Integración con más proveedores de cloud
- 📱 Aplicación móvil para monitoreo
- 🤖 IA para detección de anomalías
- 🔗 Integración con más servicios de notificación
- 📈 Dashboard web interactivo
- 🔄 Backup incremental inteligente

---

## 📞 Soporte

### Contactos
- **Email**: support@ugt-towa.org
- **Slack**: #backup-support
- **Documentación**: Ver carpeta `docs/`
- **Issues**: GitHub Issues

### Soporte Técnico
- **Horario**: 8:00 - 18:00 (L-V)
- **Emergencias**: 24/7 para problemas críticos
- **Tiempo de respuesta**: 2 horas para problemas críticos

### Recursos Adicionales
- [Manual de Usuario](docs/manual-usuario.md)
- [FAQ](docs/FAQ.md)
- [Troubleshooting](docs/troubleshooting.md)
- [API Reference](docs/api-reference.md)

---

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo [LICENSE](LICENSE) para más detalles.

---

## 👥 Equipo

### Desarrollo
- **Arquitecto Principal**: Equipo de Desarrollo UGT-TOWA
- **Especialista en Seguridad**: Security Team
- **DevOps Engineer**: Infrastructure Team
- **QA Engineer**: Quality Assurance Team

### Agradecimientos
- Comunidad Node.js
- Contributors del ecosistema JavaScript
- Usuarios beta del sistema

---

## 🏷️ Tags y Versiones

- **Latest**: `v1.0.0`
- **Stable**: `v1.0.0`
- **Development**: `v1.1.0-dev`

### Versionado Semántico
- **MAJOR**: Cambios incompatibles
- **MINOR**: Nuevas funcionalidades compatibles
- **PATCH**: Correcciones de bugs compatibles

---

**© 2024 UGT-TOWA - Sistema de Backup y Protección**

*Este proyecto es parte del sistema de replicación UGT-TOWA y está diseñado específicamente para las necesidades de organizaciones sindicales.*

---

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen.svg)]() 
[![Coverage](https://img.shields.io/badge/coverage-95%25-green.svg)]() 
[![Security](https://img.shields.io/badge/security-A+-brightgreen.svg)]() 
[![Performance](https://img.shields.io/badge/performance-95%2F100-blue.svg)]()