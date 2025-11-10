@echo off
echo.
echo ==================================================
echo  🚀 ACTUALIZANDO PORTAL UGT-TOWA EN VERCEL
echo ==================================================
echo.

REM Verificar que estamos en la carpeta correcta
if not exist "package.json" (
    echo ❌ Error: No estamos en la carpeta del proyecto
    echo Por favor, ejecuta este script desde la carpeta ugt-towa-portal
    echo.
    pause
    exit /b 1
)

echo ✅ Proyecto encontrado
echo.
echo 🔄 Desplegando en Vercel...
echo.

REM Actualizar en Vercel
npx vercel --prod

echo.
echo ==================================================
echo  ✅ ¡PORTAL ACTUALIZADO!
echo  URL: https://ugt-towa.vercel.app
echo ==================================================
echo.
pause