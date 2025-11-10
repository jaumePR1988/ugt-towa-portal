#!/usr/bin/env node

/**
 * Sistema de Backup
 * 
 * Gestiona backups automáticos, manuales y restauración
 * para todas las instancias del portal sindical.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class SistemaBackup {
    constructor() {
        this.backupDir = path.join(__dirname, '../../backups/');
        this.configDir = path.join(__dirname, '../plantillas/');
        this.logsDir = path.join(this.backupDir, 'logs');
        this.ultimoBackup = null;
    }

    /**
     * Inicializa el sistema de backup
     */
    async inicializar() {
        console.log('💾 Inicializando Sistema de Backup');
        console.log('=' * 50);

        // Crear directorios necesarios
        await this.crearDirectorios();

        // Cargar configuración
        await this.cargarConfiguracion();

        // Verificar herramientas necesarias
        await this.verificarHerramientas();

        // Inicializar logs
        this.inicializarLogs();

        console.log('✅ Sistema de Backup inicializado');
    }

    /**
     * Crea los directorios necesarios
     */
    async crearDirectorios() {
        const dirs = [
            this.backupDir,
            this.logsDir,
            path.join(this.backupDir, 'automaticos'),
            path.join(this.backupDir, 'manuales'),
            path.join(this.backupDir, 'configuraciones'),
            path.join(this.backupDir, 'temporales')
        ];

        dirs.forEach(dir => {
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }
        });

        console.log('📁 Directorios de backup creados');
    }

    /**
     * Carga la configuración de backup
     */
    async cargarConfiguracion() {
        this.configuracion = {
            automatico: {
                habilitado: true,
                horario: "02:00", // 2 AM
                frecuencia: "diaria", // diaria, semanal, mensual
                retencion: 30, // días
                compresion: true,
                verificacion: true
            },
            tiposBackup: {
                completo: {
                    descripcion: "Backup completo de base de datos y archivos",
                    incluye: ["database", "files", "config", "logs"]
                },
                incremental: {
                    descripcion: "Solo cambios desde el último backup",
                    incluye: ["database", "config"]
                },
                diferencial: {
                    descripcion: "Cambios desde el último backup completo",
                    incluye: ["database", "config"]
                },
                selectivo: {
                    descripcion: "Backup de datos específicos",
                    incluye: ["database_critical"]
                }
            },
            destinos: {
                local: {
                    tipo: "local",
                    path: this.backupDir,
                    habilitado: true
                },
                ftp: {
                    tipo: "ftp",
                    host: "backup.empresa.com",
                    usuario: "backup",
                    path: "/portal-sindical",
                    habilitado: false
                },
                s3: {
                    tipo: "s3",
                    bucket: "portal-sindical-backups",
                    region: "eu-west-1",
                    habilitado: false
                }
            },
            notificaciones: {
                email: {
                    habilitado: true,
                    destinatarios: ["admin@empresa.com"],
                    smtp: {
                        host: "smtp.empresa.com",
                        puerto: 587,
                        usuario: "backup@empresa.com",
                        contrasena: "password"
                    }
                },
                slack: {
                    habilitado: false,
                    webhook: "https://hooks.slack.com/services/..."
                }
            },
            retencion: {
                completos: 7,    // 7 días
                incrementales: 30, // 30 días
                selectivos: 90,  // 90 días
                automaticos: 30  // 30 días
            }
        };

        // Cargar configuraciones específicas desde archivos
        await this.cargarConfiguracionesEspecificas();
    }

    /**
     * Carga configuraciones específicas de empresas
     */
    async cargarConfiguracionesEspecificas() {
        const configFiles = [
            'empresas/config-default.json',
            'empresas/config-industrial.json',
            'empresas/config-servicios.json',
            'empresas/config-publico.json'
        ];

        this.configuracionesEspecificas = {};

        for (const configFile of configFiles) {
            const configPath = path.join(this.configDir, configFile);
            if (fs.existsSync(configPath)) {
                const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
                this.configuracionesEspecificas[config.empresa] = config;
            }
        }
    }

    /**
     * Verifica que las herramientas necesarias estén disponibles
     */
    async verificarHerramientas() {
        const herramientas = [
            { nombre: 'pg_dump', comando: 'pg_dump --version' },
            { nombre: 'tar', comando: 'tar --version' },
            { nombre: 'gzip', comando: 'gzip --version' }
        ];

        for (const herramienta of herramientas) {
            try {
                execSync(herramienta.comando, { stdio: 'ignore' });
                console.log(`✅ ${herramienta.nombre} disponible`);
            } catch (error) {
                throw new Error(`${herramienta.nombre} no está disponible. Instale PostgreSQL y utilidades de compresión.`);
            }
        }
    }

    /**
     * Inicializa el sistema de logs
     */
    inicializarLogs() {
        this.logs = {
            archivo: path.join(this.logsDir, `backup-${new Date().toISOString().split('T')[0]}.log`),
            escribir: (mensaje, nivel = 'INFO') => {
                const timestamp = new Date().toISOString();
                const logEntry = `[${timestamp}] [${nivel}] ${mensaje}\n`;
                fs.appendFileSync(this.logs.archivo, logEntry);
                console.log(`${nivel}: ${mensaje}`);
            }
        };
    }

    /**
     * Crea un backup completo
     */
    async crearBackupCompleto(config) {
        this.logs.escribir(`Iniciando backup completo para ${config.empresa}`);
        
        const fecha = new Date();
        const nombreBackup = `${config.empresa}_completo_${fecha.toISOString().split('T')[0]}_${fecha.getTime()}`;
        const rutaBackup = path.join(this.backupDir, 'manuales', nombreBackup);
        
        try {
            // Crear directorio de backup
            fs.mkdirSync(rutaBackup, { recursive: true });

            // 1. Backup de base de datos
            await this.backupBaseDatos(config, rutaBackup);

            // 2. Backup de archivos
            await this.backupArchivos(config, rutaBackup);

            // 3. Backup de configuración
            await this.backupConfiguracion(config, rutaBackup);

            // 4. Backup de logs
            await this.backupLogs(config, rutaBackup);

            // 5. Verificar integridad
            await this.verificarBackup(rutaBackup);

            // 6. Comprimir backup
            await this.comprimirBackup(rutaBackup);

            // 7. Crear metadatos
            await this.crearMetadatos(config, rutaBackup, 'completo');

            // 8. Sincronizar a destinos remotos
            await this.sincronizarDestinos(rutaBackup);

            // 9. Limpiar backups antiguos
            await this.limpiarBackupsAntiguos();

            this.ultimoBackup = {
                nombre: nombreBackup,
                ruta: rutaBackup,
                fecha: fecha,
                tipo: 'completo',
                empresa: config.empresa,
                exito: true
            };

            await this.notificarExito('completo', config, nombreBackup);
            
            this.logs.escribir(`Backup completo exitoso: ${nombreBackup}`);
            return { exito: true, nombre: nombreBackup, ruta: rutaBackup };

        } catch (error) {
            this.logs.escribir(`Error en backup completo: ${error.message}`, 'ERROR');
            await this.notificarError('completo', config, error);
            throw error;
        }
    }

    /**
     * Crea un backup incremental
     */
    async crearBackupIncremental(config) {
        this.logs.escribir(`Iniciando backup incremental para ${config.empresa}`);

        const fecha = new Date();
        const nombreBackup = `${config.empresa}_incremental_${fecha.toISOString().split('T')[0]}_${fecha.getTime()}`;
        const rutaBackup = path.join(this.backupDir, 'manuales', nombreBackup);
        
        try {
            fs.mkdirSync(rutaBackup, { recursive: true });

            // 1. Backup incremental de base de datos
            await this.backupBaseDatosIncremental(config, rutaBackup);

            // 2. Backup de configuración
            await this.backupConfiguracion(config, rutaBackup);

            // 3. Verificar y comprimir
            await this.verificarBackup(rutaBackup);
            await this.comprimirBackup(rutaBackup);

            // 4. Crear metadatos
            await this.crearMetadatos(config, rutaBackup, 'incremental');

            this.ultimoBackup = {
                nombre: nombreBackup,
                ruta: rutaBackup,
                fecha: fecha,
                tipo: 'incremental',
                empresa: config.empresa,
                exito: true
            };

            await this.notificarExito('incremental', config, nombreBackup);
            
            this.logs.escribir(`Backup incremental exitoso: ${nombreBackup}`);
            return { exito: true, nombre: nombreBackup, ruta: rutaBackup };

        } catch (error) {
            this.logs.escribir(`Error en backup incremental: ${error.message}`, 'ERROR');
            await this.notificarError('incremental', config, error);
            throw error;
        }
    }

    /**
     * Backup de base de datos completa
     */
    async backupBaseDatos(config, rutaBackup) {
        this.logs.escribir('Iniciando backup de base de datos');

        const nombreDb = config.database?.nombre || `portal_${config.empresa.toLowerCase().replace(/\s+/g, '_')}`;
        const archivoDb = path.join(rutaBackup, 'database.sql');
        const host = config.database?.host || 'localhost';
        const usuario = config.database?.usuario || 'postgres';
        
        const comando = `pg_dump -h ${host} -U ${usuario} -d ${nombreDb} > ${archivoDb}`;
        
        try {
            execSync(comando, { stdio: 'pipe' });
            this.logs.escribir('Backup de base de datos completado');
        } catch (error) {
            throw new Error(`Error en backup de base de datos: ${error.message}`);
        }
    }

    /**
     * Backup de base de datos incremental
     */
    async backupBaseDatosIncremental(config, rutaBackup) {
        this.logs.escribir('Iniciando backup incremental de base de datos');

        const nombreDb = config.database?.nombre || `portal_${config.empresa.toLowerCase().replace(/\s+/g, '_')}`;
        const archivoDb = path.join(rutaBackup, 'database_incremental.sql');
        const host = config.database?.host || 'localhost';
        const usuario = config.database?.usuario || 'postgres';
        const fechaReferencia = this.obtenerUltimoBackupCompleto(config);

        // Usar --where para obtener solo cambios recientes
        const comando = `pg_dump -h ${host} -U ${usuario} -d ${nombreDb} --where="created_at >= '${fechaReferencia}'" > ${archivoDb}`;
        
        try {
            execSync(comando, { stdio: 'pipe' });
            this.logs.escribir('Backup incremental de base de datos completado');
        } catch (error) {
            // Si falla el incremental, hacer completo
            this.logs.escribir('Backup incremental falló, intentando completo', 'WARN');
            await this.backupBaseDatos(config, rutaBackup);
        }
    }

    /**
     * Backup de archivos
     */
    async backupArchivos(config, rutaBackup) {
        this.logs.escribir('Iniciando backup de archivos');

        const directorioArchivos = config.directorios?.archivos || '/var/www/portal-sindical';
        const archivoArchivos = path.join(rutaBackup, 'archivos.tar.gz');

        if (fs.existsSync(directorioArchivos)) {
            const comando = `tar -czf ${archivoArchivos} -C ${path.dirname(directorioArchivos)} ${path.basename(directorioArchivos)}`;
            try {
                execSync(comando, { stdio: 'pipe' });
                this.logs.escribir('Backup de archivos completado');
            } catch (error) {
                this.logs.escribir(`Error en backup de archivos: ${error.message}`, 'WARN');
            }
        } else {
            this.logs.escribir('Directorio de archivos no encontrado', 'WARN');
        }
    }

    /**
     * Backup de configuración
     */
    async backupConfiguracion(config, rutaBackup) {
        this.logs.escribir('Iniciando backup de configuración');

        const archivoConfig = path.join(rutaBackup, 'configuracion.json');
        const datosConfig = {
            empresa: config.empresa,
            dominio: config.dominio,
            fecha_backup: new Date().toISOString(),
            configuracion: {
                database: config.database,
                funcionalidades: config.funcionalidades,
                tipos_citas: config.tiposCitas,
                horarios: config.horarios,
                textos: config.textos
            },
            variables_entorno: this.generarVariablesEntorno(config),
            certificados: this.verificarCertificados(config)
        };

        fs.writeFileSync(archivoConfig, JSON.stringify(datosConfig, null, 2));
        this.logs.escribir('Backup de configuración completado');
    }

    /**
     * Backup de logs
     */
    async backupLogs(config, rutaBackup) {
        this.logs.escribir('Iniciando backup de logs');

        const directoriosLog = [
            '/var/log/nginx',
            '/var/log/supabase',
            '/var/log/portal-sindical'
        ];

        const archivoLogs = path.join(rutaBackup, 'logs_recientes.tar.gz');

        for (const dirLog of directoriosLog) {
            if (fs.existsSync(dirLog)) {
                const comando = `tar -czf ${archivoLogs} -C ${path.dirname(dirLog)} ${path.basename(dirLog)} --wildcards "*.log" --mtime -7`;
                try {
                    execSync(comando, { stdio: 'pipe' });
                    break; // Solo necesitamos un directorio que funcione
                } catch (error) {
                    continue;
                }
            }
        }

        this.logs.escribir('Backup de logs completado');
    }

    /**
     * Verifica la integridad del backup
     */
    async verificarBackup(rutaBackup) {
        this.logs.escribir('Verificando integridad del backup');

        const archivos = fs.readdirSync(rutaBackup);
        const archivosRequeridos = ['database.sql', 'configuracion.json'];

        for (const archivo of archivosRequeridos) {
            const rutaArchivo = path.join(rutaBackup, archivo);
            if (!fs.existsSync(rutaArchivo)) {
                throw new Error(`Archivo requerido faltante: ${archivo}`);
            }

            // Verificar que el archivo no esté vacío
            const stats = fs.statSync(rutaArchivo);
            if (stats.size === 0) {
                throw new Error(`Archivo vacío: ${archivo}`);
            }
        }

        // Verificar integridad de la base de datos
        if (fs.existsSync(path.join(rutaBackup, 'database.sql'))) {
            try {
                // Hacer una pequeña verificación del SQL
                const contenidoDb = fs.readFileSync(path.join(rutaBackup, 'database.sql'), 'utf8');
                if (!contenidoDb.includes('CREATE TABLE') && !contenidoDb.includes('INSERT INTO')) {
                    throw new Error('El archivo de base de datos parece estar corrupto');
                }
            } catch (error) {
                throw new Error(`Error en verificación de base de datos: ${error.message}`);
            }
        }

        this.logs.escribir('Verificación de integridad completada');
    }

    /**
     * Comprime el backup
     */
    async comprimirBackup(rutaBackup) {
        this.logs.escribir('Comprimiendo backup');

        const archivoComprimido = `${rutaBackup}.tar.gz`;
        const comando = `tar -czf ${archivoComprimido} -C ${path.dirname(rutaBackup)} ${path.basename(rutaBackup)}`;

        try {
            execSync(comando, { stdio: 'pipe' });
            // Eliminar directorio original
            fs.rmSync(rutaBackup, { recursive: true, force: true });
            this.logs.escribir('Backup comprimido exitosamente');
            return archivoComprimido;
        } catch (error) {
            throw new Error(`Error al comprimir backup: ${error.message}`);
        }
    }

    /**
     * Crea metadatos del backup
     */
    async crearMetadatos(config, rutaBackup, tipo) {
        const metadatos = {
            empresa: config.empresa,
            dominio: config.dominio,
            tipo_backup: tipo,
            fecha_creacion: new Date().toISOString(),
            version_sistema: "1.0.0",
            configuracion: {
                sector: config.sector,
                funcionalidades: config.funcionalidades,
                tipos_citas: config.tiposCitas?.length || 0
            },
            archivos: fs.readdirSync(rutaBackup),
            tamano_total: this.calcularTamanoBackup(rutaBackup),
            checksum: await this.generarChecksum(rutaBackup),
            destino: rutaBackup
        };

        const archivoMetadatos = path.join(rutaBackup, 'metadatos.json');
        fs.writeFileSync(archivoMetadatos, JSON.stringify(metadatos, null, 2));

        // Guardar índice de backups
        await this.actualizarIndiceBackups(metadatos);
    }

    /**
     * Sincroniza backup a destinos remotos
     */
    async sincronizarDestinos(rutaBackup) {
        this.logs.escribir('Sincronizando a destinos remotos');

        // FTP
        if (this.configuracion.destinos.ftp.habilitado) {
            await this.sincronizarFTP(rutaBackup);
        }

        // S3
        if (this.configuracion.destinos.s3.habilitado) {
            await this.sincronizarS3(rutaBackup);
        }

        this.logs.escribir('Sincronización a destinos remotos completada');
    }

    /**
     * Sincroniza backup via FTP
     */
    async sincronizarFTP(rutaBackup) {
        const ftp = this.configuracion.destinos.ftp;
        const comando = `curl -T "${rutaBackup}" ftp://${ftp.host}${ftp.path}/`;
        
        try {
            execSync(comando, { stdio: 'pipe' });
            this.logs.escribir('Backup sincronizado via FTP');
        } catch (error) {
            this.logs.escribir(`Error en sincronización FTP: ${error.message}`, 'ERROR');
        }
    }

    /**
     * Sincroniza backup a S3
     */
    async sincronizarS3(rutaBackup) {
        const s3 = this.configuracion.destinos.s3;
        const comando = `aws s3 cp "${rutaBackup}" s3://${s3.bucket}/`;
        
        try {
            execSync(comando, { stdio: 'pipe' });
            this.logs.escribir('Backup sincronizado a S3');
        } catch (error) {
            this.logs.escribir(`Error en sincronización S3: ${error.message}`, 'ERROR');
        }
    }

    /**
     * Limpia backups antiguos según la política de retención
     */
    async limpiarBackupsAntiguos() {
        this.logs.escribir('Limpiando backups antiguos');

        const tiposRetencion = {
            'completos': this.configuracion.retencion.completos,
            'incrementales': this.configuracion.retencion.incrementales,
            'selectivos': this.configuracion.retencion.selectivos
        };

        for (const [tipo, dias] of Object.entries(tiposRetencion)) {
            await this.limpiarBackupsPorTipo(tipo, dias);
        }

        this.logs.escribir('Limpieza de backups antiguos completada');
    }

    /**
     * Limpia backups de un tipo específico
     */
    async limpiarBackupsPorTipo(tipo, dias) {
        const directorioTipo = path.join(this.backupDir, 'manuales');
        const archivos = fs.readdirSync(directorioTipo);
        
        for (const archivo of archivos) {
            if (archivo.includes(tipo)) {
                const rutaArchivo = path.join(directorioTipo, archivo);
                const stats = fs.statSync(rutaArchivo);
                const diasTranscurridos = (Date.now() - stats.mtime.getTime()) / (1000 * 60 * 60 * 24);
                
                if (diasTranscurridos > dias) {
                    try {
                        fs.unlinkSync(rutaArchivo);
                        this.logs.escribir(`Backup antiguo eliminado: ${archivo}`);
                    } catch (error) {
                        this.logs.escribir(`Error al eliminar backup ${archivo}: ${error.message}`, 'ERROR');
                    }
                }
            }
        }
    }

    /**
     * Restaura un backup
     */
    async restaurarBackup(archivoBackup, empresa) {
        this.logs.escribir(`Iniciando restauración desde: ${archivoBackup}`);

        const rutaTemporal = path.join(this.backupDir, 'temporales', `restore_${Date.now()}`);

        try {
            // 1. Crear backup de seguridad antes de restaurar
            await this.crearBackupSeguridad(empresa);

            // 2. Extraer backup
            await this.extraerBackup(archivoBackup, rutaTemporal);

            // 3. Verificar metadatos
            await this.verificarMetadatos(rutaTemporal);

            // 4. Restaurar base de datos
            await this.restaurarBaseDatos(rutaTemporal, empresa);

            // 5. Restaurar archivos
            await this.restaurarArchivos(rutaTemporal, empresa);

            // 6. Restaurar configuración
            await this.restaurarConfiguracion(rutaTemporal, empresa);

            // 7. Verificar restauración
            await this.verificarRestauracion(empresa);

            // 8. Limpiar archivos temporales
            fs.rmSync(rutaTemporal, { recursive: true, force: true });

            await this.notificarExito('restauracion', empresa, archivoBackup);
            
            this.logs.escribir(`Restauración completada exitosamente desde: ${archivoBackup}`);
            return { exito: true, mensaje: 'Restauración completada' };

        } catch (error) {
            this.logs.escribir(`Error en restauración: ${error.message}`, 'ERROR');
            await this.notificarError('restauracion', empresa, error);
            throw error;
        }
    }

    /**
     * Programa backup automático
     */
    async programarBackupAutomatico(config) {
        this.logs.escribir('Programando backup automático');

        const cronJob = `0 ${this.configuracion.automatico.horario.split(':')[0]} * * * /usr/local/bin/backup-automatico.sh`;
        const scriptPath = '/usr/local/bin/backup-automatico.sh';

        // Crear script de backup automático
        const script = `#!/bin/bash
source ${path.join(__dirname, '../template-base/config/.env')}
node ${path.join(__dirname, 'sistema-backup.js')} automatico "${config.empresa}"
`;

        fs.writeFileSync(scriptPath, script);
        fs.chmodSync(scriptPath, '755');

        // Agregar al crontab
        try {
            execSync(`(crontab -l 2>/dev/null; echo "${cronJob}") | crontab -`);
            this.logs.escribir('Backup automático programado');
        } catch (error) {
            this.logs.escribir(`Error al programar backup automático: ${error.message}`, 'ERROR');
        }
    }

    /**
     * Obtiene el último backup completo
     */
    obtenerUltimoBackupCompleto(config) {
        const directorio = path.join(this.backupDir, 'manuales');
        const archivos = fs.readdirSync(directorio)
            .filter(archivo => archivo.includes(config.empresa) && archivo.includes('completo'))
            .sort()
            .reverse();

        if (archivos.length > 0) {
            // Obtener fecha del nombre del archivo
            const nombreArchivo = archivos[0];
            const fecha = nombreArchivo.split('_')[2]; // formato: empresa_fecha_timestamp
            return fecha;
        }

        // Si no hay backup, retornar hace 30 días
        return new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    }

    /**
     * Genera variables de entorno
     */
    generarVariablesEntorno(config) {
        return {
            'EMPRESA_NOMBRE': config.empresa,
            'EMPRESA_DOMINIO': config.dominio,
            'EMPRESA_EMAIL': config.email,
            'EMPRESA_TELEFONO': config.telefono,
            'BASE_DATOS_NOMBRE': config.database?.nombre || `portal_${config.empresa.toLowerCase().replace(/\s+/g, '_')}`,
            'SUPABASE_URL': process.env.SUPABASE_URL || '',
            'SUPABASE_ANON_KEY': process.env.SUPABASE_ANON_KEY || ''
        };
    }

    /**
     * Verifica certificados SSL
     */
    verificarCertificados(config) {
        const rutasCertificados = [
            '/etc/ssl/certs/portal-sindical.crt',
            '/etc/ssl/private/portal-sindical.key'
        ];

        const certificados = {};
        for (const ruta of rutasCertificados) {
            if (fs.existsSync(ruta)) {
                const stats = fs.statSync(ruta);
                certificados[ruta] = {
                    existe: true,
                    tamano: stats.size,
                    modificado: stats.mtime.toISOString()
                };
            } else {
                certificados[ruta] = { existe: false };
            }
        }

        return certificados;
    }

    /**
     * Calcula el tamaño total del backup
     */
    calcularTamanoBackup(rutaBackup) {
        let tamanoTotal = 0;

        const calcularTamanoDirectorio = (directorio) => {
            const archivos = fs.readdirSync(directorio);
            for (const archivo of archivos) {
                const rutaArchivo = path.join(directorio, archivo);
                const stats = fs.statSync(rutaArchivo);
                
                if (stats.isDirectory()) {
                    calcularTamanoDirectorio(rutaArchivo);
                } else {
                    tamanoTotal += stats.size;
                }
            }
        };

        calcularTamanoDirectorio(rutaBackup);
        return tamanoTotal;
    }

    /**
     * Genera checksum del backup
     */
    async generarChecksum(rutaBackup) {
        const comando = `find "${rutaBackup}" -type f -exec md5sum {} \\; | md5sum | cut -d' ' -f1`;
        
        try {
            const resultado = execSync(comando, { encoding: 'utf8' }).trim();
            return resultado;
        } catch (error) {
            return null;
        }
    }

    /**
     * Actualiza índice de backups
     */
    async actualizarIndiceBackups(metadatos) {
        const indicePath = path.join(this.backupDir, 'indice-backups.json');
        let indice = [];

        if (fs.existsSync(indicePath)) {
            indice = JSON.parse(fs.readFileSync(indicePath, 'utf8'));
        }

        indice.push(metadatos);
        
        // Mantener solo los últimos 1000 backups en el índice
        if (indice.length > 1000) {
            indice = indice.slice(-1000);
        }

        fs.writeFileSync(indicePath, JSON.stringify(indice, null, 2));
    }

    /**
     * Notifica éxito
     */
    async notificarExito(tipo, config, nombre) {
        if (this.configuracion.notificaciones.email.habilitado) {
            await this.enviarEmail({
                asunto: `✅ Backup ${tipo} exitoso - ${config.empresa}`,
                mensaje: `El backup ${tipo} se ha completado exitosamente.\n\nEmpresa: ${config.empresa}\nArchivo: ${nombre}\nFecha: ${new Date().toISOString()}`,
                destinatarios: this.configuracion.notificaciones.email.destinatarios
            });
        }

        if (this.configuracion.notificaciones.slack.habilitado) {
            await this.enviarSlack(`✅ Backup ${tipo} exitoso para ${config.empresa}: ${nombre}`);
        }
    }

    /**
     * Notifica error
     */
    async notificarError(tipo, config, error) {
        if (this.configuracion.notificaciones.email.habilitado) {
            await this.enviarEmail({
                asunto: `❌ Error en backup ${tipo} - ${config.empresa}`,
                mensaje: `Ha ocurrido un error durante el backup ${tipo}.\n\nEmpresa: ${config.empresa}\nError: ${error.message}\nFecha: ${new Date().toISOString()}`,
                destinatarios: this.configuracion.notificaciones.email.destinatarios
            });
        }

        if (this.configuracion.notificaciones.slack.habilitado) {
            await this.enviarSlack(`❌ Error en backup ${tipo} para ${config.empresa}: ${error.message}`);
        }
    }

    /**
     * Envía email
     */
    async enviarEmail({ asunto, mensaje, destinatarios }) {
        // Implementar envío de email
        console.log(`📧 Email enviado: ${asunto}`);
    }

    /**
     * Envía mensaje a Slack
     */
    async enviarSlack(mensaje) {
        // Implementar envío a Slack
        console.log(`💬 Slack: ${mensaje}`);
    }

    /**
     * Obtiene estado del sistema de backup
     */
    async obtenerEstado() {
        const indicePath = path.join(this.backupDir, 'indice-backups.json');
        let indice = [];

        if (fs.existsSync(indicePath)) {
            indice = JSON.parse(fs.readFileSync(indicePath, 'utf8'));
        }

        return {
            ultimoBackup: this.ultimoBackup,
            totalBackups: indice.length,
            espacioUtilizado: this.calcularEspacioUtilizado(),
            proximoBackup: this.calcularProximoBackup(),
            estado: 'operativo'
        };
    }

    /**
     * Calcula espacio utilizado por backups
     */
    calcularEspacioUtilizado() {
        const calcularEspacioDirectorio = (directorio) => {
            let espacio = 0;
            const archivos = fs.readdirSync(directorio);
            
            for (const archivo of archivos) {
                const rutaArchivo = path.join(directorio, archivo);
                const stats = fs.statSync(rutaArchivo);
                
                if (stats.isDirectory()) {
                    espacio += calcularEspacioDirectorio(rutaArchivo);
                } else {
                    espacio += stats.size;
                }
            }
            
            return espacio;
        };

        return calcularEspacioDirectorio(this.backupDir);
    }

    /**
     * Calcula próximo backup automático
     */
    calcularProximoBackup() {
        if (!this.configuracion.automatico.habilitado) {
            return null;
        }

        const ahora = new Date();
        const [horas, minutos] = this.configuracion.automatico.horario.split(':').map(Number);
        const proximo = new Date(ahora);
        proximo.setHours(horas, minutos, 0, 0);

        // Si ya pasó la hora de hoy, programar para mañana
        if (proximo <= ahora) {
            proximo.setDate(proximo.getDate() + 1);
        }

        return proximo.toISOString();
    }

    // Métodos auxiliares para restauración
    async crearBackupSeguridad(empresa) {
        // Implementar backup de seguridad
    }

    async extraerBackup(archivo, destino) {
        // Implementar extracción de backup
    }

    async verificarMetadatos(ruta) {
        // Implementar verificación de metadatos
    }

    async restaurarBaseDatos(ruta, empresa) {
        // Implementar restauración de base de datos
    }

    async restaurarArchivos(ruta, empresa) {
        // Implementar restauración de archivos
    }

    async restaurarConfiguracion(ruta, empresa) {
        // Implementar restauración de configuración
    }

    async verificarRestauracion(empresa) {
        // Implementar verificación de restauración
    }
}

