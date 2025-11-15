# 🎯 FORZAR POPUP PWA - UGT TOWA

## 📋 MÉTODO MÁS RÁPIDO (30 segundos)

### 🔥 **Opción 1: Script directo en consola**

1. **Abre tu sitio**: https://9ya0vtpov5ir.space.minimax.io
2. **Presiona F12** (abre las herramientas del navegador)
3. **Ve a la pestaña "Console"**
4. **Copia y pega** este código completo:

```javascript
// 🧹 LIMPIAR ESTADO
localStorage.removeItem('pwa-install-dismissed');
localStorage.removeItem('pwa-install-dismissed-time');

// 🎯 FORZAR POPUP
setTimeout(() => {
    const popups = document.querySelectorAll('[class*="fixed"], [class*="z-50"]');
    popups.forEach(el => {
        if (el.innerHTML.includes('UGT') || el.innerHTML.includes('Instalar')) {
            el.style.display = 'block';
            el.style.opacity = '1';
            el.style.zIndex = '9999';
            console.log('✅ Popup forzado:', el);
        }
    });
    
    if (popups.length === 0) location.reload();
}, 2000);
```

5. **Presiona Enter**
6. **El popup aparecerá en 2 segundos** 🎉

---

## 📱 **Opción 2: Página de demostración completa**

1. **Abre el archivo**: `UGT_PWA_POPUP_DEMO.html`
2. **Cópialo a tu servidor** o ábrelo localmente
3. **El popup aparece automáticamente** en 3 segundos
4. **Usa los botones** para controlar el popup

---

## 🔧 **Opción 3: Reset completo del navegador**

Si nada funciona, resetea completamente:

```javascript
// 🔄 RESET COMPLETO
localStorage.removeItem('pwa-install-dismissed');
localStorage.removeItem('pwa-install-dismissed-time');
localStorage.clear(); // ⚠️ Limpia TODOS los datos del sitio
location.reload();
```

---

## 🛠️ **Si el popup no aparece:**

### **Verificar estado actual:**
```javascript
// 📊 VER ESTADO
console.log('Estado PWA:', {
    dismissed: localStorage.getItem('pwa-install-dismissed'),
    timestamp: localStorage.getItem('pwa-install-dismissed-time'),
    standalone: window.matchMedia('(display-mode: standalone)').matches
});
```

### **Forzar Service Worker:**
```javascript
// 🔄 FORZAR SW
navigator.serviceWorker.getRegistrations().then(registrations => {
    registrations.forEach(reg => reg.unregister());
});
location.reload();
```

### **Comando de emergencia:**
```javascript
// 🚨 EMERGENCIA - Forzar todo
Object.keys(localStorage).forEach(key => {
    if (key.includes('pwa') || key.includes('install')) {
        localStorage.removeItem(key);
    }
});
location.reload();
```

---

## 📱 **Para dispositivos móviles:**

### **Android Chrome:**
1. Abre el sitio web
2. Presiona el menú (⋮)
3. Selecciona "Agregar a pantalla de inicio"
4. Si no aparece, usa el script en la consola del navegador

### **iOS Safari:**
1. Abre el sitio web
2. Presiona el botón compartir (⬆️)
3. Selecciona "Agregar a pantalla de inicio"

---

## 🎯 **Resultado esperado:**

Cuando funcione correctamente verás:

```
🎯 UGT Towa
Instalar aplicación
[Icono UGT]
Descripción: "Instala la aplicación en tu dispositivo..."
• Acceso instantáneo desde la pantalla de inicio
• Funciona sin conexión a internet
• Notificaciones push de comunicados urgentes

[📱 Instalar ahora] [Ahora no]
```

---

## 🔧 **Personalizar tiempo:**

Para que aparezca más rápido, cambia en el código:
```javascript
setTimeout(() => {
    // tu código aquí
}, 500); // Cambiar 500 por los milisegundos deseados
```

---

## 📞 **Si necesitas ayuda:**

1. **Abre la consola** (F12)
2. **Ejecuta el comando de verificación:**
   ```javascript
   console.log('Estado actual:', localStorage);
   ```
3. **Envíame una captura** de lo que aparece en la consola

---

**✨ Consejo:** El popup está diseñado para aparecer después de 2 segundos en la nueva versión. Si no aparece, es probable que el localStorage tenga datos que lo bloqueen. ¡Usa el script para limpiarlo!
