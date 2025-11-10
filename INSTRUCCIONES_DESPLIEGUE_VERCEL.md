# Instrucciones Rápidas de Despliegue en Vercel

## Paso 1: Instalar Vercel CLI

```bash
npm install -g vercel
```

## Paso 2: Ir al Directorio del Proyecto

```bash
cd /workspace/ugt-towa-portal
```

## Paso 3: Iniciar Sesión en Vercel

```bash
vercel login
```

Sigue las instrucciones para autenticarte.

## Paso 4: Desplegar el Proyecto

```bash
vercel
```

Responde a las preguntas:
- **Set up and deploy?** → Yes
- **Which scope?** → [Selecciona tu cuenta]
- **Link to existing project?** → No
- **What's your project's name?** → `ugt-towa-portal`
- **In which directory is your code located?** → `./`
- **Want to override the settings?** → No

## Paso 5: Configurar Variables de Entorno

### Opción A: Desde el Dashboard

1. Ve a [vercel.com/dashboard](https://vercel.com/dashboard)
2. Selecciona tu proyecto `ugt-towa-portal`
3. Ve a **Settings** → **Environment Variables**
4. Añade estas dos variables:

**Variable 1:**
- Name: `VITE_SUPABASE_URL`
- Value: `https://zaxdscclkeytakcowgww.supabase.co`
- Environments: ✅ Production ✅ Preview ✅ Development

**Variable 2:**
- Name: `VITE_SUPABASE_ANON_KEY`
- Value: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpheGRzY2Nsa2V5dGFrY293Z3d3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIwMTUxMTIsImV4cCI6MjA3NzU5MTExMn0.MQMePYqEhW9xhCipC-MeU8Z_dXqvyBKH5e0vtgaS9xQ`
- Environments: ✅ Production ✅ Preview ✅ Development

### Opción B: Desde CLI

```bash
vercel env add VITE_SUPABASE_URL
# Pegar: https://zaxdscclkeytakcowgww.supabase.co
# Seleccionar: Production, Preview, Development

vercel env add VITE_SUPABASE_ANON_KEY
# Pegar: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpheGRzY2Nsa2V5dGFrY293Z3d3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIwMTUxMTIsImV4cCI6MjA3NzU5MTExMn0.MQMePYqEhW9xhCipC-MeU8Z_dXqvyBKH5e0vtgaS9xQ
# Seleccionar: Production, Preview, Development
```

## Paso 6: Redesplegar con Variables de Entorno

```bash
vercel --prod
```

## Paso 7: Verificar el Despliegue

Vercel te dará una URL como:
```
https://ugt-towa-portal.vercel.app
```

o

```
https://ugt-towa-portal-xxxxx.vercel.app
```

### Verificaciones Obligatorias:

1. Abre la URL en tu navegador
2. Verifica que la página principal carga
3. Prueba el login con:
   - Email: `jpedragosa@towapharmaceutical.com`
   - Password: `towa2022`
4. Verifica que el panel de administración funciona
5. Comprueba que no hay errores en la consola del navegador

## Checklist de Verificación

- [ ] Proyecto desplegado en Vercel
- [ ] Variables de entorno configuradas (VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY)
- [ ] Redespliegue completado con `vercel --prod`
- [ ] URL de producción accesible
- [ ] Login funciona correctamente
- [ ] Panel de administración accesible
- [ ] Citas se pueden reservar
- [ ] Comunicados se visualizan
- [ ] Sin errores en consola del navegador

## Configurar Dominio Personalizado (Opcional)

Si tienes un dominio propio:

```bash
vercel domains add tu-dominio.com
```

O desde el dashboard: **Settings** → **Domains** → **Add Domain**

## Comandos Útiles

```bash
# Ver todos los deployments
vercel ls

# Ver logs en tiempo real
vercel logs --follow

# Eliminar un deployment
vercel rm [url]

# Ver información del proyecto
vercel inspect
```

## Soporte

Si tienes problemas:

1. Revisa la **Guía de Despliegue Completa**: `/workspace/GUIA_DESPLIEGUE_VERCEL.md`
2. Consulta los logs: `vercel logs`
3. Verifica las variables de entorno en el dashboard
4. Asegúrate de haber redesplegado después de configurar las variables

---

**Fecha:** 2025-11-11  
**URL Original:** https://ottakjvc490n.space.minimax.io  
**Supabase URL:** https://zaxdscclkeytakcowgww.supabase.co
