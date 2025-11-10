// Calculadora de precios interactiva
const estructuraPrecios = require('../config/estructura-precios');

class CalculadoraPrecios {
  constructor() {
    this.configuracionActual = null;
  }

  /**
   * Calcular precio completo basado en configuración
   */
  calcularPrecio(configuracion) {
    const {
      tipoEmpresa,
      numeroEmpleados = 1,
      tipoSuscripcion = 'mensual',
      modulosAdicionales = [],
      paqueteSoporte = null,
      serviciosSoporte = [],
      region = 'españa',
      descuentoCodigo = null
    } = configuracion;

    // Validar configuración
    this.validarConfiguracion(configuracion);

    // Obtener precios base
    const empresaConfig = estructuraPrecios.empresas[tipoEmpresa];
    const precioSuscripcion = empresaConfig.suscripciones[tipoSuscripcion];
    
    // Calcular precio de módulos adicionales
    const precioModulos = this.calcularPrecioModulos(modulosAdicionales, tipoEmpresa);
    
    // Calcular subtotal
    const subtotal = precioSuscripcion + precioModulos;
    
    // Aplicar descuentos
    const descuentos = this.calcularDescuentos(subtotal, numeroEmpleados, tipoSuscripcion, descuentoCodigo);
    const precioConDescuentos = subtotal - descuentos.totalDescuentos;
    
    // Calcular soporte
    const precioSoporte = paqueteSoporte ? 
      this.calcularPrecioSoporte(tipoEmpresa, paqueteSoporte, serviciosSoporte) : 0;
    
    // Calcular impuestos
    const tasaImpuestos = estructuraPrecios.impuestos[region] || 0;
    const impuestos = (precioConDescuentos + precioSoporte) * tasaImpuestos;
    
    // Precio final
    const precioFinal = precioConDescuentos + precioSoporte + impuestos;

    const resultado = {
      configuracion: configuracion,
      desglose: {
        suscripcionBase: {
          concepto: `Suscripción ${tipoSuscripcion}`,
          descripcion: empresaConfig.nombre,
          precio: precioSuscripcion
        },
        modulosAdicionales: this.generarDesgloseModulos(modulosAdicionales, tipoEmpresa),
        soporte: paqueteSoporte ? this.generarDesgloseSoporte(tipoEmpresa, paqueteSoporte, serviciosSoporte) : null,
        subtotal: subtotal,
        descuentos: {
          volumen: descuentos.descuentoVolumen,
          periodo: descuentos.descuentoPeriodo,
          codigo: descuentos.descuentoCodigo,
          total: descuentos.totalDescuentos
        },
        impuestos: {
          tasa: tasaImpuestos,
          concepto: `IVA/Impuestos (${(tasaImpuestos * 100).toFixed(1)}%)`,
          importe: impuestos
        },
        total: precioFinal
      },
      resumen: {
        precioMensual: this.calcularPrecioMensual(precioFinal, tipoSuscripcion),
        ahorroAnual: this.calcularAhorroAnual(descuentos.totalDescuentos, tipoSuscripcion),
        roiEstimado: this.calcularROI(tipoEmpresa, numeroEmpleados, precioFinal)
      },
      recomendaciones: this.generarRecomendaciones(configuracion, precioFinal),
      comparacion: this.generarComparacion(tipoEmpresa, numeroEmpleados, tipoSuscripcion, region)
    };

    this.configuracionActual = resultado;
    return resultado;
  }

  /**
   * Generar cotización formal
   */
  generarCotizacion(cliente, configuracion) {
    const calculo = this.calcularPrecio(configuracion);
    
    const cotizacion = {
      numero: this.generarNumeroCotizacion(),
      fecha: new Date(),
      fechaVencimiento: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 días
      cliente: cliente,
      configuracion: calculo.configuracion,
      desglose: calculo.desglose,
      resumen: calculo.resumen,
      condiciones: this.generarCondicionesCotizacion(),
      validez: "30 días",
      notas: "Precios en EUR. Impuestos no incluidos salvo indicación contraria.",
      contactoVentas: {
        nombre: "Departamento Comercial",
        email: "ventas@empresa.com",
        telefono: "+34 900 123 456"
      }
    };

    return cotizacion;
  }

  /**
   * Comparar planes
   */
  compararPlanes(tipoEmpresa, numeroEmpleados, region, incluirSoporte = false) {
    const planes = ['mensual', 'anual', 'bianual'];
    const comparacion = {};

    planes.forEach(plan => {
      const configuracion = {
        tipoEmpresa,
        numeroEmpleados,
        tipoSuscripcion: plan,
        region
      };

      if (incluirSoporte) {
        configuracion.paqueteSoporte = 'estandar';
      }

      const precio = this.calcularPrecio(configuracion);
      comparacion[plan] = {
        ...precio.desglose,
        resumen: precio.resumen,
        recomendado: plan === 'anual' // Por defecto recomendamos anual
      };
    });

    // Identificar mejor plan
    const mejorPlan = Object.keys(comparacion).reduce((mejor, plan) => {
      const precioActual = comparacion[plan].desglose.total;
      const precioMejor = comparacion[mejor].desglose.total;
      return precioActual < precioMejor ? plan : mejor;
    });

    comparacion.mejorOpcion = mejorPlan;
    comparacion[mejorPlan].recomendado = true;

    return comparacion;
  }

