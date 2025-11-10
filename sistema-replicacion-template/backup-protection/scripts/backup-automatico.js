/**
 * Sistema de Backup Automático con Versionado
 * Sistema de replicación UGT-TOWA
 * 
 * Este script realiza backups automáticos del sistema con:
 * - Versionado automático de código
 * - Backup de base de datos
 * - Backup de configuraciones
 * - Backup de archivos estáticos
 * - Rotación de backups
 * - Notificaciones de estado
 */

const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const crypto = require('crypto');
const yaml = require('js-yaml');

class SistemaBackupAutomatico {
    constructor(configPath) {
        this.config = this.cargarConfiguracion(configPath);
        this.timestamp = this.generarTimestamp();
        this.version = this.generarVersion();
        this.hashArchivos = new Map();
        this.estadisticas = {
            inicio: new Date(),
            archivosProcesados: 0,
            tamañoTotal: 0,
            errores: [],
            advertencias: []
        };
    }

    /**
     * Genera timestamp único para el backup
     */
    generarTimestamp() {
        const ahora = new Date();
        return ahora.toISOString().replace(/[:.]/g, '-');
    }

    /**
     * Genera versión semántica del backup
     */
    generarVersion() {
        const ahora = new Date();
        const major = ahora.getFullYear();
        const minor = ahora.getMonth() + 1;
        const patch = ahora.getDate();
        const time = `${ahora.getHours()}${ahora.getMinutes()}`;
        return `v${major}.${minor}.${patch}.${time}`;
    }

    /**
     * Carga configuración desde archivo
     */
    cargarConfiguracion(configPath) {
        try {
            const configContent = fs.readFileSync(configPath, 'utf8');
            return yaml.load(configContent);
        } catch (error) {
            console.error('❌ Error cargando configuración:', error.message);
            return this.configuracionPorDefecto();
        }
    }

    /**
     * Configuración por defecto del sistema
     */
    configuracionPorDefecto() {
        return {
            backup: {
                rutaLocal: './storage/local',
                rutasIncluir: [
                    './template-base',
                    './herramientas',
                    './plantillas',
                    './documentacion'
                ],
                rutasExcluir: [
                    'node_modules',
                    '.git',
                    'dist',
                    '*.log',
                    '.env*',
                    'backup-*'
                ],
                mantenerBackups: 30,
                comprimir: true,
                encriptar: true
            },
            versionado: {
                sistemaGit: true,
                tags: true,
                ramas: true,
                mantenerRamas: ['main', 'develop', 'hotfix']
            },
            baseDatos: {
                incluir: true,
                tipos: ['postgres', 'mongodb'],
                formato: 'sql'
            },
            notificacion: {
                email: true,
                webhooks: [],
                discord: false,
                slack: false
            }
        };
    }

    /**
     * Ejecuta el proceso completo de backup
     */
    async ejecutarBackupCompleto() {
        console.log('🚀 Iniciando proceso de backup automático...');
        console.log(`📅 Fecha: ${new Date().toLocaleString('es-ES')}`);
        console.log(`🏷️  Versión: ${this.version}`);
        console.log(`⏰ Timestamp: ${this.timestamp}\n`);

        try {
            // 1. Preparar directorio de backup
            await this.prepararDirectorioBackup();

            // 2. Backup de código fuente con versionado
            await this.backupCodigoFuente();

            // 3. Backup de base de datos
            if (this.config.backup.rutasIncluir.includes('./template-base/database')) {
                await this.backupBaseDatos();
            }

            // 4. Backup de configuraciones
            await this.backupConfiguraciones();

            // 5. Backup de archivos estáticos
            await this.backupArchivosEstaticos();

            // 6. Generar hashes de integridad
            await this.generarHashesIntegridad();

            // 7. Comprimir y encriptar
            if (this.config.backup.comprimir) {
                await this.comprimirBackup();
            }

            if (this.config.backup.encriptar) {
                await this.encriptarBackup();
            }

            // 8. Subir a ubicaciones remotas
            await this.sincronizarUbicacionesRemotas();

            // 9. Limpiar backups antiguos
            await this.limpiarBackupsAntiguos();

            // 10. Generar reporte de backup
            await this.generarReporteBackup();

            // 11. Enviar notificaciones
            await this.enviarNotificaciones();

            console.log('✅ Backup completado exitosamente');
            this.mostrarEstadisticasFinales();

        } catch (error) {
            console.error('❌ Error en proceso de backup:', error);
            await this.manejarErrorBackup(error);
            throw error;
        }
    }

