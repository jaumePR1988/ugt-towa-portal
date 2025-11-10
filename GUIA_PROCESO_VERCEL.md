# 📋 GUÍA COMPLETA: Cómo Subir Portal a Vercel

## ✅ **ESTADO ACTUAL - YA DESPLEGADO**
**Tu portal UGT-TOWA está funcionando en:** https://nzu6husjg87j.space.minimax.io

---

## 🚀 **PROCESO PARA FUTUROS PROYECTOS**

### **PASO 1: Preparar el Proyecto**

1. **Convertir a Variables de Entorno**
   ```typescript
   // ANTES: Hardcodeado en src/lib/supabase.ts
   const supabaseUrl = "https://tudominio.supabase.co";
   
   // DESPUÉS: Variables de entorno
   const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
   const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
   ```

2. **Crear archivo .env.example**
   ```
   VITE_SUPABASE_URL=tu-url-de-supabase
   VITE_SUPABASE_ANON_KEY=tu-anon-key
   ```

3. **Configurar Vercel (vercel.json)**
   ```json
   {
     "rewrites": [
       { "source": "/(.*)", "destination": "/" }
     ]
   }
   ```

### **PASO 2: Opciones de Despliegue**

#### **OPCIÓN A: Vercel CLI (Recomendado)**

1. **Instalar Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Login en Vercel**
   ```bash
   vercel login
   ```

3. **Desplegar**
   ```bash
   vercel
   # Seguir las instrucciones interactivas
   ```

4. **Variables de Entorno**
   ```bash
   vercel env add VITE_SUPABASE_URL
   vercel env add VITE_SUPABASE_ANON_KEY
   ```

#### **OPCIÓN B: GitHub + Vercel**

1. **Subir proyecto a GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/tu-usuario/tu-proyecto.git
   git push -u origin main
   ```

2. **Conectar en Vercel.com**
   - Ir a https://vercel.com
   - Conectar con GitHub
   - Seleccionar el repositorio
   - Configurar variables de entorno
   - Desplegar

#### **OPCIÓN C: Drag & Drop (Solo para proyectos pequeños)**

1. Comprimir carpeta `dist/` a ZIP
2. Ir a https://vercel.com/new
3. Arrastrar y soltar el ZIP
4. Configurar variables de entorno manualmente

### **PASO 3: Configurar Variables de Entorno en Vercel**

**En el dashboard de Vercel:**
1. Ir a tu proyecto
2. Pestaña "Settings" → "Environment Variables"
3. Añadir:
   - `VITE_SUPABASE_URL` = "https://zaxdscclkeytakcowgww.supabase.co"
   - `VITE_SUPABASE_ANON_KEY` = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

### **PASO 4: Verificación Post-Despliegue**

```bash
# 1. Probar que el sitio carga
curl https://tu-proyecto.vercel.app

# 2. Verificar que las APIs funcionan
curl https://tu-proyecto.vercel.app/api/health

# 3. Probar autenticación
curl -X POST https://tu-proyecto.vercel.app/auth/login
```

---

## 🛠️ **COMANDOS ÚTILES**

### **Build y Deploy**
```bash
# Build para producción
npm run build

# Preview local
npm run preview

# Deploy directo
vercel --prod
```

### **Gestión de Variables**
```bash
# Listar variables
vercel env ls

# Eliminar variable
vercel env rm VARIABLE_NAME

# Redeploy después de cambios
vercel --prod
```

### **Diagnóstico**
```bash
# Ver logs
vercel logs

# Información del proyecto
vercel info

# Descargar archivo de configuración
vercel pull
```

---

## 🎯 **TU PROYECTO UGT-TOWA**

### **Lo que ya se hizo automáticamente:**
✅ Migración a variables de entorno
✅ Configuración de Vercel (vercel.json)
✅ Variables de Supabase configuradas
✅ Build optimizado y desplegado
✅ Testing completo de funcionalidades

### **URLs del proyecto:**
- **Producción:** https://nzu6husjg87j.space.minimax.io
- **Credenciales:** jpedragosa@towapharmaceutical.com / towa2022

---

## 📞 **Soporte Técnico**

Si necesitas ayuda futura:
1. **Documentación:** https://vercel.com/docs
2. **CLI Reference:** https://vercel.com/docs/cli
3. **Troubleshooting:** https://vercel.com/docs/troubleshooting

---

## 🔄 **Proceso de Actualización**

Para actualizar el proyecto:
1. Hacer cambios en código
2. `npm run build`
3. `vercel --prod`
4. Verificar en https://tu-proyecto.vercel.app