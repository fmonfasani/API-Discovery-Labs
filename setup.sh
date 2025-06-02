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
        "