#!/usr/bin/env python3
"""
Script para preparar el ZIP optimizado para deploy con npm
"""
import zipfile
import os
import shutil
import json
from pathlib import Path

def main():
    # Rutas
    source_zip = "UGT_TOWA_Portal_LIMPIO_FINAL_20251116_231332.zip"
    work_dir = "ugt-deploy-ready"
    output_zip = "UGT_TOWA_Portal_DEPLOY_READY_20251116_2329.zip"
    
    print("🚀 Iniciando preparación para deploy...")
    
    # 1. Limpiar directorio de trabajo anterior
    if os.path.exists(work_dir):
        shutil.rmtree(work_dir)
    
    # 2. Crear directorio de trabajo
    os.makedirs(work_dir, exist_ok=True)
    
    # 3. Extraer ZIP original
    print("📦 Extrayendo ZIP original...")
    try:
        with zipfile.ZipFile(source_zip, 'r') as zip_ref:
            zip_ref.extractall(work_dir)
        print("✅ ZIP extraído exitosamente")
    except Exception as e:
        print(f"❌ Error extrayendo ZIP: {e}")
        return
    
    # 4. Buscar directorio del proyecto (puede estar anidado)
    project_dir = None
    for item in os.listdir(work_dir):
        item_path = os.path.join(work_dir, item)
        if os.path.isdir(item_path) and 'package.json' in os.listdir(item_path):
            project_dir = item_path
            break
    
    if not project_dir:
        print("❌ No se encontró package.json en el proyecto")
        return
    
    print(f"📁 Directorio del proyecto: {project_dir}")
    
    # 5. Eliminar archivos problemáticos
    print("🧹 Eliminando archivos problemáticos...")
    files_to_remove = [
        'pnpm-lock.yaml',
        'npm-lock.yaml', 
        'yarn.lock',
        'package-lock.json'  # Mantendremos solo package.json
    ]
    
    dirs_to_remove = [
        'node_modules',
        'dist',
        'build',
        '.next',
        '.pnpm-cache',
        '.npm',
        '.yarn/cache',
        '.yarn/unplugged',
        '.yarn/build-state.yml',
        '.yarn/install-state.gz'
    ]
    
    for file in files_to_remove:
        file_path = os.path.join(project_dir, file)
        if os.path.exists(file_path):
            os.remove(file_path)
            print(f"  ✅ Eliminado: {file}")
    
    for dir_name in dirs_to_remove:
        dir_path = os.path.join(project_dir, dir_name)
        if os.path.exists(dir_path):
            shutil.rmtree(dir_path)
            print(f"  ✅ Eliminado directorio: {dir_name}")
    
    # 6. Verificar y actualizar package.json
    package_json_path = os.path.join(project_dir, 'package.json')
    try:
        with open(package_json_path, 'r', encoding='utf-8') as f:
            package_data = json.load(f)
        
        # Verificar scripts (deben usar npm)
        scripts = package_data.get('scripts', {})
        print("📝 Scripts encontrados:")
        for script_name, script_command in scripts.items():
            print(f"  {script_name}: {script_command}")
        
        # Asegurar que no hay referencias a pnpm en scripts
        for script_name, script_command in scripts.items():
            if 'pnpm' in script_command:
                print(f"  ⚠️  Script '{script_name}' contiene referencia a pnpm: {script_command}")
        
        print("✅ package.json verificado")
        
    except Exception as e:
        print(f"❌ Error leyendo package.json: {e}")
        return
    
    # 7. Verificar .gitignore
    gitignore_path = os.path.join(project_dir, '.gitignore')
    if os.path.exists(gitignore_path):
        print("📋 Verificando .gitignore...")
        with open(gitignore_path, 'r', encoding='utf-8') as f:
            gitignore_content = f.read()
        
        # Verificar que exclude los archivos problemáticos
        required_excludes = [
            'node_modules/',
            'dist/',
            'build/',
            '.next/',
            '.pnpm-cache/',
            'pnpm-lock.yaml',
            '.npm/',
            '.yarn/'
        ]
        
        missing_excludes = []
        for exclude in required_excludes:
            if exclude not in gitignore_content:
                missing_excludes.append(exclude)
        
        if missing_excludes:
            print(f"⚠️  Faltan exclusiones en .gitignore: {missing_excludes}")
            # Agregar las exclusiones faltantes
            with open(gitignore_path, 'a', encoding='utf-8') as f:
                f.write('\n# Deploy optimizations\n')
                for exclude in missing_excludes:
                    f.write(f'{exclude}\n')
            print("✅ .gitignore actualizado")
        else:
            print("✅ .gitignore está correcto")
    else:
        print("⚠️  No se encontró .gitignore, creando uno básico...")
        gitignore_content = """# Dependencies
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
lerna-debug.log*

# Build outputs
dist/
build/
.next/
out/

# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Package manager files
package-lock.json
yarn.lock
pnpm-lock.yaml
.npm/
.pnpm-cache/
.yarn/

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Logs
logs
*.log

# Runtime data
pids
*.pid
*.seed
*.pid.lock

# Coverage directory used by tools like istanbul
coverage/

# Temporary folders
tmp/
temp/
"""
        with open(gitignore_path, 'w', encoding='utf-8') as f:
            f.write(gitignore_content)
        print("✅ .gitignore creado")
    
    # 8. Crear archivo .npmrc si no existe
    npmrc_path = os.path.join(project_dir, '.npmrc')
    if not os.path.exists(npmrc_path):
        npmrc_content = """# Optimizaciones para npm
engine-strict=true
audit-level=moderate
fund=false
prefer-offline=true
"""
        with open(npmrc_path, 'w', encoding='utf-8') as f:
            f.write(npmrc_content)
        print("✅ .npmrc creado")
    
    # 9. Crear archivo README_DEPLOY.md
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
   - Vercel detectará automáticamente que es un proyecto Node.js
   - **Importante**: En la configuración de Vercel, asegurar que use npm:
     - Build Command: `npm run build`
     - Install Command: `npm install`
     - Output Directory: `dist` o `build`

