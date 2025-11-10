// Configuración personalizable por empresa
export interface EmpresaConfig {
  nombre: string;
  logo: string;
  colores: {
    primario: string;
    secundario: string;
    acento: string;
  };
  dominio: string;
  email: string;
  telefono: string;
  direccion: string;
  
  // Configuraciones específicas del sector
  tiposCitas: {
    id: string;
    nombre: string;
    descripcion: string;
    color: string;
    icon: string;
    duracion: number; // en minutos
    requiereDelegado: boolean;
  }[];
  
  horariosTrabajo: {
    lunes: { inicio: string; fin: string; activo: boolean };
    martes: { inicio: string; fin: string; activo: boolean };
    miercoles: { inicio: string; fin: string; activo: boolean };
    jueves: { inicio: string; fin: string; activo: boolean };
    viernes: { inicio: string; fin: string; activo: boolean };
    sabado: { inicio: string; fin: string; activo: boolean };
    domingo: { inicio: string; fin: string; activo: boolean };
  };
  
  textosPersonalizados: {
    titulo: string;
    descripcion: string;
    slogan: string;
    welcomeMessage: string;
    footerText: string;
    tituloSecciones: {
      citas: string;
      comunicados: string;
      encuestas: string;
      noticias: string;
      quienes_somos: string;
    };
    mensajes: {
      citaConfirmada: string;
      citaCancelada: string;
      recordatorio: string;
      bienvenido: string;
    };
  };
  
  // Configuraciones de funcionalidades
  funcionalidades: {
    citas: boolean;
    comunicados: boolean;
    encuestas: boolean;
    newsletter: boolean;
    comentarios: boolean;
    reacciones: boolean;
    notificaciones: boolean;
    estadisticas: boolean;
    exportacion: boolean;
  };
  
  // Configuraciones de seguridad
  seguridad: {
    validacionDominio: boolean;
    dominiosPermitidos: string[];
    roles: {
      admin: string;
      usuario: string;
    };
  };
}

// Configuración por defecto (UGT Template)
export const configuracionDefault: EmpresaConfig = {
  nombre: "Portal Sindical Template",
  logo: "/logo-default.png",
  colores: {
    primario: "#1e40af",
    secundario: "#059669",
    acento: "#dc2626"
  },
  dominio: "template.empresa.com",
  email: "contacto@template.empresa.com",
  telefono: "+34 900 000 000",
  direccion: "Dirección de la empresa",
  
  tiposCitas: [
    {
      id: "sindical",
      nombre: "Asuntos Sindicales",
      descripcion: "Consultas relacionadas con asuntos sindicales",
      color: "#1e40af",
      icon: "Users",
      duracion: 60,
      requiereDelegado: true
    },
    {
      id: "prevencion",
      nombre: "Prevención de Riesgos",
      descripcion: "Consultas sobre seguridad y prevención",
      color: "#059669",
      icon: "Shield",
      duracion: 45,
      requiereDelegado: true
    },
    {
      id: "contenido",
      nombre: "Otros Asuntos",
      descripcion: "Otras consultas y asuntos",
      color: "#dc2626",
      icon: "MessageCircle",
      duracion: 30,
      requiereDelegado: false
    }
  ],
  
  horariosTrabajo: {
    lunes: { inicio: "09:00", fin: "18:00", activo: true },
    martes: { inicio: "09:00", fin: "18:00", activo: true },
    miercoles: { inicio: "09:00", fin: "18:00", activo: true },
    jueves: { inicio: "09:00", fin: "18:00", activo: true },
    viernes: { inicio: "09:00", fin: "18:00", activo: true },
    sabado: { inicio: "09:00", fin: "14:00", activo: false },
    domingo: { inicio: "00:00", fin: "23:59", activo: false }
  },
  
  textosPersonalizados: {
    titulo: "Portal Sindical",
    descripcion: "Portal web de la organización sindical",
    slogan: "Defendiendo los derechos de los trabajadores",
    welcomeMessage: "Bienvenido a nuestro portal sindical",
    footerText: "© 2025 Portal Sindical Template. Todos los derechos reservados.",
    tituloSecciones: {
      citas: "Citas",
      comunicados: "Comunicados",
      encuestas: "Encuestas",
      noticias: "Noticias",
      quienessomos: "Quiénes Somos"
    },
    mensajes: {
      citaConfirmada: "Cita confirmada exitosamente",
      citaCancelada: "Cita cancelada exitosamente",
      recordatorio: "Recordatorio de cita enviado",
      bienvenido: "Bienvenido al portal sindical"
    }
  },
  
  funcionalidades: {
    citas: true,
    comunicados: true,
    encuestas: true,
    newsletter: true,
    comentarios: true,
    reacciones: true,
    notificaciones: true,
    estadisticas: true,
    exportacion: true
  },
  
  seguridad: {
    validacionDominio: true,
    dominiosPermitidos: ["@empresa.com", "@template.com"],
    roles: {
      admin: "admin",
      usuario: "user"
    }
  }
};

// Configuraciones predefinidas por sector
export const configuracionesSector = {
  industrial: {
    tiposCitas: [
      {
        id: "sindical",
        nombre: "Representación Sindical",
        descripcion: "Consulta con delegados sindicales",
        color: "#1e40af",
        icon: "Users",
        duracion: 60,
        requiereDelegado: true
      },
      {
        id: "seguridad",
        nombre: "Seguridad Industrial",
        descripcion: "Asuntos de seguridad en el trabajo",
        color: "#dc2626",
        icon: "ShieldAlert",
        duracion: 45,
        requiereDelegado: true
      },
      {
        id: "convenio",
        nombre: "Convenio Colectivo",
        descripcion: "Consultas sobre convenios",
        color: "#059669",
        icon: "FileText",
        duracion: 30,
        requiereDelegado: true
      }
    ]
  },
  servicios: {
    tiposCitas: [
      {
        id: "sindical",
        nombre: "Asuntos Sindicales",
        descripcion: "Consultas generales",
        color: "#1e40af",
        icon: "Users",
        duracion: 45,
        requiereDelegado: true
      },
      {
        id: "formacion",
        nombre: "Formación",
        descripcion: "Cursos y formación",
        color: "#059669",
        icon: "GraduationCap",
        duracion: 60,
        requiereDelegado: true
      },
      {
        id: "ayuda",
        nombre: "Ayuda Social",
        descripcion: "Asuntos de ayuda social",
        color: "#dc2626",
        icon: "Heart",
        duracion: 30,
        requiereDelegado: true
      }
    ]
  },
  publico: {
    tiposCitas: [
      {
        id: "sindical",
        nombre: "Atención Sindical",
        descripcion: "Consulta general",
        color: "#1e40af",
        icon: "Users",
        duracion: 30,
        requiereDelegado: true
      },
      {
        id: "normativa",
        nombre: "Normativa",
        descripcion: "Consultas normativas",
        color: "#059669",
        icon: "BookOpen",
        duracion: 45,
        requiereDelegado: true
      }
    ]
  }
};
