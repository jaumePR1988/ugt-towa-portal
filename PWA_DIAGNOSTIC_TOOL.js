/**
 * HERRAMIENTA DE DIAGNÓSTICO PWA
 * 
 * Este script se puede ejecutar en la consola del navegador para diagnosticar problemas
 * con la instalación PWA y el botón de instalación.
 * 
 * USO:
 * 1. Abre la consola del navegador (F12)
 * 2. Copia y pega este código
 * 3. Ejecuta: window.runPWADiagnostic()
 */

(function() {
  'use strict';
  
  console.log('%c🔍 HERRAMIENTA DE DIAGNÓSTICO PWA UGT-TOWA', 'color: #e50000; font-size: 16px; font-weight: bold;');
  
  // Función principal de diagnóstico
  window.runPWADiagnostic = async function() {
    console.log('\n📋 INICIANDO DIAGNÓSTICO PWA...\n');
    
    // 1. Verificar manifest.json
    console.log('1️⃣ VERIFICANDO MANIFEST.JSON...');
    try {
      const manifest = await fetch('/manifest.json');
      if (manifest.ok) {
        const manifestData = await manifest.json();
        console.log('✅ Manifest.json cargado correctamente:', manifestData);
        console.log('   - Nombre:', manifestData.name);
        console.log('   - Short name:', manifestData.short_name);
        console.log('   - Display:', manifestData.display);
        console.log('   - Theme color:', manifestData.theme_color);
      } else {
        console.log('❌ Error cargando manifest.json:', manifest.status);
      }
    } catch (error) {
      console.log('❌ Error cargando manifest.json:', error);
    }
    
    // 2. Verificar Service Worker
    console.log('\n2️⃣ VERIFICANDO SERVICE WORKER...');
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.getRegistration();
        if (registration) {
          console.log('✅ Service Worker registrado:', registration.scope);
          console.log('   - Estado:', registration.active ? 'Activo' : 'Inactivo');
        } else {
          console.log('⚠️ Service Worker no encontrado');
        }
      } catch (error) {
        console.log('❌ Error verificando Service Worker:', error);
      }
    } else {
      console.log('❌ Service Worker no soportado en este navegador');
    }
    
    // 3. Verificar soporte PWA
    console.log('\n3️⃣ VERIFICANDO SOPORTE PWA...');
    const isPWASupported = 'serviceWorker' in navigator && 'beforeinstallprompt' in window;
    console.log('Soporte PWA:', isPWASupported ? '✅ SÍ' : '❌ NO');
    
    // 4. Verificar estado de instalación
    console.log('\n4️⃣ VERIFICANDO ESTADO DE INSTALACIÓN...');
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    const installSuccess = localStorage.getItem('pwa-install-success') === 'true';
    const installBlocked = localStorage.getItem('pwa-install-blocked') === 'true';
    const installRejected = localStorage.getItem('pwa-install-rejected') === 'true';
    const installDismissed = localStorage.getItem('pwa-install-dismissed') === 'true';
    const installAttempts = localStorage.getItem('pwa-install-attempts');
    
    console.log('Estado actual:', {
      'Modo standalone': isStandalone ? '✅ SÍ' : '❌ NO',
      'Instalado (localStorage)': installSuccess ? '✅ SÍ' : '❌ NO',
      'Bloqueado': installBlocked ? '❌ SÍ' : '✅ NO',
      'Rechazado': installRejected ? '❌ SÍ' : '✅ NO',
      'Descartado': installDismissed ? '⚠️ SÍ' : '✅ NO',
      'Intentos': installAttempts || '0'
    });
    
    // 5. Verificar eventos PWA
    console.log('\n5️⃣ VERIFICANDO EVENTOS PWA...');
    console.log('Evento beforeinstallprompt disponible:', 'beforeinstallprompt' in window ? '✅ SÍ' : '❌ NO');
    
    // 6. Limpiar datos PWA (solo para debug)
    console.log('\n6️⃣ OPCIONES DE DEBUG...');
    console.log('Para limpiar datos PWA, ejecuta: window.clearPWAData()');
    console.log('Para forzar reinicio PWA, ejecuta: window.forcePWAReset()');
    console.log('Para probar instalación manual, ejecuta: window.testManualInstall()');
    
    // 7. Verificar iconos
    console.log('\n7️⃣ VERIFICANDO ICONOS PWA...');
    const iconSizes = [96, 144, 192, 512];
    for (const size of iconSizes) {
      const img = new Image();
      img.onload = () => console.log(`✅ Icono ${size}x${size} encontrado`);
      img.onerror = () => console.log(`❌ Icono ${size}x${size} NO encontrado`);
      img.src = `/ugt-towa-icon-${size}.png`;
    }
    
    console.log('\n🏁 DIAGNÓSTICO COMPLETADO');
    console.log('Si encuentras errores, revisa la consola del navegador\n');
  };
  
  // Función para limpiar datos PWA
  window.clearPWAData = function() {
    console.log('🧹 Limpiando datos PWA...');
    const keys = [
      'pwa-install-success',
      'pwa-install-rejected', 
      'pwa-install-dismissed',
      'pwa-install-blocked',
      'pwa-install-attempts'
    ];
    
    keys.forEach(key => {
      localStorage.removeItem(key);
      console.log(`✅ Limpiado: ${key}`);
    });
    
    sessionStorage.clear();
    console.log('✅ Datos PWA limpiados. Refresca la página.');
  };
  
  // Función para forzar reinicio PWA
  window.forcePWAReset = function() {
    console.log('🔄 Forzando reinicio PWA...');
    window.clearPWAData();
    
    // Disparar evento manual
    setTimeout(() => {
      window.dispatchEvent(new Event('beforeinstallprompt'));
      console.log('✅ Evento beforeinstallprompt disparado manualmente');
    }, 1000);
  };
  
  // Función para probar instalación manual
  window.testManualInstall = function() {
    console.log('🧪 Probando instalación manual...');
    const url = new URL(window.location.href);
    url.searchParams.set('forcePWA', 'true');
    url.searchParams.set('t', Date.now().toString());
    url.searchParams.set('debug', 'true');
    
    console.log('Abriendo nueva ventana con parámetros PWA:', url.toString());
    window.open(url.toString(), '_blank');
    
    setTimeout(() => {
      alert('Se ha abierto una nueva ventana. Revisa la consola para más detalles.');
    }, 1000);
  };
  
  // Auto-ejecutar diagnóstico básico al cargar
  setTimeout(() => {
    if (window.location.search.includes('debugPWA=true')) {
      window.runPWADiagnostic();
    }
  }, 1000);
  
})();

