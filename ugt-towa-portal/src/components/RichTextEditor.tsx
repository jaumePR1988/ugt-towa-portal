import React, { useRef } from 'react';
import { Editor as TinyMCEEditor } from '@tinymce/tinymce-react';
import DOMPurify from 'dompurify';

interface RichTextEditorProps {
  value: string;
  onChange: (content: string) => void;
  placeholder?: string;
  disabled?: boolean;
  minHeight?: number;
}

export default function RichTextEditor({
  value,
  onChange,
  placeholder = 'Escribe el contenido del comunicado...',
  disabled = false,
  minHeight = 400
}: RichTextEditorProps) {
  const editorRef = useRef<any>(null);

  const handleEditorChange = (content: string) => {
    // Sanitizar el contenido HTML antes de guardarlo
    const sanitizedContent = DOMPurify.sanitize(content, {
      ALLOWED_TAGS: [
        'p', 'br', 'strong', 'em', 'u', 's', 'strike',
        'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
        'ul', 'ol', 'li',
        'a', 'img',
        'blockquote', 'code', 'pre',
        'table', 'thead', 'tbody', 'tr', 'th', 'td',
        'span', 'div'
      ],
      ALLOWED_ATTR: [
        'href', 'target', 'rel', 'title',
        'src', 'alt', 'width', 'height',
        'style', 'class',
        'colspan', 'rowspan'
      ],
      KEEP_CONTENT: true
    });

    onChange(sanitizedContent);
  };

  return (
    <div className="rich-text-editor-wrapper">
      {/* @ts-ignore - TinyMCE Editor tiene problemas de tipos con React 18 */}
      <TinyMCEEditor
        apiKey="u4zx4bq0t2hpd5exybtxzj2zqhbnuuqqb47r0x4p4o8wyhbj"
        onInit={(evt: any, editor: any) => editorRef.current = editor}
        value={value}
        disabled={disabled}
        init={{
          height: minHeight,
          menubar: false,
          language: 'es',
          plugins: [
            'advlist', 'autolink', 'lists', 'link', 'image', 'charmap',
            'preview', 'anchor', 'searchreplace', 'visualblocks', 'code',
            'fullscreen', 'insertdatetime', 'media', 'table', 'help',
            'wordcount', 'emoticons', 'codesample'
          ],
          toolbar: 
            'undo redo | blocks | ' +
            'bold italic underline strikethrough | forecolor backcolor | ' +
            'alignleft aligncenter alignright alignjustify | ' +
            'bullist numlist outdent indent | ' +
            'link image table | ' +
            'removeformat code fullscreen help',
          toolbar_mode: 'wrap',
          content_style: `
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
              font-size: 16px;
              line-height: 1.6;
              color: #374151;
              padding: 10px;
            }
            p { margin: 0 0 1em 0; }
            h1, h2, h3, h4, h5, h6 { 
              margin: 1em 0 0.5em 0; 
              font-weight: 600;
              line-height: 1.3;
            }
            h1 { font-size: 2em; }
            h2 { font-size: 1.5em; }
            h3 { font-size: 1.25em; }
            a { color: #dc2626; text-decoration: underline; }
            a:hover { color: #991b1b; }
            img { max-width: 100%; height: auto; }
            table { border-collapse: collapse; width: 100%; margin: 1em 0; }
            th, td { border: 1px solid #d1d5db; padding: 8px 12px; text-align: left; }
            th { background-color: #f3f4f6; font-weight: 600; }
            code { 
              background-color: #f3f4f6; 
              padding: 2px 6px; 
              border-radius: 3px; 
              font-family: monospace; 
            }
            blockquote {
              border-left: 4px solid #dc2626;
              padding-left: 1em;
              margin-left: 0;
              color: #6b7280;
              font-style: italic;
            }
          `,
          placeholder: placeholder,
          resize: true,
          branding: false,
          promotion: false,
          statusbar: true,
          elementpath: false,
          
          // Configuración de imágenes
          image_advtab: true,
          image_caption: true,
          image_title: true,
          automatic_uploads: false,
          file_picker_types: 'image',
          
          // Configuración de enlaces
          link_title: true,
          link_target_list: [
            { title: 'Misma ventana', value: '_self' },
            { title: 'Nueva ventana', value: '_blank' }
          ],
          default_link_target: '_blank',
          link_default_protocol: 'https',
          
          // Prevenir contenido peligroso
          verify_html: true,
          valid_elements: '*[*]',
          extended_valid_elements: 'img[class|src|border=0|alt|title|width|height|style]',
          
          // Configuración móvil
          mobile: {
            menubar: false,
            toolbar_mode: 'scrolling',
            toolbar: 'undo redo | bold italic | bullist numlist | link image'
          },
          
          // Auto-resize
          autoresize_bottom_margin: 20,
          autoresize_overflow_padding: 20,
          
          // Formatos de texto
          block_formats: 'Párrafo=p; Título 1=h1; Título 2=h2; Título 3=h3; Título 4=h4',
          
          // Estilos de fuente
          font_size_formats: '8px 10px 12px 14px 16px 18px 20px 24px 28px 32px 36px',
          
          // Colores personalizados (paleta UGT)
          color_map: [
            '#DC2626', 'Rojo UGT',
            '#991B1B', 'Rojo Oscuro',
            '#000000', 'Negro',
            '#374151', 'Gris Oscuro',
            '#6B7280', 'Gris',
            '#9CA3AF', 'Gris Claro',
            '#FFFFFF', 'Blanco',
            '#3B82F6', 'Azul',
            '#10B981', 'Verde',
            '#F59E0B', 'Naranja',
            '#EF4444', 'Rojo Claro',
            '#8B5CF6', 'Morado'
          ],
          
          // Shortcuts de teclado mejorados
          setup: (editor: any) => {
            // Auto-guardado (si se implementa en el futuro)
            editor.on('change', () => {
              handleEditorChange(editor.getContent());
            });
            
            // Contador de palabras en la barra de estado
            editor.on('wordCountUpdate', (e: any) => {
              // El plugin wordcount ya maneja esto
            });
          }
        }}
        onEditorChange={handleEditorChange}
      />
      
      {/* Mensaje de ayuda */}
      <div className="mt-2 text-sm text-gray-500">
        <p>
          <strong>Consejos:</strong> Usa Ctrl+B para negrita, Ctrl+I para cursiva, Ctrl+U para subrayado.
          Puedes pegar contenido desde Word y se formateará automáticamente.
        </p>
      </div>
    </div>
  );
}

// Función auxiliar para sanitizar HTML (exportable para uso en otros componentes)
export function sanitizeHTML(html: string): string {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: [
      'p', 'br', 'strong', 'em', 'u', 's', 'strike',
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'ul', 'ol', 'li',
      'a', 'img',
      'blockquote', 'code', 'pre',
      'table', 'thead', 'tbody', 'tr', 'th', 'td',
      'span', 'div'
    ],
    ALLOWED_ATTR: [
      'href', 'target', 'rel', 'title',
      'src', 'alt', 'width', 'height',
      'style', 'class',
      'colspan', 'rowspan'
    ],
    KEEP_CONTENT: true
  });
}
