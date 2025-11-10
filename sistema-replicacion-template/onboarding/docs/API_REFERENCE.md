# Referencia de API - Sistema de Onboarding

## Índice
1. [Introducción](#introducción)
2. [Autenticación](#autenticación)
3. [Endpoints](#endpoints)
4. [Esquemas de Datos](#esquemas-de-datos)
5. [Códigos de Error](#códigos-de-error)
6. [Webhooks](#webhooks)
7. [SDK y Herramientas](#sdk-y-herramientas)

## Introducción

La API del Sistema de Onboarding permite la integración completa con sistemas externos, gestión de solicitudes y sincronización de datos. La API sigue principios REST y utiliza JSON como formato de intercambio.

### Características de la API
- **Protocolo**: HTTP/HTTPS
- **Formato**: JSON
- **Autenticación**: Bearer Token
- **Versión**: v1.0
- **Rate Limiting**: 100 requests/minuto por API key
- **CORS**: Habilitado para dominios autorizados

### URL Base
```
https://api.ugt-towa.com/v1/onboarding
```

## Autenticación

### Obtener Token de API
```http
POST /auth/login
Content-Type: application/json

{
    "username": "api_user",
    "password": "secure_password"
}
```

### Respuesta de Autenticación
```json
{
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "token_type": "Bearer",
    "expires_in": 3600,
    "refresh_token": "def50200..."
}
```

### Uso del Token
```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Endpoints

### Solicitudes

#### POST /requests
Crear una nueva solicitud de onboarding.

**Request Body:**
```json
{
    "empresa_nombre": "Empresa S.L.",
    "cif_nif": "12345678Z",
    "sector_actividad": "servicios",
    "num_empleados": "11-50",
    "ubicacion_geografica": "madrid",
    "contacto_nombre": "Juan Pérez",
    "contacto_cargo": "Director RRHH",
    "contacto_email": "juan@empresa.com",
    "contacto_telefono": "+34 91 123 4567",
    "fecha_prevista_implementacion": "2024-03-01",
    "estructura_sindical": "si",
    "num_sindicatos": 2,
    "afiliados_estimados": "51-100",
    "sistema_actual": "manual",
    "deficiencias": ["comunicacion", "notificaciones"],
    "modulos": ["afiliados", "citas", "comunicados"],
    "color_primario": "#1e40af",
    "color_secundario": "#64748b",
    "color_acento": "#ef4444",
    "idioma_sistema": "es",
    "usuarios_esperados": "11-25",
    "necesidades_especiales": "Integración con ERP existente",
    "acepto_terminos": true,
    "autorizo_contacto": true
}
```

**Response:**
```json
{
    "status": "success",
    "data": {
        "id_solicitud": "ONB-1705318200-ABC123",
        "fecha_creacion": "2024-01-15T10:30:00Z",
        "status": "pendiente_revision",
        "proximo_paso": "Análisis de requerimientos",
        "fecha_estimada_respuesta": "2024-01-17",
        "contacto_asignado": {
            "nombre": "María García",
            "email": "maria@ugt-towa.com",
            "telefono": "+34 91 123 4567"
        },
        "resumen": {
            "empresa": "Empresa S.L.",
            "modulos_seleccionados": 3,
            "fecha_implementacion": "2024-03-01"
        }
    },
    "message": "Solicitud creada exitosamente"
}
```

#### GET /requests/{id}
Obtener detalles de una solicitud específica.

**Response:**
```json
{
    "status": "success",
    "data": {
        "id_solicitud": "ONB-1705318200-ABC123",
        "empresa_nombre": "Empresa S.L.",
        "cif_nif": "12345678Z",
        "fecha_creacion": "2024-01-15T10:30:00Z",
        "ultima_actualizacion": "2024-01-15T14:20:00Z",
        "status": "en_proceso",
        "progreso": 35,
        "fase_actual": {
            "id": 3,
            "nombre": "Aprobación y Contratación",
            "descripcion": "Revisión de propuesta y formalización del contrato",
            "progreso": 60
        },
        "timeline": [
            {
                "fase": "Análisis de Requerimientos",
                "status": "completado",
                "fecha_inicio": "2024-01-15",
                "fecha_fin": "2024-01-17",
                "responsable": "Equipo Técnico"
            },
            {
                "fase": "Propuesta Técnica",
                "status": "completado",
                "fecha_inicio": "2024-01-18",
                "fecha_fin": "2024-01-22",
                "responsable": "Arquitecto de Soluciones"
            },
            {
                "fase": "Aprobación y Contratación",
                "status": "en_progreso",
                "fecha_inicio": "2024-01-23",
                "fecha_fin_estimada": "2024-01-26",
                "responsable": "Gerente de Proyecto"
            }
        ]
    }
}
```

#### GET /requests
Listar solicitudes con filtros opcionales.

**Query Parameters:**
- `status`: Filtrar por estado (pendiente_revision, en_proceso, completada, cancelada)
- `fecha_desde`: Fecha de inicio (ISO 8601)
- `fecha_hasta`: Fecha de fin (ISO 8601)
- `empresa`: Filtrar por nombre de empresa
- `page`: Número de página (default: 1)
- `limit`: Elementos por página (default: 20, max: 100)

**Response:**
```json
{
    "status": "success",
    "data": {
        "requests": [
            {
                "id_solicitud": "ONB-1705318200-ABC123",
                "empresa_nombre": "Empresa S.L.",
                "fecha_creacion": "2024-01-15T10:30:00Z",
                "status": "en_proceso",
                "progreso": 35
            }
        ],
        "pagination": {
            "current_page": 1,
            "total_pages": 5,
            "total_items": 87,
            "items_per_page": 20
        }
    }
}
```

#### PUT /requests/{id}
Actualizar una solicitud existente.

**Request Body:**
```json
{
    "contacto_email": "nuevo@empresa.com",
    "fecha_prevista_implementacion": "2024-04-01",
    "necesidades_especiales": "Actualizar necesidades especiales"
}
```

#### DELETE /requests/{id}
Cancelar una solicitud.

**Response:**
```json
{
    "status": "success",
    "message": "Solicitud cancelada exitosamente"
}
```

### Validación

#### POST /validate/cif
Validar un CIF/NIF en tiempo real.

**Request Body:**
```json
{
    "cif": "12345678Z"
}
```

**Response:**
```json
{
    "status": "success",
    "data": {
        "valid": true,
        "tipo": "CIF",
        "letra": "Z",
        "provincia": "Madrid",
        "forma_juridica": "Sociedad Limitada"
    }
}
```

#### POST /validate/email
Validar formato de email.

**Request Body:**
```json
{
    "email": "juan@empresa.com"
}
```

**Response:**
```json
{
    "status": "success",
    "data": {
        "valid": true,
        "format": "RFC 5322 compliant",
        "domain": "empresa.com",
        "mx_record": true
    }
}
```

#### POST /validate/phone
Validar número de teléfono.

**Request Body:**
```json
{
    "phone": "+34 91 123 4567"
}
```

**Response:**
```json
{
    "status": "success",
    "data": {
        "valid": true,
        "format": "E.164",
        "country": "ES",
        "country_code": "34",
        "national_number": "911234567"
    }
}
```

### Propuestas

#### GET /proposals/{request_id}
Obtener propuesta técnica para una solicitud.

**Response:**
```json
{
    "status": "success",
    "data": {
        "id_propuesta": "PROP-1705318200-DEF456",
        "id_solicitud": "ONB-1705318200-ABC123",
        "fecha_creacion": "2024-01-18T09:00:00Z",
        "validez_hasta": "2024-02-18T23:59:59Z",
        "resumen_ejecutivo": "Propuesta de implementación del sistema UGT TOWA...",
        "cronograma": {
            "duracion_total": "35 días hábiles",
            "fases": [
                {
                    "nombre": "Configuración Inicial",
                    "duracion": "5 días",
                    "precio": 2500,
                    "actividades": ["Configuración de base", "Personalización visual"]
                }
            ]
        },
        "presupuesto": {
            "subtotal": 15000,
            "iva": 3150,
            "total": 18150,
            "forma_pago": "50% inicio, 50% a la entrega"
        },
        "incluye": [
            "Módulo de gestión de afiliados",
            "Sistema de citas",
            "Módulo de comunicados",
            "1 año de soporte"
        ],
        "no_incluye": [
            "Integraciones con sistemas externos",
            "Migración de datos de más de 1000 registros",
            "Capacitación presencial"
        ]
    }
}
```

#### POST /proposals/{request_id}/approve
Aprobar una propuesta.

**Request Body:**
```json
{
    "comentarios": "Propuesta aprobada según términos acordados",
    "autorizado_por": "Juan Pérez - Director RRHH"
}
```

### Timeline

#### GET /timeline/{request_id}
Obtener timeline detallado de implementación.

**Response:**
```json
{
    "status": "success",
    "data": {
        "request_id": "ONB-1705318200-ABC123",
        "progreso_total": 35,
        "fases": [
            {
                "id": 1,
                "nombre": "Análisis de Requerimientos",
                "status": "completado",
                "progreso": 100,
                "fecha_inicio": "2024-01-15",
                "fecha_fin": "2024-01-17",
                "responsable": "Equipo Técnico",
                "actividades": [
                    "Validación de datos del cliente",
                    "Análisis de viabilidad técnica"
                ],
                "entregables": [
                    "Informe de análisis inicial",
                    "Lista de requerimientos técnicos"
                ]
            }
        ],
        "proxima_fase": {
            "id": 4,
            "nombre": "Configuración Inicial del Sistema",
            "fecha_inicio_estimada": "2024-01-29",
            "responsable": "DevOps Engineer"
        }
    }
}
```

#### PUT /timeline/{request_id}/phase/{phase_id}
Actualizar estado de una fase.

**Request Body:**
```json
{
    "status": "en_progreso",
    "progreso": 60,
    "notas": "Configuración de base de datos en progreso"
}
```

### Documentación

#### GET /documentation/templates
Obtener plantillas de documentación.

**Response:**
```json
{
    "status": "success",
    "data": {
        "plantillas": [
            {
                "id": "manual_usuario",
                "nombre": "Manual de Usuario",
                "descripcion": "Manual completo para usuarios finales",
                "formato": "PDF",
                "idiomas": ["es", "ca", "eu", "gl"]
            },
            {
                "id": "manual_tecnico",
                "nombre": "Manual Técnico",
                "descripcion": "Documentación técnica del sistema",
                "formato": "PDF",
                "idiomas": ["es"]
            }
        ]
    }
}
```

## Esquemas de Datos

### Solicitud (OnboardingRequest)
```json
{
    "id_solicitud": "string (required)",
    "empresa_nombre": "string (required, 2-100 chars)",
    "cif_nif": "string (required, 9 chars)",
    "sector_actividad": "string (required, enum)",
    "num_empleados": "string (required, enum)",
    "ubicacion_geografica": "string (required, enum)",
    "contacto_nombre": "string (required, 2-50 chars)",
    "contacto_cargo": "string (required, 2-50 chars)",
    "contacto_email": "string (required, email format)",
    "contacto_telefono": "string (required, 9-15 chars)",
    "fecha_prevista_implementacion": "string (required, ISO 8601)",
    "estructura_sindical": "string (required, enum: si, no, en_proceso)",
    "num_sindicatos": "integer (optional, 1-10)",
    "afiliados_estimados": "string (optional, enum)",
    "sistema_actual": "string (optional, enum)",
    "deficiencias": "array<string> (optional)",
    "modulos": "array<string> (required, enum)",
    "color_primario": "string (required, hex color)",
    "color_secundario": "string (required, hex color)",
    "color_acento": "string (required, hex color)",
    "idioma_sistema": "string (required, enum)",
    "usuarios_esperados": "string (required, enum)",
    "necesidades_especiales": "string (optional, max 1000 chars)",
    "acepto_terminos": "boolean (required)",
    "autorizo_contacto": "boolean (optional, default: true)",
    "fecha_creacion": "string (ISO 8601, readonly)",
    "fecha_actualizacion": "string (ISO 8601, readonly)",
    "status": "string (enum, readonly)"
}
```

### Timeline Phase
```json
{
    "id": "integer (required)",
    "nombre": "string (required)",
    "descripcion": "string (optional)",
    "status": "string (enum: pendiente, en_progreso, completada, cancelada)",
    "progreso": "integer (0-100)",
    "fecha_inicio": "string (ISO 8601)",
    "fecha_fin": "string (ISO 8601)",
    "fecha_fin_estimada": "string (ISO 8601)",
    "responsable": "string (required)",
    "actividades": "array<string>",
    "entregables": "array<string>",
    "notas": "string (optional)"
}
```

## Códigos de Error

### HTTP Status Codes
- `200` - OK: Operación exitosa
- `201` - Created: Recurso creado exitosamente
- `400` - Bad Request: Error en la solicitud
- `401` - Unauthorized: Token inválido o expirado
- `403` - Forbidden: Sin permisos para la operación
- `404` - Not Found: Recurso no encontrado
- `422` - Unprocessable Entity: Datos inválidos
- `429` - Too Many Requests: Rate limit excedido
- `500` - Internal Server Error: Error del servidor

### Formato de Error
```json
{
    "status": "error",
    "error": {
        "code": "VALIDATION_ERROR",
        "message": "Los datos proporcionados no son válidos",
        "details": {
            "field": "cif_nif",
            "value": "1234567",
            "message": "El CIF debe tener 9 caracteres"
        }
    },
    "timestamp": "2024-01-15T10:30:00Z"
}
```

### Códigos de Error Específicos
- `VALIDATION_ERROR`: Error en validación de datos
- `DUPLICATE_REQUEST`: Ya existe una solicitud para esta empresa
- `INVALID_CIF`: CIF/NIF no válido
- `EMAIL_IN_USE`: El email ya está registrado
- `EXPIRED_TOKEN`: Token de autenticación expirado
- `RATE_LIMIT_EXCEEDED`: Se excedió el límite de requests
- `INVALID_STATUS`: Estado no válido para la operación
- `MISSING_PERMISSIONS`: Sin permisos suficientes

## Webhooks

### Configurar Webhooks
```http
POST /webhooks
Authorization: Bearer {token}

{
    "url": "https://empresa.com/webhook/onboarding",
    "events": ["request.created", "request.approved", "phase.completed"],
    "secret": "webhook_secret_key"
}
```

### Eventos Disponibles
- `request.created`: Nueva solicitud creada
- `request.approved`: Solicitud aprobada
- `request.rejected`: Solicitud rechazada
- `phase.started`: Fase de implementación iniciada
- `phase.completed`: Fase completada
- `proposal.generated`: Propuesta técnica generada
- `implementation.started`: Implementación iniciada
- `implementation.completed`: Implementación completada

### Formato de Webhook
```json
{
    "event": "phase.completed",
    "timestamp": "2024-01-17T15:30:00Z",
    "data": {
        "request_id": "ONB-1705318200-ABC123",
        "phase": {
            "id": 2,
            "nombre": "Propuesta Técnica Personalizada",
            "status": "completada"
        }
    },
    "signature": "sha256=abc123..."
}
```

### Verificar Firma del Webhook
```javascript
const crypto = require('crypto');

function verifyWebhook(payload, signature, secret) {
    const computedSignature = crypto
        .createHmac('sha256', secret)
        .update(payload)
        .digest('hex');
    
    return `sha256=${computedSignature}` === signature;
}
```

## SDK y Herramientas

### JavaScript SDK
```javascript
import UGTOnboardingSDK from '@ugt-towa/onboarding-sdk';

const client = new UGTOnboardingSDK({
    apiKey: 'your_api_key',
    baseURL: 'https://api.ugt-towa.com/v1'
});

// Crear solicitud
const request = await client.requests.create({
    empresa_nombre: 'Empresa S.L.',
    cif_nif: '12345678Z',
    // ... otros campos
});

// Obtener estado
const status = await client.requests.getStatus(request.id_solicitud);
```

### Python SDK
```python
from ugt_onboarding import UGTOnboardingClient

client = UGTOnboardingClient(
    api_key='your_api_key',
    base_url='https://api.ugt-towa.com/v1'
)

# Crear solicitud
request = client.requests.create({
    'empresa_nombre': 'Empresa S.L.',
    'cif_nif': '12345678Z',
    # ... otros campos
})

# Obtener estado
status = client.requests.get_status(request['id_solicitud'])
```

### Postman Collection
```json
{
    "info": {
        "name": "UGT Onboarding API",
        "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
    },
    "variable": [
        {
            "key": "base_url",
            "value": "https://api.ugt-towa.com/v1"
        },
        {
            "key": "api_key",
            "value": "{{api_key}}"
        }
    ]
}
```

### Ejemplos de cURL

#### Crear Solicitud
```bash
curl -X POST https://api.ugt-towa.com/v1/requests \
  -H "Authorization: Bearer {api_key}" \
  -H "Content-Type: application/json" \
  -d '{
    "empresa_nombre": "Empresa S.L.",
    "cif_nif": "12345678Z",
    "contacto_email": "juan@empresa.com"
  }'
```

#### Obtener Solicitud
```bash
curl -X GET https://api.ugt-towa.com/v1/requests/ONB-1705318200-ABC123 \
  -H "Authorization: Bearer {api_key}"
```

#### Validar CIF
```bash
curl -X POST https://api.ugt-towa.com/v1/validate/cif \
  -H "Content-Type: application/json" \
  -d '{"cif": "12345678Z"}'
```

---

**Versión de la API**: 1.0.0  
**Fecha**: Enero 2024  
**Contacto**: api-support@ugt-towa.com