# Casos de Uso - Portal Sindical

## Descripción General

Este documento presenta casos de uso detallados del Portal Sindical, organizados por sector y tipo de organización. Cada caso de uso incluye la configuración específica, funcionalidades requeridas y ejemplos de implementación.

## Casos de Uso por Sector

### Sector Industrial

#### Caso de Uso 1: Empresa Química Grande
**Empresa:** Química Industrial Barcelona S.A.  
**Empleados:** 850  
**Centros:** 3 plantas de producción  
**Representación:** 12 delegados  

##### Configuración Específica
\`\`\`javascript
const casoQuimica = {
  empresa: "Química Industrial Barcelona S.A.",
  sector: "industrial",
  escala: "grande",
  configuracion: {
    tiposCitas: [
      {
        id: "seguridad_quirica",
        nombre: "Seguridad Química",
        descripcion: "Consultas sobre seguridad en procesos químicos",
        icon: "FlaskConical",
        duracion: 60,
        color: "#dc2626",
        requiereDelegado: true,
        especialistas: ["responsable_seguridad", "delegado_tecnico"],
        departamentos: ["Producción", "Mantenimiento", "I+D"]
      },
      {
        id: "medio_ambiente",
        nombre: "Medio Ambiente",
        descripcion: "Asuntos ambientales y sostenibilidad",
        icon: "Leaf",
        duracion: 45,
        color: "#059669",
        requiereDelegado: true,
        especialistas: ["responsable_ambiental"]
      },
      {
        id: "convenio_colectivo",
        nombre: "Convenio Colectivo",
        descripcion: "Interpretación y aplicación del convenio",
        icon: "FileText",
        duracion: 45,
        color: "#1e40af",
        requiereDelegado: true
      }
    ],
    horariosTrabajo: {
      // Horarios especiales para industria química
      lunes: { inicio: "06:00", fin: "22:00", activo: true },
      martes: { inicio: "06:00", fin: "22:00", activo: true },
      miercoles: { inicio: "06:00", fin: "22:00", activo: true },
      jueves: { inicio: "06:00", fin: "22:00", activo: true },
      viernes: { inicio: "06:00", fin: "22:00", activo: true },
      sabado: { inicio: "08:00", fin: "14:00", activo: false },
      domingo: { inicio: "00:00", fin: "23:59", activo: false }
    },
    categoriasComunicados: [
      "Seguridad Química",
      "Medio Ambiente",
      "Convenio Colectivo",
      "Formación Especializada",
      "Prevención de Riesgos"
    ],
    funcionalidadesAdicionales: {
      alertas_automaticas: true,
      integracion_sensores: true,
      gestion_turnos: true,
      formacion_certificada: true,
      reporting_regulatorio: true
    }
  }
};
\`\`\`

##### Workflow de Seguridad
1. **Detección Automática:** Sensores detectan anomalías
2. **Alerta Inmediata:** Sistema genera alerta automática
3. **Notificación:** Notificación push a todos los empleados
4. **Evaluación:** Responsable de seguridad evalúa
5. **Comunicado:** Se genera comunicado oficial
6. **Seguimiento:** Tracking de acciones correctivas

##### Métricas Clave
- Tiempo respuesta emergencias: <5 minutos
- Cumplimiento normativas: 100%
- Formación certificada: 95%
- Incidentes recurrentes: <2/mes

---

#### Caso de Uso 2: Constructora Mediana
**Empresa:** Construcciones del Mediterráneo S.L.  
**Empleados:** 180  
**Centros:** 1 oficina + obras móviles  
**Representación:** 3 delegados  

##### Configuración Específica
\`\`\`javascript
const casoConstruccion = {
  empresa: "Construcciones del Mediterráneo S.L.",
  sector: "industrial",
  escala: "mediana",
  configuracion: {
    tiposCitas: [
      {
        id: "obra_consulta",
        nombre: "Consulta en Obra",
        descripcion: "Consultas que requieren presencia en obra",
        icon: "HardHat",
        duracion: 90,
        color: "#dc2626",
        requiereDelegado: true,
        ubicacion: "obra_especifica"
      },
      {
        id: "seguridad_obra",
        nombre: "Seguridad en Obra",
        descripcion: "Seguridad específica de construcción",
        icon: "ShieldAlert",
        duracion: 60,
        color: "#dc2626",
        requiereDelegado: true
      },
      {
        id: "formacion_obra",
        nombre: "Formación en Obra",
        descripcion: "Cursos de seguridad in-situ",
        icon: "GraduationCap",
        duracion: 120,
        color: "#059669",
        requiereDelegado: true
      }
    ],
    gestionObras: {
      enabled: true,
      obras_activas: [
        {
          id: "obra_madrid_01",
          nombre: "Edificio Residencial Centro",
          ubicacion: "Calle Mayor 45, Madrid",
          fecha_inicio: "2025-01-15",
          fecha_fin_estimada: "2025-08-15",
          empleados: 25,
          responsable_seguridad: "Juan Pérez"
        }
      ],
      movilidad: {
        enabled: true,
        vehiculos_disponibles: 2,
        zonas_cobertura: ["Madrid", "Toledo", "Guadalajara"]
      }
    }
  }
};
\`\`\`

##### Workflow de Obra
1. **Registro de Obra:** Alta en sistema con datos completos
2. **Asignación Responsable:** Designación de responsable de seguridad
3. **Plan de Seguridad:** Creación de plan específico
4. **Formación Previa:** Curso obligatorio antes de inicio
5. **Seguimiento:** Revisiones periódicas
6. **Cierre:** Evaluación final y lecciones aprendidas

---

#### Caso de Uso 3: Automoción
**Empresa:** AutoTech Manufacturing S.A.  
**Empleados:** 1200  
**Centros:** 1 planta principal + 2 almacenes  
**Representación:** 15 delegados  

##### Configuración Específica
\`\`\`javascript
const casoAutomoción = {
  empresa: "AutoTech Manufacturing S.A.",
  sector: "industrial",
  escala: "grande",
  configuracion: {
    tiposCitas: [
      {
        id: "linea_produccion",
        nombre: "Consulta Línea Producción",
        descripcion: "Asuntos relacionados con línea de producción",
        icon: "Factory",
        duracion: 45,
        color: "#1e40af",
        requiereDelegado: true,
        departamentos: ["Montaje", "Pintura", "Motor", "Chasis"]
      },
      {
        id: "robotica",
        nombre: "Asuntos de Robótica",
        descripcion: "Consultas sobre automatización y robótica",
        icon: "Bot",
        duracion: 60,
        color: "#7c3aed",
        requiereDelegado: true
      },
      {
        id: "turnos_especiales",
        nombre: "Gestión Turnos",
        descripcion: "Turnos especiales y rotativos",
        icon: "Clock",
        duracion: 30,
        color: "#059669",
        requiereDelegado: true
      }
    ],
    configuracionAvanzada: {
      lineas_produccion: [
        { id: "motor", nombre: "Línea Motor", empleados: 200, turnos: 3 },
        { id: "chasis", nombre: "Línea Chasis", empleados: 300, turnos: 3 },
        { id: "pintura", nombre: "Línea Pintura", empleados: 150, turnos: 2 },
        { id: "montaje", nombre: "Línea Montaje", empleados: 400, turnos: 3 }
      ],
      robots_industriales: {
        total: 45,
        marcas: ["KUKA", "ABB", "Fanuc"],
        mantenimiento_programado: true,
        formacion_operadores: true
      },
      turnos_especiales: {
        nocturna: { inicio: "22:00", fin: "06:00", incentivos: true },
        fin_semana: { sabado: true, domingo: false },
        rotativos: { enabled: true, periodo: "mensual" }
      }
    }
  }
};
\`\`\`

---

### Sector Servicios

#### Caso de Uso 1: Empresa de Consultoría IT
**Empresa:** TechSolutions Consulting S.L.  
**Empleados:** 95  
**Centros:** 1 oficina principal  
**Modalidad:** Híbrida (oficina + remoto)  

##### Configuración Específica
\`\`\`javascript
const casoConsultoriaIT = {
  empresa: "TechSolutions Consulting S.L.",
  sector: "servicios",
  escala: "mediana",
  modalidad: "hibrida",
  configuracion: {
    tiposCitas: [
      {
        id: "desarrollo_profesional",
        nombre: "Desarrollo Profesional",
        descripcion: "Carrera y crecimiento profesional",
        icon: "TrendingUp",
        duracion: 60,
        color: "#1e40af",
        requiereDelegado: true,
        modalidades: ["presencial", "remoto", "video"]
      },
      {
        id: "formacion_tecnica",
        nombre: "Formación Técnica",
        descripcion: "Cursos de tecnologías actuales",
        icon: "Code",
        duracion: 90,
        color: "#059669",
        requiereDelegado: true,
        tecnologias: ["React", "Python", "AWS", "DevOps"]
      },
      {
        id: "equilibrio_vida",
        nombre: "Equilibrio Vida-Trabajo",
        descripcion: "Flexibilidad y bienestar",
        icon: "Heart",
        duracion: 45,
        color: "#dc2626",
        requiereDelegado: false,
        temas: ["horarios", "teletrabajo", "bienestar"]
      }
    ],
    modalidadTrabajo: {
      presencial: {
        dias: ["lunes", "martes", "jueves"],
        horas: "09:00-18:00"
      },
      remoto: {
        dias: ["miercoles", "viernes"],
        herramientas: ["Slack", "Zoom", "Jira"]
      },
      flexibility: {
        horas_flexibles: true,
        dias_remotos: 2,
        semanas_remotas: true
      }
    },
    funcionalidades: {
      gestion_proyectos: true,
      tracking_tiempo: true,
      formacion_continua: true,
      certificaciones: true,
      team_building: true
    }
  }
};
\`\`\`

##### Workflow de Desarrollo Profesional
1. **Evaluación Inicial:** Assessment de skills actuales
2. **Plan de Carrera:** Definición de objetivos
3. **Formación:** Cursos y certificaciones
4. **Mentoring:** Asignación de mentor
5. **Proyectos:** Experiencia práctica
6. **Review:** Evaluación de progreso
7. **Promoción:** Oportunidades de crecimiento

---

#### Caso de Uso 2: Hospital y Servicios Sanitarios
**Empresa:** Hospital San Juan Bautista  
**Empleados:** 450  
**Centros:** 1 hospital + 2 centros de salud  
**Turnos:** 24/7  

##### Configuración Específica
\`\`\`javascript
const casoHospital = {
  empresa: "Hospital San Juan Bautista",
  sector: "servicios",
  escala: "grande",
  tipo: "sanitario",
  configuracion: {
    tiposCitas: [
      {
        id: "condiciones_laborales",
        nombre: "Condiciones Laborales",
        descripcion: "Asuntos de personal sanitario",
        icon: "Stethoscope",
        duracion: 45,
        color: "#1e40af",
        requiereDelegado: true,
        departamentos: ["Medicina", "Cirugía", "Urgencias", "Enfermería"]
      },
      {
        id: "prevencion_riesgos",
        nombre: "Prevención Riesgos Sanitarios",
        descripcion: "Seguridad en entorno sanitario",
        icon: "Shield",
        duracion: 60,
        color: "#dc2626",
        requiereDelegado: true,
        areas: ["biológico", "químico", "físico", "psicosocial"]
      },
      {
        id: "formacion_medica",
        nombre: "Formación Médica Continua",
        descripcion: "Educación médica continua",
        icon: "GraduationCap",
        duracion: 120,
        color: "#059669",
        requiereDelegado: true,
        acreditaciones: ["CME", "CFC"]
      }
    ],
    configuracionSanitaria: {
      turnos: {
        mañana: { inicio: "07:00", fin: "15:00" },
        tarde: { inicio: "15:00", fin: "23:00" },
        noche: { inicio: "23:00", fin: "07:00" }
      },
      servicios: [
        { id: "urgencias", nombre: "Urgencias", personal: 45 },
        { id: "uci", nombre: "UCI", personal: 30 },
        { id: "quirófanos", nombre: "Quirófanos", personal: 60 },
        { id: "plantas", nombre: "Plantas", personal: 200 }
      ],
      protocolos: {
        bioseguridad: true,
        ergonomia: true,
        turnos_rotativos: true,
        descanso_minimo: true
      }
    }
  }
};
\`\`\`

##### Workflow de Prevención
1. **Evaluación de Riesgos:** Identificación de riesgos específicos
2. **Protocolos Específicos:** Desarrollo de protocolos sanitarios
3. **Formación Especializada:** Capacitación en bioseguridad
4. **EPP Específico:** Equipamiento de protección personal
5. **Monitoreo Continuo:** Seguimiento de indicadores
6. **Auditorías:** Revisiones periódicas
7. **Actualización:** Mejora continua de protocolos

---

#### Caso de Uso 3: Centro Educativo
**Empresa:** Instituto Tecnológico Superior  
**Empleados:** 120  
**Centros:** 1 campus principal  
**Comunidad:** Estudiantes + Personal + Docentes  

##### Configuración Específica
\`\`\`javascript
const casoInstituto = {
  empresa: "Instituto Tecnológico Superior",
  sector: "servicios",
  escala: "mediana",
  tipo: "educativo",
  configuracion: {
    tiposCitas: [
      {
        id: "condiciones_docentes",
        nombre: "Condiciones Docentes",
        descripcion: "Asuntos del personal docente",
        icon: "BookOpen",
        duracion: 60,
        color: "#1e40af",
        requiereDelegado: true,
        categorias: ["Catedraticos", "Asociados", "Ayudantes"]
      },
      {
        id: "formacion_estudiantes",
        nombre: "Representación Estudiantil",
        descripcion: "Voz de los estudiantes",
        icon: "Users",
        duracion: 45,
        color: "#059669",
        requiereDelegado: true,
        representantes: ["estudiantes", "pades", "doctores"]
      },
      {
        id: "investigacion",
        nombre: "Investigación y Docencia",
        descripcion: "Proyectos de investigación",
        icon: "Microscope",
        duracion: 90,
        color: "#7c3aed",
        requiereDelegado: true,
        areas: ["IA", "Biomedicina", "Ingeniería", "Humanidades"]
      }
    ],
    configuracionEducativa: {
      comunidad: {
        estudiantes: 2500,
        docentes: 120,
        personal_administrativo: 80,
        pades: 15
      },
      calendario_academico: {
        inicio_curso: "2025-09-15",
        fin_curso: "2026-06-30",
        examenes_parciales: ["2025-11-15", "2026-02-15", "2026-05-15"],
        vacaciones: ["2025-12-22", "2026-04-10"]
      },
      areas_investigacion: [
        "Inteligencia Artificial",
        "Biotecnología",
        "Energías Renovables",
        "Ciencias Sociales"
      ]
    }
  }
};
\`\`\`

---

### Sector Público

#### Caso de Uso 1: Ayuntamiento
**Empresa:** Ayuntamiento de Valencia  
**Empleados:** 1200  
**Centros:** 15 oficinas municipales  
**Servicios:** 25 departamentos  

##### Configuración Específica
\`\`\`javascript
const casoAyuntamiento = {
  empresa: "Ayuntamiento de Valencia",
  sector: "publico",
  escala: "muy_grande",
  nivel: "local",
  configuracion: {
    tiposCitas: [
      {
        id: "servicios_sociales",
        nombre: "Servicios Sociales",
        descripcion: "Asuntos de servicios sociales municipales",
        icon: "Heart",
        duracion: 60,
        color: "#1e40af",
        requiereDelegado: true,
        departamentos: ["Servicios Sociales", "Juventud", "Mayores", "Diversidad"]
      },
      {
        id: "seguridad_ciudadana",
        nombre: "Seguridad Ciudadana",
        descripcion: "Policía Local y seguridad",
        icon: "Shield",
        duracion: 45,
        color: "#dc2626",
        requiereDelegado: true,
        areas: ["Policía Local", "Protección Civil", "Tráfico", "Emergencias"]
      },
      {
        id: "urbanismo",
        nombre: "Urbanismo y Obras",
        descripcion: "Asuntos de urbanismo y obras públicas",
        icon: "Building",
        duracion: 90,
        color: "#059669",
        requiereDelegado: true
      }
    ],
    configuracionPublica: {
      servicios: [
        { id: "sociales", personal: 150, descripcion: "Servicios Sociales" },
        { id: "seguridad", personal: 300, descripcion: "Policía Local" },
        { id: "urbanismo", personal: 80, descripcion: "Urbanismo" },
        { id: "cultura", personal: 120, descripcion: "Cultura" },
        { id: "deportes", personal: 60, descripcion: "Deportes" }
      ],
      oficinas: [
        { id: "principal", direccion: "Plaza del Ayuntamiento 1", personal: 200 },
        { id: "sur", direccion: "Calle Malasana 15", personal: 80 },
        { id: "norte", direccion: "Avenida del Puerto 45", personal: 60 }
      ],
      normativas: {
        transparencia: true,
        acceso_informacion: true,
        participacion_ciudadana: true,
        gobierno_abierto: true
      }
    }
  }
};
\`\`\`

##### Workflow de Servicios Sociales
1. **Solicitud Ciudadana:** Petición de servicios
2. **Valoración Social:** Evaluación de necesidades
3. **Plan de Intervención:** Diseño de ayuda
4. **Asignación Recursos:** Distribución de recursos
5. **Seguimiento:** Monitoreo de la ayuda
6. **Evaluación:** Análisis de resultados
7. **Mejora Continua:** Optimización del servicio

---

#### Caso de Uso 2: Universidad Pública
**Empresa:** Universidad de Barcelona  
**Empleados:** 2800  
**Centros:** 15 campus  
**Comunidad:** 45000 estudiantes  

##### Configuración Específica
\`\`\`javascript
const casoUniversidad = {
  empresa: "Universidad de Barcelona",
  sector: "publico",
  escala: "muy_grande",
  tipo: "educativo_superior",
  configuracion: {
    tiposCitas: [
      {
        id: "condiciones_academicas",
        nombre: "Condiciones Académicas",
        descripcion: "Asuntos del personal académico",
        icon: "GraduationCap",
        duracion: 60,
        color: "#1e40af",
        requiereDelegado: true,
        categorias: ["Catedraticos", "Titulares", "Asociados", "Ayudantes"]
      },
      {
        id: "representacion_estudiantil",
        nombre: "Representación Estudiantil",
        descripcion: "Voz de los estudiantes en el Claustro",
        icon: "Users",
        duracion: 45,
        color: "#059669",
        requiereDelegado: true,
        organos: ["Claustro", "Consejo de Gobierno", "Junta de Facultad"]
      },
      {
        id: "investigacion_docencia",
        nombre: "Investigación y Docencia",
        descripcion: "Asuntos de investigación y calidad docente",
        icon: "Microscope",
        duracion: 90,
        color: "#7c3aed",
        requiereDelegado: true,
        areas: ["Medicina", "Ciencias", "Humanidades", "Ingeniería"]
      }
    ],
    configuracionUniversitaria: {
      comunidad: {
        estudiantes: 45000,
        doctorandos: 3500,
        personal_academico: 2800,
        personal_administrativo: 1200,
        personal_servicios: 800
      },
      campus: [
        { id: "principal", direccion: "Baldiri Reixac 2", facultades: 8 },
        { id: "ciencias", direccion: "Diagonal 647", facultades: 3 },
        { id: "medicina", direccion: "Casanova 143", facultades: 2 }
      ],
      organos_gobierno: [
        "Claustro",
        "Consejo de Gobierno",
        "Juntas de Facultad",
        "Consejo Social"
      ],
      areas_investigacion: [
        "Medicina y Ciencias de la Vida",
        "Ciencias Experimentales",
        "Ingeniería y Arquitectura",
        "Humanidades",
        "Ciencias Sociales y Jurídicas",
        "Ciencias de la Educación",
        "Economía y Empresa"
      ]
    }
  }
};
\`\`\`

---

## Casos de Uso Especiales

### Empresa Familiar en Crecimiento
\`\`\`javascript
const casoEmpresaFamiliar = {
  empresa: "Transportes Familiares García S.L.",
  sector: "industrial",
  escala: "pequeña",
  crecimiento: "acelerado",
  configuracion: {
    tiposCitas: [
      {
        id: "crecimiento",
        nombre: "Plan de Crecimiento",
        descripcion: "Estrategia de crecimiento empresarial",
        icon: "TrendingUp",
        duracion: 90,
        color: "#1e40af",
        requiereDelegado: true
      },
      {
        id: "cultura_empresarial",
        nombre: "Cultura Empresarial",
        descripcion: "Valores y cultura de la empresa familiar",
        icon: "Heart",
        duracion: 60,
        color: "#059669",
        requiereDelegado: true
      }
    ],
    transicion: {
      generacion: 2,
      sucesion_planificada: true,
      valores_familiares: true,
      profesionalizacion: true
    }
  }
};
\`\`\`

### Cooperativa de Trabajo
\`\`\`javascript
const casoCooperativa = {
  empresa: "Cooperativa de Energías Renovables",
  sector: "industrial",
  tipo: "cooperativa",
  configuracion: {
    tiposCitas: [
      {
        id: "asamblea_socios",
        nombre: "Asamblea de Socios",
        descripcion: "Decisiones democráticas de la cooperativa",
        icon: "Users",
        duracion: 120,
        color: "#059669",
        requiereDelegado: true
      },
      {
        id: "distribucion_beneficios",
        nombre: "Distribución de Beneficios",
        descripcion: "Reparto equitativo según participación",
        icon: "DollarSign",
        duracion: 60,
        color: "#1e40af",
        requiereDelegado: true
      }
    ],
    funcionamiento_cooperativo: {
      democracia: true,
      participacion: true,
      distribucion_equitativa: true,
      sostenibilidad: true
    }
  }
};
\`\`\`

### ONG Sindical
\`\`\`javascript
const casoONGSindical = {
  empresa: "Federación de Trabajadores Autónomos",
  sector: "servicios",
  tipo: "ong",
  configuracion: {
    tiposCitas: [
      {
        id: "autonomos",
        nombre: "Asuntos de Autónomos",
        descripcion: "Consultas específicas de trabajadores autónomos",
        icon: "User",
        duracion: 45,
        color: "#1e40af",
        requiereDelegado: true
      },
      {
        id: "formacion_gratuita",
        nombre: "Formación Gratuita",
        descripcion: "Cursos gratuitos para afiliados",
        icon: "Gift",
        duracion: 90,
        color: "#059669",
        requiereDelegado: false
      }
    ],
    funcionamiento_ong: {
      afiliacion_voluntaria: true,
      formacion_gratuita: true,
      asesoramiento_gratuito: true,
      representacion_externa: true
    }
  }
};
\`\`\`

## Métricas de Éxito por Sector

### Industrial
- **Seguridad:** Reducción 50% incidentes
- **Formación:** 95% empleados certificados
- **Satisfacción:** >4.2/5 en encuestas
- **Productividad:** +15% eficiencia

### Servicios
- **Atención Cliente:** +25% satisfacción
- **Formación:** 90% cursos completados
- **Flexibilidad:** 80% employees híbridos
- **Retención:** 95% retention rate

### Público
- **Transparencia:** 100% información pública
- **Participación:** +30% participación ciudadana
- **Eficiencia:** 20% reducción tiempos trámite
- **Satisfacción:** >4.0/5 ciudadanos

## Adaptaciones Futuras

### Inteligencia Artificial
- Chatbot especializado por sector
- Análisis predictivo de problemas
- Automatización de procesos rutinarios
- Personalización inteligente

### IoT y Sensores
- Monitoreo automático de seguridad
- Alertas en tiempo real
- Optimización de recursos
- Mantenimiento predictivo

### Blockchain
- Trazabilidad de decisiones
- Votaciones transparentes
- Smart contracts para beneficios
- Verificación de certificaciones

Estos casos de uso demuestran la versatilidad y adaptabilidad del Portal Sindical para diferentes sectores y organizaciones, manteniendo siempre los principios de representación, transparencia y mejora continua.
