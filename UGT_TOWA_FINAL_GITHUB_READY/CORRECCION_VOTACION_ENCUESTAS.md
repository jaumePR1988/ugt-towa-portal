# Corrección Urgente: Error en Votación de Encuestas

## Problema Identificado
El sistema de votación en encuestas retorna el error "Error al votar" debido a políticas RLS (Row Level Security) restrictivas en la tabla `survey_responses`.

## Solución

### Opción 1: Ejecutar SQL en Supabase Dashboard (RECOMENDADO)

1. **Ir a Supabase Dashboard**: https://app.supabase.com/project/zaxdscclkeytakcowgww
2. **Ir a SQL Editor**: Panel lateral → SQL Editor
3. **Ejecutar el siguiente SQL**:

```sql
-- Paso 1: Eliminar políticas existentes que puedan estar causando conflictos
DROP POLICY IF EXISTS "Allow authenticated users to insert responses" ON survey_responses;
DROP POLICY IF EXISTS "Allow users to insert their own responses" ON survey_responses;
DROP POLICY IF EXISTS "Users can insert responses" ON survey_responses;
DROP POLICY IF EXISTS "authenticated_insert_responses" ON survey_responses;
DROP POLICY IF EXISTS "Allow anyone to view responses" ON survey_responses;
DROP POLICY IF EXISTS "Allow public to view responses" ON survey_responses;
DROP POLICY IF EXISTS "public_view_responses" ON survey_responses;
DROP POLICY IF EXISTS "users_view_own_responses" ON survey_responses;
DROP POLICY IF EXISTS "users_view_all_responses" ON survey_responses;

-- Paso 2: Asegurar que RLS está habilitado
ALTER TABLE survey_responses ENABLE ROW LEVEL SECURITY;

-- Paso 3: Crear políticas correctas

-- Permitir a todos ver las respuestas (necesario para mostrar resultados)
CREATE POLICY "public_view_responses" 
ON survey_responses 
FOR SELECT 
USING (true);

-- Permitir a usuarios autenticados insertar sus propias respuestas
CREATE POLICY "authenticated_insert_responses" 
ON survey_responses 
FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Paso 4: Verificar que las políticas se crearon correctamente
SELECT 
  policyname, 
  cmd,
  permissive,
  roles
FROM pg_policies 
WHERE tablename = 'survey_responses'
ORDER BY policyname;
```

4. **Verificar resultado**: Deberían aparecer 2 políticas:
   - `authenticated_insert_responses` (INSERT, authenticated)
   - `public_view_responses` (SELECT, public)

### Opción 2: Usar archivo de migración

El archivo SQL de migración ya está creado en:
```
/supabase/migrations/1732319400_fix_survey_responses_rls.sql
```

Este archivo se puede aplicar usando:
- Supabase CLI: `supabase db push`
- O manualmente copiando el contenido en SQL Editor

## Verificación

Después de aplicar la corrección:

1. Ir a https://lmgqlxg2tvei.space.minimax.io/login
2. Iniciar sesión con: jpedragosa@towapharmaceutical.com / towa2022
3. Ir a /encuestas
4. Intentar votar en una encuesta
5. El voto debería registrarse exitosamente

## Explicación Técnica

### Problema
Las políticas RLS anteriores no permitían que usuarios autenticados pudieran insertar respuestas en la tabla `survey_responses`.

### Solución Aplicada
- **Política SELECT**: Permite a cualquier usuario ver las respuestas (necesario para mostrar resultados de encuestas)
- **Política INSERT**: Permite solo a usuarios autenticados insertar respuestas, verificando que el `user_id` coincida con el ID del usuario autenticado (`auth.uid()`)

### Código Frontend
El código en `EncuestasPage.tsx` ya está correctamente implementado:
- Líneas 43-47: Verifica autenticación antes de votar
- Línea 54: Incluye `user_id` en el INSERT
- Línea 58-63: Maneja errores (duplicados, etc.)

## Estado Actual

- ✅ Código frontend: CORRECTO
- ⚠️ Políticas RLS: REQUIEREN CORRECCIÓN
- 📄 Archivo de migración: CREADO y listo para aplicar
- 🔧 Acción requerida: EJECUTAR SQL en Supabase Dashboard

**Prioridad**: URGENTE - Funcionalidad crítica bloqueada
