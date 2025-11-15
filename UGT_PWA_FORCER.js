/**
 * 🎯 FORZADOR DE POPUP PWA - UGT TOWA
 * Ejecutar este código en la consola del navegador para mostrar el popup inmediatamente
 */

(function() {
  console.log('🚀 [PWA] Iniciando forzado de popup...');
  
  // 1. Limpiar estado anterior
  localStorage.removeItem('pwa-install-dismissed');
  localStorage.removeItem('pwa-install-dismissed-time');
  
  // 2. Recargar la página para aplicar cambios
  setTimeout(() => {
    location.reload();
  }, 100);
  
})();

/**
 * 🎯 ALTERNATIVA: Forzar popup sin recarga
 * Ejecutar después de que la página haya cargado
 */
function mostrarPopupPWAInmediato() {
  console.log('🎯 [PWA] Mostrando popup inmediatamente...');
  
  // Limpiar estado
  localStorage.removeItem('pwa-install-dismissed');
  localStorage.removeItem('pwa-install-dismissed-time');
  
  // Buscar el componente PWA y forzarlo a aparecer
  setTimeout(() => {
    const eventoPersonalizado = new CustomEvent('forzar-popup-pwa');
    window.dispatchEvent(eventoPersonalizado);
    
    // Buscar elementos del popup y hacerlos visibles
    const popups = document.querySelectorAll('[class*="animate-slide-up"]');
    popups.forEach(popup => {
      popup.style.display = 'block';
      popup.style.opacity = '1';
      popup.style.transform = 'translateY(0)';
      console.log('✅ [PWA] Popup encontrado y forzado:', popup);
    });
    
  }, 500);
}

// Función global para ejecutar después
window.mostrarPopupPWAInmediato = mostrarPopupPWAInmediato;

console.log(`
📱 UGT Towa - PWA Popup Forcer
Comandos disponibles:
1. window.mostrarPopupPWAInmediato()  → Mostrar popup sin recarga
2. Recargar página para aplicar reset automático
`);
