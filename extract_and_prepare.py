#!/usr/bin/env python3
import zipfile
import os
import shutil
import json
from pathlib import Path

def create_deploy_ready_zip():
    """Crear ZIP optimizado para deploy"""
    
    # Configuración
    source_zip = "UGT_TOWA_Portal_LIMPIO_FINAL_20251116_231332.zip"
    work_dir = "ugt-deploy-ready"
    output_zip = "UGT_TOWA_Portal_DEPLOY_READY_20251116_2329.zip"
    
    print("🚀 Iniciando preparación para deploy...")
    
    # Limpiar directorio anterior
    if os.path.exists(work_dir):
        shutil.rmtree(work_dir)
    
    # Crear directorio de trabajo
    os.makedirs(work_dir, exist_ok=True)
    
    # Extraer ZIP original
    print("📦 Extrayendo ZIP original...")
    try:
        with zipfile.ZipFile(source_zip, 'r') as zip_ref:
            zip_ref.extractall(work_dir)
        print("✅ ZIP extraído exitosamente")
    except Exception as e:
        print(f"❌ Error extrayendo ZIP: {e}")
        return False
    
    # Buscar directorio del proyecto
    project_dir = None
    for item in os.listdir(work_dir):
        item_path = os.path.join(work_dir, item)
        if os.path.isdir(item_path) and 'package.json' in os.listdir(item_path):
            project_dir = item_path
            break
    
    if not project_dir:
        print("❌ No se encontró package.json")
        return False
    
    print(f"📁 Directorio del proyecto: {project_dir}")
    
    # Eliminar archivos problemáticos
    print("🧹 Eliminando archivos problemáticos...")
    
    # Archivos a eliminar
    files_to_remove = ['pnpm-lock.yaml', 'npm-lock.yaml', 'yarn.lock']
    for file in files_to_remove:
        file_path = os.path.join(project_dir, file)
        if os.path.exists(file_path):
            os.remove(file_path)
            print(f"  ✅ Eliminado: {file}")
    
    # Directorios a eliminar
    dirs_to_remove = ['node_modules', 'dist', 'build', '.next', '.pnpm-cache', '.npm', '.yarn']
    for dir_name in dirs_to_remove:
        dir_path = os.path.join(project_dir, dir_name)
        if os.path.exists(dir_path):
            shutil.rmtree(dir_path)
            print(f"  ✅ Eliminado directorio: {dir_name}")
    
    # Verificar .gitignore
    gitignore_path = os.path.join(project_dir, '.gitignore')
    if os.path.exists(gitignore_path):
        with open(gitignore_path, 'r', encoding='utf-8') as f:
            gitignore_content = f.read()
        
        required_excludes = ['node_modules/', 'dist/', 'build/', '.pnpm-cache/', 'pnpm-lock.yaml']
        missing_excludes = [exc for exc in required_excludes if exc not in gitignore_content]
        
        if missing_excludes:
            with open(gitignore_path, 'a', encoding='utf-8') as f:
                f.write('\n# Deploy optimizations\n')
                for exclude in missing_excludes:
                    f.write(f'{exclude}\n')
            print("✅ .gitignore actualizado")
        else:
            print("✅ .gitignore está correcto")
    
    # Crear .npmrc optimizado
    npmrc_path = os.path.join(project_dir, '.npmrc')
    npmrc_content = """engine-strict=true
audit-level=moderate
fund=false
prefer-offline=true
"""
    with open(npmrc_path, 'w', encoding='utf-8') as f:
        f.write(npmrc_content)
    print("✅ .npmrc creado")
    
    # Crear README_DEPLOY.md
    readme_path = os.path.join(project_dir, 'README_DEPLOY.md')
    readme_content = """# UGT TOWA Portal - Deploy Ready

## 🚀 Instrucciones de Deploy

### Vercel (Recomendado)

1. **Subir a GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin <tu-repo-url>
   git push -u origin main
   ```

2. **Conectar con Vercel**
   - Ir a [vercel.com](https://vercel.com)
   - Importar proyecto desde GitHub
   - Vercel detectará automáticamente Node.js
   - **Configuración**:
     - Build Command: `npm run build`
     - Install Command: `npm install`
     - Output Directory: `dist`

### Netlify

- Build Command: `npm run build`
- Publish Directory: `dist`
- Node Version: 18.x+

## 📋 Verificaciones Pre-Deploy

- ✅ Sin pnpm-lock.yaml
- ✅ Sin node_modules/
- ✅ Sin dist/ pre-compilado
- ✅ Scripts usan npm
- ✅ .gitignore correcto

## 🔧 Variables de Entorno

```
VITE_API_URL=https://api.ejemplo.com
VITE_APP_TITLE=UGT TOWA Portal
```

¡Listo para deploy! 🎉
"""
    
    with open(readme_path, 'w', encoding='utf-8') as f:
        f.write(readme_content)
    print("✅ README_DEPLOY.md creado")
    
    # Crear ZIP final
    print("📦 Creando ZIP final...")
    with zipfile.ZipFile(output_zip, 'w', zipfile.ZIP_DEFLATED) as zipf:
        for root, dirs, files in os.walk(project_dir):
            for file in files:
                file_path = os.path.join(root, file)
                arcname = os.path.relpath(file_path, work_dir)
                zipf.write(file_path, arcname)
    
    # Información final
    size_mb = os.path.getsize(output_zip) / (1024 * 1024)
    
    print("🎉 ¡Listo para deploy!")
    print(f"📁 ZIP creado: {output_zip}")
    print(f"📏 Tamaño: {size_mb:.2f} MB")
    print("✅ Optimizado para Vercel/GitHub con npm")
    
    return True

if __name__ == "__main__":
    success = create_deploy_ready_zip()
    exit(0 if success else 1)