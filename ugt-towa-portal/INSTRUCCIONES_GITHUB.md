# Instrucciones para Subir el Código a GitHub

## Estado del Repositorio Git

El repositorio Git local ha sido inicializado y todos los cambios han sido commiteados exitosamente.

**Commit realizado:**
```
feat: Sistema de encuestas diferenciadas y correcciones de navegación
- 104 archivos agregados
- 27,311 líneas de código
- Hash del commit: 8f21514
```

## Pasos para Conectar con GitHub

### Opción 1: Si ya tienes un repositorio GitHub creado

1. Abre tu terminal en el directorio del proyecto:
   ```bash
   cd /workspace/ugt-towa-portal
   ```

2. Agrega el repositorio remoto de GitHub:
   ```bash
   git remote add origin https://github.com/TU_USUARIO/TU_REPOSITORIO.git
   ```

3. Haz push de los cambios:
   ```bash
   git push -u origin master
   ```

### Opción 2: Si necesitas crear un nuevo repositorio en GitHub

1. Ve a https://github.com y crea un nuevo repositorio
2. **NO** inicialices con README, .gitignore o licencia (ya los tenemos)
3. Copia la URL del repositorio (ejemplo: https://github.com/usuario/ugt-towa-portal.git)
4. En tu terminal, ejecuta:
   ```bash
   cd /workspace/ugt-towa-portal
   git remote add origin TU_URL_DE_GITHUB
   git push -u origin master
   ```

### Opción 3: Si prefieres usar SSH

1. Configura tus claves SSH en GitHub
2. Agrega el remoto con SSH:
   ```bash
   git remote add origin git@github.com:TU_USUARIO/TU_REPOSITORIO.git
   git push -u origin master
   ```

## Cambios Incluidos en el Commit

### Sistema de Encuestas Diferenciadas
- Campo 'tipo' agregado a tabla surveys ('publica' o 'afiliados')
- Página EncuestasAfiliadosPage.tsx creada para encuestas exclusivas
- Filtrado correcto por tipo en todas las páginas
- Sistema de votación funcionando para ambos tipos

### Correcciones de Navegación
- Redirección automática de /afiliados a /afiliados/dashboard
- Menú lateral con todos los enlaces visibles desde el inicio
- Integración consistente en todas las páginas de afiliados

### Análisis de Encuestas Corregido
- Lógica de conteo de votos arreglada
- Gráficos mostrando datos precisos
- Análisis funcionando sin errores

### Archivos Principales Modificados
- src/pages/admin/AdminEncuestas.tsx
- src/pages/admin/AdminEncuestasAnalisis.tsx
- src/pages/HomePage.tsx
- src/pages/EncuestasPage.tsx
- src/pages/affiliates/AffiliateDashboard.tsx
- src/pages/affiliates/BibliotecaPage.tsx
- src/pages/affiliates/BeneficiosPage.tsx
- src/App.tsx
- src/lib/supabase.ts

### Archivos Nuevos Creados
- src/pages/affiliates/EncuestasAfiliadosPage.tsx (204 líneas)

## Verificación del Estado

Para verificar que todo está listo para GitHub, ejecuta:

```bash
cd /workspace/ugt-towa-portal
git status
git log --oneline -n 5
git remote -v
```

## URL de Producción Actual

El portal está desplegado y funcionando en:
**https://zckoybr0khsn.space.minimax.io**

## Próximos Pasos

1. Configura el remoto de GitHub según las instrucciones anteriores
2. Haz push de los cambios
3. Verifica que todos los archivos están en GitHub
4. Configura GitHub Pages o Vercel si deseas despliegue automático

## Soporte

Si encuentras problemas al conectar con GitHub:
- Verifica tus credenciales de GitHub
- Asegúrate de tener permisos de escritura en el repositorio
- Considera usar un Personal Access Token si usas HTTPS

---
**Fecha del commit:** 2025-11-14
**Estado:** Listo para push a GitHub
