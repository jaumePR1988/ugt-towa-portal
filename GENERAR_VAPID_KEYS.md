# 🔑 Generar VAPID Keys para Notificaciones Push

## 📝 Instrucciones Rápidas

### **Método 1: Online (Más Rápido)**

1. Ve a: https://vapid.keysgenerator.com/
2. Haz clic en "Generate VAPID Keys"
3. Copia las 2 claves generadas

### **Método 2: Con Node.js (Local)**

```bash
# Instalar web-push globalmente
npm install -g web-push

# Generar keys
web-push generate-vapid-keys

# Ejemplo de resultado:
# {
#   publicKey: "BEl62iUYgUivxIkv69yViEuiBIa40HI80NQDcdMhI0...",
#   privateKey: "w4rD3tZ4n8bY7cF5jH2kL9pQ1mN6sD4aV8bE5uR3tY6..."
# }
```

### **Método 3: Usar Claves de Prueba**

Si necesitas probar inmediatamente, puedes usar estas **claves de prueba temporales**:

```env
VITE_VAPID_PUBLIC_KEY=BEl62iUYgUivxIkv69yViEuiBIa40HI80NQDcdMhI0v5C5D5tV6C5bC9nJ6dS8vQ1lK9mN2pR6sF5tV3wL9hY6dJ8vS4pQ2mN8
```

⚠️ **IMPORTANTE**: Estas son claves de prueba. Para producción usa tus propias keys generadas.

## 🚀 Una vez que tengas tus keys:

1. Copia el `VAPID_PUBLIC_KEY`
2. Pégalo en Vercel: Settings > Environment Variables
3. Guarda y redeploy
4. ¡Listo!
