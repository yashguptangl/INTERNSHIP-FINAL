import { InternshipProgram, Intern, PhaseInfo } from '@/types/internship';

export const internshipPrograms: InternshipProgram[] = [
    {
      id: 'data-analytics',
      title: 'Data Analytics',
      description: 'Gain hands-on experience in data analytics, business intelligence, and data visualization using industry-standard tools.',
      duration: '4 Weeks',
      mode: 'Remote',
      skills: ['Excel', 'SQL', 'Power BI', 'Data Visualization', 'Business Intelligence'],
      icon: '📈',
      formLink: 'https://docs.google.com/forms/d/e/1FAIpQLScmmsKxPrMMbprKFAlKCPy1yYJ6LYmhiQbRSGxAN-WEO0tF2Q/viewform',
    },
  {
    id: 'mern',
    title: 'MERN Stack (Web Development)',
    description: 'Build full-stack web applications using MongoDB, Express.js, React, and Node.js. Master Modern Tech',
    duration: '4 Weeks',
    mode: 'Remote',
    skills: ['MongoDB', 'Express.js', 'React', 'Node.js', 'REST APIs'],
    icon: '🚀',
    formLink: 'https://docs.google.com/forms/d/e/1FAIpQLScmmsKxPrMMbprKFAlKCPy1yYJ6LYmhiQbRSGxAN-WEO0tF2Q/viewform',
  },
  {
    id: 'java',
    title: 'Java Development',
    description: 'Master enterprise-grade Java development with Spring Boot, microservices architecture, and best practices.',
    duration: '4 Weeks',
    mode: 'Remote',
    skills: ['Java', 'Spring Boot', 'Microservices', 'MySQL', 'REST APIs'],
    icon: '☕',
    formLink: 'https://docs.google.com/forms/d/e/1FAIpQLScmmsKxPrMMbprKFAlKCPy1yYJ6LYmhiQbRSGxAN-WEO0tF2Q/viewform',
  },
  {
    id: 'data-science',
    title: 'Data Science',
    description: 'Dive into data analytics, visualization, and machine learning fundamentals using Python and modern tools.',
    duration: '4 Weeks',
    mode: 'Remote',
    skills: ['Python', 'Pandas', 'NumPy', 'Matplotlib', 'SQL'],
    icon: '📊',
    formLink: 'https://docs.google.com/forms/d/e/1FAIpQLScmmsKxPrMMbprKFAlKCPy1yYJ6LYmhiQbRSGxAN-WEO0tF2Q/viewform',
  },
  {
    id: 'ai-ml',
    title: 'AI/ML',
    description: 'Explore artificial intelligence and machine learning concepts, neural networks, and deep learning frameworks.',
    duration: '4 Weeks',
    mode: 'Remote',
    skills: ['Python', 'TensorFlow', 'PyTorch', 'Machine Learning', 'Deep Learning'],
    icon: '🤖',
    formLink: 'https://docs.google.com/forms/d/e/1FAIpQLScmmsKxPrMMbprKFAlKCPy1yYJ6LYmhiQbRSGxAN-WEO0tF2Q/viewform',
  },
  {
    id: 'cyber-security',
    title: 'Cyber Security',
    description: 'Learn ethical hacking, network security, vulnerability assessment, and cybersecurity best practices.',
    duration: '4 Weeks',
    mode: 'Remote',
    skills: ['Network Security', 'Ethical ', 'OWASP', 'Penetration Testing', 'Security Auditing'],
    icon: '🔐',
    formLink: 'https://docs.google.com/forms/d/e/1FAIpQLScmmsKxPrMMbprKFAlKCPy1yYJ6LYmhiQbRSGxAN-WEO0tF2Q/viewform',
  },
  {
    id: 'python',
    title: 'Python Programming',
    description: 'Master Python programming fundamentals,libraries,and web development.Build real-world project with Python.',
    duration: '4 Weeks',
    mode: 'Remote',
    skills: ['Python', 'Flask', 'Django', 'Databases', 'API Development'],
    icon: '🐍',
    formLink: 'https://docs.google.com/forms/d/e/1FAIpQLScmmsKxPrMMbprKFAlKCPy1yYJ6LYmhiQbRSGxAN-WEO0tF2Q/viewform',
  },
  {
    id: 'ui-ux',
    title: 'UI/UX Design',
    description: 'Learn user interface and user experience design principles, prototyping, and modern design tools.',
    duration: '4 Weeks',
    mode: 'Remote',
    skills: ['Figma', 'User Research', 'Prototyping', 'Wireframing', 'Design Systems'],
    icon: '🎨',
    formLink: 'https://docs.google.com/forms/d/e/1FAIpQLScmmsKxPrMMbprKFAlKCPy1yYJ6LYmhiQbRSGxAN-WEO0tF2Q/viewform',
  },
];

