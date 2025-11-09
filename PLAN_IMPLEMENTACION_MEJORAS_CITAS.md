# Plan de Implementación - Mejoras Sistema de Citas UGT Towa

## 🎯 MEJORAS RECOMENDADAS - PRIORIZADAS

### 🔥 **FASE 1: IMPLEMENTACIÓN INMEDIATA (1-2 semanas)**

#### 1.1 Recordatorios Automáticos por Email
**Funcionalidad:**
- Email 24h antes de la cita
- Email 1h antes de la cita (opcional)
- Templates con branding UGT
- Información completa: fecha, hora, tipo de delegado

**Implementación Técnica:**
```typescript
// Nueva Edge Function: send-appointment-reminders
// Cron Job diario: 8:00 AM para citas del día siguiente
// Query: appointments WHERE start_time BETWEEN tomorrow_8am AND tomorrow_8pm
```

**Archivos a Crear/Modificar:**
- `/workspace/supabase/functions/send-appointment-reminders/index.ts`
- Modificar `/workspace/supabase/functions/send-notifications/index.ts`
- Crear cron job: `appointments-reminder-daily`

#### 1.2 Notificaciones a Delegados Sindicales
**Funcionalidad:**
- Email automático al delegate cuando se agenda cita
- Información del afiliado (nombre, email, motivo si se proporciona)
- Opción de contacto directo
- Notificación de cancelaciones

**Implementación Técnica:**
- Modificar Edge Function de reserva de citas
- Tabla `delegates` con emails de contacto
- Templates específicos para delegados

#### 1.3 Mejorar Panel de Administración
**Funcionalidad:**
- Vista de calendario mensual
- Estadísticas básicas: citas por día, no-shows
- Gestión rápida de estados
- Filtros por tipo de delegado y fecha

**Archivos a Modificar:**
- `AdminCitas.tsx` - Interfaz completa rediseñada
- `AdminDisponibilidad.tsx` - Vista calendario
- Añadir gráficos con Chart.js

### 🔧 **FASE 2: MEJORAS AVANZADAS (2-3 semanas)**

#### 2.1 Sistema de Reprogramación
**Funcionalidad:**
- Botón "Reprogramar" en citas activas
- Búsqueda automática de slots disponibles
- Notificación automática de cambio
- Mantener historial de cambios

**Implementación:**
- Nueva función `rescheduleAppointment`
- Modal de selección de nueva fecha/hora
- Actualización automática de notificaciones

#### 2.2 Confirmación Automática
**Funcionalidad:**
- Sistema de doble confirmación (usuario + delegado)
- Recordatorio de confirmación 2h antes
- Auto-cancelación de slots no confirmados
- Penalización por no-shows

#### 2.3 Dashboard de Estadísticas
**Funcionalidad:**
- Métricas de uso mensuales
- Gráficos de eficiencia
- Reportes de no-shows
- Análisis de demanda por horario

### 🚀 **FASE 3: INNOVACIONES (1 mes)**

#### 3.1 Notificaciones en Tiempo Real
**Funcionalidad:**
- WebSockets para alertas instantáneas
- Notificaciones push del navegador
- Actualización automática de disponibilidad

#### 3.2 Integración con Calendarios
**Funcionalidad:**
- Export a Google Calendar/iCal
- Import de disponibilidad desde calendarios externos
- Sincronización bidireccional

## 📋 PLAN DE DESARROLLO DETALLADO

### Semana 1: Recordatorios Automáticos
**Día 1-2: Backend**
- Crear Edge Function `send-appointment-reminders`
- Diseñar templates de email profesionales
- Configurar cron job diario

**Día 3-4: Testing**
- Probar envío de emails
- Validar contenido de plantillas
- Verificar timing de recordatorios

**Día 5: Integración**
- Desplegar a producción
- Configurar variables de entorno
- Documentar uso

### Semana 2: Notificaciones a Delegados
**Día 1-2: Base de Datos**
- Actualizar tabla `delegates` con emails
- Crear sistema de asignación automática
- Migrar datos existentes

