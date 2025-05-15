# Dashboard Template Options

The DevOps Career Dashboard supports multiple career path templates to suit different experience levels and career goals. This allows you to quickly set up the dashboard with predefined goals, skills, and roadmaps based on your situation.

## Available Templates

The dashboard provides three primary template options:

### 1. Accelerated Senior DevOps Path

**File:** `src/data/templates/accelerated-path.json`

This template is designed for professionals with prior IT experience who want to quickly transition to senior DevOps roles in the financial services industry. It follows an accelerated 18-month roadmap with:

- Intensive 50-hour weekly schedule (25h learning, 12.5h projects, 7.5h networking, 5h content)
- Focus on AWS Solutions Architect Associate and Terraform certifications within 4 months
- Three advanced projects focused on financial services infrastructure, CI/CD, and container security
- Comprehensive networking strategy with Clay CRM integration
- AWS DevOps Professional certification within 12-15 months
- Timeline for securing a mid-level position ($90K-$150K) with career advancement plan

This template incorporates the complete roadmap from the devops-career-strategy repository, including weekly schedules, networking targets, and specialized financial services focus.

### 2. Entry/Mid-Tier DevOps Path

**File:** `src/data/templates/entry-path.json`

This template is designed for those transitioning into DevOps with less prior experience, focused on securing an entry-level or mid-tier DevOps position. It features:

- More manageable 30-hour weekly schedule
- Focus on AWS Cloud Practitioner as a first certification stepping stone
- Smaller initial projects to build foundational skills
- Progressive networking strategy starting with 10 connections per week
- 12-month timeline to secure a junior DevOps position
- Clear path to AWS Solutions Architect Associate as a second certification

This template is derived from the accelerated plan but includes only the first phase leading to an entry-level position with a more gradual learning curve.

### 3. Custom Career Path

**File:** `src/data/templates/custom-path.json`

A blank template that allows you to build your career development plan from scratch. It provides the structure for:

- Defining your own skills and target proficiency levels
- Setting custom certification goals
- Creating personalized projects
- Establishing your own weekly schedule
- Defining custom networking targets
- Creating a unique roadmap with custom phases and milestones

## How to Use the Templates

To select a template when setting up your dashboard:

1. **Initial Setup**: When running the dashboard for the first time, you'll be prompted to select a template
2. **Reset Dashboard**: If you want to switch templates later, use:
   ```
   npm run reset-dashboard
   ```

3. **Manual Selection**: To manually select a template:
   ```
   node scripts/setup-admin.js --template accelerated-path
   ```
   
   Options:
   - `--template accelerated-path` (Senior DevOps focus)
   - `--template entry-path` (Entry/Mid-tier focus)
   - `--template custom-path` (Build from scratch)

## Customizing After Selection

After selecting a template, you can customize any aspect through the dashboard interface:

- **Skills**: Add, remove, or update skill proficiencies
- **Certifications**: Modify certification plans and target dates
- **Projects**: Edit project details or add new projects
- **Learning Resources**: Customize your learning materials
- **Schedule**: Adjust your weekly time allocation
- **Goals**: Add or modify specific goals and tasks

## Template Structure

Each template follows the same JSON structure with these key sections:

- `overview`: General progress metrics
- `weeklyMetrics`: Time allocation tracking
- `skills`: Technical skill categories and proficiencies
- `certifications`: Certification plans and progress
- `projects`: Project details and repositories
- `goals`: Specific tasks and objectives
- `learningResources`: Courses, books, and other materials
- `networking`: Professional networking metrics
- `clayMetrics`: Clay CRM integration metrics
- `schedule`: Weekly time allocation by day
- `weeklyGoals`: Weekly targets for various activities
- `roadmap`: Career phases, milestones, and timelines

## Creating a Custom Template

If you want to create your own template from scratch:

1. Start with the `custom-path.json` template
2. Modify each section to match your career goals
3. Save the file with a new name in `src/data/templates/`
4. Use it with `node scripts/setup-admin.js --template your-template-name`