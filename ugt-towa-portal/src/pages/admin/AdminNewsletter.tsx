import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import Navbar from '../../components/Navbar';
import { 
  Mail, FileDown, Users, BarChart3, Plus, Trash2, Edit, Eye, 
  FileText, Calendar, TrendingUp, MessageSquare, Lightbulb,
  AlertCircle, CheckCircle, Clock, Download
} from 'lucide-react';
import { toast } from 'sonner';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import * as XLSX from 'xlsx';
import { format, subMonths, startOfMonth, endOfMonth, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

type ContentType = 'news' | 'events' | 'statistics' | 'directives' | 'suggestions';

interface NewsletterContent {
  id: string;
  type: ContentType;
  title: string;
  content: string;
  image_url: string | null;
  created_at: string;
  is_published: boolean;
  published_at: string | null;
}

interface NewsletterSent {
  id: string;
  subject: string;
  content: string;
  sent_at: string;
  total_generated: number;
  pdf_downloads: number;
  pdf_url: string | null;
  pdf_generated_at: string | null;
  status: 'draft' | 'generated';
}

interface Subscriber {
  id: string;
  email: string;
  name: string | null;
  subscribed_at: string;
  is_active: boolean;
}

export default function AdminNewsletter() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'content' | 'generated'>('dashboard');
  const [loading, setLoading] = useState(false);
  
  // Dashboard stats
  const [stats, setStats] = useState({
    totalSubscribers: 0,
    activeSubscribers: 0,
    totalContent: 0,
    newslettersGenerated: 0,
    newThisMonth: 0,
    growthRate: 0
  });
  
  const [monthlyGrowth, setMonthlyGrowth] = useState<{labels: string[], data: number[]}>({
    labels: [],
    data: []
  });

  // Content management
  const [contents, setContents] = useState<NewsletterContent[]>([]);
  const [showContentForm, setShowContentForm] = useState(false);
  const [editingContent, setEditingContent] = useState<NewsletterContent | null>(null);
  const [contentForm, setContentForm] = useState({
    type: 'news' as ContentType,
    title: '',
    content: '',
    image_url: '',
    is_published: false
  });
  const [uploadingImage, setUploadingImage] = useState(false);

  // Newsletters
  const [newsletters, setNewsletters] = useState<NewsletterSent[]>([]);
  const [selectedNewsletter, setSelectedNewsletter] = useState<NewsletterSent | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [previewHtml, setPreviewHtml] = useState('');
  const [editingNewsletter, setEditingNewsletter] = useState<NewsletterSent | null>(null);
  const [editedContent, setEditedContent] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);
  
  // Estados para el editor visual
  const [showVisualEditor, setShowVisualEditor] = useState(true);
  
  // Estados para gestión de bloques
  const [showBlockManager, setShowBlockManager] = useState(false);
  const [blockElements, setBlockElements] = useState<Array<{id: string, type: string, content: string}>>([]);

  // Subscribers
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);

  useEffect(() => {
    loadDashboardStats();
    loadContents();
    loadNewsletters();
    loadSubscribers();
    
    // Auto-actualización cada 30 segundos
    const interval = setInterval(() => {
      loadDashboardStats();
      loadSubscribers();
    }, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const loadDashboardStats = async () => {
    try {
      const [subsResult, contentResult, generatedResult] = await Promise.all([
        supabase.from('newsletter_subscribers').select('id, is_active, subscribed_at'),
        supabase.from('newsletter_content').select('id'),
        supabase.from('newsletters_sent').select('id').eq('status', 'generated')
      ]);

      const totalSubs = subsResult.data?.length || 0;
      const activeSubs = subsResult.data?.filter(s => s.is_active).length || 0;
      
      // Calcular nuevos suscriptores este mes
      const now = new Date();
      const startThisMonth = startOfMonth(now);
      const newThisMonth = subsResult.data?.filter(s => {
        const subDate = parseISO(s.subscribed_at);
        return subDate >= startThisMonth;
      }).length || 0;
      
      // Calcular tasa de crecimiento (comparado con mes anterior)
      const startLastMonth = startOfMonth(subMonths(now, 1));
      const endLastMonth = endOfMonth(subMonths(now, 1));
      const lastMonthSubs = subsResult.data?.filter(s => {
        const subDate = parseISO(s.subscribed_at);
        return subDate >= startLastMonth && subDate <= endLastMonth;
      }).length || 0;
      
      const growthRate = lastMonthSubs > 0 
        ? Math.round(((newThisMonth - lastMonthSubs) / lastMonthSubs) * 100)
        : 0;

      setStats({
        totalSubscribers: totalSubs,
        activeSubscribers: activeSubs,
        totalContent: contentResult.data?.length || 0,
        newslettersGenerated: generatedResult.data?.length || 0,
        newThisMonth,
        growthRate
      });
      
      // Calcular crecimiento mensual para gráfico (últimos 12 meses)
      calculateMonthlyGrowth(subsResult.data || []);
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };
  
  const calculateMonthlyGrowth = (subscribers: any[]) => {
    const now = new Date();
    const labels: string[] = [];
    const data: number[] = [];
    
    for (let i = 11; i >= 0; i--) {
      const monthDate = subMonths(now, i);
      const monthStart = startOfMonth(monthDate);
      const monthEnd = endOfMonth(monthDate);
      
      const count = subscribers.filter(s => {
        const subDate = parseISO(s.subscribed_at);
        return subDate >= monthStart && subDate <= monthEnd;
      }).length;
      
      labels.push(format(monthDate, 'MMM yyyy', { locale: es }));
      data.push(count);
    }
    
    setMonthlyGrowth({ labels, data });
  };

  const loadContents = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('newsletter_content')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setContents(data || []);
    } catch (error) {
      console.error('Error loading contents:', error);
      toast.error('Error cargando contenido');
    } finally {
      setLoading(false);
    }
  };

  const loadNewsletters = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('newsletters_sent')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setNewsletters(data || []);
    } catch (error) {
      console.error('Error loading newsletters:', error);
      toast.error('Error cargando newsletters');
    } finally {
      setLoading(false);
    }
  };

  const loadSubscribers = async () => {
    try {
      const { data, error } = await supabase
        .from('newsletter_subscribers')
        .select('*')
        .order('subscribed_at', { ascending: false });

      if (error) throw error;
      setSubscribers(data || []);
    } catch (error) {
      console.error('Error loading subscribers:', error);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Solo se permiten imágenes');
      return;
    }

    if (file.size > 5242880) {
      toast.error('La imagen no puede superar 5MB');
      return;
    }

    setUploadingImage(true);

    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64Data = reader.result as string;

        const { data, error } = await supabase.functions.invoke('upload-newsletter-image', {
          body: {
            imageData: base64Data,
            fileName: file.name
          }
        });

        if (error) throw error;

        setContentForm(prev => ({ ...prev, image_url: data.data.publicUrl }));
        toast.success('Imagen subida exitosamente');
      };

      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Error subiendo imagen');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSaveContent = async () => {
    if (!contentForm.title.trim() || !contentForm.content.trim()) {
      toast.error('Título y contenido son requeridos');
      return;
    }

    setLoading(true);

    try {
      if (editingContent) {
        const { error } = await supabase
          .from('newsletter_content')
          .update({
            ...contentForm,
            published_at: contentForm.is_published ? new Date().toISOString() : null
          })
          .eq('id', editingContent.id);

        if (error) throw error;
        toast.success('Contenido actualizado exitosamente');
      } else {
        const { error } = await supabase
          .from('newsletter_content')
          .insert({
            ...contentForm,
            created_by: user?.id,
            published_at: contentForm.is_published ? new Date().toISOString() : null
          });

        if (error) throw error;
        toast.success('Contenido creado exitosamente');
      }

      setShowContentForm(false);
      setEditingContent(null);
      setContentForm({
        type: 'news',
        title: '',
        content: '',
        image_url: '',
        is_published: false
      });
      loadContents();
      loadDashboardStats();
    } catch (error) {
      console.error('Error saving content:', error);
      toast.error('Error guardando contenido');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteContent = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar este contenido?')) return;

    try {
      const { error } = await supabase
        .from('newsletter_content')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Contenido eliminado');
      loadContents();
      loadDashboardStats();
    } catch (error) {
      console.error('Error deleting content:', error);
      toast.error('Error eliminando contenido');
    }
  };

  const handleGenerateDraft = async () => {
    if (!confirm('¿Generar borrador del newsletter con el contenido publicado del mes actual?')) return;

    setLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('generate-monthly-draft', {});

      if (error) throw error;

      toast.success(data.data.message);
      loadNewsletters();
    } catch (error) {
      console.error('Error generating draft:', error);
      toast.error('Error generando borrador');
    } finally {
      setLoading(false);
    }
  };

  const handlePreviewNewsletter = async (newsletter: NewsletterSent) => {
    setSelectedNewsletter(newsletter);
    setPreviewHtml(newsletter.content || '');
    setShowPreview(true);
  };

  const handleEditNewsletter = (newsletter: NewsletterSent) => {
    setEditingNewsletter(newsletter);
    setEditedContent(newsletter.content || '');
    setShowEditModal(true);
    setShowVisualEditor(true);
  };

  // Funciones para el editor visual
  const executeCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    // Actualizar el contenido después del comando
    const contentEditable = document.querySelector('.visual-editor') as HTMLElement;
    if (contentEditable) {
      setEditedContent(contentEditable.innerHTML);
    }
  };

  const handleEditorInput = () => {
    const contentEditable = document.querySelector('.visual-editor') as HTMLElement;
    if (contentEditable) {
      setEditedContent(contentEditable.innerHTML);
    }
  };

  const formatText = (command: string, value?: string) => {
    if (value) {
      executeCommand(command, value);
    } else {
      executeCommand(command);
    }
  };

  const addLink = () => {
    const url = prompt('Ingresa la URL del enlace:');
    if (url) {
      executeCommand('createLink', url);
    }
  };

  const addImage = () => {
    const url = prompt('Ingresa la URL de la imagen:');
    if (url) {
      executeCommand('insertImage', url);
    }
  };

  const toggleSource = () => {
    setShowVisualEditor(!showVisualEditor);
  };

  // Funciones para gestión de bloques
  const parseHtmlToBlocks = (html: string) => {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    const elements = Array.from(tempDiv.children);
    return elements.map((el, index) => ({
      id: `block-${index}`,
      type: el.tagName.toLowerCase(),
      content: el.outerHTML
    }));
  };

  const blocksToHtml = (blocks: Array<{id: string, type: string, content: string}>) => {
    return blocks.map(block => block.content).join('\n');
  };

  const openBlockManager = () => {
    const blocks = parseHtmlToBlocks(editedContent || '');
    setBlockElements(blocks);
    setShowBlockManager(true);
  };

  const addNewBlock = (type: string) => {
    const templates = {
      heading: '<h2>Nuevo Encabezado</h2>',
      paragraph: '<p>Nuevo párrafo de texto...</p>',
      image: '<img src="https://via.placeholder.com/400x200" alt="Imagen" style="max-width: 100%; height: auto;">',
      list: '<ul><li>Elemento de lista 1</li><li>Elemento de lista 2</li><li>Elemento de lista 3</li></ul>',
      table: '<table style="width: 100%; border-collapse: collapse;"><tr><th style="border: 1px solid #ddd; padding: 8px;">Columna 1</th><th style="border: 1px solid #ddd; padding: 8px;">Columna 2</th></tr><tr><td style="border: 1px solid #ddd; padding: 8px;">Dato 1</td><td style="border: 1px solid #ddd; padding: 8px;">Dato 2</td></tr></table>'
    };
    
    const newBlock = {
      id: `block-${Date.now()}`,
      type,
      content: templates[type as keyof typeof templates] || templates.paragraph
    };
    
    setBlockElements(prev => [...prev, newBlock]);
  };

  const removeBlock = (id: string) => {
    setBlockElements(prev => prev.filter(block => block.id !== id));
  };

  const moveBlock = (id: string, direction: 'up' | 'down') => {
    setBlockElements(prev => {
      const index = prev.findIndex(block => block.id === id);
      if (index === -1) return prev;
      
      const newBlocks = [...prev];
      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      
      if (targetIndex < 0 || targetIndex >= newBlocks.length) return prev;
      
      [newBlocks[index], newBlocks[targetIndex]] = [newBlocks[targetIndex], newBlocks[index]];
      return newBlocks;
    });
  };

  const saveBlocks = () => {
    const newHtml = blocksToHtml(blockElements);
    setEditedContent(newHtml);
    setShowBlockManager(false);
    
    // Actualizar el editor visual
    const contentEditable = document.querySelector('.visual-editor') as HTMLElement;
    if (contentEditable) {
      contentEditable.innerHTML = newHtml;
    }
  };

  const handleSaveEditedContent = async () => {
    if (!editingNewsletter) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('newsletters_sent')
        .update({ content: editedContent })
        .eq('id', editingNewsletter.id);

      if (error) throw error;

      toast.success('Contenido actualizado exitosamente');
      setShowEditModal(false);
      setEditingNewsletter(null);
      setEditedContent('');
      setShowVisualEditor(true);
      loadNewsletters();
    } catch (error) {
      console.error('Error updating newsletter:', error);
      toast.error('Error actualizando contenido');
    } finally {
      setLoading(false);
    }
  };

  const handleGeneratePDF = async (newsletter: NewsletterSent) => {
    if (!confirm(`¿Generar PDF del newsletter "${newsletter.subject}"?`)) return;

    setLoading(true);
    toast.info('Generando PDF... puede tardar unos segundos');

    try {
      // CARGAR EL CONTENIDO MÁS RECIENTE DESDE LA BASE DE DATOS
      const { data: newsletterData, error: loadError } = await supabase
        .from('newsletters_sent')
        .select('content')
        .eq('id', newsletter.id)
        .single();

      if (loadError) throw loadError;

      // Usar el contenido más reciente o el que se está editando actualmente
      const htmlContent = editingNewsletter?.id === newsletter.id ? editedContent : (newsletterData?.content || newsletter.content);
      
      if (!htmlContent || htmlContent.trim() === '') {
        throw new Error('El contenido del newsletter está vacío');
      }
      
      console.log('Generando PDF con contenido:', htmlContent.substring(0, 200) + '...');
      
      // Crear elemento temporal con el HTML del newsletter
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = htmlContent;
      tempDiv.style.width = '190mm'; // Reducido para mejor ajuste
      tempDiv.style.position = 'absolute';
      tempDiv.style.left = '-9999px';
      tempDiv.style.background = 'white';
      tempDiv.style.padding = '20px';
      tempDiv.style.fontFamily = 'Arial, sans-serif';
      tempDiv.style.fontSize = '14px';
      tempDiv.style.lineHeight = '1.6';
      document.body.appendChild(tempDiv);

      // Verificar que hay contenido visible
      const textContent = tempDiv.textContent?.trim();
      if (!textContent) {
        throw new Error('No se encontró contenido de texto en el newsletter');
      }

      console.log('Contenido de texto encontrado:', textContent.substring(0, 100) + '...');

      // Asegurar que las imágenes del QR se carguen antes de capturar
      const qrImages = tempDiv.querySelectorAll('img');
      await Promise.all(Array.from(qrImages).map(img => {
        return new Promise((resolve) => {
          if (img.complete) {
            resolve(true);
          } else {
            img.onload = () => resolve(true);
            img.onerror = () => {
              console.warn('Error cargando imagen:', img.src);
              resolve(true); // Continuar aunque falle
            };
            // Timeout después de 5 segundos
            setTimeout(() => {
              console.warn('Timeout cargando imagen:', img.src);
              resolve(true);
            }, 5000);
          }
        });
      }));

      // Esperar un poco más para asegurar carga de imágenes
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Convertir a canvas
      const canvas = await html2canvas(tempDiv, {
        scale: 1.2, // Reducido para evitar problemas de tamaño
        useCORS: true,
        logging: true, // Habilitar logs para debug
        backgroundColor: '#ffffff',
        allowTaint: true,
        foreignObjectRendering: true,
        imageTimeout: 5000,
        removeContainer: false
      });

      console.log('Canvas generado:', { width: canvas.width, height: canvas.height });

      if (canvas.width === 0 || canvas.height === 0) {
        throw new Error('El canvas se generó con tamaño cero');
      }

      // Crear PDF
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const imgData = canvas.toDataURL('image/png', 0.8); // Reducir calidad para evitar problemas
      const imgWidth = 190; // A4 width minus margins
      const pageWidth = 210;
      const pageHeight = 297;
      const margin = 10;
      const availableWidth = pageWidth - (2 * margin);
      const imgHeight = (canvas.height * availableWidth) / canvas.width;
      
      let heightLeft = imgHeight;
      let position = 0;
      let page = 1;

      // Agregar primera página
      pdf.addImage(imgData, 'PNG', margin, margin + position, availableWidth, imgHeight);
      heightLeft -= (pageHeight - 2 * margin);

      // Agregar páginas adicionales si es necesario
      while (heightLeft > 0) {
        page++;
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', margin, margin + position, availableWidth, imgHeight);
        heightLeft -= (pageHeight - 2 * margin);
      }

      // Descargar PDF
      const fileName = `newsletter-ugt-towa-${new Date().toISOString().split('T')[0]}.pdf`;
      pdf.save(fileName);

      // Limpiar
      document.body.removeChild(tempDiv);

      // Actualizar estadísticas
      const currentGenerated = newsletter.total_generated || 0;
      const { error: updateError } = await supabase
        .from('newsletters_sent')
        .update({
          total_generated: currentGenerated + 1,
          pdf_generated_at: new Date().toISOString(),
          status: 'generated'
        })
        .eq('id', newsletter.id);

      if (updateError) throw updateError;

      toast.success('PDF generado y descargado exitosamente');
      loadNewsletters();
      loadDashboardStats();
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error('Error generando PDF: ' + (error instanceof Error ? error.message : 'Error desconocido'));
    } finally {
      setLoading(false);
    }
  };

  const exportSubscribersToExcel = () => {
    try {
      toast.info('Generando archivo Excel...');

      // Preparar datos para Excel
      const excelData = subscribers.map((sub, index) => ({
        '#': index + 1,
        'Email': sub.email,
        'Nombre': sub.name || 'Sin nombre',
        'Estado': sub.is_active ? 'Activo' : 'Inactivo',
        'Fecha de Suscripción': format(new Date(sub.subscribed_at), "d 'de' MMMM, yyyy HH:mm", { locale: es })
      }));

      // Crear workbook
      const worksheet = XLSX.utils.json_to_sheet(excelData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Suscriptores');

      // Ajustar anchos de columnas
      const colWidths = [
        { wch: 5 },   // #
        { wch: 35 },  // Email
        { wch: 25 },  // Nombre
        { wch: 10 },  // Estado
        { wch: 30 }   // Fecha
      ];
      worksheet['!cols'] = colWidths;

      // Generar archivo
      const fileName = `suscriptores-newsletter-${format(new Date(), 'yyyy-MM-dd')}.xlsx`;
      XLSX.writeFile(workbook, fileName);

      toast.success(`Archivo Excel descargado: ${fileName}`);
    } catch (error) {
      console.error('Error exportando a Excel:', error);
      toast.error('Error al exportar a Excel');
    }
  };

  const getContentTypeIcon = (type: ContentType) => {
    switch (type) {
      case 'news': return <FileText className="w-5 h-5 text-blue-600" />;
      case 'events': return <Calendar className="w-5 h-5 text-green-600" />;
      case 'statistics': return <TrendingUp className="w-5 h-5 text-purple-600" />;
      case 'directives': return <MessageSquare className="w-5 h-5 text-orange-600" />;
      case 'suggestions': return <Lightbulb className="w-5 h-5 text-yellow-600" />;
    }
  };

  const getContentTypeName = (type: ContentType) => {
    const names = {
      news: 'Noticia',
      events: 'Evento',
      statistics: 'Estadística',
      directives: 'Comunicado',
      suggestions: 'Sugerencia'
    };
    return names[type];
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'generated': return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'draft': return <Clock className="w-5 h-5 text-gray-600" />;
      default: return <Clock className="w-5 h-5 text-gray-600" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Gestión de Newsletter</h1>
          <p className="text-gray-600">Sistema de newsletter mensual sindical - Generación de PDF</p>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`px-6 py-4 text-sm font-medium border-b-2 ${
                  activeTab === 'dashboard'
                    ? 'border-red-600 text-red-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Dashboard
                </div>
              </button>
              <button
                onClick={() => setActiveTab('content')}
                className={`px-6 py-4 text-sm font-medium border-b-2 ${
                  activeTab === 'content'
                    ? 'border-red-600 text-red-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Contenido
                </div>
              </button>
              <button
                onClick={() => setActiveTab('generated')}
                className={`px-6 py-4 text-sm font-medium border-b-2 ${
                  activeTab === 'generated'
                    ? 'border-red-600 text-red-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  <FileDown className="w-5 h-5" />
                  Newsletters Generados
                </div>
              </button>
            </nav>
          </div>
        </div>

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm">Suscriptores Totales</p>
                    <p className="text-3xl font-bold text-gray-900">{stats.totalSubscribers}</p>
                  </div>
                  <Users className="w-12 h-12 text-blue-600" />
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm">Suscriptores Activos</p>
                    <p className="text-3xl font-bold text-green-600">{stats.activeSubscribers}</p>
                  </div>
                  <CheckCircle className="w-12 h-12 text-green-600" />
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm">Contenido Creado</p>
                    <p className="text-3xl font-bold text-purple-600">{stats.totalContent}</p>
                  </div>
                  <FileText className="w-12 h-12 text-purple-600" />
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm">PDFs Generados</p>
                    <p className="text-3xl font-bold text-red-600">{stats.newslettersGenerated}</p>
                  </div>
                  <FileDown className="w-12 h-12 text-red-600" />
                </div>
              </div>
            </div>
            
            {/* Additional Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm">Nuevos Este Mes</p>
                    <p className="text-3xl font-bold text-blue-600">{stats.newThisMonth}</p>
                    {stats.growthRate !== 0 && (
                      <p className={`text-sm mt-1 flex items-center ${stats.growthRate > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        <TrendingUp className="h-4 w-4 mr-1" />
                        {stats.growthRate > 0 ? '+' : ''}{stats.growthRate}% vs mes anterior
                      </p>
                    )}
                  </div>
                  <TrendingUp className="w-12 h-12 text-blue-600" />
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm">Tasa de Actividad</p>
                    <p className="text-3xl font-bold text-green-600">
                      {stats.totalSubscribers > 0 
                        ? Math.round((stats.activeSubscribers / stats.totalSubscribers) * 100)
                        : 0}%
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {stats.activeSubscribers} de {stats.totalSubscribers} activos
                    </p>
                  </div>
                  <BarChart3 className="w-12 h-12 text-green-600" />
                </div>
              </div>
            </div>
            
            {/* Growth Chart */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                Crecimiento de Suscriptores (Últimos 12 Meses)
              </h2>
              <div className="h-80">
                <Line
                  data={{
                    labels: monthlyGrowth.labels,
                    datasets: [
                      {
                        label: 'Nuevos Suscriptores',
                        data: monthlyGrowth.data,
                        borderColor: 'rgb(220, 38, 38)',
                        backgroundColor: 'rgba(220, 38, 38, 0.1)',
                        tension: 0.4,
                        fill: true,
                      },
                    ],
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        display: true,
                        position: 'top' as const,
                      },
                      tooltip: {
                        mode: 'index',
                        intersect: false,
                      },
                    },
                    scales: {
                      y: {
                        beginAtZero: true,
                        ticks: {
                          stepSize: 1,
                        },
                      },
                    },
                  }}
                />
              </div>
            </div>

            {/* Actions */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-bold mb-4">Acciones Rápidas</h2>
              <div className="flex flex-wrap gap-4">
                <button
                  onClick={handleGenerateDraft}
                  disabled={loading}
                  className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-400 flex items-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  Generar Borrador Mensual
                </button>
                <button
                  onClick={() => {
                    setShowContentForm(true);
                    setEditingContent(null);
                    setContentForm({
                      type: 'news',
                      title: '',
                      content: '',
                      image_url: '',
                      is_published: false
                    });
                  }}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  Crear Contenido
                </button>
              </div>
            </div>

            {/* Recent Subscribers */}
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Suscriptores Recientes</h2>
                <button
                  onClick={exportSubscribersToExcel}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2 text-sm"
                >
                  <Download className="w-4 h-4" />
                  Exportar a Excel
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nombre</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {subscribers.slice(0, 5).map((sub) => (
                      <tr key={sub.id}>
                        <td className="px-6 py-4 text-sm text-gray-900">{sub.email}</td>
                        <td className="px-6 py-4 text-sm text-gray-900">{sub.name || '-'}</td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {new Date(sub.subscribed_at).toLocaleDateString('es-ES')}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          {sub.is_active ? (
                            <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Activo</span>
                          ) : (
                            <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs">Inactivo</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Content Tab */}
        {activeTab === 'content' && (
          <div className="space-y-6">
            {!showContentForm ? (
              <>
                <div className="bg-white p-6 rounded-lg shadow">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">Contenido del Newsletter</h2>
                    <button
                      onClick={() => {
                        setShowContentForm(true);
                        setEditingContent(null);
                        setContentForm({
                          type: 'news',
                          title: '',
                          content: '',
                          image_url: '',
                          is_published: false
                        });
                      }}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2"
                    >
                      <Plus className="w-5 h-5" />
                      Nuevo Contenido
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {contents.map((content) => (
                      <div key={content.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-2">
                            {getContentTypeIcon(content.type)}
                            <span className="text-sm font-medium text-gray-700">
                              {getContentTypeName(content.type)}
                            </span>
                          </div>
                          {content.is_published && (
                            <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                              Publicado
                            </span>
                          )}
                        </div>

                        {content.image_url && (
                          <img src={content.image_url} alt={content.title} className="w-full h-32 object-cover rounded mb-3" />
                        )}

                        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{content.title}</h3>
                        <p className="text-sm text-gray-600 mb-3 line-clamp-3">{content.content}</p>

                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              setEditingContent(content);
                              setContentForm({
                                type: content.type,
                                title: content.title,
                                content: content.content,
                                image_url: content.image_url || '',
                                is_published: content.is_published
                              });
                              setShowContentForm(true);
                            }}
                            className="flex-1 px-3 py-2 bg-blue-50 text-blue-600 rounded hover:bg-blue-100 flex items-center justify-center gap-2"
                          >
                            <Edit className="w-4 h-4" />
                            Editar
                          </button>
                          <button
                            onClick={() => handleDeleteContent(content.id)}
                            className="flex-1 px-3 py-2 bg-red-50 text-red-600 rounded hover:bg-red-100 flex items-center justify-center gap-2"
                          >
                            <Trash2 className="w-4 h-4" />
                            Eliminar
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {contents.length === 0 && (
                    <div className="text-center py-12 text-gray-500">
                      No hay contenido creado todavía
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-xl font-bold mb-6">
                  {editingContent ? 'Editar Contenido' : 'Nuevo Contenido'}
                </h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tipo de Contenido
                    </label>
                    <select
                      value={contentForm.type}
                      onChange={(e) => setContentForm({ ...contentForm, type: e.target.value as ContentType })}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2"
                    >
                      <option value="news">Noticia</option>
                      <option value="events">Evento</option>
                      <option value="statistics">Estadística</option>
                      <option value="directives">Comunicado</option>
                      <option value="suggestions">Sugerencia</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Título
                    </label>
                    <input
                      type="text"
                      value={contentForm.title}
                      onChange={(e) => setContentForm({ ...contentForm, title: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2"
                      placeholder="Título del contenido"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Contenido
                    </label>
                    <textarea
                      value={contentForm.content}
                      onChange={(e) => setContentForm({ ...contentForm, content: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2"
                      rows={6}
                      placeholder="Descripción del contenido"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Imagen (opcional)
                    </label>
                    <div className="flex items-center gap-4">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        disabled={uploadingImage}
                        className="flex-1 border border-gray-300 rounded-lg px-4 py-2"
                      />
                      {uploadingImage && <span className="text-sm text-gray-500">Subiendo...</span>}
                    </div>
                    {contentForm.image_url && (
                      <div className="mt-3">
                        <img src={contentForm.image_url} alt="Preview" className="w-full max-w-md h-48 object-cover rounded" />
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="is_published"
                      checked={contentForm.is_published}
                      onChange={(e) => setContentForm({ ...contentForm, is_published: e.target.checked })}
                      className="w-4 h-4"
                    />
                    <label htmlFor="is_published" className="text-sm text-gray-700">
                      Publicar inmediatamente (incluir en próximo newsletter)
                    </label>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      onClick={handleSaveContent}
                      disabled={loading}
                      className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-400"
                    >
                      {editingContent ? 'Actualizar' : 'Crear'} Contenido
                    </button>
                    <button
                      onClick={() => {
                        setShowContentForm(false);
                        setEditingContent(null);
                      }}
                      className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Generated Newsletters Tab */}
        {activeTab === 'generated' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-bold mb-4">Newsletters Generados</h2>

              <div className="space-y-4">
                {newsletters.map((newsletter) => (
                  <div key={newsletter.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          {getStatusIcon(newsletter.status)}
                          <h3 className="font-semibold text-gray-900">{newsletter.subject}</h3>
                        </div>
                        <p className="text-sm text-gray-500">
                          {newsletter.status === 'generated' 
                            ? `PDF generado el ${new Date(newsletter.pdf_generated_at || '').toLocaleDateString('es-ES')}`
                            : 'Borrador - PDF no generado aún'
                          }
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handlePreviewNewsletter(newsletter)}
                          className="px-4 py-2 bg-blue-50 text-blue-600 rounded hover:bg-blue-100 flex items-center gap-2"
                        >
                          <Eye className="w-4 h-4" />
                          Vista Previa
                        </button>
                        <button
                          onClick={() => handleEditNewsletter(newsletter)}
                          className="px-4 py-2 bg-orange-50 text-orange-600 rounded hover:bg-orange-100 flex items-center gap-2"
                        >
                          <Edit className="w-4 h-4" />
                          Editar
                        </button>
                        <button
                          onClick={() => handleGeneratePDF(newsletter)}
                          disabled={loading}
                          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:bg-gray-400 flex items-center gap-2"
                        >
                          <FileDown className="w-4 h-4" />
                          Generar PDF
                        </button>
                      </div>
                    </div>

                    {newsletter.status === 'generated' && (
                      <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t">
                        <div className="text-center">
                          <p className="text-2xl font-bold text-gray-900">{newsletter.total_generated}</p>
                          <p className="text-sm text-gray-500">Generaciones</p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-bold text-green-600">{newsletter.pdf_downloads || 0}</p>
                          <p className="text-sm text-gray-500">Descargas</p>
                        </div>
                      </div>
                    )}
                  </div>
                ))}

                {newsletters.length === 0 && (
                  <div className="text-center py-12 text-gray-500">
                    No hay newsletters todavía
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Preview Modal */}
        {showPreview && selectedNewsletter && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
              <div className="p-4 border-b flex items-center justify-between">
                <h3 className="text-lg font-semibold">{selectedNewsletter.subject}</h3>
                <button
                  onClick={() => setShowPreview(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <span className="sr-only">Cerrar</span>
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="flex-1 overflow-auto p-4">
                <div dangerouslySetInnerHTML={{ __html: previewHtml }} />
              </div>
            </div>
          </div>
        )}

        {/* Edit Content Modal with Visual Editor */}
        {showEditModal && editingNewsletter && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col">
              <div className="p-4 border-b flex items-center justify-between">
                <h3 className="text-lg font-semibold">Editar Newsletter: {editingNewsletter.subject}</h3>
                <button
                  onClick={() => {
                    setShowEditModal(false);
                    setEditingNewsletter(null);
                    setEditedContent('');
                    setShowVisualEditor(true);
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <span className="sr-only">Cerrar</span>
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              {/* Toolbar del Editor */}
              <div className="p-4 border-b bg-gray-50">
                <div className="flex flex-wrap gap-2 items-center">
                  <div className="flex gap-1 border-r pr-2 mr-2">
                    <button
                      onClick={() => formatText('bold')}
                      className="px-3 py-1 bg-white border rounded hover:bg-gray-100 font-bold"
                      title="Negrita"
                    >
                      B
                    </button>
                    <button
                      onClick={() => formatText('italic')}
                      className="px-3 py-1 bg-white border rounded hover:bg-gray-100 italic"
                      title="Cursiva"
                    >
                      I
                    </button>
                    <button
                      onClick={() => formatText('underline')}
                      className="px-3 py-1 bg-white border rounded hover:bg-gray-100 underline"
                      title="Subrayado"
                    >
                      U
                    </button>
                  </div>
                  
                  <div className="flex gap-1 border-r pr-2 mr-2">
                    <button
                      onClick={() => formatText('insertUnorderedList')}
                      className="px-3 py-1 bg-white border rounded hover:bg-gray-100"
                      title="Lista con viñetas"
                    >
                      •
                    </button>
                    <button
                      onClick={() => formatText('insertOrderedList')}
                      className="px-3 py-1 bg-white border rounded hover:bg-gray-100"
                      title="Lista numerada"
                    >
                      1.
                    </button>
                  </div>
                  
                  <div className="flex gap-1 border-r pr-2 mr-2">
                    <button
                      onClick={() => {
                        const header = prompt('Nivel de encabezado (h1, h2, h3, h4, h5, h6):', 'h2');
                        if (header && ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(header || '')) {
                          formatText('formatBlock', header);
                        }
                      }}
                      className="px-3 py-1 bg-white border rounded hover:bg-gray-100"
                      title="Encabezado"
                    >
                      H
                    </button>
                    <button
                      onClick={() => formatText('formatBlock', 'p')}
                      className="px-3 py-1 bg-white border rounded hover:bg-gray-100"
                      title="Párrafo"
                    >
                      P
                    </button>
                  </div>
                  
                  <div className="flex gap-1 border-r pr-2 mr-2">
                    <button
                      onClick={addLink}
                      className="px-3 py-1 bg-white border rounded hover:bg-gray-100"
                      title="Agregar enlace"
                    >
                      Link
                    </button>
                    <button
                      onClick={addImage}
                      className="px-3 py-1 bg-white border rounded hover:bg-gray-100"
                      title="Agregar imagen"
                    >
                      IMG
                    </button>
                  </div>
                  
                  <div className="flex gap-1">
                    <button
                      onClick={toggleSource}
                      className="px-3 py-1 bg-white border rounded hover:bg-gray-100 text-sm"
                      title={showVisualEditor ? 'Ver código HTML' : 'Editor visual'}
                    >
                      {showVisualEditor ? 'HTML' : 'Visual'}
                    </button>
                    <button
                      onClick={openBlockManager}
                      className="px-3 py-1 bg-blue-500 text-white border rounded hover:bg-blue-600 text-sm"
                      title="Gestionar bloques de contenido"
                    >
                      Bloques
                    </button>
                  </div>
                </div>
                
                <p className="text-xs text-gray-500 mt-2">
                  <strong>Editor Visual:</strong> Use los botones para formatear el texto sin necesidad de HTML. 
                  {showVisualEditor ? ' Cambie a HTML para ver el código.' : ' Está editando directamente el código HTML.'}
                </p>
                <p className="text-xs text-blue-600 mt-1">
                  <strong>Tip:</strong> Use el botón "Bloques" para añadir, quitar y reorganizar secciones completas de contenido.
                </p>
              </div>
              
              <div className="flex-1 overflow-auto p-4">
                {showVisualEditor ? (
                  <div className="border border-gray-300 rounded-lg">
                    <div
                      className="visual-editor p-4 min-h-96 outline-none"
                      contentEditable
                      suppressContentEditableWarning
                      dangerouslySetInnerHTML={{ __html: editedContent }}
                      onInput={handleEditorInput}
                      style={{
                        fontFamily: 'Arial, sans-serif',
                        fontSize: '14px',
                        lineHeight: '1.6'
                      }}
                    />
                  </div>
                ) : (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Código HTML
                    </label>
                    <textarea
                      value={editedContent}
                      onChange={(e) => setEditedContent(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 font-mono text-sm"
                      rows={20}
                      placeholder="Edite el contenido HTML del newsletter aquí..."
                    />
                  </div>
                )}
              </div>
              
              <div className="p-4 border-t bg-gray-50 flex justify-end gap-3">
                <button
                  onClick={() => {
                    setShowEditModal(false);
                    setEditingNewsletter(null);
                    setEditedContent('');
                    setShowVisualEditor(true);
                  }}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSaveEditedContent}
                  disabled={loading}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-400 flex items-center gap-2"
                >
                  <Edit className="w-4 h-4" />
                  {loading ? 'Guardando...' : 'Guardar Cambios'}
                </button>
              </div>
            </div>
          </div>
        )}
        
        {/* Block Manager Modal */}
        {showBlockManager && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60] p-4">
            <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col">
              <div className="p-4 border-b flex items-center justify-between">
                <h3 className="text-lg font-semibold">Gestor de Bloques de Contenido</h3>
                <button
                  onClick={() => setShowBlockManager(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <span className="sr-only">Cerrar</span>
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              {/* Toolbar para añadir bloques */}
              <div className="p-4 border-b bg-gray-50">
                <div className="flex flex-wrap gap-2 items-center">
                  <span className="text-sm font-medium text-gray-700 mr-2">Añadir bloque:</span>
                  <button
                    onClick={() => addNewBlock('heading')}
                    className="px-3 py-1 bg-white border rounded hover:bg-gray-100 text-sm"
                  >
                    Encabezado
                  </button>
                  <button
                    onClick={() => addNewBlock('paragraph')}
                    className="px-3 py-1 bg-white border rounded hover:bg-gray-100 text-sm"
                  >
                    Párrafo
                  </button>
                  <button
                    onClick={() => addNewBlock('image')}
                    className="px-3 py-1 bg-white border rounded hover:bg-gray-100 text-sm"
                  >
                    Imagen
                  </button>
                  <button
                    onClick={() => addNewBlock('list')}
                    className="px-3 py-1 bg-white border rounded hover:bg-gray-100 text-sm"
                  >
                    Lista
                  </button>
                  <button
                    onClick={() => addNewBlock('table')}
                    className="px-3 py-1 bg-white border rounded hover:bg-gray-100 text-sm"
                  >
                    Tabla
                  </button>
                </div>
              </div>
              
              {/* Lista de bloques */}
              <div className="flex-1 overflow-auto p-4">
                <div className="space-y-4">
                  {blockElements.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                      <p>No hay bloques de contenido.</p>
                      <p className="text-sm mt-1">Usa los botones de arriba para añadir bloques.</p>
                    </div>
                  ) : (
                    blockElements.map((block, index) => (
                      <div key={block.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded">
                              {block.type.toUpperCase()}
                            </span>
                            <span className="text-sm text-gray-500">Bloque {index + 1}</span>
                          </div>
                          <div className="flex gap-1">
                            <button
                              onClick={() => moveBlock(block.id, 'up')}
                              disabled={index === 0}
                              className="p-1 text-gray-600 hover:text-gray-800 disabled:text-gray-400"
                              title="Mover hacia arriba"
                            >
                              ↑
                            </button>
                            <button
                              onClick={() => moveBlock(block.id, 'down')}
                              disabled={index === blockElements.length - 1}
                              className="p-1 text-gray-600 hover:text-gray-800 disabled:text-gray-400"
                              title="Mover hacia abajo"
                            >
                              ↓
                            </button>
                            <button
                              onClick={() => removeBlock(block.id)}
                              className="p-1 text-red-600 hover:text-red-800"
                              title="Eliminar bloque"
                            >
                              ×
                            </button>
                          </div>
                        </div>
                        <div className="bg-white p-3 rounded border text-sm">
                          <div dangerouslySetInnerHTML={{ __html: block.content }} />
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
              
              {/* Footer con botones */}
              <div className="p-4 border-t bg-gray-50 flex justify-end gap-3">
                <button
                  onClick={() => setShowBlockManager(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                >
                  Cancelar
                </button>
                <button
                  onClick={saveBlocks}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Aplicar Cambios
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
