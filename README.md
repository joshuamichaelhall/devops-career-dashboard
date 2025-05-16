# DevOps Career Dashboard

A comprehensive dashboard for tracking your DevOps career progress, learning resources, and professional networking activities.

![Dashboard Overview](screenshots/dashboard-overview.png)

## Demo Available

A live demo of this dashboard is available at [devops-dashboard.joshuamichaelhall.com](https://devops-dashboard.joshuamichaelhall.com?demo=true). The demo version includes sample data showing approximately 90% career progress and is clearly marked as a demonstration.

## Additional Screenshots

### Networking Section
![Networking Tracker](screenshots/dashboard-network.png)

### Learning Resources
![Learning Tracker](screenshots/dashboard-learning.png)

- **Live Demo**: [devops-dashboard.joshuamichaelhall.com](https://devops-dashboard.joshuamichaelhall.com?demo=true)
- **Project Page**: [joshuamichaelhall.com/dashboard](https://joshuamichaelhall.com/dashboard)
- **Development Article**: [Strategic Approach to DevOps Skills](https://joshuamichaelhall.com/blog/2025/05/15/strategic-approach-to-devops-skills)

## About this Project

This dashboard was created to help DevOps professionals and career transitioners monitor their progress, focus their learning efforts, and track career advancement metrics. It serves as both a productivity tool and a personal career development center.

### Key Features

- **Career Goal Tracking**: Monitor progress toward your DevOps career objectives
- **Learning Resource Management**: Track courses, tutorials, and certifications
- **Time Allocation Visualization**: Log and analyze how your time is spent
- **Networking Integration**: Connect with Clay CRM (optional) to track professional networking
- **Weekly Progress Metrics**: Visualize your productivity and achievements
- **Personalized Dashboard**: Configure the dashboard to focus on your specific career path
- **Schedule Modes**: Choose between full-time (50 hours/week), part-time (20 hours/week), or weekend study modes
- **Career Templates**: Start with pre-configured career paths or build your own from scratch
- **Data Backup & Restore**: Automatic daily backups with easy restore functionality

### Why Use This Dashboard

As DevOps roles continue to evolve, it's challenging to keep track of the many skills, tools, and practices needed to excel in the field. This dashboard provides:

- A central location for all career development activities
- Data-driven insights into your learning patterns
- Accountability through progress tracking
- Visualization of your DevOps journey
- Flexible scheduling options for different life situations

## Development Process with Claude.ai

This dashboard was built using Claude.ai's code assistance capabilities. The development process combined:

1. **Terminal-centric workflow**: Utilizing Claude in the terminal for real-time code generation
2. **AI-augmented development**: Leveraging Claude for architecture decisions and implementation
3. **Iterative refinement**: Starting with a basic framework and progressively enhancing functionality

The collaborative process between human direction and AI assistance allowed for rapid development while maintaining control over design decisions and implementation details.

### Development Approach

The dashboard was developed using a "vibe coding" approach:

1. Start with a clear vision of the desired outcome and user experience
2. Describe the functionality and architecture to Claude
3. Iterate through implementation together, with Claude handling code generation
4. Refine and test the code, providing feedback for improvements

This process dramatically accelerated development time while ensuring the final product aligned with the original vision.

## Technologies Used

- **Frontend**: React, TailwindCSS
- **Backend**: Node.js, Express
- **Data Storage**: JSON-based persistent storage with automatic backups
- **Authentication**: JWT-based auth with bcrypt password hashing
- **Security**: Helmet.js, rate limiting, encrypted storage for sensitive data
- **API Integration**: Clay CRM for networking (optional)

## Repository Structure

```
devops-career-dashboard/
├── dashboard/              # Main application code
│   ├── public/             # Static assets
│   ├── scripts/            # Utility scripts
│   ├── server/             # Server-side code
│   └── src/                # Frontend React code
│      ├── components/      # React components
│      ├── context/         # Context API state management
│      ├── data/            # Data storage
│      │   ├── templates/   # Career path templates
│      │   └── backups/     # Automatic backups
│      └── services/        # API services
├── docs/                   # Additional documentation
└── screenshots/            # Screenshots for documentation
```

## Data Templates & Career Paths

The dashboard includes several pre-configured career templates:

- **Entry Path**: For those starting their DevOps journey
- **Accelerated Path**: For experienced professionals transitioning to DevOps
- **Custom Path**: A blank slate to build your own program
- **Personal Templates**: Create and save your own customized career paths

### Schedule Modes

Choose from three schedule options:

1. **Full-Time (50 hours/week)**: Intensive study for career changers
   - 25 hours learning
   - 12.5 hours projects
   - 7.5 hours networking
   - 5 hours content creation

2. **Part-Time (20 hours/week)**: For working professionals
   - 10 hours learning
   - 5 hours projects
   - 3 hours networking
   - 2 hours content creation

3. **Weekend (20 hours/week)**: Weekend-focused schedule
   - Same allocation as part-time but concentrated on weekends

## Installation & Setup

### Prerequisites

- Node.js 14+ and npm
- Git

### Installation Steps

1. **Clone the Repository**
   ```bash
   git clone https://github.com/joshuamichaelhall/devops-career-dashboard.git
   cd devops-career-dashboard
   ```

2. **Install Dependencies**
   ```bash
   cd dashboard
   npm install
   ```

3. **Set Up Environment**
   ```bash
   # Copy the environment template
   cp .env.example .env
   
   # Configure your settings in .env
   nano .env
   ```

4. **Initialize Data**
   ```bash
   # Choose a template to start with
   ./scripts/reset-dashboard.js
   ```

5. **Start the Dashboard**
   ```bash
   # For personal use
   ./start-personal.sh
   
   # For demo mode (read-only)
   ./start-demo.sh
   ```

The dashboard will be available at `http://localhost:3000`

### Configuration Options

1. **Admin Setup**: Run `npm run setup-admin` to configure admin access
2. **API Keys**: Configure Clay CRM integration in the dashboard settings
3. **Backup Settings**: Automatic backups are enabled by default

## Career Templates

### Using Templates

When starting fresh or resetting your dashboard, you can choose from several templates:

1. **Entry/Mid-Tier DevOps Path**: 12-month plan for entry-level professionals
2. **Accelerated Senior Path**: 18-month plan for experienced professionals
3. **Custom Career Path**: Build your own program from scratch
4. **Personal Templates**: Import your own career configuration

To reset and choose a new template:
```bash
./scripts/reset-dashboard.js
```

## Data Management

### Backup & Restore

- **Automatic Backups**: Daily backups are created automatically
- **Manual Backup**: Use Data Manager in the dashboard
- **Restore**: Select from available backups in Data Manager
- **Export/Import**: Export your data for sharing or backup

### Data Structure

Your dashboard data includes:
- Career roadmap with phases and milestones
- Skills tracking across 6 categories
- Weekly schedule and time allocations
- Goals, projects, and certifications
- Learning resources and progress
- Networking metrics and connections

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines on how to contribute to this project.

## Security Features

- JWT authentication for secure access
- Encrypted storage for API keys
- Rate limiting for API protection
- CORS configuration
- Security headers via Helmet.js

## Deployment Options

### Local/Personal Use
- Run on your local machine for personal tracking
- Data stored locally with automatic backups

### Cloud Deployment
- See [FREE-HOSTING-GUIDE.md](docs/FREE-HOSTING-GUIDE.md) for hosting options
- Deploy to Render, Railway, or similar platforms

### Demo Mode
- Read-only mode for showcasing the dashboard
- Separate demo data that doesn't affect personal data

## Documentation

- [Installation Guide](docs/INSTALLATION.md)
- [FAQ](docs/FAQ.md)
- [Security Information](docs/SECURITY.md)
- [Privacy Details](docs/PRIVACY.md)
- [Roadmap Configuration](dashboard/docs/ROADMAP-CONFIGURATION.md)
- [Templates Guide](dashboard/docs/TEMPLATES.md)

## Author

**Joshua Michael Hall**
- Website: [joshuamichaelhall.com](https://joshuamichaelhall.com)
- GitHub: [@joshuamichaelhall](https://github.com/joshuamichaelhall)
- LinkedIn: [linkedin.com/in/joshuamichaelhall](https://linkedin.com/in/joshuamichaelhall)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Built with assistance from Claude.ai
- Inspired by the need for better career tracking tools in DevOps
- Thanks to the open source community for the amazing tools and libraries

---

For more information, visit the [project page](https://joshuamichaelhall.com/dashboard) or try the [live demo](https://devops-dashboard.joshuamichaelhall.com?demo=true).