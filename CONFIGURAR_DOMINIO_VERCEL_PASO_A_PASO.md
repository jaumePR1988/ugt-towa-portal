# 🌐 Configurar Dominio en Vercel - Paso a Paso

## 📋 **OBJETIVO: ugt.towa.cat → Portal UGT-TOWA**

---

## 🚀 **PASO 1: Ir al Dashboard de Vercel**

### 1.1 Acceder al proyecto
- **URL:** https://vercel.com/dashboard
- **Navegación:** Buscar el proyecto "ugt-towa" 
- **Clic:** En el nombre del proyecto

### 1.2 Entrar al proyecto
- Verás todas las pestañas: **Deployments, Settings, Functions, etc.**
- El proyecto debe estar en la URL: `https://ugt-towa-qhmxu7ffh-jaumes-projects-b54b89da.vercel.app`

---

## 🌍 **PASO 2: Ir a la sección de Dominios**

### 2.1 Encontrar la pestaña Domains
- **Busca la pestaña** llamada **"Domains"** o **"Dominios"**
- Está en la barra de navegación superior del proyecto
- **Clic en "Domains"**

### 2.2 Página de dominios
- Verás una página con:
  - Sección "Domains" (dominios actuales)
  - Campo "Add Domain" (Agregar Dominio)
  - Lista de dominios ya configurados (si los hay)

---

## ➕ **PASO 3: Agregar el nuevo dominio**

### 3.1 Campo "Add Domain"
- **Escribir:** `ugt.towa.cat`
- **Clic:** "Add" o "Agregar"

### 3.2 Vercel te dará instrucciones
Vercel detectará que es un dominio nuevo y mostrará:

```
🔧 Configuration Required

Please configure the following DNS record for ugt.towa.cat:

Type: CNAME
Name: ugt
Value: cname.vercel-dns.com
```

**O algo similar con un valor específico.**

---

## 📝 **PASO 4: Copiar las instrucciones DNS**

### 4.1 Copiar la información
- **Tipo de registro:** CNAME (casi siempre)
- **Nombre:** ugt (o lo que te diga)
- **Valor:** [cualquier URL que te dé Vercel, ej: cname.vercel-dns.com]

### 4.2 Escribir esta información
- Cópiala en un papel o documento
- La necesitarás para el siguiente paso

---

## 🛠️ **PASO 5: Configurar DNS en el registrador (DonDominio)**

### 5.1 Ir al panel de DonDominio
- **URL:** https://panel.dondominio.com/
- **Login** con tus credenciales

### 5.2 Buscar la sección DNS
- **Buscar:** "Gestión DNS" o "DNS" o "Gestión de dominios"
- **Clic:** En la gestión DNS de towa.cat

### 5.3 Agregar registro CNAME
- **Tipo:** CNAME
- **Nombre:** ugt
- **Valor:** [El valor que te dio Vercel, ej: cname.vercel-dns.com]
- **TTL:** 300 (o por defecto)
- **Guardar**

---

## ✅ **PASO 6: Verificar en Vercel**

### 6.1 Volver al Dashboard de Vercel
- **Refresh** la página Domains
- **Estado:** Debería cambiar de "Configuration Required" a "Valid" (puede tardar unos minutos)

### 6.2 Establecer como dominio principal
- **Buscar:** ugt.towa.cat en la lista
- **Clic:** En los "tres puntos" (⋯)
- **Seleccionar:** "Set as Primary" o "Establecer como Principal"

---

## ⏱️ **PASO 7: Esperar y verificar**

### 7.1 Tiempo de propagación
- **Esperar:** 30-60 minutos
- **Vercel:** Puede mostrar "Valid Configuration" ✅

### 7.2 Probar el dominio
- **Navegador:** https://ugt.towa.cat
- **Debería cargar:** Tu portal UGT-TOWA

---

## 🔍 **SITUACIONES POSIBLES**

### ❌ **Si aparece "Invalid Configuration"**
- **Problema:** DNS no está bien configurado
- **Solución:** Verificar que el registro CNAME esté correcto
- **Tiempo:** Puede tardar hasta 48 horas en propagarse

### ✅ **Si aparece "Valid Configuration"**
- **¡Perfecto!** El DNS está bien configurado
- **Probar:** https://ugt.towa.cat

---

## 📋 **CHECKLIST DE VERIFICACIÓN**

- [ ] ✅ Proyecto "ugt-towa" en Dashboard de Vercel
- [ ] ✅ Pestaña "Domains" abierta
- [ ] ✅ Dominio "ugt.towa.cat" agregado
- [ ] ✅ Instrucciones DNS copiadas
- [ ] ✅ Registro CNAME creado en DonDominio
- [ ] ✅ Estado cambió a "Valid Configuration"
- [ ] ✅ https://ugt.towa.cat carga el portal
- [ ] ✅ Dominio establecido como principal

---

## 🎯 **RESULTADO ESPERADO**

**ANTES:**
- `https://ugt-towa-qhmxu7ffh-jaumes-projects-b54b89da.vercel.app`

**DESPUÉS:**
- `https://ugt.towa.cat` (principal)
- `https://ugt-towa-qhmxu7ffh-jaumes-projects-b54b89da.vercel.app` (redirige)

---

## ⚡ **¿EMPEZAMOS?**

1. **Ve a:** https://vercel.com/dashboard
2. **Selecciona:** Proyecto "ugt-towa"
3. **Clic:** Pestaña "Domains"
4. **Agrega:** `ugt.towa.cat`

**¿En qué paso necesitas ayuda?**
- **A) Encontrar el Dashboard de Vercel**
- **B) La pestaña Domains**
- **C) Agregar el dominio**
- **D) Configurar DNS en DonDominio**
- **E) Verificar que funciona**

**¡Te ayudo paso a paso con cualquiera de estos!** 🚀