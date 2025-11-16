# ✅ CHECKLIST DE VERIFICACIÓN POST-DEPLOY VERCEL

## 🎯 URLS FINALES ESPERADAS

### URLs Principales
- **Portal Principal:** https://ugt.towa.cat
- **Dashboard Admin:** https://ugt.towa.cat/admin
- **PWA Install:** https://ugt.towa.cat
- **Sitemap:** https://ugt.towa.cat/sitemap.xml
- **Google Search Console:** https://ugt.towa.cat/google04273cafa2bc9d12.html

### URLs de Vercel (Alternativas)
- **URL Temporal Vercel:** https://ugt-towa-portal-[hash].vercel.app
- **Dashboard Vercel:** https://vercel.com/dashboard/projects/[project-id]

---

## 🔍 VERIFICACIÓN AUTOMATIZADA

### Paso 1: Verificación de Conectividad

```bash
# Test básico de conectividad
curl -I https://ugt.towa.cat

# Test con timeout
timeout 10 curl -f https://ugt.towa.cat > /dev/null && echo "✅ Portal carga correctamente" || echo "❌ Portal no carga"
```

**Resultado Esperado:**
```
HTTP/2 200 
content-type: text/html; charset=utf-8
```

### Paso 2: Verificación de PWA

```bash
# Verificar manifest.json
curl -s https://ugt.towa.cat/manifest.json | jq .

# Verificar service worker
curl -I https://ugt.towa.cat/sw.js
```

**Resultado Esperado para Manifest:**
```json
{
  "name": "Portal UGT-TOWA",
  "short_name": "UGT-TOWA",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#000000",
  "icons": [...]
}
```

### Paso 3: Verificación de Variables de Entorno

```bash
# Verificar que el footer muestra datos correctos
curl -s https://ugt.towa.cat | grep -i "jpedragosa@towapharmaceutical.com"
curl -s https://ugt.towa.cat | grep -i "629931957"
```

**Resultado Esperado:**
- Email de contacto visible en footer
- Teléfono de contacto visible en footer

---

## 🧪 VERIFICACIÓN MANUAL COMPLETA

### Test 1: Carga Inicial
- [ ] **URL principal carga en menos de 3 segundos**
- [ ] **No hay errores 404 en consola (F12)**
- [ ] **Logo UGT aparece correctamente**
- [ ] **Estilos CSS se cargan (tema claro/oscuro)**
- [ ] **Navegación principal funciona**

### Test 2: Autenticación
- [ ] **Botón "Iniciar Sesión" visible**
- [ ] **Modal de login se abre correctamente**
- [ ] **Formulario de login acepta credenciales**
- [ ] **Redirección después del login funciona**
- [ ] **Logout funciona correctamente**

### Test 3: Dashboard Admin
- [ ] **Dashboard accesible en /admin**
- [ ] **Menú lateral se despliega**
- [ ] **Gráficos y estadísticas cargan**
- [ ] **Gestión de comunicados funciona**
- [ ] **Gestión de citas funciona**

### Test 4: PWA y Funcionalidades Móviles
- [ ] **"Instalar App" aparece en móviles**
- [ ] **App se puede instalar como PWA**
- [ ] **Funciona offline básico**
- [ ] **Notificaciones push funcionan**
- [ ] **Responsive design correcto**

### Test 5: Funcionalidades Core
- [ ] **Crear comunicado nuevo**
- [ ] **Subir imágenes a comunicados**
- [ ] **Sistema de comentarios funciona**
- [ ] **Gestion de citas online**
- [ ] **Newsletter system operativo**

### Test 6: SEO y Performance
- [ ] **Sitemap.xml accesible**
- [ ] **robots.txt configurado**
- [ ] **Meta tags en <head>**
- [ ] **Google Search Console verificado**
- [ ] **Velocidad de carga < 3 segundos**

---

## 🚨 CHECKLIST DE ERRORES CRÍTICOS

### Errores que NO deben ocurrir:
- [ ] **Error 500 en página principal**
- [ ] **Pantalla en blanco en cualquier página**
- [ ] **Errores de Supabase (conexión BD)**
- [ ] **CSS no carga (página sin estilos)**
- [ ] **JavaScript no ejecuta**
- [ ] **Login no funciona**
- [ ] **Admin dashboard inaccesible**

### Errores aceptables (Warnings):
- [ ] ⚠️ **PWA no instalable en desktop (normal)**
- [ ] ⚠️ **Algunas imágenes optimizadas lentamente**
- [ ] ⚠️ **Analytics carga después de 1-2 segundos**

---

## 🔧 HERRAMIENTAS DE VERIFICACIÓN

