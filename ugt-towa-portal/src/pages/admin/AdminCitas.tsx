import React, { useEffect, useState, useMemo, useRef } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { supabase, Appointment } from '@/lib/supabase';
import { toast } from 'sonner';
import { Bell, CheckCircle, XCircle, Calendar, Clock, Filter, TrendingUp, AlertCircle, Search, User, RefreshCcw, BarChart3, Users, Target, Activity, Settings, Plus, Minus, Edit3, Save, X, Download, FileText, FileSpreadsheet, CalendarDays, Clock3, TrendingDown, Mail } from 'lucide-react';
import { DayPicker, DateRange } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { format, parseISO, isWithinInterval, startOfDay, endOfDay, getHours, subDays, eachDayOfInterval, startOfMonth, endOfMonth, startOfWeek, endOfWeek } from 'date-fns';
import { es } from 'date-fns/locale';
import { 
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

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

interface DailyStats {
  date: string;
  appointments: number;
}

interface PeakHours {
  hour: number;
  count: number;
}

interface UserStats {
  id: string;
  full_name: string;
  email: string;
  appointment_count: number;
  last_appointment: string;
}

interface AttendanceRate {
  completed: number;
  total: number;
  percentage: number;
}

interface ConfirmationRate {
  confirmed: number;
  pending: number;
  percentage: number;
}

interface AppointmentConfig {
  id: number;
  user_id: string;
  reminder_24h: boolean;
  reminder_2h: boolean;
  custom_reminder: boolean;
  preferred_start_time: string | null;
  preferred_end_time: string | null;
  preferred_days: string[];
  admin_users: string[];
  notification_templates: {
    confirmation_subject: string;
    confirmation_body: string;
    cancellation_subject: string;
    cancellation_body: string;
    reminder_subject: string;
    reminder_body: string;
  };
  alert_settings: {
    email_notifications: boolean;
    browser_notifications: boolean;
    reminder_notifications: boolean;
    status_change_notifications: boolean;
  };
}

interface NotificationTemplate {
  name: string;
  subject: string;
  body: string;
}

interface AlertSetting {
  name: string;
  enabled: boolean;
  description: string;
}

interface ReportFilters {
  period: 'all' | 'week' | 'month' | 'quarter' | 'year' | 'custom';
  startDate?: Date;
  endDate?: Date;
  exportType: 'csv' | 'excel' | 'pdf';
  includeCharts: boolean;
  userReport: boolean;
  attendanceReport: boolean;
  notificationReport: boolean;
}

interface AttendanceReport {
  user_id: string;
  user_name: string;
  user_email: string;
  total_appointments: number;
  completed_appointments: number;
  cancelled_appointments: number;
  pending_appointments: number;
  attendance_rate: number;
  last_appointment: string;
  period_start: string;
  period_end: string;
}

interface NotificationExport {
  id: string;
  type: string;
  title: string;
  message: string;
  user_full_name: string;
  user_email: string;
  delegate_type: string;
  created_at: string;
  read: boolean;
  appointment_time: string;
}

interface AppointmentExport {
  id: string;
  start_time: string;
  delegate_type: string;
  status: string;
  user_name: string;
  user_email: string;
  created_at: string;
}

interface ReportSummary {
  total_appointments: number;
  total_notifications: number;
  total_users: number;
  average_attendance_rate: number;
  top_delegate_type: string;
  period_description: string;
}

export default function AdminCitas() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [stats, setStats] = useState<AppointmentStats>({ today: 0, upcoming: 0, pending: 0, completed: 0 });
  const [filterType, setFilterType] = useState<string>('all');
  const [filterRead, setFilterRead] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<'appointments' | 'notifications' | 'stats' | 'config'>('appointments');
  
  // Estados para filtros avanzados
  const [users, setUsers] = useState<UserOption[]>([]);
  const [advancedFilters, setAdvancedFilters] = useState<AdvancedFilters>({
    searchTerm: '',
    selectedUser: null,
    dateRange: undefined,
    timeFilter: 'all',
    showDatePicker: false
  });

  // Estados para estadísticas mejoradas
  const [dailyStats, setDailyStats] = useState<DailyStats[]>([]);
  const [peakHours, setPeakHours] = useState<PeakHours[]>([]);
  const [userStats, setUserStats] = useState<UserStats[]>([]);
  const [attendanceRate, setAttendanceRate] = useState<AttendanceRate>({ completed: 0, total: 0, percentage: 0 });
  const [confirmationRate, setConfirmationRate] = useState<ConfirmationRate>({ confirmed: 0, pending: 0, percentage: 0 });

  // Estados para configuración
  const [config, setConfig] = useState<AppointmentConfig | null>(null);
  const [configLoading, setConfigLoading] = useState<boolean>(false);
  const [editingTemplate, setEditingTemplate] = useState<string | null>(null);
  const [newAdminEmail, setNewAdminEmail] = useState<string>('');
  const [showAddAdmin, setShowAddAdmin] = useState<boolean>(false);

  // Estados para exportación y reportes
  const [showExportModal, setShowExportModal] = useState<boolean>(false);
  const [reportFilters, setReportFilters] = useState<ReportFilters>({
    period: 'month',
    exportType: 'excel',
    includeCharts: true,
    userReport: false,
    attendanceReport: true,
    notificationReport: true
  });
  const [exporting, setExporting] = useState<boolean>(false);
  const [attendanceReportData, setAttendanceReportData] = useState<AttendanceReport[]>([]);
  const [reportSummary, setReportSummary] = useState<ReportSummary | null>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const appointmentsRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadAppointments();
    loadNotifications();
    loadUsers();
    calculateStats();
    loadAdvancedStats();
    loadConfig();

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
    const { data } = await supabase
      .from('appointments')
      .select('*, user:profiles(id, full_name, email)')
      .order('start_time');
    if (data) setAppointments(data as any);
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

  async function loadAdvancedStats() {
    // Cargar estadísticas de los últimos 30 días
    const thirtyDaysAgo = subDays(new Date(), 30);
    const today = new Date();
    
    const { data: appointmentsLast30Days } = await supabase
      .from('appointments')
      .select('start_time, status, user_id')
      .gte('start_time', thirtyDaysAgo.toISOString())
      .lte('start_time', today.toISOString());

    // Obtener perfiles de usuarios separately
    const { data: allAppointmentsWithProfiles } = await supabase
      .from('appointments')
      .select(`
        start_time, 
        status, 
        user_id,
        profiles!appointments_user_id_fkey(full_name, email)
      `)
      .gte('start_time', thirtyDaysAgo.toISOString())
      .lte('start_time', today.toISOString());

    if (allAppointmentsWithProfiles) {
      // Generar datos para gráfico de líneas (citas por día)
      const dateInterval = eachDayOfInterval({
        start: thirtyDaysAgo,
        end: today
      });

      const dailyData: DailyStats[] = dateInterval.map(date => {
        const dateString = format(date, 'yyyy-MM-dd');
        const dayAppointments = allAppointmentsWithProfiles.filter(apt => 
          format(parseISO(apt.start_time), 'yyyy-MM-dd') === dateString
        );
        
        return {
          date: format(date, 'dd/MM'),
          appointments: dayAppointments.length
        };
      });

      setDailyStats(dailyData);

      // Generar datos para horarios pico
      const hoursCount: { [key: number]: number } = {};
      allAppointmentsWithProfiles.forEach(apt => {
        const hour = getHours(parseISO(apt.start_time));
        hoursCount[hour] = (hoursCount[hour] || 0) + 1;
      });

      const peakHoursData: PeakHours[] = [];
      for (let hour = 8; hour <= 20; hour++) {
        peakHoursData.push({
          hour,
          count: hoursCount[hour] || 0
        });
      }
      setPeakHours(peakHoursData);

      // Calcular usuarios más activos
      const userCounts: { [key: string]: { count: number; name: string; email: string; lastAppointment: string } } = {};
      
      allAppointmentsWithProfiles.forEach((apt: any) => {
        const userId = apt.user_id;
        const profile = apt.profiles;
        
        if (userId && profile && Array.isArray(profile) && profile.length > 0) {
          const profileData = profile[0];
          if (!userCounts[userId]) {
            userCounts[userId] = {
              count: 0,
              name: profileData.full_name || 'Sin nombre',
              email: profileData.email,
              lastAppointment: apt.start_time
            };
          }
          userCounts[userId].count++;
          
          // Actualizar última cita si esta es más reciente
          if (apt.start_time > userCounts[userId].lastAppointment) {
            userCounts[userId].lastAppointment = apt.start_time;
          }
        }
      });

      const topUsers: UserStats[] = Object.entries(userCounts)
        .map(([id, data]) => ({
          id,
          full_name: data.name,
          email: data.email,
          appointment_count: data.count,
          last_appointment: data.lastAppointment
        }))
        .sort((a, b) => b.appointment_count - a.appointment_count)
        .slice(0, 5);

      setUserStats(topUsers);

      // Calcular porcentaje de asistencia
      const { count: completedCount } = await supabase
        .from('appointments')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'completed');

      const { count: totalCount } = await supabase
        .from('appointments')
        .select('*', { count: 'exact', head: true });

      const completed = completedCount || 0;
      const total = totalCount || 0;
      const attendancePercentage = total > 0 ? Math.round((completed / total) * 100) : 0;

      setAttendanceRate({
        completed,
        total,
        percentage: attendancePercentage
      });

      // Calcular tasa de confirmación
      const { count: confirmedCount } = await supabase
        .from('appointments')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'confirmed');

      const { count: pendingCount } = await supabase
        .from('appointments')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending');

      const confirmed = confirmedCount || 0;
      const pending = pendingCount || 0;
      const confirmationPercentage = (confirmed + pending) > 0 ? Math.round((confirmed / (confirmed + pending)) * 100) : 0;

      setConfirmationRate({
        confirmed,
        pending,
        percentage: confirmationPercentage
      });
    }
  }

  // Funciones para configuración
  async function loadConfig() {
    setConfigLoading(true);
    const { data } = await supabase.from('appointments_config').select('*').limit(1).single();
    if (data) {
      setConfig(data);
    } else {
      // Crear configuración por defecto
      const defaultConfig: AppointmentConfig = {
        id: 0,
        user_id: 'default',
        reminder_24h: true,
        reminder_2h: true,
        custom_reminder: false,
        preferred_start_time: null,
        preferred_end_time: null,
        preferred_days: [],
        admin_users: [],
        notification_templates: {
          confirmation_subject: 'Confirmación de Cita - UGT TOWA',
          confirmation_body: 'Su cita ha sido confirmada para el {{fecha}} a las {{hora}}.',
          cancellation_subject: 'Cancelación de Cita - UGT TOWA',
          cancellation_body: 'Su cita programada para el {{fecha}} a las {{hora}} ha sido cancelada.',
          reminder_subject: 'Recordatorio de Cita - UGT TOWA',
          reminder_body: 'Le recordamos que tiene una cita programada para el {{fecha}} a las {{hora}}.'
        },
        alert_settings: {
          email_notifications: true,
          browser_notifications: true,
          reminder_notifications: true,
          status_change_notifications: true
        }
      };
      setConfig(defaultConfig);
    }
    setConfigLoading(false);
  }

  async function saveConfig() {
    if (!config) return;
    
    setConfigLoading(true);
    const { error } = await supabase.from('appointments_config').upsert({
      id: config.id,
      user_id: config.user_id,
      reminder_24h: config.reminder_24h,
      reminder_2h: config.reminder_2h,
      custom_reminder: config.custom_reminder,
      preferred_start_time: config.preferred_start_time,
      preferred_end_time: config.preferred_end_time,
      preferred_days: config.preferred_days,
      admin_users: config.admin_users,
      notification_templates: config.notification_templates,
      alert_settings: config.alert_settings,
      updated_at: new Date().toISOString()
    });

    if (error) {
      toast.error('Error al guardar la configuración');
    } else {
      toast.success('Configuración guardada correctamente');
      loadConfig();
    }
    setConfigLoading(false);
  }

  function updateConfig(field: keyof AppointmentConfig, value: any) {
    if (!config) return;
    setConfig({ ...config, [field]: value });
  }

  function updateNotificationTemplate(templateType: keyof AppointmentConfig['notification_templates'], field: 'subject' | 'body', value: string) {
    if (!config) return;
    const currentTemplate = config.notification_templates[templateType];
    const templateObj = (currentTemplate as any) as { subject: string; body: string };
    
    setConfig({
      ...config,
      notification_templates: {
        ...config.notification_templates,
        [templateType]: {
          subject: templateObj.subject,
          body: templateObj.body,
          [field]: value
        }
      }
    });
  }

  function updateAlertSetting(setting: keyof AppointmentConfig['alert_settings'], value: boolean) {
    if (!config) return;
    setConfig({
      ...config,
      alert_settings: {
        ...config.alert_settings,
        [setting]: value
      }
    });
  }

  async function addAdminUser() {
    if (!config || !newAdminEmail) return;
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newAdminEmail)) {
      toast.error('Por favor, introduce un email válido');
      return;
    }

    if (config.admin_users.includes(newAdminEmail)) {
      toast.error('Este usuario ya es administrador');
      return;
    }

    const updatedAdmins = [...config.admin_users, newAdminEmail];
    updateConfig('admin_users', updatedAdmins);
    setNewAdminEmail('');
    setShowAddAdmin(false);
    toast.success('Administrador añadido');
  }

  function removeAdminUser(email: string) {
    if (!config) return;
    const updatedAdmins = config.admin_users.filter(admin => admin !== email);
    updateConfig('admin_users', updatedAdmins);
    toast.success('Administrador eliminado');
  }

  const daysOfWeek = [
    { value: 'monday', label: 'Lunes' },
    { value: 'tuesday', label: 'Martes' },
    { value: 'wednesday', label: 'Miércoles' },
    { value: 'thursday', label: 'Jueves' },
    { value: 'friday', label: 'Viernes' },
    { value: 'saturday', label: 'Sábado' },
    { value: 'sunday', label: 'Domingo' }
  ];

  // Funciones de exportación de datos
  const exportToCSV = (data: any[], filename: string) => {
    const csvContent = convertToCSV(data);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const convertToCSV = (data: any[]): string => {
    if (data.length === 0) return '';
    
    const headers = Object.keys(data[0]);
    const csvRows = [
      headers.join(','),
      ...data.map(row => 
        headers.map(header => {
          const value = row[header];
          if (value === null || value === undefined) return '';
          return typeof value === 'string' ? `"${value.replace(/"/g, '""')}"` : value;
        }).join(',')
      )
    ];
    
    return csvRows.join('\n');
  };

  const exportToExcel = (data: any[], filename: string, sheetName: string = 'Datos') => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
    XLSX.writeFile(workbook, filename);
  };

  const exportNotificationsToExcel = async () => {
    setExporting(true);
    try {
      const notificationsToExport: NotificationExport[] = filteredNotifications.map(notif => ({
        id: notif.id,
        type: getTypeLabel(notif.type),
        title: notif.title,
        message: notif.message,
        user_full_name: notif.user_full_name || 'Sin usuario',
        user_email: notif.user_email || 'Sin email',
        delegate_type: notif.delegate_type || 'Sin tipo',
        created_at: format(parseISO(notif.created_at), 'dd/MM/yyyy HH:mm', { locale: es }),
        read: notif.read,
        appointment_time: notif.appointment_time 
          ? format(parseISO(notif.appointment_time), 'dd/MM/yyyy HH:mm', { locale: es })
          : 'Sin fecha'
      }));

      const filename = `notificaciones_${format(new Date(), 'yyyy-MM-dd')}.xlsx`;
      exportToExcel(notificationsToExport, filename, 'Notificaciones');
      toast.success('Notificaciones exportadas a Excel');
    } catch (error) {
      toast.error('Error al exportar notificaciones');
      console.error('Export error:', error);
    } finally {
      setExporting(false);
    }
  };

  const exportAppointmentsToExcel = async () => {
    setExporting(true);
    try {
      const appointmentsToExport: AppointmentExport[] = filteredAppointments.map(apt => {
        const user = users.find(u => u.id === apt.user_id);
        return {
          id: apt.id,
          start_time: format(parseISO(apt.start_time), 'dd/MM/yyyy HH:mm', { locale: es }),
          delegate_type: apt.delegate_type || 'Sin tipo',
          status: apt.status,
          user_name: user?.full_name || 'Sin usuario',
          user_email: user?.email || 'Sin email',
          created_at: format(parseISO(apt.created_at), 'dd/MM/yyyy HH:mm', { locale: es })
        };
      });

      const filename = `citas_${format(new Date(), 'yyyy-MM-dd')}.xlsx`;
      exportToExcel(appointmentsToExport, filename, 'Citas');
      toast.success('Citas exportadas a Excel');
    } catch (error) {
      toast.error('Error al exportar citas');
      console.error('Export error:', error);
    } finally {
      setExporting(false);
    }
  };

  const exportToPDF = async () => {
    setExporting(true);
    try {
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      
      // Configurar fuentes
      pdf.setFont('helvetica');
      
      // Encabezado
      pdf.setFontSize(20);
      pdf.setTextColor(220, 38, 38); // Red-600
      pdf.text('UGT TOWA - Reporte de Citas', pageWidth / 2, 20, { align: 'center' });
      
      pdf.setFontSize(12);
      pdf.setTextColor(0, 0, 0);
      const dateText = `Generado el: ${format(new Date(), 'dd/MM/yyyy HH:mm', { locale: es })}`;
      pdf.text(dateText, pageWidth / 2, 30, { align: 'center' });
      
      let yPosition = 45;
      
      // Resumen de estadísticas
      pdf.setFontSize(16);
      pdf.setTextColor(37, 99, 235); // Blue-600
      pdf.text('Resumen Estadístico', 20, yPosition);
      yPosition += 10;
      
      pdf.setFontSize(12);
      pdf.setTextColor(0, 0, 0);
      const summaryData = [
        `Total de Citas: ${stats.today + stats.upcoming + stats.pending + stats.completed}`,
        `Citas de Hoy: ${stats.today}`,
        `Próximas Citas (7 días): ${stats.upcoming}`,
        `Citas Pendientes: ${stats.pending}`,
        `Citas Completadas: ${stats.completed}`,
        `Tasa de Asistencia: ${attendanceRate.percentage}%`,
        `Tasa de Confirmación: ${confirmationRate.percentage}%`
      ];
      
      summaryData.forEach((line, index) => {
        pdf.text(line, 20, yPosition + (index * 7));
      });
      yPosition += summaryData.length * 7 + 15;
      
      // Top usuarios
      if (userStats.length > 0) {
        pdf.setFontSize(16);
        pdf.setTextColor(37, 99, 235);
        pdf.text('Top 5 Usuarios Más Activos', 20, yPosition);
        yPosition += 10;
        
        pdf.setFontSize(10);
        pdf.setTextColor(0, 0, 0);
        pdf.text('Usuario', 20, yPosition);
        pdf.text('Citas', 120, yPosition);
        pdf.text('Última Cita', 150, yPosition);
        yPosition += 5;
        pdf.line(20, yPosition, 180, yPosition);
        yPosition += 5;
        
        userStats.forEach((user, index) => {
          if (yPosition > 250) {
            pdf.addPage();
            yPosition = 20;
          }
          pdf.text(`${index + 1}. ${user.full_name}`, 20, yPosition);
          pdf.text(`${user.appointment_count}`, 120, yPosition);
          pdf.text(format(parseISO(user.last_appointment), 'dd/MM/yyyy', { locale: es }), 150, yPosition);
          yPosition += 7;
        });
        yPosition += 10;
      }
      
      // Capturar y añadir gráficos si está habilitado
      if (reportFilters.includeCharts && statsRef.current) {
        try {
          const canvas = await html2canvas(statsRef.current, {
            scale: 1,
            useCORS: true,
            allowTaint: true
          });
          
          if (yPosition > 200) {
            pdf.addPage();
            yPosition = 20;
          }
          
          pdf.setFontSize(16);
          pdf.setTextColor(37, 99, 235);
          pdf.text('Gráficos Estadísticos', 20, yPosition);
          yPosition += 10;
          
          const imgData = canvas.toDataURL('image/png');
          const imgWidth = 160;
          const imgHeight = (canvas.height * imgWidth) / canvas.width;
          
          pdf.addImage(imgData, 'PNG', 20, yPosition, imgWidth, imgHeight);
        } catch (error) {
          console.error('Error capturing charts:', error);
        }
      }
      
      // Pie de página
      const pageCount = pdf.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        pdf.setPage(i);
        pdf.setFontSize(8);
        pdf.setTextColor(128, 128, 128);
        pdf.text(`UGT TOWA - Reporte de Citas - Página ${i} de ${pageCount}`, pageWidth / 2, pageHeight - 10, { align: 'center' });
      }
      
      const filename = `reporte_citas_${format(new Date(), 'yyyy-MM-dd')}.pdf`;
      pdf.save(filename);
      toast.success('PDF generado correctamente');
    } catch (error) {
      toast.error('Error al generar PDF');
      console.error('PDF generation error:', error);
    } finally {
      setExporting(false);
    }
  };

  const calculateReportPeriod = () => {
    const now = new Date();
    let startDate: Date;
    let endDate = now;
    let description = '';

    switch (reportFilters.period) {
      case 'week':
        startDate = startOfWeek(now, { locale: es });
        description = `Semana del ${format(startDate, 'dd/MM/yyyy')} al ${format(endDate, 'dd/MM/yyyy')}`;
        break;
      case 'month':
        startDate = startOfMonth(now);
        endDate = endOfMonth(now);
        description = `Mes de ${format(now, 'MMMM yyyy', { locale: es })}`;
        break;
      case 'quarter':
        const quarter = Math.floor(now.getMonth() / 3) + 1;
        startDate = new Date(now.getFullYear(), (quarter - 1) * 3, 1);
        endDate = new Date(now.getFullYear(), quarter * 3, 0);
        description = `Q${quarter} ${now.getFullYear()}`;
        break;
      case 'year':
        startDate = new Date(now.getFullYear(), 0, 1);
        endDate = new Date(now.getFullYear(), 11, 31);
        description = `Año ${now.getFullYear()}`;
        break;
      case 'custom':
        if (reportFilters.startDate && reportFilters.endDate) {
          startDate = reportFilters.startDate;
          endDate = reportFilters.endDate;
          description = `Del ${format(startDate, 'dd/MM/yyyy')} al ${format(endDate, 'dd/MM/yyyy')}`;
        } else {
          startDate = subDays(now, 30);
          description = 'Últimos 30 días';
        }
        break;
      default:
        startDate = subDays(now, 30);
        description = 'Últimos 30 días';
    }

    return { startDate, endDate, description };
  };

  const generateAttendanceReport = async () => {
    setExporting(true);
    try {
      const { startDate, endDate, description } = calculateReportPeriod();
      
      // Obtener citas del período
      const { data: appointmentsInPeriod } = await supabase
        .from('appointments')
        .select(`
          id, 
          start_time, 
          status, 
          user_id,
          profiles!appointments_user_id_fkey(full_name, email)
        `)
        .gte('start_time', startDate.toISOString())
        .lte('start_time', endDate.toISOString());

      if (appointmentsInPeriod) {
        // Calcular estadísticas por usuario
        const userStatsMap = new Map<string, {
          user_id: string;
          user_name: string;
          user_email: string;
          total: number;
          completed: number;
          cancelled: number;
          pending: number;
          last_appointment: string;
        }>();

        appointmentsInPeriod.forEach((apt: any) => {
          const userId = apt.user_id;
          const profile = apt.profiles;
          
          if (userId && profile && Array.isArray(profile) && profile.length > 0) {
            const profileData = profile[0];
            
            if (!userStatsMap.has(userId)) {
              userStatsMap.set(userId, {
                user_id: userId,
                user_name: profileData.full_name || 'Sin nombre',
                user_email: profileData.email || 'Sin email',
                total: 0,
                completed: 0,
                cancelled: 0,
                pending: 0,
                last_appointment: apt.start_time
              });
            }
            
            const userStat = userStatsMap.get(userId)!;
            userStat.total++;
            
            if (apt.status === 'completed') {
              userStat.completed++;
            } else if (apt.status === 'cancelled') {
              userStat.cancelled++;
            } else {
              userStat.pending++;
            }
            
            if (apt.start_time > userStat.last_appointment) {
              userStat.last_appointment = apt.start_time;
            }
          }
        });

        // Convertir a array y calcular tasas
        const attendanceReports: AttendanceReport[] = Array.from(userStatsMap.values()).map(userStat => ({
          user_id: userStat.user_id,
          user_name: userStat.user_name,
          user_email: userStat.user_email,
          total_appointments: userStat.total,
          completed_appointments: userStat.completed,
          cancelled_appointments: userStat.cancelled,
          pending_appointments: userStat.pending,
          attendance_rate: userStat.total > 0 ? Math.round((userStat.completed / userStat.total) * 100) : 0,
          last_appointment: userStat.last_appointment,
          period_start: startDate.toISOString(),
          period_end: endDate.toISOString()
        }));

        setAttendanceReportData(attendanceReports);
        
        // Calcular resumen
        const totalAppointments = appointmentsInPeriod.length;
        const totalNotifications = notifications.length;
        const totalUsers = userStatsMap.size;
        const avgAttendanceRate = attendanceReports.length > 0 
          ? Math.round(attendanceReports.reduce((sum, report) => sum + report.attendance_rate, 0) / attendanceReports.length)
          : 0;
        
        // Tipo de cita más popular
        const typeCount: { [key: string]: number } = {};
        appointmentsInPeriod.forEach((apt: any) => {
          const type = apt.delegate_type || 'Sin tipo';
          typeCount[type] = (typeCount[type] || 0) + 1;
        });
        const topType = Object.entries(typeCount).sort(([,a], [,b]) => b - a)[0]?.[0] || 'Sin datos';

        setReportSummary({
          total_appointments: totalAppointments,
          total_notifications: totalNotifications,
          total_users: totalUsers,
          average_attendance_rate: avgAttendanceRate,
          top_delegate_type: topType,
          period_description: description
        });
      }
      
      toast.success('Reporte de asistencia generado');
    } catch (error) {
      toast.error('Error al generar reporte de asistencia');
      console.error('Attendance report error:', error);
    } finally {
      setExporting(false);
    }
  };

  const exportCompleteReport = async () => {
    setExporting(true);
    try {
      const { startDate, endDate } = calculateReportPeriod();
      
      // Generar reporte de asistencia si no existe
      if (attendanceReportData.length === 0) {
        await generateAttendanceReport();
      }
      
      // Crear libro de Excel con múltiples hojas
      const workbook = XLSX.utils.book_new();
      
      // Hoja 1: Resumen
      if (reportSummary) {
        const summaryData = [
          { Métrica: 'Período', Valor: reportSummary.period_description },
          { Métrica: 'Total de Citas', Valor: reportSummary.total_appointments },
          { Métrica: 'Total de Notificaciones', Valor: reportSummary.total_notifications },
          { Métrica: 'Total de Usuarios Activos', Valor: reportSummary.total_users },
          { Métrica: 'Tasa de Asistencia Promedio', Valor: `${reportSummary.average_attendance_rate}%` },
          { Métrica: 'Tipo de Cita Más Popular', Valor: reportSummary.top_delegate_type }
        ];
        const summarySheet = XLSX.utils.json_to_sheet(summaryData);
        XLSX.utils.book_append_sheet(workbook, summarySheet, 'Resumen');
      }
      
      // Hoja 2: Reporte de Asistencia
      if (attendanceReportData.length > 0) {
        const attendanceSheet = XLSX.utils.json_to_sheet(attendanceReportData);
        XLSX.utils.book_append_sheet(workbook, attendanceSheet, 'Asistencia por Usuario');
      }
      
      // Hoja 3: Notificaciones
      if (reportFilters.notificationReport) {
        const notificationsData = filteredNotifications.map(notif => ({
          ID: notif.id,
          Tipo: getTypeLabel(notif.type),
          Título: notif.title,
          Mensaje: notif.message,
          Usuario: notif.user_full_name || 'Sin usuario',
          Email: notif.user_email || 'Sin email',
          'Fecha Creación': format(parseISO(notif.created_at), 'dd/MM/yyyy HH:mm', { locale: es }),
          Leída: notif.read ? 'Sí' : 'No',
          'Tipo Cita': notif.delegate_type || 'Sin tipo'
        }));
        const notificationsSheet = XLSX.utils.json_to_sheet(notificationsData);
        XLSX.utils.book_append_sheet(workbook, notificationsSheet, 'Notificaciones');
      }
      
      // Hoja 4: Citas
      if (reportFilters.userReport) {
        const appointmentsData = filteredAppointments.map(apt => {
          const user = users.find(u => u.id === apt.user_id);
          return {
            ID: apt.id,
            Fecha: format(parseISO(apt.start_time), 'dd/MM/yyyy HH:mm', { locale: es }),
            'Tipo Cita': apt.delegate_type || 'Sin tipo',
            Estado: apt.status,
            Usuario: user?.full_name || 'Sin usuario',
            Email: user?.email || 'Sin email',
            'Fecha Creación': format(parseISO(apt.created_at), 'dd/MM/yyyy HH:mm', { locale: es })
          };
        });
        const appointmentsSheet = XLSX.utils.json_to_sheet(appointmentsData);
        XLSX.utils.book_append_sheet(workbook, appointmentsSheet, 'Citas');
      }
      
      const filename = `reporte_completo_${format(new Date(), 'yyyy-MM-dd')}.xlsx`;
      XLSX.writeFile(workbook, filename);
      toast.success('Reporte completo exportado a Excel');
    } catch (error) {
      toast.error('Error al exportar reporte completo');
      console.error('Complete report error:', error);
    } finally {
      setExporting(false);
    }
  };

  const alertSettings: AlertSetting[] = [
    { name: 'email_notifications', enabled: config?.alert_settings?.email_notifications || false, description: 'Notificaciones por email' },
    { name: 'browser_notifications', enabled: config?.alert_settings?.browser_notifications || false, description: 'Notificaciones en el navegador' },
    { name: 'reminder_notifications', enabled: config?.alert_settings?.reminder_notifications || false, description: 'Recordatorios de citas' },
    { name: 'status_change_notifications', enabled: config?.alert_settings?.status_change_notifications || false, description: 'Cambios de estado' }
  ];

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
              onClick={() => setActiveTab('stats')}
              className={`pb-4 px-1 border-b-2 font-medium text-sm flex items-center ${
                activeTab === 'stats'
                  ? 'border-red-600 text-red-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              Estadísticas
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
            <button
              onClick={() => setActiveTab('config')}
              className={`pb-4 px-1 border-b-2 font-medium text-sm flex items-center ${
                activeTab === 'config'
                  ? 'border-red-600 text-red-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Settings className="w-4 h-4 mr-2" />
              Configuración
            </button>
          </div>
          
          {/* Botones de Exportación */}
          <div className="flex justify-end mt-4 space-x-3">
            <button
              onClick={() => setShowExportModal(true)}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 text-sm"
            >
              <Download className="w-4 h-4" />
              Exportar Datos
            </button>
            <button
              onClick={exportToPDF}
              disabled={exporting}
              className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 disabled:bg-gray-400 text-sm"
            >
              {exporting ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <FileText className="w-4 h-4" />
              )}
              {exporting ? 'Generando...' : 'PDF Reporte'}
            </button>
            <button
              onClick={exportCompleteReport}
              disabled={exporting}
              className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:bg-gray-400 text-sm"
            >
              {exporting ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <FileSpreadsheet className="w-4 h-4" />
              )}
              {exporting ? 'Generando...' : 'Reporte Completo'}
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

            {/* Botones de exportación para citas */}
            <div className="flex justify-end space-x-3 mb-4">
              <button
                onClick={exportAppointmentsToExcel}
                disabled={exporting || filteredAppointments.length === 0}
                className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:bg-gray-400 text-sm"
              >
                <FileSpreadsheet className="w-4 h-4" />
                {exporting ? 'Exportando...' : 'Exportar a Excel'}
              </button>
              <button
                onClick={() => {
                  const dataToExport = filteredAppointments.map(apt => {
                    const user = users.find(u => u.id === apt.user_id);
                    return {
                      Fecha: new Date(apt.start_time).toLocaleString('es-ES'),
                      Tipo: apt.delegate_type || 'Sin tipo',
                      Estado: apt.status,
                      Usuario: user?.full_name || 'Sin usuario',
                      Email: user?.email || 'Sin email'
                    };
                  });
                  exportToCSV(dataToExport, `citas_${format(new Date(), 'yyyy-MM-dd')}.csv`);
                }}
                disabled={exporting || filteredAppointments.length === 0}
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:bg-gray-400 text-sm"
              >
                <Download className="w-4 h-4" />
                Exportar CSV
              </button>
            </div>

            <div className="bg-white rounded-lg shadow space-y-4 p-4">
              {filteredAppointments.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  {appointments.length === 0 ? 'No hay citas registradas' : 'No se encontraron citas con los filtros aplicados'}
                </div>
              ) : (
                filteredAppointments.map(apt => (
                  <div key={apt.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Fecha y Hora</p>
                        <p className="font-semibold">{new Date(apt.start_time).toLocaleString('es-ES')}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Tipo de Delegado</p>
                        <p className="font-semibold capitalize">{apt.delegate_type}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Estado</p>
                        <select 
                          value={apt.status} 
                          onChange={e => updateStatus(apt.id, e.target.value)} 
                          className="px-3 py-1 border border-gray-300 rounded-md text-sm font-semibold"
                        >
                          <option value="pending">Pendiente</option>
                          <option value="confirmed">Confirmada</option>
                          <option value="cancelled">Cancelada</option>
                          <option value="completed">Completada</option>
                        </select>
                      </div>
                    </div>

                    {apt.user && (
                      <div className="bg-blue-50 p-4 rounded-lg mb-4">
                        <p className="text-xs text-blue-600 font-semibold mb-2">RESERVADO POR</p>
                        <div className="flex items-center gap-2">
                          <User className="h-5 w-5 text-blue-600" />
                          <div>
                            <p className="font-semibold text-gray-900">{apt.user.full_name || 'Sin nombre'}</p>
                            <p className="text-sm text-gray-600">{apt.user.email}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {apt.comments && (
                      <div className="bg-gray-50 p-4 rounded-lg mb-4">
                        <p className="text-xs text-gray-600 font-semibold mb-2">COMENTARIOS</p>
                        <p className="text-sm text-gray-700">{apt.comments}</p>
                      </div>
                    )}

                    {apt.questions && (
                      <div className="bg-yellow-50 p-4 rounded-lg mb-4">
                        <p className="text-xs text-yellow-700 font-semibold mb-2">PREGUNTAS / TEMAS A TRATAR</p>
                        <p className="text-sm text-gray-700">{apt.questions}</p>
                      </div>
                    )}

                    {apt.documents && apt.documents.length > 0 && (
                      <div className="bg-green-50 p-4 rounded-lg">
                        <p className="text-xs text-green-700 font-semibold mb-3">DOCUMENTOS ADJUNTOS ({apt.documents.length})</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {apt.documents.map((doc: any, idx: number) => (
                            <a
                              key={idx}
                              href={doc.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 p-2 bg-white rounded border border-green-200 hover:bg-green-100 transition text-sm"
                            >
                              <FileText className="h-4 w-4 text-green-600 flex-shrink-0" />
                              <div className="flex-1 min-w-0">
                                <p className="font-medium text-gray-900 truncate">{doc.fileName}</p>
                                <p className="text-xs text-gray-500">
                                  {(doc.fileSize / 1024).toFixed(1)} KB
                                </p>
                              </div>
                              <Download className="h-4 w-4 text-green-600 flex-shrink-0" />
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        ) : activeTab === 'stats' ? (
          <div>
            {/* Estadísticas y Gráficos */}
            <div ref={statsRef} className="space-y-6">
              {/* Botones de exportación para estadísticas */}
              <div className="flex justify-end space-x-3">
                <button
                  onClick={generateAttendanceReport}
                  disabled={exporting}
                  className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 disabled:bg-gray-400 text-sm"
                >
                  {exporting ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  ) : (
                    <Users className="w-4 h-4" />
                  )}
                  {exporting ? 'Generando...' : 'Reporte de Asistencia'}
                </button>
              </div>

              {/* Métricas de Rendimiento */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Porcentaje de Asistencia */}
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Porcentaje de Asistencia</h3>
                    <Target className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="text-center">
                    <div className="relative w-32 h-32 mx-auto mb-4">
                      <Doughnut 
                        data={{
                          datasets: [{
                            data: [attendanceRate.percentage, 100 - attendanceRate.percentage],
                            backgroundColor: ['#3b82f6', '#e5e7eb'],
                            borderWidth: 0,
                          }]
                        }}
                        options={{
                          cutout: '80%',
                          plugins: {
                            legend: { display: false },
                            tooltip: { enabled: false }
                          }
                        }}
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-2xl font-bold text-gray-900">{attendanceRate.percentage}%</span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">
                      {attendanceRate.completed} de {attendanceRate.total} citas completadas
                    </p>
                  </div>
                </div>

                {/* Tasa de Confirmación */}
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Tasa de Confirmación</h3>
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="text-center">
                    <div className="relative w-32 h-32 mx-auto mb-4">
                      <Doughnut 
                        data={{
                          datasets: [{
                            data: [confirmationRate.percentage, 100 - confirmationRate.percentage],
                            backgroundColor: ['#10b981', '#e5e7eb'],
                            borderWidth: 0,
                          }]
                        }}
                        options={{
                          cutout: '80%',
                          plugins: {
                            legend: { display: false },
                            tooltip: { enabled: false }
                          }
                        }}
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-2xl font-bold text-gray-900">{confirmationRate.percentage}%</span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">
                      {confirmationRate.confirmed} confirmadas de {confirmationRate.confirmed + confirmationRate.pending} pendientes
                    </p>
                  </div>
                </div>
              </div>

              {/* Gráfico de Citas por Día (Últimos 30 días) */}
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Citas por Día (Últimos 30 días)</h3>
                  <TrendingUp className="w-6 h-6 text-blue-600" />
                </div>
                <div className="h-80">
                  <Line 
                    data={{
                      labels: dailyStats.map(stat => stat.date),
                      datasets: [{
                        label: 'Citas',
                        data: dailyStats.map(stat => stat.appointments),
                        borderColor: '#3b82f6',
                        backgroundColor: 'rgba(59, 130, 246, 0.1)',
                        borderWidth: 3,
                        pointBackgroundColor: '#3b82f6',
                        pointBorderColor: '#ffffff',
                        pointBorderWidth: 2,
                        pointRadius: 5,
                        pointHoverRadius: 7,
                        tension: 0.4
                      }]
                    }}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          display: false
                        },
                        tooltip: {
                          backgroundColor: '#fff',
                          titleColor: '#374151',
                          bodyColor: '#374151',
                          borderColor: '#e5e7eb',
                          borderWidth: 1,
                          cornerRadius: 8,
                          displayColors: false,
                          callbacks: {
                            title: function(context: any) {
                              return `Fecha: ${context[0].label}`;
                            },
                            label: function(context: any) {
                              return `Citas: ${context.parsed.y}`;
                            }
                          }
                        }
                      },
                      scales: {
                        y: {
                          beginAtZero: true,
                          grid: {
                            color: 'rgba(0, 0, 0, 0.1)'
                          },
                          ticks: {
                            color: '#6b7280',
                            font: {
                              size: 12
                            }
                          }
                        },
                        x: {
                          grid: {
                            display: false
                          },
                          ticks: {
                            color: '#6b7280',
                            font: {
                              size: 12
                            },
                            maxRotation: 45
                          }
                        }
                      }
                    }}
                  />
                </div>
              </div>

              {/* Horarios Pico */}
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Horarios Pico (8:00 - 20:00)</h3>
                  <Clock className="w-6 h-6 text-green-600" />
                </div>
                <div className="h-80">
                  <Bar 
                    data={{
                      labels: peakHours.map(stat => `${stat.hour}:00`),
                      datasets: [{
                        label: 'Citas',
                        data: peakHours.map(stat => stat.count),
                        backgroundColor: '#10b981',
                        borderColor: '#10b981',
                        borderWidth: 1,
                        borderRadius: 4,
                        borderSkipped: false,
                      }]
                    }}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          display: false
                        },
                        tooltip: {
                          backgroundColor: '#fff',
                          titleColor: '#374151',
                          bodyColor: '#374151',
                          borderColor: '#e5e7eb',
                          borderWidth: 1,
                          cornerRadius: 8,
                          displayColors: false,
                          callbacks: {
                            title: function(context: any) {
                              return `Hora: ${context[0].label}`;
                            },
                            label: function(context: any) {
                              return `Citas: ${context.parsed.y}`;
                            }
                          }
                        }
                      },
                      scales: {
                        y: {
                          beginAtZero: true,
                          grid: {
                            color: 'rgba(0, 0, 0, 0.1)'
                          },
                          ticks: {
                            color: '#6b7280',
                            font: {
                              size: 12
                            }
                          }
                        },
                        x: {
                          grid: {
                            display: false
                          },
                          ticks: {
                            color: '#6b7280',
                            font: {
                              size: 12
                            }
                          }
                        }
                      }
                    }}
                  />
                </div>
              </div>

              {/* Top 5 Usuarios Más Activos */}
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Top 5 Usuarios Más Activos</h3>
                  <Users className="w-6 h-6 text-purple-600" />
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 font-semibold text-gray-900">Ranking</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-900">Usuario</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-900">Email</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-900">Citas</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-900">Última Cita</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {userStats.map((user, index) => (
                        <tr key={user.id} className="hover:bg-gray-50">
                          <td className="py-3 px-4">
                            <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold ${
                              index === 0 ? 'bg-yellow-100 text-yellow-800' :
                              index === 1 ? 'bg-gray-100 text-gray-800' :
                              index === 2 ? 'bg-orange-100 text-orange-800' :
                              'bg-blue-100 text-blue-800'
                            }`}>
                              {index + 1}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center">
                              <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center mr-3">
                                <User className="w-4 h-4 text-red-600" />
                              </div>
                              <span className="font-medium text-gray-900">{user.full_name}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-gray-600">{user.email}</td>
                          <td className="py-3 px-4">
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                              {user.appointment_count} citas
                            </span>
                          </td>
                          <td className="py-3 px-4 text-gray-600">
                            {format(parseISO(user.last_appointment), 'dd/MM/yyyy HH:mm', { locale: es })}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {userStats.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <Users className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                      <p>No hay datos de usuarios para mostrar</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Reporte de Asistencia por Usuario */}
              {attendanceReportData.length > 0 && (
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-gray-900">Reporte de Asistencia por Usuario</h3>
                    <button
                      onClick={() => exportToExcel(attendanceReportData, `asistencia_${format(new Date(), 'yyyy-MM-dd')}.xlsx`, 'Asistencia')}
                      className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded text-sm hover:bg-green-700"
                    >
                      <FileSpreadsheet className="w-4 h-4" />
                      Exportar Excel
                    </button>
                  </div>
                  
                  {reportSummary && (
                    <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-semibold text-gray-900 mb-3">Resumen del Período</h4>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Período:</span>
                          <span className="ml-2 font-medium">{reportSummary.period_description}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Total Citas:</span>
                          <span className="ml-2 font-medium">{reportSummary.total_appointments}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Usuarios Activos:</span>
                          <span className="ml-2 font-medium">{reportSummary.total_users}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Tasa Promedio:</span>
                          <span className="ml-2 font-medium">{reportSummary.average_attendance_rate}%</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Total Notificaciones:</span>
                          <span className="ml-2 font-medium">{reportSummary.total_notifications}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Tipo Popular:</span>
                          <span className="ml-2 font-medium">{reportSummary.top_delegate_type}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left py-3 px-4 font-semibold text-gray-900">Usuario</th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-900">Email</th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-900">Total Citas</th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-900">Completadas</th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-900">Canceladas</th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-900">Pendientes</th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-900">% Asistencia</th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-900">Última Cita</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {attendanceReportData.map((report, index) => (
                          <tr key={report.user_id} className="hover:bg-gray-50">
                            <td className="py-3 px-4">
                              <div className="flex items-center">
                                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                                  <User className="w-4 h-4 text-purple-600" />
                                </div>
                                <span className="font-medium text-gray-900">{report.user_name}</span>
                              </div>
                            </td>
                            <td className="py-3 px-4 text-gray-600">{report.user_email}</td>
                            <td className="py-3 px-4">
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                                {report.total_appointments}
                              </span>
                            </td>
                            <td className="py-3 px-4">
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                                {report.completed_appointments}
                              </span>
                            </td>
                            <td className="py-3 px-4">
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-red-100 text-red-800">
                                {report.cancelled_appointments}
                              </span>
                            </td>
                            <td className="py-3 px-4">
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-800">
                                {report.pending_appointments}
                              </span>
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex items-center">
                                <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                                  <div 
                                    className={`h-2 rounded-full ${
                                      report.attendance_rate >= 80 ? 'bg-green-500' :
                                      report.attendance_rate >= 60 ? 'bg-yellow-500' :
                                      'bg-red-500'
                                    }`}
                                    style={{ width: `${report.attendance_rate}%` }}
                                  ></div>
                                </div>
                                <span className="text-sm font-medium">{report.attendance_rate}%</span>
                              </div>
                            </td>
                            <td className="py-3 px-4 text-gray-600 text-sm">
                              {format(parseISO(report.last_appointment), 'dd/MM/yyyy', { locale: es })}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : activeTab === 'config' ? (
          <div>
            {configLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Cargando configuración...</p>
              </div>
            ) : config ? (
              <div className="space-y-8">
                {/* Configuración de Recordatorios */}
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <Bell className="w-6 h-6 text-blue-600" />
                    <h3 className="text-xl font-semibold text-gray-900">Configuración de Recordatorios</h3>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-medium text-gray-900">Recordatorio 24 horas</h4>
                        <p className="text-sm text-gray-600">Enviar recordatorio un día antes</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={config.reminder_24h}
                          onChange={(e) => updateConfig('reminder_24h', e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-medium text-gray-900">Recordatorio 2 horas</h4>
                        <p className="text-sm text-gray-600">Enviar recordatorio 2 horas antes</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={config.reminder_2h}
                          onChange={(e) => updateConfig('reminder_2h', e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-medium text-gray-900">Recordatorio personalizado</h4>
                        <p className="text-sm text-gray-600">Configurar tiempo personalizado</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={config.custom_reminder}
                          onChange={(e) => updateConfig('custom_reminder', e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Configuración de Horarios Preferidos */}
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <Clock className="w-6 h-6 text-green-600" />
                    <h3 className="text-xl font-semibold text-gray-900">Horarios Preferidos</h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Hora de inicio</label>
                      <input
                        type="time"
                        value={config.preferred_start_time || ''}
                        onChange={(e) => updateConfig('preferred_start_time', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Hora de fin</label>
                      <input
                        type="time"
                        value={config.preferred_end_time || ''}
                        onChange={(e) => updateConfig('preferred_end_time', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                      />
                    </div>
                  </div>

                  <div className="mt-6">
                    <label className="block text-sm font-medium text-gray-700 mb-3">Días de la semana preferidos</label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {daysOfWeek.map(day => (
                        <label key={day.value} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={config.preferred_days.includes(day.value)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                updateConfig('preferred_days', [...config.preferred_days, day.value]);
                              } else {
                                updateConfig('preferred_days', config.preferred_days.filter(d => d !== day.value));
                              }
                            }}
                            className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                          />
                          <span className="ml-2 text-sm text-gray-700">{day.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Gestión de Usuarios Administradores */}
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <Users className="w-6 h-6 text-purple-600" />
                      <h3 className="text-xl font-semibold text-gray-900">Gestión de Administradores</h3>
                    </div>
                    <button
                      onClick={() => setShowAddAdmin(!showAddAdmin)}
                      className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
                    >
                      <Plus className="w-4 h-4" />
                      Añadir Admin
                    </button>
                  </div>

                  {showAddAdmin && (
                    <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                      <div className="flex gap-3">
                        <input
                          type="email"
                          placeholder="Email del nuevo administrador"
                          value={newAdminEmail}
                          onChange={(e) => setNewAdminEmail(e.target.value)}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                        />
                        <button
                          onClick={addAdminUser}
                          className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
                        >
                          <Save className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            setShowAddAdmin(false);
                            setNewAdminEmail('');
                          }}
                          className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="space-y-3">
                    {config.admin_users.map((email, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                            <User className="w-4 h-4 text-purple-600" />
                          </div>
                          <span className="text-gray-900">{email}</span>
                        </div>
                        <button
                          onClick={() => removeAdminUser(email)}
                          className="text-red-600 hover:text-red-800 p-1"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                    {config.admin_users.length === 0 && (
                      <div className="text-center py-8 text-gray-500">
                        <Users className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                        <p>No hay administradores configurados</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Plantillas de Notificación */}
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <Edit3 className="w-6 h-6 text-orange-600" />
                    <h3 className="text-xl font-semibold text-gray-900">Plantillas de Notificación</h3>
                  </div>

                  <div className="space-y-6">
                    {Object.entries(config.notification_templates).map(([key, template]) => {
                      const templateObj = (template as any) as { subject: string; body: string };
                      return (
                        <div key={key} className="border rounded-lg p-4">
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="font-medium text-gray-900">
                              {key.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                            </h4>
                            <button
                              onClick={() => setEditingTemplate(editingTemplate === key ? null : key)}
                              className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
                            >
                              <Edit3 className="w-4 h-4" />
                              {editingTemplate === key ? 'Cancelar' : 'Editar'}
                            </button>
                          </div>

                          <div className="space-y-3">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Asunto</label>
                              <input
                                type="text"
                                value={templateObj.subject}
                                onChange={(e) => updateNotificationTemplate(key as keyof typeof config.notification_templates, 'subject', e.target.value)}
                                disabled={editingTemplate !== key}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 disabled:bg-gray-50"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Mensaje</label>
                              <textarea
                                value={templateObj.body}
                                onChange={(e) => updateNotificationTemplate(key as keyof typeof config.notification_templates, 'body', e.target.value)}
                                disabled={editingTemplate !== key}
                                rows={3}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 disabled:bg-gray-50"
                              />
                            </div>
                          </div>

                          <div className="mt-3 text-xs text-gray-500">
                            Variables disponibles: {'{{'}fecha{'}}'}, {'{{'}hora{'}}'}, {'{{'}usuario{'}}'}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Configuración de Alertas */}
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <AlertCircle className="w-6 h-6 text-red-600" />
                    <h3 className="text-xl font-semibold text-gray-900">Configuración de Alertas</h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {alertSettings.map((alert) => (
                      <div key={alert.name} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <h4 className="font-medium text-gray-900">{alert.description}</h4>
                          <p className="text-sm text-gray-600">
                            {alert.name === 'email_notifications' && 'Recibir notificaciones por correo electrónico'}
                            {alert.name === 'browser_notifications' && 'Mostrar notificaciones en el navegador'}
                            {alert.name === 'reminder_notifications' && 'Recordatorios automáticos de citas'}
                            {alert.name === 'status_change_notifications' && 'Notificar cambios de estado de citas'}
                          </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={config.alert_settings?.[alert.name as keyof typeof config.alert_settings] || false}
                            onChange={(e) => updateAlertSetting(alert.name as keyof typeof config.alert_settings, e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Botón de Guardar */}
                <div className="flex justify-end">
                  <button
                    onClick={saveConfig}
                    disabled={configLoading}
                    className="flex items-center gap-2 bg-red-600 text-white px-6 py-3 rounded-md hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    {configLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Guardando...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        Guardar Configuración
                      </>
                    )}
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <Settings className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Error al cargar la configuración</p>
              </div>
            )}
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

              {/* Botones de exportación y resumen */}
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

                <div className="flex gap-2">
                  <button
                    onClick={exportNotificationsToExcel}
                    disabled={exporting || filteredNotifications.length === 0}
                    className="flex items-center gap-2 bg-green-600 text-white px-3 py-2 rounded text-sm hover:bg-green-700 disabled:bg-gray-400"
                  >
                    <FileSpreadsheet className="w-4 h-4" />
                    {exporting ? 'Exportando...' : 'Exportar'}
                  </button>
                  <button
                    onClick={() => {
                      const dataToExport = filteredNotifications.map(notif => ({
                        ID: notif.id,
                        Tipo: getTypeLabel(notif.type),
                        Título: notif.title,
                        Mensaje: notif.message,
                        Usuario: notif.user_full_name || 'Sin usuario',
                        Email: notif.user_email || 'Sin email',
                        'Fecha Creación': format(parseISO(notif.created_at), 'dd/MM/yyyy HH:mm', { locale: es }),
                        Leída: notif.read ? 'Sí' : 'No',
                        'Tipo Cita': notif.delegate_type || 'Sin tipo'
                      }));
                      exportToCSV(dataToExport, `notificaciones_${format(new Date(), 'yyyy-MM-dd')}.csv`);
                    }}
                    disabled={exporting || filteredNotifications.length === 0}
                    className="flex items-center gap-2 bg-blue-600 text-white px-3 py-2 rounded text-sm hover:bg-blue-700 disabled:bg-gray-400"
                  >
                    <Download className="w-4 h-4" />
                    CSV
                  </button>
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

      {/* Modal de Configuración de Exportación */}
      {showExportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-gray-900">Configurar Exportación de Datos</h3>
              <button
                onClick={() => setShowExportModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Período de reporte */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Período de Reporte
                </label>
                <select
                  value={reportFilters.period}
                  onChange={(e) => setReportFilters(prev => ({ ...prev, period: e.target.value as any }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <option value="all">Todos los datos</option>
                  <option value="week">Esta semana</option>
                  <option value="month">Este mes</option>
                  <option value="quarter">Este trimestre</option>
                  <option value="year">Este año</option>
                  <option value="custom">Personalizado</option>
                </select>
              </div>

              {/* Fechas personalizadas */}
              {reportFilters.period === 'custom' && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Fecha de inicio
                    </label>
                    <input
                      type="date"
                      value={reportFilters.startDate ? format(reportFilters.startDate, 'yyyy-MM-dd') : ''}
                      onChange={(e) => setReportFilters(prev => ({ 
                        ...prev, 
                        startDate: e.target.value ? new Date(e.target.value) : undefined 
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Fecha de fin
                    </label>
                    <input
                      type="date"
                      value={reportFilters.endDate ? format(reportFilters.endDate, 'yyyy-MM-dd') : ''}
                      onChange={(e) => setReportFilters(prev => ({ 
                        ...prev, 
                        endDate: e.target.value ? new Date(e.target.value) : undefined 
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                </div>
              )}

              {/* Tipo de exportación */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Formato de Exportación
                </label>
                <div className="grid grid-cols-3 gap-3">
                  <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      value="excel"
                      checked={reportFilters.exportType === 'excel'}
                      onChange={(e) => setReportFilters(prev => ({ ...prev, exportType: e.target.value as any }))}
                      className="mr-2"
                    />
                    <FileSpreadsheet className="w-5 h-5 text-green-600 mr-2" />
                    <span className="text-sm">Excel</span>
                  </label>
                  <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      value="csv"
                      checked={reportFilters.exportType === 'csv'}
                      onChange={(e) => setReportFilters(prev => ({ ...prev, exportType: e.target.value as any }))}
                      className="mr-2"
                    />
                    <Download className="w-5 h-5 text-blue-600 mr-2" />
                    <span className="text-sm">CSV</span>
                  </label>
                  <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      value="pdf"
                      checked={reportFilters.exportType === 'pdf'}
                      onChange={(e) => setReportFilters(prev => ({ ...prev, exportType: e.target.value as any }))}
                      className="mr-2"
                    />
                    <FileText className="w-5 h-5 text-red-600 mr-2" />
                    <span className="text-sm">PDF</span>
                  </label>
                </div>
              </div>

              {/* Incluir en el reporte */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Incluir en el Reporte
                </label>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={reportFilters.includeCharts}
                      onChange={(e) => setReportFilters(prev => ({ ...prev, includeCharts: e.target.checked }))}
                      className="rounded border-gray-300 text-red-600 focus:ring-red-500 mr-2"
                    />
                    <span className="text-sm">Incluir gráficos y estadísticas visuales</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={reportFilters.attendanceReport}
                      onChange={(e) => setReportFilters(prev => ({ ...prev, attendanceReport: e.target.checked }))}
                      className="rounded border-gray-300 text-red-600 focus:ring-red-500 mr-2"
                    />
                    <span className="text-sm">Reporte de asistencia por usuario</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={reportFilters.notificationReport}
                      onChange={(e) => setReportFilters(prev => ({ ...prev, notificationReport: e.target.checked }))}
                      className="rounded border-gray-300 text-red-600 focus:ring-red-500 mr-2"
                    />
                    <span className="text-sm">Historial completo de notificaciones</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={reportFilters.userReport}
                      onChange={(e) => setReportFilters(prev => ({ ...prev, userReport: e.target.checked }))}
                      className="rounded border-gray-300 text-red-600 focus:ring-red-500 mr-2"
                    />
                    <span className="text-sm">Detalles de citas por usuario</span>
                  </label>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowExportModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  if (reportFilters.exportType === 'pdf') {
                    exportToPDF();
                  } else if (reportFilters.exportType === 'excel') {
                    exportCompleteReport();
                  } else {
                    // Exportar CSV combinado
                    const csvData = [];
                    
                    if (reportFilters.notificationReport) {
                      csvData.push({ Seccion: 'Notificaciones', ...filteredNotifications[0] });
                    }
                    if (reportFilters.userReport) {
                      csvData.push({ Seccion: 'Citas', ...filteredAppointments[0] });
                    }
                    
                    if (csvData.length > 0) {
                      exportToCSV(csvData, `reporte_${format(new Date(), 'yyyy-MM-dd')}.csv`);
                    }
                  }
                  setShowExportModal(false);
                }}
                disabled={exporting}
                className="flex items-center gap-2 bg-red-600 text-white px-6 py-2 rounded-md hover:bg-red-700 disabled:bg-gray-400"
              >
                {exporting ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  <Download className="w-4 h-4" />
                )}
                {exporting ? 'Generando...' : 'Exportar'}
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
