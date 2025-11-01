import React, { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { supabase, Delegate } from '@/lib/supabase';
import { Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminQuienesSomos() {
  const [delegates, setDelegates] = useState<Delegate[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ full_name: '', role_type: 'comite', bio: '' });

  useEffect(() => {
    loadDelegates();
  }, []);

  async function loadDelegates() {
    const { data } = await supabase.from('delegates').select('*').order('display_order');
    if (data) setDelegates(data);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const { error } = await supabase.from('delegates').insert([formData]);
    if (error) toast.error('Error');
    else { toast.success('Delegado añadido'); setShowForm(false); loadDelegates(); }
  }

  async function handleDelete(id: string) {
    if (confirm('¿Eliminar?')) {
      const { error } = await supabase.from('delegates').delete().eq('id', id);
      if (error) toast.error('Error');
      else { toast.success('Eliminado'); loadDelegates(); }
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-12">
        <div className="flex justify-between mb-8">
          <h1 className="text-3xl font-bold">Gestionar Delegados</h1>
          <button onClick={() => setShowForm(!showForm)} className="px-4 py-2 bg-red-600 text-white rounded-lg"><Plus className="inline h-5 w-5" /> Añadir</button>
        </div>
        {showForm && (
          <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow mb-8">
            <input type="text" placeholder="Nombre" value={formData.full_name} onChange={e => setFormData({...formData, full_name: e.target.value})} className="w-full p-2 border rounded mb-4" required />
            <select value={formData.role_type} onChange={e => setFormData({...formData, role_type: e.target.value as any})} className="w-full p-2 border rounded mb-4">
              <option value="comite">Comité</option>
              <option value="sindical">Sindical</option>
              <option value="prevencion">Prevención</option>
            </select>
            <textarea placeholder="Biografía" value={formData.bio} onChange={e => setFormData({...formData, bio: e.target.value})} className="w-full p-2 border rounded mb-4" required />
            <button type="submit" className="px-4 py-2 bg-red-600 text-white rounded">Guardar</button>
          </form>
        )}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {delegates.map(del => (
            <div key={del.id} className="bg-white p-6 rounded-lg shadow">
              <h3 className="font-bold mb-2">{del.full_name}</h3>
              <p className="text-sm text-gray-600 mb-4">{del.bio}</p>
              <button onClick={() => handleDelete(del.id)} className="text-red-600"><Trash2 className="h-4 w-4 inline" /> Eliminar</button>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}
