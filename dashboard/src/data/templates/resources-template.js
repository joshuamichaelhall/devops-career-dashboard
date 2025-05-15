/**
 * Learning Resources Template Generator
 * Provides learning resource templates based on tracks
 */

// Define learning resource templates for different tracks
const resourceTemplates = {
  // AWS/Cloud track resources
  aws: [
    {
      name: "AWS Certified Cloud Practitioner",
      type: "course",
      url: "https://aws.amazon.com/certification/certified-cloud-practitioner/",
      provider: "AWS",
      description: "Foundational certification for AWS cloud concepts",
      priority: "high",
      status: "Scheduled",
      progress: 0
    },
    {
      name: "Adrian Cantrill - AWS Solutions Architect Associate",
      type: "course",
      url: "https://cantrill.io/",
      provider: "Adrian Cantrill",
      description: "Comprehensive course for the AWS SAA certification",
      priority: "high",
      status: "Scheduled",
      progress: 0
    },
    {
      name: "AWS Well-Architected Framework",
      type: "documentation",
      url: "https://aws.amazon.com/architecture/well-architected/",
      provider: "AWS",
      description: "Best practices for building applications in the cloud",
      priority: "medium",
      status: "Scheduled",
      progress: 0
    },
    {
      name: "AWS Security Best Practices",
      type: "whitepaper",
      url: "https://docs.aws.amazon.com/whitepapers/latest/aws-security-best-practices/",
      provider: "AWS",
      description: "Security principles and best practices for AWS",
      priority: "medium",
      status: "Scheduled",
      progress: 0
    },
    {
      name: "AWS Cost Optimization",
      type: "documentation",
      url: "https://aws.amazon.com/aws-cost-management/aws-cost-optimization/",
      provider: "AWS",
      description: "Strategies for optimizing AWS costs",
      priority: "low",
      status: "Scheduled",
      progress: 0
    }
  ],
  
  // Terraform/IaC track resources
  terraform: [
    {
      name: "HashiCorp Terraform Associate Certification",
      type: "course",
      url: "https://learn.hashicorp.com/collections/terraform/certification",
      provider: "HashiCorp",
      description: "Official preparation for the Terraform Associate certification",
      priority: "high",
      status: "Scheduled",
      progress: 0
    },
    {
      name: "Terraform: Up & Running",
      type: "book",
      url: "https://www.terraformupandrunning.com/",
      provider: "Yevgeniy Brikman",
      description: "Comprehensive guide to Terraform",
      priority: "high",
      status: "Scheduled",
      progress: 0
    },
    {
      name: "Terraform Module Registry",
      type: "resource",
      url: "https://registry.terraform.io/",
      provider: "HashiCorp",
      description: "Public registry of Terraform modules",
      priority: "medium",
      status: "Scheduled",
      progress: 0
    },
    {
      name: "Terraform Best Practices",
      type: "documentation",
      url: "https://www.terraform-best-practices.com/",
      provider: "Community",
      description: "Best practices for Terraform projects",
      priority: "medium",
      status: "Scheduled",
      progress: 0
    }
  ],
  
  // Kubernetes track resources
  kubernetes: [
    {
      name: "Kubernetes: The Hard Way",
      type: "tutorial",
      url: "https://github.com/kelseyhightower/kubernetes-the-hard-way",
      provider: "Kelsey Hightower",
      description: "Manual deployment of Kubernetes to understand its components",
      priority: "high",
      status: "Scheduled",
      progress: 0
    },
    {
      name: "Certified Kubernetes Administrator (CKA)",
      type: "course",
      url: "https://training.linuxfoundation.org/certification/certified-kubernetes-administrator-cka/",
      provider: "Linux Foundation",
      description: "Official certification for Kubernetes administrators",
      priority: "high",
      status: "Scheduled",
      progress: 0
    },
    {
      name: "Kubernetes in Action",
      type: "book",
      url: "https://www.manning.com/books/kubernetes-in-action",
      provider: "Marko Lukša",
      description: "Comprehensive guide to Kubernetes",
      priority: "medium",
      status: "Scheduled",
      progress: 0
    },
    {
      name: "Kubernetes Patterns",
      type: "book",
      url: "https://www.oreilly.com/library/view/kubernetes-patterns/9781492050278/",
      provider: "O'Reilly",
      description: "Reusable design patterns for Kubernetes",
      priority: "medium",
      status: "Scheduled",
      progress: 0
    }
  ],
  
  // General DevOps resources
  devops: [
    {
      name: "The DevOps Handbook",
      type: "book",
      url: "https://itrevolution.com/book/the-devops-handbook/",
      provider: "Gene Kim et al.",
      description: "Guide to implementing DevOps principles",
      priority: "high",
      status: "Scheduled",
      progress: 0
    },
    {
      name: "Site Reliability Engineering",
      type: "book",
      url: "https://sre.google/sre-book/table-of-contents/",
      provider: "Google",
      description: "How Google runs production systems",
      priority: "high",
      status: "Scheduled",
      progress: 0
    },
    {
      name: "GitHub Actions",
      type: "documentation",
      url: "https://docs.github.com/en/actions",
      provider: "GitHub",
      description: "Setting up CI/CD pipelines with GitHub Actions",
      priority: "medium",
      status: "Scheduled",
      progress: 0
    },
    {
      name: "Prometheus and Grafana",
      type: "tutorial",
      url: "https://prometheus.io/docs/visualization/grafana/",
      provider: "Prometheus",
      description: "Setup monitoring with Prometheus and Grafana",
      priority: "medium",
      status: "Scheduled",
      progress: 0
    }
  ],
  
  // Linux resources
  linux: [
    {
      name: "How Linux Works",
      type: "book",
      url: "https://nostarch.com/howlinuxworks3",
      provider: "No Starch Press",
      description: "Understanding the Linux OS internals",
      priority: "high",
      status: "Scheduled",
      progress: 0
    },
    {
      name: "The Linux Command Line",
      type: "book",
      url: "https://linuxcommand.org/tlcl.php",
      provider: "William Shotts",
      description: "Comprehensive guide to the Linux command line",
      priority: "high",
      status: "Scheduled",
      progress: 0
    },
    {
      name: "Linux Journey",
      type: "tutorial",
      url: "https://linuxjourney.com/",
      provider: "Linux Journey",
      description: "Interactive Linux learning platform",
      priority: "medium",
      status: "Scheduled",
      progress: 0
    }
  ],
  
  // Security resources
  security: [
    {
      name: "OWASP Top 10",
      type: "resource",
      url: "https://owasp.org/www-project-top-ten/",
      provider: "OWASP",
      description: "Top 10 web application security risks",
      priority: "high",
      status: "Scheduled",
      progress: 0
    },
    {
      name: "AWS Security Specialty Certification",
      type: "course",
      url: "https://aws.amazon.com/certification/certified-security-specialty/",
      provider: "AWS",
      description: "Specialized certification for security in AWS",
      priority: "medium",
      status: "Scheduled",
      progress: 0
    }
  ]
};

