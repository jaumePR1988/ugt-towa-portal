# Guía de Desarrollo - Sistema de Onboarding

## Índice
1. [Arquitectura del Sistema](#arquitectura-del-sistema)
2. [Estructura del Código](#estructura-del-código)
3. [Desarrollo y Extensión](#desarrollo-y-extensión)
4. [API y Integración](#api-y-integración)
5. [Testing](#testing)
6. [Despliegue](#despliegue)
7. [Mantenimiento](#mantenimiento)

## Arquitectura del Sistema

### Visión General
El sistema sigue una arquitectura de **Single Page Application (SPA)** con componentes JavaScript modulares. La separación de responsabilidades garantiza un código mantenible y escalable.

### Patrones de Diseño Utilizados
- **Module Pattern**: Para encapsulación de funcionalidades
- **Observer Pattern**: Para comunicación entre componentes
- **Strategy Pattern**: Para validación flexible
- **Factory Pattern**: Para creación de elementos UI

### Dependencias
- **Font Awesome**: Para iconografía
- **Sin dependencias externas de JavaScript**: Frameworkless approach
- **CSS3**: Para estilos y animaciones
- **LocalStorage API**: Para persistencia de datos

## Estructura del Código

### Archivos Principales

#### index.html
- **Responsabilidad**: Estructura base y markup
- **Elementos**: Formulario multi-paso, timeline, modales
- **Semántica**: HTML5 semántico con roles ARIA

```html
<!-- Estructura base del formulario -->
<div class="container">
    <header class="header">
        <!-- Logo y título -->
    </header>
    <div class="progress-bar">
        <!-- Barra de progreso -->
    </div>
    <div class="form-container">
        <!-- Steps del formulario -->
    </div>
</div>
```

#### assets/css/styles.css
- **Responsabilidad**: Estilos y diseño responsivo
- **Organización**: CSS custom properties, utilidades, componentes
- **Metodología**: Mobile-first, BEM-like naming

```css
/* Variables CSS para consistencia */
:root {
    --primary-color: #1e40af;
    --border-radius: 8px;
}

/* Componentes */
.form-step { /* ... */ }
.btn { /* ... */ }
.modal { /* ... */ }
```

#### assets/js/validation.js
- **Clase Principal**: `FormValidator`
- **Responsabilidad**: Validación de datos y reglas
- **Características**: Validación en tiempo real, patrones regex, sanitización

```javascript
class FormValidator {
    constructor() {
        this.errors = {};
        this.validationRules = {};
    }
    
    validateField(fieldName, value) { /* ... */ }
    validateStep(stepNumber) { /* ... */ }
    validateCIF(cif) { /* ... */ }
    validateEmail(email) { /* ... */ }
}
```

#### assets/js/form-handler.js
- **Clase Principal**: `OnboardingFormHandler`
- **Responsabilidad**: Navegación, gestión de estado, envío
- **Características**: Auto-guardado, progreso, resumen dinámico

```javascript
class OnboardingFormHandler {
    constructor() {
        this.currentStep = 1;
        this.formData = {};
    }
    
    nextStep() { /* ... */ }
    submitForm() { /* ... */ }
    generateSummary() { /* ... */ }
}
```

#### assets/js/timeline.js
- **Clase Principal**: `ImplementationTimeline`
- **Responsabilidad**: Timeline interactivo de implementación
- **Características**: Animaciones, navegación, estados

```javascript
class ImplementationTimeline {
    constructor() {
        this.timelineData = this.getTimelineData();
    }
    
    createTimeline() { /* ... */ }
    updateProgress() { /* ... */ }
    togglePhaseDetails() { /* ... */ }
}
```

## Desarrollo y Extensión

### Agregar un Nuevo Campo

#### 1. HTML (index.html)
```html
<div class="form-group">
    <label for="nuevo_campo">Nuevo Campo *</label>
    <input type="text" id="nuevo_campo" name="nuevo_campo" required>
    <div class="error-message" id="error-nuevo_campo"></div>
</div>
```

#### 2. Validación (validation.js)
```javascript
// Agregar regla de validación
this.validationRules.nuevo_campo = {
    required: true,
    minLength: 3,
    maxLength: 50,
    pattern: /^[a-zA-Z0-9\s]+$/,
    message: 'El campo debe tener entre 3 y 50 caracteres alfanuméricos'
};
```

#### 3. Resumen (form-handler.js)
```javascript
// Agregar al resumen en createSummaryHTML()
<div class="summary-item">
    <span class="summary-label">Nuevo Campo:</span>
    <span class="summary-value">${this.formData.nuevo_campo || 'No especificado'}</span>
</div>
```

### Agregar un Nuevo Paso

#### 1. HTML
```html
<div class="form-step" id="step-5">
    <h2><i class="fas fa-star"></i> Paso Adicional</h2>
    <!-- Contenido del paso -->
</div>
```

#### 2. JavaScript
```javascript
// En form-handler.js
this.totalSteps = 5; // Cambiar de 4 a 5

// Actualizar barra de progreso
// En updateProgressBar() agregar step
<div class="step" data-step="5">
    <i class="fas fa-star"></i>
    <span>Nuevo Paso</span>
</div>
```

### Extender el Timeline

#### 1. Agregar Nueva Fase (timeline.js)
```javascript
getTimelineData() {
    const baseData = this.getBaseTimelineData();
    
    baseData.push({
        id: 11,
        title: "Nueva Fase",
        duration: "2-3 días",
        description: "Descripción de la nueva fase",
        activities: [
            "Actividad 1",
            "Actividad 2"
        ],
        deliverables: [
            "Entregable 1",
            "Entregable 2"
        ],
        responsable: "Nuevo Responsable"
    });
    
    return baseData;
}
```

#### 2. Actualizar Estilos
```css
/* En styles.css */
.timeline-phase[data-phase-id="11"] {
    border-left-color: var(--new-color);
}
```

### Crear Validación Personalizada

```javascript
// En validation.js
validateCustomField(value, additionalData) {
    // Lógica de validación personalizada
    if (value.length !== additionalData.expectedLength) {
        return { isValid: false, message: 'Longitud incorrecta' };
    }
    
    return { isValid: true, message: '' };
}
```

### Integración con Backend

#### Configuración de Endpoint
```javascript
// En form-handler.js
async submitForm() {
    try {
        const response = await fetch('/api/onboarding/submit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + this.getAuthToken()
            },
            body: JSON.stringify(this.formData)
        });
        
        const result = await response.json();
        
        if (result.status === 'success') {
            this.showConfirmationModal(result);
        } else {
            throw new Error(result.message);
        }
    } catch (error) {
        this.handleSubmissionError(error);
    }
}
```

#### Manejo de Errores
```javascript
handleSubmissionError(error) {
    console.error('Error de envío:', error);
    
    // Mostrar mensaje de error al usuario
    this.showErrorMessage('Error al enviar la solicitud. Por favor, inténtelo de nuevo.');
    
    // Enviar error a sistema de logging
    this.logError(error);
}
```

## API y Integración

### Endpoints Recomendados

#### POST /api/onboarding
```javascript
const response = await fetch('/api/onboarding', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify(formData)
});

const result = await response.json();
```

#### GET /api/onboarding/{id}/status
```javascript
const response = await fetch(`/api/onboarding/${requestId}/status`);
const status = await response.json();
```

#### PUT /api/onboarding/{id}
```javascript
const response = await fetch(`/api/onboarding/${requestId}`, {
    method: 'PUT',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify(updatedData)
});
```

### Integración con Sistemas de CRM

```javascript
// Ejemplo de integración con Salesforce
class CRMIntegration {
    constructor(crmConfig) {
        this.config = crmConfig;
    }
    
    async createLead(formData) {
        const leadData = this.mapToCRM(formData);
        
        return await fetch('/api/crm/lead', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${this.config.apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(leadData)
        });
    }
    
    mapToCRM(formData) {
        return {
            Company: formData.empresa_nombre,
            LastName: formData.contacto_nombre,
            Email: formData.contacto_email,
            Phone: formData.contacto_telefono,
            // Mapear otros campos
        };
    }
}
```

## Testing

### Unit Testing

#### Configuración de Jest
```javascript
// validation.test.js
describe('FormValidator', () => {
    let validator;
    
    beforeEach(() => {
        validator = new FormValidator();
    });
    
    test('should validate required field', () => {
        const result = validator.validateField('empresa_nombre', '');
        expect(result.isValid).toBe(false);
    });
    
    test('should validate CIF format', () => {
        const result = validator.validateCIF('12345678Z');
        expect(result).toBe(true);
    });
    
    test('should reject invalid CIF', () => {
        const result = validator.validateCIF('1234567');
        expect(result).toBe(false);
    });
});
```

### Integration Testing

#### Test de Flujo Completo
```javascript
// form-flow.test.js
describe('Form Flow', () => {
    test('should complete full form submission', async () => {
        // Fill step 1
        document.getElementById('empresa_nombre').value = 'Test S.L.';
        document.getElementById('cif_nif').value = '12345678Z';
        // ...
        
        // Navigate through steps
        onboardingHandler.nextStep();
        expect(onboardingHandler.currentStep).toBe(2);
        
        // Submit form
        await onboardingHandler.submitForm();
        expect(document.getElementById('confirmation-modal').classList.contains('show')).toBe(true);
    });
});
```

### End-to-End Testing con Cypress

```javascript
// cypress/integration/onboarding.spec.js
describe('Onboarding Form', () => {
    it('should complete onboarding process', () => {
        cy.visit('/onboarding');
        
        // Fill form step by step
        cy.get('#empresa_nombre').type('Test Company');
        cy.get('#cif_nif').type('12345678Z');
        cy.get('.btn-primary').click();
        
        // Continue with steps...
        cy.get('.btn-success').click();
        cy.get('.modal').should('be.visible');
    });
});
```

## Despliegue

### Configuración de Build

#### Minificación y Optimización
```bash
# Instalar herramientas
npm install -g uglifycss uglify-js

# Minificar CSS
uglifycss assets/css/styles.css > assets/css/styles.min.css

# Minificar JavaScript
uglifyjs assets/js/*.js > assets/js/bundle.min.js
```

#### Configuración de Apache
```apache
# .htaccess para producción
<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteBase /onboarding/
    
    # Force HTTPS
    RewriteCond %{HTTPS} off
    RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
    
    # Cache static assets
    <IfModule mod_expires.c>
        ExpiresActive On
        ExpiresByType text/css "access plus 1 year"
        ExpiresByType application/javascript "access plus 1 year"
        ExpiresByType image/png "access plus 1 year"
    </IfModule>
    
    # Compress files
    <IfModule mod_deflate.c>
        AddOutputFilterByType DEFLATE text/plain
        AddOutputFilterByType DEFLATE text/html
        AddOutputFilterByType DEFLATE text/xml
        AddOutputFilterByType DEFLATE text/css
        AddOutputFilterByType DEFLATE application/xml
        AddOutputFilterByType DEFLATE application/xhtml+xml
        AddOutputFilterByType DEFLATE application/rss+xml
        AddOutputFilterByType DEFLATE application/javascript
        AddOutputFilterByType DEFLATE application/x-javascript
    </IfModule>
</IfModule>
```

### Configuración de Nginx
```nginx
server {
    listen 80;
    server_name onboarding.ugt-towa.com;
    
    location /onboarding/ {
        alias /var/www/onboarding/;
        try_files $uri $uri/ /onboarding/index.html;
        
        # Cache static assets
        location ~* \.(css|js|png|jpg|jpeg|gif|ico|svg)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
        
        # Security headers
        add_header X-Frame-Options "SAMEORIGIN" always;
        add_header X-XSS-Protection "1; mode=block" always;
        add_header X-Content-Type-Options "nosniff" always;
        add_header Referrer-Policy "no-referrer-when-downgrade" always;
    }
}
```

### Monitoreo y Logging

#### Google Analytics Integration
```javascript
// tracking.js
class AnalyticsTracker {
    static init() {
        if (typeof gtag !== 'undefined') {
            gtag('config', 'GA_TRACKING_ID');
        }
    }
    
    static trackEvent(eventName, parameters) {
        if (typeof gtag !== 'undefined') {
            gtag('event', eventName, parameters);
        }
    }
    
    static trackStepCompletion(stepNumber) {
        this.trackEvent('step_completed', {
            step_number: stepNumber,
            custom_parameter: 'onboarding_flow'
        });
    }
    
    static trackFormSubmission(formData) {
        this.trackEvent('form_submitted', {
            form_type: 'onboarding_request',
            modules_selected: formData.modulos?.length || 0
        });
    }
}
```

#### Error Logging
```javascript
// error-logger.js
class ErrorLogger {
    static logError(error, context) {
        const errorData = {
            message: error.message,
            stack: error.stack,
            context: context,
            userAgent: navigator.userAgent,
            timestamp: new Date().toISOString(),
            url: window.location.href
        };
        
        // Send to error tracking service
        fetch('/api/logs/error', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(errorData)
        }).catch(() => {
            // Fallback to console
            console.error('Error logging failed:', errorData);
        });
    }
}
```

## Mantenimiento

### Actualizaciones de Dependencias

#### Verificar Versiones
```bash
# Verificar Font Awesome
curl -I https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css

# Verificar vulnerabilidades en CSS/JS
npm audit
```

#### Actualizar Versiones
1. Probar localmente con nueva versión
2. Verificar compatibilidad con navegadores objetivo
3. Actualizar documentación si hay cambios breaking

### Performance Monitoring

#### Métricas Clave
- **Tiempo de carga**: < 3 segundos
- **Tiempo de validación**: < 500ms
- **Tamaño total**: < 500KB
- **Lighthouse Score**: > 90

#### Herramientas de Medición
```javascript
// performance-monitor.js
class PerformanceMonitor {
    static measureLoadTime() {
        window.addEventListener('load', () => {
            const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
            console.log('Page load time:', loadTime + 'ms');
        });
    }
    
    static measureFormInteraction() {
        const observer = new PerformanceObserver((list) => {
            list.getEntries().forEach((entry) => {
                if (entry.name === 'form-interaction') {
                    console.log('Form interaction time:', entry.duration);
                }
            });
        });
        observer.observe({ entryTypes: ['measure'] });
    }
}
```

### Backup y Recuperación

#### Estrategia de Backup
1. **Código fuente**: Git repository con tags de versión
2. **Configuraciones**: Archivos de configuración versionados
3. **Datos de usuario**: Exportación automática de localStorage
4. **Documentación**: Versionada junto con el código

#### Script de Backup
```bash
#!/bin/bash
# backup-onboarding.sh

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups/onboarding_$DATE"

# Create backup directory
mkdir -p $BACKUP_DIR

# Copy source files
cp -r /var/www/onboarding $BACKUP_DIR/

# Create archive
tar -czf $BACKUP_DIR.tar.gz $BACKUP_DIR

# Cleanup
rm -rf $BACKUP_DIR

echo "Backup created: $BACKUP_DIR.tar.gz"
```

### Mantenimiento Preventivo

#### Checklist Mensual
- [ ] Verificar funcionamiento en todos los navegadores soportados
- [ ] Revisar logs de errores
- [ ] Actualizar documentación si hay cambios
- [ ] Verificar rendimiento con herramientas de medición
- [ ] Revisar backups recientes
- [ ] Verificar enlaces externos (CDN de Font Awesome)

#### Checklist Trimestral
- [ ] Actualizar dependencias si hay nuevas versiones
- [ ] Revisar y actualizar validaciones según cambios normativos
- [ ] Evaluar nuevas funcionalidades solicitadas
- [ ] Revisar seguridad y aplicar parches
- [ ] Optimizar CSS/JS si es necesario

---

**Versión**: 1.0.0  
**Fecha**: Enero 2024  
**Mantenido por**: Equipo de Desarrollo UGT TOWA