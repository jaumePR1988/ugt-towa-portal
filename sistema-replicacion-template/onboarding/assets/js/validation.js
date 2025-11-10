/**
 * Sistema de Validación para el Onboarding
 * Valida todos los campos del formulario según reglas específicas
 */

class FormValidator {
    constructor() {
        this.errors = {};
        this.validationRules = {
            empresa_nombre: {
                required: true,
                minLength: 2,
                maxLength: 100,
                pattern: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ0-9\s\-.,&]+$/,
                message: 'El nombre de la empresa debe tener entre 2 y 100 caracteres y solo puede contener letras, números, espacios, guiones, puntos, comas y ampersand'
            },
            cif_nif: {
                required: true,
                pattern: /^[0-9]{8}[TRWAGMYFPDXBNJZSQVHLCKE]$|^[XYZ][0-9]{7}[TRWAGMYFPDXBNJZSQVHLCKE]$/i,
                message: 'El CIF/NIF introducido no es válido'
            },
            sector_actividad: {
                required: true,
                message: 'Debe seleccionar un sector de actividad'
            },
            num_empleados: {
                required: true,
                message: 'Debe seleccionar el número de empleados'
            },
            ubicacion_geografica: {
                required: true,
                message: 'Debe seleccionar la ubicación geográfica'
            },
            contacto_nombre: {
                required: true,
                minLength: 2,
                maxLength: 50,
                pattern: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/,
                message: 'El nombre debe tener entre 2 y 50 caracteres y solo puede contener letras y espacios'
            },
            contacto_cargo: {
                required: true,
                minLength: 2,
                maxLength: 50,
                pattern: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ0-9\s\-.,&]+$/,
                message: 'El cargo debe tener entre 2 y 50 caracteres'
            },
            contacto_email: {
                required: true,
                pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: 'El email introducido no es válido'
            },
            contacto_telefono: {
                required: true,
                pattern: /^[+]?[0-9\s\-()]{9,15}$/,
                message: 'El teléfono debe tener entre 9 y 15 dígitos'
            },
            fecha_prevista_implementacion: {
                required: true,
                validate: (value) => {
                    const today = new Date();
                    const inputDate = new Date(value);
                    const minDate = new Date(today.getTime() + (7 * 24 * 60 * 60 * 1000)); // Mínimo 7 días
                    return inputDate >= minDate;
                },
                message: 'La fecha de implementación debe ser al menos 7 días en el futuro'
            }
        };
    }

    /**
     * Valida un campo específico
     * @param {string} fieldName - Nombre del campo
     * @param {any} value - Valor del campo
     * @returns {Object} Resultado de la validación
     */
    validateField(fieldName, value) {
        const rule = this.validationRules[fieldName];
        if (!rule) return { isValid: true, message: '' };

        const result = {
            isValid: true,
            message: ''
        };

        // Validar campo requerido
        if (rule.required && (!value || value.toString().trim() === '')) {
            result.isValid = false;
            result.message = `El campo ${fieldName.replace(/_/g, ' ')} es obligatorio`;
            return result;
        }

        // Si el campo no es requerido y está vacío, no validar más
        if (!value || value.toString().trim() === '') {
            return result;
        }

        // Validar longitud mínima
        if (rule.minLength && value.toString().length < rule.minLength) {
            result.isValid = false;
            result.message = `El campo debe tener al menos ${rule.minLength} caracteres`;
            return result;
        }

        // Validar longitud máxima
        if (rule.maxLength && value.toString().length > rule.maxLength) {
            result.isValid = false;
            result.message = `El campo no puede tener más de ${rule.maxLength} caracteres`;
            return result;
        }

        // Validar patrón (regex)
        if (rule.pattern && !rule.pattern.test(value.toString())) {
            result.isValid = false;
            result.message = rule.message || `El formato del campo ${fieldName} no es válido`;
            return result;
        }

        // Validación personalizada
        if (rule.validate && typeof rule.validate === 'function') {
            const customResult = rule.validate(value);
            if (!customResult) {
                result.isValid = false;
                result.message = rule.message || `El campo ${fieldName} no es válido`;
                return result;
            }
        }

        return result;
    }

    /**
     * Valida todos los campos visibles
     * @returns {Object} Resultado de la validación completa
     */
    validateStep(stepNumber) {
        this.errors = {};
        let isValid = true;

        // Obtener todos los campos del step actual
        const stepElement = document.getElementById(`step-${stepNumber}`);
        if (!stepElement) return { isValid: true, errors: {} };

        const inputs = stepElement.querySelectorAll('input, select, textarea');

        inputs.forEach(input => {
            if (input.type === 'checkbox' || input.type === 'radio') {
                // Para checkboxes y radio buttons, validar solo si está marcado
                if (input.checked) {
                    const result = this.validateField(input.name, input.value);
                    if (!result.isValid) {
                        isValid = false;
                        this.errors[input.name] = result.message;
                    }
                }
            } else {
                const result = this.validateField(input.name, input.value);
                if (!result.isValid) {
                    isValid = false;
                    this.errors[input.name] = result.message;
                }
            }
        });

        return { isValid, errors: this.errors };
    }

    /**
     * Valida el step completo incluyendo checkboxes específicos
     * @param {number} stepNumber - Número del step
     * @returns {Object} Resultado de la validación
     */
    validateCompleteStep(stepNumber) {
        const basicValidation = this.validateStep(stepNumber);
        let isValid = basicValidation.isValid;
        let errors = { ...basicValidation.errors };

        // Validaciones específicas por step
        if (stepNumber === 1) {
            // Validación específica para estructura sindical
            const estructuraSindical = document.querySelector('input[name="estructura_sindical"]:checked');
            if (estructuraSindical && estructuraSindical.value === 'si') {
                const numSindicatos = document.getElementById('num_sindicatos');
                const afiliadosEstimados = document.getElementById('afiliados_estimados');
                
                if (numSindicatos && numSindicatos.value === '') {
                    isValid = false;
                    errors.num_sindicatos = 'Debe especificar el número de sindicatos';
                }
                
                if (afiliadosEstimados && afiliadosEstimados.value === '') {
                    isValid = false;
                    errors.afiliados_estimados = 'Debe especificar el número estimado de afiliados';
                }
            }
        }

        if (stepNumber === 4) {
            // Validación del step de revisión
            const aceptoTerminos = document.getElementById('acepto_terminos');
            if (aceptoTerminos && !aceptoTerminos.checked) {
                isValid = false;
                errors.acepto_terminos = 'Debe aceptar los términos y condiciones';
            }
        }

        return { isValid, errors };
    }

    /**
     * Muestra los errores en la interfaz
     * @param {Object} errors - Objeto con los errores
     */
    showErrors(errors) {
        // Limpiar errores anteriores
        document.querySelectorAll('.error-message').forEach(error => {
            error.classList.remove('show');
        });

        document.querySelectorAll('.form-group').forEach(group => {
            group.classList.remove('error', 'success');
        });

        // Mostrar nuevos errores
        Object.keys(errors).forEach(fieldName => {
            const errorElement = document.getElementById(`error-${fieldName}`);
            const formGroup = errorElement?.closest('.form-group');
            
            if (errorElement) {
                errorElement.textContent = errors[fieldName];
                errorElement.classList.add('show');
            }
            
            if (formGroup) {
                formGroup.classList.add('error');
            }
        });
    }

    /**
     * Marca los campos como válidos
     * @param {string} fieldName - Nombre del campo
     */
    markFieldAsValid(fieldName) {
        const errorElement = document.getElementById(`error-${fieldName}`);
        const formGroup = errorElement?.closest('.form-group');
        
        if (errorElement) {
            errorElement.classList.remove('show');
        }
        
        if (formGroup) {
            formGroup.classList.remove('error');
            formGroup.classList.add('success');
        }
    }

    /**
     * Limpia los estados de validación de un campo
     * @param {string} fieldName - Nombre del campo
     */
    clearFieldValidation(fieldName) {
        const errorElement = document.getElementById(`error-${fieldName}`);
        const formGroup = errorElement?.closest('.form-group');
        
        if (errorElement) {
            errorElement.classList.remove('show');
        }
        
        if (formGroup) {
            formGroup.classList.remove('error', 'success');
        }
    }

    /**
     * Valida un CIF/NIF específicamente
     * @param {string} cif - CIF/NIF a validar
     * @returns {boolean} True si es válido
     */
    validateCIF(cif) {
        const cifRegex = /^[0-9]{8}[TRWAGMYFPDXBNJZSQVHLCKE]$/i;
        const nifRegex = /^[XYZ][0-9]{7}[TRWAGMYFPDXBNJZSQVHLCKE]$/i;
        
        if (!cifRegex.test(cif) && !nifRegex.test(cif)) {
            return false;
        }

        // Algoritmo de validación del DNI
        const letters = 'TRWAGMYFPDXBNJZSQVHLCKE';
        let number;
        let letter;

        if (cif.length === 9) {
            number = cif.substring(0, 8);
            letter = cif.charAt(8).toUpperCase();
        } else {
            // NIE starts with X, Y, Z
            const nie = cif.replace('X', '0').replace('Y', '1').replace('Z', '2');
            number = nie.substring(0, 8);
            letter = nie.charAt(8).toUpperCase();
        }

        return letters.charAt(number % 23) === letter;
    }

    /**
     * Valida un email específicamente
     * @param {string} email - Email a validar
     * @returns {boolean} True si es válido
     */
    validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) return false;

        // Validaciones adicionales
        const parts = email.split('@');
        if (parts.length !== 2) return false;

        const domain = parts[1];
        if (domain.length < 3 || domain.length > 253) return false;

        // Verificar que no tenga caracteres consecutivos
        if (email.includes('..')) return false;

        return true;
    }

    /**
     * Valida un teléfono específicamente
     * @param {string} phone - Teléfono a validar
     * @returns {boolean} True si es válido
     */
    validatePhone(phone) {
        // Eliminar espacios, guiones y paréntesis para validación
        const cleanPhone = phone.replace(/[\s\-()]/g, '');
        
        // Debe tener entre 9 y 15 dígitos
        if (!/^\d{9,15}$/.test(cleanPhone)) return false;

        // Verificar formato español si empieza con 34 (código de país)
        if (cleanPhone.startsWith('34') && cleanPhone.length === 12) {
            return true;
        }

        // Formato sin código de país (9 dígitos para España)
        if (cleanPhone.length === 9) {
            return true;
        }

        return false;
    }

    /**
     * Sanitiza un valor para evitar inyección de código
     * @param {string} value - Valor a sanitizar
     * @returns {string} Valor sanitizado
     */
    sanitizeValue(value) {
        return value
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#x27;')
            .replace(/\//g, '&#x2F;');
    }

    /**
     * Obtiene datos del formulario actual
     * @returns {Object} Datos del formulario
     */
    getFormData() {
        const formData = {};
        
        // Obtener todos los inputs del formulario
        const inputs = document.querySelectorAll('input, select, textarea');
        
        inputs.forEach(input => {
            if (input.type === 'checkbox') {
                if (!formData[input.name]) {
                    formData[input.name] = [];
                }
                if (input.checked) {
                    formData[input.name].push(input.value);
                }
            } else if (input.type === 'radio') {
                if (input.checked) {
                    formData[input.name] = input.value;
                }
            } else {
                formData[input.name] = input.value;
            }
        });

        return formData;
    }
}

