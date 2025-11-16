#!/usr/bin/env python3
import zipfile
import os
import shutil

# Configuración
source_zip = "UGT_TOWA_Portal_LIMPIO_FINAL_20251116_231332.zip"
output_zip = "UGT_TOWA_Portal_DEPLOY_READY_20251116_2329.zip"
work_dir = "deploy-work"

print("🚀 Iniciando preparación para deploy...")

# 1. Limpiar y crear directorio
if os.path.exists(work_dir):
    shutil.rmtree(work_dir)
os.makedirs(work_dir, exist_ok=True)

# 2. Extraer ZIP
print("📦 Extrayendo ZIP original...")
with zipfile.ZipFile(source_zip, 'r') as zip_ref:
    zip_ref.extractall(work_dir)

# 3. Encontrar directorio del proyecto
project_dir = None
for item in os.listdir(work_dir):
    item_path = os.path.join(work_dir, item)
    if os.path.isdir(item_path) and 'package.json' in os.listdir(item_path):
        project_dir = item_path
        break

if not project_dir:
    print("❌ No se encontró package.json")
    exit(1)

print(f"📁 Proyecto encontrado: {project_dir}")

# 4. Eliminar archivos problemáticos
files_to_remove = ['pnpm-lock.yaml', 'npm-lock.yaml', 'yarn.lock']
for file in files_to_remove:
    file_path = os.path.join(project_dir, file)
    if os.path.exists(file_path):
        os.remove(file_path)
        print(f"  ✅ Eliminado: {file}")

dirs_to_remove = ['node_modules', 'dist', 'build', '.next', '.pnpm-cache', '.npm', '.yarn']
for dir_name in dirs_to_remove:
    dir_path = os.path.join(project_dir, dir_name)
    if os.path.exists(dir_path):
        shutil.rmtree(dir_path)
        print(f"  ✅ Eliminado directorio: {dir_name}")

# 5. Crear .npmrc
npmrc_path = os.path.join(project_dir, '.npmrc')
with open(npmrc_path, 'w') as f:
    f.write("engine-strict=true\naudit-level=moderate\nfund=false\nprefer-offline=true\n")
print("✅ .npmrc creado")

# 6. Actualizar .gitignore
gitignore_path = os.path.join(project_dir, '.gitignore')
if os.path.exists(gitignore_path):
    with open(gitignore_path, 'r') as f:
        content = f.read()
    if 'pnpm-lock.yaml' not in content:
        with open(gitignore_path, 'a') as f:
            f.write('\n# Deploy optimizations\npnpm-lock.yaml\n.pnpm-cache/\n')
        print("✅ .gitignore actualizado")

# 7. Crear README_DEPLOY.md
readme_path = os.path.join(project_dir, 'README_DEPLOY.md')
readme_content = """# UGT TOWA Portal - Deploy Ready

## 🚀 Instrucciones de Deploy

### Vercel (Recomendado)
1. Subir a GitHub
2. Conectar con Vercel
3. Configuración:
   - Build Command: `npm run build`
   - Install Command: `npm install`
   - Output Directory: `dist`

### Verificaciones Pre-Deploy
- ✅ Sin pnpm-lock.yaml
- ✅ Sin node_modules/
- ✅ Sin dist/ pre-compilado
- ✅ Scripts usan npm
- ✅ .gitignore correcto

¡Listo para deploy! 🎉
"""
with open(readme_path, 'w') as f:
    f.write(readme_content)
print("✅ README_DEPLOY.md creado")

# 8. Crear ZIP final
print("📦 Creando ZIP final...")
with zipfile.ZipFile(output_zip, 'w', zipfile.ZIP_DEFLATED) as zipf:
    for root, dirs, files in os.walk(project_dir):
        for file in files:
            file_path = os.path.join(root, file)
            arcname = os.path.relpath(file_path, work_dir)
            zipf.write(file_path, arcname)

# 9. Información final
size_mb = os.path.getsize(output_zip) / (1024 * 1024)
print("🎉 ¡Listo para deploy!")
print(f"📁 ZIP creado: {output_zip}")
print(f"📏 Tamaño: {size_mb:.2f} MB")
print("✅ Optimizado para Vercel/GitHub con npm")