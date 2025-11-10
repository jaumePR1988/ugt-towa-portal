/**
 * Timeline de Implementación del Sistema
 * Muestra el proceso completo de implementación con hitos y fechas estimadas
 */

class ImplementationTimeline {
    constructor() {
        this.timelineData = this.getTimelineData();
        this.currentPhase = 0;
        this.isAnimating = false;
        this.init();
    }

    /**
     * Inicializa el timeline
     */
    init() {
        this.createTimeline();
        this.bindEvents();
        this.startAnimation();
    }

    /**
     * Obtiene los datos del timeline de implementación
     * @returns {Array} Datos del timeline
     */
    getTimelineData() {
        return [
            {
                id: 1,
                title: "Análisis de Requerimientos",
                duration: "2-3 días",
                description: "Revisión detallada de la solicitud y validación de datos",
                status: "upcoming",
                activities: [
                    "Validación de datos del cliente",
                    "Análisis de viabilidad técnica",
                    "Evaluación de recursos necesarios",
                    "Confirmación de módulos requeridos"
                ],
                deliverables: [
                    "Informe de análisis inicial",
                    "Lista de requerimientos técnicos",
                    "Validación de configuración personalizada"
                ],
                responsable: "Equipo Técnico",
                startDate: null,
                endDate: null,
                dependencies: []
            },
            {
                id: 2,
                title: "Propuesta Técnica Personalizada",
                duration: "3-4 días",
                description: "Elaboración de propuesta técnica con cronograma detallado",
                status: "upcoming",
                activities: [
                    "Diseño de arquitectura del sistema",
                    "Planificación de personalizaciones",
                    "Elaboración de cronograma de implementación",
                    "Definición de hitos y entregables"
                ],
                deliverables: [
                    "Documento de propuesta técnica",
                    "Cronograma de implementación detallado",
                    "Estimación de recursos y costos",
                    "Plan de pruebas y migración"
                ],
                responsable: "Arquitecto de Soluciones",
                startDate: null,
                endDate: null,
                dependencies: [1]
            },
            {
                id: 3,
                title: "Aprobación y Contratación",
                duration: "2-3 días",
                description: "Revisión de propuesta y formalización del contrato",
                status: "upcoming",
                activities: [
                    "Presentación de propuesta al cliente",
                    "Reunión de clarificación",
                    "Negociación de términos",
                    "Firma de contrato y inicio formal"
                ],
                deliverables: [
                    "Propuesta aprobada",
                    "Contrato firmado",
                    "Orden de trabajo emitida",
                    "Accesos temporales configurados"
                ],
                responsable: "Gerente de Proyecto",
                startDate: null,
                endDate: null,
                dependencies: [2]
            },
            {
                id: 4,
                title: "Configuración Inicial del Sistema",
                duration: "3-5 días",
                description: "Configuración base del sistema y personalización visual",
                status: "upcoming",
                activities: [
                    "Provisionamiento de infraestructura",
                    "Instalación del sistema base",
                    "Configuración de colores y branding",
                    "Setup de base de datos y estructura",
                    "Configuración de servicios básicos"
                ],
                deliverables: [
                    "Sistema base instalado y configurado",
                    "Branding personalizado aplicado",
                    "Base de datos configurada",
                    "Sistema de autenticación operativo"
                ],
                responsable: "DevOps Engineer",
                startDate: null,
                endDate: null,
                dependencies: [3]
            },
            {
                id: 5,
                title: "Desarrollo de Módulos",
                duration: "5-10 días",
                description: "Implementación de módulos específicos según requerimientos",
                status: "upcoming",
                activities: [
                    "Desarrollo del módulo de afiliados",
                    "Implementación del sistema de citas",
                    "Desarrollo de comunicados y comentarios",
                    "Implementación de encuestas y estadísticas",
                    "Desarrollo del sistema de newsletter",
                    "Implementación de gestión de documentos"
                ],
                deliverables: [
                    "Módulo de afiliados funcional",
                    "Sistema de citas operativo",
                    "Módulo de comunicados implementado",
                    "Sistema de encuestas disponible",
                    "Newsletter automatizado",
                    "Gestión de documentos operativa"
                ],
                responsable: "Equipo de Desarrollo",
                startDate: null,
                endDate: null,
                dependencies: [4]
            },
            {
                id: 6,
                title: "Integraciones y APIs",
                duration: "3-5 días",
                description: "Desarrollo de integraciones y APIs específicas",
                status: "upcoming",
                activities: [
                    "Desarrollo de APIs personalizadas",
                    "Integración con sistemas existentes (si aplica)",
                    "Configuración de webhooks y notificaciones",
                    "Desarrollo de conectores de datos",
                    "Setup de servicios de terceros"
                ],
                deliverables: [
                    "APIs personalizadas documentadas",
                    "Integraciones funcionales",
                    "Webhooks configurados",
                    "Conectores de datos operativos"
                ],
                responsable: "Desarrollador Full-Stack",
                startDate: null,
                endDate: null,
                dependencies: [5]
            },
            {
                id: 7,
                title: "Pruebas de Calidad",
                duration: "4-6 días",
                description: "Pruebas exhaustivas del sistema completo",
                status: "upcoming",
                activities: [
                    "Pruebas unitarias de cada módulo",
                    "Pruebas de integración",
                    "Pruebas de rendimiento y carga",
                    "Pruebas de seguridad",
                    "Pruebas de usabilidad",
                    "Pruebas en diferentes navegadores"
                ],
                deliverables: [
                    "Informe de pruebas unitarias",
                    "Informe de pruebas de integración",
                    "Informe de pruebas de rendimiento",
                    "Informe de seguridad",
                    "Bugs críticos resueltos"
                ],
                responsable: "QA Engineer",
                startDate: null,
                endDate: null,
                dependencies: [5, 6]
            },
            {
                id: 8,
                title: "Migración de Datos",
                duration: "2-4 días",
                description: "Migración segura de datos existentes del cliente",
                status: "upcoming",
                activities: [
                    "Análisis de datos existentes",
                    "Desarrollo de scripts de migración",
                    "Migración en entorno de pruebas",
                    "Validación de integridad de datos",
                    "Migración en producción",
                    "Verificación final"
                ],
                deliverables: [
                    "Scripts de migración documentados",
                    "Datos migrados y validados",
                    "Informe de migración",
                    "Backup de seguridad creado"
                ],
                responsable: "Data Engineer",
                startDate: null,
                endDate: null,
                dependencies: [5]
            },
            {
                id: 9,
                title: "Capacitación y Documentación",
                duration: "3-4 días",
                description: "Capacitación del equipo y creación de documentación",
                status: "upcoming",
                activities: [
                    "Creación de documentación de usuario",
                    "Desarrollo de manuales técnicos",
                    "Grabación de tutoriales en video",
                    "Capacitación online del equipo",
                    "Sesiones de preguntas y respuestas",
                    "Entrega de credenciales y accesos"
                ],
                deliverables: [
                    "Manual de usuario completo",
                    "Documentación técnica",
                    "Videos tutoriales",
                    "Equipo capacitado certificado",
                    "Accesos y credenciales entregadas"
                ],
                responsable: "Team Lead / Trainer",
                startDate: null,
                endDate: null,
                dependencies: [7, 8]
            },
            {
                id: 10,
                title: "Go-Live y Soporte Inicial",
                duration: "1-2 días",
                description: "Lanzamiento oficial y soporte intensivo inicial",
                status: "upcoming",
                activities: [
                    "Lanzamiento oficial del sistema",
                    "Monitoreo intensivo de primeros días",
                    "Soporte técnico continuo",
                    "Resolución de incidencias menores",
                    "Ajuste de configuraciones",
                    "Validación de funcionalidades en vivo"
                ],
                deliverables: [
                    "Sistema en producción operativo",
                    "Plan de soporte definido",
                    "Contactos de soporte establecidos",
                    "Sistema completamente funcional"
                ],
                responsable: "Soporte Técnico",
                startDate: null,
                endDate: null,
                dependencies: [7, 8, 9]
            }
        ];
    }

