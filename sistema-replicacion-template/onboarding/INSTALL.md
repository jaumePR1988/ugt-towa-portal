# Checklist de Instalación y Verificación
# Sistema de Onboarding UGT TOWA

## ✅ Checklist de Pre-Instalación

### Requisitos del Sistema
- [ ] Navegador web moderno disponible (Chrome 80+, Firefox 75+, Safari 13+, Edge 80+)
- [ ] JavaScript habilitado en el navegador
- [ ] Al menos 50MB de espacio libre en el navegador
- [ ] Conexión a internet para cargar fuentes externas
- [ ] Permisos de escritura en el directorio de destino

### Archivos Requeridos
- [ ] index.html (archivo principal)
- [ ] assets/css/styles.css (estilos principales)
- [ ] assets/js/validation.js (validación)
- [ ] assets/js/form-handler.js (manejo del formulario)
- [ ] assets/js/timeline.js (timeline de implementación)
- [ ] assets/images/ (directorio para imágenes)
- [ ] docs/ (documentación completa)

## 🚀 Proceso de Instalación

### Paso 1: Preparar Directorio
```bash
# Crear directorio de destino
mkdir -p /var/www/onboarding
cd /var/www/onboarding

# Verificar permisos
chmod 755 .
```

### Paso 2: Descargar Archivos
```bash
# Clonar desde repositorio (si aplica)
git clone [repository-url] .

# O copiar archivos manualmente
# Asegurar estructura de carpetas:
onboarding/
├── index.html
├── assets/
│   ├── css/
│   │   └── styles.css
│   ├── js/
│   │   ├── validation.js
│   │   ├── form-handler.js
│   │   └── timeline.js
│   └── images/
└── docs/
```

### Paso 3: Configurar Servidor Web

#### Para Apache (.htaccess)
```apache
# Crear archivo .htaccess
cat > .htaccess << EOF
Options -Indexes
DirectoryIndex index.html

# Cache de recursos estáticos
<FilesMatch "\.(css|js|png|jpg|jpeg|gif|ico|svg)$">
    ExpiresActive On
    ExpiresDefault "access plus 1 year"
</FilesMatch>

# Compresión
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/plain
    AddOutputFilterByType DEFLATE text/html
    AddOutputFilterByType DEFLATE text/css
    AddOutputFilterByType DEFLATE application/javascript
</IfModule>

# Headers de seguridad
<IfModule mod_headers.c>
    Header always set X-Frame-Options "SAMEORIGIN"
    Header always set X-XSS-Protection "1; mode=block"
    Header always set X-Content-Type-Options "nosniff"
</IfModule>
EOF
```

#### Para Nginx
```nginx
server {
    listen 80;
    server_name onboarding.ugt-towa.com;
    
    location /onboarding/ {
        alias /var/www/onboarding/;
        try_files $uri $uri/ /onboarding/index.html;
        
        # Cache
        location ~* \.(css|js|png|jpg|jpeg|gif|ico|svg)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
        
        # Security headers
        add_header X-Frame-Options "SAMEORIGIN" always;
        add_header X-XSS-Protection "1; mode=block" always;
        add_header X-Content-Type-Options "nosniff" always;
    }
}
```

### Paso 4: Configurar Permisos
```bash
# Establecer permisos correctos
chmod 644 *.html
chmod 644 assets/css/*.css
chmod 644 assets/js/*.js
chmod 644 assets/images/*
chmod 644 docs/*.md

# Verificar estructura
find . -type f -name "*.html" -o -name "*.css" -o -name "*.js" | sort
```

## 🔍 Verificación de Instalación

### Test 1: Carga de Página Principal
- [ ] Abrir navegador y navegar a la URL
- [ ] Verificar que aparece la pantalla de bienvenida
- [ ] Confirmar que el logo UGT se muestra correctamente
- [ ] Verificar que la barra de progreso está visible
- [ ] Comprobar que los 4 pasos del formulario están listados

### Test 2: Navegación Básica
- [ ] Hacer clic en "Siguiente" en el primer paso
- [ ] Verificar que avanza al paso 2
- [ ] Hacer clic en "Anterior" para volver
- [ ] Confirmar que los datos se mantienen
- [ ] Probar navegación con teclado (Ctrl+←/→)

### Test 3: Validación de Campos
- [ ] Intentar dejar campos obligatorios vacíos
- [ ] Verificar que se muestran mensajes de error
- [ ] Probar con un CIF inválido (ej: 1234567)
- [ ] Probar con un email inválido (ej: usuario@)
- [ ] Confirmar que la validación funciona en tiempo real

### Test 4: Guardado Automático
- [ ] Completar parcialmente el formulario
- [ ] Recargar la página del navegador
- [ ] Verificar que los datos se mantienen
- [ ] Comprobar en DevTools > Application > Local Storage
- [ ] Confirmar que hay entradas con "onboarding-step-"

### Test 5: Completar Formulario
- [ ] Completar todos los pasos del formulario
- [ ] Marcar "Acepto términos y condiciones"
- [ ] Hacer clic en "Enviar Solicitud"
- [ ] Verificar que aparece el modal de confirmación
- [ ] Comprobar que muestra el ID de solicitud generado

