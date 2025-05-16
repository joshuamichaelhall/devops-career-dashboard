# Port Configuration Guide

## Default Port Configuration

The DevOps Career Dashboard uses the following default ports:

- **React Frontend**: Port 3000
- **API/Backend Server**: Port 3005

## Changing Ports

If you need to change these ports due to conflicts with other applications, follow these steps:

### Changing the API Server Port

1. Edit the `.env` file in the `dashboard` directory:
   ```
   PORT=your_new_port_number
   ```

2. Update the API URL for the client to connect to:
   ```
   REACT_APP_API_URL=http://localhost:your_new_port_number/api
   ```

3. Update the `start-dashboard.sh` script to kill processes on your new port:
   ```bash
   # Find this line
   kill -9 $(lsof -ti:3001,3002,3005) 2>/dev/null || true
   
   # Add your new port
   kill -9 $(lsof -ti:3001,3002,3005,your_new_port_number) 2>/dev/null || true
   ```

### Changing the React Frontend Port

The React development server runs on port 3000 by default. To change it:

1. Create or edit `.env.development` in the `dashboard` directory:
   ```
   PORT=your_new_frontend_port
   ```

2. Or, set it directly when starting the React app:
   ```bash
   PORT=your_new_frontend_port npm start
   ```

## Troubleshooting Port Conflicts

If you experience port conflicts:

1. **Identify processes using your ports**:
   ```bash
   lsof -i :3000
   lsof -i :3005
   ```

2. **Kill processes using those ports**:
   ```bash
   kill -9 $(lsof -ti:3000,3005)
   ```

3. **Use the restart script**:
   ```bash
   ./restart-dashboard.sh --clean
   ```
   This script will automatically kill any conflicting processes and set up the correct port configuration.

## Port References in Code

If you change ports, you might need to update references in these files:

- `/dashboard/.env`
- `/dashboard/server.js`
- `/dashboard/src/services/api.js`
- `/dashboard/start-dashboard.sh`
- `/restart-dashboard.sh`

## Production Deployment

In production, the API server and frontend are served from the same port (3005 by default). Make sure your production environment has this port available or update the `PORT` environment variable accordingly.