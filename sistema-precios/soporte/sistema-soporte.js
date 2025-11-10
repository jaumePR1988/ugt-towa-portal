// Paquetes de soporte y mantenimiento
const estructuraPrecios = require('../config/estructura-precios');

class SistemaSoporteMantenimiento {
  constructor() {
    this.paquetes = {
      basico: {
        nombre: "Soporte Básico",
        descripcion: "Soporte esencial para pequeñas empresas",
        precio: {
          micro: 15,
          mediana: 25,
          grande: 45,
          corporativo: 75
        },
        caracteristicas: {
          tiempoRespuesta: "24-48 horas",
          canales: ["email", "ticket"],
          horario: "Lun-Vie 9:00-18:00",
          idiomas: ["español"],
          limiteTicketsMes: 10,
          soporteTecnico: true,
          actualizacionesSeguridad: true,
          documentacionOnline: true,
          capacitacionOnline: false,
          soporteOnSite: false,
          sla: "99%",
          personalizacion: false,
          auditorias: false
        },
        servicios: [
          "Soporte técnico por email y tickets",
          "Actualizaciones de seguridad mensuales",
          "Acceso a documentación online",
          "Foro de comunidad de usuarios",
          "Base de conocimientos"
        ]
      },
      estandar: {
        nombre: "Soporte Estándar",
        descripcion: "Soporte completo para empresas en crecimiento",
        precio: {
          micro: 35,
          mediana: 55,
          grande: 95,
          corporativo: 150
        },
        caracteristicas: {
          tiempoRespuesta: "8-12 horas",
          canales: ["email", "ticket", "teléfono"],
          horario: "Lun-Vie 8:00-20:00, Sáb 9:00-14:00",
          idiomas: ["español", "inglés"],
          limiteTicketsMes: 50,
          soporteTecnico: true,
          actualizacionesSeguridad: true,
          documentacionOnline: true,
          capacitacionOnline: true,
          soporteOnSite: false,
          sla: "99.5%",
          personalizacion: "limitada",
          auditorias: "semestrales"
        },
        servicios: [
          "Todo lo incluido en el paquete Básico",
          "Soporte telefónico prioritario",
          "Capacitación online mensual",
          "Personalización básica de interfaz",
          "Auditorías de seguridad semestrales",
          "Reportes de rendimiento mensuales"
        ]
      },
      premium: {
        nombre: "Soporte Premium",
        descripcion: "Soporte especializado para grandes empresas",
        precio: {
          micro: 65,
          mediana: 95,
          grande: 175,
          corporativo: 250
        },
        caracteristicas: {
          tiempoRespuesta: "2-4 horas",
          canales: ["email", "ticket", "teléfono", "chat", "whatsapp"],
          horario: "24/7 todos los días",
          idiomas: ["español", "inglés", "francés"],
          limiteTicketsMes: "ilimitado",
          soporteTecnico: true,
          actualizacionesSeguridad: true,
          documentacionOnline: true,
          capacitacionOnline: true,
          soporteOnSite: "hasta 4 visitas/año",
          sla: "99.9%",
          personalizacion: "completa",
          auditorias: "trimestrales"
        },
        servicios: [
          "Todo lo incluido en el paquete Estándar",
          "Soporte 24/7 con técnicos especializados",
          "Hasta 4 visitas onsite por año",
          "Personalización completa del sistema",
          "Desarrollo de funcionalidades adicionales",
          "Integración con sistemas terceros",
          "Auditorías de seguridad trimestrales",
          "Consultoría estratégica mensual"
        ]
      },
      enterprise: {
        nombre: "Soporte Enterprise",
        descripcion: "Soporte dedicado para corporaciones",
        precio: {
          micro: 0, // No aplicable
          mediana: 0, // No aplicable
          grande: 0, // No aplicable
          corporativo: 500
        },
        caracteristicas: {
          tiempoRespuesta: "30 minutos",
          canales: ["email", "ticket", "teléfono", "chat", "whatsapp", "gerente_dedicado"],
          horario: "24/7 todos los días + línea directa",
          idiomas: ["español", "inglés", "francés", "alemán"],
          limiteTicketsMes: "ilimitado",
          soporteTecnico: true,
          actualizacionesSeguridad: true,
          documentacionOnline: true,
          capacitacionOnline: true,
          soporteOnSite: "ilimitado",
          sla: "99.99%",
          personalizacion: "total",
          auditorias: "mensuales"
        },
        servicios: [
          "Todo lo incluido en el paquete Premium",
          "Gerente de cuenta dedicado",
          "Línea directa para emergencias",
          "Visitas onsite ilimitadas",
          "Desarrollo de módulos custom",
          "Migración de datos asistida",
          "Auditorías de seguridad mensuales",
          "Revisiones estratégicas semanales",
          "Garantía de no interrupciones"
        ]
      }
    };

    this.mantenimientoAdicional = {
      backupDiario: {
        nombre: "Backup Diario",
        precio: {
          micro: 10,
          mediana: 15,
          grande: 25,
          corporativo: 40
        },
        descripcion: "Respaldos automáticos diarios de todos los datos"
      },
      backupTiempoReal: {
        nombre: "Backup en Tiempo Real",
        precio: {
          micro: 20,
          mediana: 30,
          grande: 50,
          corporativo: 80
        },
        descripcion: "Respaldos instantáneos de cualquier cambio"
      },
      recuperacionDias: {
        nombre: "Recuperación en 24 Horas",
        precio: {
          micro: 15,
          mediana: 25,
          grande: 40,
          corporativo: 60
        },
        descripcion: "Garantía de recuperación de datos en 24 horas máximo"
      },
      soporteMultiidioma: {
        nombre: "Soporte Multiidioma",
        precio: {
          micro: 5,
          mediana: 10,
          grande: 15,
          corporativo: 25
        },
        descripcion: "Soporte técnico en múltiples idiomas"
      },
      auditoriaSeguridad: {
        nombre: "Auditoría de Seguridad Avanzada",
        precio: {
          micro: 50,
          mediana: 100,
          grande: 200,
          corporativo: 300
        },
        descripcion: "Auditoría completa de seguridad con reporte detallado"
      }
    };
  }

