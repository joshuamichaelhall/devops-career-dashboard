#!/bin/bash
# Script to deploy the dashboard in demo mode

echo "DevOps Career Dashboard - Demo Deployment"
echo "=========================================="
echo

# Ensure we have the required directories
mkdir -p logs

# Create demo environment file
echo "Creating demo environment configuration..."
cat > .env << EOF
# Demo mode configuration
NODE_ENV=production
PORT=3001
DEMO_MODE=true
REACT_APP_DEMO_MODE=true
REACT_APP_API_URL=https://devops-dashboard.joshuamichaelhall.com/api
ENABLE_RATE_LIMITING=true
REQUIRE_HTTPS=true
EOF

echo "Building dashboard in demo mode..."
# Build frontend with demo mode enabled
REACT_APP_DEMO_MODE=true npm run build

echo "Setting up demo server configuration..."
# Create a demo server file
cat > demo-server.js << EOF
/**
 * Demo server for DevOps Career Dashboard
 */
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs-extra');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');

// Import demo mode configuration
const { configureDemoMode } = require('./server/demoMode');

const app = express();
const PORT = process.env.PORT || 3001;

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'"]
    }
  }
}));

// Enable gzip compression
app.use(compression());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later'
});
app.use(limiter);

// Basic middleware
app.use(cors());
app.use(bodyParser.json());

// Configure the server for demo mode
configureDemoMode(app);

// Serve static build files
app.use(express.static(path.join(__dirname, 'build')));

// All other GET requests not handled will return the React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// Start the server
app.listen(PORT, '0.0.0.0', () => {
  console.log(\`Demo server running on port \${PORT}\`);
  console.log(\`Demo URL: https://devops-dashboard.joshuamichaelhall.com\`);
});
EOF

echo "Creating basic deployment files..."

# Create a basic Dockerfile
cat > Dockerfile << EOF
FROM node:16-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY . .

EXPOSE 3001

ENV NODE_ENV=production
ENV DEMO_MODE=true

CMD ["node", "demo-server.js"]
EOF

# Create a sample nginx configuration
cat > nginx.conf << EOF
server {
    listen 80;
    server_name devops-dashboard.joshuamichaelhall.com;
    
    # Redirect all HTTP requests to HTTPS
    location / {
        return 301 https://\$host\$request_uri;
    }
}

server {
    listen 443 ssl;
    server_name devops-dashboard.joshuamichaelhall.com;
    
    ssl_certificate /etc/letsencrypt/live/devops-dashboard.joshuamichaelhall.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/devops-dashboard.joshuamichaelhall.com/privkey.pem;
    
    # SSL configuration
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_prefer_server_ciphers on;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384;
    ssl_ecdh_curve secp384r1;
    ssl_session_timeout 10m;
    ssl_session_cache shared:SSL:10m;
    ssl_session_tickets off;
    ssl_stapling on;
    ssl_stapling_verify on;
    
    # Security headers
    add_header Strict-Transport-Security "max-age=63072000; includeSubDomains; preload";
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    add_header X-XSS-Protection "1; mode=block";
    add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self'";
    
    # Proxy all requests to the Node.js app
    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
}
EOF

# Create deployment instructions
cat > DEMO-DEPLOYMENT.md << EOF
# Demo Deployment Instructions

This document provides instructions for deploying the DevOps Career Dashboard demo to your domain.

## Server Requirements

- Node.js 14+ 
- NGINX for reverse proxy
- SSL certificate (Let's Encrypt recommended)

## Deployment Steps

1. **Set up your server with the required software:**

   \`\`\`bash
   # Ubuntu example
   apt update
   apt install -y nodejs npm nginx certbot python3-certbot-nginx
   \`\`\`

2. **Obtain SSL certificate:**

   \`\`\`bash
   certbot --nginx -d devops-dashboard.joshuamichaelhall.com
   \`\`\`

3. **Configure NGINX:**

   Copy the provided nginx.conf to /etc/nginx/sites-available/

   \`\`\`bash
   cp nginx.conf /etc/nginx/sites-available/devops-dashboard
   ln -s /etc/nginx/sites-available/devops-dashboard /etc/nginx/sites-enabled/
   nginx -t && systemctl reload nginx
   \`\`\`

4. **Deploy the dashboard:**

   \`\`\`bash
   # Install dependencies
   npm install --production
   
   # Start the server
   node demo-server.js
   \`\`\`

5. **For production, use a process manager:**

   \`\`\`bash
   # Install PM2
   npm install -g pm2
   
   # Start the application
   pm2 start demo-server.js --name "devops-dashboard-demo"
   pm2 save
   pm2 startup
   \`\`\`

Your demo dashboard should now be available at https://devops-dashboard.joshuamichaelhall.com

## Using Docker

If you prefer Docker, you can build and run using:

\`\`\`bash
docker build -t devops-dashboard-demo .
docker run -p 3001:3001 devops-dashboard-demo
\`\`\`
EOF

echo "Installing additional required packages..."
npm install --save compression express-rate-limit helmet

echo "Demo deployment files created successfully!"
echo
echo "To deploy the demo, follow these steps:"
echo "1. Set up your domain (devops-dashboard.joshuamichaelhall.com) to point to your server"
echo "2. Follow the instructions in DEMO-DEPLOYMENT.md"
echo "3. Users will be able to access the demo with username 'demo' and password 'demopassword'"
echo
echo "Note: The demo environment includes:"
echo "- Clearly marked DEMO indicators"
echo "- Pre-filled sample data showing ~90% completion"
echo "- Auto-login for easy access"
echo "- Read-only mode (changes won't be persisted)"
echo
echo "For more information, see the DEMO-DEPLOYMENT.md file."