# Star Trek MMORPG - Database Setup Guide

## Quick Start with Docker (Recommended)

The easiest way to set up the database is using Docker:

```powershell
# Start PostgreSQL in Docker
docker run --name startrek-postgres `
  -e POSTGRES_PASSWORD=new_ass12worda_ `
  -e POSTGRES_DB=startrek_mmorpg `
  -p 5432:5432 `
  -d postgres:15

# Run the setup script
.\setup-database.ps1
```

## Installing PostgreSQL Locally

### Option 1: Using Winget
```powershell
winget install PostgreSQL.PostgreSQL
```

### Option 2: Using Chocolatey
```powershell
choco install postgresql
```

### Option 3: Manual Installation
1. Download from: https://www.postgresql.org/download/windows/
2. Run the installer
3. Remember the password you set for the 'postgres' user
4. Update the password in `.env` file

## Running the Setup Script

After PostgreSQL is installed and running:

```powershell
cd C:\Users\Shadow\Documents\Startrek-fleet-command-main\Startrek-fleet-command-main
.\setup-database.ps1
```

## Manual Database Setup

If you prefer to set up manually:

```powershell
# Connect to PostgreSQL
psql -U postgres

# Create the database
CREATE DATABASE startrek_mmorpg;

# Connect to the new database
\c startrek_mmorpg

# Run the schema file
\i server/database/schema.sql
```

## Configuration

Database settings are in `.env`:

```
DB_HOST=localhost
DB_PORT=5432
DB_NAME=startrek_mmorpg
DB_USER=postgres
DB_PASSWORD=new_ass12worda_
```

Make sure these match your PostgreSQL setup.

## Troubleshooting

### "password authentication failed"
- Check that the password in `.env` matches your PostgreSQL password
- Update DB_PASSWORD in `.env` if needed

### "could not connect to server"
- Ensure PostgreSQL service is running:
  ```powershell
  net start postgresql-x64-15
  ```
- Check if PostgreSQL is listening on port 5432

### "database already exists"
- The setup script will ask if you want to recreate it
- Or manually drop it: `psql -U postgres -c "DROP DATABASE startrek_mmorpg;"`

## Verifying the Setup

After setup, verify the connection:

```powershell
psql -U postgres -d startrek_mmorpg -c "SELECT COUNT(*) FROM players;"
```

Or start the dev server:

```powershell
pnpm dev
```

You should see "Database connected" instead of "running in mock mode".
