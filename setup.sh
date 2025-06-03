#!/bin/bash

# API Discovery Lab - Setup Script
# Este script crea toda la estructura del proyecto y los archivos iniciales
# Versión: 1.0
# Autor: Tu nombre aquí

set -e  # Esto hace que el script se detenga si cualquier comando falla

# Colores para output más claro (esto mejora la experiencia de usuario)
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Función para mostrar mensajes con colores
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Función para crear directorios con feedback visual
create_directory() {
    local dir_path="$1"
    if [ ! -d "$dir_path" ]; then
        mkdir -p "$dir_path"
        print_success "Directorio creado: $dir_path"
    else
        print_warning "Directorio ya existe: $dir_path"
    fi
}

# Banner de bienvenida
echo -e "${BLUE}"
cat << "EOF"
 █████╗ ██████╗ ██╗    ██████╗ ██╗███████╗ ██████╗ ██████╗ ██╗   ██╗███████╗██████╗ ██╗   ██╗
██╔══██╗██╔══██╗██║    ██╔══██╗██║██╔════╝██╔════╝██╔═══██╗██║   ██║██╔════╝██╔══██╗╚██╗ ██╔╝
███████║██████╔╝██║    ██║  ██║██║███████╗██║     ██║   ██║██║   ██║█████╗  ██████╔╝ ╚████╔╝ 
██╔══██║██╔═══╝ ██║    ██║  ██║██║╚════██║██║     ██║   ██║╚██╗ ██╔╝██╔══╝  ██╔══██╗  ╚██╔╝  
██║  ██║██║     ██║    ██████╔╝██║███████║╚██████╗╚██████╔╝ ╚████╔╝ ███████╗██║  ██║   ██║   
╚═╝  ╚═╝╚═╝     ╚═╝    ╚═════╝ ╚═╝╚══════╝ ╚═════╝ ╚═════╝   ╚═══╝  ╚══════╝╚═╝  ╚═╝   ╚═╝   
                                    LAB SETUP SCRIPT
EOF
echo -e "${NC}"

print_status "Iniciando configuración del API Discovery Lab..."

# Verificar si estamos en el directorio correcto o crear uno nuevo
PROJECT_NAME="api-discovery-lab"
if [ ! -d "$PROJECT_NAME" ]; then
    print_status "Creando directorio del proyecto: $PROJECT_NAME"
    mkdir "$PROJECT_NAME"
    cd "$PROJECT_NAME"
else
    print_warning "El directorio $PROJECT_NAME ya existe. Continuando con la configuración..."
    cd "$PROJECT_NAME"
fi

# Crear estructura de directorios
print_status "Creando estructura de directorios..."

# Directorios principales
create_directory "scripts"
create_directory "tools/browser-extension"
create_directory "tools/bookmarklets"
create_directory "templates"
create_directory "examples"
create_directory "results"
create_directory "docs"
create_directory "config"
create_directory "logs"
create_directory "wordlists"

# Crear archivo .gitignore
print_status "Creando .gitignore..."
cat > .gitignore << 'EOF'
# Logs y archivos temporales
*.log
logs/
temp/
*.tmp

# Archivos de configuración con datos sensibles
config/*.env
config/secrets.json
*.key
*.pem

# Resultados de scans (pueden contener información sensible)
results/*.json
results/*.xml
results/screenshots/
!results/README.md

# Archivos de Python
__pycache__/
*.py[cod]
*$py.class
*.so
.Python
env/
venv/
ENV/

# Node.js
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Sistema operativo
.DS_Store
Thumbs.db

# IDEs
.vscode/
.idea/
*.swp
*.swo

# Datos de prueba
test-data/
EOF

# Crear requirements.txt para Python
print_status "Creando requirements.txt..."
cat > requirements.txt << 'EOF'
# Librerías para análisis de red y HTTP
requests>=2.28.0
urllib3>=1.26.0
httpx>=0.24.0

# Para parsing y análisis de datos
beautifulsoup4>=4.11.0
lxml>=4.9.0
xmltodict>=0.13.0

# Para trabajar con JSON y datos estructurados
jsonschema>=4.17.0
pyyaml>=6.0

# Para análisis de subdominios y DNS
dnspython>=2.3.0
python-whois>=0.7.0

# Para análisis de certificados SSL
cryptography>=40.0.0
pyopenssl>=23.0.0

# Para colores en terminal y mejor UX
colorama>=0.4.6
rich>=13.0.0
click>=8.1.0

# Para concurrencia y threading
asyncio-throttle>=1.0.0
aiohttp>=3.8.0

# Para análisis de headers y user agents
fake-useragent>=1.4.0
user-agents>=2.2.0

# Para exportar resultados
openpyxl>=3.0.0
pandas>=1.5.0
EOF

# Crear package.json para Node.js
print_status "Creando package.json..."
cat > package.json << 'EOF'
{
    "name": "api-discovery-lab",
    "version": "1.0.0",
    "description": "Herramientas para descubrir y analizar APIs en aplicaciones web",
    "main": "scripts/network-analyzer.js",
    "scripts": {
        "start": "node scripts/network-analyzer.js",
        "test": "echo \"Error: no test specified\" && exit 1",
        "setup": "./setup.sh",
        "scan": "python scripts/endpoint-scanner.py",
        "analyze": "node scripts/network-analyzer.js"
    },
    "keywords": [
        "api",
        "security",
        "pentesting",
        "web-analysis",
        "network-analysis"
    ],
    "author": "Tu nombre",
    "license": "MIT",
    "dependencies": {
        "axios": "^1.4.0",
        "cheerio": "^1.0.0-rc.12",
        "commander": "^11.0.0",
        "colors": "^1.4.0",
        "fs-extra": "^11.1.0",
        "puppeteer": "^20.0.0",
        "ws": "^8.13.0"
    },
    "devDependencies": {
        "eslint": "^8.40.0",
        "prettier": "^2.8.8"
    }
}
EOF

# Crear README inicial
print_status "Creando README.md inicial..."
cat > README.md << 'EOF'
# 🔍 API Discovery Lab

Un laboratorio completo para aprender a descubrir y analizar APIs en aplicaciones web.

## 🚀 Inicio Rápido

```bash
# Ejecutar script de configuración
./setup.sh

# Instalar dependencias
npm install
pip install -r requirements.txt

# Ejecutar primer análisis
npm run analyze
```

## 📁 Estructura

- `scripts/` - Herramientas principales de análisis
- `tools/` - Utilidades adicionales y extensiones
- `examples/` - Ejemplos prácticos de uso
- `docs/` - Documentación detallada
- `results/` - Resultados de análisis (git-ignored)

## ⚠️ Uso Responsable

Este proyecto es solo para fines educativos. Siempre respeta los términos de servicio y las políticas de las aplicaciones que analices.
EOF

print_status "Configuración básica completada. Ahora vamos a crear el Network Analyzer..."

# Ahora vamos a crear el Network Analyzer paso a paso
print_status "Creando Network Analyzer (JavaScript)..."

# Este es el corazón de nuestro sistema de análisis
cat > scripts/network-analyzer.js << 'EOF'
#!/usr/bin/env node

/**
 * Network Analyzer - API Discovery Lab
 * 
 * Este script funciona como un interceptor de tráfico de red que puede
 * analizar patrones de comunicación en aplicaciones web.
 * 
 * Métodos de análisis:
 * 1. Análisis estático de código fuente
 * 2. Interceptación de peticiones usando Puppeteer
 * 3. Análisis de patrones comunes de API
 * 4. Generación de reportes estructurados
 */

