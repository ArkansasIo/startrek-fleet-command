# Star Trek MMORPG Database Setup Script
# This script helps set up PostgreSQL database for the game

Write-Host "============================================" -ForegroundColor Cyan
Write-Host "Star Trek MMORPG Database Setup" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

# Check if PostgreSQL is installed
$psqlPath = Get-Command psql -ErrorAction SilentlyContinue

if (-not $psqlPath) {
    Write-Host "PostgreSQL is not installed or not in PATH." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "To install PostgreSQL:" -ForegroundColor Yellow
    Write-Host "1. Download from: https://www.postgresql.org/download/windows/" -ForegroundColor White
    Write-Host "2. Or use Chocolatey: choco install postgresql" -ForegroundColor White
    Write-Host "3. Or use Winget: winget install PostgreSQL.PostgreSQL" -ForegroundColor White
    Write-Host ""
    Write-Host "After installation, add PostgreSQL bin directory to PATH and restart this script." -ForegroundColor Yellow
    Write-Host ""
    
    # Alternative: Docker setup
    Write-Host "ALTERNATIVE: Use Docker (recommended for development)" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Run this command to start PostgreSQL in Docker:" -ForegroundColor White
    Write-Host 'docker run --name startrek-postgres -e POSTGRES_PASSWORD=new_ass12worda_ -e POSTGRES_DB=startrek_mmorpg -p 5432:5432 -d postgres:15' -ForegroundColor Green
    Write-Host ""
    Write-Host "Then run this script again to initialize the schema." -ForegroundColor White
    exit 1
}

Write-Host "PostgreSQL found: $($psqlPath.Source)" -ForegroundColor Green
Write-Host ""

# Read database configuration from .env
$envFile = ".env"
if (Test-Path $envFile) {
    Write-Host "Reading configuration from .env file..." -ForegroundColor Yellow
    $dbHost = "localhost"
    $dbPort = "5432"
    $dbName = "startrek_mmorpg"
    $dbUser = "postgres"
    $dbPassword = "new_ass12worda_"
    
    Get-Content $envFile | ForEach-Object {
        if ($_ -match "^DB_HOST=(.+)$") { $dbHost = $matches[1] }
        if ($_ -match "^DB_PORT=(.+)$") { $dbPort = $matches[1] }
        if ($_ -match "^DB_NAME=(.+)$") { $dbName = $matches[1] }
        if ($_ -match "^DB_USER=(.+)$") { $dbUser = $matches[1] }
        if ($_ -match "^DB_PASSWORD=(.+)$") { $dbPassword = $matches[1] }
    }
    
    Write-Host "Database Host: $dbHost" -ForegroundColor White
    Write-Host "Database Port: $dbPort" -ForegroundColor White
    Write-Host "Database Name: $dbName" -ForegroundColor White
    Write-Host "Database User: $dbUser" -ForegroundColor White
    Write-Host ""
} else {
    Write-Host "Warning: .env file not found, using defaults" -ForegroundColor Yellow
    $dbHost = "localhost"
    $dbPort = "5432"
    $dbName = "startrek_mmorpg"
    $dbUser = "postgres"
    $dbPassword = "new_ass12worda_"
}

# Set PostgreSQL password environment variable
$env:PGPASSWORD = $dbPassword

Write-Host "Step 1: Checking PostgreSQL server connection..." -ForegroundColor Cyan
$testConnection = & psql -h $dbHost -p $dbPort -U $dbUser -d postgres -c "SELECT version();" 2>&1

if ($LASTEXITCODE -ne 0) {
    Write-Host "Failed to connect to PostgreSQL server!" -ForegroundColor Red
    Write-Host "Error: $testConnection" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please ensure:" -ForegroundColor Yellow
    Write-Host "1. PostgreSQL server is running" -ForegroundColor White
    Write-Host "2. The password in .env matches your PostgreSQL installation" -ForegroundColor White
    Write-Host "3. PostgreSQL is accepting connections on ${dbHost}:${dbPort}" -ForegroundColor White
    Write-Host "" -ForegroundColor White
    Write-Host "To start PostgreSQL service:" -ForegroundColor Yellow
    Write-Host "  net start postgresql-x64-15  (adjust version as needed)" -ForegroundColor White
    exit 1
}

Write-Host "Successfully connected to PostgreSQL server!" -ForegroundColor Green
Write-Host ""

Write-Host "Step 2: Creating database '$dbName'..." -ForegroundColor Cyan
$checkDb = & psql -h $dbHost -p $dbPort -U $dbUser -d postgres -c "SELECT 1 FROM pg_database WHERE datname='$dbName';" -t 2>&1

if ($checkDb -match "1") {
    Write-Host "Database '$dbName' already exists." -ForegroundColor Yellow
    $response = Read-Host "Do you want to drop and recreate it? (yes/no)"
    if ($response -eq "yes") {
        Write-Host "Dropping existing database..." -ForegroundColor Yellow
        & psql -h $dbHost -p $dbPort -U $dbUser -d postgres -c "DROP DATABASE $dbName;" 2>&1 | Out-Null
        & psql -h $dbHost -p $dbPort -U $dbUser -d postgres -c "CREATE DATABASE $dbName;" 2>&1 | Out-Null
        Write-Host "Database recreated!" -ForegroundColor Green
    } else {
        Write-Host "Keeping existing database." -ForegroundColor Yellow
    }
} else {
    & psql -h $dbHost -p $dbPort -U $dbUser -d postgres -c "CREATE DATABASE $dbName;" 2>&1 | Out-Null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Database '$dbName' created successfully!" -ForegroundColor Green
    } else {
        Write-Host "Failed to create database!" -ForegroundColor Red
        exit 1
    }
}
Write-Host ""

Write-Host "Step 3: Initializing database schema..." -ForegroundColor Cyan
$schemaFile = "server\database\schema.sql"

if (-not (Test-Path $schemaFile)) {
    Write-Host "Schema file not found: $schemaFile" -ForegroundColor Red
    exit 1
}

Write-Host "Applying schema from $schemaFile..." -ForegroundColor Yellow
$result = & psql -h $dbHost -p $dbPort -U $dbUser -d $dbName -f $schemaFile 2>&1

if ($LASTEXITCODE -eq 0) {
    Write-Host "Schema applied successfully!" -ForegroundColor Green
} else {
    Write-Host "Warning: Some errors occurred while applying schema:" -ForegroundColor Yellow
    Write-Host $result -ForegroundColor Gray
    Write-Host ""
    Write-Host "Note: Some errors (like 'extension already exists') are normal." -ForegroundColor Yellow
}
Write-Host ""

Write-Host "Step 4: Verifying database setup..." -ForegroundColor Cyan
$tableCount = & psql -h $dbHost -p $dbPort -U $dbUser -d $dbName -c "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema='public';" -t 2>&1

if ($tableCount -match "\d+") {
    $count = $tableCount.Trim()
    Write-Host "Database initialized with $count tables!" -ForegroundColor Green
} else {
    Write-Host "Could not verify table count." -ForegroundColor Yellow
}
Write-Host ""

Write-Host "============================================" -ForegroundColor Cyan
Write-Host "Database Setup Complete!" -ForegroundColor Green
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "You can now start the development server with: pnpm dev" -ForegroundColor White
Write-Host ""

# Clear password from environment
Remove-Item Env:\PGPASSWORD -ErrorAction SilentlyContinue
