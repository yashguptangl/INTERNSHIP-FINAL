// Types for the internship portal

export interface Intern {
  _id?: string; // MongoDB ID
  id: string; // Fallback ID
  employeeId: string;
  name: string;
  email: string;
  phone: string;
  gender?: string;
  country?: string;
  domain: InternshipDomain;
  appliedDate: Date;
  startDate: Date;
  endDate: Date;
  phase: number;
  status: 'pending' | 'active' | 'completed';
  offerLetterSent: boolean;
  certificateSent: boolean;
  address?: string;
  college?: string;
  degree?: string;
  year?: string;
  socialMedia?: string;
}

export type InternshipDomain = 
  | 'MERN Stack (Web Development)'
  | 'Java Development'
  | 'Data Science'
  | 'AI/ML'
  | 'Cyber Security'
  | 'Python Programming'
  | 'UI/UX Design'
  | 'Data Analytics';

export interface InternshipProgram {
  id: string;
  title: InternshipDomain;
  description: string;
  duration: string;
  mode: 'Remote' | 'Hybrid' | 'On-site';
  skills: string[];
  icon: string;
  formLink: string;
}

export interface PhaseInfo {
  phase: number;
  applyStart: Date;
  applyEnd: Date;
  internshipStart: Date;
  internshipEnd: Date;
}
