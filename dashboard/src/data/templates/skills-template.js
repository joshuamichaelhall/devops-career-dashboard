/**
 * Skills Template Generator
 * Generates skill category templates based on the career strategy repo
 */

// Define skill categories based on the skills-tracker.md structure
const skillCategories = [
  {
    category: "AWS Cloud Platform",
    skills: [
      "EC2", "VPC Networking", "S3", "IAM & Security", "RDS", "CloudFormation", 
      "CloudWatch", "Route 53", "ELB/ALB/NLB", "Lambda", "CloudFront", "ElastiCache",
      "ECS", "EKS", "API Gateway", "SQS/SNS", "DynamoDB", "AWS Config", 
      "AWS Security Hub", "AWS Organizations", "Secrets Manager", "Cost Management"
    ],
    defaultProficiency: "Beginner",
    targetLevel: 80
  },
  {
    category: "Infrastructure as Code",
    skills: [
      "Terraform Basic Syntax", "Terraform State Management", "Terraform Modules",
      "Terraform with AWS", "Terraform CI/CD Integration", "Terraform Testing",
      "Terraform for Multiple Environments", "Terraform Security Practices"
    ],
    defaultProficiency: "Beginner",
    targetLevel: 80
  },
  {
    category: "Containerization",
    skills: [
      "Docker Fundamentals", "Dockerfile Optimization", "Docker Compose",
      "Docker Networking", "Docker Security", "Container Registry Management",
      "Multi-stage Builds", "Kubernetes Architecture", "Pod Management",
      "Deployments, StatefulSets, DaemonSets", "Services & Ingress",
      "ConfigMaps & Secrets", "RBAC & Security", "Storage Management", "Helm"
    ],
    defaultProficiency: "Beginner",
    targetLevel: 80
  },
  {
    category: "CI/CD",
    skills: [
      "GitHub Actions Workflow Syntax", "GitHub Actions Runners",
      "GitHub Actions Secrets Management", "GitHub Actions Matrix Builds",
      "GitHub Actions CI Pipelines", "GitHub Actions CD Pipelines",
      "Pipeline Design Patterns", "Trunk-based Development",
      "Artifact Management", "Infrastructure Deployment",
      "Blue/Green Deployment", "Canary Deployment"
    ],
    defaultProficiency: "Beginner",
    targetLevel: 80
  },
  {
    category: "Monitoring & Observability",
    skills: [
      "Metrics Fundamentals", "Prometheus", "PromQL", "Grafana Dashboards",
      "CloudWatch Metrics", "SLIs/SLOs Design", "Centralized Logging Concepts",
      "CloudWatch Logs", "Log Query Languages"
    ],
    defaultProficiency: "Beginner",
    targetLevel: 80
  },
  {
    category: "Scripting",
    skills: [
      "Bash Fundamentals", "Shell Script Structure", "Variables & Data Types",
      "Control Flow", "Functions", "Error Handling", "Ruby for AWS Automation",
      "Python Fundamentals", "AWS SDK (Boto3)"
    ],
    defaultProficiency: "Beginner",
    targetLevel: 80
  }
];

/**
 * Get beginner skills for a specific career stage
 * @param {string} careerStage - early, mid, or senior career stage
 * @returns {Array} Formatted skills objects for dashboard
 */