const puppeteer = require('puppeteer');
const fs = require('fs-extra');
const path = require('path');
const { program } = require('commander');
const colors = require('colors');

// Configuración del programa de línea de comandos
program
    .version('1.0.0')
    .description('Analizador de tráfico de red para descubrimiento de APIs')
    .option('-u, --url <url>', 'URL objetivo para análizar')
    .option('-t, --time <seconds>', 'Tiempo de análisis en segundos', '30')
    .option('-o, --output <file>', 'Archivo de salida para resultados')
    .option('-v, --verbose', 'Modo verbose para debugging')
    .option('--headless', 'Ejecutar en modo headless (sin interfaz gráfica)', true)
    .parse();

const options = program.opts();

/**
 * Clase principal para el análisis de red
 * Esta clase encapsula toda la lógica de interceptación y análisis
 */
class NetworkAnalyzer {
    constructor(config = {}) {
        this.config = {
            timeout: parseInt(config.time) * 1000 || 30000,
            verbose: config.verbose || false,
            headless: config.headless !== false,
            ...config
        };
        
        // Aquí almacenaremos todas las peticiones interceptadas
        this.interceptedRequests = [];
        this.apiPatterns = [];
        this.analysisResults = {
            totalRequests: 0,
            apiEndpoints: [],
            technologies: new Set(),
            authMethods: new Set(),
            dataFormats: new Set(),
            httpMethods: new Set()
        };
    }

    /**
     * Método principal que orquesta todo el análisis
     */
    async analyze(targetUrl) {
        console.log('🚀 Iniciando análisis de red...'.blue.bold);
        console.log(`📍 Objetivo: ${targetUrl}`.cyan);
        console.log(`⏱️  Duración: ${this.config.timeout / 1000} segundos\n`.cyan);

        const browser = await this.launchBrowser();
        const page = await this.setupPage(browser);

        try {
            // Configurar interceptación de peticiones
            await this.setupNetworkInterception(page);
            
            // Navegar a la página objetivo
            await page.goto(targetUrl, { 
                waitUntil: 'networkidle2',
                timeout: 60000 
            });

            // Simular interacción con la página para generar tráfico
            await this.simulateUserInteraction(page);

            // Esperar el tiempo configurado para capturar más tráfico
            console.log('📡 Capturando tráfico de red...'.yellow);
            await this.waitAndCapture();

            // Analizar las peticiones capturadas
            await this.analyzeInterceptedRequests();

            // Generar reporte
            const report = await this.generateReport(targetUrl);
            
            return report;

        } finally {
            await browser.close();
        }
    }