// Validaciones específicas para fechas
const dateValidators = {
    /**
     * Valida que la fecha no sea en el pasado
     * @param {string} dateString - Fecha en formato YYYY-MM-DD
     * @returns {boolean} True si es válida
     */
    isNotPastDate(dateString) {
        const inputDate = new Date(dateString);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        return inputDate >= today;
    },

    /**
     * Calcula la diferencia en días entre dos fechas
     * @param {string} dateString1 - Primera fecha
     * @param {string} dateString2 - Segunda fecha
     * @returns {number} Diferencia en días
     */
    getDaysDifference(dateString1, dateString2) {
        const date1 = new Date(dateString1);
        const date2 = new Date(dateString2);
        const timeDiff = date2.getTime() - date1.getTime();
        return Math.ceil(timeDiff / (1000 * 3600 * 24));
    },

    /**
     * Valida que la fecha tenga un formato correcto
     * @param {string} dateString - Fecha a validar
     * @returns {boolean} True si el formato es correcto
     */
    isValidDateFormat(dateString) {
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
        if (!dateRegex.test(dateString)) return false;
        
        const date = new Date(dateString);
        return date instanceof Date && !isNaN(date);
    }
};

// Validaciones de archivos
const fileValidators = {
    /**
     * Valida el tamaño del archivo
     * @param {File} file - Archivo a validar
     * @param {number} maxSize - Tamaño máximo en bytes
     * @returns {Object} Resultado de la validación
     */
    validateFileSize(file, maxSize = 5 * 1024 * 1024) { // 5MB por defecto
        return {
            isValid: file.size <= maxSize,
            message: `El archivo no puede superar los ${Math.round(maxSize / 1024 / 1024)}MB`
        };
    },

    /**
     * Valida el tipo de archivo
     * @param {File} file - Archivo a validar
     * @param {Array} allowedTypes - Tipos permitidos
     * @returns {Object} Resultado de la validación
     */
    validateFileType(file, allowedTypes = ['image/jpeg', 'image/png', 'image/gif']) {
        return {
            isValid: allowedTypes.includes(file.type),
            message: `Tipo de archivo no permitido. Tipos permitidos: ${allowedTypes.join(', ')}`
        };
    },

    /**
     * Valida que el archivo no esté vacío
     * @param {File} file - Archivo a validar
     * @returns {Object} Resultado de la validación
     */
    validateFileExists(file) {
        return {
            isValid: file && file.size > 0,
            message: 'Debe seleccionar un archivo'
        };
    }
};

