import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Configuración personalizable por empresa
const empresaConfig = {
  nombre: "{{EMPRESA_NOMBRE}}",
  logo: "{{EMPRESA_LOGO}}",
  colores: {
    primario: "{{EMPRESA_COLOR_PRIMARIO}}",
    secundario: "{{EMPRESA_COLOR_SECUNDARIO}}",
    acento: "{{EMPRESA_COLOR_ACENTO}}"
  },
  dominio: "{{EMPRESA_DOMINIO}}",
  email: "{{EMPRESA_EMAIL}}",
  telefono: "{{EMPRESA_TELEFONO}}",
  direccion: "{{EMPRESA_DIRECCION}}",
  // Configuraciones específicas del sector
  tiposCitas: {{TIPOS_CITAS_CONFIG}},
  horariosTrabajo: {{HORARIOS_TRABAJO_CONFIG}},
  textosPersonalizados: {{TEXTOS_PERSONALIZADOS_CONFIG}}
}

export default defineConfig({
  plugins: [react()],
  base: '/',
  define: {
    EMPRESA_CONFIG: JSON.stringify(empresaConfig)
  },
  server: {
    port: 3000,
    host: true
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          supabase: ['@supabase/supabase-js'],
          ui: ['lucide-react']
        }
      }
    }
  }
})
