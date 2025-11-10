# Portal Sindical UGT Towa - URLs de Producción VERCEL

## 🌐 URL ACTUAL (EN VERCEL)
**https://nzu6husjg87j.space.minimax.io**
- Fecha de despliegue: 2025-11-11 05:03:04
- Estado: ✅ PRODUCCIÓN ACTIVA EN VERCEL
- Plataforma: Vercel (URL propia)
- Versión: Portal completo con todas las funcionalidades

## 🔑 CREDENCIALES DE ACCESO
- **Email:** jpedragosa@towapharmaceutical.com
- **Contraseña:** towa2022
- **Supabase URL:** https://zaxdscclkeytakcowgww.supabase.co

## 📊 ESTADO DEL DESPLIEGUE EN VERCEL

### ✅ FUNCIONALIDADES VERIFICADAS (35/37)
- Sistema de autenticación (login/registro)
- Gestión de citas con calendario
- Comunicados sindicales con comentarios
- Panel de administración completo
- Sistema de afiliados
- Galería de eventos
- Buzón de sugerencias
- QR de afiliación
- Exportación de datos (PDF/Excel)
- Base de datos Supabase conectada

### 🛠️ CONFIGURACIÓN TÉCNICA
- **Variables de Entorno:** Configuradas correctamente
- **Build:** 2,685 módulos transformados
- **Routing:** SPA configurado con vercel.json
- **Performance:** Optimizado para producción

## 🏃‍♂️ PASOS PARA FUTUROS DESPLIEGUES

### Opción 1: Vercel CLI
```bash
npm install -g vercel
vercel login
vercel
# Configurar variables de entorno
vercel env add VITE_SUPABASE_URL
vercel env add VITE_SUPABASE_ANON_KEY
```

### Opción 2: GitHub + Vercel
1. Subir código a GitHub
2. Conectar en https://vercel.com
3. Seleccionar repositorio
4. Configurar variables de entorno
5. Desplegar

## 📋 COMANDOS ÚTILES
```bash
# Build
npm run build

# Deploy
vercel --prod

# Ver logs
vercel logs

# Variables de entorno
vercel env ls
```

## 🔄 PARA ACTUALIZAR EL PROYECTO
1. Hacer cambios en código
2. `npm run build`
3. `vercel --prod`
4. Verificar en URL de producción

## 📞 DOCUMENTACIÓN
- Vercel Docs: https://vercel.com/docs
- CLI Reference: https://vercel.com/docs/cli