# Sistema de Onboarding - Documentación Completa

## Índice
1. [Introducción](#introducción)
2. [Arquitectura del Sistema](#arquitectura-del-sistema)
3. [Formulario de Solicitud](#formulario-de-solicitud)
4. [Validación de Datos](#validación-de-datos)
5. [Timeline de Implementación](#timeline-de-implementación)
6. [Guía de Instalación](#guía-de-instalación)
7. [Configuración](#configuración)
8. [API y Endpoints](#api-y-endpoints)
9. [Mantenimiento](#mantenimiento)
10. [Troubleshooting](#troubleshooting)

## Introducción

El Sistema de Onboarding es una solución integral diseñada para gestionar el proceso completo de incorporación de nuevos clientes al sistema de replicación UGT TOWA. El sistema automatiza desde la solicitud inicial hasta la implementación completa del sistema personalizado.

### Objetivos del Sistema
- **Automatización**: Reducir el tiempo de procesamiento de solicitudes
- **Estandarización**: Asegurar calidad consistente en el proceso
- **Transparencia**: Mantener al cliente informado en todo momento
- **Eficiencia**: Optimizar recursos del equipo técnico
- **Escalabilidad**: Soportar múltiples clientes simultáneamente

### Características Principales
- ✅ Formulario de solicitud multi-paso con validación en tiempo real
- ✅ Sistema de validación robusta de datos de entrada
- ✅ Timeline de implementación interactivo con 10 fases detalladas
- ✅ Generación automática de propuestas técnicas
- ✅ Interfaz responsiva y accesible
- ✅ Guardado automático de progreso
- ✅ Exportación de reportes y documentación

## Arquitectura del Sistema

### Estructura de Archivos
```
sistema-replicacion-template/onboarding/
├── index.html                 # Formulario principal
├── assets/
│   ├── css/
│   │   └── styles.css        # Estilos principales
│   ├── js/
│   │   ├── validation.js     # Sistema de validación
│   │   ├── form-handler.js   # Manejo del formulario
│   │   └── timeline.js       # Timeline de implementación
│   └── images/
│       └── ugt-logo.png     # Logo UGT
└── docs/
    ├── DOCUMENTACION.md     # Este archivo
    ├── MANUAL_USUARIO.md    # Manual del usuario
    ├── GUIA_DESARROLLO.md   # Guía para desarrolladores
    └── API_REFERENCE.md     # Referencia de API
```

### Tecnologías Utilizadas
- **Frontend**: HTML5, CSS3, JavaScript ES6+
- **Validación**: Validación personalizada con regex
- **Almacenamiento**: localStorage para persistencia
- **UI/UX**: Font Awesome para iconografía
- **Responsive**: CSS Grid y Flexbox

### Componentes Principales

#### 1. Formulario Multi-Paso
- **4 pasos principales** con navegación fluida
- **Barra de progreso visual** con estados
- **Validación por paso** antes de avanzar
- **Guardado automático** en localStorage

#### 2. Sistema de Validación
- **Validación en tiempo real** para campos críticos
- **Validación por patrones** (CIF/NIF, email, teléfono)
- **Validación de fechas** con restricciones
- **Sanitización** de datos de entrada

#### 3. Timeline de Implementación
- **10 fases detalladas** con actividades específicas
- **Duración estimada** para cada fase
- **Responsables asignados** por fase
- **Entregables definidos** para cada hito

## Formulario de Solicitud

### Paso 1: Datos Básicos del Cliente

**Campos Requeridos:**
- Nombre de la Empresa (2-100 caracteres, formato específico)
- CIF/NIF (validación con algoritmo oficial)
- Sector de Actividad (lista predefinida)
- Número de Empleados (rangos específicos)
- Ubicación Geográfica (provincias principales)

**Persona de Contacto:**
- Nombre Completo (solo letras y espacios)
- Cargo en la empresa
- Email (validación de formato RFC)
- Teléfono (formato español o internacional)
- Fecha Prevista de Implementación (mínimo 7 días en el futuro)

**Validaciones Específicas:**
```javascript
// Ejemplo de validación CIF/NIF
const cifRegex = /^[0-9]{8}[TRWAGMYFPDXBNJZSQVHLCKE]$/i;
const nifRegex = /^[XYZ][0-9]{7}[TRWAGMYFPDXBNJZSQVHLCKE]$/i;

// Ejemplo de validación email
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
```

### Paso 2: Información Detallada de la Empresa

**Estructura Organizacional:**
- Representación sindical (Sí/No/En proceso)
- Si es "Sí": Número de sindicatos y afiliados estimados

**Sistemas Actuales:**
- Sistema de gestión sindical actual
- Deficiencias identificadas (checkboxes múltiples)

**Módulos Requeridos:**
- 6 módulos principales disponibles
- Toggle switches para selección individual
- Descripción detallada de cada módulo

### Paso 3: Configuración del Sistema

**Personalización Visual:**
- Selección de colores (primario, secundario, acento)
- Logo de la empresa (upload con validación)
- Idioma principal del sistema

**Configuración de Roles:**
- Número esperado de usuarios
- Necesidades especiales y requerimientos adicionales

### Paso 4: Revisión Final

**Resumen Automático:**
- Generación dinámica del resumen
- Organización por categorías
- Vista previa de configuración

**Aceptación Legal:**
- Términos y condiciones (obligatorio)
- Autorización de contacto (opcional)

## Validación de Datos

### Arquitectura de Validación

La clase `FormValidator` proporciona un sistema completo de validación con las siguientes características:

```javascript
class FormValidator {
    constructor() {
        this.errors = {};
        this.validationRules = {
            // Definición de reglas por campo
        };
    }
}
```

### Tipos de Validación

#### 1. Validación Requerida
```javascript
required: true,
message: 'El campo es obligatorio'
```

#### 2. Validación de Longitud
```javascript
minLength: 2,
maxLength: 100,
message: 'Longitud incorrecta'
```

#### 3. Validación por Patrón (Regex)
```javascript
pattern: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/,
message: 'Formato incorrecto'
```

#### 4. Validación Personalizada
```javascript
validate: (value) => {
    const inputDate = new Date(value);
    const minDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    return inputDate >= minDate;
},
message: 'Fecha no válida'
```

### Validaciones Específicas

#### CIF/NIF Español
```javascript
validateCIF(cif) {
    const cifRegex = /^[0-9]{8}[TRWAGMYFPDXBNJZSQVHLCKE]$/i;
    const nifRegex = /^[XYZ][0-9]{7}[TRWAGMYFPDXBNJZSQVHLCKE]$/i;
    
    if (!cifRegex.test(cif) && !nifRegex.test(cif)) {
        return false;
    }

    // Algoritmo oficial de validación
    const letters = 'TRWAGMYFPDXBNJZSQVHLCKE';
    // ... lógica de validación
}
```

#### Email RFC Compliant
```javascript
validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return false;

    // Validaciones adicionales
    const parts = email.split('@');
    if (parts.length !== 2) return false;

    const domain = parts[1];
    if (domain.length < 3 || domain.length > 253) return false;

    return true;
}
```

#### Teléfono Internacional
```javascript
validatePhone(phone) {
    const cleanPhone = phone.replace(/[\s\-()]/g, '');
    
    if (!/^\d{9,15}$/.test(cleanPhone)) return false;

    // Formato español o internacional
    if (cleanPhone.startsWith('34') && cleanPhone.length === 12) {
        return true;
    }

    return cleanPhone.length === 9;
}
```

### Validación de Archivos

```javascript
const fileValidators = {
    validateFileSize(file, maxSize = 5 * 1024 * 1024) {
        return {
            isValid: file.size <= maxSize,
            message: `El archivo no puede superar los ${Math.round(maxSize / 1024 / 1024)}MB`
        };
    },

    validateFileType(file, allowedTypes = ['image/jpeg', 'image/png', 'image/gif']) {
        return {
            isValid: allowedTypes.includes(file.type),
            message: `Tipo de archivo no permitido. Tipos permitidos: ${allowedTypes.join(', ')}`
        };
    }
};
```

## Timeline de Implementación

### Estructura del Timeline

El sistema implementa un timeline de 10 fases con las siguientes características:

#### Fase 1: Análisis de Requerimientos (2-3 días)
- **Responsable**: Equipo Técnico
- **Actividades**:
  - Validación de datos del cliente
  - Análisis de viabilidad técnica
  - Evaluación de recursos necesarios
  - Confirmación de módulos requeridos
- **Entregables**:
  - Informe de análisis inicial
  - Lista de requerimientos técnicos
  - Validación de configuración personalizada

#### Fase 2: Propuesta Técnica Personalizada (3-4 días)
- **Responsable**: Arquitecto de Soluciones
- **Actividades**:
  - Diseño de arquitectura del sistema
  - Planificación de personalizaciones
  - Elaboración de cronograma de implementación
  - Definición de hitos y entregables
- **Entregables**:
  - Documento de propuesta técnica
  - Cronograma de implementación detallado
  - Estimación de recursos y costos
  - Plan de pruebas y migración

#### Fase 3: Aprobación y Contratación (2-3 días)
- **Responsable**: Gerente de Proyecto
- **Actividades**:
  - Presentación de propuesta al cliente
  - Reunión de clarificación
  - Negociación de términos
  - Firma de contrato y inicio formal
- **Entregables**:
  - Propuesta aprobada
  - Contrato firmado
  - Orden de trabajo emitida
  - Accesos temporales configurados

#### Fase 4: Configuración Inicial del Sistema (3-5 días)
- **Responsable**: DevOps Engineer
- **Actividades**:
  - Provisionamiento de infraestructura
  - Instalación del sistema base
  - Configuración de colores y branding
  - Setup de base de datos y estructura
  - Configuración de servicios básicos
- **Entregables**:
  - Sistema base instalado y configurado
  - Branding personalizado aplicado
  - Base de datos configurada
  - Sistema de autenticación operativo

#### Fase 5: Desarrollo de Módulos (5-10 días)
- **Responsable**: Equipo de Desarrollo
- **Actividades**:
  - Desarrollo del módulo de afiliados
  - Implementación del sistema de citas
  - Desarrollo de comunicados y comentarios
  - Implementación de encuestas y estadísticas
  - Desarrollo del sistema de newsletter
  - Implementación de gestión de documentos
- **Entregables**:
  - Módulo de afiliados funcional
  - Sistema de citas operativo
  - Módulo de comunicados implementado
  - Sistema de encuestas disponible
  - Newsletter automatizado
  - Gestión de documentos operativa

#### Fase 6: Integraciones y APIs (3-5 días)
- **Responsable**: Desarrollador Full-Stack
- **Actividades**:
  - Desarrollo de APIs personalizadas
  - Integración con sistemas existentes
  - Configuración de webhooks y notificaciones
  - Desarrollo de conectores de datos
  - Setup de servicios de terceros
- **Entregables**:
  - APIs personalizadas documentadas
  - Integraciones funcionales
  - Webhooks configurados
  - Conectores de datos operativos

#### Fase 7: Pruebas de Calidad (4-6 días)
- **Responsable**: QA Engineer
- **Actividades**:
  - Pruebas unitarias de cada módulo
  - Pruebas de integración
  - Pruebas de rendimiento y carga
  - Pruebas de seguridad
  - Pruebas de usabilidad
  - Pruebas en diferentes navegadores
- **Entregables**:
  - Informe de pruebas unitarias
  - Informe de pruebas de integración
  - Informe de pruebas de rendimiento
  - Informe de seguridad
  - Bugs críticos resueltos

#### Fase 8: Migración de Datos (2-4 días)
- **Responsable**: Data Engineer
- **Actividades**:
  - Análisis de datos existentes
  - Desarrollo de scripts de migración
  - Migración en entorno de pruebas
  - Validación de integridad de datos
  - Migración en producción
  - Verificación final
- **Entregables**:
  - Scripts de migración documentados
  - Datos migrados y validados
  - Informe de migración
  - Backup de seguridad creado

#### Fase 9: Capacitación y Documentación (3-4 días)
- **Responsable**: Team Lead / Trainer
- **Actividades**:
  - Creación de documentación de usuario
  - Desarrollo de manuales técnicos
  - Grabación de tutoriales en video
  - Capacitación online del equipo
  - Sesiones de preguntas y respuestas
  - Entrega de credenciales y accesos
- **Entregables**:
  - Manual de usuario completo
  - Documentación técnica
  - Videos tutoriales
  - Equipo capacitado certificado
  - Accesos y credenciales entregadas

#### Fase 10: Go-Live y Soporte Inicial (1-2 días)
- **Responsable**: Soporte Técnico
- **Actividades**:
  - Lanzamiento oficial del sistema
  - Monitoreo intensivo de primeros días
  - Soporte técnico continuo
  - Resolución de incidencias menores
  - Ajuste de configuraciones
  - Validación de funcionalidades en vivo
- **Entregables**:
  - Sistema en producción operativo
  - Plan de soporte definido
  - Contactos de soporte establecidos
  - Sistema completamente funcional

### Duración Total Estimada
- **Mínimo**: 25 días hábiles
- **Máximo**: 45 días hábiles
- **Promedio**: 35 días hábiles

## Guía de Instalación

### Requisitos del Sistema
- **Navegador**: Chrome 80+, Firefox 75+, Safari 13+, Edge 80+
- **JavaScript**: ES6+ habilitado
- **Almacenamiento**: 50MB de espacio local
- **Conexión**: Internet para fuentes externas

### Instalación Local

#### 1. Clonar el Repositorio
```bash
git clone [repository-url]
cd sistema-replicacion-template/onboarding
```

#### 2. Estructura de Archivos
Asegurar que la estructura sea:
```
onboarding/
├── index.html
├── assets/
│   ├── css/styles.css
│   ├── js/
│   │   ├── validation.js
│   │   ├── form-handler.js
│   │   └── timeline.js
│   └── images/
│       └── ugt-logo.png
└── docs/
    └── DOCUMENTACION.md
```

#### 3. Configuración de Rutas
El sistema utiliza rutas relativas. Asegurar que todos los archivos mantengan su estructura relativa.

#### 4. Configuración de Logo
Colocar el logo de UGT en `assets/images/ugt-logo.png` o actualizar la ruta en el HTML.

### Instalación en Servidor Web

#### Servidor Apache
```apache
# .htaccess
Options -Indexes
DirectoryIndex index.html
```

#### Servidor Nginx
```nginx
location /onboarding/ {
    try_files $uri $uri/ /index.html;
}
```

### Verificación de Instalación
1. Abrir `index.html` en el navegador
2. Verificar que todos los estilos se cargan correctamente
3. Comprobar que la navegación entre pasos funciona
4. Validar que el localStorage está disponible

## Configuración

### Variables CSS Personalizables
```css
:root {
    --primary-color: #1e40af;      /* Color primario */
    --secondary-color: #64748b;    /* Color secundario */
    --accent-color: #ef4444;       /* Color de acento */
    --success-color: #10b981;      /* Color de éxito */
    --warning-color: #f59e0b;      /* Color de advertencia */
    --error-color: #ef4444;        /* Color de error */
}
```

### Configuración de Validación
Modificar las reglas de validación en `assets/js/validation.js`:

```javascript
this.validationRules = {
    empresa_nombre: {
        required: true,
        minLength: 2,
        maxLength: 100,
        pattern: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ0-9\s\-.,&]+$/,
        message: 'Mensaje de error personalizado'
    }
};
```

### Configuración del Timeline
Personalizar las fases en `assets/js/timeline.js`:

```javascript
getTimelineData() {
    return [
        {
            id: 1,
            title: "Mi Fase Personalizada",
            duration: "X días",
            // ... más configuración
        }
    ];
}
```

### Configuración de Envío de Formularios
Para integrar con un backend, modificar en `assets/js/form-handler.js`:

```javascript
async simulateFormSubmission() {
    const response = await fetch('/api/submit-onboarding', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(this.formData)
    });
    
    return response.json();
}
```

## API y Endpoints

### Endpoints Recomendados

#### POST /api/onboarding/submit
Envío de solicitud de onboarding.

**Request Body:**
```json
{
    "empresa_nombre": "Empresa S.L.",
    "cif_nif": "12345678Z",
    "sector_actividad": "servicios",
    "num_empleados": "11-50",
    "ubicacion_geografica": "madrid",
    "contacto_nombre": "Juan Pérez",
    "contacto_cargo": "Director",
    "contacto_email": "juan@empresa.com",
    "contacto_telefono": "+34 600 000 000",
    "fecha_prevista_implementacion": "2024-02-01",
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
    "autorizo_contacto": true,
    "fecha_solicitud": "2024-01-15T10:30:00Z",
    "id_solicitud": "ONB-1705318200-ABC123"
}
```

**Response:**
```json
{
    "status": "success",
    "message": "Solicitud enviada correctamente",
    "id_solicitud": "ONB-1705318200-ABC123",
    "proximo_paso": "Análisis de requerimientos",
    "fecha_estimada_respuesta": "2024-01-17",
    "contacto": {
        "nombre": "María García",
        "email": "maria@ugt-towa.com",
        "telefono": "+34 91 123 4567"
    }
}
```

#### GET /api/onboarding/status/{id_solicitud}
Consulta el estado de una solicitud.

**Response:**
```json
{
    "id_solicitud": "ONB-1705318200-ABC123",
    "status": "en_proceso",
    "fase_actual": {
        "id": 3,
        "nombre": "Aprobación y Contratación",
        "progreso": 60
    },
    "timeline": [
        {
            "fase": "Análisis de Requerimientos",
            "status": "completado",
            "fecha_inicio": "2024-01-15",
            "fecha_fin": "2024-01-17"
        },
        {
            "fase": "Propuesta Técnica",
            "status": "completado",
            "fecha_inicio": "2024-01-18",
            "fecha_fin": "2024-01-22"
        },
        {
            "fase": "Aprobación y Contratación",
            "status": "en_progreso",
            "fecha_inicio": "2024-01-23",
            "fecha_fin": "2024-01-26"
        }
    ]
}
```

#### POST /api/onboarding/validate-cif
Validación de CIF/NIF en tiempo real.

**Request:**
```json
{
    "cif": "12345678Z"
}
```

**Response:**
```json
{
    "valid": true,
    "tipo": "NIF",
    "letra": "Z",
    "provincia": "Madrid"
}
```

## Mantenimiento

### Actualización de Datos
Actualizar regularmente los datos de sectores, ubicaciones y opciones en:
- `index.html` (opciones de select)
- `validation.js` (reglas de validación)
- `timeline.js` (fases y actividades)

### Monitoreo de Rendimiento
- **Tiempo de carga**: < 3 segundos
- **Validación en tiempo real**: < 500ms
- **Navegación entre pasos**: < 200ms

### Backup de Datos
Los datos se almacenan en localStorage. Para backup:
1. Solicitar al usuario que exporte sus datos
2. Implementar exportación automática
3. Backup periódico en servidor

### Actualizaciones de Seguridad
- Validación de todos los inputs
- Sanitización de datos de entrada
- Protección contra XSS
- Encriptación de datos sensibles en transmisión

## Troubleshooting

### Problemas Comunes

#### 1. Los estilos no se cargan
**Síntomas**: Formulario sin formato
**Causas**: Ruta incorrecta a CSS
**Solución**:
```html
<!-- Verificar ruta correcta -->
<link rel="stylesheet" href="assets/css/styles.css">
```

#### 2. JavaScript no funciona
**Síntomas**: Formulario no responde
**Causas**: Error en JS o navegador antiguo
**Solución**:
1. Abrir consola del navegador (F12)
2. Verificar errores en la pestaña Console
3. Actualizar navegador a versión reciente

#### 3. Validación no funciona
**Síntomas**: Campos se validan incorrectamente
**Causas**: Error en reglas de validación
**Solución**:
1. Verificar consola para errores JavaScript
2. Comprobar configuración de validación
3. Re-verificar expresión regular

#### 4. Datos no se guardan
**Síntomas**: Pérdida de datos al recargar
**Causas**: localStorage deshabilitado
**Solución**:
```javascript
// Verificar localStorage
if (typeof(Storage) !== "undefined") {
    // localStorage disponible
} else {
    alert('localStorage no disponible');
}
```

#### 5. Timeline no se muestra
**Síntomas**: Timeline vacío o incompleto
**Causas**: Error en generación de HTML
**Solución**:
1. Verificar que timeline.js se carga
2. Comprobar que el contenedor existe
3. Revisar errores en consola

### Logs de Error

#### Estructura de Logs
```javascript
// Registrar errores importantes
console.error('Error de validación:', validationResult.errors);
console.log('Datos guardados en localStorage:', formData);
```

#### Debug Mode
```javascript
// Activar modo debug
window.DEBUG_MODE = true;

// Verificar datos en consola
console.log('Form data:', window.onboardingHandler.formData);
console.log('Current step:', window.onboardingHandler.currentStep);
```

### Contacto para Soporte
- **Email**: soporte@ugt-towa.com
- **Teléfono**: +34 91 123 4567
- **Horario**: L-V 9:00-18:00

---

**Versión**: 1.0.0  
**Fecha**: Enero 2024  
**Autor**: Equipo de Desarrollo UGT TOWA  
**Última actualización**: 2024-01-15