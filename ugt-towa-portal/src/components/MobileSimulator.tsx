import { useState } from 'react';
import { Smartphone, Tablet, Monitor, RotateCw, X } from 'lucide-react';

type DeviceType = 'iphone14' | 'samsung' | 'ipad';
type Orientation = 'portrait' | 'landscape';

interface DeviceConfig {
  name: string;
  width: number;
  height: number;
  scaleFactor: number;
}

const DEVICES: Record<DeviceType, DeviceConfig> = {
  iphone14: {
    name: 'iPhone 14 Pro',
    width: 393,
    height: 852,
    scaleFactor: 0.6
  },
  samsung: {
    name: 'Samsung Galaxy S23',
    width: 360,
    height: 800,
    scaleFactor: 0.6
  },
  ipad: {
    name: 'iPad Air',
    width: 820,
    height: 1180,
    scaleFactor: 0.5
  }
};

interface MobileSimulatorProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileSimulator = ({ isOpen, onClose }: MobileSimulatorProps) => {
  const [device, setDevice] = useState<DeviceType>('iphone14');
  const [orientation, setOrientation] = useState<Orientation>('portrait');

  if (!isOpen) return null;

  const config = DEVICES[device];
  const width = orientation === 'portrait' ? config.width : config.height;
  const height = orientation === 'portrait' ? config.height : config.width;
  const scaledWidth = width * config.scaleFactor;
  const scaledHeight = height * config.scaleFactor;

  const toggleOrientation = () => {
    setOrientation(prev => prev === 'portrait' ? 'landscape' : 'portrait');
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      {/* Panel de controles */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-white dark:bg-gray-800 rounded-lg shadow-xl p-4 flex items-center gap-4 z-10">
        {/* Selector de dispositivo */}
        <div className="flex gap-2">
          <button
            onClick={() => setDevice('iphone14')}
            className={`p-2 rounded-lg transition-colors ${
              device === 'iphone14'
                ? 'bg-red-600 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
            title="iPhone 14 Pro"
          >
            <Smartphone className="w-5 h-5" />
          </button>
          <button
            onClick={() => setDevice('samsung')}
            className={`p-2 rounded-lg transition-colors ${
              device === 'samsung'
                ? 'bg-red-600 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
            title="Samsung Galaxy S23"
          >
            <Smartphone className="w-5 h-5" />
          </button>
          <button
            onClick={() => setDevice('ipad')}
            className={`p-2 rounded-lg transition-colors ${
              device === 'ipad'
                ? 'bg-red-600 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
            title="iPad Air"
          >
            <Tablet className="w-5 h-5" />
          </button>
        </div>

        {/* Separador */}
        <div className="w-px h-8 bg-gray-300 dark:bg-gray-600" />

        {/* Boton rotar */}
        <button
          onClick={toggleOrientation}
          className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          title="Rotar dispositivo"
        >
          <RotateCw className="w-5 h-5" />
        </button>

        {/* Separador */}
        <div className="w-px h-8 bg-gray-300 dark:bg-gray-600" />

        {/* Info del dispositivo */}
        <div className="text-sm">
          <div className="font-medium text-gray-900 dark:text-white">{config.name}</div>
          <div className="text-gray-500 dark:text-gray-400">
            {width} × {height}px
          </div>
        </div>

        {/* Separador */}
        <div className="w-px h-8 bg-gray-300 dark:bg-gray-600" />

        {/* Boton cerrar */}
        <button
          onClick={onClose}
          className="p-2 rounded-lg bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-800 transition-colors"
          title="Cerrar simulador"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Frame del dispositivo */}
      <div
        className="bg-gray-900 rounded-3xl shadow-2xl relative transition-all duration-300"
        style={{
          width: `${scaledWidth + 24}px`,
          height: `${scaledHeight + 24}px`,
          padding: '12px'
        }}
      >
        {/* Notch (para iPhone) */}
        {device === 'iphone14' && orientation === 'portrait' && (
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 bg-black w-40 h-7 rounded-b-3xl z-20" />
        )}

        {/* Pantalla */}
        <div className="w-full h-full bg-white rounded-2xl overflow-hidden relative">
          <iframe
            src={window.location.origin}
            className="w-full h-full border-0"
            style={{
              width: `${width}px`,
              height: `${height}px`,
              transform: `scale(${config.scaleFactor})`,
              transformOrigin: 'top left'
            }}
            title="Vista previa móvil"
          />
        </div>

        {/* Botón home (para algunos dispositivos) */}
        {device === 'iphone14' && orientation === 'portrait' && (
          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-white/30 rounded-full" />
        )}
      </div>

      {/* Instrucciones */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white dark:bg-gray-800 rounded-lg shadow-xl p-3 text-center">
        <p className="text-sm text-gray-600 dark:text-gray-300">
          <Monitor className="w-4 h-4 inline-block mr-1" />
          Vista previa interactiva - Puedes navegar dentro del simulador
        </p>
      </div>
    </div>
  );
};
