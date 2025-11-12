# 🔧 SOLUCIÓN: Conectar Supabase con Vercel

## ⚠️ PROBLEMA IDENTIFICADO
Tu sitio en Vercel no conecta con Supabase porque faltan las variables de entorno críticas.

## 🚀 SOLUCIÓN PASO A PASO

### 1. IR AL DASHBOARD DE VERCEL
- Ve a: https://vercel.com/dashboard
- Inicia sesión

### 2. ENTRAR A TU PROYECTO
- Busca tu proyecto "ugt-towa" o similar
- Haz clic en él

### 3. CONFIGURAR VARIABLES DE ENTORNO
- Ve a la pestaña **"Settings"** (Configuración)
- En el menú izquierdo, busca **"Environment Variables"**

### 4. AGREGAR LAS 4 VARIABLES CRÍTICAS

#### 🔗 Variable 1: VITE_SUPABASE_URL
- **Name:** `VITE_SUPABASE_URL`
- **Value:** `https://zaxdscclkeytakcowgww.supabase.co`
- **Environment:** Production, Preview, Development

#### 🔑 Variable 2: VITE_SUPABASE_ANON_KEY
- **Name:** `VITE_SUPABASE_ANON_KEY`
- **Value:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpheGRzY2Nsa2V5dGFrY293Z3d3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIwMTUxMTIsImV4cCI6MjA3NzU5MTExMn0.MQMePYqEhW9xhCipC-MeU8Z_dXqvyBKH5e0vtgaS9xQ`
- **Environment:** Production, Preview, Development

#### 📧 Variable 3: VITE_CONTACT_EMAIL
- **Name:** `VITE_CONTACT_EMAIL`
- **Value:** `jpedragosa@towapharmaceutical.com`
- **Environment:** Production, Preview, Development

#### 📞 Variable 4: VITE_CONTACT_PHONE
- **Name:** `VITE_CONTACT_PHONE`
- **Value:** `629931957`
- **Environment:** Production, Preview, Development

### 5. REDEPLOYAR
- Ve a la pestaña **"Deployments"**
- Haz clic en los **3 puntos** del deploy más reciente
- Selecciona **"Redeploy"**

## 🎯 QUÉ SE SOLUCIONARÁ

✅ **Conexión con Supabase:** La base de datos funcionará
✅ **Imágenes:** Las imágenes de galerías y comuniqués se cargarán
✅ **Autenticación:** Los usuarios podrán iniciar sesión
✅ **Formularios:** Citas, encuestas y contacto funcionarán
✅ **Base de datos:** Todo el contenido dinámico se mostrará

## ⏱️ TIEMPO ESPERADO
- Configuración: 2-3 minutos
- Redeploy: 2-3 minutos
- **Total: ~5 minutos**

## 🔍 VERIFICACIÓN
Después del redeploy, ve a tu sitio y verifica:
1. **Imágenes se cargan** ✅
2. **Comuniqués aparecen** ✅
3. **Formulario de contacto funciona** ✅
4. **Encuestas se muestran** ✅

---
**¡Esta es la solución definitiva para el problema de conexión con Supabase!**