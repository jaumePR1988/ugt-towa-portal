# Sistema de Precios y Facturación

## Descripción General

Sistema completo de gestión de precios, suscripciones y facturación para software empresarial. Incluye calculadora de precios, sistema de facturación automática, paquetes de soporte y generación de contratos.

## Estructura del Sistema

```
sistema-precios/
├── config/
│   └── estructura-precios.js          # Configuración de precios por tipo de empresa
├── calculadora/
│   └── calculadora-precios.js         # Calculadora interactiva de precios
├── facturacion/
│   └── sistema-suscripciones.js       # Sistema de suscripciones y facturación
├── soporte/
│   └── sistema-soporte.js             # Paquetes de soporte y mantenimiento
├── plantillas/
│   └── generador-contratos.js         # Generación de contratos
└── documentacion/
    └── README.md                      # Este archivo
```

## Características Principales

### 1. Estructura de Precios
- **4 tipos de empresa**: Micro, Mediana, Grande, Corporativo
- **3 modalidades de suscripción**: Mensual, Anual, Bianual
- **Módulos adicionales**: Reportes, API, Integraciones, etc.
- **Descuentos por volumen**: Hasta 20% para grandes volúmenes
- **Soporte multi-idioma**: Impuestos localizados

### 2. Sistema de Facturación Automática
- Generación automática de facturas
- Cobro automático por tarjeta de crédito
- Renumeración de suscripciones
- Reportes de facturación detallados
- Gestión de errores de cobro

### 3. Paquetes de Soporte
- **4 niveles de soporte**: Básico, Estándar, Premium, Enterprise
- SLAs garantizados desde 99% hasta 99.99%
- Tiempos de respuesta desde 48h hasta 30min
- Servicios adicionales: Backup, Auditorías, Multi-idioma

### 4. Calculadora de Precios
- Cálculo interactivo de precios
- Comparación de planes
- Cálculo de ROI estimado
- Generación de cotizaciones formales
- Aplicación de códigos de descuento

### 5. Generación de Contratos
- Contratos de suscripción
- Contratos de soporte
- Contratos enterprise
- Addons y renovaciones
- Plantillas legales completas

## Uso del Sistema

### Instalación

```javascript
const estructuraPrecios = require('./config/estructura-precios');
const CalculadoraPrecios = require('./calculadora/calculadora-precios');
const SistemaSuscripciones = require('./facturacion/sistema-suscripciones');
const SistemaSoporte = require('./soporte/sistema-soporte');
const GeneradorContratos = require('./plantillas/generador-contratos');
```

### Ejemplo de Uso Completo

```javascript
// 1. Crear calculadora
const calculadora = new CalculadoraPrecios();

// 2. Calcular precio
const configuracion = {
  tipoEmpresa: 'mediana',
  numeroEmpleados: 25,
  tipoSuscripcion: 'anual',
  modulosAdicionales: ['reportes_avanzados', 'api_acceso'],
  region: 'españa',
  descuentoCodigo: 'BIENVENIDO10'
};

const precio = calculadora.calcularPrecio(configuracion);
console.log('Precio calculado:', precio);

// 3. Generar cotización
const cliente = {
  nombre: 'Empresa Ejemplo S.L.',
  nif: 'B12345678',
  direccion: 'Calle Principal 123, Madrid',
  email: 'contacto@empresa.com'
};

const cotizacion = calculadora.generarCotizacion(cliente, configuracion);
console.log('Cotización generada:', cotizacion.numero);

// 4. Crear suscripción
const sistemaFacturacion = new SistemaSuscripciones();
const suscripcion = sistemaFacturacion.crearSuscripcion({
  empresa: 'mediana',
  tipoSuscripcion: 'anual',
  modulos: ['reportes_avanzados', 'api_acceso'],
  empleados: 25,
  region: 'españa'
});

console.log('Suscripción creada:', suscripcion.id);

// 5. Procesar facturación automática
const facturas = sistemaFacturacion.procesarFacturacionAutomatica();
console.log('Facturas procesadas:', facturas.length);

// 6. Generar contrato
const generadorContratos = new GeneradorContratos();
const contrato = generadorContratos.generarContratoSuscripcion(cliente, configuracion);
console.log('Contrato generado:', contrato.numero);

// 7. Crear soporte
const sistemaSoporte = new SistemaSoporte();
const contratoSoporte = sistemaSoporte.generarContratoSoporte(
  cliente, 
  'estandar', 
  ['backupDiario', 'auditoriaSeguridad']
);
console.log('Contrato de soporte:', contratoSoporte.numero);
```

## API Reference

### CalculadoraPrecios