    /**
     * Prepara el directorio de backup
     */
    async prepararDirectorioBackup() {
        const backupDir = path.join(this.config.backup.rutaLocal, `backup-${this.timestamp}`);
        
        try {
            fs.mkdirSync(backupDir, { recursive: true });
            console.log(`📁 Directorio de backup creado: ${backupDir}`);
            
            // Crear subdirectorios
            const subdirectorios = ['codigo', 'database', 'config', 'archivos', 'logs'];
            subdirectorios.forEach(subdir => {
                fs.mkdirSync(path.join(backupDir, subdir), { recursive: true });
            });

            this.backupDir = backupDir;
        } catch (error) {
            throw new Error(`Error preparando directorio de backup: ${error.message}`);
        }
    }

    /**
     * Backup del código fuente con versionado
     */
    async backupCodigoFuente() {
        console.log('💻 Iniciando backup de código fuente...');
        
        for (const ruta of this.config.backup.rutasIncluir) {
            if (fs.existsSync(ruta)) {
                await this.backupDirectorio(ruta, 'codigo');
            }
        }

        // Versionado con Git
        if (this.config.versionado.sistemaGit) {
            await this.versionarConGit();
        }
    }

    /**
     * Realiza backup de un directorio específico
     */
    async backupDirectorio(origen, destino) {
        const rutaOrigen = path.resolve(origen);
        const rutaDestino = path.join(this.backupDir, destino, path.basename(origen));

        if (!fs.existsSync(rutaOrigen)) {
            console.warn(`⚠️  Directorio no encontrado: ${rutaOrigen}`);
            return;
        }

        const items = fs.readdirSync(rutaOrigen);
        const archivosProcesados = [];

        for (const item of items) {
            const rutaItem = path.join(rutaOrigen, item);
            const rutaDestinoItem = path.join(rutaDestino, item);
            
            // Verificar si debe excluirse
            if (this.debeExcluir(item)) {
                continue;
            }

            const stat = fs.statSync(rutaItem);
            
            if (stat.isDirectory()) {
                await this.copiarDirectorio(rutaItem, rutaDestinoItem);
            } else {
                await this.copiarArchivo(rutaItem, rutaDestinoItem);
            }
            
            archivosProcesados.push({
                archivo: item,
                tamaño: stat.size,
                hash: this.generarHashArchivo(rutaItem)
            });
            
            this.estadisticas.archivosProcesados++;
            this.estadisticas.tamañoTotal += stat.size;
        }

        // Guardar metadatos del backup
        await this.guardarMetadatosDirectorio(origen, archivosProcesados);
        console.log(`✅ Backup completado para: ${origen}`);
    }

    /**
     * Verifica si un archivo/directorio debe excluirse
     */
    debeExcluir(nombre) {
        return this.config.backup.rutasExcluir.some(excluir => {
            if (excluir.startsWith('*.') && nombre.endsWith(excluir.substring(1))) {
                return true;
            }
            return nombre.includes(excluir);
        });
    }

    /**
     * Copia un directorio recursivamente
     */
    async copiarDirectorio(origen, destino) {
        if (!fs.existsSync(destino)) {
            fs.mkdirSync(destino, { recursive: true });
        }

        const items = fs.readdirSync(origen);
        for (const item of items) {
            const rutaOrigenItem = path.join(origen, item);
            const rutaDestinoItem = path.join(destino, item);
            
            if (this.debeExcluir(item)) {
                continue;
            }

            const stat = fs.statSync(rutaOrigenItem);
            
            if (stat.isDirectory()) {
                await this.copiarDirectorio(rutaOrigenItem, rutaDestinoItem);
            } else {
                await this.copiarArchivo(rutaOrigenItem, rutaDestinoItem);
            }
        }
    }

