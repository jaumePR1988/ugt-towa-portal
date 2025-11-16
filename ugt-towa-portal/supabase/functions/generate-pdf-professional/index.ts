/**
 * Edge Function: Generate PDF Professional (FIXED)
 * 
 * Backend profesional para conversión HTML→PDF con Puppeteer
 * Implementación optimizada para Supabase Edge Functions (Deno)
 * 
 * Características:
 * - Generación PDF backend sin dependencias frontend
 * - CSS profesional con formato A4 empresarial
 * - Control avanzado de saltos de página
 * - Encabezados y pies de página
 * - Numeración automática de páginas
 * - Tipografía profesional corporativa
 * 
 * @author UGT Towa Portal
 * @version 1.0.1 (FIXED)
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

        // Generar PDF usando Puppeteer
        const pdfBuffer = await generatePDF(pdfHtml, requestData.options);

        // Retornar el PDF
        return new Response(pdfBuffer, {
            headers: {
                ...corsHeaders,
                'Content-Type': 'application/pdf',
                'Content-Disposition': `attachment; filename="${subject.replace(/[^a-zA-Z0-9]/g, '_')}.pdf"`
            }
        });

    } catch (error) {
        console.error('Error generando PDF:', error);

        const errorResponse = {
            success: false,
            error: {
                code: 'PDF_GENERATION_FAILED',
                message: error.message || 'Error desconocido al generar PDF',
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

    return `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <style>
        @page {
            size: ${format} ${orientation};
            margin: ${margin.top} ${margin.right} ${margin.bottom} ${margin.left};
            
            @top-center {
                content: "${title}";
                font-family: 'Arial', sans-serif;
                font-size: 10pt;
                color: #666;
                border-bottom: 1px solid #e50000;
                padding-bottom: 5px;
            }
            
            @bottom-center {
                content: "Página " counter(page) " de " counter(pages);
                font-family: 'Arial', sans-serif;
                font-size: 10pt;
                color: #666;
            }
        }
        
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Arial', sans-serif;
            font-size: 11pt;
            line-height: 1.4;
            color: #333;
            background-color: #fff;
        }
        
        .header {
            text-align: center;
            margin-bottom: 30px;
            padding-bottom: 20px;
            border-bottom: 3px solid #e50000;
        }
        
        .header h1 {
            font-size: 24pt;
            font-weight: bold;
            color: #e50000;
            margin-bottom: 10px;
        }
        
        .header .date {
            font-size: 12pt;
            color: #666;
        }
        
        .content {
            margin-bottom: 30px;
        }
        
        .content h2 {
            font-size: 16pt;
            font-weight: bold;
            color: #e50000;
            margin: 20px 0 10px 0;
            page-break-after: avoid;
        }
        
        .content h3 {
            font-size: 14pt;
            font-weight: bold;
            color: #333;
            margin: 15px 0 8px 0;
            page-break-after: avoid;
        }
        
        .content p {
            margin-bottom: 10px;
            text-align: justify;
            page-break-inside: avoid;
            orphans: 3;
            widows: 3;
        }
        
        .content ul, .content ol {
            margin: 10px 0 10px 20px;
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
            page-break-inside: avoid;
        }
        
        .footer {
            margin-top: 30px;
            padding-top: 20px;
            border-top: 2px solid #e50000;
            text-align: center;
            font-size: 10pt;
            color: #666;
        }
        
        /* Evitar cortes de contenido */
        .content img {
            max-width: 100%;
            height: auto;
            page-break-inside: avoid;
        }
        
        .content table {
            page-break-inside: avoid;
        }
        
        .content blockquote {
            page-break-inside: avoid;
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
        ${content}
    </div>
    
    <div class="footer">
        <p>UGT Towa - Unión General de Trabajadores</p>
        <p>Portal Sindical - Towa Pharmaceutical Europe</p>
    </div>
</body>
</html>`;
}

/**
 * Genera el PDF usando Puppeteer
 */
async function generatePDF(htmlContent: string, options?: PDFOptions): Promise<Uint8Array> {
    // Configuración de Puppeteer
    const puppeteerOptions = {
        headless: true as const,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-accelerated-2d-canvas',
            '--no-first-run',
            '--no-zygote',
            '--disable-gpu',
            '--font-render-hinting=none'
        ]
    };

    // Launch browser
    const browser = await (globalThis as any).puppeteer.launch(puppeteerOptions);
    
    try {
        const page = await browser.newPage();
        
        // Set content
        await page.setContent(htmlContent, { 
            waitUntil: 'networkidle0',
            timeout: 30000 
        });
        
        // Generate PDF
        const pdfOptions = {
            format: options?.format || 'A4',
            orientation: options?.orientation || 'portrait',
            margin: options?.margin || {
                top: '2cm',
                right: '1.5cm',
                bottom: '2cm', 
                left: '1.5cm'
            },
            printBackground: options?.printBackground ?? true,
            preferCSSPageSize: options?.preferCSSPageSize ?? true,
            scale: options?.scale || 1.0,
            displayHeaderFooter: true,
            headerTemplate: '<div></div>',
            footerTemplate: '<div style="font-size:10px; text-align:center; width:100%; margin:0; padding:0;"></div>'
        };
        
        const pdfBuffer = await page.pdf(pdfOptions);
        return pdfBuffer;
        
    } finally {
        await browser.close();
    }
}
