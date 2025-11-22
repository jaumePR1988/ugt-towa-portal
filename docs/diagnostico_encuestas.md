# Diagnóstico del Sistema de Encuestas UGT Towa

## Fecha del Análisis: 22 de Noviembre de 2025

---

## Resumen Ejecutivo

Se ha realizado un análisis completo del sistema de encuestas del portal UGT Towa para identificar por qué no permite votar y solo muestra resultados estáticos. El diagnóstico revela múltiples problemas en la arquitectura, implementación y configuración de la base de datos.

---

## 1. Problemas Identificados

### 1.1 Problema Principal: Ausencia de Estructura de Base de Datos

**PROBLEMA CRÍTICO**: Las tablas de encuestas (`surveys` y `survey_responses`) no existen en la base de datos.

**Evidencia**:
- No se encontraron migraciones de SQL para crear las tablas de encuestas
- Los archivos de ejemplo de datos solo contienen información de eventos, no encuestas
- Los tipos TypeScript están definidos correctamente, pero la estructura de BD no coincide

**Estructura Esperada vs Realidad**:
```sql
-- Estructura esperada (según código TypeScript)
CREATE TABLE surveys (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    question TEXT NOT NULL,
    options JSONB NOT NULL,
    is_active BOOLEAN DEFAULT false,
    tipo TEXT DEFAULT 'publica',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE survey_responses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    survey_id UUID NOT NULL REFERENCES surveys(id),
    user_id UUID NOT NULL REFERENCES auth.users(id),
    selected_option_id INTEGER NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(survey_id, user_id)
);
```