/**
 * Get resources for a specific track
 * @param {string} track - aws, terraform, kubernetes, devops, linux, security
 * @returns {Array} Array of resources
 */
export const getTrackResources = (track) => {
  // Return resources for the specified track (default to devops if track not found)
  return resourceTemplates[track] || resourceTemplates.devops;
};

/**
 * Get resources for multiple tracks
 * @param {Array} tracks - Array of track names
 * @returns {Array} Combined array of resources
 */
export const getMultiTrackResources = (tracks) => {
  // Combine resources from multiple tracks
  let resources = [];
  
  tracks.forEach(track => {
    if (resourceTemplates[track]) {
      resources = [...resources, ...resourceTemplates[track]];
    }
  });
  
  return resources.length > 0 ? resources : resourceTemplates.devops;
};

/**
 * Get all available resources
 * @returns {Array} Array of all resources
 */
export const getAllResources = () => {
  let allResources = [];
  
  Object.keys(resourceTemplates).forEach(track => {
    allResources = [...allResources, ...resourceTemplates[track]];
  });
  
  return allResources;
};

/**
 * Format the resource for the dashboard
 * Adds necessary fields like id, dateAdded
 * @param {Object} resource - Resource object
 * @returns {Object} Formatted resource object
 */
export const formatResourceForDashboard = (resource) => {
  return {
    id: `res-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    name: resource.name,
    type: resource.type,
    priority: resource.priority,
    status: resource.status,
    progress: resource.progress,
    url: resource.url,
    provider: resource.provider,
    description: resource.description,
    targetMonth: getTargetMonth(),
    dateAdded: new Date().toISOString().split('T')[0]
  };
};

/**
 * Get a target month 1-3 months in the future
 * @returns {string} Target month string
 */
const getTargetMonth = () => {
  const date = new Date();
  const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];
  
  // Add 1-3 months randomly
  date.setMonth(date.getMonth() + Math.floor(Math.random() * 3) + 1);
  
  return `${monthNames[date.getMonth()]} ${date.getFullYear()}`;
};

export default {
  getTrackResources,
  getMultiTrackResources,
  getAllResources,
  formatResourceForDashboard
};