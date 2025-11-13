# Guía de Usuario: Editor de Texto Enriquecido
## Portal Sindical UGT-TOWA

**Versión:** 1.0  
**Fecha:** 14 de noviembre de 2025  
**Autor:** MiniMax Agent

---

## Introducción

El Portal Sindical UGT-TOWA ahora cuenta con un editor de texto enriquecido profesional (TinyMCE) que permite crear comunicados con formato HTML avanzado, incluyendo negritas, cursivas, colores, listas, tablas, imágenes y mucho más.

---

## Acceso al Editor

### Requisitos
- Ser usuario administrador del portal
- Iniciar sesión con credenciales válidas
- Navegar a **Panel Admin > Comunicados**

### Pasos de Acceso
1. Ingresa a https://udkr7eh0l5ak.space.minimax.io/login
2. Introduce tus credenciales de administrador
3. Navega a `/admin/comunicados`
4. Haz clic en el botón **"Nuevo"**

---

## Interfaz del Editor

### Descripción General
El editor TinyMCE reemplaza el cuadro de texto simple anterior y ofrece una barra de herramientas (toolbar) completa con múltiples funciones de formato.

### Barra de Herramientas (Toolbar)

La barra de herramientas está organizada en grupos funcionales:

#### 1. Historial
- **Deshacer** (Ctrl+Z): Revierte la última acción
- **Rehacer** (Ctrl+Y): Restaura la acción deshecha

#### 2. Formato de Texto
- **Párrafo/Encabezados**: Selecciona el tipo de formato (Párrafo, Título 1, Título 2, Título 3, Título 4)
- **Negrita** (Ctrl+B): Aplica texto en negrita
- **Cursiva** (Ctrl+I): Aplica texto en cursiva
- **Subrayado** (Ctrl+U): Subraya el texto
- **Tachado**: Tacha el texto

#### 3. Colores
- **Color de texto**: Cambia el color del texto
- **Color de fondo**: Aplica color de fondo al texto

