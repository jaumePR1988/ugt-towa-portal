import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { supabase, Communique, Survey, NegotiationStatus } from '@/lib/supabase';
import { Calendar, FileText, Vote, TrendingUp, MessageSquare } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export default function HomePage() {
  const [communiques, setCommuniques] = useState<Communique[]>([]);
  const [activeSurvey, setActiveSurvey] = useState<Survey | null>(null);
  const [negotiations, setNegotiations] = useState<NegotiationStatus[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      // Cargar últimos 3 comunicados
      const { data: comData } = await supabase
        .from('communiques')
        .select('*')
        .eq('is_published', true)
        .order('created_at', { ascending: false })
        .limit(3);
      if (comData) setCommuniques(comData);

      // Cargar encuesta activa
      const { data: surveyData } = await supabase
        .from('surveys')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();
      if (surveyData) setActiveSurvey(surveyData);

      // Cargar negociaciones
      const { data: negData } = await supabase
        .from('negotiation_status')
        .select('*')
        .order('updated_at', { ascending: false });
      if (negData) setNegotiations(negData);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-red-600 to-red-700 text-white">
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Bienvenido al Portal Sindical UGT Towa
            </h1>
            <p className="text-xl text-red-100 mb-8">
              Tu plataforma para estar informado, participar y conectar con tus representantes sindicales
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/citas"
                className="inline-flex items-center px-6 py-3 bg-white text-red-600 rounded-lg font-semibold hover:bg-gray-100 transition"
              >
                <Calendar className="h-5 w-5 mr-2" />
                Solicitar Cita
              </Link>
              <Link
                to="/comunicados"
                className="inline-flex items-center px-6 py-3 border-2 border-white text-white rounded-lg font-semibold hover:bg-red-800 transition"
              >
                <FileText className="h-5 w-5 mr-2" />
                Ver Comunicados
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Termómetro de Negociación */}
        {negotiations.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center mb-6">
              <TrendingUp className="h-6 w-6 text-red-600 mr-2" />
              <h2 className="text-2xl font-bold text-gray-900">Termómetro de Negociación</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {negotiations.map((neg) => (
                <div key={neg.id} className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="font-semibold text-gray-900 mb-3">{neg.topic}</h3>
                  <div className="relative pt-1">
                    <div className="flex mb-2 items-center justify-between">
                      <div>
                        <span className="text-xs font-semibold inline-block text-red-600">
                          Progreso
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-semibold inline-block text-red-600">
                          {neg.percentage}%
                        </span>
                      </div>
                    </div>
                    <div className="overflow-hidden h-3 text-xs flex rounded-full bg-gray-200">
                      <div
                        style={{ width: `${neg.percentage}%` }}
                        className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-red-600 transition-all duration-500"
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Últimos Comunicados */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <FileText className="h-6 w-6 text-red-600 mr-2" />
                <h2 className="text-2xl font-bold text-gray-900">Últimos Comunicados</h2>
              </div>
              <Link to="/comunicados" className="text-red-600 hover:text-red-700 font-medium">
                Ver todos
              </Link>
            </div>

            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
              </div>
            ) : (
              <div className="space-y-4">
                {communiques.map((com) => (
                  <Link
                    key={com.id}
                    to={`/comunicados/${com.id}`}
                    className="block bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">{com.title}</h3>
                        <p className="text-gray-600 line-clamp-2">
                          {com.content.substring(0, 150)}...
                        </p>
                        <div className="flex items-center mt-3 text-sm text-gray-500">
                          <span>{format(new Date(com.created_at), "d 'de' MMMM, yyyy", { locale: es })}</span>
                          {com.category && (
                            <span className="ml-3 px-2 py-1 bg-red-100 text-red-700 rounded text-xs">
                              {com.category}
                            </span>
                          )}
                        </div>
                      </div>
                      <MessageSquare className="h-5 w-5 text-gray-400 ml-4" />
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Encuesta Activa */}
          <div>
            {activeSurvey && (
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <div className="flex items-center mb-4">
                  <Vote className="h-6 w-6 text-red-600 mr-2" />
                  <h2 className="text-xl font-bold text-gray-900">Encuesta Activa</h2>
                </div>
                <p className="text-gray-700 mb-4 font-medium">{activeSurvey.question}</p>
                <Link
                  to="/encuestas"
                  className="block w-full text-center px-4 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition"
                >
                  Participar
                </Link>
              </div>
            )}

            {/* Accesos Rápidos */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Accesos Rápidos</h2>
              <div className="space-y-3">
                <Link
                  to="/quienes-somos"
                  className="block p-3 border border-gray-200 rounded-lg hover:border-red-600 hover:bg-red-50 transition"
                >
                  <span className="font-medium text-gray-900">Quiénes Somos</span>
                </Link>
                <Link
                  to="/citas"
                  className="block p-3 border border-gray-200 rounded-lg hover:border-red-600 hover:bg-red-50 transition"
                >
                  <span className="font-medium text-gray-900">Solicitar Cita</span>
                </Link>
                <Link
                  to="/newsletter"
                  className="block p-3 border border-gray-200 rounded-lg hover:border-red-600 hover:bg-red-50 transition"
                >
                  <span className="font-medium text-gray-900">Suscribirse al Newsletter</span>
                </Link>
                <a
                  href="#sugerencias"
                  className="block p-3 border border-gray-200 rounded-lg hover:border-red-600 hover:bg-red-50 transition"
                >
                  <span className="font-medium text-gray-900">Buzón de Sugerencias</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Buzón de Sugerencias Anónimas */}
        <div id="sugerencias" className="mt-12 bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Buzón de Sugerencias Anónimas</h2>
          <p className="text-gray-600 mb-6">
            Comparte tus ideas, comentarios o preocupaciones de forma completamente anónima
          </p>
          <SuggestionsForm />
        </div>
      </div>

      <Footer />
    </div>
  );
}

function SuggestionsForm() {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!content.trim()) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('suggestions')
        .insert([{ content }]);

      if (error) throw error;

      setContent('');
      alert('Sugerencia enviada correctamente');
    } catch (error) {
      alert('Error al enviar sugerencia');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Escribe tu sugerencia aquí..."
        className="w-full h-32 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent resize-none"
        required
      />
      <button
        type="submit"
        disabled={loading}
        className="mt-4 px-6 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition disabled:bg-gray-400"
      >
        {loading ? 'Enviando...' : 'Enviar Sugerencia'}
      </button>
    </form>
  );
}
