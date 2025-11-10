# Guía de Despliegue del Portal UGT-TOWA en Vercel

## Información del Proyecto

**Proyecto:** Portal Sindical UGT-TOWA  
**Framework:** React + Vite + TypeScript  
**Base de Datos:** Supabase  
**Ubicación del código:** `/workspace/ugt-towa-portal/`

## Credenciales de Supabase

- **URL:** `https://zaxdscclkeytakcowgww.supabase.co`
- **Anon Key:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpheGRzY2Nsa2V5dGFrY293Z3d3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIwMTUxMTIsImV4cCI6MjA3NzU5MTExMn0.MQMePYqEhW9xhCipC-MeU8Z_dXqvyBKH5e0vtgaS9xQ`

## Pasos para Desplegar en Vercel

### 1. Preparación del Repositorio

El código ya está preparado para despliegue con las siguientes modificaciones:

- ✅ `src/lib/supabase.ts` usa variables de entorno
- ✅ Archivo `.env.example` creado con las variables necesarias
- ✅ Archivo `vercel.json` configurado para SPA routing

### 2. Crear Proyecto en Vercel

#### Opción A: Desde CLI (Recomendado)

```bash
cd /workspace/ugt-towa-portal

# Instalar Vercel CLI si no está instalado
npm install -g vercel

# Iniciar sesión en Vercel
vercel login

# Desplegar el proyecto
vercel

# Seguir las instrucciones interactivas:
# - Set up and deploy: Yes
# - Which scope: [Tu cuenta]
# - Link to existing project: No
# - Project name: ugt-towa-portal
# - Directory: ./
# - Override settings: No
```

#### Opción B: Desde Dashboard Web

1. Accede a [vercel.com](https://vercel.com)
2. Clic en "Add New Project"
3. Importa el repositorio Git (si tienes el código en GitHub/GitLab)
4. O usa "Deploy from CLI" siguiendo Opción A

### 3. Configurar Variables de Entorno en Vercel

**IMPORTANTE:** Después de crear el proyecto, debes configurar las variables de entorno:

#### Desde el Dashboard Web:

1. Ve a tu proyecto en Vercel
2. Settings → Environment Variables
3. Añade las siguientes variables:

| Variable | Valor |
|----------|-------|
| `VITE_SUPABASE_URL` | `https://zaxdscclkeytakcowgww.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpheGRzY2Nsa2V5dGFrY293Z3d3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIwMTUxMTIsImV4cCI6MjA3NzU5MTExMn0.MQMePYqEhW9xhCipC-MeU8Z_dXqvyBKH5e0vtgaS9xQ` |

4. Asegúrate de marcar estas variables para:
   - ✅ Production
   - ✅ Preview
   - ✅ Development

#### Desde CLI:

```bash
vercel env add VITE_SUPABASE_URL
# Pegar: https://zaxdscclkeytakcowgww.supabase.co

vercel env add VITE_SUPABASE_ANON_KEY
# Pegar: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpheGRzY2Nsa2V5dGFrY293Z3d3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIwMTUxMTIsImV4cCI6MjA3NzU5MTExMn0.MQMePYqEhW9xhCipC-MeU8Z_dXqvyBKH5e0vtgaS9xQ
```

### 4. Redesplegar con Variables de Entorno

Después de configurar las variables de entorno, debes redesplegar:

```bash
vercel --prod
```

O desde el dashboard: Deployments → [último deployment] → "Redeploy"

### 5. Verificar el Despliegue

Una vez desplegado, Vercel te proporcionará una URL como:
- `https://ugt-towa-portal.vercel.app`
- O tu dominio personalizado si lo configuraste

**Verificaciones obligatorias:**

1. ✅ La página principal carga correctamente
2. ✅ El sistema de login funciona
3. ✅ Las citas se pueden reservar
4. ✅ Los comunicados se visualizan
5. ✅ El panel de administración es accesible
6. ✅ La sección de afiliados funciona
7. ✅ No hay errores en la consola del navegador

### 6. Configurar Dominio Personalizado (Opcional)

Si deseas usar tu propio dominio:

1. Ve a Settings → Domains en tu proyecto de Vercel
2. Añade tu dominio (ej: `portal.ugt-towa.com`)
3. Configura los registros DNS según las instrucciones de Vercel
4. Espera la propagación DNS (puede tomar hasta 48 horas)

## Comandos Útiles

```bash
# Ver logs del deployment
vercel logs

# Listar todos los deployments
vercel ls

# Ver información del proyecto
vercel inspect

# Eliminar un deployment
vercel rm [deployment-url]
```

## Estructura de Archivos