  /**
   * Simulador de ROI
   */
  calcularROI(tipoEmpresa, numeroEmpleados, costoMensual) {
    const beneficiosPorEmpleado = {
      'micro': 150,    // EUR/empleado/mes
      'mediana': 200,  // EUR/empleado/mes
      'grande': 250,   // EUR/empleado/mes
      'corporativo': 300 // EUR/empleado/mes
    };

    const beneficioTotal = numeroEmpleados * (beneficiosPorEmpleado[tipoEmpresa] || 150);
    const roi = ((beneficioTotal - costoMensual) / costoMensual) * 100;
    const periodoRecuperacion = costoMensual / (beneficioTotal / 30); // días

    return {
      roiMensual: Math.round(roi),
      beneficioMensualEstimado: beneficioTotal,
      periodoRecuperacion: Math.round(periodoRecuperacion),
      justificacion: this.generarJustificacionROI(roi, tipoEmpresa)
    };
  }

  // Métodos auxiliares privados
  validarConfiguracion(config) {
    if (!estructuraPrecios.empresas[config.tipoEmpresa]) {
      throw new Error(`Tipo de empresa no válido: ${config.tipoEmpresa}`);
    }

    if (!['mensual', 'anual', 'bianual'].includes(config.tipoSuscripcion)) {
      throw new Error(`Tipo de suscripción no válido: ${config.tipoSuscripcion}`);
    }

    if (config.numeroEmpleados < 1 || config.numeroEmpleados > 10000) {
      throw new Error('Número de empleados debe estar entre 1 y 10000');
    }
  }

  calcularPrecioModulos(modulos, tipoEmpresa) {
    const configEmpresa = estructuraPrecios.empresas[tipoEmpresa];
    return modulos.reduce((total, modulo) => {
      return total + (configEmpresa.modulos_adicionales[modulo] || 0);
    }, 0);
  }

  calcularDescuentos(subtotal, numeroEmpleados, tipoSuscripcion, codigoDescuento) {
    // Descuento por volumen
    const descuentoVolumen = this.calcularDescuentoVolumen(numeroEmpleados);
    
    // Descuento por período
    const descuentoPeriodo = estructuraPrecios.descuentos.periodo[this.obtenerMeses(tipoSuscripcion)];
    
    // Descuento por código promocional (simulado)
    const descuentoCodigo = this.aplicarCodigoDescuento(codigoDescuento, subtotal);
    
    const totalDescuentos = subtotal * (descuentoVolumen + descuentoPeriodo) + descuentoCodigo;

    return {
      descuentoVolumen: subtotal * descuentoVolumen,
      descuentoPeriodo: subtotal * descuentoPeriodo,
      descuentoCodigo,
      totalDescuentos
    };
  }

  calcularDescuentoVolumen(empleados) {
    if (empleados <= 5) return estructuraPrecios.descuentos.volumen["1-5"];
    if (empleados <= 20) return estructuraPrecios.descuentos.volumen["6-20"];
    if (empleados <= 50) return estructuraPrecios.descuentos.volumen["21-50"];
    if (empleados <= 100) return estructuraPrecios.descuentos.volumen["51-100"];
    return estructuraPrecios.descuentos.volumen["101+"];
  }

  aplicarCodigoDescuento(codigo, subtotal) {
    const codigos = {
      'BIENVENIDO10': 0.10,
      'STARTUP20': 0.20,
      'EMPRESA15': 0.15
    };

    if (codigo && codigos[codigo.toUpperCase()]) {
      return subtotal * codigos[codigo.toUpperCase()];
    }
    return 0;
  }

  calcularPrecioSoporte(tipoEmpresa, paquete, servicios) {
    const preciosSoporte = {
      'basico': { 'micro': 15, 'mediana': 25, 'grande': 45, 'corporativo': 75 },
      'estandar': { 'micro': 35, 'mediana': 55, 'grande': 95, 'corporativo': 150 },
      'premium': { 'micro': 65, 'mediana': 95, 'grande': 175, 'corporativo': 250 },
      'enterprise': { 'micro': 0, 'mediana': 0, 'grande': 0, 'corporativo': 500 }
    };

    let precio = preciosSoporte[paquete]?.[tipoEmpresa] || 0;

    // Servicios adicionales
    const serviciosAdicionales = {
      'backupDiario': { 'micro': 10, 'mediana': 15, 'grande': 25, 'corporativo': 40 },
      'backupTiempoReal': { 'micro': 20, 'mediana': 30, 'grande': 50, 'corporativo': 80 },
      'recuperacionDias': { 'micro': 15, 'mediana': 25, 'grande': 40, 'corporativo': 60 },
      'soporteMultiidioma': { 'micro': 5, 'mediana': 10, 'grande': 15, 'corporativo': 25 },
      'auditoriaSeguridad': { 'micro': 50, 'mediana': 100, 'grande': 200, 'corporativo': 300 }
    };

    servicios.forEach(servicio => {
      precio += serviciosAdicionales[servicio]?.[tipoEmpresa] || 0;
    });

    return precio;
  }

