# Script de Build y Deploy para WPOS
# Uso: .\build-and-package.ps1 [-NoBuild] [-SkipFrontend] [-SkipBackend]
param(
    [switch]$NoBuild,
    [switch]$SkipFrontend,
    [switch]$SkipBackend
)

$ErrorActionPreference = "Stop"

Write-Host "======================================================" -ForegroundColor Cyan
Write-Host "   WPOS - Build & Deploy al VPS" -ForegroundColor Cyan
Write-Host "======================================================" -ForegroundColor Cyan

# -- Configuracion --------------------------------------------
$projectRoot  = $PSScriptRoot                          # Raiz del proyecto
$deployDir    = Join-Path $projectRoot "DEPLOY_PACKAGE"
$zipFile      = Join-Path $projectRoot "deploy_package.zip"
$serverFolder = "wpos"                                 # Carpeta en el VPS
$vpsUser      = "weimars"
$vpsIp        = "2.58.80.90"
$vpsFullPath  = "/home/$vpsUser/$serverFolder"
$appPort      = 3037

Write-Host ""
Write-Host "Configuracion:" -ForegroundColor Gray
Write-Host "  Proyecto local : $projectRoot"
Write-Host "  Destino VPS    : $vpsUser@$vpsIp`:$vpsFullPath"
Write-Host "  Puerto app     : $appPort"
Write-Host ""

# -- 1. Limpiar artefactos anteriores --------------------------
Write-Host "[1/5] Limpiando artefactos anteriores..." -ForegroundColor Yellow
if (Test-Path $deployDir) { Remove-Item -Recurse -Force $deployDir }
if (Test-Path $zipFile)   { Remove-Item -Force $zipFile }
New-Item -ItemType Directory -Path $deployDir | Out-Null

# -- 2. Builds en paralelo -------------------------------------
if (-not $NoBuild) {
    Write-Host "[2/5] Construyendo aplicacion..." -ForegroundColor Yellow

    $jobs = @()

    if (-not $SkipFrontend) {
        Write-Host "  -> Lanzando build de Frontend (Quasar)..."
        $frontendPath = Join-Path $projectRoot "frontend"
        $jobs += Start-Job -Name "FrontendBuild" -ScriptBlock {
            param($path)
            Set-Location $path
            npm run build 2>&1
        } -ArgumentList $frontendPath
    }

    if (-not $SkipBackend) {
        Write-Host "  -> Lanzando build de Backend (NestJS)..."
        $backendPath = Join-Path $projectRoot "backend"
        $jobs += Start-Job -Name "BackendBuild" -ScriptBlock {
            param($path)
            Set-Location $path
            npm run build 2>&1
        } -ArgumentList $backendPath
    }

    if ($jobs.Count -gt 0) {
        Write-Host "  Esperando que terminen los builds..." -ForegroundColor Gray
        $null = Wait-Job $jobs

        $failed = $false
        foreach ($job in $jobs) {
            $output = Receive-Job $job -ErrorAction SilentlyContinue
            if ($job.State -eq 'Completed') {
                Write-Host "  [OK] $($job.Name) completado." -ForegroundColor Green
            } else {
                Write-Host "  [ERROR] $($job.Name) fallo (Estado: $($job.State)):" -ForegroundColor Red
                Write-Host $output -ForegroundColor DarkRed
                $failed = $true
            }
            Remove-Job $job
        }

        if ($failed) {
            Write-Host "`nAbortando: uno o mas builds fallaron." -ForegroundColor Red
            exit 1
        }
    }
} else {
    Write-Host '[2/5] Build omitido (--NoBuild).' -ForegroundColor Magenta
}

# -- 3. Ensamblar paquete ---------------------------------------
Write-Host "[3/5] Ensamblando paquete de despliegue..." -ForegroundColor Yellow

# Backend compilado
$backendDist = Join-Path $projectRoot "backend\dist"
if (-not (Test-Path $backendDist)) {
    Write-Host "ERROR: No se encontro backend\dist. ¿Corriste el build?" -ForegroundColor Red
    exit 1
}
$deployBackend = Join-Path $deployDir "backend"
New-Item -ItemType Directory -Path "$deployBackend\dist" -Force | Out-Null
Copy-Item -Path "$backendDist\*" -Destination "$deployBackend\dist" -Recurse -Force
Copy-Item -Path (Join-Path $projectRoot "backend\package.json")      -Destination "$deployBackend\" -Force
Copy-Item -Path (Join-Path $projectRoot "backend\package-lock.json") -Destination "$deployBackend\" -Force

