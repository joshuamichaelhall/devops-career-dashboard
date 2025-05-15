# Installation Guide for Forked Repositories

This guide provides detailed instructions for setting up your DevOps Career Dashboard after forking the repository. The new setup process allows you to customize your dashboard for your specific career goals and technical focus.

## Prerequisites

- Node.js 14+ and npm
- Git
- 30 minutes of time for setup and configuration

## Basic Installation Steps

1. Fork the repository on GitHub
2. Clone your forked repository:
   ```bash
   git clone https://github.com/YOUR-USERNAME/devops-career-dashboard.git
   cd devops-career-dashboard/dashboard
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Create environment variables:
   ```bash
   cp .env.example .env
   ```

5. Generate encryption key:
   ```bash
   npm run generate-encryption-key
   ```
   Copy the generated key to your `.env` file.

## Initial Configuration Wizard

The new setup wizard will guide you through configuring your dashboard:

```bash
npm run setup-admin
```

This will:

1. Create your admin account credentials
2. Launch the configuration wizard
3. Walk you through personalizing your dashboard

### Configuration Options

During setup, you'll be asked to choose:

#### 1. Career Stage

- **Early Career (0-2 years)**:
  - Focus on foundational skills
  - Entry-level certifications
  - Basic projects

- **Mid-Career (2-5 years)**:
  - Specialization in specific areas
  - Advanced certifications
  - More complex projects

- **Senior (5+ years)**:
  - Leadership and architecture focus
  - Specialized skills development
  - Mentoring and content creation

#### 2. Technical Focus Areas

Select from these DevOps specializations:

- **AWS/Cloud**: Cloud architecture, AWS services, cloud-native apps
- **Kubernetes/Containers**: Container orchestration, microservices
- **Infrastructure as Code**: Terraform, CloudFormation, automation
- **CI/CD Pipeline**: Continuous integration and deployment
- **DevOps Generalist**: Balanced focus across all areas

You can select multiple areas to create a customized skill focus.

#### 3. Weekly Schedule Type

- **Full-Time (50 hours/week)**: For career changers or intensive learning
- **Part-Time (20 hours/week)**: For working professionals
- **Weekend-Focused**: Concentrated learning on weekends

#### 4. Default Projects

Choose 3 projects to start with:
- The wizard will suggest projects based on your selected track
- You can customize project details and target dates

#### 5. Initial Learning Resources

The wizard will create an initial learning resource queue based on your selections.

## Starting Your Dashboard

After configuration, start your dashboard:

```bash
./start-personal.sh
```

Your dashboard will launch with all your selected configurations loaded.

## Manual Configuration (Alternative)

If you prefer to configure your dashboard manually after installation:

1. Start with a basic setup:
   ```bash
   npm run setup-admin
   ```
   Skip the wizard configuration steps.

2. Start your dashboard:
   ```bash
   ./start-personal.sh
   ```

3. Use the import features in each section:
   - Import skills templates from the Skills tab
   - Import project suggestions from the Projects tab
   - Import learning resources from the Learning tab
   - Import schedule templates from the Schedule tab
   - Import task templates from the Tasks tab

## Resetting or Starting Over

If you want to reset your configuration at any time:

```bash
./reset-dashboard.sh
```

This will create a backup of your data and return to the initial setup.

## Data Management

Your personal dashboard data is stored in:
- `dashboard/src/data/data.json` (main data file)
- `dashboard/src/data/backups/` (automatic backups)

Your dashboard data is NOT stored in git and will not be pushed to your repository.

## Troubleshooting

### Port Conflicts

If you experience port conflicts:

```bash
./emergency-restart.sh
```

This will kill all Node.js processes and restart the dashboard with the correct ports.

### Data Corruption

If your dashboard data becomes corrupted:

1. Stop the dashboard
2. Restore from a backup:
   ```bash
   cp dashboard/src/data/backups/data-YYYY-MM-DD.json dashboard/src/data/data.json
   ```
3. Restart the dashboard

## Advanced Customization

See [NEW-FEATURES.md](NEW-FEATURES.md) for advanced customization options after installation.