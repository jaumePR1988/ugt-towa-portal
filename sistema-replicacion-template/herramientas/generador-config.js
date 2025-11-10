#!/usr/bin/env node

/**
 * Generador de Configuraciones
 * 
 * Genera configuraciones avanzadas y personalizadas para cada empresa
 * basadas en casos de uso específicos y sectores.
 */

const fs = require('fs');
const path = require('path');

class GeneradorConfiguraciones {
    constructor() {
        this.configsDir = path.join(__dirname, '../plantillas/');
        this.outputDir = path.join(__dirname, '../../configuraciones/');
        this.casosUso = this.loadCasosUso();
        this.sectores = this.loadSectores();
    }

    /**
     * Carga los casos de uso predefinidos
     */
    loadCasosUso() {
        return {
            basico: {
                nombre: "Configuración Básica",
                descripcion: "Configuración mínima para empresas pequeñas",
                funcionalidades: {
                    citas: true,
                    comunicados: true,
                    comentarios: false,
                    reacciones: false,
                    encuestas: false,
                    newsletter: false,
                    notificaciones: true,
                    estadisticas: false,
                    exportacion: false
                },
                tiposCitas: [
                    { id: "general", nombre: "Consulta General", duracion: 30 }
                ]
            },
            completo: {
                nombre: "Configuración Completa",
                descripcion: "Configuración completa con todas las funcionalidades",
                funcionalidades: {
                    citas: true,
                    comunicados: true,
                    comentarios: true,
                    reacciones: true,
                    encuestas: true,
                    newsletter: true,
                    notificaciones: true,
                    estadisticas: true,
                    exportacion: true
                },
                tiposCitas: [
                    { id: "sindical", nombre: "Asuntos Sindicales", duracion: 60 },
                    { id: "prevencion", nombre: "Prevención", duracion: 45 },
                    { id: "ayuda", nombre: "Ayuda Social", duracion: 30 }
                ]
            },
            corporativo: {
                nombre: "Configuración Corporativa",
                descripcion: "Configuración para grandes corporaciones",
                funcionalidades: {
                    citas: true,
                    comunicados: true,
                    comentarios: true,
                    reacciones: true,
                    encuestas: true,
                    newsletter: true,
                    notificaciones: true,
                    estadisticas: true,
                    exportacion: true,
                    multi_departamento: true,
                    reportes_avanzados: true,
                    integracion_api: true
                },
                tiposCitas: [
                    { id: "direccion", nombre: "Dirección", duracion: 45 },
                    { id: "rrhh", nombre: "Recursos Humanos", duracion: 60 },
                    { id: "sindical", nombre: "Representación Sindical", duracion: 60 },
                    { id: "prevencion", nombre: "Prevención de Riesgos", duracion: 45 },
                    { id: "formacion", nombre: "Formación", duracion: 90 }
                ]
            },
            educativo: {
                nombre: "Configuración Educativa",
                descripcion: "Configuración para centros educativos",
                funcionalidades: {
                    citas: true,
                    comunicados: true,
                    comentarios: true,
                    reacciones: true,
                    encuestas: true,
                    newsletter: true,
                    notificaciones: true,
                    estadisticas: true,
                    exportacion: true,
                    calendario_academico: true,
                    eventos_especiales: true
                },
                tiposCitas: [
                    { id: "docente", nombre: "Asuntos Docentes", duracion: 45 },
                    { id: "estudiante", nombre: "Representación Estudiantil", duracion: 30 },
                    { id: "administrativo", nombre: "Personal Administrativo", duracion: 30 },
                    { id: "orientacion", nombre: "Orientación", duracion: 60 }
                ]
            }
        };
    }

