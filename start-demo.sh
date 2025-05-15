#!/bin/bash
# Start Demo Dashboard Script
# This script starts the dashboard in demo mode with sample data

# Display banner
echo "====================================================="
echo "      DevOps Career Dashboard - Demo Mode            "
echo "====================================================="
echo ""
echo "Starting dashboard in DEMO mode with sample data"
echo "No login required and changes won't be saved"
echo ""

# Set demo mode environment variable and start
export REACT_APP_DEMO_MODE=true
cd dashboard
echo "🚀 Starting demo dashboard..."
echo ""
npm run start-prod

echo ""
echo "====================================================="
echo "Demo mode uses sample data and doesn't save changes"
echo "For your personal dashboard, use ./start-personal.sh instead"
echo "====================================================="