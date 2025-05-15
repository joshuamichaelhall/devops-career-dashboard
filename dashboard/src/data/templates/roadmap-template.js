/**
 * Career Roadmap Template Generator
 * Provides career roadmap templates based on career tracks
 */

// Define roadmap templates for different tracks
const roadmapTemplates = {
  // Platform Engineer track roadmap
  platform: {
    title: "Platform Engineer Roadmap",
    description: "Roadmap for specializing in platform engineering",
    phases: [
      {
        id: "platform-foundation",
        name: "Platform Foundations",
        description: "Build foundational knowledge for platform engineering",
        duration: "3-4 months",
        progress: 0,
        milestones: [
          "Master containerization with Docker",
          "Learn orchestration fundamentals with Kubernetes",
          "Implement CI/CD pipelines with GitHub Actions/GitLab CI",
          "Set up basic monitoring and observability"
        ]
      },
      {
        id: "platform-intermediate",
        name: "Platform Intermediate",
        description: "Build and manage platform components",
        duration: "4-5 months",
        progress: 0,
        milestones: [
          "Implement Infrastructure as Code with Terraform",
          "Build self-service developer portals",
          "Configure service meshes for microservices",
          "Design and implement platform APIs"
        ]
      },
      {
        id: "platform-advanced",
        name: "Platform Advanced",
        description: "Advanced platform engineering and architecture",
        duration: "5-6 months",
        progress: 0,
        milestones: [
          "Implement GitOps workflows with Flux/ArgoCD",
          "Design developer experience improvements",
          "Automate security scanning and compliance",
          "Build custom operators and platform extensions"
        ]
      },
      {
        id: "platform-expert",
        name: "Platform Expert",
        description: "Platform leadership and innovation",
        duration: "6+ months",
        progress: 0,
        milestones: [
          "Design multi-region, multi-cloud platforms",
          "Implement platform as a product methodology",
          "Create internal developer platforms standards",
          "Measure and optimize platform engineering metrics"
        ]
      }
    ]
  },
  
  // DevSecOps track roadmap
  devsecops: {
    title: "DevSecOps Specialist Roadmap",
    description: "Roadmap for specializing in DevSecOps and security automation",
    phases: [
      {
        id: "devsecops-foundation",
        name: "DevSecOps Foundations",
        description: "Build foundational security knowledge",
        duration: "3-4 months",
        progress: 0,
        milestones: [
          "Learn AppSec fundamentals (OWASP Top 10)",
          "Implement basic security scanning in CI/CD",
          "Configure container security scanning",
          "Understand IAM and permission management"
        ]
      },
      {
        id: "devsecops-intermediate",
        name: "DevSecOps Intermediate",
        description: "Integrate and automate security practices",
        duration: "4-5 months",
        progress: 0,
        milestones: [
          "Implement security as code with policy engines",
          "Automate vulnerability management",
          "Configure infrastructure security scanning",
          "Implement secret management solutions"
        ]
      },
      {
        id: "devsecops-advanced",
        name: "DevSecOps Advanced",
        description: "Advanced security automation and integration",
        duration: "5-6 months",
        progress: 0,
        milestones: [
          "Implement automated security testing frameworks",
          "Design security incident response automation",
          "Configure runtime security monitoring",
          "Implement compliance as code frameworks"
        ]
      },
      {
        id: "devsecops-expert",
        name: "DevSecOps Expert",
        description: "Security engineering leadership and innovation",
        duration: "6+ months",
        progress: 0,
        milestones: [
          "Design comprehensive security automation architectures",
          "Lead security transformation initiatives",
          "Implement zero-trust architectures",
          "Create security champions programs"
        ]
      }
    ]
  },
  
  // AWS/Cloud track roadmap
  aws: {
    title: "AWS/Cloud Specialist Roadmap",
    description: "Roadmap for cloud specialization focusing on AWS services",
    phases: [
      {
        id: "aws-foundation",
        name: "AWS Foundations",
        description: "Master basic AWS services and cloud concepts",
        duration: "3-4 months",
        progress: 0,
        milestones: [
          "Complete AWS Cloud Practitioner certification",
          "Set up secure AWS environment with proper IAM controls",
          "Build a static website using S3, CloudFront, and Route 53",
          "Implement basic CloudWatch monitoring"
        ]
      },
      {
        id: "aws-intermediate",
        name: "AWS Intermediate",
        description: "Learn advanced services and architecture patterns",
        duration: "4-6 months",
        progress: 0,
        milestones: [
          "Complete AWS Solutions Architect Associate certification",
          "Build a highly available multi-tier application",
          "Implement Infrastructure as Code with CloudFormation/Terraform",
          "Set up CI/CD pipeline for AWS deployments"
        ]
      },
      {
        id: "aws-advanced",
        name: "AWS Advanced",
        description: "Master advanced services, security, and DevOps practices",
        duration: "5-6 months",
        progress: 0,
        milestones: [
          "Complete AWS DevOps Professional certification",
          "Implement container orchestration with ECS or EKS",
          "Build serverless applications with Lambda and API Gateway",
          "Implement advanced monitoring and observability"
        ]
      },
      {
        id: "aws-expert",
        name: "AWS Expert",
        description: "Advanced architecture, security, and optimization",
        duration: "6+ months",
        progress: 0,
        milestones: [
          "Complete AWS Security Specialty certification",
          "Design and implement multi-account AWS environments",
          "Implement cost optimization strategies",
          "Mentor others on AWS best practices"
        ]
      }
    ]
  },
  
  // Kubernetes track roadmap
  kubernetes: {
    title: "Kubernetes Specialist Roadmap",
    description: "Roadmap for specializing in container orchestration with Kubernetes",
    phases: [
      {
        id: "k8s-foundation",
        name: "Kubernetes Foundations",
        description: "Learn container basics and Kubernetes core concepts",
        duration: "3-4 months",
        progress: 0,
        milestones: [
          "Master Docker fundamentals and container concepts",
          "Install and configure a local Kubernetes cluster",
          "Deploy basic applications to Kubernetes",
          "Understand Kubernetes core objects (Pods, Services, Deployments)"
        ]
      },
      {
        id: "k8s-intermediate",
        name: "Kubernetes Intermediate",
        description: "Master Kubernetes deployment and management",
        duration: "4-5 months",
        progress: 0,
        milestones: [
          "Complete Certified Kubernetes Application Developer (CKAD)",
          "Implement StatefulSets and persistent storage",
          "Configure networking and service mesh solutions",
          "Set up CI/CD pipelines for Kubernetes deployments"
        ]
      },
      {
        id: "k8s-advanced",
        name: "Kubernetes Advanced",
        description: "Advanced Kubernetes administration and architecture",
        duration: "5-6 months",
        progress: 0,
        milestones: [
          "Complete Certified Kubernetes Administrator (CKA)",
          "Implement security best practices and policies",
          "Master cluster operations and troubleshooting",
          "Implement auto-scaling and resource management"
        ]
      },
      {
        id: "k8s-expert",
        name: "Kubernetes Expert",
        description: "Platform engineering and advanced Kubernetes solutions",
        duration: "6+ months",
        progress: 0,
        milestones: [
          "Complete Certified Kubernetes Security Specialist (CKS)",
          "Build custom operators and controllers",
          "Design highly available multi-cluster solutions",
          "Contribute to Kubernetes ecosystem or mentor others"
        ]
      }
    ]
  },
  
  // DevOps Engineer track roadmap
  devops: {
    title: "DevOps Engineer Roadmap",
    description: "Comprehensive roadmap for full-stack DevOps engineering",
    phases: [
      {
        id: "devops-foundation",
        name: "DevOps Foundations",
        description: "Build fundamental DevOps skills and knowledge",
        duration: "3-4 months",
        progress: 0,
        milestones: [
          "Master Linux fundamentals and scripting",
          "Learn Git workflow and branching strategies",
          "Set up basic CI/CD pipelines with GitHub Actions",
          "Build and deploy containerized applications"
        ]
      },
      {
        id: "devops-intermediate",
        name: "DevOps Intermediate",
        description: "Expand DevOps toolchain and practices",
        duration: "4-6 months",
        progress: 0,
        milestones: [
          "Implement Infrastructure as Code with Terraform",
          "Deploy applications to cloud environments (AWS/Azure/GCP)",
          "Set up monitoring and observability solutions",
          "Implement configuration management with Ansible"
        ]
      },
      {
        id: "devops-advanced",
        name: "DevOps Advanced",
        description: "Master advanced DevOps practices and architecture",
        duration: "5-6 months",
        progress: 0,
        milestones: [
          "Implement Kubernetes for container orchestration",
          "Design and implement complex CI/CD pipelines",
          "Implement security scanning and DevSecOps practices",
          "Master cloud architecture and deployment patterns"
        ]
      },
      {
        id: "devops-expert",
        name: "DevOps Expert",
        description: "Platform engineering and organizational transformation",
        duration: "6+ months",
        progress: 0,
        milestones: [
          "Design internal developer platforms",
          "Implement SRE practices and reliability engineering",
          "Optimize cost and performance across infrastructure",
          "Lead DevOps transformation and mentor teams"
        ]
      }
    ]
  },
  
  // SRE track roadmap
  sre: {
    title: "Site Reliability Engineer Roadmap",
    description: "Roadmap for specializing in reliability engineering and operations",
    phases: [
      {
        id: "sre-foundation",
        name: "SRE Foundations",
        description: "Build foundation in systems and operations",
        duration: "3-4 months",
        progress: 0,
        milestones: [
          "Master Linux systems administration",
          "Learn infrastructure automation fundamentals",
          "Understand monitoring and alerting basics",
          "Build observability into applications"
        ]
      },
      {
        id: "sre-intermediate",
        name: "SRE Intermediate",
        description: "Advance reliability engineering practices",
        duration: "4-5 months",
        progress: 0,
        milestones: [
          "Implement SLIs, SLOs, and SLAs",
          "Master incident management and post-mortems",
          "Automate operations with Infrastructure as Code",
          "Implement advanced monitoring and alerting"
        ]
      },
      {
        id: "sre-advanced",
        name: "SRE Advanced",
        description: "Master reliability and performance engineering",
        duration: "5-6 months",
        progress: 0,
        milestones: [
          "Implement chaos engineering and resilience testing",
          "Design high-availability distributed systems",
          "Optimize application and infrastructure performance",
          "Implement advanced observability solutions"
        ]
      },
      {
        id: "sre-expert",
        name: "SRE Expert",
        description: "Advanced reliability architecture and leadership",
        duration: "6+ months",
        progress: 0,
        milestones: [
          "Architect global-scale distributed systems",
          "Implement reliability as a service across organization",
          "Lead major incident responses and system recovery",
          "Mentor other SREs and implement best practices"
        ]
      }
    ]
  }
};

