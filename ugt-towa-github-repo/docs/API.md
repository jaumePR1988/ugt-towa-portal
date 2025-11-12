# API Reference - Edge Functions

Documentación completa de las Edge Functions implementadas en Supabase.

## Tabla de Contenidos

1. [Newsletter Functions](#newsletter-functions)
2. [Notification Functions](#notification-functions)
3. [Upload Functions](#upload-functions)
4. [Authentication Functions](#authentication-functions)

---

## Newsletter Functions

### generate-monthly-draft

Genera automáticamente un borrador de newsletter mensual.

**Endpoint:**
```
POST https://{PROJECT_ID}.supabase.co/functions/v1/generate-monthly-draft
```

**Headers:**
```json
{
  "Authorization": "Bearer {ANON_KEY}",
  "Content-Type": "application/json"
}
```

**Request Body:**
```json
{
  "month": 11,
  "year": 2025
}
```

**Response:**
```json
{
  "success": true,
  "edition": {
    "id": "uuid",
    "title": "Newsletter UGT Towa - Noviembre 2025",
    "month": 11,
    "year": 2025,
    "status": "draft",
    "created_at": "2025-11-12T09:00:00Z"
  }
}
```

**Funcionalidad:**
- Obtiene todo el contenido publicado del mes anterior
- Crea un borrador de newsletter automáticamente
- Incluye código QR de afiliación
- Se ejecuta automáticamente el día 1 de cada mes a las 9 AM via cron job

---

### send-newsletter

Envía un newsletter a todos los suscriptores activos.

**Endpoint:**
```
POST https://{PROJECT_ID}.supabase.co/functions/v1/send-newsletter
```

**Headers:**
```json
{
  "Authorization": "Bearer {ANON_KEY}",
  "Content-Type": "application/json"
}
```

**Request Body:**
```json
{
  "editionId": "uuid-de-la-edicion"
}
```

**Response:**
```json
{
  "success": true,
  "sent": 25,
  "failed": 0,
  "message": "Newsletter enviado exitosamente a 25 suscriptores"
}
```

**Funcionalidad:**
- Obtiene la lista de suscriptores activos
- Envía email personalizado a cada suscriptor
- Registra el envío en `newsletters_sent`
- Incluye tracking de aperturas y clics
- Utiliza Resend API para el envío

---

## Notification Functions

### send-notifications

Envía notificaciones por email cuando cambia el estado de una cita.

**Endpoint:**
```
POST https://{PROJECT_ID}.supabase.co/functions/v1/send-notifications
```

**Headers:**
```json
{
  "Authorization": "Bearer {ANON_KEY}",
  "Content-Type": "application/json"
}
```

**Request Body:**
```json
{
  "userId": "uuid-del-usuario",
  "appointmentId": "uuid-de-la-cita",
  "type": "confirmation",
  "message": "Tu cita ha sido confirmada"
}
```

**Response:**
```json
{
  "success": true,
  "notification": {
    "id": "uuid",
    "created_at": "2025-11-12T10:00:00Z"
  }
}
```

**Tipos de Notificación:**
- `confirmation` - Confirmación de cita
- `cancellation` - Cancelación de cita
- `reminder_24h` - Recordatorio 24 horas antes
- `reminder_2h` - Recordatorio 2 horas antes
- `new_appointment` - Nueva cita para delegado

---

### generate-reminders

Genera recordatorios automáticos para citas próximas.

**Endpoint:**
```
POST https://{PROJECT_ID}.supabase.co/functions/v1/generate-reminders
```

**Funcionalidad:**
- Se ejecuta cada hora via cron job
- Genera recordatorios 24h antes de la cita
- Genera recordatorios 2h antes de la cita
- Envía emails automáticos a los usuarios
- Notifica a los delegados correspondientes

---

## Upload Functions

### upload-communique-image

Sube imágenes para comunicados.

**Endpoint:**
```
POST https://{PROJECT_ID}.supabase.co/functions/v1/upload-communique-image
```

**Headers:**
```json
{
  "Authorization": "Bearer {ANON_KEY}",
  "Content-Type": "multipart/form-data"
}
```

**Form Data:**
```
file: [archivo de imagen]
communiqueId: "uuid-del-comunicado"
```

**Response:**
```json
{
  "success": true,
  "url": "https://{PROJECT_ID}.supabase.co/storage/v1/object/public/communique-images/{filename}"
}
```

**Restricciones:**
- Tamaño máximo: 5MB
- Formatos aceptados: PNG, JPG, WEBP
- Solo usuarios autenticados

---

### upload-delegate-photo

Sube fotos de delegados sindicales.

**Endpoint:**
```
POST https://{PROJECT_ID}.supabase.co/functions/v1/upload-delegate-photo
```

**Restricciones:**
- Tamaño máximo: 5MB
- Formatos aceptados: PNG, JPG, WEBP
- Solo administradores

---

### upload-event-image

Sube imágenes para la galería de eventos.

**Endpoint:**
```
POST https://{PROJECT_ID}.supabase.co/functions/v1/upload-event-image
```

**Form Data:**
```
file: [archivo de imagen]
title: "Título del evento"
description: "Descripción del evento"
eventDate: "2025-11-12"
```

**Restricciones:**
- Tamaño máximo: 5MB
- Formatos aceptados: PNG, JPG, WEBP
- Solo administradores

---

### upload-newsletter-image

Sube imágenes para contenido del newsletter.

**Endpoint:**
```
POST https://{PROJECT_ID}.supabase.co/functions/v1/upload-newsletter-image
```

**Restricciones:**
- Tamaño máximo: 5MB
- Formatos aceptados: PNG, JPG, WEBP
- Solo administradores

---

### upload-qr-code

Sube código QR para afiliación.

**Endpoint:**
```
POST https://{PROJECT_ID}.supabase.co/functions/v1/upload-qr-code
```

**Funcionalidad:**
- Solo permite un QR activo a la vez
- Desactiva QRs anteriores automáticamente
- Solo administradores

---

## Authentication Functions

### validate-email-domain

Valida que el email pertenece al dominio autorizado.

**Endpoint:**
```
POST https://{PROJECT_ID}.supabase.co/functions/v1/validate-email-domain
```

**Request Body:**
```json
{
  "email": "usuario@towapharmaceutical.com"
}
```

**Response:**
```json
{
  "valid": true,
  "message": "Email válido"
}
```

**Validación:**
- Solo acepta emails con dominio `@towapharmaceutical.com`
- Se ejecuta automáticamente durante el registro

---

## Errores Comunes

### 401 Unauthorized
```json
{
  "error": "No autorizado",
  "message": "Token de autenticación inválido o expirado"
}
```

**Solución:** Verificar que el header Authorization esté correctamente configurado.

---

### 400 Bad Request
```json
{
  "error": "Solicitud incorrecta",
  "message": "Parámetros faltantes o inválidos"
}
```

**Solución:** Verificar que todos los parámetros requeridos estén presentes.

---

### 500 Internal Server Error
```json
{
  "error": "Error interno del servidor",
  "message": "Detalles del error"
}
```

**Solución:** Revisar los logs de la Edge Function en Supabase Dashboard.

---

## Logs y Debugging

Para ver los logs de las Edge Functions:

1. Ve a Supabase Dashboard
2. Selecciona tu proyecto
3. Ve a "Edge Functions"
4. Selecciona la función
5. Haz clic en "Logs"

---

## Rate Limiting

Todas las Edge Functions tienen límites de rate:
- **Anon Key:** 100 requests por minuto
- **Service Role Key:** Sin límite

---

## Seguridad

- Todas las funciones requieren autenticación
- Las funciones de upload validan tipos de archivo
- Las funciones de admin verifican el rol del usuario
- Todas las comunicaciones usan HTTPS

---

## Testing

Para testear las Edge Functions localmente:

```bash
# Iniciar Supabase localmente
supabase start

# Servir la función
supabase functions serve function-name

# Hacer request de prueba
curl -i --location --request POST 'http://localhost:54321/functions/v1/function-name' \
  --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' \
  --header 'Content-Type: application/json' \
  --data '{"key":"value"}'
```

---

## Versionado

Versión actual de las Edge Functions: **v8**

Cambios recientes:
- v8: Sistema de newsletter automatizado completo
- v7: Mejoras en generación de PDF
- v6: Inclusión de QR code en newsletter
- v5: Footer con datos reales
- v4: Notificaciones mejoradas con nombre de usuario

---

## Contacto y Soporte

Para reportar bugs o solicitar nuevas funcionalidades:
- Email: jpedragosa@towapharmaceutical.com
