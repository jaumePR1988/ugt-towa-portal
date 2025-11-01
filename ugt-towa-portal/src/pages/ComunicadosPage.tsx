import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { supabase, Communique } from '@/lib/supabase';
import { FileText, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export default function ComunicadosPage() {
  const [communiques, setCommuniques] = useState<Communique[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState<string>('all');

  useEffect(() => {
    loadCommuniques();
  }, [category]);

  async function loadCommuniques() {
    setLoading(true);
    let query = supabase
      .from('communiques')
      .select('*')
      .eq('is_published', true)
      .order('created_at', { ascending: false });

    if (category !== 'all') {
      query = query.eq('category', category);
    }

    const { data } = await query;
    if (data) setCommuniques(data);
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <FileText className="h-8 w-8 text-red-600 mr-3" />
            <h1 className="text-4xl font-bold text-gray-900">Comunicados</h1>
          </div>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600"
          >
            <option value="all">Todas las categorías</option>
            <option value="general">General</option>
            <option value="negociacion">Negociación</option>
            <option value="convenio">Convenio</option>
          </select>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {communiques.map(com => (
              <Link
                key={com.id}
                to={`/comunicados/${com.id}`}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition"
              >
                <h2 className="text-2xl font-semibold text-gray-900 mb-3">{com.title}</h2>
                <p className="text-gray-600 mb-4 line-clamp-3">{com.content.substring(0, 200)}...</p>
                <div className="flex items-center text-sm text-gray-500">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span>{format(new Date(com.created_at), "d 'de' MMMM, yyyy", { locale: es })}</span>
                  {com.category && (
                    <span className="ml-4 px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs">
                      {com.category}
                    </span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
