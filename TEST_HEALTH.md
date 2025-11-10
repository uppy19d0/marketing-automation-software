# 🏥 Health Check - Guía de Pruebas

## Endpoints Disponibles

### 1. **Health Check Básico**
```
GET /api/health
```

Respuesta de ejemplo:
```json
{
  "success": true,
  "status": "healthy",
  "timestamp": "2024-11-10T20:05:00.000Z",
  "uptime": 3600,
  "environment": "production",
  "database": {
    "status": "connected",
    "connected": true
  },
  "memory": {
    "used": 45,
    "total": 128,
    "unit": "MB"
  },
  "version": "1.0.0"
}
```

### 2. **Health Check Detallado**
```
GET /api/health/detailed
```

Respuesta de ejemplo:
```json
{
  "success": true,
  "status": "healthy",
  "timestamp": "2024-11-10T20:05:00.000Z",
  "responseTime": "25ms",
  "uptime": {
    "seconds": 3600,
    "formatted": "1h 0m 0s"
  },
  "environment": "production",
  "database": {
    "status": "connected",
    "connected": true,
    "ping": "15ms",
    "error": null,
    "name": "marketing-automation",
    "host": "cluster0.zllumyj.mongodb.net"
  },
  "memory": {
    "heapUsed": "45 MB",
    "heapTotal": "128 MB",
    "rss": "150 MB",
    "external": "2 MB"
  },
  "cpu": {
    "user": 1234567,
    "system": 234567
  },
  "version": {
    "app": "1.0.0",
    "node": "v18.17.0",
    "platform": "linux"
  }
}
```

### 3. **Readiness Check** (para Kubernetes)
```
GET /api/health/ready
```

Respuesta de ejemplo:
```json
{
  "success": true,
  "ready": true,
  "timestamp": "2024-11-10T20:05:00.000Z"
}
```

### 4. **Liveness Check** (para Kubernetes)
```
GET /api/health/live
```

Respuesta de ejemplo:
```json
{
  "success": true,
  "alive": true,
  "timestamp": "2024-11-10T20:05:00.000Z"
}
```

---

## 🧪 Cómo Probar

### Opción 1: Usando cURL

#### Desarrollo Local (Backend corriendo en localhost:5000)

```bash
# Health check básico
curl http://localhost:5000/api/health

# Health check detallado
curl http://localhost:5000/api/health/detailed

# Readiness check
curl http://localhost:5000/api/health/ready

# Liveness check
curl http://localhost:5000/api/health/live
```

#### Producción (Vercel)

```bash
# Reemplaza 'tu-dominio' con tu URL de Vercel
BASE_URL="https://tu-dominio.vercel.app"

# Health check básico
curl $BASE_URL/api/health

# Health check detallado
curl $BASE_URL/api/health/detailed

# Con formato JSON bonito (requiere jq)
curl -s $BASE_URL/api/health | jq '.'
```

### Opción 2: Usando el Navegador

Simplemente abre estas URLs en tu navegador:

**Local:**
- http://localhost:5000/api/health
- http://localhost:5000/api/health/detailed
- http://localhost:5000/api/health/ready
- http://localhost:5000/api/health/live

**Producción:**
- https://tu-dominio.vercel.app/api/health
- https://tu-dominio.vercel.app/api/health/detailed
- https://tu-dominio.vercel.app/api/health/ready
- https://tu-dominio.vercel.app/api/health/live

### Opción 3: Usando Postman o Thunder Client

1. Crea una nueva request GET
2. URL: `http://localhost:5000/api/health` (o tu URL de producción)
3. Envía la request
4. Verifica que el status code sea 200
5. Revisa la respuesta JSON

### Opción 4: Usando JavaScript/Fetch

```javascript
// En la consola del navegador o en tu código
fetch('https://tu-dominio.vercel.app/api/health')
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error));
```

---

## 📊 Interpretación de Resultados

### ✅ Estado Saludable (Healthy)
```json
{
  "status": "healthy",
  "database": {
    "connected": true
  }
}
```
- HTTP Status: **200 OK**
- El servidor está funcionando correctamente
- MongoDB está conectado

### ❌ Estado No Saludable (Unhealthy)
```json
{
  "status": "unhealthy",
  "database": {
    "connected": false
  }
}
```
- HTTP Status: **503 Service Unavailable**
- Hay un problema con el servidor o la base de datos
- Revisa la conexión a MongoDB

---

## 🔍 Monitoreo Continuo

### Script de Monitoreo Bash

Crea un archivo `monitor-health.sh`:

