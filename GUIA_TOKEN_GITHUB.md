# 🔐 Guía: Cómo Generar Token de GitHub

## Paso a Paso Completo:

### 1. **Ir a GitHub Settings**
- URL: https://github.com/settings/tokens
- O en GitHub.com: Tu foto de perfil → Settings → Developer settings → Personal access tokens → Tokens (classic)

### 2. **Crear Nuevo Token**
- Click: **"Generate new token"** → **"Generate new token (classic)"**

### 3. **Configurar Token**
```
Note: Actualización Portal UGT - Subida de archivos
Expiration: 90 days (recomendado)
```

### 4. **Seleccionar Permisos**
✅ Marcar solo: **`repo`** (Full control of private repositories)
- Esto incluye: repo, repo:status, repo_deployment, public_repo, admin:repo_hook

### 5. **Generar y Copiar**
- Click: **"Generate token"**
- **⚠️ IMPORTANTE:** Copiar el token inmediatamente
- El token se ve así: `ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

### 6. **Proporcionar Credenciales**
Para completar el push, enviar:

```
Usuario: jaumePR1988
Token: [TU_TOKEN_COMPLETO_AQUÍ]
```

---

## 🛡️ Información de Seguridad:

- **Este token solo te permite** hacer push a tus propios repositorios
- **NO me permite** acceder a otros repositorios ni cuentas
- **Expira automáticamente** según la fecha que seleccionaste
- **Puedes revocarlo** desde GitHub en cualquier momento
- **Limitado** solo a operaciones que requiere `repo` scope

---

## ⚡ **Alternativa Rápida:**

Si no quieres generar token, puedes usar la **Opción B**: Te paso el archivo corregido y tú lo subes manualmente desde GitHub.com o tu terminal local.

**¿Qué prefieres: Opción A (con token) o Opción B (manual)?**