/**
 * Weekly Schedule Templates
 * Provides standard schedule templates for different work styles
 */

// Default time allocation values
const defaultTimeAllocation = {
  fullTime: {
    learning: 25,     // 50% of time
    projects: 12.5,   // 25% of time
    networking: 7.5,  // 15% of time 
    content: 5,       // 10% of time
    total: 50         // Total hours per week
  },
  partTime: {
    learning: 10,     // 50% of time
    projects: 5,      // 25% of time
    networking: 3,    // 15% of time
    content: 2,       // 10% of time
    total: 20         // Total hours per week
  }
};

// Full-time schedule template (50 hours/week)
const fullTimeSchedule = {
  timeAllocation: defaultTimeAllocation.fullTime,
  dailySchedule: {
    Monday: [
      { time: '8:00 AM - 10:00 AM', activity: 'AWS Certification Study', category: 'Learning' },
      { time: '10:30 AM - 12:30 PM', activity: 'Infrastructure Project Work', category: 'Projects' },
      { time: '1:30 PM - 3:30 PM', activity: 'Container Orchestration Study', category: 'Learning' },
      { time: '4:00 PM - 5:00 PM', activity: 'LinkedIn Networking', category: 'Networking' }
    ],
    Tuesday: [
      { time: '8:00 AM - 10:00 AM', activity: 'Terraform Study', category: 'Learning' },
      { time: '10:30 AM - 12:30 PM', activity: 'CI/CD Pipeline Project', category: 'Projects' },
      { time: '1:30 PM - 3:30 PM', activity: 'Linux Administration', category: 'Learning' },
      { time: '4:00 PM - 5:00 PM', activity: 'Review & Planning', category: 'Learning' }
    ],
    Wednesday: [
      { time: '8:00 AM - 10:00 AM', activity: 'AWS Certification Study', category: 'Learning' },
      { time: '10:30 AM - 12:30 PM', activity: 'Infrastructure Project Work', category: 'Projects' },
      { time: '1:30 PM - 3:30 PM', activity: 'Monitoring & Observability', category: 'Learning' },
      { time: '4:00 PM - 5:00 PM', activity: 'Tech Community Engagement', category: 'Networking' }
    ],
    Thursday: [
      { time: '8:00 AM - 10:00 AM', activity: 'Kubernetes Study', category: 'Learning' },
      { time: '10:30 AM - 12:30 PM', activity: 'CI/CD Pipeline Project', category: 'Projects' },
      { time: '1:30 PM - 3:30 PM', activity: 'Cloud Security', category: 'Learning' },
      { time: '4:00 PM - 5:00 PM', activity: 'Technical Blog Writing', category: 'Content' }
    ],
    Friday: [
      { time: '8:00 AM - 10:00 AM', activity: 'AWS Certification Study', category: 'Learning' },
      { time: '10:30 AM - 12:30 PM', activity: 'Infrastructure Project Work', category: 'Projects' },
      { time: '1:30 PM - 3:30 PM', activity: 'Scripting & Automation', category: 'Learning' },
      { time: '4:00 PM - 5:00 PM', activity: 'Weekly Review', category: 'Learning' }
    ],
    Saturday: [
      { time: '9:00 AM - 11:00 AM', activity: 'Technical Blog Writing', category: 'Content' },
      { time: '1:00 PM - 3:00 PM', activity: 'Open Source Contribution', category: 'Projects' }
    ],
    Sunday: [
      { time: '2:00 PM - 4:00 PM', activity: 'Weekly Planning', category: 'Learning' },
      { time: '4:00 PM - 5:00 PM', activity: 'LinkedIn Networking', category: 'Networking' }
    ]
  },
  // Weekly summary data
  weeklyData: {
    totalHours: 50,
    learningHours: 25,
    projectHours: 12.5,
    networkingHours: 7.5,
    contentCreationHours: 5,
    completionRate: 100
  }
};

