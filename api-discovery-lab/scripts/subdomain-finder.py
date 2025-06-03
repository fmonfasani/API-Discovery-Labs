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
