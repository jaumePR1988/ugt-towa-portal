// Sistema principal de precios y facturación
const estructuraPrecios = require('./config/estructura-precios');
const CalculadoraPrecios = require('./calculadora/calculadora-precios');
const SistemaSuscripciones = require('./facturacion/sistema-suscripciones');
const SistemaSoporte = require('./soporte/sistema-soporte');
const GeneradorContratos = require('./plantillas/generador-contratos');

class SistemaPreciosFacturacion {
  constructor() {
    this.calculadora = new CalculadoraPrecios();
    this.suscripciones = new SistemaSuscripciones();
    this.soporte = new SistemaSoporte();
    this.contratos = new GeneradorContratos();
  }

  /**
   * Proceso completo: desde cotización hasta contrato
   */
  async procesoCompletoCliente(cliente, configuracion) {
    try {
      console.log('Iniciando proceso completo para cliente:', cliente.nombre);

      // 1. Generar cotización
      console.log('1. Generando cotización...');
      const cotizacion = this.calculadora.generarCotizacion(cliente, configuracion);
      
      // 2. Aceptación de cotización (simulada)
      console.log('2. Cotización aceptada');
      const cotizacionAceptada = this.simularAceptacionCotizacion(cotizacion);
      
      if (!cotizacionAceptada) {
        throw new Error('Cliente rechazó la cotización');
      }

      // 3. Crear suscripción
      console.log('3. Creando suscripción...');
      const suscripcion = this.suscripciones.crearSuscripcion({
        empresa: configuracion.tipoEmpresa,
        tipoSuscripcion: configuracion.tipoSuscripcion,
        modulos: configuracion.modulosAdicionales,
        empleados: configuracion.numeroEmpleados,
        region: configuracion.region
      });

      // 4. Generar contrato de suscripción
      console.log('4. Generando contrato...');
      const contratoSuscripcion = this.contratos.generarContratoSuscripcion(cliente, configuracion);

      // 5. Procesar pago inicial
      console.log('5. Procesando pago inicial...');
      const pagoInicial = await this.procesarPagoInicial(suscripcion, cotizacion);

      if (!pagoInicial.exitoso) {
        throw new Error(`Error en pago: ${pagoInicial.error}`);
      }

      // 6. Generar contrato de soporte si se solicita
      let contratoSoporte = null;
      if (configuracion.paqueteSoporte) {
        console.log('6. Generando contrato de soporte...');
        contratoSoporte = this.soporte.generarContratoSoporte(
          cliente,
          configuracion.paqueteSoporte,
          configuracion.serviciosSoporte || []
        );
      }

      // 7. Activar cuenta
      console.log('7. Activando cuenta...');
      const activacion = await this.activarCuenta(cliente, suscripcion);

      // 8. Enviar emails de bienvenida
      console.log('8. Enviando emails de bienvenida...');
      await this.enviarEmailsBienvenida(cliente, {
        cotizacion,
        contratoSuscripcion,
        contratoSoporte,
        credenciales: activacion.credenciales
      });

      // 9. Programar facturación automática
      console.log('9. Programando facturación automática...');
      await this.programarFacturacionAutomatica(suscripcion);

      // 10. Configurar onboarding
      console.log('10. Configurando onboarding...');
      const onboarding = this.configurarOnboarding(cliente, configuracion);

      const resultado = {
        exitoso: true,
        cliente: cliente,
        cotizacion: cotizacion,
        suscripcion: suscripcion,
        contratoSuscripcion: contratoSuscripcion,
        contratoSoporte: contratoSoporte,
        pagoInicial: pagoInicial,
        activacion: activacion,
        onboarding: onboarding,
        proximosPasos: this.obtenerProximosPasos(configuracion)
      };

      console.log('Proceso completo finalizado exitosamente');
      return resultado;

    } catch (error) {
      console.error('Error en proceso completo:', error);
      
      // Rollback en caso de error
      await this.rollbackProceso(cliente, error);
      
      return {
        exitoso: false,
        error: error.message,
        cliente: cliente
      };
    }
  }

