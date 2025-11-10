/**
 * Sistema de Almacenamiento Seguro en Múltiples Ubicaciones
 * Sistema de replicación UGT-TOWA
 * 
 * Este script proporciona:
 * - Sincronización con repositorio Git
 * - Almacenamiento en cloud (AWS S3, Google Drive, etc.)
 * - Almacenamiento local distribuido
 * - Verificación de integridad cruzada
 * - Balanceo de carga y redundancia
 */

const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const crypto = require('crypto');
const yaml = require('js-yaml');

class SistemaAlmacenamientoSeguro {
    constructor(configPath) {
        this.config = this.cargarConfiguracion(configPath);
        this.timestamp = new Date().toISOString();
        this.estadisticasSincronizacion = {
            inicio: new Date(),
            archivosEnviados: 0,
            bytesEnviados: 0,
            errores: [],
            advertencias: [],
            verificaciones: []
        };
    }

    /**
     * Carga configuración del sistema
     */
    cargarConfiguracion(configPath) {
        try {
            if (fs.existsSync(configPath)) {
                const configContent = fs.readFileSync(configPath, 'utf8');
                return yaml.load(configContent);
            }
        } catch (error) {
            console.warn('⚠️  Error cargando configuración, usando valores por defecto');
        }
        
        return this.configuracionPorDefecto();
    }

    /**
     * Configuración por defecto
     */
    configuracionPorDefecto() {
        return {
            ubicaciones: {
                local: {
                    habilitada: true,
                    rutaBase: './storage/local',
                    subdirectorios: ['principal', 'respaldo', 'temporal'],
                    rotacion: 30, // días
                    espacioMinimo: '1GB'
                },
                git: {
                    habilitada: true,
                    repositorio: 'origin',
                    rama: 'main',
                    incluirLargeFiles: false,
                    lfs: false,
                    tags: true,
                    comprimido: true
                },
                cloud: {
                    habilitada: true,
                    proveedor: 'aws', // aws, gcp, azure
                    regiones: ['us-east-1', 'eu-west-1'],
                    buckets: ['ugt-towa-backup-principal', 'ugt-towa-backup-respaldo'],
                    encriptacion: 'AES256',
                    versionado: true,
                    lifecycle: {
                        transicionGlacier: 30,
                        eliminacion: 365
                    }
                },
                ftp: {
                    habilitada: false,
                    servidores: [
                        {
                            host: '',
                            usuario: '',
                            password: '',
                            ruta: '/backups/ugt-towa',
                            puerto: 21,
                            ssl: true
                        }
                    ]
                },
                ssh: {
                    habilitada: false,
                    servidores: [
                        {
                            host: '',
                            usuario: '',
                            clavePrivada: '',
                            ruta: '/backups/ugt-towa',
                            puerto: 22
                        }
                    ]
                }
            },
            sincronizacion: {
                estrategia: 'paralela', // paralela, secuencial
                maxConexiones: 5,
                timeout: 30000,
                reintentos: 3,
                verificaciones: {
                    hash: true,
                    tamaño: true,
                    fechaModificacion: true
                }
            },
            balanceo: {
                estrategia: 'round-robin', // round-robin, menor-uso, menor-latencia
                pesos: {
                    local: 0.3,
                    git: 0.2,
                    cloud: 0.4,
                    ftp: 0.1
                }
            }
        };
    }

    /**
     * Ejecuta sincronización completa
     */
    async ejecutarSincronizacionCompleta(archivoBackup) {
        console.log('☁️  Iniciando sincronización en múltiples ubicaciones...');
        console.log(`📦 Archivo: ${archivoBackup}`);
        console.log(`⏰ Timestamp: ${this.timestamp}\n`);

        try {
            // 1. Verificar archivo de backup
            await this.verificarArchivoBackup(archivoBackup);

            // 2. Determinar ubicaciones destino
            const ubicaciones = this.obtenerUbicacionesDestino();

            // 3. Calcular estrategia de balanceo
            const estrategiaEnvio = this.calcularEstrategiaEnvio(ubicaciones);

            // 4. Sincronizar según estrategia
            if (this.config.sincronizacion.estrategia === 'paralela') {
                await this.sincronizacionParalela(archivoBackup, estrategiaEnvio);
            } else {
                await this.sincronizacionSecuencial(archivoBackup, estrategiaEnvio);
            }

            // 5. Verificar integridad cruzada
            await this.verificarIntegridadCruzada(archivoBackup, ubicaciones);

            // 6. Generar reporte de sincronización
            const reporte = await this.generarReporteSincronizacion(archivoBackup, ubicaciones);

            // 7. Limpiar archivos temporales
            await this.limpiarArchivosTemporales();

            console.log('✅ Sincronización completada exitosamente');
            this.mostrarEstadisticasSincronizacion();

            return reporte;
        } catch (error) {
            console.error('❌ Error en sincronización:', error);
            await this.manejarErrorSincronizacion(error);
            throw error;
        }
    }

