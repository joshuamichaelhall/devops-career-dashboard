#!/bin/bash
# Force Reset Dashboard Data Script
# This script forces a complete reset of all dashboard data

# Display banner
echo "====================================================="
echo "    DevOps Career Dashboard - FORCE RESET DATA       "
echo "====================================================="
echo ""
echo "⚠️  WARNING: This will completely reset ALL dashboard data"
echo "⚠️  This is more aggressive than the standard reset and will"
echo "⚠️  help resolve browser cache and data loading issues"
echo ""
echo "A backup of your current data will be created automatically"
echo ""

# Confirm with user
read -p "Continue with force reset? (yes/no): " ANSWER

if [[ "$ANSWER" != "yes" ]]; then
  echo "Force reset cancelled"
  exit 0
fi

# Run the force reset script with Node.js
cd dashboard
node scripts/force-reset.js

# Check if reset was successful
if [ $? -eq 0 ]; then
  echo ""
  echo "====================================================="
  echo "Restart your dashboard with:"
  echo "./start-personal.sh"
  echo "====================================================="
fi