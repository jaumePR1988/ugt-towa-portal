# Copia de Seguridad Portal UGT Towa - Versión 2025-11-10

## Información del Backup
- **Fecha de creación**: 2025-11-10 23:24:21
- **URL de producción**: https://e98j3z8sojw0.space.minimax.io
- **Tipo**: Copia de seguridad completa para rollback

## Contenido del Backup

### 1. Código Fuente Completo
- **Carpeta**: `ugt-towa-portal/`
- **Incluye**:
  - Código fuente React/TypeScript completo
  - Configuraciones de build (Vite, Tailwind, ESLint)
  - Archivos de configuración (.env, package.json, etc.)
  - Carpeta dist/ con build de producción
  - Todas las páginas y componentes
  - Contextos de autenticación
  - Hooks personalizados
  - Configuraciones de Supabase locales

### 2. Configuraciones de Base de Datos
- **Carpeta**: `supabase/`
- **Incluye**:
  - **functions/**: Edge functions de Supabase
  - **migrations/**: Migraciones de base de datos (DDL)
  - **tables/**: Definiciones de tablas
  - **cron_jobs/**: Configuraciones de trabajos programados

### 3. Documentación Completa
- Todos los archivos `.md` con documentación del proyecto
- Informes de desarrollo y mejoras
- Guías de implementación
- Análisis y verificaciones

### 4. Recursos Visuales
- **Carpeta**: `browser/screenshots/`
  - Capturas de pantalla de testing
  - Verificaciones de funcionalidades
  - Estados de desarrollo
- **Carpeta**: `imgs/`
  - Imágenes de componentes
  - Recursos gráficos

### 5. Configuraciones Adicionales
- **browser/**: Datos de testing y navegación
- **user_input_files/**: Recursos originales del proyecto

## Cómo Restaurar esta Copia de Seguridad

### Opción 1: Restauración Completa
```bash
# 1. Eliminar proyecto actual
rm -rf ugt-towa-portal/

# 2. Copiar desde backup
cp -r backup_version_2025_11_10/ugt-towa-portal/ ./

# 3. Restaurar configuraciones de Supabase
cp -r backup_version_2025_11_10/supabase/ ./

# 4. Instalar dependencias
cd ugt-towa-portal
pnpm install

# 5. Reconstruir si es necesario
pnpm build
```

### Opción 2: Solo Código Fuente
```bash
# Restaurar solo la aplicación web
cp -r backup_version_2025_11_10/ugt-towa-portal/ ./
cd ugt-towa-portal && pnpm install
```

## Verificación de Integridad
- ✅ Código fuente completo incluido
- ✅ Configuraciones de Supabase incluidas
- ✅ Documentación preservada
- ✅ Screenshots de testing incluidos
- ✅ Build de producción preservado
- ✅ Configuraciones de base de datos incluidas

## Notas Importantes
- Este backup incluye el build de producción en la carpeta `dist/`
- Las configuraciones sensibles como `.env` están incluidas
- Los edge functions de Supabase están preservados
- Las migraciones de base de datos están completas

## Contacto y Soporte
Este backup fue creado automáticamente para garantizar la capacidad de rollback del Portal UGT Towa en producción.
Fecha: 2025-11-10 23:24:21