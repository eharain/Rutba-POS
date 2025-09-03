#!/bin/bash

# Function to check Node.js installation
check_node() {
  if ! command -v node &> /dev/null; then
    echo "Node.js not found. Installing Node.js..."
    # Example for Ubuntu/Debian. Adjust for your OS.
    curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
    sudo apt-get install -y nodejs
  else
    echo "Node.js is already installed."
  fi
}

# Setup .env for pos-strapi
setup_strapi_env() {
  STRAPI_ENV="pos-strapi/.env"
  if [ ! -f "$STRAPI_ENV" ]; then
    echo "Creating .env for pos-strapi..."
    cat <<EOT > $STRAPI_ENV
DATABASE_CLIENT=mysql
DATABASE_HOST=localhost
DATABASE_PORT=3306
DATABASE_NAME=pos_db
DATABASE_USERNAME=pos_user
DATABASE_PASSWORD=pos_password
APP_KEYS=your_app_key
EOT
  else
    echo ".env for pos-strapi already exists."
  fi
}

# Setup .env for pos-desk (Next.js)
setup_desk_env() {
  DESK_ENV="pos-desk/.env.local"
  if [ ! -f "$DESK_ENV" ]; then
    echo "Creating .env.local for pos-desk..."
    cat <<EOT > $DESK_ENV
NEXT_PUBLIC_API_URL=http://localhost:1337
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