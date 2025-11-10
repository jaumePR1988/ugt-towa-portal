# 🔄 Guía Completa: Cómo Actualizar el Portal UGT-TOWA

## **RESUMEN: 4 Opciones desde Súper FÁCIL hasta Automática**

### **🎯 OPCIÓN 1: Súper Rápido - Solo 1 Comando (2 minutos)**

Para futuras actualizaciones después del primer deploy:

```bash
# 1. Abrir terminal en la carpeta del proyecto
# 2. Un solo comando:
npx vercel --prod
```

**Ventajas**: ✅ Más rápido, sin preguntas  
**Desventajas**: ⚠️ Necesitas abrir terminal cada vez

---

### **🎯 OPCIÓN 2: Súper Fácil - Archivo .bat (RECOMENDADA)**

**Para Windows**: Archivo que hace todo con doble click

1. Descargar `actualizar-portal.bat`
2. Ponerlo en la carpeta `ugt-towa-portal`
3. **Doble click** → Se actualiza automáticamente
4. 2 minutos después → ¡Portal actualizado!

**Ventajas**: ✅ 1 click, automático, sin terminal  
**Desventajas**: ❌ Solo Windows

---

### **🎯 OPCIÓN 3: Dashboard Web (MÁS SIMPLE)**

1. Ir a: https://vercel.com/dashboard
2. Seleccionar proyecto "ugt-towa"
3. Click "Redeploy"
4. ¡Listo!

**Ventajas**: ✅ Desde cualquier dispositivo, visual, fácil  
**Desventajas**: ❌ Necesitas internet, solo desde web

---

### **🎯 OPCIÓN 4: Automático con Git (MÁS PROFESIONAL)**

Si usas Git con GitHub/GitLab:

1. Haces cambios en el código
2. Subes cambios: `git push`
3. **Vercel se actualiza solo automáticamente**
4. Recibes email cuando está listo

**Ventajas**: ✅ Automático, versionado, profesional  
**Desventajas**: ❌ Requiere Git, más configuración

---

## **🏆 RECOMENDACIÓN POR USO:**

### **Casual/Hobby**: OPCIÓN 2 (archivo .bat)
- Haces cambios
- Doble click en `actualizar-portal.bat`
- ¡Listo!

### **Profesional**: OPCIÓN 4 (Git automático)
- Más seguro
- Versionado
- Equipo puede colaborar

### **De vez en cuando**: OPCIÓN 3 (Dashboard web)
- Más visual
- Sin instalar nada

### **Desarrollo rápido**: OPCIÓN 1 (un comando)
- Más control
- Sin clicks adicionales

---

## **⚡ CASOS DE USO COMUNES:**

### **Cambiar texto/contenido (frecuente)**:
1. Editar archivos
2. OPCIÓN 2 (doble click) o OPCIÓN 1 (comando)

### **Añadir nueva página/sección (ocasional)**:
1. Crear nuevo archivo
2. OPCIÓN 1 (comando) o OPCIÓN 3 (web)

### **Cambiar diseño/colores (rara vez)**:
1. Modificar CSS
2. OPCIÓN 4 (Git) o OPCIÓN 1 (comando)

### **Actualizar información de contacto**:
1. Editar `src/config/contact.ts` o variables de entorno
2. Cualquier opción funciona

---

## **🔧 CONFIGURACIÓN ADICIONAL:**

### **Para Git automático (Opción 4)**:
```bash
git init
git add .
git commit -m "Primer commit"
git branch -M main
git remote add origin https://github.com/tu-usuario/ugt-towa.git
git push -u origin main
```

### **Para variables de entorno (cambios de datos de contacto)**:
- En Vercel Dashboard → Settings → Environment Variables
- O editar `.env.local` en desarrollo local

---

## **❓ PREGUNTAS FRECUENTES:**

**P: ¿Cuánto tarda cada método?**
R: 1-3 minutos dependiendo de los cambios

**P: ¿Pierdo datos al actualizar?**
R: No, los datos están en Supabase, separado del código

**P: ¿Puedo hacer rollback si algo sale mal?**
R: Sí, en Vercel Dashboard puedes seleccionar versiones anteriores

**P: ¿Qué pasa si el deploy falla?**
R: El sitio anterior sigue funcionando, no se rompe nada

**P: ¿Necesito instalar nada adicional?**
R: No, ya tienes todo instalado con el primer deploy

---

## **🎯 PRÓXIMOS PASOS:**

1. **Elige tu método favorito** de las 4 opciones
2. **Haz una prueba** con un cambio pequeño
3. **Guarda los archivos** (`actualizar-portal.bat` si eliges esa opción)
4. **Crea un marcador** del Dashboard de Vercel para acceso rápido

**¿Cuál prefieres probar primero?** 🤔