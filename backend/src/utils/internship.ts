// backend/src/utils/internship.ts

export interface PhaseInfo {
  phase: number;
  applyStart: Date;
  applyEnd: Date;
  internshipStart: Date;
  internshipEnd: Date;
}

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

  const chars = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
  let suffix = '';
  for (let i = 0; i < 4; i++) {
    suffix += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  return `${domainCode}-${year}-P${phase}-${suffix}`;
};

// Calculate internship phase based on application date
export const calculatePhase = (appliedDate: Date): PhaseInfo => {
  const day = appliedDate.getDate();
  const month = appliedDate.getMonth(); // 0-11
  const year = appliedDate.getFullYear();

  let phase: number;
  let internshipStart: Date;
  let internshipEnd: Date;
  let applyStart: Date;
  let applyEnd: Date;

  // Phase 2: Apply 1st–10th → Start 11th
  // Phase 3: Apply 11th–21st → Start 21st
  // Phase 1: Else (after 21st or late December) → Next month 1st

  if (month === 11 && day >= 24) {
    // Late December → next year Jan Phase 1
    phase = 1;
    const nextMonth = 0;
    const nextYear = year + 1;
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
    // After 21st → next month Phase 1
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
