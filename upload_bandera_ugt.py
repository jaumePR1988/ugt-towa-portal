#!/usr/bin/env python3
"""
Script para subir la imagen de la bandera UGT a la galería del portal
"""

import os
import requests
from datetime import datetime

# Configuración de Supabase
SUPABASE_URL = "https://zaxdscclkeytakcowgww.supabase.co"
SUPABASE_SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpheGRzY2Nsa2V5dGFrY293Z3d3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MjAxNTExMiwiZXhwIjoyMDc3NTkxMTEyfQ.KQRwFcy8cubh4dW7QyI2TMz4k3YqGg5Soifd5VkyoJg"

# Rutas de archivos
IMAGE_PATH = "/workspace/user_input_files/Bandera-logo-nuevo.jpg"
BUCKET_NAME = "event-images"
FILE_NAME = "bandera-ugt-2024.jpg"

def upload_to_storage():
    """Sube la imagen al bucket de Supabase Storage"""
    print(f"Subiendo imagen al bucket '{BUCKET_NAME}'...")
    
    # Leer la imagen
    with open(IMAGE_PATH, 'rb') as f:
        image_data = f.read()
    
    # URL del endpoint de Storage
    storage_url = f"{SUPABASE_URL}/storage/v1/object/{BUCKET_NAME}/{FILE_NAME}"
    
    # Headers
    headers = {
        "Authorization": f"Bearer {SUPABASE_SERVICE_KEY}",
        "Content-Type": "image/jpeg"
    }
    
    # Subir archivo
    response = requests.post(storage_url, data=image_data, headers=headers)
    
    if response.status_code in [200, 201]:
        print(f"Imagen subida correctamente")
        # URL pública de la imagen
        public_url = f"{SUPABASE_URL}/storage/v1/object/public/{BUCKET_NAME}/{FILE_NAME}"
        print(f"URL pública: {public_url}")
        return public_url
    else:
        print(f"Error al subir imagen: {response.status_code}")
        print(f"Respuesta: {response.text}")
        return None

def insert_into_database(image_url):
    """Inserta el registro en la tabla event_images"""
    print(f"\nInsertando registro en la base de datos...")
    
    # URL del endpoint de la API
    api_url = f"{SUPABASE_URL}/rest/v1/event_images"
    
    # Headers
    headers = {
        "Authorization": f"Bearer {SUPABASE_SERVICE_KEY}",
        "apikey": SUPABASE_SERVICE_KEY,
        "Content-Type": "application/json",
        "Prefer": "return=representation"
    }
    
    # Datos a insertar
    data = {
        "title": "Bandera de la UGT: Símbolo de Unidad y Lucha Obrera",
        "description": "Una vibrante bandera de la Unión General de Trabajadores (UGT) ondea con fuerza, destacando el icónico color rojo del movimiento obrero y las claras letras 'UGT' en blanco. El emblema del apretón de manos visible encapsula el espíritu de solidaridad y la fuerza colectiva de los trabajadores. Capturada durante un evento al aire libre, esta imagen representa la identidad visual del sindicato, así como la constante presencia y reivindicación de sus derechos.",
        "image_url": image_url,
        "event_date": "2024-11-09",
        "display_order": 1,
        "is_active": True
    }
    
    # Insertar registro
    response = requests.post(api_url, json=data, headers=headers)
    
    if response.status_code in [200, 201]:
        print(f"Registro insertado correctamente")
        result = response.json()
        print(f"ID del registro: {result[0]['id'] if result else 'N/A'}")
        return True
    else:
        print(f"Error al insertar registro: {response.status_code}")
        print(f"Respuesta: {response.text}")
        return False

def main():
    """Función principal"""
    print("=" * 60)
    print("SUBIR BANDERA UGT A LA GALERÍA DEL PORTAL")
    print("=" * 60)
    
    # Verificar que el archivo existe
    if not os.path.exists(IMAGE_PATH):
        print(f"Error: No se encuentra el archivo {IMAGE_PATH}")
        return
    
    print(f"Archivo encontrado: {IMAGE_PATH}")
    file_size = os.path.getsize(IMAGE_PATH)
    print(f"Tamaño: {file_size:,} bytes ({file_size/1024:.2f} KB)")
    
    # Paso 1: Subir imagen a Storage
    image_url = upload_to_storage()
    if not image_url:
        print("\nNo se pudo completar la operación")
        return
    
    # Paso 2: Insertar registro en la base de datos
    success = insert_into_database(image_url)
    
    if success:
        print("\n" + "=" * 60)
        print("OPERACIÓN COMPLETADA EXITOSAMENTE")
        print("=" * 60)
        print(f"La imagen ya está disponible en la galería")
        print(f"URL: https://5xxsi5tu8wt6.space.minimax.io")
    else:
        print("\nLa operación no se completó correctamente")

if __name__ == "__main__":
    main()