**Paleta de colores personalizada UGT:**
- Rojo UGT (#DC2626)
- Rojo Oscuro (#991B1B)
- Negro, Gris Oscuro, Gris, Gris Claro
- Blanco, Azul, Verde, Naranja, Morado

#### 4. Alineación
- **Alinear izquierda**: Alinea el texto a la izquierda
- **Centrar**: Centra el texto
- **Alinear derecha**: Alinea el texto a la derecha
- **Justificar**: Justifica el texto

#### 5. Listas
- **Lista numerada**: Crea lista ordenada (1, 2, 3...)
- **Lista con viñetas**: Crea lista no ordenada (•)
- **Reducir sangría**: Mueve el elemento hacia la izquierda
- **Aumentar sangría**: Mueve el elemento hacia la derecha

#### 6. Insertar Elementos
- **Enlace**: Inserta un hipervínculo
- **Imagen**: Inserta una imagen (URL o subida)
- **Tabla**: Inserta tabla configurable
- **Media**: Inserta contenido multimedia

#### 7. Herramientas Avanzadas
- **Eliminar formato**: Quita todo el formato del texto seleccionado
- **Código fuente**: Muestra/edita el código HTML directamente
- **Pantalla completa**: Expande el editor a pantalla completa
- **Ayuda**: Muestra la ayuda del editor

---

## Atajos de Teclado

### Formato Básico
- **Ctrl+B**: Negrita
- **Ctrl+I**: Cursiva
- **Ctrl+U**: Subrayado
- **Ctrl+Z**: Deshacer
- **Ctrl+Y**: Rehacer

### Formato Avanzado
- **Ctrl+Shift+7**: Lista numerada
- **Ctrl+Shift+8**: Lista con viñetas
- **Ctrl+K**: Insertar enlace
- **Ctrl+]**: Aumentar sangría
- **Ctrl+[**: Reducir sangría

---

## Casos de Uso Comunes

### 1. Crear Comunicado con Formato Simple

**Objetivo:** Crear un comunicado con texto en negrita y cursiva

**Pasos:**
1. Escribe el título del comunicado
2. Selecciona la categoría
3. En el editor, escribe el contenido
4. Selecciona el texto que quieres resaltar
5. Haz clic en el botón **Negrita** (B) o presiona Ctrl+B
6. Para cursiva, haz clic en el botón **Cursiva** (I) o presiona Ctrl+I
7. Haz clic en **Publicar**

### 2. Crear Lista de Puntos

**Objetivo:** Crear una lista con viñetas para enumerar puntos importantes

**Pasos:**
1. Coloca el cursor donde quieres la lista
2. Haz clic en el botón **Lista con viñetas**
3. Escribe el primer elemento y presiona Enter
4. Escribe el segundo elemento y presiona Enter
5. Continúa hasta completar la lista
6. Presiona Enter dos veces para salir de la lista

### 3. Aplicar Colores al Texto

**Objetivo:** Destacar texto importante con color rojo UGT

**Pasos:**
1. Selecciona el texto que quieres colorear
2. Haz clic en el botón **Color de texto** (ícono A con color)
3. Selecciona "Rojo UGT" de la paleta personalizada
4. El texto ahora aparecerá en rojo

### 4. Insertar Enlace

**Objetivo:** Agregar un enlace a una página web externa

**Pasos:**
1. Selecciona el texto que será el enlace
2. Haz clic en el botón **Enlace** (ícono de cadena) o presiona Ctrl+K
3. Introduce la URL en el campo "URL"
4. Selecciona "Nueva ventana" si quieres que se abra en pestaña nueva
5. Haz clic en **Guardar**

### 5. Insertar Tabla

**Objetivo:** Crear una tabla para mostrar datos organizados

**Pasos:**
1. Coloca el cursor donde quieres la tabla
2. Haz clic en el botón **Tabla**
3. Selecciona el número de filas y columnas
4. Haz clic para insertar
5. Completa las celdas con tu contenido

### 6. Pegar Contenido desde Word

**Objetivo:** Copiar contenido de un documento Word manteniendo el formato

**Pasos:**
1. Copia el contenido desde Word (Ctrl+C)
2. Haz clic en el editor TinyMCE
3. Pega el contenido (Ctrl+V)
4. El editor automáticamente convertirá el formato de Word a HTML
5. Revisa y ajusta si es necesario

---

## Características de Seguridad

### Sanitización HTML (DOMPurify)

El editor implementa sanitización automática de HTML para prevenir ataques XSS (Cross-Site Scripting). Esto significa que:

- **Etiquetas permitidas:** Solo se permiten etiquetas HTML seguras como `<p>`, `<strong>`, `<em>`, `<ul>`, `<ol>`, `<li>`, `<h1>`-`<h6>`, `<a>`, `<img>`, `<table>`, etc.
- **Etiquetas bloqueadas:** Scripts (`<script>`), iframes maliciosos y otras etiquetas peligrosas son automáticamente eliminadas
- **Atributos seguros:** Solo se permiten atributos seguros como `href`, `src`, `alt`, `style` con valores validados

### Ejemplos de Sanitización

**Entrada peligrosa:**
```html
<script>alert('Hacked!')</script>
<p>Contenido seguro</p>
```

**Salida sanitizada:**
```html
<p>Contenido seguro</p>
```

El script malicioso es eliminado automáticamente.

---

## Compatibilidad con Contenido Existente

### Comunicados Antiguos (Texto Plano)

Los comunicados creados antes de la implementación del editor HTML se mantienen completamente funcionales y se muestran correctamente en la vista pública.

**Comportamiento:**
- Los comunicados antiguos no contienen HTML
- Se muestran como texto plano preservando saltos de línea
- No es necesario editar o actualizar comunicados antiguos
- Pueden ser editados en el futuro usando el nuevo editor

---

## Solución de Problemas

### El Editor No Carga

**Posibles causas:**
- Conexión a internet lenta
- Extensión de navegador bloqueando TinyMCE

**Soluciones:**
- Actualiza la página (F5)
- Desactiva temporalmente extensiones de bloqueo de scripts
- Prueba en otro navegador (Chrome, Firefox, Edge)

### El Formato No Se Guarda

**Posibles causas:**
- JavaScript deshabilitado
- Error en el guardado

**Soluciones:**
- Verifica que JavaScript esté habilitado en tu navegador
- Revisa la consola del navegador (F12) para errores
- Intenta guardar de nuevo

### El HTML No Se Renderiza Correctamente

**Posibles causas:**
- HTML no permitido por seguridad
- CSS conflictivo

**Soluciones:**
- Usa solo las funciones del toolbar (no pegues HTML directamente del código fuente)
- Evita usar CSS inline complejo
- Contacta al administrador del sistema si el problema persiste

---

## Buenas Prácticas

### Recomendaciones de Uso

1. **Usa encabezados para organizar:** Utiliza Título 1, Título 2, Título 3 para estructurar el contenido
2. **No abuses del color:** Usa colores solo para destacar información importante
3. **Listas para enumeraciones:** Usa listas numeradas o con viñetas para enumerar puntos
4. **Enlaces descriptivos:** El texto del enlace debe describir el destino (evita "Haz clic aquí")
5. **Tablas para datos:** Usa tablas solo para datos tabulares, no para layout
6. **Prueba antes de publicar:** Revisa el formato en la vista previa antes de publicar

### Errores a Evitar

1. **No uses colores que dificulten la lectura:** Evita texto amarillo sobre blanco
2. **No uses múltiples formatos juntos:** Evita texto en negrita + cursiva + subrayado + color
3. **No uses MAYÚSCULAS EN EXCESO:** Dificulta la lectura
4. **No uses tamaño de fuente muy grande:** Mantén coherencia visual
5. **No copies HTML directamente:** Usa las funciones del toolbar

---

## Preguntas Frecuentes (FAQ)

### ¿Puedo subir imágenes directamente al editor?

Actualmente, el editor soporta inserción de imágenes mediante URL. Para subir imágenes al servidor, usa la función "Imagen destacada" del formulario de comunicados.

### ¿El editor funciona en móvil?

Sí, el editor TinyMCE es responsive y funciona en dispositivos móviles. La barra de herramientas se adapta al tamaño de pantalla.

### ¿Puedo editar el código HTML directamente?

Sí, haz clic en el botón "Código fuente" (</>) en la barra de herramientas para ver y editar el HTML directamente. Sin embargo, se recomienda usar las funciones del toolbar.

### ¿Los comunicados antiguos seguirán funcionando?

Sí, los comunicados creados antes del editor HTML se mantienen completamente funcionales y se muestran correctamente.

### ¿Puedo usar tablas complejas?

Sí, el editor soporta tablas con múltiples filas y columnas. Usa el botón "Tabla" para insertar y configurar tablas.

### ¿Cómo puedo cambiar el tamaño de la fuente?

Actualmente, el editor usa tamaños predefinidos según el tipo de formato (Párrafo, Título 1, etc.). Para tamaños personalizados, usa el botón "Código fuente" y edita el CSS inline.

---

## Soporte Técnico

### Contacto

Si experimentas problemas con el editor o necesitas ayuda adicional:

- **Email:** jpedragosa@towapharmaceutical.com
- **Ubicación:** Polígono Industrial, Carrer de Sant Martí, 75-97, 08107 Martorelles, Barcelona

### Recursos Adicionales

- **Documentación TinyMCE:** https://www.tiny.cloud/docs/
- **Guía de accesibilidad:** Usa el botón "Ayuda" del editor
- **Reporte de bugs:** Contacta al administrador del sistema

---

## Actualizaciones y Mejoras Futuras

### Funcionalidades Planificadas

- Vista previa en tiempo real antes de publicar
- Auto-guardado automático cada 30 segundos
- Plantillas pre-diseñadas para comunicados comunes
- Contador de palabras y caracteres visible
- Exportación a PDF/Word directamente desde el editor

---

## Conclusión

El editor de texto enriquecido TinyMCE proporciona una herramienta profesional y poderosa para crear comunicados atractivos y bien formateados en el Portal Sindical UGT-TOWA. 

Experimenta con las diferentes funcionalidades, pero recuerda siempre:
- **Menos es más:** No abuses del formato
- **Claridad primero:** El contenido debe ser fácil de leer
- **Prueba antes de publicar:** Verifica que todo se vea correctamente

---

*Documento generado por: MiniMax Agent*  
*Fecha de creación: 14 de noviembre de 2025*  
*Versión: 1.0*
