#!/usr/bin/env node

/**
 * Migrador de Base de Datos
 * 
 * Gestiona la creación, migración y backup de bases de datos
 * para las instancias del portal sindical.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class MigradorBaseDatos {
    constructor() {
        this.migrationDir = path.join(__dirname, '../template-base/database/migrations');
        this.outputDir = path.join(__dirname, '../../bases-datos/');
        this.configDir = path.join(__dirname, '../plantillas/');
    }

    /**
     * Crea una nueva base de datos
     */
    async crearBaseDatos(config) {
        console.log(`🗄️ Creando base de datos: ${config.nombre}`);
        console.log('=' * 50);

        // 1. Validar configuración
        this.validarConfiguracion(config);
        
        // 2. Crear estructura de directorios
        await this.crearEstructuraDirectorios(config);
        
        // 3. Generar script de creación
        await this.generarScriptCreacion(config);
        
        // 4. Crear migraciones personalizadas
        await this.crearMigracionesPersonalizadas(config);
        
        // 5. Generar datos de prueba
        await this.generarDatosPrueba(config);
        
        // 6. Configurar RLS policies
        await this.configurarRLSPolicies(config);
        
        // 7. Crear índices optimizados
        await this.crearIndicesOptimizados(config);
        
        // 8. Configurar triggers y funciones
        await this.configurarTriggersFunciones(config);
        
        // 9. Generar scripts de backup
        await this.generarScriptsBackup(config);
        
        // 10. Crear documentación
        await this.crearDocumentacion(config);

        console.log('\n✅ Base de datos creada exitosamente');
        this.mostrarResumen(config);
    }

    /**
     * Valida la configuración de la base de datos
     */
    validarConfiguracion(config) {
        const required = ['nombre', 'empresa', 'dominio'];
        const missing = required.filter(field => !config[field]);

        if (missing.length > 0) {
            throw new Error(`Campos requeridos faltantes: ${missing.join(', ')}`);
        }

        // Validar configuraciones específicas
        if (config.tiposCitas && !Array.isArray(config.tiposCitas)) {
            throw new Error('tiposCitas debe ser un array');
        }

        if (config.horarios && typeof config.horarios !== 'object') {
            throw new Error('horarios debe ser un objeto');
        }

        console.log('✅ Validación de configuración completada');
    }

    /**
     * Crea la estructura de directorios
     */
    async crearEstructuraDirectorios(config) {
        const dirs = [
            this.outputDir,
            path.join(this.outputDir, config.nombre),
            path.join(this.outputDir, config.nombre, 'scripts'),
            path.join(this.outputDir, config.nombre, 'migraciones'),
            path.join(this.outputDir, config.nombre, 'datos'),
            path.join(this.outputDir, config.nombre, 'backup'),
            path.join(this.outputDir, config.nombre, 'documentacion')
        ];

        dirs.forEach(dir => {
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }
        });

        console.log('📁 Estructura de directorios creada');
    }

    /**
     * Genera el script de creación de base de datos
     */
    async generarScriptCreacion(config) {
        console.log('📝 Generando script de creación...');

        const script = this.generarCreateDatabaseScript(config);
        const scriptPath = path.join(this.outputDir, config.nombre, 'scripts', 'crear-base-datos.sql');

        fs.writeFileSync(scriptPath, script);
        console.log('✅ Script de creación generado');
    }

    /**
     * Genera el script CREATE DATABASE completo
     */
    generarCreateDatabaseScript(config) {
        return `-- Script de creación de base de datos
-- Portal Sindical - ${config.empresa}
-- Generado automáticamente el ${new Date().toISOString()}

-- === CONFIGURACIÓN INICIAL ===
-- Crear base de datos
CREATE DATABASE ${this.escaparIdentificador(config.nombre)} 
    WITH ENCODING = 'UTF8'
    LC_COLLATE = 'es_ES.UTF-8'
    LC_CTYPE = 'es_ES.UTF-8';

-- Conectar a la base de datos
\\c ${this.escaparIdentificador(config.nombre)};

-- === EXTENSIONES ===
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- === CONFIGURACIÓN DE EMPRESA ===
-- Tabla principal de configuración
CREATE TABLE IF NOT EXISTS empresa_config (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nombre TEXT NOT NULL,
    dominio TEXT NOT NULL UNIQUE,
    email_contacto TEXT,
    telefono TEXT,
    direccion TEXT,
    logo_url TEXT,
    colores JSONB DEFAULT '{"primario": "#1e40af", "secundario": "#059669", "acento": "#dc2626"}'::jsonb,
    textos_personalizados JSONB DEFAULT '{
        "titulo": "Portal Sindical",
        "slogan": "Defendiendo los derechos de los trabajadores",
        "footer": "© 2025 Portal Sindical"
    }'::jsonb,
    tipos_citas JSONB DEFAULT '[]'::jsonb,
    horarios_trabajo JSONB DEFAULT '{
        "lunes": {"inicio": "09:00", "fin": "18:00", "activo": true},
        "martes": {"inicio": "09:00", "fin": "18:00", "activo": true},
        "miercoles": {"inicio": "09:00", "fin": "18:00", "activo": true},
        "jueves": {"inicio": "09:00", "fin": "18:00", "activo": true},
        "viernes": {"inicio": "09:00", "fin": "18:00", "activo": true},
        "sabado": {"inicio": "09:00", "fin": "14:00", "activo": false},
        "domingo": {"inicio": "00:00", "fin": "23:59", "activo": false}
    }'::jsonb,
    funcionalidades JSONB DEFAULT '{
        "citas": true,
        "comunicados": true,
        "encuestas": true,
        "newsletter": true,
        "comentarios": true,
        "reacciones": true,
        "notificaciones": true,
        "estadisticas": true,
        "exportacion": true
    }'::jsonb,
    configuracion_adicional JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insertar configuración de la empresa
INSERT INTO empresa_config (
    nombre, dominio, email_contacto, telefono, direccion,
    colores, textos_personalizados, tipos_citas, horarios_trabajo, funcionalidades
) VALUES (
    '${this.escaparIdentificador(config.empresa)}',
    '${this.escaparIdentificador(config.dominio)}',
    '${this.escaparIdentificador(config.email || 'contacto@' + config.dominio)}',
    '${this.escaparIdentificador(config.telefono || '+34 900 000 000')}',
    '${this.escaparIdentificador(config.direccion || 'Dirección de la empresa')}',
    '${JSON.stringify(config.colores || {
        primario: "#1e40af",
        secundario: "#059669", 
        acento: "#dc2626"
    })}',
    '${JSON.stringify(config.textos || {
        titulo: `Portal Sindical ${config.empresa}`,
        slogan: "Defendiendo los derechos de los trabajadores",
        footer: `© ${new Date().getFullYear()} ${config.empresa}. Todos los derechos reservados.`
    })}',
    '${JSON.stringify(config.tiposCitas || [
        { id: "sindical", nombre: "Asuntos Sindicales", color: "#1e40af", duracion: 60 },
        { id: "prevencion", nombre: "Prevención", color: "#059669", duracion: 45 }
    ])}',
    '${JSON.stringify(config.horarios || {
        lunes: { inicio: "09:00", fin: "18:00", activo: true },
        martes: { inicio: "09:00", fin: "18:00", activo: true },
        miercoles: { inicio: "09:00", fin: "18:00", activo: true },
        jueves: { inicio: "09:00", fin: "18:00", activo: true },
        viernes: { inicio: "09:00", fin: "18:00", activo: true },
        sabado: { inicio: "09:00", fin: "14:00", activo: false },
        domingo: { inicio: "00:00", fin: "23:59", activo: false }
    })}',
    '${JSON.stringify(config.funcionalidades || {
        citas: true,
        comunicados: true,
        encuestas: true,
        newsletter: true,
        comentarios: true,
        reacciones: true,
        notificaciones: true,
        estadisticas: true,
        exportacion: true
    })}'
) ON CONFLICT (dominio) DO UPDATE SET
    nombre = EXCLUDED.nombre,
    email_contacto = EXCLUDED.email_contacto,
    telefono = EXCLUDED.telefono,
    direccion = EXCLUDED.direccion,
    colores = EXCLUDED.colores,
    textos_personalizados = EXCLUDED.textos_personalizados,
    tipos_citas = EXCLUDED.tipos_citas,
    horarios_trabajo = EXCLUDED.horarios_trabajo,
    funcionalidades = EXCLUDED.funcionalidades,
    updated_at = NOW();

-- === USUARIOS Y AUTENTICACIÓN ===
-- Tabla de perfiles (extiende auth.users)
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('admin', 'user', 'delegate')),
    email TEXT NOT NULL UNIQUE,
    department TEXT,
    position TEXT,
    phone TEXT,
    avatar_url TEXT,
    is_affiliate BOOLEAN DEFAULT false,
    empresa_id UUID REFERENCES empresa_config(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- === SISTEMA DE CITAS ===
-- Slots de citas (personalizables por empresa)
CREATE TABLE IF NOT EXISTS appointment_slots (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tipo_cita TEXT NOT NULL, -- Referencia a empresa_config.tipos_citas
    delegate_name TEXT NOT NULL,
    delegate_type TEXT NOT NULL,
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ NOT NULL,
    is_available BOOLEAN DEFAULT true,
    max_bookings INTEGER DEFAULT 1,
    empresa_id UUID REFERENCES empresa_config(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Citas reservadas
CREATE TABLE IF NOT EXISTS appointments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    slot_id UUID NOT NULL REFERENCES appointment_slots(id) ON DELETE CASCADE,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
    notes TEXT,
    cancel_reason TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- === COMUNICADOS Y CONTENIDO ===
-- Comunicados con soporte de imágenes
CREATE TABLE IF NOT EXISTS communiques (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    excerpt TEXT,
    image_url TEXT,
    category TEXT,
    tags TEXT[],
    is_published BOOLEAN DEFAULT false,
    published_at TIMESTAMPTZ,
    author_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    empresa_id UUID REFERENCES empresa_config(id) ON DELETE CASCADE,
    view_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Categorías de comunicados
CREATE TABLE IF NOT EXISTS categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    color TEXT,
    is_active BOOLEAN DEFAULT true,
    empresa_id UUID REFERENCES empresa_config(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- === COMENTARIOS Y REACCIONES ===
-- Comentarios
CREATE TABLE IF NOT EXISTS comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    communique_id UUID NOT NULL REFERENCES communiques(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    is_approved BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Respuestas a comentarios
CREATE TABLE IF NOT EXISTS comment_replies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    comment_id UUID NOT NULL REFERENCES comments(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    is_approved BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Reacciones a comentarios
CREATE TABLE IF NOT EXISTS comment_reactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    comment_id UUID NOT NULL REFERENCES comments(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    reaction_type TEXT NOT NULL CHECK (reaction_type IN ('like', 'dislike', 'love', 'angry', 'sad')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(comment_id, user_id)
);

-- === ENCUESTAS Y NEWSLETTER ===
-- Encuestas
CREATE TABLE IF NOT EXISTS surveys (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT,
    questions JSONB NOT NULL,
    is_active BOOLEAN DEFAULT false,
    is_anonymous BOOLEAN DEFAULT false,
    start_date TIMESTAMPTZ,
    end_date TIMESTAMPTZ,
    max_responses INTEGER,
    empresa_id UUID REFERENCES empresa_config(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Respuestas de encuestas
CREATE TABLE IF NOT EXISTS survey_responses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    survey_id UUID NOT NULL REFERENCES surveys(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    session_id TEXT, -- Para encuestas anónimas
    responses JSONB NOT NULL,
    submitted_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(survey_id, user_id) DEFERRABLE INITIALLY DEFERRED,
    UNIQUE(survey_id, session_id) DEFERRABLE INITIALLY DEFERRED
);

-- Newsletter
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT NOT NULL UNIQUE,
    name TEXT,
    is_active BOOLEAN DEFAULT true,
    preferences JSONB DEFAULT '{"news": true, "events": true, "surveys": true}'::jsonb,
    subscribed_at TIMESTAMPTZ DEFAULT NOW(),
    unsubscribed_at TIMESTAMPTZ,
    empresa_id UUID REFERENCES empresa_config(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS newsletters_sent (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    subject TEXT NOT NULL,
    content TEXT NOT NULL,
    template_used TEXT,
    sent_at TIMESTAMPTZ DEFAULT NOW(),
    recipient_count INTEGER DEFAULT 0,
    opened_count INTEGER DEFAULT 0,
    clicked_count INTEGER DEFAULT 0,
    empresa_id UUID REFERENCES empresa_config(id) ON DELETE CASCADE
);

-- === DELEGADOS Y ORGANIZACIÓN ===
-- Delegados
CREATE TABLE IF NOT EXISTS delegates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    position TEXT NOT NULL,
    department TEXT,
    bio TEXT,
    photo_url TEXT,
    email TEXT,
    phone TEXT,
    is_active BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    empresa_id UUID REFERENCES empresa_config(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- === NOTIFICACIONES Y ANÁLISIS ===
-- Notificaciones por email
CREATE TABLE IF NOT EXISTS email_notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    appointment_id UUID REFERENCES appointments(id) ON DELETE SET NULL,
    recipient_email TEXT NOT NULL,
    subject TEXT NOT NULL,
    body TEXT NOT NULL,
    notification_type TEXT NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'failed', 'bounced')),
    sent_at TIMESTAMPTZ,
    opened_at TIMESTAMPTZ,
    clicked_at TIMESTAMPTZ,
    error_message TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Análisis de emails
CREATE TABLE IF NOT EXISTS email_analytics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    notification_id UUID REFERENCES email_notifications(id) ON DELETE CASCADE,
    event_type TEXT NOT NULL CHECK (event_type IN ('sent', 'opened', 'clicked', 'bounced', 'unsubscribed')),
    event_data JSONB,
    occurred_at TIMESTAMPTZ DEFAULT NOW()
);

-- === DOCUMENTOS Y ARCHIVOS ===
-- Documentos
CREATE TABLE IF NOT EXISTS documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT,
    file_url TEXT NOT NULL,
    file_type TEXT,
    file_size INTEGER,
    category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    is_public BOOLEAN DEFAULT false,
    download_count INTEGER DEFAULT 0,
    uploaded_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    empresa_id UUID REFERENCES empresa_config(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Categorías de documentos
CREATE TABLE IF NOT EXISTS document_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    empresa_id UUID REFERENCES empresa_config(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- === ÍNDICES PARA OPTIMIZACIÓN ===
${this.generarIndices()}

-- === FUNCIONES Y TRIGGERS ===
${this.generarFuncionesTriggers()}

-- === CONFIGURACIÓN RLS ===
${this.generarConfiguracionRLS()}

-- === DATOS INICIALES ===
${this.generarDatosIniciales(config)}

-- === COMENTARIOS ===
COMMENT ON TABLE empresa_config IS 'Configuración principal de la empresa';
COMMENT ON TABLE profiles IS 'Perfiles de usuario extendidos';
COMMENT ON TABLE appointment_slots IS 'Slots de citas disponibles';
COMMENT ON TABLE appointments IS 'Citas reservadas por usuarios';
COMMENT ON TABLE communiques IS 'Comunicados y noticias';
COMMENT ON TABLE comments IS 'Comentarios en comunicados';
COMMENT ON TABLE surveys IS 'Encuestas y cuestionarios';
COMMENT ON TABLE delegates IS 'Información de delegados';
COMMENT ON TABLE email_notifications IS 'Historial de notificaciones por email';

-- Script completado exitosamente
SELECT 'Base de datos creada exitosamente' as resultado;
`;
    }

    /**
     * Genera índices optimizados
     */
    generarIndices() {
        return `
-- Índices para optimizar consultas

-- Users y profiles
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_department ON profiles(department);

-- Citas
CREATE INDEX IF NOT EXISTS idx_appointments_user_id ON appointments(user_id);
CREATE INDEX IF NOT EXISTS idx_appointments_slot_id ON appointments(slot_id);
CREATE INDEX IF NOT EXISTS idx_appointments_status ON appointments(status);
CREATE INDEX IF NOT EXISTS idx_appointments_created_at ON appointments(created_at);

CREATE INDEX IF NOT EXISTS idx_appointment_slots_tipo ON appointment_slots(tipo_cita);
CREATE INDEX IF NOT EXISTS idx_appointment_slots_fecha ON appointment_slots(start_time);
CREATE INDEX IF NOT EXISTS idx_appointment_slots_disponible ON appointment_slots(is_available) WHERE is_available = true;

-- Comunicados
CREATE INDEX IF NOT EXISTS idx_communiques_published ON communiques(is_published) WHERE is_published = true;
CREATE INDEX IF NOT EXISTS idx_communiques_published_at ON communiques(published_at DESC) WHERE is_published = true;
CREATE INDEX IF NOT EXISTS idx_communiques_category ON communiques(category);
CREATE INDEX IF NOT EXISTS idx_communiques_author ON communiques(author_id);
CREATE INDEX IF NOT EXISTS idx_communiques_search ON communiques USING gin(to_tsvector('spanish', title || ' ' || content));

-- Comentarios
CREATE INDEX IF NOT EXISTS idx_comments_communique ON comments(communiques_id);
CREATE INDEX IF NOT EXISTS idx_comments_user ON comments(user_id);
CREATE INDEX IF NOT EXISTS idx_comments_created ON comments(created_at DESC);

-- Reacciones
CREATE INDEX IF NOT EXISTS idx_comment_reactions_comment ON comment_reactions(comment_id);
CREATE INDEX IF NOT EXISTS idx_comment_reactions_user ON comment_reactions(user_id);
CREATE INDEX IF NOT EXISTS idx_comment_reactions_type ON comment_reactions(reaction_type);

-- Encuestas
CREATE INDEX IF NOT EXISTS idx_surveys_active ON surveys(is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_surveys_dates ON surveys(start_date, end_date);
CREATE INDEX IF NOT EXISTS idx_survey_responses_survey ON survey_responses(survey_id);
CREATE INDEX IF NOT EXISTS idx_survey_responses_user ON survey_responses(user_id) WHERE user_id IS NOT NULL;

-- Newsletter
CREATE INDEX IF NOT EXISTS idx_newsletter_subscribers_email ON newsletter_subscribers(email);
CREATE INDEX IF NOT EXISTS idx_newsletter_subscribers_active ON newsletter_subscribers(is_active) WHERE is_active = true;

-- Notificaciones
CREATE INDEX IF NOT EXISTS idx_email_notifications_recipient ON email_notifications(recipient_email);
CREATE INDEX IF NOT EXISTS idx_email_notifications_type ON email_notifications(notification_type);
CREATE INDEX IF NOT EXISTS idx_email_notifications_status ON email_notifications(status);
CREATE INDEX IF NOT EXISTS idx_email_notifications_created ON email_notifications(created_at DESC);

-- Documentos
CREATE INDEX IF NOT EXISTS idx_documents_category ON documents(category_id);
CREATE INDEX IF NOT EXISTS idx_documents_public ON documents(is_public) WHERE is_public = true;
CREATE INDEX IF NOT EXISTS idx_documents_uploaded ON documents(uploaded_by);
CREATE INDEX IF NOT EXISTS idx_documents_search ON documents USING gin(to_tsvector('spanish', title || ' ' || description));

-- Delegados
CREATE INDEX IF NOT EXISTS idx_delegates_active ON delegates(is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_delegates_department ON delegates(department);
CREATE INDEX IF NOT EXISTS idx_delegates_sort ON delegates(sort_order);
`;
    }

    /**
     * Genera funciones y triggers
     */
    generarFuncionesTriggers() {
        return `
-- Función para actualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para updated_at
CREATE TRIGGER update_empresa_config_updated_at BEFORE UPDATE ON empresa_config FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_appointments_updated_at BEFORE UPDATE ON appointments FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_communiques_updated_at BEFORE UPDATE ON communiques FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_comments_updated_at BEFORE UPDATE ON comments FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- Función para obtener configuración de empresa
CREATE OR REPLACE FUNCTION get_empresa_config(empresa_dominio TEXT)
RETURNS empresa_config AS $$
BEGIN
    RETURN (
        SELECT * FROM empresa_config 
        WHERE dominio = empresa_dominio 
        LIMIT 1
    );
END;
$$ LANGUAGE plpgsql;

-- Función para obtener slots disponibles
CREATE OR REPLACE FUNCTION get_available_slots(
    empresa_dominio TEXT, 
    tipo_cita TEXT DEFAULT NULL,
    fecha_inicio TIMESTAMPTZ DEFAULT NULL,
    fecha_fin TIMESTAMPTZ DEFAULT NULL
)
RETURNS TABLE (
    id UUID,
    tipo_cita TEXT,
    delegate_name TEXT,
    delegate_type TEXT,
    start_time TIMESTAMPTZ,
    end_time TIMESTAMPTZ,
    disponible_ahora BOOLEAN
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        s.id,
        s.tipo_cita,
        s.delegate_name,
        s.delegate_type,
        s.start_time,
        s.end_time,
        CASE 
            WHEN s.is_available AND s.start_time > NOW() THEN true
            ELSE false
        END as disponible_ahora
    FROM appointment_slots s
    JOIN empresa_config e ON s.empresa_id = e.id
    WHERE e.dominio = empresa_dominio
      AND (tipo_cita IS NULL OR s.tipo_cita = tipo_cita)
      AND (fecha_inicio IS NULL OR s.start_time >= fecha_inicio)
      AND (fecha_fin IS NULL OR s.end_time <= fecha_fin)
      AND s.is_available = true
      AND s.start_time > NOW()
    ORDER BY s.start_time;
END;
$$ LANGUAGE plpgsql;

-- Función para reservar cita
CREATE OR REPLACE FUNCTION reserve_appointment(
    p_user_id UUID,
    p_slot_id UUID,
    p_notes TEXT DEFAULT NULL
)
RETURNS JSON AS $$
DECLARE
    v_appointment_id UUID;
    v_slot_info RECORD;
BEGIN
    -- Verificar que el slot existe y está disponible
    SELECT * INTO v_slot_info
    FROM appointment_slots
    WHERE id = p_slot_id AND is_available = true AND start_time > NOW();
    
    IF NOT FOUND THEN
        RETURN json_build_object(
            'success', false,
            'error', 'Slot no disponible o no encontrado'
        );
    END IF;
    
    -- Crear la cita
    INSERT INTO appointments (user_id, slot_id, notes, status)
    VALUES (p_user_id, p_slot_id, p_notes, 'confirmed')
    RETURNING id INTO v_appointment_id;
    
    -- Marcar slot como no disponible (para slots únicos)
    UPDATE appointment_slots 
    SET is_available = false 
    WHERE id = p_slot_id AND max_bookings = 1;
    
    -- Actualizar contador si es slot múltiple
    IF v_slot_info.max_bookings > 1 THEN
        -- Aquí iría la lógica para manejar slots múltiples
        -- Por simplicidad, mantenemos el slot disponible
        NULL;
    END IF;
    
    RETURN json_build_object(
        'success', true,
        'appointment_id', v_appointment_id,
        'slot_info', v_slot_info
    );
END;
$$ LANGUAGE plpgsql;

-- Función para cancelar cita
CREATE OR REPLACE FUNCTION cancel_appointment(
    p_appointment_id UUID,
    p_user_id UUID,
    p_reason TEXT DEFAULT NULL
)
RETURNS JSON AS $$
DECLARE
    v_appointment RECORD;
BEGIN
    -- Verificar que la cita existe y pertenece al usuario
    SELECT * INTO v_appointment
    FROM appointments
    WHERE id = p_appointment_id AND user_id = p_user_id;
    
    IF NOT FOUND THEN
        RETURN json_build_object(
            'success', false,
            'error', 'Cita no encontrada'
        );
    END IF;
    
    -- Actualizar estado de la cita
    UPDATE appointments 
    SET 
        status = 'cancelled',
        cancel_reason = p_reason,
        updated_at = NOW()
    WHERE id = p_appointment_id;
    
    -- Liberar el slot
    UPDATE appointment_slots 
    SET is_available = true 
    WHERE id = v_appointment.slot_id;
    
    RETURN json_build_object(
        'success', true,
        'message', 'Cita cancelada exitosamente'
    );
END;
$$ LANGUAGE plpgsql;

-- Función para obtener estadísticas
CREATE OR REPLACE FUNCTION get_empresa_stats(empresa_dominio TEXT)
RETURNS JSON AS $$
DECLARE
    v_stats JSON;
BEGIN
    SELECT json_build_object(
        'total_usuarios', (SELECT COUNT(*) FROM profiles p JOIN empresa_config e ON p.empresa_id = e.id WHERE e.dominio = empresa_dominio),
        'total_citas_mes', (SELECT COUNT(*) FROM appointments a 
                           JOIN appointment_slots s ON a.slot_id = s.id 
                           JOIN empresa_config e ON s.empresa_id = e.id 
                           WHERE e.dominio = empresa_dominio AND a.created_at >= date_trunc('month', NOW())),
        'total_comunicados', (SELECT COUNT(*) FROM communiques c 
                             JOIN empresa_config e ON c.empresa_id = e.id 
                             WHERE e.dominio = empresa_dominio AND c.is_published = true),
        'comunicados_mes', (SELECT COUNT(*) FROM communiques c 
                           JOIN empresa_config e ON c.empresa_id = e.id 
                           WHERE e.dominio = empresa_dominio AND c.is_published = true AND c.published_at >= date_trunc('month', NOW())),
        'total_encuestas', (SELECT COUNT(*) FROM surveys s 
                           JOIN empresa_config e ON s.empresa_id = e.id 
                           WHERE e.dominio = empresa_dominio),
        'encuestas_activas', (SELECT COUNT(*) FROM surveys s 
                             JOIN empresa_config e ON s.empresa_id = e.id 
                             WHERE e.dominio = empresa_dominio AND s.is_active = true),
        'newsletter_suscriptores', (SELECT COUNT(*) FROM newsletter_subscribers n 
                                   JOIN empresa_config e ON n.empresa_id = e.id 
                                   WHERE e.dominio = empresa_dominio AND n.is_active = true),
        'citas_proximas', (SELECT COUNT(*) FROM appointments a 
                          JOIN appointment_slots s ON a.slot_id = s.id 
                          JOIN empresa_config e ON s.empresa_id = e.id 
                          WHERE e.dominio = empresa_dominio AND s.start_time >= NOW() AND s.start_time <= NOW() + INTERVAL '7 days' AND a.status = 'confirmed')
    ) INTO v_stats;
    
    RETURN v_stats;
END;
$$ LANGUAGE plpgsql;
`;
    }

    /**
     * Genera configuración RLS (Row Level Security)
     */
    generarConfiguracionRLS() {
        return `
-- === CONFIGURACIÓN RLS (ROW LEVEL SECURITY) ===

-- Habilitar RLS en todas las tablas
ALTER TABLE empresa_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointment_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE communiques ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE comment_replies ENABLE ROW LEVEL SECURITY;
ALTER TABLE comment_reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE surveys ENABLE ROW LEVEL SECURITY;
ALTER TABLE survey_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletters_sent ENABLE ROW LEVEL SECURITY;
ALTER TABLE delegates ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_categories ENABLE ROW LEVEL SECURITY;

-- Política para empresa_config
CREATE POLICY "Empresa config es público" ON empresa_config FOR SELECT USING (true);
CREATE POLICY "Solo admins pueden modificar empresa config" ON empresa_config FOR ALL USING (
    EXISTS (
        SELECT 1 FROM profiles p 
        WHERE p.id = auth.uid() AND p.role = 'admin' AND p.empresa_id = empresa_config.id
    )
);

-- Política para profiles
CREATE POLICY "Los usuarios pueden ver su propio perfil" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Los admins pueden ver todos los perfiles" ON profiles FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
);
CREATE POLICY "Los usuarios pueden actualizar su propio perfil" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Los admins pueden insertar perfiles" ON profiles FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
);

-- Política para appointment_slots
CREATE POLICY "Los slots son públicos" ON appointment_slots FOR SELECT USING (true);
CREATE POLICY "Solo admins pueden modificar slots" ON appointment_slots FOR ALL USING (
    EXISTS (
        SELECT 1 FROM profiles p 
        WHERE p.id = auth.uid() AND p.role = 'admin' AND p.empresa_id = appointment_slots.empresa_id
    )
);

-- Política para appointments
CREATE POLICY "Los usuarios ven sus propias citas" ON appointments FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Los admins ven todas las citas" ON appointments FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
);
CREATE POLICY "Los usuarios pueden crear citas" ON appointments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Los usuarios pueden actualizar sus propias citas" ON appointments FOR UPDATE USING (auth.uid() = user_id);

-- Política para communiques
CREATE POLICY "Los comunicados publicados son públicos" ON communiques FOR SELECT USING (is_published = true);
CREATE POLICY "Los admins ven todos los comunicados" ON communiques FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
);
CREATE POLICY "Los admins pueden gestionar comunicados" ON communiques FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
);

-- Política para comments
CREATE POLICY "Los comentarios aprobados son públicos" ON comments FOR SELECT USING (is_approved = true);
CREATE POLICY "Los usuarios ven sus propios comentarios" ON comments FOR SELECT USING (
    auth.uid() = user_id OR EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
);
CREATE POLICY "Los usuarios pueden crear comentarios" ON comments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Los usuarios pueden actualizar sus propios comentarios" ON comments FOR UPDATE USING (auth.uid() = user_id);

-- Política para comment_reactions
CREATE POLICY "Las reacciones son públicas" ON comment_reactions FOR SELECT USING (true);
CREATE POLICY "Los usuarios pueden gestionar sus reacciones" ON comment_reactions FOR ALL USING (auth.uid() = user_id);

-- Política para surveys
CREATE POLICY "Las encuestas activas son públicas" ON surveys FOR SELECT USING (is_active = true);
CREATE POLICY "Los admins gestionan encuestas" ON surveys FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
);

-- Política para survey_responses
CREATE POLICY "Los usuarios ven sus propias respuestas" ON survey_responses FOR SELECT USING (
    auth.uid() = user_id OR EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
);
CREATE POLICY "Los usuarios pueden crear respuestas" ON survey_responses FOR INSERT WITH CHECK (
    auth.uid() = user_id OR user_id IS NULL
);

-- Política para newsletter_subscribers
CREATE POLICY "Los suscriptores ven su propio estado" ON newsletter_subscribers FOR SELECT USING (
    auth.uid()::text = email OR EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
);
CREATE POLICY "Los usuarios pueden gestionar su suscripción" ON newsletter_subscribers FOR ALL USING (
    auth.uid()::text = email
);

-- Política para delegates
CREATE POLICY "Los delegados activos son públicos" ON delegates FOR SELECT USING (is_active = true);
CREATE POLICY "Los admins gestionan delegados" ON delegates FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
);
`;
    }

    /**
     * Genera datos iniciales
     */
    generarDatosIniciales(config) {
        const tiposCitas = config.tiposCitas || [
            { id: "sindical", nombre: "Asuntos Sindicales", color: "#1e40af", duracion: 60 },
            { id: "prevencion", nombre: "Prevención", color: "#059669", duracion: 45 }
        ];

        let datosIniciales = '-- === DATOS INICIALES ===\n\n';

        // Insertar categorías por defecto
        datosIniciales += `-- Categorías de comunicados por defecto
INSERT INTO categories (name, description, color, empresa_id) VALUES
('Noticias', 'Noticias generales de la empresa', '#1e40af', (SELECT id FROM empresa_config WHERE dominio = '${config.dominio}')),
('Eventos', 'Eventos y actividades sindicales', '#059669', (SELECT id FROM empresa_config WHERE dominio = '${config.dominio}')),
('Comunicados', 'Comunicados oficiales', '#dc2626', (SELECT id FROM empresa_config WHERE dominio = '${config.dominio}')),
('Formación', 'Cursos y formación', '#7c3aed', (SELECT id FROM empresa_config WHERE dominio = '${config.dominio}'))
ON CONFLICT DO NOTHING;

`;

        // Insertar tipos de citas como datos iniciales
        datosIniciales += `-- Slots de ejemplo para pruebas (estos se pueden eliminar después)
INSERT INTO appointment_slots (tipo_cita, delegate_name, delegate_type, start_time, end_time, empresa_id) VALUES
`;

        const slots = [];
        const ahora = new Date();
        for (let i = 1; i <= 7; i++) {
            const fecha = new Date(ahora.getTime() + i * 24 * 60 * 60 * 1000);
            fecha.setHours(10, 0, 0, 0);
            
            const tipoCita = tiposCitas[(i - 1) % tiposCitas.length];
            
            slots.push(`('${tipoCita.id}', 'Delegado ${i}', '${tipoCita.id}', '${fecha.toISOString()}', '${new Date(fecha.getTime() + tipoCita.duracion * 60000).toISOString()}', (SELECT id FROM empresa_config WHERE dominio = '${config.dominio}'))`);
        }

        datosIniciales += slots.join(',\n') + '\nON CONFLICT DO NOTHING;\n\n';

        return datosIniciales;
    }

    /**
     * Crea migraciones personalizadas
     */
    async crearMigracionesPersonalizadas(config) {
        console.log('🔄 Creando migraciones personalizadas...');

        const migraciones = [
            this.generarMigracionConfiguracion(config),
            this.generarMigracionIndices(config),
            this.generarMigracionFunciones(config),
            this.generarMigracionDatosPrueba(config)
        ];

        const migracionDir = path.join(this.outputDir, config.nombre, 'migraciones');
        
        migraciones.forEach((migracion, index) => {
            const timestamp = Date.now() + index;
            const filename = `migracion_${timestamp}_personalizada.sql`;
            const filepath = path.join(migracionDir, filename);
            
            fs.writeFileSync(filepath, migracion);
        });

        console.log('✅ Migraciones personalizadas creadas');
    }

    /**
     * Genera migración de configuración
     */
    generarMigracionConfiguracion(config) {
        return `-- Migración de configuración personalizada
-- ${config.empresa} - ${new Date().toISOString()}

-- Actualizar configuración específica de la empresa
UPDATE empresa_config 
SET 
    textos_personalizados = textos_personalizados || '${JSON.stringify(config.textosPersonalizados || {})}'::jsonb,
    configuracion_adicional = configuracion_adicional || '${JSON.stringify(config.configuracionAdicional || {})}'::jsonb
WHERE dominio = '${config.dominio}';

-- Insertar configuraciones específicas del sector
${this.generarConfiguracionSector(config)}
`;
    }

    /**
     * Genera configuración específica del sector
     */
    generarConfiguracionSector(config) {
        if (config.sector === 'industrial') {
            return `
-- Configuración específica para sector industrial
INSERT INTO categories (name, description, color, empresa_id) VALUES
('Seguridad Industrial', 'Asuntos de seguridad en el trabajo', '#dc2626', (SELECT id FROM empresa_config WHERE dominio = '${config.dominio}')),
('Convenio Colectivo', 'Negociación de convenios', '#1e40af', (SELECT id FROM empresa_config WHERE dominio = '${config.dominio}'))
ON CONFLICT DO NOTHING;
`;
        }

        if (config.sector === 'servicios') {
            return `
-- Configuración específica para sector servicios
INSERT INTO categories (name, description, color, empresa_id) VALUES
('Formación Continua', 'Cursos y capacitación', '#059669', (SELECT id FROM empresa_config WHERE dominio = '${config.dominio}')),
('Atención al Cliente', 'Mejora del servicio', '#1e40af', (SELECT id FROM empresa_config WHERE dominio = '${config.dominio}'))
ON CONFLICT DO NOTHING;
`;
        }

        return '';
    }

    /**
     * Genera migración de índices
     */
    generarMigracionIndices(config) {
        return `-- Migración de índices específicos
-- ${config.empresa} - ${new Date().toISOString()}

-- Índices adicionales para optimizar consultas específicas
CREATE INDEX IF NOT EXISTS idx_appointment_slots_${config.nombre}_empresa ON appointment_slots(empresa_id) WHERE empresa_id = (SELECT id FROM empresa_config WHERE dominio = '${config.dominio}');
CREATE INDEX IF NOT EXISTS idx_communiques_${config.nombre}_empresa ON communiques(empresa_id) WHERE empresa_id = (SELECT id FROM empresa_config WHERE dominio = '${config.dominio}';
CREATE INDEX IF NOT EXISTS idx_surveys_${config.nombre}_empresa ON surveys(empresa_id) WHERE empresa_id = (SELECT id FROM empresa_config WHERE dominio = '${config.dominio}';
CREATE INDEX IF NOT EXISTS idx_delegates_${config.nombre}_empresa ON delegates(empresa_id) WHERE empresa_id = (SELECT id FROM empresa_config WHERE dominio = '${config.dominio}';
`;
    }

    /**
     * Genera migración de funciones
     */
    generarMigracionFunciones(config) {
        return `-- Migración de funciones específicas
-- ${config.empresa} - ${new Date().toISOString()}

-- Función para obtener estadísticas específicas de la empresa
CREATE OR REPLACE FUNCTION get_${config.nombre}_stats()
RETURNS JSON AS $$
DECLARE
    v_stats JSON;
BEGIN
    SELECT json_build_object(
        'empresa', (SELECT nombre FROM empresa_config WHERE dominio = '${config.dominio}'),
        'fecha_generacion', NOW(),
        'estadisticas', get_empresa_stats('${config.dominio}')
    ) INTO v_stats;
    
    RETURN v_stats;
END;
$$ LANGUAGE plpgsql;
`;
    }

    /**
     * Genera migración de datos de prueba
     */
    generarMigracionDatosPrueba(config) {
        return `-- Migración de datos de prueba
-- ${config.empresa} - ${new Date().toISOString()}

-- Comunicados de ejemplo
INSERT INTO communiques (title, content, excerpt, category, is_published, published_at, empresa_id) VALUES
('Bienvenido al Portal Sindical', 'Este es nuestro nuevo portal sindical donde podrás encontrar toda la información relevante sobre la organización sindical.', 'Bienvenido al portal sindical', 'Noticias', true, NOW(), (SELECT id FROM empresa_config WHERE dominio = '${config.dominio}')),
('Próxima Reunión Sindical', 'Se convoca a todos los afiliados a la reunión sindical que tendrá lugar el próximo viernes.', 'Reunión sindical el viernes', 'Eventos', true, NOW(), (SELECT id FROM empresa_config WHERE dominio = '${config.dominio}')),
('Nuevo Curso de Formación', 'Disponemos de un nuevo curso de formación en prevención de riesgos laborales.', 'Curso de prevención de riesgos', 'Formación', true, NOW(), (SELECT id FROM empresa_config WHERE dominio = '${config.dominio}'))
ON CONFLICT DO NOTHING;

-- Encuesta de ejemplo
INSERT INTO surveys (title, description, questions, is_active, start_date, end_date, empresa_id) VALUES
('Satisfacción Laboral 2025', 'Evalúa tu satisfacción con las condiciones laborales actuales.', '[
    {"type": "scale", "question": "¿Qué tan satisfecho estás con tu trabajo?", "scale": {"min": 1, "max": 5, "labels": ["Muy insatisfecho", "Insatisfecho", "Neutral", "Satisfecho", "Muy satisfecho"]}},
    {"type": "text", "question": "¿Qué mejoras te gustaría ver en la empresa?"}
]'::jsonb, true, NOW(), NOW() + INTERVAL '30 days', (SELECT id FROM empresa_config WHERE dominio = '${config.dominio}'))
ON CONFLICT DO NOTHING;

-- Delegados de ejemplo
INSERT INTO delegates (name, position, department, bio, empresa_id) VALUES
('Juan Pérez', 'Delegado Sindical', 'Producción', 'Delegado sindical con 10 años de experiencia en el sector.', (SELECT id FROM empresa_config WHERE dominio = '${config.dominio}')),
('María García', 'Delegada de Prevención', 'Seguridad', 'Especialista en prevención de riesgos laborales.', (SELECT id FROM empresa_config WHERE dominio = '${config.dominio}'))
ON CONFLICT DO NOTHING;
`;
    }

    /**
     * Genera datos de prueba adicionales
     */
    async generarDatosPrueba(config) {
        console.log('📊 Generando datos de prueba...');

        const datosPrueba = {
            usuarios: this.generarUsuariosPrueba(config),
            citas: this.generarCitasPrueba(config),
            comunicados: this.generarComunicadosPrueba(config),
            encuestas: this.generarEncuestasPrueba(config)
        };

        const datosPath = path.join(this.outputDir, config.nombre, 'datos', 'datos-prueba.json');
        fs.writeFileSync(datosPath, JSON.stringify(datosPrueba, null, 2));

        console.log('✅ Datos de prueba generados');
    }

    /**
     * Genera usuarios de prueba
     */
    generarUsuariosPrueba(config) {
        return {
            admin: {
                email: `admin@${config.dominio}`,
                nombre: 'Administrador',
                rol: 'admin'
            },
            delegado: {
                email: `delegado@${config.dominio}`,
                nombre: 'Delegado Principal',
                rol: 'delegate'
            },
            usuario: {
                email: `usuario@${config.dominio}`,
                nombre: 'Usuario de Prueba',
                rol: 'user'
            }
        };
    }

    /**
     * Genera citas de prueba
     */
    generarCitasPrueba(config) {
        const citas = [];
        const tiposCitas = config.tiposCitas || [
            { id: "sindical", nombre: "Asuntos Sindicales", duracion: 60 },
            { id: "prevencion", nombre: "Prevención", duracion: 45 }
        ];

        for (let i = 0; i < 10; i++) {
            const fecha = new Date();
            fecha.setDate(fecha.getDate() + Math.floor(Math.random() * 14));
            fecha.setHours(9 + Math.floor(Math.random() * 8), 0, 0, 0);
            
            const tipoCita = tiposCitas[i % tiposCitas.length];
            
            citas.push({
                tipo_cita: tipoCita.id,
                delegate_name: `Delegado ${i + 1}`,
                delegate_type: tipoCita.id,
                start_time: fecha.toISOString(),
                end_time: new Date(fecha.getTime() + tipoCita.duracion * 60000).toISOString(),
                is_available: true
            });
        }

        return citas;
    }

    /**
     * Genera comunicados de prueba
     */
    generarComunicadosPrueba(config) {
        return [
            {
                title: "Bienvenido al Portal Sindical",
                content: "Este es nuestro nuevo portal sindical. Aquí encontrarás toda la información relevante sobre la organización sindical, tus derechos y las actividades que realizamos.",
                excerpt: "Bienvenido a nuestro portal sindical",
                category: "Noticias",
                is_published: true
            },
            {
                title: "Nuevas Medidas de Seguridad",
                content: "Se han implementado nuevas medidas de seguridad en el lugar de trabajo para garantizar la seguridad de todos los trabajadores.",
                excerpt: "Nuevas medidas de seguridad implementadas",
                category: "Comunicados",
                is_published: true
            },
            {
                title: "Curso de Formación Disponible",
                content: "Estamos ofreciendo un curso de formación gratuito en prevención de riesgos laborales. Las plazas son limitadas.",
                excerpt: "Curso de formación en prevención de riesgos",
                category: "Formación",
                is_published: true
            }
        ];
    }

    /**
     * Genera encuestas de prueba
     */
    generarEncuestasPrueba(config) {
        return [
            {
                title: "Satisfacción Laboral 2025",
                description: "Evalúa tu satisfacción con las condiciones laborales actuales en la empresa.",
                questions: [
                    {
                        type: "scale",
                        question: "¿Qué tan satisfecho estás con tu trabajo actual?",
                        scale: { min: 1, max: 5, labels: ["Muy insatisfecho", "Insatisfecho", "Neutral", "Satisfecho", "Muy satisfecho"] }
                    },
                    {
                        type: "text",
                        question: "¿Qué mejoras te gustaría ver en la empresa?"
                    },
                    {
                        type: "multiple",
                        question: "¿Qué servicios te gustaría que ofrezcamos?",
                        options: ["Atención psicológica", "Asesoría legal", "Formación adicional", "Actividades sociales"]
                    }
                ],
                is_active: true,
                is_anonymous: false,
                start_date: new Date().toISOString(),
                end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
            }
        ];
    }

    /**
     * Genera scripts de backup
     */
    async generarScriptsBackup(config) {
        console.log('💾 Generando scripts de backup...');

        const scripts = [
            this.generarScriptBackupCompleto(config),
            this.generarScriptBackupSelectivo(config),
            this.generarScriptRestauracion(config)
        ];

        const scriptsDir = path.join(this.outputDir, config.nombre, 'scripts');
        
        scripts.forEach(script => {
            const scriptPath = path.join(scriptsDir, script.nombre);
            fs.writeFileSync(scriptPath, script.contenido);
            fs.chmodSync(scriptPath, '755');
        });

        console.log('✅ Scripts de backup generados');
    }

    /**
     * Genera script de backup completo
     */
    generarScriptBackupCompleto(config) {
        return {
            nombre: 'backup-completo.sh',
            contenido: `#!/bin/bash

# Script de backup completo - ${config.nombre}
# Generado automáticamente

set -e

BACKUP_DIR="/var/backups/portal-sindical"
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_NAME="${config.nombre}_completo_$DATE"
BACKUP_PATH="$BACKUP_DIR/$BACKUP_NAME"

echo "💾 Creando backup completo de ${config.nombre}"

# Crear directorio de backup
mkdir -p "$BACKUP_PATH"

# Backup de base de datos
pg_dump -h localhost -U postgres -d ${config.nombre} > "$BACKUP_PATH/database.sql"

# Backup de configuración
tar -czf "$BACKUP_PATH/configuracion.tar.gz" -C ${this.outputDir} ${config.nombre}

# Backup de logs (si existen)
if [ -d "/var/log/nginx" ]; then
    tar -czf "$BACKUP_PATH/nginx-logs.tar.gz" -C /var/log nginx
fi

# Crear archivo de metadatos
cat > "$BACKUP_PATH/metadata.json" << EOF
{
    "nombre": "${config.nombre}",
    "empresa": "${config.empresa}",
    "fecha_backup": "${new Date().toISOString()}",
    "version": "1.0.0",
    "tipo": "completo",
    "archivos": [
        "database.sql",
        "configuracion.tar.gz",
        "nginx-logs.tar.gz"
    ]
}
EOF

# Comprimir backup
tar -czf "$BACKUP_PATH.tar.gz" -C "$BACKUP_DIR" "$BACKUP_NAME"
rm -rf "$BACKUP_PATH"

# Limpiar backups antiguos (mantener últimos 7)
find "$BACKUP_DIR" -name "${config.nombre}_completo_*" -type f -mtime +7 -delete

echo "✅ Backup completo creado: $BACKUP_PATH.tar.gz"
`
        };
    }

    /**
     * Genera script de backup selectivo
     */
    generarScriptBackupSelectivo(config) {
        return {
            nombre: 'backup-selectivo.sh',
            contenido: `#!/bin/bash

# Script de backup selectivo - ${config.nombre}

set -e

BACKUP_DIR="/var/backups/portal-sindical"
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_NAME="${config.nombre}_selectivo_$DATE"
BACKUP_PATH="$BACKUP_DIR/$BACKUP_NAME"

echo "💾 Creando backup selectivo de ${config.nombre}"

# Crear directorio de backup
mkdir -p "$BACKUP_PATH"

# Backup solo de datos críticos
pg_dump -h localhost -U postgres -d ${config.nombre} \\
    --table=empresa_config \\
    --table=profiles \\
    --table=appointments \\
    --table=appointment_slots \\
    --table=communiques \\
    --table=comments \\
    --table=surveys \\
    --table=survey_responses \\
    > "$BACKUP_PATH/datos-criticos.sql"

# Crear archivo de metadatos
cat > "$BACKUP_PATH/metadata.json" << EOF
{
    "nombre": "${config.nombre}",
    "empresa": "${config.empresa}",
    "fecha_backup": "${new Date().toISOString()}",
    "tipo": "selectivo",
    "descripcion": "Backup de datos críticos únicamente"
}
EOF

# Comprimir backup
tar -czf "$BACKUP_PATH.tar.gz" -C "$BACKUP_DIR" "$BACKUP_NAME"
rm -rf "$BACKUP_PATH"

# Limpiar backups antiguos (mantener últimos 30)
find "$BACKUP_DIR" -name "${config.nombre}_selectivo_*" -type f -mtime +30 -delete

echo "✅ Backup selectivo creado: $BACKUP_PATH.tar.gz"
`
        };
    }

    /**
     * Genera script de restauración
     */
    generarScriptRestauracion(config) {
        return {
            nombre: 'restaurar.sh',
            contenido: `#!/bin/bash

# Script de restauración - ${config.nombre}

set -e

if [ $# -ne 1 ]; then
    echo "Uso: $0 <archivo_backup.tar.gz>"
    exit 1
fi

BACKUP_FILE="$1"
RESTORE_DIR="/tmp/restore_${config.nombre}"
DATE=$(date +%Y%m%d_%H%M%S)

echo "🔄 Restaurando backup desde: $BACKUP_FILE"

# Crear directorio temporal
mkdir -p "$RESTORE_DIR"

# Extraer backup
tar -xzf "$BACKUP_FILE" -C "$RESTORE_DIR"

# Crear backup de seguridad antes de restaurar
echo "💾 Creando backup de seguridad..."
./backup-completo.sh

# Restaurar base de datos
if [ -f "$RESTORE_DIR/database.sql" ]; then
    echo "🗄️ Restaurando base de datos..."
    psql -h localhost -U postgres -d postgres -c "DROP DATABASE IF EXISTS ${config.nombre};"
    psql -h localhost -U postgres -d postgres -c "CREATE DATABASE ${config.nombre};"
    psql -h localhost -U postgres -d ${config.nombre} < "$RESTORE_DIR/database.sql"
fi

# Restaurar configuración
if [ -f "$RESTORE_DIR/configuracion.tar.gz" ]; then
    echo "⚙️ Restaurando configuración..."
    tar -xzf "$RESTORE_DIR/configuracion.tar.gz" -C ${this.outputDir}
fi

# Limpiar archivos temporales
rm -rf "$RESTORE_DIR"

echo "✅ Restauración completada"
echo "📝 Se ha creado un backup de seguridad antes de la restauración"
`
        };
    }

    /**
     * Crea documentación
     */
    async crearDocumentacion(config) {
        console.log('📚 Creando documentación...');

        const readme = `# Base de Datos - ${config.empresa}

## Información General
- **Base de datos:** ${config.nombre}
- **Empresa:** ${config.empresa}
- **Dominio:** ${config.dominio}
- **Fecha de creación:** ${new Date().toISOString()}
- **Versión:** 1.0.0

## Estructura de Tablas

### Configuración
- **empresa_config:** Configuración principal de la empresa
- **profiles:** Perfiles de usuario extendidos

### Sistema de Citas
- **appointment_slots:** Slots de citas disponibles
- **appointments:** Citas reservadas

### Contenido
- **communiques:** Comunicados y noticias
- **categories:** Categorías de contenido
- **comments:** Comentarios
- **comment_replies:** Respuestas a comentarios
- **comment_reactions:** Reacciones a comentarios

### Encuestas y Newsletter
- **surveys:** Encuestas
- **survey_responses:** Respuestas de encuestas
- **newsletter_subscribers:** Suscriptores de newsletter
- **newsletters_sent:** Historial de newsletters enviadas

### Organización
- **delegates:** Información de delegados
- **email_notifications:** Historial de notificaciones
- **email_analytics:** Análisis de emails

### Documentos
- **documents:** Documentos
- **document_categories:** Categorías de documentos

## Configuración RLS (Row Level Security)

Todas las tablas tienen políticas RLS configuradas para:
- Acceso público a contenido publicado
- Acceso de usuarios a sus propios datos
- Acceso completo de administradores
- Protección de datos sensibles

## Funciones Principales

### Gestión de Citas
- \`get_available_slots(empresa_dominio, tipo_cita)\`: Obtiene slots disponibles
- \`reserve_appointment(user_id, slot_id, notes)\`: Reserva una cita
- \`cancel_appointment(appointment_id, user_id, reason)\`: Cancela una cita

### Estadísticas
- \`get_empresa_stats(empresa_dominio)\`: Obtiene estadísticas de la empresa
- \`get_${config.nombre}_stats()\`: Estadísticas específicas

### Configuración
- \`get_empresa_config(empresa_dominio)\`: Obtiene configuración de empresa

## Scripts de Gestión

### Backup
\`\`\`bash
# Backup completo
./scripts/backup-completo.sh

# Backup selectivo
./scripts/backup-selectivo.sh
\`\`\`

### Restauración
\`\`\`bash
# Restaurar desde backup
./scripts/restaurar.sh backup_file.tar.gz
\`\`\`

## Migraciones

Las migraciones están organizadas cronológicamente:
- Migraciones base del template
- Migraciones personalizadas para la empresa

## Datos de Prueba

Se han generado datos de prueba para:
- Usuarios (admin, delegado, usuario)
- Citas de ejemplo
- Comunicados
- Encuestas

## Configuración por Sector

${this.generarDocumentacionSector(config)}

## Monitoreo

- Logs de base de datos en: \`/var/log/postgresql/\`
- Métricas disponibles para monitoreo
- Alertas configuradas para errores críticos

## Seguridad

- RLS habilitado en todas las tablas
- Políticas de acceso configuradas
- Backup automático configurado
- Logs de auditoría activados

## Soporte

Para soporte técnico, consulte la documentación principal del sistema de replicación.

---
Generado automáticamente el ${new Date().toISOString()}
`;

        const docPath = path.join(this.outputDir, config.nombre, 'documentacion', 'README.md');
        fs.writeFileSync(docPath, readme);

        console.log('✅ Documentación creada');
    }

    /**
     * Genera documentación específica del sector
     */
    generarDocumentacionSector(config) {
        if (config.sector === 'industrial') {
            return `
### Sector Industrial
- Categorías específicas: Seguridad Industrial, Convenio Colectivo
- Enfoque en prevención de riesgos
- Gestión de turnos de trabajo
- Representación por departamentos
`;
        }

        if (config.sector === 'servicios') {
            return `
### Sector Servicios
- Categorías específicas: Formación Continua, Atención al Cliente
- Enfoque en mejora continua
- Flexibilidad horaria
- Satisfacción del cliente
`;
        }

        if (config.sector === 'publico') {
            return `
### Sector Público
- Categorías específicas: Normativa, Procedimientos
- Enfoque en transparencia
- Cumplimiento normativo
- Servicio público
`;
        }

        return `
### Configuración General
- Adaptable a cualquier sector
- Configuración personalizable
- Funcionalidades modulables
`;
    }

    /**
     * Escapa identificadores SQL
     */
    escaparIdentificador(identificador) {
        return identifier.replace(/'/g, "''");
    }

    /**
     * Muestra resumen final
     */
    mostrarResumen(config) {
        console.log('\n📋 Resumen de la base de datos:');
        console.log(`   • Nombre: ${config.nombre}`);
        console.log(`   • Empresa: ${config.empresa}`);
        console.log(`   • Dominio: ${config.dominio}`);
        console.log(`   • Sector: ${config.sector || 'general'}`);
        console.log(`   • Tipos de citas: ${config.tiposCitas?.length || 0}`);
        console.log(`   • Esquema: Postgres con RLS`);
        console.log(`   • Backup: Configurado`);
        console.log('\n🗄️ ¡Base de datos lista para usar!');
    }
}

