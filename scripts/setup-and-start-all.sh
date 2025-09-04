#!/bin/bash

# Function to prompt user for input with default value
prompt_with_default() {
  local prompt="$1"
  local default="$2"
  local var
  read -p "$prompt [$default]: " var
  echo "${var:-$default}"
}

# Function to check Node.js installation
check_node() {
  if ! command -v node &> /dev/null; then
    echo "Node.js not found. Installing Node.js..."
    curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
    sudo apt-get install -y nodejs
  else
    echo "Node.js is already installed."
  fi
}

# Setup .env for pos-strapi
setup_strapi_env() {
  STRAPI_ENV="../pos-strapi/.env"
  if [ ! -f "$STRAPI_ENV" ]; then
    echo "Creating .env for pos-strapi..."

    DB_CLIENT=$(prompt_with_default "Database client" "mysql")
    DB_HOST=$(prompt_with_default "Database host" "localhost")
    DB_PORT=$(prompt_with_default "Database port" "3306")
    DB_NAME=$(prompt_with_default "Database name" "pos_db")
    DB_USER=$(prompt_with_default "Database username" "pos_user")
    DB_PASS=$(prompt_with_default "Database password" "pos_password")
    APP_KEYS=$(prompt_with_default "App keys" "your_app_key")

    cat <<EOT > $STRAPI_ENV
DATABASE_CLIENT=$DB_CLIENT
DATABASE_HOST=$DB_HOST
DATABASE_PORT=$DB_PORT
DATABASE_NAME=$DB_NAME
DATABASE_USERNAME=$DB_USER
DATABASE_PASSWORD=$DB_PASS
APP_KEYS=$APP_KEYS
EOT
  else
    echo ".env for pos-strapi already exists."
  fi
}

# Setup .env for pos-desk (Next.js)
setup_desk_env() {
  DESK_ENV="../pos-desk/.env.local"
  if [ ! -f "$DESK_ENV" ]; then
    echo "Creating .env.local for pos-desk..."

    API_URL=$(prompt_with_default "Next.js public API URL" "http://localhost:1337")

    cat <<EOT > $DESK_ENV
NEXT_PUBLIC_API_URL=$API_URL
EOT
  else
    echo ".env.local for pos-desk already exists."
  fi
}

# Install dependencies and start Strapi
start_strapi() {
  echo "Setting up pos-strapi..."
  cd pos-strapi
  npm install
  forever start -c "npm run start" .
  cd ..
}

# Install dependencies and start Next.js
start_desk() {
  echo "Setting up pos-desk..."
  cd pos-desk
  npm install
  npm run dev &
  cd ..
}

# Main script
check_node
setup_strapi_env
setup_desk_env
start_strapi
start_desk

echo "Both projects are running. Strapi on port 1337, Next.js on port 3000."