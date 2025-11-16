import { useState, useEffect, useCallback } from 'react';

interface PWAState {
  isInstalled: boolean;
  isInstallable: boolean;
  isOffline: boolean;
  needsUpdate: boolean;
  installAttempts: number;
  userChoice: 'accepted' | 'dismissed' | 'pending' | null;
}

interface PWAReturn {
  state: PWAState;
  install: () => Promise<boolean>;
  dismiss: (permanent?: boolean) => void;
  reset: () => void;
  checkUpdate: () => void;
}

export const usePWA = (): PWAReturn => {
  const [state, setState] = useState<PWAState>({
    isInstalled: false,
    isInstallable: false,
    isOffline: !navigator.onLine,
    needsUpdate: false,
    installAttempts: 0,
    userChoice: null
  });

  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null);

  // Inicializar estado PWA
  const initializePWA = useCallback(() => {
    console.log('[PWA] Inicializando...');
    
    // Verificar si está instalado
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    const installSuccess = localStorage.getItem('pwa-install-success') === 'true';
    const isInstalled = isStandalone || installSuccess;
    
    console.log('[PWA] Detección de instalación:', { isStandalone, installSuccess, isInstalled });
    
    // Verificar estado del usuario
    const installBlocked = localStorage.getItem('pwa-install-blocked') === 'true';
    const installRejected = localStorage.getItem('pwa-install-rejected') === 'true';
    const installDismissed = localStorage.getItem('pwa-install-dismissed') === 'true';
    
    console.log('[PWA] Estado del usuario:', { installBlocked, installRejected, installDismissed });
    
    // Contar intentos
    const attempts = parseInt(localStorage.getItem('pwa-install-attempts') || '0', 10);
    console.log('[PWA] Intentos de instalación:', attempts);
    
    // Determinar choice del usuario
    let userChoice: PWAState['userChoice'] = null;
    if (installBlocked) {
      userChoice = 'dismissed';
      console.log('[PWA] Estado: Usuario bloqueó instalación');
    } else if (installRejected) {
      userChoice = 'dismissed';
      console.log('[PWA] Estado: Usuario rechazó instalación');
    } else if (installDismissed) {
      userChoice = 'dismissed';
      console.log('[PWA] Estado: Usuario cerró instalación');
    } else if (isInstalled) {
      userChoice = 'accepted';
      console.log('[PWA] Estado: App instalada');
    } else {
      console.log('[PWA] Estado: Pendiente (no decisión tomada)');
    }

    // Determinar si es instalable
    const shouldShowInstall = !isInstalled && !installBlocked && !installRejected;
    
    console.log('[PWA] Resultado final:', {
      isInstalled,
      userChoice,
      installAttempts: attempts,
      isInstallable: shouldShowInstall
    });

    setState(prev => ({
      ...prev,
      isInstalled,
      userChoice,
      installAttempts: attempts,
      // Solo mostrar prompt si no está bloqueado y no está instalado
      isInstallable: shouldShowInstall
    }));
  }, []);

  // Manejar evento beforeinstallprompt
  const handleBeforeInstallPrompt = useCallback((e: Event) => {
    e.preventDefault();
    console.log('[PWA] beforeinstallprompt capturado');
    
    setDeferredPrompt(e);
    setState(prev => ({
      ...prev,
      isInstallable: true
    }));
  }, []);

  // Manejar instalación exitosa
  const handleAppInstalled = useCallback(() => {
    console.log('[PWA] App instalada exitosamente');
    
    setState(prev => ({
      ...prev,
      isInstalled: true,
      isInstallable: false,
      userChoice: 'accepted'
    }));

    // Limpiar localStorage
    localStorage.setItem('pwa-install-success', 'true');
    localStorage.removeItem('pwa-install-rejected');
    localStorage.removeItem('pwa-install-dismissed');
    localStorage.removeItem('pwa-install-blocked');
    localStorage.removeItem('pwa-install-attempts');
  }, []);

  // Función de instalación
  const install = useCallback(async (): Promise<boolean> => {
    try {
      console.log('[PWA] Iniciando instalación...');
      
      setState(prev => ({
        ...prev,
        installAttempts: prev.installAttempts + 1
      }));

      // Incrementar contador
      const currentAttempts = parseInt(localStorage.getItem('pwa-install-attempts') || '0', 10) + 1;
      localStorage.setItem('pwa-install-attempts', currentAttempts.toString());

      if (deferredPrompt) {
        console.log('[PWA] Mostrando prompt nativo');
        
        try {
          deferredPrompt.prompt();
          const { outcome } = await deferredPrompt.userChoice;
          
          console.log('[PWA] Resultado de instalación:', outcome);
          
          if (outcome === 'accepted') {
            console.log('[PWA] Instalación aceptada');
            setState(prev => ({
              ...prev,
              isInstalled: true,
              isInstallable: false,
              userChoice: 'accepted'
            }));
            
            localStorage.setItem('pwa-install-success', 'true');
            localStorage.removeItem('pwa-install-rejected');
            localStorage.removeItem('pwa-install-dismissed');
            localStorage.removeItem('pwa-install-blocked');
            
            return true;
          } else {
            console.log('[PWA] Instalación rechazada');
            dismiss(false);
            return false;
          }
        } catch (promptError) {
          console.error('[PWA] Error al mostrar prompt:', promptError);
          // Fallback si el prompt falla
          return handleManualInstall();
        }
      } else {
        console.log('[PWA] No hay deferredPrompt disponible');
        console.log('[PWA] Estado actual:', {
          isInstalled: state.isInstalled,
          isInstallable: state.isInstallable,
          installAttempts: currentAttempts
        });
        
        // Fallback a instalación manual
        return handleManualInstall();
      }
    } catch (error) {
      console.error('[PWA] Error general en instalación:', error);
      return handleManualInstall();
    }
  }, [deferredPrompt, state.isInstalled, state.isInstallable, dismiss]);

  // Función de instalación manual fallback
  const handleManualInstall = useCallback((): boolean => {
    console.log('[PWA] Ejecutando instalación manual fallback');
    
    try {
      // Abrir en nueva ventana con parámetros de forzado
      const url = new URL(window.location.href);
      url.searchParams.set('forcePWA', 'true');
      url.searchParams.set('t', Date.now().toString());
      
      window.open(url.toString(), '_blank');
      
      // Mostrar mensaje informativo
      setTimeout(() => {
        alert('Se ha abierto una nueva ventana con la opción de instalación. Si no aparece el popup, usa el método manual: Menú del navegador → "Añadir a pantalla de inicio"');
      }, 1000);
      
      return false;
    } catch (error) {
      console.error('[PWA] Error en instalación manual:', error);
      return false;
    }
  }, []);

  // Función de dismiss
  const dismiss = useCallback((permanent = false) => {
    console.log('[PWA] Usuario dismiss', { permanent });
    
    setState(prev => ({
      ...prev,
      isInstallable: !permanent,
      userChoice: 'dismissed'
    }));

    if (permanent) {
      console.log('[PWA] Marcando instalación como permanentemente rechazada');
      localStorage.setItem('pwa-install-blocked', 'true');
      localStorage.setItem('pwa-install-rejected', 'true');
      localStorage.removeItem('pwa-install-dismissed');
    } else {
      console.log('[PWA] Marcando instalación como temporalmente rechazada');
      localStorage.setItem('pwa-install-dismissed', 'true');
      localStorage.removeItem('pwa-install-rejected');
      localStorage.removeItem('pwa-install-blocked');
    }
    
    // Limpiar deferredPrompt pero conservarlo para debug
    setDeferredPrompt(null);
  }, []);

  // Función de reset
  const reset = useCallback(() => {
    console.log('[PWA] Reseteando estado PWA');
    
    // Limpiar localStorage
    const keys = [
      'pwa-install-success',
      'pwa-install-rejected',
      'pwa-install-dismissed',
      'pwa-install-blocked',
      'pwa-install-attempts',
      'beforeinstallprompt'
    ];
    
    console.log('[PWA] Limpiando keys:', keys);
    keys.forEach(key => {
      localStorage.removeItem(key);
      console.log(`[PWA] Limpiado: ${key}`);
    });
    
    // Limpiar sessionStorage
    sessionStorage.clear();
    console.log('[PWA] Limpiado sessionStorage');
    
    // Limpiar estado en memoria
    setDeferredPrompt(null);
    
    // Re-inicializar
    console.log('[PWA] Re-inicializando estado...');
    initializePWA();
    
    // Disparar evento de forzado para debug
    console.log('[PWA] Disparando evento beforeinstallprompt de debug');
    window.dispatchEvent(new Event('beforeinstallprompt'));
  }, [initializePWA]);

  // Verificar actualizaciones
  const checkUpdate = useCallback(() => {
    if (registration) {
      registration.update();
      console.log('[PWA] Verificando actualizaciones...');
    }
  }, [registration]);

  // Registrar Service Worker
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then((reg) => {
          console.log('[PWA] Service Worker registrado:', reg);
          setRegistration(reg);
          
          // Verificar actualizaciones
          reg.addEventListener('updatefound', () => {
            const newWorker = reg.installing;
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  console.log('[PWA] Nueva versión disponible');
                  setState(prev => ({ ...prev, needsUpdate: true }));
                }
              });
            }
          });
        })
        .catch((error) => {
          console.error('[PWA] Error registrando Service Worker:', error);
        });
    }
  }, []);

  // Event listeners
  useEffect(() => {
    const handleOnline = () => setState(prev => ({ ...prev, isOffline: false }));
    const handleOffline = () => setState(prev => ({ ...prev, isOffline: true }));
    
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [handleBeforeInstallPrompt, handleAppInstalled]);

  // Inicializar al cargar
  useEffect(() => {
    initializePWA();
  }, [initializePWA]);

  // Manejar parámetros URL
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    
    // Forzar PWA si viene el parámetro
    if (urlParams.get('forcePWA') === 'true') {
      console.log('[PWA] URL con forcePWA, limpiando estados...');
      setTimeout(() => {
        reset();
      }, 1000);
    }
  }, [reset]);

  return {
    state,
    install,
    dismiss,
    reset,
    checkUpdate
  };
};