#!/usr/bin/env python3
import shutil
import os
import zipfile

# Source and destination paths
source_dir = "/workspace/backup_version_2025_11_10/ugt-towa-portal"
dest_dir = "/workspace/UGT_TOWA_PORTAL_WORKING_FINAL"

# Copy the working version
if os.path.exists(dest_dir):
    shutil.rmtree(dest_dir)

shutil.copytree(source_dir, dest_dir)

# Remove unnecessary files
to_remove = ['node_modules', '.pnpm-store', 'pnpm-lock.yaml']
for item in to_remove:
    item_path = os.path.join(dest_dir, item)
    if os.path.exists(item_path):
        if os.path.isdir(item_path):
            shutil.rmtree(item_path)
        else:
            os.remove(item_path)

print(f"✅ Copied working version to {dest_dir}")
print("✅ Removed node_modules and lock files")

# Create ZIP file
zip_path = "/workspace/UGT_TOWA_PORTAL_WORKING_FINAL.zip"
with zipfile.ZipFile(zip_path, 'w', zipfile.ZIP_DEFLATED) as zipf:
    for root, dirs, files in os.walk(dest_dir):
        # Skip node_modules and .git directories
        dirs[:] = [d for d in dirs if d not in ['node_modules', '.git', '.pnpm-store']]
        
        for file in files:
            # Skip lock files
            if file in ['pnpm-lock.yaml', 'package-lock.json', 'yarn.lock']:
                continue
                
            file_path = os.path.join(root, file)
            arcname = os.path.relpath(file_path, '/workspace')
            zipf.write(file_path, arcname)

print(f"✅ Created ZIP file: {zip_path}")

# Get file size
size_mb = os.path.getsize(zip_path) / (1024 * 1024)
print(f"📦 ZIP size: {size_mb:.1f} MB")