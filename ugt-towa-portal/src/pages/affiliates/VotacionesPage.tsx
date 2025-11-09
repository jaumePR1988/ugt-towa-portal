import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useAuth } from '@/contexts/AuthContext';
import { supabase, InternalPoll, PollVote } from '@/lib/supabase';
import { Vote } from 'lucide-react';
import { toast } from 'sonner';

export default function VotacionesPage() {
  const { user, isAffiliate } = useAuth();
  const navigate = useNavigate();
  const [polls, setPolls] = useState<InternalPoll[]>([]);
  const [votes, setVotes] = useState<{[key: string]: PollVote[]}>({});

  useEffect(() => {
    if (!isAffiliate) {
      navigate('/');
      return;
    }
    loadPolls();
  }, [isAffiliate, navigate, user]);

  async function loadPolls() {
    const { data } = await supabase
      .from('internal_polls')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false });
    if (data) {
      setPolls(data);
      data.forEach(poll => loadVotes(poll.id));
    }
  }

  async function loadVotes(pollId: string) {
    const { data } = await supabase
      .from('poll_votes')
      .select('*')
      .eq('poll_id', pollId);
    if (data) {
      setVotes(prev => ({ ...prev, [pollId]: data }));
    }
  }

  async function handleVote(pollId: string, option: string) {
    if (!user) {
      toast.error('Debes iniciar sesión para votar');
      return;
    }

    try {
      const { error } = await supabase
        .from('poll_votes')
        .insert([{
          poll_id: pollId,
          user_id: user.id,
          selected_option: option
        }]);

      if (error) {
        if (error.code === '23505') {
          toast.error('Ya has votado en esta votación');
        } else {
          throw error;
        }
      } else {
        toast.success('Voto registrado correctamente');
        loadVotes(pollId);
      }
    } catch (error) {
      toast.error('Error al votar');
    }
  }

  function getResults(poll: InternalPoll) {
    const pollVotes = votes[poll.id] || [];
    const totalVotes = pollVotes.length;
    
    return poll.options.map(option => {
      const optionVotes = pollVotes.filter(vote => vote.selected_option === option).length;
      const percentage = totalVotes > 0 ? Math.round((optionVotes / totalVotes) * 100) : 0;
      return { 
        id: poll.options.indexOf(option), 
        text: option, 
        votes: optionVotes, 
        percentage 
      };
    });
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-12">
        <div className="flex items-center mb-8">
          <Vote className="h-8 w-8 text-red-600 mr-3" />
          <h1 className="text-4xl font-bold text-gray-900">Votaciones Internas</h1>
        </div>

        <div className="max-w-3xl mx-auto space-y-8">
          {polls.map(poll => {
            const results = getResults(poll);
            const totalVotes = votes[poll.id]?.length || 0;
            const hasVoted = user && votes[poll.id]?.some(vote => vote.user_id === user.id);

            return (
              <div key={poll.id} className="bg-white rounded-lg shadow-md p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">{poll.question}</h2>
                {poll.description && (
                  <p className="text-gray-600 mb-6">{poll.description}</p>
                )}

                <div className="space-y-4">
                  {results.map(result => (
                    <div key={result.id}>
                      {!hasVoted ? (
                        <button
                          onClick={() => handleVote(poll.id, result.text)}
                          className="w-full text-left p-4 border-2 border-gray-200 rounded-lg hover:border-red-600 hover:bg-red-50 transition"
                        >
                          {result.text}
                        </button>
                      ) : (
                        <div className="p-4 border border-gray-200 rounded-lg">
                          <div className="flex justify-between items-center mb-2">
                            <span className="font-medium">{result.text}</span>
                            <span className="text-red-600 font-bold">{result.percentage}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-3">
                            <div
                              className="bg-red-600 h-3 rounded-full transition-all duration-500"
                              style={{ width: `${result.percentage}%` }}
                            ></div>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">{result.votes} votos</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <div className="mt-6 flex items-center text-sm text-gray-500">
                  <span>Total de votos: {totalVotes}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <Footer />
    </div>
  );
}
