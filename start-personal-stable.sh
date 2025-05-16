#!/bin/bash
# Stable Personal Dashboard Script
# This script starts the dashboard with separate processes to avoid reload loops

# Display banner
echo "====================================================="
echo "      DevOps Career Dashboard - Personal Mode        "
echo "====================================================="
echo ""

# Check if this is the first run - if data.json doesn't exist
if [ ! -f "dashboard/src/data/data.json" ]; then
  echo "🔄 First-time setup: Initializing your personal dashboard..."
  echo ""
  # Copy initial data as a starting point
  cp dashboard/src/data/initial-data.json dashboard/src/data/data.json
  echo "✅ Created initial dashboard data"
  echo ""
fi

# Clean cache file if it exists
if [ -f "dashboard/src/data/localStorage.json" ]; then
  echo "🧹 Cleaning cache data..."
  rm dashboard/src/data/localStorage.json
fi

# Kill any existing processes
echo "Stopping any existing processes..."
lsof -ti:3000,3005 | xargs kill -9 2>/dev/null || true

# Move to dashboard directory and set up environment
cd dashboard

# Create .env file with all necessary configurations
echo "Creating environment configuration..."
cat > .env << EOF
NODE_ENV=development
REACT_APP_API_URL=http://localhost:3005/api
PORT=3005
REQUIRE_HTTPS=false
ENABLE_RATE_LIMITING=false
EOF

# Create .env.development to ensure React uses port 3000
cat > .env.development << EOF
PORT=3000
EOF

# Start the API server in background
echo "🚀 Starting API server on port 3005..."
npm run server &
API_PID=$!

# Wait for API server to start
sleep 2

# Start the React app
echo "🚀 Starting React frontend on port 3000..."
echo "   - Frontend will be available at: http://localhost:3000"
echo "   - API server will be available at: http://localhost:3005"
echo ""

# Run React app with stable configuration
WATCHPACK_POLLING=true CHOKIDAR_USEPOLLING=true npm run start

# If React app exits, kill the API server
kill $API_PID 2>/dev/null || true

echo ""
echo "====================================================="
echo "Your personal dashboard data is stored in:"
echo "dashboard/src/data/data.json"
echo "====================================================="