$ErrorActionPreference = 'Stop'
if (-not (Test-Path '.env')) {
  if (-not (Test-Path '.env.example')) { throw 'No se encontró .env.example' }
  Copy-Item '.env.example' '.env'
  Write-Host 'Se creó .env. Edita DATABASE_URL y SESSION_SECRET antes de continuar.' -ForegroundColor Yellow
  exit 1
}
if (-not (Test-Path 'node_modules')) {
  npm install
  if ($LASTEXITCODE -ne 0) { throw 'Falló npm install' }
}
npm run db:generate
if ($LASTEXITCODE -ne 0) { throw 'Falló la generación de Prisma Client' }
npm run dev
