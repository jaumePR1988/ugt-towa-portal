import React, { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useAuth } from '@/contexts/AuthContext';
import { supabase, Communique } from '@/lib/supabase';
import { Plus, Edit2, Trash2, Upload, X } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminComunicados() {
  const { user } = useAuth();
  const [communiques, setCommuniques] = useState<Communique[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ title: '', content: '', category: 'general', image_url: '' });
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    loadCommuniques();
  }, []);

  async function loadCommuniques() {
    const { data } = await supabase.from('communiques').select('*').order('created_at', { ascending: false });
    if (data) setCommuniques(data);
  }

  async function handleImageUpload() {
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

      const response = await fetch('https://zaxdscclkeytakcowgww.supabase.co/functions/v1/upload-communique-image', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      const result = await response.json();

      if (result.success) {
        setFormData(prev => ({ ...prev, image_url: result.url }));
        toast.success('Imagen subida correctamente');
        setSelectedFile(null);
      } else {
        toast.error('Error al subir imagen');
      }
    } catch (error) {
      toast.error('Error al subir imagen');
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (editingId) {
      const { error } = await supabase.from('communiques').update(formData).eq('id', editingId);
      if (error) toast.error('Error al actualizar');
      else { toast.success('Actualizado'); resetForm(); loadCommuniques(); }
    } else {
      const { error } = await supabase.from('communiques').insert([{ ...formData, author_id: user?.id, is_published: true }]);
      if (error) toast.error('Error al publicar');
      else { toast.success('Publicado'); resetForm(); loadCommuniques(); }
    }
  }

  async function handleDelete(id: string) {
    if (confirm('¿Eliminar este comunicado?')) {
      const { error } = await supabase.from('communiques').delete().eq('id', id);
      if (error) toast.error('Error al eliminar');
      else { toast.success('Eliminado'); loadCommuniques(); }
    }
  }

  function handleEdit(com: Communique) {
    setFormData({ title: com.title, content: com.content, category: com.category || 'general', image_url: com.image_url || '' });
    setEditingId(com.id);
    setShowForm(true);
  }

  function resetForm() {
    setFormData({ title: '', content: '', category: 'general', image_url: '' });
    setEditingId(null);
    setShowForm(false);
    setSelectedFile(null);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-12">
        <div className="flex justify-between mb-8">
          <h1 className="text-3xl font-bold">Gestionar Comunicados</h1>
          <button onClick={() => { resetForm(); setShowForm(!showForm); }} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
            <Plus className="inline h-5 w-5 mr-1" /> Nuevo
          </button>
        </div>
        {showForm && (
          <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow mb-8">
            <h2 className="text-xl font-bold mb-4">{editingId ? 'Editar Comunicado' : 'Nuevo Comunicado'}</h2>
            <input type="text" placeholder="Título" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full p-3 border rounded mb-4" required />
            <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full p-3 border rounded mb-4">
              <option value="general">General</option>
              <option value="negociacion">Negociación</option>
              <option value="convenio">Convenio</option>
            </select>
            <textarea placeholder="Contenido" value={formData.content} onChange={e => setFormData({...formData, content: e.target.value})} className="w-full p-3 border rounded mb-4" rows={10} required />
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Imagen (opcional)</label>
              {formData.image_url ? (
                <div className="relative inline-block">
                  <img src={formData.image_url} alt="Preview" className="h-32 w-auto rounded border" />
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, image_url: '' }))}
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
                    onClick={handleImageUpload}
                    disabled={!selectedFile || uploading}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
                  >
                    {uploading ? 'Subiendo...' : <><Upload className="inline h-4 w-4 mr-1" /> Subir</>}
                  </button>
                </div>
              )}
            </div>

            <div className="flex gap-2">
              <button type="submit" className="px-6 py-2 bg-red-600 text-white rounded hover:bg-red-700">
                {editingId ? 'Actualizar' : 'Publicar'}
              </button>
              <button type="button" onClick={resetForm} className="px-6 py-2 bg-gray-200 rounded hover:bg-gray-300">Cancelar</button>
            </div>
          </form>
        )}
        <div className="space-y-4">
          {communiques.map(com => (
            <div key={com.id} className="bg-white p-6 rounded-lg shadow">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-2">{com.title}</h3>
                  <span className="inline-block px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs mb-2">
                    {com.category}
                  </span>
                  <p className="text-gray-600">{com.content.substring(0,200)}...</p>
                  <p className="text-sm text-gray-500 mt-2">{new Date(com.created_at).toLocaleString('es-ES')}</p>
                </div>
                <div className="flex gap-2 ml-4">
                  <button onClick={() => handleEdit(com)} className="p-2 text-blue-600 hover:bg-blue-50 rounded">
                    <Edit2 className="h-5 w-5" />
                  </button>
                  <button onClick={() => handleDelete(com.id)} className="p-2 text-red-600 hover:bg-red-50 rounded">
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}
