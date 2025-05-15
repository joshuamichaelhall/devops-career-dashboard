#!/bin/bash
# Reset Dashboard Data Script
# This script resets the dashboard data using a selected template

# Check for command line arguments
TEMPLATE=""
if [ "$1" = "--template" ] || [ "$1" = "-t" ]; then
  TEMPLATE="$2"
fi

# Display banner
echo "====================================================="
echo "      DevOps Career Dashboard - Reset Data           "
echo "====================================================="
echo ""
echo "This will reset ALL dashboard progress data"
echo "A backup of your current data will be created automatically"
echo ""
echo "Available templates:"
echo "  1. accelerated-path (Senior DevOps in 18 months)"
echo "  2. entry-path (Entry/Mid-level DevOps in 12 months)"
echo "  3. custom-path (Build from scratch)"
echo "  4. initial (Original basic template)"
echo ""

# Run the reset script with Node.js
cd dashboard
if [ -n "$TEMPLATE" ]; then
  node scripts/reset-dashboard.js --template "$TEMPLATE"
else
  node scripts/reset-dashboard.js
fi

echo ""
echo "====================================================="
echo "After resetting, start the dashboard with:"
echo "./start-personal.sh"
echo "====================================================="