    /**
     * Carga las configuraciones de sectores
     */
    loadSectores() {
        return {
            industrial: {
                nombre: "Sector Industrial",
                caracteristicas: [
                    "Alta especialización en seguridad",
                    "Convenios colectivos específicos",
                    "Representación por turnos",
                    "Comités de empresa activos"
                ],
                tiposCitas: [
                    {
                        id: "sindical",
                        nombre: "Representación Sindical",
                        descripcion: "Consultas con delegados sindicales",
                        icon: "Users",
                        duracion: 60,
                        color: "#1e40af"
                    },
                    {
                        id: "seguridad",
                        nombre: "Seguridad Industrial",
                        descripcion: "Asuntos de prevención de riesgos",
                        icon: "ShieldAlert",
                        duracion: 45,
                        color: "#dc2626"
                    },
                    {
                        id: "convenio",
                        nombre: "Convenio Colectivo",
                        descripcion: "Negociación y aplicación de convenios",
                        icon: "FileText",
                        duracion: 30,
                        color: "#059669"
                    },
                    {
                        id: "turnos",
                        nombre: "Gestión de Turnos",
                        descripcion: "Asuntos relacionados con turnos de trabajo",
                        icon: "Clock",
                        duracion: 30,
                        color: "#7c3aed"
                    }
                ],
                horariosPersonalizados: {
                    lunes: { inicio: "06:00", fin: "22:00", activo: true },
                    martes: { inicio: "06:00", fin: "22:00", activo: true },
                    miercoles: { inicio: "06:00", fin: "22:00", activo: true },
                    jueves: { inicio: "06:00", fin: "22:00", activo: true },
                    viernes: { inicio: "06:00", fin: "22:00", activo: true },
                    sabado: { inicio: "08:00", fin: "14:00", activo: true },
                    domingo: { inicio: "08:00", fin: "14:00", activo: false }
                }
            },
            servicios: {
                nombre: "Sector Servicios",
                caracteristicas: [
                    "Atención al cliente prioritaria",
                    "Formación continua",
                    "Flexibilidad horaria",
                    "Representación多元化"
                ],
                tiposCitas: [
                    {
                        id: "sindical",
                        nombre: "Asuntos Sindicales",
                        descripcion: "Consultas generales",
                        icon: "Users",
                        duracion: 45,
                        color: "#1e40af"
                    },
                    {
                        id: "formacion",
                        nombre: "Formación y Desarrollo",
                        descripcion: "Cursos y capacitación",
                        icon: "GraduationCap",
                        duracion: 60,
                        color: "#059669"
                    },
                    {
                        id: "atencion",
                        nombre: "Atención al Cliente",
                        descripcion: "Consultas de atención",
                        icon: "Headphones",
                        duracion: 30,
                        color: "#dc2626"
                    },
                    {
                        id: "flexibilidad",
                        nombre: "Flexibilidad Horaria",
                        descripcion: "Gestión de horarios flexibles",
                        icon: "Calendar",
                        duracion: 45,
                        color: "#7c3aed"
                    }
                ],
                horariosPersonalizados: {
                    lunes: { inicio: "08:00", fin: "20:00", activo: true },
                    martes: { inicio: "08:00", fin: "20:00", activo: true },
                    miercoles: { inicio: "08:00", fin: "20:00", activo: true },
                    jueves: { inicio: "08:00", fin: "20:00", activo: true },
                    viernes: { inicio: "08:00", fin: "20:00", activo: true },
                    sabado: { inicio: "10:00", fin: "18:00", activo: true },
                    domingo: { inicio: "10:00", fin: "16:00", activo: false }
                }
            },
            publico: {
                nombre: "Sector Público",
                caracteristicas: [
                    "Normativa específica",
                    "Procesos burocráticos",
                    "Transparencia obligatoria",
                    "Representación institucional"
                ],
                tiposCitas: [
                    {
                        id: "sindical",
                        nombre: "Atención Sindical",
                        descripcion: "Consulta general",
                        icon: "Users",
                        duracion: 30,
                        color: "#1e40af"
                    },
                    {
                        id: "normativa",
                        nombre: "Normativa",
                        descripcion: "Consultas normativas",
                        icon: "BookOpen",
                        duracion: 45,
                        color: "#059669"
                    },
                    {
                        id: "procedimientos",
                        nombre: "Procedimientos",
                        descripcion: "Trámites administrativos",
                        icon: "FileCheck",
                        duracion: 30,
                        color: "#dc2626"
                    }
                ],
                horariosPersonalizados: {
                    lunes: { inicio: "09:00", fin: "19:00", activo: true },
                    martes: { inicio: "09:00", fin: "19:00", activo: true },
                    miercoles: { inicio: "09:00", fin: "19:00", activo: true },
                    jueves: { inicio: "09:00", fin: "19:00", activo: true },
                    viernes: { inicio: "09:00", fin: "19:00", activo: true },
                    sabado: { inicio: "09:00", fin: "14:00", activo: false },
                    domingo: { inicio: "00:00", fin: "23:59", activo: false }
                }
            }
        };
    }

