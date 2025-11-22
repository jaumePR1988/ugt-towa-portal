# 🚀 INSTRUCCIONES DE DESPLIEGUE FINAL - UGT TOWA PORTAL

## 📋 RESUMEN DE CORRECCIONES APLICADAS

✅ **Corrección 1**: Encuestas públicas requieren autenticación (no votación anónima)  
✅ **Corrección 2**: Navegación muestra "Newsletter" para usuarios y "Gestión Newsletter" para admin  
✅ **Corrección 3**: Subida de archivos en comunicados completamente funcional  

---

## 🎯 PRUEBAS REALIZADAS - RESULTADOS

| Funcionalidad | Estado | Observaciones |
|---------------|--------|---------------|
| **Encuestas - Autenticación** | ✅ **FUNCIONAL** | Bloquea votos sin login, mensaje mejorado |
| **Navegación Newsletter** | ✅ **PERFECTA** | Sin duplicación, diferenciación correcta |
| **Subida de Archivos** | ✅ **PERFECTA** | Funciona con imágenes y PDFs |

---

## 📦 ARCHIVO PARA DESPLIEGUE

**Archivo**: `UGT_TOWA_SOLUCION_FINAL_COMPLETA.zip`

Este archivo contiene:
- ✅ Código fuente completo con todas las correcciones
- ✅ Edge Functions de Supabase actualizadas
- ✅ Migraciones de base de datos aplicadas
- ✅ Documentación completa

---

## 🔧 PASOS PARA APLICAR CORRECCIÓN URGENTE (OPCIÓN A)

### Problema de Votación en Encuestas
Si las encuestas no funcionan correctamente, aplica esta corrección en Supabase:

1. **Ve a**: https://app.supabase.com/project/zaxdscclkeytakcowgww
2. **Accede a**: SQL Editor (menú lateral izquierdo)
3. **Copia y ejecuta** este código:

```sql
-- Limpiar políticas anteriores
DROP POLICY IF EXISTS "authenticated_insert_responses" ON survey_responses;
DROP POLICY IF EXISTS "public_view_responses" ON survey_responses;
DROP POLICY IF EXISTS "users_view_all_responses" ON survey_responses;

-- Asegurar RLS habilitado
ALTER TABLE survey_responses ENABLE ROW LEVEL SECURITY;

-- Crear políticas correctas
CREATE POLICY "public_view_responses" 
ON survey_responses FOR SELECT USING (true);

CREATE POLICY "authenticated_insert_responses" 
ON survey_responses FOR INSERT TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Verificar políticas creadas
SELECT policyname, cmd, roles
FROM pg_policies 
WHERE tablename = 'survey_responses';
```

---

## 🏗️ PASOS PARA DESPLIEGUE COMPLETO (OPCIÓN B)

Si necesitas hacer un despliegue desde cero:

### 1. Preparar el Proyecto
```bash
# Extraer el archivo
unzip UGT_TOWA_SOLUCION_FINAL_COMPLETA.zip

# Ir al directorio
cd UGT_TOWA_FINAL_GITHUB_READY/

# Instalar dependencias
npm install
```

### 2. Configurar Variables de Entorno
Asegúrate de tener:
```env
VITE_SUPABASE_URL=https://zaxdscclkeytakcowgww.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 3. Construir y Desplegar
```bash
# Construir proyecto
npm run build

# Subir archivos de dist/ a tu servidor
```

---

## 🔐 CREDENCIALES DE ACCESO

### Portal UGT TOWA
- **Email**: jpedragosa@towapharmaceutical.com
- **Password**: towa2022
- **URL**: https://lmgqlxg2tvei.space.minimax.io

### Panel Supabase
- **URL**: https://app.supabase.com/project/zaxdscclkeytakcowgww
- **Service Role Key**: Buscar en Settings → API → Project API keys

---

## ✅ VERIFICACIÓN FINAL

Después del despliegue, verifica:

1. **Encuestas** (/encuestas)
   - ✅ Sin autenticación: "Debes iniciar sesión para votar"
   - ✅ Con autenticación: Votación funciona correctamente

2. **Navegación**
   - ✅ Usuarios ven: "Newsletter"
   - ✅ Admin ve: "Gestión Newsletter"

3. **Comunicados** (Admin → Gestionar Comunicados)
   - ✅ Subida de imágenes funciona
   - ✅ Subida de PDFs funciona

---

## 🎯 RESULTADO ESPERADO

✅ Portal completamente funcional  
✅ Encuestas requieren autenticación (evita votos duplicados)  
✅ Navegación diferenciada sin duplicación  
✅ Sistema de subida de archivos operativo  

---

**📞 Soporte**: Portal UGT TOWA - Versión Final Completada  
**📅 Fecha**: 23-Nov-2025  
**🏷️ Versión**: 2.1.0 - Correcciones Finales