#### `calcularPrecio(configuracion)`
Calcula el precio total basado en la configuración proporcionada.

**Parámetros:**
- `configuracion` (Object): Objeto con la configuración de precios

**Retorna:** Object con desglose completo de precios

#### `generarCotizacion(cliente, configuracion)`
Genera una cotización formal para un cliente.

**Parámetros:**
- `cliente` (Object): Información del cliente
- `configuracion` (Object): Configuración de precios

**Retorna:** Object con cotización completa

#### `compararPlanes(tipoEmpresa, numeroEmpleados, region)`
Compara diferentes planes de suscripción.

**Parámetros:**
- `tipoEmpresa` (string): Tipo de empresa
- `numeroEmpleados` (number): Número de empleados
- `region` (string): Región para impuestos

**Retorna:** Object con comparación de planes

### SistemaSuscripciones

#### `crearSuscripcion(cliente)`
Crea una nueva suscripción.

**Parámetros:**
- `cliente` (Object): Configuración del cliente

**Retorna:** Object con información de la suscripción

#### `procesarFacturacionAutomatica()`
Procesa la facturación automática de suscripciones activas.

**Retorna:** Array de facturas generadas

#### `generarReporteFacturacion(fechaDesde, fechaHasta)`
Genera reporte de facturación para un período.

**Parámetros:**
- `fechaDesde` (Date): Fecha de inicio del período
- `fechaHasta` (Date): Fecha de fin del período

**Retorna:** Object con reporte completo

### SistemaSoporte

#### `obtenerPaquetesDisponibles(tipoEmpresa)`
Obtiene paquetes de soporte disponibles para un tipo de empresa.

**Parámetros:**
- `tipoEmpresa` (string): Tipo de empresa

**Retorna:** Array de paquetes disponibles

#### `calcularPrecioTotalSoporte(tipoEmpresa, paqueteBase, serviciosAdicionales)`
Calcula el precio total de soporte y mantenimiento.

**Parámetros:**
- `tipoEmpresa` (string): Tipo de empresa
- `paqueteBase` (string): Paquete base de soporte
- `serviciosAdicionales` (Array): Servicios adicionales

**Retorna:** Object con cálculo de precios

#### `generarContratoSoporte(cliente, paquete, serviciosAdicionales)`
Genera contrato de soporte técnico.

**Parámetros:**
- `cliente` (Object): Información del cliente
- `paquete` (string): Paquete de soporte
- `serviciosAdicionales` (Array): Servicios adicionales

**Retorna:** Object con contrato de soporte

### GeneradorContratos

#### `generarContratoSuscripcion(datosCliente, configuracion)`
Genera contrato de suscripción.

**Parámetros:**
- `datosCliente` (Object): Datos del cliente
- `configuracion` (Object): Configuración de la suscripción

**Retorna:** Object con contrato completo

#### `generarContratoSoporte(datosCliente, paquete, servicios)`
Genera contrato de soporte técnico.

**Parámetros:**
- `datosCliente` (Object): Datos del cliente
- `paquete` (string): Paquete de soporte
- `servicios` (Array): Servicios incluidos

**Retorna:** Object con contrato de soporte

#### `generarAddonContrato(numeroContrato, tipo, datos)`
Genera addon a un contrato existente.

**Parámetros:**
- `numeroContrato` (string): Número del contrato base
- `tipo` (string): Tipo de addon
- `datos` (Object): Datos del addon

**Retorna:** Object con addon generado

## Configuración

### Variables de Entorno

```bash
# Base de datos
DATABASE_URL=postgresql://usuario:password@localhost:5432/precios_db

# Pasarela de pago
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Email
SMTP_HOST=smtp.empresa.com
SMTP_PORT=587
SMTP_USER=noreply@empresa.com
SMTP_PASS=password

# Facturación
FACTURACION_API_KEY=your_api_key
FACTURACION_BASE_URL=https://api.facturacion.com
```

### Base de Datos

El sistema requiere las siguientes tablas principales:

