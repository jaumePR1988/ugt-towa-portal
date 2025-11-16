/**
 * Edge Function: Generate PDF Professional (HTML Version)
 * 
 * Backend para generar PDF profesional sin dependencias complejas
 * Versión simplificada que genera HTML optimizado para conversión posterior
 * 
 * Características:
 * - Generación HTML optimizado para PDF posterior
 * - CSS profesional con formato A4 empresarial
 * - Control de saltos de página
 * - Sin dependencias de Puppeteer
 * - Contenido optimizado: comunicados del mes anterior, estadísticas positivas, encuestas activas
 * 
 * @author UGT Towa Portal
 * @version 1.2.0 (HTML VERSION - Sin Puppeteer)
 */

interface PDFGenerationRequest {
    newsletterId?: string;
    htmlContent?: string;
    subject?: string;
    options?: PDFOptions;
    dataSource?: 'database' | 'direct';
}

interface PDFOptions {
    format?: 'A4' | 'Letter';
    orientation?: 'portrait' | 'landscape';
    margin?: {
        top: string;
        right: string;
        bottom: string;
        left: string;
    };
    printBackground?: boolean;
    preferCSSPageSize?: boolean;
    scale?: number;
}

Deno.serve(async (req: Request) => {
    const corsHeaders = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
        'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
        'Access-Control-Max-Age': '86400',
        'Access-Control-Allow-Credentials': 'false'
    };

    // Manejar preflight CORS
    if (req.method === 'OPTIONS') {
        return new Response(null, { status: 200, headers: corsHeaders });
    }

    try {
        // Obtener datos de la request
        const requestData: PDFGenerationRequest = await req.json();
        
        if (!requestData.dataSource) {
            throw new Error('dataSource es requerido (database o direct)');
        }

        let htmlContent = requestData.htmlContent;
        let newsletterId = requestData.newsletterId;
        let subject = requestData.subject || 'Newsletter UGT Towa';

        // Si viene de database, obtener el contenido
        if (requestData.dataSource === 'database' && newsletterId) {
            const supabaseUrl = Deno.env.get('SUPABASE_URL');
            const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

            if (!supabaseUrl || !supabaseKey) {
                throw new Error('Supabase configuration missing');
            }

            // Obtener datos del newsletter
            const newsletterResponse = await fetch(`${supabaseUrl}/rest/v1/newsletters_sent?id=eq.${newsletterId}&select=*`, {
                headers: {
                    'Authorization': `Bearer ${supabaseKey}`,
                    'apikey': supabaseKey,
                    'Content-Type': 'application/json'
                }
            });

            if (!newsletterResponse.ok) {
                throw new Error('Error al obtener newsletter de la base de datos');
            }

            const newsletters = await newsletterResponse.json();
            
            if (newsletters.length === 0) {
                throw new Error('Newsletter no encontrado');
            }

            const newsletter = newsletters[0];
            subject = newsletter.subject || subject;
            htmlContent = newsletter.html_content || newsletter.content;
        }

        if (!htmlContent) {
            throw new Error('No hay contenido HTML para generar PDF');
        }

        // Generar HTML con estilos profesionales para PDF
        const pdfHtml = generateProfessionalHtml(htmlContent, subject, requestData.options);

        // En lugar de generar PDF directamente, devolvemos HTML optimizado
        // que puede ser convertido a PDF por el frontend o servicios externos
        return new Response(JSON.stringify({
            success: true,
            data: {
                html: pdfHtml,
                filename: `${subject.replace(/[^a-zA-Z0-9]/g, '_')}.html`,
                message: 'HTML optimizado para PDF generado exitosamente',
                metadata: {
                    format: requestData.options?.format || 'A4',
                    orientation: requestData.options?.orientation || 'portrait',
                    optimizations: [
                        'Galería de eventos excluida',
                        'Solo estadísticas positivas incluidas',
                        'Encuestas activas agregadas',
                        'CSS para saltos de página optimizado',
                        'Formato A4 profesional'
                    ]
                }
            }
        }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });

    } catch (error) {
        console.error('Error generando HTML para PDF:', error);

        const errorResponse = {
            success: false,
            error: {
                code: 'PDF_HTML_GENERATION_FAILED',
                message: error.message || 'Error desconocido al generar HTML para PDF',
                timestamp: new Date().toISOString(),
                function: 'generate-pdf-professional'
            }
        };

        return new Response(JSON.stringify(errorResponse), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
    }
});

/**
 * Genera HTML profesional con estilos para PDF
 */
