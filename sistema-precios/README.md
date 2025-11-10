# 💰 Sistema de Precios y Facturación

Sistema completo de gestión de precios, suscripciones y facturación para empresas de software y servicios SaaS.

## 📋 Índice

- [Características](#características)
- [Arquitectura](#arquitectura)
- [Instalación](#instalación)
- [Uso Rápido](#uso-rápido)
- [Módulos](#módulos)
- [API Reference](#api-reference)
- [Casos de Uso](#casos-de-uso)
- [Documentación](#documentación)
- [Contribución](#contribución)

## ✨ Características

### 🏢 Gestión de Precios por Empresa
- **4 tipos de empresa**: Micro (1-10), Mediana (11-50), Grande (51+), Corporativo (500+)
- **3 modalidades**: Mensual, Anual, Bianual
- **Módulos adicionales**: Reportes, API, Integraciones, Auditorías
- **Descuentos por volumen**: Hasta 20% para grandes volúmenes
- **Soporte multi-región**: Impuestos localizados (IVA, TVA, MwSt)

### 💳 Facturación Automática
- Generación automática de facturas
- Cobro automático por tarjeta (Stripe)
- Renumeración inteligente de suscripciones
- Reportes detallados de facturación
- Gestión de errores y reintentos

### 🛠️ Soporte y Mantenimiento
- **4 niveles de soporte**: Básico, Estándar, Premium, Enterprise
- **SLAs garantizados**: Desde 99% hasta 99.99%
- **Tiempos de respuesta**: Desde 48h hasta 30min
- **Servicios adicionales**: Backup, Auditorías, Multi-idioma

### 🧮 Calculadora de Precios
- Cálculo interactivo en tiempo real
- Comparación de planes
- Cálculo de ROI estimado
- Códigos de descuento
- Generación de cotizaciones formales

### 📄 Generación de Contratos
- Contratos de suscripción legales
- Contratos de soporte técnico
- Contratos enterprise
- Addons y renovaciones
- Plantillas legales completas

## 🏗️ Arquitectura

```
sistema-precios/
├── config/                     # Configuraciones
│   └── estructura-precios.js   # Tabla de precios base
├── calculadora/                # Módulo de cálculo
│   └── calculadora-precios.js  # Calculadora interactiva
├── facturacion/                # Sistema de facturación
│   └── sistema-suscripciones.js # Suscripciones y cobros
├── soporte/                    # Gestión de soporte
│   └── sistema-soporte.js      # Paquetes de soporte
├── plantillas/                 # Generación de contratos
│   └── generador-contratos.js  # Contratos legales
├── documentacion/              # Documentación técnica
│   └── README.md              # Documentación completa
├── scripts/                    # Scripts de migración
│   └── migration.sql          # Base de datos
├── sistema-principal.js        # Sistema integrado
├── ejemplo-uso.js             # Ejemplos de uso
├── package.json               # Dependencias
└── .env.example               # Variables de entorno
```

## 🚀 Instalación

### Requisitos
- Node.js >= 16.0.0
- PostgreSQL >= 13
- Redis >= 6
- Cuenta de Stripe (para pagos)

### Pasos de instalación

1. **Clonar repositorio**
```bash
git clone https://github.com/empresa/sistema-precios-facturacion.git
cd sistema-precios-facturacion
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**
```bash
cp .env.example .env
# Editar .env con tus credenciales
```

4. **Configurar base de datos**
```bash
# Crear base de datos
createdb precios_facturacion

# Ejecutar migración
psql precios_facturacion < scripts/migration.sql
```

5. **Iniciar el sistema**
```bash
npm start
```

## ⚡ Uso Rápido

### Ejemplo básico de cálculo de precios

```javascript
const CalculadoraPrecios = require('./calculadora/calculadora-precios');

const calculadora = new CalculadoraPrecios();

const configuracion = {
  tipoEmpresa: 'mediana',
  numeroEmpleados: 25,
  tipoSuscripcion: 'anual',
  modulosAdicionales: ['reportes_avanzados', 'api_acceso'],
  region: 'españa'
};

const precio = calculadora.calcularPrecio(configuracion);
console.log('Precio total:', precio.desglose.total.toFixed(2), '€');
console.log('Precio mensual:', precio.resumen.precioMensual.toFixed(2), '€');
```

### Proceso completo de cliente

```javascript
const SistemaPreciosFacturacion = require('./sistema-principal');

const sistema = new SistemaPreciosFacturacion();

const cliente = {
  nombre: 'Tech Solutions S.L.',
  nif: 'B12345678',
  email: 'contacto@techsolutions.com',
  // ... más datos
};

const configuracion = {
  tipoEmpresa: 'grande',
  numeroEmpleados: 75,
  tipoSuscripcion: 'anual',
  modulosAdicionales: ['reportes_avanzados', 'api_acceso'],
  paqueteSoporte: 'premium',
  region: 'españa'
};

// Proceso completo: cotización → contrato → facturación
const resultado = await sistema.procesoCompletoCliente(cliente, configuracion);

if (resultado.exitoso) {
  console.log('Cliente activado:', resultado.suscripcion.id);
  console.log('Contrato:', resultado.contratoSuscripcion.numero);
}
```

## 📦 Módulos

### 1. Calculadora de Precios (`calculadora/`)
- Cálculo de precios en tiempo real
- Comparación de planes
- Cálculo de ROI
- Generación de cotizaciones
- Aplicación de descuentos

### 2. Sistema de Suscripciones (`facturacion/`)
- Gestión de suscripciones
- Facturación automática
- Renovaciones
- Reportes de facturación
- Integración con Stripe

### 3. Sistema de Soporte (`soporte/`)
- Paquetes de soporte
- SLAs garantizados
- Gestión de tickets
- Contratos de soporte
- Reportes de soporte

### 4. Generador de Contratos (`plantillas/`)
- Contratos de suscripción
- Contratos de soporte
- Addons
- Renovaciones
- Plantillas legales

### 5. Configuración (`config/`)
- Estructura de precios
- Tipos de empresa
- Módulos disponibles
- Descuentos
- Impuestos por región

## 🔌 API Reference

### CalculadoraPrecios

#### `calcularPrecio(configuracion)`
Calcula el precio total basado en configuración.

**Parámetros:**
- `configuracion` (Object)
  - `tipoEmpresa` (string): 'micro', 'mediana', 'grande', 'corporativo'
  - `numeroEmpleados` (number): 1-10000
  - `tipoSuscripcion` (string): 'mensual', 'anual', 'bianual'
  - `modulosAdicionales` (Array): Lista de módulos
  - `region` (string): Región para impuestos

**Retorna:**
```javascript
{
  configuracion: { ... },
  desglose: {
    suscripcionBase: { concepto, precio },
    modulosAdicionales: [...],
    subtotal: number,
    descuentos: { total: number },
    impuestos: { tasa, importe },
    total: number
  },
  resumen: {
    precioMensual: number,
    ahorroAnual: number,
    roiEstimado: { roiMensual, beneficioMensualEstimado }
  }
}
```

### SistemaSuscripciones

#### `crearSuscripcion(cliente)`
Crea una nueva suscripción.

#### `procesarFacturacionAutomatica()`
Procesa facturas automáticas.

#### `generarReporteFacturacion(fechaDesde, fechaHasta)`
Genera reporte de facturación.

### SistemaSoporte

#### `obtenerPaquetesDisponibles(tipoEmpresa)`
Obtiene paquetes de soporte.

#### `calcularPrecioTotalSoporte(tipoEmpresa, paqueteBase, serviciosAdicionales)`
Calcula precio de soporte.

#### `generarContratoSoporte(cliente, paquete, servicios)`
Genera contrato de soporte.

## 💼 Casos de Uso

### Caso 1: Startup en Crecimiento
```javascript
// Empresa: 15 empleados
// Necesidades: Gestión básica + API
const config = {
  tipoEmpresa: 'mediana',
  numeroEmpleados: 15,
  tipoSuscripcion: 'anual',
  modulosAdicionales: ['api_acceso'],
  region: 'españa'
};
// Resultado: 790€/año (vs 948€ mensual)
```

### Caso 2: Empresa Establecida
```javascript
// Empresa: 50 empleados
// Necesidades: Reportes + Soporte Premium
const config = {
  tipoEmpresa: 'grande',
  numeroEmpleados: 50,
  tipoSuscripcion: 'anual',
  modulosAdicionales: ['reportes_avanzados', 'auditoria_seguridad'],
  paqueteSoporte: 'premium',
  region: 'españa'
};
// Resultado: 1,665€/año total
```

### Caso 3: Corporación
```javascript
// Empresa: 500+ empleados
// Necesidades: Solución enterprise completa
const config = {
  tipoEmpresa: 'corporativo',
  numeroEmpleados: 500,
  tipoSuscripcion: 'anual',
  modulosAdicionales: ['personalizacion_completa', 'soporte_dedicado'],
  paqueteSoporte: 'enterprise',
  region: 'españa'
};
// Resultado: Personalizado con contrato dedicado
```

## 📊 Métricas y Reportes

### Reporte de Negocio
```javascript
const reporte = await sistema.generarReporteCompleto(fechaDesde, fechaHasta);

console.log('Resumen Ejecutivo:');
console.log('- Ingresos totales:', reporte.resumenEjecutivo.ingresosTotales);
console.log('- Nuevas suscripciones:', reporte.resumenEjecutivo.nuevasSuscripciones);
console.log('- Tasa conversión:', reporte.resumenEjecutivo.tasaConversion + '%');
console.log('- Churn rate:', reporte.resumenEjecutivo.churnRate + '%');
console.log('- LTV:', reporte.resumenEjecutivo.ltv + '€');
console.log('- CAC:', reporte.resumenEjecutivo.cac + '€');
```

### Métricas Clave
- **Ingresos Recurrentes Mensuales (MRR)**
- **Ingresos Recurrentes Anuales (ARR)**
- **Valor de Vida del Cliente (LTV)**
- **Costo de Adquisición (CAC)**
- **Tasa de Churn**
- **Net Revenue Retention (NRR)**

## 🔧 Configuración

### Variables de Entorno

```bash
# Base de datos
DATABASE_URL=postgresql://user:pass@localhost:5432/precios_facturacion
REDIS_URL=redis://localhost:6379

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Email
SMTP_HOST=smtp.gmail.com
SMTP_USER=noreply@empresa.com
SMTP_PASS=password

# Otros
PORT=3000
NODE_ENV=production
```

### Integración con Stripe

1. **Configurar webhooks en Stripe:**
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `customer.subscription.updated`

2. **Configurar productos y precios en Stripe**
3. **Sincronizar suscripciones automáticamente**

## 🧪 Testing

```bash
# Ejecutar tests
npm test

# Tests con cobertura
npm run test:coverage

# Tests en modo watch
npm run test:watch
```

## 📈 Monitoreo

### Métricas de Negocio
- Ingresos por tipo de empresa
- Conversión de cotizaciones
- Tasa de renovación
- Churn por plan

### Métricas Técnicas
- Tiempo de facturación
- Tasa de éxito de cobros
- Uptime del sistema
- SLA de soporte

## 🚀 Deployment

### Docker
```bash
docker build -t sistema-precios .
docker run -p 3000:3000 sistema-precios
```

### Producción
```bash
# Build
npm run build

# Migrar BD
npm run migrate

# Iniciar
npm start
```

## 📚 Documentación

- **[Documentación Técnica](documentacion/README.md)** - Documentación completa del API
- **[Ejemplos de Uso](ejemplo-uso.js)** - Casos de uso prácticos
- **[Migración de BD](scripts/migration.sql)** - Esquema de base de datos

## 🤝 Contribución

1. Fork del repositorio
2. Crear branch de feature (`git checkout -b feature/nueva-caracteristica`)
3. Commit de cambios (`git commit -am 'Agregar nueva característica'`)
4. Push al branch (`git push origin feature/nueva-caracteristica`)
5. Crear Pull Request

### Estructura de commits
- `feat:` Nueva característica
- `fix:` Corrección de bug
- `docs:` Cambios en documentación
- `style:` Formateo de código
- `refactor:` Refactorización
- `test:` Tests
- `chore:` Mantenimiento

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver [LICENSE](LICENSE) para más detalles.

## 🆘 Soporte

- **Email:** soporte@empresa.com
- **Documentación:** [docs.empresa.com](https://docs.empresa.com)
- **Issues:** [GitHub Issues](https://github.com/empresa/sistema-precios-facturacion/issues)
- **Discord:** [Comunidad](https://discord.gg/empresa)

## 📋 Changelog

### v1.0.0 (2025-11-11)
- ✅ Sistema de precios por tipo de empresa
- ✅ Facturación automática con Stripe
- ✅ 4 niveles de soporte
- ✅ Calculadora de precios interactiva
- ✅ Generación de contratos legales
- ✅ API completa
- ✅ Reportes de negocio
- ✅ Migración de base de datos
- ✅ Tests unitarios
- ✅ Documentación completa

---

**Desarrollado con ❤️ por el Equipo de Desarrollo de Empresa de Software S.L.**