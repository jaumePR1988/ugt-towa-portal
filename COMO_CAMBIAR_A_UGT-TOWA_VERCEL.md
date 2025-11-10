# 🚀 CÓMO CAMBIAR A `ugt-towa.vercel.app` (3 MINUTOS)

## 📋 **PASOS PARA CAMBIAR LA URL A ugt-towa.vercel.app**

### **OPCIÓN 1: VERCEL CLI (MÁS RÁPIDO)**

1. **Instalar Vercel CLI si no lo tienes:**
   ```bash
   npm install -g vercel
   # O si usas npx:
   npx vercel@latest login
   ```

2. **Login (se abre el navegador):**
   ```bash
   npx vercel@latest login
   # Sigue el proceso de autenticación
   ```

3. **Desplegar con nombre personalizado:**
   ```bash
   cd /workspace/ugt-towa-portal
   npx vercel@latest --name ugt-towa --prod
   ```

4. **Configurar variables de entorno (si aparecen):**
   - `VITE_SUPABASE_URL` = "https://zaxdscclkeytakcowgww.supabase.co"
   - `VITE_SUPABASE_ANON_KEY` = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

5. **Verificar:**
   - Ve a: https://ugt-towa.vercel.app
   - Debería cargar tu portal

---

### **OPCIÓN 2: WEB DE VERCEL (MÁS VISUAL)**

1. **Ir a:** https://vercel.com
2. **Hacer login** con tu cuenta
3. **Crear nuevo proyecto:**
   - "Add New" → "Project"
   - Importar el código desde tu carpeta local
   - Nombre del proyecto: `ugt-towa`
4. **Configurar variables de entorno:**
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
5. **Deploy**
6. **Tu URL será:** https://ugt-towa.vercel.app

---

## ⚠️ **NOTA IMPORTANTE**

El proyecto ya está completamente configurado y listo para desplegar. Solo necesitas:
1. **Autenticarte en Vercel** (2 minutos)
2. **Desplegar con el nombre correcto** (1 minuto)
3. **Variables de entorno** (30 segundos)

**TIEMPO TOTAL:** ~3-4 minutos

## 📞 **SI NECESITAS AYUDA**

Si tienes problemas:
1. **Documentación oficial:** https://vercel.com/docs
2. **Soporte Vercel:** https://vercel.com/support
3. **Problema común:** Asegúrate de estar en la carpeta correcta del proyecto

## 🎯 **RESULTADO FINAL**

Después de estos pasos tendrás:
- **URL profesional:** https://ugt-towa.vercel.app
- **Todas las funcionalidades** preservadas
- **SSL automático** incluido
- **Performance optimizado** por Vercel

**¿Y después?** Configurar `ugt.towa.es` como dominio personalizado.