/**
 * Get a roadmap for a specific track
 * @param {string} track - aws, kubernetes, devops, or sre
 * @returns {Object} Roadmap template object
 */
export const getRoadmapTemplate = (track = 'devops') => {
  return roadmapTemplates[track] || roadmapTemplates.devops;
};

/**
 * Get roadmap phases for a specific track
 * @param {string} track - aws, kubernetes, devops, or sre
 * @returns {Array} Array of roadmap phases
 */
export const getRoadmapPhases = (track = 'devops') => {
  const roadmap = getRoadmapTemplate(track);
  return roadmap.phases || [];
};

/**
 * Create a customized roadmap based on multiple tracks
 * @param {Array} tracks - Array of track names
 * @returns {Object} Customized roadmap object
 */
export const createCustomRoadmap = (tracks = []) => {
  // Default to DevOps if no tracks provided
  if (!tracks || tracks.length === 0) {
    return getRoadmapTemplate('devops');
  }
  
  // If only one track, return that template
  if (tracks.length === 1) {
    return getRoadmapTemplate(tracks[0]);
  }
  
  // For multiple tracks, create a custom blended roadmap
  const primaryTrack = tracks[0]; // The first track is considered primary
  const baseRoadmap = getRoadmapTemplate(primaryTrack);
  
  // Create a custom title and description
  const trackNames = tracks.map(track => {
    switch(track) {
      case 'aws': return 'AWS';
      case 'kubernetes': return 'Kubernetes';
      case 'devops': return 'DevOps';
      case 'sre': return 'SRE';
      case 'platform': return 'Platform';
      case 'devsecops': return 'DevSecOps';
      default: return track;
    }
  });
  
  // Create a truly blended roadmap by integrating milestones from each track
  const customPhases = baseRoadmap.phases.map((phase, phaseIndex) => {
    // Clone the base phase
    const blendedPhase = { ...phase };
    
    // Create a collection of additional milestones from secondary tracks
    const additionalMilestones = [];
    
    // For each secondary track, add up to two milestones per phase
    tracks.slice(1).forEach(track => {
      const secondaryRoadmap = getRoadmapTemplate(track);
      
      // Get the corresponding phase from this secondary track
      if (secondaryRoadmap.phases[phaseIndex]) {
        // Get all milestones from this secondary track at this phase
        const secondaryMilestones = secondaryRoadmap.phases[phaseIndex].milestones;
        
        // Add up to two meaningful milestones from this track
        if (secondaryMilestones && secondaryMilestones.length > 0) {
          // Select milestones based on phase progression
          // For early phases, prioritize foundational skills
          // For later phases, prioritize specialty skills
          const milestoneIndexes = phaseIndex <= 1 
            ? [0, 1]  // For foundation and intermediate phases, take first two milestones
            : [2, 3];  // For advanced and expert phases, take later milestones
            
          milestoneIndexes.forEach(idx => {
            if (secondaryMilestones[idx]) {
              additionalMilestones.push(secondaryMilestones[idx]);
            }
          });
        }
      }
    });
    
    // Blend in the additional milestones - create a balanced mix
    // Keep more primary track milestones for foundation phases
    // Add more specialized milestones for advanced phases
    const primaryMilestones = phaseIndex <= 1
      ? phase.milestones.slice(0, 3)  // More primary focus in early phases
      : phase.milestones.slice(0, 2);  // Less primary focus in later phases
      
    // Create final milestone list with intelligent distribution
    blendedPhase.milestones = [
      ...primaryMilestones,  // Primary track milestones
      ...additionalMilestones.slice(0, 4)  // Up to 4 milestones from secondary tracks
    ].slice(0, 6);  // Limit to 6 milestones total
    
    return blendedPhase;
  });
  
  const customRoadmap = {
    title: `Custom ${trackNames.join('/')} Roadmap`,
    description: `Customized roadmap blending ${trackNames.join(', ')} specializations`,
    phases: customPhases
  };
  
  return customRoadmap;
};

export default {
  getRoadmapTemplate,
  getRoadmapPhases,
  createCustomRoadmap
};