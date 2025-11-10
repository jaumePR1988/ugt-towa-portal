# 🚀 GUÍA PASO A PASO: Indexar UGT Towa en Google

## PARTE 1: Configuración Técnica (YA HECHO ✅)

### ✅ Archivos Creados:
1. **`/public/robots.txt`** - Permite a Google rastrear tu sitio
2. **`/public/sitemap.xml`** - Mapa de todas tus páginas para Google  
3. **`index-optimized.html`** - Versión optimizada con meta tags SEO
4. **`generate-sitemap.js`** - Script para actualizar sitemap automáticamente

## PARTE 2: Google Search Console (OBLIGATORIO)

### Paso 1: Acceder a Google Search Console
1. Ve a: **https://search.google.com/search-console**
2. Inicia sesión con tu cuenta de Google (Gmail)

### Paso 2: Agregar tu Sitio
1. Click en **"+ AGREGAR PROPIEDAD"**
2. Selecciona **"Prefijo de URL"**
3. Introduce: `https://ugt.towa.cat`
4. Click **"CONTINUAR"**

### Paso 3: Verificar Propiedad (ELIGE UNA OPCIÓN)

#### Opción A: Archivo HTML (MÁS FÁCIL)
1. Descarga el archivo de verificación que te dé Google
2. Súbelo a: `/public/` en tu servidor
3. Click **"VERIFICAR"** en Google Search Console

#### Opción B: Meta Tag (SI PUEDES EDITAR HTML)
1. Google te dará un `<meta>` tag
2. Añádelo al `<head>` de tu página principal
3. Click **"VERIFICAR"**

#### Opción C: Google Analytics (SI YA LO TIENES)
1. Si ya tienes Google Analytics configurado
2. Selecciona esta opción
3. Click **"VERIFICAR"**

### Paso 4: Enviar Sitemap
1. En el panel de Search Console, ve a **"Sitemaps"**
2. Click **"+ AGREGAR SITEMAP"**
3. Introduce: `sitemap.xml`
4. Click **"ENVIAR"**

## PARTE 3: Optimización del Contenido

### 3.1 Actualizar index.html Principal
Reemplaza tu `index.html` actual con el contenido de `index-optimized.html` que creé

### 3.2 Configurar Google Analytics (RECOMENDADO)
1. Ve a: **https://analytics.google.com/**
2. Crea una cuenta para tu sitio
3. Obtén tu ID (ej: `G-XXXXXXXXXX`)
4. Reemplaza `G-XXXXXXXXXX` en el archivo HTML

## PARTE 4: Mejorar el SEO del Contenido

### 4.1 Estructura de Encabezados
En tu React app, asegúrate de que cada página tenga:
- **1 solo `<h1>`** (título principal)
- **H2, H3** para subtítulos
- **NO múltiples H1**

### 4.2 Contenido Optimizado
Cada página debe tener:
- **Título único** (60 caracteres máx)
- **Meta descripción** (150-160 caracteres)
- **Contenido relevante** (mínimo 300 palabras)
- **Imágenes con `alt` text**

### 4.3 Optimizar Velocidad
- Comprimir imágenes
- Usar lazy loading
- Minificar CSS/JS
- Usar CDN

## PARTE 5: Verificación y Monitoreo

### 5.1 Revisar en Search Console
- **"Rendimiento"** - Ver posiciones en Google
- **"Cobertura"** - Ver qué páginas están indexadas  
- **"Sitemaps"** - Estado del sitemap
- **"Core Web Vitals"** - Velocidad y experiencia

### 5.2 Herramientas de Verificación
- **Google PageSpeed Insights**: https://pagespeed.web.dev/
- **Google Mobile-Friendly Test**: https://search.google.com/test/mobile-friendly
- **Structured Data Testing**: https://search.google.com/structured-data/testing-tool

## PARTE 6: Tareas Adicionales

### 6.1 Presencia en Directorios
Registra tu sitio en:
- Google My Business (si tienes oficina física)
- Directorios de sindicatos
- Páginas amarillas/directorios locales

### 6.2 Enlaces Entrantes
- Contacta a sitios relacionados con UGT
- Comparte en redes sociales oficiales
- Participa en foros laborales

### 6.3 Mantenimiento Regular
- Actualiza el sitemap mensualmente
- Revisa Search Console semanalmente
- Añade nuevo contenido regularmente

## ⏱️ TIEMPO ESTIMADO POR PASO

| Paso | Tiempo | Dificultad |
|------|--------|------------|
| 1-3. Google Search Console | 15 min | ⭐ Fácil |
| 4. Optimizar HTML | 10 min | ⭐ Fácil |
| 5. Verificación | 5 min | ⭐ Fácil |
| 6. Contenido SEO | 30 min | ⭐⭐ Medio |
| **TOTAL** | **~1 hora** | |

## 🎯 RESULTADO ESPERADO

- ✅ **24-48h**: Sitio indexado en Google
- ✅ **1 semana**: Apareces en búsquedas relacionadas
- ✅ **1 mes**: Posiciones mejoradas en resultados
- ✅ **3 meses**: Tráfico orgánico constante

## 🆘 SI TIENES PROBLEMAS

### El sitio no se indexa:
1. Verifica que el robots.txt permite indexación
2. Revisa que no hay errores en Search Console
3. Asegúrate de que la página carga correctamente

### Posiciones bajas:
1. Mejora la calidad del contenido
2. Añade más páginas relevantes
3. Optimiza para palabras clave específicas

### Errores técnicos:
1. Revisa la consola del navegador (F12)
2. Verifica que todos los archivos se cargan
3. Comprueba la configuración de Supabase

---

**¿Necesitas ayuda con algún paso específico?** ¡Dime qué parte quieres que configuremos juntos!