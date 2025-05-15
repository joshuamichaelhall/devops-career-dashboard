#!/bin/bash
# Script to completely clean and restart the dashboard

echo "====================================================="
echo "      DevOps Career Dashboard - Clean Restart        "
echo "====================================================="
echo ""

# Kill any existing node processes that might conflict
echo "Killing any existing node server processes..."
pkill -f "node server.js" || true
pkill -f "node .*start" || true

# Check for processes on relevant ports
echo "Checking for processes on dashboard ports..."
for port in 3001 3002 3003 3004 3005; do
  pid=$(lsof -ti:$port 2>/dev/null)
  if [ -n "$pid" ]; then
    echo "Killing process using port $port (PID: $pid)..."
    kill -9 $pid || true
  else
    echo "No process using port $port"
  fi
done

# Clean environment file to ensure proper port configuration
echo "Updating environment configuration..."
cd dashboard
cat > .env << EOF
PORT=3005
NODE_ENV=development
REACT_APP_API_URL=http://localhost:3005/api
REQUIRE_HTTPS=false
ENABLE_RATE_LIMITING=false
EOF

# Clear any cached data
echo "Cleaning cached data..."
if [ -f "src/data/localStorage.json" ]; then
  rm src/data/localStorage.json
  echo "Cleared localStorage cache"
fi

# Clear node_modules caches if needed
echo "Would you like to perform a clean npm install? (y/n)"
read -r answer
if [[ "$answer" =~ ^[Yy]$ ]]; then
  echo "Removing node_modules..."
  rm -rf node_modules
  echo "Running npm install..."
  npm install
fi

# Start dashboard with our custom environment
echo ""
echo "Starting dashboard with PORT=3005..."
echo "Note: Make sure to access the dashboard at http://localhost:3000 (React frontend)"
echo "      and the API at http://localhost:3005 (Backend API)"
echo ""

# Export the PORT explicitly in case .env file is ignored
export PORT=3005
npm run dev

cd ..
echo ""
echo "====================================================="
echo "If you encounter any issues:"
echo "1. Try running ./force-reset.sh"
echo "2. Clear browser cache or use incognito mode"
echo "3. Check server.js for hard-coded port values"
echo "====================================================="