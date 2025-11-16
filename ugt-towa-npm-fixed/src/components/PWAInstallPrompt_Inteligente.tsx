import React, { useState, useEffect, useRef } from 'react';
import { X, Download, Smartphone } from 'lucide-react';

interface PWAInstallPromptProps {
  onInstall?: () => void;
}

export const PWAInstallPrompt: React.FC<PWAInstallPromptProps> = ({ onInstall }) => {
  const [showPrompt, setShowPrompt] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [installAttempts, setInstallAttempts] = useState(0);
  const [isInstalled, setIsInstalled] = useState(false);
  const [showAlways, setShowAlways] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Verificar si la app ya está instalada
  useEffect(() => {
    const checkInstallStatus = () => {
      console.log('[PWA] Verificando estado de instalación inicial...');
      
      // Verificar si está en modo standalone
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
      console.log('[PWA] Modo standalone:', isStandalone);
      
      // Verificar si hay instalado en localStorage
      const isInstallBlocked = localStorage.getItem('pwa-install-blocked') === 'true';
      const isInstallSuccess = localStorage.getItem('pwa-install-success') === 'true';
      const wasRejected = localStorage.getItem('pwa-install-rejected') === 'true';
      const dismissed = localStorage.getItem('pwa-install-dismissed') === 'true';
      
      console.log('[PWA] Estados de instalación:', {
        isInstallBlocked,
        isInstallSuccess,
        wasRejected,
        dismissed
      });
      
      const installed = isStandalone || isInstallSuccess;
      setIsInstalled(installed);
      
      // Si ya está instalado, no mostrar prompt
      if (installed) {
        console.log('[PWA] App ya está instalada, no mostrar prompt');
        setShowPrompt(false);
        return;
      }
      
      console.log('[PWA] App no está instalada, evaluando si mostrar prompt...');
      
      // Lógica inteligente para mostrar prompt
      if (!wasRejected && !dismissed) {
        console.log('[PWA] Primera vez o instalable - mostrando prompt en 2 segundos');
        setTimeout(() => setShowPrompt(true), 2000);
      } else if (wasRejected) {
        console.log('[PWA] Usuario rechazó antes - activando modo persistente');
        setShowAlways(true);
        setTimeout(() => setShowPrompt(true), 3000);
      } else if (dismissed) {
        console.log('[PWA] Usuario cerró antes - mostrando botón persistente');
        setShowAlways(true);
      } else {
        console.log('[PWA] Estado inesperado, no mostrar nada');
      }
    };

    checkInstallStatus();
  }, []);

  // Escuchar eventos de instalación
  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      console.log('[PWA] beforeinstallprompt capturado');
    };

    const handleAppInstalled = () => {
      console.log('[PWA] App instalada exitosamente');
      setIsInstalled(true);
      setShowPrompt(false);
      setShowAlways(false);
      
      // Marcar como instalado exitosamente
      localStorage.setItem('pwa-install-success', 'true');
      localStorage.removeItem('pwa-install-rejected');
      localStorage.removeItem('pwa-install-dismissed');
      localStorage.removeItem('pwa-install-blocked');
      
      if (onInstall) onInstall();
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [onInstall]);

  // Función para manejar la instalación
  const handleInstall = async () => {
    console.log('[PWA] Click en botón de instalación');
    console.log('[PWA] Estado actual:', { 
      isInstalled, 
      showPrompt, 
      showAlways, 
      installAttempts,
      hasDeferredPrompt: !!deferredPrompt 
    });

    if (isInstalled) {
      console.log('[PWA] App ya está instalada, no hacer nada');
      return;
    }

    try {
      if (deferredPrompt) {
        console.log('[PWA] Mostrando prompt nativo de instalación');
        console.log('[PWA] deferredPrompt disponible:', deferredPrompt);
        
        try {
          deferredPrompt.prompt();
          console.log('[PWA] Prompt mostrado, esperando respuesta del usuario');
          
          const { outcome } = await deferredPrompt.userChoice;
          console.log('[PWA] Respuesta del usuario:', outcome);
          
          if (outcome === 'accepted') {
            console.log('[PWA] Usuario aceptó instalar');
            localStorage.setItem('pwa-install-success', 'true');
            setIsInstalled(true);
            setShowPrompt(false);
            setShowAlways(false);
            
            if (onInstall) onInstall();
          } else if (outcome === 'dismissed') {
            console.log('[PWA] Usuario cerró el prompt');
            handleUserDismiss();
          }
          
          setDeferredPrompt(null);
        } catch (promptError) {
          console.error('[PWA] Error al mostrar prompt:', promptError);
          console.log('[PWA] Ejecutando fallback debido a error en prompt');
          handleManualInstall();
        }
      } else {
        console.log('[PWA] No hay deferredPrompt disponible');
        console.log('[PWA] Motivos posibles:');
        console.log('- App ya instalada');
        console.log('- Navegador no soporta beforeinstallprompt');
        console.log('- Prompt ya fue mostrado y descartado');
        console.log('- Límite de intentos alcanzado');
        console.log('Ejecutando instalación manual fallback...');
        
        handleManualInstall();
      }
    } catch (error) {
      console.error('[PWA] Error general en instalación:', error);
      console.log('[PWA] Ejecutando fallback debido a error general');
      
      handleManualInstall();
    }
  };

  // Manejar dismiss del usuario
  const handleUserDismiss = (permanent = false) => {
    setShowPrompt(false);
    
    if (permanent) {
      localStorage.setItem('pwa-install-blocked', 'true');
      setShowAlways(false);
    } else {
      localStorage.setItem('pwa-install-dismissed', 'true');
      // Programar siguiente intento en 30 segundos si showAlways está activo
      if (showAlways) {
        timeoutRef.current = setTimeout(() => {
          setShowPrompt(true);
        }, 30000);
      }
    }
  };

  // Manejar rechazo del usuario
  const handleUserReject = () => {
    setShowPrompt(false);
    setShowAlways(false);
    localStorage.setItem('pwa-install-rejected', 'true');
    
    // Opcional: Mostrar mensaje de que pueden usar el enlace directo
    console.log('[PWA] Usuario rechazó instalación. Usar: ?forcePWA=true');
  };

  // Instalación manual fallback
  const handleManualInstall = () => {
    console.log('[PWA] Ejecutando instalación manual fallback');
    
    try {
      // Abrir en nueva ventana con parámetros de forzado
      const url = new URL(window.location.href);
      url.searchParams.set('forcePWA', 'true');
      url.searchParams.set('t', Date.now().toString());
      
      console.log('[PWA] Abriendo nueva ventana:', url.toString());
      window.open(url.toString(), '_blank');
      
      // Incrementar intentos
      setInstallAttempts(prev => prev + 1);
      
      // Mostrar mensaje informativo con retraso
      setTimeout(() => {
        console.log('[PWA] Mostrando mensaje informativo de fallback');
        alert('Se ha abierto una nueva ventana con la opción de instalación.\n\nSi no aparece el popup automáticamente, usa el método manual:\nMenú del navegador → "Añadir a pantalla de inicio"\n\nEn móviles: Compartir → Añadir a pantalla de inicio');
      }, 1000);
      
      return true;
    } catch (error) {
      console.error('[PWA] Error en instalación manual:', error);
      
      // Mostrar mensaje de error con instrucciones
      setTimeout(() => {
        alert('No se pudo abrir la ventana de instalación automáticamente.\n\nPara instalar manualmente:\n1. Abre el menú del navegador\n2. Selecciona "Añadir a pantalla de inicio"\n3. Confirma la instalación');
      }, 1000);
      
      return false;
    }
  };

  // No mostrar si está instalado
  if (isInstalled) {
    return null;
  }

  // Popup principal inteligente
  return (
    <>
      {/* Popup de instalación principal */}
      {showPrompt && (
        <div className="fixed bottom-4 right-4 z-50 max-w-sm">
          <div className="bg-white rounded-lg shadow-2xl border border-gray-200 p-4 animate-in slide-in-from-bottom-2 duration-500">
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
                  <Smartphone className="w-4 h-4 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900">Portal UGT Towa</h3>
              </div>
              <button
                onClick={() => handleUserDismiss(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Contenido */}
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">
                📱 <strong>Instala la aplicación</strong> para acceso rápido y notificaciones
              </p>
              <div className="text-xs text-gray-500 space-y-1">
                <div className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                  Acceso rápido desde pantalla inicio
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                  Notificaciones automáticas
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                  Funciona sin internet
                </div>
              </div>
            </div>

            {/* Botones */}
            <div className="flex gap-2">
              <button
                onClick={handleInstall}
                className="flex-1 bg-red-600 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-red-700 transition-colors flex items-center justify-center gap-1"
              >
                <Download className="w-3 h-3" />
                Instalar
              </button>
              <button
                onClick={handleManualInstall}
                className="px-3 py-2 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-md transition-colors"
              >
                Manual
              </button>
            </div>

            {/* Opciones adicionales */}
            <div className="mt-3 pt-3 border-t border-gray-100">
              <div className="flex justify-between items-center text-xs">
                <button
                  onClick={() => handleUserDismiss(true)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  No mostrar más
                </button>
                <span className="text-gray-400">
                  Intentos: {installAttempts}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Botón flotante inteligente - siempre visible si showAlways */}
      {showAlways && !showPrompt && !isInstalled && (
        <button
          onClick={() => {
            setInstallAttempts(prev => prev + 1);
            setShowPrompt(true);
          }}
          className="fixed bottom-4 right-4 z-40 w-14 h-14 bg-red-600 hover:bg-red-700 text-white rounded-full shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110 animate-bounce"
          title="Instalar Portal UGT Towa"
        >
          <Download className="w-6 h-6" />
        </button>
      )}

      {/* Banner persistente en la parte superior - solo si nunca se instaló */}
      {!showAlways && !isInstalled && (
        <div className="fixed top-0 left-0 right-0 z-30 bg-gradient-to-r from-red-600 to-red-700 text-white p-2">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm">
              <Smartphone className="w-4 h-4" />
              <span className="font-medium">📱 Instala la App UGT Towa</span>
              <span className="hidden sm:inline">- Acceso rápido + notificaciones</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleInstall}
                className="bg-white text-red-600 px-3 py-1 rounded text-xs font-medium hover:bg-gray-100 transition-colors"
              >
                Instalar
              </button>
              <button
                onClick={handleUserReject}
                className="text-red-200 hover:text-white p-1 transition-colors"
                title="Rechazar"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};