  /**
   * Calcular y mostrar comparación de planes
   */
  mostrarComparacionPlanes(tipoEmpresa, numeroEmpleados, region) {
    console.log(`\n=== COMPARACIÓN DE PLANES ===`);
    console.log(`Empresa: ${tipoEmpresa} | Empleados: ${numeroEmpleados} | Región: ${region}\n`);

    const comparacion = this.calculadora.compararPlanes(
      tipoEmpresa, 
      numeroEmpleados, 
      region, 
      true // Incluir soporte
    );

    console.log('PLANES DISPONIBLES:');
    Object.keys(comparacion).forEach(plan => {
      if (plan !== 'mejorOpcion') {
        const planData = comparacion[plan];
        const recomendado = planData.recomendado ? ' [RECOMENDADO]' : '';
        const precio = planData.desglose.total.toFixed(2);
        
        console.log(`\n${plan.toUpperCase()}${recomendado}`);
        console.log(`  Precio: ${precio}€`);
        console.log(`  Precio mensual: ${planData.resumen.precioMensual.toFixed(2)}€`);
        console.log(`  Ahorro anual: ${planData.resumen.ahorroAnual.toFixed(2)}€`);
      }
    });

    console.log(`\nMEJOR OPCIÓN: ${comparacion.mejorOpcion.toUpperCase()}`);
    
    return comparacion;
  }

  /**
   * Simular proceso de renovación automática
   */
  async procesoRenovacionAutomatica() {
    console.log('Ejecutando renovación automática...');
    
    const fechaHoy = new Date();
    const renovaciones = await this.obtenerSuscripcionesPorRenovar(30); // 30 días
    
    const resultados = {
      renovacionesExitosas: 0,
      renovacionesFallidas: 0,
      notificacionesEnviadas: 0
    };

    for (const suscripcion of renovaciones) {
      try {
        // Verificar si se debe renovar automáticamente
        if (suscripcion.renovacionAutomatica) {
          const nuevaSuscripcion = this.suscripciones.renovarSuscripcion(
            suscripcion.id,
            suscripcion.tipoSuscripcion
          );

          // Procesar cobro
          const factura = this.suscripciones.generarFactura(nuevaSuscripcion);
          const pago = await this.procesarPagoAutomatico(factura, nuevaSuscripcion);

          if (pago.exitoso) {
            resultados.renovacionesExitosas++;
            await this.enviarConfirmacionRenovacion(suscripcion, nuevaSuscripcion);
          } else {
            resultados.renovacionesFallidas++;
            await this.notificarErrorRenovacion(suscripcion, pago.error);
          }
        } else {
          // Enviar notificación de renovación manual
          await this.enviarNotificacionRenovacionManual(suscripcion);
          resultados.notificacionesEnviadas++;
        }
      } catch (error) {
        console.error(`Error en renovación de ${suscripcion.id}:`, error);
        resultados.renovacionesFallidas++;
      }
    }

    console.log('Renovación automática completada:', resultados);
    return resultados;
  }

