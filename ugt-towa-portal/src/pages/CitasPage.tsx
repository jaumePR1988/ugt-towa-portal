import React, { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useAuth } from '@/contexts/AuthContext';
import { supabase, AppointmentSlot, Appointment } from '@/lib/supabase';
import { Calendar, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { toast } from 'sonner';

export default function CitasPage() {
  const { user } = useAuth();
  const [slots, setSlots] = useState<AppointmentSlot[]>([]);
  const [allSlots, setAllSlots] = useState<AppointmentSlot[]>([]);
  const [myAppointments, setMyAppointments] = useState<Appointment[]>([]);
  const [selectedType, setSelectedType] = useState<'comite' | 'sindical' | 'prevencion'>('comite');

  useEffect(() => {
    loadAllSlots();
    if (user) loadMyAppointments();
  }, [user]);

  useEffect(() => {
    filterSlotsByType();
  }, [selectedType, allSlots]);

  async function loadAllSlots() {
    const { data } = await supabase
      .from('appointment_slots')
      .select('*')
      .eq('is_available', true)
      .order('start_time', { ascending: true });
    if (data) {
      setAllSlots(data);
    }
  }

  function filterSlotsByType() {
    const filtered = allSlots.filter(slot => slot.delegate_type === selectedType);
    setSlots(filtered);
  }

  function getSlotCountByType(type: string) {
    return allSlots.filter(slot => slot.delegate_type === type).length;
  }

  async function loadMyAppointments() {
    const { data } = await supabase
      .from('appointments')
      .select('*')
      .eq('user_id', user?.id)
      .order('start_time', { ascending: false });
    if (data) setMyAppointments(data);
  }

  async function handleBookSlot(slotId: string, startTime: string, endTime: string) {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('appointments')
        .insert([{
          user_id: user.id,
          delegate_type: selectedType,
          start_time: startTime,
          end_time: endTime,
          status: 'pending'
        }]);

      if (error) throw error;

      await supabase
        .from('appointment_slots')
        .update({ is_available: false })
        .eq('id', slotId);

      toast.success('Cita reservada correctamente');
      loadAllSlots();
      loadMyAppointments();
    } catch (error) {
      toast.error('Error al reservar cita');
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-12">
        <div className="flex items-center mb-8">
          <Calendar className="h-8 w-8 text-red-600 mr-3" />
          <h1 className="text-4xl font-bold text-gray-900">Sistema de Citas</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-xl font-bold mb-4">Reservar Cita</h2>
              <div className="flex flex-wrap gap-2 mb-6">
                <button
                  onClick={() => setSelectedType('comite')}
                  className={`px-4 py-2 rounded-lg font-medium transition ${
                    selectedType === 'comite' 
                      ? 'bg-red-600 text-white' 
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Comité {getSlotCountByType('comite') > 0 && `(${getSlotCountByType('comite')})`}
                </button>
                <button
                  onClick={() => setSelectedType('sindical')}
                  className={`px-4 py-2 rounded-lg font-medium transition ${
                    selectedType === 'sindical' 
                      ? 'bg-red-600 text-white' 
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Sindical {getSlotCountByType('sindical') > 0 && `(${getSlotCountByType('sindical')})`}
                </button>
                <button
                  onClick={() => setSelectedType('prevencion')}
                  className={`px-4 py-2 rounded-lg font-medium transition ${
                    selectedType === 'prevencion' 
                      ? 'bg-red-600 text-white' 
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Prevención {getSlotCountByType('prevencion') > 0 && `(${getSlotCountByType('prevencion')})`}
                </button>
              </div>

              <div className="space-y-3">
                {slots.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-gray-500 mb-2">No hay slots disponibles para {selectedType === 'comite' ? 'Comité' : selectedType === 'sindical' ? 'Sindical' : 'Prevención'}</p>
                    {allSlots.length > 0 && (
                      <p className="text-sm text-gray-400">
                        Prueba seleccionando otra categoría arriba
                      </p>
                    )}
                  </div>
                ) : (
                  slots.map(slot => (
                    <div key={slot.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center">
                        <Clock className="h-5 w-5 text-gray-400 mr-3" />
                        <div>
                          <p className="font-medium">{format(new Date(slot.start_time), "EEEE, d 'de' MMMM", { locale: es })}</p>
                          <p className="text-sm text-gray-500">
                            {format(new Date(slot.start_time), 'HH:mm')} - {format(new Date(slot.end_time), 'HH:mm')}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleBookSlot(slot.id, slot.start_time, slot.end_time)}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                      >
                        Reservar
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          <div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold mb-4">Mis Citas</h2>
              <div className="space-y-3">
                {myAppointments.length === 0 ? (
                  <p className="text-gray-500 text-sm">No tienes citas reservadas</p>
                ) : (
                  myAppointments.map(apt => (
                    <div key={apt.id} className="p-3 border border-gray-200 rounded-lg">
                      <p className="font-medium text-sm">{apt.delegate_type}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {format(new Date(apt.start_time), "d 'de' MMM, HH:mm", { locale: es })}
                      </p>
                      <span className={`inline-block mt-2 px-2 py-1 text-xs rounded-full ${
                        apt.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                        apt.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {apt.status}
                      </span>
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
