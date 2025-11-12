# Guía de Administración - Datos de Contacto

## Cómo Modificar los Datos de Contacto

Los datos de contacto del portal pueden modificarse de **3 formas diferentes**:

### 1. Modificar Variables de Entorno (Recomendado para Vercel)

Si tienes desplegado el proyecto en Vercel, puedes modificar estos datos desde el dashboard:

1. Ve al dashboard de Vercel: https://vercel.com/dashboard
2. Selecciona tu proyecto "ugt-towa"
3. Ve a **Settings > Environment Variables**
4. Modifica o añade estas variables:

```env
VITE_CONTACT_EMAIL=jpedragosa@towapharmaceutical.com
VITE_CONTACT_PHONE=629931957
```

5. Redeploya el proyecto

### 2. Modificar Archivo .env.local (Desarrollo Local)

Para desarrollo local, edita el archivo `.env.local`:

```env
# Datos de contacto actualizados
VITE_CONTACT_EMAIL=jpedragosa@towapharmaceutical.com
VITE_CONTACT_PHONE=629931957
```

### 3. Modificar Código Directamente (No recomendado)

Si necesitas cambios permanentes, edita `src/config/contact.ts`:

```typescript
export const CONTACT_CONFIG = {
  email: 'jpedragosa@towapharmaceutical.com',
  phone: '629931957',
  company: 'Towa Pharmaceutical Europe',
  // ... resto de configuración
};
```

## Validaciones Automáticas

El sistema incluye validaciones automáticas:

- **Email**: Validación de formato de email
- **Teléfono**: Validación de formato español (9 dígitos, empieza por 6, 7, 8 o 9)
- **Formato de teléfono**: Se muestra automáticamente como "629 931 957"

## Ubicación de los Datos

Los datos de contacto se muestran en:
- **Footer principal**: Todos los datos
- **Página de contacto**: Email y teléfono
- **Páginas administrativas**: Para uso interno

## Contacto Actual

- **Email**: jpedragosa@towapharmaceutical.com
- **Teléfono**: 629 931 957
- **Empresa**: Towa Pharmaceutical Europe

## Notas Técnicas

- Los cambios en variables de entorno requieren un redeploy
- El formato de teléfono se adapta automáticamente
- Las validaciones previenen datos incorrectos
- El sistema es resistente a errores (usa valores por defecto si faltan variables)