  /**
   * Obtener paquete de soporte para un tipo de empresa
   */
  obtenerPaquetesDisponibles(tipoEmpresa) {
    return Object.keys(this.paquetes).map(key => {
      const paquete = { ...this.paquetes[key] };
      paquete.precioActual = paquete.precio[tipoEmpresa];
      return { key, ...paquete };
    });
  }

  /**
   * Calcular precio total de soporte y mantenimiento
   */
  calcularPrecioTotalSoporte(tipoEmpresa, paqueteBase, serviciosAdicionales = []) {
    let precioTotal = 0;
    let serviciosIncluidos = [];

    // Precio del paquete base
    const paquete = this.paquetes[paqueteBase];
    if (!paquete) {
      throw new Error(`Paquete ${paqueteBase} no encontrado`);
    }

    precioTotal += paquete.precio[tipoEmpresa];
    serviciosIncluidos = [...paquete.servicios];

    // Servicios adicionales
    serviciosAdicionales.forEach(servicio => {
      const servicioAdicional = this.mantenimientoAdicional[servicio];
      if (servicioAdicional) {
        precioTotal += servicioAdicional.precio[tipoEmpresa];
        serviciosIncluidos.push(servicioAdicional.nombre);
      }
    });

    return {
      precioBase: paquete.precio[tipoEmpresa],
      precioAdicional: serviciosAdicionales.reduce((sum, serv) => {
        return sum + (this.mantenimientoAdicional[serv]?.precio[tipoEmpresa] || 0);
      }, 0),
      precioTotal,
      serviciosIncluidos,
      serviciosAdicionales: serviciosAdicionales.length
    };
  }

  /**
   * Generar contrato de soporte
   */
  generarContratoSoporte(cliente, paquete, serviciosAdicionales = []) {
    const calculo = this.calcularPrecioTotalSoporte(cliente.empresa, paquete, serviciosAdicionales);
    const paqueteSeleccionado = this.paquetes[paquete];

    const contrato = {
      numeroContrato: this.generarNumeroContrato(),
      fechaInicio: new Date(),
      fechaFin: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 año
      cliente: cliente,
      paqueteSoporte: {
        nombre: paqueteSeleccionado.nombre,
        descripcion: paqueteSeleccionado.descripcion,
        caracteristicas: paqueteSeleccionado.caracteristicas,
        servicios: calculo.serviciosIncluidos
      },
      precios: calculo,
      condiciones: this.generarCondicionesContrato(paquete),
      sla: this.generarSLAGarantizado(paqueteSeleccionado.caracteristicas.sla),
      renovacionAutomatica: true,
      periodoFacturacion: "anual",
      proximoCobro: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
    };

    return contrato;
  }

