# API-tester
# 🔍 API Discovery & Testing Lab

Un repositorio completo para detectar y probar APIs en aplicaciones web y móviles de forma sistemática.

## 📁 Estructura del Repositorio

```
api-discovery-lab/
├── README.md
├── docs/
│   ├── methodology.md
│   ├── common-patterns.md
│   └── legal-considerations.md
├── scripts/
│   ├── network-analyzer.js
│   ├── subdomain-finder.py
│   ├── endpoint-scanner.py
│   └── api-response-analyzer.py
├── tools/
│   ├── browser-extension/
│   │   ├── manifest.json
│   │   ├── popup.html
│   │   └── content-script.js
│   └── bookmarklets/
│       ├── api-detector.js
│       └── network-inspector.js
├── templates/
│   ├── test-cases.md
│   ├── api-documentation-template.md
│   └── vulnerability-report-template.md
├── examples/
│   ├── github-api-test.js
│   ├── twitter-api-analysis.py
│   └── public-apis-examples/
└── results/
    ├── findings-template.json
    └── screenshots/
```

## 🚀 Inicio Rápido

### Configuración del Entorno

```bash
# Clonar el repositorio
git clone https://github.com/fmonfasani/api-discovery-lab.git
cd api-discovery-lab

# Instalar dependencias de Python
pip install -r requirements.txt

# Instalar dependencias de Node.js
npm install
```

### Primer Análisis

```bash
# Analizar una aplicación web básica
python scripts/endpoint-scanner.py --url https://ejemplo.com

# Usar el analizador de red interactivo
node scripts/network-analyzer.js
```

## 🛠️ Herramientas Incluidas

### 1. Network Analyzer (JavaScript)
Herramienta que se ejecuta en el navegador para interceptar y analizar peticiones de red en tiempo real.

**Características:**
- Detección automática de endpoints de API
- Identificación de patrones REST y GraphQL
- Exportación de resultados en JSON
- Análisis de headers y autenticación

### 2. Subdomain Finder (Python)
Script para descubrir subdominios que podrían alojar APIs.

**Uso:**
```bash
python scripts/subdomain-finder.py --domain ejemplo.com --wordlist common-subdomains.txt
```

### 3. Endpoint Scanner (Python)
Escáner inteligente que busca endpoints comunes de API usando diccionarios personalizables.

**Características:**
- Diccionarios actualizables de endpoints comunes
- Detección de métodos HTTP permitidos
- Análisis de códigos de respuesta
- Identificación de tecnologías backend

### 4. API Response Analyzer (Python)
Analizador profundo de respuestas de API para entender estructura y funcionalidad.

**Funcionalidades:**
- Parseo automático de JSON/XML
- Identificación de esquemas de datos
- Detección de parámetros sensibles
- Análisis de versionado de API

## 📋 Metodología de Testing

### Fase 1: Reconocimiento Pasivo
1. **Análisis de documentación oficial**
   - Buscar en `/developers`, `/api`, `/docs`
   - Revisar términos de servicio para menciones de API
   - Explorar subdominios conocidos

2. **Análisis de aplicaciones cliente**
   - Inspeccionar aplicaciones móviles
   - Revisar código fuente de aplicaciones web
   - Analizar bibliotecas y SDKs oficiales

### Fase 2: Descubrimiento Activo
1. **Interceptación de tráfico**
   - Uso de herramientas de desarrollador
   - Proxy tools como Burp Suite
   - Análisis de WebSocket connections

2. **Fuzzing de endpoints**
   - Diccionarios de endpoints comunes
   - Patrones de versionado (v1, v2, api/v1)
   - Extensiones comunes (.json, .xml, .api)

### Fase 3: Análisis y Documentación
1. **Mapeo de funcionalidades**
   - Catalogar endpoints descubiertos
   - Identificar métodos HTTP soportados
   - Analizar parámetros requeridos/opcionales

2. **Testing de seguridad básico**
   - Verificar autenticación requerida
   - Probar rate limiting
   - Identificar información sensible expuesta

## 📖 Guías Detalladas

### Detección Manual Paso a Paso

#### Para Aplicaciones Web:
1. **Abrir Developer Tools** (F12 en la mayoría de navegadores)
2. **Navegar a la pestaña Network**
3. **Interactuar con la aplicación** realizando acciones como:
   - Hacer login/logout
   - Cargar contenido dinámico
   - Usar funciones de búsqueda
   - Cambiar configuraciones
4. **Filtrar por XHR/Fetch** para ver solo peticiones AJAX
5. **Analizar URLs** buscando patrones como:
   - `/api/v1/users`
   - `/rest/endpoint`
   - `/graphql`
   - Respuestas en formato JSON

