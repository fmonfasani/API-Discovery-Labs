#!/usr/bin/env node

/**
 * Enhanced Network API Analyzer - Backend Performance & Architecture Scanner
 *
 * Análisis completo: Seguridad + Rendimiento + Arquitectura + Escalabilidad
 * Uso: node enhanced-analyzer.js <URL>
 */

const https = require("https");
const http = require("http");
const fs = require("fs").promises;
const path = require("path");
const { URL } = require("url");
const colors = require("colors");

class Enhanced_Backend_Analyzer {
  constructor() {
    this.target = null;
    this.results = {
      // Datos originales
      serverInfo: {},
      vulnerabilities: [],
      apiEndpoints: [],
      securityHeaders: {},
      technologies: [],

      // NUEVOS: Métricas de rendimiento
      performance: {
        responseTimeStats: {},
        throughputMetrics: {},
        databasePerformance: {},
        cachePerformance: {},
        loadBalancerHealth: {},
      },

      // NUEVOS: Arquitectura y escalabilidad
      architecture: {
        type: "unknown", // monolith, microservices, hybrid
        apiVersioning: {},
        rateLimiting: {},
        circuitBreaker: {},
        scalingIndicators: {},
        deploymentInfo: {},
      },

      recommendations: [],
      riskLevel: "unknown",
      performanceScore: 0,
      architectureScore: 0,
    };

    // Expandir endpoints comunes con foco en rendimiento/arquitectura
    this.commonApiPaths = [
      // APIs básicas
      "/api",
      "/api/v1",
      "/api/v2",
      "/api/v3",
      "/rest",
      "/graphql",

      // Health & Monitoring
      "/health",
      "/ready",
      "/live",
      "/status",
      "/ping",
      "/heartbeat",
      "/metrics",
      "/prometheus",
      "/actuator/health",
      "/actuator/metrics",

      // Performance endpoints
      "/stats",
      "/performance",
      "/monitoring",
      "/dashboard",
      "/load-balancer-status",
      "/cluster-status",

      // Architecture discovery
      "/swagger",
      "/docs",
      "/api-docs",
      "/openapi.json",
      "/schema",
      "/version",
      "/build-info",
      "/info",
      "/about",

      // Microservices patterns
      "/service-discovery",
      "/registry",
      "/gateway",
      "/proxy",
      "/circuit-breaker",
      "/rate-limit-status",

      // Database & Cache
      "/db-status",
      "/database/health",
      "/cache/stats",
      "/redis/info",
      "/mongodb/status",
      "/postgres/status",

      // Admin y debug
      "/admin",
      "/admin/api",
      "/debug",
      "/trace",
      "/profiler",
      "/.env",
      "/config",
      "/settings",
    ];
  }

  async analyze(targetUrl) {
    console.log("🚀 ENHANCED BACKEND ANALYZER".red.bold);
    console.log("═".repeat(70).gray);

    try {
      this.target = new URL(targetUrl);
      this.hostSlug = this.target.hostname;
      console.log(`🎯 Analizando: ${this.target.origin}`.cyan);
      console.log(`🕐 Iniciando análisis completo...\n`.yellow);

      // Análisis original (seguridad)
      await this.analyzeMainServer();
      await this.discoverApiEndpoints();
      await this.analyzeVulnerabilities();
      await this.analyzeSecurityHeaders();

      // NUEVOS: Análisis de rendimiento
      await this.analyzePerformanceMetrics();

      // NUEVOS: Análisis de arquitectura
      await this.analyzeArchitecture();

      // NUEVOS: Análisis de escalabilidad
      await this.analyzeScalability();

      // Reporte completo mejorado
      await this.generateEnhancedReport();

      // Generar archivo de reporte
      await this.saveReport();
    } catch (error) {
      console.error(`❌ Error crítico: ${error.message}`.red);
      throw error;
    }
  }

  // ============= NUEVAS FUNCIONES DE RENDIMIENTO =============

  async analyzePerformanceMetrics() {
    console.log("⚡ Analizando métricas de rendimiento...".blue.bold);

    const performanceEndpoints = [
      "/health",
      "/status",
      "/metrics",
      "/api",
      "/api/v1",
      "/",
    ];

    const responseTimes = [];
    const endpointPerformance = {};

    // Medir tiempos de respuesta múltiples veces para promedios
    for (const endpoint of performanceEndpoints) {
      const measurements = [];

      for (let i = 0; i < 3; i++) {
        try {
          const response = await this.makeRequest(endpoint);
          measurements.push(response.responseTime);

          // Analizar headers de performance
          this.analyzePerformanceHeaders(response.headers, endpoint);
        } catch (error) {
          // Ignorar errores, pero registrar timeout como performance issue
          if (error.message.includes("timeout")) {
            measurements.push(10000); // 10s timeout penalty
          }
        }
      }

      if (measurements.length > 0) {
        const avgTime =
          measurements.reduce((a, b) => a + b, 0) / measurements.length;
        endpointPerformance[endpoint] = {
          averageResponseTime: avgTime,
          measurements: measurements,
          consistency: this.calculateConsistency(measurements),
        };
        responseTimes.push(avgTime);
      }
    }

    // Calcular estadísticas generales
    this.results.performance.responseTimeStats = {
      average:
        responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length || 0,
      min: Math.min(...responseTimes) || 0,
      max: Math.max(...responseTimes) || 0,
      endpoints: endpointPerformance,
    };

    // Analizar métricas de base de datos si están disponibles
    await this.analyzeDatabasePerformance();

    // Analizar cache performance
    await this.analyzeCachePerformance();

    console.log(
      `📊 Tiempo promedio de respuesta: ${Math.round(this.results.performance.responseTimeStats.average)}ms`
        .green
    );
  }

