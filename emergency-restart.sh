#!/bin/bash
# Script to kill all node processes and restart the dashboard

echo "====================================================="
echo "   DevOps Career Dashboard - Emergency Restart       "
echo "====================================================="
echo ""

# Warning
echo "⚠️  WARNING: This will kill ALL node processes on your system!"
echo "   If you're running other Node.js applications, use Ctrl+C now"
echo ""
echo "Press Enter to continue or Ctrl+C to cancel..."
read -r

# Kill all node processes
echo "🔥 Killing all Node.js processes..."
pkill -f node || true
echo "✅ All Node.js processes terminated"
echo ""

# Clean environment file to ensure proper port configuration
echo "🔧 Updating environment configuration..."
cd dashboard || exit 1
cat > .env << EOF
NODE_ENV=development
REACT_APP_API_URL=http://localhost:3005/api
PORT=3005
REQUIRE_HTTPS=false
ENABLE_RATE_LIMITING=false
EOF

# Wait 2 seconds to ensure all processes are terminated
echo "⏱️  Waiting for 2 seconds to ensure all ports are freed..."
sleep 2

# Create a .env.development file to ensure React uses port 3000
echo "Creating .env.development file for React..."
cat > .env.development << EOF
PORT=3000
EOF

# Clear any cached data
echo "🧹 Cleaning cached data..."
if [ -f "src/data/localStorage.json" ]; then
  rm src/data/localStorage.json
  echo "✅ Cleared localStorage cache"
fi

# Start the dashboard with explicit PORT settings
echo ""
echo "🚀 Starting dashboard with React on port 3000 and API on port 3005..."
echo "React frontend will be available at: http://localhost:3000"
echo "API server will be available at: http://localhost:3005"
echo ""

# Export the PORT explicitly for the API server
export PORT=3005

# Start the React app and API server with explicit ports
PORT=3000 npm run start & PORT=3005 npm run server

# Return to the original directory
cd ..