-- Sample Data for Event Gallery Testing
-- Execute this SQL in your Supabase SQL Editor to add test events

-- Sample Event 1: Asamblea General UGT Towa 2024
INSERT INTO event_images (title, description, image_url, event_date, display_order, is_active) VALUES
('Asamblea General UGT Towa 2024', 'Asamblea anual con la participación de más de 200 afiliados', 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800', '2024-11-15', 1, true),
('Asamblea General UGT Towa 2024', 'Presentación del informe anual de actividades', 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800', '2024-11-15', 2, true),
('Asamblea General UGT Towa 2024', 'Momento de la votación de propuestas', 'https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?w=800', '2024-11-15', 3, true),
('Asamblea General UGT Towa 2024', 'Participación activa de los afiliados', 'https://images.unsplash.com/photo-1591115765373-5207764f72e7?w=800', '2024-11-15', 4, true);

-- Sample Event 2: Fiesta Sindical de Verano
INSERT INTO event_images (title, description, image_url, event_date, display_order, is_active) VALUES
('Fiesta Sindical de Verano', 'Celebración anual del sindicato con familias', 'https://images.unsplash.com/photo-1540979388789-6cee28a1cdc9?w=800', '2024-07-20', 1, true),
('Fiesta Sindical de Verano', 'Actividades para niños y familias', 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=800', '2024-07-20', 2, true),
('Fiesta Sindical de Verano', 'Concierto de verano en el recinto', 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800', '2024-07-20', 3, true);

-- Sample Event 3: Jornada de Formación Laboral
INSERT INTO event_images (title, description, image_url, event_date, display_order, is_active) VALUES
('Jornada de Formación Laboral', 'Curso de negociación colectiva', 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800', '2024-09-10', 1, true),
('Jornada de Formación Laboral', 'Taller de derechos laborales', 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800', '2024-09-10', 2, true),
('Jornada de Formación Laboral', 'Mesa redonda con expertos', 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800', '2024-09-10', 3, true),
('Jornada de Formación Laboral', 'Certificación de participantes', 'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=800', '2024-09-10', 4, true),
('Jornada de Formación Laboral', 'Networking entre participantes', 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=800', '2024-09-10', 5, true);

-- Sample Event 4: Manifestación del 8 de Marzo
INSERT INTO event_images (title, description, image_url, event_date, display_order, is_active) VALUES
('Manifestación del 8 de Marzo', 'Concentración por la igualdad de género', 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800', '2024-03-08', 1, true),
('Manifestación del 8 de Marzo', 'Banderas y pancartas por la igualdad', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800', '2024-03-08', 2, true),
('Manifestación del 8 de Marzo', 'Participación masiva de mujeres sindicalistas', 'https://images.unsplash.com/photo-1566753323558-f4e0952af115?w=800', '2024-03-08', 3, true);

-- Sample Event 5: Reunión del Comité Ejecutivo
INSERT INTO event_images (title, description, image_url, event_date, display_order, is_active) VALUES
('Reunión del Comité Ejecutivo', 'Reunión mensual del comité directivo', 'https://images.unsplash.com/photo-1556761175-4b46a572b786?w=800', '2024-10-05', 1, true),
('Reunión del Comité Ejecutivo', 'Análisis de propuestas sindicales', 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=800', '2024-10-05', 2, true);

-- Note: You can use any real image URLs or replace with your own images
-- For testing, you can use placeholder images from services like:
-- - https://picsum.photos/800/600
-- - https://images.unsplash.com/ (with proper attribution)
-- - Your own Supabase storage URLs

-- To test the functionality:
-- 1. Execute this SQL in Supabase
-- 2. Ensure at least some images have is_active = true
-- 3. Visit your homepage to see the event cards
-- 4. Click on any event card to open the gallery
-- 5. Test navigation and zoom features