    /**
     * Genera una configuración completa
     */
    generarConfiguracion(empresa, casoUso, sector) {
        console.log(`🔧 Generando configuración: ${empresa.nombre}`);
        console.log(`   • Caso de uso: ${casoUso}`);
        console.log(`   • Sector: ${sector}`);

        const config = {
            empresa: empresa,
            casoUso: this.casosUso[casoUso] || this.casosUso.completo,
            sector: this.sectores[sector] || this.sectores.publico,
            generacion: {
                fecha: new Date().toISOString(),
                version: "1.0.0",
                template: "UGT-Towa-Template"
            }
        };

        // Combinar configuraciones
        config.configuracionCompleta = this.combinarConfiguraciones(config);

        return config;
    }

    /**
     * Combina las configuraciones de caso de uso, sector y empresa
     */
    combinarConfiguraciones(config) {
        const { empresa, casoUso, sector } = config;

        return {
            // Información de la empresa
            empresa: {
                nombre: empresa.nombre,
                dominio: empresa.dominio,
                email: empresa.email,
                telefono: empresa.telefono,
                direccion: empresa.direccion,
                logo: empresa.logo,
                colores: empresa.colores || sector.colores || this.getDefaultColors()
            },

            // Funcionalidades habilitadas
            funcionalidades: {
                ...casoUso.funcionalidades,
                // Agregar funcionalidades específicas del sector
                ...this.getFuncionalidadesSector(sector.nombre)
            },

            // Tipos de citas
            tiposCitas: this.combinarTiposCitas(
                casoUso.tiposCitas,
                sector.tiposCitas,
                empresa.tiposCitas
            ),

            // Horarios de trabajo
            horariosTrabajo: empresa.horarios || sector.horariosPersonalizados,

            // Textos personalizados
            textosPersonalizados: {
                titulo: empresa.textos?.titulo || `${sector.nombre} - Portal Sindical`,
                descripcion: empresa.textos?.descripcion || `Portal sindical del sector ${sector.nombre.toLowerCase()}`,
                slogan: empresa.textos?.slogan || sector.caracteristicas[0],
                welcomeMessage: `Bienvenido al portal sindical de ${empresa.nombre}`,
                footerText: `© ${new Date().getFullYear()} ${empresa.nombre}. Todos los derechos reservados.`,
                mensajes: {
                    citaConfirmada: "Su cita ha sido confirmada exitosamente",
                    citaCancelada: "Su cita ha sido cancelada",
                    recordatorio: "Recordatorio de cita",
                    bienvenido: "Bienvenido a nuestro portal sindical"
                }
            },

            // Configuraciones de seguridad
            seguridad: {
                validacionDominio: empresa.dominiosPermitidos?.length > 0,
                dominiosPermitidos: empresa.dominiosPermitidos || [`@${empresa.dominio}`],
                roles: {
                    admin: "admin",
                    usuario: "user",
                    delegate: "delegate"
                },
                permisos: this.getPermisosPorSector(sector.nombre)
            },

            // Configuraciones de notificaciones
            notificaciones: {
                email: {
                    habilitado: true,
                    plantilla: `${sector.nombre.toLowerCase()}-template`,
                    recordatorio: {
                        habilitado: true,
                        anticipacion: 24 // horas
                    }
                },
                push: {
                    habilitado: casoUso.funcionalidades.notificaciones,
                    eventos: ["cita_confirmada", "cita_cancelada", "nuevo_comunicado"]
                }
            },

            // Configuraciones de exportación
            exportacion: {
                formatos: casoUso.funcionalidades.exportacion ? ["pdf", "excel", "csv"] : [],
                secciones: Object.keys(casoUso.funcionalidades).filter(key => casoUso.funcionalidades[key]),
                programada: casoUso.funcionalidades.estadisticas
            }
        };
    }

