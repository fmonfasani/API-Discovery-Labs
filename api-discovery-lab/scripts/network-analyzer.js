#!/usr/bin/env node

/**
 * Network API Analyzer - Backend Vulnerability Scanner
 *
 * Analizador de seguridad enfocado en vulnerabilidades de backend, APIs y servidores
 * Uso: node security-analyzer.js <URL>
 */

const https = require("https");
const http = require("http");
const fs = require("fs").promises;
const path = require("path");
const { URL } = require("url");
const colors = require("colors");
const { url } = require("inspector");

class Network_Analyzer {
  constructor() {
    this.target = null;
    this.results = {
      serverInfo: {},
      vulnerabilities: [],
      apiEndpoints: [],
      securityHeaders: {},
      technologies: [],
      recommendations: [],
      riskLevel: "unknown",
    };
    this.commonApiPaths = [
      "/api",
      "/api/v1",
      "/api/v2",
      "/rest",
      "/graphql",
      "/admin",
      "/admin/api",
      "/wp-json",
      "/wp-admin",
      "/api/users",
      "/api/auth",
      "/api/login",
      "/api/config",
      "/swagger",
      "/docs",
      "/api-docs",
      "/openapi.json",
      "/.env",
      "/config",
      "/status",
      "/health",
      "/debug",
    ];
  }

  async analyze(targetUrl) {
    console.log("🔍 SECURITY API ANALYZER".red.bold);
    console.log("═".repeat(60).gray);

    try {
      this.target = new URL(targetUrl);
      this.hostSlug = this.target.hostname;
      console.log(`🎯 Analizando: ${this.target.origin}`.cyan);
      console.log(`🕐 Iniciando análisis de seguridad...\n`.yellow);

      // Fase 1: Análisis del servidor principal
      await this.analyzeMainServer();

      // Fase 2: Descubrimiento de endpoints de API
      await this.discoverApiEndpoints();

      // Fase 3: Análisis de vulnerabilidades
      await this.analyzeVulnerabilities();

      // Fase 4: Análisis de headers de seguridad
      await this.analyzeSecurityHeaders();

      // Fase 5: Generar reporte de seguridad
      await this.generateSecurityReport();
    } catch (error) {
      console.error(`❌ Error crítico: ${error.message}`.red);
      throw error;
    }
  }