  /**
   * Procesar tickets de soporte
   */
  procesarTicketSoporte(ticket) {
    const {
      idCliente,
      prioridad, // 'baja', 'media', 'alta', 'critica'
      categoria, // 'tecnico', 'facturacion', 'funcionalidad', 'seguridad'
      descripcion,
      archivosAdjuntos = []
    } = ticket;

    // Verificar límites del paquete
    const cliente = this.obtenerCliente(idCliente);
    const paqueteCliente = cliente.paqueteSoporte;
    const paqueteInfo = this.paquetes[paqueteCliente];

    // Validar límite de tickets
    if (this.haAlcanzadoLimiteTickets(cliente)) {
      return {
        exitoso: false,
        mensaje: "Ha alcanzado el límite mensual de tickets para su paquete"
      };
    }

    const nuevoTicket = {
      id: this.generarIdTicket(),
      cliente: idCliente,
      prioridad,
      categoria,
      descripcion,
      archivosAdjuntos,
      fechaCreacion: new Date(),
      tiempoRespuestaEstimado: this.calcularTiempoRespuesta(prioridad, paqueteInfo.caracteristicas.tiempoRespuesta),
      estado: 'abierto',
      asignado: null,
      comentarios: []
    };

    // Simular asignación automática basada en prioridad
    this.asignarTicket(nuevoTicket);

    return {
      exitoso: true,
      ticket: nuevoTicket,
      tiempoRespuestaEstimado: nuevoTicket.tiempoRespuestaEstimado
    };
  }

  /**
   * Generar reporte de soporte
   */
  generarReporteSoporte(fechaDesde, fechaHasta, idCliente = null) {
    // Esta función se implementaría para generar reportes detallados
    const reporte = {
      periodo: { desde: fechaDesde, hasta: fechaHasta },
      resumen: {
        totalTickets: 0,
        ticketsResueltos: 0,
        ticketsPendientes: 0,
        tiempoPromedioResolucion: 0,
        satisfaccionCliente: 0
      },
      porPrioridad: {},
      porCategoria: {},
      porTecnico: {}
    };

    return reporte;
  }

  // Métodos auxiliares privados
  obtenerCliente(idCliente) {
    // Esta función se implementaría para obtener información del cliente
    return { id: idCliente, paqueteSoporte: 'basico' };
  }

  haAlcanzadoLimiteTickets(cliente) {
    const limite = cliente.paqueteInfo?.caracteristicas.limiteTicketsMes;
    if (limite === 'ilimitado' || limite === undefined) return false;
    
    // Contar tickets del mes actual
    // Esta lógica se implementaría con la base de datos
    return false; // Por ahora retornamos false
  }

  calcularTiempoRespuesta(prioridad, tiempoPaquete) {
    const tiemposPrioridad = {
      'baja': 48,
      'media': 24,
      'alta': 8,
      'critica': 2
    };

    return Math.min(tiemposPrioridad[prioridad], this.parsearTiempoRespuesta(tiempoPaquete));
  }

  parsearTiempoRespuesta(tiempo) {
    if (typeof tiempo === 'number') return tiempo;
    
    // Parsear strings como "2-4 horas", "8-12 horas", etc.
    const match = tiempo.match(/(\d+)-?(\d+)?\s*horas?/);
    if (match) {
      return match[2] ? parseInt(match[2]) : parseInt(match[1]);
    }
    return 24; // Default
  }

  asignarTicket(ticket) {
    // Lógica de asignación automática basada en prioridad y carga de trabajo
    const tecnicos = ['tech001', 'tech002', 'tech003']; // IDs de técnicos disponibles
    const tecnicoAsignado = tecnicos[Math.floor(Math.random() * tecnicos.length)];
    ticket.asignado = tecnicoAsignado;
  }

  generarCondicionesContrato(paquete) {
    return [
      "El soporte se proporcionará durante el horario especificado en el paquete",
      "Los tiempos de respuesta son estimados y pueden variar según la carga de trabajo",
      "El cliente debe proporcionar acceso necesario para resolución de problemas",
      "Las actualizaciones de seguridad se aplicarán automáticamente",
      "El contrato se renueva automáticamente salvo cancelación con 30 días de antelación",
      "El soporte está limitado a la plataforma y servicios contratados"
    ];
  }

  generarSLAGarantizado(porcentajeSLA) {
    const slaNumerico = parseFloat(porcentajeSLA);
    const tiempoInactividadPermitido = ((100 - slaNumerico) / 100) * 365 * 24 * 60; // minutos por año
    
    return {
      porcentaje: porcentajeSLA,
      tiempoInactividadPermitidoAnual: Math.round(tiempoInactividadPermitido) + " minutos",
      compensacion: this.calcularCompensacionSLA(slaNumerico)
    };
  }

  calcularCompensacionSLA(sla) {
    if (sla >= 99.9) {
      return "20% descuento en próxima renovación";
    } else if (sla >= 99.5) {
      return "10% descuento en próxima renovación";
    } else if (sla >= 99) {
      return "5% descuento en próxima renovación";
    }
    return "Sin compensación";
  }

  generarIdTicket() {
    return 'TKT-' + Math.random().toString(36).substr(2, 9);
  }

  generarNumeroContrato() {
    const fecha = new Date();
    const año = fecha.getFullYear();
    const numero = String(Math.floor(Math.random() * 10000)).padStart(4, '0');
    return `CONT-SOP-${año}-${numero}`;
  }
}

module.exports = SistemaSoporteMantenimiento;