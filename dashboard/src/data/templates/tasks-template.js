/**
 * Tasks Template Generator
 * Provides task templates based on tracks and career phases
 */

// Define task templates for different tracks
const taskTemplates = {
  // AWS/Cloud track tasks
  aws: {
    onetime: [
      {
        content: "Set up AWS Free Tier Account",
        category: "aws",
        priority: "high",
        due: "1 week"
      },
      {
        content: "Register for AWS Certified Cloud Practitioner Exam",
        category: "certification",
        priority: "high",
        due: "1 month"
      },
      {
        content: "Complete Adrian Cantrill AWS SAA course",
        category: "learning",
        priority: "high",
        due: "3 months"
      },
      {
        content: "Build a serverless application on AWS",
        category: "project",
        priority: "medium",
        due: "2 months"
      },
      {
        content: "Deploy a static website on S3 with CloudFront",
        category: "project",
        priority: "medium",
        due: "1 month"
      }
    ],
    daily: [
      {
        content: "Review AWS flashcards for 15 minutes",
        category: "learning",
        priority: "medium"
      },
      {
        content: "Practice AWS CLI commands",
        category: "skill",
        priority: "medium"
      }
    ],
    weekly: [
      {
        content: "Complete one AWS hands-on lab",
        category: "learning",
        priority: "high"
      },
      {
        content: "Read AWS blog posts for new services",
        category: "learning",
        priority: "medium"
      },
      {
        content: "Update AWS project documentation",
        category: "project",
        priority: "medium"
      }
    ],
    monthly: [
      {
        content: "Take AWS practice exam",
        category: "certification",
        priority: "high"
      },
      {
        content: "Review AWS billing and optimize costs",
        category: "skill",
        priority: "medium"
      },
      {
        content: "Participate in AWS online community",
        category: "networking",
        priority: "medium"
      }
    ]
  },
  
  // Infrastructure as Code track tasks
  terraform: {
    onetime: [
      {
        content: "Install Terraform and setup development environment",
        category: "terraform",
        priority: "high",
        due: "1 week"
      },
      {
        content: "Register for HashiCorp Terraform Associate Exam",
        category: "certification",
        priority: "high",
        due: "2 months"
      },
      {
        content: "Complete Terraform: Up & Running book exercises",
        category: "learning",
        priority: "high",
        due: "2 months"
      },
      {
        content: "Build multi-environment infrastructure with Terraform",
        category: "project",
        priority: "medium",
        due: "3 months"
      },
      {
        content: "Create a custom Terraform module",
        category: "project",
        priority: "medium",
        due: "2 months"
      }
    ],
    daily: [
      {
        content: "Practice Terraform commands and syntax",
        category: "skill",
        priority: "medium"
      },
      {
        content: "Review Terraform documentation",
        category: "learning",
        priority: "medium"
      }
    ],
    weekly: [
      {
        content: "Read HashiCorp blog posts",
        category: "learning",
        priority: "medium"
      },
      {
        content: "Refactor and improve Terraform code",
        category: "project",
        priority: "medium"
      },
      {
        content: "Experiment with new Terraform providers",
        category: "learning",
        priority: "medium"
      }
    ],
    monthly: [
      {
        content: "Take Terraform practice exam",
        category: "certification",
        priority: "high"
      },
      {
        content: "Research Terraform best practices",
        category: "learning",
        priority: "medium"
      },
      {
        content: "Contribute to Terraform open source",
        category: "project",
        priority: "low"
      }
    ]
  },
  
  // Kubernetes track tasks
  kubernetes: {
    onetime: [
      {
        content: "Set up local Kubernetes cluster with Minikube",
        category: "kubernetes",
        priority: "high",
        due: "1 week"
      },
      {
        content: "Register for CKA or CKAD exam",
        category: "certification",
        priority: "high",
        due: "3 months"
      },
      {
        content: "Complete Kubernetes in Action book exercises",
        category: "learning",
        priority: "high",
        due: "2 months"
      },
      {
        content: "Deploy a microservices application on Kubernetes",
        category: "project",
        priority: "medium",
        due: "3 months"
      },
      {
        content: "Implement monitoring for Kubernetes with Prometheus",
        category: "project",
        priority: "medium",
        due: "2 months"
      }
    ],
    daily: [
      {
        content: "Practice kubectl commands",
        category: "skill",
        priority: "medium"
      },
      {
        content: "Read Kubernetes documentation",
        category: "learning",
        priority: "medium"
      }
    ],
    weekly: [
      {
        content: "Deploy a new application to Kubernetes",
        category: "project",
        priority: "medium"
      },
      {
        content: "Read Kubernetes blog posts",
        category: "learning",
        priority: "medium"
      },
      {
        content: "Practice debugging Kubernetes issues",
        category: "skill",
        priority: "high"
      }
    ],
    monthly: [
      {
        content: "Take CKA/CKAD practice exam",
        category: "certification",
        priority: "high"
      },
      {
        content: "Experiment with advanced Kubernetes features",
        category: "learning",
        priority: "medium"
      },
      {
        content: "Attend Kubernetes community meetings",
        category: "networking",
        priority: "medium"
      }
    ]
  },
  
  // CI/CD track tasks
  cicd: {
    onetime: [
      {
        content: "Set up a personal GitHub Actions workflow",
        category: "cicd",
        priority: "high",
        due: "1 week"
      },
      {
        content: "Create a comprehensive CI/CD pipeline",
        category: "project",
        priority: "high",
        due: "2 months"
      },
      {
        content: "Implement automated testing in CI/CD pipeline",
        category: "project",
        priority: "high",
        due: "1 month"
      },
      {
        content: "Build a deployment pipeline with multiple environments",
        category: "project",
        priority: "medium",
        due: "3 months"
      },
      {
        content: "Implement infrastructure deployment in CI/CD",
        category: "project",
        priority: "medium",
        due: "2 months"
      }
    ],
    daily: [
      {
        content: "Review CI/CD pipeline status",
        category: "skill",
        priority: "medium"
      },
      {
        content: "Practice GitHub Actions workflows",
        category: "skill",
        priority: "medium"
      }
    ],
    weekly: [
      {
        content: "Read CI/CD blog posts",
        category: "learning",
        priority: "medium"
      },
      {
        content: "Refactor and improve CI/CD pipelines",
        category: "project",
        priority: "medium"
      },
      {
        content: "Experiment with different CI/CD tools",
        category: "learning",
        priority: "medium"
      }
    ],
    monthly: [
      {
        content: "Research new CI/CD trends",
        category: "learning",
        priority: "medium"
      },
      {
        content: "Learn a new deployment pattern",
        category: "learning",
        priority: "medium"
      },
      {
        content: "Optimize CI/CD pipeline performance",
        category: "project",
        priority: "medium"
      }
    ]
  },
  
  // General DevOps tasks
  devops: {
    onetime: [
      {
        content: "Create a personal DevOps portfolio site",
        category: "project",
        priority: "high",
        due: "1 month"
      },
      {
        content: "Configure a personal cloud lab environment",
        category: "project",
        priority: "high",
        due: "2 weeks"
      },
      {
        content: "Read The DevOps Handbook",
        category: "learning",
        priority: "high",
        due: "2 months"
      },
      {
        content: "Join DevOps community forums",
        category: "networking",
        priority: "medium",
        due: "1 week"
      },
      {
        content: "Setup a monitoring dashboard for personal projects",
        category: "project",
        priority: "medium",
        due: "1 month"
      }
    ],
    daily: [
      {
        content: "Read DevOps articles for 15 minutes",
        category: "learning",
        priority: "medium"
      },
      {
        content: "Practice Linux command line skills",
        category: "skill",
        priority: "medium"
      }
    ],
    weekly: [
      {
        content: "Update career development plan",
        category: "career",
        priority: "high"
      },
      {
        content: "Connect with DevOps professionals on LinkedIn",
        category: "networking",
        priority: "medium"
      },
      {
        content: "Contribute to GitHub projects",
        category: "project",
        priority: "medium"
      }
    ],
    monthly: [
      {
        content: "Publish a DevOps technical blog post",
        category: "content",
        priority: "medium"
      },
      {
        content: "Learn a new DevOps tool",
        category: "learning",
        priority: "medium"
      },
      {
        content: "Attend a DevOps virtual meetup",
        category: "networking",
        priority: "medium"
      }
    ]
  }
};