  /**
   * Generar reporte completo de negocio
   */
  async generarReporteCompleto(fechaDesde, fechaHasta) {
    console.log('Generando reporte completo de negocio...');

    // Obtener datos de todas las fuentes
    const reporteFacturacion = this.suscripciones.generarReporteFacturacion(fechaDesde, fechaHasta);
    const reporteSoporte = this.soporte.generarReporteSoporte(fechaDesde, fechaHasta);
    const metricasConversiones = await this.calcularMetricasConversion(fechaDesde, fechaHasta);
    const proyectarIngresos = this.proyectarIngresosFuturos();

    const reporteCompleto = {
      periodo: { desde: fechaDesde, hasta: fechaHasta },
      resumenEjecutivo: {
        ingresosTotales: reporteFacturacion.totalIngresos,
        nuevasSuscripciones: metricasConversiones.nuevasSuscripciones,
        tasaConversion: metricasConversiones.tasaConversion,
        clientesActivos: await this.contarClientesActivos(),
        churnRate: metricasConversiones.churnRate,
        ltv: metricasConversiones.ltv,
        cac: metricasConversiones.cac,
        roi: (metricasConversiones.ltv / metricasConversiones.cac)
      },
      ingresos: {
        porTipoEmpresa: reporteFacturacion.desgloseTipoEmpresa,
        porPeriodo: this.agruparIngresosPorPeriodo(reporteFacturacion),
        proyeccionAnual: proyectarIngresos.ingresosAnuales,
        ingresosRecurrentes: proyectarIngresos.ingresosRecurrentes
      },
      clientes: {
        nuevos: metricasConversiones.nuevosClientes,
        activos: await this.contarClientesActivos(),
        porRenovar: await this.contarClientesPorRenovar(),
        porTipoEmpresa: await this.contarClientesPorTipoEmpresa()
      },
      soporte: {
        ticketsTotales: reporteSoporte.resumen.totalTickets,
        resolucionPromedio: reporteSoporte.resumen.tiempoPromedioResolucion,
        satisfaccion: reporteSoporte.resumen.satisfaccionCliente,
        slaCumplido: await this.calcularSlaCumplido()
      },
      recomendaciones: this.generarRecomendacionesEstrategicas(reporteCompleto),
      alertas: await this.identificarAlertas(reporteCompleto)
    };

    return reporteCompleto;
  }

  // Métodos auxiliares privados
  simularAceptacionCotizacion(cotizacion) {
    // En un sistema real, esto sería una respuesta del cliente
    return true; // Simular aceptación
  }

  async procesarPagoInicial(suscripcion, cotizacion) {
    // Simular procesamiento de pago
    const exito = Math.random() > 0.05; // 95% éxito
    
    if (exito) {
      return {
        exitoso: true,
        transaccionId: this.generarIdTransaccion(),
        fechaCobro: new Date(),
        importe: cotizacion.desglose.total
      };
    } else {
      return {
        exitoso: false,
        error: 'Tarjeta rechazada - fondos insuficientes'
      };
    }
  }

  async activarCuenta(cliente, suscripcion) {
    // Simular activación de cuenta
    return {
      exitos: true,
      credenciales: {
        usuario: cliente.email,
        passwordTemporal: this.generarPasswordTemporal(),
        urlAcceso: 'https://app.empresa.com/login'
      },
      fechaActivacion: new Date()
    };
  }

  async enviarEmailsBienvenida(cliente, documentos) {
    console.log(`Enviando emails de bienvenida a ${cliente.email}`);
    // Implementación de envío de emails
  }

  async programarFacturacionAutomatica(suscripcion) {
    console.log(`Programando facturación automática para ${suscripcion.id}`);
    // Implementación de programación de tareas
  }

  configurarOnboarding(cliente, configuracion) {
    const pasosOnboarding = [
      {
        titulo: 'Bienvenida',
        descripcion: 'Acceder a la plataforma',
        completada: false
      },
      {
        titulo: 'Configuración Inicial',
        descripcion: 'Completar perfil de empresa',
        completada: false
      },
      {
        titulo: 'Configurar Usuarios',
        descripcion: 'Agregar usuarios del sistema',
        completada: configuracion.numeroEmpleados > 1
      },
      {
        titulo: 'Capacitación',
        descripcion: 'Completar tutorial básico',
        completada: false
      }
    ];

    return {
      pasos: pasosOnboarding,
      completados: pasosOnboarding.filter(p => p.completada).length,
      total: pasosOnboarding.length
    };
  }

