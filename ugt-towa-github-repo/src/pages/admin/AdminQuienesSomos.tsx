import React, { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { supabase, Delegate } from '@/lib/supabase';
import { Plus, Trash2, Upload, X, User } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminQuienesSomos() {
  const [delegates, setDelegates] = useState<Delegate[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ full_name: '', role_type: 'comite', bio: '', photo_url: '' });
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    loadDelegates();
  }, []);

  async function loadDelegates() {
    const { data } = await supabase.from('delegates').select('*').order('display_order');
    if (data) setDelegates(data);
  }

  async function handlePhotoUpload() {
    if (!selectedFile) return;
    
    setUploading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;

      if (!token) {
        toast.error('No autenticado');
        setUploading(false);
        return;
      }

      const formData = new FormData();
      formData.append('file', selectedFile);

      const response = await fetch('https://zaxdscclkeytakcowgww.supabase.co/functions/v1/upload-delegate-photo', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      const result = await response.json();

      if (result.success) {
        setFormData(prev => ({ ...prev, photo_url: result.url }));
        toast.success('Foto subida correctamente');
        setSelectedFile(null);
      } else {
        toast.error('Error al subir foto');
      }
    } catch (error) {
      toast.error('Error al subir foto');
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const { error } = await supabase.from('delegates').insert([formData]);
    if (error) toast.error('Error');
    else { toast.success('Delegado añadido'); resetForm(); loadDelegates(); }
  }

  function resetForm() {
    setFormData({ full_name: '', role_type: 'comite', bio: '', photo_url: '' });
    setShowForm(false);
    setSelectedFile(null);
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
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Foto del Delegado (opcional)</label>
              {formData.photo_url ? (
                <div className="relative inline-block">
                  <img src={formData.photo_url} alt="Preview" className="h-32 w-32 rounded-full object-cover border-4 border-gray-200" />
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, photo_url: '' }))}
                    className="absolute -top-2 -right-2 p-1 bg-red-600 text-white rounded-full hover:bg-red-700"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                    className="flex-1 p-2 border rounded"
                  />
                  <button
                    type="button"
                    onClick={handlePhotoUpload}
                    disabled={!selectedFile || uploading}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
                  >
                    {uploading ? 'Subiendo...' : <><Upload className="inline h-4 w-4 mr-1" /> Subir</>}
                  </button>
                </div>
              )}
            </div>

            <div className="flex gap-2">
              <button type="submit" className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">Guardar</button>
              <button type="button" onClick={resetForm} className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">Cancelar</button>
            </div>
          </form>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {delegates.map(del => (
            <div key={del.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6">
                <div className="flex items-center mb-4">
                  {del.photo_url ? (
                    <img 
                      src={del.photo_url} 
                      alt={del.full_name}
                      className="h-20 w-20 rounded-full object-cover border-4 border-red-100 mr-4"
                    />
                  ) : (
                    <div className="h-20 w-20 rounded-full bg-gray-200 flex items-center justify-center mr-4">
                      <User className="h-10 w-10 text-gray-400" />
                    </div>
                  )}
                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-gray-900">{del.full_name}</h3>
                    <span className="inline-block px-2 py-1 text-xs bg-red-100 text-red-700 rounded capitalize">
                      {del.role_type}
                    </span>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-4">{del.bio}</p>
                <button 
                  onClick={() => handleDelete(del.id)} 
                  className="text-red-600 hover:bg-red-50 px-3 py-1 rounded transition"
                >
                  <Trash2 className="h-4 w-4 inline mr-1" /> Eliminar
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
