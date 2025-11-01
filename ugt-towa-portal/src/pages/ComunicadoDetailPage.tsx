import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useAuth } from '@/contexts/AuthContext';
import { supabase, Communique, Comment as CommentType } from '@/lib/supabase';
import { Calendar, MessageSquare } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { toast } from 'sonner';

export default function ComunicadoDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [communique, setCommunique] = useState<Communique | null>(null);
  const [comments, setComments] = useState<CommentType[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadCommunique();
      loadComments();
      subscribeToComments();
    }
  }, [id]);

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
      .select('*')
      .eq('post_id', id)
      .order('created_at', { ascending: false });
    if (data) setComments(data);
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
              {comments.map(comment => (
                <div key={comment.id} className="border-l-4 border-red-600 pl-4 py-2">
                  <p className="text-gray-700">{comment.content}</p>
                  <p className="text-sm text-gray-500 mt-2">
                    {format(new Date(comment.created_at), "d 'de' MMMM, yyyy 'a las' HH:mm", { locale: es })}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
