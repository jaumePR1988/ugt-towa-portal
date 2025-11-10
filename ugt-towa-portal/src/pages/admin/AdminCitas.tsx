import React, { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { supabase, Appointment } from '@/lib/supabase';
import { toast } from 'sonner';
import { Bell, CheckCircle, XCircle, Calendar, Clock, Filter, TrendingUp, AlertCircle } from 'lucide-react';

interface Notification {
  id: string;
  appointment_id: string;
  type: string;
  title: string;
  message: string;
  created_at: string;
  read: boolean;
  user_email: string | null;
  delegate_type: string | null;
  appointment_time: string | null;
}

interface AppointmentStats {
  today: number;
  upcoming: number;
  pending: number;
  completed: number;
}

export default function AdminCitas() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [stats, setStats] = useState<AppointmentStats>({ today: 0, upcoming: 0, pending: 0, completed: 0 });
  const [filterType, setFilterType] = useState<string>('all');
  const [filterRead, setFilterRead] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<'appointments' | 'notifications'>('appointments');

  useEffect(() => {
    loadAppointments();
    loadNotifications();
    calculateStats();

    // Suscripción en tiempo real para notificaciones
    const notificationsSubscription = supabase
      .channel('notifications_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'notifications' }, () => {
        loadNotifications();
      })
      .subscribe();

    return () => {
      notificationsSubscription.unsubscribe();
    };
  }, []);

  async function loadAppointments() {
    const { data } = await supabase.from('appointments').select('*').order('start_time');
    if (data) setAppointments(data);
  }

  async function loadNotifications() {
    const { data } = await supabase.from('notifications').select('*').order('created_at', { ascending: false });
    if (data) setNotifications(data);
  }

  async function calculateStats() {
    const now = new Date();
    const todayStart = new Date(now.setHours(0, 0, 0, 0));
    const todayEnd = new Date(now.setHours(23, 59, 59, 999));

    // Citas hoy
    const { count: todayCount } = await supabase
      .from('appointments')
      .select('*', { count: 'exact', head: true })
      .gte('start_time', todayStart.toISOString())
      .lte('start_time', todayEnd.toISOString());

    // Citas próximas (próximos 7 días)
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);
    const { count: upcomingCount } = await supabase
      .from('appointments')
      .select('*', { count: 'exact', head: true })
      .gte('start_time', new Date().toISOString())
      .lte('start_time', nextWeek.toISOString());

    // Citas pendientes
    const { count: pendingCount } = await supabase
      .from('appointments')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'pending');

    // Citas completadas
    const { count: completedCount } = await supabase
      .from('appointments')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'completed');

    setStats({
      today: todayCount || 0,
      upcoming: upcomingCount || 0,
      pending: pendingCount || 0,
      completed: completedCount || 0
    });
  }

  async function updateStatus(id: string, status: string) {
    const { error } = await supabase.from('appointments').update({ status }).eq('id', id);
    if (error) toast.error('Error al actualizar');
    else {
      toast.success('Estado actualizado');
      loadAppointments();
      calculateStats();

      // Crear notificación según el nuevo estado
      const appointment = appointments.find(apt => apt.id === id);
      if (appointment && (status === 'confirmed' || status === 'cancelled')) {
        const notificationType = status === 'confirmed' ? 'confirmation' : 'cancellation';
        await supabase.functions.invoke('send-notifications', {
          body: {
            appointment_id: id,
            type: notificationType,
            delegate_type: appointment.delegate_type
          }
        });
      }
    }
  }

  async function markAsRead(id: string) {
    const { error } = await supabase.from('notifications').update({ read: true }).eq('id', id);
    if (error) toast.error('Error al marcar como leída');
    else {
      toast.success('Notificación marcada como leída');
      loadNotifications();
    }
  }

  async function markAllAsRead() {
    const { error } = await supabase.from('notifications').update({ read: true }).eq('read', false);
    if (error) toast.error('Error al marcar todas como leídas');
    else {
      toast.success('Todas las notificaciones marcadas como leídas');
      loadNotifications();
    }
  }

  async function deleteNotification(id: string) {
    if (!confirm('¿Eliminar esta notificación?')) return;
    const { error } = await supabase.from('notifications').delete().eq('id', id);
    if (error) toast.error('Error al eliminar');
    else {
      toast.success('Notificación eliminada');
      loadNotifications();
    }
  }

  const filteredNotifications = notifications.filter(n => {
    if (filterType !== 'all' && n.type !== filterType) return false;
    if (filterRead === 'unread' && n.read) return false;
    if (filterRead === 'read' && !n.read) return false;
    return true;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'reminder': return 'bg-yellow-100 text-yellow-800';
      case 'confirmation': return 'bg-green-100 text-green-800';
      case 'cancellation': return 'bg-red-100 text-red-800';
      case 'delegate_notification': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'reminder': return 'Recordatorio';
      case 'confirmation': return 'Confirmación';
      case 'cancellation': return 'Cancelación';
      case 'delegate_notification': return 'Nueva Cita';
      default: return type;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Gestión de Citas</h1>
        </div>

        {/* Dashboard de Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Citas Hoy</p>
                <p className="text-3xl font-bold text-blue-600">{stats.today}</p>
              </div>
              <Calendar className="w-10 h-10 text-blue-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Próximas (7 días)</p>
                <p className="text-3xl font-bold text-green-600">{stats.upcoming}</p>
              </div>
              <Clock className="w-10 h-10 text-green-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pendientes</p>
                <p className="text-3xl font-bold text-orange-600">{stats.pending}</p>
              </div>
              <AlertCircle className="w-10 h-10 text-orange-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Completadas</p>
                <p className="text-3xl font-bold text-gray-600">{stats.completed}</p>
              </div>
              <TrendingUp className="w-10 h-10 text-gray-600" />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6 border-b">
          <div className="flex space-x-8">
            <button
              onClick={() => setActiveTab('appointments')}
              className={`pb-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'appointments'
                  ? 'border-red-600 text-red-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Citas
            </button>
            <button
              onClick={() => setActiveTab('notifications')}
              className={`pb-4 px-1 border-b-2 font-medium text-sm flex items-center ${
                activeTab === 'notifications'
                  ? 'border-red-600 text-red-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Bell className="w-4 h-4 mr-2" />
              Notificaciones
              {unreadCount > 0 && (
                <span className="ml-2 bg-red-600 text-white text-xs rounded-full px-2 py-0.5">
                  {unreadCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Contenido de las Tabs */}
        {activeTab === 'appointments' ? (
          <div className="bg-white rounded-lg shadow overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tipo</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {appointments.map(apt => (
                  <tr key={apt.id}>
                    <td className="px-6 py-4">{new Date(apt.start_time).toLocaleString('es-ES')}</td>
                    <td className="px-6 py-4">{apt.delegate_type}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        apt.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                        apt.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                        apt.status === 'completed' ? 'bg-gray-100 text-gray-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {apt.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <select 
                        value={apt.status} 
                        onChange={e => updateStatus(apt.id, e.target.value)} 
                        className="p-1 border rounded text-sm"
                      >
                        <option value="pending">Pendiente</option>
                        <option value="confirmed">Confirmada</option>
                        <option value="cancelled">Cancelada</option>
                        <option value="completed">Completada</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {appointments.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                No hay citas registradas
              </div>
            )}
          </div>
        ) : (
          <div>
            {/* Filtros de Notificaciones */}
            <div className="bg-white rounded-lg shadow p-4 mb-6">
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-700">Filtros:</span>
                </div>

                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="p-2 border rounded text-sm"
                >
                  <option value="all">Todos los tipos</option>
                  <option value="reminder">Recordatorios</option>
                  <option value="confirmation">Confirmaciones</option>
                  <option value="cancellation">Cancelaciones</option>
                  <option value="delegate_notification">Nuevas Citas</option>
                </select>

                <select
                  value={filterRead}
                  onChange={(e) => setFilterRead(e.target.value)}
                  className="p-2 border rounded text-sm"
                >
                  <option value="all">Todas</option>
                  <option value="unread">No leídas</option>
                  <option value="read">Leídas</option>
                </select>

                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="ml-auto bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700 flex items-center gap-2"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Marcar todas como leídas
                  </button>
                )}
              </div>
            </div>

            {/* Lista de Notificaciones */}
            <div className="space-y-3">
              {filteredNotifications.map(notification => (
                <div
                  key={notification.id}
                  className={`bg-white rounded-lg shadow p-4 ${!notification.read ? 'border-l-4 border-blue-500' : ''}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className={`px-2 py-1 text-xs rounded-full ${getTypeColor(notification.type)}`}>
                          {getTypeLabel(notification.type)}
                        </span>
                        {notification.delegate_type && (
                          <span className="text-xs text-gray-500">
                            {notification.delegate_type}
                          </span>
                        )}
                        {!notification.read && (
                          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                            Nueva
                          </span>
                        )}
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-1">{notification.title}</h3>
                      <p className="text-sm text-gray-600 mb-2">{notification.message}</p>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span>{new Date(notification.created_at).toLocaleString('es-ES')}</span>
                        {notification.appointment_time && (
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            Cita: {new Date(notification.appointment_time).toLocaleString('es-ES')}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      {!notification.read && (
                        <button
                          onClick={() => markAsRead(notification.id)}
                          className="text-blue-600 hover:text-blue-800 p-2 rounded-full hover:bg-blue-50"
                          title="Marcar como leída"
                        >
                          <CheckCircle className="w-5 h-5" />
                        </button>
                      )}
                      <button
                        onClick={() => deleteNotification(notification.id)}
                        className="text-red-600 hover:text-red-800 p-2 rounded-full hover:bg-red-50"
                        title="Eliminar"
                      >
                        <XCircle className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {filteredNotifications.length === 0 && (
                <div className="bg-white rounded-lg shadow p-12 text-center">
                  <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No hay notificaciones</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
