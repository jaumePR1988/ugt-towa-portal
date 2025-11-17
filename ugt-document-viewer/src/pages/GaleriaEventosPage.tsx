import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import EventGalleryView from '@/components/EventGalleryView';
import { ArrowLeft } from 'lucide-react';

export default function GaleriaEventosPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Header with back button */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link 
                to="/" 
                className="inline-flex items-center text-red-600 hover:text-red-700 transition-colors"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Volver al inicio
              </Link>
              <div className="h-6 w-px bg-gray-300"></div>
              <h1 className="text-2xl font-bold text-gray-900">
                Galería de Eventos
              </h1>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <EventGalleryView />
      </div>

      <Footer />
    </div>
  );
}
