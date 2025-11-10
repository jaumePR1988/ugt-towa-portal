// Plantillas de contratos
const estructuraPrecios = require('../config/estructura-precios');

class GeneradorContratos {
  constructor() {
    this.plantillas = {
      suscripcion: {
        titulo: "CONTRATO DE SUSCRIPCIÓN DE SOFTWARE",
        estructura: this.contratoSuscripcionEstructura(),
        clausulas: this.contratoSuscripcionClausulas()
      },
      soporte: {
        titulo: "CONTRATO DE SERVICIOS DE SOPORTE TÉCNICO",
        estructura: this.contratoSoporteEstructura(),
        clausulas: this.contratoSoporteClausulas()
      },
      mantenimiento: {
        titulo: "CONTRATO DE MANTENIMIENTO Y ACTUALIZACIONES",
        estructura: this.contratoMantenimientoEstructura(),
        clausulas: this.contratoMantenimientoClausulas()
      },
      enterprise: {
        titulo: "CONTRATO DE LICENCIA ENTERPRISE",
        estructura: this.contratoEnterpriseEstructura(),
        clausulas: this.contratoEnterpriseClausulas()
      }
    };
  }

  /**
   * Generar contrato de suscripción
   */
  generarContratoSuscripcion(datosCliente, configuracion) {
    const empresa = estructuraPrecios.empresas[configuracion.tipoEmpresa];
    
    const contrato = {
      numero: this.generarNumeroContrato('SUS'),
      fecha: new Date(),
      partes: {
        proveedor: {
          nombre: "Empresa de Software S.L.",
          nif: "B12345678",
          direccion: "Calle Gran Vía 123, 28013 Madrid, España",
          telefono: "+34 900 123 456",
          email: "legal@empresa.com"
        },
        cliente: datosCliente
      },
      objeto: {
        descripcion: `Licencia de uso del software "${this.obtenerNombreSoftware()}"`,
        tipo: empresa.nombre,
        caracteristicas: empresa.caracteristicas,
        modulos: configuracion.modulosAdicionales || []
      },
      condiciones: this.obtenerCondicionesSuscripcion(configuracion),
      precio: this.calcularPrecioContrato(configuracion),
      vigencia: {
        inicio: new Date(),
        fin: this.calcularFechaFin(new Date(), configuracion.tipoSuscripcion),
        renovacion: 'automática'
      },
      clausulas: this.plantillas.suscripcion.clausulas
    };

    return this.formatearContrato(contrato, 'suscripcion');
  }

  /**
   * Generar contrato de soporte
   */
  generarContratoSoporte(datosCliente, paquete, servicios) {
    const contrato = {
      numero: this.generarNumeroContrato('SOP'),
      fecha: new Date(),
      partes: this.plantillas.soporte.estructura.partes,
      objeto: {
        descripcion: "Servicios de soporte técnico y mantenimiento",
        paquete: this.obtenerNombrePaquete(paquete),
        servicios: this.obtenerServiciosPaquete(paquete, servicios)
      },
      condiciones: this.obtenerCondicionesSoporte(paquete),
      precio: this.calcularPrecioSoporteContrato(paquete, servicios, datosCliente.empresa),
      vigencia: {
        inicio: new Date(),
        fin: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
        renovacion: 'automática'
      },
      sla: this.generarSLASoporte(paquete),
      clausulas: this.plantillas.soporte.clausulas
    };

    return this.formatearContrato(contrato, 'soporte');
  }

  /**
   * Generar contrato enterprise
   */
  generarContratoEnterprise(datosCliente, configuracion) {
    const contrato = {
      numero: this.generarNumeroContrato('ENT'),
      fecha: new Date(),
      partes: this.plantillas.enterprise.estructura.partes,
      objeto: {
        descripcion: "Licencia Enterprise con servicios personalizados",
        alcance: "Implementación completa, soporte dedicado y personalizaciones",
        usuarios: configuracion.numeroEmpleados,
        personalizaciones: configuracion.personalizaciones || []
      },
      condiciones: this.obtenerCondicionesEnterprise(configuracion),
      precio: this.calcularPrecioEnterprise(configuracion),
      vigencia: {
        inicio: new Date(),
        fin: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
        renovacion: 'manual'
      },
      compromisos: this.generarCompromisosEnterprise(),
      clausulas: this.plantillas.enterprise.clausulas
    };

    return this.formatearContrato(contrato, 'enterprise');
  }

