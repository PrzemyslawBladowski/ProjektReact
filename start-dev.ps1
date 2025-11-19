# Skrypt do uruchamiania frontendu i backendu jednoczesnie

$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $scriptPath

Write-Host "Uruchamianie serwerow deweloperskich..." -ForegroundColor Green

# Sprawdz czy backend ma srodowisko wirtualne
$backendPath = Join-Path $scriptPath "test-backend"
$venvPath = Join-Path $backendPath ".venv"

if (-not (Test-Path $venvPath)) {
    Write-Host "Srodowisko wirtualne nie istnieje. Tworzenie..." -ForegroundColor Yellow
    Set-Location $backendPath
    python -m venv .venv
    .\.venv\Scripts\Activate.ps1
    pip install -r requirements.txt
    Set-Location $scriptPath
}

# Uruchom backend w osobnym oknie PowerShell
Write-Host "Uruchamianie backendu FastAPI na porcie 8000..." -ForegroundColor Cyan
$backendScriptPath = Join-Path $env:TEMP "start-backend.ps1"
$backendScriptContent = "Set-Location '$backendPath'`n.\.venv\Scripts\Activate.ps1`nuvicorn main:app --reload --port 8000"
[System.IO.File]::WriteAllText($backendScriptPath, $backendScriptContent, [System.Text.Encoding]::UTF8)
Start-Process powershell -ArgumentList "-NoExit", "-ExecutionPolicy", "Bypass", "-File", $backendScriptPath

# Poczekaj chwile na uruchomienie backendu
Start-Sleep -Seconds 3

# Uruchom frontend
Write-Host "Uruchamianie frontendu Next.js na porcie 3001..." -ForegroundColor Cyan
Write-Host "Aby zatrzymac serwery, nacisnij Ctrl+C (zatrzyma frontend)" -ForegroundColor Yellow
Write-Host "Backend bedzie dzialal w osobnym oknie - zamknij je recznie" -ForegroundColor Yellow
Write-Host ""

$frontendPath = Join-Path $scriptPath "my-app"
Set-Location $frontendPath
npm run dev
