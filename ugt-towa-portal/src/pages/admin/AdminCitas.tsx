import React, { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { supabase, Appointment } from '@/lib/supabase';
import { toast } from 'sonner';

export default function AdminCitas() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  useEffect(() => {
    loadAppointments();
  }, []);

  async function loadAppointments() {
    const { data } = await supabase.from('appointments').select('*').order('start_time');
    if (data) setAppointments(data);
  }

  async function updateStatus(id: string, status: string) {
    const { error } = await supabase.from('appointments').update({ status }).eq('id', id);
    if (error) toast.error('Error');
    else { toast.success('Actualizado'); loadAppointments(); }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8">Gestionar Citas</h1>
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
                  <td className="px-6 py-4">{apt.status}</td>
                  <td className="px-6 py-4">
                    <select value={apt.status} onChange={e => updateStatus(apt.id, e.target.value)} className="p-1 border rounded">
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
        </div>
      </div>
      <Footer />
    </div>
  );
}
