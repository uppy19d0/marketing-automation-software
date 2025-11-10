# Correcciones de Despliegue

## Error de Rate Limiting Resuelto

### Problema
```
ValidationError: The 'X-Forwarded-For' header is set but the Express 'trust proxy' setting is false
```

### Causa
Cuando la aplicación se despliega detrás de un proxy reverso (como Vercel, Netlify, AWS Lambda, etc.), estos servicios agregan el header `X-Forwarded-For` para identificar la IP real del cliente. Sin embargo, Express por defecto no confía en estos headers por razones de seguridad.

El middleware `express-rate-limit` necesita acceder a la IP real del cliente para funcionar correctamente, pero sin `trust proxy` habilitado, no puede hacerlo de forma segura.

### Solución Implementada

1. **Habilitado Trust Proxy en Express** (`server/src/server.ts`):
   ```typescript
   app.set('trust proxy', 1);
   ```
   
   Esto le dice a Express que confíe en el primer proxy en la cadena, lo cual es correcto para la mayoría de los servicios de hosting.

2. **Mejorada la configuración de Rate Limiting**:
   ```typescript
   const limiter = rateLimit({
     windowMs: 15 * 60 * 1000,
     max: 100,
     message: 'Too many requests from this IP, please try again later.',
     standardHeaders: true,
     legacyHeaders: false,
     skip: (req) => req.path === '/api/health',
   });
   ```

   - `standardHeaders: true` - Usa los headers estándar `RateLimit-*`
   - `legacyHeaders: false` - Desactiva headers legacy `X-RateLimit-*`
   - `skip` - Excluye health checks del rate limiting

### Configuración de Puerto

También se corrigió el puerto del API en el frontend:
- **Desarrollo**: `http://localhost:5000/api`
- **Producción**: `/api` (usa el mismo dominio)

## Notas de Seguridad

### Trust Proxy
El valor `1` significa que Express confiará en el primer proxy. Esto es seguro para:
- Vercel
- Netlify
- AWS Lambda + API Gateway
- Heroku
- DigitalOcean App Platform

Si tu aplicación está detrás de múltiples proxies, ajusta el valor según sea necesario.

### Rate Limiting
El rate limit actual es:
- **100 peticiones** por **15 minutos** por IP
- Los health checks están excluidos del límite

Puedes ajustar estos valores en `server/src/server.ts` según tus necesidades.

## Variables de Entorno Recomendadas

Para producción, asegúrate de configurar:

```env
NODE_ENV=production
PORT=5000
MONGODB_URI=tu_mongodb_uri_de_produccion
JWT_SECRET=un_secreto_muy_seguro_y_largo
JWT_EXPIRE=30d
CORS_ORIGIN=https://tu-dominio.com
```

## Testing

Para verificar que el rate limiting funciona correctamente:

1. **En desarrollo**:
   ```bash
   cd server
   npm run dev
   ```

2. **Hacer múltiples peticiones**:
   ```bash
   for i in {1..10}; do curl http://localhost:5000/api/health; done
   ```

3. **Verificar headers de respuesta**:
   ```bash
   curl -I http://localhost:5000/api/health
   ```
   
   Deberías ver headers como:
   ```
   RateLimit-Limit: 100
   RateLimit-Remaining: 99
   RateLimit-Reset: 1699999999
   ```

## Despliegue en Vercel

El proyecto está configurado para funcionar correctamente en Vercel con:
- Trust proxy habilitado
- Rate limiting funcional
- CORS configurado
- Seed automático de usuario admin

No se requiere configuración adicional más allá de las variables de entorno.
