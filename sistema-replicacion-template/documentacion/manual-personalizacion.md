# Manual de Personalización - Portal Sindical

## Descripción General

Este manual detalla cómo personalizar completamente el Portal Sindical según las necesidades específicas de cada empresa y sector. La personalización es modular y permite adaptar desde aspectos visuales hasta funcionalidades específicas.

## Personalización por Sectores

### Sector Industrial

#### Características Específicas
- **Enfoque en seguridad industrial**
- **Gestión de convenios colectivos**
- **Representación por turnos de trabajo**
- **Comités de empresa activos**

#### Configuración Recomendada
\`\`\`javascript
// config/industrial.js
const config = {
  sector: "industrial",
  colores: {
    primario: "#1e40af",      // Azul corporativo
    secundario: "#dc2626",    // Rojo de seguridad
    acento: "#059669"         // Verde de seguridad
  },
  tiposCitas: [
    {
      id: "sindical",
      nombre: "Representación Sindical",
      descripcion: "Consultas con delegados sindicales",
      icon: "Users",
      duracion: 60,
      color: "#1e40af",
      requiereDelegado: true
    },
    {
      id: "seguridad",
      nombre: "Seguridad Industrial",
      descripcion: "Asuntos de prevención de riesgos",
      icon: "ShieldAlert",
      duracion: 45,
      color: "#dc2626",
      requiereDelegado: true
    },
    {
      id: "convenio",
      nombre: "Convenio Colectivo",
      descripcion: "Negociación y aplicación de convenios",
      icon: "FileText",
      duracion: 30,
      color: "#059669",
      requiereDelegado: true
    },
    {
      id: "turnos",
      nombre: "Gestión de Turnos",
      descripcion: "Asuntos relacionados con turnos de trabajo",
      icon: "Clock",
      duracion: 30,
      color: "#7c3aed",
      requiereDelegado: true
    }
  ],
  horariosTrabajo: {
    lunes: { inicio: "06:00", fin: "22:00", activo: true },
    martes: { inicio: "06:00", fin: "22:00", activo: true },
    miercoles: { inicio: "06:00", fin: "22:00", activo: true },
    jueves: { inicio: "06:00", fin: "22:00", activo: true },
    viernes: { inicio: "06:00", fin: "22:00", activo: true },
    sabado: { inicio: "08:00", fin: "14:00", activo: true },
    domingo: { inicio: "08:00", fin: "14:00", activo: false }
  },
  categoriasComunicados: [
    "Seguridad Industrial",
    "Convenio Colectivo",
    "Normativa Laboral",
    "Comité de Empresa",
    "Formación"
  ],
  funcionalidadesAdicionales: {
    gestionTurnos: true,
    seguridadIndustrial: true,
    convenios: true,
    comiteEmpresa: true
  }
};
\`\`\`

#### Textos Personalizados
\`\`\`javascript
textos: {
  titulo: "Portal Sindical Industrial",
  descripcion: "Defendiendo los derechos y la seguridad de los trabajadores industriales",
  slogan: "Seguridad y representación en el trabajo industrial",
  mensajeBienvenida: "Bienvenido al portal sindical de tu empresa. Aquí encontrarás toda la información sobre seguridad industrial, convenios y representación sindical.",
  seccionCitas: {
    titulo: "Reservar Cita",
    descripcion: "Agenda una cita con nuestros delegados sindicales para cualquier consulta relacionada con tu trabajo, seguridad o convenio colectivo."
  },
  seccionComunicados: {
    titulo: "Comunicados y Seguridad",
    descripcion: "Mantente informado sobre las últimas medidas de seguridad, cambios en el convenio y comunicados del comité de empresa."
  }
}
\`\`\`

### Sector Servicios

#### Características Específicas
- **Atención al cliente prioritaria**
- **Formación continua**
- **Flexibilidad horaria**
- **Representación多元化**

#### Configuración Recomendada
\`\`\`javascript
const config = {
  sector: "servicios",
  colores: {
    primario: "#1e40af",      // Azul profesional
    secundario: "#059669",    // Verde de crecimiento
    acento: "#dc2626"         // Rojo de atención
  },
  tiposCitas: [
    {
      id: "sindical",
      nombre: "Asuntos Sindicales",
      descripcion: "Consultas generales",
      icon: "Users",
      duracion: 45,
      color: "#1e40af",
      requiereDelegado: true
    },
    {
      id: "formacion",
      nombre: "Formación y Desarrollo",
      descripcion: "Cursos y capacitación",
      icon: "GraduationCap",
      duracion: 60,
      color: "#059669",
      requiereDelegado: true
    },
    {
      id: "atencion",
      nombre: "Atención al Cliente",
      descripcion: "Consultas de atención",
      icon: "Headphones",
      duracion: 30,
      color: "#dc2626",
      requiereDelegado: false
    },
    {
      id: "flexibilidad",
      nombre: "Flexibilidad Horaria",
      descripcion: "Gestión de horarios flexibles",
      icon: "Calendar",
      duracion: 45,
      color: "#7c3aed",
      requiereDelegado: true
    }
  ],
  horariosTrabajo: {
    lunes: { inicio: "08:00", fin: "20:00", activo: true },
    martes: { inicio: "08:00", fin: "20:00", activo: true },
    miercoles: { inicio: "08:00", fin: "20:00", activo: true },
    jueves: { inicio: "08:00", fin: "20:00", activo: true },
    viernes: { inicio: "08:00", fin: "20:00", activo: true },
    sabado: { inicio: "10:00", fin: "18:00", activo: true },
    domingo: { inicio: "10:00", fin: "16:00", activo: false }
  },
  funcionalidadesAdicionales: {
    formacionContinua: true,
    atencionCliente: true,
    flexibilidadHoraria: true,
    certificaciones: true
  }
};
\`\`\`

### Sector Público

#### Características Específicas
- **Normativa específica**
- **Procesos burocráticos**
- **Transparencia obligatoria**
- **Representación institucional**

#### Configuración Recomendada
\`\`\`javascript
const config = {
  sector: "publico",
  colores: {
    primario: "#1e40af",      // Azul institucional
    secundario: "#059669",    // Verde de transparencia
    acento: "#dc2626"         // Rojo de alerta
  },
  tiposCitas: [
    {
      id: "sindical",
      nombre: "Atención Sindical",
      descripcion: "Consulta general",
      icon: "Users",
      duracion: 30,
      color: "#1e40af",
      requiereDelegado: true
    },
    {
      id: "normativa",
      nombre: "Normativa",
      descripcion: "Consultas normativas",
      icon: "BookOpen",
      duracion: 45,
      color: "#059669",
      requiereDelegado: true
    },
    {
      id: "procedimientos",
      nombre: "Procedimientos",
      descripcion: "Trámites administrativos",
      icon: "FileCheck",
      duracion: 30,
      color: "#dc2626",
      requiereDelegado: true
    }
  ],
  horariosTrabajo: {
    lunes: { inicio: "09:00", fin: "19:00", activo: true },
    martes: { inicio: "09:00", fin: "19:00", activo: true },
    miercoles: { inicio: "09:00", fin: "19:00", activo: true },
    jueves: { inicio: "09:00", fin: "19:00", activo: true },
    viernes: { inicio: "09:00", fin: "19:00", activo: true },
    sabado: { inicio: "09:00", fin: "14:00", activo: false },
    domingo: { inicio: "00:00", fin: "23:59", activo: false }
  },
  funcionalidadesAdicionales: {
    normativaEspecifica: true,
    procedimientos: true,
    transparencia: true,
    trazabilidad: true
  }
};
\`\`\`

## Personalización Visual

### Colores Corporativos

#### Configuración de Colores
\`\`\`javascript
// src/config/colores.js
const colores = {
  // Colores principales
  primario: "#1e40af",      // Color principal de la marca
  secundario: "#059669",    // Color secundario
  acento: "#dc2626",        // Color de acento/alertas
  
  // Variaciones de color
  primarioVariantes: {
    50: "#eff6ff",
    100: "#dbeafe",
    200: "#bfdbfe",
    500: "#3b82f6",
    600: "#2563eb",
    700: "#1d4ed8",
    900: "#1e3a8a"
  },
  
  // Colores semánticos
  semanticos: {
    exito: "#10b981",
    advertencia: "#f59e0b",
    error: "#ef4444",
    info: "#3b82f6"
  }
};

// Aplicar colores dinámicamente
export const aplicarColores = (config) => {
  const root = document.documentElement;
  
  // Colores principales
  root.style.setProperty('--color-primario', config.colores.primario);
  root.style.setProperty('--color-secundario', config.colores.secundario);
  root.style.setProperty('--color-acento', config.colores.acento);
  
  // Colores semánticos
  Object.entries(config.colores.semanticos).forEach(([nombre, valor]) => {
    root.style.setProperty(`--color-${nombre}`, valor);
  });
};
\`\`\`

#### Personalización de Tailwind CSS
\`\`\`javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        // Colores personalizables
        primary: {
          DEFAULT: process.env.EMPRESA_COLOR_PRIMARIO || '#1e40af',
          50: process.env.EMPRESA_COLOR_PRIMARIO_50 || '#eff6ff',
          100: process.env.EMPRESA_COLOR_PRIMARIO_100 || '#dbeafe',
          500: process.env.EMPRESA_COLOR_PRIMARIO || '#1e40af',
          600: process.env.EMPRESA_COLOR_PRIMARIO_600 || '#2563eb',
          700: process.env.EMPRESA_COLOR_PRIMARIO_700 || '#1d4ed8',
          900: process.env.EMPRESA_COLOR_PRIMARIO_900 || '#1e3a8a',
        },
        secondary: {
          DEFAULT: process.env.EMPRESA_COLOR_SECUNDARIO || '#059669',
          50: process.env.EMPRESA_COLOR_SECUNDARIO_50 || '#ecfdf5',
          100: process.env.EMPRESA_COLOR_SECUNDARIO_100 || '#d1fae5',
          500: process.env.EMPRESA_COLOR_SECUNDARIO || '#059669',
          600: process.env.EMPRESA_COLOR_SECUNDARIO_600 || '#047857',
        },
        accent: {
          DEFAULT: process.env.EMPRESA_COLOR_ACENTO || '#dc2626',
          50: process.env.EMPRESA_COLOR_ACENTO_50 || '#fef2f2',
          100: process.env.EMPRESA_COLOR_ACENTO_100 || '#fee2e2',
          500: process.env.EMPRESA_COLOR_ACENTO || '#dc2626',
          600: process.env.EMPRESA_COLOR_ACENTO_600 || '#dc2626',
        },
        // Colores del sector
        industrial: {
          safety: '#dc2626',      // Rojo de seguridad
          union: '#1e40af',       // Azul sindical
          eco: '#059669'          // Verde medio ambiente
        },
        servicios: {
          service: '#059669',     // Verde de servicio
          training: '#7c3aed',    // Púrpura de formación
          support: '#1e40af'      // Azul de soporte
        },
        publico: {
          institutional: '#1e40af', // Azul institucional
          transparent: '#059669',   // Verde transparencia
          official: '#dc2626'       // Rojo oficial
        }
      }
    }
  }
}
\`\`\`

### Tipografía Corporativa

#### Configuración de Fuentes
\`\`\`css
/* src/styles/fuentes.css */

/* Google Fonts personalizadas */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Poppins:wght@300;400;500;600;700&display=swap');

/* Variables CSS para fuentes */
:root {
  --font-heading: 'Poppins', sans-serif;
  --font-body: 'Inter', sans-serif;
  --font-corporate: 'Inter', sans-serif;
  
  /* Tamaños de fuente */
  --text-xs: 0.75rem;
  --text-sm: 0.875rem;
  --text-base: 1rem;
  --text-lg: 1.125rem;
  --text-xl: 1.25rem;
  --text-2xl: 1.5rem;
  --text-3xl: 1.875rem;
  --text-4xl: 2.25rem;
}

/* Aplicación de fuentes */
.heading {
  font-family: var(--font-heading);
  font-weight: 600;
}

.body {
  font-family: var(--font-body);
  font-weight: 400;
}

.corporate {
  font-family: var(--font-corporate);
}

/* Tamaños de fuente responsivos */
.text-responsive {
  font-size: clamp(1rem, 2.5vw, 1.5rem);
}

.heading-responsive {
  font-size: clamp(1.5rem, 5vw, 3rem);
  font-weight: 700;
  line-height: 1.2;
}
\`\`\`

#### Fuentes Específicas por Sector
\`\`\`javascript
// src/config/fuentes.js
const fuentes = {
  industrial: {
    heading: 'Poppins',      // Moderna y técnica
    body: 'Inter',           // Legible y profesional
    mono: 'JetBrains Mono'   // Para códigos técnicos
  },
  servicios: {
    heading: 'Poppins',      // Elegante y moderna
    body: 'Inter',           // Clara y accesible
    mono: 'Source Code Pro'  // Para interfaces
  },
  publico: {
    heading: 'Inter',        // Institucional y seria
    body: 'Inter',           // Legible y formal
    mono: 'IBM Plex Mono'    // Para documentación
  }
};

// Aplicar fuentes según configuración
export const aplicarFuentes = (sector) => {
  const fuentesSector = fuentes[sector] || fuentes.publico;
  const root = document.documentElement;
  
  root.style.setProperty('--font-heading', `'${fuentesSector.heading}', sans-serif`);
  root.style.setProperty('--font-body', `'${fuentesSector.body}', sans-serif`);
  root.style.setProperty('--font-mono', `'${fuentesSector.mono}', monospace`);
};
\`\`\`

### Logo y Marca

#### Configuración del Logo
\`\`\`javascript
// src/config/logo.js
const configurarLogo = (config) => {
  const logoContainer = document.querySelector('.logo-container');
  const favicon = document.querySelector('link[rel="icon"]');
  
  // Logo principal
  if (config.logo) {
    logoContainer.innerHTML = `
      <img 
        src="${config.logo}" 
        alt="${config.empresa.nombre}"
        class="logo-principal"
        loading="eager"
      />
    `;
  } else {
    // Logo por defecto con texto
    logoContainer.innerHTML = `
      <div class="logo-texto">
        <span class="logo-nombre">${config.empresa.nombre}</span>
        <span class="logo-subtitulo">Portal Sindical</span>
      </div>
    `;
  }
  
  // Favicon
  if (config.favicon) {
    favicon.href = config.favicon;
  }
  
  // Meta tags
  const metaTags = [
    { name: 'application-name', content: config.empresa.nombre },
    { name: 'apple-mobile-web-app-title', content: config.empresa.nombre },
    { property: 'og:title', content: config.textos.titulo },
    { property: 'og:description', content: config.textos.descripcion },
    { property: 'og:image', content: config.logo }
  ];
  
  metaTags.forEach(tag => {
    let meta = document.querySelector(`meta[name="${tag.name}"], meta[property="${tag.property}"]`);
    if (meta) {
      Object.keys(tag).forEach(key => {
        if (key !== 'name' && key !== 'property') {
          meta.setAttribute(key, tag[key]);
        }
      });
    } else {
      meta = document.createElement('meta');
      if (tag.name) meta.name = tag.name;
      if (tag.property) meta.setAttribute('property', tag.property);
      Object.keys(tag).forEach(key => {
        if (key !== 'name' && key !== 'property') {
          meta.setAttribute(key, tag[key]);
        }
      });
      document.head.appendChild(meta);
    }
  });
};
\`\`\`

## Personalización de Funcionalidades

### Sistema de Citas

#### Configuración de Tipos de Cita
\`\`\`javascript
// src/config/tipos-citas.js
const tiposCitasConfig = {
  industrial: [
    {
      id: "sindical",
      nombre: "Representación Sindical",
      descripcion: "Consulta con delegados sindicales sobre cualquier asunto laboral",
      icon: "Users",
      color: "#1e40af",
      duracion: 60,
      requiereDelegado: true,
      departamento: "General",
      disponibilidad: "L-V 8:00-18:00",
      camposExtra: {
        categoria: {
          tipo: "select",
          opciones: ["General", "Salario", "Condiciones laborales", "Disciplinario"],
          requerido: true
        },
        urgencia: {
          tipo: "select",
          opciones: ["Baja", "Media", "Alta", "Urgente"],
          requerido: true
        }
      }
    },
    {
      id: "seguridad",
      nombre: "Seguridad Industrial",
      descripcion: "Consultas sobre seguridad y prevención de riesgos",
      icon: "ShieldAlert",
      color: "#dc2626",
      duracion: 45,
      requiereDelegado: true,
      departamento: "Seguridad",
      disponibilidad: "L-V 6:00-22:00",
      camposExtra: {
        areaTrabajo: {
          tipo: "text",
          placeholder: "Área o puesto de trabajo",
          requerido: true
        },
        tipoRiesgo: {
          tipo: "multiselect",
          opciones: ["Mecánico", "Químico", "Eléctrico", "Ergonómico", "Otros"],
          requerido: true
        },
        incidentes: {
          tipo: "checkbox",
          opciones: ["Ha ocurrido un incidente", "Prevención", "Formación"],
          requerido: false
        }
      }
    }
  ],
  
  servicios: [
    {
      id: "sindical",
      nombre: "Asuntos Sindicales",
      descripcion: "Consultas generales del personal",
      icon: "Users",
      color: "#1e40af",
      duracion: 45,
      requiereDelegado: true,
      departamento: "Recursos Humanos",
      camposExtra: {
        categoria: {
          tipo: "select",
          opciones: ["General", "Salario", "Horarios", "Vacaciones", "Formación"],
          requerido: true
        }
      }
    },
    {
      id: "formacion",
      nombre: "Formación y Desarrollo",
      descripcion: "Cursos y capacitación",
      icon: "GraduationCap",
      color: "#059669",
      duracion: 60,
      requiereDelegado: true,
      departamento: "Formación",
      camposExtra: {
        tipoFormacion: {
          tipo: "select",
          opciones: ["Técnica", "Soft skills", "Seguridad", "Normativa", "Otro"],
          requerido: true
        },
        modalidad: {
          tipo: "select",
          opciones: ["Presencial", "Online", "Mixta"],
          requerido: true
        }
      }
    }
  ]
};
\`\`\`

#### Configuración de Horarios
\`\`\`javascript
// src/config/horarios.js
const horariosConfig = {
  industrial: {
    lunes: { inicio: "06:00", fin: "22:00", activo: true },
    martes: { inicio: "06:00", fin: "22:00", activo: true },
    miercoles: { inicio: "06:00", fin: "22:00", activo: true },
    jueves: { inicio: "06:00", fin: "22:00", activo: true },
    viernes: { inicio: "06:00", fin: "22:00", activo: true },
    sabado: { inicio: "08:00", fin: "14:00", activo: true },
    domingo: { inicio: "00:00", fin: "00:00", activo: false },
    
    // Horarios específicos por tipo de cita
    tiposEspeciales: {
      seguridad: {
        lunes: { inicio: "06:00", fin: "22:00", activo: true },
        martes: { inicio: "06:00", fin: "22:00", activo: true },
        miercoles: { inicio: "06:00", fin: "22:00", activo: true },
        jueves: { inicio: "06:00", fin: "22:00", activo: true },
        viernes: { inicio: "06:00", fin: "22:00", activo: true },
        sabado: { inicio: "00:00", fin: "00:00", activo: false },
        domingo: { inicio: "00:00", fin: "00:00", activo: false }
      }
    },
    
    // Festivos y días especiales
    diasEspeciales: {
      "2025-01-06": { activo: false, motivo: "Epifanía" },
      "2025-04-23": { activo: false, motivo: "Sant Jordi" },
      "2025-05-01": { activo: false, motivo: "Día del Trabajo" }
    }
  },
  
  servicios: {
    lunes: { inicio: "08:00", fin: "20:00", activo: true },
    martes: { inicio: "08:00", fin: "20:00", activo: true },
    miercoles: { inicio: "08:00", fin: "20:00", activo: true },
    jueves: { inicio: "08:00", fin: "20:00", activo: true },
    viernes: { inicio: "08:00", fin: "20:00", activo: true },
    sabado: { inicio: "10:00", fin: "18:00", activo: true },
    domingo: { inicio: "10:00", fin: "16:00", activo: false }
  }
};

// Función para calcular disponibilidad
const calcularDisponibilidad = (fecha, tipoCita, config) => {
  const diaSemana = ['domingo', 'lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado'][fecha.getDay()];
  const fechaStr = fecha.toISOString().split('T')[0];
  
  // Verificar si es día especial
  if (config.diasEspeciales && config.diasEspeciales[fechaStr]) {
    return {
      disponible: false,
      motivo: config.diasEspeciales[fechaStr].motivo
    };
  }
  
  // Verificar horarios generales
  const horarioGeneral = config[diaSemana];
  if (!horarioGeneral || !horarioGeneral.activo) {
    return {
      disponible: false,
      motivo: "Día no laboral"
    };
  }
  
  // Verificar horarios específicos del tipo de cita
  const tipoEspecial = config.tiposEspeciales && config.tiposEspeciales[tipoCita];
  if (tipoEspecial) {
    const horarioTipo = tipoEspecial[diaSemana];
    if (!horarioTipo || !horarioTipo.activo) {
      return {
        disponible: false,
        motivo: `Tipo de cita no disponible ${diaSemana}`
      };
    }
  }
  
  return { disponible: true };
};
\`\`\`

### Sistema de Comunicados

#### Configuración de Categorías
\`\`\`javascript
// src/config/categorias.js
const categoriasConfig = {
  industrial: [
    {
      id: "seguridad",
      nombre: "Seguridad Industrial",
      descripcion: "Medidas de seguridad y prevención de riesgos",
      color: "#dc2626",
      icon: "ShieldAlert",
      orden: 1,
      funcionalidades: {
        permiteComentarios: true,
        permiteReacciones: true,
        requiereAprobacion: true,
        notificarAutores: true
      },
      permisos: {
        ver: ["todos"],
        crear: ["admin", "delegate", "seguridad"],
        editar: ["admin", "autor"],
        eliminar: ["admin"]
      }
    },
    {
      id: "convenio",
      nombre: "Convenio Colectivo",
      descripcion: "Negociación y aplicación de convenios",
      color: "#1e40af",
      icon: "FileText",
      orden: 2,
      funcionalidades: {
        permiteComentarios: true,
        permiteReacciones: true,
        requiereAprobacion: true,
        versionado: true
      }
    },
    {
      id: "formacion",
      nombre: "Formación",
      descripcion: "Cursos y actividades formativas",
      color: "#059669",
      icon: "GraduationCap",
      orden: 3,
      funcionalidades: {
        permiteComentarios: false,
        permiteReacciones: true,
        calendarizacion: true,
        inscripciones: true
      }
    }
  ],
  
  servicios: [
    {
      id: "formacion",
      nombre: "Formación Continua",
      descripcion: "Cursos y capacitación del personal",
      color: "#059669",
      icon: "GraduationCap",
      orden: 1,
      funcionalidades: {
        permiteComentarios: true,
        inscripciones: true,
        certificados: true,
        evaluacion: true
      }
    },
    {
      id: "atencion",
      nombre: "Atención al Cliente",
      descripcion: "Mejora de la atención al cliente",
      color: "#1e40af",
      icon: "Headphones",
      orden: 2,
      funcionalidades: {
        permiteComentarios: true,
        encuestas: true,
        metricas: true
      }
    }
  ]
};
\`\`\`

#### Templates de Contenido
\`\`\`javascript
// src/config/templates.js
const templates = {
  industrial: {
    comunicado_seguridad: {
      nombre: "Comunicado de Seguridad",
      campos: [
        {
          nombre: "titulo",
          tipo: "text",
          requerido: true,
          placeholder: "Título del comunicado de seguridad"
        },
        {
          nombre: "nivel_riesgo",
          tipo: "select",
          requerido: true,
          opciones: ["Bajo", "Medio", "Alto", "Crítico"]
        },
        {
          nombre: "area_afectada",
          tipo: "text",
          requerido: true,
          placeholder: "Área o departamento afectado"
        },
        {
          nombre: "medidas_inmediatas",
          tipo: "textarea",
          requerido: true,
          placeholder: "Medidas inmediatas a tomar"
        },
        {
          nombre: "responsable",
          tipo: "text",
          requerido: true,
          placeholder: "Responsable de la medida"
        },
        {
          nombre: "fecha_implementacion",
          tipo: "date",
          requerido: true
        }
      ]
    },
    
    comunicado_convenio: {
      nombre: "Comunicado de Convenio",
      campos: [
        {
          nombre: "titulo",
          tipo: "text",
          requerido: true
        },
        {
          nombre: "articulo_afectado",
          tipo: "text",
          requerido: true,
          placeholder: "Artículo del convenio"
        },
        {
          nombre: "cambios",
          tipo: "textarea",
          requerido: true,
          placeholder: "Descripción de los cambios"
        },
        {
          nombre: "fecha_vigencia",
          tipo: "date",
          requerido: true
        },
        {
          nombre: "documento_adjunto",
          tipo: "file",
          requerido: false,
          tipos: ["pdf", "doc", "docx"]
        }
      ]
    }
  },
  
  servicios: {
    comunicado_formacion: {
      nombre: "Comunicado de Formación",
      campos: [
        {
          nombre: "titulo",
          tipo: "text",
          requerido: true
        },
        {
          nombre: "modalidad",
          tipo: "select",
          requerido: true,
          opciones: ["Presencial", "Online", "Mixta"]
        },
        {
          nombre: "duracion",
          tipo: "text",
          requerido: true,
          placeholder: "Duración del curso"
        },
        {
          nombre: "plazas",
          tipo: "number",
          requerido: true,
          min: 1
        },
        {
          nombre: "fecha_inicio",
          tipo: "date",
          requerido: true
        },
        {
          nombre: "fecha_fin_inscripcion",
          tipo: "date",
          requerido: true
        },
        {
          nombre: "requisitos",
          tipo: "textarea",
          requerido: false
        }
      ]
    }
  }
};
\`\`\`

## Personalización de Notificaciones

### Templates de Email
\`\`\`javascript
// src/config/notificaciones.js
const templatesNotificacion = {
  industrial: {
    cita_confirmada: {
      asunto: "Cita confirmada - {empresa} - Seguridad Industrial",
      plantilla: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #dc2626; color: white; padding: 20px; text-align: center;">
            <h1>🚨 Cita Confirmada</h1>
            <p>Portal Sindical {empresa}</p>
          </div>
          
          <div style="padding: 20px;">
            <h2>Detalles de la Cita</h2>
            <p><strong>Tipo:</strong> {tipo_cita}</p>
            <p><strong>Fecha y hora:</strong> {fecha} a las {hora}</p>
            <p><strong>Delegado:</strong> {delegado}</p>
            <p><strong>Ubicación:</strong> {ubicacion}</p>
            
            <div style="background-color: #fee2e2; border-left: 4px solid #dc2626; padding: 15px; margin: 20px 0;">
              <h3 style="color: #dc2626; margin-top: 0;">⚠️ Importante</h3>
              <p>Por favor, llegue 10 minutos antes de su cita. Si no puede asistir, cancele con al menos 24 horas de anticipación.</p>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="{enlace_cancelar}" style="background-color: #6b7280; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
                Cancelar Cita
              </a>
            </div>
          </div>
          
          <div style="background-color: #f3f4f6; padding: 20px; text-align: center; color: #6b7280;">
            <p>Portal Sindical {empresa} - Defendiendo la seguridad industrial</p>
          </div>
        </div>
      `
    },
    
    seguridad_urgente: {
      asunto: "🚨 ALERTA DE SEGURIDAD - {empresa}",
      plantilla: `
        <div style="background-color: #dc2626; color: white; padding: 20px; text-align: center;">
          <h1>🚨 ALERTA DE SEGURIDAD</h1>
          <p>{empresa} - {fecha}</p>
        </div>
        
        <div style="padding: 20px;">
          <h2>Información de la Alerta</h2>
          <p><strong>Nivel:</strong> {nivel_riesgo}</p>
          <p><strong>Área afectada:</strong> {area}</p>
          <p><strong>Fecha de emisión:</strong> {fecha}</p>
          
          <div style="background-color: #fee2e2; border: 2px solid #dc2626; padding: 20px; margin: 20px 0;">
            <h3 style="color: #dc2626; margin-top: 0;">Medidas Inmediatas</h3>
            <p>{medidas}</p>
          </div>
          
          <p><strong>Responsable:</strong> {responsable}</p>
          <p><strong>Contacto:</strong> {contacto}</p>
        </div>
      `
    }
  },
  
  servicios: {
    formacion_disponible: {
      asunto: "📚 Nueva formación disponible - {empresa}",
      plantilla: `
        <div style="background-color: #059669; color: white; padding: 20px; text-align: center;">
          <h1>📚 Nueva Formación Disponible</h1>
          <p>{empresa}</p>
        </div>
        
        <div style="padding: 20px;">
          <h2>{titulo_curso}</h2>
          <p><strong>Modalidad:</strong> {modalidad}</p>
          <p><strong>Duración:</strong> {duracion}</p>
          <p><strong>Inicio:</strong> {fecha_inicio}</p>
          <p><strong>Plazas disponibles:</strong> {plazas}</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="{enlace_inscripcion}" style="background-color: #059669; color: white; padding: 15px 30px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">
              Inscribirse Ahora
            </a>
          </div>
          
          <div style="background-color: #ecfdf5; border-left: 4px solid #059669; padding: 15px; margin: 20px 0;">
            <h3 style="color: #059669; margin-top: 0;">¿Por qué esta formación?</h3>
            <p>{descripcion}</p>
          </div>
        </div>
      `
    }
  }
};
\`\`\`

### Notificaciones Push
\`\`\`javascript
// src/config/push-notifications.js
const pushConfig = {
  industrial: {
    eventos: [
      {
        evento: "cita_proxima",
        titulo: "Cita de seguridad en 1 hora",
        cuerpo: "Tiene una cita de seguridad programada a las {hora}",
        icono: "alert-triangle",
        color: "warning",
        acciones: [
          { id: "ver_detalle", titulo: "Ver Detalles" },
          { id: "cancelar", titulo: "Cancelar" }
        ]
      },
      {
        evento: "nueva_alerta_seguridad",
        titulo: "🚨 Nueva alerta de seguridad",
        cuerpo: "Se ha emitido una nueva alerta de seguridad en el área {area}",
        icono: "shield-alert",
        color: "danger",
        acciones: [
          { id: "ver_alerta", titulo: "Ver Alerta" },
          { id: "acknowledge", titulo: "Confirmar Lectura" }
        ]
      }
    ]
  },
  
  servicios: {
    eventos: [
      {
        evento: "nueva_formacion",
        titulo: "📚 Nueva formación disponible",
        cuerpo: "Se ha publicado una nueva formación: {titulo}",
        icono: "graduation-cap",
        color: "success",
        acciones: [
          { id: "ver_detalle", titulo: "Ver Detalles" },
          { id: "inscribirse", titulo: "Inscribirse" }
        ]
      }
    ]
  }
};
\`\`\`

## Configuración de Permisos

### Roles y Permisos por Sector
\`\`\`javascript
// src/config/permisos.js
const permisosConfig = {
  industrial: {
    roles: {
      admin: {
        nombre: "Administrador",
        descripcion: "Acceso completo al sistema",
        permisos: ["*"]
      },
      delegado_sindical: {
        nombre: "Delegado Sindical",
        descripcion: "Representante sindical",
        permisos: [
          "ver_todos_comunicados",
          "crear_comunicados",
          "gestionar_citas",
          "ver_estadisticas",
          "exportar_datos"
        ]
      },
      responsable_seguridad: {
        nombre: "Responsable de Seguridad",
        descripcion: "Encargado de seguridad industrial",
        permisos: [
          "crear_alertas_seguridad",
          "gestionar_formacion_seguridad",
          "ver_incidentes",
          "generar_reportes_seguridad"
        ]
      },
      usuario: {
        nombre: "Trabajador",
        descripcion: "Trabajador de la empresa",
        permisos: [
          "ver_comunicados_publicos",
          "reservar_citas",
          "comentar_comunicados",
          "participar_encuestas"
        ]
      }
    },
    
    permisos_por_seccion: {
      citas: {
        admin: ["crear", "ver", "editar", "eliminar", "configurar"],
        delegado_sindical: ["ver", "gestionar"],
        responsable_seguridad: ["ver"],
        usuario: ["reservar", "ver_propias", "cancelar"]
      },
      comunicados: {
        admin: ["crear", "editar", "eliminar", "publicar", "configurar"],
        delegado_sindical: ["crear", "editar", "publicar"],
        responsable_seguridad: ["crear_alertas", "editar_alertas"],
        usuario: ["ver", "comentar", "reaccionar"]
      },
      seguridad: {
        admin: ["ver_todo", "configurar"],
        responsable_seguridad: ["crear_alertas", "gestionar_formacion", "ver_incidentes"],
        usuario: ["ver_alertas", "recibir_notificaciones"]
      }
    }
  },
  
  servicios: {
    roles: {
      admin: {
        nombre: "Administrador",
        permisos: ["*"]
      },
      delegado_servicios: {
        nombre: "Delegado de Servicios",
        permisos: [
          "gestionar_formacion",
          "ver_atencion_cliente",
          "gestionar_horarios",
          "crear_comunicados"
        ]
      },
      responsable_formacion: {
        nombre: "Responsable de Formación",
        permisos: [
          "crear_cursos",
          "gestionar_inscripciones",
          "evaluar_participantes",
          "emitir_certificados"
        ]
      },
      usuario: {
        permisos: [
          "ver_comunicados",
          "reservar_citas",
          "inscribirse_cursos",
          "comentar"
        ]
      }
    }
  }
};
\`\`\`

## Casos de Uso Avanzados

### Empresa Multinacional
\`\`\`javascript
// config/multinacional.js
const configMultinacional = {
  empresa: "Grupo Internacional S.A.",
  multiidioma: {
    idiomas: ["es", "ca", "en", "fr"],
    idioma_default: "es",
    traduccion_automatica: true
  },
  multi_pais: {
    paises: [
      { codigo: "ES", nombre: "España", dominio: "es.empresa.com" },
      { codigo: "CA", nombre: "Cataluña", dominio: "ca.empresa.com" },
      { codigo: "FR", nombre: "Francia", dominio: "fr.empresa.com" }
    ],
    centralizacion: false,
    sincronizacion: true
  },
  configuracion_centralizada: {
    base_datos_central: true,
    autenticacion_unica: true,
    permisos_jerarquicos: true,
    reportes_consolidados: true
  },
  tiposCitas: [
    {
      id: "central",
      nombre: "Sede Central",
      descripcion: "Citas en la sede central",
      icon: "Building",
      duracion: 60,
      ubicaciones: ["Madrid", "Barcelona", "París"]
    },
    {
      id: "local",
      nombre: "Oficina Local",
      descripcion: "Citas en oficina local",
      icon: "MapPin",
      duracion: 30,
      ubicaciones: ["Todas las oficinas"]
    }
  ]
};
\`\`\`

### Gran Empresa con Múltiples Centros
\`\`\`javascript
// config/gran-empresa.js
const configGranEmpresa = {
  empresa: "Gran Empresa Industrial S.L.",
  centros_trabajo: {
    enabled: true,
    configuracion: {
      madrid: {
        nombre: "Centro Madrid Norte",
        direccion: "Polígono Industrial Norte, Madrid",
        empleados: 250,
        tipo: "produccion",
        delegados: 3
      },
      barcelona: {
        nombre: "Centro Barcelona Sur",
        direccion: "Zona Industrial Sur, Barcelona",
        empleados: 180,
        tipo: "administracion",
        delegados: 2
      }
    }
  },
  tiposCitas: [
    {
      id: "central",
      nombre: "Sede Central",
      descripcion: "Citas en la sede central",
      icon: "Building",
      duracion: 60,
      disponible_para: ["todos"]
    },
    {
      id: "centro",
      nombre: "Centro Específico",
      descripcion: "Citas en un centro específico",
      icon: "MapPin",
      duracion: 45,
      disponible_para: ["empleados_centro"],
      centros_asociados: ["madrid", "barcelona"]
    },
    {
      id: "general",
      nombre: "Consulta General",
      descripcion: "Consultas generales disponibles en cualquier centro",
      icon: "Users",
      duracion: 30,
      disponible_para: ["todos"]
    }
  ],
  funcionalidades: {
    multi_centro: true,
    asignacion_automatica: true,
    historico_por_centro: true,
    estadisticas_consolidadas: true
  }
};
\`\`\`

## Optimización y Performance

### Lazy Loading Personalizado
\`\`\`javascript
// src/utils/lazy-loading.js
const lazyLoadingConfig = {
  industrial: {
    secciones: [
      {
        nombre: "seguridad",
        trigger: "scroll",
        threshold: "100px",
        cargarInmediato: false
      }
    ]
  },
  
  servicios: {
    secciones: [
      {
        nombre: "formacion",
        trigger: "hover",
        threshold: "50px",
        cargarInmediato: false
      }
    ]
  }
};
\`\`\`

### Cache Inteligente
\`\`\`javascript
// src/utils/cache.js
const cacheConfig = {
  industrial: {
    comunicados_seguridad: {
      ttl: 300, // 5 minutos
      invalidacion: "on_update"
    },
    alertas_activas: {
      ttl: 60, // 1 minuto
      invalidacion: "on_change"
    }
  },
  
  servicios: {
    cursos_disponibles: {
      ttl: 1800, // 30 minutos
      invalidacion: "daily"
    }
  }
};
\`\`\`

Este manual proporciona una guía completa para personalizar el Portal Sindical según cualquier sector y necesidades específicas. Cada sección puede ser adaptada independientemente, permitiendo máxima flexibilidad en la implementación.
