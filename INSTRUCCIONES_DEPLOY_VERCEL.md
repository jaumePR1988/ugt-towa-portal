# 🎯 GUÍA COMPLETA: Como Instalar y Desplegar UGT-TOWA Portal

## PASO 0: Descargar el Proyecto 📦

1. **Descargar archivo**: `proyecto-ugt-towa-completo.tar.gz`
2. **Extraer en tu escritorio** (o donde prefieras)
3. Verás una carpeta llamada `ugt-towa-portal`

## PASO 1: Abrir Terminal 💻

**En Windows:**
- Presiona `Windows + R`
- Escribe `cmd` y presiona Enter

**En Mac:**
- Presiona `Cmd + Espacio`
- Escribe "terminal" y presiona Enter

## PASO 2: Navegar a tu Carpeta 📁

**IMPORTANTE**: Cambia `C:\Users\TuNombre\Desktop` por la ruta real donde extraíste el proyecto.

### En Windows (ejemplo):
```bash
cd C:\Users\TuNombre\Desktop\ugt-towa-portal
```

### En Mac (ejemplo):
```bash
cd /Users/TuNombre/Desktop/ugt-towa-portal
```

**¿No sabes cuál es tu ruta exacta?**
1. Abre la carpeta donde extraíste el proyecto
2. En Windows: En la barra de dirección, copia la ruta completa
3. En Mac: Click derecho en la carpeta → "Obtener información" → Verás la ruta

## PASO 3: Verificar que Estás en el Lugar Correcto ✅

Escribe esto para comprobar:
```bash
dir
```
(En Windows)

```bash
ls
```
(En Mac)

**Deberías ver archivos como:**
- `package.json`
- `src` (carpeta)
- `.env.local`
- `README.md`

## PASO 4: Instalar Vercel ⚡

```bash
npm install -g vercel
```

## PASO 5: Login en Vercel 🔐

```bash
npx vercel login
```
*(Se abre tu navegador para login)*

## PASO 6: Desplegar 🚀

```bash
npx vercel --name ugt-towa --prod
```

## RESPUESTAS A LAS PREGUNTAS:

**"Set up and deploy?"** → `Y`  
**"Which scope?"** → `1` (tu número)  
**"Link to existing project?"** → `N`  
**"What's your project's name?"** → `ugt-towa`  
**"In which directory is your code located?"** → `./`  
**"Want to override the settings?"** → `N`  
**"Deploy to production?"** → `Y`

## RESULTADO ESPERADO:
```
✅  Production: https://ugt-towa.vercel.app [1m 23s]
```

## SEGUNDO PASO: Configurar Variables de Entorno (IMPORTANTE)

Después del deploy exitoso:

1. Ve a: https://vercel.com/dashboard
2. Selecciona tu proyecto "ugt-towa"
3. Settings → Environment Variables
4. Añade estas 4 variables:

```
VITE_SUPABASE_URL=https://zaxdscclkeytakcowgww.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpheGRzY2Nsa2V5dGFrY293Z3d3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIwMTUxMTIsImV4cCI6MjA3NzU5MTExMn0.MQMePYqEhW9xhCipC-MeU8Z_dXqvyBKH5e0vtgaS9xQ
VITE_CONTACT_EMAIL=jpedragosa@towapharmaceutical.com
VITE_CONTACT_PHONE=629931957
```

5. Click "Deploy" para aplicar cambios

## ¡LISTO! 🎉

Tu portal estará en: **https://ugt-towa.vercel.app**

## ¿PROBLEMAS?

- **"No se encuentra el comando npm"** → Necesitas instalar Node.js primero
- **"Permission denied"** → Ejecuta la terminal como administrador (Windows)
- **Cualquier error** → Mándame una captura de pantalla