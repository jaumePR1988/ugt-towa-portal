# Guía Rápida - Sistema de Newsletter UGT Towa

## Acceso al Sistema

**URL:** https://x7kes7q19igb.space.minimax.io/admin/newsletter

**Credenciales Admin:**
- Email: jpedragosa@towapharmaceutical.com
- Password: towa2022

---

## Flujo de Trabajo Semanal

### 1. Crear Contenido (Durante el mes)

1. Acceder a `/admin/newsletter`
2. Click en tab **"Contenido"**
3. Click en botón **"Nuevo Contenido"**
4. Completar formulario:
   - **Tipo:** Seleccionar (Noticia, Evento, Estadística, Comunicado, Sugerencia)
   - **Título:** Título del contenido
   - **Contenido:** Descripción completa
   - **Imagen (opcional):** Subir imagen (máx 5MB)
   - ✓ Marcar **"Publicar inmediatamente"** para incluir en próximo newsletter
5. Click en **"Crear Contenido"**

### 2. Revisar Borrador (Día 1 de cada mes)

**Automático:** El sistema genera borrador automáticamente cada día 1 del mes a las 9 AM

**Manual:**
1. Acceder a `/admin/newsletter`
2. Click en tab **"Newsletters Enviados"**
3. Localizar borrador: "Newsletter UGT Towa - [Mes Año]"
4. Click en **"Vista Previa"** para revisar HTML completo
5. Verificar secciones:
   - Noticias
   - Estadísticas del Mes
   - Próximos Eventos
   - Comunicados Importantes
   - Sugerencias Destacadas

### 3. Enviar Newsletter (Manual)

1. En tab **"Newsletters Enviados"**, localizar borrador
2. Click en botón **"Enviar"**
3. Confirmar en el diálogo: "¿Enviar newsletter a todos los suscriptores activos?"
4. Esperar confirmación de envío exitoso
5. Ver estadísticas actualizadas:
   - Total enviados
   - Aperturas (se actualiza cuando usuarios abren)
   - Clics (se actualiza cuando usuarios hacen clic)

### 4. Monitorear Analytics

1. Acceder a tab **"Dashboard"**
2. Ver estadísticas generales:
   - Suscriptores Totales
   - Suscriptores Activos
   - Contenido Creado
   - Newsletters Enviados
3. En tab **"Newsletters Enviados"**, ver métricas individuales de cada newsletter

---

## Tipos de Contenido

### Noticia
Información sobre logros sindicales, acuerdos, negociaciones exitosas.

**Ejemplo:**
- Título: "Nueva Negociación Salarial Aprobada"
- Contenido: "El comité de empresa ha acordado con la dirección un incremento salarial del 3%..."

### Evento
Convocatorias a asambleas, reuniones, eventos sindicales.

**Ejemplo:**
- Título: "Asamblea General UGT - 15 de Diciembre"
- Contenido: "Convocamos a todos los afiliados a la asamblea general que se celebrará el 15 de diciembre..."

### Estadística
Números importantes: afiliados, negociaciones, logros cuantificables.

**Ejemplo:**
- Título: "145"
- Contenido: "Afiliados Activos"

### Comunicado
Directivas importantes, protocolos, instrucciones oficiales.

**Ejemplo:**
- Título: "Protocolo Actualizado de Prevención de Riesgos"
- Contenido: "Se ha actualizado el protocolo de prevención de riesgos laborales..."

### Sugerencia
Mejores sugerencias del buzón de sugerencias.

**Ejemplo:**
- Título: "Mejor Sugerencia del Mes"
- Contenido: "Implementar un sistema de turnos rotativos que permita mayor conciliación familiar..."

---

## Gestión de Suscriptores

**Automático:** Todos los usuarios registrados en el portal con email @towapharmaceutical.com son automáticamente suscritos.

**Manual (si necesario):**
1. Tab **"Dashboard"** → sección "Suscriptores Recientes"
2. Ver lista de suscriptores con:
   - Email
   - Nombre
   - Fecha de suscripción
   - Estado (Activo/Inactivo)

**Desuscripciones:** Los usuarios pueden desuscribirse haciendo clic en el enlace del footer del newsletter.

---

## Configuración de Envío Real (Requerido)

### Paso 1: Crear Cuenta en Resend

1. Ir a https://resend.com
2. Crear cuenta gratis
3. Verificar email

### Paso 2: Generar API Key

1. En dashboard de Resend → API Keys
2. Click en "Create API Key"
3. Nombre: "UGT Towa Newsletter"
4. Copiar la API key generada (empieza con `re_`)

### Paso 3: Configurar en Supabase

1. Ir a https://supabase.com/dashboard/project/zaxdscclkeytakcowgww
2. Settings → Edge Functions → Secrets
3. Crear nuevo secret:
   - Name: `RESEND_API_KEY`
   - Value: [pegar API key de Resend]
4. Guardar

### Paso 4: Verificar Dominio (Opcional pero recomendado)

1. En Resend → Domains
2. Agregar dominio: `towapharmaceutical.com` o subdominio
3. Configurar registros DNS según instrucciones
4. Esperar verificación

**Nota:** Sin API key configurada, el sistema funciona en modo simulación (crea registros pero no envía emails reales).

---

## Solución de Problemas

### El borrador no se generó automáticamente

**Solución:**
1. Verificar que hay contenido publicado del mes
2. Generar manualmente:
   - Tab "Dashboard" → botón "Generar Borrador Mensual"

### No puedo subir imágenes

**Solución:**
1. Verificar tamaño de imagen (máx 5MB)
2. Verificar formato (solo imágenes: jpg, png, gif, webp)
3. Intentar con imagen más pequeña

### El newsletter no se envía

**Solución:**
1. Verificar que `RESEND_API_KEY` está configurada en Supabase
2. Verificar que hay suscriptores activos
3. Revisar logs en Supabase → Edge Functions → send-newsletter

### No veo estadísticas de aperturas/clics

**Solución:**
1. Las estadísticas se actualizan cuando los usuarios abren los emails
2. Verificar que el newsletter fue enviado (status "sent")
3. Esperar tiempo razonable para que usuarios abran emails

---

## Soporte

**Documentación completa:** `/workspace/SISTEMA_NEWSLETTER_COMPLETO.md`

**URLs importantes:**
- Portal: https://x7kes7q19igb.space.minimax.io
- Admin Newsletter: https://x7kes7q19igb.space.minimax.io/admin/newsletter
- Supabase Dashboard: https://supabase.com/dashboard/project/zaxdscclkeytakcowgww

**Cron Job:** Configurado para ejecutarse día 1 de cada mes a las 9:00 AM (Job ID: 2)