  /**
   * Generar addon al contrato
   */
  generarAddonContrato(numeroContrato, tipo, datos) {
    const addon = {
      numero: this.generarNumeroContrato('ADD'),
      contratoBase: numeroContrato,
      fecha: new Date(),
      tipo: tipo, // 'modulo', 'soporte', 'usuarios', 'personalizacion'
      descripcion: datos.descripcion,
      precio: datos.precio,
      fechaEfectiva: datos.fechaEfectiva || new Date(),
      vigencia: datos.vigencia || "indefinida",
      condiciones: this.generarCondicionesAddon(tipo, datos)
    };

    return this.formatearAddon(addon);
  }

  /**
   * Generar contrato de renovación
   */
  generarContratoRenovacion(contratoOriginal, nuevaConfiguracion) {
    const renovacion = {
      numero: this.generarNumeroContrato('REN'),
      contratoOriginal: contratoOriginal.numero,
      fecha: new Date(),
      fechaVigencia: {
        inicio: contratoOriginal.vigencia.fin,
        fin: this.calcularFechaFin(contratoOriginal.vigencia.fin, nuevaConfiguracion.tipoSuscripcion)
      },
      condicionesAnteriores: contratoOriginal.condiciones,
      nuevasCondiciones: this.obtenerCondicionesSuscripcion(nuevaConfiguracion),
      cambios: this.compararConfiguraciones(contratoOriginal, nuevaConfiguracion),
      precio: this.calcularPrecioContrato(nuevaConfiguracion),
      descuentos: this.calcularDescuentosRenovacion(contratoOriginal, nuevaConfiguracion)
    };

    return this.formatearContrato(renovacion, 'renovacion');
  }

  // Métodos auxiliares privados
  contratoSuscripcionEstructura() {
    return {
      partes: {
        proveedor: {
          nombre: "",
          nif: "",
          direccion: "",
          telefono: "",
          email: ""
        },
        cliente: {
          nombre: "",
          nif: "",
          direccion: "",
          telefono: "",
          email: ""
        }
      },
      objeto: {
        descripcion: "",
        tipo: "",
        caracteristicas: [],
        modulos: []
      }
    };
  }

  contratoSuscripcionClausulas() {
    return {
      primera: {
        titulo: "OBJETO DEL CONTRATO",
        contenido: "El presente contrato tiene por objeto la concesión de una licencia de uso del software objeto de este contrato, así como la prestación de los servicios asociados."
      },
      segunda: {
        titulo: "DERECHOS Y OBLIGACIONES DEL PROVEEDOR",
        contenido: [
          "Proporcionar acceso al software contratado",
          "Garantizar la disponibilidad del servicio",
          "Realizar actualizaciones de seguridad",
          "Proporcionar soporte técnico según el nivel contratado"
        ]
      },
      tercera: {
        titulo: "DERECHOS Y OBLIGACIONES DEL CLIENTE",
        contenido: [
          "Pagar las cuotas en la forma y plazo establecidos",
          "No compartir las credenciales de acceso",
          "Utilizar el software según los términos contratados",
          "Colaborar en la resolución de incidencias"
        ]
      },
      cuarta: {
        titulo: "PROPIEDAD INTELECTUAL",
        contenido: "El software es propiedad del proveedor. El cliente obtiene únicamente el derecho de uso según lo establecido en este contrato."
      },
      quinta: {
        titulo: "CONFIDENCIALIDAD",
        contenido: "Ambas partes se comprometen a mantener la confidencialidad de la información intercambiada en el marco de este contrato."
      },
      sexta: {
        titulo: "LIMITACIÓN DE RESPONSABILIDAD",
        contenido: "La responsabilidad del proveedor se limita al importe total pagado por el cliente en los últimos 12 meses."
      },
      septima: {
        titulo: "RESOLUCIÓN DEL CONTRATO",
        contenido: "El contrato se resolverá por incumplimiento de cualquiera de las partes, previo requerimiento con 15 días de antelación."
      },
      octava: {
        titulo: "LEY APLICABLE Y JURISDICCIÓN",
        contenido: "Este contrato se rige por la legislación española. Los tribunales competentes serán los de Madrid."
      }
    };
  }

  contratoSoporteEstructura() {
    return {
      partes: {
        proveedor: "Empresa de Software S.L.",
        cliente: ""
      },
      objeto: {
        descripcion: "Servicios de soporte técnico",
        paquete: "",
        servicios: []
      }
    };
  }