### Comandos Automatizados de Verificación
```bash
#!/bin/bash

# VERIFICACION_COMPLETA.sh
echo "🔍 VERIFICACIÓN COMPLETA POST-DEPLOY"

BASE_URL="https://ugt.towa.cat"

# Test 1: Conectividad
echo "1. Test de conectividad..."
if curl -f -s "$BASE_URL" > /dev/null; then
    echo "✅ Portal accesible"
else
    echo "❌ Portal NO accesible"
fi

# Test 2: PWA
echo "2. Verificando PWA..."
if curl -s "$BASE_URL/manifest.json" | grep -q "Portal UGT-TOWA"; then
    echo "✅ PWA manifest OK"
else
    echo "❌ PWA manifest ERROR"
fi

# Test 3: Service Worker
echo "3. Verificando Service Worker..."
if curl -s "$BASE_URL/sw.js" | grep -q "install"; then
    echo "✅ Service Worker OK"
else
    echo "❌ Service Worker ERROR"
fi

# Test 4: Variables de entorno
echo "4. Verificando variables de entorno..."
if curl -s "$BASE_URL" | grep -q "jpedragosa@towapharmaceutical.com"; then
    echo "✅ Contact email OK"
else
    echo "❌ Contact email ERROR"
fi

if curl -s "$BASE_URL" | grep -q "629931957"; then
    echo "✅ Contact phone OK"
else
    echo "❌ Contact phone ERROR"
fi

# Test 5: Admin panel
echo "5. Verificando admin panel..."
if curl -s "$BASE_URL/admin" | grep -q "Dashboard"; then
    echo "✅ Admin panel OK"
else
    echo "❌ Admin panel ERROR"
fi

echo "🎉 VERIFICACIÓN COMPLETADA"
```

### Usar Herramientas Externas
```bash
# Ping test
ping -c 4 ugt.towa.cat

# SSL verification
openssl s_client -connect ugt.towa.cat:443 -servername ugt.towa.cat

# Performance test (WebPageTest.org)
# URL: https://www.webpagetest.org/
# Test URL: https://ugt.towa.cat

# PWA verification (PWA Builder)
# URL: https://www.pwabuilder.com/
# Test URL: https://ugt.towa.cat
```

---

## 📱 VERIFICACIÓN MÓVIL

### Tests en Dispositivos Reales:
- [ ] **iPhone (Safari)**
- [ ] **Android (Chrome)**
- [ ] **Tablet (iPad/Android)**

### Tests PWA en Móviles:
- [ ] **Banners de instalación aparecen**
- [ ] **Instalación desde navegador funciona**
- [ ] **App instalada abre full screen**
- [ ] **Iconos en home screen correctos**
- [ ] **Funciona offline básico**

---

## 🚀 COMANDOS DE VERIFICACIÓN RÁPIDA

### Test de 30 segundos
```bash
# Un comando para todo:
curl -I https://ugt.towa.cat && echo "✅ PÁGINA PRINCIPAL: OK" || echo "❌ PÁGINA PRINCIPAL: ERROR"
curl -s https://ugt.towa.cat | grep -q "jpedragosa@towapharmaceutical.com" && echo "✅ EMAIL CONTACTO: OK" || echo "❌ EMAIL CONTACTO: ERROR"
curl -s https://ugt.towa.cat | grep -q "629931957" && echo "✅ TELÉFONO: OK" || echo "❌ TELÉFONO: ERROR"
curl -I https://ugt.towa.cat/manifest.json > /dev/null && echo "✅ PWA MANIFEST: OK" || echo "❌ PWA MANIFEST: ERROR"
curl -I https://ugt.towa.cat/admin > /dev/null && echo "✅ ADMIN PANEL: OK" || echo "❌ ADMIN PANEL: ERROR"
```

### Estado Final Esperado:
```
✅ PÁGINA PRINCIPAL: OK
✅ EMAIL CONTACTO: OK
✅ TELÉFONO: OK
✅ PWA MANIFEST: OK
✅ ADMIN PANEL: OK
```

---

## 🎯 CRITERIOS DE ÉXITO

### ✅ DEPLOY EXITOSO SI:
1. **Portal carga en menos de 3 segundos**
2. **Todos los tests automatizados pasan**
3. **PWA se puede instalar en móviles**
4. **Admin dashboard completamente funcional**
5. **Variables de entorno correctas en footer**
6. **No hay errores críticos en consola**

### 🚨 FALLO CRÍTICO SI:
1. **Portal no carga (Error 500/404)**
2. **Base de datos Supabase no conecta**
3. **Admin panel inaccesible**
4. **PWA completamente rota**
5. **Variables de entorno incorrectas**

---

**🎉 CHECKLIST LISTO PARA VERIFICACIÓN COMPLETA**