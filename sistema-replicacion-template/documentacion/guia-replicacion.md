# Guía de Replicación - Portal Sindical UGT Towa

## Descripción General

Esta guía proporciona instrucciones paso a paso para replicar completamente el Portal UGT Towa como un template genérico para cualquier empresa u organización sindical. El proceso completo toma **2-4 horas** y resulta en una instancia completamente funcional y personalizada.

## Requisitos Previos

### 1. Software Necesario
- **Node.js 18+** y npm/pnpm
- **PostgreSQL 13+** (para desarrollo local)
- **Git** para control de versiones
- **Nginx** (servidor web)
- **Certbot** (para certificados SSL)
- **curl** y **wget** (utilidades de red)

### 2. Cuentas y Servicios
- **Cuenta Supabase** con acceso a proyectos
- **Dominio personalizado** (opcional)
- **Certificado SSL** (Let's Encrypt recomendado)
- **Cuenta de email** para notificaciones

### 3. Recursos del Sistema
- **CPU:** 2 cores mínimo
- **RAM:** 4GB mínimo
- **Almacenamiento:** 20GB mínimo
- **Ancho de banda:** Conexión estable

## Proceso de Replicación

### Paso 1: Preparación del Entorno (15 minutos)

#### 1.1. Clonar el Sistema de Replicación
\`\`\`bash
# Crear directorio de trabajo
mkdir portal-sindical-replicacion
cd portal-sindical-replicacion

# El sistema ya está disponible en el workspace
# No necesita clonado adicional
\`\`\`

#### 1.2. Instalar Dependencias
\`\`\`bash
cd sistema-replicacion-template
npm install

# O con pnpm
pnpm install
\`\`\`

#### 1.3. Verificar Herramientas
\`\`\`bash
# Verificar Node.js
node --version  # Debe ser 18+

# Verificar PostgreSQL
psql --version

# Verificar Nginx
nginx -v

# Verificar Git
git --version
\`\`\`

### Paso 2: Configuración Inicial (20 minutos)

#### 2.1. Crear Nueva Instancia
\`\`\`bash
# Ejecutar el creador de empresas
node herramientas/crear-empresa.js \\
  --nombre "Mi Empresa S.L." \\
  --sector "industrial" \\
  --dominio "mi-empresa.com" \\
  --email "contacto@mi-empresa.com" \\
  --telefono "+34 900 000 000" \\
  --direccion "Calle Principal 123, Madrid"
\`\`\`

#### 2.2. Generar Configuración Avanzada
\`\`\`bash
# Ver casos de uso disponibles
node herramientas/generador-config.js casos-uso

# Ver sectores disponibles
node herramientas/generador-config.js sectores

# Generar configuración completa
node herramientas/generador-config.js generar \\
  "Mi Empresa S.L." \\
  "mi-empresa.com" \\
  "contacto@mi-empresa.com" \\
  "+34 900 000 000" \\
  "Calle Principal 123, Madrid" \\
  "#1e40af" \\
  "#059669" \\
  "#dc2626" \\
  "completo" \\
  "industrial"
\`\`\`

### Paso 3: Configuración de Base de Datos (30 minutos)

#### 3.1. Crear Base de Datos
\`\`\`bash
# Crear base de datos
node herramientas/migrador-bd.js crear \\
  --nombre "portal_mi_empresa" \\
  --empresa "Mi Empresa S.L." \\
  --dominio "mi-empresa.com" \\
  --sector "industrial" \\
  --email "contacto@mi-empresa.com" \\
  --telefono "+34 900 000 000" \\
  --direccion "Calle Principal 123, Madrid" \\
  --tipos-citas '[{"id":"sindical","nombre":"Asuntos Sindicales"},{"id":"seguridad","nombre":"Seguridad Industrial"}]' \\
  --horarios '{"lunes":{"inicio":"08:00","fin":"18:00","activo":true}}' \\
  --textos '{"titulo":"Portal Sindical Mi Empresa"}' \\
  --funcionalidades '{"citas":true,"comunicados":true,"encuestas":true}'
\`\`\`

#### 3.2. Aplicar Migración
\`\`\`bash
# Si tienes un archivo de migración específico
node herramientas/migrador-bd.js migrar migracion_personalizada.sql

# Verificar estructura de base de datos
psql -U postgres -d portal_mi_empresa -c "\\dt"
\`\`\`

#### 3.3. Crear Usuario Administrador
\`\`\`bash
# Conectar a la base de datos
psql -U postgres -d portal_mi_empresa

-- Crear usuario administrador
INSERT INTO auth.users (
    id,
    instance_id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    created_at,
    updated_at,
    raw_app_meta_data,
    raw_user_meta_data,
    is_super_admin
) VALUES (
    gen_random_uuid(),
    '00000000-0000-0000-0000-000000000000',
    'authenticated',
    'authenticated',
    'admin@mi-empresa.com',
    crypt('AdminPassword123!', gen_salt('bf')),
    NOW(),
    NOW(),
    NOW(),
    '{"provider":"email","providers":["email"]}',
    '{}',
    false
);

-- Crear perfil de administrador
INSERT INTO profiles (
    id,
    full_name,
    role,
    email,
    empresa_id
) VALUES (
    (SELECT id FROM auth.users WHERE email = 'admin@mi-empresa.com'),
    'Administrador Mi Empresa',
    'admin',
    'admin@mi-empresa.com',
    (SELECT id FROM empresa_config WHERE dominio = 'mi-empresa.com')
);
\`\`\`

### Paso 4: Configuración de Dominio (25 minutos)

#### 4.1. Configurar DNS
\`\`\`bash
# Generar configuración DNS
node herramientas/configurador-dominios.js configurar \\
  --dominio "mi-empresa.com" \\
  --empresa "Mi Empresa S.L." \\
  --certificado-tipo "letsencrypt" \\
  --email "admin@mi-empresa.com"
\`\`\`

#### 4.2. Configurar Registros DNS
En su proveedor de DNS, configure los siguientes registros:

\`\`\`
Tipo    Nombre    Valor
A       @         IP_DE_SU_SERVIDOR
A       www       IP_DE_SU_SERVIDOR
CNAME   admin     mi-empresa.com
CNAME   api       mi-empresa.com
\`\`\`

#### 4.3. Instalar Certificado SSL
\`\`\`bash
# Ejecutar script de instalación
cd dominios/mi-empresa.com
sudo ./scripts/instalar.sh

# Verificar certificado
sudo certbot certificates
\`\`\`

### Paso 5: Despliegue de la Aplicación (45 minutos)

#### 5.1. Construir Frontend
\`\`\`bash
# Ir al directorio de la instancia
cd instancias/mi-empresa/frontend

# Instalar dependencias
npm install

# Construir aplicación
npm run build

# Verificar build
ls -la dist/
\`\`\`

#### 5.2. Configurar Variables de Entorno
\`\`\`bash
# Copiar archivo de ejemplo
cp ../configuraciones/mi-empresa/.env.example .env.local

# Editar variables de entorno
nano .env.local
\`\`\`

Contenido del archivo \`.env.local\`:
\`\`\`env
# === EMPRESA ===
EMPRESA_NOMBRE=Mi Empresa S.L.
EMPRESA_DOMINIO=mi-empresa.com
EMPRESA_EMAIL=contacto@mi-empresa.com
EMPRESA_TELEFONO=+34 900 000 000
EMPRESA_DIRECCION=Calle Principal 123, Madrid

# === COLORES ===
EMPRESA_COLOR_PRIMARIO=#1e40af
EMPRESA_COLOR_SECUNDARIO=#059669
EMPRESA_COLOR_ACENTO=#dc2626

# === SUPABASE ===
VITE_SUPABASE_URL=https://su-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=su-clave-anonima
SUPABASE_SERVICE_ROLE_KEY=su-clave-servicio

# === BASE DE DATOS ===
DATABASE_URL=postgresql://postgres:password@localhost:5432/portal_mi_empresa

# === FUNCIONALIDADES ===
FUNCIONALIDADES_CITAS=true
FUNCIONALIDADES_COMUNICADOS=true
FUNCIONALIDADES_COMENTARIOS=true
FUNCIONALIDADES_ENCUESTAS=true
FUNCIONALIDADES_NEWSLETTER=true
FUNCIONALIDADES_ESTADISTICAS=true
FUNCIONALIDADES_EXPORTACION=true

# === SEGURIDAD ===
VALIDACION_DOMINIO=true
DOMINIOS_PERMITIDOS=@mi-empresa.com
\`\`\`

#### 5.3. Desplegar Edge Functions
\`\`\`bash
# Instalar Supabase CLI
npm install -g supabase

# Inicializar Supabase
cd ../backend
supabase init

# Linkear proyecto
supabase link --project-ref su-project-ref

# Desplegar funciones
supabase functions deploy send-notifications
supabase functions deploy generate-reminders
supabase functions deploy upload-communique-image
\`\`\`

#### 5.4. Configurar Storage
\`\`\`bash
# Crear buckets de storage
supabase storage create-bucket communique-images --public
supabase storage create-bucket delegate-photos --public
supabase storage create-bucket documents --public
\`\`\`

### Paso 6: Configuración de Servicios (30 minutos)

#### 6.1. Configurar Nginx
\`\`\`bash
# Copiar configuración generada
sudo cp dominios/mi-empresa.com/configuracion/nginx.conf /etc/nginx/sites-available/mi-empresa.com

# Activar sitio
sudo ln -s /etc/nginx/sites-available/mi-empresa.com /etc/nginx/sites-enabled/

# Probar configuración
sudo nginx -t

# Reiniciar Nginx
sudo systemctl restart nginx
\`\`\`

#### 6.2. Configurar Cron Jobs
\`\`\`bash
# Abrir crontab
sudo crontab -e

# Agregar tareas programadas
# Backup automático diario a las 2 AM
0 2 * * * /usr/local/bin/backup-automatico.sh

# Renovación de certificado SSL
0 12 * * 0 /usr/local/bin/renovar-ssl.sh

# Limpieza de logs semanal
0 1 * * 0 /usr/local/bin/limpiar-logs.sh
\`\`\`

#### 6.3. Configurar Firewall
\`\`\`bash
# Configurar UFW
sudo ufw allow ssh
sudo ufw allow 'Nginx Full'
sudo ufw enable

# Verificar estado
sudo ufw status
\`\`\`

### Paso 7: Testing y Verificación (20 minutos)

#### 7.1. Verificar Frontend
\`\`\`bash
# Acceder a la aplicación
curl -I https://mi-empresa.com

# Verificar página de inicio
curl https://mi-empresa.com | grep "Portal Sindical"

# Verificar API
curl https://mi-empresa.com/api/health
\`\`\`

#### 7.2. Verificar Base de Datos
\`\`\`bash
# Conectar a la base de datos
psql -U postgres -d portal_mi_empresa

-- Verificar configuración de empresa
SELECT nombre, dominio, email_contacto FROM empresa_config;

-- Verificar slots de citas
SELECT tipo_cita, delegate_name, start_time FROM appointment_slots LIMIT 5;

-- Verificar usuarios
SELECT full_name, role, email FROM profiles;
\`\`\`

#### 7.3. Verificar Edge Functions
\`\`\`bash
# Probar función de notificaciones
curl -X POST https://su-proyecto.supabase.co/functions/v1/send-notifications \\
  -H "Authorization: Bearer su-clave-anonima" \\
  -H "Content-Type: application/json" \\
  -d '{"action": "get_company_info"}'
\`\`\`

#### 7.4. Verificar Notificaciones
\`\`\`bash
# Probar envío de email (si está configurado)
echo "Test de notificación" | mail -s "Test Portal Sindical" admin@mi-empresa.com
\`\`\`

### Paso 8: Configuración de Monitoreo (15 minutos)

#### 8.1. Configurar Logs
\`\`\`bash
# Configurar rotación de logs
sudo nano /etc/logrotate.d/portal-sindical

# Contenido:
/var/log/portal-sindical/*.log {
    daily
    missingok
    rotate 30
    compress
    notifempty
    create 644 www-data www-data
    postrotate
        systemctl reload nginx
    endscript
}
\`\`\`

#### 8.2. Configurar Alertas
\`\`\`bash
# Script de verificación de salud
sudo nano /usr/local/bin/verificar-salud.sh

#!/bin/bash
# Verificar que el sitio está funcionando
if ! curl -f -s https://mi-empresa.com > /dev/null; then
    echo "Sitio web no disponible" | mail -s "Alerta Portal Sindical" admin@mi-empresa.com
fi

# Hacer ejecutable
sudo chmod +x /usr/local/bin/verificar-salud.sh

# Agregar a cron (verificar cada 5 minutos)
echo "*/5 * * * * /usr/local/bin/verificar-salud.sh" | sudo crontab -
\`\`\`

### Paso 9: Configuración de Backup (15 minutos)

#### 9.1. Inicializar Sistema de Backup
\`\`\`bash
# Inicializar sistema de backup
node herramientas/sistema-backup.js inicializar
\`\`\`

#### 9.2. Crear Backup Inicial
\`\`\`bash
# Crear backup completo
node herramientas/sistema-backup.js backup-completo "Mi Empresa S.L." \\
  --dominio "mi-empresa.com" \\
  --database "portal_mi_empresa"
\`\`\`

#### 9.3. Programar Backups Automáticos
\`\`\`bash
# Programar backup automático
node herramientas/sistema-backup.js programar "Mi Empresa S.L."
\`\`\`

### Paso 10: Documentación Final (10 minutos)

#### 10.1. Generar Documentación
\`\`\`bash
# Generar documentación personalizada
cd instancias/mi-empresa/docs
nano README.md

# Actualizar información de contacto
sed -i 's/admin@empresa.com/admin@mi-empresa.com/g' *.md
\`\`\`

#### 10.2. Crear Manual de Usuario
\`\`\`bash
# Crear manual básico
cat > manual-usuario.md << 'EOF'
# Manual de Usuario - Portal Sindical Mi Empresa

## Acceso al Portal
- URL: https://mi-empresa.com
- Email de administrador: admin@mi-empresa.com

## Funcionalidades Principales
1. **Citas**: Reservar citas con delegados
2. **Comunicados**: Ver noticias y comunicados
3. **Encuestas**: Participar en encuestas
4. **Newsletter**: Suscribirse a noticias

## Soporte
- Email: soporte@mi-empresa.com
- Teléfono: +34 900 000 000
EOF
\`\`\`

## Verificación Final

### Lista de Verificación

#### ✅ Infraestructura
- [ ] Servidor configurado y funcionando
- [ ] Dominio configurado y resolviendo
- [ ] Certificado SSL instalado y válido
- [ ] Firewall configurado
- [ ] DNS configurado correctamente

#### ✅ Aplicación
- [ ] Frontend construido y desplegado
- [ ] Edge functions desplegadas
- [ ] Storage buckets configurados
- [ ] Variables de entorno configuradas
- [ ] Base de datos migrada

#### ✅ Funcionalidades
- [ ] Sistema de citas funcionando
- [ ] Autenticación funcionando
- [ ] Comunicados visibles
- [ ] Comentarios funcionando
- [ ] Notificaciones enviando

#### ✅ Seguridad
- [ ] RLS policies activas
- [ ] Validación de dominio funcionando
- [ ] Backup configurado
- [ ] Logs configurados
- [ ] Alertas configuradas

#### ✅ Monitoreo
- [ ] Logs rotando correctamente
- [ ] Health checks configurados
- [ ] Backups programados
- [ ] Renovación SSL programada
- [ ] Documentación actualizada

## Solución de Problemas Comunes

### Error: "Site not found"
\`\`\`bash
# Verificar configuración Nginx
sudo nginx -t
sudo systemctl status nginx

# Verificar DNS
nslookup mi-empresa.com
\`\`\`

### Error: "Database connection failed"
\`\`\`bash
# Verificar PostgreSQL
sudo systemctl status postgresql

# Verificar variables de entorno
cat .env.local | grep DATABASE

# Probar conexión
psql -U postgres -d portal_mi_empresa -c "SELECT 1;"
\`\`\`

### Error: "Edge function failed"
\`\`\`bash
# Verificar Supabase CLI
supabase functions list

# Verificar logs
supabase functions logs send-notifications

# Re-desplegar función
supabase functions deploy send-notifications
\`\`\`

### Error: "Emails not sending"
\`\`\`bash
# Verificar configuración SMTP
grep -r "smtp" .env.local

# Probar envío manual
echo "Test" | mail -s "Test" admin@mi-empresa.com

# Verificar logs de email
sudo tail -f /var/log/mail.log
\`\`\`

## Optimizaciones Post-Implementación

### Performance
1. **CDN**: Configurar CloudFlare o similar
2. **Cache**: Implementar Redis para cache
3. **Database**: Configurar índices adicionales
4. **Images**: Optimizar y comprimir imágenes

### Seguridad
1. **2FA**: Habilitar autenticación de dos factores
2. **Rate Limiting**: Configurar límites de rate
3. **Monitoring**: Implementar alerts de seguridad
4. **Updates**: Configurar actualizaciones automáticas

### Funcionalidades
1. **Analytics**: Integrar Google Analytics
2. **SEO**: Optimizar para motores de búsqueda
3. **Mobile**: Optimizar para dispositivos móviles
4. **Accessibility**: Mejorar accesibilidad web

## Mantenimiento

### Tareas Diarias
- Verificar health checks
- Revisar logs de error
- Verificar backups

### Tareas Semanales
- Actualizar sistema operativo
- Revisar uso de recursos
- Limpiar logs antiguos

### Tareas Mensuales
- Actualizar dependencias
- Revisar seguridad
- Probar procedimientos de disaster recovery

## Soporte

Para soporte técnico durante la implementación:

### Documentación
- [Manual de Personalización](./manual-personalizacion.md)
- [Casos de Uso](./casos-uso.md)
- [Mejores Prácticas](./mejores-practicas.md)

### Contacto
- **Email**: soporte@template.com
- **Documentación**: Disponible en el workspace
- **Issues**: Reportar en el sistema de tickets

---

**Tiempo Total Estimado: 2-4 horas**  
**Nivel de Dificultad: Intermedio**  
**Requisitos Técnicos: Administrador de sistemas básico**

¡Su portal sindical está listo para usar!
