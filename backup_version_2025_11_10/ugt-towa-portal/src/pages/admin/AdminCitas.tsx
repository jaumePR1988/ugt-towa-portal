import React, { useEffect, useState, useMemo } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { supabase, Appointment } from '@/lib/supabase';
import { toast } from 'sonner';
import { Bell, CheckCircle, XCircle, Calendar, Clock, Filter, TrendingUp, AlertCircle, Search, User, RefreshCcw } from 'lucide-react';
import { DayPicker, DateRange } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { format, parseISO, isWithinInterval, startOfDay, endOfDay, getHours } from 'date-fns';
import { es } from 'date-fns/locale';

interface Notification {
  id: string;
  appointment_id: string;
  type: string;
  title: string;
  message: string;
  created_at: string;
  read: boolean;
  user_email: string | null;
  user_full_name: string | null;
  delegate_type: string | null;
  appointment_time: string | null;
}

interface AppointmentStats {
  today: number;
  upcoming: number;
  pending: number;
  completed: number;
}

interface UserOption {
  id: string;
  full_name: string;
  email: string;
}

interface AdvancedFilters {
  searchTerm: string;
  selectedUser: UserOption | null;
  dateRange: DateRange | undefined;
  timeFilter: 'all' | 'morning' | 'afternoon';
  showDatePicker: boolean;
}