```bash
#!/bin/bash

URL="https://tu-dominio.vercel.app/api/health"
INTERVAL=60  # segundos

while true; do
    RESPONSE=$(curl -s -w "\n%{http_code}" "$URL")
    HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
    TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')
    
    if [ "$HTTP_CODE" == "200" ]; then
        echo "[$TIMESTAMP] ✅ Healthy (200)"
    else
        echo "[$TIMESTAMP] ❌ Unhealthy ($HTTP_CODE)"
    fi
    
    sleep $INTERVAL
done
```

Ejecutar:
```bash
chmod +x monitor-health.sh
./monitor-health.sh
```

### Script de Monitoreo Node.js

Crea un archivo `monitor-health.js`:

```javascript
const https = require('https');

const URL = 'https://tu-dominio.vercel.app/api/health';
const INTERVAL = 60000; // 60 segundos

function checkHealth() {
    https.get(URL, (res) => {
        let data = '';
        
        res.on('data', (chunk) => {
            data += chunk;
        });
        
        res.on('end', () => {
            const timestamp = new Date().toISOString();
            const json = JSON.parse(data);
            
            if (res.statusCode === 200 && json.status === 'healthy') {
                console.log(`[${timestamp}] ✅ Healthy - DB: ${json.database.status}`);
            } else {
                console.log(`[${timestamp}] ❌ Unhealthy - Status: ${res.statusCode}`);
            }
        });
    }).on('error', (error) => {
        console.error(`[${new Date().toISOString()}] ❌ Error: ${error.message}`);
    });
}

// Check inmediato
checkHealth();

// Check periódico
setInterval(checkHealth, INTERVAL);

console.log(`🔍 Monitoring ${URL} every ${INTERVAL/1000} seconds...`);
```

Ejecutar:
```bash
node monitor-health.js
```

---

## 🚨 Alertas y Notificaciones

### Integración con Servicios de Monitoreo

#### UptimeRobot
1. Ve a [uptimerobot.com](https://uptimerobot.com)
2. Crea un nuevo monitor HTTP(s)
3. URL: `https://tu-dominio.vercel.app/api/health`
4. Intervalo: 5 minutos
5. Keyword to look for: `"healthy"`

#### Pingdom
1. Ve a [pingdom.com](https://pingdom.com)
2. Crea un nuevo Uptime Check
3. URL: `https://tu-dominio.vercel.app/api/health`
4. Check interval: 1 minuto

#### Better Uptime
1. Ve a [betteruptime.com](https://betteruptime.com)
2. Crea un nuevo monitor
3. URL: `https://tu-dominio.vercel.app/api/health`
4. Expected status code: 200

---

## 🐛 Troubleshooting

### Error: Connection Refused
```bash
curl: (7) Failed to connect to localhost port 5000: Connection refused
```

**Solución:**
```bash
# Asegúrate de que el backend esté corriendo
cd server
npm run dev
```

### Error: 503 Service Unavailable
```json
{
  "status": "unhealthy",
  "database": {
    "connected": false
  }
}
```

**Solución:**
1. Verifica la conexión a MongoDB Atlas
2. Confirma que la IP esté en la whitelist
3. Revisa las credenciales en `MONGODB_URI`

### Error: Timeout
```bash
curl: (28) Operation timed out
```

**Solución:**
1. Verifica que la URL sea correcta
2. Confirma que el servidor esté desplegado
3. Revisa los logs en Vercel Dashboard

---

## 📈 Métricas Importantes

### Tiempo de Respuesta
- **Bueno:** < 100ms
- **Aceptable:** 100-500ms
- **Lento:** > 500ms

### Uptime
- **Excelente:** > 99.9%
- **Bueno:** > 99%
- **Necesita atención:** < 99%

### Database Ping
- **Bueno:** < 50ms
- **Aceptable:** 50-200ms
- **Lento:** > 200ms

---

## ✅ Checklist de Verificación

Antes de considerar el sistema saludable, verifica:

- [ ] Health check básico responde 200 OK
- [ ] Status es "healthy"
- [ ] Database.connected es true
- [ ] Database ping es < 200ms
- [ ] Memory usage es razonable (< 80%)
- [ ] No hay errores en los logs
- [ ] Uptime es > 0 (el servidor está corriendo)

---

## 🎯 Próximos Pasos

1. **Configura monitoreo automático** con UptimeRobot o similar
2. **Establece alertas** para cuando el health check falle
3. **Revisa regularmente** el endpoint `/api/health/detailed`
4. **Documenta** cualquier problema recurrente

---

¡Tu health check está listo para usar! 🎉
