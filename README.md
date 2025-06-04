# Enhanced Network API Analyzer

An advanced backend scanner for APIs and web services. Analyze your backend's security, performance, architecture, and scalability with detailed metrics and actionable recommendations.

---

## 🔹 Features

* 🔐 **Security Analysis**

  * Detection of missing security headers.
  * Discovery of publicly exposed sensitive endpoints.
  * Detection of sensitive data leaks (tokens, emails, IPs, API keys).
  * Authentication checks.

* ⚡ **Performance Metrics**

  * Average response time per endpoint.
  * Cache analysis (HIT/MISS rates).
  * Rate limiting headers analysis.
  * Database and cache layer performance metrics.

* 🏢 **Architecture Analysis**

  * Detection of architecture type: Monolith, Microservices, Serverless.
  * API versioning strategy evaluation.
  * Microservices patterns detection (Discovery services, Gateways, Circuit breakers).
  * API Documentation detection (Swagger, OpenAPI).

* 📈 **Scalability Analysis**

  * Load Balancer presence detection.
  * Rate limiting implementation check.
  * Auto-scaling indicators detection (Kubernetes, AWS, Azure, Docker).
  * Deployment build info detection.

* 📊 **Comprehensive Report**

  * Security vulnerabilities summary.
  * Performance scores.
  * Architecture and scalability evaluations.
  * Actionable recommendations.
  * Saves detailed JSON report.

---

## 🔹 Installation

```bash
# Clone the repository
$ git clone https://github.com/yourusername/enhanced-network-analyzer.git

# Navigate to the project folder
$ cd enhanced-network-analyzer

# Install dependencies
$ npm install
```

---

## 🔹 Usage

```bash
# Run the analyzer
$ node enhanced-analyzer.js <URL>

# Example
$ node enhanced-analyzer.js https://api.example.com
```

* The results will be printed in the terminal.
* A full JSON report will be saved in the project folder.

---

## 🔹 Output Example

```bash
🚀 ENHANCED BACKEND ANALYZER
======================================================================
🌍 Target: https://api.example.com

🔐 Security Headers:
  - Strict-Transport-Security: Present
  - Content-Security-Policy: Missing

📊 Performance:
  - Average Response Time: 245 ms
  - Cache HIT Rate: 60%

🏢 Architecture:
  - Type: Microservices
  - API Versioning: Advanced
  - Documentation: Found (Swagger)

📈 Scalability:
  - Load Balancer: Detected
  - Auto-Scaling: Kubernetes Pods Detected

🔹 Vulnerabilities:
  - Information Disclosure at /api/v1/users

👀 Recommendations:
  - Implement missing security headers.
  - Optimize database connection pool.

💾 Report saved as: backend-analysis-api-example-com-2024-06-04T12-00-00.json
```

---

## 🔹 License

MIT License.

---

## 🔹 Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

---

## 🔹 Author

Developed by \fmonfasani.

---

## 🔹 TODO

* Add CORS policy analyzer.
* Add WAF (Web Application Firewall) detection.
* Add SSL/TLS certificate analysis.
* Add automated load testing.

