#!/bin/bash
# Start Personal Dashboard Script
# This script starts the dashboard with your personal data

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

# Remind user about browser cache
echo "💡 TIP: If you experience data loading issues, try:"
echo "   - Clearing your browser cache"
echo "   - Using incognito/private mode"
echo "   - Running ./force-reset.sh"
echo ""

# Start the dashboard in personal mode
cd dashboard
echo "🚀 Starting your dashboard in personal mode..."
echo ""
./start-dashboard.sh

echo ""
echo "====================================================="
echo "Your personal dashboard data is stored in:"
echo "dashboard/src/data/data.json"
echo "====================================================="