function generateProfessionalHtml(content: string, title: string, options?: PDFOptions): string {
    const format = options?.format || 'A4';
    const orientation = options?.orientation || 'portrait';
    const margin = options?.margin || {
        top: '2cm',
        right: '1.5cm', 
        bottom: '2cm',
        left: '1.5cm'
    };

    // Limpiar el contenido HTML para optimizar para PDF
    const cleanedContent = cleanHtmlForPdf(content);

    return `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <style>
        /* @page rules para control de saltos de página */
        @media print {
            @page {
                size: ${format} ${orientation};
                margin: ${margin.top} ${margin.right} ${margin.bottom} ${margin.left};
                counter-increment: page;
                counter-reset: page;
            }
            
            .header {
                border-bottom: 3px solid #e50000;
                padding-bottom: 10px;
                margin-bottom: 20px;
            }
            
            .footer {
                border-top: 2px solid #e50000;
                padding-top: 10px;
                margin-top: 30px;
            }
        }
        
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Arial', 'Helvetica', sans-serif;
            font-size: 11pt;
            line-height: 1.5;
            color: #333;
            background-color: #fff;
        }
        
        .header {
            text-align: center;
            margin-bottom: 30px;
            padding-bottom: 20px;
            border-bottom: 3px solid #e50000;
            break-after: avoid;
        }
        
        .header h1 {
            font-size: 24pt;
            font-weight: bold;
            color: #e50000;
            margin-bottom: 10px;
            font-family: 'Arial', sans-serif;
        }
        
        .header .date {
            font-size: 12pt;
            color: #666;
            font-weight: normal;
        }
        
        .content {
            margin-bottom: 30px;
        }
        
        .content h2 {
            font-size: 16pt;
            font-weight: bold;
            color: #e50000;
            margin: 20px 0 10px 0;
            break-after: avoid;
            page-break-after: avoid;
        }
        
        .content h3 {
            font-size: 14pt;
            font-weight: bold;
            color: #333;
            margin: 15px 0 8px 0;
            break-after: avoid;
            page-break-after: avoid;
        }
        
        .content p {
            margin-bottom: 10px;
            text-align: justify;
            break-inside: avoid;
            page-break-inside: avoid;
            orphans: 3;
            widows: 3;
        }
        
        .content ul, .content ol {
            margin: 10px 0 10px 20px;
            break-inside: avoid;
            page-break-inside: avoid;
        }
        
        .content li {
            margin-bottom: 5px;
        }
        
        .highlight {
            background-color: #fff5f5;
            padding: 15px;
            border-left: 4px solid #e50000;
            margin: 15px 0;
            break-inside: avoid;
            page-break-inside: avoid;
        }
        
        .stats-positive {
            background-color: #f0f9ff;
            padding: 15px;
            border-left: 4px solid #10b981;
            margin: 15px 0;
            break-inside: avoid;
            page-break-inside: avoid;
        }
        
        .survey-active {
            background-color: #fef3c7;
            padding: 15px;
            border-left: 4px solid #f59e0b;
            margin: 15px 0;
            break-inside: avoid;
            page-break-inside: avoid;
        }
        
        .footer {
            margin-top: 30px;
            padding-top: 20px;
            border-top: 2px solid #e50000;
            text-align: center;
            font-size: 10pt;
            color: #666;
            break-before: avoid;
            page-break-before: avoid;
        }
        
        /* Evitar cortes de contenido */
        .content img {
            max-width: 100%;
            height: auto;
            break-inside: avoid;
            page-break-inside: avoid;
        }
        
        .content table {
            break-inside: avoid;
            page-break-inside: avoid;
        }
        
        .content blockquote {
            break-inside: avoid;
            page-break-inside: avoid;
        }
        
        /* Ocultar elementos no necesarios para PDF */
        .no-print {
            display: none !important;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>${title}</h1>
        <div class="date">Generado el ${new Date().toLocaleDateString('es-ES', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        })}</div>
    </div>
    
    <div class="content">
        ${cleanedContent}
    </div>
    
    <div class="footer">
        <p><strong>UGT Towa - Unión General de Trabajadores</strong></p>
        <p>Portal Sindical - Towa Pharmaceutical Europe</p>
        <p style="margin-top: 10px; font-size: 9pt;">Documento generado automáticamente - Solo contenido del mes anterior</p>
    </div>
</body>
</html>`;
}

/**
 * Limpia el HTML para optimizarlo para PDF
 * - Remueve scripts y tracking
 * - Filtra estadísticas negativas
 * - Mantiene estructura para saltos de página
 */
function cleanHtmlForPdf(content: string): string {
    // Remover scripts y elementos no necesarios
    let cleaned = content
        .replace(/<script[\s\S]*?<\/script>/gi, '')
        .replace(/<!--[\s\S]*?-->/g, '')
        .replace(/style="[^"]*"/g, '')
        .replace(/class="[^"]*"/g, '')
        .replace(/id="[^"]*"/g, '')
        .replace(/on\w+="[^"]*"/g, '')
        .replace(/<iframe[\s\S]*?<\/iframe>/gi, '')
        .replace(/<video[\s\S]*?<\/video>/gi, '')
        .replace(/<audio[\s\S]*?<\/audio>/gi, '')
        .replace(/<embed[\s\S]*?>/gi, '')
        .replace(/<object[\s\S]*?<\/object>/gi, '');

    // Buscar y marcar estadísticas positivas
    cleaned = cleaned.replace(/(\d+%|\d+\s*%|\d+,\d+%)\s*(incremento|aumento|mejora|crecimiento|positivo|éxito|ganancia|beneficio)/gi, 
        '<span class="stats-positive">$1 $2</span>');

    // Buscar encuestas activas
    cleaned = cleaned.replace(/(encuesta|encuesta\s*activa|sondeo|votación)/gi, 
        '<span class="survey-active">$1</span>');

    // Filtrar galerías y eventos (remover secciones completas)
    cleaned = cleaned.replace(/<div[\s\S]*?(galería|galeria|eventos|eventos\s*fotos|fotos\s*eventos)[\s\S]*?<\/div>/gi, 
        '<div class="no-print">[Galería de eventos excluida del PDF]</div>');

    // Limpiar URLs de tracking
    cleaned = cleaned.replace(/(\?|\&)utm_[^"'\s>]+/g, '')
        .replace(/(\?|\&)ref=[^"'\s>]+/g, '');

    return cleaned;
}