**Día 3-4: Frontend/Backend**
- Modificar flujo de reserva de citas
- Crear templates para delegados
- Implementar gestión de preferencias

**Día 5: Panel Admin**
- Mejorar interfaz de gestión
- Añadir vista de calendario
- Implementar estadísticas básicas

### Semana 3-4: Funcionalidades Avanzadas
**Reprogramación:**
- Crear modal de reprogramación
- Implementar lógica de búsqueda de slots
- Sistema de notificaciones de cambio

**Dashboard:**
- Integrar Chart.js para gráficos
- Crear métricas de eficiencia
- Implementar filtros avanzados

## 🛠️ ARQUITECTURA TÉCNICA

### Edge Functions Requeridas
```
1. send-appointment-reminders (nueva)
   - Trigger: Cron diario 8:00 AM
   - Query: appointments WHERE start_time BETWEEN [tomorrow_8am, tomorrow_8pm]
   - Action: Enviar emails recordatorio

2. notify-delegate (modificar existente)
   - Trigger: Al crear/actualizar cita
   - Query: delegates WHERE delegate_type = appointment.delegate_type
   - Action: Enviar notificación al delegado

3. reschedule-appointment (nueva)
   - Trigger: API call desde frontend
   - Action: Actualizar cita y notificar cambios
```

### Base de Datos - Nuevas Columnas
```sql
-- Tabla appointments
ALTER TABLE appointments ADD COLUMN confirmed_by_user BOOLEAN DEFAULT false;
ALTER TABLE appointments ADD COLUMN confirmed_by_delegate BOOLEAN DEFAULT false;
ALTER TABLE appointments ADD COLUMN reminder_sent_24h BOOLEAN DEFAULT false;
ALTER TABLE appointments ADD COLUMN reminder_sent_1h BOOLEAN DEFAULT false;
ALTER TABLE appointments ADD COLUMN reschedule_count INTEGER DEFAULT 0;
ALTER TABLE appointments ADD COLUMN original_appointment_id UUID REFERENCES appointments(id);

-- Tabla delegates
ALTER TABLE delegates ADD COLUMN email_notification BOOLEAN DEFAULT true;
ALTER TABLE delegates ADD COLUMN phone VARCHAR(20);
```

### Cron Jobs Configurados
```
1. daily-appointment-reminders
   - Horario: 08:00 todos los días
   - Función: send-appointment-reminders
   
2. hourly-status-check
   - Horario: Cada hora
   - Función: Verificar citas que requieren confirmación
```

## 📊 MÉTRICAS DE ÉXITO

### KPIs a Medir
- **Tasa de no-shows**: Meta < 10% (actual estimado 25-30%)
- **Tiempo de gestión administrativa**: Meta < 30 min/día
- **Satisfacción de usuarios**: Meta > 4.5/5
- **Utilización de slots**: Meta > 80% (actual estimado 60%)

### Herramientas de Medición
- Dashboard de estadísticas en tiempo real
- Reportes mensuales automatizados
- Encuestas de satisfacción a usuarios
- Análisis de logs de actividad

## 💰 ESTIMACIÓN DE COSTOS

### Desarrollo
- **Fase 1**: 15-20 horas (recordatorios + notificaciones)
- **Fase 2**: 25-30 horas (reprogramación + dashboard)
- **Fase 3**: 20-25 horas (tiempo real + integración)
- **Total**: 60-75 horas de desarrollo

### Beneficios Económicos
- **Ahorro de tiempo administrativo**: 10h/semana = 520h/año
- **Mejora en eficiencia**: 30% más citas efectivas
- **Reducción de no-shows**: 60% menos tiempo perdido
- **ROI estimado**: 300-500% en el primer año

## 🎯 PRÓXIMOS PASOS

### Implementación Inmediata
1. **Aprobar plan de mejoras** (estimación 2 días)
2. **Configurar entorno de desarrollo** (1 día)
3. **Desarrollar Fase 1** (5-7 días)
4. **Testing y deployment** (2-3 días)
5. **Documentación y training** (1 día)

### Timeline Total: 2-3 semanas

¿Estás listo para comenzar con la Fase 1 (recordatorios automáticos)?