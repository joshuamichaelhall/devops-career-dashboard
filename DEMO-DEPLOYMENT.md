# Demo Deployment Instructions

This document provides instructions for deploying the DevOps Career Dashboard demo.

## Option 1: Free Cloud Hosting (Recommended)

The easiest way to deploy your dashboard is using a free cloud hosting service like Render, Vercel, or Netlify.

### 1. Deploy to Render (Free)

See the detailed guide in `docs/FREE-HOSTING-GUIDE.md` for step-by-step instructions.

1. Create a Render account at https://render.com
2. Connect your GitHub repository
3. Deploy as a Web Service using the included `render.yaml` configuration
4. Add your custom domain `devops-dashboard.joshuamichaelhall.com`

### 2. Deploy to Vercel (Free)

1. Create a Vercel account at https://vercel.com
2. Import your GitHub repository
3. Configure as a Node.js project
4. Set environment variables:
   - `NODE_ENV`: production
   - `DEMO_MODE`: true
   - `REACT_APP_DEMO_MODE`: true
5. Deploy and add your custom domain

## Option 2: Self-Hosted Server

If you prefer to host on your own server, follow these instructions:

### Server Requirements

- Node.js 14+ 
- NGINX for reverse proxy
- SSL certificate (Let's Encrypt recommended)

### Deployment Steps

1. **Set up your server with the required software:**

   ```bash
   # Ubuntu example
   apt update
   apt install -y nodejs npm nginx certbot python3-certbot-nginx
   ```

2. **Obtain SSL certificate:**

   ```bash
   certbot --nginx -d devops-dashboard.joshuamichaelhall.com
   ```

3. **Configure NGINX:**

   Copy the provided nginx.conf to /etc/nginx/sites-available/

   ```bash
   cp nginx.conf /etc/nginx/sites-available/devops-dashboard
   ln -s /etc/nginx/sites-available/devops-dashboard /etc/nginx/sites-enabled/
   nginx -t && systemctl reload nginx
   ```

4. **Deploy the dashboard:**

   ```bash
   # Install dependencies
   npm install --production
   
   # Start the server
   node demo-server.js
   ```

5. **For production, use a process manager:**

   ```bash
   # Install PM2
   npm install -g pm2
   
   # Start the application
   pm2 start demo-server.js --name "devops-dashboard-demo"
   pm2 save
   pm2 startup
   ```

Your demo dashboard should now be available at https://devops-dashboard.joshuamichaelhall.com

## Option 3: Using Docker

If you prefer Docker, you can build and run using:

```bash
docker build -t devops-dashboard-demo .
docker run -p 3001:3001 devops-dashboard-demo
```