# Opciones de URL para Portal UGT-TOWA

## Situación Actual

He desplegado el portal en el sistema interno, que genera URLs automáticas:

**URL Actual:** https://xgcm15mdvtmk.space.minimax.io  
**Estado:** Completamente funcional y verificado

**Problema:** Las URLs del sistema interno son generadas automáticamente y no se pueden personalizar.

---

## Opciones Disponibles

### OPCIÓN 1: Mantener URL Actual del Sistema Interno (Inmediato)

**URL:** https://xgcm15mdvtmk.space.minimax.io

**Ventajas:**
- Ya está desplegado y funcionando
- No requiere configuración adicional
- Todas las funcionalidades verificadas

**Desventajas:**
- URL aleatoria, difícil de recordar
- No se puede personalizar

---

### OPCIÓN 2: Desplegar en Vercel Real (Recomendado)

Para obtener una URL como **ugt-towa.vercel.app**, necesitas desplegar en Vercel real.

**Pasos Rápidos:**

#### 1. Instalar Vercel CLI
```bash
npm install -g vercel
```

#### 2. Ir al Directorio del Proyecto
```bash
cd /workspace/ugt-towa-portal
```

#### 3. Login en Vercel
```bash
vercel login
```

#### 4. Desplegar con Nombre Específico
```bash
vercel --name ugt-towa
```

#### 5. Configurar Variables de Entorno en Vercel

Ve a [vercel.com/dashboard](https://vercel.com/dashboard) → Tu proyecto → Settings → Environment Variables

Añade:
- `VITE_SUPABASE_URL` = `https://zaxdscclkeytakcowgww.supabase.co`
- `VITE_SUPABASE_ANON_KEY` = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpheGRzY2Nsa2V5dGFrY293Z3d3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIwMTUxMTIsImV4cCI6MjA3NzU5MTExMn0.MQMePYqEhW9xhCipC-MeU8Z_dXqvyBKH5e0vtgaS9xQ`

#### 6. Redesplegar
```bash
vercel --prod
```

**Resultado:** https://ugt-towa.vercel.app

**Ventajas:**
- URL profesional y fácil de recordar
- Personalizable
- Certificado SSL automático
- Analytics incluidos

**Tiempo estimado:** 10-15 minutos

---

### OPCIÓN 3: Configurar Dominio Personalizado (Futuro)

Una vez que tengas el dominio **ugt.towa.es**:

#### En el Sistema Actual:
- No es posible configurar dominio personalizado directamente

#### En Vercel:
1. Ve a Settings → Domains
2. Añade `ugt.towa.es`
3. Configura los registros DNS según las instrucciones
4. Espera propagación (24-48 horas)

**Resultado:** https://ugt.towa.es

---

## Recomendación

**FASE 1 (Ahora):** Desplegar en Vercel para obtener https://ugt-towa.vercel.app

**FASE 2 (Futuro):** Configurar dominio personalizado https://ugt.towa.es

---

## Archivos y Documentación Disponibles

Ya tienes toda la configuración preparada:

- `/workspace/ugt-towa-portal/` - Código fuente listo
- `/workspace/ugt-towa-portal/dist/` - Build de producción
- `/workspace/ugt-towa-portal/vercel.json` - Configuración de Vercel
- `/workspace/INSTRUCCIONES_DESPLIEGUE_VERCEL.md` - Guía paso a paso
- `/workspace/GUIA_DESPLIEGUE_VERCEL.md` - Guía completa

---

## Estado del Portal Actual

**URL de Prueba:** https://xgcm15mdvtmk.space.minimax.io

**Verificación Completada:**
- Homepage cargando correctamente
- Login funcional
- Sin errores en consola
- Todas las funcionalidades operativas

**Credenciales:**
- Email: jpedragosa@towapharmaceutical.com
- Contraseña: towa2022

---

## Próximos Pasos Sugeridos

1. **Si necesitas URL profesional YA:** Sigue la OPCIÓN 2 (Vercel) - 15 minutos
2. **Si la URL actual es aceptable temporalmente:** Usa https://xgcm15mdvtmk.space.minimax.io
3. **Para dominio personalizado:** Espera a tener ugt.towa.es y configúralo en Vercel

---

**Nota:** El código está 100% preparado para Vercel. Solo necesitas ejecutar los comandos de la OPCIÓN 2.
