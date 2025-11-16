// SCRIPT PARA FORZAR INSTALACIÓN PWA UGT TOWA
// Ejecutar en la consola del navegador (F12 > Console)

console.log("🚀 FORZANDO INSTALACIÓN PWA UGT TOWA...");

// Función principal para forzar popup de instalación
function forcePWAPopup() {
    console.log("🧹 Limpiando estados previos...");
    
    // Limpiar localStorage
    localStorage.removeItem('pwa-install-dismissed');
    localStorage.removeItem('beforeinstallprompt');
    localStorage.removeItem('pwa-install-shown');
    localStorage.removeItem('pwa-install-declined');
    
    // Limpiar sessionStorage
    sessionStorage.removeItem('pwa-install-dismissed');
    sessionStorage.removeItem('pwa-install-attempts');
    
    console.log("✅ Estados limpiados");
    
    // Esperar un momento y recargar
    setTimeout(() => {
        console.log("🔄 Recargando página...");
        window.location.reload();
    }, 1000);
}

// Función avanzada con múltiples intentos
function forcePWAPopupAdvanced() {
    console.log("🔥 MODO AVANZADO - Forzando instalación PWA...");
    
    // Limpiar TODOS los posibles estados
    const storageKeys = [
        'pwa-install-dismissed', 'beforeinstallprompt', 'pwa-install-shown',
        'pwa-install-declined', 'ugt-pwa-install-status', 'pwa-install-attempts',
        'install-prompt-dismissed', 'pwa-declined', 'install-shown'
    ];
    
    storageKeys.forEach(key => {
        localStorage.removeItem(key);
        sessionStorage.removeItem(key);
    });
    
    // Limpiar también las claves que empiezan con "pwa"
    Object.keys(localStorage).forEach(key => {
        if (key.toLowerCase().includes('pwa') || key.toLowerCase().includes('install')) {
            localStorage.removeItem(key);
        }
    });
    
    // Disparar eventos personalizados
    console.log("📢 Disparando eventos de instalación...");
    window.dispatchEvent(new CustomEvent('force-pwa-install'));
    
    // Buscar y activar el componente PWA si existe
    setTimeout(() => {
        // Buscar elementos relacionados con PWA
        const pwaElements = document.querySelectorAll('[data-pwa], .pwa-install, #pwa-install, .install-prompt');
        pwaElements.forEach(el => {
            console.log("🎯 Encontrado elemento PWA:", el);
            el.click();
        });
        
        // Disparar evento de instalación manual
        const installEvent = new Event('beforeinstallprompt', { bubbles: true, cancelable: true });
        window.dispatchEvent(installEvent);
        
        console.log("✅ Procesos ejecutados");
        window.location.reload();
    }, 500);
}

// Función para verificar estado PWA
function checkPWAStatus() {
    console.log("📊 VERIFICANDO ESTADO PWA...");
    
    const status = {
        isStandalone: window.matchMedia('(display-mode: standalone)').matches,
        localStorage: {
            'pwa-install-dismissed': localStorage.getItem('pwa-install-dismissed'),
            'beforeinstallprompt': localStorage.getItem('beforeinstallprompt'),
            'pwa-install-shown': localStorage.getItem('pwa-install-shown')
        },
        userAgent: navigator.userAgent,
        pwaSupported: 'serviceWorker' in navigator && 'PushManager' in window
    };
    
    console.table(status);
    return status;
}

// Función para abrir URL con forzado
function openWithForce() {
    console.log("🔗 Abriendo URL con parámetros de forzado...");
    window.open('https://9ya0vtpov5ir.space.minimax.io?forcePWA=true&t=' + Date.now(), '_blank');
}

// Mostrar menú de opciones
function showPWAMenu() {
    console.log(`
    🎯 MENÚ PWA UGT TOWA
    ====================
    
    📋 OPCIONES DISPONIBLES:
    
    1️⃣  forcePWAPopup()
     → Limpia estados y recarga (MÉTODO BÁSICO)
     
    2️⃣  forcePWAPopupAdvanced()
     → Limpia TODOS los estados y dispara eventos (MÉTODO AVANZADO)
     
    3️⃣  checkPWAStatus()
     → Muestra el estado actual de la PWA
     
    4️⃣  openWithForce()
     → Abre la página con parámetros de forzado
     
    5️⃣  showPWAMenu()
     → Muestra este menú de nuevo
     
    🚀 RECOMENDACIÓN: Ejecuta forcePWAPopupAdvanced()
    `);
}

// Función automática que ejecuta todo
function fixPWAInstall() {
    console.log("🚀 EJECUTANDO SOLUCIÓN COMPLETA PWA...");
    
    // Paso 1: Limpiar estados
    console.log("Paso 1: Limpiando estados...");
    forcePWAPopupAdvanced();
}

// Mostrar instrucciones
console.log(`
🚨 PROBLEMA: Popup PWA rechazado
✅ SOLUCIÓN: Ejecuta uno de estos comandos:

📋 COMANDOS DISPONIBLES:

🔧 BÁSICO:
   forcePWAPopup()

🔥 AVANZADO (RECOMENDADO):
   forcePWAPopupAdvanced()

📊 VERIFICAR ESTADO:
   checkPWAStatus()

🔗 ABRIR CON FUERZA:
   openWithForce()

📋 VER MENÚ:
   showPWAMenu()

🎯 SOLUCIÓN COMPLETA:
   fixPWAInstall()

💡 TIP: Copia y pega el comando en la consola (F12)
`);

// Ejecutar automáticamente el menú
showPWAMenu();