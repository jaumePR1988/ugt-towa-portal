Deno.serve(async (req) => {
    const corsHeaders = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Max-Age': '86400',
    };

    if (req.method === 'OPTIONS') {
        return new Response(null, { status: 200, headers: corsHeaders });
    }

    try {
        const { newsletterId } = await req.json();

        if (!newsletterId) {
            throw new Error('newsletterId es requerido');
        }

        const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
        const supabaseUrl = Deno.env.get('SUPABASE_URL');

        if (!serviceRoleKey || !supabaseUrl) {
            throw new Error('Configuración de Supabase faltante');
        }

        // Obtener el newsletter
        const newsletterResponse = await fetch(`${supabaseUrl}/rest/v1/newsletters_sent?id=eq.${newsletterId}`, {
            headers: {
                'Authorization': `Bearer ${serviceRoleKey}`,
                'apikey': serviceRoleKey,
            }
        });

        if (!newsletterResponse.ok) {
            throw new Error('Error obteniendo newsletter');
        }

        const newsletters = await newsletterResponse.json();
        if (!newsletters || newsletters.length === 0) {
            throw new Error('Newsletter no encontrado');
        }

        const newsletter = newsletters[0];
        const htmlContent = newsletter.content;
        const subject = newsletter.subject;

        // Generar PDF usando librería jspdf-html2canvas
        // Como Deno no soporta jsPDF directamente, usaremos una aproximación con Puppeteer
        // Para este entorno, generaremos un HTML optimizado para PDF
        
        const pdfOptimizedHtml = generatePdfOptimizedHtml(htmlContent, subject);

        // En un entorno de producción, aquí usaríamos Puppeteer o similar
        // Por ahora, devolvemos el HTML optimizado que el frontend puede convertir a PDF
        
        // Actualizar estadísticas del newsletter
        const currentGenerated = newsletter.total_generated || 0;
        await fetch(`${supabaseUrl}/rest/v1/newsletters_sent?id=eq.${newsletterId}`, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${serviceRoleKey}`,
                'apikey': serviceRoleKey,
                'Content-Type': 'application/json',
                'Prefer': 'return=minimal'
            },
            body: JSON.stringify({
                total_generated: currentGenerated + 1,
                pdf_generated_at: new Date().toISOString(),
                status: 'generated'
            })
        });

        return new Response(JSON.stringify({
            data: {
                success: true,
                htmlContent: pdfOptimizedHtml,
                fileName: `newsletter-ugt-towa-${new Date().toISOString().split('T')[0]}.pdf`,
                message: 'HTML optimizado para PDF generado exitosamente'
            }
        }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });

    } catch (error) {
        console.error('Error generando PDF:', error);

        return new Response(JSON.stringify({
            error: {
                code: 'PDF_GENERATION_FAILED',
                message: error.message
            }
        }), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
    }
});

function generatePdfOptimizedHtml(htmlContent: string, subject: string): string {
    // Optimizar HTML para impresión en PDF
    // Agregar estilos específicos para PDF y eliminar elementos interactivos
    
    const optimizedHtml = `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${subject}</title>
    <style>
        @page {
            size: A4;
            margin: 2cm;
        }
        
        @media print {
            body {
                margin: 0;
                padding: 0;
            }
            
            .no-print {
                display: none !important;
            }
            
            .page-break {
                page-break-after: always;
            }
        }
        
        body {
            font-family: Arial, Helvetica, sans-serif;
            line-height: 1.6;
            color: #333;
            background-color: #ffffff;
            max-width: 21cm;
            margin: 0 auto;
            padding: 20px;
        }
        
        .container {
            background-color: #ffffff;
        }
        
        .header {
            background-color: #e50000;
            color: white;
            padding: 30px 20px;
            text-align: center;
            margin-bottom: 30px;
            border-radius: 0;
        }
        
        .header h1 {
            margin: 0 0 10px 0;
            font-size: 28px;
            font-weight: bold;
        }
        
        .header p {
            margin: 0;
            font-size: 16px;
        }
        
        .section {
            margin-bottom: 30px;
            page-break-inside: avoid;
        }
        
        .section-title {
            color: #e50000;
            font-size: 22px;
            font-weight: bold;
            border-bottom: 3px solid #e50000;
            padding-bottom: 10px;
            margin-bottom: 20px;
        }
        
        .content-item {
            margin-bottom: 25px;
            padding: 20px;
            background-color: #f9f9f9;
            border-left: 5px solid #e50000;
            page-break-inside: avoid;
        }
        
        .content-item h3 {
            margin: 0 0 12px 0;
            color: #333;
            font-size: 20px;
        }
        
        .content-item p {
            margin: 0;
            color: #666;
            font-size: 14px;
        }
        
        .content-item img {
            max-width: 100%;
            height: auto;
            margin-top: 15px;
            display: block;
        }
        
        .statistics {
            display: flex;
            flex-wrap: wrap;
            justify-content: space-around;
            gap: 20px;
            margin-bottom: 20px;
        }
        
        .stat-box {
            background-color: #e50000;
            color: white;
            padding: 25px;
            text-align: center;
            flex: 1;
            min-width: 150px;
            page-break-inside: avoid;
        }
        
        .stat-number {
            font-size: 36px;
            font-weight: bold;
            margin-bottom: 5px;
        }
        
        .stat-label {
            font-size: 14px;
        }
        
        .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 2px solid #e50000;
            text-align: center;
            color: #666;
            font-size: 12px;
            page-break-inside: avoid;
        }
        
        .footer p {
            margin: 5px 0;
        }
        
        .footer strong {
            color: #e50000;
        }
        
        /* Eliminar elementos interactivos para PDF */
        a {
            color: inherit;
            text-decoration: none;
        }
        
        img[src*="track-email-event"] {
            display: none;
        }
    </style>
</head>
<body>
    ${htmlContent}
</body>
</html>
    `.trim();
    
    return optimizedHtml;
}
