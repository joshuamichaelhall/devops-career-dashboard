#!/bin/bash
# Consolidated dashboard restart script with clean and emergency options

echo "====================================================="
echo "      DevOps Career Dashboard - Restart              "
echo "====================================================="
echo ""

# Parse command line arguments
MODE="normal"
if [ "$1" = "--emergency" ] || [ "$1" = "-e" ]; then
  MODE="emergency"
elif [ "$1" = "--clean" ] || [ "$1" = "-c" ]; then
  MODE="clean"
fi

# Emergency mode - kills ALL node processes
if [ "$MODE" = "emergency" ]; then
  echo "🚨 EMERGENCY MODE"
  echo "⚠️  WARNING: This will kill ALL node processes on your system!"
  echo "   If you're running other Node.js applications, use Ctrl+C now"
  echo ""
  echo "Press Enter to continue or Ctrl+C to cancel..."
  read -r
  
  echo "🔥 Killing all Node.js processes..."
  pkill -f node || true
  echo "✅ All Node.js processes terminated"
else
  # Normal/Clean mode - kills specific dashboard processes
  echo "Killing existing dashboard processes..."
  pkill -f "node server.js" || true
  pkill -f "node .*start" || true
  
  # Check for processes on relevant ports
  echo "Checking for processes on dashboard ports..."
  for port in 3000 3001 3002 3003 3004 3005; do
    pid=$(lsof -ti:$port 2>/dev/null)
    if [ -n "$pid" ]; then
      echo "Killing process using port $port (PID: $pid)..."
      kill -9 $pid || true
    fi
  done
fi

echo ""
cd dashboard || exit 1

# Update environment configuration
echo "🔧 Updating environment configuration..."
cat > .env << EOF
NODE_ENV=development
REACT_APP_API_URL=http://localhost:3005/api
PORT=3005
REQUIRE_HTTPS=false
ENABLE_RATE_LIMITING=false
EOF

# Create .env.development for React port
cat > .env.development << EOF
PORT=3000
EOF

# Clear cached data
echo "🧹 Cleaning cached data..."
if [ -f "src/data/localStorage.json" ]; then
  rm src/data/localStorage.json
  echo "✅ Cleared localStorage cache"
fi

# Clean mode - optional npm install
if [ "$MODE" = "clean" ]; then
  echo ""
  echo "Would you like to perform a clean npm install? (y/n)"
  read -r answer
  if [[ "$answer" =~ ^[Yy]$ ]]; then
    echo "Removing node_modules..."
    rm -rf node_modules
    echo "Running npm install..."
    npm install
  fi
fi

# Wait to ensure ports are freed
echo ""
echo "⏱️  Waiting for 2 seconds to ensure all ports are freed..."
sleep 2

# Start the dashboard
echo ""
echo "🚀 Starting dashboard..."
echo "   React frontend: http://localhost:3000"
echo "   API server: http://localhost:3005"
echo ""

# Export PORT for API server
export PORT=3005

# Start both React app and API server
if [ "$MODE" = "emergency" ]; then
  # In emergency mode, start explicitly with PORT settings
  PORT=3000 npm run start & PORT=3005 npm run server
else
  # In normal/clean mode, use the standard dev command
  npm run dev
fi

cd ..
echo ""
echo "====================================================="
echo "If you encounter any issues:"
echo "1. Try running ./restart-dashboard.sh --clean"
echo "2. Try running ./restart-dashboard.sh --emergency"
echo "3. Use ./force-reset.sh for data issues"
echo "4. Clear browser cache or use incognito mode"
echo "====================================================="