    /**
     * Combina los tipos de citas de diferentes fuentes
     */
    combinarTiposCitas(casoUsoTipos, sectorTipos, empresaTipos) {
        let tipos = [...sectorTipos];

        // Agregar tipos específicos de la empresa
        if (empresaTipos && empresaTipos.length > 0) {
            tipos = tipos.concat(empresaTipos);
        }

        // Personalizar con datos del caso de uso
        if (casoUsoTipos && casoUsoTipos.length > 0) {
            tipos = tipos.filter(tipo => 
                casoUsoTipos.some(caso => caso.id === tipo.id)
            );
        }

        return tipos;
    }

    /**
     * Obtiene funcionalidades específicas del sector
     */
    getFuncionalidadesSector(sectorNombre) {
        const funcionalidadesSector = {
            "Sector Industrial": {
                seguridad_industrial: true,
                gestion_turnos: true,
                convenio_colectivo: true
            },
            "Sector Servicios": {
                formacion_continua: true,
                atencion_cliente: true,
                flexibilidad_horaria: true
            },
            "Sector Público": {
                normativa_especifica: true,
                procedimientos: true,
                transparencia: true
            }
        };

        return funcionalidadesSector[sectorNombre] || {};
    }

    /**
     * Obtiene permisos específicos por sector
     */
    getPermisosPorSector(sectorNombre) {
        const permisos = {
            "Sector Industrial": {
                admin: ["*"],
                delegate: ["citas", "seguridad", "comunicados"],
                user: ["citas", "comunicados"]
            },
            "Sector Servicios": {
                admin: ["*"],
                delegate: ["citas", "formacion", "comunicados"],
                user: ["citas", "formacion", "comunicados"]
            },
            "Sector Público": {
                admin: ["*"],
                delegate: ["citas", "normativa", "comunicados"],
                user: ["citas", "comunicados"]
            }
        };

        return permisos[sectorNombre] || permisos["Sector Público"];
    }

    /**
     * Obtiene colores por defecto
     */
    getDefaultColors() {
        return {
            primario: "#1e40af",
            secundario: "#059669",
            acento: "#dc2626"
        };
    }

    /**
     * Guarda la configuración generada
     */
    guardarConfiguracion(config) {
        const empresaSlug = config.empresa.slug || this.generateSlug(config.empresa.nombre);
        const configPath = path.join(this.outputDir, empresaSlug);
        
        // Crear directorio si no existe
        if (!fs.existsSync(configPath)) {
            fs.mkdirSync(configPath, { recursive: true });
        }

        // Guardar configuración principal
        const configFile = path.join(configPath, 'configuracion-completa.json');
        fs.writeFileSync(configFile, JSON.stringify(config, null, 2));

        // Guardar configuraciones parciales
        this.guardarConfiguracionesParciales(config, configPath);

        // Generar archivos de despliegue
        this.generarArchivosDespliegue(config, configPath);

        console.log(`✅ Configuración guardada en: ${configPath}`);
        return configPath;
    }

    /**
     * Guarda configuraciones parciales
     */
    guardarConfiguracionesParciales(config, configPath) {
        const parciales = {
            'empresa.config.json': {
                empresa: config.empresa,
                sector: config.sector.nombre,
                casoUso: config.casoUso.nombre
            },
            'funcionalidades.config.json': config.configuracionCompleta.funcionalidades,
            'tipos-citas.config.json': config.configuracionCompleta.tiposCitas,
            'horarios.config.json': config.configuracionCompleta.horariosTrabajo,
            'textos.config.json': config.configuracionCompleta.textosPersonalizados,
            'seguridad.config.json': config.configuracionCompleta.seguridad
        };

        Object.entries(parciales).forEach(([filename, data]) => {
            fs.writeFileSync(
                path.join(configPath, filename),
                JSON.stringify(data, null, 2)
            );
        });
    }

    /**
     * Genera archivos de despliegue
     */
    generarArchivosDespliegue(config, configPath) {
        const desplieguePath = path.join(configPath, 'despliegue');

        if (!fs.existsSync(desplieguePath)) {
            fs.mkdirSync(desplieguePath);
        }

        // Variables de entorno
        this.generarVariablesEntorno(config, desplieguePath);

        // Script de configuración
        this.generarScriptConfiguracion(config, desplieguePath);

        // Dockerfile
        this.generarDockerfile(config, desplieguePath);

        // Docker compose
        this.generarDockerCompose(config, desplieguePath);
    }