  async analyzeMainServer() {
    console.log("🌐 Analizando servidor principal...".blue);

    try {
      const response = await this.makeRequest("/");

      // Extraer información del servidor
      this.results.serverInfo = {
        server: response.headers.server || "No identificado",
        poweredBy: response.headers["x-powered-by"] || "No identificado",
        statusCode: response.statusCode,
        contentType: response.headers["content-type"] || "No especificado",
        responseTime: response.responseTime,
      };

      // Detectar tecnologías
      this.detectTechnologies(response.headers, response.body);

      console.log(`✅ Servidor: ${this.results.serverInfo.server}`.green);
      console.log(`⚡ Tecnología: ${this.results.serverInfo.poweredBy}`.green);
    } catch (error) {
      console.log(`⚠️  Error conectando al servidor: ${error.message}`.yellow);
      this.results.vulnerabilities.push({
        type: "connection",
        severity: "medium",
        description:
          "Error de conexión podría indicar configuración incorrecta",
        details: error.message,
      });
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
            authentication: this.checkAuthentication(response.headers),
            exposedData: this.analyzeExposedData(
              response.body,
              response.headers
            ),
          };

          foundEndpoints.push(endpoint);
          console.log(`📍 Encontrado: ${path} [${response.statusCode}]`.green);

          // Buscar vulnerabilidades específicas del endpoint
          this.analyzeEndpointVulnerabilities(endpoint);
        }
      } catch (error) {
        // Ignorar errores de conexión para paths específicos
      }
    }

    this.results.apiEndpoints = foundEndpoints;
    console.log(`📊 Total endpoints encontrados: ${foundEndpoints.length}`);
  }

  async analyzeVulnerabilities() {
    console.log("\n🚨 Analizando vulnerabilidades de seguridad...".red);

    // Verificar vulnerabilidades del servidor
    this.checkServerVulnerabilities();

    // Verificar configuraciones inseguras
    this.checkInsecureConfigurations();

    // Verificar exposición de información sensible
    await this.checkInformationDisclosure();

    // Verificar métodos HTTP peligrosos
    await this.checkDangerousHttpMethods();

    console.log(
      `🛡️  Vulnerabilidades detectadas: ${this.results.vulnerabilities.length}`
    );
  }

  async analyzeSecurityHeaders() {
    console.log("\n🔒 Analizando headers de seguridad...".blue);

    try {
      const response = await this.makeRequest("/");
      const securityHeaders = {
        "strict-transport-security":
          response.headers["strict-transport-security"],
        "content-security-policy": response.headers["content-security-policy"],
        "x-frame-options": response.headers["x-frame-options"],
        "x-content-type-options": response.headers["x-content-type-options"],
        "x-xss-protection": response.headers["x-xss-protection"],
        "referrer-policy": response.headers["referrer-policy"],
      };

      this.results.securityHeaders = securityHeaders;
      this.analyzeMissingSecurityHeaders(securityHeaders);
    } catch (error) {
      console.log(`⚠️  Error analizando headers: ${error.message}`.yellow);
    }
  }

  checkServerVulnerabilities() {
    const server = this.results.serverInfo.server.toLowerCase();
    const poweredBy = this.results.serverInfo.poweredBy.toLowerCase();

    // Verificar versiones obsoletas
    const vulnerableVersions = {
      apache: ["2.2", "2.0"],
      nginx: ["1.0", "1.2"],
      php: ["5.", "7.0", "7.1"],
      express: ["3.", "4.0", "4.1"],
    };

    Object.entries(vulnerableVersions).forEach(([tech, versions]) => {
      if (server.includes(tech) || poweredBy.includes(tech)) {
        versions.forEach((version) => {
          if (server.includes(version) || poweredBy.includes(version)) {
            this.results.vulnerabilities.push({
              type: "outdated_software",
              severity: "high",
              description: `Versión obsoleta de ${tech} detectada`,
              details: `${tech} ${version} tiene vulnerabilidades conocidas`,
              recommendation: `Actualizar ${tech} a la última versión estable`,
            });
          }
        });
      }
    });

    // Verificar información excesiva del servidor
    if (
      this.results.serverInfo.server !== "No identificado" &&
      this.results.serverInfo.server.includes("/")
    ) {
      this.results.vulnerabilities.push({
        type: "information_disclosure",
        severity: "low",
        description: "Servidor expone información de versión",
        details: `Server header: ${this.results.serverInfo.server}`,
        recommendation:
          "Configurar servidor para ocultar información detallada",
      });
    }
  }

  checkInsecureConfigurations() {
    // Verificar si usa HTTPS
    if (this.target.protocol === "http:") {
      this.results.vulnerabilities.push({
        type: "insecure_transport",
        severity: "high",
        description: "Sitio no usa HTTPS",
        details: "Comunicación sin cifrar expone datos sensibles",
        recommendation: "Implementar HTTPS con certificado SSL/TLS válido",
      });
    }
  }

  async checkInformationDisclosure() {
    const sensitivePaths = [
      "/.env",
      "/config.php",
      "/wp-config.php",
      "/settings.py",
      "/package.json",
      "/composer.json",
      "/README.md",
      "/phpinfo.php",
      "/info.php",
      "/test.php",
    ];

    for (const path of sensitivePaths) {
      try {
        const response = await this.makeRequest(path);

        if (response.statusCode === 200) {
          this.results.vulnerabilities.push({
            type: "information_disclosure",
            severity: "high",
            description: `Archivo sensible expuesto: ${path}`,
            details: `Archivo accesible públicamente con código ${response.statusCode}`,
            recommendation: `Bloquear acceso público a ${path}`,
          });
        }
      } catch (error) {
        // Ignorar errores de conexión
      }
    }
  }

  async checkDangerousHttpMethods() {
    const dangerousMethods = ["PUT", "DELETE", "PATCH", "TRACE", "OPTIONS"];

    for (const method of dangerousMethods) {
      try {
        const response = await this.makeRequest("/", method);

        if (response.statusCode !== 405 && response.statusCode !== 501) {
          this.results.vulnerabilities.push({
            type: "dangerous_http_methods",
            severity: "medium",
            description: `Método HTTP ${method} habilitado`,
            details: `Servidor responde a ${method} con código ${response.statusCode}`,
            recommendation: `Deshabilitar método ${method} si no es necesario`,
          });
        }
      } catch (error) {
        // Ignorar errores de conexión
      }
    }
  }

  analyzeMissingSecurityHeaders(headers) {
    const requiredHeaders = {
      "strict-transport-security": {
        severity: "high",
        description:
          "Header HSTS faltante - sitio vulnerable a downgrade attacks",
      },
      "content-security-policy": {
        severity: "medium",
        description: "Header CSP faltante - sitio vulnerable a XSS",
      },
      "x-frame-options": {
        severity: "medium",
        description:
          "Header X-Frame-Options faltante - sitio vulnerable a clickjacking",
      },
      "x-content-type-options": {
        severity: "low",
        description:
          "Header X-Content-Type-Options faltante - sitio vulnerable a MIME sniffing",
      },
    };

    Object.entries(requiredHeaders).forEach(([header, config]) => {
      if (!headers[header]) {
        this.results.vulnerabilities.push({
          type: "missing_security_header",
          severity: config.severity,
          description: config.description,
          details: `Header '${header}' no encontrado`,
          recommendation: `Implementar header ${header}`,
        });
      }
    });
  }

  analyzeEndpointVulnerabilities(endpoint) {
    // Verificar endpoints de administración sin autenticación
    if (
      endpoint.path.includes("admin") &&
      endpoint.status === 200 &&
      !endpoint.authentication
    ) {
      this.results.vulnerabilities.push({
        type: "admin_exposure",
        severity: "critical",
        description: `Panel de administración expuesto: ${endpoint.path}`,
        details: "Panel administrativo accesible sin autenticación",
        recommendation: "Implementar autenticación robusta para panel admin",
      });
    }

    // Verificar APIs sin autenticación
    if (
      endpoint.path.includes("api") &&
      endpoint.status === 200 &&
      !endpoint.authentication
    ) {
      this.results.vulnerabilities.push({
        type: "api_exposure",
        severity: "high",
        description: `API expuesta sin autenticación: ${endpoint.path}`,
        details: "Endpoint de API accesible públicamente",
        recommendation: "Implementar autenticación para APIs",
      });
    }

    // Verificar exposición de datos sensibles
    if (endpoint.exposedData.length > 0) {
      this.results.vulnerabilities.push({
        type: "data_exposure",
        severity: "high",
        description: `Datos sensibles expuestos en ${endpoint.path}`,
        details: `Datos encontrados: ${endpoint.exposedData.join(", ")}`,
        recommendation: "Filtrar datos sensibles en respuestas de API",
      });
    }
  }

  checkAuthentication(headers) {
    return headers["www-authenticate"] ||
      headers["authorization"] ||
      headers["set-cookie"]
      ? true
      : false;
  }

  analyzeExposedData(body, headers) {
    const exposedData = [];

    if (!body) return exposedData;

    const bodyStr = body.toString().toLowerCase();

    // Buscar patrones de datos sensibles
    const sensitivePatterns = {
      passwords: /password["\s]*[:=]["\s]*[^",\s}]+/gi,
      api_keys: /api[_-]?key["\s]*[:=]["\s]*[^",\s}]+/gi,
      tokens: /token["\s]*[:=]["\s]*[^",\s}]+/gi,
      secrets: /secret["\s]*[:=]["\s]*[^",\s}]+/gi,
      database: /database|db_|mysql|postgres/gi,
      emails: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/gi,
    };

    Object.entries(sensitivePatterns).forEach(([type, pattern]) => {
      if (pattern.test(bodyStr)) {
        exposedData.push(type);
      }
    });

    return exposedData;
  }

  detectTechnologies(headers, body) {
    const technologies = [];

    // Detectar por headers
    const headerTech = {
      "x-powered-by": headers["x-powered-by"],
      server: headers.server,
      "x-aspnet-version": headers["x-aspnet-version"] ? "ASP.NET" : null,
      "x-generator": headers["x-generator"],
    };

    Object.values(headerTech).forEach((tech) => {
      if (tech) technologies.push(tech);
    });

    // Detectar por contenido
    if (body) {
      const bodyStr = body.toString();
      const contentTech = {
        WordPress: /wp-content|wp-includes/i.test(bodyStr),
        Drupal: /drupal/i.test(bodyStr),
        React: /react/i.test(bodyStr),
        Angular: /angular/i.test(bodyStr),
        jQuery: /jquery/i.test(bodyStr),
      };

      Object.entries(contentTech).forEach(([tech, detected]) => {
        if (detected) technologies.push(tech);
      });
    }

    this.results.technologies = [...new Set(technologies)];
  }

  calculateRiskLevel() {
    const criticalVulns = this.results.vulnerabilities.filter(
      (v) => v.severity === "critical"
    ).length;
    const highVulns = this.results.vulnerabilities.filter(
      (v) => v.severity === "high"
    ).length;
    const mediumVulns = this.results.vulnerabilities.filter(
      (v) => v.severity === "medium"
    ).length;

    if (criticalVulns > 0) return "CRITICAL";
    if (highVulns >= 3) return "HIGH";
    if (highVulns > 0 || mediumVulns >= 5) return "MEDIUM";
    if (mediumVulns > 0) return "LOW";
    return "MINIMAL";
  }

  generateRecommendations() {
    const recommendations = [
      "🔒 Implementar HTTPS con certificados válidos",
      "🛡️  Configurar headers de seguridad (HSTS, CSP, X-Frame-Options)",
      "🔐 Implementar autenticación robusta para APIs y paneles admin",
      "🚫 Ocultar información del servidor en headers HTTP",
      "📋 Realizar auditorías de seguridad regulares",
      "🔄 Mantener software y dependencias actualizadas",
      "📊 Implementar logging y monitoreo de seguridad",
      "🚪 Configurar firewall y limitación de rate limiting",
    ];

    // Recomendaciones específicas basadas en vulnerabilidades
    const specificRecommendations = this.results.vulnerabilities
      .map((vuln) => vuln.recommendation)
      .filter((rec, index, arr) => arr.indexOf(rec) === index);

    return [...recommendations, ...specificRecommendations];
  }

  async generateSecurityReport() {
    this.results.riskLevel = this.calculateRiskLevel();
    this.results.recommendations = this.generateRecommendations();

    console.log("\n" + "═".repeat(60).gray);
    console.log("📋 REPORTE DE SEGURIDAD".red.bold);
    console.log("═".repeat(60).gray);

    // Resumen ejecutivo
    console.log("\n🎯 RESUMEN EJECUTIVO".cyan.bold);
    console.log(`🌐 Objetivo: ${this.target.hostname.replace(/^www\./i, "")}`);
    console.log(
      `⚠️  Nivel de Riesgo: ${this.getRiskColor(this.results.riskLevel)}`
    );
    console.log(`🔍 Vulnerabilidades: ${this.results.vulnerabilities.length}`);
    console.log(`📍 Endpoints: ${this.results.apiEndpoints.length}`);
    console.log(
      `🔧 Tecnologías: ${this.results.technologies.join(", ") || "No identificadas"}`
    );

    // Vulnerabilidades por severidad
    console.log("\n🚨 VULNERABILIDADES POR SEVERIDAD".red.bold);
    const severityCount = this.countBySeverity();
    console.log(`🔴 Críticas: ${severityCount.critical}`);
    console.log(`🟠 Altas: ${severityCount.high}`);
    console.log(`🟡 Medias: ${severityCount.medium}`);
    console.log(`🟢 Bajas: ${severityCount.low}`);

    // Top vulnerabilidades
    console.log("\n⚠️  TOP VULNERABILIDADES".yellow.bold);
    this.results.vulnerabilities
      .sort(
        (a, b) =>
          this.getSeverityScore(b.severity) - this.getSeverityScore(a.severity)
      )
      .slice(0, 10)
      .forEach((vuln, index) => {
        console.log(
          `${index + 1}. [${vuln.severity.toUpperCase()}] ${vuln.description}`
        );
        console.log(`   💡 ${vuln.recommendation}`);
      });

    // Endpoints encontrados
    if (this.results.apiEndpoints.length > 0) {
      console.log("\n📍 ENDPOINTS CRÍTICOS".blue.bold);
      this.results.apiEndpoints
        .filter((ep) => ep.path.includes("admin") || ep.path.includes("api"))
        .slice(0, 5)
        .forEach((endpoint) => {
          console.log(`🔗 ${endpoint.path} [${endpoint.status}]`);
          console.log(`   🔐 Auth: ${endpoint.authentication ? "Sí" : "No"}`);
          if (endpoint.exposedData.length > 0) {
            console.log(
              `   ⚠️  Datos expuestos: ${endpoint.exposedData.join(", ")}`
            );
          }
        });
    }

    // Recomendaciones principales
    console.log("\n💡 RECOMENDACIONES PRIORITARIAS".green.bold);
    this.results.recommendations.slice(0, 8).forEach((rec, index) => {
      console.log(`${index + 1}. ${rec}`);
    });

    // Guardar reporte completo
    await this.saveDetailedReport();

    console.log("\n" + "═".repeat(60).gray);
    console.log(
      `✅ Informe guardado en report/${this.target.hostname.replace(/^www\./i, "")}.json`
        .green
    );
  }

  countBySeverity() {
    return {
      critical: this.results.vulnerabilities.filter(
        (v) => v.severity === "critical"
      ).length,
      high: this.results.vulnerabilities.filter((v) => v.severity === "high")
        .length,
      medium: this.results.vulnerabilities.filter(
        (v) => v.severity === "medium"
      ).length,
      low: this.results.vulnerabilities.filter((v) => v.severity === "low")
        .length,
    };
  }

  getSeverityScore(severity) {
    const scores = { critical: 4, high: 3, medium: 2, low: 1 };
    return scores[severity] || 0;
  }

  getRiskColor(level) {
    const colors = {
      CRITICAL: level.red.bold,
      HIGH: level.red,
      MEDIUM: level.yellow,
      LOW: level.green,
      MINIMAL: level.green.bold,
    };
    return colors[level] || level;
  }

  async saveDetailedReport() {
    const report = {
      metadata: {
        target: this.target.origin,
        timestamp: new Date().toISOString(),
        analyzer: "Security API Analyzer v2.0",
        riskLevel: this.results.riskLevel,
      },
      executive_summary: {
        total_vulnerabilities: this.results.vulnerabilities.length,
        risk_level: this.results.riskLevel,
        endpoints_found: this.results.apiEndpoints.length,
        technologies_detected: this.results.technologies,
      },
      server_information: this.results.serverInfo,
      security_headers: this.results.securityHeaders,
      vulnerabilities: this.results.vulnerabilities,
      api_endpoints: this.results.apiEndpoints,
      recommendations: this.results.recommendations,
    };

    try {
      const filePath = path.join(
        "report",
        `${this.target.hostname.replace(/^www\./i, "")}.json`
      );
      await fs.mkdir("report", { recursive: true });
      await fs.writeFile(filePath, JSON.stringify(report, null, 2));
    } catch (error) {
      console.log(`⚠️  Error guardando reporte: ${error.message}`.yellow);
    }
  }

  async makeRequest(path, method = "GET") {
    return new Promise((resolve, reject) => {
      const url = new URL(path, this.target.origin);
      const client = url.protocol === "https:" ? https : http;

      const startTime = Date.now();

      const options = {
        hostname: url.hostname,
        port: url.port,
        path: url.pathname + url.search,
        method: method,
        timeout: 10000,
        headers: {
          "User-Agent": "Security-Analyzer/2.0",
          Accept: "*/*",
          Connection: "close",
        },
      };

      const req = client.request(options, (res) => {
        let body = "";

        res.on("data", (chunk) => {
          body += chunk;
        });

        res.on("end", () => {
          resolve({
            statusCode: res.statusCode,
            headers: res.headers,
            body: body,
            responseTime: Date.now() - startTime,
          });
        });
      });

      req.on("error", reject);
      req.on("timeout", () => {
        req.destroy();
        reject(new Error("Request timeout"));
      });

      req.end();
    });
  }
}

// Función principal
async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.log("Uso: node security-analyzer.js <URL>".yellow);
    console.log("Ejemplo: node security-analyzer.js https://ejemplo.com".gray);
    process.exit(1);
  }

  let targetUrl = args[0];

  // Agregar https:// si no tiene protocolo
  if (!targetUrl.startsWith("http://") && !targetUrl.startsWith("https://")) {
    targetUrl = "https://" + targetUrl;
  }

  const analyzer = new Network_Analyzer();

  try {
    await analyzer.analyze(targetUrl);
  } catch (error) {
    console.error(`❌ Error fatal: ${error.message}`.red);
    process.exit(1);
  }
}

// Ejecutar si es llamado directamente
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { Network_Analyzer };