```sql
-- Clientes
CREATE TABLE clientes (
  id VARCHAR(50) PRIMARY KEY,
  nombre VARCHAR(255) NOT NULL,
  nif VARCHAR(20) UNIQUE,
  email VARCHAR(255) NOT NULL,
  telefono VARCHAR(20),
  direccion TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Suscripciones
CREATE TABLE suscripciones (
  id VARCHAR(50) PRIMARY KEY,
  cliente_id VARCHAR(50) REFERENCES clientes(id),
  tipo_empresa VARCHAR(20) NOT NULL,
  tipo_suscripcion VARCHAR(20) NOT NULL,
  precio_base DECIMAL(10,2),
  modulos_adicionales JSON,
  fecha_inicio DATE NOT NULL,
  fecha_fin DATE NOT NULL,
  estado VARCHAR(20) DEFAULT 'activa',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Facturas
CREATE TABLE facturas (
  id VARCHAR(50) PRIMARY KEY,
  suscripcion_id VARCHAR(50) REFERENCES suscripciones(id),
  numero_factura VARCHAR(50) UNIQUE,
  fecha_emision DATE NOT NULL,
  fecha_vencimiento DATE NOT NULL,
  subtotal DECIMAL(10,2),
  impuestos DECIMAL(10,2),
  total DECIMAL(10,2),
  estado VARCHAR(20) DEFAULT 'pendiente',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tickets de soporte
CREATE TABLE tickets_soporte (
  id VARCHAR(50) PRIMARY KEY,
  cliente_id VARCHAR(50) REFERENCES clientes(id),
  prioridad VARCHAR(20) NOT NULL,
  categoria VARCHAR(50) NOT NULL,
  descripcion TEXT,
  estado VARCHAR(20) DEFAULT 'abierto',
  fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Cron Jobs

### Facturación Automática

```javascript
// Ejecutar cada día a las 09:00
const cronFacturacion = '0 9 * * *';
```

```javascript
// Función de facturación
async function ejecutarFacturacion() {
  const sistema = new SistemaSuscripciones();
  const facturas = sistema.procesarFacturacionAutomatica();
  
  for (const factura of facturas) {
    if (factura.estado === 'pagada') {
      // Enviar factura por email
      await enviarFacturaEmail(factura);
    } else {
      // Notificar fallo de cobro
      await notificarErrorCobro(factura);
    }
  }
}
```

### Renovaciones de Contratos

```javascript
// Ejecutar cada semana
const cronRenovaciones = '0 9 * * 1';
```

```javascript
async function verificarRenovaciones() {
  const sistema = new SistemaSuscripciones();
  const contratos = await obtenerContratosPorRenovar(30); // 30 días
  
  for (const contrato of contratos) {
    if (contrato.renovacionAutomatica) {
      await procesarRenovacionAutomatica(contrato);
    } else {
      await notificarRenovacionManual(contrato);
    }
  }
}
```

## Integración con Pasarelas de Pago

### Stripe

```javascript
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

