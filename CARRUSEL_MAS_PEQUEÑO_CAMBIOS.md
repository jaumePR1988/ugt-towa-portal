# Carrusel Más Pequeño - Cambios Realizados

## Modificación Solicitada
El usuario solicitó hacer el carrusel de eventos en la página principal un poco más pequeño.

## Cambios Implementados

### Archivo Modificado
- **Archivo:** `src/components/EventCarousel.tsx`
- **Línea modificada:** 98

### Antes:
```tsx
<div className="aspect-[16/9] bg-gray-200 dark:bg-gray-700">
```

### Después:
```tsx
<div className="aspect-[16/10] bg-gray-200 dark:bg-gray-700 max-h-[350px]">
```

## Explicación de los Cambios

1. **Cambio de proporción:** `aspect-[16/9]` → `aspect-[16/10]`
   - Reduce la altura del carrusel manteniendo las proporciones
   - Proporción 16:10 es más cuadrada que 16:9

2. **Altura máxima:** `max-h-[350px]`
   - Limita la altura máxima del carrusel
   - Previene que se vea demasiado grande en pantallas grandes

## Resultado
- Carrusel más compacto y proporcionado
- Mejor uso del espacio en la página principal
- Mantiene toda la funcionalidad (navegación, indicadores, redirección a galería)

## Archivos Generados
- **ZIP:** `UGT_TOWA_CARRUSEL_MAS_PEQUEÑO.zip`
- **Documentación:** `CARRUSEL_MAS_PEQUEÑO_CAMBIOS.md`

---
*Cambio realizado el 20 de noviembre de 2025*
