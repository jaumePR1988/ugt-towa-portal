import React, { useRef, useEffect, useState } from 'react';
import { 
  Bold, 
  Italic, 
  List, 
  Link as LinkIcon, 
  AlignLeft, 
  AlignCenter, 
  AlignRight,
  Type
} from 'lucide-react';

interface SimpleTextEditorProps {
  value: string;
  onChange: (content: string) => void;
  placeholder?: string;
  disabled?: boolean;
  minHeight?: number;
}

const COLORS = [
  { name: 'Negro', value: '#000000' },
  { name: 'Rojo UGT', value: '#DC2626' },
  { name: 'Rojo Oscuro', value: '#991B1B' },
  { name: 'Azul', value: '#3B82F6' },
  { name: 'Verde', value: '#10B981' },
  { name: 'Naranja', value: '#F59E0B' },
  { name: 'Gris', value: '#6B7280' },
];

export default function SimpleTextEditor({
  value,
  onChange,
  placeholder = 'Escribe el contenido del comunicado...',
  disabled = false,
  minHeight = 400
}: SimpleTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showLinkDialog, setShowLinkDialog] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [charCount, setCharCount] = useState(0);

  // Inicializar contenido del editor
  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value;
      updateCharCount();
    }
  }, [value]);

  // Actualizar contador de caracteres
  const updateCharCount = () => {
    if (editorRef.current) {
      const text = editorRef.current.innerText || '';
      setCharCount(text.length);
    }
  };

  // Manejar cambios en el editor
  const handleInput = () => {
    if (editorRef.current) {
      const content = editorRef.current.innerHTML;
      onChange(content);
      updateCharCount();
    }
  };

  // Ejecutar comando de formato
  const executeCommand = (command: string, value: string | null = null) => {
    document.execCommand(command, false, value || undefined);
    editorRef.current?.focus();
  };

  // Aplicar negrita
  const applyBold = () => {
    executeCommand('bold');
  };

  // Aplicar cursiva
  const applyItalic = () => {
    executeCommand('italic');
  };

  // Aplicar color
  const applyColor = (color: string) => {
    executeCommand('foreColor', color);
    setShowColorPicker(false);
  };

  // Aplicar lista con viñetas
  const applyBulletList = () => {
    executeCommand('insertUnorderedList');
  };

  // Aplicar alineación
  const applyAlignment = (align: 'left' | 'center' | 'right') => {
    const command = align === 'left' ? 'justifyLeft' : 
                    align === 'center' ? 'justifyCenter' : 
                    'justifyRight';
    executeCommand(command);
  };

  // Insertar enlace
  const insertLink = () => {
    if (linkUrl) {
      executeCommand('createLink', linkUrl);
      setShowLinkDialog(false);
      setLinkUrl('');
    }
  };

  // Manejar atajos de teclado
  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Ctrl+B para negrita
    if (e.ctrlKey && e.key === 'b') {
      e.preventDefault();
      applyBold();
    }
    // Ctrl+I para cursiva
    if (e.ctrlKey && e.key === 'i') {
      e.preventDefault();
      applyItalic();
    }
  };

  return (
    <div className="simple-text-editor border border-gray-300 rounded-lg overflow-hidden bg-white">
      {/* Toolbar */}
      <div className="bg-gray-50 border-b border-gray-300 p-2 flex flex-wrap gap-1">
        {/* Negrita */}
        <button
          type="button"
          onClick={applyBold}
          disabled={disabled}
          className="p-2 hover:bg-gray-200 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          title="Negrita (Ctrl+B)"
        >
          <Bold className="h-5 w-5" />
        </button>

        {/* Cursiva */}
        <button
          type="button"
          onClick={applyItalic}
          disabled={disabled}
          className="p-2 hover:bg-gray-200 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          title="Cursiva (Ctrl+I)"
        >
          <Italic className="h-5 w-5" />
        </button>

        <div className="w-px h-8 bg-gray-300 mx-1"></div>

        {/* Selector de color */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowColorPicker(!showColorPicker)}
            disabled={disabled}
            className="p-2 hover:bg-gray-200 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title="Color de texto"
          >
            <Type className="h-5 w-5" />
          </button>
          {showColorPicker && (
            <div className="absolute top-full left-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg p-2 z-10">
              <div className="grid grid-cols-3 gap-2">
                {COLORS.map(color => (
                  <button
                    key={color.value}
                    type="button"
                    onClick={() => applyColor(color.value)}
                    className="w-8 h-8 rounded border-2 border-gray-300 hover:border-gray-500 transition-colors"
                    style={{ backgroundColor: color.value }}
                    title={color.name}
                  />
                ))}
              </div>
              <button
                type="button"
                onClick={() => setShowColorPicker(false)}
                className="mt-2 w-full px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded"
              >
                Cerrar
              </button>
            </div>
          )}
        </div>

        <div className="w-px h-8 bg-gray-300 mx-1"></div>

        {/* Lista con viñetas */}
        <button
          type="button"
          onClick={applyBulletList}
          disabled={disabled}
          className="p-2 hover:bg-gray-200 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          title="Lista con viñetas"
        >
          <List className="h-5 w-5" />
        </button>

        <div className="w-px h-8 bg-gray-300 mx-1"></div>

        {/* Alineación */}
        <button
          type="button"
          onClick={() => applyAlignment('left')}
          disabled={disabled}
          className="p-2 hover:bg-gray-200 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          title="Alinear a la izquierda"
        >
          <AlignLeft className="h-5 w-5" />
        </button>
        <button
          type="button"
          onClick={() => applyAlignment('center')}
          disabled={disabled}
          className="p-2 hover:bg-gray-200 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          title="Alinear al centro"
        >
          <AlignCenter className="h-5 w-5" />
        </button>
        <button
          type="button"
          onClick={() => applyAlignment('right')}
          disabled={disabled}
          className="p-2 hover:bg-gray-200 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          title="Alinear a la derecha"
        >
          <AlignRight className="h-5 w-5" />
        </button>

        <div className="w-px h-8 bg-gray-300 mx-1"></div>

        {/* Enlace */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowLinkDialog(!showLinkDialog)}
            disabled={disabled}
            className="p-2 hover:bg-gray-200 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title="Insertar enlace"
          >
            <LinkIcon className="h-5 w-5" />
          </button>
          {showLinkDialog && (
            <div className="absolute top-full left-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg p-3 z-10 w-72">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                URL del enlace:
              </label>
              <input
                type="url"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                placeholder="https://ejemplo.com"
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm mb-2"
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={insertLink}
                  className="flex-1 px-3 py-1.5 bg-red-600 text-white text-sm rounded hover:bg-red-700"
                >
                  Insertar
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowLinkDialog(false);
                    setLinkUrl('');
                  }}
                  className="flex-1 px-3 py-1.5 bg-gray-100 text-gray-700 text-sm rounded hover:bg-gray-200"
                >
                  Cancelar
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Editor Area */}
      <div
        ref={editorRef}
        contentEditable={!disabled}
        onInput={handleInput}
        onKeyDown={handleKeyDown}
        className="p-4 outline-none overflow-y-auto"
        style={{ 
          minHeight: `${minHeight}px`,
          maxHeight: '600px'
        }}
        data-placeholder={placeholder}
      />

      {/* Footer con contador */}
      <div className="bg-gray-50 border-t border-gray-300 px-4 py-2 text-sm text-gray-600 flex justify-between items-center">
        <div className="text-xs">
          <span className="font-medium">Consejos:</span> Usa Ctrl+B para negrita, Ctrl+I para cursiva
        </div>
        <div className="text-xs font-medium">
          {charCount} caracteres
        </div>
      </div>

      <style>{`
        .simple-text-editor [contenteditable]:empty:before {
          content: attr(data-placeholder);
          color: #9CA3AF;
          pointer-events: none;
        }
        
        .simple-text-editor [contenteditable] {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
          font-size: 16px;
          line-height: 1.6;
          color: #374151;
        }
        
        .simple-text-editor [contenteditable] strong {
          font-weight: 600;
        }
        
        .simple-text-editor [contenteditable] em {
          font-style: italic;
        }
        
        .simple-text-editor [contenteditable] ul {
          list-style-type: disc;
          padding-left: 2rem;
          margin: 1rem 0;
        }
        
        .simple-text-editor [contenteditable] li {
          margin: 0.5rem 0;
        }
        
        .simple-text-editor [contenteditable] a {
          color: #DC2626;
          text-decoration: underline;
        }
        
        .simple-text-editor [contenteditable] a:hover {
          color: #991B1B;
        }
        
        .simple-text-editor [contenteditable]:focus {
          outline: none;
        }
      `}</style>
    </div>
  );
}
