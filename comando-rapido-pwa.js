// COMANDO ÚNICO PARA FORZAR INSTALACIÓN PWA
// Copia y pega este comando EN UNA SOLA LÍNEA en la consola del navegador (F12)

localStorage.removeItem('pwa-install-dismissed');localStorage.removeItem('beforeinstallprompt');localStorage.removeItem('pwa-install-shown');localStorage.removeItem('pwa-install-declined');sessionStorage.removeItem('pwa-install-dismissed');window.location.reload();

// ========================================
// COMANDO ALTERNATIVO (MÁS CORTO):
localStorage.clear();sessionStorage.clear();location.reload();

// ========================================
// COMANDO CON VERIFICACIÓN:
console.log('🔧 Limpiando PWA...');localStorage.removeItem('pwa-install-dismissed');localStorage.removeItem('beforeinstallprompt');console.log('✅ Listo, recargando...');setTimeout(()=>location.reload(),500);

// ========================================
// SI QUIERES ABRIR LA URL CON FORZADO DESDE CONSOLA:
window.open('https://9ya0vtpov5ir.space.minimax.io?forcePWA=true', '_blank');

// ========================================
// FUNCIÓN COMPLETA PARA CREAR Y USAR:
function forcePWAPopup() {
    console.log('🚀 Forzando popup PWA...');
    localStorage.removeItem('pwa-install-dismissed');
    localStorage.removeItem('beforeinstallprompt'); 
    localStorage.removeItem('pwa-install-shown');
    localStorage.removeItem('pwa-install-declined');
    sessionStorage.clear();
    console.log('✅ Estados limpiados, recargando...');
    setTimeout(()=>location.reload(), 1000);
}
// Uso: forcePWAPopup()