  contratoSoporteClausulas() {
    return {
      primera: {
        titulo: "OBJETO DEL CONTRATO",
        contenido: "Prestación de servicios de soporte técnico para el software contratado, incluyendo resolución de incidencias y consultas técnicas."
      },
      segunda: {
        titulo: "NIVEL DE SERVICIO",
        contenido: [
          "Tiempo de respuesta según paquete contratado",
          "Canales de comunicación especificados",
          "Horario de atención establecido",
          "Límite de tickets mensual según contrato"
        ]
      },
      tercera: {
        titulo: "OBRAS Y MEJORAS",
        contenido: "Las mejoras del software se implementarán sin coste adicional para el cliente durante la vigencia del contrato."
      },
      cuarta: {
        titulo: "HORAS DE TRABAJO",
        contenido: "El soporte se prestará en horario comercial salvo paquetes 24/7."
      }
    };
  }

  contratoMantenimientoEstructura() {
    return {
      partes: {
        proveedor: "Empresa de Software S.L.",
        cliente: ""
      },
      objeto: {
        descripcion: "Servicios de mantenimiento y actualizaciones"
      }
    };
  }

  contratoMantenimientoClausulas() {
    return {
      primera: {
        titulo: "OBJETO",
        contenido: "Mantenimiento preventivo, actualizaciones de seguridad y mejoras del software."
      },
      segunda: {
        titulo: "ACTUALIZACIONES",
        contenido: "Se aplicarán automáticamente las actualizaciones de seguridad y funcionalidades menores."
      }
    };
  }

  contratoEnterpriseEstructura() {
    return {
      partes: {
        proveedor: "Empresa de Software S.L.",
        cliente: ""
      },
      objeto: {
        descripcion: "Licencia Enterprise con servicios personalizados"
      }
    };
  }

  contratoEnterpriseClausulas() {
    return {
      primera: {
        titulo: "OBJETO",
        contenido: "Licencia de uso empresarial con servicios de implementación, soporte dedicado y personalizaciones."
      },
      segunda: {
        titulo: "SERVICIOS INCLUIDOS",
        contenido: [
          "Implementación personalizada",
          "Soporte técnico dedicado",
          "Desarrollo de funcionalidades custom",
          "Migración de datos",
          "Capacitación presencial"
        ]
      },
      tercera: {
        titulo: "SLA GARANTIZADO",
        contenido: "Disponibilidad del 99.99% con compensación por incumplimiento."
      }
    };
  }

  obtenerNombreSoftware() {
    return "Sistema de Gestión Empresarial";
  }

  obtenerCondicionesSuscripcion(configuracion) {
    return {
      tipo: configuracion.tipoSuscripcion,
      periodo: this.obtenerMeses(configuracion.tipoSuscripcion),
      renovacionAutomatica: true,
      preavisoCancelacion: 30 // días
    };
  }

  calcularPrecioContrato(configuracion) {
    // Implementación básica - debería usar la calculadora
    const empresa = estructuraPrecios.empresas[configuracion.tipoEmpresa];
    const precioBase = empresa.suscripciones[configuracion.tipoSuscripcion];
    const modulos = this.calcularPrecioModulos(configuracion.modulosAdicionales, configuracion.tipoEmpresa);
    
    return {
      base: precioBase,
      modulos: modulos,
      subtotal: precioBase + modulos,
      impuestos: (precioBase + modulos) * 0.21, // IVA
      total: (precioBase + modulos) * 1.21
    };
  }

  calcularPrecioModulos(modulos, tipoEmpresa) {
    if (!modulos || modulos.length === 0) return 0;
    
    const configEmpresa = estructuraPrecios.empresas[tipoEmpresa];
    return modulos.reduce((total, modulo) => {
      return total + (configEmpresa.modulos_adicionales[modulo] || 0);
    }, 0);
  }

  obtenerMeses(tipoSuscripcion) {
    const meses = { 'mensual': 1, 'anual': 12, 'bianual': 24 };
    return meses[tipoSuscripcion] || 1;
  }

  calcularFechaFin(fechaInicio, tipoSuscripcion) {
    const meses = this.obtenerMeses(tipoSuscripcion);
    const fecha = new Date(fechaInicio);
    fecha.setMonth(fecha.getMonth() + meses);
    return fecha;
  }

