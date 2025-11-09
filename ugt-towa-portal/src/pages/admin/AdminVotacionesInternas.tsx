import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { supabase, InternalPoll } from '@/lib/supabase';
import { Vote, Plus, Trash2, Calendar } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export default function AdminVotacionesInternas() {
  const [polls, setPolls] = useState<InternalPoll[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  // Formulario
  const [question, setQuestion] = useState('');
  const [description, setDescription] = useState('');
  const [options, setOptions] = useState<string[]>(['', '']);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    loadPolls();
  }, []);

  async function loadPolls() {
    try {
      const { data, error } = await supabase
        .from('internal_polls')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPolls(data || []);
    } finally {
      setLoading(false);
    }
  }

  function addOption() {
    setOptions([...options, '']);
  }

  function removeOption(index: number) {
    if (options.length > 2) {
      setOptions(options.filter((_, i) => i !== index));
    }
  }

  function updateOption(index: number, value: string) {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    // Validaciones
    if (!question.trim() || !startDate || !endDate) {
      toast.error('Por favor completa todos los campos requeridos');
      return;
    }

    const validOptions = options.filter(opt => opt.trim());
    if (validOptions.length < 2) {
      toast.error('Debe haber al menos 2 opciones');
      return;
    }

    if (new Date(startDate) >= new Date(endDate)) {
      toast.error('La fecha de fin debe ser posterior a la fecha de inicio');
      return;
    }

    try {
      const { error } = await supabase
        .from('internal_polls')
        .insert({
          question: question.trim(),
          description: description.trim() || null,
          options: JSON.stringify(validOptions),
          start_date: startDate,
          end_date: endDate,
          is_active: true,
        });

      if (error) throw error;

      toast.success('Votación creada correctamente');
      
      // Limpiar formulario
      setQuestion('');
      setDescription('');
      setOptions(['', '']);
      setStartDate('');
      setEndDate('');
      setShowForm(false);

      loadPolls();
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al crear la votación');
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('¿Estás seguro de que deseas eliminar esta votación? También se eliminarán todos los votos asociados.')) return;

    try {
      const { error } = await supabase
        .from('internal_polls')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast.success('Votación eliminada');
      loadPolls();
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al eliminar la votación');
    }
  }

  async function toggleActive(id: string, currentStatus: boolean) {
    try {
      const { error } = await supabase
        .from('internal_polls')
        .update({ is_active: !currentStatus })
        .eq('id', id);

      if (error) throw error;

      toast.success(!currentStatus ? 'Votación activada' : 'Votación desactivada');
      loadPolls();
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al actualizar la votación');
    }
  }

  async function getVotesCount(pollId: string): Promise<number> {
    const { count } = await supabase
      .from('poll_votes')
      .select('*', { count: 'exact', head: true })
      .eq('poll_id', pollId);
    return count || 0;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        {/* Encabezado */}
        <div className="mb-8">
          <Link to="/admin/dashboard" className="text-red-600 hover:text-red-700 mb-4 inline-block">
            Volver al Panel de Administración
          </Link>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <Vote className="h-8 w-8 text-red-600" />
              <h1 className="text-3xl font-bold text-gray-900">Votaciones Internas</h1>
            </div>
            <button
              onClick={() => setShowForm(!showForm)}
              className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
            >
              <Plus className="h-5 w-5" />
              <span>Nueva Votación</span>
            </button>
          </div>
          <p className="text-gray-600">
            Crea y gestiona votaciones para que los afiliados participen en las decisiones sindicales.
          </p>
        </div>

        {/* Formulario de Nueva Votación */}
        {showForm && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Crear Nueva Votación</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Pregunta *
                </label>
                <input
                  type="text"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
                  placeholder="¿Cuál es la pregunta de la votación?"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descripción
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
                  placeholder="Descripción adicional (opcional)"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Opciones * (mínimo 2)
                </label>
                <div className="space-y-2">
                  {options.map((option, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={option}
                        onChange={(e) => updateOption(index, e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
                        placeholder={`Opción ${index + 1}`}
                      />
                      {options.length > 2 && (
                        <button
                          type="button"
                          onClick={() => removeOption(index)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded transition"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addOption}
                    className="flex items-center space-x-1 text-red-600 hover:text-red-700"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Añadir opción</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Fecha de Inicio *
                  </label>
                  <input
                    type="datetime-local"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Fecha de Fin *
                  </label>
                  <input
                    type="datetime-local"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              <div className="flex space-x-3">
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                >
                  Crear Votación
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Lista de Votaciones */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Votaciones ({polls.length})
          </h2>

          {loading ? (
            <p className="text-center text-gray-600 py-8">Cargando...</p>
          ) : polls.length === 0 ? (
            <p className="text-center text-gray-600 py-8">No hay votaciones creadas.</p>
          ) : (
            <div className="space-y-4">
              {polls.map((poll) => {
                const options = JSON.parse(poll.options as any) as string[];
                const isActive = new Date() >= new Date(poll.start_date) && new Date() <= new Date(poll.end_date);

                return (
                  <div key={poll.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">{poll.question}</h3>
                          {isActive && (
                            <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded">
                              Activa
                            </span>
                          )}
                        </div>
                        {poll.description && (
                          <p className="text-sm text-gray-600 mb-2">{poll.description}</p>
                        )}
                        <div className="flex items-center space-x-4 text-xs text-gray-500 mb-2">
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-3 w-3" />
                            <span>
                              {format(new Date(poll.start_date), "d MMM", { locale: es })} - {format(new Date(poll.end_date), "d MMM yyyy", { locale: es })}
                            </span>
                          </div>
                        </div>
                        <div className="text-sm text-gray-700">
                          <strong>Opciones:</strong> {options.join(', ')}
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 ml-4">
                        <label className="flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={poll.is_active}
                            onChange={() => toggleActive(poll.id, poll.is_active)}
                            className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded cursor-pointer"
                          />
                          <span className="ml-1 text-xs text-gray-700">Activa</span>
                        </label>
                        <button
                          onClick={() => handleDelete(poll.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded transition"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
