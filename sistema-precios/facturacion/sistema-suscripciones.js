// Sistema de suscripciones anuales y facturación automática
const estructuraPrecios = require('./estructura-precios');

class SistemaSuscripciones {
  constructor() {
    this.clientes = new Map();
    this.facturasPendientes = [];
    this.suscripcionesActivas = [];
  }

  /**
   * Crear nueva suscripción
   */
  crearSuscripcion(cliente) {
    const {
      empresa,
      tipoSuscripcion, // 'mensual', 'anual', 'bianual'
      modulos = [],
      empleados = 1,
      region = 'españa',
      fechaInicio = new Date(),
      metodoPago = 'tarjeta'
    } = cliente;

    const configEmpresa = estructuraPrecios.empresas[empresa];
    if (!configEmpresa) {
      throw new Error(`Tipo de empresa ${empresa} no válido`);
    }

    const configuracionSuscripcion = {
      id: this.generarId(),
      empresa,
      tipoSuscripcion,
      precioBase: configEmpresa.suscripciones[tipoSuscripcion],
      modulosAdicionales: this.calcularPrecioModulos(modulos, empresa),
      empleados,
      region,
      descuentoVolumen: this.calcularDescuentoVolumen(empleados),
      descuentoPeriodo: estructuraPrecios.descuentos.periodo[this.obtenerMeses(tipoSuscripcion)],
      impuestos: estructuraPrecios.impuestos[region] || 0,
      fechaInicio,
      fechaFin: this.calcularFechaFin(fechaInicio, tipoSuscripcion),
      metodoPago,
      estado: 'activa',
      proximoCobro: this.calcularProximoCobro(fechaInicio, tipoSuscripcion),
      facturacionAutomatica: true
    };

    configuracionSuscripcion.precioFinal = this.calcularPrecioFinal(configuracionSuscripcion);
    configuracionSuscripcion.numeroFactura = this.generarNumeroFactura();

    this.suscripcionesActivas.push(configuracionSuscripcion);
    this.clientes.set(configuracionSuscripcion.id, configuracionSuscripcion);

    return configuracionSuscripcion;
  }

  /**
   * Procesar facturación automática
   */
  procesarFacturacionAutomatica() {
    const fechaHoy = new Date();
    const facturasAGenerar = [];

    for (const suscripcion of this.suscripcionesActivas) {
      if (this.esFechaCobro(suscripcion.proximoCobro, fechaHoy) && 
          suscripcion.facturacionAutomatica && 
          suscripcion.estado === 'activa') {
        
        const factura = this.generarFactura(suscripcion);
        facturasAGenerar.push(factura);
        
        // Programar próximo cobro
        suscripcion.proximoCobro = this.calcularProximoCobro(
          suscripcion.proximoCobro, 
          suscripcion.tipoSuscripcion
        );
      }
    }

    return facturasAGenerar;
  }

  /**
   * Generar factura automática
   */
  generarFactura(suscripcion) {
    const factura = {
      numero: this.generarNumeroFactura(),
      idSuscripcion: suscripcion.id,
      fechaEmision: new Date(),
      fechaVencimiento: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 días
      concepto: `Suscripción ${suscripcion.tipoSuscripcion} - ${estructuraPrecios.empresas[suscripcion.empresa].nombre}`,
      desglose: this.generarDesgloseFactura(suscripcion),
      subtotal: this.calcularSubtotal(suscripcion),
      impuestos: this.calcularImpuestos(suscripcion),
      total: this.calcularTotal(suscripcion),
      estado: 'pendiente',
      metodoPago: suscripcion.metodoPago,
      periodo: {
        desde: this.calcularPeriodoInicio(suscripcion.proximoCobro, suscripcion.tipoSuscripcion),
        hasta: this.calcularPeriodoFin(suscripcion.proximoCobro, suscripcion.tipoSuscripcion)
      }
    };

    // Intentar cobro automático
    if (suscripcion.metodoPago === 'tarjeta') {
      const resultadoCobro = this.procesarCobroAutomatico(factura, suscripcion);
      factura.estado = resultadoCobro.exitoso ? 'pagada' : 'error';
      factura.mensajeError = resultadoCobro.mensajeError;
    }

    this.facturasPendientes.push(factura);
    return factura;
  }

  /**
   * Procesar renovación de suscripción
   */
  renovarSuscripcion(idSuscripcion, nuevaDuracion = null) {
    const suscripcion = this.clientes.get(idSuscripcion);
    if (!suscripcion) {
      throw new Error('Suscripción no encontrada');
    }

    if (nuevaDuracion) {
      suscripcion.tipoSuscripcion = nuevaDuracion;
      suscripcion.precioBase = estructuraPrecios.empresas[suscripcion.empresa].suscripciones[nuevaDuracion];
      suscripcion.descuentoPeriodo = estructuraPrecios.descuentos.periodo[this.obtenerMeses(nuevaDuracion)];
    }

    // Renovar por el mismo período
    suscripcion.fechaInicio = new Date();
    suscripcion.fechaFin = this.calcularFechaFin(suscripcion.fechaInicio, suscripcion.tipoSuscripcion);
    suscripcion.proximoCobro = this.calcularProximoCobro(suscripcion.fechaInicio, suscripcion.tipoSuscripcion);
    suscripcion.precioFinal = this.calcularPrecioFinal(suscripcion);

    return suscripcion;
  }

  /**
   * Calcular precio final con todos los descuentos
   */
  calcularPrecioFinal(config) {
    const subtotal = config.precioBase + config.modulosAdicionales;
    const descuentoTotal = subtotal * (config.descuentoVolumen + config.descuentoPeriodo);
    const precioConDescuento = subtotal - descuentoTotal;
    const impuestos = precioConDescuento * config.impuestos;
    
    return precioConDescuento + impuestos;
  }

