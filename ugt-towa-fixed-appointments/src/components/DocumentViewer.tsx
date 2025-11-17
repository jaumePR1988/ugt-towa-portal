import React, { useState } from 'react';
import { X, ZoomIn, ZoomOut, Download, ChevronLeft, ChevronRight, FileText, Image } from 'lucide-react';
import { toast } from 'sonner';

interface DocumentViewerProps {
  isOpen: boolean;
  onClose: () => void;
  document: {
    title: string;
    description?: string;
    file_url: string;
    file_type?: string;
    category?: string;
    upload_date?: string;
  } | null;
}

export default function DocumentViewer({ isOpen, onClose, document }: DocumentViewerProps) {
  const [zoom, setZoom] = useState(100);
  const [loading, setLoading] = useState(false);

  if (!isOpen || !document) return null;

  const isImage = document.file_type && ['JPG', 'JPEG', 'PNG', 'WEBP', 'GIF'].includes(document.file_type.toUpperCase());
  const isPDF = document.file_type && document.file_type.toUpperCase() === 'PDF';

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 25, 200));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 25, 50));
  };

  const handleDownload = async () => {
    try {
      const response = await fetch(document.file_url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${document.title}.${document.file_type?.toLowerCase() || 'pdf'}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.success('Descarga iniciada');
    } catch (error) {
      toast.error('Error al descargar el archivo');
    }
  };

  const openInNewTab = () => {
    window.open(document.file_url, '_blank');
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center"
      onClick={handleOverlayClick}
    >
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 bg-white bg-opacity-95 backdrop-blur-sm p-4 z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {isImage ? (
              <Image className="h-6 w-6 text-red-600" />
            ) : (
              <FileText className="h-6 w-6 text-red-600" />
            )}
            <div>
              <h2 className="text-lg font-semibold text-gray-900">{document.title}</h2>
              {document.description && (
                <p className="text-sm text-gray-600">{document.description}</p>
              )}
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {/* Zoom Controls */}
            <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
              <button
                onClick={handleZoomOut}
                disabled={zoom <= 50}
                className="p-2 hover:bg-gray-200 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                title="Alejar"
              >
                <ZoomOut className="h-4 w-4" />
              </button>
              <span className="px-2 text-sm font-medium">{zoom}%</span>
              <button
                onClick={handleZoomIn}
                disabled={zoom >= 200}
                className="p-2 hover:bg-gray-200 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                title="Acercar"
              >
                <ZoomIn className="h-4 w-4" />
              </button>
            </div>

            {/* Download Button */}
            <button
              onClick={handleDownload}
              className="flex items-center space-x-1 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              title="Descargar"
            >
              <Download className="h-4 w-4" />
              <span className="hidden sm:inline">Descargar</span>
            </button>

            {/* Open in New Tab */}
            <button
              onClick={openInNewTab}
              className="flex items-center space-x-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              title="Abrir en nueva pestaña"
            >
              <span className="hidden sm:inline">Abrir</span>
            </button>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
              title="Cerrar"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Document Content */}
      <div className="flex-1 flex items-center justify-center p-16 mt-16 mb-4">
        <div className="w-full h-full flex items-center justify-center">
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
              <div className="bg-white p-4 rounded-lg">
                <p className="text-gray-900">Cargando documento...</p>
              </div>
            </div>
          )}

          {isImage ? (
            <img
              src={document.file_url}
              alt={document.title}
              style={{ transform: `scale(${zoom / 100})` }}
              className="max-w-full max-h-full object-contain transition-transform duration-200"
              onLoad={() => setLoading(false)}
              onError={() => {
                setLoading(false);
                toast.error('Error al cargar la imagen');
              }}
              draggable={false}
            />
          ) : isPDF ? (
            <iframe
              src={document.file_url}
              className="w-full h-full border-0"
              style={{ transform: `scale(${zoom / 100})` }}
              onLoad={() => setLoading(false)}
              onError={() => {
                setLoading(false);
                toast.error('Error al cargar el PDF');
              }}
              title={document.title}
            />
          ) : (
            <div className="bg-white p-8 rounded-lg text-center max-w-md">
              <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {document.title}
              </h3>
              <p className="text-gray-600 mb-4">
                Este tipo de documento no se puede previsualizar en línea.
              </p>
              <button
                onClick={handleDownload}
                className="flex items-center space-x-2 mx-auto px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              >
                <Download className="h-4 w-4" />
                <span>Descargar Documento</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Navigation Hints */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white bg-opacity-90 backdrop-blur-sm rounded-lg px-4 py-2">
        <p className="text-sm text-gray-600">
          {isImage ? 'Usa los controles de zoom para ajustar el tamaño' : 
           isPDF ? 'Navega en el PDF usando las barras de desplazamiento' : 
           'Este archivo debe descargarse para verse'}
        </p>
      </div>
    </div>
  );
}