    /**
     * Configura el navegador con las opciones necesarias
     */
    async launchBrowser() {
        if (this.config.verbose) {
            console.log('🌐 Lanzando navegador...'.gray);
        }

        return await puppeteer.launch({
            headless: this.config.headless,
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--disable-accelerated-2d-canvas',
                '--no-first-run',
                '--no-zygote',
                '--disable-gpu'
            ]
        });
    }

    /**
     * Configura la página con user agent y otras opciones
     */
    async setupPage(browser) {
        const page = await browser.newPage();
        
        // Configurar user agent realista
        await page.setUserAgent(
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        );

        // Configurar viewport para simular dispositivo real
        await page.setViewport({ width: 1366, height: 768 });

        return page;
    }

    /**
     * Esta es la función más importante: configura la interceptación de red
     * Aquí es donde "escuchamos" todas las peticiones que hace la aplicación
     */
    async setupNetworkInterception(page) {
        await page.setRequestInterception(true);

        // Interceptar todas las peticiones
        page.on('request', (request) => {
            // Permitir que la petición continúe normalmente
            request.continue();
            
            // Pero también la registramos para análisis
            this.recordRequest(request);
        });

        // Interceptar todas las respuestas
        page.on('response', (response) => {
            this.recordResponse(response);
        });

        if (this.config.verbose) {
            console.log('🕸️  Interceptación de red configurada'.gray);
        }
    }

    /**
     * Registra cada petición para análisis posterior
     */
    recordRequest(request) {
        const requestData = {
            url: request.url(),
            method: request.method(),
            headers: request.headers(),
            postData: request.postData(),
            timestamp: Date.now(),
            type: 'request'
        };

        this.interceptedRequests.push(requestData);
        
        if (this.config.verbose) {
            console.log(`📤 ${request.method()} ${request.url()}`.gray);
        }
    }

    /**
     * Registra cada respuesta para análisis posterior
     */
    recordResponse(response) {
        const responseData = {
            url: response.url(),
            status: response.status(),
            headers: response.headers(),
            timestamp: Date.now(),
            type: 'response'
        };

        this.interceptedRequests.push(responseData);
        
        if (this.config.verbose) {
            console.log(`📥 ${response.status()} ${response.url()}`.gray);
        }
    }

    /**
     * Simula interacción del usuario para provocar más peticiones de API
     * Esto es crucial porque muchas APIs solo se activan con interacción
     */
    async simulateUserInteraction(page) {
        console.log('🤖 Simulando interacción de usuario...'.yellow);

        try {
            // Hacer scroll para cargar contenido lazy-loaded
            await page.evaluate(() => {
                window.scrollTo(0, document.body.scrollHeight / 2);
            });
            await page.waitForTimeout(2000);

            // Buscar y hacer clic en botones comunes
            const commonSelectors = [
                'button[type="submit"]',
                '.btn',
                '.button',
                '[role="button"]',
                'a[href*="api"]',
                'input[type="search"]'
            ];

            for (const selector of commonSelectors) {
                try {
                    await page.click(selector);
                    await page.waitForTimeout(1000);
                    if (this.config.verbose) {
                        console.log(`✅ Clic en: ${selector}`.gray);
                    }
                } catch (e) {
                    // Ignorar errores de elementos no encontrados
                }
            }

            // Simular búsquedas si hay campos de búsqueda
            try {
                const searchInput = await page.$('input[type="search"], input[placeholder*="search"], .search-input');
                if (searchInput) {
                    await searchInput.type('test');
                    await page.keyboard.press('Enter');
                    await page.waitForTimeout(2000);
                    console.log('🔍 Búsqueda simulada realizada'.gray);
                }
            } catch (e) {
                // Ignorar si no hay campo de búsqueda
            }

        } catch (error) {
            if (this.config.verbose) {
                console.log(`⚠️  Error en simulación: ${error.message}`.yellow);
            }
        }
    }

    /**
     * Espera y continúa capturando tráfico
     */
    async waitAndCapture() {
        return new Promise((resolve) => {
            setTimeout(() => {
                console.log('✅ Captura de tráfico completada\n'.green);
                resolve();
            }, this.config.timeout);
        });
    }

    /**
     * Analiza todas las peticiones interceptadas para identificar APIs
     * Este es el cerebro del sistema - aquí identificamos patrones
     */
    async analyzeInterceptedRequests() {
        console.log('🧠 Analizando peticiones interceptadas...'.blue);

        // Filtrar solo peticiones que parecen ser APIs
        const apiRequests = this.interceptedRequests.filter(req => 
            req.type === 'request' && this.looksLikeAPI(req.url)
        );

        console.log(`📊 Total de peticiones: ${this.interceptedRequests.length}`);
        console.log(`🎯 Peticiones de API detectadas: ${apiRequests.length}\n`);

        this.analysisResults.totalRequests = this.interceptedRequests.length;

        // Analizar cada petición de API
        for (const request of apiRequests) {
            this.analyzeAPIRequest(request);
        }

        // Mostrar resultados preliminares
        this.displayPreliminaryResults();
    }

    /**
     * Determina si una URL parece ser una API basándose en patrones comunes
     */
    looksLikeAPI(url) {
        const apiPatterns = [
            /\/api\//i,
            /\/v\d+\//,
            /\.json($|\?)/,
            /\/rest\//i,
            /\/graphql/i,
            /\/endpoint/i,
            /\/service/i,
            /\/data\//i,
            /\/ajax\//i
        ];

        return apiPatterns.some(pattern => pattern.test(url));
    }

    /**
     * Analiza una petición específica de API
     */
    analyzeAPIRequest(request) {
        const endpoint = {
            url: request.url,
            method: request.method,
            headers: request.headers,
            timestamp: request.timestamp,
            analysis: {}
        };

        // Detectar tecnologías basándose en headers
        this.detectTechnologies(request.headers);
        
        // Detectar métodos de autenticación
        this.detectAuthMethods(request.headers);
        
        // Detectar formatos de datos
        this.detectDataFormats(request.headers);
        
        // Registrar método HTTP
        this.analysisResults.httpMethods.add(request.method);

        // Analizar estructura de la URL
        endpoint.analysis = this.analyzeURLStructure(request.url);

        this.analysisResults.apiEndpoints.push(endpoint);
    }

    /**
     * Detecta tecnologías basándose en headers HTTP
     */
    detectTechnologies(headers) {
        const techIndicators = {
            'x-powered-by': (value) => this.analysisResults.technologies.add(`X-Powered-By: ${value}`),
            'server': (value) => this.analysisResults.technologies.add(`Server: ${value}`),
            'x-aspnet-version': (value) => this.analysisResults.technologies.add('ASP.NET'),
            'x-generator': (value) => this.analysisResults.technologies.add(`Generator: ${value}`)
        };

        Object.entries(headers).forEach(([key, value]) => {
            const lowerKey = key.toLowerCase();
            if (techIndicators[lowerKey]) {
                techIndicators[lowerKey](value);
            }
        });
    }

    /**
     * Detecta métodos de autenticación
     */
    detectAuthMethods(headers) {
        const authIndicators = {
            'authorization': (value) => {
                if (value.startsWith('Bearer')) {
                    this.analysisResults.authMethods.add('Bearer Token');
                } else if (value.startsWith('Basic')) {
                    this.analysisResults.authMethods.add('Basic Auth');
                } else {
                    this.analysisResults.authMethods.add('Custom Authorization');
                }
            },
            'x-api-key': () => this.analysisResults.authMethods.add('API Key'),
            'cookie': () => this.analysisResults.authMethods.add('Session Cookie')
        };

        Object.entries(headers).forEach(([key, value]) => {
            const lowerKey = key.toLowerCase();
            if (authIndicators[lowerKey]) {
                authIndicators[lowerKey](value);
            }
        });
    }

    /**
     * Detecta formatos de datos
     */
    detectDataFormats(headers) {
        const contentType = headers['content-type'] || '';
        
        if (contentType.includes('application/json')) {
            this.analysisResults.dataFormats.add('JSON');
        } else if (contentType.includes('application/xml') || contentType.includes('text/xml')) {
            this.analysisResults.dataFormats.add('XML');
        } else if (contentType.includes('application/x-www-form-urlencoded')) {
            this.analysisResults.dataFormats.add('Form Data');
        } else if (contentType.includes('multipart/form-data')) {
            this.analysisResults.dataFormats.add('Multipart Form');
        }
    }

    /**
     * Analiza la estructura de la URL para entender patrones de API
     */
    analyzeURLStructure(url) {
        const analysis = {
            hasVersioning: /\/v\d+\//.test(url),
            restfulPattern: /\/(users|posts|comments|items|data)\/\d+/.test(url),
            hasAuthentication: /\/(auth|login|token)/.test(url),
            isPublicAPI: url.includes('/api/public/'),
            hasParameters: url.includes('?')
        };

        return analysis;
    }

    /**
     * Muestra resultados preliminares en la consola
     */
    displayPreliminaryResults() {
        console.log('📋 RESULTADOS PRELIMINARES'.green.bold);
        console.log('═'.repeat(50).gray);
        
        console.log(`🎯 APIs detectadas: ${this.analysisResults.apiEndpoints.length}`.cyan);
        console.log(`🔧 Tecnologías: ${Array.from(this.analysisResults.technologies).join(', ')}`.cyan);
        console.log(`🔐 Autenticación: ${Array.from(this.analysisResults.authMethods).join(', ')}`.cyan);
        console.log(`📄 Formatos: ${Array.from(this.analysisResults.dataFormats).join(', ')}`.cyan);
        console.log(`🌐 Métodos HTTP: ${Array.from(this.analysisResults.httpMethods).join(', ')}`.cyan);
        
        console.log('\n📍 ENDPOINTS DETECTADOS:'.yellow.bold);
        this.analysisResults.apiEndpoints.slice(0, 10).forEach((endpoint, index) => {
            console.log(`${index + 1}. ${endpoint.method.toUpperCase()} ${endpoint.url}`.white);
        });
        
        if (this.analysisResults.apiEndpoints.length > 10) {
            console.log(`... y ${this.analysisResults.apiEndpoints.length - 10} más\n`.gray);
        }
    }

    /**
     * Genera un reporte completo del análisis
     */
    async generateReport(targetUrl) {
        const report = {
            metadata: {
                target: targetUrl,
                timestamp: new Date().toISOString(),
                analysisVersion: '1.0.0',
                duration: this.config.timeout / 1000
            },
            summary: {
                totalRequests: this.analysisResults.totalRequests,
                apiEndpointsFound: this.analysisResults.apiEndpoints.length,
                technologiesDetected: Array.from(this.analysisResults.technologies),
                authMethodsDetected: Array.from(this.analysisResults.authMethods),
                dataFormatsDetected: Array.from(this.analysisResults.dataFormats),
                httpMethodsUsed: Array.from(this.analysisResults.httpMethods)
            },
            endpoints: this.analysisResults.apiEndpoints,
            recommendations: this.generateRecommendations()
        };

        // Guardar reporte si se especificó archivo de salida
        if (options.output) {
            await this.saveReport(report, options.output);
        }

        return report;
    }

    /**
     * Genera recomendaciones basadas en el análisis
     */
    generateRecommendations() {
        const recommendations = [];

        if (this.analysisResults.authMethods.size === 0) {
            recommendations.push({
                type: 'security',
                message: 'No se detectaron métodos de autenticación. Verificar si las APIs están protegidas.',
                priority: 'high'
            });
        }

        if (this.analysisResults.apiEndpoints.length > 20) {
            recommendations.push({
                type: 'performance',
                message: 'Se detectaron muchas llamadas a API. Considerar optimización o caching.',
                priority: 'medium'
            });
        }

        if (Array.from(this.analysisResults.technologies).some(tech => tech.includes('Server: Apache'))) {
            recommendations.push({
                type: 'security',
                message: 'Servidor Apache detectado. Verificar versión y configuración de seguridad.',
                priority: 'medium'
            });
        }

        return recommendations;
    }

    /**
     * Guarda el reporte en un archivo
     */
    async saveReport(report, filename) {
        const resultsDir = path.join(process.cwd(), 'results');
        await fs.ensureDir(resultsDir);
        
        const filepath = path.join(resultsDir, filename);
        await fs.writeJson(filepath, report, { spaces: 2 });
        
        console.log(`💾 Reporte guardado en: ${filepath}`.green);
    }
}

