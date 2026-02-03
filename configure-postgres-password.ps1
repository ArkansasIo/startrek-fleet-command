# PostgreSQL Password Setup - Interactive
# This script will help set up the database with the correct password

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "PostgreSQL Password Configuration" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "The .env file expects password: new_ass12worda_" -ForegroundColor Yellow
Write-Host ""
Write-Host "Please choose an option:" -ForegroundColor White
Write-Host "1. I know my current PostgreSQL password (I'll enter it)" -ForegroundColor White
Write-Host "2. Try common default passwords" -ForegroundColor White
Write-Host "3. Reset password (requires admin privileges)" -ForegroundColor White
Write-Host ""

$choice = Read-Host "Enter choice (1-3)"

if ($choice -eq "1") {
    Write-Host ""
    $currentPassword = Read-Host "Enter your current PostgreSQL password" -AsSecureString
    $currentPasswordPlain = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto([System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($currentPassword))
    
    # Test current password
    Write-Host "Testing connection..." -ForegroundColor Yellow
    $env:PGPASSWORD = $currentPasswordPlain
    $testResult = & "C:\Program Files\PostgreSQL\15\bin\psql.exe" -U postgres -c "SELECT 1;" 2>&1
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Connection successful!" -ForegroundColor Green
        Write-Host "Now changing password to match .env file..." -ForegroundColor Yellow
        
        $result = & "C:\Program Files\PostgreSQL\15\bin\psql.exe" -U postgres -c "ALTER USER postgres PASSWORD 'new_ass12worda_';" 2>&1
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "Password updated successfully!" -ForegroundColor Green
            Write-Host ""
            Write-Host "You can now run: .\setup-database.ps1" -ForegroundColor Green
        } else {
            Write-Host "Failed to update password: $result" -ForegroundColor Red
        }
    } else {
        Write-Host "Connection failed. Password might be incorrect." -ForegroundColor Red
        Write-Host "Error: $testResult" -ForegroundColor Gray
    }
    
} elseif ($choice -eq "2") {
    Write-Host ""
    Write-Host "Trying common default passwords..." -ForegroundColor Yellow
    
    $passwords = @("postgres", "password", "admin", "root", "123456", "Password1", "Postgres123")
    
    foreach ($testPwd in $passwords) {
        Write-Host "Trying: $testPwd" -ForegroundColor Gray
        $env:PGPASSWORD = $testPwd
        $testResult = & "C:\Program Files\PostgreSQL\15\bin\psql.exe" -U postgres -c "SELECT 1;" 2>&1
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "Success! Current password is: $testPwd" -ForegroundColor Green
            Write-Host "Changing to: new_ass12worda_" -ForegroundColor Yellow
            
            $result = & "C:\Program Files\PostgreSQL\15\bin\psql.exe" -U postgres -c "ALTER USER postgres PASSWORD 'new_ass12worda_';" 2>&1
            
            if ($LASTEXITCODE -eq 0) {
                Write-Host "Password updated successfully!" -ForegroundColor Green
                Write-Host ""
                Write-Host "You can now run: .\setup-database.ps1" -ForegroundColor Green
            } else {
                Write-Host "Failed to update password: $result" -ForegroundColor Red
            }
            exit 0
        }
    }
    
    Write-Host "None of the common passwords worked." -ForegroundColor Red
    Write-Host "Please use option 1 or 3." -ForegroundColor Yellow
    
} elseif ($choice -eq "3") {
    Write-Host ""
    Write-Host "Launching password reset script with admin privileges..." -ForegroundColor Yellow
    Write-Host "Please approve the UAC prompt if it appears." -ForegroundColor White
    Write-Host ""
    
    Start-Process powershell -Verb RunAs -ArgumentList "-NoExit", "-Command", "cd '$PWD'; .\reset-postgres-password.ps1; Read-Host 'Press Enter to close'"
    
} else {
    Write-Host "Invalid choice." -ForegroundColor Red
}

Remove-Item Env:\PGPASSWORD -ErrorAction SilentlyContinue
