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

## Templates and Career Paths

### What templates are available?

The dashboard includes six pre-configured templates:
1. **Accelerated Path** - For experienced professionals (50 hours/week)
2. **Entry Path** - For beginners (30 hours/week)
3. **Mid-Career** - For current tech professionals (35-40 hours/week)
4. **Senior Career** - For leadership focus (20-30 hours/week)
5. **Custom Path** - Build from scratch
6. **Personal DevOps Finance** - Specialized finance industry focus

### How do I switch between templates?

Use the reset script to choose a different template:
```bash
./scripts/reset-dashboard.js
```

Or specify a template directly:
```bash
./scripts/reset-dashboard.js --template entry-path
```

### Can I create my own template?

Yes! Copy an existing template and modify it:
```bash
cd dashboard/src/data/templates
cp custom-path.json my-template.json
```

Then edit the JSON file to customize skills, goals, and schedules.

## Schedule Modes

### What schedule modes are available?

Three modes are available:
- **Full-Time**: 50 hours/week
- **Part-Time**: 20 hours/week
- **Weekend**: 20 hours/week (weekend-focused)

### How do I change schedule modes?

1. Navigate to Weekly Schedule in the dashboard
2. Select schedule type from the dropdown
3. Changes are saved automatically

### Do schedule changes affect my data?

No, changing schedule modes only affects time allocations and weekly targets. Your progress, skills, and goals remain unchanged.

## Features and Usage

### How do I backup my data?

Data is backed up automatically daily. You can also:
- Use Data Manager to export data manually
- Copy the `data.json` file directly
- Use the backup directory at `src/data/backups/`

### Can I import/export my configuration?

Yes, use the Data Manager feature to:
- Export your current configuration as JSON
- Import templates or previous exports
- Restore from automatic backups

### How do I track weekly progress?

Update your progress through:
- Skills Progress Updater (for skill levels)
- Task Manager (for task completion)
- Resource Management (for course progress)
- Time Tracker (for logging hours)

### What is Clay CRM integration?

Clay CRM integration allows you to:
- Track professional networking activities
- Manage LinkedIn connections
- Schedule follow-ups
- Monitor engagement metrics

This is optional and requires a Clay API key.

### How do I set up Clay CRM?

1. Get your Clay API key from clay.com
2. Navigate to Settings > Clay Configuration
3. Enter your API key
4. Test the connection

## Data and Privacy

### Where is my data stored?

All data is stored locally in JSON files on your server:
- Main data: `src/data/data.json`
- Backups: `src/data/backups/`
- Templates: `src/data/templates/`

### Is my data secure?

Yes, the dashboard includes:
- JWT authentication for access control
- Encrypted storage for API keys
- Automatic backups
- No external data transmission (except optional Clay CRM)

### Can I delete all my data?

Yes, you can:
- Use reset scripts to start fresh
- Manually delete data files
- Use Data Manager to clear specific sections

## Troubleshooting

### The dashboard won't start

Check:
1. Node.js version (14+ required)
2. Dependencies installed (`npm install`)
3. Environment variables configured (`.env` file)
4. Port availability (3000 and 3005)

### I can't log in

Try:
1. Reset your password with `npm run setup-admin`
2. Clear browser cache
3. Check `.env` file for correct settings
4. Verify JWT token expiration settings

### Data isn't loading

Solutions:
1. Clear localStorage in browser
2. Check browser console for errors
3. Verify `data.json` file exists
4. Try running reset script

### Schedule changes aren't saving

Ensure:
1. You're logged in as admin
2. Server is running correctly
3. No JavaScript errors in console
4. Data file has write permissions

## Deployment

### Can I deploy to the cloud?

Yes, see the [FREE-HOSTING-GUIDE.md](FREE-HOSTING-GUIDE.md) for:
- Render deployment
- Railway deployment
- Other PaaS options

### How do I run in production?

Use the production script:
```bash
npm run build
npm run server
```

Or use environment variables:
```bash
NODE_ENV=production npm start
```

### Can I run this on a Raspberry Pi?

Yes, the dashboard works on ARM processors. Ensure:
- Node.js is installed for ARM
- Sufficient RAM (512MB+)
- Persistent storage for data

## Support

### Where can I get help?

- GitHub Issues: Report bugs and request features
- Documentation: Check `/docs` folder
- Community: Join discussions on GitHub

### How can I contribute?

See [CONTRIBUTING.md](../CONTRIBUTING.md) for:
- Code contribution guidelines
- Documentation improvements
- Bug reporting process
- Feature request process

### Is commercial use allowed?

Yes, the MIT license allows commercial use. You can:
- Deploy for your team/company
- Modify for specific needs
- Integrate with other tools
- Offer as a service (with attribution)