# Backend .env de produccion (si existe backend\.env.production, usalo; si no, el .env)
$envProd = Join-Path $projectRoot "backend\.env.production"
$envDev  = Join-Path $projectRoot "backend\.env"
if (Test-Path $envProd) {
    Copy-Item -Path $envProd -Destination "$deployBackend\.env" -Force
    Write-Host "  -> Usando .env.production para el VPS"
} elseif (Test-Path $envDev) {
    Copy-Item -Path $envDev -Destination "$deployBackend\.env" -Force
    Write-Host "  -> Usando .env para el VPS (considera crear .env.production)"
}

# Carpeta uploads (vacia para el primer deploy si no existe)
New-Item -ItemType Directory -Path "$deployBackend\uploads" -Force | Out-Null

# Frontend construido (Quasar genera en frontend/dist/spa)
$frontendSpa = Join-Path $projectRoot "frontend\dist\spa"
if (-not (Test-Path $frontendSpa)) {
    Write-Host "ERROR: No se encontro frontend\dist\spa. ¿Corriste el build del frontend?" -ForegroundColor Red
    exit 1
}
$deployFrontend = Join-Path $deployDir "frontend\dist\spa"
New-Item -ItemType Directory -Path $deployFrontend -Force | Out-Null
Copy-Item -Path "$frontendSpa\*" -Destination $deployFrontend -Recurse -Force

# ecosystem.config.cjs y package.json raiz para PM2
Copy-Item -Path (Join-Path $projectRoot "ecosystem.config.cjs") -Destination "$deployDir\" -Force

# package.json raiz minimo (solo para que PM2 sepa el entorno)
@"
{ "name": "wpos", "version": "1.0.0", "private": true }
"@ | Set-Content -Path "$deployDir\package.json" -Encoding UTF8

Write-Host "  [OK] Paquete ensamblado en $deployDir" -ForegroundColor Green

# -- 4. Comprimir ----------------------------------------------
Write-Host "[4/5] Comprimiendo paquete..." -ForegroundColor Yellow
Compress-Archive -Path "$deployDir\*" -DestinationPath $zipFile -Force
$zipSize = [math]::Round((Get-Item $zipFile).Length / 1MB, 2)
Write-Host "  [OK] ZIP creado: $zipFile ($zipSize MB)" -ForegroundColor Green

# -- 5. Transferir y desplegar en el VPS -----------------------
Write-Host "[5/5] Transfiriendo y desplegando en el VPS..." -ForegroundColor Yellow

Write-Host "  -> Subiendo $zipFile al VPS..."
scp $zipFile "$vpsUser@$vpsIp`:/home/$vpsUser/deploy_package.zip"
if ($LASTEXITCODE -ne 0) { Write-Host "ERROR en SCP" -ForegroundColor Red; exit 1 }

Write-Host "  -> Ejecutando despliegue remoto..."
$remoteCmds = @"
set -e

echo '--- Preparando directorio y permisos ---'
mkdir -p $vpsFullPath
chmod -R 755 $vpsFullPath 2>/dev/null || true

echo '--- Extrayendo paquete ---'
unzip -q -o /home/$vpsUser/deploy_package.zip -d $vpsFullPath
rm -f /home/$vpsUser/deploy_package.zip
chmod -R 755 $vpsFullPath

echo '--- Instalando dependencias del backend ---'
cd $vpsFullPath/backend
npm install --omit=dev

echo '--- Recargando PM2 ---'
cd $vpsFullPath
pm2 reload ecosystem.config.cjs --update-env || pm2 start ecosystem.config.cjs
pm2 save

echo '--- !Despliegue completado! ---'
echo "App corriendo en http://$vpsIp`:$appPort"
"@

# Limpiar retornos de carro para evitar ^M en Linux
$remoteCmds = $remoteCmds -replace "`r", ""

ssh "$vpsUser@$vpsIp" $remoteCmds

# -- Limpieza local --------------------------------------------
if (Test-Path $zipFile)   { Remove-Item -Force $zipFile }
if (Test-Path $deployDir) { Remove-Item -Recurse -Force $deployDir }

Write-Host ""
Write-Host "======================================================" -ForegroundColor Cyan
Write-Host "  !DESPLIEGUE COMPLETADO EXITOSAMENTE!" -ForegroundColor Green
Write-Host "  URL: http://$vpsIp`:$appPort" -ForegroundColor Green
Write-Host "======================================================" -ForegroundColor Cyan
