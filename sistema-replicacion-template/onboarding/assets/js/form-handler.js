/**
 * Manejador del Formulario de Onboarding
 * Gestiona la navegación entre pasos, envío del formulario y interacciones
 */

class OnboardingFormHandler {
    constructor() {
        this.currentStep = 1;
        this.totalSteps = 4;
        this.formData = {};
        this.isSubmitting = false;
        
        this.init();
    }

    /**
     * Inicializa el manejador del formulario
     */
    init() {
        this.bindEvents();
        this.updateProgressBar();
        this.setupFileUploads();
        this.loadSavedData();
    }

    /**
     * Vincula los eventos necesarios
     */
    bindEvents() {
        // Eventos de navegación de pasos
        this.setupStepNavigation();
        
        // Eventos de validación en tiempo real
        this.setupRealTimeValidation();
        
        // Eventos de cambio de color para preview
        this.setupColorPreview();
        
        // Prevenir envío accidental con Enter
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.target.matches('textarea')) {
                e.preventDefault();
            }
        });
    }

    /**
     * Configura la navegación entre pasos
     */
    setupStepNavigation() {
        // Los botones ya tienen onclick en el HTML
        // Agregar validación de navegación con teclado
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey || e.metaKey) {
                if (e.key === 'ArrowRight') {
                    e.preventDefault();
                    this.nextStep();
                } else if (e.key === 'ArrowLeft') {
                    e.preventDefault();
                    this.prevStep();
                }
            }
        });
    }

    /**
     * Configura validación en tiempo real
     */
    setupRealTimeValidation() {
        const inputs = document.querySelectorAll('input, select, textarea');
        
        inputs.forEach(input => {
            // Validar al perder el foco
            input.addEventListener('blur', () => {
                this.validateField(input);
            });

            // Validar al escribir (con debounce para campos específicos)
            if (input.type === 'email' || input.name === 'cif_nif' || input.name === 'contacto_telefono') {
                let timeout;
                input.addEventListener('input', () => {
                    clearTimeout(timeout);
                    timeout = setTimeout(() => {
                        this.validateField(input);
                    }, 500);
                });
            }
        });
    }

    /**
     * Configura los uploads de archivos
     */
    setupFileUploads() {
        const fileInputs = document.querySelectorAll('input[type="file"]');
        
        fileInputs.forEach(input => {
            input.addEventListener('change', (e) => {
                this.handleFileUpload(e.target);
            });
        });
    }

    /**
     * Configura la preview de colores
     */
    setupColorPreview() {
        const colorInputs = document.querySelectorAll('input[type="color"]');
        
        colorInputs.forEach(input => {
            input.addEventListener('change', () => {
                this.updateColorPreview(input);
            });
        });
    }

    /**
     * Avanza al siguiente paso
     */
    nextStep() {
        if (this.currentStep >= this.totalSteps) {
            return;
        }

        // Validar el step actual
        const validationResult = window.formValidator.validateCompleteStep(this.currentStep);
        
        if (!validationResult.isValid) {
            window.formValidator.showErrors(validationResult.errors);
            this.scrollToFirstError();
            return;
        }

        // Guardar datos del step actual
        this.saveStepData(this.currentStep);

        // Avanzar al siguiente step
        this.currentStep++;
        this.showStep(this.currentStep);
        this.updateProgressBar();
        this.scrollToTop();
    }

    /**
     * Retrocede al paso anterior
     */
    prevStep() {
        if (this.currentStep <= 1) {
            return;
        }

        this.currentStep--;
        this.showStep(this.currentStep);
        this.updateProgressBar();
        this.scrollToTop();
    }

    /**
     * Muestra un paso específico
     * @param {number} stepNumber - Número del paso a mostrar
     */
    showStep(stepNumber) {
        // Ocultar todos los pasos
        document.querySelectorAll('.form-step').forEach(step => {
            step.classList.remove('active');
        });

        // Mostrar el paso actual
        const currentStepElement = document.getElementById(`step-${stepNumber}`);
        if (currentStepElement) {
            currentStepElement.classList.add('active');
        }

        // Si es el paso 4 (revisión), generar el resumen
        if (stepNumber === 4) {
            this.generateSummary();
        }
    }

    /**
     * Actualiza la barra de progreso
     */
    updateProgressBar() {
        const steps = document.querySelectorAll('.progress-steps .step');
        
        steps.forEach((step, index) => {
            const stepNumber = index + 1;
            step.classList.remove('active', 'completed');
            
            if (stepNumber < this.currentStep) {
                step.classList.add('completed');
            } else if (stepNumber === this.currentStep) {
                step.classList.add('active');
            }
        });
    }

    /**
     * Valida un campo específico
     * @param {HTMLElement} input - Campo a validar
     */
    validateField(input) {
        const result = window.formValidator.validateField(input.name, input.value);
        
        if (result.isValid) {
            window.formValidator.markFieldAsValid(input.name);
        } else {
            window.formValidator.showErrors({ [input.name]: result.message });
        }
    }

    /**
     * Maneja la subida de archivos
     * @param {HTMLInputElement} input - Input de archivo
     */
    handleFileUpload(input) {
        const file = input.files[0];
        const fileNameDisplay = document.getElementById(`${input.id}-name`);
        
        if (!file) {
            if (fileNameDisplay) {
                fileNameDisplay.textContent = '';
            }
            return;
        }

        // Validar archivo
        const validations = [
            fileValidators.validateFileExists(file),
            fileValidators.validateFileSize(file),
            fileValidators.validateFileType(file)
        ];

        const invalidValidation = validations.find(v => !v.isValid);
        
        if (invalidValidation) {
            this.showFileError(input, invalidValidation.message);
            input.value = '';
            return;
        }

        // Mostrar nombre del archivo
        if (fileNameDisplay) {
            fileNameDisplay.textContent = `Archivo seleccionado: ${file.name} (${this.formatFileSize(file.size)})`;
            fileNameDisplay.style.color = 'var(--success-color)';
        }

        this.clearFieldError(input);
    }

    /**
     * Muestra error de archivo
     * @param {HTMLInputElement} input - Input de archivo
     * @param {string} message - Mensaje de error
     */
    showFileError(input, message) {
        const formGroup = input.closest('.form-group');
        const errorElement = formGroup.querySelector('.error-message') || this.createErrorElement(formGroup);
        
        errorElement.textContent = message;
        errorElement.classList.add('show');
        formGroup.classList.add('error');

        const fileNameDisplay = document.getElementById(`${input.id}-name`);
        if (fileNameDisplay) {
            fileNameDisplay.textContent = '';
        }
    }

    /**
     * Limpia error de campo
     * @param {HTMLInputElement} input - Input del campo
     */
    clearFieldError(input) {
        const formGroup = input.closest('.form-group');
        const errorElement = formGroup.querySelector('.error-message');
        
        if (errorElement) {
            errorElement.classList.remove('show');
        }
        formGroup.classList.remove('error');
    }

    /**
     * Crea un elemento de error si no existe
     * @param {HTMLElement} formGroup - Grupo del formulario
     * @returns {HTMLElement} Elemento de error
     */
    createErrorElement(formGroup) {
        const errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        formGroup.appendChild(errorElement);
        return errorElement;
    }

    /**
     * Actualiza la preview de colores
     * @param {HTMLInputElement} colorInput - Input de color
     */
    updateColorPreview(colorInput) {
        // Aquí se podría agregar lógica para mostrar una preview del color
        // Por ejemplo, actualizando variables CSS en tiempo real
        document.documentElement.style.setProperty(`--custom-${colorInput.name}`, colorInput.value);
    }

    /**
     * Genera el resumen del formulario
     */
    generateSummary() {
        const summaryContent = document.getElementById('summary-content');
        if (!summaryContent) return;

        this.formData = window.formValidator.getFormData();
        
        const summaryHTML = this.createSummaryHTML();
        summaryContent.innerHTML = summaryHTML;
    }

    /**
     * Crea el HTML del resumen
     * @returns {string} HTML del resumen
     */
    createSummaryHTML() {
        return `
            <div class="summary-section">
                <h4><i class="fas fa-building"></i> Información de la Empresa</h4>
                <div class="summary-item">
                    <span class="summary-label">Empresa:</span>
                    <span class="summary-value">${this.formData.empresa_nombre || 'No especificado'}</span>
                </div>
                <div class="summary-item">
                    <span class="summary-label">CIF/NIF:</span>
                    <span class="summary-value">${this.formData.cif_nif || 'No especificado'}</span>
                </div>
                <div class="summary-item">
                    <span class="summary-label">Sector:</span>
                    <span class="summary-value">${this.formatSelectValue(this.formData.sector_actividad) || 'No especificado'}</span>
                </div>
                <div class="summary-item">
                    <span class="summary-label">Empleados:</span>
                    <span class="summary-value">${this.formatSelectValue(this.formData.num_empleados) || 'No especificado'}</span>
                </div>
                <div class="summary-item">
                    <span class="summary-label">Ubicación:</span>
                    <span class="summary-value">${this.formatSelectValue(this.formData.ubicacion_geografica) || 'No especificado'}</span>
                </div>
            </div>

            <div class="summary-section">
                <h4><i class="fas fa-user-tie"></i> Persona de Contacto</h4>
                <div class="summary-item">
                    <span class="summary-label">Nombre:</span>
                    <span class="summary-value">${this.formData.contacto_nombre || 'No especificado'}</span>
                </div>
                <div class="summary-item">
                    <span class="summary-label">Cargo:</span>
                    <span class="summary-value">${this.formData.contacto_cargo || 'No especificado'}</span>
                </div>
                <div class="summary-item">
                    <span class="summary-label">Email:</span>
                    <span class="summary-value">${this.formData.contacto_email || 'No especificado'}</span>
                </div>
                <div class="summary-item">
                    <span class="summary-label">Teléfono:</span>
                    <span class="summary-value">${this.formData.contacto_telefono || 'No especificado'}</span>
                </div>
                <div class="summary-item">
                    <span class="summary-label">Fecha de Implementación:</span>
                    <span class="summary-value">${this.formatDate(this.formData.fecha_prevista_implementacion) || 'No especificado'}</span>
                </div>
            </div>

            <div class="summary-section">
                <h4><i class="fas fa-sitemap"></i> Estructura Organizacional</h4>
                <div class="summary-item">
                    <span class="summary-label">Representación Sindical:</span>
                    <span class="summary-value">${this.formatRadioValue(this.formData.estructura_sindical) || 'No especificado'}</span>
                </div>
                ${this.formData.estructura_sindical === 'si' ? `
                    <div class="summary-item">
                        <span class="summary-label">Sindicatos:</span>
                        <span class="summary-value">${this.formData.num_sindicatos || 'No especificado'}</span>
                    </div>
                    <div class="summary-item">
                        <span class="summary-label">Afiliados Estimados:</span>
                        <span class="summary-value">${this.formatSelectValue(this.formData.afiliados_estimados) || 'No especificado'}</span>
                    </div>
                ` : ''}
            </div>

            <div class="summary-section">
                <h4><i class="fas fa-cog"></i> Configuración Solicitada</h4>
                <div class="summary-item">
                    <span class="summary-label">Módulos Seleccionados:</span>
                    <span class="summary-value">${this.formatModules(this.formData.modulos) || 'Ninguno'}</span>
                </div>
                <div class="summary-item">
                    <span class="summary-label">Usuarios Esperados:</span>
                    <span class="summary-value">${this.formatSelectValue(this.formData.usuarios_esperados) || 'No especificado'}</span>
                </div>
                <div class="summary-item">
                    <span class="summary-label">Color Primario:</span>
                    <span class="summary-value">
                        <span class="color-preview" style="background-color: ${this.formData.color_primario || '#1e40af'}; width: 20px; height: 20px; display: inline-block; border-radius: 50%; margin-right: 5px;"></span>
                        ${this.formData.color_primario || '#1e40af'}
                    </span>
                </div>
                ${this.formData.necesidades_especiales ? `
                    <div class="summary-item">
                        <span class="summary-label">Necesidades Especiales:</span>
                        <span class="summary-value">${this.formData.necesidades_especiales}</span>
                    </div>
                ` : ''}
            </div>
        `;
    }

    /**
     * Formatea valores de select
     * @param {string} value - Valor a formatear
     * @returns {string} Valor formateado
     */
    formatSelectValue(value) {
        if (!value) return '';
        const options = {
            'manufactura': 'Manufactura',
            'servicios': 'Servicios',
            'comercio': 'Comercio',
            'tecnologia': 'Tecnología',
            'sanidad': 'Sanidad',
            'educacion': 'Educación',
            'construccion': 'Construcción',
            'otro': 'Otro',
            '1-10': '1-10 empleados',
            '11-50': '11-50 empleados',
            '51-100': '51-100 empleados',
            '101-500': '101-500 empleados',
            '500+': 'Más de 500 empleados',
            'madrid': 'Madrid',
            'barcelona': 'Barcelona',
            'valencia': 'Valencia',
            'sevilla': 'Sevilla',
            'bilbao': 'Bilbao',
            'otra': 'Otra',
            'si': 'Sí',
            'no': 'No',
            'en_proceso': 'En proceso',
            '1-25': '1-25',
            '26-50': '26-50',
            '51-100': '51-100',
            '101-200': '101-200',
            '200+': 'Más de 200',
            'manual': 'Gestión manual/Excel',
            'basico': 'Sistema básico personalizado',
            'erp_sindical': 'ERP sindical específico',
            'erp_general': 'ERP general adaptado',
            'ninguno': 'No utilizan sistema',
            '1-5': '1-5 usuarios',
            '6-10': '6-10 usuarios',
            '11-25': '11-25 usuarios',
            '25+': 'Más de 25 usuarios',
            'es': 'Español',
            'ca': 'Catalán',
            'eu': 'Euskera',
            'gl': 'Gallego'
        };
        return options[value] || value;
    }

    /**
     * Formatea valores de radio
     * @param {string} value - Valor del radio
     * @returns {string} Valor formateado
     */
    formatRadioValue(value) {
        if (!value) return '';
        if (value === 'si') return 'Sí';
        if (value === 'no') return 'No';
        if (value === 'en_proceso') return 'En proceso';
        return value;
    }

    /**
     * Formatea los módulos seleccionados
     * @param {Array} modules - Array de módulos
     * @returns {string} Módulos formateados
     */
    formatModules(modules) {
        if (!modules || !Array.isArray(modules)) return '';
        
        const moduleNames = {
            'afiliados': 'Gestión de Afiliados',
            'citas': 'Sistema de Citas',
            'comunicados': 'Comunicados',
            'encuestas': 'Encuestas',
            'newsletter': 'Newsletter',
            'documentos': 'Documentos'
        };
        
        return modules.map(module => moduleNames[module] || module).join(', ');
    }

    /**
     * Formatea una fecha
     * @param {string} dateString - Fecha en formato YYYY-MM-DD
     * @returns {string} Fecha formateada
     */
    formatDate(dateString) {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    /**
     * Formatea el tamaño del archivo
     * @param {number} bytes - Tamaño en bytes
     * @returns {string} Tamaño formateado
     */
    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    /**
     * Guarda los datos del step actual
     * @param {number} stepNumber - Número del step
     */
    saveStepData(stepNumber) {
        const stepData = window.formValidator.getFormData();
        localStorage.setItem(`onboarding-step-${stepNumber}`, JSON.stringify(stepData));
        localStorage.setItem('onboarding-current-step', this.currentStep);
    }

    /**
     * Carga datos guardados
     */
    loadSavedData() {
        const savedStep = localStorage.getItem('onboarding-current-step');
        if (savedStep) {
            this.currentStep = parseInt(savedStep);
            this.showStep(this.currentStep);
            this.updateProgressBar();
        }

        // Cargar datos específicos si existen
        for (let i = 1; i <= this.totalSteps; i++) {
            const stepData = localStorage.getItem(`onboarding-step-${i}`);
            if (stepData) {
                this.loadStepData(JSON.parse(stepData));
            }
        }
    }

    /**
     * Carga datos de un step específico
     * @param {Object} data - Datos a cargar
     */
    loadStepData(data) {
        Object.keys(data).forEach(key => {
            const input = document.querySelector(`[name="${key}"]`);
            if (!input) return;

            if (input.type === 'checkbox') {
                if (Array.isArray(data[key])) {
                    input.checked = data[key].includes(input.value);
                }
            } else if (input.type === 'radio') {
                input.checked = input.value === data[key];
            } else {
                input.value = data[key];
            }
        });
    }

    /**
     * Envía el formulario
     */
    async submitForm() {
        if (this.isSubmitting) return;

        this.isSubmitting = true;
        const submitButton = document.querySelector('.btn-success');
        const originalText = submitButton.innerHTML;

        try {
            // Mostrar estado de carga
            submitButton.classList.add('loading');
            submitButton.disabled = true;

            // Validar último paso
            const validationResult = window.formValidator.validateCompleteStep(4);
            if (!validationResult.isValid) {
                window.formValidator.showErrors(validationResult.errors);
                this.scrollToFirstError();
                return;
            }

            // Preparar datos finales
            this.formData = window.formValidator.getFormData();
            this.formData.fecha_solicitud = new Date().toISOString();
            this.formData.id_solicitud = this.generateRequestId();

            // Simular envío (en un caso real, aquí iría la llamada al API)
            await this.simulateFormSubmission();

            // Mostrar modal de confirmación
            this.showConfirmationModal();

            // Limpiar datos guardados
            this.clearSavedData();

        } catch (error) {
            console.error('Error al enviar formulario:', error);
            alert('Error al enviar la solicitud. Por favor, inténtelo de nuevo.');
        } finally {
            // Restaurar botón
            this.isSubmitting = false;
            submitButton.classList.remove('loading');
            submitButton.disabled = false;
            submitButton.innerHTML = originalText;
        }
    }

    /**
     * Simula el envío del formulario
     * @returns {Promise} Promesa que se resuelve cuando se completa el envío
     */
    simulateFormSubmission() {
        return new Promise((resolve) => {
            // Simular delay de red
            setTimeout(() => {
                console.log('Datos del formulario:', this.formData);
                
                // Guardar en localStorage para demostración
                const submissions = JSON.parse(localStorage.getItem('onboarding-submissions') || '[]');
                submissions.push(this.formData);
                localStorage.setItem('onboarding-submissions', JSON.stringify(submissions));
                
                resolve();
            }, 2000);
        });
    }

    /**
     * Muestra el modal de confirmación
     */
    showConfirmationModal() {
        const modal = document.getElementById('confirmation-modal');
        modal.classList.add('show');
    }

    /**
     * Genera un ID único para la solicitud
     * @returns {string} ID de la solicitud
     */
    generateRequestId() {
        const timestamp = Date.now();
        const random = Math.random().toString(36).substring(2, 8);
        return `ONB-${timestamp}-${random}`.toUpperCase();
    }

    /**
     * Limpia los datos guardados
     */
    clearSavedData() {
        for (let i = 1; i <= this.totalSteps; i++) {
            localStorage.removeItem(`onboarding-step-${i}`);
        }
        localStorage.removeItem('onboarding-current-step');
    }

    /**
     * Scroll al primer error
     */
    scrollToFirstError() {
        const firstError = document.querySelector('.form-group.error');
        if (firstError) {
            firstError.scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            });
        }
    }

    /**
     * Scroll al inicio de la página
     */
    scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }
}

// Funciones globales para el HTML
window.nextStep = function() {
    if (window.onboardingHandler) {
        window.onboardingHandler.nextStep();
    }
};

window.prevStep = function() {
    if (window.onboardingHandler) {
        window.onboardingHandler.prevStep();
    }
};

window.submitForm = function() {
    if (window.onboardingHandler) {
        window.onboardingHandler.submitForm();
    }
};

window.closeModal = function() {
    const modal = document.getElementById('confirmation-modal');
    modal.classList.remove('show');
};

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    window.onboardingHandler = new OnboardingFormHandler();
});