// Instancia global del validador
window.formValidator = new FormValidator();

// Validaciones en tiempo real para campos importantes
document.addEventListener('DOMContentLoaded', function() {
    // Validar CIF/NIF en tiempo real
    const cifField = document.getElementById('cif_nif');
    if (cifField) {
        cifField.addEventListener('input', function() {
            const value = this.value.toUpperCase();
            const result = window.formValidator.validateField('cif_nif', value);
            
            if (value.length === 9) {
                if (result.isValid) {
                    window.formValidator.markFieldAsValid('cif_nif');
                } else {
                    window.formValidator.showErrors({ cif_nif: result.message });
                }
            }
        });
    }

    // Validar email en tiempo real
    const emailField = document.getElementById('contacto_email');
    if (emailField) {
        emailField.addEventListener('input', function() {
            const value = this.value;
            const result = window.formValidator.validateField('contacto_email', value);
            
            if (value.length > 5) {
                if (result.isValid) {
                    window.formValidator.markFieldAsValid('contacto_email');
                } else {
                    window.formValidator.showErrors({ contacto_email: result.message });
                }
            }
        });
    }

    // Validar teléfono en tiempo real
    const phoneField = document.getElementById('contacto_telefono');
    if (phoneField) {
        phoneField.addEventListener('input', function() {
            const value = this.value;
            const result = window.formValidator.validateField('contacto_telefono', value);
            
            if (value.length >= 9) {
                if (result.isValid) {
                    window.formValidator.markFieldAsValid('contacto_telefono');
                } else {
                    window.formValidator.showErrors({ contacto_telefono: result.message });
                }
            }
        });
    }

    // Mostrar/ocultar campos de sindicatos según la respuesta
    const radioSindical = document.querySelectorAll('input[name="estructura_sindical"]');
    const sindicatosSection = document.getElementById('sindicatos-section');
    
    radioSindical.forEach(radio => {
        radio.addEventListener('change', function() {
            if (this.value === 'si' && sindicatosSection) {
                sindicatosSection.style.display = 'grid';
            } else if (sindicatosSection) {
                sindicatosSection.style.display = 'none';
            }
        });
    });
});