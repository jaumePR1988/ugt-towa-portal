#!/usr/bin/env node

/**
 * Configurador de Dominios
 * 
 * Configura dominios personalizados y certificados SSL para cada instancia
 * del portal sindical.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class ConfiguradorDominios {
    constructor() {
        this.outputDir = path.join(__dirname, '../../dominios/');
        this.certDir = path.join(this.outputDir, 'certificados');
        this.configDir = path.join(this.outputDir, 'configuraciones');
    }

    /**
     * Configura un nuevo dominio
     */
    async configurarDominio(config) {
        console.log(`🌐 Configurando dominio: ${config.dominio}`);
        console.log('=' * 50);

        // 1. Validar configuración del dominio
        this.validarConfiguracion(config);
        
        // 2. Crear estructura de directorios
        await this.crearEstructuraDirectorios(config);
        
        // 3. Generar configuración DNS
        await this.generarConfiguracionDNS(config);
        
        // 4. Configurar certificado SSL
        await this.configurarCertificadoSSL(config);
        
        // 5. Generar configuración de servidor
        await this.generarConfiguracionServidor(config);
        
        // 6. Configurar proxy reverso
        await this.configurarProxyReverso(config);
        
        // 7. Configurar monitoreo
        await this.configurarMonitoreo(config);
        
        // 8. Generar scripts de despliegue
        this.generarScriptsDespliegue(config);
        
        // 9. Crear documentación
        this.generarDocumentacion(config);

        console.log('\n✅ Dominio configurado exitosamente');
        this.mostrarResumen(config);
    }

    /**
     * Valida la configuración del dominio
     */
    validarConfiguracion(config) {
        const required = ['dominio', 'certificado', 'empresa'];
        const missing = required.filter(field => !config[field]);

        if (missing.length > 0) {
            throw new Error(`Campos requeridos faltantes: ${missing.join(', ')}`);
        }

        // Validar formato de dominio
        const domainRegex = /^[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
        if (!domainRegex.test(config.dominio)) {
            throw new Error('Formato de dominio inválido');
        }

        // Validar tipo de certificado
        const tiposCertificado = ['letsencrypt', 'comercial', 'autofirmado'];
        if (!tiposCertificado.includes(config.certificado.tipo)) {
            throw new Error(`Tipo de certificado inválido: ${config.certificado.tipo}`);
        }

        console.log('✅ Validación de configuración completada');
    }

    /**
     * Crea la estructura de directorios
     */
    async crearEstructuraDirectorios(config) {
        const dirs = [
            this.outputDir,
            path.join(this.outputDir, config.dominio),
            path.join(this.outputDir, config.dominio, 'certificados'),
            path.join(this.outputDir, config.dominio, 'configuracion'),
            path.join(this.outputDir, config.dominio, 'scripts'),
            path.join(this.outputDir, config.dominio, 'logs'),
            this.certDir,
            this.configDir
        ];

        dirs.forEach(dir => {
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }
        });

        console.log('📁 Estructura de directorios creada');
    }

    /**
     * Genera configuración DNS
     */
    async generarConfiguracionDNS(config) {
        console.log('📡 Generando configuración DNS...');

        const dnsConfig = this.generarDNSRecords(config);
        const dnsPath = path.join(this.outputDir, config.dominio, 'configuracion', 'dns.json');

        fs.writeFileSync(dnsPath, JSON.stringify(dnsConfig, null, 2));

        // Generar script de configuración DNS
        this.generarScriptDNS(config, dnsConfig);

        console.log('✅ Configuración DNS generada');
    }

    /**
     * Genera los registros DNS
     */
    generarDNSRecords(config) {
        const baseDomain = config.dominio;
        const subdomains = config.subdominios || {};
        const ip = config.ip || '192.168.1.100';
        const cdn = config.cdn || {};

        return {
            dominio: baseDomain,
            registros: {
                // Registro A principal
                '@': {
                    tipo: 'A',
                    valor: ip,
                    ttl: 300
                },
                // WWW
                'www': {
                    tipo: 'CNAME',
                    valor: baseDomain,
                    ttl: 300
                },
                // Subdominios específicos
                ...Object.entries(subdomains).reduce((acc, [sub, value]) => {
                    acc[sub] = {
                        tipo: 'CNAME',
                        valor: value.valor,
                        ttl: 300
                    };
                    return acc;
                }, {}),
                // Registros para servicios
                'api': {
                    tipo: 'A',
                    valor: ip,
                    ttl: 300
                },
                'admin': {
                    tipo: 'CNAME',
                    valor: baseDomain,
                    ttl: 300
                },
                // Configuraciones de CDN
                ...Object.entries(cdn).reduce((acc, [service, cdnConfig]) => {
                    if (service === 'cloudflare') {
                        acc['cdn'] = {
                            tipo: 'CNAME',
                            valor: 'cdn.example.com',
                            ttl: 300
                        };
                    }
                    return acc;
                }, {})
            },
            // Configuraciones adicionales
            configuracionAdicional: {
                // SPF Record
                'spf': {
                    tipo: 'TXT',
                    valor: `v=spf1 include:_spf.${baseDomain} ~all`,
                    ttl: 300
                },
                // DKIM
                'dkim': {
                    tipo: 'TXT',
                    valor: config.dkim || 'v=DKIM1; k=rsa; p=YOUR_PUBLIC_KEY',
                    ttl: 300
                },
                // DMARC
                '_dmarc': {
                    tipo: 'TXT',
                    valor: 'v=DMARC1; p=quarantine; rua=mailto:dmarc@' + baseDomain,
                    ttl: 300
                }
            }
        };
    }

    /**
     * Configura certificado SSL
     */
    async configurarCertificadoSSL(config) {
        console.log('🔒 Configurando certificado SSL...');

        switch (config.certificado.tipo) {
            case 'letsencrypt':
                await this.configurarLetsEncrypt(config);
                break;
            case 'comercial':
                await this.configurarCertificadoComercial(config);
                break;
            case 'autofirmado':
                await this.configurarCertificadoAutofirmado(config);
                break;
        }

        console.log('✅ Certificado SSL configurado');
    }

    /**
     * Configura Let's Encrypt
     */
    async configurarLetsEncrypt(config) {
        const certPath = path.join(this.outputDir, config.dominio, 'certificados');
        const email = config.certificado.email;

        if (!email) {
            throw new Error('Email requerido para Let's Encrypt');
        }

        // Generar configuración certbot
        const certbotConfig = {
            domains: [config.dominio, `www.${config.dominio}`],
            email: email,
           agree_tos: true,
            non_interactive: true,
            webroot_plugin: {
                webroot_path: '/var/www/certbot'
            }
        };

        const configPath = path.join(certPath, 'certbot.json');
        fs.writeFileSync(configPath, JSON.stringify(certbotConfig, null, 2));

        // Generar script de renovación automática
        this.generarScriptRenovacion(config);
    }

    /**
     * Configura certificado comercial
     */
    async configurarCertificadoComercial(config) {
        const { certPath: providedCertPath, keyPath: providedKeyPath } = config.certificado;

        if (!providedCertPath || !providedKeyPath) {
            throw new Error('Rutas de certificado y clave requeridas para certificado comercial');
        }

        // Copiar certificados a la estructura del proyecto
        const destCertPath = path.join(this.outputDir, config.dominio, 'certificados', 'certificado.crt');
        const destKeyPath = path.join(this.outputDir, config.dominio, 'certificados', 'certificado.key');

        try {
            fs.copyFileSync(providedCertPath, destCertPath);
            fs.copyFileSync(providedKeyPath, destKeyPath);
        } catch (error) {
            throw new Error(`Error al copiar certificados: ${error.message}`);
        }

        // Configurar permisos
        fs.chmodSync(destKeyPath, '600');
        fs.chmodSync(destCertPath, '644');
    }

    /**
     * Configura certificado autofirmado
     */
    async configurarCertificadoAutofirmado(config) {
        // Generar certificado autofirmado usando openssl
        const certPath = path.join(this.outputDir, config.dominio, 'certificados', 'certificado.crt');
        const keyPath = path.join(this.outputDir, config.dominio, 'certificados', 'certificado.key');

        const cmd = `openssl req -x509 -nodes -days 365 -newkey rsa:2048 \\
            -keyout "${keyPath}" \\
            -out "${certPath}" \\
            -subj "/C=ES/ST=Madrid/L=Madrid/O=${config.empresa}/CN=${config.dominio}"`;

        try {
            execSync(cmd, { stdio: 'inherit' });
            console.log('✅ Certificado autofirmado generado');
        } catch (error) {
            throw new Error(`Error al generar certificado autofirmado: ${error.message}`);
        }

        // Configurar permisos
        fs.chmodSync(keyPath, '600');
        fs.chmodSync(certPath, '644');
    }

    /**
     * Genera configuración de servidor
     */
    async generarConfiguracionServidor(config) {
        console.log('🖥️ Generando configuración de servidor...');

        // Nginx
        this.generarConfiguracionNginx(config);
        
        // Apache
        this.generarConfiguracionApache(config);
        
        // Caddy
        this.generarConfiguracionCaddy(config);

        console.log('✅ Configuración de servidor generada');
    }

    /**
     * Genera configuración de Nginx
     */
    generarConfiguracionNginx(config) {
        const nginxConfig = `# Configuración Nginx para ${config.dominio}
# Generado automáticamente

server {
    listen 80;
    server_name ${config.dominio} www.${config.dominio};
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name ${config.dominio} www.${config.dominio};

    # SSL Configuration
    ssl_certificate /path/to/certificados/certificado.crt;
    ssl_certificate_key /path/to/certificados/certificado.key;
    
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;
    
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;

    # Security Headers
    add_header Strict-Transport-Security "max-age=63072000; includeSubDomains; preload";
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;

    # Document root
    root /var/www/${config.dominio};
    index index.html;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;

    # Static files
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Frontend (React/Vite)
    location / {
        try_files $uri $uri/ /index.html;
        
        # Security for index.html
        location = /index.html {
            add_header Cache-Control "no-cache, no-store, must-revalidate";
        }
    }

    # API Backend
    location /api/ {
        proxy_pass http://localhost:54321;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Health check
    location /health {
        access_log off;
        return 200 "healthy\n";
        add_header Content-Type text/plain;
    }

    # Deny access to hidden files
    location ~ /\. {
        deny all;
    }

    # Error pages
    error_page 404 /404.html;
    error_page 500 502 503 504 /50x.html;
    
    location = /50x.html {
        root /usr/share/nginx/html;
    }
}

# Server block for admin subdomain
server {
    listen 443 ssl http2;
    server_name admin.${config.dominio};

    # SSL Configuration (same as main domain)
    ssl_certificate /path/to/certificados/certificado.crt;
    ssl_certificate_key /path/to/certificados/certificado.key;

    # Document root
    root /var/www/${config.dominio}/admin;
    index index.html;

    # Admin specific configuration
    location / {
        try_files $uri $uri/ /admin/index.html;
    }
}
`;

        const nginxPath = path.join(this.outputDir, config.dominio, 'configuracion', 'nginx.conf');
        fs.writeFileSync(nginxPath, nginxConfig);
    }

    /**
     * Genera configuración de Apache
     */
    generarConfiguracionApache(config) {
        const apacheConfig = `# Configuración Apache para ${config.dominio}
# Generado automáticamente

<VirtualHost *:80>
    ServerName ${config.dominio}
    ServerAlias www.${config.dominio}
    Redirect permanent / https://${config.dominio}/
</VirtualHost>

<VirtualHost *:443>
    ServerName ${config.dominio}
    ServerAlias www.${config.dominio}
    DocumentRoot /var/www/${config.dominio}
    
    # SSL Configuration
    SSLEngine on
    SSLCertificateFile /path/to/certificados/certificado.crt
    SSLCertificateKeyFile /path/to/certificados/certificado.key
    
    # Security Headers
    Header always set Strict-Transport-Security "max-age=63072000; includeSubDomains; preload"
    Header always set X-Frame-Options "SAMEORIGIN"
    Header always set X-Content-Type-Options "nosniff"
    Header always set X-XSS-Protection "1; mode=block"
    
    # Compression
    LoadModule deflate_module modules/mod_deflate.so
    <Location />
        SetOutputFilter DEFLATE
    </Location>
    
    # Frontend (React/Vite)
    <Directory "/var/www/${config.dominio}">
        Options Indexes FollowSymLinks
        AllowOverride All
        Require all granted
        
        # Fallback to index.html for SPA
        RewriteEngine On
        RewriteBase /
        RewriteRule ^index\\.html$ - [L]
        RewriteCond %{REQUEST_FILENAME} !-f
        RewriteCond %{REQUEST_FILENAME} !-d
        RewriteRule . /index.html [L]
    </Directory>
    
    # Error pages
    ErrorDocument 404 /404.html
    ErrorDocument 500 502 503 504 /50x.html
    
    # Logging
    CustomLog logs/${config.dominio}_access.log combined
    ErrorLog logs/${config.dominio}_error.log
</VirtualHost>
`;

        const apachePath = path.join(this.outputDir, config.dominio, 'configuracion', 'apache.conf');
        fs.writeFileSync(apachePath, apacheConfig);
    }

    /**
     * Genera configuración de Caddy
     */
    generarConfiguracionCaddy(config) {
        const caddyConfig = `# Configuración Caddy para ${config.dominio}
# Generado automáticamente

${config.dominio}, www.${config.dominio} {
    # Automatic HTTPS
    tls internal  # Para desarrollo, usar 'tls off' para pruebas
    # tls {
    #     issuer internal
    # }
    
    # Security headers
    header {
        Strict-Transport-Security "max-age=63072000; includeSubDomains; preload"
        X-Frame-Options "SAMEORIGIN"
        X-Content-Type-Options "nosniff"
        X-XSS-Protection "1; mode=block"
        Referrer-Policy "strict-origin-when-cross-origin"
    }
    
    # Frontend (React/Vite)
    root * /var/www/${config.dominio}
    
    # Serve static files
    @static {
        path *.js *.css *.png *.jpg *.jpeg *.gif *.ico *.svg *.woff *.woff2
    }
    header @static Cache-Control "public, max-age=31536000, immutable"
    
    # SPA fallback
    @notStatic {
        not path *.js *.css *.png *.jpg *.jpeg *.gif *.ico *.svg
    }
    reverse_proxy @notStatic localhost:3000
    
    # API Backend
    handle /api/* {
        reverse_proxy http://localhost:54321
    }
    
    # File server
    file_server
}
`;

        const caddyPath = path.join(this.outputDir, config.dominio, 'configuracion', 'Caddyfile');
        fs.writeFileSync(caddyPath, caddyConfig);
    }

    /**
     * Configura proxy reverso
     */
    async configurarProxyReverso(config) {
        console.log('🔀 Configurando proxy reverso...');

        // Nginx Proxy Manager
        this.generarNginxProxyManager(config);
        
        // HAProxy
        this.generarHAProxy(config);

        console.log('✅ Proxy reverso configurado');
    }

    /**
     * Genera configuración de Nginx Proxy Manager
     */
    generarNginxProxyManager(config) {
        const npmConfig = {
            domain: config.dominio,
            scheme: "https",
            host: config.dominio,
            port: 443,
            advanced: {
                client_max_body_size: "10m",
                proxy_set_header: {
                    X-Real-IP: "$remote_addr",
                    X-Forwarded-For: "$proxy_add_x_forwarded_for",
                    X-Forwarded-Proto: "$scheme"
                }
            }
        };

        const configPath = path.join(this.outputDir, config.dominio, 'configuracion', 'nginx-proxy-manager.json');
        fs.writeFileSync(configPath, JSON.stringify(npmConfig, null, 2));
    }

    /**
     * Genera configuración de HAProxy
     */
    generarHAProxy(config) {
        const haproxyConfig = `# Configuración HAProxy para ${config.dominio}
# Generado automáticamente

global
    log stdout local0
    chroot /var/lib/haproxy
    stats socket /run/haproxy/admin.sock mode 660 level admin
    stats timeout 30s
    user haproxy
    group haproxy
    daemon

defaults
    mode http
    log global
    option httplog
    option dontlognull
    option log-health-checks
    option forwardfor
    option http-server-close
    timeout connect 5000
    timeout client 50000
    timeout server 50000

frontend portal_frontend
    bind *:80
    bind *:443 ssl crt /path/to/certificados/certificado.pem
    redirect scheme https if !{ ssl_fc }
    
    # Security headers
    http-response set-header Strict-Transport-Security "max-age=63072000; includeSubDomains; preload"
    http-response set-header X-Frame-Options "SAMEORIGIN"
    http-response set-header X-Content-Type-Options "nosniff"
    
    # Frontend
    use_backend portal_frontend if { hdr(host) -i ${config.dominio} }
    
    # Admin
    use_backend portal_admin if { hdr(host) -i admin.${config.dominio} }

backend portal_frontend
    option httpchk GET /health
    server web1 localhost:3000 check
    server web2 localhost:3001 check backup

backend portal_admin
    option httpchk GET /admin/health
    server web1 localhost:3002 check
`;

        const configPath = path.join(this.outputDir, config.dominio, 'configuracion', 'haproxy.cfg');
        fs.writeFileSync(configPath, haproxyConfig);
    }

    /**
     * Configura monitoreo
     */
    async configurarMonitoreo(config) {
        console.log('📊 Configurando monitoreo...');

        // Prometheus
        this.generarPrometheus(config);
        
        // Grafana
        this.generarGrafana(config);
        
        // Uptime monitoring
        this.generarUptimeMonitoring(config);

        console.log('✅ Monitoreo configurado');
    }

    /**
     * Genera configuración de Prometheus
     */
    generarPrometheus(config) {
        const prometheusConfig = `# Configuración Prometheus para ${config.dominio}
# Generado automáticamente

global:
  scrape_interval: 15s
  evaluation_interval: 15s

scrape_configs:
  - job_name: 'portal-sindical'
    static_configs:
      - targets: ['localhost:3000']
    metrics_path: '/api/metrics'
    scrape_interval: 30s

  - job_name: 'nginx'
    static_configs:
      - targets: ['localhost:9113']
    metrics_path: '/metrics'
    scrape_interval: 30s

  - job_name: 'node'
    static_configs:
      - targets: ['localhost:9100']
    scrape_interval: 30s
`;

        const configPath = path.join(this.outputDir, config.dominio, 'configuracion', 'prometheus.yml');
        fs.writeFileSync(configPath, prometheusConfig);
    }

    /**
     * Genera configuración de Grafana
     */
    generarGrafana(config) {
        const grafanaConfig = `# Configuración Grafana para ${config.dominio}

[server]
domain = grafana.${config.dominio}
root_url = https://grafana.${config.dominio}

[security]
admin_user = admin
admin_password = ${config.adminPassword || 'admin'}

[metrics]
enabled = true

[log]
level = info

[dashboards]
default_home_dashboard_path = /var/lib/grafana/dashboards/dashboard.json
`;

        const configPath = path.join(this.outputDir, config.dominio, 'configuracion', 'grafana.ini');
        fs.writeFileSync(configPath, grafanaConfig);
    }

    /**
     * Genera configuración de uptime monitoring
     */
    generarUptimeMonitoring(config) {
        const uptimeConfig = {
            nombre: config.dominio,
            url: `https://${config.dominio}`,
            intervalo: 300, // 5 minutos
            timeout: 30,
            reintentos: 3,
            notificaciones: {
                email: config.notificaciones?.email || config.email,
                slack: config.notificaciones?.slack,
                webhook: config.notificaciones?.webhook
            },
            checks: [
                {
                    nombre: "Health Check",
                    path: "/health",
                    esperado: 200
                },
                {
                    nombre: "API Check",
                    path: "/api/health",
                    esperado: 200
                }
            ]
        };

        const configPath = path.join(this.outputDir, config.dominio, 'configuracion', 'uptime.json');
        fs.writeFileSync(configPath, JSON.stringify(uptimeConfig, null, 2));
    }

    /**
     * Genera scripts de despliegue
     */
    generarScriptsDespliegue(config) {
        console.log('📜 Generando scripts de despliegue...');

        // Script de instalación
        this.generarScriptInstalacion(config);
        
        // Script de actualización
        this.generarScriptActualizacion(config);
        
        // Script de backup
        this.generarScriptBackup(config);

        console.log('✅ Scripts de despliegue generados');
    }

    /**
     * Genera script de instalación
     */
    generarScriptInstalacion(config) {
        const installScript = `#!/bin/bash

# Script de instalación - ${config.dominio}
# Generado automáticamente

set -e

echo "🚀 Instalando portal sindical para ${config.dominio}"

# Verificar que somos root
if [ "$EUID" -ne 0 ]; then
    echo "Este script debe ejecutarse como root"
    exit 1
fi

# Actualizar sistema
apt update && apt upgrade -y

# Instalar dependencias
apt install -y nginx certbot python3-certbot-nginx curl wget unzip

# Crear directorio de la aplicación
mkdir -p /var/www/${config.dominio}
chown -R www-data:www-data /var/www/${config.dominio}

# Configurar Nginx
cp configuracion/nginx.conf /etc/nginx/sites-available/${config.dominio}
ln -sf /etc/nginx/sites-available/${config.dominio} /etc/nginx/sites-enabled/

# Configurar certificado SSL
if [ "${config.certificado.tipo}" = "letsencrypt" ]; then
    certbot --nginx -d ${config.dominio} -d www.${config.dominio} --email ${config.certificado.email} --agree-tos --non-interactive
fi

# Reiniciar servicios
systemctl restart nginx
systemctl enable nginx

# Configurar firewall
ufw allow 'Nginx Full'
ufw --force enable

echo "✅ Instalación completada"
echo "🌐 Dominio configurado: ${config.dominio}"
echo "🔒 SSL configurado: ${config.certificado.tipo}"
echo ""
echo "📋 Próximos pasos:"
echo "1. Subir archivos de la aplicación a /var/www/${config.dominio}"
echo "2. Configurar variables de entorno"
echo "3. Iniciar servicios backend"
echo "4. Verificar funcionamiento en https://${config.dominio}"
`;

        const scriptPath = path.join(this.outputDir, config.dominio, 'scripts', 'instalar.sh');
        fs.writeFileSync(scriptPath, installScript);
        fs.chmodSync(scriptPath, '755');
    }

    /**
     * Genera script de actualización
     */
    generarScriptActualizacion(config) {
        const updateScript = `#!/bin/bash

# Script de actualización - ${config.dominio}

set -e

echo "🔄 Actualizando portal sindical para ${config.dominio}"

# Backup antes de actualizar
./scripts/backup.sh

# Actualizar sistema
apt update && apt upgrade -y

# Renovar certificado SSL
if [ "${config.certificado.tipo}" = "letsencrypt" ]; then
    certbot renew --quiet
fi

# Recargar Nginx
nginx -t && systemctl reload nginx

echo "✅ Actualización completada"
`;

        const scriptPath = path.join(this.outputDir, config.dominio, 'scripts', 'actualizar.sh');
        fs.writeFileSync(scriptPath, updateScript);
        fs.chmodSync(scriptPath, '755');
    }

    /**
     * Genera script de backup
     */
    generarScriptBackup(config) {
        const backupScript = `#!/bin/bash

# Script de backup - ${config.dominio}

set -e

BACKUP_DIR="/var/backups/portal-sindical"
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_PATH="$BACKUP_DIR/${config.dominio}_$DATE"

echo "💾 Creando backup para ${config.dominio}"

# Crear directorio de backup
mkdir -p "$BACKUP_PATH"

# Backup de archivos
tar -czf "$BACKUP_PATH/archivos.tar.gz" -C /var/www ${config.dominio}

# Backup de configuración
cp -r configuracion "$BACKUP_PATH/"
cp -r scripts "$BACKUP_PATH/"

# Backup de certificados
mkdir -p "$BACKUP_PATH/certificados"
cp certificados/* "$BACKUP_PATH/certificados/" 2>/dev/null || true

# Backup de base de datos (si existe)
if command -v pg_dump &> /dev/null; then
    pg_dump -h localhost -U postgres portal_sindical > "$BACKUP_PATH/database.sql"
fi

# Limpiar backups antiguos (mantener últimos 7 días)
find "$BACKUP_DIR" -name "${config.dominio}_*" -type d -mtime +7 -exec rm -rf {} + 2>/dev/null || true

echo "✅ Backup completado: $BACKUP_PATH"
`;

        const scriptPath = path.join(this.outputDir, config.dominio, 'scripts', 'backup.sh');
        fs.writeFileSync(scriptPath, backupScript);
        fs.chmodSync(scriptPath, '755');
    }

    /**
     * Genera documentación del dominio
     */
    generarDocumentacion(config) {
        console.log('📚 Generando documentación...');

        const readme = `# Configuración de Dominio - ${config.dominio}

## Información General
- **Dominio:** ${config.dominio}
- **Empresa:** ${config.empresa}
- **Certificado:** ${config.certificado.tipo}
- **Fecha de configuración:** ${new Date().toISOString()}

## Estructura de Archivos
\`\`\`
${config.dominio}/
├── certificados/          # Certificados SSL
│   ├── certificado.crt    # Certificado
│   └── certificado.key    # Clave privada
├── configuracion/         # Configuraciones de servidor
│   ├── nginx.conf         # Configuración Nginx
│   ├── apache.conf        # Configuración Apache
│   ├── Caddyfile          # Configuración Caddy
│   ├── haproxy.cfg        # Configuración HAProxy
│   ├── dns.json           # Registros DNS
│   └── prometheus.yml     # Configuración monitoreo
├── scripts/               # Scripts de gestión
│   ├── instalar.sh        # Instalación inicial
│   ├── actualizar.sh      # Actualización
│   └── backup.sh          # Backup
└── logs/                  # Archivos de log
\`\`\`

## Configuración DNS
Registre los siguientes DNS en su proveedor de dominio:

\`\`\`
Tipo    Nombre    Valor
A       @         ${config.ip || 'IP_DE_SERVIDOR'}
CNAME   www       ${config.dominio}
CNAME   admin     ${config.dominio}
CNAME   api       ${config.dominio}
\`\`\`

## Instalación
\`\`\`bash
# Ejecutar como root
sudo ./scripts/instalar.sh
\`\`\`

## Gestión
\`\`\`bash
# Actualizar
sudo ./scripts/actualizar.sh

# Backup
sudo ./scripts/backup.sh
\`\`\`

## Certificados SSL
- **Tipo:** ${config.certificado.tipo}
${config.certificado.email ? `- **Email:** ${config.certificado.email}` : ''}

## Servicios Configurados
- ✅ Nginx (Servidor web)
- ✅ SSL/TLS (HTTPS)
- ✅ Proxy reverso
- ✅ Monitoreo (Prometheus/Grafana)
- ✅ Uptime monitoring

## Próximos Pasos
1. Configurar DNS en su proveedor de dominio
2. Ejecutar script de instalación
3. Verificar funcionamiento
4. Configurar backups automáticos

## Soporte
Para soporte técnico, consulte la documentación principal del sistema de replicación.

---
Generado automáticamente el ${new Date().toISOString()}
`;

        const docPath = path.join(this.outputDir, config.dominio, 'README.md');
        fs.writeFileSync(docPath, readme);
    }

    /**
     * Genera script DNS
     */
    generarScriptDNS(config, dnsConfig) {
        const script = `#!/bin/bash

# Script de configuración DNS - ${config.dominio}
# Generado automáticamente

echo "📡 Configurando DNS para ${config.dominio}"

# Registros DNS a configurar:
# (Configure estos valores en su proveedor de DNS)

`;

        Object.entries(dnsConfig.registros).forEach(([nombre, registro]) => {
            script += `# ${nombre}.${config.dominio}\n`;
            script += `# Tipo: ${registro.tipo}\n`;
            script += `# Valor: ${registro.valor}\n`;
            script += `# TTL: ${registro.ttl}\n\n`;
        });

        script += `echo "✅ Registros DNS configurados en su proveedor de dominio"`;

        const scriptPath = path.join(this.outputDir, config.dominio, 'scripts', 'configurar-dns.sh');
        fs.writeFileSync(scriptPath, script);
        fs.chmodSync(scriptPath, '755');
    }

    /**
     * Genera script de renovación SSL
     */
    generarScriptRenovacion(config) {
        const script = `#!/bin/bash

# Script de renovación SSL - ${config.dominio}

# Renovar certificado Let's Encrypt
certbot renew --nginx --quiet

# Reiniciar Nginx después de la renovación
nginx -t && systemctl reload nginx

echo "✅ Certificado SSL renovado"
`;

        const scriptPath = path.join(this.outputDir, config.dominio, 'scripts', 'renovar-ssl.sh');
        fs.writeFileSync(scriptPath, script);
        fs.chmodSync(scriptPath, '755');

        // Cron job para renovación automática
        const cronJob = `0 12 * * * /path/to/scripts/renovar-ssl.sh`;
        const cronPath = path.join(this.outputDir, config.dominio, 'configuracion', 'cron.txt');
        fs.writeFileSync(cronPath, cronJob);
    }

    /**
     * Muestra resumen final
     */
    mostrarResumen(config) {
        console.log('\n📋 Resumen de configuración:');
        console.log(`   • Dominio: ${config.dominio}`);
        console.log(`   • Certificado: ${config.certificado.tipo}`);
        console.log(`   • Empresa: ${config.empresa}`);
        console.log(`   • URL: https://${config.dominio}`);
        console.log(`   • Admin: https://admin.${config.dominio}`);
        console.log(`\n🎉 ¡Dominio listo para usar!`);
    }
}