  obtenerProximosPasos(configuracion) {
    const pasos = [];

    if (configuracion.tipoEmpresa === 'micro') {
      pasos.push('Solicitar capacitación básica gratuita');
      pasos.push('Configurar backup automático');
    } else if (configuracion.tipoEmpresa === 'mediana' || configuracion.tipoEmpresa === 'grande') {
      pasos.push('Programar sesión de onboarding personalizada');
      pasos.push('Revisar integraciones disponibles');
      pasos.push('Capacitar usuarios administradores');
    } else {
      pasos.push('Asignar gerente de cuenta dedicado');
      pasos.push('Programar implementación custom');
      pasos.push('Configurar SLA personalizado');
    }

    if (configuracion.modulosAdicionales?.length > 0) {
      pasos.push('Configurar módulos adicionales');
    }

    if (configuracion.paqueteSoporte) {
      pasos.push('Conocer canales de soporte disponibles');
    }

    return pasos;
  }

  async rollbackProceso(cliente, error) {
    console.log(`Ejecutando rollback para cliente ${cliente.nombre}:`, error.message);
    // Implementar rollback según el punto de fallo
  }

  async obtenerSuscripcionesPorRenovar(dias) {
    // Implementar consulta a base de datos
    return []; // Retornar array vacío por ahora
  }

  async procesarPagoAutomatico(factura, suscripcion) {
    // Similar a procesarPagoInicial
    return { exitoso: true, transaccionId: 'auto_123' };
  }

  async enviarConfirmacionRenovacion(suscripcion, nuevaSuscripcion) {
    console.log(`Enviando confirmación de renovación para ${suscripcion.id}`);
  }

  async notificarErrorRenovacion(suscripcion, error) {
    console.log(`Notificando error de renovación para ${suscripcion.id}: ${error}`);
  }

  async enviarNotificacionRenovacionManual(suscripcion) {
    console.log(`Enviando notificación de renovación manual para ${suscripcion.id}`);
  }

  async calcularMetricasConversion(fechaDesde, fechaHasta) {
    // Implementar cálculos de métricas
    return {
      nuevasSuscripciones: 45,
      tasaConversion: 12.5,
      nuevosClientes: 38,
      churnRate: 5.2,
      ltv: 2500,
      cac: 150
    };
  }

  proyectarIngresosFuturos() {
    return {
      ingresosAnuales: 125000,
      ingresosRecurrentes: 98000
    };
  }

  agruparIngresosPorPeriodo(reporteFacturacion) {
    return {
      mensual: reporteFacturacion.totalIngresos / 12,
      trimestral: reporteFacturacion.totalIngresos / 4,
      semestral: reporteFacturacion.totalIngresos / 2
    };
  }

  async contarClientesActivos() {
    return 156;
  }

  async contarClientesPorRenovar() {
    return 23;
  }

  async contarClientesPorTipoEmpresa() {
    return {
      micro: 89,
      mediana: 45,
      grande: 18,
      corporativo: 4
    };
  }

  async calcularSlaCumplido() {
    return 98.5;
  }

  generarRecomendacionesEstrategicas(reporte) {
    return [
      'Incrementar marketing para empresas medianas (mayor crecimiento)',
      'Implementar programa de fidelización para reducir churn',
      'Desarrollar funcionalidades específicas para sector corporativo',
      'Optimizar proceso de onboarding para mejorar conversión'
    ];
  }

  async identificarAlertas(reporte) {
    const alertas = [];
    
    if (reporte.resumenEjecutivo.churnRate > 10) {
      alertas.push({
        tipo: 'warning',
        mensaje: 'Churn rate elevado - revisar satisfacción del cliente',
        valor: reporte.resumenEjecutivo.churnRate
      });
    }

    if (reporte.resumenEjecutivo.tasaConversion < 5) {
      alertas.push({
        tipo: 'error',
        mensaje: 'Tasa de conversión muy baja - revisar proceso de ventas',
        valor: reporte.resumenEjecutivo.tasaConversion
      });
    }

    return alertas;
  }

  generarPasswordTemporal() {
    return Math.random().toString(36).slice(-8);
  }

  generarIdTransaccion() {
    return 'TXN_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5);
  }
}

module.exports = SistemaPreciosFacturacion;