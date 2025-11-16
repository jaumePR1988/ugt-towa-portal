// Script para limpiar cache PWA del navegador
// Ejecutar en la consola del navegador para eliminar popups persistentes

(function() {
  console.log('🧹 Limpiando cache PWA...');
  
  // Limpiar localStorage
  const keysToRemove = [
    'pwa-install-success',
    'pwa-install-rejected', 
    'pwa-install-dismissed',
    'pwa-install-blocked',
    'pwa-install-attempts',
    'beforeinstallprompt'
  ];
  
  keysToRemove.forEach(key => {
    localStorage.removeItem(key);
    console.log(`❌ Eliminado: ${key}`);
  });
  
  // Limpiar sessionStorage
  sessionStorage.clear();
  console.log('🗑️ SessionStorage limpiado');
  
  // Recargar página
  console.log('🔄 Recargando página...');
  setTimeout(() => {
    window.location.reload();
  }, 500);
  
  console.log('✅ Cache PWA limpiado completamente');
})();