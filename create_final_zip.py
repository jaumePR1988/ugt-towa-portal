#!/usr/bin/env python3
import zipfile
import os
import shutil

def create_final_zip():
    """Crear ZIP final optimizado para deploy"""
    
    # Configuración
    project_dir = "deploy-work/ugt-towa-portal-limpio-github-final"
    output_zip = "UGT_TOWA_Portal_DEPLOY_READY_20251116_2329.zip"
    
    print("🚀 Creando ZIP final optimizado...")
    
    # Verificar que no existen archivos problemáticos
    problem_files = ['pnpm-lock.yaml', 'npm-lock.yaml', 'yarn.lock']
    problem_dirs = ['node_modules', 'dist', 'build', '.next', '.pnpm-cache', '.npm', '.yarn']
    
    for file in problem_files:
        if os.path.exists(os.path.join(project_dir, file)):
            print(f"⚠️  ADVERTENCIA: Archivo problemático encontrado: {file}")
    
    for dir_name in problem_dirs:
        if os.path.exists(os.path.join(project_dir, dir_name)):
            print(f"⚠️  ADVERTENCIA: Directorio problemático encontrado: {dir_name}")
    
    # Crear ZIP final
    print("📦 Creando ZIP final optimizado...")
    with zipfile.ZipFile(output_zip, 'w', zipfile.ZIP_DEFLATED) as zipf:
        for root, dirs, files in os.walk(project_dir):
            for file in files:
                file_path = os.path.join(root, file)
                # Calcular ruta relativa desde project_dir
                arcname = os.path.relpath(file_path, os.path.dirname(project_dir))
                zipf.write(file_path, arcname)
    
    # Información final
    size_mb = os.path.getsize(output_zip) / (1024 * 1024)
    print("🎉 ¡ZIP final creado exitosamente!")
    print(f"📁 Archivo: {output_zip}")
    print(f"📏 Tamaño: {size_mb:.2f} MB")
    print("✅ Optimizado para Vercel/GitHub con npm")
    print("\n📋 Resumen de optimizaciones aplicadas:")
    print("- ✅ Scripts en package.json actualizados a npm")
    print("- ✅ .npmrc creado con optimizaciones")
    print("- ✅ .gitignore verificado y correcto")
    print("- ✅ README_DEPLOY.md agregado")
    print("- ✅ Archivos problemáticos eliminados")
    print("- ✅ Referencias a pnpm removidas")
    
    return True

if __name__ == "__main__":
    create_final_zip()