# Comandos Git para Subir a GitHub - UGT-TOWA Portal

## 📋 Pasos Completos (Después de crear el repositorio en GitHub)

### 1. Ir al directorio del proyecto
```bash
cd /path/to/ugt-towa-portal
```

### 2. Conectar con tu repositorio de GitHub
```bash
git remote add origin https://github.com/TU_USUARIO/TU_REPOSITORIO.git
```
**⚠️ IMPORTANTE**: Reemplaza `TU_USUARIO` y `TU_REPOSITORIO` con tus datos reales.

### 3. Verificar que el remoto se agregó correctamente
```bash
git remote -v
```
Deberías ver algo como:
```
origin  https://github.com/TU_USUARIO/TU_REPOSITORIO.git (fetch)
origin  https://github.com/TU_USUARIO/TU_REPOSITORIO.git (push)
```

### 4. Subir todos los cambios a GitHub
```bash
git push -u origin master
```

### 5. Verificar que todo se subió correctamente
```bash
git status
```
Debería mostrar: "On branch master" y "Your branch is up to date with 'origin/master'"

## 🚀 Si usas el archivo ZIP:

### 1. Descomprimir el ZIP
```bash
unzip ugt-towa-portal-completo.zip
cd ugt-towa-portal
```

### 2. Inicializar Git (si no tienes .git)
```bash
git init
git add .
git commit -m "feat: Sistema de encuestas diferenciadas y correcciones de navegación"
```

### 3. Conectar con GitHub
```bash
git remote add origin https://github.com/TU_USUARIO/TU_REPOSITORIO.git
git push -u origin master
```

## ✅ Resultado Esperado

Después de ejecutar estos comandos:
- ✅ Todo tu código estará en GitHub
- ✅ Los commits históricos se preservarán
- ✅ Vercel automáticamente redesplegará desde GitHub
- ✅ Podrás hacer futuras actualizaciones con `git push`

## 🔧 Si hay errores:

### Error de autenticación:
```bash
# Usar token personal en lugar de contraseña
git remote set-url origin https://github.com/TU_USUARIO/TU_REPO.git
```

### Error de rama:
```bash
# Asegurar que estás en master
git checkout -b master
git push -u origin master
```

### Verificar estado final:
```bash
git log --oneline -n 5
git status
```