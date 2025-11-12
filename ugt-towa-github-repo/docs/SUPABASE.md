# Configuración de Supabase

Guía completa para configurar Supabase en el Portal UGT Towa.

## Tabla de Contenidos

1. [Configuración Inicial](#configuración-inicial)
2. [Esquema de Base de Datos](#esquema-de-base-de-datos)
3. [Row Level Security (RLS)](#row-level-security-rls)
4. [Storage Buckets](#storage-buckets)
5. [Triggers y Functions](#triggers-y-functions)
6. [Cron Jobs](#cron-jobs)
7. [Migraciones](#migraciones)

---

## Configuración Inicial

### 1. Crear Proyecto Supabase

1. Ve a https://app.supabase.com
2. Crea una nueva organización (si no tienes una)
3. Haz clic en "New Project"
4. Completa los datos:
   - **Name:** ugt-towa-portal
   - **Database Password:** [genera una segura]
   - **Region:** West EU (Frankfurt) - más cercano a España
   - **Pricing Plan:** Free (o Pro si necesitas más recursos)

### 2. Obtener Credenciales

Tras crear el proyecto, ve a Settings > API:
- **Project URL:** `https://{project-id}.supabase.co`
- **Anon Public Key:** Para uso en frontend
- **Service Role Key:** Para uso en backend (MANTENER SECRETO)

### 3. Configurar Authentication

Ve a Authentication > Settings:
- **Enable Email Authentication:** ✓
- **Enable Email Confirmations:** ✓
- **Site URL:** https://tu-dominio.com
- **Redirect URLs:** https://tu-dominio.com/auth/callback

---

## Esquema de Base de Datos

### Tablas Principales

#### profiles
```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin', 'delegate')),
  is_affiliate BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### communiques
```sql
CREATE TABLE communiques (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category_id UUID REFERENCES categories(id),
  image_url TEXT,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### categories
```sql
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,
  color TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### appointments
```sql
CREATE TABLE appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id),
  slot_id UUID REFERENCES appointment_slots(id),
  appointment_type TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### newsletter_editions
```sql
CREATE TABLE newsletter_editions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  month INTEGER NOT NULL,
  year INTEGER NOT NULL,
  status TEXT DEFAULT 'draft',
  pdf_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  sent_at TIMESTAMPTZ
);
```

Para ver todas las tablas y su estructura completa, consulta las migraciones en `/supabase/migrations/`.

---

## Row Level Security (RLS)

### Políticas Generales

#### Lectura Pública
Para tablas que deben ser visibles para todos:
```sql
CREATE POLICY "Allow public read access"
ON communiques FOR SELECT
USING (true);
```

#### Escritura Solo Admin
Para operaciones que requieren permisos de administrador:
```sql
CREATE POLICY "Allow admin insert"
ON communiques FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  )
);
```

#### Acceso de Afiliados
Para contenido exclusivo de afiliados:
```sql
CREATE POLICY "Allow affiliates read access"
ON syndical_documents FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.is_affiliate = true
  )
);
```

### Políticas por Tabla

#### profiles
```sql
-- Lectura: Los usuarios pueden ver su propio perfil
CREATE POLICY "Users can view own profile"
ON profiles FOR SELECT
USING (auth.uid() = id);

-- Actualización: Los usuarios pueden actualizar su propio perfil
CREATE POLICY "Users can update own profile"
ON profiles FOR UPDATE
USING (auth.uid() = id);
```

#### comments
```sql
-- Lectura: Todos pueden leer comentarios
CREATE POLICY "Allow public read comments"
ON comments FOR SELECT
USING (true);

-- Inserción: Solo usuarios autenticados
CREATE POLICY "Allow authenticated users insert comments"
ON comments FOR INSERT
WITH CHECK (auth.uid() IS NOT NULL);

-- Eliminación: Autor o admin
CREATE POLICY "Allow author or admin delete comments"
ON comments FOR DELETE
USING (
  auth.uid() = user_id OR
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  )
);
```

#### newsletter_subscribers
```sql
-- Inserción: Cualquiera puede suscribirse
CREATE POLICY "Allow public insert subscribers"
ON newsletter_subscribers FOR INSERT
WITH CHECK (true);

-- Lectura: Solo admins
CREATE POLICY "Allow admin read subscribers"
ON newsletter_subscribers FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  )
);
```

---

## Storage Buckets

### Configuración de Buckets

#### communique-images
```sql
-- Crear bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('communique-images', 'communique-images', true);

-- Política de lectura pública
CREATE POLICY "Public read access"
ON storage.objects FOR SELECT
USING (bucket_id = 'communique-images');

-- Política de subida solo admin
CREATE POLICY "Admin upload access"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'communique-images' AND
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  )
);
```

#### event-images
```sql
-- Bucket público para galería
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'event-images',
  'event-images',
  true,
  5242880, -- 5MB
  ARRAY['image/png', 'image/jpeg', 'image/webp']
);
```

#### syndical-documents
```sql
-- Bucket privado para documentos de afiliados
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'syndical-documents',
  'syndical-documents',
  false,
  10485760, -- 10MB
  ARRAY['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
);

-- Solo afiliados pueden leer
CREATE POLICY "Affiliates read access"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'syndical-documents' AND
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.is_affiliate = true
  )
);
```

---

## Triggers y Functions

### Trigger para Crear Profile Automáticamente

```sql
-- Función que se ejecuta al registrar usuario
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger que llama a la función
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();
```

### Trigger para Gestión de Slots

```sql
-- Marcar slot como ocupado al confirmar cita
CREATE OR REPLACE FUNCTION mark_slot_occupied()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'confirmed' THEN
    UPDATE appointment_slots
    SET status = 'occupied'
    WHERE id = NEW.slot_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_appointment_confirmed
  AFTER UPDATE ON appointments
  FOR EACH ROW
  WHEN (NEW.status = 'confirmed')
  EXECUTE FUNCTION mark_slot_occupied();
```

---

## Cron Jobs

### Newsletter Mensual Automático

```sql
-- Configurar en Supabase Dashboard > Database > Cron Jobs
SELECT cron.schedule(
  'generate-monthly-newsletter',
  '0 9 1 * *',  -- Día 1 de cada mes a las 9 AM
  $$
  SELECT net.http_post(
    url:='https://{project-id}.supabase.co/functions/v1/generate-monthly-draft',
    headers:='{"Content-Type": "application/json", "Authorization": "Bearer {service-role-key}"}'::jsonb,
    body:='{}'::jsonb
  );
  $$
);
```

### Recordatorios de Citas

```sql
SELECT cron.schedule(
  'generate-appointment-reminders',
  '0 * * * *',  -- Cada hora
  $$
  SELECT net.http_post(
    url:='https://{project-id}.supabase.co/functions/v1/generate-reminders',
    headers:='{"Content-Type": "application/json", "Authorization": "Bearer {service-role-key}"}'::jsonb,
    body:='{}'::jsonb
  );
  $$
);
```

---

## Migraciones

### Orden de Ejecución

Las migraciones deben ejecutarse en orden cronológico:

1. `1762032785_enable_rls_all_tables.sql`
2. `1762032801_create_rls_policies_profiles.sql`
3. `1762032815_create_rls_policies_delegates_content.sql`
4. ... (ver `/supabase/migrations/` para lista completa)

### Ejecutar Migraciones

```bash
# Via Supabase CLI
supabase db push

# O manualmente en SQL Editor del Dashboard
# Copiar y pegar el contenido de cada archivo .sql
```

### Crear Nueva Migración

```bash
# Generar nueva migración
supabase migration new nombre_descriptivo

# Editar el archivo creado en supabase/migrations/
# Ejecutar
supabase db push
```

---

## Backup y Recuperación

### Crear Backup

```bash
# Backup completo de la base de datos
supabase db dump -f backup.sql

# Backup solo del esquema
supabase db dump --schema-only -f schema.sql

# Backup solo de los datos
supabase db dump --data-only -f data.sql
```

### Restaurar Backup

```bash
supabase db reset
supabase db push
psql -h db.{project-id}.supabase.co -U postgres -f backup.sql
```

---

## Monitoreo y Logs

### Ver Logs de Base de Datos

1. Ve a Supabase Dashboard
2. Selecciona "Logs" en el menú lateral
3. Filtra por:
   - **Postgres Logs:** Queries y errores de BD
   - **API Logs:** Requests a la API
   - **Auth Logs:** Autenticación y autorización
   - **Storage Logs:** Operaciones de almacenamiento

### Métricas Importantes

- **Database Size:** Espacio utilizado
- **Active Connections:** Conexiones activas
- **Query Performance:** Queries lentas
- **Error Rate:** Tasa de errores

---

## Optimización

### Índices

```sql
-- Índice en campo frecuentemente consultado
CREATE INDEX idx_communiques_category
ON communiques(category_id);

-- Índice compuesto
CREATE INDEX idx_appointments_user_date
ON appointments(user_id, created_at DESC);

-- Índice para búsqueda de texto
CREATE INDEX idx_communiques_title_search
ON communiques USING gin(to_tsvector('spanish', title));
```

### Vacuum y Analyze

```sql
-- Ejecutar periódicamente para optimizar
VACUUM ANALYZE;
```

---

## Seguridad

### Mejores Prácticas

1. **Nunca exponer Service Role Key en frontend**
2. **Usar RLS en todas las tablas**
3. **Validar entrada de usuario en Edge Functions**
4. **Rotar claves periódicamente**
5. **Habilitar 2FA para cuentas admin**
6. **Revisar logs regularmente**
7. **Mantener backups actualizados**

---

## Troubleshooting

### Error: "new row violates row-level security policy"

**Causa:** La política RLS no permite la operación.

**Solución:** Verificar políticas con:
```sql
SELECT * FROM pg_policies WHERE tablename = 'nombre_tabla';
```

### Error: "permission denied for table"

**Causa:** Usuario no tiene permisos necesarios.

**Solución:** Verificar rol del usuario y políticas RLS.

### Queries Lentas

**Solución:**
1. Agregar índices apropiados
2. Optimizar queries con EXPLAIN ANALYZE
3. Considerar desnormalización si es necesario

---

## Recursos Adicionales

- [Documentación Oficial Supabase](https://supabase.com/docs)
- [Guía de RLS](https://supabase.com/docs/guides/auth/row-level-security)
- [Guía de Storage](https://supabase.com/docs/guides/storage)
- [Edge Functions](https://supabase.com/docs/guides/functions)

---

## Contacto

Para soporte con Supabase:
- Email: jpedragosa@towapharmaceutical.com
- Dashboard: https://app.supabase.com
