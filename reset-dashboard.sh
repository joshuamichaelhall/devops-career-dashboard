#!/bin/bash
# Reset Dashboard Data Script
# This script resets the dashboard data to initial values

# Display banner
echo "====================================================="
echo "      DevOps Career Dashboard - Reset Data           "
echo "====================================================="
echo ""
echo "This will reset ALL dashboard progress data to initial values"
echo "A backup of your current data will be created automatically"
echo ""

# Run the reset script with Node.js
cd dashboard
node scripts/reset-dashboard.js

echo ""
echo "====================================================="
echo "After resetting, start the dashboard with:"
echo "./start-dashboard.sh"
echo "====================================================="