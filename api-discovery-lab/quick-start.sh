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