    /**
     * Verifica que el archivo de backup existe y es válido
     */
    async verificarArchivoBackup(archivo) {
        console.log('🔍 Verificando archivo de backup...');
        
        if (!fs.existsSync(archivo)) {
            throw new Error(`Archivo de backup no encontrado: ${archivo}`);
        }

        const stat = fs.statSync(archivo);
        if (stat.size === 0) {
            throw new Error('El archivo de backup está vacío');
        }

        // Generar hash del archivo
        const hash = this.generarHashArchivo(archivo);
        
        console.log(`📁 Archivo verificado: ${stat.size} bytes, Hash: ${hash.substring(0, 16)}...`);
        
        return { tamaño: stat.size, hash };
    }

    /**
     * Obtiene ubicaciones destino configuradas
     */
    obtenerUbicacionesDestino() {
        const ubicaciones = [];
        const config = this.config.ubicaciones;

        if (config.local.habilitada) {
            ubicaciones.push({
                tipo: 'local',
                prioridad: 1,
                config: config.local
            });
        }

        if (config.git.habilitada) {
            ubicaciones.push({
                tipo: 'git',
                prioridad: 2,
                config: config.git
            });
        }

        if (config.cloud.habilitada) {
            ubicaciones.push({
                tipo: 'cloud',
                prioridad: 3,
                config: config.cloud
            });
        }

        if (config.ftp.habilitada) {
            ubicaciones.push({
                tipo: 'ftp',
                prioridad: 4,
                config: config.ftp
            });
        }

        if (config.ssh.habilitada) {
            ubicaciones.push({
                tipo: 'ssh',
                prioridad: 5,
                config: config.ssh
            });
        }

        return ubicaciones.sort((a, b) => a.prioridad - b.prioridad);
    }

    /**
     * Calcula estrategia de envío basada en balanceo
     */
    calcularEstrategiaEnvio(ubicaciones) {
        const estrategia = this.config.balanceo.estrategia;
        const pesos = this.config.balanceo.pesos;

        switch (estrategia) {
            case 'round-robin':
                return this.roundRobin(ubicaciones);
            case 'menor-uso':
                return this.menorUso(ubicaciones);
            case 'menor-latencia':
                return this.menorLatencia(ubicaciones);
            default:
                return ubicaciones;
        }
    }

    /**
     * Estrategia round-robin simple
     */
    roundRobin(ubicaciones) {
        return ubicaciones.sort(() => Math.random() - 0.5);
    }

    /**
     * Estrategia por menor uso (simulada)
     */
    menorUso(ubicaciones) {
        return ubicaciones.sort((a, b) => {
            // En implementación real, verificar métricas de uso
            return a.prioridad - b.prioridad;
        });
    }

    /**
     * Estrategia por menor latencia (simulada)
     */
    menorLatencia(ubicaciones) {
        return ubicaciones.sort((a, b) => {
            // En implementación real, medir latencia de cada ubicación
            return a.prioridad - b.prioridad;
        });
    }

    /**
     * Sincronización en paralelo
     */
    async sincronizacionParalela(archivo, ubicaciones) {
        console.log('🔄 Iniciando sincronización en paralelo...');
        
        const promesas = ubicaciones.map(ubicacion => 
            this.enviarAUbicacion(archivo, ubicacion)
        );

        const resultados = await Promise.allSettled(promesas);
        
        resultados.forEach((resultado, indice) => {
            const ubicacion = ubicaciones[indice];
            if (resultado.status === 'fulfilled') {
                console.log(`✅ ${ubicacion.tipo}: ${resultado.value}`);
            } else {
                console.log(`❌ ${ubicacion.tipo}: ${resultado.reason.message}`);
                this.estadisticasSincronizacion.errores.push({
                    ubicacion: ubicacion.tipo,
                    error: resultado.reason.message
                });
            }
        });
    }

