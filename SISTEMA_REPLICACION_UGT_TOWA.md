# Sistema de Replicación Template Generic - Portal UGT Towa

## Descripción General

Este sistema permite replicar completamente el Portal UGT Towa como un template genérico reutilizable para diferentes empresas y organizaciones sindicales. La replicación completa puede realizarse en **2-4 horas** con todas las funcionalidades y personalización por empresa.

## Características del Sistema

### ✅ Funcionalidades Completas Incluidas
- Sistema de citas y gestión (booking, cancelaciones, delegación)
- Notificaciones en panel con filtros avanzados
- Dashboard administrativo con estadísticas y gráficos
- Configuración personalizada (recordatorios, horarios, admins)
- Exportación de datos (Excel/CSV, PDF)
- Sistema de autenticación completo
- Base de datos con todas las tablas
- Edge functions completas
- Cron jobs para tareas automáticas

### 🎨 Sistema de Personalización
- Variables de configuración por empresa
- Sistema de branding personalizable
- Textos y mensajes configurables
- Horarios laborales por empresa
- Tipos de servicios por sector
- Datos de empresa personalizables

### 🛠️ Herramientas de Automatización
- Script de creación de nueva empresa
- Generador de configuraciones
- Configurador de dominios
- Migrador de base de datos
- Sistema de backup por empresa

## Estructura del Sistema

```
sistema-replicacion-template/
├── template-base/                 # Template genérico del portal
│   ├── frontend/                  # Aplicación React base
│   ├── backend/                   # Edge functions base
│   ├── database/                  # Esquemas y migraciones
│   └── config/                    # Configuraciones por defecto
├── herramientas/                  # Scripts de automatización
│   ├── crear-empresa.js          # Creador de nuevas instancias
│   ├── generador-config.js       # Generador de configuraciones
│   ├── configurador-dominios.js  # Configurador de dominios
│   ├── migrador-bd.js            # Migrador de base de datos
│   └── sistema-backup.js         # Sistema de backup
├── plantillas/                    # Plantillas de configuración
│   ├── empresas/                  # Configuraciones por sector
│   ├── dominios/                  # Configuraciones de dominio
│   └── branding/                  # Plantillas de marca
└── documentacion/                 # Guías y manuales
    ├── guia-replicacion.md       # Guía paso a paso
    ├── manual-personalizacion.md # Manual de personalización
    ├── casos-uso.md              # Casos de uso
    └── mejores-practicas.md      # Mejores prácticas
```

## Requisitos Previos

1. **Node.js 18+** y npm/pnpm
2. **Cuenta Supabase** con acceso a proyectos
3. **Dominio personalizado** (opcional)
4. **Certificado SSL** (recomendado)

## Tiempo de Implementación

- **Configuración inicial:** 30 minutos
- **Personalización de empresa:** 60-90 minutos
- **Despliegue y testing:** 30-60 minutos
- **Total:** 2-4 horas

## Uso Rápido

```bash
# 1. Instalar el sistema de replicación
cd sistema-replicacion-template
npm install

# 2. Crear nueva instancia
node herramientas/crear-empresa.js --nombre "Mi Empresa" --sector "industrial" --dominio "mi-empresa.com"

# 3. Personalizar configuración
node herramientas/generador-config.js --empresa "mi-empresa" --configuracion "completa"

# 4. Desplegar
npm run deploy --empresa="mi-empresa"
```

## Documentación Detallada

Para información detallada, consulte:
- [Guía de Replicación](./documentacion/guia-replicacion.md)
- [Manual de Personalización](./documentacion/manual-personalizacion.md)
- [Casos de Uso](./documentacion/casos-uso.md)
- [Mejores Prácticas](./documentacion/mejores-practicas.md)

---

**Versión:** 1.0  
**Fecha:** 11 de Noviembre de 2025  
**Compatibilidad:** UGT Towa v2.0+  
**Tiempo de replicación:** 2-4 horas  
