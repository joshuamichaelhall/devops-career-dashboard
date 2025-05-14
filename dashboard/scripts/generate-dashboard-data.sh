#!/bin/bash
#
# generate-dashboard-data.sh - Generate JSON data for the career dashboard
#
# This script extracts data from your tracking files and generates JSON data
# that the dashboard can use.

# Get directory paths using relative paths
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DASHBOARD_DIR="$(dirname "$SCRIPT_DIR")"
REPO_ROOT="$(dirname "$DASHBOARD_DIR")"

if [ ! -d "$REPO_ROOT/tracking" ]; then
  echo "Error: Repository structure not found."
  exit 1
fi

# Define directories
REVIEWS_DIR="$REPO_ROOT/tracking/reviews"
PROGRESS_DIR="$REPO_ROOT/tracking/progress"
DASHBOARD_DATA_DIR="$DASHBOARD_DIR/src/data"

# Create dashboard data directory if it doesn't exist
mkdir -p "$DASHBOARD_DATA_DIR"

# Get current week number and date
CURRENT_WEEK=$(date +"%U")
CURRENT_YEAR=$(date +"%Y")

# Count total number of weekly reviews
TOTAL_REVIEWS=$(find "$REVIEWS_DIR" -name "week-*.md" 2>/dev/null | wc -l)

# Get most recent weekly review
LATEST_REVIEW=$(find "$REVIEWS_DIR" -name "week-*.md" -type f -printf "%T@ %p\n" 2>/dev/null | sort -n | tail -1 | cut -f2- -d" ")

# Extract completed goals from weekly reviews (goals marked with [x])
if [ -d "$REVIEWS_DIR" ]; then
  COMPLETED_GOALS=$(grep -r "\- \[x\]" "$REVIEWS_DIR" 2>/dev/null | wc -l)
  TOTAL_GOALS=$(grep -r "\- \[ \]" "$REVIEWS_DIR" 2>/dev/null | wc -l)
  TOTAL_GOALS=$((TOTAL_GOALS + COMPLETED_GOALS))
else
  COMPLETED_GOALS=0
  TOTAL_GOALS=5 # Default to 5 goals as shown in the existing data
fi

# Calculate goal completion rate
if [ "$TOTAL_GOALS" -gt 0 ]; then
  GOAL_RATE=$((COMPLETED_GOALS * 100 / TOTAL_GOALS))
else
  GOAL_RATE=0
fi

# Phase progress estimation (based on current week)
# Assuming a 24-month plan with approximately 104 weeks
# Phase 1: Weeks 1-12
# Phase 2: Weeks 13-36
# Phase 3: Weeks 37-76
# Phase 4: Weeks 77-104

if [ "$CURRENT_WEEK" -le 12 ]; then
  PHASE="Foundation Building (Phase 1)"
  PHASE_PROGRESS=$(( CURRENT_WEEK * 100 / 12 ))
  PHASE_NUMBER=1
elif [ "$CURRENT_WEEK" -le 36 ]; then
  PHASE="Advanced Skills Development (Phase 2)"
  PHASE_PROGRESS=$(( (CURRENT_WEEK - 12) * 100 / 24 ))
  PHASE_NUMBER=2
elif [ "$CURRENT_WEEK" -le 76 ]; then
  PHASE="Specialization and Job Search (Phase 3)"
  PHASE_PROGRESS=$(( (CURRENT_WEEK - 36) * 100 / 40 ))
  PHASE_NUMBER=3
else
  PHASE="Senior Role Preparation (Phase 4)"
  PHASE_PROGRESS=$(( (CURRENT_WEEK - 76) * 100 / 28 ))
  PHASE_NUMBER=4
fi

# Extract time allocation data from the latest review
LEARNING_HOURS=0
PROJECT_HOURS=0
NETWORKING_HOURS=0
JOB_SEARCH_HOURS=0
CONTENT_CREATION_HOURS=0