/**
 * Función principal que se ejecuta cuando se llama al script
 */
async function main() {
    try {
        if (!options.url) {
            console.error('❌ Error: URL objetivo requerida. Usa --url <URL>'.red);
            process.exit(1);
        }

        const analyzer = new NetworkAnalyzer(options);
        const report = await analyzer.analyze(options.url);

        console.log('\n🎉 ANÁLISIS COMPLETADO'.green.bold);
        console.log('═'.repeat(50).gray);
        console.log(`📊 Total de endpoints API encontrados: ${report.summary.apiEndpointsFound}`.cyan);
        console.log(`🔧 Tecnologías detectadas: ${report.summary.technologiesDetected.length}`.cyan);
        console.log(`⚠️  Recomendaciones de seguridad: ${report.recommendations.length}`.yellow);

        if (!options.output) {
            console.log('\n💡 Tip: Usa --output reporte.json para guardar los resultados'.blue);
        }

    } catch (error) {
        console.error(`❌ Error durante el análisis: ${error.message}`.red);
        if (options.verbose) {
            console.error(error.stack);
        }
        process.exit(1);
    }
}

// Ejecutar solo si este archivo se llama directamente
if (require.main === module) {
    main().catch(console.error);
}

// Exportar la clase para uso en otros módulos
module.exports = { NetworkAnalyzer };
EOF

# Hacer el script ejecutable
chmod +x scripts/network-analyzer.js

print_success "Network Analyzer creado exitosamente!"

