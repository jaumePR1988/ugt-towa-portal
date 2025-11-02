import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useAuth } from '@/contexts/AuthContext';
import { supabase, Communique, Comment as CommentType, CommentReaction } from '@/lib/supabase';
import { Calendar, MessageSquare, ThumbsUp, ThumbsDown } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { toast } from 'sonner';

export default function ComunicadoDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [communique, setCommunique] = useState<Communique | null>(null);
  const [comments, setComments] = useState<CommentType[]>([]);
  const [reactions, setReactions] = useState<Record<string, CommentReaction[]>>({});
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadCommunique();
      loadComments();
      subscribeToComments();
    }
  }, [id]);

  useEffect(() => {
    if (comments.length > 0) {
      loadReactions();
    }
  }, [comments]);

  async function loadCommunique() {
    const { data } = await supabase
      .from('communiques')
      .select('*')
      .eq('id', id)
      .maybeSingle();
    if (data) setCommunique(data);
    setLoading(false);
  }

  async function loadComments() {
    const { data } = await supabase
      .from('comments')
      .select(`
        *,
        author:profiles(full_name)
      `)
      .eq('post_id', id)
      .order('created_at', { ascending: false });
    
    if (data) setComments(data);
  }

  async function loadReactions() {
    if (comments.length === 0) return;
    
    const { data } = await supabase
      .from('comment_reactions')
      .select('*')
      .in('comment_id', comments.map(c => c.id));
    
    if (data) {
      const grouped = data.reduce((acc, reaction) => {
        if (!acc[reaction.comment_id]) acc[reaction.comment_id] = [];
        acc[reaction.comment_id].push(reaction);
        return acc;
      }, {} as Record<string, CommentReaction[]>);
      setReactions(grouped);
    }
  }

  async function handleReaction(commentId: string, reactionType: 'like' | 'dislike') {
    if (!user) {
      toast.error('Debes iniciar sesión para reaccionar');
      return;
    }

    const existingReaction = reactions[commentId]?.find(r => r.user_id === user.id);

    if (existingReaction) {
      // Si ya reaccionó, eliminar la reacción
      const { error } = await supabase
        .from('comment_reactions')
        .delete()
        .eq('id', existingReaction.id);

      if (!error) {
        toast.success('Reacción eliminada');
        loadReactions();
      }
    } else {
      // Crear nueva reacción
      const { error } = await supabase
        .from('comment_reactions')
        .insert([{
          comment_id: commentId,
          user_id: user.id,
          reaction_type: reactionType
        }]);

      if (!error) {
        toast.success('Reacción agregada');
        loadReactions();
      }
    }
  }

  function subscribeToComments() {
    const channel = supabase
      .channel(`comments:${id}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'comments',
        filter: `post_id=eq.${id}`
      }, () => {
        loadComments();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }

  async function handleSubmitComment(e: React.FormEvent) {
    e.preventDefault();
    if (!user || !newComment.trim()) return;

    try {
      const { error } = await supabase
        .from('comments')
        .insert([{
          content: newComment,
          post_id: id,
          user_id: user.id
        }]);

      if (error) throw error;

      setNewComment('');
      toast.success('Comentario publicado');
    } catch (error) {
      toast.error('Error al publicar comentario');
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-12 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!communique) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-12 text-center">
          <p className="text-gray-600">Comunicado no encontrado</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <article className="bg-white rounded-lg shadow-md p-8 mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">{communique.title}</h1>
            <div className="flex items-center text-gray-500 mb-6">
              <Calendar className="h-4 w-4 mr-2" />
              <span>{format(new Date(communique.created_at), "d 'de' MMMM, yyyy", { locale: es })}</span>
              {communique.category && (
                <span className="ml-4 px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs">
                  {communique.category}
                </span>
              )}
            </div>
            <div className="prose max-w-none">
              {communique.image_url && (
                <img 
                  src={communique.image_url} 
                  alt={communique.title}
                  className="w-full h-auto rounded-lg mb-6"
                />
              )}
              <p className="text-gray-700 whitespace-pre-line">{communique.content}</p>
            </div>
          </article>

          <div className="bg-white rounded-lg shadow-md p-8">
            <div className="flex items-center mb-6">
              <MessageSquare className="h-6 w-6 text-red-600 mr-2" />
              <h2 className="text-2xl font-bold text-gray-900">
                Comentarios ({comments.length})
              </h2>
            </div>

            {user && (
              <form onSubmit={handleSubmitComment} className="mb-8">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Escribe un comentario..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 resize-none"
                  rows={3}
                />
                <button
                  type="submit"
                  className="mt-2 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Publicar
                </button>
              </form>
            )}

            <div className="space-y-4">
              {comments.map(comment => {
                const commentReactions = reactions[comment.id] || [];
                const likes = commentReactions.filter(r => r.reaction_type === 'like').length;
                const dislikes = commentReactions.filter(r => r.reaction_type === 'dislike').length;
                const userReaction = commentReactions.find(r => r.user_id === user?.id);

                return (
                  <div key={comment.id} className="border-l-4 border-red-600 pl-4 py-2">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="text-gray-700">{comment.content}</p>
                        <div className="flex items-center gap-4 mt-2">
                          <p className="text-sm font-medium text-gray-900">
                            {comment.author?.full_name || 'Usuario'}
                          </p>
                          <p className="text-sm text-gray-500">
                            {format(new Date(comment.created_at), "d 'de' MMMM, yyyy 'a las' HH:mm", { locale: es })}
                          </p>
                        </div>
                      </div>
                      {user && (
                        <div className="flex items-center gap-2 ml-4">
                          <button
                            onClick={() => handleReaction(comment.id, 'like')}
                            className={`flex items-center gap-1 px-2 py-1 rounded hover:bg-gray-100 ${
                              userReaction?.reaction_type === 'like' ? 'text-red-600' : 'text-gray-500'
                            }`}
                          >
                            <ThumbsUp className="h-4 w-4" />
                            <span className="text-sm">{likes}</span>
                          </button>
                          <button
                            onClick={() => handleReaction(comment.id, 'dislike')}
                            className={`flex items-center gap-1 px-2 py-1 rounded hover:bg-gray-100 ${
                              userReaction?.reaction_type === 'dislike' ? 'text-red-600' : 'text-gray-500'
                            }`}
                          >
                            <ThumbsDown className="h-4 w-4" />
                            <span className="text-sm">{dislikes}</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
