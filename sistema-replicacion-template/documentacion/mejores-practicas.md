# Mejores Prácticas - Portal Sindical

## Descripción General

Este documento establece las mejores prácticas para implementar, personalizar y mantener el Portal Sindical. Está basado en experiencias reales de implementación y optimizaciones realizadas en múltiples organizaciones.

## Arquitectura y Diseño

### Principios de Diseño

#### 1. Modularidad
**Principio:** Cada funcionalidad debe ser independiente y reutilizable.
\`\`\`javascript
// ✅ Bueno: Módulos independientes
const ModuloCitas = {
  config: tiposCitasConfig,
  services: citasService,
  components: citasComponents,
  utils: citasUtils
};

const ModuloComunicados = {
  config: comunicadosConfig,
  services: comunicadosService,
  components: comunicadosComponents,
  utils: comunicadosUtils
};

// ❌ Malo: Funcionalidades acopladas
const PortalCompleto = {
  citas: CitasManager,
  comunicados: ComunicadosManager,
  // Todo en un solo módulo
};
\`\`\`

#### 2. Configuración Externa
**Principio:** Toda la configuración debe estar en archivos separados.
\`\`\`javascript
// ✅ Bueno: Configuración externa
// config/empresa-config.js
export default {
  empresa: "Mi Empresa S.L.",
  sector: "industrial",
  colores: {
    primario: "#1e40af",
    secundario: "#059669"
  },
  tiposCitas: [
    // configuración específica
  ]
};

// app.js
import empresaConfig from './config/empresa-config';
const app = new PortalSindical(empresaConfig);

// ❌ Malo: Configuración hardcodeada
// app.js
const app = new PortalSindical({
  empresa: "Mi Empresa S.L.", // Hardcodeado
  colores: { primario: "#1e40af" } // No configurable
});
\`\`\`

#### 3. Responsive Design First
**Principio:** Diseñar primero para móvil, luego para desktop.
\`\`\`css
/* ✅ Bueno: Mobile First */
.container {
  padding: 1rem; /* Mobile */
}

@media (min-width: 768px) {
  .container {
    padding: 2rem; /* Tablet */
  }
}

@media (min-width: 1024px) {
  .container {
    padding: 3rem; /* Desktop */
  }
}

/* ❌ Malo: Desktop First */
.container {
  padding: 3rem; /* Diseñado para desktop */
}

/* Mobile sería muy pequeño */
\`\`\`

#### 4. Accesibilidad por Defecto
**Principio:** La accesibilidad no es opcional.
\`\`\`html
<!-- ✅ Bueno: Accesible -->
<button 
  aria-label="Reservar cita para asuntos sindicales"
  title="Reservar cita de 60 minutos"
>
  <span class="sr-only">Reservar cita:</span>
  Asuntos Sindicales
</button>

<!-- ❌ Malo: No accesible -->
<button class="btn-primary">
  Cita
</button>
\`\`\`

\`\`\`css
/* ✅ Bueno: Contraste adecuado */
.primary-button {
  background-color: #1e40af; /* Contraste 4.5:1 */
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 0.375rem;
  font-size: 1rem;
  min-height: 44px; /* Tamaño mínimo touch */
}

/* Focus visible */
.primary-button:focus-visible {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}

/* ❌ Malo: Sin consideraciones de accesibilidad */
.btn {
  padding: 5px 10px; /* Muy pequeño */
  background: blue; /* Sin contraste */
}
\`\`\`

## Configuración por Sector

### Estructura de Configuración Estándar
\`\`\`javascript
// config/plantilla-sector.js
const plantillaSector = {
  // Información básica
  empresa: {
    nombre: "",
    sector: "",
    escala: "", // pequeña, mediana, grande, muy_grande
    tipo: "",   // industrial, servicios, publico, ong
    modal: ""   // presencial, remoto, hibrido
  },
  
  // Personalización visual
  visual: {
    colores: {
      primario: "",
      secundario: "",
      acento: "",
      semanticos: {
        exito: "",
        advertencia: "",
        error: "",
        info: ""
      }
    },
    tipografia: {
      heading: "",
      body: "",
      mono: ""
    },
    logo: {
      principal: "",
      favicon: "",
      alt: ""
    }
  },
  
  // Funcionalidades específicas
  funcionalidades: {
    citas: {
      tipos: [],
      horarios: {},
      recordatorios: true,
      cancelacion: true
    },
    comunicados: {
      categorias: [],
      comentarios: true,
      reacciones: true,
      moderacion: true
    },
    encuestas: {
      anonimas: true,
      resultados_publicos: false,
      recordatorio: true
    }
  },
  
  // Permisos y roles
  seguridad: {
    validacionDominio: true,
    roles: {},
    permisos: {}
  },
  
  // Integraciones
  integraciones: {
    email: {
      servicio: "",
      configuracion: {}
    },
    storage: {
      buckets: [],
      politicas: {}
    },
    analytics: {
      google: false,
      interno: true
    }
  }
};
\`\`\`

### Validación de Configuración
\`\`\`javascript
// utils/validacion-config.js
const esquemaConfiguracion = {
  empresa: {
    nombre: { tipo: "string", requerido: true, min: 3 },
    sector: { tipo: "string", requerido: true, enum: ["industrial", "servicios", "publico"] },
    escala: { tipo: "string", enum: ["pequeña", "mediana", "grande", "muy_grande"] }
  },
  visual: {
    colores: {
      primario: { tipo: "string", patron: "^#[0-9A-Fa-f]{6}$" },
      secundario: { tipo: "string", patron: "^#[0-9A-Fa-f]{6}$" },
      acento: { tipo: "string", patron: "^#[0-9A-Fa-f]{6}$" }
    }
  },
  funcionalidades: {
    citas: {
      tipos: { tipo: "array", min: 1 },
      horarios: { tipo: "object" }
    }
  }
};

function validarConfiguracion(config) {
  const errores = [];
  
  for (const [seccion, esquema] of Object.entries(esquemaConfiguracion)) {
    if (!config[seccion]) {
      errores.push(`Sección faltante: ${seccion}`);
      continue;
    }
    
    // Validar cada campo
    for (const [campo, reglas] of Object.entries(esquema)) {
      const valor = config[seccion][campo];
      
      if (reglas.requerido && !valor) {
        errores.push(`${seccion}.${campo} es requerido`);
        continue;
      }
      
      if (valor && reglas.tipo && typeof valor !== reglas.tipo) {
        errores.push(`${seccion}.${campo} debe ser de tipo ${reglas.tipo}`);
      }
      
      if (valor && reglas.enum && !reglas.enum.includes(valor)) {
        errores.push(`${seccion}.${campo} debe ser uno de: ${reglas.enum.join(", ")}`);
      }
      
      if (valor && reglas.patron && !reglas.patron.test(valor)) {
        errores.push(`${seccion}.${campo} no cumple el patrón requerido`);
      }
    }
  }
  
  if (errores.length > 0) {
    throw new Error(`Configuración inválida:\n${errores.join("\n")}`);
  }
  
  return true;
}
\`\`\`

## Performance y Optimización

### Lazy Loading Inteligente
\`\`\`javascript
// components/LazyLoadWrapper.jsx
import { useState, useEffect, useRef } from 'react';

const LazyLoadWrapper = ({ 
  children, 
  threshold = '100px', 
  fallback = null,
  onLoad = null 
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const ref = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isLoaded) {
          setIsVisible(true);
          if (onLoad) onLoad();
        }
      },
      { threshold: 0.1, rootMargin: threshold }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [threshold, isLoaded, onLoad]);

  useEffect(() => {
    if (isVisible) {
      setIsLoaded(true);
    }
  }, [isVisible]);

  return (
    <div ref={ref}>
      {isLoaded ? children : fallback}
    </div>
  );
};

// Uso específico por sector
const ComponentePesado = lazy(() => import('./ComponentePesado'));

const PaginaCitas = () => {
  return (
    <div>
      <h1>Citas</h1>
      
      {/* Cargar solo cuando sea visible */}
      <LazyLoadWrapper
        threshold="200px"
        fallback={<div className="skeleton">Cargando...</div>}
        onLoad={() => console.log('Citas cargadas')}
      >
        <ComponentePesado />
      </LazyLoadWrapper>
    </div>
  );
};
\`\`\`

### Optimización de Imágenes
\`\`\`javascript
// components/OptimizedImage.jsx
import { useState, useEffect } from 'react';

const OptimizedImage = ({ 
  src, 
  alt, 
  sizes = "100vw",
  formats = ["webp", "avif", "jpg"],
  loading = "lazy",
  className = ""
}) => {
  const [imageSrc, setImageSrc] = useState(null);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    const seleccionarFormato = () => {
      for (const format of formats) {
        const srcConFormato = src.replace(/\.(jpg|jpeg|png)$/i, `.${format}`);
        const img = new Image();
        
        img.onload = () => {
          setImageSrc(srcConFormato);
        };
        
        img.onerror = () => {
          if (format === formats[formats.length - 1]) {
            setImageError(true);
          }
        };
        
        img.src = srcConFormato;
        
        // Solo intentar el primer formato soportado
        if (format === formats[0]) break;
      }
    };

    if (src) {
      seleccionarFormato();
    }
  }, [src, formats]);

  if (imageError) {
    return <div className={`image-error ${className}`}>Imagen no disponible</div>;
  }

  if (!imageSrc) {
    return <div className={`image-skeleton ${className}`}>Cargando...</div>;
  }

  return (
    <img
      src={imageSrc}
      alt={alt}
      sizes={sizes}
      loading={loading}
      className={className}
    />
  );
};

// Uso
const LogoEmpresa = ({ src, alt }) => (
  <OptimizedImage
    src={src}
    alt={alt}
    formats={['webp', 'png']}
    sizes="200px"
    className="logo-empresa"
  />
);
\`\`\`

### Code Splitting por Sector
\`\`\`javascript
// router/sector-routes.js
import { lazy, Suspense } from 'react';

// Cargar solo los módulos necesarios según el sector
const getRoutesForSector = (sector) => {
  const routes = {
    base: [
      { path: '/', component: lazy(() => import('./pages/Home')) },
      { path: '/citas', component: lazy(() => import('./pages/Citas')) },
      { path: '/comunicados', component: lazy(() => import('./pages/Comunicados')) }
    ],
    
    industrial: [
      { 
        path: '/seguridad', 
        component: lazy(() => import('./pages/SeguridadIndustrial')) 
      },
      { 
        path: '/convenio', 
        component: lazy(() => import('./pages/ConvenioColectivo')) 
      }
    ],
    
    servicios: [
      { 
        path: '/formacion', 
        component: lazy(() => import('./pages/FormacionContinua')) 
      },
      { 
        path: '/atencion-cliente', 
        component: lazy(() => import('./pages/AtencionCliente')) 
      }
    ],
    
    publico: [
      { 
        path: '/normativa', 
        component: lazy(() => import('./pages/Normativa')) 
      },
      { 
        path: '/transparencia', 
        component: lazy(() => import('./pages/Transparencia')) 
      }
    ]
  };

  return [
    ...routes.base,
    ...(routes[sector] || [])
  ];
};

// Configuración dinámica
export const AppRouter = ({ sector }) => {
  const routes = getRoutesForSector(sector);
  
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <Switch>
        {routes.map(route => (
          <Route 
            key={route.path}
            path={route.path} 
            component={route.component} 
          />
        ))}
      </Switch>
    </Suspense>
  );
};
\`\`\`

## Seguridad

### Validación de Entrada
\`\`\`javascript
// utils/validacion.js
import DOMPurify from 'dompurify';

class Validador {
  static email(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }
  
  static texto(texto, opciones = {}) {
    const { 
      maxLength = 1000, 
      minLength = 1, 
      allowHTML = false 
    } = opciones;
    
    if (typeof texto !== 'string') return false;
    if (texto.length < minLength || texto.length > maxLength) return false;
    
    if (!allowHTML) {
      // Remover HTML tags
      const cleanText = texto.replace(/<[^>]*>/g, '');
      return cleanText === texto;
    }
    
    return true;
  }
  
  static fecha(fecha) {
    const date = new Date(fecha);
    return date instanceof Date && !isNaN(date);
  }
  
  static dominio(dominio) {
    const regex = /^[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    return regex.test(dominio);
  }
  
  static colorHex(color) {
    const regex = /^#[0-9A-Fa-f]{6}$/;
    return regex.test(color);
  }
  
  // Sanitización de HTML
  static sanitizarHTML(html) {
    return DOMPurify.sanitize(html, {
      ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'br'],
      ALLOWED_ATTR: ['href', 'title']
    });
  }
}

// Uso
const ComentarioForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({ contenido: '' });
  const [errors, setErrors] = useState({});
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    const nuevosErrores = {};
    
    if (!Validador.texto(formData.contenido, { minLength: 10, maxLength: 500 })) {
      nuevosErrores.contenido = 'El comentario debe tener entre 10 y 500 caracteres';
    }
    
    if (Object.keys(nuevosErrores).length > 0) {
      setErrors(nuevosErrores);
      return;
    }
    
    const contenidoSanitizado = Validador.sanitizarHTML(formData.contenido);
    onSubmit({ contenido: contenidoSanitizado });
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <textarea
        value={formData.contenido}
        onChange={(e) => setFormData({ contenido: e.target.value })}
        placeholder="Escribe tu comentario..."
        className={errors.contenido ? 'error' : ''}
      />
      {errors.contenido && <span className="error-text">{errors.contenido}</span>}
      <button type="submit">Publicar</button>
    </form>
  );
};
\`\`\`

### Autenticación y Autorización
\`\`\`javascript
// hooks/useAuth.js
import { useContext, createContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [permissions, setPermissions] = useState([]);

  useEffect(() => {
    // Obtener sesión actual
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        loadUserProfile(session.user.id);
        loadUserPermissions(session.user.id);
      } else {
        setLoading(false);
      }
    });

    // Escuchar cambios de autenticación
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null);
        if (session?.user) {
          await loadUserProfile(session.user.id);
          await loadUserPermissions(session.user.id);
        } else {
          setProfile(null);
          setPermissions([]);
        }
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const loadUserProfile = async (userId) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Error cargando perfil:', error);
      return;
    }

    setProfile(data);
  };

  const loadUserPermissions = async (userId) => {
    // Obtener permisos basados en rol
    const { data, error } = await supabase
      .from('profiles')
      .select(`
        role,
        empresa_config!inner (
          configuracion_adicional
        )
      `)
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Error cargando permisos:', error);
      return;
    }

    const permisosGenerales = getPermissionsByRole(data.role);
    const permisosEmpresa = data.empresa_config?.configuracion_adicional?.permisos || {};
    setPermissions([...permisosGenerales, ...permisosEmpresa]);
  };

  const hasPermission = (permission) => {
    return permissions.includes(permission) || permissions.includes('*');
  };

  const signIn = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      throw error;
    }

    return data;
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      throw error;
    }
  };

  const value = {
    user,
    profile,
    loading,
    permissions,
    hasPermission,
    signIn,
    signOut
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

const getPermissionsByRole = (role) => {
  const permissionsMap = {
    admin: ['*'],
    delegate: [
      'view_all_communiques',
      'create_communiques',
      'manage_appointments',
      'view_statistics',
      'export_data'
    ],
    user: [
      'view_published_communiques',
      'book_appointments',
      'comment_communiques',
      'participate_surveys'
    ]
  };

  return permissionsMap[role] || [];
};
\`\`\`

### Protección de Rutas
\`\`\`javascript
// components/ProtectedRoute.jsx
import { useAuth } from '../hooks/useAuth';
import { Navigate } from 'react-router-dom';

export const ProtectedRoute = ({ 
  children, 
  requiredPermission = null,
  requiredRole = null,
  fallback = null
}) => {
  const { user, profile, loading, hasPermission } = useAuth();

  if (loading) {
    return <div className="loading">Cargando...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && profile?.role !== requiredRole) {
    return <Navigate to="/unauthorized" replace />;
  }

  if (requiredPermission && !hasPermission(requiredPermission)) {
    return fallback || <Navigate to="/unauthorized" replace />;
  }

  return children;
};

// Uso
const AdminDashboard = () => {
  return (
    <ProtectedRoute requiredRole="admin">
      <AdminPanel />
    </ProtectedRoute>
  );
};

const EditarComunicado = ({ comunicadoId }) => {
  return (
    <ProtectedRoute 
      requiredPermission="edit_communiques"
      fallback={<div>No tienes permisos para editar comunicados</div>}
    >
      <ComunicadoEditor comunicadoId={comunicadoId} />
    </ProtectedRoute>
  );
};
\`\`\`

## Testing

### Estrategia de Testing
\`\`\`javascript
// tests/utils/test-utils.js
import { render, renderHook, act } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '../contexts/AuthContext';

// Configuración global de test
const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
    mutations: { retry: false },
  },
});

const AllTheProviders = ({ children }) => {
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </QueryClientProvider>
    </BrowserRouter>
  );
};

const customRender = (ui, options = {}) => 
  render(ui, { wrapper: AllTheProviders, ...options });

// Utility functions
export const createMockUser = (overrides = {}) => ({
  id: '123',
  email: 'test@example.com',
  ...overrides
});

export const createMockProfile = (overrides = {}) => ({
  id: '123',
  full_name: 'Test User',
  role: 'user',
  email: 'test@example.com',
  ...overrides
});

export const createMockAppointment = (overrides = {}) => ({
  id: '456',
  tipo_cita: 'sindical',
  delegate_name: 'Test Delegate',
  start_time: '2025-01-15T10:00:00Z',
  status: 'confirmed',
  ...overrides
});

// Re-export everything
export * from '@testing-library/react';
export { customRender as render, act };

// tests/components/CitasPage.test.jsx
import { render, screen, fireEvent, waitFor } from '../test-utils';
import { CitasPage } from '../components/CitasPage';
import { createMockAppointment } from '../test-utils';

describe('CitasPage', () => {
  beforeEach(() => {
    // Mock de datos
    jest.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => ({
        data: [createMockAppointment()]
      })
    });
  });

  afterEach(() => {
    global.fetch.mockRestore();
  });

  test('muestra las citas disponibles', async () => {
    render(<CitasPage />);

    await waitFor(() => {
      expect(screen.getByText('Test Delegate')).toBeInTheDocument();
    });
  });

  test('permite reservar una cita', async () => {
    const mockReserve = jest.fn().mockResolvedValue({ success: true });
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true })
    });

    render(<CitasPage />);

    const reservarButton = await screen.findByText('Reservar');
    fireEvent.click(reservarButton);

    await waitFor(() => {
      expect(mockReserve).toHaveBeenCalled();
    });
  });

  test('muestra error si falla la reserva', async () => {
    global.fetch.mockRejectedValueOnce(new Error('Error de red'));

    render(<CitasPage />);

    const reservarButton = await screen.findByText('Reservar');
    fireEvent.click(reservarButton);

    await waitFor(() => {
      expect(screen.getByText(/Error/)).toBeInTheDocument();
    });
  });
});
\`\`\`

### Testing de Integración
\`\`\`javascript
// tests/integration/auth.test.jsx
import { render, screen, fireEvent, waitFor } from '../test-utils';
import { AuthProvider } from '../contexts/AuthContext';
import { LoginPage } from '../pages/LoginPage';
import { DashboardPage } from '../pages/DashboardPage';

// Mock de Supabase
jest.mock('../lib/supabase', () => ({
  supabase: {
    auth: {
      signInWithPassword: jest.fn(),
      onAuthStateChange: jest.fn(() => ({
        data: { subscription: { unsubscribe: jest.fn() } }
      }))
    }
  }
}));

describe('Flujo de Autenticación', () => {
  test('login exitoso redirige al dashboard', async () => {
    const mockSignIn = jest.fn().mockResolvedValue({
      data: { user: { id: '123', email: 'test@example.com' } },
      error: null
    });

    const { supabase } = require('../lib/supabase');
    supabase.auth.signInWithPassword = mockSignIn;

    render(
      <AuthProvider>
        <LoginPage />
        <DashboardPage />
      </AuthProvider>
    );

    // Llenar formulario
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'test@example.com' }
    });

    fireEvent.change(screen.getByLabelText(/contraseña/i), {
      target: { value: 'password123' }
    });

    // Hacer submit
    fireEvent.click(screen.getByText(/iniciar sesión/i));

    // Verificar llamada
    await waitFor(() => {
      expect(mockSignIn).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123'
      });
    });

    // Verificar redirección (simulado)
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
  });
});
\`\`\`

## Monitoreo y Analytics

### Sistema de Logging
\`\`\`javascript
// utils/logger.js
class Logger {
  constructor(config) {
    this.config = {
      level: config?.level || 'info',
      enableConsole: config?.enableConsole ?? true,
      enableRemote: config?.enableRemote ?? false,
      endpoint: config?.endpoint || null
    };
  }

  log(level, message, context = {}) {
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      level,
      message,
      context,
      userAgent: navigator.userAgent,
      url: window.location.href
    };

    if (this.shouldLog(level)) {
      this.writeToConsole(logEntry);
      
      if (this.config.enableRemote) {
        this.sendToRemote(logEntry);
      }
    }
  }

  info(message, context) {
    this.log('info', message, context);
  }

  warn(message, context) {
    this.log('warn', message, context);
  }

  error(message, context) {
    this.log('error', message, context);
  }

  debug(message, context) {
    this.log('debug', message, context);
  }

  shouldLog(level) {
    const levels = ['debug', 'info', 'warn', 'error'];
    const configLevelIndex = levels.indexOf(this.config.level);
    const messageLevelIndex = levels.indexOf(level);
    return messageLevelIndex >= configLevelIndex;
  }

  writeToConsole(logEntry) {
    const { level, message, context } = logEntry;
    
    switch (level) {
      case 'error':
        console.error(message, context);
        break;
      case 'warn':
        console.warn(message, context);
        break;
      case 'info':
        console.info(message, context);
        break;
      case 'debug':
        console.debug(message, context);
        break;
    }
  }

  async sendToRemote(logEntry) {
    try {
      await fetch(this.config.endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(logEntry)
      });
    } catch (error) {
      // Fallback to console if remote logging fails
      console.error('Error enviando log remoto:', error);
    }
  }
}

// Configuración por entorno
const logger = new Logger({
  level: process.env.NODE_ENV === 'production' ? 'warn' : 'debug',
  enableRemote: process.env.NODE_ENV === 'production',
  endpoint: '/api/logs'
});

export default logger;

// Uso en componentes
import logger from '../utils/logger';

const CitasPage = () => {
  const handleReservar = async (citaId) => {
    try {
      logger.info('Intentando reservar cita', { citaId, userId: user.id });
      
      const resultado = await reservarCita(citaId);
      
      logger.info('Cita reservada exitosamente', { 
        citaId, 
        resultado,
        userId: user.id 
      });
      
    } catch (error) {
      logger.error('Error al reservar cita', { 
        citaId, 
        error: error.message,
        stack: error.stack,
        userId: user.id 
      });
      
      // Mostrar error al usuario
      setError('No se pudo reservar la cita. Inténtelo de nuevo.');
    }
  };

  return (
    // JSX
  );
};
\`\`\`

### Performance Monitoring
\`\`\`javascript
// utils/performance.js
class PerformanceMonitor {
  constructor() {
    this.metrics = new Map();
    this.observers = new Map();
  }

  // Medir tiempo de carga de página
  measurePageLoad() {
    if (typeof window === 'undefined') return;

    window.addEventListener('load', () => {
      const navigation = performance.getEntriesByType('navigation')[0];
      
      const metrics = {
        domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
        loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
        totalTime: navigation.loadEventEnd - navigation.navigationStart,
        dns: navigation.domainLookupEnd - navigation.domainLookupStart,
        tcp: navigation.connectEnd - navigation.connectStart,
        request: navigation.responseStart - navigation.requestStart,
        response: navigation.responseEnd - navigation.responseStart,
        processing: navigation.domComplete - navigation.responseEnd
      };

      this.recordMetric('pageLoad', metrics);
      this.sendMetrics('pageLoad', metrics);
    });
  }

  // Medir tiempo de interacciones
  measureInteraction(name, fn) {
    return async (...args) => {
      const start = performance.now();
      const result = await fn(...args);
      const end = performance.now();
      
      this.recordMetric(`interaction_${name}`, {
        duration: end - start,
        timestamp: new Date().toISOString()
      });

      return result;
    };
  }

  // Observar cambios en el DOM
  observeDOMChanges() {
    if (typeof window === 'undefined' || !window.MutationObserver) return;

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          this.recordMetric('domChanges', {
            addedNodes: mutation.addedNodes.length,
            removedNodes: mutation.removedNodes.length,
            timestamp: new Date().toISOString()
          });
        }
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    this.observers.set('dom', observer);
  }

  // Medir recursos
  measureResources() {
    if (typeof window === 'undefined') return;

    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        this.recordMetric('resource', {
          name: entry.name,
          type: entry.initiatorType,
          size: entry.transferSize,
          duration: entry.duration,
          timestamp: new Date().toISOString()
        });
      });
    });

    observer.observe({ entryTypes: ['resource'] });
    this.observers.set('resources', observer);
  }

  recordMetric(name, value) {
    if (!this.metrics.has(name)) {
      this.metrics.set(name, []);
    }
    this.metrics.get(name).push(value);

    // Mantener solo los últimos 100 valores
    const values = this.metrics.get(name);
    if (values.length > 100) {
      this.metrics.set(name, values.slice(-100));
    }
  }

  getMetrics(name) {
    return this.metrics.get(name) || [];
  }

  getAverageMetric(name) {
    const values = this.getMetrics(name);
    if (values.length === 0) return 0;

    if (name === 'pageLoad') {
      const totalTimes = values.map(v => v.totalTime);
      return totalTimes.reduce((a, b) => a + b, 0) / totalTimes.length;
    }

    const durations = values.map(v => v.duration);
    return durations.reduce((a, b) => a + b, 0) / durations.length;
  }

  sendMetrics(type, metrics) {
    // Enviar a servicio de monitoreo
    if (process.env.NODE_ENV === 'production') {
      fetch('/api/metrics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, metrics })
      }).catch(error => {
        console.error('Error enviando métricas:', error);
      });
    }
  }

  cleanup() {
    this.observers.forEach((observer) => {
      observer.disconnect();
    });
    this.observers.clear();
    this.metrics.clear();
  }
}

const performanceMonitor = new PerformanceMonitor();

export default performanceMonitor;

// Inicializar en el componente principal
const App = () => {
  useEffect(() => {
    performanceMonitor.measurePageLoad();
    performanceMonitor.observeDOMChanges();
    performanceMonitor.measureResources();

    return () => {
      performanceMonitor.cleanup();
    };
  }, []);

  return <Router>{/* ... */}</Router>;
};
\`\`\`

## Deployment y DevOps

### Pipeline de CI/CD
\`\`yaml
# .github/workflows/deploy.yml
name: Deploy Portal Sindical

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

env:
  NODE_VERSION: '18'
  REGISTRY: ghcr.io
  IMAGE_NAME: ${{ github.repository }}

jobs:
  test:
    runs-on: ubuntu-latest
    
    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_PASSWORD: postgres
          POSTGRES_DB: test_portal
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run linter
        run: npm run lint
      
      - name: Run type check
        run: npm run type-check
      
      - name: Run unit tests
        run: npm test
        env:
          SUPABASE_URL: ${{ secrets.SUPABASE_TEST_URL }}
          SUPABASE_ANON_KEY: ${{ secrets.SUPABASE_TEST_ANON_KEY }}
      
      - name: Run integration tests
        run: npm run test:integration
        env:
          SUPABASE_URL: ${{ secrets.SUPABASE_TEST_URL }}
          SUPABASE_ANON_KEY: ${{ secrets.SUPABASE_TEST_ANON_KEY }}
      
      - name: Generate test coverage
        run: npm run test:coverage

  build:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'
      
      - name: Build application
        run: |
          npm ci
          npm run build
        env:
          VITE_SUPABASE_URL: ${{ secrets.SUPABASE_URL }}
          VITE_SUPABASE_ANON_KEY: ${{ secrets.SUPABASE_ANON_KEY }}
          EMPRESA_NOMBRE: ${{ secrets.EMPRESA_NOMBRE }}
          EMPRESA_DOMINIO: ${{ secrets.EMPRESA_DOMINIO }}
      
      - name: Build Docker image
        run: |
          docker build -t ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}:latest .
          docker tag ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}:latest ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}:${{ github.sha }}
      
      - name: Log in to Container Registry
        uses: docker/login-action@v2
        with:
          registry: ${{ env.REGISTRY }}
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}
      
      - name: Push image
        run: |
          docker push ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}:latest
          docker push ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}:${{ github.sha }}

  deploy:
    needs: build
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    environment: production
    
    steps:
      - name: Deploy to production
        run: |
          # Scripts de despliegue
          echo "Desplegando a producción..."
          
          # Actualizar base de datos
          ./scripts/migrate-production.sh
          
          # Desplegar aplicación
          docker-compose -f docker-compose.prod.yml up -d
          
          # Verificar despliegue
          curl -f ${{ secrets.PRODUCTION_URL }}/health || exit 1
          
          echo "Despliegue completado exitosamente"

  notify:
    needs: [deploy]
    runs-on: ubuntu-latest
    if: always()
    
    steps:
      - name: Notify deployment status
        run: |
          if [ "${{ needs.deploy.result }}" == "success" ]; then
            echo "✅ Despliegue exitoso en producción"
            # Enviar notificación de éxito
          else
            echo "❌ Fallo en el despliegue"
            # Enviar notificación de error
          fi
\`\`\`

### Docker Configuration
\`\`\`dockerfile
# Dockerfile
# Multi-stage build for optimization

# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm ci --only=production

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM nginx:alpine AS production

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

# Copy built application
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

# Set permissions
RUN chown -R nextjs:nodejs /usr/share/nginx/html
RUN chown -R nextjs:nodejs /var/cache/nginx
RUN chown -R nextjs:nodejs /var/log/nginx
RUN chown -R nextjs:nodejs /etc/nginx/conf.d
RUN touch /var/run/nginx.pid
RUN chown -R nextjs:nodejs /var/run/nginx.pid

USER nextjs

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost/health || exit 1

CMD ["dumb-init", "nginx", "-g", "daemon off;"]
\`\`\`

\`\`\`nginx
# nginx.conf
user nginx;
worker_processes auto;
error_log /var/log/nginx/error.log warn;
pid /var/run/nginx.pid;

events {
    worker_connections 1024;
    use epoll;
    multi_accept on;
}

http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;

    # Logging
    log_format main '$remote_addr - $remote_user [$time_local] "$request" '
                    '$status $body_bytes_sent "$http_referer" '
                    '"$http_user_agent" "$http_x_forwarded_for"';
    access_log /var/log/nginx/access.log main;

    # Performance
    sendfile on;
    tcp_nopush on;
    tcp_nodelay on;
    keepalive_timeout 65;
    types_hash_max_size 2048;
    server_tokens off;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types
        text/plain
        text/css
        text/xml
        text/javascript
        application/javascript
        application/xml+rss
        application/json;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';" always;

    # Rate limiting
    limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
    limit_req_zone $binary_remote_addr zone=login:10m rate=1r/s;

    server {
        listen 80;
        server_name _;
        
        # Health check endpoint
        location /health {
            access_log off;
            return 200 "healthy\n";
            add_header Content-Type text/plain;
        }

        # Main application
        location / {
            root /usr/share/nginx/html;
            index index.html;
            try_files $uri $uri/ /index.html;
            
            # Cache static assets
            location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
                expires 1y;
                add_header Cache-Control "public, immutable";
            }
            
            # Security for sensitive files
            location ~ /\. {
                deny all;
            }
        }

        # API proxy (if needed)
        location /api/ {
            limit_req zone=api burst=20 nodelay;
            proxy_pass http://backend;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_cache_bypass $http_upgrade;
        }

        # Login endpoint with stricter rate limiting
        location /api/auth/login {
            limit_req zone=login burst=5 nodelay;
            proxy_pass http://backend;
            proxy_set_header Content-Type application/json;
            proxy_set_header Host $host;
        }

        # Error pages
        error_page 404 /404.html;
        error_page 500 502 503 504 /50x.html;
        
        location = /50x.html {
            root /usr/share/nginx/html;
        }
    }
}
\`\`\`

### Scripts de Despliegue
\`\`\`bash
#!/bin/bash
# scripts/deploy-production.sh

set -e

echo "🚀 Iniciando despliegue a producción..."

# Verificar que estamos en la rama correcta
BRANCH=$(git rev-parse --abbrev-ref HEAD)
if [ "$BRANCH" != "main" ]; then
    echo "❌ Error: Solo se puede desplegar desde la rama 'main'"
    exit 1
fi

# Verificar que no hay cambios sin commit
if [ -n "$(git status --porcelain)" ]; then
    echo "❌ Error: Hay cambios sin commit. Haz commit antes de desplegar."
    exit 1
fi

# Crear backup antes del despliegue
echo "💾 Creando backup de seguridad..."
./scripts/create-backup.sh

# Ejecutar tests
echo "🧪 Ejecutando tests..."
npm run test:ci

# Build de la aplicación
echo "🔨 Construyendo aplicación..."
npm run build

# Ejecutar migraciones de base de datos
echo "🗄️ Ejecutando migraciones..."
./scripts/run-migrations.sh

# Construir imagen Docker
echo "🐳 Construyendo imagen Docker..."
docker build -t portal-sindical:latest .

# Desplegar
echo "🚀 Desplegando..."
docker-compose -f docker-compose.prod.yml up -d

# Verificar que el despliegue funciona
echo "✅ Verificando despliegue..."
sleep 30
curl -f https://mi-empresa.com/health || exit 1

# Limpiar imágenes antiguas
echo "🧹 Limpiando imágenes antiguas..."
docker image prune -f

echo "✅ Despliegue completado exitosamente"

# Enviar notificación
./scripts/notify-deployment.sh "success"
\`\`\`

Estas mejores prácticas aseguran que el Portal Sindical sea robusto, seguro, mantenible y escalable en cualquier sector o contexto de implementación.
