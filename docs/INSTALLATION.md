# Detailed Installation Guide

This document provides comprehensive installation instructions for the DevOps Career Dashboard, including various deployment options and troubleshooting steps.

## Privacy and Data Ownership

When installing this dashboard, you should understand these key privacy features:

- **Private data**: All your personal career data stays on your system only
- **Authentication**: You'll create your own admin credentials during setup
- **Clean repository**: Cloning this repository does not give others access to your data
- **Environment separation**: Sensitive configuration stays in your local `.env` file

These features ensure that **only you can update your dashboard data** while allowing others to use the codebase for their own career tracking.

## Local Installation

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)
- Git

### Step-by-Step Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/joshuamichaelhall/devops-career-dashboard.git
   cd devops-career-dashboard/dashboard
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure environment**:
   ```bash
   cp .env.example .env
   ```

4. **Generate encryption key** (for secure storage of API keys):
   ```bash
   npm run generate-key
   ```
   
5. **Create admin user**:
   ```bash
   npm run setup-admin
   ```
   Follow the prompts to create an admin username and password.

6. **Start the dashboard in development mode**:
   ```bash
   npm run dev
   ```
   
   This will start both the React development server and the API server.
   
   - React frontend: http://localhost:3000
   - API server: http://localhost:3005

## Production Deployment

### Option 1: Node.js Server

1. **Build the React application**:
   ```bash
   npm run build
   ```

2. **Configure production environment**:
   ```bash
   # In your .env file
   NODE_ENV=production
   PORT=3005
   REQUIRE_HTTPS=true  # If you're behind a properly configured reverse proxy
   ENABLE_RATE_LIMITING=true
   ```

3. **Start the server**:
   ```bash
   npm run start-prod
   ```
   
   Or use the convenience script:
   ```bash
   ./start-dashboard.sh production
   ```

4. **Access the dashboard** at http://localhost:3005

### Option 2: Docker Deployment

1. **Create a Dockerfile** in the dashboard directory:
   ```dockerfile
   FROM node:16-alpine

   WORKDIR /app

   COPY package*.json ./
   RUN npm install --production

   COPY . .

   RUN npm run build

   EXPOSE 3005

   ENV NODE_ENV=production
   ENV PORT=3005

   CMD ["node", "server.js"]
   ```

2. **Build the Docker image**:
   ```bash
   docker build -t devops-career-dashboard .
   ```

3. **Run the Docker container**:
   ```bash
   docker run -p 3005:3005 --env-file .env -d devops-career-dashboard
   ```

4. **Access the dashboard** at http://localhost:3005

### Option 3: Deploying to Cloud Platforms

#### Heroku Deployment

1. **Create a Procfile** in the root directory:
   ```
   web: cd dashboard && npm install && npm run build && node server.js
   ```

2. **Set up Heroku CLI and create an app**:
   ```bash
   heroku create your-dashboard-name
   ```

3. **Set environment variables**:
   ```bash
   heroku config:set JWT_SECRET=your-secret-key
   heroku config:set ENCRYPTION_KEY=your-encryption-key
   heroku config:set ADMIN_USERNAME=admin
   heroku config:set ADMIN_PASSWORD_HASH=your-password-hash
   heroku config:set NODE_ENV=production
   heroku config:set REQUIRE_HTTPS=true
   heroku config:set ENABLE_RATE_LIMITING=true
   ```

4. **Deploy to Heroku**:
   ```bash
   git push heroku main
   ```

#### AWS Elastic Beanstalk

1. **Install AWS CLI and initialize EB CLI**:
   ```bash
   pip install awscli awsebcli
   eb init
   ```

2. **Create an application**:
   ```bash
   eb create devops-dashboard-env
   ```

3. **Set environment variables** through the AWS Management Console or EB CLI.

4. **Deploy the application**:
   ```bash
   eb deploy
   ```

## Troubleshooting

### Common Installation Issues

1. **Node.js version compatibility**:
   
   If you encounter errors about incompatible Node.js versions:
   ```bash
   # Check your current Node.js version
   node -v
   
   # Use nvm to install a compatible version
   nvm install 14
   nvm use 14
   ```

2. **Port conflicts**:
   
   If ports 3000 or 3005 are already in use:
   ```bash
   # Find processes using the ports
   lsof -i :3000
   lsof -i :3005
   
   # Kill the processes
   kill -9 <PID>
   
   # Or use the restart script
   ./restart-dashboard.sh --emergency
   ```
   
   The emergency restart option will:
   - Kill all Node.js processes
   - Reset environment configurations
   - Create separate port configurations for React (3000) and API (3005)
   - Start both servers with the correct port settings

3. **Authentication setup issues**:
   
   If you can't log in after setup:
   ```bash
   # Run the setup-admin script again
   npm run setup-admin
   
   # Check that JWT_SECRET is set in your .env file
   ```

4. **API connectivity issues**:
   
   If the frontend can't connect to the API:
   ```bash
   # Ensure REACT_APP_API_URL is correctly set in .env
   REACT_APP_API_URL=http://localhost:3005/api
   
   # Check that the API server is running
   ```

### Logs and Debugging

- Server logs will be output to the console
- Check browser developer tools console for frontend errors
- Check network requests in browser developer tools for API issues

### Getting Help

If you continue to experience issues:

1. Check the [FAQ](./FAQ.md) for common questions
2. Search for similar issues in the GitHub repository
3. Open a new issue with detailed information about your problem
4. Reach out on the project's discussion board

## Updating the Dashboard

To update to the latest version:

1. **Pull the latest changes**:
   ```bash
   git pull origin main
   ```

2. **Install any new dependencies**:
   ```bash
   npm install
   ```

3. **Run migrations if available**:
   ```bash
   npm run migrate
   ```

4. **Restart the server**:
   ```bash
   npm run dev
   ```
   or
   ```bash
   npm run start-prod
   ```