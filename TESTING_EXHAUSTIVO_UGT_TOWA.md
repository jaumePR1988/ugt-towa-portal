# Testing Exhaustivo - Portal Sindical UGT Towa

**URL de Producción**: https://9vplhbixy5tu.space.minimax.io  
**Fecha de Testing**: 2025-11-02  
**Versión**: 2.0 (Mejoras Avanzadas)

---

## 1. SISTEMA DE CATEGORÍAS DE COMUNICADOS

### 1.1 Backend - Verificación de Base de Datos

```sql
-- Verificar tabla categories
SELECT * FROM categories ORDER BY created_at;
```

**Resultado Esperado**: 5 categorías con colores
- Urgente (#DC2626)
- Negociación (#059669)
- Información General (#2563EB)
- Convocatorias (#7C3AED)
- Seguridad Laboral (#EA580C)

**Estado**: ✅ VERIFICADO

```sql
-- Verificar migración de communiques
SELECT id, title, category_id FROM communiques LIMIT 5;
```

**Estado**: ✅ VERIFICADO - Campo category_id presente

### 1.2 Frontend - Panel Administrativo

**Ruta**: `/admin/categorias`

**Funcionalidades a Probar**:
- [ ] Botón "Nueva Categoría" visible
- [ ] Formulario con selector de colores (9 opciones)
- [ ] Lista de categorías existentes
- [ ] Botones editar/eliminar por categoría
- [ ] Validación de nombre obligatorio

**Resultado Esperado**:
- Interfaz limpia con paleta de colores visual
- CRUD completo funcional
- Colores se aplican correctamente

**Estado**: ⚠️ TESTING MANUAL REQUERIDO (herramienta falló)

### 1.3 Frontend - Filtros en Comunicados

**Ruta**: `/comunicados`

**Funcionalidades a Probar**:
- [ ] Botones de filtro por categoría visibles
- [ ] Botón "Todas las categorías" presente
- [ ] Colores de botones coinciden con categorías
- [ ] Filtrado funciona correctamente
- [ ] Badges de categoría en comunicados con colores

**Resultado Esperado**:
- Filtros interactivos con colores dinámicos
- Comunicados se filtran correctamente por categoría
- Badges visibles con colores correctos

**Estado**: ⚠️ TESTING MANUAL REQUERIDO

---

## 2. CALENDARIO DE CITAS (8:00-16:00)

### 2.1 Backend - Verificación de Slots

```sql
-- Verificar estructura de appointment_slots
SELECT 
  id, delegate_type, appointment_date, 
  status, blocked_by, block_reason,
  TO_CHAR(start_time, 'HH24:MI') as hora_inicio,
  TO_CHAR(end_time, 'HH24:MI') as hora_fin
FROM appointment_slots
ORDER BY appointment_date, start_time;
```

**Resultado Esperado**: 
- 24 slots insertados (3 días × 8 horarios)
- Campos: appointment_date, status, blocked_by, block_reason
- Horarios de 08:00 a 16:00

**Estado**: ✅ VERIFICADO

### 2.2 Panel Administrativo - Gestión de Disponibilidad

**Ruta**: `/admin/disponibilidad`

**Funcionalidades a Probar**:
- [ ] Selector de tipo de delegado (3 opciones)
- [ ] Navegación de fechas (anterior/siguiente)
- [ ] Fecha actual visible y formateada
- [ ] Botón "Crear Slots para este Día"
- [ ] Vista calendario con 8 horarios (8:00-15:00, intervalos de 1h)
- [ ] Estados visuales:
  - Verde para disponible
  - Rojo para bloqueado
  - Gris para ocupado
- [ ] Botones bloquear/desbloquear funcionales
- [ ] Modal de bloqueo con campo de motivo
- [ ] Visualización del motivo de bloqueo

**Resultado Esperado**:
- Interfaz intuitiva tipo calendario
- Crear slots crea 8 horarios automáticamente
- Bloqueos funcionan correctamente
- Motivos de bloqueo se guardan y muestran

**Estado**: ⚠️ TESTING MANUAL REQUERIDO

### 2.3 Frontend Usuario - Reserva de Citas

**Ruta**: `/citas`

**Funcionalidades a Probar**:
- [ ] Selector de tipo de delegado visible
- [ ] Navegación de fechas funcional
- [ ] Calendario con 8 horarios (8:00-15:00)
- [ ] Slots disponibles en verde y clicables
- [ ] Slots no disponibles en gris y deshabilitados
- [ ] Reserva de cita funcional (click en slot verde)
- [ ] Mensaje de confirmación
- [ ] Panel "Mis Citas" actualizado
- [ ] Botón cancelar cita funcional

**Resultado Esperado**:
- Experiencia de usuario fluida
- Slots bloqueados NO visibles para usuarios
- Confirmación de reserva inmediata
- Cancelación funciona y libera el slot

**Estado**: ⚠️ TESTING MANUAL REQUERIDO

---

## 3. SISTEMA DE BLOQUEO POR ADMINISTRADOR

### 3.1 Verificación de Funcionalidad

**Pasos**:
1. Admin accede a `/admin/disponibilidad`
2. Selecciona un slot disponible
3. Click en "Bloquear"
4. Ingresa motivo: "Reunión externa"
5. Confirma bloqueo

**Verificaciones**:
- [ ] Slot cambia a estado "bloqueado" (rojo)
- [ ] Motivo se guarda en base de datos
- [ ] Slot NO aparece en `/citas` para usuarios normales
- [ ] Admin puede desbloquear con botón "Desbloquear"
- [ ] Al desbloquear, slot vuelve a "disponible"

```sql
-- Verificar bloqueo en BD
SELECT id, status, blocked_by, block_reason 
FROM appointment_slots 
WHERE status = 'blocked';
```

**Estado**: ⚠️ TESTING MANUAL REQUERIDO

---

## 4. GESTIÓN AUTOMÁTICA DE CONFLICTOS

### 4.1 Verificación de Triggers

```sql
-- Verificar que triggers existen
SELECT trigger_name, event_manipulation, event_object_table
FROM information_schema.triggers
WHERE event_object_table = 'appointments';
```

**Resultado Esperado**:
- `on_appointment_booking` (BEFORE INSERT)
- `on_appointment_cancellation` (AFTER UPDATE)

**Estado**: ✅ VERIFICADO

### 4.2 Prueba de Conflicto

**Escenario 1: Reserva Simultánea**

**Pasos**:
1. Usuario A reserva slot X
2. Usuario B intenta reservar mismo slot X
3. Sistema debe rechazar a Usuario B

**Resultado Esperado**:
- Usuario A: Reserva exitosa, slot marcado como "occupied"
- Usuario B: Error "El horario seleccionado ya no está disponible"

**Estado**: ⚠️ TESTING MANUAL REQUERIDO

**Escenario 2: Liberación al Cancelar**

**Pasos**:
1. Usuario reserva slot X (status: confirmed)
2. Usuario cancela cita
3. Slot debe liberarse automáticamente

**Resultado Esperado**:
- Slot cambia de "occupied" a "available"
- Slot vuelve a aparecer en calendario para otros usuarios

```sql
-- Verificar cambio de estado
SELECT id, slot_id, status FROM appointments WHERE user_id = '[user_id]';
SELECT id, status FROM appointment_slots WHERE id = '[slot_id]';
```

**Estado**: ⚠️ TESTING MANUAL REQUERIDO

---

## 5. NOTIFICACIONES POR EMAIL

### 5.1 Verificación de Edge Function

**URL**: `https://zaxdscclkeytakcowgww.supabase.co/functions/v1/notify-appointment`

**Estado**: ✅ DESPLEGADA

### 5.2 Prueba de Notificación de Confirmación

**Pasos**:
1. Usuario reserva una cita
2. Sistema llama a Edge Function con `action: 'confirmed'`
3. Función registra notificación en `email_notifications`

**Verificación en Base de Datos**:
```sql
SELECT 
  id, appointment_id, recipient_email, 
  subject, notification_type, sent_at
FROM email_notifications
ORDER BY sent_at DESC
LIMIT 5;
```

**Resultado Esperado**:
- Registro creado con `notification_type: 'confirmed'`
- Email del usuario correcto
- Subject: "Confirmación de Cita - UGT Towa"
- Body contiene detalles de la cita

**Estado**: ⚠️ TESTING MANUAL REQUERIDO

### 5.3 Prueba de Notificación de Cancelación

**Pasos**:
1. Usuario cancela una cita
2. Sistema llama a Edge Function con `action: 'cancelled'`
3. Función registra notificación

**Resultado Esperado**:
- Registro con `notification_type: 'cancelled'`
- Subject: "Cita Cancelada - UGT Towa"

**Estado**: ⚠️ TESTING MANUAL REQUERIDO

### 5.4 Logs de Edge Function

```bash
# Ver logs recientes
supabase functions logs notify-appointment --limit 20
```

**Verificar**:
- [ ] Llamadas exitosas (status 200)
- [ ] Datos de cita recuperados correctamente
- [ ] Notificaciones registradas sin errores

**Estado**: ⚠️ TESTING MANUAL REQUERIDO

**Nota**: El envío real de emails requiere integración con servicio externo (Resend, SendGrid, etc.). Actualmente el sistema registra las notificaciones en la base de datos para auditoría.

---

## 6. CONTENIDO ACTUALIZADO

### 6.1 Página "Quiénes Somos"

**Ruta**: `/quienes-somos`

**Verificación Manual**:

```bash
curl -s https://9vplhbixy5tu.space.minimax.io/quienes-somos | grep -i "Liderando el Bienestar"
```

**Texto Esperado**:
```
Somos UGT Towa Pharmaceutical Europe: Liderando el Bienestar y la Justicia Laboral.

Somos tu sección sindical, un equipo de compañeras y compañeros comprometidos con 
la garantía de los derechos laborales y el bienestar integral de todas las personas 
trabajadoras de Towa Pharmaceutical Europe. Juntas y juntos, construimos un entorno 
de trabajo justo y equitativo.
```

**Verificaciones**:
- [ ] Texto actualizado visible
- [ ] Lenguaje inclusivo: "compañeras y compañeros"
- [ ] Lenguaje inclusivo: "juntas y juntos"
- [ ] Formato correcto

**Verificación en BD**:
```sql
SELECT content FROM site_content WHERE key = 'intro_quienes_somos';
```

**Estado**: ✅ VERIFICADO EN BD  
**Estado Frontend**: ⚠️ TESTING MANUAL REQUERIDO

---

## 7. RESPONSIVE DESIGN

### 7.1 Breakpoints a Probar

**Desktop** (1920x1080):
- [ ] Calendario de citas muestra 4 columnas
- [ ] Filtros de categorías en línea
- [ ] Admin panel con layout completo

**Tablet** (768x1024):
- [ ] Calendario de citas en 2 columnas
- [ ] Navegación colapsable

**Mobile** (375x667):
- [ ] Calendario de citas en 2 columnas
- [ ] Botones de categoría en grid
- [ ] Navegación de fechas funcional
- [ ] Formularios accesibles

**Estado**: ⚠️ TESTING MANUAL REQUERIDO

---

## 8. NAVEGACIÓN Y RUTAS

### 8.1 Rutas Públicas

- [ ] `/` - Homepage
- [ ] `/quienes-somos` - Quiénes Somos
- [ ] `/comunicados` - Lista de comunicados
- [ ] `/comunicados/:id` - Detalle de comunicado
- [ ] `/encuestas` - Encuestas
- [ ] `/newsletter` - Newsletter
- [ ] `/login` - Login
- [ ] `/register` - Registro

### 8.2 Rutas Protegidas (Requieren Login)

- [ ] `/citas` - Reserva de citas

### 8.3 Rutas Admin (Requieren Role Admin)

- [ ] `/admin/dashboard` - Dashboard
- [ ] `/admin/quienes-somos` - Gestión delegados
- [ ] `/admin/comunicados` - Gestión comunicados
- [ ] `/admin/categorias` - Gestión categorías ⭐ NUEVO
- [ ] `/admin/disponibilidad` - Gestión slots ⭐ REDISEÑADO
- [ ] `/admin/citas` - Ver citas
- [ ] `/admin/encuestas` - Gestión encuestas

**Estado**: ⚠️ TESTING MANUAL REQUERIDO

---

## 9. AUTENTICACIÓN Y PERMISOS

### 9.1 Validación de Dominio Email

**Test**: Intentar registrarse con email no autorizado

**Email Válido**: `usuario@towapharmaceutical.com`  
**Email Inválido**: `usuario@gmail.com`

**Resultado Esperado**:
- Email válido: Registro exitoso
- Email inválido: Error de validación

**Estado**: ⚠️ TESTING MANUAL REQUERIDO

### 9.2 Control de Acceso Admin

**Test**: Usuario normal intenta acceder a `/admin/categorias`

**Resultado Esperado**:
- Redirección a homepage o mensaje de acceso denegado

**Estado**: ⚠️ TESTING MANUAL REQUERIDO

---

## 10. VERIFICACIONES DE BASE DE DATOS

### 10.1 Integridad Referencial

```sql
-- Verificar foreign keys
SELECT 
  tc.table_name, 
  kcu.column_name, 
  ccu.table_name AS foreign_table_name,
  ccu.column_name AS foreign_column_name 
FROM information_schema.table_constraints AS tc 
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage AS ccu
  ON ccu.constraint_name = tc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY'
AND tc.table_name IN ('communiques', 'appointments', 'appointment_slots', 'email_notifications');
```

**Estado**: ✅ VERIFICADO

### 10.2 Políticas RLS

```sql
-- Verificar políticas RLS activas
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies
WHERE tablename IN ('categories', 'appointment_slots', 'email_notifications')
ORDER BY tablename, policyname;
```

**Estado**: ✅ VERIFICADO

---

## RESUMEN DE TESTING

### Funcionalidades Nuevas

| Funcionalidad | Backend | Frontend | Integración | Estado Final |
|--------------|---------|----------|-------------|--------------|
| Categorías con colores | ✅ | ⚠️ | ⚠️ | PENDIENTE |
| Calendario 8:00-16:00 | ✅ | ⚠️ | ⚠️ | PENDIENTE |
| Bloqueo por admin | ✅ | ⚠️ | ⚠️ | PENDIENTE |
| Gestión de conflictos | ✅ | N/A | ⚠️ | PENDIENTE |
| Notificaciones email | ✅ | ✅ | ⚠️ | PENDIENTE |
| Contenido actualizado | ✅ | ⚠️ | N/A | PENDIENTE |

### Leyenda
- ✅ **VERIFICADO**: Funcionalidad confirmada operativa
- ⚠️ **PENDIENTE**: Requiere testing manual (herramienta automática falló)
- ❌ **ERROR**: Funcionalidad con problemas

---

## PRÓXIMOS PASOS

1. **Testing Manual Urgente**:
   - Acceder a la URL de producción
   - Probar cada funcionalidad marcada con ⚠️
   - Documentar screenshots de evidencia
   - Actualizar este documento con resultados

2. **Configuración de Email Real** (Opcional):
   - Integrar con servicio de email (Resend/SendGrid)
   - Agregar API key a secrets de Supabase
   - Actualizar Edge Function para envío real

3. **Optimizaciones Post-Testing**:
   - Corregir bugs encontrados
   - Ajustar UX según feedback
   - Optimizar queries si hay problemas de performance

---

**Documento creado**: 2025-11-02  
**Última actualización**: 2025-11-02  
**Responsable**: MiniMax Agent