# Crear archivo de configuración ejemplo
print_status "Creando archivo de configuración ejemplo..."
cat > config/analyzer-config.json << 'EOF'
{
    "defaultTimeout": 30,
    "userAgents": [
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
        "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36"
    ],
    "commonAPIPatterns": [
        "/api/",
        "/v1/",
        "/v2/",
        "/rest/",
        "/graphql",
        "/endpoint"
    ],
    "analysisSettings": {
        "maxConcurrentRequests": 10,
        "simulateUserInteraction": true,
        "captureScreenshots": false,
        "followRedirects": true,
        "ignoreCertificateErrors": true
    },
    "outputFormats": {
        "json": true,
        "csv": true,
        "html": false
    },
    "securityChecks": {
        "checkHttps": true,
        "analyzeHeaders": true,
        "detectAuth": true,
        "flagSensitiveData": true
    }
}
EOF

# Crear archivo de ejemplo para usar el Network Analyzer
print_status "Creando script de ejemplo de uso..."
cat > examples/basic-usage.sh << 'EOF'
#!/bin/bash

# Ejemplos básicos de uso del Network Analyzer

echo "🚀 Ejemplos de uso del API Discovery Lab"
echo "========================================"

echo ""
echo "1. Análisis básico de 30 segundos:"
echo "node scripts/network-analyzer.js --url https://jsonplaceholder.typicode.com"

echo ""
echo "2. Análisis extendido con salida guardada:"
echo "node scripts/network-analyzer.js --url https://httpbin.org --time 60 --output analysis-result.json"

echo ""
echo "3. Análisis verbose para debugging:"
echo "node scripts/network-analyzer.js --url https://reqres.in --verbose"

echo ""
echo "4. Análisis con interfaz gráfica (no headless):"
echo "node scripts/network-analyzer.js --url https://example.com --no-headless"

echo ""
echo "🔧 Para ejecutar alguno de estos ejemplos, copia y pega el comando en tu terminal"
EOF

chmod +x examples/basic-usage.sh

# Crear plantilla para documentar resultados
print_status "Creando plantilla de documentación..."
cat > templates/analysis-report-template.md << 'EOF'
# Reporte de Análisis de API

## Información General
- **Objetivo**: [URL analizada]
- **Fecha**: [Fecha del análisis]
- **Duración**: [Tiempo de análisis]
- **Analista**: [Tu nombre]

## Resumen Ejecutivo
- **Total de peticiones interceptadas**: [Número]
- **Endpoints de API identificados**: [Número]
- **Tecnologías detectadas**: [Lista]
- **Métodos de autenticación**: [Lista]

## Endpoints Descubiertos

### Autenticación
| Método | URL | Descripción | Autenticación |
|--------|-----|-------------|---------------|
| POST   | /api/auth/login | Login de usuario | No requerida |

### Gestión de Usuarios
| Método | URL | Descripción | Autenticación |
|--------|-----|-------------|---------------|
| GET    | /api/users | Listar usuarios | Bearer Token |
| POST   | /api/users | Crear usuario | Bearer Token |

## Análisis de Seguridad

### Fortalezas
- [ ] HTTPS implementado correctamente
- [ ] Autenticación requerida en endpoints sensibles
- [ ] Headers de seguridad presentes

### Debilidades Identificadas
- [ ] Información sensible en URLs
- [ ] Falta de rate limiting
- [ ] Headers de seguridad faltantes

## Recomendaciones

### Inmediatas (Alta Prioridad)
1. [Recomendación específica]
2. [Otra recomendación]

### A Mediano Plazo (Media Prioridad)
1. [Recomendación específica]
2. [Otra recomendación]

## Apéndices

### A. Logs Técnicos
```
[Incluir logs relevantes]
```

### B. Screenshots
[Incluir capturas de pantalla si es necesario]
EOF

# Crear archivo de configuración para wordlists
print_status "Creando wordlists para análisis..."
cat > wordlists/common-api-endpoints.txt << 'EOF'
# Endpoints comunes de API para fuzzing
# Usar con el endpoint scanner

# Autenticación
api/auth
api/login
api/token
api/oauth
auth/login
auth/token
login
token

# Usuarios
api/users
api/user
users
user
api/profile
profile
api/account
account

# Datos
api/data
api/posts
api/comments
api/items
data
posts
comments
items

# Configuración
api/config
api/settings
config
settings
api/admin
admin

# Versionado
api/v1
api/v2
api/v3
v1
v2
v3

# Formatos
api/json
api/xml
json
xml

# Servicios
api/service
api/services
service
services
api/endpoint
endpoint
EOF

cat > wordlists/common-subdomains.txt << 'EOF'
# Subdominios comunes que pueden contener APIs
api
developer
dev
developers
api-dev
api-test
test
staging
stage
beta
v1
v2
v3
rest
graphql
gateway
service
services
data
admin
internal
private
public
docs
documentation
EOF

# Crear los siguientes scripts del proyecto
print_status "Creando Subdomain Finder (Python)..."
cat > scripts/subdomain-finder.py << 'EOF'
#!/usr/bin/env python3
"""
Subdomain Finder - API Discovery Lab

Este script descubre subdominios que podrían contener APIs.
Usa múltiples técnicas: DNS bruteforce, certificate transparency, etc.
"""

import argparse
import asyncio
import aiohttp
import dns.resolver
import json
import sys
from datetime import datetime
from pathlib import Path
import ssl
import socket
from urllib.parse import urlparse
import concurrent.futures
from rich.console import Console
from rich.progress import Progress, TaskID
from rich.table import Table
import time

console = Console()