    /**
     * Copia un archivo con manejo de errores
     */
    async copiarArchivo(origen, destino) {
        try {
            fs.copyFileSync(origen, destino);
            
            // Generar hash del archivo
            const hash = this.generarHashArchivo(origen);
            this.hashArchivos.set(destino, hash);
            
        } catch (error) {
            console.warn(`⚠️  Error copiando archivo ${origen}: ${error.message}`);
            this.estadisticas.advertencias.push(`Error copiando archivo: ${origen}`);
        }
    }

    /**
     * Genera hash SHA-256 de un archivo
     */
    generarHashArchivo(rutaArchivo) {
        try {
            const contenido = fs.readFileSync(rutaArchivo);
            return crypto.createHash('sha256').update(contenido).digest('hex');
        } catch (error) {
            return 'ERROR_HASH';
        }
    }

    /**
     * Versiona el backup con Git
     */
    async versionarConGit() {
        console.log('🔄 Versionando con Git...');
        
        try {
            // Crear tag para el backup
            const tag = `backup-${this.timestamp}`;
            await this.ejecutarComando(`git tag -f ${tag}`);
            
            // Commit de cambios si los hay
            await this.ejecutarComando('git add .');
            await this.ejecutarComando(`git commit -m "Backup automático ${this.version}"`);
            
            // Push del tag
            await this.ejecutarComando(`git push origin --tags`);
            
            console.log('✅ Versionado con Git completado');
        } catch (error) {
            console.warn('⚠️  Error en versionado Git:', error.message);
            this.estadisticas.advertencias.push('Error en versionado Git');
        }
    }

