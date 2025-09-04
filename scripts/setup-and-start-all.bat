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

REM Prompt for pos-strapi .env variables
set "DATABASE_CLIENT_DEFAULT=mysql"
set "DATABASE_HOST_DEFAULT=localhost"
set "DATABASE_PORT_DEFAULT=3306"
set "DATABASE_NAME_DEFAULT=pos_db"
set "DATABASE_USERNAME_DEFAULT=pos_user"
set "DATABASE_PASSWORD_DEFAULT=pos_password"
set "APP_KEYS_DEFAULT=your_app_key"

set /p DATABASE_CLIENT="Enter DATABASE_CLIENT [!DATABASE_CLIENT_DEFAULT!]: "
if "!DATABASE_CLIENT!"=="" set DATABASE_CLIENT=!DATABASE_CLIENT_DEFAULT!
set /p DATABASE_HOST="Enter DATABASE_HOST [!DATABASE_HOST_DEFAULT!]: "
if "!DATABASE_HOST!"=="" set DATABASE_HOST=!DATABASE_HOST_DEFAULT!
set /p DATABASE_PORT="Enter DATABASE_PORT [!DATABASE_PORT_DEFAULT!]: "
if "!DATABASE_PORT!"=="" set DATABASE_PORT=!DATABASE_PORT_DEFAULT!
set /p DATABASE_NAME="Enter DATABASE_NAME [!DATABASE_NAME_DEFAULT!]: "
if "!DATABASE_NAME!"=="" set DATABASE_NAME=!DATABASE_NAME_DEFAULT!
set /p DATABASE_USERNAME="Enter DATABASE_USERNAME [!DATABASE_USERNAME_DEFAULT!]: "
if "!DATABASE_USERNAME!"=="" set DATABASE_USERNAME=!DATABASE_USERNAME_DEFAULT!
set /p DATABASE_PASSWORD="Enter DATABASE_PASSWORD [!DATABASE_PASSWORD_DEFAULT!]: "
if "!DATABASE_PASSWORD!"=="" set DATABASE_PASSWORD=!DATABASE_PASSWORD_DEFAULT!
set /p APP_KEYS="Enter APP_KEYS [!APP_KEYS_DEFAULT!]: "
if "!APP_KEYS!"=="" set APP_KEYS=!APP_KEYS_DEFAULT!

REM Setup .env for pos-strapi
IF NOT EXIST "..\pos-strapi\.env" (
    echo Creating .env for pos-strapi...
    (
        echo DATABASE_CLIENT=!DATABASE_CLIENT!
        echo DATABASE_HOST=!DATABASE_HOST!
        echo DATABASE_PORT=!DATABASE_PORT!
        echo DATABASE_NAME=!DATABASE_NAME!
        echo DATABASE_USERNAME=!DATABASE_USERNAME!
        echo DATABASE_PASSWORD=!DATABASE_PASSWORD!
        echo APP_KEYS=!APP_KEYS!
    ) > "..\pos-strapi\.env"
) ELSE (
    echo .env for pos-strapi already exists.
)

REM Prompt for pos-desk .env.local variable
set "NEXT_PUBLIC_API_URL_DEFAULT=http://localhost:1337"
set /p NEXT_PUBLIC_API_URL="Enter NEXT_PUBLIC_API_URL [!NEXT_PUBLIC_API_URL_DEFAULT!]: "
if "!NEXT_PUBLIC_API_URL!"=="" set NEXT_PUBLIC_API_URL=!NEXT_PUBLIC_API_URL_DEFAULT!

REM Setup .env for pos-desk (Next.js)
IF NOT EXIST "..\pos-desk\.env.local" (
    echo Creating .env.local for pos-desk...
    (
        echo NEXT_PUBLIC_API_URL=!NEXT_PUBLIC_API_URL!
    ) > "..\pos-desk\.env.local"
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
ENDLOCAL#!/bin/bash

# Check Node.js installation
if ! command -v node &> /dev/null; then
    echo "Node.js is not installed. Please install Node.js and rerun this script."
    exit 1
else
    echo "Node.js is installed."
fi

# Prompt for pos-strapi .env variables
read -p "Enter DATABASE_CLIENT [mysql]: " DATABASE_CLIENT
DATABASE_CLIENT=${DATABASE_CLIENT:-mysql}
read -p "Enter DATABASE_HOST [localhost]: " DATABASE_HOST
DATABASE_HOST=${DATABASE_HOST:-localhost}
read -p "Enter DATABASE_PORT [3306]: " DATABASE_PORT
DATABASE_PORT=${DATABASE_PORT:-3306}
read -p "Enter DATABASE_NAME [pos_db]: " DATABASE_NAME
DATABASE_NAME=${DATABASE_NAME:-pos_db}
read -p "Enter DATABASE_USERNAME [pos_user]: " DATABASE_USERNAME
DATABASE_USERNAME=${DATABASE_USERNAME:-pos_user}
read -p "Enter DATABASE_PASSWORD [pos_password]: " DATABASE_PASSWORD
DATABASE_PASSWORD=${DATABASE_PASSWORD:-pos_password}
read -p "Enter APP_KEYS [your_app_key]: " APP_KEYS
APP_KEYS=${APP_KEYS:-your_app_key}

# Setup .env for pos-strapi
if [ ! -f "../pos-strapi/.env" ]; then
    echo "Creating .env for pos-strapi..."
    cat <<EOF > ../pos-strapi/.env
DATABASE_CLIENT=$DATABASE_CLIENT
DATABASE_HOST=$DATABASE_HOST
DATABASE_PORT=$DATABASE_PORT
DATABASE_NAME=$DATABASE_NAME
DATABASE_USERNAME=$DATABASE_USERNAME
DATABASE_PASSWORD=$DATABASE_PASSWORD
APP_KEYS=$APP_KEYS
EOF
else
    echo ".env for pos-strapi already exists."
fi

# Prompt for pos-desk .env.local variable
read -p "Enter NEXT_PUBLIC_API_URL [http://localhost:1337]: " NEXT_PUBLIC_API_URL
NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL:-http://localhost:1337}

# Setup .env for pos-desk (Next.js)
if [ ! -f "../pos-desk/.env.local" ]; then
    echo "Creating .env.local for pos-desk..."
    echo "NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL" > ../pos-desk/.env.local
else
    echo ".env.local for pos-desk already exists."
fi

# Install dependencies and start Strapi
echo "Setting up pos-strapi..."
cd ../pos-strapi
npm install
npx forever start -c "npm run start" .
cd ..

# Install dependencies and start Next.js
echo "Setting up pos-desk..."
cd ../pos-desk
npm install
npm run dev &

echo "Both projects are running. Strapi on port 1337, Next.js on port 3000."