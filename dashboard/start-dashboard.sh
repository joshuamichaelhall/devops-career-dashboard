#!/bin/bash
# Script to start the dashboard with proper port configuration

# Default to development mode if not specified
ENVIRONMENT=${1:-"development"}

# Kill any existing processes
echo "Stopping any existing processes..."
kill -9 $(lsof -ti:3001,3002) 2>/dev/null || true

# Check if .env file exists, if not create it from template
if [ ! -f ".env" ]; then
  if [ -f ".env.example" ]; then
    echo "Creating .env file from template..."
    cp .env.example .env
  else
    echo "Creating default .env file..."
    # Create minimal .env file
    touch .env
  fi
 fi

# Configure environment
if [ "$ENVIRONMENT" == "production" ]; then
  echo "Configuring for production environment..."
  # Set production environment variables
  cat >> .env << EOF
NODE_ENV=production
PORT=3001
REQUIRE_HTTPS=true
ENABLE_RATE_LIMITING=true
EOF
  
  # Check if JWT_SECRET is set, if not, warn user
  if ! grep -q "JWT_SECRET" .env; then
    echo "WARNING: JWT_SECRET not found in .env file."
    echo "Please run 'npm run setup-admin' to set up authentication."
  fi
  
  # Build the client
  echo "Building client..."
  npm run build
  
  # Start only the server in production mode
  echo "Starting server in production mode..."
  NODE_ENV=production npm run server
else
  echo "Configuring for development environment..."
  # Update .env file with development settings
  cat >> .env << EOF
NODE_ENV=development
REACT_APP_API_URL=http://localhost:3001/api
PORT=3002
REQUIRE_HTTPS=false
ENABLE_RATE_LIMITING=false
EOF
  
  echo "Starting dashboard in development mode..."
  npm run dev
fi