#### Para Aplicaciones Móviles:
1. **Configurar proxy** (como Charles Proxy o mitmproxy)
2. **Conectar dispositivo móvil** al proxy
3. **Usar la aplicación normalmente**
4. **Analizar tráfico interceptado**

## 🔧 Scripts Útiles

### Bookmarklet para Detección Rápida
```javascript
javascript:(function(){
  const requests = [];
  const originalFetch = window.fetch;
  window.fetch = function(...args) {
    requests.push({url: args[0], timestamp: Date.now()});
    return originalFetch.apply(this, arguments);
  };
  setTimeout(() => {
    console.log('API Calls detected:', requests);
    alert(`Detected ${requests.length} API calls. Check console for details.`);
  }, 5000);
})();
```

### Script de Análisis de Headers
```python
import requests
import json

def analyze_api_headers(url):
    """Analiza headers de respuesta para identificar tecnologías de API"""
    try:
        response = requests.get(url)
        interesting_headers = {
            'server': response.headers.get('server'),
            'x-powered-by': response.headers.get('x-powered-by'),
            'content-type': response.headers.get('content-type'),
            'x-api-version': response.headers.get('x-api-version'),
            'x-ratelimit-limit': response.headers.get('x-ratelimit-limit')
        }
        return {k: v for k, v in interesting_headers.items() if v}
    except Exception as e:
        return {'error': str(e)}
```

## 📊 Plantillas de Documentación

### Template de Reporte de API Encontrada
```markdown
## API Discovery Report

**Target:** ejemplo.com
**Date:** 2024-XX-XX
**Methodology:** Automated + Manual

### Discovered Endpoints:
- `GET /api/v1/users` - User management
- `POST /api/v1/auth/login` - Authentication
- `GET /api/v1/posts` - Content retrieval

### Authentication Methods:
- Bearer Token
- API Key in header

### Rate Limiting:
- 100 requests per minute
- Header: X-RateLimit-Remaining

### Security Observations:
- HTTPS enforced
- CORS properly configured
- No sensitive data in GET parameters
```

## ⚖️ Consideraciones Legales y Éticas

### Antes de Empezar:
1. **Lee siempre los términos de servicio** del sitio web
2. **Respeta el robots.txt** y las políticas de rate limiting
3. **No hagas testing destructivo** sin autorización explícita
4. **Mantén la confidencialidad** de cualquier información sensible
5. **Reporta vulnerabilidades responsablemente** si las encuentras

### Buenas Prácticas:
- Usa delays entre peticiones para no sobrecargar servidores
- Documenta todo tu proceso para referencia futura
- Mantén un registro de qué has probado y qué no
- Comparte conocimientos de forma constructiva con la comunidad

## 🎯 Casos de Uso Prácticos

### Para Desarrolladores:
- Entender cómo funcionan APIs de servicios que quieres integrar
- Aprender patrones comunes de diseño de API
- Practicar análisis de tráfico de red

### Para Estudiantes de Seguridad:
- Aprender metodologías de reconocimiento
- Practicar análisis de aplicaciones web
- Entender vectores de ataque comunes en APIs

### Para Investigadores:
- Documentar APIs no oficiales para investigación académica
- Analizar patrones de comunicación en aplicaciones
- Estudiar implementaciones de diferentes tecnologías

## 📚 Recursos Adicionales

### Herramientas Recomendadas:
- **Burp Suite Community** - Proxy y análisis de tráfico
- **OWASP ZAP** - Scanner de seguridad gratuito
- **Postman** - Testing y documentación de APIs
- **Insomnia** - Cliente REST alternativo
- **mitmproxy** - Proxy de línea de comandos

### Listas de Palabras y Diccionarios:
- SecLists API endpoints
- Common API paths
- GraphQL introspection queries
- REST verb combinations

### Documentación de Referencia:
- OWASP API Security Top 10
- REST API Best Practices
- GraphQL Security Guidelines
- Rate Limiting Patterns

---

## 🤝 Contribuir

1. Fork el repositorio
2. Crea una rama para tu feature (`git checkout -b feature/nueva-herramienta`)
3. Commit tus cambios (`git commit -am 'Añadir nueva herramienta de análisis'`)
4. Push a la rama (`git push origin feature/nueva-herramienta`)
5. Crear un Pull Request

## 📄 Licencia

MIT License - ver archivo LICENSE para detalles

## ⚠️ Disclaimer

Este repositorio es solo para fines educativos y de investigación. Los usuarios son responsables de cumplir con todas las leyes aplicables y términos de servicio al usar estas herramientas.