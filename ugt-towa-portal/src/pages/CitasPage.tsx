import React, { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useAuth } from '@/contexts/AuthContext';
import { supabase, AppointmentSlot, Appointment } from '@/lib/supabase';
import { Calendar as CalendarIcon, Clock, ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { toast } from 'sonner';

const TIME_SLOTS = [
  '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00'
];

export default function CitasPage() {
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedType, setSelectedType] = useState<'comite' | 'sindical' | 'prevencion'>('comite');
  const [slots, setSlots] = useState<AppointmentSlot[]>([]);
  const [myAppointments, setMyAppointments] = useState<Appointment[]>([]);

  useEffect(() => {
    loadSlots();
    if (user) loadMyAppointments();
  }, [selectedDate, selectedType, user]);

  async function loadSlots() {
    const dateStr = selectedDate.toISOString().split('T')[0];
    const { data } = await supabase
      .from('appointment_slots')
      .select('*')
      .eq('appointment_date', dateStr)
      .eq('delegate_type', selectedType)
      .eq('status', 'available')
      .order('start_time');
    
    if (data) setSlots(data);
  }

  async function loadMyAppointments() {
    const { data } = await supabase
      .from('appointments')
      .select('*, slot:appointment_slots(*)')
      .eq('user_id', user?.id)
      .order('start_time', { ascending: false });
    if (data) setMyAppointments(data as any);
  }

  async function handleBookSlot(slot: AppointmentSlot) {
    if (!user) {
      toast.error('Debes iniciar sesión para reservar una cita');
      return;
    }

    try {
      const { data: newAppointment, error } = await supabase
        .from('appointments')
        .insert([{
          user_id: user.id,
          slot_id: slot.id,
          delegate_type: selectedType,
          start_time: slot.start_time,
          end_time: slot.end_time,
          status: 'confirmed'
        }])
        .select()
        .single();

      if (error) {
        if (error.message.includes('El horario seleccionado ya no está disponible')) {
          toast.error('Este horario ya ha sido reservado por otra persona');
        } else {
          throw error;
        }
      } else {
        // Enviar notificación por email
        try {
          await supabase.functions.invoke('notify-appointment', {
            body: {
              appointmentId: newAppointment.id,
              action: 'confirmed'
            }
          });
        } catch (notifyError) {
          console.error('Error al enviar notificación:', notifyError);
          // No mostramos error al usuario, la cita fue creada correctamente
        }

        toast.success('Cita reservada correctamente. Recibirás una confirmación por email.');
        loadSlots();
        loadMyAppointments();
      }
    } catch (error: any) {
      console.error('Error al reservar cita:', error);
      toast.error('Error al reservar cita: ' + (error.message || 'Error desconocido'));
    }
  }

  async function handleCancelAppointment(appointmentId: string) {
    if (!confirm('¿Estás seguro de que quieres cancelar esta cita?')) return;

    const { error } = await supabase
      .from('appointments')
      .update({ status: 'cancelled' })
      .eq('id', appointmentId);

    if (!error) {
      // Enviar notificación de cancelación
      try {
        await supabase.functions.invoke('notify-appointment', {
          body: {
            appointmentId: appointmentId,
            action: 'cancelled'
          }
        });
      } catch (notifyError) {
        console.error('Error al enviar notificación:', notifyError);
      }

      toast.success('Cita cancelada. Se ha enviado una notificación.');
      loadSlots();
      loadMyAppointments();
    } else {
      toast.error('Error al cancelar la cita');
    }
  }

  function changeDate(days: number) {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + days);
    setSelectedDate(newDate);
  }

  function getSlotForTime(time: string): AppointmentSlot | undefined {
    return slots.find(s => {
      const slotTime = new Date(s.start_time).getHours();
      const targetHour = parseInt(time.split(':')[0]);
      return slotTime === targetHour;
    });
  }

  const dateStr = selectedDate.toLocaleDateString('es-ES', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-12">
        <div className="flex items-center mb-8">
          <CalendarIcon className="h-8 w-8 text-red-600 mr-3" />
          <h1 className="text-4xl font-bold text-gray-900">Sistema de Citas</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-xl font-bold mb-4">Selecciona Tipo de Delegado</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <button
                  onClick={() => setSelectedType('comite')}
                  className={`p-4 rounded-lg border-2 font-semibold transition ${
                    selectedType === 'comite'
                      ? 'border-red-600 bg-red-50 text-red-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  Comité de Empresa
                </button>
                <button
                  onClick={() => setSelectedType('sindical')}
                  className={`p-4 rounded-lg border-2 font-semibold transition ${
                    selectedType === 'sindical'
                      ? 'border-red-600 bg-red-50 text-red-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  Delegados Sindicales
                </button>
                <button
                  onClick={() => setSelectedType('prevencion')}
                  className={`p-4 rounded-lg border-2 font-semibold transition ${
                    selectedType === 'prevencion'
                      ? 'border-red-600 bg-red-50 text-red-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  Prevención
                </button>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-6">
                <button
                  onClick={() => changeDate(-1)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
                <h2 className="text-xl font-bold capitalize text-center flex-1">{dateStr}</h2>
                <button
                  onClick={() => changeDate(1)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
              </div>

              <div className="mb-4">
                <h3 className="font-semibold text-gray-700 mb-2">Horarios Disponibles (8:00 - 16:00)</h3>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {TIME_SLOTS.map(time => {
                  const slot = getSlotForTime(time);
                  const endHour = (parseInt(time.split(':')[0]) + 1).toString().padStart(2, '0');

                  return (
                    <div key={time} className="relative">
                      {slot ? (
                        <button
                          onClick={() => handleBookSlot(slot)}
                          className="w-full p-4 rounded-lg border-2 border-green-300 bg-green-50 hover:bg-green-100 transition text-center"
                        >
                          <Clock className="h-5 w-5 mx-auto mb-1 text-green-600" />
                          <p className="font-bold text-sm">{time}</p>
                          <p className="text-xs text-gray-600">- {endHour}:00</p>
                          <span className="inline-block mt-2 px-2 py-1 bg-green-600 text-white text-xs rounded-full">
                            Disponible
                          </span>
                        </button>
                      ) : (
                        <div className="w-full p-4 rounded-lg border-2 border-gray-200 bg-gray-50 text-center opacity-50">
                          <Clock className="h-5 w-5 mx-auto mb-1 text-gray-400" />
                          <p className="font-bold text-sm">{time}</p>
                          <p className="text-xs text-gray-600">- {endHour}:00</p>
                          <span className="inline-block mt-2 px-2 py-1 bg-gray-300 text-gray-600 text-xs rounded-full">
                            No disponible
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {slots.length === 0 && (
                <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-yellow-800 text-center">
                    No hay horarios disponibles para esta fecha y tipo de delegado.
                    Prueba con otra fecha o tipo de delegado.
                  </p>
                </div>
              )}
            </div>
          </div>

          <div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold mb-4">Mis Citas</h2>
              <div className="space-y-3">
                {myAppointments.filter(apt => apt.status !== 'cancelled').length === 0 ? (
                  <p className="text-gray-500 text-sm">No tienes citas reservadas</p>
                ) : (
                  myAppointments
                    .filter(apt => apt.status !== 'cancelled')
                    .map(apt => (
                      <div key={apt.id} className="p-4 border-2 border-gray-200 rounded-lg">
                        <div className="flex items-start justify-between mb-2">
                          <p className="font-semibold text-gray-900 capitalize">{apt.delegate_type}</p>
                          <span className={`px-2 py-1 text-xs rounded-full font-semibold ${
                            apt.status === 'confirmed' 
                              ? 'bg-green-100 text-green-700' 
                              : 'bg-yellow-100 text-yellow-700'
                          }`}>
                            {apt.status === 'confirmed' ? 'Confirmada' : 'Pendiente'}
                          </span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600 mb-3">
                          <CalendarIcon className="h-4 w-4 mr-2" />
                          <span>
                            {format(new Date(apt.start_time), "d 'de' MMM, yyyy", { locale: es })}
                          </span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600 mb-3">
                          <Clock className="h-4 w-4 mr-2" />
                          <span>
                            {format(new Date(apt.start_time), 'HH:mm')} - {format(new Date(apt.end_time), 'HH:mm')}
                          </span>
                        </div>
                        <button
                          onClick={() => handleCancelAppointment(apt.id)}
                          className="w-full py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-sm"
                        >
                          Cancelar Cita
                        </button>
                      </div>
                    ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