// Función principal
function main() {
    const args = process.argv.slice(2);
    const comando = args[0];

    if (!comando) {
        console.log(`
💾 Sistema de Backup - Portal Sindical

Uso:
  node sistema-backup.js inicializar              # Inicializar sistema
  node sistema-backup.js backup-completo [empresa]  # Crear backup completo
  node sistema-backup.js backup-incremental [empresa]  # Crear backup incremental
  node sistema-backup.js restaurar [archivo] [empresa] # Restaurar backup
  node sistema-backup.js automatico [empresa]     # Ejecutar backup automático
  node sistema-backup.js estado                   # Mostrar estado del sistema
  node sistema-backup.js listar [empresa]         # Listar backups

Ejemplo:
  node sistema-backup.js backup-completo "Mi Empresa" --dominio "mi-empresa.com" --database "portal_mi_empresa"
        `);
        return;
    }

    const sistema = new SistemaBackup();

    try {
        switch (comando) {
            case 'inicializar':
                sistema.inicializar();
                break;
                
            case 'backup-completo':
                const configCompleto = {
                    empresa: args[1],
                    dominio: args[2],
                    database: { nombre: args[3] },
                    tiposCitas: args[4] ? JSON.parse(args[4]) : []
                };
                sistema.inicializar().then(() => sistema.crearBackupCompleto(configCompleto));
                break;
                
            case 'backup-incremental':
                const configIncremental = {
                    empresa: args[1],
                    dominio: args[2],
                    database: { nombre: args[3] }
                };
                sistema.inicializar().then(() => sistema.crearBackupIncremental(configIncremental));
                break;
                
            case 'restaurar':
                sistema.inicializar().then(() => sistema.restaurarBackup(args[1], args[2]));
                break;
                
            case 'estado':
                sistema.inicializar().then(() => sistema.obtenerEstado().then(estado => {
                    console.log('📊 Estado del Sistema de Backup:');
                    console.log(JSON.stringify(estado, null, 2));
                }));
                break;
                
            default:
                console.log(`Comando no reconocido: ${comando}`);
                process.exit(1);
        }
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

// Ejecutar si se llama directamente
if (require.main === module) {
    main();
}

module.exports = SistemaBackup;
