# Instrucciones Paso a Paso - Deploy UGT Towa Portal

## PASO 1: Abrir Terminal y Navegar
1. Abre una terminal (Command Prompt en Windows, Terminal en Mac/Linux)
2. Navega a tu carpeta del proyecto:
   ```bash
   cd ruta-a-tu-proyecto
   ```

## PASO 2: Verificar Estado de Git
```bash
git status
```
Este comando te mostrará qué archivos han cambiado.

## PASO 3: Comentar los Cambios
```bash
git add .
git commit -m "Fix: Corregir errores TypeScript en usePWA.ts y AdminCitas.tsx"
```

## PASO 4: Subir al Repositorio
```bash
git push origin main
```

## PASO 5: Verificar Deploy en Vercel
1. Ve a https://vercel.com/dashboard
2. Busca tu proyecto: "ugt-towa-portal-pwa-avanzada"
3. Haz clic en el proyecto
4. Verifica que el build se complete sin errores
5. Anota la nueva URL de deployment

## PASO 6: Probar la Aplicación
Abre la URL proporcionada por Vercel y verifica que:
- La página carga correctamente
- No hay errores en la consola
- Las funcionalidades principales funcionan

## ¿Qué hacer si hay errores?
Si encuentras algún problema durante estos pasos, envíame:
- Los mensajes de error específicos
- El paso donde se produjo el problema
- Capturas de pantalla si es necesario

¡Listo! Con estos pasos tu portal debería estar funcionando correctamente.