class SubdomainFinder:
    def __init__(self, domain, wordlist_path=None, timeout=5, max_workers=50):
        self.domain = domain
        self.timeout = timeout
        self.max_workers = max_workers
        self.found_subdomains = set()
        self.results = []
        
        # Cargar wordlist
        if wordlist_path:
            self.wordlist = self.load_wordlist(wordlist_path)
        else:
            self.wordlist = self.get_default_wordlist()
    
    def load_wordlist(self, path):
        """Carga wordlist desde archivo"""
        try:
            with open(path, 'r') as f:
                return [line.strip() for line in f if line.strip() and not line.startswith('#')]
        except FileNotFoundError:
            console.print(f"[red]Error: Wordlist no encontrada en {path}[/red]")
            return self.get_default_wordlist()
    
    def get_default_wordlist(self):
        """Wordlist por defecto si no se especifica archivo"""
        return [
            'api', 'developer', 'dev', 'developers', 'api-dev', 'api-test',
            'test', 'staging', 'stage', 'beta', 'v1', 'v2', 'v3',
            'rest', 'graphql', 'gateway', 'service', 'services', 'data',
            'admin', 'internal', 'private', 'public', 'docs', 'documentation',
            'mobile', 'app', 'api1', 'api2', 'auth', 'oauth', 'sso',
            'cdn', 'static', 'assets', 'media', 'upload', 'file', 'files'
        ]
    
    async def check_subdomain_dns(self, subdomain):
        """Verifica si un subdominio existe vía DNS"""
        full_domain = f"{subdomain}.{self.domain}"
        
        try:
            # Resolver DNS
            resolver = dns.resolver.Resolver()
            resolver.timeout = self.timeout
            
            # Intentar resolver A record
            try:
                answers = resolver.resolve(full_domain, 'A')
                ips = [str(answer) for answer in answers]
                return {
                    'subdomain': full_domain,
                    'ips': ips,
                    'status': 'active',
                    'method': 'dns'
                }
            except dns.resolver.NXDOMAIN:
                return None
            except dns.resolver.NoAnswer:
                # Intentar CNAME
                try:
                    answers = resolver.resolve(full_domain, 'CNAME')
                    cnames = [str(answer) for answer in answers]
                    return {
                        'subdomain': full_domain,
                        'cnames': cnames,
                        'status': 'cname',
                        'method': 'dns'
                    }
                except:
                    return None
                    
        except Exception as e:
            if "timeout" not in str(e).lower():
                console.print(f"[yellow]Error checking {full_domain}: {e}[/yellow]")
            return None
    
    async def check_subdomain_http(self, subdomain_info):
        """Verifica accesibilidad HTTP del subdominio"""
        if not subdomain_info:
            return None
            
        subdomain = subdomain_info['subdomain']
        
        async with aiohttp.ClientSession(
            timeout=aiohttp.ClientTimeout(total=self.timeout),
            connector=aiohttp.TCPConnector(ssl=False)
        ) as session:
            
            for protocol in ['https', 'http']:
                url = f"{protocol}://{subdomain}"
                
                try:
                    async with session.get(url) as response:
                        subdomain_info.update({
                            'url': url,
                            'http_status': response.status,
                            'server': response.headers.get('Server', 'Unknown'),
                            'content_type': response.headers.get('Content-Type', 'Unknown'),
                            'accessible': True,
                            'protocol': protocol
                        })
                        
                        # Verificar si parece una API
                        subdomain_info['likely_api'] = self.analyze_api_indicators(response.headers, url)
                        
                        return subdomain_info
                        
                except Exception:
                    continue
            
            # Si no se puede acceder por HTTP/HTTPS
            subdomain_info.update({
                'accessible': False,
                'likely_api': False
            })
            
            return subdomain_info
    
    def analyze_api_indicators(self, headers, url):
        """Analiza si un subdominio parece contener una API"""
        api_indicators = 0
        
        # Verificar content-type típicos de API
        content_type = headers.get('Content-Type', '').lower()
        if any(ct in content_type for ct in ['json', 'xml', 'api']):
            api_indicators += 2
        
        # Verificar headers típicos de API
        api_headers = ['x-api-version', 'x-ratelimit-limit', 'access-control-allow-origin']
        for header in api_headers:
            if header in [h.lower() for h in headers.keys()]:
                api_indicators += 1
        
        # Verificar URL patterns
        if any(pattern in url.lower() for pattern in ['api', 'rest', 'graphql', 'endpoint']):
            api_indicators += 1
        
        return api_indicators >= 2
    
    async def discover_subdomains(self):
        """Método principal para descubrir subdominios"""
        console.print(f"[blue]🔍 Iniciando búsqueda de subdominios para: {self.domain}[/blue]")
        console.print(f"[cyan]📝 Probando {len(self.wordlist)} subdominios...[/cyan]")
        
        # Progreso visual
        with Progress() as progress:
            task = progress.add_task("Buscando subdominios...", total=len(self.wordlist))
            
            # Crear tareas para verificación DNS
            semaphore = asyncio.Semaphore(self.max_workers)
            
            async def check_with_semaphore(subdomain):
                async with semaphore:
                    result = await self.check_subdomain_dns(subdomain)
                    progress.update(task, advance=1)
                    return result
            
            # Ejecutar búsqueda DNS en paralelo
            dns_tasks = [check_with_semaphore(sub) for sub in self.wordlist]
            dns_results = await asyncio.gather(*dns_tasks, return_exceptions=True)
            
            # Filtrar resultados válidos
            valid_subdomains = [r for r in dns_results if r and not isinstance(r, Exception)]
            
            console.print(f"[green]✅ {len(valid_subdomains)} subdominios encontrados vía DNS[/green]")
        
        # Verificar accesibilidad HTTP
        if valid_subdomains:
            console.print("[blue]🌐 Verificando accesibilidad HTTP...[/blue]")
            
            with Progress() as progress:
                task = progress.add_task("Verificando HTTP...", total=len(valid_subdomains))
                
                async def check_http_with_progress(subdomain_info):
                    result = await self.check_subdomain_http(subdomain_info)
                    progress.update(task, advance=1)
                    return result
                
                # Verificar HTTP en paralelo
                http_tasks = [check_http_with_progress(sub) for sub in valid_subdomains]
                self.results = await asyncio.gather(*http_tasks, return_exceptions=True)
                
                # Filtrar resultados válidos
                self.results = [r for r in self.results if r and not isinstance(r, Exception)]
        
        return self.results
    
    def display_results(self):
        """Muestra los resultados en una tabla bonita"""
        if not self.results:
            console.print("[red]❌ No se encontraron subdominios[/red]")
            return
        
        # Crear tabla
        table = Table(title=f"Subdominios encontrados para {self.domain}")
        table.add_column("Subdominio", style="cyan")
        table.add_column("IPs", style="green")
        table.add_column("HTTP Status", style="yellow")
        table.add_column("Server", style="blue")
        table.add_column("API Probable", style="red")
        table.add_column("URL", style="magenta")
        
        # Ordenar por probabilidad de API
        sorted_results = sorted(self.results, key=lambda x: x.get('likely_api', False), reverse=True)
        
        for result in sorted_results:
            ips = ', '.join(result.get('ips', result.get('cnames', ['N/A'])))
            status = str(result.get('http_status', 'N/A'))
            server = result.get('server', 'N/A')[:20]  # Truncar servidor
            api_likely = "🎯 SÍ" if result.get('likely_api', False) else "❌ No"
            url = result.get('url', 'N/A')
            
            table.add_row(
                result['subdomain'],
                ips,
                status,
                server,
                api_likely,
                url
            )
        
        console.print(table)
        
        # Resumen
        api_count = sum(1 for r in self.results if r.get('likely_api', False))
        accessible_count = sum(1 for r in self.results if r.get('accessible', False))
        
        console.print(f"\n[bold]📊 RESUMEN:[/bold]")
        console.print(f"• Total subdominios encontrados: {len(self.results)}")
        console.print(f"• Subdominios accesibles: {accessible_count}")
        console.print(f"• Probables APIs: {api_count}")
    
    def save_results(self, output_file):
        """Guarda los resultados en un archivo JSON"""
        if not self.results:
            console.print("[red]❌ No hay resultados para guardar[/red]")
            return
        
        # Crear directorio results si no existe
        results_dir = Path("results")
        results_dir.mkdir(exist_ok=True)
        
        output_path = results_dir / output_file
        
        report = {
            'target_domain': self.domain,
            'scan_date': datetime.now().isoformat(),
            'total_subdomains_tested': len(self.wordlist),
            'subdomains_found': len(self.results),
            'likely_apis': sum(1 for r in self.results if r.get('likely_api', False)),
            'results': self.results
        }
        
        try:
            with open(output_path, 'w') as f:
                json.dump(report, f, indent=2)
            console.print(f"[green]💾 Resultados guardados en: {output_path}[/green]")
        except Exception as e:
            console.print(f"[red]❌ Error guardando archivo: {e}[/red]")