  analyzePerformanceHeaders(headers, endpoint) {
    // Analizar headers relacionados con performance
    const perfHeaders = {};

    // Rate limiting headers
    if (headers["x-ratelimit-limit"]) {
      perfHeaders.rateLimitMax = headers["x-ratelimit-limit"];
      perfHeaders.rateLimitRemaining = headers["x-ratelimit-remaining"];
      perfHeaders.rateLimitReset = headers["x-ratelimit-reset"];
    }

    // Cache headers
    if (headers["cache-control"]) {
      perfHeaders.cacheControl = headers["cache-control"];
    }
    if (headers["x-cache"]) {
      perfHeaders.cacheStatus = headers["x-cache"]; // HIT/MISS
    }

    // Load balancer headers
    if (headers["x-served-by"] || headers["x-cache-hits"]) {
      perfHeaders.loadBalancer = {
        servedBy: headers["x-served-by"],
        cacheHits: headers["x-cache-hits"],
      };
    }

    // Response time headers (algunos servicios los exponen)
    if (headers["x-response-time"] || headers["server-timing"]) {
      perfHeaders.serverTiming =
        headers["server-timing"] || headers["x-response-time"];
    }

    if (Object.keys(perfHeaders).length > 0) {
      this.results.performance[endpoint] = perfHeaders;
    }
  }

  async analyzeDatabasePerformance() {
    const dbEndpoints = [
      "/db-status",
      "/database/health",
      "/actuator/health",
      "/api/health",
      "/status",
    ];

    for (const endpoint of dbEndpoints) {
      try {
        const response = await this.makeRequest(endpoint);

        if (response.statusCode === 200 && response.body) {
          const bodyStr = response.body.toString();

          // Buscar indicadores de performance de DB
          const dbMetrics = this.extractDatabaseMetrics(bodyStr);
          if (Object.keys(dbMetrics).length > 0) {
            this.results.performance.databasePerformance = {
              endpoint: endpoint,
              metrics: dbMetrics,
              responseTime: response.responseTime,
            };
          }
        }
      } catch (error) {
        // Ignorar errores
      }
    }
  }

  extractDatabaseMetrics(bodyStr) {
    const metrics = {};

    try {
      const body = JSON.parse(bodyStr);

      // Patrones comunes en health checks
      if (body.database || body.db) {
        const dbInfo = body.database || body.db;
        if (dbInfo.status) metrics.status = dbInfo.status;
        if (dbInfo.responseTime) metrics.responseTime = dbInfo.responseTime;
        if (dbInfo.connections) metrics.connections = dbInfo.connections;
      }

      // Spring Boot Actuator patterns
      if (body.components && body.components.db) {
        metrics.springBootDb = body.components.db;
      }

      // Custom patterns
      const patterns = {
        connectionPool: /connection[s]?[\s_]*pool[\s_]*(\d+)/i,
        queryTime: /query[\s_]*time[\s_]*(\d+)/i,
        slowQueries: /slow[\s_]*quer(y|ies)[\s_]*(\d+)/i,
      };

      Object.entries(patterns).forEach(([key, pattern]) => {
        const match = bodyStr.match(pattern);
        if (match) metrics[key] = match[1];
      });
    } catch (e) {
      // Si no es JSON, buscar patrones en texto plano
      const textPatterns = {
        mysqlConnections: /mysql.*connections?:\s*(\d+)/i,
        postgresConnections: /postgres.*connections?:\s*(\d+)/i,
        mongoConnections: /mongo.*connections?:\s*(\d+)/i,
      };

      Object.entries(textPatterns).forEach(([key, pattern]) => {
        const match = bodyStr.match(pattern);
        if (match) metrics[key] = match[1];
      });
    }

    return metrics;
  }

  async analyzeCachePerformance() {
    const cacheEndpoints = [
      "/cache/stats",
      "/redis/info",
      "/memcached/stats",
      "/status",
    ];

    for (const endpoint of cacheEndpoints) {
      try {
        const response = await this.makeRequest(endpoint);

        if (response.statusCode === 200) {
          // Analizar headers de cache
          const cacheHeaders = {};
          if (response.headers["x-cache"])
            cacheHeaders.status = response.headers["x-cache"];
          if (response.headers["x-cache-hits"])
            cacheHeaders.hits = response.headers["x-cache-hits"];
          if (response.headers["age"])
            cacheHeaders.age = response.headers["age"];

          if (Object.keys(cacheHeaders).length > 0) {
            this.results.performance.cachePerformance = {
              endpoint: endpoint,
              headers: cacheHeaders,
              responseTime: response.responseTime,
            };
          }
        }
      } catch (error) {
        // Ignorar errores
      }
    }
  }

  // ============= NUEVAS FUNCIONES DE ARQUITECTURA =============

  async analyzeArchitecture() {
    console.log("🏗️  Analizando arquitectura del sistema...".blue.bold);

    // Detectar tipo de arquitectura
    await this.detectArchitectureType();

    // Analizar versionado de API
    await this.analyzeApiVersioning();

    // Detectar patrones de microservicios
    await this.detectMicroservicesPatterns();

    // Analizar documentación de API
    await this.analyzeApiDocumentation();
  }

