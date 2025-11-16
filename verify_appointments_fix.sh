#!/bin/bash

# Script de verificación post-corrección del sistema de citas
# Verifica que todas las correcciones estén funcionando correctamente

echo "=== VERIFICACIÓN POST-CORRECCIÓN SISTEMA DE CITAS ==="
echo ""

echo "1. Verificando estructura de tabla appointments..."
psql $DATABASE_URL -c "\d appointments" | grep -E "(comments|questions|documents|slot_id)"

echo ""
echo "2. Verificando índices de appointments..."
psql $DATABASE_URL -c "SELECT indexname, indexdef FROM pg_indexes WHERE tablename = 'appointments' AND indexname LIKE 'idx_appointments%';"

echo ""
echo "3. Verificando slots disponibles para hoy..."
psql $DATABASE_URL -c "SELECT COUNT(*) as slots_disponibles FROM appointment_slots WHERE appointment_date = CURRENT_DATE AND status = 'available';"

echo ""
echo "4. Verificando cron jobs activos..."
supabase cron jobs list

echo ""
echo "5. Verificando Edge Function generate-daily-appointment-slots..."
curl -s -o /dev/null -w "%{http_code}" "https://zaxdscclkeytakcowgww.supabase.co/functions/v1/generate-daily-appointment-slots" -X POST -H "Content-Type: application/json" -d '{"test": true}'

echo ""
echo "=== VERIFICACIÓN COMPLETADA ==="