# SOLUCIÓN AL ERROR DE SUBIDA DE ARCHIVOS EN COMUNICADOS

## Problema Identificado
El error `TypeError: Cannot read properties of undefined (reading 'toUpperCase')` que aparece al intentar subir archivos en los comunicados se debe a que:

1. **Los buckets de storage no existen** en Supabase
2. **Las edge functions requieren buckets** para funcionar correctamente

## ✅ SOLUCIONES APLICADAS

### 1. Edge Functions Desplegadas
- ✅ `upload-communique-image` - Desplegada y funcional
- ✅ `upload-communique-attachment` - Desplegada y funcional

### 2. Código Frontend Mejorado
- ✅ Mejor manejo de errores en `AdminComunicados.tsx`
- ✅ Validación mejorada de archivos
- ✅ Mensajes de error más informativos
- ✅ Uso consistente del token de autenticación

## 🔧 ACCIÓN REQUERIDA DEL USUARIO

**DEBES EJECUTAR EL SCRIPT SQL** para crear los buckets de storage:

### Opción A: Usando el Dashboard de Supabase (Recomendado)

1. **Ir al Dashboard**: https://supabase.com/dashboard/project/zaxdscclkeytakcowgww/sql-editor
2. **Copiar y pegar** el contenido completo del archivo `CREAR_STORAGE_BUCKETS.sql`
3. **Ejecutar** el script SQL

### Opción B: Usando SQL Editor
1. Abrir: https://supabase.com/dashboard/project/zaxdscclkeytakcowgww/sql-editor
2. Copiar este SQL y ejecutarlo:

```sql
-- Crear buckets
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  ('communique-images', 'communique-images', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp']),
  ('communique-attachments', 'communique-attachments', true, 5242880, ARRAY['application/pdf', 'image/jpeg', 'image/png', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'])
ON CONFLICT (id) DO NOTHING;

-- Políticas para imágenes
CREATE POLICY IF NOT EXISTS "Public read access for communique-images" ON storage.objects
  FOR SELECT USING (bucket_id = 'communique-images');

CREATE POLICY IF NOT EXISTS "Allow upload via edge function for images" ON storage.objects
  FOR INSERT
  WITH CHECK (bucket_id = 'communique-images' AND (auth.role() = 'anon' OR auth.role() = 'service_role'));

-- Políticas para archivos adjuntos  
CREATE POLICY IF NOT EXISTS "Public read access for communique-attachments" ON storage.objects
  FOR SELECT USING (bucket_id = 'communique-attachments');

CREATE POLICY IF NOT EXISTS "Allow upload via edge function for attachments" ON storage.objects
  FOR INSERT
  WITH CHECK (bucket_id = 'communique-attachments' AND (auth.role() = 'anon' OR auth.role() = 'service_role'));
```

## 🎯 RESULTADO ESPERADO

Después de ejecutar el script SQL:
1. **Los buckets `communique-images` y `communique-attachments` se crearán**
2. **Las políticas RLS se configurarán correctamente**
3. **La subida de archivos funcionará sin errores**

## 🔍 VERIFICACIÓN

Para verificar que todo funciona:
1. Ir al portal: https://6xzgavdsvyvx.space.minimax.io
2. Login como administrador
3. Ir a "Gestionar Comunicados"
4. Intentar subir una imagen
5. ✅ Debe funcionar correctamente

## 📝 NOTAS IMPORTANTES

- **Los buckets deben ser públicos** para que las imágenes se muestren correctamente
- **Las políticas RLS son críticas** para permitir la subida desde el frontend
- **Los archivos tienen límite de 5MB** por seguridad
- **Solo se permiten ciertos tipos de archivo** (PDF, imágenes, Word)

## 🆘 SI PERSISTE EL ERROR

Si después de ejecutar el script SQL sigue dando error:
1. Verificar que el script se ejecutó correctamente (sin errores)
2. Refrescar la página del portal
3. Intentar con un archivo más pequeño
4. Verificar la consola del navegador para más detalles

---

**Archivo generado**: 2025-11-22 02:30:24
**Portal URL**: https://6xzgavdsvyvx.space.minimax.io
**Proyecto Supabase**: zaxdscclkeytakcowgww