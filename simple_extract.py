#!/usr/bin/env python3
import zipfile
import os

backup_path = "/workspace/user_input_files/backup_version_2025_11_10.zip"
extract_path = "/workspace"

os.makedirs(extract_path, exist_ok=True)

try:
    with zipfile.ZipFile(backup_path, 'r') as zip_ref:
        zip_ref.extractall(extract_path)
    print("Backup extracted successfully!")
except Exception as e:
    print(f"Error: {e}")