export const getBeginnerSkills = (careerStage = 'early') => {
  // Core skills subset by career stage
  const skillsByStage = {
    early: [
      // AWS
      { category: "AWS Cloud Platform", skills: ["EC2", "VPC Networking", "S3", "IAM & Security", "RDS"] },
      // IaC
      { category: "Infrastructure as Code", skills: ["Terraform Basic Syntax", "Terraform with AWS"] },
      // Containers
      { category: "Containerization", skills: ["Docker Fundamentals", "Docker Compose"] },
      // CI/CD
      { category: "CI/CD", skills: ["GitHub Actions Workflow Syntax", "GitHub Actions CI Pipelines"] },
      // Monitoring
      { category: "Monitoring & Observability", skills: ["Metrics Fundamentals", "CloudWatch Metrics"] },
      // Scripting
      { category: "Scripting", skills: ["Bash Fundamentals", "Shell Script Structure", "Control Flow"] }
    ],
    mid: [
      // AWS - more advanced services
      { 
        category: "AWS Cloud Platform", 
        skills: ["EC2", "VPC Networking", "S3", "IAM & Security", "RDS", "CloudFormation", "CloudWatch", "Route 53", "ELB/ALB/NLB", "Lambda"]
      },
      // IaC - more depth
      { 
        category: "Infrastructure as Code", 
        skills: ["Terraform Basic Syntax", "Terraform State Management", "Terraform Modules", "Terraform with AWS", "Terraform for Multiple Environments"] 
      },
      // Containers - includes Kubernetes
      { 
        category: "Containerization", 
        skills: ["Docker Fundamentals", "Docker Compose", "Docker Networking", "Kubernetes Architecture", "Pod Management", "Services & Ingress"] 
      },
      // CI/CD - more complex patterns
      { 
        category: "CI/CD", 
        skills: ["GitHub Actions Workflow Syntax", "GitHub Actions CI Pipelines", "GitHub Actions CD Pipelines", "Pipeline Design Patterns", "Artifact Management"] 
      },
      // Monitoring - more complete observability
      { 
        category: "Monitoring & Observability", 
        skills: ["Metrics Fundamentals", "CloudWatch Metrics", "Prometheus", "Grafana Dashboards", "Centralized Logging Concepts"] 
      },
      // Scripting - multiple languages
      { 
        category: "Scripting", 
        skills: ["Bash Fundamentals", "Shell Script Structure", "Control Flow", "Functions", "Python Fundamentals", "AWS SDK (Boto3)"] 
      }
    ],
    senior: [
      // Comprehensive skill coverage
      { category: "AWS Cloud Platform", skills: skillCategories[0].skills },
      { category: "Infrastructure as Code", skills: skillCategories[1].skills },
      { category: "Containerization", skills: skillCategories[2].skills },
      { category: "CI/CD", skills: skillCategories[3].skills },
      { category: "Monitoring & Observability", skills: skillCategories[4].skills },
      { category: "Scripting", skills: skillCategories[5].skills }
    ]
  };

  // Map to the format expected by the dashboard
  return skillsByStage[careerStage].map(cat => {
    const templateCategory = skillCategories.find(sc => sc.category === cat.category);
    
    return {
      category: cat.category,
      skills: cat.skills,
      proficiency: "Beginner",
      averageLevel: 0,
      targetLevel: templateCategory?.targetLevel || 80
    };
  });
};

/**
 * Get specific skills from the template for a track
 * @param {string} track - aws, kubernetes, devops, etc.
 * @returns {Array} Formatted skills objects for dashboard
 */
export const getTrackSpecificSkills = (track) => {
  // Define track-specific skills
  const trackSkills = {
    aws: [
      { category: "AWS Cloud Platform", skills: skillCategories[0].skills },
      { category: "Infrastructure as Code", skills: ["Terraform Basic Syntax", "Terraform with AWS", "CloudFormation"] }
    ],
    kubernetes: [
      { category: "Containerization", skills: skillCategories[2].skills },
      { category: "CI/CD", skills: ["Pipeline Design Patterns", "Blue/Green Deployment", "Canary Deployment"] }
    ],
    devops: [
      { category: "CI/CD", skills: skillCategories[3].skills },
      { category: "Monitoring & Observability", skills: skillCategories[4].skills },
      { category: "Scripting", skills: skillCategories[5].skills }
    ]
  };

  // Default to devops if track not found
  const selectedTrackSkills = trackSkills[track] || trackSkills.devops;

  // Map to the format expected by the dashboard
  return selectedTrackSkills.map(cat => {
    const templateCategory = skillCategories.find(sc => sc.category === cat.category);
    
    return {
      category: cat.category,
      skills: cat.skills,
      proficiency: "Beginner",
      averageLevel: 0,
      targetLevel: templateCategory?.targetLevel || 80
    };
  });
};

/**
 * Get all skills from the template
 * @returns {Array} Formatted skills objects for dashboard
 */
export const getAllSkills = () => {
  // Map to the format expected by the dashboard
  return skillCategories.map(cat => {
    return {
      category: cat.category,
      skills: cat.skills,
      proficiency: cat.defaultProficiency,
      averageLevel: 0,
      targetLevel: cat.targetLevel
    };
  });
};

export default {
  getBeginnerSkills,
  getTrackSpecificSkills,
  getAllSkills
};