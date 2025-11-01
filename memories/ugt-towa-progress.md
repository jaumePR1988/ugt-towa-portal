# Portal Sindical UGT Towa - Progreso

## Proyecto
Portal web completo para Sección Sindical UGT en Towa Pharmaceutical Europe

## Stack
- Backend: Supabase (Auth, DB, Storage, Edge Functions)
- Frontend: SvelteKit + Tailwind CSS
- Despliegue: Hostinger

## Credenciales Supabase
- URL: https://zaxdscclkeytakcowgww.supabase.co
- Project ID: zaxdscclkeytakcowgww
- Keys: Disponibles via get_all_secrets

## Fase Actual
FRONTEND DEVELOPMENT - Iniciando

## Checklist Backend
- [x] Esquema base de datos completo (12 tablas)
- [x] RLS policies (todas las tablas)
- [x] Triggers automáticos (handle_new_user)
- [x] Storage bucket (delegate-photos)
- [x] Edge Functions (validate-email-domain, upload-delegate-photo)
- [x] Testing backend (validación email OK)
- [x] Datos iniciales insertados

## URLs Edge Functions
- validate-email-domain: https://zaxdscclkeytakcowgww.supabase.co/functions/v1/validate-email-domain
- upload-delegate-photo: https://zaxdscclkeytakcowgww.supabase.co/functions/v1/upload-delegate-photo

## Proyecto Completado - 100% ✓

### Backend Supabase - 100% ✓
- Base de datos completa con 12 tablas
- RLS configurado en todas las tablas
- 3 Edge Functions desplegadas:
  * validate-email-domain
  * upload-delegate-photo
  * send-notifications (sistema de notificaciones automatizadas)
- Cron Job activo (ID: 1) para notificaciones diarias a las 9 AM
- Storage bucket configurado (delegate-photos)
- Datos iniciales insertados

### Frontend React - 100% ✓
- 8 páginas públicas implementadas
- 6 páginas admin con CRUD completo:
  * AdminComunicados: crear, editar, eliminar
  * AdminDisponibilidad: crear, eliminar
  * AdminEncuestas: crear, toggle activo, eliminar
  * AdminQuienesSomos, AdminCitas, AdminDashboard: funcionales
- Sistema de autenticación completo con validación de dominio
- Build exitoso (2414 módulos)
- **Desplegado en producción**: https://mnuilbg09vmn.space.minimax.io
- Pruebas comprehensivas pasadas exitosamente

### Archivos Entregables
- Código fuente completo: /workspace/ugt-towa-portal/
- Documentación despliegue: /workspace/DEPLOY_GUIDE.md
- Build producción: /workspace/ugt-towa-portal/dist/
- URL producción: https://mnuilbg09vmn.space.minimax.io

## Notas
- Logo disponible: user_input_files/UGT-logo.jpg
- Dominio email restringido: @towapharmaceutical.com
