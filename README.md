# DevOps Career Dashboard

A comprehensive dashboard for tracking your DevOps career progress, learning resources, and professional networking activities.

![Dashboard Screenshot](screenshots/dashboard.png)

## About this Project

This dashboard was created to help DevOps professionals and career transitioners monitor their progress, focus their learning efforts, and track career advancement metrics. It serves as both a productivity tool and a personal career development center.

### Key Features

- **Career Goal Tracking**: Monitor progress toward your DevOps career objectives
- **Learning Resource Management**: Track courses, tutorials, and certifications
- **Time Allocation Visualization**: Log and analyze how your time is spent
- **Networking Integration**: Connect with Clay CRM (optional) to track professional networking
- **Weekly Progress Metrics**: Visualize your productivity and achievements
- **Personalized Dashboard**: Configure the dashboard to focus on your specific career path

### Why Use This Dashboard

As DevOps roles continue to evolve, it's challenging to keep track of the many skills, tools, and practices needed to excel in the field. This dashboard provides:

- A central location for all career development activities
- Data-driven insights into your learning patterns
- Accountability through progress tracking
- Visualization of your DevOps journey

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
│      └── services/        # API services
├── docs/                   # Additional documentation
└── screenshots/            # Screenshots for documentation
```

## Installation & Setup

### Prerequisites

- Node.js 14+ and npm
- Git

### Installation Steps

1. Clone the repository:
   ```
   git clone https://github.com/joshuamichaelhall/devops-career-dashboard.git
   cd devops-career-dashboard/dashboard
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create environment variables:
   ```
   cp .env.example .env
   ```

4. Set up security (required for production use):
   ```
   npm run secure-setup
   ```
   This will:
   - Generate a secure encryption key for API credentials
   - Create an admin user for dashboard access

5. Start the dashboard in development mode:
   ```
   npm run dev
   ```

6. For production:
   ```
   npm run build
   npm run start-prod
   ```

## Security Features

- **Authentication**: JWT-based authentication with secure password storage
- **API Key Protection**: Encrypted storage for sensitive API keys
- **HTTPS Enforcement**: Option to require HTTPS in production
- **Rate Limiting**: Protection against brute-force attacks
- **Input Validation**: Comprehensive validation on all API endpoints
- **Helmet.js**: HTTP header security
- **Access Controls**: Role-based permissions (admin/read-only)

## Contributing

Contributions are welcome! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for details on how to participate in this project.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgements

This project was built with assistance from [Claude.ai](https://claude.ai/), Anthropic's AI assistant. Claude helped with:
- Architecture design decisions
- Code generation and implementation
- Security considerations
- Documentation

Networking functionality optionally integrates with [Clay](https://clay.com/) for CRM capabilities.

---

## Screenshots

<div align="center">
  <img src="screenshots/dashboard.png" alt="Main Dashboard View" width="80%" />
  <p><i>Main Dashboard View</i></p>
  
  <img src="screenshots/learning-resources.png" alt="Learning Resources" width="80%" />
  <p><i>Learning Resources Tracker</i></p>
  
  <img src="screenshots/networking.png" alt="Networking Integration" width="80%" />
  <p><i>Networking Integration with Clay CRM</i></p>
</div>