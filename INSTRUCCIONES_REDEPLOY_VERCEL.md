# 🚀 **PASOS PARA FORZAR DEPLOY VERCEL - URGENTE**

## **MÉTODO 1: Redeploy Manual (Más Rápido)**

### **Paso 1: Accede a Vercel Dashboard**
1. Ve a: https://vercel.com/dashboard
2. Busca tu proyecto: `ugt-towa-portal`
3. Click en el proyecto

### **Paso 2: Redeploy Manual**
1. Click en la pestaña "Deployments" 
2. En la última deployment (la que está desplegada), click "Redeploy"
3. Click "Redeploy Now"
4. Espera 2-3 minutos

### **Paso 3: Verificar**
- Después del deploy, ve a https://ugt.towa.cat/citas
- Prueba reservar una cita
- **DEBE FUNCIONAR** sin el error

## **MÉTODO 2: Trigger GitHub (Si el primero no funciona)**

### **Paso 1: Editar README desde GitHub**
1. Ve a: https://github.com/jaumePR1988/ugt-towa-portal
2. Abre el archivo `README.md`
3. Click en el lápiz para editar
4. Añade al final: `# Deploy test - $(date)`
5. Scroll abajo, click "Commit changes"
6. Vercel automáticamente hará deploy en 2-3 minutos

### **Paso 2: Verificar Deploy**
- Ve a: https://vercel.com/dashboard → tu proyecto
- Verás un nuevo deployment en "Deployments"
- Espera hasta que esté "Ready"
- Prueba reservar cita en https://ugt.towa.cat/citas

## **✅ RESULTADO ESPERADO:**
Después del deploy correcto:
- ❌ NO más error "record new has no field date"
- ✅ Sistema de citas funcionando perfectamente
- ✅ Página principal sin banner PWA molesto

**¿Puedes intentar el MÉTODO 1 (redeploy manual) ahora?**