# 🔧 Configuración de Variables de Entorno en Vercel

## PASO A PASO PARA CONFIGURAR LAS VARIABLES

### 1. Ir al Dashboard de Vercel
- Abre tu navegador
- Ve a: https://vercel.com/dashboard
- Inicia sesión si no lo estás

### 2. Seleccionar tu proyecto
- Busca el proyecto "ugt-towa" en la lista
- Haz clic en él

### 3. Ir a Settings (Configuración)
- En la parte superior del proyecto, verás varias pestañas
- Haz clic en **"Settings"** (en inglés) o **"Configuración"** (en español)

### 4. Navegar a Environment Variables
- En el menú lateral izquierdo, busca **"Environment Variables"**
- Haz clic en esa opción

### 5. Agregar las variables una por una

#### 📧 Variable 1: VITE_CONTACT_EMAIL
- **Name (Nombre):** `VITE_CONTACT_EMAIL`
- **Value (Valor):** `jpedragosa@towapharmaceutical.com`
- **Environment (Entorno):** Selecciona **"Production, Preview, Development"**
- Haz clic en **"Add"** (Agregar)

#### 📞 Variable 2: VITE_CONTACT_PHONE
- **Name (Nombre):** `VITE_CONTACT_PHONE`
- **Value (Valor):** `629931957`
- **Environment (Entorno):** Selecciona **"Production, Preview, Development"**
- Haz clic en **"Add"** (Agregar)

#### 🗄️ Variable 3: VITE_SUPABASE_URL
- **Name (Nombre):** `VITE_SUPABASE_URL`
- **Value (Valor):** `https://zaxdscclkeytakcowgww.supabase.co`
- **Environment (Entorno):** Selecciona **"Production, Preview, Development"**
- Haz clic en **"Add"** (Agregar)

#### 🔑 Variable 4: VITE_SUPABASE_ANON_KEY
- **Name (Nombre):** `VITE_SUPABASE_ANON_KEY`
- **Value (Valor):** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpheGRzY2Nsa2V5dGFrY293Z3d3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIwMTUxMTIsImV4cCI6MjA3NzU5MTExMn0.MQMePYqEhW9xhCipC-MeU8Z_dXqvyBKH5e0vtgaS9xQ`
- **Environment (Entorno):** Selecciona **"Production, Preview, Development"**
- Haz clic en **"Add"** (Agregar)

### 6. Guardar y Redeployar
- Una vez agregadas todas las variables
- Ve a la pestaña **"Deployments"** (Despliegues)
- Busca el deploy más reciente
- Haz clic en los **"tres puntos"** (⋯) al lado del deploy
- Selecciona **"Redeploy"**

### 7. Verificar los cambios
- Espera a que termine el redeploy (2-3 minutos)
- Ve a tu sitio: https://ugt-towa-qhmxu7ffh-jaumes-projects-b54b89da.vercel.app
- Busca el footer y verifica que aparezcan:
  - **Email:** jpedragosa@towapharmaceutical.com
  - **Teléfono:** 629931957

## ✅ ¡LISTO!
Tu portal UGT-TOWA ya tiene los datos de contacto correctos y el sistema para modificarlos fácilmente en el futuro.

---

**Nota:** Si alguna vez necesitas cambiar el email o teléfono, solo tienes que volver aquí y modificar el "Value" de las variables correspondientes.