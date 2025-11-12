/**
 * Generador automático de Sitemap XML para UGT Towa
 * 
 * Este script genera automáticamente el sitemap.xml basándose en:
 * - Páginas estáticas del sitio
 * - Comunicados desde la base de datos
 * - Encuestas desde la base de datos
 * 
 * Uso: node generate-sitemap.js
 */

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuración de Supabase
const supabaseUrl = 'https://zaxdscclkeytakcowgww.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseKey) {
    console.error('❌ Error: SUPABASE_SERVICE_ROLE_KEY no está configurada');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function generateSitemap() {
    console.log('🔄 Generando sitemap.xml...');
    
    try {
        // URLs estáticas del sitio
        const staticUrls = [
            {
                loc: 'https://ugt.towa.cat/',
                lastmod: new Date().toISOString().split('T')[0],
                changefreq: 'weekly',
                priority: '1.0'
            },
            {
                loc: 'https://ugt.towa.cat/quienes-somos',
                lastmod: new Date().toISOString().split('T')[0],
                changefreq: 'monthly',
                priority: '0.8'
            },
            {
                loc: 'https://ugt.towa.cat/comunicados',
                lastmod: new Date().toISOString().split('T')[0],
                changefreq: 'daily',
                priority: '0.9'
            },
            {
                loc: 'https://ugt.towa.cat/citas',
                lastmod: new Date().toISOString().split('T')[0],
                changefreq: 'weekly',
                priority: '0.8'
            },
            {
                loc: 'https://ugt.towa.cat/encuestas',
                lastmod: new Date().toISOString().split('T')[0],
                changefreq: 'weekly',
                priority: '0.8'
            },
            {
                loc: 'https://ugt.towa.cat/documentos',
                lastmod: new Date().toISOString().split('T')[0],
                changefreq: 'monthly',
                priority: '0.7'
            },
            {
                loc: 'https://ugt.towa.cat/biblioteca',
                lastmod: new Date().toISOString().split('T')[0],
                changefreq: 'monthly',
                priority: '0.6'
            },
            {
                loc: 'https://ugt.towa.cat/beneficios',
                lastmod: new Date().toISOString().split('T')[0],
                changefreq: 'monthly',
                priority: '0.6'
            }
        ];

        // Obtener comunicados de la base de datos
        const { data: communiques, error: communiquesError } = await supabase
            .from('communiques')
            .select('id, updated_at')
            .order('updated_at', { ascending: false });

        if (communiquesError) {
            console.error('❌ Error obteniendo comunicados:', communiquesError);
        } else {
            console.log(`📰 Encontrados ${communiques?.length || 0} comunicados`);
            
            // Añadir URLs de comunicados individuales
            communiques?.forEach(communique => {
                staticUrls.push({
                    loc: `https://ugt.towa.cat/comunicado/${communique.id}`,
                    lastmod: new Date(communique.updated_at).toISOString().split('T')[0],
                    changefreq: 'weekly',
                    priority: '0.7'
                });
            });
        }

        // Obtener encuestas de la base de datos
        const { data: surveys, error: surveysError } = await supabase
            .from('surveys')
            .select('id, updated_at')
            .order('updated_at', { ascending: false });

        if (surveysError) {
            console.error('❌ Error obteniendo encuestas:', surveysError);
        } else {
            console.log(`📊 Encontradas ${surveys?.length || 0} encuestas`);
            
            // Añadir URLs de encuestas individuales
            surveys?.forEach(survey => {
                staticUrls.push({
                    loc: `https://ugt.towa.cat/encuesta/${survey.id}`,
                    lastmod: new Date(survey.updated_at).toISOString().split('T')[0],
                    changefreq: 'weekly',
                    priority: '0.7'
                });
            });
        }

        // Generar XML
        let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
`;

        // Añadir URLs estáticas
        staticUrls.forEach(url => {
            xml += `  <url>
    <loc>${url.loc}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>
`;
        });

        xml += `</urlset>`;

        // Escribir archivo
        const sitemapPath = path.join(__dirname, 'public', 'sitemap.xml');
        fs.writeFileSync(sitemapPath, xml, 'utf8');
        
        console.log('✅ Sitemap generado exitosamente:', sitemapPath);
        console.log(`📊 Total URLs: ${staticUrls.length}`);
        
        return true;
        
    } catch (error) {
        console.error('❌ Error generando sitemap:', error);
        return false;
    }
}

// Ejecutar si se llama directamente
if (import.meta.url === `file://${process.argv[1]}`) {
    generateSitemap();
}

export { generateSitemap };