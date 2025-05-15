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

# Set demo mode environment variable and create port configuration
export REACT_APP_DEMO_MODE=true
export PORT=3005
cd dashboard

# Create .env.development file to ensure React uses port 3000
echo "Creating port configuration..."
cat > .env.development << EOF
PORT=3000
EOF

echo "🚀 Starting demo dashboard..."
echo "   - Frontend will be available at: http://localhost:3000"
echo "   - API server will be available at: http://localhost:3005"
echo ""
npm run start-prod

echo ""
echo "====================================================="
echo "Demo mode uses sample data and doesn't save changes"
echo "For your personal dashboard, use ./start-personal.sh instead"
echo "====================================================="