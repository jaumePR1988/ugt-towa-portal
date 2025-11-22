#!/usr/bin/env python3
"""
Script de diagnóstico y corrección para el sistema de votación de encuestas
Portal UGT TOWA
"""

import subprocess
import sys

print("="*70)
print("DIAGNÓSTICO Y CORRECCIÓN: Sistema de Votación de Encuestas")
print("="*70)
print()

print("PROBLEMA DETECTADO:")
print("- La votación en encuestas retorna 'Error al votar'")
print("- Causa probable: Políticas RLS restrictivas en tabla survey_responses")
print()

print("ANÁLISIS DEL CÓDIGO:")
print("✓ EncuestasPage.tsx (líneas 43-47): Verifica autenticación correctamente")
print("✓ INSERT incluye user_id del usuario autenticado (línea 54)")
print("✓ Manejo de errores implementado (líneas 58-63)")
print()

print("SOLUCIÓN REQUERIDA:")
print("Ejecutar SQL para corregir políticas RLS en Supabase")
print()

print("-"*70)
print("OPCIÓN 1: Ejecución Manual en Supabase Dashboard (RECOMENDADA)")
print("-"*70)
print()
print("1. Ir a: https://app.supabase.com/project/zaxdscclkeytakcowgww")
print("2. Panel lateral → SQL Editor")
print("3. Copiar y pegar el siguiente SQL:")
print()

sql_fix = """-- CORRECCIÓN RLS PARA VOTACIÓN EN ENCUESTAS

-- Paso 1: Limpiar políticas existentes
DROP POLICY IF EXISTS "authenticated_insert_responses" ON survey_responses;
DROP POLICY IF EXISTS "public_view_responses" ON survey_responses;
DROP POLICY IF EXISTS "users_view_all_responses" ON survey_responses;

-- Paso 2: Asegurar RLS habilitado
ALTER TABLE survey_responses ENABLE ROW LEVEL SECURITY;

-- Paso 3: Crear políticas correctas
CREATE POLICY "public_view_responses" 
ON survey_responses 
FOR SELECT 
USING (true);

CREATE POLICY "authenticated_insert_responses" 
ON survey_responses 
FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Paso 4: Verificar
SELECT policyname, cmd, permissive, roles
FROM pg_policies 
WHERE tablename = 'survey_responses'
ORDER BY policyname;"""

print(sql_fix)
print()

print("-"*70)
print("OPCIÓN 2: Archivo de Migración SQL")
print("-"*70)
print()
print("Ubicación: supabase/migrations/1732319400_fix_survey_responses_rls.sql")
print("Contiene el mismo SQL de corrección")
print()

print("-"*70)
print("VERIFICACIÓN POST-CORRECCIÓN")
print("-"*70)
print()
print("1. Ir a https://lmgqlxg2tvei.space.minimax.io")
print("2. Login: jpedragosa@towapharmaceutical.com / towa2022")
print("3. Navegar a /encuestas")
print("4. Intentar votar en una encuesta")
print("5. El voto debería registrarse sin errores")
print()

print("="*70)
print("ACCIÓN REQUERIDA: Ejecutar SQL en Supabase Dashboard")
print("="*70)
print()

# Guardar el SQL en un archivo para fácil copia
with open('/tmp/fix_survey_rls.sql', 'w') as f:
    f.write(sql_fix)

print(f"✓ SQL guardado en: /tmp/fix_survey_rls.sql")
print()