    /**
     * Genera archivo de variables de entorno
     */
    generarVariablesEntorno(config, destPath) {
        const { empresa, configuracionCompleta } = config;

        const envContent = `# Configuración de ${empresa.nombre}
# Generado automáticamente el ${new Date().toISOString()}

# === EMPRESA ===
EMPRESA_NOMBRE=${empresa.nombre}
EMPRESA_DOMINIO=${empresa.dominio}
EMPRESA_EMAIL=${empresa.email}
EMPRESA_TELEFONO=${empresa.telefono}
EMPRESA_DIRECCION=${empresa.direccion}

# === COLORES ===
EMPRESA_COLOR_PRIMARIO=${empresa.colores.primario}
EMPRESA_COLOR_SECUNDARIO=${empresa.colores.secundario}
EMPRESA_COLOR_ACENTO=${empresa.colores.acento}

# === FUNCIONALIDADES ===
FUNCIONALIDADES_CITAS=${configuracionCompleta.funcionalidades.citas}
FUNCIONALIDADES_COMUNICADOS=${configuracionCompleta.funcionalidades.comunicados}
FUNCIONALIDADES_COMENTARIOS=${configuracionCompleta.funcionalidades.comentarios}
FUNCIONALIDADES_ENCUESTAS=${configuracionCompleta.funcionalidades.encuestas}
FUNCIONALIDADES_NEWSLETTER=${configuracionCompleta.funcionalidades.newsletter}
FUNCIONALIDADES_ESTADISTICAS=${configuracionCompleta.funcionalidades.estadisticas}
FUNCIONALIDADES_EXPORTACION=${configuracionCompleta.funcionalidades.exportacion}

# === SEGURIDAD ===
VALIDACION_DOMINIO=${configuracionCompleta.seguridad.validacionDominio}
DOMINIOS_PERMITIDOS=${configuracionCompleta.seguridad.dominiosPermitidos.join(',')}

# === CONFIGURACIÓN ===
TIPOS_CITAS_CONFIG=${JSON.stringify(configuracionCompleta.tiposCitas)}
HORARIOS_TRABAJO_CONFIG=${JSON.stringify(configuracionCompleta.horariosTrabajo)}
TEXTOS_PERSONALIZADOS_CONFIG=${JSON.stringify(configuracionCompleta.textosPersonalizados)}

# === NOTIFICACIONES ===
NOTIFICACIONES_EMAIL_HABILITADO=${configuracionCompleta.notificaciones.email.habilitado}
RECORDATORIO_ANTICIPACION=${configuracionCompleta.notificaciones.email.recordatorio.anticipacion}
`;

        fs.writeFileSync(path.join(destPath, '.env'), envContent);
        fs.writeFileSync(path.join(destPath, '.env.example'), envContent);
    }

    /**
     * Genera script de configuración
     */
    generarScriptConfiguracion(config, destPath) {
        const script = `#!/bin/bash

# Script de configuración - ${config.empresa.nombre}
# Generado automáticamente

set -e

echo "🔧 Configurando portal sindical para ${config.empresa.nombre}..."

# Crear directorios
mkdir -p frontend backend database config

# Configurar variables de entorno
cp .env .env.local

# Construir frontend
cd frontend
npm install
npm run build
cd ..

# Desplegar edge functions
cd backend
# Aquí irían los comandos de Supabase CLI
cd ..

echo "✅ Configuración completada"

# Mostrar información
echo "📊 Información de la configuración:"
echo "   • Empresa: ${config.empresa.nombre}"
echo "   • Sector: ${config.sector.nombre}"
echo "   • Dominio: ${config.empresa.dominio}"
echo "   • Tipos de citas: ${config.configuracionCompleta.tiposCitas.length}"
echo "   • Funcionalidades: ${Object.values(config.configuracionCompleta.funcionalidades).filter(v => v).length}"
`;

        fs.writeFileSync(path.join(destPath, 'configurar.sh'), script);
        fs.chmodSync(path.join(destPath, 'configurar.sh'), '755');
    }

