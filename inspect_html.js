const puppeteer = require('puppeteer');

async function inspectHTML() {
    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    
    try {
        // Navegar a la página
        await page.goto('https://pwmcbcqeqvjm.space.minimax.io/comunicados/d373d481-926d-4b7b-97cb-5c1e02d41908', {
            waitUntil: 'networkidle0'
        });
        
        // Esperar a que el contenido se cargue
        await page.waitForSelector('h1', { timeout: 10000 });
        
        // Obtener el HTML completo del body
        const bodyHTML = await page.evaluate(() => document.body.innerHTML);
        
        // Buscar específicamente el contenido del comunicado
        const comunicadoContent = await page.evaluate(() => {
            const titleElement = document.querySelector('h1');
            if (!titleElement) return null;
            
            // Buscar el elemento que contiene el contenido del comunicado
            const allElements = document.querySelectorAll('*');
            let comunicadoDiv = null;
            
            for (let element of allElements) {
                if (element.textContent && element.textContent.includes('Test Diagnóstico HTML')) {
                    // Subir en el DOM para encontrar el contenedor principal del comunicado
                    let current = element;
                    for (let i = 0; i < 5; i++) {
                        if (current.parentElement) {
                            current = current.parentElement;
                            if (current.textContent && current.textContent.includes('texto normal')) {
                                comunicadoDiv = current;
                                break;
                            }
                        }
                    }
                    if (comunicadoDiv) break;
                }
            }
            
            return comunicadoDiv ? comunicadoDiv.outerHTML : null;
        });
        
        console.log('=== HTML COMPLETO DEL BODY ===');
        console.log(bodyHTML);
        console.log('\n=== CONTENIDO ESPECÍFICO DEL COMUNICADO ===');
        console.log(comunicadoContent || 'No encontrado');
        
        // Buscar etiquetas <b> y <font>
        const hasBoldTags = bodyHTML.includes('<b>') || bodyHTML.includes('</b>');
        const hasFontTags = bodyHTML.includes('<font>') || bodyHTML.includes('</font>');
        
        console.log('\n=== ANÁLISIS DE ETIQUETAS ===');
        console.log('Etiquetas <b> encontradas:', hasBoldTags);
        console.log('Etiquetas <font> encontradas:', hasFontTags);
        
        // Contar ocurrencias
        const boldCount = (bodyHTML.match(/<b>/g) || []).length;
        const fontCount = (bodyHTML.match(/<font>/g) || []).length;
        
        console.log('Cantidad de etiquetas <b>:', boldCount);
        console.log('Cantidad de etiquetas <font>:', fontCount);
        
        // Buscar también en el contenido específico del comunicado
        if (comunicadoContent) {
            const comunicadoHasBold = comunicadoContent.includes('<b>') || comunicadoContent.includes('</b>');
            const comunicadoHasFont = comunicadoContent.includes('<font>') || comunicadoContent.includes('</font>');
            
            console.log('\n=== ANÁLISIS EN CONTENIDO DEL COMUNICADO ===');
            console.log('Etiquetas <b> en comunicado:', comunicadoHasBold);
            console.log('Etiquetas <font> en comunicado:', comunicadoHasFont);
        }
        
    } catch (error) {
        console.error('Error:', error.message);
    } finally {
        await browser.close();
    }
}

inspectHTML();