import React, { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { supabase, AppointmentSlot } from '@/lib/supabase';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminDisponibilidad() {
  const [slots, setSlots] = useState<AppointmentSlot[]>([]);
  const [formData, setFormData] = useState({ delegate_type: 'comite', start_time: '', end_time: '' });

  useEffect(() => {
    loadSlots();
  }, []);

  async function loadSlots() {
    const { data } = await supabase.from('appointment_slots').select('*').order('start_time');
    if (data) setSlots(data);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const { error } = await supabase.from('appointment_slots').insert([{ ...formData, is_available: true }]);
    if (error) toast.error('Error al crear slot');
    else { 
      toast.success('Slot creado'); 
      setFormData({ delegate_type: 'comite', start_time: '', end_time: '' });
      loadSlots(); 
    }
  }

  async function handleDelete(id: string) {
    if (confirm('¿Eliminar este slot?')) {
      const { error } = await supabase.from('appointment_slots').delete().eq('id', id);
      if (error) toast.error('Error al eliminar');
      else { toast.success('Eliminado'); loadSlots(); }
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8">Configurar Disponibilidad</h1>
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <select value={formData.delegate_type} onChange={e => setFormData({...formData, delegate_type: e.target.value as any})} className="p-3 border rounded">
              <option value="comite">Comité</option>
              <option value="sindical">Sindical</option>
              <option value="prevencion">Prevención</option>
            </select>
            <input type="datetime-local" value={formData.start_time} onChange={e => setFormData({...formData, start_time: e.target.value})} className="p-3 border rounded" required />
            <input type="datetime-local" value={formData.end_time} onChange={e => setFormData({...formData, end_time: e.target.value})} className="p-3 border rounded" required />
          </div>
          <button type="submit" className="mt-4 px-6 py-3 bg-red-600 text-white rounded hover:bg-red-700">
            <Plus className="inline h-5 w-5 mr-1" /> Añadir Slot
          </button>
        </form>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {slots.map(slot => (
            <div key={slot.id} className={`p-4 rounded-lg border ${slot.is_available ? 'bg-green-50 border-green-200' : 'bg-gray-100 border-gray-200'}`}>
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-semibold text-gray-900 capitalize">{slot.delegate_type}</p>
                  <p className="text-sm text-gray-600 mt-1">{new Date(slot.start_time).toLocaleString('es-ES')}</p>
                  <p className="text-sm text-gray-600">{new Date(slot.end_time).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}</p>
                  <span className={`inline-block mt-2 px-2 py-1 text-xs rounded ${slot.is_available ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-700'}`}>
                    {slot.is_available ? 'Disponible' : 'Ocupado'}
                  </span>
                </div>
                <button onClick={() => handleDelete(slot.id)} className="text-red-600 hover:bg-red-50 p-1 rounded">
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}