if [ -f "$LATEST_REVIEW" ]; then
  if grep -q "Learning: " "$LATEST_REVIEW"; then
    LEARNING_HOURS=$(grep "Learning: " "$LATEST_REVIEW" | sed 's/.*Learning: \([0-9]*\).*/\1/')
  fi
  
  if grep -q "Projects: " "$LATEST_REVIEW"; then
    PROJECT_HOURS=$(grep "Projects: " "$LATEST_REVIEW" | sed 's/.*Projects: \([0-9]*\).*/\1/')
  fi
  
  if grep -q "Networking: " "$LATEST_REVIEW"; then
    NETWORKING_HOURS=$(grep "Networking: " "$LATEST_REVIEW" | sed 's/.*Networking: \([0-9]*\).*/\1/')
  fi
  
  if grep -q "Job Search: " "$LATEST_REVIEW"; then
    JOB_SEARCH_HOURS=$(grep "Job Search: " "$LATEST_REVIEW" | sed 's/.*Job Search: \([0-9]*\).*/\1/')
  fi
  
  if grep -q "Content Creation: " "$LATEST_REVIEW"; then
    CONTENT_CREATION_HOURS=$(grep "Content Creation: " "$LATEST_REVIEW" | sed 's/.*Content Creation: \([0-9]*\).*/\1/')
  fi
fi

# Extract networking metrics
NEW_CONNECTIONS=0
CONTENT_CREATED=0

if [ -f "$LATEST_REVIEW" ]; then
  if grep -q "New Connections: " "$LATEST_REVIEW"; then
    NEW_CONNECTIONS=$(grep "New Connections: " "$LATEST_REVIEW" | sed 's/.*New Connections: \([0-9]*\).*/\1/')
  fi
  
  if grep -q "Content Pieces: " "$LATEST_REVIEW"; then
    CONTENT_CREATED=$(grep "Content Pieces: " "$LATEST_REVIEW" | sed 's/.*Content Pieces: \([0-9]*\).*/\1/')
  fi
fi

# Extract skills advanced
SKILLS_ADVANCED=0

if [ -f "$LATEST_REVIEW" ]; then
  if grep -q "Skills Advanced" "$LATEST_REVIEW"; then
    SKILLS_ADVANCED=$(sed -n '/Skills Advanced/,/^###/p' "$LATEST_REVIEW" | grep -c "^- ")
  fi
fi

# Extract skills from the skills tracker file
SKILLS_JSON=""
SKILLS_FILE="$PROGRESS_DIR/skills-tracker.md"

if [ -f "$SKILLS_FILE" ]; then
  # This is a simple example - you would need to adapt this based on your actual skills tracker format
  SKILLS_JSON="["
  
  # Process Cloud skills
  CLOUD_SKILLS=$(sed -n '/^## Cloud/,/^##/p' "$SKILLS_FILE" | grep "^- " | sed 's/^- //' | grep -v "^##")
  CLOUD_PROFICIENCY=$(sed -n '/^## Cloud/,/^##/p' "$SKILLS_FILE" | grep "Proficiency:" | sed 's/.*Proficiency: \(.*\)/\1/')
  [ -z "$CLOUD_PROFICIENCY" ] && CLOUD_PROFICIENCY="Beginner"
  
  SKILLS_JSON+='{ "category": "Cloud", "skills": ['
  for skill in $CLOUD_SKILLS; do
    SKILLS_JSON+="\"$skill\", "
  done
  SKILLS_JSON=${SKILLS_JSON%, }
  SKILLS_JSON+="], \"proficiency\": \"$CLOUD_PROFICIENCY\" }, "
  
  # Add other skill categories similar to above
  # This is simplified - you'd need to adapt for your actual skills structure
  
  SKILLS_JSON=${SKILLS_JSON%, }
  SKILLS_JSON+="]"
fi

# If we couldn't extract skills, use the default skills array
if [ -z "$SKILLS_JSON" ] || [ "$SKILLS_JSON" = "[]" ]; then
  SKILLS_JSON='[
    { 
      "category": "Cloud",
      "skills": ["AWS EC2", "AWS VPC", "AWS S3", "AWS IAM"],
      "proficiency": "Beginner"
    },
    {
      "category": "Infrastructure as Code",
      "skills": ["Terraform Basics"],
      "proficiency": "Beginner"
    },
    {
      "category": "Linux",
      "skills": ["Basic Commands", "File System"],
      "proficiency": "Beginner"
    },
    {
      "category": "Containerization",
      "skills": [],
      "proficiency": "Not Started"
    },
    {
      "category": "CI/CD",
      "skills": [],
      "proficiency": "Not Started"
    },
    {
      "category": "Monitoring",
      "skills": [],
      "proficiency": "Not Started"
    }
  ]'
