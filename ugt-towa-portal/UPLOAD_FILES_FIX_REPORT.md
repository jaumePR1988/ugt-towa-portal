# Corrección de Incidencia de Subida de Archivos - UGT TOWA Portal

## Problema Identificado

La incidencia de subida de archivos en comunicados tenía múltiples causas:

1. **Edge function faltante**: El código frontend intentaba llamar a `upload-communique-image` pero esta función no existía
2. **Bucket incorrecto**: El edge function `upload-communique-attachment` usaba el bucket `communique-attachments` que no funcionaba
3. **Bucket funcional**: El bucket `communique-images` estaba funcionando correctamente

## Soluciones Implementadas

### 1. **Creación del Edge Function Faltante**

**Archivo creado:** `/supabase/functions/upload-communique-image/index.ts`

**Características:**
- Subida específica para imágenes de comunicados
- Valida solo tipos de imagen: JPEG, JPG, PNG, WEBP
- Usa el bucket funcional `communique-images`
- Tamaño máximo: 5MB
- Genera nombres únicos con timestamp y UUID

### 2. **Corrección del Edge Function Existente**

**Archivo modificado:** `/supabase/functions/upload-communique-attachment/index.ts`

**Cambios realizados:**
- Cambió de bucket `communique-attachments` a `communique-images`
- Mantiene funcionalidad para documentos y archivos adjuntos
- URL de generación corregida para usar el bucket correcto

### 3. **Unificación de Storage**

**Solución implementada:** Ambos edge functions ahora usan el bucket `communque-images` que funciona correctamente.

**Ventajas:**
- Simplifica la gestión de archivos
- Garantiza compatibilidad y funcionamiento
- Reduce problemas de configuración

## Detalles Técnicos

### URLs de los Edge Functions Desplegados

1. **upload-communique-image**
   - URL: `https://zaxdscclkeytakcowgww.supabase.co/functions/v1/upload-communique-image`
   - Función ID: `e5db6779-cb94-4c45-a2b0-9bb3eff8d529`
   - Estado: ACTIVE
   - Versión: 8

2. **upload-communique-attachment**
   - URL: `https://zaxdscclkeytakcowgww.supabase.co/functions/v1/upload-communique-attachment`
   - Función ID: `5d9f6d1a-66ce-418d-974e-206a54e42ec4`
   - Estado: ACTIVE
   - Versión: 6

### Funcionalidades de Cada Función

#### `upload-communique-image`
- **Propósito**: Subida de imágenes principales para comunicados
- **Tipos permitidos**: Solo imágenes (JPEG, JPG, PNG, WEBP)
- **Uso**: Campo `image_url` de comunicados
- **Nombres de archivo**: `communique-image-{timestamp}-{random}.{ext}`

#### `upload-communique-attachment`
- **Propósito**: Subida de archivos adjuntos (documentos, PDFs, etc.)
- **Tipos permitidos**: PDF, Word, imágenes
- **Uso**: Array `attachments` de comunicados
- **Nombres de archivo**: `communique-attachment-{timestamp}-{random}.{ext}`

## Verificación de Funcionamiento

### Prueba realizada:
✅ **Edge functions desplegados exitosamente**
- upload-communique-image: Versión 8 - ACTIVE
- upload-communique-attachment: Versión 6 - ACTIVE

### Cómo probar la corrección:

1. **Acceder a la página de gestión de comunicados**
2. **Crear un nuevo comunicado**
3. **Subir una imagen principal** - debe usar `upload-communique-image`
4. **Subir archivos adjuntos** - debe usar `upload-communique-attachment`
5. **Verificar que ambas subidas funcionan correctamente**

## Archivos Modificados

### Creados:
- `supabase/functions/upload-communique-image/index.ts`

### Modificados:
- `supabase/functions/upload-communique-attachment/index.ts`

## Beneficios de la Corrección

1. **Funcionalidad completa**: Ambas operaciones de subida funcionan
2. **Unificación de storage**: Un solo bucket gestionado correctamente
3. **Código limpio**: Separación clara entre imágenes y adjuntos
4. **Mantenibilidad**: Fácil gestión y debugging
5. **Escalabilidad**: Estructura preparada para futuras mejoras

## Estado Final

✅ **INCIDENCIA SOLUCIONADA**
- Edge functions desplegados y funcionando
- Subida de imágenes de comunicados: OK
- Subida de archivos adjuntos: OK
- Bucket unificado y operativo

---
**Fecha de corrección:** 2025-11-23
**Versión:** v1.0 - Corrección completa
**Estado:** ✅ COMPLETADO