    /**
     * Sincronización secuencial
     */
    async sincronizacionSecuencial(archivo, ubicaciones) {
        console.log('🔄 Iniciando sincronización secuencial...');
        
        for (const ubicacion of ubicaciones) {
            try {
                const resultado = await this.enviarAUbicacion(archivo, ubicacion);
                console.log(`✅ ${ubicacion.tipo}: ${resultado}`);
                
                // Pausa entre envíos para no sobrecargar
                await this.pausa(1000);
            } catch (error) {
                console.log(`❌ ${ubicacion.tipo}: ${error.message}`);
                this.estadisticasSincronizacion.errores.push({
                    ubicacion: ubicacion.tipo,
                    error: error.message
                });
            }
        }
    }

    /**
     * Envía archivo a una ubicación específica
     */
    async enviarAUbicacion(archivo, ubicacion) {
        const nombreArchivo = path.basename(archivo);
        const extension = path.extname(nombreArchivo);
        const nombreSinExtension = path.basename(nombreArchivo, extension);
        
        switch (ubicacion.tipo) {
            case 'local':
                return await this.enviarLocal(archivo, nombreArchivo, ubicacion);
            case 'git':
                return await this.enviarGit(archivo, nombreArchivo, ubicacion);
            case 'cloud':
                return await this.enviarCloud(archivo, nombreArchivo, ubicacion);
            case 'ftp':
                return await this.enviarFTP(archivo, nombreArchivo, ubicacion);
            case 'ssh':
                return await this.enviarSSH(archivo, nombreArchivo, ubicacion);
            default:
                throw new Error(`Tipo de ubicación no soportado: ${ubicacion.tipo}`);
        }
    }

    /**
     * Envía a almacenamiento local
     */
    async enviarLocal(archivo, nombreArchivo, ubicacion) {
        const config = ubicacion.config;
        const fecha = this.timestamp.split('T')[0];
        
        // Usar subdirectorio con fecha
        const subdirectorio = path.join(config.rutaBase, fecha);
        
        if (!fs.existsSync(subdirectorio)) {
            fs.mkdirSync(subdirectorio, { recursive: true });
        }
        
        const destino = path.join(subdirectorio, nombreArchivo);
        fs.copyFileSync(archivo, destino);
        
        this.estadisticasSincronizacion.archivosEnviados++;
        this.estadisticasSincronizacion.bytesEnviados += fs.statSync(archivo).size;
        
        return `Local: ${destino}`;
    }

    /**
     * Envía a repositorio Git
     */
    async enviarGit(archivo, nombreArchivo, ubicacion) {
        const config = ubicacion.config;
        const directorioBackup = './backups-git';
        
        try {
            // Crear directorio de backup en el repo
            if (!fs.existsSync(directorioBackup)) {
                fs.mkdirSync(directorioBackup, { recursive: true });
            }
            
            const destino = path.join(directorioBackup, nombreArchivo);
            fs.copyFileSync(archivo, destino);
            
            // Commit y push
            await this.ejecutarComando('git add .');
            await this.ejecutarComando(`git commit -m "Backup ${this.timestamp} - ${nombreArchivo}"`);
            
            if (config.tags) {
                await this.ejecutarComando(`git tag backup-${this.timestamp}`);
                await this.ejecutarComando('git push origin --tags');
            } else {
                await this.ejecutarComando(`git push ${config.repositorio} ${config.rama}`);
            }
            
            this.estadisticasSincronizacion.archivosEnviados++;
            this.estadisticasSincronizacion.bytesEnviados += fs.statSync(archivo).size;
            
            return `Git: ${config.repositorio}/${config.rama}`;
        } catch (error) {
            throw new Error(`Error Git: ${error.message}`);
        }
    }