```
/workspace/ugt-towa-portal/
├── dist/                    # Build de producción (generado)
├── src/
│   ├── lib/
│   │   └── supabase.ts     # ✅ Configurado con variables de entorno
│   ├── pages/              # Todas las páginas del portal
│   └── components/         # Componentes reutilizables
├── .env                    # Variables locales (NO subir a Git)
├── .env.example            # Ejemplo de variables (sí subir a Git)
├── vercel.json             # Configuración de Vercel
├── package.json            # Dependencias del proyecto
└── vite.config.ts          # Configuración de Vite
```

## Funcionalidades del Portal

El portal incluye las siguientes funcionalidades que deben verificarse:

### Público:
- Homepage con hero section y bandera UGT
- Sistema de citas con delegados
- Comunicados sindicales
- Galería de eventos
- Quiénes somos
- Documentos (requiere autenticación)
- Buzón de sugerencias anónimas

### Autenticación:
- Login con validación de dominio @towapharmaceutical.com
- Registro
- Recuperación de contraseña

### Afiliados (requiere is_affiliate=true):
- Dashboard de afiliado
- Biblioteca de documentos sindicales
- Votaciones internas
- Beneficios y descuentos

### Administración (requiere role='admin'):
- Dashboard con estadísticas
- Gestión de citas y notificaciones
- Gestión de comunicados y categorías
- Gestión de encuestas y análisis
- Gestión de disponibilidad de delegados
- Gestión de documentos y categorías
- Gestión de afiliados
- Gestión de newsletter
- Gestión de galería de eventos
- Gestión de QR codes
- Gestión de sugerencias

## Credenciales de Prueba

**Usuario Administrador:**
- Email: `jpedragosa@towapharmaceutical.com`
- Contraseña: `towa2022`
- Permisos: Admin + Afiliado (acceso completo)

## Solución de Problemas

### Error: "Faltan las variables de entorno"

**Causa:** Las variables VITE_SUPABASE_URL o VITE_SUPABASE_ANON_KEY no están configuradas.

**Solución:**
1. Verifica que las variables estén en Settings → Environment Variables
2. Redesplegar el proyecto: `vercel --prod`

### Error: "Failed to fetch" al hacer login

**Causa:** Las variables de entorno tienen valores incorrectos o la conexión con Supabase falla.

**Solución:**
1. Verifica que la URL de Supabase sea correcta
2. Verifica que la Anon Key sea válida
3. Comprueba que el proyecto de Supabase esté activo

### Error 404 en rutas internas

**Causa:** El SPA routing no está configurado correctamente.

**Solución:**
- Verifica que `vercel.json` contenga la configuración de rewrites
- El archivo ya está incluido en el proyecto

### Build falla en Vercel

**Posibles causas:**
1. Dependencias faltantes
2. Errores de TypeScript
3. Variables de entorno no configuradas en build time

**Solución:**
```bash
# Probar build localmente
cd /workspace/ugt-towa-portal
pnpm install
pnpm build

# Si funciona localmente, el problema está en la configuración de Vercel
```

## Monitoreo y Mantenimiento

### Logs en Tiempo Real

```bash
vercel logs --follow
```

### Analytics

Vercel proporciona analytics automáticos:
- Visitas
- Performance
- Edge requests
- Bandwidth

Accede desde: Dashboard → Analytics

### Actualizaciones

Para actualizar el código:

```bash
# Hacer cambios en el código
git add .
git commit -m "Descripción de cambios"
git push

# Si usas integración Git con Vercel, se desplegará automáticamente
# Si usas CLI:
vercel --prod
```

## Backup y Rollback

Vercel mantiene un historial completo de deployments:

1. Ve a Deployments en el dashboard
2. Encuentra el deployment anterior que funcionaba
3. Clic en "..." → "Promote to Production"

## Contacto y Soporte

- **Vercel Docs:** https://vercel.com/docs
- **Supabase Docs:** https://supabase.com/docs
- **React Router:** https://reactrouter.com/

## Checklist Final

Antes de considerar el despliegue completo:

- [ ] Proyecto desplegado en Vercel
- [ ] Variables de entorno configuradas
- [ ] URL de producción accesible
- [ ] Login funciona correctamente
- [ ] Citas se pueden reservar
- [ ] Comunicados se visualizan
- [ ] Panel admin accesible
- [ ] Sección afiliados funcional
- [ ] Sin errores en consola
- [ ] Todas las funcionalidades probadas
- [ ] Dominio personalizado configurado (opcional)

## Fecha de Migración

**Fecha:** 2025-11-11  
**URL Original:** https://ottakjvc490n.space.minimax.io  
**URL Vercel:** [Se completará después del despliegue]

---

**Nota:** Guarda este documento para futuras referencias y actualizaciones del portal.
