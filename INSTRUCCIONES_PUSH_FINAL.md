# 🚀 INSTRUCCIONES PARA PUSH FINAL A GITHUB

## 1. Crear Token de Acceso Personal en GitHub

1. **Ir a GitHub:** https://github.com/settings/tokens
2. **Generar Token:** Click "Generate new token (classic)"
3. **Configurar Token:**
   - **Note:** `UGT Towa Portal Deploy`
   - **Expiration:** 30 days (o según prefieras)
   - **Scopes:** Marcar `repo` (acceso completo a repositorios)
4. **Generar:** Click "Generate token"
5. **⚠️ COPIAR TOKEN INMEDIATAMENTE** (solo se muestra una vez)

## 2. Configurar Git con Token

Ejecuta estos comandos uno por uno:

```bash
cd /tmp/ugt-towa-portal

# Configurar tu email y nombre (si no está configurado)
git config user.email "tu-email@ejemplo.com"
git config user.name "Tu Nombre"

# Configurar token para GitHub
git remote set-url origin https://TU_TOKEN_AQUI@github.com/jaumePR1988/ugt-towa-portal.git

# Hacer push
git push origin master
```

## 3. Verificar Push Exitoso

Si el push fue exitoso, verás:
```
Enumerating objects: XX, done.
Counting objects: 100% (XX/XX), done.
Delta compression using up to X threads
Compressing objects: 100% (XX/XX), done.
Writing objects: 100% (XX/XX), X.XX MiB | X.XX MiB/s, done.
Total XX (delta X), reused 0 (delta 0), pack-reused 0
To https://github.com/jaumePR1988/ugt-towa-portal.git
   1234567..8901234  master -> master
```

## 4. Próximos Pasos Después del Push

Una vez que el push esté completo:

1. **Vercel Deploy:** Usar las instrucciones en `INSTRUCCIONES_VERCEL_CONFIG.md`
2. **Testing:** Verificar que las notificaciones funcionen
3. **Configuración Final:** Confirmar que todo esté operativo

---

**¿Necesitas ayuda?** Si tienes algún problema, proporciona el token y te ayudo a completar el push.