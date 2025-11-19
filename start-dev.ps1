# Skrypt do uruchamiania frontendu i backendu jednocześnie

$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $scriptPath

Write-Host "🚀 Uruchamianie serwerów deweloperskich..." -ForegroundColor Green

# Sprawdź czy backend ma środowisko wirtualne
$backendPath = Join-Path $scriptPath "test-backend"
$venvPath = Join-Path $backendPath ".venv"

if (-not (Test-Path $venvPath)) {
    Write-Host "⚠️  Środowisko wirtualne nie istnieje. Tworzenie..." -ForegroundColor Yellow
    Set-Location $backendPath
    python -m venv .venv
    .\.venv\Scripts\Activate.ps1
    pip install -r requirements.txt
    Set-Location $scriptPath
}

# Uruchom backend w osobnym oknie PowerShell
Write-Host "🔧 Uruchamianie backendu FastAPI na porcie 8000..." -ForegroundColor Cyan
$backendScript = @"
Set-Location '$backendPath'
.\.venv\Scripts\Activate.ps1
uvicorn main:app --reload --port 8000
"@

$backendScriptPath = Join-Path $env:TEMP "start-backend.ps1"
$backendScript | Out-File -FilePath $backendScriptPath -Encoding UTF8
Start-Process powershell -ArgumentList "-NoExit", "-ExecutionPolicy", "Bypass", "-File", $backendScriptPath

# Poczekaj chwilę na uruchomienie backendu
Start-Sleep -Seconds 3

# Uruchom frontend
Write-Host "🎨 Uruchamianie frontendu Next.js na porcie 3001..." -ForegroundColor Cyan
Write-Host "💡 Aby zatrzymać serwery, naciśnij Ctrl+C (zatrzyma frontend)" -ForegroundColor Yellow
Write-Host "💡 Backend będzie działał w osobnym oknie - zamknij je ręcznie" -ForegroundColor Yellow
Write-Host ""

$frontendPath = Join-Path $scriptPath "my-app"
Set-Location $frontendPath
npm run dev

