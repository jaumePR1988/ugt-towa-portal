import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useAuth } from '@/contexts/AuthContext';
import { supabase, InternalPoll, PollVote } from '@/lib/supabase';
import { Vote as VoteIcon, User, BookOpen, Gift, Calendar, CheckCircle } from 'lucide-react';
import { format, isAfter, isBefore } from 'date-fns';
import { es } from 'date-fns/locale';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { toast } from 'sonner';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function VotacionesPage() {
  const { user, isAffiliate } = useAuth();
  const navigate = useNavigate();
  const [polls, setPolls] = useState<InternalPoll[]>([]);
  const [votes, setVotes] = useState<{[key: string]: PollVote[]}>({});
  const [userVotes, setUserVotes] = useState<{[key: string]: string}>({});
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState<'active' | 'closed'>('active');

  useEffect(() => {
    if (!isAffiliate) {
      navigate('/');
      return;
    }
    loadPolls();
  }, [isAffiliate, navigate, user]);

  async function loadPolls() {
    try {
      // Cargar votaciones
      const { data: pollsData, error } = await supabase
        .from('internal_polls')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Cargar votos de todas las votaciones
      const { data: votesData } = await supabase
        .from('poll_votes')
        .select('*');

      // Organizar votos por poll_id
      const votesByPoll: {[key: string]: PollVote[]} = {};
      const userVotesByPoll: {[key: string]: string} = {};

      votesData?.forEach(vote => {
        if (!votesByPoll[vote.poll_id]) {
          votesByPoll[vote.poll_id] = [];
        }
        votesByPoll[vote.poll_id].push(vote);

        if (vote.user_id === user?.id) {
          userVotesByPoll[vote.poll_id] = vote.selected_option;
        }
      });

      setPolls(pollsData || []);
      setVotes(votesByPoll);
      setUserVotes(userVotesByPoll);
    } finally {
      setLoading(false);
    }
  }

  async function handleVote(pollId: string, option: string) {
    try {
      const { error } = await supabase
        .from('poll_votes')
        .insert({
          poll_id: pollId,
          user_id: user?.id,
          selected_option: option,
        });

      if (error) {
        if (error.code === '23505') { // Unique constraint violation
          toast.error('Ya has votado en esta encuesta');
        } else {
          throw error;
        }
        return;
      }

      toast.success('Voto registrado correctamente');
      loadPolls(); // Recargar para actualizar resultados
    } catch (error) {
      console.error('Error al votar:', error);
      toast.error('Error al registrar el voto');
    }
  }

  function getChartData(pollId: string, options: string[]) {
    const pollVotes = votes[pollId] || [];
    const optionCounts: {[key: string]: number} = {};

    // Inicializar contadores
    options.forEach(opt => optionCounts[opt] = 0);

    // Contar votos
    pollVotes.forEach(vote => {
      if (optionCounts[vote.selected_option] !== undefined) {
        optionCounts[vote.selected_option]++;
      }
    });

    return {
      labels: options,
      datasets: [{
        data: options.map(opt => optionCounts[opt]),
        backgroundColor: [
          '#ef4444',
          '#f59e0b',
          '#10b981',
          '#3b82f6',
          '#8b5cf6',
          '#ec4899',
        ],
        borderWidth: 2,
        borderColor: '#fff',
      }],
    };
  }

  function isPollActive(poll: InternalPoll): boolean {
    const now = new Date();
    return isAfter(now, new Date(poll.start_date)) && isBefore(now, new Date(poll.end_date));
  }

  const activePolls = polls.filter(p => isPollActive(p));
  const closedPolls = polls.filter(p => !isPollActive(p));
  const displayPolls = selectedTab === 'active' ? activePolls : closedPolls;

  const menuItems = [
    { icon: User, label: 'Dashboard', path: '/afiliados/dashboard' },
    { icon: BookOpen, label: 'Biblioteca', path: '/afiliados/biblioteca' },
    { icon: VoteIcon, label: 'Votaciones', path: '/afiliados/votaciones' },
    { icon: Gift, label: 'Beneficios', path: '/afiliados/beneficios' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Navegación Lateral */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-4">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Menú de Afiliado</h2>
              <nav className="space-y-2">
                {menuItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-red-50 transition"
                  >
                    <item.icon className="h-5 w-5 text-red-600" />
                    <span className="text-gray-700">{item.label}</span>
                  </Link>
                ))}
              </nav>
            </div>
          </div>

          {/* Contenido Principal */}
          <div className="md:col-span-3 space-y-6">
            {/* Encabezado */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center space-x-3 mb-6">
                <VoteIcon className="h-8 w-8 text-red-600" />
                <h1 className="text-3xl font-bold text-gray-900">Votaciones Internas</h1>
              </div>
              <p className="text-gray-600">
                Participa en las decisiones sindicales y conoce los resultados en tiempo real.
              </p>
            </div>

            {/* Pestañas */}
            <div className="flex space-x-2 bg-white rounded-lg shadow-md p-2">
              <button
                onClick={() => setSelectedTab('active')}
                className={`flex-1 px-4 py-2 rounded-lg font-semibold transition ${
                  selectedTab === 'active'
                    ? 'bg-red-600 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Activas ({activePolls.length})
              </button>
              <button
                onClick={() => setSelectedTab('closed')}
                className={`flex-1 px-4 py-2 rounded-lg font-semibold transition ${
                  selectedTab === 'closed'
                    ? 'bg-red-600 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Cerradas ({closedPolls.length})
              </button>
            </div>

            {/* Votaciones */}
            {loading ? (
              <div className="text-center py-12">
                <p className="text-gray-600">Cargando votaciones...</p>
              </div>
            ) : displayPolls.length === 0 ? (
              <div className="bg-white rounded-lg shadow-md p-12 text-center">
                <VoteIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600">
                  {selectedTab === 'active' 
                    ? 'No hay votaciones activas en este momento.'
                    : 'No hay votaciones cerradas.'}
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {displayPolls.map((poll) => {
                  const hasVoted = !!userVotes[poll.id];
                  const pollVotesCount = (votes[poll.id] || []).length;
                  const options = JSON.parse(poll.options as any) as string[];

                  return (
                    <div key={poll.id} className="bg-white rounded-lg shadow-md p-6">
                      <div className="mb-4">
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">{poll.question}</h3>
                        {poll.description && (
                          <p className="text-gray-600 mb-4">{poll.description}</p>
                        )}
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-4 w-4" />
                            <span>
                              {format(new Date(poll.start_date), "d MMM", { locale: es })} - {format(new Date(poll.end_date), "d MMM yyyy", { locale: es })}
                            </span>
                          </div>
                          <span>{pollVotesCount} {pollVotesCount === 1 ? 'voto' : 'votos'}</span>
                          {hasVoted && (
                            <span className="flex items-center space-x-1 text-green-600">
                              <CheckCircle className="h-4 w-4" />
                              <span>Has votado</span>
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Opciones de Votación */}
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-3">Opciones:</h4>
                          <div className="space-y-2">
                            {options.map((option, index) => (
                              <button
                                key={index}
                                onClick={() => handleVote(poll.id, option)}
                                disabled={hasVoted || !isPollActive(poll)}
                                className={`w-full text-left px-4 py-3 rounded-lg border-2 transition ${
                                  userVotes[poll.id] === option
                                    ? 'border-green-500 bg-green-50'
                                    : hasVoted || !isPollActive(poll)
                                    ? 'border-gray-200 bg-gray-50 cursor-not-allowed'
                                    : 'border-gray-200 hover:border-red-600 hover:bg-red-50'
                                }`}
                              >
                                {option}
                                {userVotes[poll.id] === option && (
                                  <span className="ml-2 text-green-600 font-semibold">(Tu voto)</span>
                                )}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Gráfico de Resultados */}
                        {pollVotesCount > 0 && (
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-3">Resultados:</h4>
                            <div className="max-w-xs mx-auto">
                              <Pie data={getChartData(poll.id, options)} options={{ responsive: true }} />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
