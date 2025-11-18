# SPA Routing Configuration

This file contains the routing configuration needed to properly deploy your React SPA (Single Page Application) on various hosting platforms.

## Files Added:

### 1. vercel.json (For Vercel deployments)
```json
{
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ]
}
```

### 2. public/_redirects (For Netlify and other platforms)
```
/*    /index.html   200
```

### 3. public/.htaccess (For Apache servers)
```
Options -MultiViews
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteRule ^ index.html [QSA,L]
```

## Why This is Needed:

React Router uses client-side routing, which means the browser URL changes but no server request is made. When someone visits a direct URL like `/galeria-eventos`, the server needs to:

1. **NOT** return a 404 error
2. **Instead**, serve the `index.html` file
3. Let JavaScript in the browser handle the routing

## How It Works:

1. User visits: `https://ugt.towa.cat/galeria-eventos`
2. Server sees this is not a file that exists
3. Server returns `index.html` instead of 404
4. React Router in the browser reads the URL `/galeria-eventos`
5. React Router shows the `GaleriaEventosPage` component
6. User sees the event gallery page correctly

## Supported Routes:

Your app now properly supports these direct URL visits:
- `/galeria-eventos` - Event gallery page
- `/login` - Login page
- `/register` - Registration page
- `/documentos` - Documents page
- `/comunicados` - Communications page
- `/citas` - Appointments page
- `/encuestas` - Surveys page
- `/quienes-somos` - About us page
- And all other routes defined in App.tsx

## Deployment Notes:

- **Vercel**: Uses `vercel.json`
- **Netlify**: Uses `_redirects` in public folder
- **Apache**: Uses `.htaccess` in public folder (gets copied to root)
- **Nginx**: Configure server block to serve index.html for all routes
- **GitHub Pages**: May need additional configuration

The combination of these files ensures your SPA works on most major hosting platforms.
