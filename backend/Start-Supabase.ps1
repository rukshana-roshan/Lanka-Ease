param([switch]$CheckConnection)

$ErrorActionPreference = 'Stop'
$envPath = Join-Path $PSScriptRoot '.env'
if (!(Test-Path -LiteralPath $envPath)) { throw 'Missing backend/.env. Copy .env.example and fill it in locally.' }
$allowedKeys = @('SPRING_PROFILES_ACTIVE','DATABASE_URL','DB_USERNAME','DB_PASSWORD',
    'DB_SSL_ROOT_CERT','JWT_SECRET','DB_MIGRATIONS_ENABLED','CORS_ALLOWED_ORIGINS',
    'PASSWORD_RESET_RESEND_API_KEY','PASSWORD_RESET_FROM','PASSWORD_RESET_FRONTEND_URL')
foreach ($line in [IO.File]::ReadAllLines($envPath)) {
    if ($line.Trim() -eq '' -or $line.TrimStart().StartsWith('#')) { continue }
    $pair = $line.Split('=', 2)
    if ($pair.Length -ne 2 -or $pair[0].Trim() -notin $allowedKeys) {
        throw 'Unexpected entry in backend/.env; use only the documented keys.'
    }
    $value = $pair[1].Trim()
    if ($value.Length -ge 2 -and (($value.StartsWith('"') -and $value.EndsWith('"')) -or
            ($value.StartsWith("'") -and $value.EndsWith("'")))) {
        $value = $value.Substring(1, $value.Length - 2)
    }
    [Environment]::SetEnvironmentVariable($pair[0].Trim(), $value, 'Process')
}
$requiredKeys = @('DATABASE_URL','DB_USERNAME','DB_PASSWORD','DB_SSL_ROOT_CERT','JWT_SECRET')
$missingKeys = @($requiredKeys | Where-Object { [string]::IsNullOrWhiteSpace([Environment]::GetEnvironmentVariable($_, 'Process')) })
if ($missingKeys.Count -gt 0) { throw ('Configure these variables in backend/.env: ' + ($missingKeys -join ', ')) }
if (!(Test-Path -LiteralPath $env:DB_SSL_ROOT_CERT -PathType Leaf)) {
    throw 'DB_SSL_ROOT_CERT must point to an existing Supabase CA certificate file.'
}
# This helper never seeds development data or runs migrations against Supabase.
$env:SPRING_PROFILES_ACTIVE = 'prod'
$env:DB_MIGRATIONS_ENABLED = 'false'
Push-Location $PSScriptRoot
$previousOptIn = $env:RUN_SUPABASE_CONNECTION_CHECK
try {
    if ($CheckConnection) {
        $env:RUN_SUPABASE_CONNECTION_CHECK = 'true'
        & mvn.cmd '-Dtest=SupabaseConnectionTest' test
    } else {
        & mvn.cmd spring-boot:run '-Dspring-boot.run.profiles=prod'
    }
    if ($LASTEXITCODE -ne 0) { throw 'Backend command failed. See SUPABASE_SETUP.md for troubleshooting.' }
} finally {
    $env:RUN_SUPABASE_CONNECTION_CHECK = $previousOptIn
    Pop-Location
}
