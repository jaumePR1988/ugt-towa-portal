# 📱 Guía para Restablecer el Popup de Instalación PWA

## 🚀 Opciones para que vuelva a aparecer el popup

### 1. **Limpiar Datos del Navegador** (Más Efectivo)
```bash
# Chrome/Edge:
1. Ir a Configuración > Privacidad y seguridad
2. Borrar datos de navegación
3. Seleccionar: "Cookies y otros datos de sitios"
4. Seleccionar: "Imágenes y archivos almacenados en caché"
5. Buscar: "g29h1jllulem.space.minimax.io"
6. Eliminar todos los datos del sitio
```

### 2. **Usar Modo Incógnito/Privado**
```
1. Abrir ventana de incógnito
2. Ir a: https://g29h1jllulem.space.minimax.io
3. El popup debería aparecer (o buscar icono 📱 en barra)
```

### 3. **Instalar Manualmente (Alternativa)**
```bash
# En la URL: https://g29h1jllulem.space.minimax.io
1. Buscar icono de "Instalar" en la barra de direcciones
2. O usar el menú del navegador:
   - Chrome: Menú (⋮) > "Instalar UGT-TOWA..."
   - Edge: Menú (⋯) > "Instalar esta aplicación"
   - Safari: Compartir > "Añadir a pantalla de inicio"
```

### 4. **Desde Chrome DevTools**
```bash
1. F12 (DevTools)
2. Pestaña "Application" o "Aplicación"
3. Storage > Clear storage
4. Borrar: Service Workers, Local Storage, IndexedDB
5. Recargar página
```

### 5. **Forzar PWA Installation Prompt**
```bash
# JavaScript console (F12):
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then(registrations => {
    registrations.forEach(registration => {
      registration.unregister();
    });
  });
}

// Borrar localStorage
localStorage.removeItem('pwaPromptDismissed');
location.reload();
```

## 📊 Estado Técnico del Portal

- **URL Producción**: https://g29h1jllulem.space.minimax.io
- **Tipo**: PWA (Progressive Web App)
- **Funcionalidad**: 100% operativo
- **Service Worker**: ✅ Activo
- **Manifest**: ✅ Configurado
- **Instalación**: ✅ Disponible

## 🔧 Verificación Rápida
```bash
# Ir a: https://g29h1jllulem.space.minimax.io
# Abrir DevTools (F12)
# Console: Escribir:
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.ready.then(reg => {
    console.log('PWA Status: Active');
    console.log('Service Worker:', reg.active ? 'Active' : 'Inactive');
  });
}
```

## ⚡ Resultado Esperado
Una vez ejecutado cualquiera de estos métodos, deberías ver:
- Popup de instalación nativo del navegador
- Icono 📱 en la barra de direcciones
- Opción "Instalar" en el menú del navegador

---
**Nota**: El popup aparece automáticamente cuando el navegador detecta que la app cumple criterios PWA y el usuario tiene la intención de usarla frecuentemente.