  async detectArchitectureType() {
    const indicators = {
      microservices: 0,
      monolith: 0,
      serverless: 0,
    };

    // Analizar endpoints para detectar patrones
    this.results.apiEndpoints.forEach((endpoint) => {
      const path = endpoint.path.toLowerCase();

      // Indicadores de microservicios
      if (path.includes("/service/") || path.includes("/services/"))
        indicators.microservices += 2;
      if (path.includes("/gateway") || path.includes("/proxy"))
        indicators.microservices += 3;
      if (path.includes("/registry") || path.includes("/discovery"))
        indicators.microservices += 3;
      if (path.match(/\/v\d+\//)) indicators.microservices += 1;

      // Indicadores de monolito
      if (path.includes("/admin") && path.includes("/api"))
        indicators.monolith += 1;
      if (path.includes("/wp-") || path.includes("/drupal"))
        indicators.monolith += 2;

      // Indicadores de serverless
      if (endpoint.server && endpoint.server.includes("lambda"))
        indicators.serverless += 3;
      if (endpoint.server && endpoint.server.includes("vercel"))
        indicators.serverless += 2;
    });

    // Analizar headers para más indicadores
    try {
      const response = await this.makeRequest("/");
      const headers = response.headers;

      if (headers["x-amz-cf-id"]) indicators.serverless += 2; // CloudFront/Lambda
      if (headers["x-vercel-id"]) indicators.serverless += 3; // Vercel
      if (
        headers["x-served-by"] &&
        headers["x-served-by"].includes("kubernetes")
      )
        indicators.microservices += 2;
    } catch (error) {
      // Ignorar errores
    }

    // Determinar tipo de arquitectura
    const maxScore = Math.max(
      indicators.microservices,
      indicators.monolith,
      indicators.serverless
    );
    let architectureType = "unknown";

    if (maxScore > 0) {
      if (indicators.microservices === maxScore)
        architectureType = "microservices";
      else if (indicators.serverless === maxScore)
        architectureType = "serverless";
      else architectureType = "monolith";
    }

    this.results.architecture.type = architectureType;
    this.results.architecture.indicators = indicators;

    console.log(
      `🏛️  Arquitectura detectada: ${architectureType.toUpperCase()}`.cyan
    );
  }

  async analyzeApiVersioning() {
    const versioningStrategies = {
      urlPath: [], // /api/v1, /api/v2
      queryParam: [], // ?version=1
      header: [], // Accept: application/vnd.api+json;version=1
      subdomain: [], // v1.api.example.com
    };

    // Analizar URL path versioning
    this.results.apiEndpoints.forEach((endpoint) => {
      const versionMatch = endpoint.path.match(/\/v(\d+)/);
      if (versionMatch) {
        versioningStrategies.urlPath.push(versionMatch[1]);
      }
    });

    // Buscar documentación de versionado
    const versionEndpoints = ["/api-docs", "/swagger", "/openapi.json"];

    for (const endpoint of versionEndpoints) {
      try {
        const response = await this.makeRequest(endpoint);
        if (response.statusCode === 200 && response.body) {
          const versionInfo = this.extractVersionInfo(response.body.toString());
          if (versionInfo) {
            this.results.architecture.apiVersioning.documentation = versionInfo;
          }
        }
      } catch (error) {
        // Ignorar errores
      }
    }

    this.results.architecture.apiVersioning.strategies = versioningStrategies;

    // Evaluar madurez del versionado
    let versioningMaturity = "none";
    if (versioningStrategies.urlPath.length > 0) versioningMaturity = "basic";
    if (versioningStrategies.urlPath.length > 1)
      versioningMaturity = "intermediate";
    if (this.results.architecture.apiVersioning.documentation)
      versioningMaturity = "advanced";

    this.results.architecture.apiVersioning.maturity = versioningMaturity;
  }

  async detectMicroservicesPatterns() {
    const patterns = {
      serviceDiscovery: false,
      apiGateway: false,
      circuitBreaker: false,
      configServer: false,
      messageQueue: false,
    };

    // Buscar endpoints que indican patrones de microservicios
    const microserviceEndpoints = [
      "/eureka",
      "/consul",
      "/registry",
      "/discovery", // Service Discovery
      "/gateway",
      "/proxy",
      "/router", // API Gateway
      "/circuit-breaker",
      "/hystrix",
      "/resilience", // Circuit Breaker
      "/config",
      "/config-server", // Config Server
      "/queue",
      "/rabbit",
      "/kafka",
      "/message", // Message Queue
    ];

    for (const endpoint of microserviceEndpoints) {
      try {
        const response = await this.makeRequest(endpoint);
        if (response.statusCode !== 404) {
          // Detectar qué patrón es
          if (
            endpoint.includes("eureka") ||
            endpoint.includes("registry") ||
            endpoint.includes("discovery")
          ) {
            patterns.serviceDiscovery = true;
          }
          if (endpoint.includes("gateway") || endpoint.includes("proxy")) {
            patterns.apiGateway = true;
          }
          if (endpoint.includes("circuit") || endpoint.includes("hystrix")) {
            patterns.circuitBreaker = true;
          }
          if (endpoint.includes("config")) {
            patterns.configServer = true;
          }
          if (
            endpoint.includes("queue") ||
            endpoint.includes("rabbit") ||
            endpoint.includes("kafka")
          ) {
            patterns.messageQueue = true;
          }
        }
      } catch (error) {
        // Ignorar errores
      }
    }

    this.results.architecture.microservicesPatterns = patterns;

    // Calcular score de madurez de microservicios
    const patternCount = Object.values(patterns).filter(Boolean).length;
    let maturityLevel = "none";
    if (patternCount >= 1) maturityLevel = "basic";
    if (patternCount >= 3) maturityLevel = "intermediate";
    if (patternCount >= 4) maturityLevel = "advanced";

    this.results.architecture.microservicesMaturity = maturityLevel;
  }

  async analyzeApiDocumentation() {
    const docEndpoints = [
      "/swagger",
      "/docs",
      "/api-docs",
      "/openapi.json",
      "/schema",
    ];

    for (const endpoint of docEndpoints) {
      try {
        const response = await this.makeRequest(endpoint);
        if (response.statusCode === 200) {
          this.results.architecture.hasDocumentation = true;
          this.results.architecture.documentationEndpoint = endpoint;
          break;
        }
      } catch (error) {
        // Ignorar errores
      }
    }
  }

  // ============= ANÁLISIS DE ESCALABILIDAD =============

  async analyzeScalability() {
    console.log("📈 Analizando capacidades de escalabilidad...".blue.bold);

    // Detectar load balancing
    await this.analyzeLoadBalancing();

    // Analizar rate limiting
    await this.analyzeRateLimiting();

    // Detectar auto-scaling indicators
    await this.detectAutoScaling();

    // Analizar deployment patterns
    await this.analyzeDeploymentPatterns();
  }

  async analyzeLoadBalancing() {
    const loadBalancerIndicators = {};

    try {
      // Hacer múltiples requests para detectar load balancing
      const responses = [];
      for (let i = 0; i < 5; i++) {
        const response = await this.makeRequest("/");
        responses.push(response);
      }

      // Analizar variaciones en headers que indican LB
      const serverHeaders = responses
        .map((r) => r.headers.server)
        .filter(Boolean);
      const xServedBy = responses
        .map((r) => r.headers["x-served-by"])
        .filter(Boolean);
      const xCacheHeaders = responses
        .map((r) => r.headers["x-cache"])
        .filter(Boolean);

      if (new Set(xServedBy).size > 1) {
        loadBalancerIndicators.multipleServers = true;
        loadBalancerIndicators.serverCount = new Set(xServedBy).size;
      }

      if (xCacheHeaders.length > 0) {
        loadBalancerIndicators.cacheLayer = true;
        loadBalancerIndicators.cacheHitRate =
          xCacheHeaders.filter((h) => h.includes("HIT")).length /
          xCacheHeaders.length;
      }

      // Analizar consistencia de response times (LB puede causar variación)
      const responseTimes = responses.map((r) => r.responseTime);
      loadBalancerIndicators.responseTimeVariation =
        this.calculateVariation(responseTimes);
    } catch (error) {
      // Ignorar errores
    }

    this.results.architecture.loadBalancing = loadBalancerIndicators;
  }

  async analyzeRateLimiting() {
    let rateLimitInfo = {};

    try {
      const response = await this.makeRequest("/api");
      const headers = response.headers;

      // Detectar headers de rate limiting
      const rateLimitHeaders = [
        "x-ratelimit-limit",
        "x-rate-limit-limit",
        "x-ratelimit-remaining",
        "x-rate-limit-remaining",
        "x-ratelimit-reset",
        "x-rate-limit-reset",
        "retry-after",
      ];

      rateLimitHeaders.forEach((header) => {
        if (headers[header]) {
          rateLimitInfo[header] = headers[header];
        }
      });

      // Intentar detectar rate limiting haciendo requests rápidos
      if (Object.keys(rateLimitInfo).length === 0) {
        const rapidRequests = [];
        for (let i = 0; i < 10; i++) {
          try {
            const resp = await this.makeRequest("/api");
            rapidRequests.push(resp.statusCode);
          } catch (e) {
            rapidRequests.push(429); // Assume rate limited
          }
        }

        const rateLimitedCount = rapidRequests.filter(
          (code) => code === 429
        ).length;
        if (rateLimitedCount > 0) {
          rateLimitInfo.detected = true;
          rateLimitInfo.rateLimitedRequests = rateLimitedCount;
        }
      }
    } catch (error) {
      // Ignorar errores
    }

    this.results.architecture.rateLimiting = rateLimitInfo;
  }

  async detectAutoScaling() {
    const scalingIndicators = {};

    try {
      // Buscar headers que indican auto-scaling
      const response = await this.makeRequest("/");
      const headers = response.headers;

      // Kubernetes indicators
      if (headers["x-kubernetes-pod-id"] || headers["x-pod-name"]) {
        scalingIndicators.kubernetes = true;
        scalingIndicators.podId =
          headers["x-kubernetes-pod-id"] || headers["x-pod-name"];
      }

      // Docker Swarm indicators
      if (headers["x-docker-container-id"]) {
        scalingIndicators.dockerSwarm = true;
      }

      // AWS indicators
      if (headers["x-amz-cf-id"] || headers["x-aws-region"]) {
        scalingIndicators.aws = true;
      }

      // Azure indicators
      if (headers["x-ms-request-id"]) {
        scalingIndicators.azure = true;
      }
    } catch (error) {
      // Ignorar errores
    }

    this.results.architecture.scalingIndicators = scalingIndicators;
  }

  async analyzeDeploymentPatterns() {
    const deploymentInfo = {};

    try {
      // Analizar endpoints de build info
      const buildEndpoints = ["/build-info", "/info", "/version", "/about"];

      for (const endpoint of buildEndpoints) {
        try {
          const response = await this.makeRequest(endpoint);
          if (response.statusCode === 200 && response.body) {
            const buildInfo = this.extractBuildInfo(response.body.toString());
            if (buildInfo) {
              deploymentInfo.buildInfo = buildInfo;
              deploymentInfo.endpoint = endpoint;
              break;
            }
          }
        } catch (error) {
          // Ignorar errores
        }
      }
    } catch (error) {
      // Ignorar errores
    }

    this.results.architecture.deploymentInfo = deploymentInfo;
  }

  extractBuildInfo(bodyStr) {
    const buildInfo = {};

    try {
      const body = JSON.parse(bodyStr);

      // Patrones comunes de build info
      if (body.version) buildInfo.version = body.version;
      if (body.buildTime || body.build_time)
        buildInfo.buildTime = body.buildTime || body.build_time;
      if (body.gitCommit || body.git_commit)
        buildInfo.gitCommit = body.gitCommit || body.git_commit;
      if (body.environment) buildInfo.environment = body.environment;
    } catch (e) {
      // Buscar patrones en texto plano
      const patterns = {
        version: /version[:\s]+([^\s,}]+)/i,
        buildTime: /build[_\s]*time[:\s]+([^\s,}]+)/i,
        gitCommit: /git[_\s]*commit[:\s]+([^\s,}]+)/i,
      };

      Object.entries(patterns).forEach(([key, pattern]) => {
        const match = bodyStr.match(pattern);
        if (match) buildInfo[key] = match[1];
      });
    }