### Test 6: Timeline de Implementación
- [ ] Verificar que el timeline se muestra en la página
- [ ] Comprobar que hay 10 fases visibles
- [ ] Hacer clic en "Ver detalles" de una fase
- [ ] Verificar que se expande la información
- [ ] Comprobar navegación con flechas del teclado

### Test 7: Responsividad
- [ ] Redimensionar la ventana del navegador
- [ ] Probar en vista móvil (375px width)
- [ ] Probar en vista tablet (768px width)
- [ ] Verificar que el layout se adapta correctamente
- [ ] Comprobar que la navegación sigue siendo funcional

### Test 8: Cross-Browser
- [ ] Probar en Chrome
- [ ] Probar en Firefox
- [ ] Probar en Safari (si está disponible)
- [ ] Probar en Edge
- [ ] Documentar cualquier diferencia de comportamiento

### Test 9: Rendimiento
- [ ] Medir tiempo de carga inicial (< 3 segundos)
- [ ] Verificar tiempo de navegación entre pasos (< 200ms)
- [ ] Comprobar tiempo de validación (< 500ms)
- [ ] Ejecutar Lighthouse audit (score > 90)
- [ ] Verificar tamaño total de assets (< 500KB)

### Test 10: Accesibilidad
- [ ] Probar navegación con Tab
- [ ] Verificar contraste de colores
- [ ] Comprobar etiquetas de formularios
- [ ] Probar con lector de pantalla (si disponible)
- [ ] Verificar que los errores son anunciados

## 📊 Verificación de Documentación

### Archivos de Documentación
- [ ] README.md presente y legible
- [ ] DOCUMENTACION.md completa y actualizada
- [ ] MANUAL_USUARIO.md claro y útil
- [ ] GUIA_DESARROLLO.md técnica y detallada
- [ ] API_REFERENCE.md completa y actualizada

### Contenido de Documentación
- [ ] Instrucciones de instalación claras
- [ ] Ejemplos de código funcionales
- [ ] Screenshots o diagramas actualizados
- [ ] FAQ con problemas comunes
- [ ] Información de contacto actualizada

## 🔧 Resolución de Problemas Comunes

### Problema: Página en blanco
**Causas posibles:**
- JavaScript deshabilitado
- Error en carga de CSS/JS
- Rutas incorrectas de archivos

**Solución:**
1. Verificar consola del navegador (F12)
2. Comprobar que todos los archivos están en su lugar
3. Verificar rutas relativas en HTML

### Problema: Estilos no se aplican
**Causas posibles:**
- Archivo CSS no encontrado
- Cache del navegador
- Error de sintaxis CSS

**Solución:**
1. Verificar ruta del archivo CSS
2. Limpiar cache del navegador (Ctrl+F5)
3. Validar sintaxis CSS

### Problema: Formulario no navega
**Causas posibles:**
- Error JavaScript
- Navegador incompatible
- Datos inválidos bloqueando navegación

**Solución:**
1. Revisar consola para errores JavaScript
2. Probar en navegador diferente
3. Validar datos ingresados

### Problema: Datos no se guardan
**Causas posibles:**
- localStorage deshabilitado
- Espacio insuficiente en navegador
- Modo privado/incógnito

**Solución:**
1. Verificar que localStorage está disponible
2. Limpiar datos del navegador
3. Probar en modo normal (no privado)

## ✅ Checklist de Post-Instalación

### Configuración Final
- [ ] URL de producción configurada
- [ ] Certificado SSL instalado
- [ ] Dominio apuntando correctamente
- [ ] Backup de archivos creado
- [ ] Monitoreo configurado (opcional)

### Pruebas de Producción
- [ ] Test completo en ambiente de producción
- [ ] Verificación de carga en diferentes horarios
- [ ] Prueba de envío de formulario real
- [ ] Verificación de emails de confirmación
- [ ] Test de rendimiento bajo carga

### Documentación Final
- [ ] Documentación actualizada con URLs reales
- [ ] Manual de usuario con datos de contacto correctos
- [ ] Procedimientos de mantenimiento documentados
- [ ] Plan de backup documentado
- [ ] Contactos de soporte actualizados

## 📞 Contactos de Soporte

### Soporte Técnico
- **Email**: soporte@ugt-towa.com
- **Teléfono**: +34 91 123 4567
- **Horario**: Lunes a Viernes, 9:00-18:00

### Escalación
1. **Nivel 1**: Soporte general (respuesta < 4h)
2. **Nivel 2**: Soporte técnico especializado (respuesta < 24h)
3. **Nivel 3**: Desarrollo/arquitectura (respuesta < 48h)

## 📝 Registro de Instalación

**Fecha de Instalación**: _______________
**Instalado por**: _______________
**URL de Producción**: _______________
**Versión**: 1.0.0
**Estado Final**: ✅ COMPLETADO / ❌ PENDIENTE

### Observaciones
_________________________________
_________________________________
_________________________________

### Firma de Aprobación
**Aprobado por**: _______________
**Fecha**: _______________
**Comentarios**: _______________

---

**Nota**: Conservar este documento como parte de los registros de instalación y mantenimiento del sistema.