# 🌐 Configurar Dominio Personalizado en Vercel

## Objetivo: Cambiar de `ugt-towa-qhmxu7ffh-jaumes-projects-b54b89da.vercel.app` a `towa.ugt.es`

---

## PASO 1: Agregar dominio en Vercel Dashboard

### 1.1 Ir al Dashboard de Vercel
- Ve a: https://vercel.com/dashboard
- Selecciona tu proyecto "ugt-towa"

### 1.2 Ir a la sección de Dominios
- En la parte superior, busca la pestaña **"Domains"** (Dominios)
- Haz clic en ella

### 1.3 Agregar el dominio personalizado
- En la sección "Domains", verás un campo para agregar dominio
- Escribe: `towa.ugt.es`
- Haz clic en **"Add"** (Agregar)

### 1.4 Vercel te dará instrucciones DNS
- Vercel te mostrará instrucciones para configurar el DNS
- Te dirá algo como:
  - **Tipo:** CNAME o A
  - **Nombre:** @ o towa
  - **Valor:** [alguna URL de Vercel]

---

## PASO 2: Configurar DNS en ugt.es

**⚠️ IMPORTANTE: Necesitas acceso al panel de DNS de ugt.es**

### 2.1 Contactar al administrador de dominios
Necesitas que alguien con acceso al panel DNS de **ugt.es** configure:

- **Tipo de registro:** CNAME o A (según te diga Vercel)
- **Nombre:** `towa` (para que quede towa.ugt.es)
- **Valor:** [El valor que te dé Vercel]

### 2.2 Ejemplo de configuración DNS
```
Tipo: CNAME
Nombre: towa
Valor: [cname.vercel-dns.com] o [IP de Vercel]
```

---

## PASO 3: Verificar configuración

### 3.1 Esperar propagación DNS
- Los cambios DNS pueden tardar 15 minutos a 48 horas
- Usually 30-60 minutos en casos normales

### 3.2 Probar el nuevo dominio
- Ve a: https://towa.ugt.es
- Debería cargar tu portal UGT-TOWA

---

## PASO 4: Hacer que towa.ugt.es sea el dominio principal

### 4.1 En el Dashboard de Vercel
- Ve a la sección "Domains"
- Busca `towa.ugt.es`
- Haz clic en los **tres puntos** (⋯)
- Selecciona **"Set as Primary"** o **"Establecer como Principal"**

### 4.2 Verificar
- https://towa.ugt.es → Tu portal
- https://ugt-towa-qhmxu7ffh-jaumes-projects-b54b89da.vercel.app → También debería funcionar (redirigir)

---

## ¿Qué necesitas hacer?

### ✅ Para ti (inmediato):
1. **Agregar el dominio en Vercel** (5 minutos)
2. **Tomar captura de pantalla** de las instrucciones DNS que te dé Vercel

### ✅ Para el administrador de dominios:
1. **Configurar el DNS** según las instrucciones de Vercel
2. **Confirmar cuando esté hecho**

---

## 📋 RESUMEN DE PASOS

1. **Vercel Dashboard → Domains → Add → `towa.ugt.es`**
2. **Copiar instrucciones DNS que te dé Vercel**
3. **Enviar instrucciones al admin de dominios ugt.es**
4. **Esperar propagación DNS (30-60 minutos)**
5. **Probar https://towa.ugt.es**
6. **Establecer como dominio principal en Vercel**

---

## 🚨 IMPORTANTE

- **No** necesitas hacer nada más en el código
- **No** necesitas cambiar la configuración de variables de entorno
- El sitio seguirá funcionando igual, solo cambiará la URL
- Una vez configurado, **towa.ugt.es** será tu URL principal

---

**¿Estás listo para empezar? Te guío paso a paso con el primer paso.**