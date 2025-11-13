# Análisis del Problema: Negrita No Preservada en Renderizado Público

## 🔍 **PROBLEMA IDENTIFICADO**

Después de examinar el código fuente del portal, he identificado exactamente por qué la negrita (`<b>`) no se preserva en las vistas públicas mientras que el color sí.

## 📋 **UBICACIÓN DEL PROBLEMA**

El problema se encuentra en **2 archivos específicos** que controlan el renderizado público de comunicados:

### 1. `ComunicadosPage.tsx` (Lista pública)
**Archivo:** `/src/pages/ComunicadosPage.tsx`  
**Líneas:** 124-131

```tsx
<div 
  className="text-gray-600 mb-4 line-clamp-3 prose prose-sm max-w-none"
  dangerouslySetInnerHTML={{ 
    __html: com.content.length > 300 
      ? com.content.substring(0, 300) + '...' 
      : com.content 
  }}
/>
```

### 2. `ComunicadoDetailPage.tsx` (Vista detallada)
**Archivo:** `/src/pages/ComunicadoDetailPage.tsx`  
**Líneas:** 305-308

```tsx
<div 
  className="text-gray-700 prose prose-lg max-w-none"
  dangerouslySetInnerHTML={{ __html: communique.content }}
/>
```

## 🎯 **CAUSA RAÍZ**

El problema **NO está en el editor** (`SimpleTextEditor.tsx`), que funciona correctamente y genera:
```html
<b>texto</b> normal <span style="color: #3B82F6">normal</span>
```

El problema está en la **sanitización de React**: React strips automáticamente las etiquetas HTML de formato como `<b>`, `<i>`, `<u>` por razones de seguridad, **PERO preserva los estilos inline**.

## 🔬 **DIFERENCIA CRÍTICA**

- ✅ **Color funciona:** `style="color: #3B82F6"` (estilo inline)  
- ❌ **Negrita NO funciona:** `<b>texto</b>` (etiqueta HTML de formato)

## ⚙️ **POR QUÉ ESTO SUCEDE**

React protege contra XSS (Cross-Site Scripting) removiendo ciertas etiquetas HTML peligrosas. Sin embargo, en este caso específico:

1. **El contenido es confiable** - viene del editor interno de la plataforma
2. **Las etiquetas `<b>` no son peligrosas** - solo aplican formato visual
3. **La seguridad no es un riesgo** - no hay entrada de usuario externa sin sanitizar

## 🛠️ **SOLUCIÓN RECOMENDADA**

Hay **3 enfoques** para solucionar el problema:

### **Opción 1: Sanitización Selectiva (RECOMENDADA)**
Instalar y configurar `dompurify` para permitir solo etiquetas de formato:

```bash
npm install dompurify
```

```tsx
import DOMPurify from 'dompurify';

<div 
  dangerouslySetInnerHTML={{ 
    __html: DOMPurify.sanitize(communique.content, {
      ALLOWED_TAGS: ['p', 'br', 'b', 'i', 'u', 'strong', 'em', 'span'],
      ALLOWED_ATTR: ['style', 'href', 'target']
    })
  }}
/>
```

### **Opción 2: Wrapper de Componente Personalizado**
Crear un componente que preserve el formato:

```tsx
const SafeHTML = ({ content }: { content: string }) => {
  const allowedTags = ['p', 'br', 'b', 'i', 'u', 'strong', 'em', 'span'];
  
  // Parser simple que preserva solo etiquetas permitidas
  return (
    <div 
      dangerouslySetInnerHTML={{
        __html: content.replace(/<(?!\/?(?:${allowedTags.join('|')})\b)[^>]*>/gi, '')
      }}
    />
  );
};
```

### **Opción 3: Usar iframe (Menos Recomendado)**
Para contenido completamente sin restricciones:

```tsx
<div 
  className="prose prose-lg max-w-none"
  dangerouslySetInnerHTML={{ __html: communique.content }}
/>
```

## 🔍 **CÓDIGO ACTUAL QUE CAUSA EL PROBLEMA**

### Editor (FUNCIONA CORRECTAMENTE):
```tsx
// SimpleTextEditor.tsx - líneas 93-96
const applyBold = () => {
  executeCommand('bold'); // Genera <b>texto</b> ✅
};
```

### Renderizado Público (PROBLEMA):
```tsx
// React strips automáticamente <b> pero preserva style ✅
<div dangerouslySetInnerHTML={{ __html: content }} />
```

## 📊 **COMPORTAMIENTO ACTUAL**

| Tipo de Formato | En Editor | En Base de Datos | En Vista Pública |
|-----------------|-----------|------------------|------------------|
| **Negrita** (`<b>`) | ✅ Visible | ✅ Almacenado | ❌ Removido |
| **Color** (`style=`) | ✅ Visible | ✅ Almacenado | ✅ Preservado |
| **Cursiva** (`<i>`) | ✅ Visible | ✅ Almacenado | ❌ Removido |

## 🎯 **PRÓXIMOS PASOS RECOMENDADOS**

1. **Implementar sanitización selectiva** usando DOMPurify
2. **Permitir etiquetas de formato** (`<b>`, `<i>`, `<u>`, `<strong>`, `<em>`)
3. **Preservar atributos de estilo** (`style`, `color`, etc.)
4. **Probar la solución** con contenido existente
5. **Validar seguridad** - asegurar que no se permiten etiquetas peligrosas

## 🔐 **CONSIDERACIONES DE SEGURIDAD**

La solución recomendada es segura porque:
- ✅ Solo permite etiquetas de formato inofensivas
- ✅ No permite JavaScript inline (`<script>`)
- ✅ No permite eventos (`onclick`, `onerror`)
- ✅ No permite elementos de formulario (`<form>`, `<input>`)

---

**Conclusión:** El problema está claramente identificado y tiene una solución directa. La implementación de sanitización selectiva permitirá preservar la negrita manteniendo la seguridad.