async def main():
    parser = argparse.ArgumentParser(description='Descubrir subdominios que pueden contener APIs')
    parser.add_argument('--domain', '-d', required=True, help='Dominio objetivo (ej: example.com)')
    parser.add_argument('--wordlist', '-w', help='Archivo de wordlist personalizada')
    parser.add_argument('--timeout', '-t', type=int, default=5, help='Timeout en segundos (default: 5)')
    parser.add_argument('--workers', type=int, default=50, help='Número de workers concurrentes (default: 50)')
    parser.add_argument('--output', '-o', help='Archivo de salida para resultados JSON')
    parser.add_argument('--verbose', '-v', action='store_true', help='Modo verbose')
    
    args = parser.parse_args()
    
    # Validar dominio
    if not args.domain or '.' not in args.domain:
        console.print("[red]❌ Error: Proporciona un dominio válido (ej: example.com)[/red]")
        sys.exit(1)
    
    # Crear finder
    finder = SubdomainFinder(
        domain=args.domain,
        wordlist_path=args.wordlist,
        timeout=args.timeout,
        max_workers=args.workers
    )
    
    start_time = time.time()
    
    try:
        # Descubrir subdominios
        results = await finder.discover_subdomains()
        
        # Mostrar resultados
        finder.display_results()
        
        # Guardar si se especifica archivo
        if args.output:
            finder.save_results(args.output)
        
        # Estadísticas finales
        elapsed_time = time.time() - start_time
        console.print(f"\n[green]✅ Análisis completado en {elapsed_time:.2f} segundos[/green]")
        
    except KeyboardInterrupt:
        console.print("\n[yellow]⚠️ Análisis interrumpido por el usuario[/yellow]")
    except Exception as e:
        console.print(f"[red]❌ Error durante el análisis: {e}[/red]")
        if args.verbose:
            import traceback
            traceback.print_exc()

if __name__ == "__main__":
    # Configurar loop para Windows
    if sys.platform == 'win32':
        asyncio.set_event_loop_policy(asyncio.WindowsProactorEventLoopPolicy())
    
    asyncio.run(main())
EOF

chmod +x scripts/subdomain-finder.py

print_success "Subdomain Finder creado exitosamente!"

# Finalizar el script
print_status "Creando script de instalación final..."
cat >> setup.sh << 'EOF'

# Instalar dependencias de Node.js
if command -v npm &> /dev/null; then
    print_status "Instalando dependencias de Node.js..."
    npm install
    print_success "Dependencias de Node.js instaladas"
else
    print_warning "npm no encontrado. Instala Node.js para usar todas las funcionalidades"
fi

# Instalar dependencias de Python
if command -v pip3 &> /dev/null; then
    print_status "Instalando dependencias de Python..."
    pip3 install -r requirements.txt
    print_success "Dependencias de Python instaladas"
elif command -v pip &> /dev/null; then
    print_status "Instalando dependencias de Python..."
    pip install -r requirements.txt
    print_success "Dependencias de Python instaladas"
else
    print_warning "pip no encontrado. Instala Python 3 y pip para usar todas las funcionalidades"
fi

# Crear README final con instrucciones de uso
cat > USAGE.md << 'EOF_USAGE'
# 🚀 Guía de Uso - API Discovery Lab

## Comandos Principales

### Network Analyzer (JavaScript)
```bash
# Análisis básico
node scripts/network-analyzer.js --url https://example.com

# Análisis extendido con guardado
node scripts/network-analyzer.js --url https://api.github.com --time 60 --output github-analysis.json --verbose

# Análisis con interfaz gráfica
node scripts/network-analyzer.js --url https://httpbin.org --no-headless
```

