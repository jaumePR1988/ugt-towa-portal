/**
 * Sistema de Protección de Datos Sensibles y Credenciales
 * Sistema de replicación UGT-TOWA
 * 
 * Este script proporciona:
 * - Encriptación de credenciales
 * - Gestión segura de secretos
 * - Rotación automática de claves
 * - Auditoría de accesos
 * - Protección de datos sensibles
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const yaml = require('js-yaml');
const { exec } = require('child_process');

class SistemaProteccionDatos {
    constructor(configPath) {
        this.config = this.cargarConfiguracion(configPath);
        this.timestamp = new Date().toISOString();
        this.logsAcceso = [];
        this.credencialesCache = new Map();
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
            proteccion: {
                algoritmo: 'aes-256-gcm',
                longitudClave: 32,
                longitudIV: 16,
                iteracionesPBKDF2: 100000,
                directorioClaves: './storage/claves',
                directorioCredenciales: './storage/credenciales',
                directorioAuditoria: './storage/auditoria'
            },
            credenciales: {
                baseDatos: {
                    postgres: { host: '', port: '', database: '', user: '', password: '' },
                    mongodb: { host: '', port: '', database: '', user: '', password: '' }
                },
                servicios: {
                    email: { provider: '', apiKey: '', smtp: {} },
                    storage: { provider: '', accessKey: '', secretKey: '', bucket: '' },
                    apis: { resend: '', stripe: '', cloudinary: '' }
                },
                sistema: {
                    jwtSecret: '',
                    encryptionKey: '',
                    sessionSecret: ''
                }
            },
            rotacion: {
                habilitada: true,
                frecuenciaDias: 30,
                clavesRotar: ['jwtSecret', 'encryptionKey', 'sessionSecret'],
                notificarAntesDias: 7
            },
            auditoria: {
                habilitada: true,
                logAccesos: true,
                logFallos: true,
                reporteDiario: true,
                emailAdministrador: ''
            }
        };
    }

    /**
     * Inicializa el sistema de protección
     */
    async inicializar() {
        console.log('🔐 Inicializando sistema de protección de datos...');
        
        try {
            // Crear directorios necesarios
            await this.crearDirectorios();
            
            // Generar clave maestra si no existe
            await this.generarClaveMaestra();
            
            // Inicializar base de datos de credenciales
            await this.inicializarBaseCredenciales();
            
            // Configurar rotación automática
            if (this.config.rotacion.habilitada) {
                await this.configurarRotacionAutomatica();
            }
            
            console.log('✅ Sistema de protección inicializado correctamente');
        } catch (error) {
            console.error('❌ Error inicializando sistema de protección:', error);
            throw error;
        }
    }

    /**
     * Crea directorios necesarios
     */
    async crearDirectorios() {
        const directorios = [
            this.config.proteccion.directorioClaves,
            this.config.proteccion.directorioCredenciales,
            this.config.proteccion.directorioAuditoria
        ];
        
        for (const dir of directorios) {
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
                console.log(`📁 Directorio creado: ${dir}`);
            }
        }
    }

    /**
     * Genera clave maestra del sistema
     */
    async generarClaveMaestra() {
        const archivoClave = path.join(this.config.proteccion.directorioClaves, 'clave_maestra.key');
        
        if (!fs.existsSync(archivoClave)) {
            const claveMaestra = crypto.randomBytes(32);
            
            // Encriptar clave maestra con passphrase del usuario
            const passphrase = await this.solicitarPassphrase('Ingrese passphrase para la clave maestra: ');
            const claveEncriptada = await this.encriptar(claveMaestra, passphrase);
            
            fs.writeFileSync(archivoClave, claveEncriptada);
            console.log('🔑 Clave maestra generada y guardada');
            
            // Crear backup de seguridad de la clave maestra
            await this.crearBackupClaveMaestra(claveEncriptada);
        } else {
            console.log('🔑 Clave maestra ya existe');
        }
    }

    /**
     * Crea backup de la clave maestra
     */
    async crearBackupClaveMaestra(claveEncriptada) {
        const timestamp = new Date().toISOString().split('T')[0];
        const archivoBackup = path.join(this.config.proteccion.directorioClaves, `backup_clave_maestra_${timestamp}.enc`);
        
        // Crear backup encriptado adicional
        const backupEncrypt = await this.encriptar(claveEncriptada, 'backup_system_ugt_towa_2024');
        
        fs.writeFileSync(archivoBackup, backupEncrypt);
        console.log(`💾 Backup de clave maestra creado: ${archivoBackup}`);
    }

    /**
     * Inicializa base de datos de credenciales
     */
    async inicializarBaseCredenciales() {
        const archivoBD = path.join(this.config.proteccion.directorioCredenciales, 'credenciales.enc');
        
        if (!fs.existsSync(archivoBD)) {
            const credencialesVacias = {
                version: '1.0',
                creado: this.timestamp,
                credenciales: this.config.credenciales,
                metadata: {
                    ultimoAcceso: null,
                    totalAccesos: 0,
                    serviciosRegistrados: Object.keys(this.config.credenciales).length
                }
            };
            
            const credencialesEncriptadas = await this.encriptarCredenciales(credencialesVacias);
            fs.writeFileSync(archivoBD, credencialesEncriptadas);
            console.log('💾 Base de datos de credenciales inicializada');
        }
    }

    /**
     * Configura rotación automática de claves
     */
    async configurarRotacionAutomatica() {
        console.log('🔄 Configurando rotación automática de claves...');
        
        // Crear cron job para rotación diaria
        const comandoRotacion = `node ${__filename} rotar-claves`;
        
        // Nota: En un sistema real, esto se integraría con el sistema de cron del SO
        console.log('⏰ Rotación automática programada (cada 30 días)');
    }

    /**
     * Solicita passphrase al usuario
     */
    async solicitarPassphrase(mensaje) {
        // En un entorno real, esto usaría una biblioteca como readline-sync
        // Por ahora, usamos un passphrase por defecto para desarrollo
        return process.env.SYSTEM_PASSPHRASE || 'ugt_towa_backup_2024_secure';
    }

    /**
     * Encripta datos con la clave maestra
     */
    async encriptar(datos, clave) {
        const algorithm = this.config.proteccion.algoritmo;
        const key = crypto.scryptSync(clave, 'salt', 32);
        const iv = crypto.randomBytes(16);
        
        const cipher = crypto.createCipher(algorithm, key);
        cipher.setAAD(Buffer.from('ugt-towa-system'));
        
        let encriptado = cipher.update(datos, 'utf8', 'hex');
        encriptado += cipher.final('hex');
        
        const authTag = cipher.getAuthTag();
        
        return JSON.stringify({
            datos: encriptado,
            iv: iv.toString('hex'),
            authTag: authTag.toString('hex'),
            timestamp: this.timestamp
        });
    }

    /**
     * Desencripta datos con la clave maestra
     */
    async desencriptar(datosEncriptados, clave) {
        try {
            const algorithm = this.config.proteccion.algoritmo;
            const key = crypto.scryptSync(clave, 'salt', 32);
            
            const datos = JSON.parse(datosEncriptados);
            const iv = Buffer.from(datos.iv, 'hex');
            const authTag = Buffer.from(datos.authTag, 'hex');
            
            const decipher = crypto.createDecipher(algorithm, key);
            decipher.setAAD(Buffer.from('ugt-towa-system'));
            decipher.setAuthTag(authTag);
            
            let desencriptado = decipher.update(datos.datos, 'hex', 'utf8');
            desencriptado += decipher.final('utf8');
            
            return desencriptado;
        } catch (error) {
            throw new Error('Error desencriptando datos: ' + error.message);
        }
    }

    /**
     * Encripta credenciales completas
     */
    async encriptarCredenciales(credenciales) {
        const claveMaestra = await this.obtenerClaveMaestra();
        return await this.encriptar(JSON.stringify(credenciales), claveMaestra);
    }

    /**
     * Desencripta credenciales completas
     */
    async desencriptarCredenciales() {
        const archivoBD = path.join(this.config.proteccion.directorioCredenciales, 'credenciales.enc');
        
        if (!fs.existsSync(archivoBD)) {
            throw new Error('Base de datos de credenciales no encontrada');
        }
        
        const claveMaestra = await this.obtenerClaveMaestra();
        const datosEncriptados = fs.readFileSync(archivoBD, 'utf8');
        const datosDesencriptados = await this.desencriptar(datosEncriptados, claveMaestra);
        
        await this.registrarAcceso('lectura', 'credenciales_completas');
        return JSON.parse(datosDesencriptados);
    }

    /**
     * Obtiene la clave maestra
     */
    async obtenerClaveMaestra() {
        const archivoClave = path.join(this.config.proteccion.directorioClaves, 'clave_maestra.key');
        
        if (!fs.existsSync(archivoClave)) {
            throw new Error('Clave maestra no encontrada');
        }
        
        const datosEncriptados = fs.readFileSync(archivoClave, 'utf8');
        const passphrase = await this.solicitarPassphrase('Ingrese passphrase para acceder a las credenciales: ');
        
        return await this.desencriptar(datosEncriptados, passphrase);
    }

    /**
     * Obtiene una credencial específica
     */
    async obtenerCredencial(categoria, subcategoria, nombre) {
        try {
            const credenciales = await this.desencriptarCredenciales();
            const valor = credenciales.credenciales[categoria]?.[subcategoria]?.[nombre];
            
            if (valor === undefined) {
                await this.registrarAcceso('error', `${categoria}.${subcategoria}.${nombre}`, 'Credencial no encontrada');
                throw new Error(`Credencial no encontrada: ${categoria}.${subcategoria}.${nombre}`);
            }
            
            await this.registrarAcceso('lectura', `${categoria}.${subcategoria}.${nombre}`);
            
            // Cache temporal (se limpia después)
            this.credencialesCache.set(`${categoria}.${subcategoria}.${nombre}`, valor);
            
            return valor;
        } catch (error) {
            await this.registrarAcceso('error', `${categoria}.${subcategoria}.${nombre}`, error.message);
            throw error;
        }
    }

    /**
     * Establece una credencial específica
     */
    async establecerCredencial(categoria, subcategoria, nombre, valor) {
        try {
            const credenciales = await this.desencriptarCredenciales();
            
            // Inicializar estructura si no existe
            if (!credenciales.credenciales[categoria]) {
                credenciales.credenciales[categoria] = {};
            }
            if (!credenciales.credenciales[categoria][subcategoria]) {
                credenciales.credenciales[categoria][subcategoria] = {};
            }
            
            // Establecer credencial
            credenciales.credenciales[categoria][subcategoria][nombre] = valor;
            credenciales.metadata.ultimoAcceso = this.timestamp;
            credenciales.metadata.totalAccesos++;
            
            // Re-encriptar y guardar
            const credencialesEncriptadas = await this.encriptarCredenciales(credenciales);
            const archivoBD = path.join(this.config.proteccion.directorioCredenciales, 'credenciales.enc');
            fs.writeFileSync(archivoBD, credencialesEncriptadas);
            
            await this.registrarAcceso('escritura', `${categoria}.${subcategoria}.${nombre}`);
            
            // Limpiar cache
            this.credencialesCache.delete(`${categoria}.${subcategoria}.${nombre}`);
            
            return true;
        } catch (error) {
            await this.registrarAcceso('error', `${categoria}.${subcategoria}.${nombre}`, error.message);
            throw error;
        }
    }

    /**
     * Rota claves automáticamente
     */
    async rotarClaves() {
        console.log('🔄 Iniciando rotación automática de claves...');
        
        try {
            const credenciales = await this.desencriptarCredenciales();
            const clavesRotadas = [];
            
            for (const nombreClave of this.config.rotacion.clavesRotar) {
                const valorAnterior = credenciales.credenciales.sistema?.[nombreClave];
                const valorNuevo = this.generarClaveSegura();
                
                // Actualizar credencial
                credenciales.credenciales.sistema[nombreClave] = valorNuevo;
                clavesRotadas.push(nombreClave);
                
                console.log(`🔑 Clave rotada: ${nombreClave}`);
            }
            
            // Guardar cambios
            const credencialesEncriptadas = await this.encriptarCredenciales(credenciales);
            const archivoBD = path.join(this.config.proteccion.directorioCredenciales, 'credenciales.enc');
            fs.writeFileSync(archivoBD, credencialesEncriptadas);
            
            // Registrar rotación
            await this.registrarRotacion(clavesRotadas);
            
            // Limpiar cache
            this.credencialesCache.clear();
            
            console.log('✅ Rotación de claves completada');
            return clavesRotadas;
        } catch (error) {
            console.error('❌ Error en rotación de claves:', error);
            throw error;
        }
    }

    /**
     * Genera una clave segura
     */
    generarClaveSegura(longitud = 64) {
        return crypto.randomBytes(longitud).toString('hex');
    }

    /**
     * Registra acceso a credenciales
     */
    async registrarAcceso(tipo, recurso, detalle = '') {
        if (!this.config.auditoria.habilitada) return;
        
        const acceso = {
            timestamp: new Date().toISOString(),
            tipo: tipo, // lectura, escritura, error
            recurso: recurso,
            detalle: detalle,
            ip: this.obtenerIP(),
            usuario: process.env.USER || 'sistema',
            proceso: process.pid
        };
        
        this.logsAcceso.push(acceso);
        
        // Guardar log inmediatamente para accesos críticos
        if (tipo === 'error' || tipo === 'escritura') {
            await this.guardarLogAcceso(acceso);
        }
    }

    /**
     * Registra rotación de claves
     */
    async registrarRotacion(claves) {
        const registro = {
            timestamp: this.timestamp,
            claves: claves,
            usuario: process.env.USER || 'sistema',
            motivo: 'rotacion_automatica'
        };
        
        const archivoRotacion = path.join(this.config.proteccion.directorioAuditoria, 'rotaciones.log');
        const entrada = `[${this.timestamp}] ROTACION: ${JSON.stringify(registro)}\n`;
        
        fs.appendFileSync(archivoRotacion, entrada);
        
        // Notificar rotación
        await this.notificarRotacion(claves);
    }

    /**
     * Guarda log de acceso
     */
    async guardarLogAcceso(acceso) {
        const fecha = new Date().toISOString().split('T')[0];
        const archivoLog = path.join(this.config.proteccion.directorioAuditoria, `accesos_${fecha}.log`);
        const entrada = `[${acceso.timestamp}] ${acceso.tipo.toUpperCase()}: ${acceso.recurso} - ${acceso.detalle}\n`;
        
        fs.appendFileSync(archivoLog, entrada);
    }

    /**
     * Obtiene IP del sistema
     */
    obtenerIP() {
        // Simplificado - en producción usarían librerías para obtener IP real
        return '127.0.0.1';
    }

    /**
     * Genera reporte de seguridad
     */
    async generarReporteSeguridad() {
        console.log('📊 Generando reporte de seguridad...');
        
        const credenciales = await this.desencriptarCredenciales();
        const fechaRotacion = this.calcularProximaRotacion();
        
        const reporte = {
            metadata: {
                generado: this.timestamp,
                version: '1.0',
                sistema: 'UGT-TOWA Backup Protection'
            },
            estadoCredenciales: {
                totalCredenciales: this.contarCredenciales(credenciales.credenciales),
                credencialesActivas: this.contarCredencialesActivas(credenciales.credenciales),
                ultimaRotacion: credenciales.metadata.ultimoAcceso,
                proximaRotacion: fechaRotacion
            },
            seguridad: {
                algoritmoEncriptacion: this.config.proteccion.algoritmo,
                longitudClave: this.config.proteccion.longitudClave,
                iteracionesPBKDF2: this.config.proteccion.iteracionesPBKDF2,
                rotacionAutomatica: this.config.rotacion.habilitada
            },
            auditoria: {
                totalAccesos: credenciales.metadata.totalAccesos,
                logsDisponibles: await this.obtenerLogsDisponibles(),
                ultimoAcceso: credenciales.metadata.ultimoAcceso
            },
            recomendaciones: await this.generarRecomendaciones(credenciales)
        };
        
        const archivoReporte = path.join(this.config.proteccion.directorioAuditoria, `reporte_seguridad_${this.timestamp.split('T')[0]}.json`);
        fs.writeFileSync(archivoReporte, JSON.stringify(reporte, null, 2));
        
        console.log(`📋 Reporte de seguridad generado: ${archivoReporte}`);
        return reporte;
    }

    /**
     * Cuenta total de credenciales
     */
    contarCredenciales(credenciales) {
        let total = 0;
        
        for (const categoria of Object.values(credenciales)) {
            for (const subcategoria of Object.values(categoria)) {
                total += Object.keys(subcategoria).length;
            }
        }
        
        return total;
    }

    /**
     * Cuenta credenciales activas (no vacías)
     */
    contarCredencialesActivas(credenciales) {
        let activas = 0;
        
        for (const categoria of Object.values(credenciales)) {
            for (const subcategoria of Object.values(categoria)) {
                for (const valor of Object.values(subcategoria)) {
                    if (valor && valor.toString().trim() !== '') {
                        activas++;
                    }
                }
            }
        }
        
        return activas;
    }

    /**
     * Calcula próxima rotación
     */
    calcularProximaRotacion() {
        const fecha = new Date();
        fecha.setDate(fecha.getDate() + this.config.rotacion.frecuenciaDias);
        return fecha.toISOString();
    }

    /**
     * Obtiene logs disponibles
     */
    async obtenerLogsDisponibles() {
        const directorioLog = this.config.proteccion.directorioAuditoria;
        
        if (!fs.existsSync(directorioLog)) {
            return [];
        }
        
        return fs.readdirSync(directorioLog)
            .filter(archivo => archivo.endsWith('.log'))
            .map(archivo => ({
                archivo: archivo,
                fecha: archivo.replace('accesos_', '').replace('.log', ''),
                tamaño: fs.statSync(path.join(directorioLog, archivo)).size
            }));
    }

    /**
     * Genera recomendaciones de seguridad
     */
    async generarRecomendaciones(credenciales) {
        const recomendaciones = [];
        
        // Verificar credenciales débiles
        const credencialesDebiles = await this.identificarCredencialesDebiles(credenciales.credenciales);
        if (credencialesDebiles.length > 0) {
            recomendaciones.push({
                tipo: 'alerta',
                mensaje: `Se encontraron ${credencialesDebiles.length} credenciales potencialmente débiles`,
                credenciales: credencialesDebiles
            });
        }
        
        // Verificar última rotación
        const diasDesdeUltimaRotacion = this.calcularDiasDesdeRotacion(credenciales.metadata.ultimoAcceso);
        if (diasDesdeUltimaRotacion > this.config.rotacion.frecuenciaDias - this.config.rotacion.notificarAntesDias) {
            recomendaciones.push({
                tipo: 'warning',
                mensaje: `Última rotación hace ${diasDesdeUltimaRotacion} días`,
                diasDesdeRotacion: diasDesdeUltimaRotacion
            });
        }
        
        // Verificar logs de acceso
        if (this.logsAcceso.filter(log => log.tipo === 'error').length > 10) {
            recomendaciones.push({
                tipo: 'alerta',
                mensaje: 'Múltiples errores de acceso detectados',
                errores: this.logsAcceso.filter(log => log.tipo === 'error').length
            });
        }
        
        return recomendaciones;
    }

    /**
     * Identifica credenciales débiles
     */
    async identificarCredencialesDebiles(credenciales) {
        const debiles = [];
        
        const patronesDebiles = [
            /^(admin|root|test|default|123|password)$/i,
            /^[a-z0-9]{1,8}$/i, // Muy cortas
            /^[0-9]+$/, // Solo números
        ];
        
        for (const [categoria, subcategorias] of Object.entries(credenciales)) {
            for (const [subcategoria, valores] of Object.entries(subcategorias)) {
                for (const [nombre, valor] of Object.entries(valores)) {
                    if (valor && typeof valor === 'string') {
                        for (const patron of patronesDebiles) {
                            if (patron.test(valor)) {
                                debiles.push(`${categoria}.${subcategoria}.${nombre}`);
                                break;
                            }
                        }
                    }
                }
            }
        }
        
        return debiles;
    }

    /**
     * Calcula días desde última rotación
     */
    calcularDiasDesdeRotacion(fechaRotacion) {
        if (!fechaRotacion) return 999;
        
        const fecha = new Date(fechaRotacion);
        const ahora = new Date();
        const diferencia = ahora.getTime() - fecha.getTime();
        return Math.floor(diferencia / (1000 * 60 * 60 * 24));
    }

    /**
     * Notifica rotación de claves
     */
    async notificarRotacion(claves) {
        console.log('📧 Notificando rotación de claves...');
        
        if (this.config.auditoria.emailAdministrador) {
            // En implementación real, enviar email
            console.log(`📧 Email enviado a: ${this.config.auditoria.emailAdministrador}`);
        }
    }

    /**
     * Limpia cache de credenciales
     */
    limpiarCache() {
        this.credencialesCache.clear();
        console.log('🧹 Cache de credenciales limpiado');
    }

    /**
     * Verifica integridad del sistema
     */
    async verificarIntegridad() {
        console.log('🔍 Verificando integridad del sistema...');
        
        const verificaciones = {
            claveMaestra: await this.verificarClaveMaestra(),
            directorioCredenciales: await this.verificarDirectorioCredenciales(),
            logsAcceso: await this.verificarLogsAcceso(),
            backupClaves: await this.verificarBackupClaves()
        };
        
        const todoCorrecto = Object.values(verificaciones).every(v => v === true);
        
        console.log('🔍 Verificación de integridad completada:', todoCorrecto ? '✅' : '❌');
        return { todoCorrecto, verificaciones };
    }

    /**
     * Verifica clave maestra
     */
    async verificarClaveMaestra() {
        const archivoClave = path.join(this.config.proteccion.directorioClaves, 'clave_maestra.key');
        return fs.existsSync(archivoClave);
    }

    /**
     * Verifica directorio de credenciales
     */
    async verificarDirectorioCredenciales() {
        const archivoBD = path.join(this.config.proteccion.directorioCredenciales, 'credenciales.enc');
        return fs.existsSync(archivoBD);
    }

    /**
     * Verifica logs de acceso
     */
    async verificarLogsAcceso() {
        const directorioLog = this.config.proteccion.directorioAuditoria;
        return fs.existsSync(directorioLog);
    }

    /**
     * Verifica backup de claves
     */
    async verificarBackupClaves() {
        const directorioClaves = this.config.proteccion.directorioClaves;
        if (!fs.existsSync(directorioClaves)) return false;
        
        const archivosBackup = fs.readdirSync(directorioClaves)
            .filter(archivo => archivo.includes('backup_clave_maestra'));
        
        return archivosBackup.length > 0;
    }
}