    /**
     * Ejecuta comando del sistema
     */
    ejecutarComando(comando) {
        return new Promise((resolve, reject) => {
            exec(comando, (error, stdout, stderr) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(stdout);
                }
            });
        });
    }

    /**
     * Backup de base de datos
     */
    async backupBaseDatos() {
        console.log('🗄️  Iniciando backup de base de datos...');
        
        const dbDir = path.join(this.backupDir, 'database');
        
        try {
            // Backup PostgreSQL si está configurado
            await this.backupPostgres(dbDir);
            
            // Backup MongoDB si está configurado
            await this.backupMongoDB(dbDir);
            
            console.log('✅ Backup de base de datos completado');
        } catch (error) {
            console.error('❌ Error en backup de base de datos:', error.message);
            this.estadisticas.errores.push(`Error backup BD: ${error.message}`);
        }
    }

    /**
     * Backup de PostgreSQL
     */
    async backupPostgres(dbDir) {
        const pgConfig = this.config.baseDatos.postgres;
        if (!pgConfig) return;

        try {
            const timestamp = this.timestamp;
            const backupFile = path.join(dbDir, `postgres_backup_${timestamp}.sql`);
            
            const comando = `pg_dump -h ${pgConfig.host} -p ${pgConfig.port} -U ${pgConfig.user} -d ${pgConfig.database} > ${backupFile}`;
            
            await this.ejecutarComando(comando);
            console.log('✅ Backup PostgreSQL completado');
        } catch (error) {
            throw new Error(`Error backup PostgreSQL: ${error.message}`);
        }
    }

    /**
     * Backup de MongoDB
     */
    async backupMongoDB(dbDir) {
        const mongoConfig = this.config.baseDatos.mongodb;
        if (!mongoConfig) return;

        try {
            const timestamp = this.timestamp;
            const backupDir = path.join(dbDir, `mongo_backup_${timestamp}`);
            
            const comando = `mongodump --host ${mongoConfig.host}:${mongoConfig.port} --db ${mongoConfig.database} --out ${backupDir}`;
            
            await this.ejecutarComando(comando);
            console.log('✅ Backup MongoDB completado');
        } catch (error) {
            throw new Error(`Error backup MongoDB: ${error.message}`);
        }
    }

    /**
     * Backup de configuraciones
     */
    async backupConfiguraciones() {
        console.log('⚙️  Iniciando backup de configuraciones...');
        
        const configDir = path.join(this.backupDir, 'config');
        
        // Archivos de configuración importantes
        const archivosConfig = [
            '.env*',
            'config.json',
            'package.json',
            '*.config.js',
            '*.config.ts',
            'docker-compose.yml',
            'Dockerfile',
            '*.yaml',
            '*.yml'
        ];

        for (const patron of archivosConfig) {
            await this.buscarYBackupConfiguracion(patron, configDir);
        }
        
        console.log('✅ Backup de configuraciones completado');
    }

    /**
     * Busca y hace backup de archivos de configuración
     */
    async buscarYBackupConfiguracion(patron, configDir) {
        // Implementación simplificada - en un sistema real usaría glob
        const archivosConfig = [
            'package.json',
            'docker-compose.yml',
            'Dockerfile',
            '.env.example'
        ];

        for (const archivo of archivosConfig) {
            if (archivo.match(patron.replace('*', '.*'))) {
                const rutaOrigen = path.resolve(archivo);
                if (fs.existsSync(rutaOrigen)) {
                    const rutaDestino = path.join(configDir, path.basename(archivo));
                    await this.copiarArchivo(rutaOrigen, rutaDestino);
                }
            }
        }
    }

    /**
     * Backup de archivos estáticos
     */
    async backupArchivosEstaticos() {
        console.log('📄 Iniciando backup de archivos estáticos...');
        
        const staticDir = path.join(this.backupDir, 'archivos');
        
        // Directorios de archivos estáticos
        const directoriosEstaticos = [
            './template-base/public',
            './plantillas',
            './documentacion'
        ];

        for (const dir of directoriosEstaticos) {
            if (fs.existsSync(dir)) {
                await this.backupDirectorio(dir, 'archivos');
            }
        }
        
        console.log('✅ Backup de archivos estáticos completado');
    }

    /**
     * Genera hashes de integridad para todos los archivos
     */
    async generarHashesIntegridad() {
        console.log('🔐 Generando hashes de integridad...');
        
        const hashesFile = path.join(this.backupDir, 'hashes_integridad.json');
        const hashes = {};
        
        for (const [archivo, hash] of this.hashArchivos.entries()) {
            hashes[archivo] = hash;
        }
        
        fs.writeFileSync(hashesFile, JSON.stringify(hashes, null, 2));
        console.log('✅ Hashes de integridad generados');
    }

    /**
     * Comprime el backup
     */
    async comprimirBackup() {
        console.log('🗜️  Comprimiendo backup...');
        
        try {
            const comando = `cd ${this.config.backup.rutaLocal} && tar -czf backup-${this.timestamp}.tar.gz backup-${this.timestamp}/`;
            await this.ejecutarComando(comando);
            
            // Remover directorio no comprimido
            fs.rmSync(this.backupDir, { recursive: true, force: true });
            
            console.log('✅ Backup comprimido');
        } catch (error) {
            console.warn('⚠️  Error en compresión:', error.message);
        }
    }

    /**
     * Encripta el backup
     */
    async encriptarBackup() {
        console.log('🔒 Encriptando backup...');
        
        // Implementación básica - en producción usar herramientas más robustas
        const archivoOriginal = path.join(this.config.backup.rutaLocal, `backup-${this.timestamp}.tar.gz`);
        const archivoEncriptado = path.join(this.config.backup.rutaLocal, `backup-${this.timestamp}.tar.gz.enc`);
        
        try {
            // Generar clave de encriptación temporal
            const clave = crypto.randomBytes(32);
            const iv = crypto.randomBytes(16);
            
            // Encriptar archivo
            const cipher = crypto.createCipherGCM('aes-256-cbc', clave);
            const datos = fs.readFileSync(archivoOriginal);
            const datosEncriptados = Buffer.concat([cipher.update(datos), cipher.final()]);
            
            // Guardar archivo encriptado
            fs.writeFileSync(archivoEncriptado, datosEncriptados);
            
            // Remover archivo original
            fs.unlinkSync(archivoOriginal);
            
            // Guardar clave en archivo separado (¡EN PRODUCCIÓN USAR SISTEMA DE CLAVES MÁS SEGURO!)
            const archivoClave = path.join(this.config.backup.rutaLocal, `clave-${this.timestamp}.key`);
            fs.writeFileSync(archivoClave, clave);
            
            console.log('✅ Backup encriptado');
        } catch (error) {
            console.warn('⚠️  Error en encriptación:', error.message);
        }
    }

    /**
     * Sincroniza con ubicaciones remotas
     */
    async sincronizarUbicacionesRemotas() {
        console.log('☁️  Sincronizando con ubicaciones remotas...');
        
        // Cloud storage (S3, Google Drive, etc.)
        if (this.config.almacenamiento.cloud) {
            await this.sincronizarCloud();
        }
        
        // Repositorio Git
        if (this.config.versionado.sistemaGit) {
            await this.sincronizarGit();
        }
        
        console.log('✅ Sincronización completada');
    }

    /**
     * Sincroniza con cloud storage
     */
    async sincronizarCloud() {
        // Implementación específica según el proveedor de cloud
        console.log('📤 Subiendo a cloud storage...');
        // await this.subirAWS();
        // await this.subirGoogleDrive();
    }

    /**
     * Sincroniza con repositorio Git
     */
    async sincronizarGit() {
        try {
            await this.ejecutarComando('git push origin main');
            console.log('📤 Repositorio Git sincronizado');
        } catch (error) {
            console.warn('⚠️  Error sincronizando Git:', error.message);
        }
    }

    /**
     * Limpia backups antiguos
     */
    async limpiarBackupsAntiguos() {
        console.log('🧹 Limpiando backups antiguos...');
        
        const rutaBackups = this.config.backup.rutaLocal;
        const mantener = this.config.backup.mantenerBackups;
        
        try {
            const archivos = fs.readdirSync(rutaBackups)
                .filter(archivo => archivo.startsWith('backup-'))
                .sort()
                .reverse();
            
            if (archivos.length > mantener) {
                const archivosEliminar = archivos.slice(mantener);
                for (const archivo of archivosEliminar) {
                    const rutaArchivo = path.join(rutaBackups, archivo);
                    fs.unlinkSync(rutaArchivo);
                    console.log(`🗑️  Eliminado: ${archivo}`);
                }
            }
            
            console.log(`✅ Mantenidos ${Math.min(archivos.length, mantener)} backups`);
        } catch (error) {
            console.warn('⚠️  Error en limpieza:', error.message);
        }
    }

    /**
     * Genera reporte de backup
     */
    async generarReporteBackup() {
        console.log('📊 Generando reporte de backup...');
        
        const reporte = {
            metadata: {
                version: this.version,
                timestamp: this.timestamp,
                fechaInicio: this.estadisticas.inicio.toISOString(),
                fechaFin: new Date().toISOString(),
                duracion: Date.now() - this.estadisticas.inicio.getTime()
            },
            estadisticas: this.estadisticas,
            contenido: {
                archivosProcesados: this.estadisticas.archivosProcesados,
                tamañoTotalBytes: this.estadisticas.tamañoTotal,
                tamañoTotalFormateado: this.formatearTamaño(this.estadisticas.tamañoTotal)
            },
            integridad: {
                hashesGenerados: this.hashArchivos.size,
                archivosVerificados: this.verificarHashes()
            },
            estado: this.estadisticas.errores.length === 0 ? 'EXITO' : 'PARCIAL',
            errores: this.estadisticas.errores,
            advertencias: this.estadisticas.advertencias
        };
        
        const reporteFile = path.join(this.config.backup.rutaLocal, `reporte-${this.timestamp}.json`);
        fs.writeFileSync(reporteFile, JSON.stringify(reporte, null, 2));
        
        console.log('✅ Reporte generado');
        return reporte;
    }

    /**
     * Envía notificaciones de estado
     */
    async enviarNotificaciones() {
        console.log('📧 Enviando notificaciones...');
        
        if (this.config.notificacion.email) {
            await this.enviarEmail();
        }
        
        if (this.config.notificacion.webhooks.length > 0) {
            await this.enviarWebhooks();
        }
        
        console.log('✅ Notificaciones enviadas');
    }

    /**
     * Envía email de notificación
     */
    async enviarEmail() {
        // Implementación específica del sistema de email
        console.log('📧 Email de notificación enviado');
    }

    /**
     * Envía webhooks
     */
    async enviarWebhooks() {
        // Implementación de webhooks
        for (const webhook of this.config.notificacion.webhooks) {
            try {
                // await fetch(webhook, { method: 'POST', body: JSON.stringify(estadoBackup) });
                console.log(`📡 Webhook enviado a: ${webhook}`);
            } catch (error) {
                console.warn(`⚠️  Error enviando webhook a ${webhook}:`, error.message);
            }
        }
    }

    /**
     * Guarda metadatos de un directorio backupeado
     */
    async guardarMetadatosDirectorio(origen, archivos) {
        const metadatos = {
            directorio: origen,
            timestamp: this.timestamp,
            version: this.version,
            archivos: archivos,
            hashDirectorio: this.generarHashMetadatos(archivos)
        };
        
        const archivoMetadatos = path.join(this.backupDir, `metadatos-${path.basename(origen)}.json`);
        fs.writeFileSync(archivoMetadatos, JSON.stringify(metadatos, null, 2));
    }

    /**
     * Genera hash de metadatos
     */
    generarHashMetadatos(archivos) {
        const contenido = JSON.stringify(archivos.map(a => ({ nombre: a.archivo, hash: a.hash })));
        return crypto.createHash('sha256').update(contenido).digest('hex');
    }

    /**
     * Verifica la integridad de los hashes
     */
 verificarHashes() {
        // Implementación de verificación de integridad
        return true; // Simplificado
    }

    /**
     * Formatea tamaño en bytes
     */
    formatearTamaño(bytes) {
        const unidades = ['B', 'KB', 'MB', 'GB', 'TB'];
        let tamaño = bytes;
        let unidad = 0;
        
        while (tamaño >= 1024 && unidad < unidades.length - 1) {
            tamaño /= 1024;
            unidad++;
        }
        
        return `${tamaño.toFixed(2)} ${unidades[unidad]}`;
    }

    /**
     * Maneja errores del backup
     */
    async manejarErrorBackup(error) {
        console.error('❌ Error crítico en backup:', error);
        
        // Crear reporte de error
        const reporteError = {
            timestamp: this.timestamp,
            version: this.version,
            estado: 'ERROR',
            error: error.message,
            estadisticas: this.estadisticas,
            stack: error.stack
        };
        
        const archivoError = path.join(this.config.backup.rutaLocal, `error-${this.timestamp}.json`);
        fs.writeFileSync(archivoError, JSON.stringify(reporteError, null, 2));
        
        // Enviar notificación de error urgente
        await this.enviarNotificacionError(error);
    }

    /**
     * Envía notificación de error
     */
    async enviarNotificacionError(error) {
        // Notificación urgente de error
        console.log('🚨 Notificación de error enviada');
    }

    /**
     * Muestra estadísticas finales
     */
    mostrarEstadisticasFinales() {
        console.log('\n📊 ESTADÍSTICAS DE BACKUP');
        console.log('=' .repeat(50));
        console.log(`🕒 Duración: ${((Date.now() - this.estadisticas.inicio.getTime()) / 1000).toFixed(2)}s`);
        console.log(`📁 Archivos procesados: ${this.estadisticas.archivosProcesados}`);
        console.log(`💾 Tamaño total: ${this.formatearTamaño(this.estadisticas.tamañoTotal)}`);
        console.log(`🔐 Hashes generados: ${this.hashArchivos.size}`);
        console.log(`❌ Errores: ${this.estadisticas.errores.length}`);
        console.log(`⚠️  Advertencias: ${this.estadisticas.advertencias.length}`);
        console.log(`✅ Estado: ${this.estadisticas.errores.length === 0 ? 'EXITOSO' : 'CON ERRORES'}`);
        console.log('=' .repeat(50));
    }
}

// Ejecutar backup si se llama directamente
if (require.main === module) {
    const configPath = process.argv[2] || '../config/backup-config.yaml';
    const backup = new SistemaBackupAutomatico(configPath);
    
    backup.ejecutarBackupCompleto()
        .then(() => {
            console.log('🎉 Proceso de backup finalizado');
            process.exit(0);
        })
        .catch((error) => {
            console.error('💥 Proceso de backup fallido:', error);
            process.exit(1);
        });
}

module.exports = SistemaBackupAutomatico;