// Estructura de precios por tipo de empresa
const estructuraPrecios = {
  empresas: {
    micro: {
      nombre: "Microempresa (1-10 empleados)",
      caracteristicas: [
        "Hasta 10 empleados",
        "1-2 usuarios administradores",
        "Funcionalidades básicas",
        "Soporte por email"
      ],
      suscripciones: {
        mensual: 29,
        anual: 290, // 10% descuento
        bianual: 522 // 15% descuento
      },
      modulos_adicionales: {
        reportes_avanzados: 15,
        integracion_third_party: 20,
        api_acceso: 25,
        usuarios_adicionales: 5
      }
    },
    mediana: {
      nombre: "Mediana Empresa (11-50 empleados)",
      caracteristicas: [
        "11-50 empleados",
        "3-10 usuarios administradores",
        "Funcionalidades avanzadas",
        "Soporte telefónico prioritario"
      ],
      suscripciones: {
        mensual: 79,
        anual: 790, // 10% descuento
        bianual: 1422 // 15% descuento
      },
      modulos_adicionales: {
        reportes_avanzados: 25,
        integracion_third_party: 35,
        api_acceso: 45,
        usuarios_adicionales: 8,
        auditoria_seguridad: 30,
        backup_automatico: 20
      }
    },
    grande: {
      nombre: "Gran Empresa (51+ empleados)",
      caracteristicas: [
        "51+ empleados",
        "11-50 usuarios administradores",
        "Funcionalidades enterprise",
        "Soporte 24/7",
        "Gerente de cuenta dedicado"
      ],
      suscripciones: {
        mensual: 149,
        anual: 1490, // 10% descuento
        bianual: 2682 // 15% descuento
      },
      modulos_adicionales: {
        reportes_avanzados: 45,
        integracion_third_party: 60,
        api_acceso: 80,
        usuarios_adicionales: 12,
        auditoria_seguridad: 50,
        backup_automatico: 35,
        personalizacion_completa: 100,
        soporte_dedicado: 150
      }
    },
    corporativo: {
      nombre: "Corporativo (500+ empleados)",
      caracteristicas: [
        "500+ empleados",
        "Usuarios ilimitados",
        "Funcionalidades custom",
        "SLA garantizado",
        "Equipo de soporte dedicado"
      ],
      suscripciones: {
        mensual: 299,
        anual: 2990, // 10% descuento
        bianual: 5382 // 15% descuento
      },
      modulos_adicionales: {
        reportes_avanzados: 80,
        integracion_third_party: 100,
        api_acceso: 150,
        usuarios_adicionales: 20,
        auditoria_seguridad: 100,
        backup_automatico: 60,
        personalizacion_completa: 200,
        soporte_dedicado: 300,
        implementacion_personalizada: 500,
        capacitacion_presencial: 200
      }
    }
  },
  
  // Factores de descuento
  descuentos: {
    volumen: {
      "1-5": 0, // Sin descuento
      "6-20": 0.05, // 5% descuento
      "21-50": 0.10, // 10% descuento
      "51-100": 0.15, // 15% descuento
      "101+": 0.20 // 20% descuento
    },
    periodo: {
      "1": 0, // Mensual
      "12": 0.10, // Anual
      "24": 0.15 // Bianual
    }
  },

  // Impuestos por región
  impuestos: {
    españa: 0.21, // IVA
    francia: 0.20, // TVA
    alemania: 0.19, // MwSt
    italia: 0.22, // IVA
    portugal: 0.23, // IVA
    otros: 0.00 // Sin impuestos
  }
};

module.exports = estructuraPrecios;