// Common recurring tasks that apply to all tracks
const commonTasks = {
  daily: [
    {
      content: "Update daily progress log",
      category: "career",
      priority: "medium"
    }
  ],
  weekly: [
    {
      content: "Complete weekly reflection",
      category: "career",
      priority: "high"
    },
    {
      content: "Update LinkedIn profile and activity",
      category: "networking",
      priority: "medium"
    }
  ],
  monthly: [
    {
      content: "Evaluate monthly goals and progress",
      category: "career",
      priority: "high"
    },
    {
      content: "Research industry trends",
      category: "learning",
      priority: "medium"
    }
  ]
};

/**
 * Generate ID for a task
 * @returns {string} Unique ID for the task
 */
const generateTaskId = () => {
  return `task-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
};

/**
 * Format tasks with IDs and proper due dates
 * @param {Array} tasks - Array of task objects
 * @param {string} taskType - onetime, daily, weekly, or monthly
 * @returns {Array} Formatted task objects
 */
const formatTasks = (tasks, taskType) => {
  return tasks.map(task => {
    const formattedTask = {
      ...task,
      id: generateTaskId(),
      completed: false
    };
    
    // Handle due dates for onetime tasks
    if (taskType === 'onetime' && task.due) {
      const today = new Date();
      let dueDate = new Date(today);
      
      if (task.due.includes('week')) {
        const weeks = parseInt(task.due.split(' ')[0]);
        dueDate.setDate(today.getDate() + (weeks * 7));
      } else if (task.due.includes('month')) {
        const months = parseInt(task.due.split(' ')[0]);
        dueDate.setMonth(today.getMonth() + months);
      }
      
      formattedTask.due = dueDate.toISOString().split('T')[0];
    }
    
    return formattedTask;
  });
};

/**
 * Get tasks for a specific track
 * @param {string} track - aws, terraform, kubernetes, cicd, or devops
 * @param {boolean} includeRecurring - Include recurring tasks
 * @returns {Object} Tasks organized by type
 */
export const getTrackTasks = (track = 'devops', includeRecurring = true) => {
  // Get track-specific tasks
  const trackSpecificTasks = taskTemplates[track] || taskTemplates.devops;
  
  // Format tasks and add IDs
  const formattedOneTimeTasks = formatTasks(trackSpecificTasks.onetime, 'onetime');
  
  // Include recurring tasks if requested
  if (includeRecurring) {
    const formattedRecurringTasks = {
      daily: formatTasks([...trackSpecificTasks.daily, ...commonTasks.daily], 'daily'),
      weekly: formatTasks([...trackSpecificTasks.weekly, ...commonTasks.weekly], 'weekly'),
      monthly: formatTasks([...trackSpecificTasks.monthly, ...commonTasks.monthly], 'monthly')
    };
    
    return {
      onetime: formattedOneTimeTasks,
      recurring: formattedRecurringTasks
    };
  }
  
  return {
    onetime: formattedOneTimeTasks
  };
};

/**
 * Get tasks for multiple tracks
 * @param {Array} tracks - Array of track names
 * @param {boolean} includeRecurring - Include recurring tasks
 * @returns {Object} Combined tasks
 */
export const getMultiTrackTasks = (tracks = [], includeRecurring = true) => {
  // Default to devops if no tracks provided
  if (tracks.length === 0) {
    return getTrackTasks('devops', includeRecurring);
  }
  
  // Combine onetime tasks from all selected tracks
  const oneTimeTasks = [];
  
  // For recurring tasks, we'll keep all tasks but deduplicate
  const dailyTasks = [...commonTasks.daily];
  const weeklyTasks = [...commonTasks.weekly];
  const monthlyTasks = [...commonTasks.monthly];
  
  tracks.forEach(track => {
    if (taskTemplates[track]) {
      // Add onetime tasks
      oneTimeTasks.push(...taskTemplates[track].onetime);
      
      // Add recurring tasks if requested (avoiding duplicates by content)
      if (includeRecurring) {
        taskTemplates[track].daily.forEach(task => {
          if (!dailyTasks.some(t => t.content === task.content)) {
            dailyTasks.push(task);
          }
        });
        
        taskTemplates[track].weekly.forEach(task => {
          if (!weeklyTasks.some(t => t.content === task.content)) {
            weeklyTasks.push(task);
          }
        });
        
        taskTemplates[track].monthly.forEach(task => {
          if (!monthlyTasks.some(t => t.content === task.content)) {
            monthlyTasks.push(task);
          }
        });
      }
    }
  });
  
  // Format all tasks
  const formattedOneTimeTasks = formatTasks(oneTimeTasks, 'onetime');
  
  if (includeRecurring) {
    return {
      onetime: formattedOneTimeTasks,
      recurring: {
        daily: formatTasks(dailyTasks, 'daily'),
        weekly: formatTasks(weeklyTasks, 'weekly'),
        monthly: formatTasks(monthlyTasks, 'monthly')
      }
    };
  }
  
  return {
    onetime: formattedOneTimeTasks
  };
};

export default {
  getTrackTasks,
  getMultiTrackTasks
};