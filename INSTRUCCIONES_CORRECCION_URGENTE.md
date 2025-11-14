# CORRECCIÓN URGENTE: Funciones de Eliminación

## Problema
Las funciones de eliminación en el portal **NO funcionan** porque faltan políticas de seguridad RLS (Row Level Security) en Supabase.

**Afectadas:**
- ❌ Eliminar citas en AdminCitas
- ❌ Eliminar suscriptores en AdminNewsletter

## Solución (5 minutos)

### Paso 1: Acceder a Supabase SQL Editor

1. Ir a: https://zaxdscclkeytakcowgww.supabase.co/project/zaxdscclkeytakcowgww/editor
2. Hacer clic en "SQL Editor" en el menú lateral
3. Hacer clic en "New Query"

### Paso 2: Ejecutar el Script de Corrección

1. Abrir el archivo `FIX_DELETE_POLICIES.sql`
2. Copiar **TODO** el contenido del archivo
3. Pegar en el SQL Editor de Supabase
4. Hacer clic en el botón **"Run"** (o presionar Ctrl+Enter)

### Paso 3: Verificar la Aplicación

Deberías ver en los resultados:
```
✓ Allow authenticated users to delete appointments | DELETE | ✓ Correcta
✓ Allow admins to delete any appointment | DELETE | ✓ Correcta
✓ Allow admins to delete subscribers | DELETE | ✓ Correcta
```

Y el mensaje:
```
POLÍTICAS RLS DE DELETE APLICADAS CORRECTAMENTE
Las funciones de eliminación ahora deberían funcionar en el portal
```

### Paso 4: Probar las Funciones

1. Ir al portal: https://nyn3gqez8ode.space.minimax.io
2. Iniciar sesión como administrador
3. Ir a **Admin > Gestión de Citas**
4. Intentar eliminar una cita - **Debería funcionar** ✓
5. Ir a **Admin > Newsletter**
6. Intentar eliminar un suscriptor - **Debería funcionar** ✓

## ¿Por qué ocurrió esto?

Las políticas RLS de Supabase controlan qué usuarios pueden hacer qué operaciones en cada tabla. Las políticas para **INSERT**, **SELECT** y **UPDATE** estaban configuradas, pero faltaban las políticas para **DELETE**.

## Archivos Involucrados

- `/workspace/FIX_DELETE_POLICIES.sql` - Script SQL para aplicar
- `/workspace/INSTRUCCIONES_CORRECCION_URGENTE.md` - Este archivo
- `/workspace/ugt-towa-portal/src/pages/admin/AdminCitas.tsx` - Código correcto (líneas 1120-1145)
- `/workspace/ugt-towa-portal/src/pages/admin/AdminNewsletter.tsx` - Código correcto (líneas 262-285)

## Políticas Aplicadas

### Tabla: appointments
1. **"Allow authenticated users to delete appointments"**
   - Usuarios autenticados pueden eliminar sus propias citas
   - Condición: `auth.uid() = user_id`

2. **"Allow admins to delete any appointment"**
   - Administradores pueden eliminar cualquier cita
   - Condición: usuario tiene `role = 'admin'`

### Tabla: newsletter_subscribers
1. **"Allow admins to delete subscribers"**
   - Solo administradores pueden eliminar suscriptores
   - Condición: usuario tiene `role = 'admin'`

## Resultado Esperado

Después de aplicar este script:
- ✅ Los botones "Eliminar" funcionarán correctamente
- ✅ Los registros se eliminarán permanentemente de la base de datos
- ✅ Las listas se actualizarán automáticamente
- ✅ Aparecerán notificaciones de éxito

## Soporte

Si después de aplicar el script las funciones de eliminación aún no funcionan:
1. Verificar que el usuario está logueado como administrador
2. Revisar la consola del navegador en busca de errores
3. Verificar que las políticas se aplicaron correctamente ejecutando:
   ```sql
   SELECT tablename, policyname, cmd 
   FROM pg_policies 
   WHERE tablename IN ('appointments', 'newsletter_subscribers') 
   AND cmd = 'DELETE';
   ```
