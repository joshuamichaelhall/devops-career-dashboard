/**
 * Projects Template Generator
 * Provides suggested projects based on track and career stage
 */

// Define project templates for different tracks
const projectTemplates = {
  // AWS/Cloud track projects
  aws: [
    {
      name: "AWS Cloud Resume Challenge",
      description: "Create a personal resume website using various AWS services including S3, CloudFront, Lambda, API Gateway, DynamoDB, and deploy with CI/CD.",
      status: "Planned",
      progress: 0,
      technologies: ["AWS S3", "CloudFront", "Lambda", "API Gateway", "DynamoDB", "GitHub Actions"],
      targetDate: "",
      difficulty: "Beginner",
      resourceUrl: "https://cloudresumechallenge.dev/"
    },
    {
      name: "Serverless Data Processing Pipeline",
      description: "Build a data processing pipeline using AWS Lambda, S3, and SQS to process, transform, and analyze datasets automatically.",
      status: "Planned",
      progress: 0,
      technologies: ["AWS Lambda", "S3", "SQS", "EventBridge", "CloudWatch"],
      targetDate: "",
      difficulty: "Intermediate",
      resourceUrl: ""
    },
    {
      name: "Multi-Region Highly Available Website",
      description: "Create a fault-tolerant website architecture across multiple AWS regions with automated failover and global load balancing.",
      status: "Planned",
      progress: 0,
      technologies: ["AWS EC2", "RDS", "Route 53", "CloudFront", "S3", "DynamoDB Global Tables"],
      targetDate: "",
      difficulty: "Advanced",
      resourceUrl: ""
    }
  ],
  
  // Kubernetes track projects
  kubernetes: [
    {
      name: "Basic Kubernetes Portfolio Deployment",
      description: "Deploy a personal portfolio website on Kubernetes with basic resources and understand pod lifecycle.",
      status: "Planned",
      progress: 0,
      technologies: ["Docker", "Kubernetes", "NGINX", "GitHub Actions"],
      targetDate: "",
      difficulty: "Beginner",
      resourceUrl: ""
    },
    {
      name: "Microservices Application with Kubernetes",
      description: "Build and deploy a multi-service application with proper service discovery, configuration, and scaling.",
      status: "Planned",
      progress: 0,
      technologies: ["Kubernetes", "Helm", "Microservices", "Service Mesh", "ConfigMaps", "Secrets"],
      targetDate: "",
      difficulty: "Intermediate",
      resourceUrl: ""
    },
    {
      name: "Custom Kubernetes Operator",
      description: "Develop a custom Kubernetes operator to automate application lifecycle management for a specific workload.",
      status: "Planned",
      progress: 0,
      technologies: ["Kubernetes", "Go", "Operator SDK", "CRDs", "RBAC"],
      targetDate: "",
      difficulty: "Advanced",
      resourceUrl: ""
    }
  ],
  
  // General DevOps projects
  devops: [
    {
      name: "CI/CD Pipeline for a Web Application",
      description: "Create an end-to-end CI/CD pipeline that automates testing, building, and deployment for a web application.",
      status: "Planned",
      progress: 0,
      technologies: ["GitHub Actions", "Docker", "Terraform", "AWS/GCP", "Testing Frameworks"],
      targetDate: "",
      difficulty: "Beginner",
      resourceUrl: ""
    },
    {
      name: "Infrastructure as Code Project",
      description: "Define complete infrastructure using Terraform, including networking, compute, storage, and security components.",
      status: "Planned",
      progress: 0,
      technologies: ["Terraform", "AWS/GCP/Azure", "Modules", "State Management", "CI/CD"],
      targetDate: "",
      difficulty: "Intermediate",
      resourceUrl: ""
    },
    {
      name: "Monitoring and Alerting System",
      description: "Set up a comprehensive monitoring and alerting system using Prometheus, Grafana, and other tools to track system and application metrics.",
      status: "Planned",
      progress: 0,
      technologies: ["Prometheus", "Grafana", "AlertManager", "Exporters", "Kubernetes/Docker"],
      targetDate: "",
      difficulty: "Advanced",
      resourceUrl: ""
    }
  ]
};

/**
 * Get suggested projects based on track
 * @param {string} track - aws, kubernetes, or devops
 * @param {string} difficultyLevel - beginner, intermediate, or advanced
 * @returns {Array} Array of project objects
 */
export const getSuggestedProjects = (track = 'devops', difficultyLevel = 'all') => {
  // Get projects for the specified track (default to devops if track not found)
  const trackProjects = projectTemplates[track] || projectTemplates.devops;
  
  // Filter by difficulty if specified
  if (difficultyLevel !== 'all') {
    return trackProjects.filter(project => 
      project.difficulty.toLowerCase() === difficultyLevel.toLowerCase()
    );
  }
  
  return trackProjects;
};

/**
 * Get all available projects across all tracks
 * @returns {Array} Array of all project templates
 */
export const getAllProjects = () => {
  return [
    ...projectTemplates.aws,
    ...projectTemplates.kubernetes,
    ...projectTemplates.devops
  ];
};

export default {
  getSuggestedProjects,
  getAllProjects
};