  /**
   * Generar reporte de facturación
   */
  generarReporteFacturacion(fechaDesde, fechaHasta) {
    const facturasFiltradas = this.facturasPendientes.filter(factura => {
      const fechaEmision = new Date(factura.fechaEmision);
      return fechaEmision >= fechaDesde && fechaEmision <= fechaHasta;
    });

    const resumen = {
      periodo: {
        desde: fechaDesde,
        hasta: fechaHasta
      },
      totalFacturas: facturasFiltradas.length,
      totalIngresos: facturasFiltradas.reduce((sum, f) => sum + f.total, 0),
      facturasPagadas: facturasFiltradas.filter(f => f.estado === 'pagada').length,
      facturasPendientes: facturasFiltradas.filter(f => f.estado === 'pendiente').length,
      facturasError: facturasFiltradas.filter(f => f.estado === 'error').length,
      desgloseTipoEmpresa: this.agruparPorTipoEmpresa(facturasFiltradas)
    };

    return resumen;
  }

  // Métodos auxiliares privados
  calcularPrecioModulos(modulos, tipoEmpresa) {
    const configEmpresa = estructuraPrecios.empresas[tipoEmpresa];
    return modulos.reduce((total, modulo) => {
      return total + (configEmpresa.modulos_adicionales[modulo] || 0);
    }, 0);
  }

  calcularDescuentoVolumen(empleados) {
    if (empleados <= 5) return estructuraPrecios.descuentos.volumen["1-5"];
    if (empleados <= 20) return estructuraPrecios.descuentos.volumen["6-20"];
    if (empleados <= 50) return estructuraPrecios.descuentos.volumen["21-50"];
    if (empleados <= 100) return estructuraPrecios.descuentos.volumen["51-100"];
    return estructuraPrecios.descuentos.volumen["101+"];
  }

  obtenerMeses(tipoSuscripcion) {
    const meses = {
      'mensual': 1,
      'anual': 12,
      'bianual': 24
    };
    return meses[tipoSuscripcion] || 1;
  }

  calcularFechaFin(fechaInicio, tipoSuscripcion) {
    const meses = this.obtenerMeses(tipoSuscripcion);
    const fecha = new Date(fechaInicio);
    fecha.setMonth(fecha.getMonth() + meses);
    return fecha;
  }

  calcularProximoCobro(fechaInicio, tipoSuscripcion) {
    if (tipoSuscripcion === 'mensual') {
      return new Date(fechaInicio.getTime() + 30 * 24 * 60 * 60 * 1000);
    }
    return this.calcularFechaFin(fechaInicio, tipoSuscripcion);
  }

  esFechaCobro(fechaCobro, fechaHoy) {
    const diferencia = fechaCobro.getTime() - fechaHoy.getTime();
    return diferencia <= 0 && diferencia > -24 * 60 * 60 * 1000; // Dentro del día de cobro
  }

  generarDesgloseFactura(suscripcion) {
    return [
      {
        concepto: `Suscripción ${suscripcion.tipoSuscripcion}`,
        cantidad: 1,
        precioUnitario: suscripcion.precioBase,
        total: suscripcion.precioBase
      },
      ...this.obtenerModulosDesglose(suscripcion)
    ];
  }

  obtenerModulosDesglose(suscripcion) {
    // Esta función se implementaría para obtener los módulos específicos del cliente
    return [];
  }

  calcularSubtotal(suscripcion) {
    return suscripcion.precioBase + suscripcion.modulosAdicionales;
  }

  calcularImpuestos(suscripcion) {
    return this.calcularSubtotal(suscripcion) * suscripcion.impuestos;
  }

  calcularTotal(suscripcion) {
    return this.calcularSubtotal(suscripcion) + this.calcularImpuestos(suscripcion);
  }

  calcularPeriodoInicio(fechaCobro, tipoSuscripcion) {
    const fecha = new Date(fechaCobro);
    return fecha;
  }

  calcularPeriodoFin(fechaCobro, tipoSuscripcion) {
    const meses = this.obtenerMeses(tipoSuscripcion);
    const fecha = new Date(fechaCobro);
    fecha.setMonth(fecha.getMonth() + meses);
    return fecha;
  }

  procesarCobroAutomatico(factura, suscripcion) {
    // Simulación de procesamiento de pago
    const exito = Math.random() > 0.1; // 90% éxito
    
    if (exito) {
      return {
        exitoso: true,
        transaccionId: this.generarId(),
        fechaCobro: new Date()
      };
    } else {
      return {
        exitoso: false,
        mensajeError: 'Tarjeta rechazada - fondos insuficientes'
      };
    }
  }

  agruparPorTipoEmpresa(facturas) {
    const agrupacion = {};
    facturas.forEach(factura => {
      const suscripcion = this.suscripcionesActivas.find(s => s.id === factura.idSuscripcion);
      if (suscripcion) {
        const tipo = suscripcion.empresa;
        if (!agrupacion[tipo]) {
          agrupacion[tipo] = { count: 0, total: 0 };
        }
        agrupacion[tipo].count++;
        agrupacion[tipo].total += factura.total;
      }
    });
    return agrupacion;
  }

  generarId() {
    return 'sub_' + Math.random().toString(36).substr(2, 9);
  }

  generarNumeroFactura() {
    const fecha = new Date();
    const año = fecha.getFullYear();
    const mes = String(fecha.getMonth() + 1).padStart(2, '0');
    const numero = String(this.facturasPendientes.length + 1).padStart(4, '0');
    return `FACT-${año}${mes}-${numero}`;
  }
}

module.exports = SistemaSuscripciones;