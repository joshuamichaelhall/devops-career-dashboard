# DevOps Career Dashboard Changelog

## Version 1.2.0 (May 15, 2025)

### Major Updates

#### Complete Template System
- Added 6 comprehensive career path templates:
  - Accelerated Path (50 hours/week for experienced professionals)
  - Entry Path (30 hours/week for beginners)
  - Mid-Career Path (35-40 hours/week)
  - Senior Career Path (20-30 hours/week)
  - Custom Path (blank slate)
  - Personal DevOps Finance (specialized template)
- Templates include full career roadmaps, skills, projects, and schedules

#### Real Career Data Integration
- Integrated complete DevOps career roadmap with 4 phases
- Added 75+ specific skills across 6 categories
- Included real projects with business value
- Added comprehensive learning resources with costs and URLs
- Integrated actual weekly schedule from Schedule.md

#### Schedule Mode System
- Implemented 3 flexible schedule modes:
  - Full-Time: 50 hours/week
  - Part-Time: 20 hours/week
  - Weekend: 20 hours/week
- Real-time schedule switching without data loss
- Proportional time allocation across categories

#### Data Separation
- Clear separation between personal and generic data
- Generic initial-data.json for forked repositories
- Personal templates for individual use
- Protected demo data with fictional information

### New Features

#### Weekly Goals Tracking
- Added 8 specific weekly goal categories
- Checkbox completion tracking
- Quantity tracking for measurable goals
- Integration with career phases

#### Enhanced Backup System
- Automatic daily backups
- 30-day retention policy
- Manual export/import functionality
- Template-based restoration

#### Career Roadmap Visualization
- 4-phase career journey display
- Phase progress tracking
- Expected completion dates
- Milestone tracking

### Improvements

#### Data Management
- Updated initial data structure for better organization
- Enhanced template switching functionality
- Improved data migration between templates
- Better error handling for data operations

#### UI/UX Enhancements
- Improved schedule display with hours tracking
- Better visualization of time allocations
- Enhanced progress indicators
- More intuitive template selection

#### Documentation
- Comprehensive templates guide
- Updated FAQ with new features
- New features documentation
- Enhanced installation instructions

### Bug Fixes
- Fixed schedule data persistence issues
- Resolved template loading errors
- Fixed backup restoration problems
- Corrected time calculation discrepancies

### Security Updates
- Enhanced data encryption for API keys
- Improved authentication flow
- Better session management
- Secure template handling

## Version 1.1.0 (May 1, 2025)

### New Features

#### Skills Tracker Enhancements
- Added ability to import skills templates based on career plan
- Added skills templates for different career stages (early, mid, senior)
- Added specialized skills tracks (AWS, Kubernetes, etc.)
- Improved skills UI with better categorization

#### Projects Management
- Added suggested projects feature based on selected track
- Created project templates for different specializations
- Enhanced project details view with better organization
- Added technologies and difficulty indicators for projects

#### Learning Resources
- Added ability to import curated learning resources by track
- Integrated resources from career strategy templates
- Enhanced resource display with links and priority indicators
- Improved categorization of learning resources

#### Weekly Schedule
- Added standard weekly schedule templates for different work styles
- Created full-time (50 hours/week) schedule template
- Created part-time (20 hours/week) schedule template
- Created weekend-focused schedule template
- Added customizable focus areas for learning time blocks

#### Task Management
- Added comprehensive task templates based on selected career track
- Implemented daily, weekly, and monthly recurring tasks
- Enhanced task filtering and organization
- Added import functionality for predefined task sets

### Improvements
- Fixed content creation metric to properly show "0/5" instead of "/5"
- Enhanced Refresh Data button to clear cache and reload page
- Improved data visualization across all dashboard components
- Enhanced mobile responsiveness

### Documentation
- Added new setup guide for forked repositories
- Updated installation instructions
- Added customization documentation
- Created template documentation

## Version 1.0.0 (April 15, 2025)

### Initial Release

#### Core Features
- Dashboard overview with career phase tracking
- Skills progress tracker with proficiency levels
- Learning resources management
- Projects portfolio tracking
- Weekly schedule planner
- Networking metrics with Clay CRM integration
- Time allocation visualization
- Goal setting and tracking

#### Security Features
- JWT authentication
- Encrypted API key storage
- Rate limiting
- CORS protection
- Helmet.js security headers

#### Data Management
- JSON-based data storage
- Manual backup/restore
- Data export functionality
- Import capability

#### UI/UX
- Responsive design
- Dark/Light theme support
- Chart.js visualizations
- TailwindCSS styling

### Known Issues
- Limited to single-user setup
- No real-time sync between sessions
- Manual backup process required

---

For more information about each release, visit the [releases page](https://github.com/joshuamichaelhall/devops-career-dashboard/releases).