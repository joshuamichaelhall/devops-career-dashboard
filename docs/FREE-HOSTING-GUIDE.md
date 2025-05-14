# Deploying DevOps Dashboard to Free Hosting (Render)

This guide walks you through deploying your DevOps Career Dashboard to Render's free tier. Render provides automatic HTTPS, easy deployment from GitHub, and a generous free tier perfect for personal projects.

## Prerequisites

- GitHub account
- Render.com account (sign up at https://render.com)
- Your repository pushed to GitHub

## Step 1: Prepare Your Repository

1. First, modify your `package.json` to include a proper start script:

```json
"scripts": {
  "start": "node demo-server.js",
  "build": "react-scripts build",
  // other scripts...
}
```

2. Create a `render.yaml` file in your project root:

```yaml
services:
  - type: web
    name: devops-dashboard
    env: node
    buildCommand: npm install && npm run build
    startCommand: npm start
    envVars:
      - key: NODE_ENV
        value: production
      - key: DEMO_MODE
        value: true
      - key: REACT_APP_DEMO_MODE
        value: true
```

## Step 2: Deploy to Render

1. Log in to your Render account
2. Click "New +" and select "Web Service"
3. Connect your GitHub account if you haven't already
4. Select your devops-career-dashboard repository
5. For name, enter "devops-dashboard"
6. Make sure environment is set to "Node"
7. Set Build Command: `npm install && npm run build`
8. Set Start Command: `npm start`
9. Select "Free" for the plan
10. Click "Create Web Service"

Render will now build and deploy your application. Once complete, you'll be given a URL like `https://devops-dashboard.onrender.com`.

## Step 3: Set Up Custom Domain

1. In your DNS provider (where joshuamichaelhall.com is registered):
   - Add a CNAME record with:
     - Name: `devops-dashboard`
     - Value: `[your-app-name].onrender.com` (from Step 2)
     - TTL: 3600 (or default)

2. In Render, go to your service dashboard
3. Click on "Settings" then "Custom Domain"
4. Click "Add Domain"
5. Enter your custom domain: `devops-dashboard.joshuamichaelhall.com`
6. Click "Add"
7. Render will verify your DNS settings and issue an SSL certificate automatically

## Step 4: Verify Deployment

1. Wait for DNS propagation (can take 15 minutes to 48 hours)
2. Visit `https://devops-dashboard.joshuamichaelhall.com/?demo=true`
3. You should see your dashboard with demo mode active

## Limitations on Free Tier

- Render's free tier instances will spin down after 15 minutes of inactivity
- First request after inactivity will take a few seconds to respond (cold start)
- 750 hours of free usage per month
- Free tier has limited resources (512 MB RAM)

## Alternative Free Hosting Options

If Render doesn't meet your needs, consider:

### Vercel
- Excellent for React/Node applications
- Simple GitHub integration
- Automatic previews for pull requests
- Instructions: https://vercel.com/docs/frameworks/nextjs

### Netlify
- Similar to Vercel with focus on JAMstack
- Easy deployment from GitHub
- Instructions: https://docs.netlify.com/get-started/

### Railway
- Developer-friendly platform
- Free tier available
- Instructions: https://docs.railway.app/getting-started

## Maintaining Your Free Hosted Application

- Remember that most free tiers will sleep your application after inactivity
- Consider implementing a simple ping service to keep it awake during business hours
- Regular commits and updates will ensure your service remains active
- Monitoring with free tier of Uptime Robot is recommended