**Estructura Encontrada en Migrador** (incompatible):
```sql
-- Estructura en migrador-bd.js (diferente)
CREATE TABLE surveys (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,           -- Campo 'title' vs 'question'
    description TEXT,
    questions JSONB NOT NULL,      -- Campo 'questions' vs array simple
    is_active BOOLEAN DEFAULT false,
    is_anonymous BOOLEAN DEFAULT false,
    -- ... otros campos
);

CREATE TABLE survey_responses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    survey_id UUID NOT NULL REFERENCES surveys(id),
    user_id UUID REFERENCES auth.users(id),
    session_id TEXT,               -- Campo adicional para anónimos
    responses JSONB NOT NULL,      -- Campo 'responses' vs 'selected_option_id'
    submitted_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 1.2 Problemas de Lógica de Votación

**Problema en EncuestasPage.tsx (líneas 42-70)**:
```typescript
async function handleVote(surveyId: string, optionId: number) {
    if (!user) {
        toast.error('Debes iniciar sesión para votar');
        return;
    }

    try {
        const { error } = await supabase
            .from('survey_responses')
            .insert([{
                survey_id: surveyId,
                user_id: user.id,
                selected_option_id: optionId
            }]);

        if (error) {
            if (error.code === '23505') {
                toast.error('Ya has votado en esta encuesta');
            } else {
                throw error;
            }
        } else {
            toast.success('Voto registrado correctamente');
            loadResponses(surveyId);
        }
    } catch (error) {
        toast.error('Error al votar');
    }
}
```

**Problemas Identificados**:
1. **Dependencia de autenticación**: No permite votaciones anónimas (contradictorio con el concepto de "encuestas públicas")
2. **Validación de duplicados**: Usa constraint único pero la tabla puede no existir
3. **Falta de manejo de errores específico**: Los errores de conectividad se manejan genéricamente

### 1.3 Problemas de Interfaz de Usuario

**Problemas en la Experiencia de Usuario**:

1. **Estado Inconsistente de Votación** (líneas 105-126):
   ```typescript
   {!hasVoted ? (
       <button onClick={() => handleVote(survey.id, option.id)}>
           {option.text}
       </button>
   ) : (
       <div className="p-4 border border-gray-200 rounded-lg">
           {/* Solo muestra resultados */}
       </div>
   )}
   ```
   - Los usuarios que no han votado ven opciones clickeables
   - Los usuarios que ya votaron solo ven resultados estáticos
   - **Problema**: Los usuarios no logueados no pueden ver las opciones para votar

2. **Falta de Feedback Visual**: No hay indicadores de carga durante la votación
3. **Mensaje de Error Genérico**: "Error al votar" no especifica la causa

### 1.4 Problemas de Carga de Datos

**Problema en loadSurveys() (líneas 19-30)**:
```typescript
async function loadSurveys() {
    const { data } = await supabase
        .from('surveys')
        .select('*')
        .eq('is_active', true)
        .eq('tipo', 'publica')
        .order('created_at', { ascending: false });
    if (data) {
        setSurveys(data);
        data.forEach(survey => loadResponses(survey.id));
    }
}
```

**Problemas**:
- **Consultas secuenciales**: Carga encuestas, luego para cada encuesta carga respuestas individualmente (ineficiente)
- **No hay manejo de errores**: Si falla la carga de encuestas, no se informa al usuario
- **Falta de paginación**: Para muchas encuestas podría ser problemático

### 1.5 Problemas de Tipado y Validación

**Inconsistencias en los Tipos TypeScript**:

1. **Campo `options`** en `Survey`:
   ```typescript
   // Tipado como array simple
   options: Array<{ id: number; text: string }>;
   ```
   Pero en el análisis se usa como:
   ```typescript
   survey.options.forEach((option: any) => {
       optionCounts[option.id] = 0;
       optionLabels[option.id] = option.text;
   });
   ```

2. **Campo `tipo`** en `Survey`:
   ```typescript
   tipo?: 'publica' | 'afiliados';
   ```
   Pero se accede como:
   ```typescript
   (survey as any).tipo === 'afiliados'
   ```
   Indicando incertidumbre sobre el tipo.

---

## 2. Análisis de Componentes Específicos

### 2.1 EncuestasPage.tsx - Página Principal de Votación

**Fortalezas**:
- Separación clara entre usuarios logueados y no logueados
- Interfaz visual clara con iconos de Vote y BarChart3
- Validación de estado de votación
- Cálculo dinámico de porcentajes

**Debilidades Críticas**:
- Dependencia total de autenticación para votar
- Sin datos de encuestas en la BD
- Falta de manejo de errores robusto
- Sin indicadores de carga

### 2.2 AdminEncuestas.tsx - Panel de Administración

**Fortalezas**:
- Formulario funcional para crear encuestas
- Validación de campos requeridos
- Gestión de estados activo/inactivo
- Interfaz intuitiva

**Debilidades**:
- Campo `tipo` mal implementado (línea 119): `(survey as any).tipo === 'afiliados'`
- Sin validación de opciones duplicadas
- Falta de edición de encuestas existentes

### 2.3 AdminEncuestasAnalisis.tsx - Análisis y Reportes

**Fortalezas**:
- Análisis estadístico completo
- Exportación a PDF y Excel
- Gráficos interactivos con Chart.js
- Manejo de múltiples encuestas

**Debilidades**:
- Alta complejidad sin manejo de errores adecuado
- Dependencia de bibliotecas externas (Chart.js, jsPDF, xlsx)
- Sin paginación para muchas encuestas

### 2.4 EncuestasAfiliadosPage.tsx - Encuestas para Afiliados

**Fortalezas**:
- Separación específica para afiliados
- Navegación lateral coherente
- Validación de permisos de afiliado

**Debilidades**:
- Mismos problemas que la página pública
- Redirección agresiva si no es afiliado

---

## 3. Problemas de Integración con Base de Datos

### 3.1 Configuración de Supabase

**Problemas en supabase.ts (líneas 3-23)**:
```typescript
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('🚨 CONFIGURACIÓN REQUERIDA: Faltan las variables de entorno de Supabase');
    throw new Error('❌ Faltan las variables de entorno de Supabase');
}
```

**Issues**:
- Validación estricta puede impedir el desarrollo local
- No hay fallback para desarrollo sin Supabase
- Mensajes de error muy técnicos para usuarios finales

### 3.2 Autenticación y Autorización

**Problema en AuthContext**:
- La función `isAffiliate` no está completamente definida
- Usuarios anónimos no pueden votar en encuestas públicas
- Falta de roles granulares

---

## 4. Recomendaciones de Solución

### 4.1 Prioridad Crítica - Crear Estructura de Base de Datos

1. **Crear Migración SQL Inmediata**:
```sql
-- Crear tabla surveys
CREATE TABLE IF NOT EXISTS surveys (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    question TEXT NOT NULL,
    options JSONB NOT NULL,
    is_active BOOLEAN DEFAULT true,
    tipo TEXT DEFAULT 'publica' CHECK (tipo IN ('publica', 'afiliados')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Crear tabla survey_responses
CREATE TABLE IF NOT EXISTS survey_responses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    survey_id UUID NOT NULL REFERENCES surveys(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    selected_option_id INTEGER NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(survey_id, user_id)
);

-- Crear índices para mejorar performance
CREATE INDEX idx_surveys_active ON surveys(is_active);
CREATE INDEX idx_surveys_tipo ON surveys(tipo);
CREATE INDEX idx_survey_responses_survey_id ON survey_responses(survey_id);
CREATE INDEX idx_survey_responses_user_id ON survey_responses(user_id);
```

2. **Insertar Datos de Prueba**:
```sql
INSERT INTO surveys (question, options, tipo) VALUES
('¿Cómo evalúas los servicios del sindicato?', 
 '[{"id": 1, "text": "Excelente"}, {"id": 2, "text": "Bueno"}, {"id": 3, "text": "Regular"}, {"id": 4, "text": "Malo"}]', 
 'publica'),
('¿Qué temas te interesan más?', 
 '[{"id": 1, "text": "Negociación colectiva"}, {"id": 2, "text": "Formación"}, {"id": 3, "text": "Beneficios"}]', 
 'afiliados');
```

### 4.2 Mejoras de Lógica de Votación

1. **Permitir Votación Anónima para Encuestas Públicas**:
```typescript
async function handleVote(surveyId: string, optionId: number, survey: Survey) {
    try {
        const voteData: any = {
            survey_id: surveyId,
            selected_option_id: optionId
        };

        // Solo agregar user_id si está autenticado y la encuesta no es anónima
        if (user && survey.tipo !== 'anonima') {
            voteData.user_id = user.id;
        }

        const { error } = await supabase
            .from('survey_responses')
            .insert([voteData]);

        // ... resto de manejo de errores
    } catch (error) {
        console.error('Error detallado al votar:', error);
        toast.error(`Error al votar: ${error.message}`);
    }
}
```

2. **Mejorar Manejo de Estados de Carga**:
```typescript
const [loading, setLoading] = useState(false);
const [voting, setVoting] = useState<string | null>(null);

async function handleVote(surveyId: string, optionId: number) {
    setVoting(optionId);
    try {
        // ... lógica de votación
    } finally {
        setVoting(null);
    }
}
```

### 4.3 Mejoras de Interfaz de Usuario

1. **Estados de Carga Visuales**:
```jsx
{!hasVoted ? (
    <button
        onClick={() => handleVote(survey.id, option.id)}
        disabled={voting === option.id}
        className="w-full text-left p-4 border-2 border-gray-200 rounded-lg hover:border-red-600 hover:bg-red-50 transition disabled:opacity-50"
    >
        {voting === option.id ? (
            <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600 mr-2"></div>
                Registrando voto...
            </div>
        ) : (
            option.text
        )}
    </button>
) : (
    // ... resultados
)}
```

2. **Mejor Feedback de Errores**:
```typescript
} catch (error: any) {
    console.error('Error detallado:', error);
    
    if (error.code === '23505') {
        toast.error('Ya has votado en esta encuesta');
    } else if (error.code === '42501') {
        toast.error('No tienes permisos para votar en esta encuesta');
    } else if (error.code === 'ECONNREFUSED') {
        toast.error('Error de conexión. Verifica tu internet e intenta nuevamente.');
    } else {
        toast.error(`Error al votar: ${error.message || 'Error desconocido'}`);
    }
}
```

### 4.4 Optimizaciones de Rendimiento

1. **Consultas Optimizadas**:
```typescript
async function loadSurveysWithResponses() {
    const { data: surveysData, error: surveysError } = await supabase
        .from('surveys')
        .select(`
            *,
            survey_responses (
                id,
                user_id,
                selected_option_id
            )
        `)
        .eq('is_active', true)
        .eq('tipo', 'publica')
        .order('created_at', { ascending: false });

    if (surveysError) {
        toast.error('Error al cargar encuestas');
        return;
    }

    setSurveys(surveysData || []);
}
```

2. **Manejo de Estados**:
```typescript
const [surveys, setSurveys] = useState<Survey[]>([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState<string | null>(null);

useEffect(() => {
    loadSurveys();
}, []);

async function loadSurveys() {
    try {
        setLoading(true);
        setError(null);
        // ... lógica de carga
    } catch (err: any) {
        setError(err.message);
    } finally {
        setLoading(false);
    }
}
```

---

## 5. Plan de Implementación

### Fase 1: Corrección Crítica (1-2 días)
1. ✅ Crear migración de base de datos
2. ✅ Insertar datos de prueba
3. ✅ Verificar conectividad con BD
4. ✅ Probar flujo básico de votación

### Fase 2: Mejoras de UX (2-3 días)
1. ✅ Implementar estados de carga
2. ✅ Mejorar manejo de errores
3. ✅ Añadir votaciones anónimas
4. ✅ Optimizar consultas

### Fase 3: Funcionalidades Avanzadas (3-5 días)
1. ✅ Mejorar análisis estadístico
2. ✅ Implementar notificaciones en tiempo real
3. ✅ Añadir export de resultados
4. ✅ Testing exhaustivo

---

## 6. Conclusiones

El sistema de encuestas tiene una **arquitectura sólida** a nivel de código frontend, pero sufre de **problemas fundamentales**:

1. **Ausencia de estructura de base de datos** (problema crítico)
2. **Dependencia excesiva de autenticación** para encuestas públicas
3. **Manejo de errores insuficiente**
4. **Falta de indicadores de carga**

**Impacto en el usuario**: Los usuarios no pueden votar porque las tablas no existen en la BD, y la interfaz no proporciona feedback adecuado sobre los problemas.

**Prioridad de solución**: **CRÍTICA** - El sistema debe ser completamente funcional para que sea útil.

**Tiempo estimado de solución completa**: 5-7 días laborales con desarrollo dedicado.

---

## 7. Próximos Pasos

1. **Inmediato**: Ejecutar migración de BD y insertar datos de prueba
2. **Corto plazo**: Implementar votaciones anónimas y mejor manejo de errores
3. **Mediano plazo**: Optimizar rendimiento y añadir funcionalidades avanzadas
4. **Largo plazo**: Implementar analytics avanzados y integración con notificaciones push

---

**Documento generado por**: Sistema de Diagnóstico Técnico  
**Fecha**: 22 de Noviembre de 2025  
**Versión**: 1.0  
**Estado**: Completo - Listo para implementación