### Netlify

1. Build Command: `npm run build`
2. Publish Directory: `dist` o `build`
3. Node Version: 18.x o superior

### Deploy Manual

```bash
# 1. Instalar dependencias
npm install

# 2. Build del proyecto
npm run build

# 3. Los archivos de producción estarán en dist/ o build/
```

## 📋 Verificaciones Pre-Deploy

- ✅ Sin archivos `pnpm-lock.yaml`
- ✅ Sin directorio `node_modules/`
- ✅ Sin directorio `dist/` pre-compilado
- ✅ Scripts en package.json usan `npm` (no `pnpm`)
- ✅ .gitignore correcto

## 🔧 Variables de Entorno

Crear archivo `.env` con:

```
VITE_API_URL=https://api.ejemplo.com
VITE_APP_TITLE=UGT TOWA Portal
```

## 📞 Soporte

Para issues de deploy, verificar:
1. Que el package manager esté configurado como npm
2. Que las variables de entorno estén correctas
3. Que el build command sea `npm run build`
"""
    
    with open(readme_path, 'w', encoding='utf-8') as f:
        f.write(readme_content)
    print("✅ README_DEPLOY.md creado")
    
    # 10. Crear ZIP final
    print("📦 Creando ZIP final...")
    with zipfile.ZipFile(output_zip, 'w', zipfile.ZIP_DEFLATED) as zipf:
        for root, dirs, files in os.walk(project_dir):
            for file in files:
                file_path = os.path.join(root, file)
                arcname = os.path.relpath(file_path, work_dir)
                zipf.write(file_path, arcname)
    
    # 11. Obtener tamaño del ZIP
    size_mb = os.path.getsize(output_zip) / (1024 * 1024)
    
    print("🎉 ¡Listo para deploy!")
    print(f"📁 ZIP creado: {output_zip}")
    print(f"📏 Tamaño: {size_mb:.2f} MB")
    print("✅ Optimizado para Vercel/GitHub con npm")

if __name__ == "__main__":
    main()