# 📧 Configuración de Email con Resend - Instrucciones Detalladas

## 🎯 Tu API Key de Resend
**API Key:** `re_ELET31Lk_7ZxZh2pKwgyj4kWxTqSrSuPg`
**Status:** Lista para configurar

---

## 🔧 Pasos para Configurar en Supabase

### **PASO 1: Acceder al Dashboard de Supabase**
1. **Ir a:** https://supabase.com/dashboard/project/zaxdscclkeytakcowgww
2. **Usar las mismas credenciales** que ya tienes configuradas
3. **Verificar que estás en el proyecto correcto** (el mismo que tiene tu portal)

### **PASO 2: Navegar a Edge Functions**
1. **En el menú lateral izquierdo** del dashboard
2. **Hacer clic en "Edge Functions"**
3. **Verás la lista de funciones** que ya tienes desplegadas

### **PASO 3: Acceder a Configuración de Secrets**
1. **Dentro de Edge Functions**, buscar:
   - Pestaña **"Settings"** o
   - Sección **"Environment Variables"** o
   - **"Secrets Management"**
2. **Hacer clic en esa sección**

### **PASO 4: Agregar la API Key de Resend**
1. **Crear un nuevo secret** (botón "Add Secret" o similar)
2. **Configurar con estos datos exactos:**
   - **Name:** `RESEND_API_KEY`
   - **Value:** `re_ELET31Lk_7ZxZh2pKwgyj4kWxTqSrSuPg`
3. **Guardar los cambios**

### **PASO 5: Verificar Configuración**
1. **Los cambios pueden tardar 1-2 minutos** en aplicarse
2. **Ir al panel de newsletter:** https://x7kes7q19igb.space.minimax.io/admin/newsletter
3. **Probar envío de newsletter de prueba**

---

## ✅ Cómo Probar que Funciona

### **Desde tu Panel de Newsletter:**
1. **Ir a:** https://x7kes7q19igb.space.minimax.io/admin/newsletter
2. **Iniciar sesión con:** jpedragosa@towapharmaceutical.com / towa2022
3. **Ir a la pestaña "Newsletters Enviados"**
4. **Hacer clic en "Enviar"** en el newsletter de ejemplo
5. **Debería mostrar "Enviado"** en lugar de "Simulado"**

### **Indicadores de Éxito:**
- ✅ El newsletter se marca como "Enviado" (no "Simulado")
- ✅ Se registran aperturas y clics en analytics
- ✅ Los suscriptores reciben el email en su bandeja

---

## 🛠️ Solución de Problemas

### **Si no funciona después de 5 minutos:**
1. **Verificar que guardaste correctamente** la secret en Supabase
2. **Revisar que el nombre sea exacto:** `RESEND_API_KEY` (mayúsculas)
3. **Esperar 2-3 minutos** y intentar nuevamente
4. **Revisar los logs de Supabase** en caso de errores

### **Si los emails no llegan a los destinatarios:**
1. **Revisar carpeta de spam** en los emails de los destinatarios
2. **Verificar que los emails sean @towapharmaceutical.com** (solo ese dominio funciona)
3. **Comprobar en Resend Dashboard** si hay algún bloqueo o error

---

## 📊 Dashboard de Resend (Opcional)

**Para monitorear emails enviados:**
1. **Ir a:** https://resend.com/dashboard
2. **Usar:** jpedragosa@towapharmaceutical.com
3. **Ver sección "Emails"** para historial de envíos
4. **Ver sección "Analytics"** para estadísticas de apertura

---

## 🎉 ¡Listo!

Una vez configurado:
- ✅ **Newsletter mensual automatizado** (día 1 de cada mes)
- ✅ **Panel de administración completo** para gestión
- ✅ **Emails reales** a todos los suscriptores
- ✅ **Analytics y tracking** de aperturas y clics
- ✅ **Solo @towapharmaceutical.com** puede recibir emails

**¿Necesitas ayuda con algún paso? ¡Avísame!**