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
