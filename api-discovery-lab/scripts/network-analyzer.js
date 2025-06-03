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
    .option('--headless', 'forzar headless')
    .option('--executable <path>', 'Ruta al binario de Chrome/Chromium')
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
            headless: config.headless ?? true, //default True,
            executablePath: config.executable || process.env.CHROME_BIN,
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

        try { return await puppeteer.launch({
              headless: this.config.headless ? 'new' : false,
              executablePath: this.config.executablePath,
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
        } catch (err) {
            console.error('\n❌ Puppeteer no pudo arrancar Chrome.'.red);
            if (this.config.verbose) console.error(err.stack);
            console.error('👉  Sugerencias:');
            console.error('   • Ejecuta: npx @puppeteer/browsers install chrome@stable');
            console.error('   • O pasa --executable /ruta/al/chrome');
            console.error('   • Ver docs: https://pptr.dev/troubleshooting\n');
            throw err;   // vuelve a lanzar para que main() lo capture
        }
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