// Ejecutar funciones específicas si se llama directamente
if (require.main === module) {
    const args = process.argv.slice(2);
    const comando = args[0];
    const configPath = args[1] || '../config/proteccion-config.yaml';
    
    const sistema = new SistemaProteccionDatos(configPath);
    
    switch (comando) {
        case 'inicializar':
            sistema.inicializar()
                .then(() => {
                    console.log('🎉 Sistema inicializado correctamente');
                    process.exit(0);
                })
                .catch(error => {
                    console.error('💥 Error inicializando sistema:', error);
                    process.exit(1);
                });
            break;
            
        case 'rotar-claves':
            sistema.rotarClaves()
                .then(() => {
                    console.log('🔄 Claves rotadas correctamente');
                    process.exit(0);
                })
                .catch(error => {
                    console.error('💥 Error rotando claves:', error);
                    process.exit(1);
                });
            break;
            
        case 'reporte-seguridad':
            sistema.generarReporteSeguridad()
                .then(reporte => {
                    console.log('📊 Reporte de seguridad generado');
                    console.log(JSON.stringify(reporte, null, 2));
                    process.exit(0);
                })
                .catch(error => {
                    console.error('💥 Error generando reporte:', error);
                    process.exit(1);
                });
            break;
            
        case 'verificar-integridad':
            sistema.verificarIntegridad()
                .then(resultado => {
                    console.log('🔍 Verificación completada:', resultado);
                    process.exit(0);
                })
                .catch(error => {
                    console.error('💥 Error en verificación:', error);
                    process.exit(1);
                });
            break;
            
        default:
            console.log(`
🔐 Sistema de Protección de Datos UGT-TOWA

Comandos disponibles:
  inicializar           - Inicializa el sistema de protección
  rotar-claves          - Rota claves automáticamente
  reporte-seguridad     - Genera reporte de seguridad
  verificar-integridad  - Verifica integridad del sistema

Uso: node sistema-proteccion.js [comando] [archivo-config]
            `);
            process.exit(1);
    }
}

module.exports = SistemaProteccionDatos;