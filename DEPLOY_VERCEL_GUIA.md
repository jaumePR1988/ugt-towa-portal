# 🚀 Guía de Deploy Vercel - UGT TOWA Portal

## **Portal Funcionando - Lista para Deploy**

### **URL Actual del Portal Funcionando:**
https://43txox2sv3hj.space.minimax.io

---

## **OPCIÓN 1: Deploy desde Código Fuente**

### **1. Subir a GitHub**
```bash
# En tu directorio local
cd backup_version_2025_11_10/ugt-towa-portal/
git init
git add .
git commit -m "Portal UGT TOWA funcionando - versión estable"
git branch -M main
git remote add origin TU_REPO_URL
git push -u origin main
```

### **2. Deploy en Vercel**
1. **Conectar GitHub:** Importa el repositorio desde GitHub
2. **Configuración:**
   - **Framework Preset:** Vite
   - **Build Command:** `pnpm install --prefer-offline && rm -rf node_modules/.vite-temp && tsc -b && vite build`
   - **Output Directory:** `dist`
   - **Install Command:** `pnpm install --prefer-offline`

### **3. Variables de Entorno (OPCIONAL)**
**NO NECESARIO** - Las credenciales ya están hardcodeadas, pero si quieres usar variables:

```
VITE_SUPABASE_URL=https://zaxdscclkeytakcowgww.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpheGRzY2Nsa2V5dGFrY293Z3d3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIwMTUxMTIsImV4cCI6MjA3NzU5MTExMn0.MQMePYqEhW9xhCipC-MeU8Z_dXqvyBKH5e0vtgaS9xQ
```

---

## **OPCIÓN 2: Deploy Manual (Más Rápido)**

### **1. Usar Build Incluido**
1. **Descarga:** Carpeta `dist/` desde `backup_version_2025_11_10/ugt-towa-portal/dist/`
2. **Vercel Dashboard:** 
   - "Add New Project"
   - "Deploy" 
   - Arrastra la carpeta `dist/` al área de deploy
3. **Configuración:**
   - **Output Directory:** `.` (no cambiar)
   - **Build Command:** dejar vacío

### **2. Verificar Deploy**
- ✅ La URL se genera automáticamente
- ✅ Portal debe cargar inmediatamente
- ✅ No necesitas configurar variables de entorno

---

## **OPCIÓN 3: Deploy Alternativo**

### **Usando Netlify (si prefieres)**
1. **Netlify Dashboard:** "Deploy manually"
2. **Arrastra:** Carpeta `dist/` completa
3. **Configuración:** Automática - detecta que es un sitio estático
4. **URL:** Se genera automáticamente

---

## **🔧 VERIFICACIÓN POST-DEPLOY**

### **Checklist Funcional:**
- [ ] **Home page carga** - No página en blanco
- [ ] **Navegación funciona** - Menú superior operativo
- [ ] **Comunicados accesibles** - Filtros por categorías funcionando
- [ ] **Login funciona** - Formulario de autenticación
- [ ] **Imágenes cargan** - Event gallery visible
- [ ] **Responsive design** - Móvil y desktop

### **URLs a Probar:**
```
https://TU-DOMINIO.vercel.app/           (Home)
https://TU-DOMINIO.vercel.app/comunicados (Comunicados)
https://TU-DOMINIO.vercel.app/login       (Login)
https://TU-DOMINIO.vercel.app/quienes-somos (Quiénes Somos)
```

---

## **🚨 IMPORTANTE - NO Pages en Blanco**

### **Si Ves Página en Blanco:**
1. **Verifica:** Build completado correctamente
2. **Check:** Variables de entorno configuradas (aunque no deberían ser necesarias)
3. **Revisar:** Console del navegador por errores JavaScript
4. **Solución:** Usar el backup de `dist/` directamente

### **Solución Rápida - Manual Deploy:**
```bash
# Si tienes problemas con el build automático
cd backup_version_2025_11_10/ugt-towa-portal/
pnpm install --prefer-offline
pnpm build
# Ahora arrastra la carpeta 'dist' a Vercel
```

---

## **📱 CONFIGURACIÓN DOMINIO PERSONALIZADO (Opcional)**

### **En Vercel Dashboard:**
1. **Project Settings** → **Domains**
2. **Add Domain:** tu-dominio.com
3. **DNS Configuration:** Apunta a Vercel
4. **SSL:** Automático

---

## **✅ RESUMEN RÁPIDO**

1. **Portal funcionando:** ✅ https://43txox2sv3hj.space.minimax.io
2. **Código fuente:** `backup_version_2025_11_10/ugt-towa-portal/`
3. **Build incluido:** `backup_version_2025_11_10/ugt-towa-portal/dist/`
4. **Deploy más simple:** Arrastra carpeta `dist/` a Vercel
5. **NO necesitas variables de entorno** (ya están hardcodeadas)

---

**🎯 RESULTADO ESPERADO:** Portal UGT TOWA funcionando sin páginas en blanco en tu propio dominio Vercel.

*Fecha: 2025-11-17 | Portal verificado y listo para deploy*