### Subdomain Finder (Python)
```bash
# Búsqueda básica
python3 scripts/subdomain-finder.py --domain example.com

# Búsqueda con wordlist personalizada
python3 scripts/subdomain-finder.py --domain github.com --wordlist wordlists/common-subdomains.txt --output github-subdomains.json

# Búsqueda rápida con menos workers
python3 scripts/subdomain-finder.py --domain example.com --workers 20 --timeout 3
```

## Flujo de Trabajo Recomendado

1. **Reconocimiento inicial**: Usar subdomain finder para mapear la superficie de ataque
2. **Análisis de tráfico**: Usar network analyzer en subdominios interesantes
3. **Documentación**: Usar las plantillas para documentar hallazgos
4. **Verificación**: Confirmar APIs encontradas manualmente

## Ejemplos Prácticos

### Analizar una API Pública
```bash
# Analizar JSONPlaceholder (API de prueba)
node scripts/network-analyzer.js --url https://jsonplaceholder.typicode.com --time 30 --output jsonplaceholder.json
```

### Buscar APIs de GitHub
```bash
# Buscar subdominios de GitHub
python3 scripts/subdomain-finder.py --domain github.com --output github-subdomains.json

# Analizar api.github.com específicamente
node scripts/network-analyzer.js --url https://api.github.com --verbose
```

## Interpretación de Resultados

### Network Analyzer
- **apiEndpointsFound**: Número de endpoints de API detectados
- **technologiesDetected**: Tecnologías backend identificadas
- **authMethodsDetected**: Métodos de autenticación en uso
- **recommendations**: Sugerencias de seguridad automáticas

### Subdomain Finder
- **likely_api**: Subdominios con alta probabilidad de contener APIs
- **accessible**: Subdominios que responden a HTTP/HTTPS
- **http_status**: Código de respuesta HTTP

## Consejos de Seguridad

1. **Siempre respeta robots.txt**
2. **No hagas demasiadas peticiones simultáneas**
3. **Usa delays entre peticiones en producción**
4. **Documenta todo lo que encuentres**
5. **Reporta vulnerabilidades responsablemente**
EOF_USAGE

print_success "Documentación de uso creada!"

# Mensaje final
echo ""
echo -e "${GREEN}🎉 ¡CONFIGURACIÓN COMPLETADA EXITOSAMENTE! 🎉${NC}"
echo ""
echo -e "${BLUE}📁 Estructura del proyecto creada:${NC}"
echo -e "  • scripts/           - Herramientas principales"
echo -e "  • tools/            - Utilidades adicionales"
echo -e "  • examples/         - Ejemplos de uso"
echo -e "  • docs/             - Documentación"
echo -e "  • results/          - Resultados de análisis"
echo -e "  • wordlists/        - Listas de palabras para fuzzing"
echo ""
echo -e "${YELLOW}🚀 Próximos pasos:${NC}"
echo -e "  1. Instalar dependencias: ${BLUE}npm install && pip3 install -r requirements.txt${NC}"
echo -e "  2. Probar el network analyzer: ${BLUE}node scripts/network-analyzer.js --url https://httpbin.org${NC}"
echo -e "  3. Probar el subdomain finder: ${BLUE}python3 scripts/subdomain-finder.py --domain httpbin.org${NC}"
echo -e "  4. Leer la documentación: ${BLUE}cat USAGE.md${NC}"
echo ""
echo -e "${GREEN}💡 Tip: Usa 'examples/basic-usage.sh' para ver más ejemplos${NC}"
echo ""
EOF

# Crear el script de setup
chmod +x setup.sh

print_success "Setup script completado!"
print_status "Creando archivo de inicio rápido..."

# Crear script de inicio rápido
cat > quick-start.sh << 'EOF'
#!/bin/bash

# Quick Start - API Discovery Lab
# Este script ejecuta un análisis básico para demostrar las capacidades

echo "🚀 API Discovery Lab - Quick Start Demo"
echo "======================================"

# Verificar dependencias
if ! command -v node &> /dev/null; then
    echo "❌ Node.js no encontrado. Por favor instala Node.js primero."
    exit 1
fi

if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 no encontrado. Por favor instala Python 3 primero."
    exit 1
fi

echo "✅ Dependencias verificadas"

# Ejecutar demo del network analyzer
echo ""
echo "🔍 Ejecutando análisis de red en httpbin.org (API de prueba)..."
echo "Esto tomará aproximadamente 20 segundos..."

node scripts/network-analyzer.js --url https://httpbin.org --time 20 --output demo-analysis.json

echo ""
echo "🌐 Ejecutando búsqueda de subdominios en httpbin.org..."

python3 scripts/subdomain-finder.py --domain httpbin.org --workers 10 --output demo-subdomains.json

echo ""
echo "🎉 Demo completado! Revisa los archivos:"
echo "  • results/demo-analysis.json - Análisis de red"
echo "  • results/demo-subdomains.json - Subdominios encontrados"
echo ""
echo "💡 Lee USAGE.md para ejemplos más avanzados"
EOF

chmod +x quick-start.sh

print_success "¡Proyecto API Discovery Lab creado completamente!"
echo ""
echo -e "${GREEN}═══════════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}🎯 PROYECTO CREADO EXITOSAMENTE 🎯${NC}"
echo -e "${GREEN}═══════════════════════════════════════════════════════════════${NC}"
echo ""
echo -e "${BLUE}📦 Para comenzar:${NC}"
echo -e "   ${YELLOW}1.${NC} cd $PROJECT_NAME"
echo -e "   ${YELLOW}2.${NC} ./setup.sh"
echo -e "   ${YELLOW}3.${NC} ./quick-start.sh"
echo ""
echo -e "${BLUE}🔧 Herramientas creadas:${NC}"
echo -e "   ${GREEN}✅${NC} Network Analyzer (JavaScript) - Intercepta tráfico de red"
echo -e "   ${GREEN}✅${NC} Subdomain Finder (Python) - Descubre subdominios con APIs"
echo -e "   ${GREEN}✅${NC} Configuración completa del proyecto"
echo -e "   ${GREEN}✅${NC} Documentación y ejemplos"
echo ""
echo -e "${YELLOW}💡 Tip: Ejecuta './quick-start.sh' para ver una demo completa${NC}"