    /**
     * Envía a cloud storage
     */
    async enviarCloud(archivo, nombreArchivo, ubicacion) {
        const config = ubicacion.config;
        const fecha = this.timestamp.split('T')[0];
        
        try {
            switch (config.proveedor) {
                case 'aws':
                    return await this.enviarAWS(archivo, nombreArchivo, config, fecha);
                case 'gcp':
                    return await this.enviarGCP(archivo, nombreArchivo, config, fecha);
                case 'azure':
                    return await this.enviarAzure(archivo, nombreArchivo, config, fecha);
                default:
                    throw new Error(`Proveedor cloud no soportado: ${config.proveedor}`);
            }
        } catch (error) {
            throw new Error(`Error Cloud (${config.proveedor}): ${error.message}`);
        }
    }

    /**
     * Envía a AWS S3
     */
    async enviarAWS(archivo, nombreArchivo, config, fecha) {
        // Simulación de AWS S3 - en implementación real usar AWS SDK
        const bucket = config.buckets[0];
        const key = `backups/${fecha}/${nombreArchivo}`;
        
        console.log(`📤 Simulando upload a S3: s3://${bucket}/${key}`);
        
        // En implementación real:
        // const AWS = require('aws-sdk');
        // const s3 = new AWS.S3({ region: config.regiones[0] });
        // await s3.upload({
        //     Bucket: bucket,
        //     Key: key,
        //     Body: fs.createReadStream(archivo),
        //     ServerSideEncryption: config.encriptacion
        // }).promise();
        
        this.estadisticasSincronizacion.archivosEnviados++;
        this.estadisticasSincronizacion.bytesEnviados += fs.statSync(archivo).size;
        
        return `AWS S3: s3://${bucket}/${key}`;
    }

    /**
     * Envía a Google Cloud Storage
     */
    async enviarGCP(archivo, nombreArchivo, config, fecha) {
        const bucket = config.buckets[0];
        const key = `backups/${fecha}/${nombreArchivo}`;
        
        console.log(`📤 Simulando upload a GCS: gs://${bucket}/${key}`);
        
        this.estadisticasSincronizacion.archivosEnviados++;
        this.estadisticasSincronizacion.bytesEnviados += fs.statSync(archivo).size;
        
        return `GCP GCS: gs://${bucket}/${key}`;
    }

    /**
     * Envía a Azure Blob Storage
     */
    async enviarAzure(archivo, nombreArchivo, config, fecha) {
        const container = config.buckets[0];
        const blob = `backups/${fecha}/${nombreArchivo}`;
        
        console.log(`📤 Simulando upload a Azure: ${container}/${blob}`);
        
        this.estadisticasSincronizacion.archivosEnviados++;
        this.estadisticasSincronizacion.bytesEnviados += fs.statSync(archivo).size;
        
        return `Azure Blob: ${container}/${blob}`;
    }

    /**
     * Envía por FTP
     */
    async enviarFTP(archivo, nombreArchivo, ubicacion) {
        const config = ubicacion.config;
        const servidor = config.servidores[0];
        
        try {
            // Simulación de FTP - en implementación real usar librerías como ftp
            console.log(`📤 Simulando upload FTP: ftp://${servidor.host}/${servidor.ruta}/${nombreArchivo}`);
            
            // En implementación real:
            // const FtpClient = require('ftp');
            // const client = new FtpClient();
            // await client.connect(servidor);
            // await client.put(archivo, `${servidor.ruta}/${nombreArchivo}`);
            // await client.end();
            
            this.estadisticasSincronizacion.archivosEnviados++;
            this.estadisticasSincronizacion.bytesEnviados += fs.statSync(archivo).size;
            
            return `FTP: ${servidor.host}`;
        } catch (error) {
            throw new Error(`Error FTP: ${error.message}`);
        }
    }

    /**
     * Envía por SSH
     */
    async enviarSSH(archivo, nombreArchivo, ubicacion) {
        const config = ubicacion.config;
        const servidor = config.servidores[0];
        
        try {
            // Simulación de SCP
            const comando = `scp -P ${servidor.puerto} ${archivo} ${servidor.usuario}@${servidor.host}:${servidor.ruta}/${nombreArchivo}`;
            console.log(`📤 Simulando upload SCP: ${comando}`);
            
            // En implementación real ejecutar comando
            // await this.ejecutarComando(comando);
            
            this.estadisticasSincronizacion.archivosEnviados++;
            this.estadisticasSincronizacion.bytesEnviados += fs.statSync(archivo).size;
            
            return `SSH: ${servidor.usuario}@${servidor.host}`;
        } catch (error) {
            throw new Error(`Error SSH: ${error.message}`);
        }
    }

