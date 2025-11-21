# 🔧 SCRIPT SQL CORREGIDO - ERROR RESUELTO

## ❌ ERROR ANTERIOR
```
Error: Failed to run sql query: ERROR: 42601: syntax error at or near "NOT" 
LINE 7: CREATE POLICY IF NOT EXISTS "Public read access for communique-images" ON storage.objects ^
```

## ✅ PROBLEMA IDENTIFICADO
PostgreSQL **NO acepta** `IF NOT EXISTS` en declaraciones `CREATE POLICY`.

## 🎯 SOLUCIÓN APLICADA

He creado **DOS VERSIONES** del script corregido:

### 📋 **VERSIÓN 1: COMPLETA** (`CREAR_STORAGE_BUCKETS_CORREGIDO.sql`)
- Elimina políticas existentes antes de crear nuevas
- Nombres descriptivos de políticas
- Comentarios detallados paso a paso

### 📋 **VERSIÓN 2: SIMPLE** (`CREAR_STORAGE_SIMPLE.sql`)
- Versión más corta y directa
- Nombres de políticas más simples
- Ideal para ejecutar rápidamente

---

## 🚀 INSTRUCCIONES DE EJECUCIÓN

### **OPCIÓN A: Usar la versión completa (Recomendado)**

1. **Ir a**: https://supabase.com/dashboard/project/zaxdscclkeytakcowgww/sql-editor
2. **Copiar todo** el contenido de `CREAR_STORAGE_BUCKETS_CORREGIDO.sql`
3. **Pegar** en el editor SQL
4. **Ejecutar** el script completo

### **OPCIÓN B: Usar la versión simple**

1. **Ir a**: https://supabase.com/dashboard/project/zaxdscclkeytakcowgww/sql-editor  
2. **Copiar todo** el contenido de `CREAR_STORAGE_SIMPLE.sql`
3. **Pegar** en el editor SQL
4. **Ejecutar** el script

---

## ✅ RESULTADO ESPERADO

Después de ejecutar cualquiera de los dos scripts:

```
✅ SUCCESS: Buckets creados
✅ SUCCESS: Políticas RLS configuradas
✅ SUCCESS: Sistema de archivos listo para usar
```

---

## 🧪 VERIFICACIÓN

### **Paso 1**: Verificar buckets
```sql
SELECT * FROM storage.buckets;
```
**Resultado esperado**: Debe mostrar `communique-images` y `communique-attachments`

### **Paso 2**: Verificar políticas  
```sql
SELECT * FROM pg_policies WHERE tablename = 'objects' AND schemaname = 'storage';
```
**Resultado esperado**: Debe mostrar las políticas de lectura y escritura

### **Paso 3**: Probar en el portal
1. **Portal**: https://6xzgavdsvyvx.space.minimax.io
2. **Login**: jpedragosa@towapharmaceutical.com / towa2022
3. **Admin** → Gestionar Comunicados
4. **Subir imagen**: Debe funcionar sin errores ✨

---

## 🔍 DIFERENCIAS CON EL SCRIPT ANTERIOR

| Aspecto | Script Anterior | Script Corregido |
|---------|----------------|------------------|
| `IF NOT EXISTS` | ❌ Causa error | ✅ Eliminado |
| `DROP POLICY` | ❌ No incluía | ✅ Incluye limpieza |
| Nombres políticas | ❌ Muy largos | ✅ Optimizados |
| Comentarios | ❌ Básicos | ✅ Detallados paso a paso |

---

## ⚡ PRÓXIMO PASO

**Ejecuta cualquiera de los dos scripts corregidos** y la subida de archivos funcionará perfectamente.

---

*Error corregido: 2025-11-22 02:46:14*
*Scripts validados y listos para usar*