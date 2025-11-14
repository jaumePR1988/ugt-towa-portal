# Diagnóstico del Problema de Afiliados

## Problema Identificado

Los cambios de estado de usuario a afiliado en el panel AdminAfiliados.tsx no se persisten correctamente en la base de datos. El usuario hace clic en el desplegable para cambiar a "afiliado", aparece el mensaje de "cambio correcto", pero al recargar la página, el estado vuelve al inicial.

## Análisis del Código

### 1. Lógica del Componente AdminAfiliados.tsx

El código del componente está correctamente implementado:

```typescript
// Líneas 47-51: Actualización en base de datos
const { data, error } = await supabase
  .from('profiles')
  .update({ is_affiliate: newStatus })
  .eq('id', userId)
  .select('is_affiliate');

// Líneas 61-66: Verificación de persistencia
if (data && data.length > 0) {
  const updatedUser = data[0];
  if (updatedUser.is_affiliate !== newStatus) {
    throw new Error('El cambio no se persistió correctamente');
  }
}
```

**✅ Aspectos Correctos:**
- Actualización inmediata del estado local para feedback visual
- Verificación de la persistencia en base de datos
- Manejo adecuado de errores con toast messages
- Consulta SELECT después del UPDATE para confirmar cambios

### 2. Problema Principal: Políticas RLS (Row Level Security)

**🔴 PROBLEMA CRÍTICO IDENTIFICADO:**

En el archivo `1762032801_create_rls_policies_profiles.sql`, las políticas para la tabla `profiles` son:

```sql
-- Política UPDATE actual
CREATE POLICY "Allow users update own profile" ON profiles
  FOR UPDATE
  USING (auth.uid() = id OR auth.role() = 'service_role')
  WITH CHECK (auth.uid() = id OR auth.role() = 'service_role');
```

**❌ PROBLEMA:**
- Los administradores (`role = 'admin'`) no pueden actualizar el campo `is_affiliate` de otros usuarios
- La política solo permite:
  1. Actualizar el propio perfil (`auth.uid() = id`)
  2. Actualizar con `service_role`
- **Falta política específica para que admins actualicen `is_affiliate` de otros usuarios**

### 3. Estructura de Tabla profiles

El campo `is_affiliate` se añadió correctamente en `1762682676_add_is_affiliate_to_profiles.sql`:

```sql
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_affiliate BOOLEAN DEFAULT false;
```

### 4. Verificación de Políticas de Lectura

**✅ Lectura pública funciona:**
```sql
CREATE POLICY "Allow public read access to profiles"
ON profiles FOR SELECT
TO authenticated
USING (true);
```

La lectura está configurada correctamente, por eso el panel puede cargar los usuarios.

## Causas Raíz del Problema

### 1. **Políticas RLS Incorrectas (PRINCIPAL)**
- No hay política que permita a administradores actualizar el campo `is_affiliate` de otros usuarios
- La política actual solo permite auto-actualización

### 2. **Posible Inconsistencia de Permisos**
- Los administradores pueden tener `role = 'admin'` pero no tener `service_role`
- La autenticación JWT de administradores no incluye `service_role`

### 3. **Validación Post-Update Insuficiente**
- El código verifica `data[0].is_affiliate !== newStatus` pero esto no captura todos los errores
- Puede haber rollback silencioso por violación de RLS

## Soluciones Recomendadas

### **SOLUCIÓN 1: Agregar Política RLS Específica (RECOMENDADA)**

Crear nueva migración `add_admin_affiliate_update_policy.sql`:

```sql
-- Habilitar RLS si no está habilitado
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Eliminar política antigua de UPDATE si existe
DROP POLICY IF EXISTS "Allow users update own profile" ON profiles;

-- Política para auto-actualización
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Política para que administradores actualicen is_affiliate de otros usuarios
CREATE POLICY "Admins can update affiliate status" ON profiles
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles p 
      WHERE p.id = auth.uid() 
      AND p.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles p 
      WHERE p.id = auth.uid() 
      AND p.role = 'admin'
    )
  );

-- Política para service_role (mantener compatibilidad)
CREATE POLICY "Service role can update all profiles" ON profiles
  FOR UPDATE
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');
```

### **SOLUCIÓN 2: Modificar Política Existente (ALTERNATIVA)**

Editar archivo `1762032801_create_rls_policies_profiles.sql`:

```sql
-- Reemplazar política UPDATE actual con:
CREATE POLICY "Allow users update own profile" ON profiles
  FOR UPDATE
  USING (
    auth.uid() = id 
    OR auth.role() = 'service_role'
    OR (
      EXISTS (
        SELECT 1 FROM profiles p 
        WHERE p.id = auth.uid() 
        AND p.role = 'admin'
      )
    )
  )
  WITH CHECK (
    auth.uid() = id 
    OR auth.role() = 'service_role'
    OR (
      EXISTS (
        SELECT 1 FROM profiles p 
        WHERE p.id = auth.uid() 
        AND p.role = 'admin'
      )
    )
  );
```

### **SOLUCIÓN 3: Usar Edge Function (SI RLS no se puede modificar)**

Si no es posible modificar las políticas RLS, crear edge function:

```typescript
// supabase/functions/update-affiliate-status/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

serve(async (req) => {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  }

  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { userId, isAffiliate } = await req.json()
    
    // Usar service_role para bypass RLS
    const response = await fetch(
      `${Deno.env.get('SUPABASE_URL')}/rest/v1/profiles?id=eq.${userId}`,
      {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')}`,
          'apikey': Deno.env.get('SUPABASE_ANON_KEY')!,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ is_affiliate: isAffiliate })
      }
    )

    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`)
    }

    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})
```

## Pasos de Implementación Recomendados

### **Opción A: Corrección con Migración RLS**

1. **Crear migración:**
   ```bash
   # Crear nueva migración
   npx supabase migration new add_admin_affiliate_update_policy
   ```

2. **Aplicar cambios:**
   ```bash
   npx supabase db push
   ```

3. **Verificar políticas:**
   ```sql
   SELECT * FROM pg_policies WHERE tablename = 'profiles';
   ```

### **Opción B: Usar Edge Function**

1. **Crear edge function:**
   ```bash
   npx supabase functions new update-affiliate-status
   ```

2. **Modificar AdminAfiliados.tsx:**
   ```typescript
   // En lugar de update directo, usar edge function
   const { data, error } = await supabase.functions.invoke('update-affiliate-status', {
     body: { userId, isAffiliate: newStatus }
   });
   ```

## Verificación de la Solución

Para verificar que el problema se ha resuelto:

1. **Probar actualización manual en Supabase:**
   ```sql
   UPDATE profiles 
   SET is_affiliate = true 
   WHERE id = 'usuario-especifico';
   ```

2. **Verificar en AdminAfiliados.tsx:**
   - Cambiar estado a "Sí" 
   - Recargar página
   - Confirmar que el cambio persiste

3. **Verificar logs de Supabase:**
   ```bash
   npx supabase functions logs
   ```

## Resumen Ejecutivo

**Problema:** Las políticas RLS de la tabla `profiles` no permiten a los administradores actualizar el campo `is_affiliate` de otros usuarios.

**Solución Principal:** Agregar política RLS específica que permita a usuarios con `role = 'admin'` actualizar el campo `is_affiliate` de cualquier usuario.

**Impacto:** Una vez aplicada la solución, los cambios de estado de afiliación se persistirán correctamente y el problema desaparecerá.

**Complejidad:** Baja - requiere solo una migración SQL o edge function simple.

**Tiempo Estimado:** 15-30 minutos de implementación y pruebas.