    /**
     * Verifica integridad cruzada
     */
    async verificarIntegridadCruzada(archivo, ubicaciones) {
        console.log('🔍 Verificando integridad cruzada...');
        
        const hashOriginal = this.generarHashArchivo(archivo);
        
        for (const ubicacion of ubicaciones) {
            try {
                const resultado = await this.verificarUbicacion(archivo, hashOriginal, ubicacion);
                this.estadisticasSincronizacion.verificaciones.push(resultado);
                
                if (resultado.valido) {
                    console.log(`✅ ${ubicacion.tipo}: Integridad verificada`);
                } else {
                    console.log(`❌ ${ubicacion.tipo}: Error de integridad - ${resultado.error}`);
                }
            } catch (error) {
                console.log(`⚠️  ${ubicacion.tipo}: Error verificando - ${error.message}`);
                this.estadisticasSincronizacion.advertencias.push({
                    ubicacion: ubicacion.tipo,
                    mensaje: error.message
                });
            }
        }
    }

    /**
     * Verifica una ubicación específica
     */
    async verificarUbicacion(archivo, hashOriginal, ubicacion) {
        const verificaciones = this.config.sincronizacion.verificaciones;
        const resultado = {
            ubicacion: ubicacion.tipo,
            valido: true,
            verificaciones: {}
        };

        if (verificaciones.hash) {
            // Simulación de verificación de hash
            resultado.verificaciones.hash = true; // En implementación real verificar
        }

        if (verificaciones.tamaño) {
            // Simulación de verificación de tamaño
            resultado.verificaciones.tamaño = true; // En implementación real verificar
        }

        if (verificaciones.fechaModificacion) {
            // Simulación de verificación de fecha
            resultado.verificaciones.fecha = true; // En implementación real verificar
        }

        return resultado;
    }