    /**
     * Genera Dockerfile
     */
    generarDockerfile(config, destPath) {
        const dockerfile = `# Dockerfile - ${config.empresa.nombre}
FROM node:18-alpine AS builder

WORKDIR /app

# Copiar archivos de configuración
COPY package*.json ./
COPY .env .env.local

# Instalar dependencias
RUN npm ci --only=production

# Copiar código fuente
COPY . .

# Construir aplicación
RUN npm run build

# Imagen de producción
FROM nginx:alpine

# Copiar archivos construidos
COPY --from=builder /app/dist /usr/share/nginx/html

# Copiar configuración de nginx
COPY nginx.conf /etc/nginx/nginx.conf

# Variables de entorno
ENV EMPRESA_NOMBRE="${config.empresa.nombre}"
ENV EMPRESA_DOMINIO="${config.empresa.dominio}"

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
`;

        fs.writeFileSync(path.join(destPath, 'Dockerfile'), dockerfile);
    }

    /**
     * Genera docker-compose.yml
     */
    generarDockerCompose(config, destPath) {
        const compose = `version: '3.8'

services:
  portal-sindical:
    build: .
    ports:
      - "80:80"
    environment:
      - EMPRESA_NOMBRE=${config.empresa.nombre}
      - EMPRESA_DOMINIO=${config.empresa.dominio}
    volumes:
      - ./config:/app/config:ro
    restart: unless-stopped
    
  supabase:
    image: supabase/supabase:latest
    ports:
      - "54321:54321"
    environment:
      - POSTGRES_PASSWORD=your-password
    volumes:
      - supabase_data:/var/lib/postgresql/data

volumes:
  supabase_data:
`;

        fs.writeFileSync(path.join(destPath, 'docker-compose.yml'), compose);
    }

    /**
     * Genera slug para nombre de empresa
     */
    generateSlug(nombre) {
        return nombre
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .trim();
    }

    /**
     * Muestra casos de uso disponibles
     */
    mostrarCasosUso() {
        console.log('\n📋 Casos de uso disponibles:');
        Object.entries(this.casosUso).forEach(([key, config]) => {
            console.log(`   ${key}: ${config.nombre}`);
            console.log(`      ${config.descripcion}`);
            console.log('');
        });
    }

    /**
     * Muestra sectores disponibles
     */
    mostrarSectores() {
        console.log('\n🏢 Sectores disponibles:');
        Object.entries(this.sectores).forEach(([key, sector]) => {
            console.log(`   ${key}: ${sector.nombre}`);
            sector.caracteristicas.forEach(caracteristica => {
                console.log(`      • ${caracteristica}`);
            });
            console.log('');
        });
    }
}

// Función principal
function main() {
    const args = process.argv.slice(2);
    const comando = args[0];

    const generador = new GeneradorConfiguraciones();

    switch (comando) {
        case 'casos-uso':
            generador.mostrarCasosUso();
            break;
        case 'sectores':
            generador.mostrarSectores();
            break;
        case 'generar':
            const empresa = {
                nombre: args[1],
                dominio: args[2],
                email: args[3],
                telefono: args[4],
                direccion: args[5],
                colores: {
                    primario: args[6] || "#1e40af",
                    secundario: args[7] || "#059669",
                    acento: args[8] || "#dc2626"
                }
            };
            const casoUso = args[9] || 'completo';
            const sector = args[10] || 'publico';

            const config = generador.generarConfiguracion(empresa, casoUso, sector);
            const path = generador.guardarConfiguracion(config);
            
            console.log(`\n🎉 Configuración generada exitosamente en: ${path}`);
            break;
        default:
            console.log(`
🔧 Generador de Configuraciones - Portal Sindical

Uso:
  node generador-config.js casos-uso        # Mostrar casos de uso
  node generador-config.js sectores         # Mostrar sectores disponibles
  node generador-config.js generar [parametros]  # Generar configuración

Ejemplo:
  node generador-config.js generar \\
    "Mi Empresa" \\
    "mi-empresa.com" \\
    "contacto@mi-empresa.com" \\
    "+34 900 000 000" \\
    "Mi dirección" \\
    "#1e40af" \\
    "#059669" \\
    "#dc2626" \\
    "completo" \\
    "industrial"
            `);
    }
}

// Ejecutar si se llama directamente
if (require.main === module) {
    main();
}

module.exports = GeneradorConfiguraciones;