fi

# Create JSON data for dashboard
cat > "$DASHBOARD_DATA_DIR/data.json" << EOF
{
  "overview": {
    "currentWeek": $CURRENT_WEEK,
    "currentYear": $CURRENT_YEAR,
    "totalReviews": $TOTAL_REVIEWS,
    "completedGoals": $COMPLETED_GOALS,
    "totalGoals": $TOTAL_GOALS,
    "goalCompletionRate": $GOAL_RATE,
    "currentPhase": "$PHASE",
    "phaseNumber": $PHASE_NUMBER,
    "phaseProgress": $PHASE_PROGRESS,
    "overallProgress": $(( CURRENT_WEEK * 100 / 104 ))
  },
  "weeklyMetrics": {
    "learningHours": $LEARNING_HOURS,
    "projectHours": $PROJECT_HOURS,
    "networkingHours": $NETWORKING_HOURS,
    "jobSearchHours": $JOB_SEARCH_HOURS,
    "contentCreationHours": $CONTENT_CREATION_HOURS,
    "newConnections": $NEW_CONNECTIONS,
    "contentCreated": $CONTENT_CREATED,
    "skillsAdvanced": $SKILLS_ADVANCED,
    "totalHours": $(( LEARNING_HOURS + PROJECT_HOURS + NETWORKING_HOURS + JOB_SEARCH_HOURS + CONTENT_CREATION_HOURS ))
  },
  "careerPhases": [
    { 
      "id": 1, 
      "name": "Foundation Building", 
      "duration": "Months 1-6", 
      "progress": $([ $PHASE_NUMBER -eq 1 ] && echo $PHASE_PROGRESS || ([ $PHASE_NUMBER -gt 1 ] && echo "100" || echo "0")),
      "description": "AWS, Terraform, Docker fundamentals" 
    },
    { 
      "id": 2, 
      "name": "Advanced Skills Development", 
      "duration": "Months 7-12", 
      "progress": $([ $PHASE_NUMBER -eq 2 ] && echo $PHASE_PROGRESS || ([ $PHASE_NUMBER -gt 2 ] && echo "100" || echo "0")),
      "description": "Kubernetes, CI/CD, advanced AWS" 
    },
    { 
      "id": 3, 
      "name": "Mid-Level Position Attainment", 
      "duration": "Months 13-18", 
      "progress": $([ $PHASE_NUMBER -eq 3 ] && echo $PHASE_PROGRESS || ([ $PHASE_NUMBER -gt 3 ] && echo "100" || echo "0")),
      "description": "Security, compliance, financial services expertise" 
    },
    { 
      "id": 4, 
      "name": "Senior Role Preparation", 
      "duration": "Months 19-24", 
      "progress": $([ $PHASE_NUMBER -eq 4 ] && echo $PHASE_PROGRESS || ([ $PHASE_NUMBER -gt 4 ] && echo "100" || echo "0")),
      "description": "Platform engineering, technical leadership" 
    }
  ],
  "skills": $SKILLS_JSON,
  "certifications": [
    {
      "name": "AWS Solutions Architect Associate",
      "targetDate": "Month 3",
      "status": "In Progress",
      "progress": 10
    },
    {
      "name": "HashiCorp Terraform Associate",
      "targetDate": "Month 5",
      "status": "Not Started",
      "progress": 0
    },
    {
      "name": "AWS DevOps Professional",
      "targetDate": "Month 14-15",
      "status": "Planned",
      "progress": 0
    },
    {
      "name": "AWS Security Specialty",
      "targetDate": "Month 18-19",
      "status": "Planned",
      "progress": 0
    },
    {
      "name": "Certified Kubernetes Administrator",
      "targetDate": "Month 21-22",
      "status": "Planned",
      "progress": 0
    }
  ],
  "projects": [
    {
      "name": "AWS Infrastructure Automation",
      "status": "Planning",
      "progress": 5,
      "description": "Creating a fully automated AWS infrastructure using Terraform"
    },
    {
      "name": "Multi-Environment Infrastructure",
      "status": "Not Started",
      "progress": 0,
      "description": "Building dev, staging, and production environments with proper separation"
    },
    {
      "name": "Container Platform",
      "status": "Not Started",
      "progress": 0,
      "description": "Setting up a Kubernetes cluster with monitoring and deployment pipelines"
    }
  ],
  "goals": [
    {
      "content": "Complete AWS VPC section in Cantrill course",
      "category": "Learning",
      "dueDate": "This week",
      "completed": false
    },
    {
      "content": "Create first VPC architecture in AWS",
      "category": "Project",
      "dueDate": "This week",
      "completed": false
    },
    {
      "content": "Connect with 25-30 AWS specialists this week",
      "category": "Networking",
      "dueDate": "This week",
      "completed": false
    },
    {
      "content": "Publish first technical article on AWS VPC",
      "category": "Content Creation",
      "dueDate": "Next week",
      "completed": false
    },
    {
      "content": "Complete chapters 4-5 of \"How Linux Works\"",
      "category": "Learning",
      "dueDate": "This week",
      "completed": false
    }
  ],
  "schedule": {
    "timeAllocation": {
      "learning": 25,
      "projects": 12.5,
      "networking": 7.5,
      "contentCreation": 5
    },
    "dailySchedule": {
      "Monday": [
        {
          "time": "6:00-7:30 AM",
          "activity": "AWS SAA Course",
          "category": "Learning"
        },
        {
          "time": "12:00-12:30 PM",
          "activity": "Review Notes",
          "category": "Learning"
        },
        {
          "time": "7:00-9:00 PM",
          "activity": "AWS VPC Project",
          "category": "Project"
        },
        {
          "time": "9:00-10:30 PM",
          "activity": "LinkedIn Networking",
          "category": "Networking"
        }
      ],
      "Tuesday": [
        {
          "time": "6:00-7:30 AM",
          "activity": "AWS SAA Course",
          "category": "Learning"
        },
        {
          "time": "12:00-12:30 PM",
          "activity": "Review Notes",
          "category": "Learning"
        },
        {
          "time": "7:00-9:00 PM",
          "activity": "AWS VPC Project",
          "category": "Project"
        },
        {
          "time": "9:00-10:30 PM",
          "activity": "LinkedIn Networking",
          "category": "Networking"
        }
      ],
      "Wednesday": [
        {
          "time": "6:00-7:30 AM",
          "activity": "AWS SAA Course",
          "category": "Learning"
        },
        {
          "time": "12:00-12:30 PM",
          "activity": "Review Notes",
          "category": "Learning"
        },
        {
          "time": "7:00-9:00 PM",
          "activity": "AWS VPC Project",
          "category": "Project"
        },
        {
          "time": "9:00-10:30 PM",
          "activity": "Content Creation",
          "category": "Content"
        }
      ],
      "Thursday": [
        {
          "time": "6:00-7:30 AM",
          "activity": "Linux Book",
          "category": "Learning"
        },
        {
          "time": "12:00-12:30 PM",
          "activity": "Review Notes",
          "category": "Learning"
        },
        {
          "time": "7:00-9:00 PM",
          "activity": "AWS VPC Project",
          "category": "Project"
        },
        {
          "time": "9:00-10:30 PM",
          "activity": "LinkedIn Networking",
          "category": "Networking"
        }
      ],
      "Friday": [
        {
          "time": "6:00-7:30 AM",
          "activity": "AWS SAA Course",
          "category": "Learning"
        },
        {
          "time": "12:00-12:30 PM",
          "activity": "Review Notes",
          "category": "Learning"
        },
        {
          "time": "7:00-9:00 PM",
          "activity": "AWS VPC Project",
          "category": "Project"
        },
        {
          "time": "9:00-10:30 PM",
          "activity": "Content Creation",
          "category": "Content"
        }
      ],
      "Saturday": [
        {
          "time": "8:00-12:00 AM",
          "activity": "AWS SAA Course",
          "category": "Learning"
        },
        {
          "time": "2:00-4:00 PM",
          "activity": "AWS VPC Project",
          "category": "Project"
        }
      ],
      "Sunday": [
        {
          "time": "8:00-12:00 AM",
          "activity": "Linux Book",
          "category": "Learning"
        },
        {
          "time": "2:00-4:00 PM",
          "activity": "Weekly Review",
          "category": "Planning"
        }
      ]
    }
  }
}
EOF

echo "Dashboard data generated at $DASHBOARD_DATA_DIR/data.json"