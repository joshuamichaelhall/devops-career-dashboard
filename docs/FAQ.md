# Frequently Asked Questions

## General Questions

### What is the DevOps Career Dashboard?

The DevOps Career Dashboard is a comprehensive tool designed to help you track and manage your DevOps career progression. It includes features for monitoring skills development, learning resources, time allocation, and networking activities.

### Who is this dashboard for?

This dashboard is ideal for:
- DevOps engineers looking to track their skills and career growth
- IT professionals transitioning to DevOps roles
- Team leads or managers mentoring DevOps professionals
- Anyone following a structured DevOps learning path

### Is this dashboard free to use?

Yes, the DevOps Career Dashboard is open source and free to use under the MIT license. You can deploy it on your own server or local machine at no cost.

## Setup and Installation

### What are the minimum system requirements?

- Node.js 14 or higher
- 512MB RAM (minimum)
- 1GB of disk space
- Modern web browser (Chrome, Firefox, Safari, Edge)

### How do I set up authentication?

Run the setup script to create your admin user:
```bash
npm run setup-admin
```

This will prompt you to create a username and password, then generate a secure hash and save it to your .env file.

### How do I reset my admin password if I forget it?

Run the setup-admin script again to create a new password:
```bash
npm run setup-admin
```

### Can multiple users access the dashboard?

Currently, the dashboard supports a single admin user. If you need multi-user functionality, you would need to modify the authentication system to support multiple users and roles.

## Features and Usage

### How does the dashboard track my skills?

You can add skills to your dashboard and update their proficiency levels. The dashboard visualizes your skills by category and shows your progress over time.

### Can I track certification progress?

Yes, you can add certifications to your learning resources and track your progress toward completion.

### How do I log my time spent on different activities?

Use the Time Logging feature to record hours spent on various activities like learning, networking, or project work. The dashboard will visualize your time allocation.

### What is the Clay CRM integration?

The dashboard can optionally integrate with Clay CRM to track networking activities. This helps you manage professional connections and follow-ups as part of your career development.

### How do I ensure my API keys are stored securely?

API keys (like the Clay CRM key) are encrypted using AES-256-GCM encryption. The dashboard also supports using environment variables for API keys, which is the most secure method.

## Customization and Extension

### Can I customize the dashboard categories?

Yes, the dashboard is highly customizable. You can modify the data structure in `src/data/data.json` to add or change categories.

### How do I add my own metrics or tracking features?

To add new metrics:
1. Update the data structure in `src/data/data.json`
2. Add API endpoints in `server.js` to handle the new data
3. Create React components in `src/components/` for visualization
4. Update the dashboard layout in `src/Dashboard.js`

### Can I connect the dashboard to other services?

Yes, you can extend the dashboard to connect to other services:
1. Create service integration files in `src/services/`
2. Add API endpoints in `server.js` for the new service
3. Create UI components for the service integration
4. Update the dashboard to show the new integration

## Technical Support

### The dashboard won't start. What should I check?

1. Verify that Node.js is installed correctly (`node -v`)
2. Check if the required ports (3001, 3002) are available
3. Ensure all dependencies are installed (`npm install`)
4. Check your .env file for correct configuration
5. Look for error messages in the console output

### How do I report a bug?

Please report bugs by creating an issue on the GitHub repository. Include:
- Detailed description of the problem
- Steps to reproduce the issue
- Expected behavior
- Screenshots if applicable
- Environment details (OS, browser, Node.js version)

### Where can I request new features?

Feature requests can be submitted as issues on the GitHub repository. Please label them as "enhancement" and provide a clear description of the requested functionality and why it would be valuable.

## Data Management

### How is my data stored?

Your data is stored locally in JSON files within the `src/data/` directory. The dashboard creates automatic backups before modifications.

### Can I export my data?

There's no built-in export feature, but since data is stored in JSON format, you can manually copy the files from the `src/data/` directory.

### Is my data synced to the cloud?

No, the dashboard stores all data locally by default. If you want cloud synchronization, you would need to modify the dashboard to use a cloud database or storage service.

### How do I back up my dashboard data?

The dashboard automatically keeps backups of previous versions in `src/data/backups/`. For manual backups, copy the files from the `src/data/` directory to a secure location.