# Despliegue del Portal UGT-TOWA en Vercel

## Estado Actual

**Portal Funcional:** https://xgcm15mdvtmk.space.minimax.io  
**Estado:** 100% operativo, todas las funcionalidades verificadas

## Limitación Técnica Identificada

Para obtener una URL personalizada como `ugt-towa.vercel.app`, es necesario:

1. **Autenticación en Vercel:** Requiere login interactivo con navegador
2. **Cuenta de Vercel:** Necesaria para crear proyectos con nombres personalizados

**Estas acciones requieren intervención manual del usuario.**

---

## Solución Preparada

He preparado **todo el código y configuración** para que puedas desplegar en Vercel en menos de 5 minutos:

### Opción 1: Script Automatizado (Recomendado)

He creado un script que te guía paso a paso:

```bash
cd /workspace/ugt-towa-portal
./deploy-vercel.sh
```

El script:
- Verifica que todo está listo
- Crea el archivo de variables de entorno
- Te muestra los comandos exactos a ejecutar
- Te guía en la configuración

### Opción 2: Comandos Manuales

Si prefieres ejecutar los comandos directamente:

#### 1. Login en Vercel
```bash
cd /workspace/ugt-towa-portal
npx vercel login
```

Sigue las instrucciones en el navegador para autenticarte.

#### 2. Desplegar
```bash
npx vercel --name ugt-towa --prod
```

Responde a las preguntas:
- Set up and deploy? → **YES**
- Which scope? → **[Tu cuenta]**
- Link to existing project? → **NO**
- What's your project's name? → **ugt-towa**
- In which directory is your code located? → **./**
- Want to override the settings? → **NO**

#### 3. Configurar Variables de Entorno

Ve a [https://vercel.com/dashboard](https://vercel.com/dashboard):

1. Selecciona tu proyecto `ugt-towa`
2. Ve a **Settings** → **Environment Variables**
3. Añade estas variables:

**Variable 1:**
```
Name: VITE_SUPABASE_URL
Value: https://zaxdscclkeytakcowgww.supabase.co
Environments: ✓ Production ✓ Preview ✓ Development
```

**Variable 2:**
```
Name: VITE_SUPABASE_ANON_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpheGRzY2Nsa2V5dGFrY293Z3d3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIwMTUxMTIsImV4cCI6MjA3NzU5MTExMn0.MQMePYqEhW9xhCipC-MeU8Z_dXqvyBKH5e0vtgaS9xQ
Environments: ✓ Production ✓ Preview ✓ Development
```

#### 4. Redesplegar con Variables
```bash
npx vercel --prod
```

---

## Resultado Esperado

**URL Final:** https://ugt-towa.vercel.app

Esta URL será:
- Profesional y fácil de recordar
- Con certificado SSL automático
- Con analytics incluidos
- Personalizable con dominio propio después

---

## Archivos Preparados

Todo está listo para el despliegue:

- `/workspace/ugt-towa-portal/dist/` - Build de producción (2685 módulos)
- `/workspace/ugt-towa-portal/vercel.json` - Configuración de Vercel
- `/workspace/ugt-towa-portal/.env` - Variables de entorno locales
- `/workspace/ugt-towa-portal/.env.example` - Plantilla de variables
- `/workspace/ugt-towa-portal/deploy-vercel.sh` - Script de despliegue automatizado

**Vercel CLI:** Instalado y listo (v48.9.0)

---

## Portal de Prueba Disponible

Mientras configuras Vercel, puedes usar:

**URL:** https://xgcm15mdvtmk.space.minimax.io

**Credenciales:**
- Email: jpedragosa@towapharmaceutical.com
- Contraseña: towa2022

**Estado:** Completamente funcional y verificado

---

## Tiempo Estimado

- **Login en Vercel:** 1 minuto
- **Primer despliegue:** 2 minutos
- **Configurar variables:** 2 minutos
- **Redespliegue final:** 1 minuto

**Total:** ~6 minutos para tener https://ugt-towa.vercel.app funcionando

---

## Próximos Pasos (Futuro)

Una vez que tengas el dominio **ugt.towa.es**:

1. Ve a Vercel Dashboard → Settings → Domains
2. Añade `ugt.towa.es`
3. Configura los registros DNS según las instrucciones de Vercel
4. Espera propagación (24-48 horas)

**Resultado:** https://ugt.towa.es

---

## Soporte

Si encuentras algún problema durante el despliegue:

1. **Error de autenticación:** Asegúrate de tener una cuenta en vercel.com
2. **Error de build:** El build ya está hecho en `dist/`, no debería fallar
3. **Error de variables:** Cópialas exactamente como se muestran arriba
4. **URL incorrecta:** Verifica que usaste `--name ugt-towa` en el comando

---

## Resumen

**Lo que está listo:**
- Código 100% preparado
- Build de producción generado
- Configuración de Vercel creada
- Variables de entorno documentadas
- Script de despliegue automatizado
- Vercel CLI instalado

**Lo que necesitas hacer:**
1. Ejecutar `./deploy-vercel.sh` o los comandos manuales
2. Autenticarte en Vercel (login con navegador)
3. Configurar las 2 variables de entorno en el dashboard
4. Redesplegar

**Resultado:** https://ugt-towa.vercel.app funcionando en ~6 minutos

---

**Fecha:** 2025-11-11  
**Portal de Prueba:** https://xgcm15mdvtmk.space.minimax.io  
**Portal Vercel (pendiente):** https://ugt-towa.vercel.app  
**Estado:** Listo para despliegue manual en Vercel
