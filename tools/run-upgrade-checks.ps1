# tools/run-upgrade-checks.ps1
# Executa o checklist de verificação do upgrade de dependências (gerar lockfile, instalar, check-deps, build)
# Uso: powershell -ExecutionPolicy Bypass -File .\tools\run-upgrade-checks.ps1 [-RunDev]

param(
    [switch]$RunDev,
    [int]$TimeoutSeconds = 120
)

$log = Join-Path $PSScriptRoot "upgrade-check.log"
"Starting upgrade checks: $(Get-Date)" | Out-File $log -Encoding utf8

function Run($cmd) {
    Write-Output "\n>>> $cmd\n"
    # Executa via cmd para melhor compatibilidade com npm/npx no Windows
    cmd /c "$cmd" 2>&1 | Tee-Object -FilePath $log -Append
    if ($LASTEXITCODE -ne 0) {
        Write-Error "Command failed: $cmd (exit $LASTEXITCODE)"
        exit $LASTEXITCODE
    }
}

function Test-HttpEndpoints($urls) {
    foreach ($u in $urls) {
        try {
            $r = Invoke-WebRequest -Uri $u -UseBasicParsing -TimeoutSec 5 -ErrorAction Stop
            if ($r.StatusCode -eq 200) { return $true }
        } catch {
            # continue
        }
    }
    return $false
}

try {
    Run "npm run generate-lockfile"
    Run "npm install"
    Run "npm run check-deps"

    if ($RunDev) {
        Write-Output "Starting dev server (background) and running a smoke request..." | Tee-Object -FilePath $log -Append
        $devLog = Join-Path $PSScriptRoot "dev-server.log"
        if (Test-Path $devLog) { Remove-Item $devLog -Force }

        # Start dev server and capture output to a log file for diagnostics
        $proc = Start-Process -FilePath "cmd.exe" -ArgumentList "/c npm run dev > `"$devLog`" 2>&1" -WindowStyle Hidden -PassThru

        $timeout = [DateTime]::UtcNow.AddSeconds($TimeoutSeconds)
        $ok = $false
        $triedUrls = @("http://localhost:3000/","http://127.0.0.1:3000/")

        while ([DateTime]::UtcNow -lt $timeout) {
            Start-Sleep -Seconds 2

            # Try to read the dev log for network URLs reported by Vite
            if (Test-Path $devLog) {
                try {
                    $content = Get-Content $devLog -Raw -ErrorAction SilentlyContinue
                    if ($content -match "Local:\s*(https?://[^\s]+)") { $triedUrls += $Matches[1] }
                    if ($content -match "Network:\s*(https?://[^\s]+)") { $triedUrls += $Matches[1] }
                } catch {
                    # ignore read errors
                }
            }

            # shorten to unique urls
            $triedUrls = $triedUrls | Select-Object -Unique

            if (Test-HttpEndpoints $triedUrls) { $ok = $true; break }
        }

        if (-not $ok) {
            Write-Error "Dev server did not respond on expected endpoints within timeout ($TimeoutSeconds s). See $devLog and $log for details." | Tee-Object -FilePath $log -Append
            if ($proc) { Stop-Process -Id $proc.Id -Force }
            exit 1
        }

        Write-Output "Dev server responded OK" | Tee-Object -FilePath $log -Append
        # give some time then stop the dev server
        Start-Sleep -Seconds 1
        if ($proc) { Stop-Process -Id $proc.Id -Force }
    }

    Run "npm run build"
    Write-Output "All checks passed: $(Get-Date)" | Tee-Object -FilePath $log -Append
    exit 0
} catch {
    Write-Error "Upgrade checks failed. See $log for details."
    exit 1
}
