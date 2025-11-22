# Instrucciones para Actualizar el Portal UGT TOWA

## Problema Solucionado
Se ha corregido el error "Edge Function returned a non-2xx status code" al subir archivos. El problema era que los edge functions de Supabase estaban dando timeout.

## Solución Implementada
Se reemplazaron las llamadas a edge functions problemáticos por llamadas directas a la API de Storage de Supabase:

**Antes (PROBLEMÁTICO):**
```typescript
// Llamada a edge function que daba timeout
const { data, error } = await supabase.functions.invoke('upload-communique-image', {
  body: { file: selectedFile, fileName }
});
```

**Después (SOLUCIONADO):**
```typescript
// Llamada directa a Storage API
const { data, error } = await supabase.storage
  .from('communique-images')
  .upload(fileName, selectedFile);
```

## Archivo Modificado
- **Archivo:** `src/pages/admin/AdminComunicados.tsx`
- **Funciones corregidas:**
  - `handleImageUpload()` - líneas 52-103
  - `handleAttachmentsUpload()` - líneas 105-174

## Pasos para Actualizar

### Opción 1: Actualizar GitHub directamente
1. Ve a tu repositorio en GitHub
2. Sube el archivo `AdminComunicados.tsx` corregido
3. El sitio se redesplegará automáticamente

### Opción 2: Descargar y subir manualmente
1. Descarga el archivo corregido de la ruta: `/workspace/ugt-document-viewer/src/pages/admin/AdminComunicados.tsx`
2. Súbelo a tu repositorio de GitHub en la misma ubicación
3. El despliegue automático debería iniciarse

### Opción 3: Clonar y actualizar
```bash
# Clona tu repositorio
git clone [TU_REPO_URL]
cd [TU_REPO_NAME]

# Copia el archivo corregido
# (desde /workspace/ugt-document-viewer/src/pages/admin/AdminComunicados.tsx
# hacia tu carpeta local del proyecto)

# Commit y push
git add .
git commit -m "Fix: Solucionar subida de archivos usando Storage API directa"
git push origin main
```

## Qué Esperar Después del Despliegue

1. **Login:** https://tu-dominio.space.minimax.io/
   - Usuario: jpedragosa@towapharmaceutical.com
   - Contraseña: towa2022

2. **Función de Subida de Archivos:**
   - ✅ Subida de imágenes principales debería funcionar
   - ✅ Subida de archivos adjuntos (PDFs) debería funcionar
   - ✅ Sin más errores de "Edge Function returned a non-2xx status code"

## Verificación Post-Despliegue

1. Ve a la sección "Gestionar Comunicados"
2. Crea un nuevo comunicado
3. Prueba a subir una imagen principal
4. Prueba a subir un archivo adjunto (PDF)
5. Verifica que ambos se suben correctamente sin errores

## Configuración de Supabase
Los buckets necesarios ya existen:
- ✅ `communique-images` (para imágenes principales)
- ✅ `communique-attachments` (para archivos adjuntos PDF)

No se requieren cambios adicionales en Supabase.

---
**Fecha:** 2025-11-23
**Estado:** ✅ SOLUCIONADO - Listo para desplegar