/**
 * AUTO-DETECCIÓN DE PROBLEMAS COMUNES
 */
(function() {
  'use strict';
  
  // Detectar problemas automáticamente
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', detectPWAProblems);
  } else {
    detectPWAProblems();
  }
  
  function detectPWAProblems() {
    console.log('\n🔍 DETECCIÓN AUTOMÁTICA DE PROBLEMAS PWA...\n');
    
    // Problema 1: Manifest no encontrado
    if (!document.querySelector('link[rel="manifest"]')) {
      console.log('❌ PROBLEMA: Manifest no encontrado en el HTML');
      console.log('   Solución: Agregar <link rel="manifest" href="/manifest.json"> al <head>');
    } else {
      console.log('✅ Manifest referenciado correctamente');
    }
    
    // Problema 2: Theme color no configurado
    if (!document.querySelector('meta[name="theme-color"]')) {
      console.log('❌ PROBLEMA: Theme color no configurado');
      console.log('   Solución: Agregar <meta name="theme-color" content="#e50000">');
    } else {
      console.log('✅ Theme color configurado');
    }
    
    // Problema 3: Service Worker no registrado
    if (!navigator.serviceWorker) {
      console.log('⚠️ ADVERTENCIA: Service Worker no soportado (navegador muy antiguo)');
    }
    
    // Problema 4: Modo estricto
    if (window.location.protocol === 'https:' || window.location.hostname === 'localhost') {
      console.log('✅ HTTPS/Localhost detectado (requerido para PWA)');
    } else {
      console.log('❌ PROBLEMA: PWA requiere HTTPS (actual:', window.location.protocol, ')');
    }
    
    console.log('\n🏁 DETECCIÓN AUTOMÁTICA COMPLETADA\n');
  }
})();