// Part-time schedule template (20 hours/week for working professionals)
const partTimeSchedule = {
  timeAllocation: defaultTimeAllocation.partTime,
  dailySchedule: {
    Monday: [
      { time: '6:00 PM - 8:00 PM', activity: 'AWS Certification Study', category: 'Learning' }
    ],
    Tuesday: [
      { time: '6:00 PM - 8:00 PM', activity: 'Infrastructure Project Work', category: 'Projects' }
    ],
    Wednesday: [
      { time: '6:00 PM - 8:00 PM', activity: 'Linux Administration', category: 'Learning' }
    ],
    Thursday: [
      { time: '6:00 PM - 8:00 PM', activity: 'Technical Blog Writing', category: 'Content' }
    ],
    Friday: [
      { time: '6:00 PM - 7:00 PM', activity: 'LinkedIn Networking', category: 'Networking' }
    ],
    Saturday: [
      { time: '9:00 AM - 12:00 PM', activity: 'AWS Certification Study', category: 'Learning' },
      { time: '1:00 PM - 3:00 PM', activity: 'Infrastructure Project Work', category: 'Projects' }
    ],
    Sunday: [
      { time: '9:00 AM - 12:00 PM', activity: 'Container Orchestration Study', category: 'Learning' },
      { time: '1:00 PM - 3:00 PM', activity: 'LinkedIn Networking & Content', category: 'Networking' }
    ]
  },
  // Weekly summary data
  weeklyData: {
    totalHours: 20,
    learningHours: 10,
    projectHours: 5,
    networkingHours: 3,
    contentCreationHours: 2,
    completionRate: 100
  }
};

// Weekend-focused schedule template (20 hours/week, mostly on weekends)
const weekendSchedule = {
  timeAllocation: defaultTimeAllocation.partTime,
  dailySchedule: {
    Monday: [
      { time: '7:00 PM - 8:00 PM', activity: 'Weekly Planning', category: 'Learning' }
    ],
    Tuesday: [
      { time: '7:00 PM - 8:00 PM', activity: 'LinkedIn Networking', category: 'Networking' }
    ],
    Wednesday: [],
    Thursday: [
      { time: '7:00 PM - 8:00 PM', activity: 'Technical Reading', category: 'Learning' }
    ],
    Friday: [
      { time: '7:00 PM - 9:00 PM', activity: 'Infrastructure Project Work', category: 'Projects' }
    ],
    Saturday: [
      { time: '8:00 AM - 12:00 PM', activity: 'AWS Certification Study', category: 'Learning' },
      { time: '1:00 PM - 4:00 PM', activity: 'Infrastructure Project Work', category: 'Projects' },
      { time: '4:00 PM - 5:00 PM', activity: 'LinkedIn Networking', category: 'Networking' }
    ],
    Sunday: [
      { time: '8:00 AM - 12:00 PM', activity: 'Container Orchestration Study', category: 'Learning' },
      { time: '1:00 PM - 3:00 PM', activity: 'Technical Blog Writing', category: 'Content' },
      { time: '3:00 PM - 5:00 PM', activity: 'Weekly Review', category: 'Learning' }
    ]
  },
  // Weekly summary data
  weeklyData: {
    totalHours: 20,
    learningHours: 10,
    projectHours: 5,
    networkingHours: 3,
    contentCreationHours: 2,
    completionRate: 100
  }
};

// Get schedule based on type
export const getScheduleTemplate = (type = 'fullTime') => {
  switch (type) {
    case 'fullTime':
      return fullTimeSchedule;
    case 'partTime':
      return partTimeSchedule;
    case 'weekend':
      return weekendSchedule;
    default:
      return fullTimeSchedule;
  }
};

// Get time allocation based on type
export const getTimeAllocation = (type = 'fullTime') => {
  return defaultTimeAllocation[type] || defaultTimeAllocation.fullTime;
};

// Create a customized schedule based on focus areas
export const createCustomSchedule = (type = 'fullTime', focusAreas = []) => {
  const baseSchedule = getScheduleTemplate(type);
  
  // If no focus areas specified, return the default schedule
  if (!focusAreas || focusAreas.length === 0) {
    return baseSchedule;
  }
  
  // Create a deep copy of the base schedule
  const customSchedule = JSON.parse(JSON.stringify(baseSchedule));
  
  // Customize the learning activities based on focus areas
  Object.keys(customSchedule.dailySchedule).forEach(day => {
    customSchedule.dailySchedule[day].forEach(timeSlot => {
      if (timeSlot.category === 'Learning') {
        // Randomly pick a focus area from the list
        const focusArea = focusAreas[Math.floor(Math.random() * focusAreas.length)];
        
        // Update the activity to reflect the focus area
        if (timeSlot.activity.includes('Study')) {
          timeSlot.activity = `${focusArea} Study`;
        } else if (timeSlot.activity.includes('Reading')) {
          timeSlot.activity = `${focusArea} Reading`;
        }
      }
    });
  });
  
  return customSchedule;
};

export default {
  getScheduleTemplate,
  getTimeAllocation,
  createCustomSchedule
};