  obtenerNombrePaquete(paquete) {
    const nombres = {
      'basico': 'Soporte Básico',
      'estandar': 'Soporte Estándar',
      'premium': 'Soporte Premium',
      'enterprise': 'Soporte Enterprise'
    };
    return nombres[paquete] || paquete;
  }

  obtenerServiciosPaquete(paquete, servicios) {
    // Implementación simplificada
    return servicios || [];
  }

  obtenerCondicionesSoporte(paquete) {
    return {
      tiempoRespuesta: this.obtenerTiempoRespuesta(paquete),
      horario: this.obtenerHorarioSoporte(paquete),
      renovacionAutomatica: true
    };
  }

  obtenerTiempoRespuesta(paquete) {
    const tiempos = {
      'basico': '24-48 horas',
      'estandar': '8-12 horas',
      'premium': '2-4 horas',
      'enterprise': '30 minutos'
    };
    return tiempos[paquete] || '24-48 horas';
  }

  obtenerHorarioSoporte(paquete) {
    const horarios = {
      'basico': 'Lun-Vie 9:00-18:00',
      'estandar': 'Lun-Vie 8:00-20:00, Sáb 9:00-14:00',
      'premium': '24/7',
      'enterprise': '24/7 + línea directa'
    };
    return horarios[paquete] || 'Lun-Vie 9:00-18:00';
  }

  calcularPrecioSoporteContrato(paquete, servicios, tipoEmpresa) {
    // Implementación simplificada
    return {
      paquete: 0, // Se calcularía según tabla de precios
      servicios: 0,
      total: 0
    };
  }

  generarSLASoporte(paquete) {
    const sla = {
      'basico': '99%',
      'estandar': '99.5%',
      'premium': '99.9%',
      'enterprise': '99.99%'
    };

    return {
      disponibilidad: sla[paquete] || '99%',
      compensacion: this.calcularCompensacionSLA(paquete)
    };
  }

  calcularCompensacionSLA(paquete) {
    const compensaciones = {
      'basico': 'Sin compensación',
      'estandar': '5% descuento próxima renovación',
      'premium': '10% descuento próxima renovación',
      'enterprise': '20% descuento próxima renovación'
    };
    return compensaciones[paquete] || 'Sin compensación';
  }

  obtenerCondicionesEnterprise(configuracion) {
    return {
      alcance: 'Personalizado según necesidades',
      implementacion: 'Incluida',
      soporte: 'Dedicado',
      personalizaciones: 'Sin límite dentro del alcance'
    };
  }

  calcularPrecioEnterprise(configuracion) {
    // Implementación específica para enterprise
    return {
      licencia: 0,
      implementacion: 0,
      soporte: 0,
      personalizaciones: 0,
      total: 0
    };
  }

  generarCompromisosEnterprise() {
    return [
      "Gerente de cuenta dedicado",
      "Soporte 24/7 con técnico senior",
      "Implementación en máximo 30 días",
      "Garantía de disponibilidad 99.99%"
    ];
  }

  generarCondicionesAddon(tipo, datos) {
    const condiciones = {
      'modulo': "El módulo se activará en la fecha acordada",
      'soporte': "El soporte se aplicará a partir de la fecha efectiva",
      'usuarios': "Los usuarios adicionales se facturarán pro-rata",
      'personalizacion': "El desarrollo se realizará según cronograma acordado"
    };
    return condiciones[tipo] || "Condiciones estándar";
  }

  compararConfiguraciones(original, nueva) {
    return {
      cambiosDetectados: [],
      sinCambios: true
    };
  }

  calcularDescuentosRenovacion(contratoOriginal, nuevaConfiguracion) {
    return {
      renovacionAnticipada: 0,
      fidelidad: 0,
      total: 0
    };
  }

  formatearContrato(contrato, tipo) {
    const plantilla = this.plantillas[tipo] || this.plantillas.suscripcion;
    
    return {
      ...contrato,
      titulo: plantilla.titulo,
      formato: 'contrato',
      fechaGeneracion: new Date()
    };
  }

  formatearAddon(addon) {
    return {
      ...addon,
      formato: 'addon',
      fechaGeneracion: new Date()
    };
  }

  generarNumeroContrato(prefijo) {
    const fecha = new Date();
    const año = fecha.getFullYear();
    const numero = String(Math.floor(Math.random() * 10000)).padStart(4, '0');
    return `${prefijo}-${año}-${numero}`;
  }
}

module.exports = GeneradorContratos;