    return Object.keys(buildInfo).length > 0 ? buildInfo : null;
  }

  // ============= FUNCIONES AUXILIARES =============

  calculateConsistency(measurements) {
    const avg = measurements.reduce((a, b) => a + b, 0) / measurements.length;
    const variance =
      measurements.reduce((acc, val) => acc + Math.pow(val - avg, 2), 0) /
      measurements.length;
    const stdDev = Math.sqrt(variance);
    return (stdDev / avg) * 100; // Coefficient of variation as percentage
  }

  calculateVariation(values) {
    const avg = values.reduce((a, b) => a + b, 0) / values.length;
    const max = Math.max(...values);
    const min = Math.min(...values);
    return {
      average: avg,
      range: max - min,
      coefficientOfVariation:
        (Math.sqrt(
          values.reduce((acc, val) => acc + Math.pow(val - avg, 2), 0) /
            values.length
        ) /
          avg) *
        100,
    };
  }

  extractVersionInfo(body) {
    try {
      const json = JSON.parse(body);
      if (json.info && json.info.version) {
        return {
          version: json.info.version,
          title: json.info.title,
          description: json.info.description,
        };
      }
    } catch (e) {
      // Si no es JSON válido, buscar en texto plano
      const versionMatch = body.match(/version["\s]*[:=]["\s]*([^",\s}]+)/i);
      if (versionMatch) {
        return { version: versionMatch[1] };
      }
    }
    return null;
  }

  // ============= FUNCIONES ORIGINALES (mantenidas) =============

  async analyzeMainServer() {
    console.log("🌐 Analizando servidor principal...".blue);

    try {
      const response = await this.makeRequest("/");
      this.results.serverInfo = {
        server: response.headers.server || "No identificado",
        poweredBy: response.headers["x-powered-by"] || "No identificado",
        statusCode: response.statusCode,
        contentType: response.headers["content-type"] || "No especificado",
        responseTime: response.responseTime,
      };

      this.detectTechnologies(response.headers, response.body);
      console.log(`✅ Servidor: ${this.results.serverInfo.server}`.green);
    } catch (error) {
      console.log(`⚠️  Error conectando al servidor: ${error.message}`.yellow);
    }
  }

  async discoverApiEndpoints() {
    console.log("\n🔎 Descubriendo endpoints de API...".blue);
    const foundEndpoints = [];

    for (const path of this.commonApiPaths) {
      try {
        const response = await this.makeRequest(path);
        if (response.statusCode !== 404) {
          const endpoint = {
            path: path,
            status: response.statusCode,
            server: response.headers.server,
            contentType: response.headers["content-type"],
            size: response.body ? response.body.length : 0,
            responseTime: response.responseTime,
            authentication: this.checkAuthentication(response.headers),
            exposedData: this.analyzeExposedData(
              response.body,
              response.headers
            ),
          };
          foundEndpoints.push(endpoint);
          console.log(
            `📍 Encontrado: ${path} [${response.statusCode}] (${response.responseTime}ms)`
              .green
          );
        }
      } catch (error) {
        // Ignorar errores de conexión
      }
    }

    this.results.apiEndpoints = foundEndpoints;
    console.log(`📊 Total endpoints encontrados: ${foundEndpoints.length}`);
  }

  async analyzeVulnerabilities() {
    console.log("\n🚨 Analizando vulnerabilidades de seguridad...".red);

    const vulnerabilities = [];

    // Verificar información sensible expuesta
    for (const endpoint of this.results.apiEndpoints) {
      if (endpoint.exposedData.length > 0) {
        vulnerabilities.push({
          type: "Information Disclosure",
          severity: "HIGH",
          endpoint: endpoint.path,
          description: `Endpoint expone información sensible: ${endpoint.exposedData.join(", ")}`,
          recommendation:
            "Revisar y filtrar datos sensibles antes de exponerlos",
        });
      }

      // Verificar autenticación débil
      if (!endpoint.authentication.required) {
        vulnerabilities.push({
          type: "Missing Authentication",
          severity: "MEDIUM",
          endpoint: endpoint.path,
          description: "Endpoint no requiere autenticación",
          recommendation: "Implementar autenticación apropiada",
        });
      }
    }

    // Verificar endpoints de administración sin protección
    const adminEndpoints = this.results.apiEndpoints.filter(
      (e) =>
        e.path.includes("/admin") ||
        e.path.includes("/debug") ||
        e.path.includes("/.env")
    );

    adminEndpoints.forEach((endpoint) => {
      if (endpoint.status === 200) {
        vulnerabilities.push({
          type: "Exposed Admin Interface",
          severity: "CRITICAL",
          endpoint: endpoint.path,
          description: "Interfaz administrativa accesible públicamente",
          recommendation: "Restringir acceso a interfaces administrativas",
        });
      }
    });

    this.results.vulnerabilities = vulnerabilities;
    console.log(`⚠️  Vulnerabilidades encontradas: ${vulnerabilities.length}`);
  }

  async analyzeSecurityHeaders() {
    console.log("\n🔒 Analizando headers de seguridad...".blue);

    try {
      const response = await this.makeRequest("/");
      const securityHeaders = {
        "Strict-Transport-Security":
          response.headers["strict-transport-security"] || "❌ Ausente",
        "Content-Security-Policy":
          response.headers["content-security-policy"] || "❌ Ausente",
        "X-Frame-Options": response.headers["x-frame-options"] || "❌ Ausente",
        "X-Content-Type-Options":
          response.headers["x-content-type-options"] || "❌ Ausente",
        "Referrer-Policy": response.headers["referrer-policy"] || "❌ Ausente",
        "Permissions-Policy":
          response.headers["permissions-policy"] || "❌ Ausente",
      };

      this.results.securityHeaders = securityHeaders;

      // Contar headers de seguridad presentes
      const presentHeaders = Object.values(securityHeaders).filter(
        (h) => !h.includes("❌")
      ).length;
      console.log(
        `🛡️  Headers de seguridad: ${presentHeaders}/6 implementados`
      );
    } catch (error) {
      console.log(`⚠️  Error analizando headers: ${error.message}`.yellow);
    }
  }

  detectTechnologies(headers, body) {
    const technologies = [];

    // Detectar por headers
    if (headers.server) {
      if (headers.server.includes("nginx")) technologies.push("Nginx");
      if (headers.server.includes("Apache")) technologies.push("Apache");
      if (headers.server.includes("IIS")) technologies.push("IIS");
    }

    if (headers["x-powered-by"]) {
      technologies.push(headers["x-powered-by"]);
    }

    // Detectar por contenido del body
    if (body) {
      const bodyStr = body.toString();
      if (bodyStr.includes("wp-content")) technologies.push("WordPress");
      if (bodyStr.includes("drupal")) technologies.push("Drupal");
      if (bodyStr.includes("joomla")) technologies.push("Joomla");
      if (bodyStr.includes("react")) technologies.push("React");
      if (bodyStr.includes("angular")) technologies.push("Angular");
      if (bodyStr.includes("vue")) technologies.push("Vue.js");
    }

    this.results.technologies = [...new Set(technologies)];
  }

  checkAuthentication(headers) {
    return {
      required: !!(headers["www-authenticate"] || headers["authorization"]),
      type: headers["www-authenticate"] || "No especificado",
      bearer: headers["authorization"]?.includes("Bearer") || false,
    };
  }

  analyzeExposedData(body, headers) {
    const exposedData = [];

    if (!body) return exposedData;

    const bodyStr = body.toString();

    // Buscar patrones de datos sensibles
    const patterns = {
      "API Keys": /api[_-]?key["\s]*[:=]["\s]*([a-zA-Z0-9-_]{20,})/gi,
      "Database URLs": /mongodb:\/\/|mysql:\/\/|postgresql:\/\/|redis:\/\//gi,
      "Email Addresses": /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/gi,
      "IP Addresses": /\b(?:[0-9]{1,3}\.){3}[0-9]{1,3}\b/gi,
      "JWT Tokens": /eyJ[a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+/gi,
      "AWS Keys": /AKIA[0-9A-Z]{16}/gi,
      "Private Keys": /-----BEGIN (RSA |EC |DSA )?PRIVATE KEY-----/gi,
    };

    Object.entries(patterns).forEach(([type, pattern]) => {
      if (pattern.test(bodyStr)) {
        exposedData.push(type);
      }
    });

    return exposedData;
  }

  async makeRequest(path, options = {}) {
    return new Promise((resolve, reject) => {
      const url = new URL(path, this.target.origin);
      const protocol = url.protocol === "https:" ? https : http;

      const startTime = Date.now();

      const requestOptions = {
        hostname: url.hostname,
        port: url.port,
        path: url.pathname + url.search,
        method: options.method || "GET",
        headers: {
          "User-Agent": "Enhanced-Backend-Analyzer/2.0",
          ...options.headers,
        },
        timeout: 10000,
        ...options,
      };

      const req = protocol.request(requestOptions, (res) => {
        const responseTime = Date.now() - startTime;
        let body = Buffer.alloc(0);

        res.on("data", (chunk) => {
          body = Buffer.concat([body, chunk]);
        });

        res.on("end", () => {
          resolve({
            statusCode: res.statusCode,
            headers: res.headers,
            body: body,
            responseTime: responseTime,
          });
        });
      });

      req.on("error", (error) => {
        reject(error);
      });

      req.on("timeout", () => {
        req.destroy();
        reject(new Error("Request timeout"));
      });

      if (options.body) {
        req.write(options.body);
      }

      req.end();
    });
  }

  // ============= REPORTE MEJORADO =============

  async generateEnhancedReport() {
    console.log("\n" + "=".repeat(70));
    console.log("📋 REPORTE COMPLETO DE ANÁLISIS BACKEND".bold.cyan);
    console.log("=".repeat(70));

    // Información básica del servidor
    this.printServerInfo();

    // Métricas de rendimiento
    this.printPerformanceMetrics();

    // Análisis de arquitectura
    this.printArchitectureAnalysis();

    // Análisis de escalabilidad
    this.printScalabilityAnalysis();

    // Vulnerabilidades de seguridad
    this.printSecurityAnalysis();

    // Endpoints encontrados
    this.printEndpointsAnalysis();

    // Calcular scores finales
    this.calculateScores();

    // Recomendaciones finales
    this.printRecommendations();
  }

  printServerInfo() {
    console.log("\n🖥️  INFORMACIÓN DEL SERVIDOR".bold.blue);
    console.log("-".repeat(50));
    console.log(`Servidor: ${this.results.serverInfo.server}`.cyan);
    console.log(`Tecnología: ${this.results.serverInfo.poweredBy}`.cyan);
    console.log(
      `Tiempo de respuesta: ${this.results.serverInfo.responseTime}ms`.cyan
    );
    console.log(
      `Tecnologías detectadas: ${this.results.technologies.join(", ") || "No identificadas"}`
        .cyan
    );
  }

  printPerformanceMetrics() {
    console.log("\n⚡ MÉTRICAS DE RENDIMIENTO".bold.green);
    console.log("-".repeat(50));

    const perf = this.results.performance;

    if (perf.responseTimeStats.average) {
      console.log(
        `Tiempo promedio de respuesta: ${Math.round(perf.responseTimeStats.average)}ms`
          .green
      );
      console.log(
        `Tiempo mínimo: ${Math.round(perf.responseTimeStats.min)}ms`.green
      );
      console.log(
        `Tiempo máximo: ${Math.round(perf.responseTimeStats.max)}ms`.green
      );

      // Evaluar rendimiento
      const avgTime = perf.responseTimeStats.average;
      let performanceRating = "Excelente";
      if (avgTime > 1000) performanceRating = "Muy Lento";
      else if (avgTime > 500) performanceRating = "Lento";
      else if (avgTime > 200) performanceRating = "Regular";
      else if (avgTime > 100) performanceRating = "Bueno";

      console.log(`Evaluación de rendimiento: ${performanceRating}`.bold);
    }

    if (perf.databasePerformance.metrics) {
      console.log(`\n📊 Base de datos:`.yellow);
      Object.entries(perf.databasePerformance.metrics).forEach(
        ([key, value]) => {
          console.log(`  ${key}: ${value}`.yellow);
        }
      );
    }

    if (perf.cachePerformance.headers) {
      console.log(`\n🗄️  Cache:`.yellow);
      Object.entries(perf.cachePerformance.headers).forEach(([key, value]) => {
        console.log(`  ${key}: ${value}`.yellow);
      });
    }
  }

  printArchitectureAnalysis() {
    console.log("\n🏗️  ANÁLISIS DE ARQUITECTURA".bold.magenta);
    console.log("-".repeat(50));

    const arch = this.results.architecture;

    console.log(`Tipo de arquitectura: ${arch.type.toUpperCase()}`.magenta);

    if (arch.apiVersioning.strategies.urlPath.length > 0) {
      console.log(
        `Versiones de API: ${arch.apiVersioning.strategies.urlPath.join(", ")}`
          .magenta
      );
      console.log(
        `Madurez del versionado: ${arch.apiVersioning.maturity}`.magenta
      );
    }

    if (arch.microservicesPatterns) {
      console.log(`\n🔧 Patrones encontrados:`.yellow);
      Object.entries(arch.microservicesPatterns).forEach(([pattern, found]) => {
        if (found) {
          console.log(`  ✅ ${pattern}`.green);
        }
      });

      if (arch.microservicesMaturity) {
        console.log(
          `Madurez de microservicios: ${arch.microservicesMaturity}`.bold
        );
      }
    }

    if (arch.hasDocumentation) {
      console.log(
        `📚 Documentación: Disponible en ${arch.documentationEndpoint}`.green
      );
    } else {
      console.log(`📚 Documentación: No encontrada`.red);
    }
  }

  printScalabilityAnalysis() {
    console.log("\n📈 ANÁLISIS DE ESCALABILIDAD".bold.cyan);
    console.log("-".repeat(50));

    const arch = this.results.architecture;

    if (arch.loadBalancing.multipleServers) {
      console.log(
        `⚖️  Load Balancer: Detectado (${arch.loadBalancing.serverCount} servidores)`
          .green
      );
    } else {
      console.log(`⚖️  Load Balancer: No detectado`.yellow);
    }

    if (Object.keys(arch.rateLimiting).length > 0) {
      console.log(`🚦 Rate Limiting: Implementado`.green);
      Object.entries(arch.rateLimiting).forEach(([key, value]) => {
        console.log(`  ${key}: ${value}`.cyan);
      });
    } else {
      console.log(`🚦 Rate Limiting: No detectado`.yellow);
    }

    if (Object.keys(arch.scalingIndicators).length > 0) {
      console.log(`🔄 Auto-scaling: Indicadores encontrados`.green);
      Object.entries(arch.scalingIndicators).forEach(([key, value]) => {
        console.log(`  ${key}: ${value}`.cyan);
      });
    }

    if (arch.deploymentInfo.buildInfo) {
      console.log(`🚀 Deployment:`.green);
      Object.entries(arch.deploymentInfo.buildInfo).forEach(([key, value]) => {
        console.log(`  ${key}: ${value}`.cyan);
      });
    }
  }

  printSecurityAnalysis() {
    console.log("\n🔒 ANÁLISIS DE SEGURIDAD".bold.red);
    console.log("-".repeat(50));

    // Headers de seguridad
    console.log("Headers de seguridad:".yellow);
    Object.entries(this.results.securityHeaders).forEach(([header, value]) => {
      const status = value.includes("❌") ? value.red : "✅ Presente".green;
      console.log(`  ${header}: ${status}`);
    });

    // Vulnerabilidades
    if (this.results.vulnerabilities.length > 0) {
      console.log(
        `\n🚨 Vulnerabilidades encontradas: ${this.results.vulnerabilities.length}`
          .red.bold
      );
      this.results.vulnerabilities.forEach((vuln) => {
        const severityColor =
          vuln.severity === "CRITICAL"
            ? "red"
            : vuln.severity === "HIGH"
              ? "yellow"
              : "cyan";
        console.log(
          `  [${vuln.severity}] ${vuln.type} - ${vuln.endpoint}`[severityColor]
        );
        console.log(`    ${vuln.description}`.gray);
      });
    } else {
      console.log("✅ No se encontraron vulnerabilidades críticas".green);
    }
  }

  printEndpointsAnalysis() {
    console.log("\n📍 ENDPOINTS ENCONTRADOS".bold.blue);
    console.log("-".repeat(50));

    this.results.apiEndpoints.forEach((endpoint) => {
      const statusColor =
        endpoint.status === 200
          ? "green"
          : endpoint.status === 404
            ? "gray"
            : "yellow";
      console.log(
        `${endpoint.path} [${endpoint.status}] ${endpoint.responseTime}ms`[
          statusColor
        ]
      );

      if (endpoint.exposedData.length > 0) {
        console.log(
          `  ⚠️  Datos expuestos: ${endpoint.exposedData.join(", ")}`.red
        );
      }
    });
  }

  calculateScores() {
    // Calcular score de rendimiento (0-100)
    const avgResponseTime =
      this.results.performance.responseTimeStats.average || 1000;
    this.results.performanceScore = Math.max(0, 100 - avgResponseTime / 10);

    // Calcular score de arquitectura (0-100)
    let archScore = 0;
    if (this.results.architecture.type !== "unknown") archScore += 20;
    if (this.results.architecture.hasDocumentation) archScore += 20;
    if (this.results.architecture.apiVersioning.maturity !== "none")
      archScore += 20;
    if (this.results.architecture.microservicesMaturity !== "none")
      archScore += 20;
    if (Object.keys(this.results.architecture.rateLimiting).length > 0)
      archScore += 20;

    this.results.architectureScore = archScore;

    // Calcular nivel de riesgo general
    const criticalVulns = this.results.vulnerabilities.filter(
      (v) => v.severity === "CRITICAL"
    ).length;
    const highVulns = this.results.vulnerabilities.filter(
      (v) => v.severity === "HIGH"
    ).length;

    if (criticalVulns > 0) this.results.riskLevel = "CRITICAL";
    else if (highVulns > 2) this.results.riskLevel = "HIGH";
    else if (highVulns > 0) this.results.riskLevel = "MEDIUM";
    else this.results.riskLevel = "LOW";
  }

  printRecommendations() {
    console.log("\n💡 RECOMENDACIONES".bold.yellow);
    console.log("-".repeat(50));

    const recommendations = [];

    // Recomendaciones de rendimiento
    if (this.results.performanceScore < 70) {
      recommendations.push("🚀 Optimizar tiempos de respuesta del servidor");
      recommendations.push(
        "📊 Implementar monitoreo de performance en tiempo real"
      );
    }

    if (!this.results.performance.cachePerformance.headers) {
      recommendations.push("🗄️  Implementar estrategia de cache");
    }

    // Recomendaciones de arquitectura
    if (!this.results.architecture.hasDocumentation) {
      recommendations.push(
        "📚 Implementar documentación de API (Swagger/OpenAPI)"
      );
    }

    if (this.results.architecture.apiVersioning.maturity === "none") {
      recommendations.push("🔄 Establecer estrategia de versionado de API");
    }

    if (Object.keys(this.results.architecture.rateLimiting).length === 0) {
      recommendations.push("🚦 Implementar rate limiting para proteger la API");
    }

    // Recomendaciones de seguridad
    const missingHeaders = Object.entries(this.results.securityHeaders).filter(
      ([_, value]) => value.includes("❌")
    ).length;

    if (missingHeaders > 0) {
      recommendations.push("🛡️  Implementar headers de seguridad faltantes");
    }

    // Recomendaciones de escalabilidad
    if (!this.results.architecture.loadBalancing.multipleServers) {
      recommendations.push("⚖️  Considerar implementar load balancing");
    }

    if (recommendations.length === 0) {
      recommendations.push("✅ El sistema muestra buenas prácticas generales");
    }

    recommendations.forEach((rec) => console.log(`  ${rec}`.yellow));

    // Scores finales
    console.log("\n📊 PUNTUACIÓN FINAL".bold.white);
    console.log("-".repeat(50));
    console.log(
      `Rendimiento: ${Math.round(this.results.performanceScore)}/100`.cyan
    );
    console.log(`Arquitectura: ${this.results.architectureScore}/100`.cyan);
    console.log(
      `Nivel de riesgo: ${this.results.riskLevel}`[
        this.results.riskLevel === "LOW" ? "green" : "red"
      ]
    );
  }

  async saveReport() {
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const filename = `backend-analysis-${this.hostSlug}-${timestamp}.json`;

    try {
      await fs.writeFile(filename, JSON.stringify(this.results, null, 2));
      console.log(`\n💾 Reporte guardado en: ${filename}`.green);
    } catch (error) {
      console.log(`⚠️  Error guardando reporte: ${error.message}`.yellow);
    }
  }
}

// ============= EJECUCIÓN PRINCIPAL =============

async function main() {
  const targetUrl = process.argv[2];

  if (!targetUrl) {
    console.log("❌ Uso: node enhanced-analyzer.js <URL>".red);
    console.log(
      "📝 Ejemplo: node enhanced-analyzer.js https://api.example.com".gray
    );
    process.exit(1);
  }

  try {
    const analyzer = new Enhanced_Backend_Analyzer();
    await analyzer.analyze(targetUrl);

    console.log("\n🎉 Análisis completado exitosamente!".green.bold);
  } catch (error) {
    console.error("\n💥 Error durante el análisis:".red.bold);
    console.error(error.message.red);
    process.exit(1);
  }
}

// Ejecutar si es llamado directamente
if (require.main === module) {
  main();
}

module.exports = Enhanced_Backend_Analyzer;