    /**
     * Crea el HTML del timeline
     */
    createTimeline() {
        const timelineContainer = document.createElement('div');
        timelineContainer.className = 'implementation-timeline';
        timelineContainer.innerHTML = this.generateTimelineHTML();
        
        // Buscar contenedor del timeline en el HTML
        const existingTimeline = document.querySelector('.timeline-container');
        if (existingTimeline) {
            existingTimeline.appendChild(timelineContainer);
        } else {
            // Si no existe, agregarlo al final del formulario
            document.querySelector('.form-container').appendChild(timelineContainer);
        }
    }

    /**
     * Genera el HTML del timeline
     * @returns {string} HTML del timeline
     */
    generateTimelineHTML() {
        return `
            <div class="timeline-header">
                <h3><i class="fas fa-calendar-alt"></i> Timeline de Implementación</h3>
                <p>Proceso completo de implementación del sistema UGT TOWA</p>
                <div class="timeline-legend">
                    <span class="legend-item">
                        <span class="status-dot completed"></span>
                        Completado
                    </span>
                    <span class="legend-item">
                        <span class="status-dot current"></span>
                        En progreso
                    </span>
                    <span class="legend-item">
                        <span class="status-dot upcoming"></span>
                        Pendiente
                    </span>
                </div>
            </div>
            <div class="timeline-content">
                ${this.timelineData.map(phase => this.generatePhaseHTML(phase)).join('')}
            </div>
            <div class="timeline-summary">
                <h4><i class="fas fa-clock"></i> Resumen del Cronograma</h4>
                <div class="summary-stats">
                    <div class="stat-item">
                        <span class="stat-value">${this.timelineData.length}</span>
                        <span class="stat-label">Fases</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-value">25-45</span>
                        <span class="stat-label">Días hábiles</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-value">${this.timelineData.reduce((acc, phase) => acc + this.parseDuration(phase.duration), 0)}</span>
                        <span class="stat-label">Duración total estimada</span>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Genera el HTML de una fase
     * @param {Object} phase - Datos de la fase
     * @returns {string} HTML de la fase
     */
    generatePhaseHTML(phase) {
        return `
            <div class="timeline-phase" data-phase-id="${phase.id}">
                <div class="phase-header">
                    <div class="phase-number">${phase.id}</div>
                    <div class="phase-info">
                        <h4 class="phase-title">${phase.title}</h4>
                        <p class="phase-description">${phase.description}</p>
                        <div class="phase-meta">
                            <span class="duration">
                                <i class="fas fa-clock"></i>
                                ${phase.duration}
                            </span>
                            <span class="responsable">
                                <i class="fas fa-user"></i>
                                ${phase.responsable}
                            </span>
                        </div>
                    </div>
                    <div class="phase-status">
                        <span class="status-indicator ${phase.status}">
                            <i class="fas fa-${this.getStatusIcon(phase.status)}"></i>
                        </span>
                    </div>
                </div>
                
                <div class="phase-content" id="phase-content-${phase.id}">
                    <div class="phase-activities">
                        <h5><i class="fas fa-tasks"></i> Actividades Principales</h5>
                        <ul class="activities-list">
                            ${phase.activities.map(activity => `<li>${activity}</li>`).join('')}
                        </ul>
                    </div>
                    
                    <div class="phase-deliverables">
                        <h5><i class="fas fa-file-alt"></i> Entregables</h5>
                        <ul class="deliverables-list">
                            ${phase.deliverables.map(deliverable => `<li>${deliverable}</li>`).join('')}
                        </ul>
                    </div>
                </div>
                
                <div class="phase-actions">
                    <button class="toggle-details" onclick="window.implementationTimeline.togglePhaseDetails(${phase.id})">
                        <i class="fas fa-chevron-down"></i>
                        <span>Ver detalles</span>
                    </button>
                </div>
            </div>
        `;
    }

    /**
     * Vincula los eventos
     */
    bindEvents() {
        // Eventos de teclado para navegación
        document.addEventListener('keydown', (e) => {
            if (e.target.closest('.implementation-timeline')) {
                if (e.key === 'ArrowDown') {
                    e.preventDefault();
                    this.nextPhase();
                } else if (e.key === 'ArrowUp') {
                    e.preventDefault();
                    this.prevPhase();
                }
            }
        });

        // Auto-actualización del timeline (simulación de progreso)
        setInterval(() => {
            this.updateProgressSimulation();
        }, 30000); // Cada 30 segundos
    }

    /**
     * Inicia la animación del timeline
     */
    startAnimation() {
        this.animatePhases();
    }

    /**
     * Anima la entrada de las fases
     */
    animatePhases() {
        const phases = document.querySelectorAll('.timeline-phase');
        phases.forEach((phase, index) => {
            setTimeout(() => {
                phase.style.opacity = '0';
                phase.style.transform = 'translateY(20px)';
                phase.style.transition = 'all 0.5s ease';
                
                setTimeout(() => {
                    phase.style.opacity = '1';
                    phase.style.transform = 'translateY(0)';
                }, 100);
            }, index * 100);
        });
    }

    /**
     * Alterna los detalles de una fase
     * @param {number} phaseId - ID de la fase
     */
    togglePhaseDetails(phaseId) {
        const phaseContent = document.getElementById(`phase-content-${phaseId}`);
        const toggleButton = phaseContent.parentElement.querySelector('.toggle-details');
        const icon = toggleButton.querySelector('i');
        const text = toggleButton.querySelector('span');

        if (phaseContent.style.display === 'none' || !phaseContent.style.display) {
            phaseContent.style.display = 'block';
            phaseContent.style.maxHeight = '0';
            phaseContent.style.overflow = 'hidden';
            phaseContent.style.transition = 'max-height 0.3s ease';
            
            setTimeout(() => {
                phaseContent.style.maxHeight = phaseContent.scrollHeight + 'px';
            }, 10);

            icon.className = 'fas fa-chevron-up';
            text.textContent = 'Ocultar detalles';
        } else {
            phaseContent.style.maxHeight = '0';
            setTimeout(() => {
                phaseContent.style.display = 'none';
            }, 300);

            icon.className = 'fas fa-chevron-down';
            text.textContent = 'Ver detalles';
        }
    }

    /**
     * Actualiza la simulación de progreso
     */
    updateProgressSimulation() {
        // Simular progreso automático
        if (this.currentPhase < this.timelineData.length) {
            this.currentPhase++;
            this.updatePhaseStatus(this.currentPhase - 1, 'current');
            
            if (this.currentPhase > 1) {
                this.updatePhaseStatus(this.currentPhase - 2, 'completed');
            }
        }
    }

    /**
     * Actualiza el estado de una fase
     * @param {number} phaseIndex - Índice de la fase
     * @param {string} status - Nuevo estado
     */
    updatePhaseStatus(phaseIndex, status) {
        if (phaseIndex < 0 || phaseIndex >= this.timelineData.length) return;

        const phase = this.timelineData[phaseIndex];
        phase.status = status;

        const phaseElement = document.querySelector(`[data-phase-id="${phase.id}"]`);
        if (phaseElement) {
            const statusIndicator = phaseElement.querySelector('.status-indicator');
            statusIndicator.className = `status-indicator ${status}`;
            statusIndicator.innerHTML = `<i class="fas fa-${this.getStatusIcon(status)}"></i>`;
        }
    }

    /**
     * Obtiene el icono según el estado
     * @param {string} status - Estado de la fase
     * @returns {string} Nombre del icono
     */
    getStatusIcon(status) {
        const icons = {
            'completed': 'check-circle',
            'current': 'play-circle',
            'upcoming': 'clock'
        };
        return icons[status] || 'clock';
    }

    /**
     * Parsea la duración en días
     * @param {string} duration - Duración en formato "X-Y días"
     * @returns {number} Número de días
     */
    parseDuration(duration) {
        const match = duration.match(/(\d+)-(\d+)/);
        if (match) {
            return Math.round((parseInt(match[1]) + parseInt(match[2])) / 2);
        }
        return 1;
    }

    /**
     * Avanza a la siguiente fase
     */
    nextPhase() {
        if (this.currentPhase < this.timelineData.length - 1) {
            this.currentPhase++;
            this.updateCurrentPhase();
        }
    }

    /**
     * Retrocede a la fase anterior
     */
    prevPhase() {
        if (this.currentPhase > 0) {
            this.currentPhase--;
            this.updateCurrentPhase();
        }
    }

    /**
     * Actualiza la fase actual
     */
    updateCurrentPhase() {
        // Resetear todos los estados
        this.timelineData.forEach((phase, index) => {
            if (index < this.currentPhase) {
                phase.status = 'completed';
            } else if (index === this.currentPhase) {
                phase.status = 'current';
            } else {
                phase.status = 'upcoming';
            }
        });

        // Actualizar la interfaz
        this.timelineData.forEach(phase => {
            const phaseElement = document.querySelector(`[data-phase-id="${phase.id}"]`);
            if (phaseElement) {
                const statusIndicator = phaseElement.querySelector('.status-indicator');
                statusIndicator.className = `status-indicator ${phase.status}`;
                statusIndicator.innerHTML = `<i class="fas fa-${this.getStatusIcon(phase.status)}"></i>`;
            }
        });
    }

    /**
     * Obtiene el progreso actual del proyecto
     * @returns {number} Porcentaje de progreso
     */
    getProgress() {
        const completedPhases = this.timelineData.filter(phase => phase.status === 'completed').length;
        return Math.round((completedPhases / this.timelineData.length) * 100);
    }

    /**
     * Exporta el timeline como PDF o imagen
     */
    exportTimeline() {
        // Funcionalidad para exportar (requeriría librería como html2pdf)
        const element = document.querySelector('.implementation-timeline');
        if (element) {
            // Aquí iría la lógica de exportación
            console.log('Exportando timeline...');
        }
    }

    /**
     * Genera un reporte del timeline
     * @returns {Object} Datos del timeline para reporte
     */
    generateReport() {
        return {
            totalPhases: this.timelineData.length,
            completedPhases: this.timelineData.filter(phase => phase.status === 'completed').length,
            currentPhase: this.timelineData.find(phase => phase.status === 'current')?.title || 'N/A',
            progress: this.getProgress(),
            phases: this.timelineData.map(phase => ({
                id: phase.id,
                title: phase.title,
                status: phase.status,
                duration: phase.duration,
                responsable: phase.responsable
            }))
        };
    }
}

// Funciones globales para el HTML
window.implementationTimeline = {
    togglePhaseDetails: function(phaseId) {
        if (window.timelineInstance) {
            window.timelineInstance.togglePhaseDetails(phaseId);
        }
    }
};

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    // Crear el timeline después de que el formulario esté completamente cargado
    setTimeout(() => {
        window.timelineInstance = new ImplementationTimeline();
    }, 1000);
});