export default function AdminCitas() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [stats, setStats] = useState<AppointmentStats>({ today: 0, upcoming: 0, pending: 0, completed: 0 });
  const [filterType, setFilterType] = useState<string>('all');
  const [filterRead, setFilterRead] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<'appointments' | 'notifications'>('appointments');
  
  // Estados para filtros avanzados
  const [users, setUsers] = useState<UserOption[]>([]);
  const [advancedFilters, setAdvancedFilters] = useState<AdvancedFilters>({
    searchTerm: '',
    selectedUser: null,
    dateRange: undefined,
    timeFilter: 'all',
    showDatePicker: false
  });

  useEffect(() => {
    loadAppointments();
    loadNotifications();
    loadUsers();
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

  async function loadUsers() {
    const { data } = await supabase
      .from('profiles')
      .select('id, full_name, email')
      .order('full_name');
    if (data) {
      setUsers(data.map(user => ({
        id: user.id,
        full_name: user.full_name || 'Sin nombre',
        email: user.email
      })));
    }
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

  // Funciones para filtros avanzados
  const clearAllFilters = () => {
    setAdvancedFilters({
      searchTerm: '',
      selectedUser: null,
      dateRange: undefined,
      timeFilter: 'all',
      showDatePicker: false
    });
    setFilterType('all');
    setFilterRead('all');
  };

  const updateAdvancedFilters = (updates: Partial<AdvancedFilters>) => {
    setAdvancedFilters(prev => ({ ...prev, ...updates }));
  };

  const filterByTimeOfDay = (date: string, timeFilter: string) => {
    if (timeFilter === 'all') return true;
    const hour = getHours(parseISO(date));
    if (timeFilter === 'morning') return hour >= 8 && hour < 14;
    if (timeFilter === 'afternoon') return hour >= 14 && hour < 20;
    return false;
  };

  const isWithinDateRange = (date: string, dateRange: DateRange | undefined) => {
    if (!dateRange?.from && !dateRange?.to) return true;
    const itemDate = parseISO(date);
    if (dateRange.from && dateRange.to) {
      return isWithinInterval(itemDate, {
        start: startOfDay(dateRange.from),
        end: endOfDay(dateRange.to)
      });
    }
    if (dateRange.from) {
      return itemDate >= startOfDay(dateRange.from);
    }
    if (dateRange.to) {
      return itemDate <= endOfDay(dateRange.to);
    }
    return true;
  };

  // Lógica de filtrado mejorada con useMemo
  const filteredAppointments = useMemo(() => {
    return appointments.filter(appointment => {
      // Filtro por búsqueda de texto
      if (advancedFilters.searchTerm) {
        const searchLower = advancedFilters.searchTerm.toLowerCase();
        const matchesSearch = 
          appointment.delegate_type?.toLowerCase().includes(searchLower) ||
          appointment.status.toLowerCase().includes(searchLower);
        if (!matchesSearch) return false;
      }

      // Filtro por usuario (requiere user_id en appointments)
      if (advancedFilters.selectedUser) {
        if (appointment.user_id !== advancedFilters.selectedUser.id) return false;
      }

      // Filtro por rango de fechas
      if (!isWithinDateRange(appointment.start_time, advancedFilters.dateRange)) {
        return false;
      }

      // Filtro por horario
      if (!filterByTimeOfDay(appointment.start_time, advancedFilters.timeFilter)) {
        return false;
      }

      return true;
    });
  }, [appointments, advancedFilters]);

  const filteredNotifications = useMemo(() => {
    return notifications.filter(notification => {
      // Filtros básicos existentes
      if (filterType !== 'all' && notification.type !== filterType) return false;
      if (filterRead === 'unread' && notification.read) return false;
      if (filterRead === 'read' && !notification.read) return false;

      // Filtro por búsqueda de texto
      if (advancedFilters.searchTerm) {
        const searchLower = advancedFilters.searchTerm.toLowerCase();
        const matchesSearch = 
          notification.title.toLowerCase().includes(searchLower) ||
          notification.message.toLowerCase().includes(searchLower) ||
          (notification.user_full_name?.toLowerCase().includes(searchLower)) ||
          (notification.user_email?.toLowerCase().includes(searchLower));
        if (!matchesSearch) return false;
      }

      // Filtro por usuario
      if (advancedFilters.selectedUser) {
        const matchesUser = 
          notification.user_full_name === advancedFilters.selectedUser.full_name ||
          notification.user_email === advancedFilters.selectedUser.email;
        if (!matchesUser) return false;
      }

      // Filtro por rango de fechas
      if (!isWithinDateRange(notification.created_at, advancedFilters.dateRange)) {
        return false;
      }

      // Filtro por horario de la cita (si existe)
      if (notification.appointment_time && !filterByTimeOfDay(notification.appointment_time, advancedFilters.timeFilter)) {
        return false;
      }

      return true;
    });
  }, [notifications, filterType, filterRead, advancedFilters]);

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
          <div>
            {/* Filtros Avanzados para Citas */}
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <div className="flex items-center gap-4 mb-4">
                <Filter className="w-5 h-5 text-gray-500" />
                <h3 className="text-lg font-semibold text-gray-900">Filtros Avanzados</h3>
                <button
                  onClick={clearAllFilters}
                  className="ml-auto text-gray-500 hover:text-red-600 flex items-center gap-2 text-sm"
                >
                  <RefreshCcw className="w-4 h-4" />
                  Limpiar filtros
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Búsqueda por texto */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Buscar
                  </label>
                  <div className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Buscar en tipo, estado..."
                      value={advancedFilters.searchTerm}
                      onChange={(e) => updateAdvancedFilters({ searchTerm: e.target.value })}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Filtro por usuario */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Usuario
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <select
                      value={advancedFilters.selectedUser?.id || ''}
                      onChange={(e) => {
                        const userId = e.target.value;
                        const user = users.find(u => u.id === userId);
                        updateAdvancedFilters({ selectedUser: user || null });
                      }}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    >
                      <option value="">Todos los usuarios</option>
                      {users.map(user => (
                        <option key={user.id} value={user.id}>
                          {user.full_name} ({user.email})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Filtro por rango de fechas */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rango de fechas
                  </label>
                  <div className="relative">
                    <Calendar className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <button
                      onClick={() => updateAdvancedFilters({ showDatePicker: !advancedFilters.showDatePicker })}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-left bg-white hover:bg-gray-50"
                    >
                      {advancedFilters.dateRange?.from || advancedFilters.dateRange?.to
                        ? `${advancedFilters.dateRange?.from ? format(advancedFilters.dateRange.from, 'dd/MM/yyyy', { locale: es }) : '...'} - ${advancedFilters.dateRange?.to ? format(advancedFilters.dateRange.to, 'dd/MM/yyyy', { locale: es }) : '...'}`
                        : 'Seleccionar fechas'
                      }
                    </button>
                  </div>
                  
                  {advancedFilters.showDatePicker && (
                    <div className="absolute z-50 mt-2 bg-white border border-gray-300 rounded-lg shadow-lg p-3">
                      <DayPicker
                        mode="range"
                        selected={advancedFilters.dateRange}
                        onSelect={(range) => {
                          updateAdvancedFilters({ 
                            dateRange: range
                          });
                        }}
                        locale={es}
                        className="text-sm"
                      />
                      <div className="flex gap-2 mt-3">
                        <button
                          onClick={() => updateAdvancedFilters({ 
                            dateRange: undefined,
                            showDatePicker: false
                          })}
                          className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded"
                        >
                          Limpiar
                        </button>
                        <button
                          onClick={() => updateAdvancedFilters({ showDatePicker: false })}
                          className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
                        >
                          Cerrar
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Filtro por horario */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Horario
                  </label>
                  <div className="relative">
                    <Clock className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <select
                      value={advancedFilters.timeFilter}
                      onChange={(e) => updateAdvancedFilters({ timeFilter: e.target.value as 'all' | 'morning' | 'afternoon' })}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    >
                      <option value="all">Todo el día</option>
                      <option value="morning">Mañana (8:00-14:00)</option>
                      <option value="afternoon">Tarde (14:00-20:00)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Resumen de filtros activos */}
              <div className="mt-4 flex flex-wrap gap-2">
                {advancedFilters.searchTerm && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                    Texto: "{advancedFilters.searchTerm}"
                  </span>
                )}
                {advancedFilters.selectedUser && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                    Usuario: {advancedFilters.selectedUser.full_name}
                  </span>
                )}
                {(advancedFilters.dateRange?.from || advancedFilters.dateRange?.to) && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-purple-100 text-purple-800">
                    Fechas: {advancedFilters.dateRange?.from ? format(advancedFilters.dateRange.from, 'dd/MM/yyyy', { locale: es }) : '...'} - {advancedFilters.dateRange?.to ? format(advancedFilters.dateRange.to, 'dd/MM/yyyy', { locale: es }) : '...'}
                  </span>
                )}
                {advancedFilters.timeFilter !== 'all' && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-800">
                    Horario: {advancedFilters.timeFilter === 'morning' ? 'Mañana' : 'Tarde'}
                  </span>
                )}
              </div>
            </div>

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
                  {filteredAppointments.map(apt => (
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
              {filteredAppointments.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                  {appointments.length === 0 ? 'No hay citas registradas' : 'No se encontraron citas con los filtros aplicados'}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div>
            {/* Filtros Avanzados para Notificaciones */}
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <div className="flex items-center gap-4 mb-4">
                <Filter className="w-5 h-5 text-gray-500" />
                <h3 className="text-lg font-semibold text-gray-900">Filtros Avanzados</h3>
                <button
                  onClick={clearAllFilters}
                  className="ml-auto text-gray-500 hover:text-red-600 flex items-center gap-2 text-sm"
                >
                  <RefreshCcw className="w-4 h-4" />
                  Limpiar filtros
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                {/* Filtro por tipo (existente) */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tipo
                  </label>
                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  >
                    <option value="all">Todos los tipos</option>
                    <option value="reminder">Recordatorios</option>
                    <option value="confirmation">Confirmaciones</option>
                    <option value="cancellation">Cancelaciones</option>
                    <option value="delegate_notification">Nuevas Citas</option>
                  </select>
                </div>

                {/* Filtro por estado de lectura (existente) */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Estado
                  </label>
                  <select
                    value={filterRead}
                    onChange={(e) => setFilterRead(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  >
                    <option value="all">Todas</option>
                    <option value="unread">No leídas</option>
                    <option value="read">Leídas</option>
                  </select>
                </div>

                {/* Búsqueda por texto */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Buscar
                  </label>
                  <div className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Buscar en títulos, mensajes..."
                      value={advancedFilters.searchTerm}
                      onChange={(e) => updateAdvancedFilters({ searchTerm: e.target.value })}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Filtro por usuario */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Usuario
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <select
                      value={advancedFilters.selectedUser?.id || ''}
                      onChange={(e) => {
                        const userId = e.target.value;
                        const user = users.find(u => u.id === userId);
                        updateAdvancedFilters({ selectedUser: user || null });
                      }}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    >
                      <option value="">Todos los usuarios</option>
                      {users.map(user => (
                        <option key={user.id} value={user.id}>
                          {user.full_name} ({user.email})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Filtro por rango de fechas */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rango de fechas
                  </label>
                  <div className="relative">
                    <Calendar className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <button
                      onClick={() => updateAdvancedFilters({ showDatePicker: !advancedFilters.showDatePicker })}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-left bg-white hover:bg-gray-50"
                    >
                      {advancedFilters.dateRange?.from || advancedFilters.dateRange?.to
                        ? `${advancedFilters.dateRange?.from ? format(advancedFilters.dateRange.from, 'dd/MM/yyyy', { locale: es }) : '...'} - ${advancedFilters.dateRange?.to ? format(advancedFilters.dateRange.to, 'dd/MM/yyyy', { locale: es }) : '...'}`
                        : 'Seleccionar fechas'
                      }
                    </button>
                  </div>
                  
                  {advancedFilters.showDatePicker && (
                    <div className="absolute z-50 mt-2 bg-white border border-gray-300 rounded-lg shadow-lg p-3">
                      <DayPicker
                        mode="range"
                        selected={advancedFilters.dateRange}
                        onSelect={(range) => {
                          updateAdvancedFilters({ 
                            dateRange: range
                          });
                        }}
                        locale={es}
                        className="text-sm"
                      />
                      <div className="flex gap-2 mt-3">
                        <button
                          onClick={() => updateAdvancedFilters({ 
                            dateRange: undefined,
                            showDatePicker: false
                          })}
                          className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded"
                        >
                          Limpiar
                        </button>
                        <button
                          onClick={() => updateAdvancedFilters({ showDatePicker: false })}
                          className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
                        >
                          Cerrar
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Botón "Marcar todas como leídas" */}
              <div className="flex justify-between items-center mt-4">
                {/* Resumen de filtros activos */}
                <div className="flex flex-wrap gap-2">
                  {advancedFilters.searchTerm && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                      Texto: "{advancedFilters.searchTerm}"
                    </span>
                  )}
                  {advancedFilters.selectedUser && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                      Usuario: {advancedFilters.selectedUser.full_name}
                    </span>
                  )}
                  {(advancedFilters.dateRange?.from || advancedFilters.dateRange?.to) && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-purple-100 text-purple-800">
                      Fechas: {advancedFilters.dateRange?.from ? format(advancedFilters.dateRange.from, 'dd/MM/yyyy', { locale: es }) : '...'} - {advancedFilters.dateRange?.to ? format(advancedFilters.dateRange.to, 'dd/MM/yyyy', { locale: es }) : '...'}
                    </span>
                  )}
                  {filterType !== 'all' && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-800">
                      Tipo: {getTypeLabel(filterType)}
                    </span>
                  )}
                  {filterRead !== 'all' && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-orange-100 text-orange-800">
                      Estado: {filterRead === 'unread' ? 'No leídas' : 'Leídas'}
                    </span>
                  )}
                </div>

                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700 flex items-center gap-2"
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
                      {notification.user_full_name && (
                        <div className="flex items-center gap-2 mb-2 text-sm text-gray-700">
                          <span className="font-medium">Creador:</span>
                          <span>{notification.user_full_name}</span>
                          {notification.user_email && (
                            <span className="text-gray-500">({notification.user_email})</span>
                          )}
                        </div>
                      )}
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
                  <p className="text-gray-500">
                    {notifications.length === 0 ? 'No hay notificaciones' : 'No se encontraron notificaciones con los filtros aplicados'}
                  </p>
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