// Función principal
function main() {
    const args = process.argv.slice(2);
    const comando = args[0];

    if (!comando) {
        console.log(`
🌐 Configurador de Dominios - Portal Sindical

Uso:
  node configurador-dominios.js configurar [parametros]  # Configurar dominio
  node configurador-dominios.js letsencrypt [dominio] [email]  # Configurar Let's Encrypt
  node configurador-dominios.js comercial [dominio] [cert_path] [key_path]  # Configurar certificado comercial

Ejemplos:
  node configurador-dominios.js configurar --dominio "mi-empresa.com" --empresa "Mi Empresa" --certificado-tipo "letsencrypt" --email "admin@mi-empresa.com"
  
  node configurador-dominios.js comercial "mi-empresa.com" "/ruta/certificado.crt" "/ruta/certificado.key"

Tipos de certificado:
  - letsencrypt: SSL gratuito de Let's Encrypt
  - comercial: Certificado comercial proporcionado
  - autofirmado: Certificado autofirmado (solo para desarrollo)
        `);
        return;
    }

    const configurador = new ConfiguradorDominios();

    try {
        switch (comando) {
            case 'configurar':
                const config = {
                    dominio: args[1],
                    empresa: args[2],
                    certificado: {
                        tipo: args[3] || 'letsencrypt',
                        email: args[4]
                    },
                    ip: args[5],
                    subdominios: args[6] ? JSON.parse(args[6]) : {}
                };
                configurador.configurarDominio(config);
                break;
                
            case 'letsencrypt':
                const letsencryptConfig = {
                    dominio: args[1],
                    empresa: 'Portal Sindical',
                    certificado: {
                        tipo: 'letsencrypt',
                        email: args[2]
                    }
                };
                configurador.configurarDominio(letsencryptConfig);
                break;
                
            case 'comercial':
                const comercialConfig = {
                    dominio: args[1],
                    empresa: 'Portal Sindical',
                    certificado: {
                        tipo: 'comercial',
                        certPath: args[2],
                        keyPath: args[3]
                    }
                };
                configurador.configurarDominio(comercialConfig);
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

module.exports = ConfiguradorDominios;
