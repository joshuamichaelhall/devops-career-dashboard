# Dashboard Template Options

The DevOps Career Dashboard supports multiple career path templates to suit different experience levels and career goals. This allows you to quickly set up the dashboard with predefined goals, skills, and roadmaps based on your situation.

## Available Templates

The dashboard provides six primary template options:

### 1. Accelerated Senior DevOps Path

**File:** `src/data/templates/accelerated-path.json`

This template is designed for professionals with prior IT experience who want to quickly transition to senior DevOps roles in the financial services industry. It follows an accelerated 18-month roadmap with:

- Intensive 50-hour weekly schedule (25h learning, 12.5h projects, 7.5h networking, 5h content)
- Focus on AWS Solutions Architect Associate and Terraform certifications within 4 months
- Three advanced projects focused on financial services infrastructure, CI/CD, and container security
- Comprehensive networking strategy with Clay CRM integration
- AWS DevOps Professional certification within 12-15 months
- Timeline for securing a mid-level position ($90K-$150K) with career advancement plan

### 2. Entry/Mid-Tier DevOps Path

**File:** `src/data/templates/entry-path.json`

This template is designed for those transitioning into DevOps with less prior experience, focused on securing an entry-level or mid-tier DevOps position. It features:

- More manageable 30-hour weekly schedule
- Focus on AWS Cloud Practitioner as a first certification stepping stone
- Smaller initial projects to build foundational skills
- Progressive networking strategy starting with 10 connections per week
- 12-month timeline to secure a junior DevOps position
- Clear path to AWS Solutions Architect Associate as a second certification

### 3. Mid-Career Professional Path

**File:** `src/data/templates/mid-career.json`

For professionals already working in tech who want to transition to DevOps:

- Balanced 35-40 hour weekly schedule
- Focus on practical skills and certifications
- Projects that demonstrate real-world experience
- Strategic networking within current industry
- 12-18 month transition timeline

### 4. Senior Career Transition

**File:** `src/data/templates/senior-career.json`

For senior professionals focusing on DevOps leadership and architecture:

- Flexible 20-30 hour weekly schedule
- Leadership and architecture focus
- Strategic certifications (AWS Professional, Security)
- Mentoring and content creation emphasis
- Ongoing career development

### 5. Custom Career Path

**File:** `src/data/templates/custom-path.json`

A blank template that allows you to build your career development plan from scratch. It provides the structure for:

- Defining your own skills and target proficiency levels
- Setting custom certification goals
- Creating personalized projects
- Establishing your own weekly schedule
- Defining custom networking targets
- Creating a unique roadmap with custom phases and milestones

### 6. Personal DevOps in Finance

**File:** `src/data/templates/personal-devops-finance.json`

A specialized template for DevOps career transition focused on financial services:

- Full 50-hour weekly schedule from Schedule.md
- 4-phase career roadmap (Foundation, Implementation, Employment, Leadership)
- Comprehensive skill tracking across 6 categories
- Financial services-specific projects and compliance focus
- Detailed networking strategy (25-30 connections/week)
- Complete certification path (AWS SAA, Terraform, AWS DevOps Pro)

## Schedule Modes

All templates support three schedule modes:

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
- Concentrated on weekends

## Using Templates

### Initial Setup

When first installing the dashboard, the default template (`initial-data.json`) will be loaded. This provides a generic DevOps career starting point with:

- Basic career phases
- Standard weekly schedule
- Empty skill categories ready for customization
- Simple starter goals

### Switching Templates

To switch to a different template:

```bash
# Run the reset script
./scripts/reset-dashboard.js

# You'll see options:
# 1. Accelerated Senior DevOps Path
# 2. Entry/Mid-Tier DevOps Path
# 3. Custom Career Path
# 4. Original Initial Data

# Select your preference by number
```

### Command Line Template Selection

You can also specify a template directly:

```bash
# Use a specific template
./scripts/reset-dashboard.js --template accelerated-path
```

Available template names:
- `accelerated-path`
- `entry-path`
- `mid-career`
- `senior-career`
- `custom-path`
- `personal-devops-finance`
- `initial` (default)

## Template Structure

All templates follow the same JSON structure:

```json
{
  "overview": {
    "phase": "Current Phase",
    "careerRoadmap": {
      "currentPhase": 1,
      "totalPhases": 4,
      "phaseDetails": {...}
    }
  },
  "scheduleSettings": {
    "scheduleType": "fullTime",
    "weeklyHours": 50,
    "availableModes": {...}
  },
  "weeklySchedule": {...},
  "skills": [...],
  "certifications": [...],
  "projects": [...],
  "goals": [...],
  "learningResources": [...],
  "networking": {...},
  "tasks": [...],
  "backupConfig": {...},
  "dashboardConfig": {...}
}
```

## Creating Custom Templates

### Step 1: Copy Existing Template

```bash
cd dashboard/src/data/templates
cp custom-path.json my-custom-template.json
```

### Step 2: Edit Your Template

Modify the JSON file to include:
- Your career phases and timeline
- Skill categories and target levels
- Certification goals
- Project plans
- Weekly schedule
- Networking targets

### Step 3: Use Your Template

Either:
1. Place in templates directory and use `reset-dashboard.js`
2. Import via Data Manager in the dashboard UI

## Template Best Practices

1. **Be Realistic**: Set achievable weekly hours based on your actual availability
2. **Progressive Skills**: Start with fundamentals, build complexity gradually
3. **Balanced Time**: Mix learning, projects, networking, and content creation
4. **Regular Reviews**: Plan monthly and quarterly checkpoints
5. **Industry Focus**: Customize for your target industry requirements

## Data Migration

### Backing Up Current Data

Before switching templates:

```bash
# Automatic backup is created when resetting
# Manual backup via dashboard Data Manager
# Or copy data file directly:
cp src/data/data.json src/data/backups/my-backup.json
```

### Importing/Exporting

Use the Data Manager in the dashboard to:
- Export current configuration
- Import template files
- Restore from backups

## Template Updates

Templates are periodically updated with:
- New industry trends
- Updated certification paths
- Revised skill priorities
- Community feedback

Check the repository for the latest template versions.

## Support

For template questions or issues:
- Review the FAQ
- Check template examples
- Submit GitHub issues
- Contact support

Remember: Templates are starting points. The dashboard is designed to evolve with your career journey!