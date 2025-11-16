# UGT Towa - Portal Sindical

Portal web oficial de la sección sindical de UGT en Towa Pharmaceutical Europe.

## 🎯 Características Principales

- **📱 PWA (Progressive Web App)** - Instalable en dispositivos móviles
- **🔐 Sistema de Autenticación** - Login seguro con Supabase Auth
- **📰 Newsletter Automática** - Generación y envío de boletines mensuales
- **📅 Gestión de Citas** - Sistema de citas para afiliados
- **💬 Comentarios y Reacciones** - Interacción social en comunicados
- **📊 Dashboard Administrativo** - Panel de control completo
- **🎨 Diseño Responsivo** - Adaptable a todos los dispositivos
- **🌙 Modo Oscuro/Claro** - Interfaz personalizable

## 🚀 Inicio Rápido

### Prerrequisitos
- Node.js 18+
- pnpm
- Cuenta Supabase

### Instalación
```bash
# Instalar dependencias
pnpm install

# Configurar variables de entorno
cp .env.example .env.local
# Editar .env.local con tus credenciales

# Ejecutar en desarrollo
pnpm dev
```

### Build y Deploy
```bash
# Crear build de producción
pnpm build

# Desplegar en Vercel
vercel --prod
```

## 📁 Estructura

```
src/
├── components/          # Componentes React reutilizables
├── pages/              # Páginas de la aplicación
│   ├── admin/          # Panel administrativo
│   └── affiliates/     # Panel de afiliados
├── contexts/           # Contextos React (Auth, Theme)
├── hooks/             # Custom hooks
└── lib/               # Utilidades y configuración

supabase/
├── functions/         # Edge Functions
└── migrations/        # Migraciones de base de datos
```

## 🔧 Tecnologías

- **Frontend:** React 18, TypeScript, Vite
- **Styling:** Tailwind CSS, Radix UI
- **Backend:** Supabase (Auth, Database, Storage, Edge Functions)
- **Build:** Vite, pnpm
- **Deploy:** Vercel

## 📚 Documentación

- [Guía de Despliegue](DEPLOY_GUIDE.md)
- [Configuración de Supabase](docs/SUPABASE.md)
- [Documentación de Newsletter](docs/NEWSLETTER.md)

## 🛡️ Configuración de Seguridad

### Variables de Entorno Requeridas
```env
VITE_SUPABASE_URL=tu_url_supabase
VITE_SUPABASE_ANON_KEY=tu_clave_anonima_supabase
```

### Configuración de Base de Datos
1. Ejecutar migraciones en orden secuencial
2. Configurar políticas RLS
3. Desplegar Edge Functions
4. Configurar buckets de Storage

## 📋 Scripts Disponibles

```bash
pnpm dev          # Servidor de desarrollo
pnpm build        # Build de producción
pnpm preview      # Preview del build
pnpm lint         # Linting del código
pnpm clean        # Limpiar dependencias
```

## 🏗️ Arquitectura

### Frontend
- React con TypeScript para type safety
- Context API para gestión de estado
- React Router para navegación
- Tailwind CSS para styling

### Backend
- Supabase como Backend-as-a-Service
- Edge Functions para lógica de servidor
- PostgreSQL con RLS para seguridad
- Storage para archivos multimedia

## 🤝 Contribución

1. Fork el proyecto
2. Crear rama para feature (`git checkout -b feature/AmazingFeature`)
3. Commit cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.

## 📞 Contacto

**UGT Towa Section**
- Email: contacto@ugt-towa.cat
- Web: https://ugt.towa.cat

---

**Desarrollado por MiniMax Agent** - Portal Sindical UGT Towa Pharmaceutical