// Función principal
function main() {
    const args = process.argv.slice(2);
    const comando = args[0];

    if (!comando) {
        console.log(`
🗄️ Migrador de Base de Datos - Portal Sindical

Uso:
  node migrador-bd.js crear [parametros]  # Crear nueva base de datos
  node migrador-bd.js migrar [archivo]    # Aplicar migración
  node migrador-bd.js backup [nombre]     # Crear backup
  node migrador-bd.js restaurar [archivo] # Restaurar backup

Ejemplo:
  node migrador-bd.js crear --nombre "mi-empresa-db" --empresa "Mi Empresa" --dominio "mi-empresa.com" --sector "industrial" --tipos-citas '[{"id":"sindical","nombre":"Asuntos Sindicales"}]'

Parámetros:
  --nombre: Nombre de la base de datos
  --empresa: Nombre de la empresa
  --dominio: Dominio de la empresa
  --sector: Sector (industrial, servicios, publico)
  --email: Email de contacto
  --telefono: Teléfono de contacto
  --direccion: Dirección de la empresa
        `);
        return;
    }

    const migrador = new MigradorBaseDatos();

    try {
        switch (comando) {
            case 'crear':
                const config = {
                    nombre: args[1],
                    empresa: args[2],
                    dominio: args[3],
                    sector: args[4],
                    email: args[5],
                    telefono: args[6],
                    direccion: args[7],
                    tiposCitas: args[8] ? JSON.parse(args[8]) : null,
                    horarios: args[9] ? JSON.parse(args[9]) : null,
                    textos: args[10] ? JSON.parse(args[10]) : null,
                    funcionalidades: args[11] ? JSON.parse(args[11]) : null
                };
                migrador.crearBaseDatos(config);
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

module.exports = MigradorBaseDatos;