// Helper function to generate unique employee ID
export const generateEmployeeId = (domain: string, phase: number): string => {
  const domainCodes: Record<string, string> = {
    'MERN Stack': 'MERN',
    'Java Development': 'JAVA',
    'Data Science': 'DATA',
    'AI/ML': 'AIML',
    'Cyber Security': 'CYBER',
    'Python Programming': 'PYTHON',
    'UI/UX Design': 'DESIGN',
    'Data Analytics': 'DATA',
  };
  
  const domainCode = (domainCodes[domain] || 'INTERN').toUpperCase();
  const year = new Date().getFullYear().toString().slice(-2);
  
  // Generate unique suffix with alphanumeric mix for better readability
  const chars = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789'; // Excluded confusing chars (I, L, O, 1, 0)
  let suffix = '';
  for (let i = 0; i < 4; i++) {
    suffix += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  
  return `${domainCode}-${year}-P${phase}-${suffix}`;
};

// Calculate internship phase based on application date
export const calculatePhase = (appliedDate: Date): PhaseInfo => {
  const day = appliedDate.getDate();
  const month = appliedDate.getMonth();
  const year = appliedDate.getFullYear();
  
  let phase: number;
  let internshipStart: Date;
  let internshipEnd: Date;
  let applyStart: Date;
  let applyEnd: Date;
  
  // Phase 1: Apply before 1st → Internship starts 1st
  // Phase 2: Apply 1st-10th → Internship starts 11th
  // Phase 3: Apply 11th-21st → Internship starts 21st
  
  if (day < 1 || (month === 11 && day >= 24)) {
    // Applied in late December or before 1st
    phase = 1;
    const nextMonth = month === 11 ? 0 : month + 1;
    const nextYear = month === 11 ? year + 1 : year;
    applyStart = new Date(year, 11, 24);
    applyEnd = new Date(nextYear, nextMonth, 1);
    internshipStart = new Date(nextYear, nextMonth, 1);
    internshipEnd = new Date(nextYear, nextMonth + 1, 1);
  } else if (day >= 1 && day <= 10) {
    // Phase 2
    phase = 2;
    applyStart = new Date(year, month, 1);
    applyEnd = new Date(year, month, 10);
    internshipStart = new Date(year, month, 11);
    internshipEnd = new Date(year, month + 1, 11);
  } else if (day >= 11 && day <= 21) {
    // Phase 3
    phase = 3;
    applyStart = new Date(year, month, 11);
    applyEnd = new Date(year, month, 21);
    internshipStart = new Date(year, month, 21);
    internshipEnd = new Date(year, month + 1, 21);
  } else {
    // Applied after 21st - Next month Phase 1
    phase = 1;
    const nextMonth = month + 1;
    const nextYear = nextMonth > 11 ? year + 1 : year;
    const actualNextMonth = nextMonth > 11 ? 0 : nextMonth;
    applyStart = new Date(year, month, 22);
    applyEnd = new Date(nextYear, actualNextMonth, 1);
    internshipStart = new Date(nextYear, actualNextMonth, 1);
    internshipEnd = new Date(nextYear, actualNextMonth + 1, 1);
  }
  
  return {
    phase,
    applyStart,
    applyEnd,
    internshipStart,
    internshipEnd,
  };
};

export const formatDate = (date: Date): string => {
  return date.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};
