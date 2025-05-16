# DevOps Career Dashboard - New Features Guide

This guide covers the new features added in version 1.2.0 of the DevOps Career Dashboard. These enhancements make it easier to customize your dashboard based on your career stage and technical focus areas.

## Table of Contents

1. [Career Templates System](#career-templates-system)
2. [Schedule Modes](#schedule-modes)
3. [Real Career Roadmap Data](#real-career-roadmap-data)
4. [Data Backup & Restore](#data-backup--restore)
5. [Personal vs Generic Data](#personal-vs-generic-data)
6. [Weekly Goals Tracking](#weekly-goals-tracking)
7. [Enhanced Time Tracking](#enhanced-time-tracking)

## Career Templates System

The dashboard now includes a comprehensive template system with pre-configured career paths.

### Available Templates

1. **Accelerated Path** - 18-month intensive program for experienced professionals
2. **Entry Path** - 12-month program for beginners
3. **Mid-Career** - Balanced program for working professionals
4. **Senior Career** - Leadership and architecture focus
5. **Custom Path** - Build your own from scratch
6. **Personal DevOps Finance** - Specialized finance industry template

### Using Templates

```bash
# Select a template during reset
./scripts/reset-dashboard.js

# Or specify directly
./scripts/reset-dashboard.js --template entry-path
```

### Template Features

Each template includes:
- Complete career roadmap with phases
- Pre-configured skills and target levels
- Certification timeline
- Project suggestions
- Weekly schedule
- Networking targets

## Schedule Modes

Three flexible schedule modes to fit different lifestyles:

### Full-Time Mode (50 hours/week)
- 25 hours learning
- 12.5 hours projects
- 7.5 hours networking
- 5 hours content creation

### Part-Time Mode (20 hours/week)
- 10 hours learning
- 5 hours projects
- 3 hours networking
- 2 hours content creation

### Weekend Mode (20 hours/week)
- Same allocation as part-time
- Optimized for weekend scheduling

### Switching Modes

Change modes anytime through the Weekly Schedule component:
1. Navigate to Weekly Schedule
2. Select schedule type from dropdown
3. Changes save automatically

## Real Career Roadmap Data

The dashboard now includes comprehensive career data:

### 4-Phase Career Journey
1. **Foundation Phase** (4 months) - AWS & Infrastructure as Code
2. **Implementation Phase** (2 months) - DevOps practices & job prep
3. **Employment Phase** (12 months) - On-the-job advancement
4. **Leadership Phase** (3 months) - Specialization & leadership

### Complete Skill Tracking
- 75+ specific skills across 6 categories
- AWS Cloud Platform (12 skills)
- Infrastructure as Code (6 skills)
- Containerization (6 skills)
- CI/CD (6 skills)
- Monitoring & Observability (6 skills)
- Scripting & Automation (6 skills)

### Real Projects
- Financial Services AWS Infrastructure
- Automated CI/CD Pipeline
- Container Microservices Platform
- Each with business value and components

## Data Backup & Restore

Enhanced data protection and recovery:

### Automatic Backups
- Daily automatic backups
- 30-day retention policy
- Stored in `src/data/backups/`

### Manual Backup Options
- Export via Data Manager
- Direct file copy
- Version control integration

### Restore Features
- Restore from any backup
- Import custom configurations
- Template switching with data preservation

## Personal vs Generic Data

Clear separation between personal and shared data:

### For Repository Users
- Generic `initial-data.json` with standard DevOps path
- No personal information shared
- Professional weekly schedule
- Customizable templates

### For Personal Use
- Personal template with your specific schedule
- Your career roadmap from devops-career-strategy
- Custom networking targets
- Industry-specific focus

### Demo Mode
- Separate demo data with fictional progress
- Clearly marked as demonstration
- No real personal data exposed

## Weekly Goals Tracking

New weekly goals feature with:

### Goal Categories
- Certification modules
- Infrastructure components
- Architecture diagrams
- GitHub contributions
- DevOps connections
- Technical content
- Meetup attendance
- Practice hours

### Tracking Features
- Checkbox completion
- Quantity tracking
- Weekly reset option
- Progress visualization

## Enhanced Time Tracking

Improved time allocation tracking:

### Category Breakdown
- Learning hours
- Project hours
- Networking hours
- Content creation hours

### Visual Analytics
- Weekly progress bars
- Category pie charts
- Trend analysis
- Target vs actual comparison

### Schedule Integration
- Syncs with weekly schedule
- Adjusts targets based on mode
- Real-time updates

## Quick Start Guide

1. **Fork the Repository**
   ```bash
   git clone https://github.com/your-username/devops-career-dashboard
   cd devops-career-dashboard
   ```

2. **Install Dependencies**
   ```bash
   cd dashboard
   npm install
   ```

3. **Choose Your Template**
   ```bash
   ./scripts/reset-dashboard.js
   # Select from available templates
   ```

4. **Configure Schedule**
   - Start with full-time if available
   - Switch to part-time as needed
   - Use weekend mode for minimal commitment

5. **Start Tracking**
   ```bash
   ./start-personal.sh
   ```

## Migration from Previous Versions

If upgrading from an earlier version:

1. **Backup Current Data**
   ```bash
   cp src/data/data.json src/data/backups/pre-upgrade.json
   ```

2. **Install Updates**
   ```bash
   git pull
   npm install
   ```

3. **Migrate Data**
   - Use Data Manager to export old data
   - Reset with new template
   - Import relevant sections

## Best Practices

1. **Choose Realistic Templates**
   - Start with entry-path if new to DevOps
   - Use part-time mode if working full-time
   - Adjust targets based on progress

2. **Regular Updates**
   - Update skills weekly
   - Track time daily
   - Review goals monthly

3. **Use Backups**
   - Let automatic backups run
   - Export before major changes
   - Keep personal templates separate

4. **Customize Thoughtfully**
   - Start with templates
   - Modify based on experience
   - Share improvements back

## Troubleshooting

### Template Issues
- Verify JSON syntax in templates
- Check file permissions
- Use reset script for clean slate

### Schedule Problems
- Clear browser cache
- Check total hours allocation
- Verify schedule mode setting

### Data Loss
- Check backup directory
- Use Data Manager restore
- Contact support if needed

For more help, see the [FAQ](../../docs/FAQ.md) or submit an issue on GitHub.