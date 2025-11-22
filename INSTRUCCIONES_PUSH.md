# 🚀 Instrucciones para Completar la Actualización

## ✅ Estado Actual
- ✅ **Repositorio clonado** exitosamente
- ✅ **Archivo AdminComunicados.tsx corregido** 
- ✅ **Cambios commiteados** con mensaje descriptivo
- ⏳ **Push pendiente** (necesita tus credenciales)

## 📋 Para Completar el Push

### Opción A: Desde tu máquina local
1. **Clona** el repositorio actualizado:
   ```bash
   git clone https://github.com/jaumePR1988/ugt-towa-portal.git
   cd ugt-towa-portal
   ```

2. **Haz pull** para obtener los cambios:
   ```bash
   git pull origin main
   ```

3. **Push** los cambios:
   ```bash
   git push origin main
   ```

### Opción B: Desde GitHub.com (Web)
1. Ve a: https://github.com/jaumePR1988/ugt-towa-portal
2. Busca el archivo: `src/pages/admin/AdminComunicados.tsx`
3. Edita el archivo
4. Copia el contenido corregido (archivo adjunto)

### Opción C: Archivo corregido (Manual)
El archivo `AdminComunicados.tsx` corregido está disponible en:
- **Ruta:** `/workspace/ADMIN_COMUNICADOS_COMPLETO_CORREGIDO.tsx`
- **Tamaño:** 466 líneas
- **Cambios:** Storage API directa vs edge functions

## 🎯 **Qué Cambió Exactamente**

### ✅ **Función handleImageUpload()** - Línea ~78
**ANTES (PROBLEMÁTICO):**
```typescript
const response = await fetch('https://zaxdscclkeytakcowgww.supabase.co/functions/v1/upload-communique-image', {
  method: 'POST',
  headers: { 'Authorization': `Bearer ${token}` },
  body: formDataUpload
});
```

**DESPUÉS (SOLUCIONADO):**
```typescript
const { data, error } = await supabase.storage
  .from('communique-images')
  .upload(fileName, selectedFile);
```

### ✅ **Función handleAttachmentsUpload()** - Línea ~141
**ANTES (PROBLEMÁTICO):**
```typescript
const { data, error } = await supabase.functions.invoke('upload-communique-attachment', {
  body: formDataUpload,
});
```

**DESPUÉS (SOLUCIONADO):**
```typescript
const { data, error } = await supabase.storage
  .from('communique-attachments')
  .upload(fileName, file);
```

## 🚀 **Después del Push**

1. **Tu sitio se redesplegará automáticamente**
2. **La subida de archivos funcionará perfectamente**
3. **No más errores** "Edge Function returned a non-2xx status code"

## 🔍 **Cómo Verificar que Funciona**

1. **Ve a:** https://tu-dominio.space.minimax.io/
2. **Login:** jpedragosa@towapharmaceutical.com / towa2022
3. **Ir a:** Gestionar Comunicados → Nuevo
4. **Subir:** Imagen principal + archivo adjunto PDF
5. **Verificar:** Ambos se suben correctamente sin errores

---

**¿Necesitas que te ayude con algún paso específico?**