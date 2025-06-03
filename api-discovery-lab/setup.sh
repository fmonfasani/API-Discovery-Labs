
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