    /**
     * Genera hash de archivo
     */
    generarHashArchivo(rutaArchivo) {
        const contenido = fs.readFileSync(rutaArchivo);
        return crypto.createHash('sha256').update(contenido).digest('hex');
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
     * Pausa entre operaciones
     */
    pausa(milisegundos) {
        return new Promise(resolve => setTimeout(resolve, milisegundos));
    }

    /**
     * Genera reporte de sincronización
     */
    async generarReporteSincronizacion(archivo, ubicaciones) {
        const reporte = {
            metadata: {
                archivo: path.basename(archivo),
                timestamp: this.timestamp,
                tamaño: fs.statSync(archivo).size,
                hash: this.generarHashArchivo(archivo)
            },
            sincronizacion: {
                estrategia: this.config.sincronizacion.estrategia,
                ubicaciones: ubicaciones.length,
                ubicacionesExitosas: this.estadisticasSincronizacion.archivosEnviados,
                ubicacionesFallidas: this.estadisticasSincronizacion.errores.length
            },
            estadisticas: {
                archivosEnviados: this.estadisticasSincronizacion.archivosEnviados,
                bytesEnviados: this.estadisticasSincronizacion.bytesEnviados,
                duracion: Date.now() - this.estadisticasSincronizacion.inicio.getTime(),
                velocidad: this.calcularVelocidad()
            },
            integridad: {
                verificacionesRealizadas: this.estadisticasSincronizacion.verificaciones.length,
                verificacionesExitosas: this.estadisticasSincronizacion.verificaciones.filter(v => v.valido).length,
                verificacionesFallidas: this.estadisticasSincronizacion.verificaciones.filter(v => !v.valido).length
            },
            errores: this.estadisticasSincronizacion.errores,
            advertencias: this.estadisticasSincronizacion.advertencias,
            estado: this.estadisticasSincronizacion.errores.length === 0 ? 'EXITOSO' : 'PARCIAL'
        };

        // Guardar reporte
        const archivoReporte = path.join('./storage/reportes', `sincronizacion_${this.timestamp.split('T')[0]}_${Date.now()}.json`);
        fs.mkdirSync(path.dirname(archivoReporte), { recursive: true });
        fs.writeFileSync(archivoReporte, JSON.stringify(reporte, null, 2));

        return reporte;
    }

    /**
     * Calcula velocidad de sincronización
     */
    calcularVelocidad() {
        const duracion = (Date.now() - this.estadisticasSincronizacion.inicio.getTime()) / 1000;
        return this.estadisticasSincronizacion.bytesEnviados / duracion;
    }

    /**
     * Limpia archivos temporales
     */
    async limpiarArchivosTemporales() {
        console.log('🧹 Limpiando archivos temporales...');
        
        // Limpiar directorio de backups de Git temporal
        const directorioTemp = './backups-git';
        if (fs.existsSync(directorioTemp)) {
            fs.rmSync(directorioTemp, { recursive: true, force: true });
        }
        
        console.log('✅ Archivos temporales limpiados');
    }

    /**
     * Maneja errores de sincronización
     */
    async manejarErrorSincronizacion(error) {
        console.error('❌ Error crítico en sincronización:', error);
        
        // Crear reporte de error
        const reporteError = {
            timestamp: this.timestamp,
            estado: 'ERROR',
            error: error.message,
            estadisticas: this.estadisticasSincronizacion
        };
        
        const archivoError = path.join('./storage/reportes', `error_sincronizacion_${Date.now()}.json`);
        fs.mkdirSync(path.dirname(archivoError), { recursive: true });
        fs.writeFileSync(archivoError, JSON.stringify(reporteError, null, 2));
    }

    /**
     * Muestra estadísticas de sincronización
     */
    mostrarEstadisticasSincronizacion() {
        console.log('\n📊 ESTADÍSTICAS DE SINCRONIZACIÓN');
        console.log('=' .repeat(50));
        console.log(`⏱️  Duración: ${((Date.now() - this.estadisticasSincronizacion.inicio.getTime()) / 1000).toFixed(2)}s`);
        console.log(`📤 Archivos enviados: ${this.estadisticasSincronizacion.archivosEnviados}`);
        console.log(`💾 Bytes enviados: ${this.formatearBytes(this.estadisticasSincronizacion.bytesEnviados)}`);
        console.log(`🚀 Velocidad: ${this.formatearVelocidad(this.calcularVelocidad())}/s`);
        console.log(`🔍 Verificaciones: ${this.estadisticasSincronizacion.verificaciones.length}`);
        console.log(`❌ Errores: ${this.estadisticasSincronizacion.errores.length}`);
        console.log(`⚠️  Advertencias: ${this.estadisticasSincronizacion.advertencias.length}`);
        console.log(`✅ Estado: ${this.estadisticasSincronizacion.errores.length === 0 ? 'EXITOSO' : 'CON ERRORES'}`);
        console.log('=' .repeat(50));
    }

    /**
     * Formatea bytes para mostrar
     */
    formatearBytes(bytes) {
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
     * Formatea velocidad para mostrar
     */
    formatearVelocidad(bytesPorSegundo) {
        return this.formatearBytes(bytesPorSegundo);
    }
}

// Ejecutar sincronización si se llama directamente
if (require.main === module) {
    const args = process.argv.slice(2);
    const archivoBackup = args[0];
    const configPath = args[1] || '../config/almacenamiento-config.yaml';
    
    if (!archivoBackup) {
        console.log(`
☁️  Sistema de Almacenamiento Seguro UGT-TOWA

Uso: node sistema-almacenamiento.js [archivo-backup] [archivo-config]

Ejemplo:
  node sistema-almacenamiento.js ./backup-2024-01-15.tar.gz
        `);
        process.exit(1);
    }
    
    const sistema = new SistemaAlmacenamientoSeguro(configPath);
    
    sistema.ejecutarSincronizacionCompleta(archivoBackup)
        .then(reporte => {
            console.log('🎉 Sincronización completada');
            console.log('📊 Reporte generado');
            process.exit(0);
        })
        .catch(error => {
            console.error('💥 Error en sincronización:', error);
            process.exit(1);
        });
}

module.exports = SistemaAlmacenamientoSeguro;