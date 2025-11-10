// Ejemplo de uso del Sistema de Precios y Facturación
const SistemaPreciosFacturacion = require('./sistema-principal');
const { calcularPrecio } = require('./calculadora/calculadora-precios');
const { generarContratoSuscripcion } = require('./plantillas/generador-contratos');

async function ejemploCompleto() {
  console.log('=== EJEMPLO DE USO DEL SISTEMA DE PRECIOS Y FACTURACIÓN ===\n');

  // Crear instancia del sistema
  const sistema = new SistemaPreciosFacturacion();

  // === EJEMPLO 1: Cálculo de precios ===
  console.log('1. CÁLCULO DE PRECIOS');
  console.log('----------------------');

  const configuracion1 = {
    tipoEmpresa: 'mediana',
    numeroEmpleados: 25,
    tipoSuscripcion: 'anual',
    modulosAdicionales: ['reportes_avanzados', 'api_acceso', 'auditoria_seguridad'],
    region: 'españa',
    descuentoCodigo: 'BIENVENIDO10'
  };

  const calculadora = new (require('./calculadora/calculadora-precios'))();
  const precio1 = calculadora.calcularPrecio(configuracion1);

  console.log(`Empresa: ${precio1.configuracion.tipoEmpresa}`);
  console.log(`Empleados: ${precio1.configuracion.numeroEmpleados}`);
  console.log(`Suscripción: ${precio1.configuracion.tipoSuscripcion}`);
  console.log(`Precio total: ${precio1.desglose.total.toFixed(2)}€`);
  console.log(`Precio mensual: ${precio1.resumen.precioMensual.toFixed(2)}€`);
  console.log(`Ahorro anual: ${precio1.resumen.ahorroAnual.toFixed(2)}€`);
  console.log(`ROI estimado: ${precio1.resumen.roiEstimado.roiMensual}%\n`);

  // === EJEMPLO 2: Comparación de planes ===
  console.log('2. COMPARACIÓN DE PLANES');
  console.log('------------------------');

  const comparacion = sistema.mostrarComparacionPlanes('mediana', 25, 'españa');

  // === EJEMPLO 3: Generación de cotización ===
  console.log('\n3. GENERACIÓN DE COTIZACIÓN');
  console.log('---------------------------');

  const clienteEjemplo = {
    nombre: 'Tech Solutions S.L.',
    nif: 'B12345678',
    direccion: 'Calle Tecnología 123, 28001 Madrid',
    email: 'contacto@techsolutions.com',
    telefono: '+34 91 123 45 67',
    contacto: 'Juan Pérez',
    cargo: 'Director IT'
  };

  const cotizacion = calculadora.generarCotizacion(clienteEjemplo, configuracion1);
  
  console.log(`Cotización: ${cotizacion.numero}`);
  console.log(`Fecha: ${cotizacion.fecha}`);
  console.log(`Válida hasta: ${cotizacion.fechaVencimiento}`);
  console.log(`Precio: ${cotizacion.desglose.total.toFixed(2)}€`);
  console.log(`Contacto ventas: ${cotizacion.contactoVentas.email}\n`);

  // === EJEMPLO 4: Proceso completo de cliente ===
  console.log('4. PROCESO COMPLETO DE CLIENTE');
  console.log('------------------------------');

  const configuracionCompleta = {
    tipoEmpresa: 'grande',
    numeroEmpleados: 75,
    tipoSuscripcion: 'anual',
    modulosAdicionales: [
      'reportes_avanzados', 
      'api_acceso', 
      'auditoria_seguridad',
      'personalizacion_completa'
    ],
    region: 'francia',
    paqueteSoporte: 'premium',
    serviciosSoporte: ['backupDiario', 'auditoriaSeguridad'],
    descuentoCodigo: 'ENTERPRISE15'
  };

  try {
    const resultadoCompleto = await sistema.procesoCompletoCliente(
      clienteEjemplo, 
      configuracionCompleta
    );

    if (resultadoCompleto.exitoso) {
      console.log('✅ Proceso completado exitosamente');
      console.log(`- Suscripción: ${resultadoCompleto.suscripcion.id}`);
      console.log(`- Contrato: ${resultadoCompleto.contratoSuscripcion.numero}`);
      console.log(`- Pago: ${resultadoCompleto.pagoInicial.transaccionId}`);
      console.log(`- Activación: ${resultadoCompleto.activacion.fechaActivacion}`);
      console.log(`- Onboarding: ${resultadoCompleto.onboarding.completados}/${resultadoCompleto.onboarding.total} pasos`);
      
      console.log('\nPróximos pasos:');
      resultadoCompleto.proximosPasos.forEach((paso, index) => {
        console.log(`  ${index + 1}. ${paso}`);
      });
    } else {
      console.log('❌ Error en el proceso:', resultadoCompleto.error);
    }
  } catch (error) {
    console.log('❌ Error:', error.message);
  }

  // === EJEMPLO 5: Sistema de soporte ===
  console.log('\n\n5. SISTEMA DE SOPORTE');
  console.log('--------------------');

  const sistemaSoporte = new (require('./soporte/sistema-soporte'))();
  
  // Obtener paquetes disponibles
  const paquetesDisponibles = sistemaSoporte.obtenerPaquetesDisponibles('grande');
  console.log('Paquetes disponibles para empresa grande:');
  paquetesDisponibles.forEach(paquete => {
    console.log(`- ${paquete.nombre}: ${paquete.precioActual}€/mes`);
    console.log(`  SLA: ${paquete.caracteristicas.sla}`);
    console.log(`  Respuesta: ${paquete.caracteristicas.tiempoRespuesta}`);
  });

  // Calcular precio de soporte
  const precioSoporte = sistemaSoporte.calcularPrecioTotalSoporte(
    'grande',
    'premium',
    ['backupDiario', 'auditoriaSeguridad']
  );

  console.log(`\nPrecio soporte: ${precioSoporte.precioTotal}€/mes`);
  console.log(`Servicios incluidos: ${precioSoporte.serviciosIncluidos.length}`);

  // === EJEMPLO 6: Generación de contratos ===
  console.log('\n\n6. GENERACIÓN DE CONTRATOS');
  console.log('--------------------------');

  const generadorContratos = new (require('./plantillas/generador-contratos'))();

  // Contrato de suscripción
  const contrato = generadorContratos.generarContratoSuscripcion(
    clienteEjemplo,
    configuracion1
  );

  console.log('Contrato de suscripción generado:');
  console.log(`- Número: ${contrato.numero}`);
  console.log(`- Fecha: ${contrato.fecha}`);
  console.log(`- Vigencia: ${contrato.vigencia.inicio} - ${contrato.vigencia.fin}`);
  console.log(`- Precio: ${contrato.precio.total}€`);

  // Contrato de soporte
  const contratoSoporte = generadorContratos.generarContratoSoporte(
    clienteEjemplo,
    'premium',
    ['backupDiario', 'auditoriaSeguridad']
  );

  console.log('\nContrato de soporte generado:');
  console.log(`- Número: ${contratoSoporte.numero}`);
  console.log(`- Paquete: ${contratoSoporte.objeto.paquete}`);
  console.log(`- SLA: ${contratoSoporte.sla.disponibilidad}`);

  // === EJEMPLO 7: Reporte de facturación ===
  console.log('\n\n7. REPORTE DE FACTURACIÓN');
  console.log('------------------------');

  const sistemaFacturacion = new (require('./facturacion/sistema-suscripciones'))();
  
  const fechaDesde = new Date('2025-01-01');
  const fechaHasta = new Date('2025-11-30');
  
  const reporte = sistemaFacturacion.generarReporteFacturacion(fechaDesde, fechaHasta);
  
  console.log('Reporte de facturación:');
  console.log(`- Período: ${reporte.periodo.desde} - ${reporte.periodo.hasta}`);
  console.log(`- Total facturas: ${reporte.totalFacturas}`);
  console.log(`- Ingresos totales: ${reporte.totalIngresos.toFixed(2)}€`);
  console.log(`- Facturas pagadas: ${reporte.facturasPagadas}`);
  console.log(`- Facturas pendientes: ${reporte.facturasPendientes}`);
  console.log(`- Tasa de cobro: ${((reporte.facturasPagadas / reporte.totalFacturas) * 100).toFixed(1)}%`);

  // === EJEMPLO 8: Renovación automática ===
  console.log('\n\n8. RENOVACIÓN AUTOMÁTICA');
  console.log('------------------------');

  try {
    const renovaciones = await sistema.procesoRenovacionAutomatica();
    console.log('Resultado de renovación automática:');
    console.log(`- Renovaciones exitosas: ${renovaciones.renovacionesExitosas}`);
    console.log(`- Renovaciones fallidas: ${renovaciones.renovacionesFallidas}`);
    console.log(`- Notificaciones enviadas: ${renovaciones.notificacionesEnviadas}`);
  } catch (error) {
    console.log('Error en renovación automática:', error.message);
  }

  // === EJEMPLO 9: Reporte completo de negocio ===
  console.log('\n\n9. REPORTE COMPLETO DE NEGOCIO');
  console.log('------------------------------');

  try {
    const reporteCompleto = await sistema.generarReporteCompleto(fechaDesde, fechaHasta);
    
    console.log('Resumen ejecutivo:');
    console.log(`- Ingresos totales: ${reporteCompleto.resumenEjecutivo.ingresosTotales.toFixed(2)}€`);
    console.log(`- Nuevas suscripciones: ${reporteCompleto.resumenEjecutivo.nuevasSuscripciones}`);
    console.log(`- Tasa conversión: ${reporteCompleto.resumenEjecutivo.tasaConversion}%`);
    console.log(`- Clientes activos: ${reporteCompleto.resumenEjecutivo.clientesActivos}`);
    console.log(`- Churn rate: ${reporteCompleto.resumenEjecutivo.churnRate}%`);
    console.log(`- LTV: ${reporteCompleto.resumenEjecutivo.ltv}€`);
    console.log(`- CAC: ${reporteCompleto.resumenEjecutivo.cac}€`);
    console.log(`- ROI: ${reporteCompleto.resumenEjecutivo.roi.toFixed(2)}x`);

    console.log('\nRecomendaciones estratégicas:');
    reporteCompleto.recomendaciones.forEach((rec, index) => {
      console.log(`  ${index + 1}. ${rec}`);
    });

    if (reporteCompleto.alertas.length > 0) {
      console.log('\nAlertas:');
      reporteCompleto.alertas.forEach(alerta => {
        console.log(`  ⚠️  ${alerta.tipo.toUpperCase()}: ${alerta.mensaje}`);
      });
    }
  } catch (error) {
    console.log('Error generando reporte:', error.message);
  }

  console.log('\n=== FIN DEL EJEMPLO ===');
}

// Ejecutar ejemplo
if (require.main === module) {
  ejemploCompleto().catch(console.error);
}

module.exports = { ejemploCompleto };