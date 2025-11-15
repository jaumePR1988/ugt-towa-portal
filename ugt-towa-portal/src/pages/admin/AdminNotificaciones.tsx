import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Bell, Send, TestTube, Check, X, Smartphone } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';

export default function AdminNotificaciones() {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [url, setUrl] = useState('/');
  const [isSending, setIsSending] = useState(false);
  const [stats, setStats] = useState({
    totalSubscriptions: 0,
    lastSent: null as string | null
  });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const { count } = await supabase
        .from('push_subscriptions')
        .select('id', { count: 'exact', head: true });
      
      setStats(prev => ({
        ...prev,
        totalSubscriptions: count || 0
      }));
    } catch (error) {
      console.error('Error cargando estadísticas:', error);
    }
  };

  const handleTestNotification = async () => {
    if (!('Notification' in window)) {
      toast.error('Este navegador no soporta notificaciones');
      return;
    }

    const permission = await Notification.requestPermission();
    
    if (permission === 'granted') {
      if ('serviceWorker' in navigator) {
        const registration = await navigator.serviceWorker.ready;
        
        await registration.showNotification(title || 'UGT Towa - Prueba', {
          body: message || 'Esta es una notificación de prueba',
          icon: '/ugt-towa-icon-192.png',
          badge: '/ugt-towa-icon-96.png',
          tag: 'test-notification',
          requireInteraction: false,
          actions: [
            {
              action: 'view',
              title: 'Ver ahora'
            }
          ]
        } as any);
        
        toast.success('Notificación de prueba enviada');
      }
    } else {
      toast.error('Permiso de notificaciones denegado');
    }
  };

  const handleSendToAll = async () => {
    if (!title || !message) {
      toast.error('Por favor completa título y mensaje');
      return;
    }

    setIsSending(true);
    try {
      // Llamar a la edge function para envío real
      const { data: { session } } = await supabase.auth.getSession();
      
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-push-notification`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session?.access_token}`
          },
          body: JSON.stringify({ title, message, url })
        }
      );

      const result = await response.json();

      if (response.ok) {
        toast.success(result.message || `Notificación enviada a ${result.sent} usuarios`);
        setTitle('');
        setMessage('');
        setUrl('/');
        setStats(prev => ({
          ...prev,
          lastSent: new Date().toISOString()
        }));
      } else {
        throw new Error(result.error || 'Error al enviar notificación');
      }
    } catch (error: any) {
      console.error('Error enviando notificación:', error);
      toast.error(error.message || 'Error al enviar notificación');
    } finally {
      setIsSending(false);
    }
  };

  const predefinedMessages = [
    {
      title: 'Nuevo Comunicado Urgente',
      message: 'Se ha publicado un nuevo comunicado importante. Consúltalo ahora.',
      url: '/comunicados'
    },
    {
      title: 'Encuesta Activa',
      message: 'Nueva encuesta disponible. Tu opinión es importante.',
      url: '/encuestas'
    },
    {
      title: 'Recordatorio de Cita',
      message: 'Tienes una cita pendiente con los delegados sindicales.',
      url: '/citas'
    },
    {
      title: 'Actualización de Beneficios',
      message: 'Nuevos beneficios disponibles para afiliados.',
      url: '/afiliados/beneficios'
    }
  ];

  const loadPredefined = (msg: typeof predefinedMessages[0]) => {
    setTitle(msg.title);
    setMessage(msg.message);
    setUrl(msg.url);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/admin/dashboard')}
            className="text-red-600 hover:text-red-700 mb-4 flex items-center gap-2"
          >
            ← Volver al Dashboard
          </button>
          
          <div className="flex items-center gap-3 mb-2">
            <Bell className="w-8 h-8 text-red-600" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Notificaciones Push
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Envía notificaciones a los usuarios que tienen instalada la aplicación PWA
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Panel principal */}
          <div className="lg:col-span-2 space-y-6">
            {/* Formulario de envío */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Nueva Notificación
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Título
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Ej: Nuevo Comunicado Urgente"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    maxLength={50}
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {title.length}/50 caracteres
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Mensaje
                  </label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Escribe el contenido de la notificación..."
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    maxLength={200}
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {message.length}/200 caracteres
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    URL de destino (opcional)
                  </label>
                  <input
                    type="text"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="/comunicados"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Página a la que se redirigirá al hacer clic
                  </p>
                </div>

                {/* Vista previa */}
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-900">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Vista previa:
                  </p>
                  <div className="flex gap-3 bg-white dark:bg-gray-800 rounded-lg p-3 shadow-sm">
                    <img 
                      src="/ugt-towa-icon-96.png" 
                      alt="Icon" 
                      className="w-12 h-12 rounded"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 dark:text-white text-sm">
                        {title || 'Título de la notificación'}
                      </p>
                      <p className="text-gray-600 dark:text-gray-400 text-sm truncate">
                        {message || 'Mensaje de la notificación'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Botones de acción */}
                <div className="flex gap-3">
                  <button
                    onClick={handleTestNotification}
                    className="flex items-center gap-2 px-4 py-2 border border-purple-600 text-purple-600 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors"
                  >
                    <TestTube className="w-4 h-4" />
                    Enviar Prueba
                  </button>
                  
                  <button
                    onClick={handleSendToAll}
                    disabled={isSending || !title || !message}
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                  >
                    {isSending ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                        Enviando...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Enviar a Todos
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Información importante */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <h3 className="font-semibold text-blue-900 dark:text-blue-300 mb-2 flex items-center gap-2">
                <Smartphone className="w-5 h-5" />
                Información Importante
              </h3>
              <ul className="text-sm text-blue-800 dark:text-blue-300 space-y-2">
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span>Solo recibirán notificaciones los usuarios que tengan la PWA instalada</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span>Los usuarios deben haber aceptado los permisos de notificaciones</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span>Las notificaciones funcionan incluso cuando la app está cerrada</span>
                </li>
                <li className="flex items-start gap-2">
                  <X className="w-4 h-4 flex-shrink-0 mt-0.5 text-red-600" />
                  <span>No abuses de las notificaciones para no molestar a los usuarios</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Mensajes predefinidos */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                Mensajes Predefinidos
              </h3>
              <div className="space-y-2">
                {predefinedMessages.map((msg, index) => (
                  <button
                    key={index}
                    onClick={() => loadPredefined(msg)}
                    className="w-full text-left p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-red-500 dark:hover:border-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors"
                  >
                    <p className="font-medium text-sm text-gray-900 dark:text-white">
                      {msg.title}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      {msg.message}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* Estadísticas */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                Estadísticas
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Usuarios suscritos:</span>
                  <span className="font-bold text-gray-900 dark:text-white">{stats.totalSubscriptions}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Con permisos:</span>
                  <span className="font-bold text-gray-900 dark:text-white">{stats.totalSubscriptions}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Último envío:</span>
                  <span className="font-bold text-gray-900 dark:text-white">
                    {stats.lastSent 
                      ? new Date(stats.lastSent).toLocaleString('es-ES', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })
                      : '-'
                    }
                  </span>
                </div>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-4">
                {stats.totalSubscriptions > 0
                  ? 'Sistema de notificaciones activo y operativo'
                  : 'Aún no hay usuarios suscritos. Instala la PWA para recibir notificaciones.'}
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
