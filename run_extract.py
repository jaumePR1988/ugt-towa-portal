#!/usr/bin/env python3

import zipfile
import os

# Backup path and extraction path
backup_path = "/workspace/user_input_files/backup_version_2025_11_10.zip"
extract_path = "/workspace/ugt_backup"

# Create extract directory
os.makedirs(extract_path, exist_ok=True)

# Extract the backup
with zipfile.ZipFile(backup_path, 'r') as zip_ref:
    zip_ref.extractall(extract_path)

print(f"Successfully extracted backup to {extract_path}")

# List what's in there
print("\nBackup contents:")
for root, dirs, files in os.walk(extract_path):
    level = root.replace(extract_path, '').count(os.sep)
    indent = ' ' * 2 * level
    print(f"{indent}{os.path.basename(root)}/")
    subindent = ' ' * 2 * (level + 1)
    for file in files[:10]:  # Show first 10 files
        print(f"{subindent}{file}")
    if len(files) > 10:
        print(f"{subindent}... and {len(files) - 10} more files")