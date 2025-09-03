@echo off
SETLOCAL ENABLEDELAYEDEXPANSION

REM Check Node.js installation
where node >nul 2>nul
IF ERRORLEVEL 1 (
    echo Node.js is not installed. Please install Node.js and rerun this script.
    exit /b 1
) ELSE (
    echo Node.js is installed.
)

REM Setup .env for pos-strapi
IF NOT EXIST "pos-strapi\.env" (
    echo Creating .env for pos-strapi...
    (
        echo DATABASE_CLIENT=mysql
        echo DATABASE_HOST=localhost
        echo DATABASE_PORT=3306
        echo DATABASE_NAME=pos_db
        echo DATABASE_USERNAME=pos_user
        echo DATABASE_PASSWORD=pos_password
        echo APP_KEYS=your_app_key
    ) > "pos-strapi\.env"
) ELSE (
    echo .env for pos-strapi already exists.
)

REM Setup .env for pos-desk (Next.js)
IF NOT EXIST "pos-desk\.env.local" (
    echo Creating .env.local for pos-desk...
    (
        echo NEXT_PUBLIC_API_URL=http://localhost:1337
    ) > "pos-desk\.env.local"
) ELSE (
    echo .env.local for pos-desk already exists.
)

REM Install dependencies and start Strapi
echo Setting up pos-strapi...
cd pos-strapi
call npm install
call forever start -c "npm run start" .
cd ..

REM Install dependencies and start Next.js
echo Setting up pos-desk...
cd pos-desk
call npm install
start cmd /k "npm run dev"
cd ..

echo Both projects are running. Strapi on port 1337, Next.js on port 3000.
ENDLOCAL