async function crearPagoAutomatico(factura, suscripcion) {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(factura.total * 100), // Centavos
      currency: 'eur',
      customer: suscripcion.stripeCustomerId,
      payment_method: suscripcion.defaultPaymentMethodId,
      confirm: true,
      metadata: {
        factura_numero: factura.numero,
        suscripcion_id: suscripcion.id
      }
    });
    
    return {
      exitoso: paymentIntent.status === 'succeeded',
      transaccionId: paymentIntent.id,
      error: paymentIntent.last_payment_error?.message
    };
  } catch (error) {
    return {
      exitoso: false,
      error: error.message
    };
  }
}
```

### Webhook de Stripe

```javascript
app.post('/webhook/stripe', express.raw({type: 'application/json'}), (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;
  
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.log('Error de webhook:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }
  
  switch (event.type) {
    case 'payment_intent.succeeded':
      const pago = event.data.object;
      await actualizarEstadoFactura(pago.metadata.factura_numero, 'pagada');
      break;
      
    case 'payment_intent.payment_failed':
      const fallo = event.data.object;
      await notificarErrorCobro(fallo.metadata.factura_numero, fallo.last_payment_error.message);
      break;
  }
  
  res.json({received: true});
});
```

## Notificaciones y Emails

### Templates de Email

```javascript
const templatesEmail = {
  facturaPagada: {
    subject: 'Factura {{numero_factura}} - Pagada',
    html: `
      <h2>Factura Pagada</h2>
      <p>Estimado/a {{nombre_cliente}},</p>
      <p>Su factura {{numero_factura}} por un importe de {{importe}} ha sido procesada correctamente.</p>
      <p><a href="{{enlace_factura}}">Ver factura</a></p>
    `
  },
  
  errorCobro: {
    subject: 'Error en el cobro - Factura {{numero_factura}}',
    html: `
      <h2>Error en el Cobro</h2>
      <p>Estimado/a {{nombre_cliente}},</p>
      <p>No hemos podido procesar el cobro de su factura {{numero_factura}}.</p>
      <p>Motivo: {{motivo_error}}</p>
      <p>Por favor, actualice su método de pago en su panel de cliente.</p>
    `
  },
  
  renovacionProxima: {
    subject: 'Su suscripción vence el {{fecha_vencimiento}}',
    html: `
      <h2>Renovación de Suscripción</h2>
      <p>Estimado/a {{nombre_cliente}},</p>
      <p>Su suscripción vence el {{fecha_vencimiento}}.</p>
      <p><a href="{{enlace_renovacion}}">Renovar ahora</a></p>
    `
  }
};
```

## Testing

### Tests Unitarios

```javascript
// tests/calculadora.test.js
const { CalculadoraPrecios } = require('../calculadora/calculadora-precios');

describe('CalculadoraPrecios', () => {
  let calculadora;
  
  beforeEach(() => {
    calculadora = new CalculadoraPrecios();
  });
  
  test('debería calcular precio para microempresa', () => {
    const config = {
      tipoEmpresa: 'micro',
      numeroEmpleados: 5,
      tipoSuscripcion: 'mensual'
    };
    
    const precio = calculadora.calcularPrecio(config);
    
    expect(precio.desglose.total).toBe(29);
  });
  
  test('debería aplicar descuentos anuales', () => {
    const config = {
      tipoEmpresa: 'mediana',
      numeroEmpleados: 15,
      tipoSuscripcion: 'anual'
    };
    
    const precio = calculadora.calcularPrecio(config);
    const ahorro = precio.resumen.ahorroAnual;
    
    expect(ahorro).toBeGreaterThan(0);
  });
});
```

### Tests de Integración

```javascript
// tests/integracion.test.js
describe('Sistema de Facturación Completo', () => {
  test('debería crear suscripción y generar factura', async () => {
    // Crear cliente
    const cliente = { /* datos del cliente */ };
    
    // Crear suscripción
    const sistema = new SistemaSuscripciones();
    const suscripcion = await sistema.crearSuscripcion(cliente);
    
    // Procesar facturación
    const facturas = await sistema.procesarFacturacionAutomatica();
    
    expect(facturas).toHaveLength(1);
    expect(facturas[0].idSuscripcion).toBe(suscripcion.id);
  });
});
```

## Monitoreo y Métricas

### Métricas Clave

```javascript
const metricas = {
  facturacion: {
    ingresosMensuales: 'SUM(total_facturas)',
    facturasProcesadas: 'COUNT(facturas)',
    tasaCobroExitoso: 'facturas_pagadas / total_facturas * 100',
    tiempoPromedioCobro: 'AVG(fecha_pago - fecha_emision)'
  },
  
  suscripciones: {
    suscripcionesActivas: 'COUNT(estado = "activa")',
    nuevasSuscripciones: 'COUNT(fecha_creacion >= hoy)',
    renovacionesExitosas: 'COUNT(renovacion_exitosa)',
    churnRate: 'suscripciones_canceladas / total * 100'
  },
  
  soporte: {
    ticketsResueltos: 'COUNT(estado = "resuelto")',
    tiempoPromedioResolucion: 'AVG(fecha_resolucion - fecha_creacion)',
    satisfaccionCliente: 'AVG(rating)',
    slaCumplido: 'tickets_en_tiempo / total * 100'
  }
};
```

### Dashboard de Métricas

```javascript
const dashboard = {
  fecha: new Date(),
  resumen: {
    ingresosMes: 0,
    suscripcionesActivas: 0,
    ticketsAbiertos: 0,
    satisfaccionPromedio: 0
  },
  graficos: {
    ingresosPorTipoEmpresa: {},
    suscripcionesPorPlan: {},
    ticketsPorCategoria: {}
  }
};
```

## Deployment

### Docker

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 3000

CMD ["node", "app.js"]
```

### Variables de Producción

```bash
# Producción
NODE_ENV=production
DATABASE_URL=postgresql://user:pass@prod-db:5432/precios
REDIS_URL=redis://prod-redis:6379
STRIPE_SECRET_KEY=sk_live_...
SMTP_HOST=smtp.prod.com
```

### CI/CD

```yaml
# .github/workflows/deploy.yml
name: Deploy Sistema de Precios

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm ci
      - run: npm test
  
  deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to production
        run: |
          # Scripts de deployment
```

## Contribución

1. Fork del repositorio
2. Crear branch de feature (`git checkout -b feature/nueva-caracteristica`)
3. Commit de cambios (`git commit -am 'Agregar nueva característica'`)
4. Push al branch (`git push origin feature/nueva-caracteristica`)
5. Crear Pull Request

## Licencia

Este proyecto está bajo la Licencia MIT. Ver archivo `LICENSE` para más detalles.

## Soporte

Para soporte técnico o consultas comerciales:
- Email: soporte@empresa.com
- Teléfono: +34 900 123 456
- Chat: [Portal de soporte](https://soporte.empresa.com)

---

**Última actualización:** Noviembre 2025
**Versión:** 1.0.0