  obtenerMeses(tipoSuscripcion) {
    const meses = { 'mensual': 1, 'anual': 12, 'bianual': 24 };
    return meses[tipoSuscripcion] || 1;
  }

  generarDesgloseModulos(modulos, tipoEmpresa) {
    const configEmpresa = estructuraPrecios.empresas[tipoEmpresa];
    
    return modulos.map(modulo => ({
      concepto: this.obtenerNombreModulo(modulo),
      precio: configEmpresa.modulos_adicionales[modulo] || 0
    }));
  }

  generarDesgloseSoporte(tipoEmpresa, paquete, servicios) {
    // Implementación simplificada
    return {
      concepto: `Soporte ${paquete}`,
      precio: this.calcularPrecioSoporte(tipoEmpresa, paquete, servicios)
    };
  }

  obtenerNombreModulo(modulo) {
    const nombres = {
      'reportes_avanzados': 'Reportes Avanzados',
      'integracion_third_party': 'Integración Terceros',
      'api_acceso': 'Acceso API',
      'usuarios_adicionales': 'Usuarios Adicionales',
      'auditoria_seguridad': 'Auditoría de Seguridad',
      'backup_automatico': 'Backup Automático',
      'personalizacion_completa': 'Personalización Completa',
      'soporte_dedicado': 'Soporte Dedicado',
      'implementacion_personalizada': 'Implementación Personalizada',
      'capacitacion_presencial': 'Capacitación Presencial'
    };
    return nombres[modulo] || modulo;
  }

  calcularPrecioMensual(precioTotal, tipoSuscripcion) {
    const meses = this.obtenerMeses(tipoSuscripcion);
    return precioTotal / meses;
  }

  calcularAhorroAnual(descuentoTotal, tipoSuscripcion) {
    if (tipoSuscripcion === 'mensual') {
      return descuentoTotal * 11; // Ahorro anual vs mensual
    } else if (tipoSuscripcion === 'bianual') {
      return descuentoTotal; // Ahorro total del período
    }
    return descuentoTotal; // Anual
  }

  generarJustificacionROI(roi, tipoEmpresa) {
    if (roi > 200) {
      return `Excelente ROI del ${roi}%. Su inversión se recuperará rápidamente.`;
    } else if (roi > 100) {
      return `Buen ROI del ${roi}%. La solución es altamente rentable.`;
    } else if (roi > 50) {
      return `ROI positivo del ${roi}%. Beneficio claro a medio plazo.`;
    } else {
      return `ROI del ${roi}%. Considere optimizar la configuración para maximizar beneficios.`;
    }
  }

  generarRecomendaciones(config, precio) {
    const recomendaciones = [];

    if (config.tipoSuscripcion === 'mensual' && config.numeroEmpleados > 10) {
      recomendaciones.push("Considere cambiar a suscripción anual para ahorrar hasta 15%");
    }

    if (config.paqueteSoporte === null && config.numeroEmpleados > 20) {
      recomendaciones.push("Agregar soporte técnico para maximizar el rendimiento");
    }

    if (config.modulosAdicionales.length === 0 && config.tipoEmpresa !== 'micro') {
      recomendaciones.push("Considere módulos adicionales para aprovechar mejor su inversión");
    }

    if (precio > 500) {
      recomendaciones.push("Para este nivel de inversión, considere hablar con nuestro equipo comercial");
    }

    return recomendaciones;
  }

  generarComparacion(tipoEmpresa, numeroEmpleados, tipoSuscripcion, region) {
    // Comparación con competencia simulada
    return {
      posicion: "Competitivo",
      factores: [
        "Funcionalidades incluidas",
        "Calidad del soporte",
        "Facilidad de uso",
        "Escalabilidad"
      ],
      ventajas: [
        "Mejor relación calidad-precio",
        "Soporte en español",
        "Implementación rápida"
      ]
    };
  }

  generarCondicionesCotizacion() {
    return [
      "Los precios incluyen licencias de software por el período contratado",
      "Los impuestos se calculan según la legislación fiscal vigente",
      "Las condiciones de soporte se detallan en contrato separado",
      "Precios válidos por 30 días desde la fecha de emisión",
      "Se requiere firma de contrato y pago inicial para activación"
    ];
  }

  generarNumeroCotizacion() {
    const fecha = new Date();
    const año = fecha.getFullYear();
    const mes = String(fecha.getMonth() + 1).padStart(2, '0');
    const numero = String(Math.floor(Math.random() * 10000)).padStart(4, '0');
    return `COT-${año}${mes}-${numero}`;
  }
}

module.exports = CalculadoraPrecios;