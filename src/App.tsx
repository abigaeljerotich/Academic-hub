/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
import {
  GraduationCap,
  BookOpen,
  HeartPulse,
  DollarSign,
  Briefcase,
  Home,
  Laptop,
  Search,
  Filter,
  Bookmark,
  BookmarkCheck,
  Calendar,
  Clock,
  MapPin,
  Phone,
  Mail,
  ExternalLink,
  PlusCircle,
  FileText,
  Download,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  X,
  ChevronRight,
  ShieldAlert,
  UserCheck,
  Sparkles,
  HelpCircle,
  ArrowRight,
  Menu,
  Bell,
  Check,
  Building2,
  CalendarCheck,
  SlidersHorizontal,
  Compass,
  FileCheck2,
  Users,
  Info,
  Shield,
  LifeBuoy
} from 'lucide-react';

// --- TYPES & INTERFACES ---

export type UserRole = 'student' | 'faculty' | 'advisor' | 'admin';

export interface UserProfile {
  id: string;
  name: string;
  role: UserRole;
  title: string;
  department: string;
  avatar: string;
  email: string;
  badge: string;
}

export type ResourceCategory =
  | 'academic'
  | 'counseling'
  | 'financial'
  | 'career'
  | 'housing'
  | 'it';

export interface UniversityResource {
  id: string;
  title: string;
  category: ResourceCategory;
  shortDescription: string;
  detailedOverview: string;
  building: string;
  room: string;
  hours: string;
  phone: string;
  email: string;
  website: string;
  is24x7Urgent: boolean;
  virtualAvailable: boolean;
  tags: string[];
  staffLead: string;
  featuredServices: string[];
  customCreated?: boolean;
}

export interface Appointment {
  id: string;
  resourceId: string;
  resourceTitle: string;
  date: string;
  timeSlot: string;
  deliveryMode: 'In-Person' | 'Virtual (Zoom)';
  topic: string;
  attendeeName: string;
  attendeeRole: UserRole;
  providerStaff: string;
  status: 'Confirmed' | 'Pending' | 'Completed';
  locationNote: string;
  createdDate: string;
}

export interface DocumentItem {
  id: string;
  title: string;
  category: 'Academic & Registration' | 'Financial & Grants' | 'Faculty Policies' | 'Advising & Exceptions' | 'Campus Safety';
  fileFormat: 'PDF' | 'DOCX' | 'XLSX';
  fileSize: string;
  updatedDate: string;
  allowedRoles: UserRole[];
  downloadCount: number;
  description: string;
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  title: string;
  message: string;
}

// --- INITIAL SEED DATA ---

const ROLE_PROFILES: Record<UserRole, UserProfile> = {
  student: {
    id: 'STU-88219',
    name: 'Maya Chen',
    role: 'student',
    title: 'Junior (Class of 2028)',
    department: 'Computer Science & Cognitive Ethics',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    email: 'm.chen@apex.edu',
    badge: 'Undergraduate Scholar'
  },
  faculty: {
    id: 'FAC-1042',
    name: 'Dr. Arthur Vance',
    role: 'faculty',
    title: 'Associate Professor',
    department: 'Department of Biological Sciences',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    email: 'a.vance@apex.edu',
    badge: 'Tenured Faculty'
  },
  advisor: {
    id: 'ADV-3390',
    name: 'Elena Rostova, M.Ed.',
    role: 'advisor',
    title: 'Senior Academic Counselor',
    department: 'Division of Student Academic Success',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    email: 'e.rostova@apex.edu',
    badge: 'Certified Advisor'
  },
  admin: {
    id: 'ADM-0014',
    name: 'Marcus Thorne',
    role: 'admin',
    title: 'Director of Campus Operations & IT',
    department: 'University Information & Services',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    email: 'm.thorne@apex.edu',
    badge: 'Portal Administrator'
  }
};

const CATEGORIES_CONFIG: {
  id: ResourceCategory;
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}[] = [
  {
    id: 'academic',
    name: 'Academic Support',
    description: 'Tutoring, writing consultations, STEM problem sessions & research aids',
    icon: BookOpen,
    color: 'from-blue-600 to-indigo-700'
  },
  {
    id: 'counseling',
    name: 'Counseling & Wellness',
    description: 'Confidential therapy, crisis triage, wellness coaching & health clinic',
    icon: HeartPulse,
    color: 'from-rose-600 to-pink-700'
  },
  {
    id: 'financial',
    name: 'Financial Aid & Bursar',
    description: 'Scholarships, emergency micro-grants, work-study & billing help',
    icon: DollarSign,
    color: 'from-emerald-600 to-teal-700'
  },
  {
    id: 'career',
    name: 'Career & Co-Op Services',
    description: 'Resume critiques, mock interviews, internship placement & alumni network',
    icon: Briefcase,
    color: 'from-amber-600 to-orange-700'
  },
  {
    id: 'housing',
    name: 'Housing & Residential Life',
    description: 'Dorm services, commuter student lounge, meal plans & maintenance',
    icon: Home,
    color: 'from-purple-600 to-violet-700'
  },
  {
    id: 'it',
    name: 'IT & Tech Depot',
    description: 'Hardware loaners, software licensing, Wi-Fi onboarding & lab computing',
    icon: Laptop,
    color: 'from-cyan-600 to-blue-700'
  }
];

const INITIAL_RESOURCES: UniversityResource[] = [
  {
    id: 'res-math-lab',
    title: 'Math & Quantitative Reasoning Lab',
    category: 'academic',
    shortDescription: 'Free peer tutoring and faculty problem-solving sessions for calculus, linear algebra, statistics, and discrete math.',
    detailedOverview: 'The Quantitative Reasoning Center provides walk-in and booked 1-on-1 tutoring for all undergraduate math, data science, and physics coursework. Equipped with collaborative whiteboards, graphing workstations, and exam review packets.',
    building: 'Euler Hall of Sciences',
    room: 'Room 204 (East Wing)',
    hours: 'Mon-Thu: 9:00 AM - 8:00 PM | Fri: 9:00 AM - 5:00 PM | Sun: 2:00 PM - 7:00 PM',
    phone: '(555) 839-MATH',
    email: 'mathlab@apex.edu',
    website: 'https://apex.edu/math-lab',
    is24x7Urgent: false,
    virtualAvailable: true,
    tags: ['WalkInWelcome', 'PeerLed', 'Calculus', 'Statistics', 'FreePrinting'],
    staffLead: 'Dr. Sanjay Patel & Lead Undergraduate Fellows',
    featuredServices: ['Calculus I-III Diagnostics', 'Latex & Python Data Labs', 'Midterm Exam Cram Clinics', 'Walk-in Whiteboard Sessions']
  },
  {
    id: 'res-writing-center',
    title: 'University Writing Center',
    category: 'academic',
    shortDescription: 'Consultations on academic research papers, thesis drafts, creative writing, and graduate school statements.',
    detailedOverview: 'Collaborate with trained peer and graduate writing coaches at any stage of your writing process—from brainstorming thesis statements to structuring citations (APA, MLA, Chicago).',
    building: 'Alden Memorial Library',
    room: '1st Floor, Commons Suite 112',
    hours: 'Mon-Fri: 8:30 AM - 7:00 PM | Sat: 11:00 AM - 4:00 PM',
    phone: '(555) 839-WRITE',
    email: 'writingcenter@apex.edu',
    website: 'https://apex.edu/writing',
    is24x7Urgent: false,
    virtualAvailable: true,
    tags: ['OneOnOne', 'VirtualAvailable', 'ResearchAssistance', 'AllMajors'],
    staffLead: 'Prof. Clara Higgins',
    featuredServices: ['Thesis & Outline Critiques', 'Grammar & Tone Coaching', 'Citation Formatting Clinics', 'English as Second Language (ESL) Support']
  },
  {
    id: 'res-caps-counseling',
    title: 'Counseling & Psychological Services (CAPS)',
    category: 'counseling',
    shortDescription: 'Confidential individual counseling, group therapy workshops, stress management, and psychiatric evaluations.',
    detailedOverview: 'CAPS provides compassionate mental healthcare staffed by licensed psychologists, clinical social workers, and psychiatrists. All enrolled students receive up to 10 complimentary individual sessions per academic year with no insurance copay.',
    building: 'Health & Wellness Pavilion',
    room: 'Suite 302',
    hours: 'Mon-Fri: 8:00 AM - 5:00 PM (24/7 on-call triage line)',
    phone: '(555) 839-CAPS',
    email: 'wellness.caps@apex.edu',
    website: 'https://apex.edu/caps',
    is24x7Urgent: true,
    virtualAvailable: true,
    tags: ['Confidential', 'UrgentCare', 'FreeSessions', 'VirtualAvailable'],
    staffLead: 'Dr. Rebecca Sterling, Psy.D.',
    featuredServices: ['Anxiety & Depression Triage', 'Mindfulness & Meditation Pods', 'Support Groups (First-Gen, LGBTQ+)', 'Crisis Intervention']
  },
  {
    id: 'res-crisis-hotline',
    title: '24/7 Campus Crisis & Emotional Support Line',
    category: 'counseling',
    shortDescription: 'Immediate 24-hour phone line for students, faculty, or staff facing acute emotional crisis, panic, or urgent trauma.',
    detailedOverview: 'Always active, confidential crisis dispatch connecting directly to certified psychiatric counselors and immediate campus safety escorts if required. If you or a peer are experiencing distress, reach out without hesitation.',
    building: 'Health & Wellness Pavilion (Dispatch Hub)',
    room: 'Emergency Center 100',
    hours: '24 Hours / 7 Days a Week / 365 Days a Year',
    phone: '(555) 839-CARE (Direct 24/7)',
    email: 'urgentcare@apex.edu',
    website: 'https://apex.edu/crisis24',
    is24x7Urgent: true,
    virtualAvailable: true,
    tags: ['24x7Support', 'UrgentCare', 'Confidential', 'ImmediateDispatch'],
    staffLead: 'Campus Crisis Intervention Response Team',
    featuredServices: ['Immediate Suicide Prevention Triage', 'After-Hours Safety Housing', 'Confidential De-escalation', 'Mobile Wellness Dispatch']
  },
  {
    id: 'res-financial-aid',
    title: 'Office of Scholarships & Financial Aid',
    category: 'financial',
    shortDescription: 'FAFSA counseling, merit scholarship maintenance, federal work-study matching, and tuition installment plans.',
    detailedOverview: 'Financial counselors assist with completing state and federal aid filings, understanding loan disclosure statements, appealing aid adjustments due to family hardship, and accessing university endowments.',
    building: 'Student Services Center',
    room: 'Ground Floor, Concourse Hall B',
    hours: 'Mon-Fri: 8:30 AM - 4:30 PM',
    phone: '(555) 839-FAID',
    email: 'finaid@apex.edu',
    website: 'https://apex.edu/finaid',
    is24x7Urgent: false,
    virtualAvailable: true,
    tags: ['FAFSA', 'Scholarships', 'WorkStudy', 'FinancialAdvising'],
    staffLead: 'Marcus Alvarez, Director of Aid',
    featuredServices: ['Special Circumstance Appeals', 'Work-Study Placement Concierge', 'Student Loan Exit Counseling', 'SAP Appeal Reviews']
  },
  {
    id: 'res-emergency-grant',
    title: 'Student Emergency Micro-Grant Fund',
    category: 'financial',
    shortDescription: 'One-time, non-repayable grants up to $1,000 for students facing sudden medical emergencies, food insecurity, or eviction.',
    detailedOverview: 'Administered under the Vice Chancellor of Student Affairs, emergency grants are reviewed within 48 business hours to keep vulnerable students enrolled during unforeseen catastrophic life events.',
    building: 'Student Services Center',
    room: 'Suite 210',
    hours: 'Online Applications Monitored 7 Days a Week',
    phone: '(555) 839-GRANT',
    email: 'emergencygrants@apex.edu',
    website: 'https://apex.edu/emergency-grant',
    is24x7Urgent: true,
    virtualAvailable: true,
    tags: ['GrantFunded', 'FastApproval', 'NoRepayment', 'EmergencyRelief'],
    staffLead: 'Student Care Committee',
    featuredServices: ['Rapid Direct Deposit Relief', 'Textbook & Lab Kit Vouchers', 'Emergency Grocery Gift Cards', 'Medical Bill Relief']
  },
  {
    id: 'res-career-center',
    title: 'Hendrickson Center for Career Development',
    category: 'career',
    shortDescription: 'Internship placement, resume & LinkedIn reviews, on-campus recruiting interviews, and alumni networking events.',
    detailedOverview: 'Connect with over 600 top employers recruiting for engineering, business, healthcare, and arts disciplines. Includes professional headshot photo booths, wardrobe loaner closets for interviews, and career counseling.',
    building: 'Hendrickson Hall',
    room: '4th Floor Executive Suite',
    hours: 'Mon-Fri: 9:00 AM - 5:00 PM | Walk-in Resumes: 1:00 PM - 3:00 PM Daily',
    phone: '(555) 839-JOBS',
    email: 'careers@apex.edu',
    website: 'https://apex.edu/careers',
    is24x7Urgent: false,
    virtualAvailable: true,
    tags: ['ResumeCheck', 'Interviews', 'Internships', 'AlumniNetwork'],
    staffLead: 'Denise Washington, Head of Industry Relations',
    featuredServices: ['AI & Technical Interview Prep', 'On-Campus Recruiting Portal', 'Suit & Blazer Wardrobe Lending', 'Free Professional Headshots']
  },
  {
    id: 'res-housing-reslife',
    title: 'Campus Housing & Residential Life',
    category: 'housing',
    shortDescription: 'Dormitory room assignments, resident advisor contacts, room change appeals, and maintenance emergency requests.',
    detailedOverview: 'Oversees 14 undergraduate residence halls and 3 graduate apartment villages. Our residential coordinators offer roommate dispute mediation, community programming, and quiet study room reservations.',
    building: 'Evergreen Commons',
    room: 'Main Office 101',
    hours: 'Mon-Fri: 8:00 AM - 6:00 PM | Duty RA on call 24/7',
    phone: '(555) 839-ROOM',
    email: 'reslife@apex.edu',
    website: 'https://apex.edu/housing',
    is24x7Urgent: false,
    virtualAvailable: false,
    tags: ['Dorms', 'RoommateMediation', 'MoveIn', 'Maintenance'],
    staffLead: 'Kevin O’Connor, Housing Operations',
    featuredServices: ['Room Swap Exchanges', 'Lockout Key Re-Issuance', 'Dining Hall Meal Plan Rebalancing', 'Quiet Study Lounge Access']
  },
  {
    id: 'res-commuter-lounge',
    title: 'Commuter Student & Off-Campus Hub',
    category: 'housing',
    shortDescription: 'Dedicated day-lounge with day-use lockers, charging bars, full kitchenettes, quiet nap pods, and carpool boards.',
    detailedOverview: 'A haven for non-residential students. Features high-speed Wi-Fi, refrigerators, microwaves, free hot coffee, printing stations, and transit pass discount validation.',
    building: 'Campus Center',
    room: 'Level 2, North Wing',
    hours: 'Mon-Fri: 6:30 AM - 10:00 PM | Weekends: 8:00 AM - 8:00 PM',
    phone: '(555) 839-COMMUTE',
    email: 'commuters@apex.edu',
    website: 'https://apex.edu/commuters',
    is24x7Urgent: false,
    virtualAvailable: false,
    tags: ['FreeCoffee', 'Lockers', 'NapPods', 'TransitPass'],
    staffLead: 'Sarah Lindqvist, Commuter Affairs',
    featuredServices: ['Free Day Lockers', 'Subsidized Metro Passes', 'Microwave & Kitchen Station', 'Campus Carpool Matchmaking']
  },
  {
    id: 'res-it-helpdesk',
    title: 'University IT Service Desk & Loaner Depot',
    category: 'it',
    shortDescription: 'Technical troubleshooting, Mac/Windows hardware loaner laptops, campus Wi-Fi authentication, and software keys.',
    detailedOverview: 'Get assistance with multi-factor authentication (Duo), canvas LMS access, MATLAB/Adobe student licenses, and malware removal. Also offers semester-long loaner laptops for students whose computers are broken or in repair.',
    building: 'Turing Technology Hall',
    room: 'Room 105 (Adjacent to Cyber Cafe)',
    hours: 'Mon-Fri: 7:30 AM - 9:00 PM | Sat-Sun: 10:00 AM - 6:00 PM',
    phone: '(555) 839-TECH',
    email: 'ithelpdesk@apex.edu',
    website: 'https://apex.edu/it',
    is24x7Urgent: false,
    virtualAvailable: true,
    tags: ['LoanerLaptops', 'SoftwareKeys', 'FreeRepairs', 'WiFiSupport'],
    staffLead: 'Alex Chen & Student IT Specialists',
    featuredServices: ['Free Hardware Loaners (Mac/Dell)', 'Adobe Creative Cloud Licenses', 'Virus & Spyware Cleanups', 'Duo 2FA Account Recovery']
  },
  {
    id: 'res-accessibility',
    title: 'Student Accessibility & Disability Services',
    category: 'academic',
    shortDescription: 'Academic exam accommodations, peer note-takers, assistive software licenses, and physical mobility transport.',
    detailedOverview: 'Dedicated to ensuring equal educational access. The office works collaboratively with faculty to coordinate testing arrangements in distraction-reduced environments, braille materials, and ergonomic furniture.',
    building: 'Bancroft Hall',
    room: 'Ground Floor, Accessible Suite 108',
    hours: 'Mon-Fri: 8:30 AM - 5:00 PM',
    phone: '(555) 839-ACCESS',
    email: 'accessibility@apex.edu',
    website: 'https://apex.edu/accessibility',
    is24x7Urgent: false,
    virtualAvailable: true,
    tags: ['Accommodations', 'ExamProctoring', 'AssistiveTech', 'Confidential'],
    staffLead: 'Dr. Gregory Barnes',
    featuredServices: ['Distraction-Reduced Testing Rooms', 'Smartpen & Note-taking Software', 'Deaf & Hard of Hearing Interpreters', 'Campus Cart Mobility Rides']
  },
  {
    id: 'res-food-pantry',
    title: 'The Campus Cupboard & Basic Needs Pantry',
    category: 'counseling',
    shortDescription: 'Free fresh produce, non-perishable groceries, hygiene supplies, and confidential SNAP benefits application assistance.',
    detailedOverview: 'No questions asked, confidential pantry open to all active students, faculty, and campus staff. Stocked twice weekly through partnerships with regional organic food banks.',
    building: 'St. Jude Hall Annex',
    room: 'Basement Suite B-12',
    hours: 'Mon-Sat: 10:00 AM - 7:00 PM',
    phone: '(555) 839-FOOD',
    email: 'cupboard@apex.edu',
    website: 'https://apex.edu/cupboard',
    is24x7Urgent: false,
    virtualAvailable: false,
    tags: ['FreeGroceries', 'HygieneKits', 'Confidential', 'NoQuestionsAsked'],
    staffLead: 'Pantry Volunteer Guild',
    featuredServices: ['Weekly Fresh Produce Bags', 'Personal Care & Hygiene Essentials', 'Winter Coat & Blanket Drive', 'SNAP Enrollment Assistance']
  }
];

const INITIAL_APPOINTMENTS: Appointment[] = [
  {
    id: 'apt-101',
    resourceId: 'res-math-lab',
    resourceTitle: 'Math & Quantitative Reasoning Lab',
    date: '2027-03-12',
    timeSlot: '02:00 PM - 02:45 PM',
    deliveryMode: 'In-Person',
    topic: 'Differential Equations Fourier Series & Exam 2 Prep',
    attendeeName: 'Maya Chen',
    attendeeRole: 'student',
    providerStaff: 'Dr. Sanjay Patel',
    status: 'Confirmed',
    locationNote: 'Euler Hall 204, Table 3',
    createdDate: '2027-03-08'
  },
  {
    id: 'apt-102',
    resourceId: 'res-writing-center',
    resourceTitle: 'University Writing Center',
    date: '2027-03-15',
    timeSlot: '11:00 AM - 11:45 AM',
    deliveryMode: 'Virtual (Zoom)',
    topic: 'Reviewing Senior Capstone Literature Review Draft',
    attendeeName: 'Maya Chen',
    attendeeRole: 'student',
    providerStaff: 'Prof. Clara Higgins',
    status: 'Confirmed',
    locationNote: 'Zoom Link: apex.zoom.us/j/992817263',
    createdDate: '2027-03-09'
  },
  {
    id: 'apt-103',
    resourceId: 'res-career-center',
    resourceTitle: 'Hendrickson Center for Career Development',
    date: '2027-03-19',
    timeSlot: '03:30 PM - 04:15 PM',
    deliveryMode: 'In-Person',
    topic: 'Summer Software Engineering Internship Mock Interview',
    attendeeName: 'Maya Chen',
    attendeeRole: 'student',
    providerStaff: 'Denise Washington',
    status: 'Pending',
    locationNote: 'Hendrickson Hall, Suite 402',
    createdDate: '2027-03-10'
  }
];

const INITIAL_DOCUMENTS: DocumentItem[] = [
  {
    id: 'doc-01',
    title: 'Drop/Add Course Adjustment Waiver Form',
    category: 'Academic & Registration',
    fileFormat: 'PDF',
    fileSize: '240 KB',
    updatedDate: 'Feb 14, 2027',
    allowedRoles: ['student', 'advisor', 'faculty', 'admin'],
    downloadCount: 1420,
    description: 'Required for students requesting late course withdrawal or section transfers past the official census date.'
  },
  {
    id: 'doc-02',
    title: 'Undergraduate Grade Appeal Formal Petition',
    category: 'Academic & Registration',
    fileFormat: 'PDF',
    fileSize: '512 KB',
    updatedDate: 'Jan 10, 2027',
    allowedRoles: ['student', 'faculty', 'advisor', 'admin'],
    downloadCount: 388,
    description: 'Procedure and official statement packet for petitioning arbitrary or capricious grading decisions.'
  },
  {
    id: 'doc-03',
    title: 'Student Emergency Micro-Grant Fund Application',
    category: 'Financial & Grants',
    fileFormat: 'PDF',
    fileSize: '360 KB',
    updatedDate: 'Mar 01, 2027',
    allowedRoles: ['student', 'advisor', 'admin'],
    downloadCount: 712,
    description: 'Confidential application for unforeseen medical, housing, or urgent living expense non-repayable grants.'
  },
  {
    id: 'doc-04',
    title: 'Degree Audit Exception & Course Substitution Waiver',
    category: 'Advising & Exceptions',
    fileFormat: 'DOCX',
    fileSize: '410 KB',
    updatedDate: 'Feb 20, 2027',
    allowedRoles: ['advisor', 'faculty', 'admin'],
    downloadCount: 890,
    description: 'Advisor-submitted approval form for transferring equivalent elective credits into general education requirements.'
  },
  {
    id: 'doc-05',
    title: 'Academic Probation Recovery & Success Contract',
    category: 'Advising & Exceptions',
    fileFormat: 'DOCX',
    fileSize: '315 KB',
    updatedDate: 'Feb 02, 2027',
    allowedRoles: ['advisor', 'student', 'admin'],
    downloadCount: 245,
    description: 'Structured academic improvement agreement establishing bi-weekly milestone check-ins with an advisor.'
  },
  {
    id: 'doc-06',
    title: 'Official Faculty Syllabus Template & Compliance Checklist',
    category: 'Faculty Policies',
    fileFormat: 'DOCX',
    fileSize: '1.2 MB',
    updatedDate: 'Jan 05, 2027',
    allowedRoles: ['faculty', 'admin'],
    downloadCount: 654,
    description: 'Standard university syllabus structure including mandatory Title IX, accessibility, and AI academic integrity clauses.'
  },
  {
    id: 'doc-07',
    title: 'Grade Change & Incomplete Coursework Resolution Protocol',
    category: 'Faculty Policies',
    fileFormat: 'PDF',
    fileSize: '290 KB',
    updatedDate: 'Dec 18, 2026',
    allowedRoles: ['faculty', 'advisor', 'admin'],
    downloadCount: 410,
    description: 'Instructions and authorization form for resolving temporary "I" grades and submitting instructor corrections.'
  },
  {
    id: 'doc-08',
    title: 'Faculty Research Travel & Per Diem Requisition Matrix',
    category: 'Faculty Policies',
    fileFormat: 'XLSX',
    fileSize: '680 KB',
    updatedDate: 'Feb 11, 2027',
    allowedRoles: ['faculty', 'admin'],
    downloadCount: 520,
    description: 'Travel expense budget estimation spreadsheet for attending national academic colloquia and symposia.'
  },
  {
    id: 'doc-09',
    title: 'Campus Emergency Protocol & Critical Evacuation Blueprint',
    category: 'Campus Safety',
    fileFormat: 'PDF',
    fileSize: '4.8 MB',
    updatedDate: 'Jan 28, 2027',
    allowedRoles: ['student', 'faculty', 'advisor', 'admin'],
    downloadCount: 3100,
    description: 'Comprehensive disaster readiness, severe weather sheltering, and active intruder response procedures.'
  },
  {
    id: 'doc-10',
    title: 'FERPA Educational Records Consent Release Form',
    category: 'Advising & Exceptions',
    fileFormat: 'PDF',
    fileSize: '185 KB',
    updatedDate: 'Jan 15, 2027',
    allowedRoles: ['student', 'advisor', 'faculty', 'admin'],
    downloadCount: 2240,
    description: 'Consent authorization allowing specified third parties or guardians to discuss academic standing and billing.'
  },
  {
    id: 'doc-11',
    title: 'Campus Security Incident & Clery Act Audit Log (Annual)',
    category: 'Campus Safety',
    fileFormat: 'PDF',
    fileSize: '2.4 MB',
    updatedDate: 'Nov 30, 2026',
    allowedRoles: ['admin', 'faculty'],
    downloadCount: 390,
    description: 'Annual statutory security statistics, safety protocols, and emergency notification network verification.'
  },
  {
    id: 'doc-12',
    title: 'Student Organization Annual Budget Allocation Ledger',
    category: 'Financial & Grants',
    fileFormat: 'XLSX',
    fileSize: '890 KB',
    updatedDate: 'Feb 26, 2027',
    allowedRoles: ['student', 'admin'],
    downloadCount: 820,
    description: 'Official budget tracking template for recognized campus student associations and Greek societies.'
  }
];

export default function App() {
  // --- APPLICATION STATE ---
  const [activeRole, setActiveRole] = useState<UserRole>('student');
  const [activeTab, setActiveTab] = useState<'catalog' | 'appointments' | 'documents' | 'saved' | 'emergency'>('catalog');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [urgentOnly, setUrgentOnly] = useState<boolean>(false);
  const [activeTagFilter, setActiveTagFilter] = useState<string | null>(null);

  // Resources state with initial seed + bookmarks
  const [resources, setResources] = useState<UniversityResource[]>(INITIAL_RESOURCES);
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('apex_bookmarked_resources');
      return saved ? JSON.parse(saved) : ['res-math-lab', 'res-writing-center', 'res-it-helpdesk'];
    } catch {
      return ['res-math-lab', 'res-writing-center', 'res-it-helpdesk'];
    }
  });

  // Appointments state
  const [appointments, setAppointments] = useState<Appointment[]>(INITIAL_APPOINTMENTS);

  // Modals state
  const [selectedResourceForDetail, setSelectedResourceForDetail] = useState<UniversityResource | null>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState<boolean>(false);
  const [bookingTargetResource, setBookingTargetResource] = useState<UniversityResource | null>(null);
  const [isAddResourceModalOpen, setIsAddResourceModalOpen] = useState<boolean>(false);
  const [isEmergencyModalOpen, setIsEmergencyModalOpen] = useState<boolean>(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  // Booking form state
  const [bookingDate, setBookingDate] = useState<string>('2027-03-23');
  const [bookingTime, setBookingTime] = useState<string>('10:00 AM');
  const [bookingMode, setBookingMode] = useState<'In-Person' | 'Virtual (Zoom)'>('In-Person');
  const [bookingTopic, setBookingTopic] = useState<string>('');

  // New Resource Form state (Admin/Faculty)
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<ResourceCategory>('academic');
  const [newShortDesc, setNewShortDesc] = useState('');
  const [newDetailed, setNewDetailed] = useState('');
  const [newBuilding, setNewBuilding] = useState('');
  const [newRoom, setNewRoom] = useState('');
  const [newHours, setNewHours] = useState('Mon-Fri: 9:00 AM - 5:00 PM');
  const [newPhone, setNewPhone] = useState('(555) 839-0000');
  const [newEmail, setNewEmail] = useState('');
  const [newTags, setNewTags] = useState('WalkInWelcome, StudentSupport');
  const [newIsUrgent, setNewIsUrgent] = useState(false);
  const [newIsVirtual, setNewIsVirtual] = useState(true);

  // Documents search & category filter
  const [docSearchQuery, setDocSearchQuery] = useState('');
  const [docCategoryFilter, setDocCategoryFilter] = useState('All');

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Sync bookmarks to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('apex_bookmarked_resources', JSON.stringify(bookmarkedIds));
    } catch {
      // ignore in iframe storage quota edge cases
    }
  }, [bookmarkedIds]);

  const addToast = (type: 'success' | 'info' | 'warning' | 'error', title: string, message: string) => {
    const id = 'toast-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4);
    setToasts((prev) => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const toggleBookmark = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setBookmarkedIds((prev) => {
      const isBookmarked = prev.includes(id);
      const resItem = resources.find((r) => r.id === id);
      const title = resItem ? resItem.title : 'Resource';
      if (isBookmarked) {
        addToast('info', 'Bookmark Removed', `"${title}" has been removed from your saved resources.`);
        return prev.filter((itemId) => itemId !== id);
      } else {
        addToast('success', 'Bookmark Saved', `"${title}" is now pinned in your saved resources.`);
        return [...prev, id];
      }
    });
  };

  // Switch role helper
  const handleRoleSwitch = (role: UserRole) => {
    setActiveRole(role);
    const profile = ROLE_PROFILES[role];
    addToast('info', `Switched Role to ${profile.role.toUpperCase()}`, `Logged in as ${profile.name} (${profile.title}). Dashboard metrics and access permissions updated.`);
  };

  // Open booking modal
  const openBookingModal = (res?: UniversityResource) => {
    const target = res || resources[0];
    setBookingTargetResource(target);
    setBookingTopic('');
    setIsBookingModalOpen(true);
  };

  // Submit booking
  const handleConfirmBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingTargetResource) return;

    const currentUser = ROLE_PROFILES[activeRole];
    const newApt: Appointment = {
      id: 'apt-' + Date.now(),
      resourceId: bookingTargetResource.id,
      resourceTitle: bookingTargetResource.title,
      date: bookingDate,
      timeSlot: `${bookingTime} - ${bookingTime.startsWith('12') ? '12:45 PM' : '45 min session'}`,
      deliveryMode: bookingMode,
      topic: bookingTopic.trim() || 'General Academic Advising & Support Consultation',
      attendeeName: currentUser.name,
      attendeeRole: activeRole,
      providerStaff: bookingTargetResource.staffLead || 'Staff Advisor on Duty',
      status: 'Confirmed',
      locationNote: bookingMode === 'In-Person' ? `${bookingTargetResource.building}, ${bookingTargetResource.room}` : 'Secured Zoom Video Conference (Room ID provided in confirmation email)',
      createdDate: new Date().toISOString().split('T')[0]
    };

    setAppointments((prev) => [newApt, ...prev]);
    setIsBookingModalOpen(false);
    addToast(
      'success',
      'Appointment Confirmed!',
      `Scheduled with ${bookingTargetResource.title} for ${bookingDate} at ${bookingTime} (${bookingMode}). Added to your calendar.`
    );
    setActiveTab('appointments');
  };

  // Cancel appointment
  const handleCancelAppointment = (id: string, title: string) => {
    setAppointments((prev) => prev.filter((apt) => apt.id !== id));
    addToast('warning', 'Session Cancelled', `Your consultation with ${title} has been removed.`);
  };

  // Download document simulation
  const handleDownloadDocument = (doc: DocumentItem) => {
    const isAllowed = doc.allowedRoles.includes(activeRole);
    if (!isAllowed) {
      addToast(
        'error',
        'Access Restricted (FERPA / Role Clearance)',
        `This official document requires ${doc.allowedRoles.map((r) => r.toUpperCase()).join(' or ')} credentials. Your current profile (${activeRole.toUpperCase()}) cannot access this file.`
      );
      return;
    }

    addToast(
      'info',
      'Preparing Official Document...',
      `Generating authenticated copy of "${doc.title}.${doc.fileFormat.toLowerCase()}" (${doc.fileSize})...`
    );

    setTimeout(() => {
      // Simulate download prompt
      const dummyContent = `APEX UNIVERSITY OFFICIAL DOCUMENT\nTitle: ${doc.title}\nCategory: ${doc.category}\nAuthorized User: ${ROLE_PROFILES[activeRole].name} (${activeRole.toUpperCase()})\nTimestamp: ${new Date().toLocaleString()}\nVerification ID: ${Math.random().toString(36).substring(2, 10).toUpperCase()}\n\n-- CONFIDENTIAL ACADEMIC RECORD --`;
      const blob = new Blob([dummyContent], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${doc.title.replace(/[^a-zA-Z0-9]/g, '_')}.${doc.fileFormat.toLowerCase()}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      addToast('success', 'Download Complete', `"${doc.title}" downloaded successfully.`);
    }, 900);
  };

  // Create new Resource handler
  const handleCreateResource = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newShortDesc.trim() || !newBuilding.trim()) {
      addToast('error', 'Missing Information', 'Please provide a title, short description, and campus location.');
      return;
    }

    const tagArray = newTags
      .split(',')
      .map((t) => t.trim().replace(/^#/, ''))
      .filter(Boolean);

    const createdRes: UniversityResource = {
      id: 'res-custom-' + Date.now(),
      title: newTitle.trim(),
      category: newCategory,
      shortDescription: newShortDesc.trim(),
      detailedOverview: newDetailed.trim() || newShortDesc.trim(),
      building: newBuilding.trim(),
      room: newRoom.trim() || 'Main Suite',
      hours: newHours.trim() || 'Mon-Fri: 9:00 AM - 5:00 PM',
      phone: newPhone.trim() || '(555) 839-0000',
      email: newEmail.trim() || `${newTitle.toLowerCase().replace(/\s+/g, '')}@apex.edu`,
      website: 'https://apex.edu/services/' + newTitle.toLowerCase().replace(/\s+/g, '-'),
      is24x7Urgent: newIsUrgent,
      virtualAvailable: newIsVirtual,
      tags: tagArray.length > 0 ? tagArray : ['CampusService', 'Verified'],
      staffLead: `${ROLE_PROFILES[activeRole].name} (${ROLE_PROFILES[activeRole].title})`,
      featuredServices: ['Walk-in Consultations', 'Student Intake', 'Digital Resource Library'],
      customCreated: true
    };

    setResources((prev) => [createdRes, ...prev]);
    setIsAddResourceModalOpen(false);

    // Reset fields
    setNewTitle('');
    setNewShortDesc('');
    setNewDetailed('');
    setNewBuilding('');
    setNewRoom('');

    addToast('success', 'Resource Published to Directory', `"${createdRes.title}" is now live on the University Resource Hub.`);
  };

  // Filtered resources for Catalog
  const filteredResources = useMemo(() => {
    return resources.filter((res) => {
      // Urgent filter
      if (urgentOnly && !res.is24x7Urgent) return false;

      // Category filter
      if (selectedCategory !== 'all' && res.category !== selectedCategory) return false;

      // Tag filter
      if (activeTagFilter && !res.tags.includes(activeTagFilter)) return false;

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchTitle = res.title.toLowerCase().includes(q);
        const matchDesc = res.shortDescription.toLowerCase().includes(q) || res.detailedOverview.toLowerCase().includes(q);
        const matchBuilding = res.building.toLowerCase().includes(q) || res.room.toLowerCase().includes(q);
        const matchTags = res.tags.some((t) => t.toLowerCase().includes(q));
        const matchLead = res.staffLead.toLowerCase().includes(q);
        if (!matchTitle && !matchDesc && !matchBuilding && !matchTags && !matchLead) {
          return false;
        }
      }

      return true;
    });
  }, [resources, urgentOnly, selectedCategory, activeTagFilter, searchQuery]);

  // Bookmarked items list
  const savedResourcesList = useMemo(() => {
    return resources.filter((r) => bookmarkedIds.includes(r.id));
  }, [resources, bookmarkedIds]);

  // Filtered documents
  const filteredDocuments = useMemo(() => {
    return INITIAL_DOCUMENTS.filter((doc) => {
      if (docCategoryFilter !== 'All' && doc.category !== docCategoryFilter) {
        return false;
      }
      if (docSearchQuery.trim()) {
        const q = docSearchQuery.toLowerCase().trim();
        const matchTitle = doc.title.toLowerCase().includes(q);
        const matchDesc = doc.description.toLowerCase().includes(q);
        const matchCat = doc.category.toLowerCase().includes(q);
        if (!matchTitle && !matchDesc && !matchCat) return false;
      }
      return true;
    });
  }, [docCategoryFilter, docSearchQuery]);

  // Available unique tags across all resources
  const allUniqueTags = useMemo(() => {
    const tagSet = new Set<string>();
    resources.forEach((r) => r.tags.forEach((t) => tagSet.add(t)));
    return Array.from(tagSet);
  }, [resources]);

  const activeUserProfile = ROLE_PROFILES[activeRole];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* --- TOP INSTITUTIONAL BAR --- */}
      <header className="bg-slate-900 text-slate-100 border-b border-blue-900/50 sticky top-0 z-40 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-18">
            {/* Left: University Brand & Crest */}
            <div className="flex items-center space-x-3.5">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 focus:outline-none"
                aria-label="Toggle Navigation"
              >
                <Menu className="w-6 h-6" />
              </button>

              <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('catalog')}>
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-500 via-amber-600 to-amber-700 flex items-center justify-center text-slate-950 shadow-md shadow-amber-900/30 border border-amber-300/40">
                  <GraduationCap className="w-6 h-6 text-slate-950 stroke-[2.2]" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-academic text-xl font-bold tracking-wider text-white">APEX</span>
                    <span className="text-xs uppercase tracking-widest font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40">
                      University
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 font-medium tracking-tight">Academic Resource & Support Hub</p>
                </div>
              </div>
            </div>

            {/* Center: Live Semester status */}
            <div className="hidden lg:flex items-center space-x-3 text-xs text-slate-300 bg-slate-800/80 px-3.5 py-1.5 rounded-full border border-slate-700/80">
              <span className="inline-flex w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="font-medium text-slate-200">Spring Term 2027</span>
              <span className="text-slate-500">•</span>
              <span>Week 9: Midterm Advising & Finals Prep</span>
            </div>

            {/* Right: Urgent 24/7 Hotline Trigger & Role Switcher */}
            <div className="flex items-center space-x-3">
              {/* Emergency Hotline Trigger */}
              <button
                type="button"
                onClick={() => setIsEmergencyModalOpen(true)}
                className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-rose-950/70 text-rose-200 border border-rose-700/50 hover:bg-rose-900/80 hover:text-rose-100 transition-all shadow-sm group"
                title="View 24/7 Campus Emergency Lines"
              >
                <ShieldAlert className="w-4 h-4 text-rose-400 group-hover:animate-bounce" />
                <span className="hidden sm:inline">24/7 Crisis Hotline</span>
                <span className="sm:hidden">24/7</span>
              </button>

              {/* Role Switcher Dropdown & Badge */}
              <div className="relative group">
                <div className="flex items-center space-x-2 pl-2 pr-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 hover:border-amber-500/50 transition cursor-pointer">
                  <img
                    src={activeUserProfile.avatar}
                    alt={activeUserProfile.name}
                    className="w-7 h-7 rounded-full object-cover ring-2 ring-amber-500/60"
                  />
                  <div className="text-left hidden sm:block">
                    <p className="text-xs font-bold text-slate-100 leading-none">{activeUserProfile.name}</p>
                    <p className="text-[10px] text-amber-400 capitalize font-medium">{activeUserProfile.role} Mode</p>
                  </div>
                  <UserCheck className="w-3.5 h-3.5 text-amber-400 ml-1" />
                </div>

                {/* Role Switcher Menu */}
                <div className="absolute right-0 mt-1 w-64 bg-slate-900 rounded-xl shadow-2xl border border-slate-700 py-2 hidden group-hover:block hover:block z-50">
                  <div className="px-3 py-2 border-b border-slate-800 text-[11px] uppercase tracking-wider text-slate-400 font-semibold">
                    Switch Active Persona & Access
                  </div>
                  {(['student', 'faculty', 'advisor', 'admin'] as UserRole[]).map((roleKey) => {
                    const prof = ROLE_PROFILES[roleKey];
                    const isSelected = activeRole === roleKey;
                    return (
                      <button
                        key={roleKey}
                        type="button"
                        onClick={() => handleRoleSwitch(roleKey)}
                        className={`w-full px-3 py-2 text-left flex items-center space-x-3 transition-colors ${
                          isSelected ? 'bg-amber-500/15 text-amber-300 font-bold' : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                        }`}
                      >
                        <img src={prof.avatar} alt={prof.name} className="w-7 h-7 rounded-full object-cover border border-slate-600" />
                        <div className="overflow-hidden">
                          <p className="text-xs truncate">{prof.name}</p>
                          <p className="text-[10px] text-slate-400 capitalize">{prof.role} • {prof.department.split('&')[0]}</p>
                        </div>
                        {isSelected && <Check className="w-4 h-4 ml-auto text-amber-400" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* --- ROLE BANNER / ANNOUNCEMENT --- */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white border-b border-slate-800 px-4 py-3 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center space-x-3">
            <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
              <Shield className="w-4 h-4" />
            </span>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                  {activeUserProfile.role} Workspace
                </span>
                <span className="text-xs text-slate-400">•</span>
                <span className="text-xs text-slate-300">{activeUserProfile.badge}</span>
              </div>
              <p className="text-sm font-semibold text-slate-100">
                Welcome back, {activeUserProfile.name} <span className="text-slate-400 font-normal">({activeUserProfile.department})</span>
              </p>
            </div>
          </div>

          {/* Quick Context Actions based on Role */}
          <div className="flex items-center flex-wrap gap-2">
            {activeRole === 'student' && (
              <>
                <button
                  type="button"
                  onClick={() => openBookingModal()}
                  className="px-3 py-1.5 text-xs font-medium rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 transition font-semibold shadow-sm flex items-center space-x-1.5"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Schedule Consultation</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const microDoc = INITIAL_DOCUMENTS.find((d) => d.id === 'doc-03');
                    if (microDoc) handleDownloadDocument(microDoc);
                  }}
                  className="px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition flex items-center space-x-1.5"
                >
                  <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Micro-Grant Form</span>
                </button>
              </>
            )}

            {activeRole === 'faculty' && (
              <>
                <button
                  type="button"
                  onClick={() => setIsAddResourceModalOpen(true)}
                  className="px-3 py-1.5 text-xs font-medium rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 transition font-semibold shadow-sm flex items-center space-x-1.5"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>Register Department Resource</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const syl = INITIAL_DOCUMENTS.find((d) => d.id === 'doc-06');
                    if (syl) handleDownloadDocument(syl);
                  }}
                  className="px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition flex items-center space-x-1.5"
                >
                  <FileText className="w-3.5 h-3.5 text-blue-400" />
                  <span>Syllabus Master 2027</span>
                </button>
              </>
            )}

            {activeRole === 'advisor' && (
              <>
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('appointments');
                    addToast('info', 'Advisee Roster', 'Showing your scheduled student consultation queue.');
                  }}
                  className="px-3 py-1.5 text-xs font-medium rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 transition font-semibold shadow-sm flex items-center space-x-1.5"
                >
                  <CalendarCheck className="w-3.5 h-3.5" />
                  <span>View Advisee Appointments ({appointments.length})</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const auditDoc = INITIAL_DOCUMENTS.find((d) => d.id === 'doc-04');
                    if (auditDoc) handleDownloadDocument(auditDoc);
                  }}
                  className="px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition flex items-center space-x-1.5"
                >
                  <FileCheck2 className="w-3.5 h-3.5 text-amber-400" />
                  <span>Degree Exception Form</span>
                </button>
              </>
            )}

            {activeRole === 'admin' && (
              <>
                <button
                  type="button"
                  onClick={() => setIsAddResourceModalOpen(true)}
                  className="px-3 py-1.5 text-xs font-medium rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 transition font-semibold shadow-sm flex items-center space-x-1.5"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>+ Add New Campus Center</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsEmergencyModalOpen(true)}
                  className="px-3 py-1.5 text-xs font-medium rounded-lg bg-rose-900/60 hover:bg-rose-900 text-rose-200 border border-rose-700/60 transition flex items-center space-x-1.5"
                >
                  <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
                  <span>Audit Crisis Hotlines</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* --- MAIN LAYOUT WITH NAVIGATION TABS --- */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full flex-1">
        {/* Navigation Tabs Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200 pb-3 mb-6 gap-3">
          <div className="flex items-center space-x-1 sm:space-x-2 overflow-x-auto no-scrollbar py-1">
            <button
              type="button"
              onClick={() => setActiveTab('catalog')}
              className={`px-4 py-2 text-sm font-semibold rounded-xl transition flex items-center space-x-2 whitespace-nowrap ${
                activeTab === 'catalog'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Compass className="w-4 h-4 text-amber-400" />
              <span>Resource Catalog</span>
              <span className={`text-xs px-2 py-0.5 rounded-full font-mono ${activeTab === 'catalog' ? 'bg-slate-700 text-amber-300' : 'bg-slate-200 text-slate-700'}`}>
                {resources.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('appointments')}
              className={`px-4 py-2 text-sm font-semibold rounded-xl transition flex items-center space-x-2 whitespace-nowrap ${
                activeTab === 'appointments'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Calendar className="w-4 h-4 text-amber-400" />
              <span>Appointments</span>
              <span className={`text-xs px-2 py-0.5 rounded-full font-mono ${activeTab === 'appointments' ? 'bg-slate-700 text-amber-300' : 'bg-slate-200 text-slate-700'}`}>
                {appointments.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('documents')}
              className={`px-4 py-2 text-sm font-semibold rounded-xl transition flex items-center space-x-2 whitespace-nowrap ${
                activeTab === 'documents'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <FileText className="w-4 h-4 text-amber-400" />
              <span>Document Vault</span>
              <span className={`text-xs px-2 py-0.5 rounded-full font-mono ${activeTab === 'documents' ? 'bg-slate-700 text-amber-300' : 'bg-slate-200 text-slate-700'}`}>
                {INITIAL_DOCUMENTS.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('saved')}
              className={`px-4 py-2 text-sm font-semibold rounded-xl transition flex items-center space-x-2 whitespace-nowrap ${
                activeTab === 'saved'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Bookmark className="w-4 h-4 text-amber-400" />
              <span>Saved Bookmarks</span>
              <span className={`text-xs px-2 py-0.5 rounded-full font-mono ${activeTab === 'saved' ? 'bg-slate-700 text-amber-300' : 'bg-amber-100 text-amber-800'}`}>
                {bookmarkedIds.length}
              </span>
            </button>
          </div>

          {/* Quick Schedule Trigger */}
          <div className="flex items-center space-x-2 self-end sm:self-auto">
            {(activeRole === 'admin' || activeRole === 'faculty') && (
              <button
                type="button"
                onClick={() => setIsAddResourceModalOpen(true)}
                className="px-3.5 py-2 text-xs font-bold rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 transition flex items-center space-x-1.5"
              >
                <PlusCircle className="w-4 h-4 text-amber-600" />
                <span>Publish Resource</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => openBookingModal()}
              className="px-4 py-2 text-xs font-bold rounded-xl bg-gradient-to-r from-blue-900 to-indigo-900 hover:from-blue-800 hover:to-indigo-800 text-white transition flex items-center space-x-2 shadow-sm"
            >
              <CalendarCheck className="w-4 h-4 text-amber-400" />
              <span>Book Appointment</span>
            </button>
          </div>
        </div>

        {/* --- ROLE-BASED DASHBOARD METRIC SUMMARY --- */}
        <section className="mb-6 grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {activeRole === 'student' && (
            <>
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center space-x-3.5">
                <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-medium">Enrolled Coursework</p>
                  <p className="text-xl font-bold text-slate-900">16.0 <span className="text-xs text-slate-400 font-normal">Units</span></p>
                </div>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center space-x-3.5">
                <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-medium">Advising Holds</p>
                  <p className="text-xl font-bold text-emerald-600">Cleared <span className="text-xs text-slate-400 font-normal">for Fall 27</span></p>
                </div>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center space-x-3.5">
                <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-medium">Active Bookings</p>
                  <p className="text-xl font-bold text-slate-900">{appointments.length} <span className="text-xs text-slate-400 font-normal">Scheduled</span></p>
                </div>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center space-x-3.5">
                <div className="w-11 h-11 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center">
                  <Bookmark className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-medium">Saved Resources</p>
                  <p className="text-xl font-bold text-slate-900">{bookmarkedIds.length} <span className="text-xs text-slate-400 font-normal">Pinned</span></p>
                </div>
              </div>
            </>
          )}

          {activeRole === 'faculty' && (
            <>
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center space-x-3.5">
                <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-medium">Office Hours</p>
                  <p className="text-lg font-bold text-slate-900">Tu/Th 2:00-4:30 PM</p>
                </div>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center space-x-3.5">
                <div className="w-11 h-11 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-medium">Undergrad Advisees</p>
                  <p className="text-xl font-bold text-slate-900">28 <span className="text-xs text-slate-400 font-normal">Students</span></p>
                </div>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center space-x-3.5">
                <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-medium">Course Syllabi</p>
                  <p className="text-xl font-bold text-emerald-600">3 Verified</p>
                </div>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center space-x-3.5">
                <div className="w-11 h-11 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-medium">Dept Resources</p>
                  <p className="text-xl font-bold text-slate-900">Bio Lab 310</p>
                </div>
              </div>
            </>
          )}

          {activeRole === 'advisor' && (
            <>
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center space-x-3.5">
                <div className="w-11 h-11 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-medium">Caseload Assigned</p>
                  <p className="text-xl font-bold text-slate-900">142 <span className="text-xs text-slate-400 font-normal">Students</span></p>
                </div>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center space-x-3.5">
                <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
                  <CalendarCheck className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-medium">Scheduled Today</p>
                  <p className="text-xl font-bold text-slate-900">5 <span className="text-xs text-slate-400 font-normal">Consultations</span></p>
                </div>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center space-x-3.5">
                <div className="w-11 h-11 rounded-xl bg-rose-50 text-rose-700 flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-medium">Academic Alerts</p>
                  <p className="text-xl font-bold text-rose-600">3 Priority</p>
                </div>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center space-x-3.5">
                <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                  <FileCheck2 className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-medium">Pending Exceptions</p>
                  <p className="text-xl font-bold text-slate-900">2 In Review</p>
                </div>
              </div>
            </>
          )}

          {activeRole === 'admin' && (
            <>
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center space-x-3.5">
                <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-medium">Campus Centers</p>
                  <p className="text-xl font-bold text-slate-900">{resources.length} <span className="text-xs text-emerald-600 font-normal">Active</span></p>
                </div>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center space-x-3.5">
                <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-medium">Portal Infrastructure</p>
                  <p className="text-xl font-bold text-emerald-600">99.98% <span className="text-xs text-slate-400 font-normal">Uptime</span></p>
                </div>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center space-x-3.5">
                <div className="w-11 h-11 rounded-xl bg-rose-50 text-rose-700 flex items-center justify-center">
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-medium">Emergency Hotlines</p>
                  <p className="text-xl font-bold text-rose-600">4 Active</p>
                </div>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center space-x-3.5">
                <div className="w-11 h-11 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-medium">Official Forms Vault</p>
                  <p className="text-xl font-bold text-slate-900">{INITIAL_DOCUMENTS.length} <span className="text-xs text-slate-400 font-normal">Forms</span></p>
                </div>
              </div>
            </>
          )}
        </section>

        {/* =========================================================================
            TAB 1: RESOURCE CATALOG & DYNAMIC SEARCH/FILTER
           ========================================================================= */}
        {activeTab === 'catalog' && (
          <div className="space-y-6">
            {/* Search and Filters Header */}
            <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <div className="flex flex-col md:flex-row md:items-center gap-3">
                {/* Search Input */}
                <div className="relative flex-1">
                  <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by center name, building, services (e.g. 'calculus', 'caps', 'grants', 'laptop')..."
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent transition placeholder:text-slate-400"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* 24/7 Urgent Only Toggle Switch */}
                <div className="flex items-center space-x-3 bg-slate-50 px-3.5 py-2 rounded-xl border border-slate-200 flex-shrink-0">
                  <div className="flex items-center space-x-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${urgentOnly ? 'bg-rose-500 animate-ping' : 'bg-slate-300'}`}></span>
                    <span className="text-xs font-semibold text-slate-800">24/7 Urgent Support Only</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setUrgentOnly(!urgentOnly)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                      urgentOnly ? 'bg-rose-600' : 'bg-slate-300'
                    }`}
                    role="switch"
                    aria-checked={urgentOnly}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        urgentOnly ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>

              {/* Category Filter Pills */}
              <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar pt-1 pb-1">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCategory('all');
                    setActiveTagFilter(null);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 whitespace-nowrap ${
                    selectedCategory === 'all'
                      ? 'bg-blue-950 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <span>All Centers ({resources.length})</span>
                </button>

                {CATEGORIES_CONFIG.map((cat) => {
                  const Icon = cat.icon;
                  const isSelected = selectedCategory === cat.id;
                  const count = resources.filter((r) => r.category === cat.id).length;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => {
                        setSelectedCategory(cat.id);
                        setActiveTagFilter(null);
                      }}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 whitespace-nowrap ${
                        isSelected
                          ? 'bg-blue-950 text-white shadow-xs'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-amber-400' : 'text-slate-500'}`} />
                      <span>{cat.name}</span>
                      <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isSelected ? 'bg-blue-800 text-amber-300' : 'bg-slate-200 text-slate-600'}`}>
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Quick Tag Filter Row */}
              <div className="flex items-center flex-wrap gap-1.5 pt-2 border-t border-slate-100 text-xs">
                <span className="text-slate-500 font-medium flex items-center space-x-1 mr-1">
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                  <span>Popular Tags:</span>
                </span>
                {allUniqueTags.slice(0, 8).map((tag) => {
                  const isTagActive = activeTagFilter === tag;
                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => setActiveTagFilter(isTagActive ? null : tag)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition ${
                        isTagActive
                          ? 'bg-amber-500 text-slate-950 font-bold shadow-xs'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      #{tag}
                    </button>
                  );
                })}
                {activeTagFilter && (
                  <button
                    type="button"
                    onClick={() => setActiveTagFilter(null)}
                    className="text-[11px] text-rose-600 hover:underline font-semibold ml-2"
                  >
                    Clear tag
                  </button>
                )}
              </div>
            </div>

            {/* Results Counter & Catalog Grid */}
            <div className="flex items-center justify-between text-xs text-slate-500 font-medium px-1">
              <span>Showing <strong className="text-slate-800">{filteredResources.length}</strong> university resources</span>
              {urgentOnly && (
                <span className="text-rose-600 font-semibold flex items-center space-x-1">
                  <ShieldAlert className="w-3.5 h-3.5" />
                  <span>Filtering for Immediate & 24/7 Facilities</span>
                </span>
              )}
            </div>

            {/* Grid */}
            {filteredResources.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-lg mx-auto">
                <HelpCircle className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <h3 className="text-base font-bold text-slate-800">No resources found</h3>
                <p className="text-xs text-slate-500 mt-1 mb-4">
                  No support facilities match your current query "{searchQuery}" or filter options.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('all');
                    setUrgentOnly(false);
                    setActiveTagFilter(null);
                  }}
                  className="px-4 py-2 text-xs font-semibold rounded-xl bg-blue-900 text-white hover:bg-blue-800"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredResources.map((res) => {
                  const isBookmarked = bookmarkedIds.includes(res.id);
                  const catConfig = CATEGORIES_CONFIG.find((c) => c.id === res.category);
                  const Icon = catConfig?.icon || BookOpen;

                  return (
                    <div
                      key={res.id}
                      className="bg-white rounded-2xl border border-slate-200/90 hover:border-slate-300 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between overflow-hidden group"
                    >
                      {/* Top Header Card Color Ribbon */}
                      <div className="p-5 flex-1 flex flex-col justify-between">
                        <div>
                          {/* Badges & Bookmark Star */}
                          <div className="flex items-start justify-between gap-2 mb-3">
                            <div className="flex items-center flex-wrap gap-1.5">
                              <span className="inline-flex items-center space-x-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                                <Icon className="w-3 h-3 text-slate-600" />
                                <span>{catConfig?.name || res.category}</span>
                              </span>

                              {res.is24x7Urgent && (
                                <span className="inline-flex items-center space-x-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
                                  <ShieldAlert className="w-3 h-3 text-rose-600" />
                                  <span>24/7 Urgent</span>
                                </span>
                              )}

                              {res.virtualAvailable && (
                                <span className="inline-flex items-center space-x-1 text-[11px] font-medium px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-100">
                                  <span>Zoom/Meet</span>
                                </span>
                              )}
                            </div>

                            {/* Bookmark button */}
                            <button
                              type="button"
                              onClick={(e) => toggleBookmark(res.id, e)}
                              className={`p-1.5 rounded-lg transition ${
                                isBookmarked
                                  ? 'text-amber-500 bg-amber-50 hover:bg-amber-100'
                                  : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'
                              }`}
                              title={isBookmarked ? 'Remove bookmark' : 'Save bookmark'}
                            >
                              {isBookmarked ? (
                                <BookmarkCheck className="w-5 h-5 fill-amber-500" />
                              ) : (
                                <Bookmark className="w-5 h-5" />
                              )}
                            </button>
                          </div>

                          {/* Title */}
                          <h3
                            className="text-base font-bold text-slate-900 group-hover:text-blue-900 transition-colors cursor-pointer line-clamp-1"
                            onClick={() => setSelectedResourceForDetail(res)}
                          >
                            {res.title}
                          </h3>

                          {/* Short Description */}
                          <p className="text-xs text-slate-600 mt-2 line-clamp-2 leading-relaxed">
                            {res.shortDescription}
                          </p>

                          {/* Location & Hours preview */}
                          <div className="mt-4 pt-3 border-t border-slate-100 space-y-1.5 text-xs text-slate-500">
                            <div className="flex items-center space-x-2">
                              <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                              <span className="truncate">{res.building} • {res.room}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Clock className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                              <span className="truncate">{res.hours.split('|')[0]}</span>
                            </div>
                          </div>

                          {/* Tags Pills */}
                          <div className="mt-3 flex items-center flex-wrap gap-1">
                            {res.tags.slice(0, 3).map((tag) => (
                              <span
                                key={tag}
                                className="text-[10px] font-medium px-2 py-0.5 rounded bg-slate-50 text-slate-600 border border-slate-100"
                              >
                                #{tag}
                              </span>
                            ))}
                            {res.tags.length > 3 && (
                              <span className="text-[10px] text-slate-400 font-medium">
                                +{res.tags.length - 3} more
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Bottom Actions inside card */}
                        <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                          <button
                            type="button"
                            onClick={() => setSelectedResourceForDetail(res)}
                            className="text-xs font-semibold text-slate-700 hover:text-blue-900 flex items-center space-x-1"
                          >
                            <span>Full Details</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>

                          <button
                            type="button"
                            onClick={() => openBookingModal(res)}
                            className="px-3 py-1.5 text-xs font-bold rounded-lg bg-blue-950 hover:bg-blue-900 text-white transition flex items-center space-x-1 shadow-xs"
                          >
                            <Calendar className="w-3.5 h-3.5 text-amber-400" />
                            <span>Schedule</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* =========================================================================
            TAB 2: APPOINTMENTS SCHEDULER & UPCOMING SESSIONS
           ========================================================================= */}
        {activeTab === 'appointments' && (
          <div className="space-y-6">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Your Academic & Support Sessions</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  View scheduled 1-on-1 tutoring, psychological counseling, academic advising, and career coaching consultations.
                </p>
              </div>

              <button
                type="button"
                onClick={() => openBookingModal()}
                className="px-4 py-2 text-xs font-bold rounded-xl bg-blue-950 hover:bg-blue-900 text-white transition flex items-center space-x-2 shadow-xs self-start sm:self-auto"
              >
                <PlusCircle className="w-4 h-4 text-amber-400" />
                <span>Schedule New Session</span>
              </button>
            </div>

            {appointments.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-md mx-auto">
                <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <h3 className="text-base font-bold text-slate-800">No scheduled sessions</h3>
                <p className="text-xs text-slate-500 mt-1 mb-5">
                  You do not have any upcoming consultations on file. Book a tutor, advisor, or counselor in seconds.
                </p>
                <button
                  type="button"
                  onClick={() => openBookingModal()}
                  className="px-4 py-2 text-xs font-bold rounded-xl bg-blue-900 text-white hover:bg-blue-800"
                >
                  Book Your First Consultation
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {appointments.map((apt) => (
                  <div
                    key={apt.id}
                    className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:border-slate-300 transition flex flex-col lg:flex-row lg:items-center justify-between gap-4"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                          apt.status === 'Confirmed'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}>
                          {apt.status}
                        </span>
                        <span className="text-xs font-medium text-slate-400">•</span>
                        <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-full">
                          {apt.deliveryMode}
                        </span>
                        <span className="text-xs text-slate-400">Booked for: {apt.attendeeName}</span>
                      </div>

                      <h3 className="text-base font-bold text-slate-900">{apt.resourceTitle}</h3>
                      <p className="text-xs text-slate-600 font-medium">
                        <strong>Topic:</strong> {apt.topic}
                      </p>

                      <div className="flex items-center flex-wrap gap-4 text-xs text-slate-500 pt-1">
                        <div className="flex items-center space-x-1.5">
                          <Calendar className="w-3.5 h-3.5 text-amber-500" />
                          <span className="font-semibold text-slate-700">{apt.date}</span>
                        </div>
                        <div className="flex items-center space-x-1.5">
                          <Clock className="w-3.5 h-3.5 text-blue-600" />
                          <span>{apt.timeSlot}</span>
                        </div>
                        <div className="flex items-center space-x-1.5">
                          <MapPin className="w-3.5 h-3.5 text-rose-500" />
                          <span>{apt.locationNote}</span>
                        </div>
                        <div className="flex items-center space-x-1.5">
                          <UserCheck className="w-3.5 h-3.5 text-purple-600" />
                          <span>Advisor: {apt.providerStaff}</span>
                        </div>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center space-x-2 self-end lg:self-center flex-shrink-0">
                      {apt.deliveryMode.includes('Virtual') && (
                        <button
                          type="button"
                          onClick={() => {
                            addToast('info', 'Opening Virtual Meeting Room', 'Connecting to Apex University Zoom SSO Gateway (Meeting ID #889-211-094)...');
                          }}
                          className="px-3 py-1.5 text-xs font-bold rounded-lg bg-blue-50 text-blue-800 border border-blue-200 hover:bg-blue-100 transition flex items-center space-x-1"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          <span>Join Meeting</span>
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => {
                          addToast('success', 'Calendar Sync', `Exported session "${apt.resourceTitle}" to iCalendar (.ics).`);
                        }}
                        className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 transition"
                      >
                        Add to Calendar
                      </button>

                      <button
                        type="button"
                        onClick={() => handleCancelAppointment(apt.id, apt.resourceTitle)}
                        className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 transition"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* =========================================================================
            TAB 3: DOCUMENT & FORMS VAULT
           ========================================================================= */}
        {activeTab === 'documents' && (
          <div className="space-y-6">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center space-x-2">
                  <h2 className="text-lg font-bold text-slate-900">Academic & Institutional Document Vault</h2>
                  <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-amber-100 text-amber-900">
                    Role-Gated Access
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Search university petitions, grade waivers, emergency micro-grant forms, and faculty policy templates.
                </p>
              </div>

              {/* Document search */}
              <div className="relative w-full md:w-72">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={docSearchQuery}
                  onChange={(e) => setDocSearchQuery(e.target.value)}
                  placeholder="Filter forms..."
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-900 focus:outline-none"
                />
              </div>
            </div>

            {/* Document Category Filter tabs */}
            <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar pb-1">
              {['All', 'Academic & Registration', 'Financial & Grants', 'Faculty Policies', 'Advising & Exceptions', 'Campus Safety'].map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setDocCategoryFilter(cat)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                    docCategoryFilter === cat
                      ? 'bg-blue-950 text-white shadow-xs'
                      : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Documents Grid / Table */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                      <th className="py-3 px-4">Document Title & Summary</th>
                      <th className="py-3 px-4">Category</th>
                      <th className="py-3 px-4">Access Clearance</th>
                      <th className="py-3 px-4">Format / Size</th>
                      <th className="py-3 px-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs">
                    {filteredDocuments.map((doc) => {
                      const hasAccess = doc.allowedRoles.includes(activeRole);
                      return (
                        <tr key={doc.id} className="hover:bg-slate-50/70 transition">
                          <td className="py-3.5 px-4 max-w-sm">
                            <div className="flex items-start space-x-2.5">
                              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center flex-shrink-0 mt-0.5">
                                <FileText className="w-4 h-4" />
                              </div>
                              <div>
                                <p className="font-bold text-slate-900 hover:text-blue-900 transition">{doc.title}</p>
                                <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">{doc.description}</p>
                              </div>
                            </div>
                          </td>

                          <td className="py-3.5 px-4 whitespace-nowrap">
                            <span className="text-[11px] font-medium text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md">
                              {doc.category}
                            </span>
                          </td>

                          <td className="py-3.5 px-4 whitespace-nowrap">
                            <div className="flex items-center space-x-1">
                              {hasAccess ? (
                                <span className="inline-flex items-center space-x-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                                  <Check className="w-3 h-3" />
                                  <span>Permitted ({activeRole})</span>
                                </span>
                              ) : (
                                <span className="inline-flex items-center space-x-1 text-[11px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200">
                                  <ShieldAlert className="w-3 h-3" />
                                  <span>Restricted</span>
                                </span>
                              )}
                            </div>
                          </td>

                          <td className="py-3.5 px-4 whitespace-nowrap text-slate-500 font-mono text-[11px]">
                            <span className="font-bold text-slate-700">{doc.fileFormat}</span> • {doc.fileSize}
                          </td>

                          <td className="py-3.5 px-4 whitespace-nowrap text-right">
                            <button
                              type="button"
                              onClick={() => handleDownloadDocument(doc)}
                              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center space-x-1.5 ml-auto ${
                                hasAccess
                                  ? 'bg-blue-900 text-white hover:bg-blue-800 shadow-xs'
                                  : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
                              }`}
                              title={hasAccess ? 'Download official document' : 'Role restricted'}
                            >
                              <Download className="w-3.5 h-3.5" />
                              <span>{hasAccess ? 'Download' : 'Locked'}</span>
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 4: SAVED BOOKMARKS
           ========================================================================= */}
        {activeTab === 'saved' && (
          <div className="space-y-6">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Your Pinned Resources ({savedResourcesList.length})</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Fast access to support centers, labs, and hotlines you frequently consult. Saved automatically across sessions.
                </p>
              </div>

              {savedResourcesList.length > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    setBookmarkedIds([]);
                    addToast('info', 'Bookmarks Cleared', 'All saved resources have been unpinned.');
                  }}
                  className="text-xs font-semibold text-rose-600 hover:text-rose-800"
                >
                  Clear All Saved
                </button>
              )}
            </div>

            {savedResourcesList.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-md mx-auto">
                <Bookmark className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <h3 className="text-base font-bold text-slate-800">No saved bookmarks yet</h3>
                <p className="text-xs text-slate-500 mt-1 mb-5">
                  Click the bookmark ribbon on any resource in the catalog to pin it here for rapid access.
                </p>
                <button
                  type="button"
                  onClick={() => setActiveTab('catalog')}
                  className="px-4 py-2 text-xs font-bold rounded-xl bg-blue-900 text-white hover:bg-blue-800"
                >
                  Browse Resource Catalog
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {savedResourcesList.map((res) => {
                  const catConfig = CATEGORIES_CONFIG.find((c) => c.id === res.category);
                  const Icon = catConfig?.icon || BookOpen;

                  return (
                    <div
                      key={res.id}
                      className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between hover:border-slate-300 transition"
                    >
                      <div>
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <span className="inline-flex items-center space-x-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                            <Icon className="w-3 h-3 text-slate-600" />
                            <span>{catConfig?.name || res.category}</span>
                          </span>

                          <button
                            type="button"
                            onClick={(e) => toggleBookmark(res.id, e)}
                            className="text-amber-500 hover:text-amber-600 p-1 rounded-lg"
                            title="Remove bookmark"
                          >
                            <BookmarkCheck className="w-5 h-5 fill-amber-500" />
                          </button>
                        </div>

                        <h3 className="text-base font-bold text-slate-900 line-clamp-1">{res.title}</h3>
                        <p className="text-xs text-slate-600 mt-1 line-clamp-2">{res.shortDescription}</p>

                        <div className="mt-3 pt-3 border-t border-slate-100 text-xs text-slate-500 space-y-1">
                          <div className="flex items-center space-x-1.5">
                            <MapPin className="w-3.5 h-3.5 text-slate-400" />
                            <span className="truncate">{res.building} • {res.room}</span>
                          </div>
                          <div className="flex items-center space-x-1.5">
                            <Phone className="w-3.5 h-3.5 text-slate-400" />
                            <span>{res.phone}</span>
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                        <button
                          type="button"
                          onClick={() => setSelectedResourceForDetail(res)}
                          className="text-xs font-semibold text-slate-700 hover:text-blue-900"
                        >
                          View Details
                        </button>
                        <button
                          type="button"
                          onClick={() => openBookingModal(res)}
                          className="px-3 py-1.5 text-xs font-bold rounded-lg bg-blue-950 text-white hover:bg-blue-900"
                        >
                          Schedule
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* =========================================================================
          MODAL: RESOURCE DETAIL VIEW
         ========================================================================= */}
      {selectedResourceForDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white p-6 relative">
              <button
                type="button"
                onClick={() => setSelectedResourceForDetail(null)}
                className="absolute right-4 top-4 p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-amber-400 mb-2">
                <span>{selectedResourceForDetail.category} Service</span>
                {selectedResourceForDetail.is24x7Urgent && (
                  <>
                    <span>•</span>
                    <span className="text-rose-400">24/7 Priority Hotline</span>
                  </>
                )}
              </div>

              <h2 className="text-xl sm:text-2xl font-bold font-academic pr-8">{selectedResourceForDetail.title}</h2>
              <p className="text-xs text-slate-300 mt-1">Lead: {selectedResourceForDetail.staffLead}</p>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5 text-xs text-slate-700 max-h-[70vh] overflow-y-auto">
              <div>
                <h4 className="text-xs uppercase font-bold text-slate-500 tracking-wider mb-1.5">Overview</h4>
                <p className="text-sm leading-relaxed text-slate-800">{selectedResourceForDetail.detailedOverview}</p>
              </div>

              {/* Location & Contact Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <div className="space-y-1">
                  <span className="text-[11px] font-semibold text-slate-400">Campus Location</span>
                  <div className="flex items-center space-x-1.5 text-slate-800 font-medium">
                    <MapPin className="w-4 h-4 text-rose-500 flex-shrink-0" />
                    <span>{selectedResourceForDetail.building}, {selectedResourceForDetail.room}</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-[11px] font-semibold text-slate-400">Operating Hours</span>
                  <div className="flex items-center space-x-1.5 text-slate-800 font-medium">
                    <Clock className="w-4 h-4 text-blue-500 flex-shrink-0" />
                    <span>{selectedResourceForDetail.hours}</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-[11px] font-semibold text-slate-400">Phone Contact</span>
                  <div className="flex items-center space-x-1.5 text-slate-800 font-medium">
                    <Phone className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                    <span>{selectedResourceForDetail.phone}</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-[11px] font-semibold text-slate-400">Official Email</span>
                  <div className="flex items-center space-x-1.5 text-slate-800 font-medium">
                    <Mail className="w-4 h-4 text-amber-500 flex-shrink-0" />
                    <span className="truncate">{selectedResourceForDetail.email}</span>
                  </div>
                </div>
              </div>

              {/* Featured Key Services */}
              <div>
                <h4 className="text-xs uppercase font-bold text-slate-500 tracking-wider mb-2">Key Services Offered</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {selectedResourceForDetail.featuredServices.map((srv, idx) => (
                    <div key={idx} className="flex items-center space-x-2 text-slate-800 bg-white p-2 rounded-xl border border-slate-200">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                      <span className="text-xs">{srv}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tags */}
              <div>
                <h4 className="text-xs uppercase font-bold text-slate-500 tracking-wider mb-1.5">Direct Attributes</h4>
                <div className="flex flex-wrap gap-1.5">
                  {selectedResourceForDetail.tags.map((t) => (
                    <span key={t} className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[11px] font-semibold">
                      #{t}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
              <button
                type="button"
                onClick={() => toggleBookmark(selectedResourceForDetail.id)}
                className="px-3.5 py-2 text-xs font-semibold rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 flex items-center space-x-1.5"
              >
                <Bookmark className="w-4 h-4 text-amber-500" />
                <span>
                  {bookmarkedIds.includes(selectedResourceForDetail.id) ? 'Remove Bookmark' : 'Save to Bookmarks'}
                </span>
              </button>

              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => setSelectedResourceForDetail(null)}
                  className="px-4 py-2 text-xs font-semibold rounded-xl text-slate-600 hover:bg-slate-200"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const target = selectedResourceForDetail;
                    setSelectedResourceForDetail(null);
                    openBookingModal(target);
                  }}
                  className="px-4 py-2 text-xs font-bold rounded-xl bg-blue-950 text-white hover:bg-blue-900 flex items-center space-x-1.5 shadow-sm"
                >
                  <Calendar className="w-4 h-4 text-amber-400" />
                  <span>Book Appointment</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL: INTERACTIVE APPOINTMENT SCHEDULER
         ========================================================================= */}
      {isBookingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full border border-slate-200 shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="bg-slate-900 text-white p-5 flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
                  <CalendarCheck className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold font-academic">Schedule University Consultation</h3>
                  <p className="text-[11px] text-slate-300">Book dedicated 1-on-1 time with specialized campus advisors</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsBookingModalOpen(false)}
                className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Booking Form */}
            <form onSubmit={handleConfirmBooking} className="p-6 space-y-4 text-xs">
              {/* Select Service Target */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Selected Center / Support Office
                </label>
                <select
                  value={bookingTargetResource?.id || ''}
                  onChange={(e) => {
                    const found = resources.find((r) => r.id === e.target.value);
                    if (found) setBookingTargetResource(found);
                  }}
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-900 font-medium"
                >
                  {resources.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.title} ({r.category})
                    </option>
                  ))}
                </select>
              </div>

              {/* Date & Time Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Select Consultation Date</label>
                  <input
                    type="date"
                    value={bookingDate}
                    onChange={(e) => setBookingDate(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-900 font-medium"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Available Time Slot</label>
                  <select
                    value={bookingTime}
                    onChange={(e) => setBookingTime(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-900 font-medium"
                  >
                    <option value="09:00 AM">09:00 AM - 09:45 AM</option>
                    <option value="10:00 AM">10:00 AM - 10:45 AM</option>
                    <option value="11:30 AM">11:30 AM - 12:15 PM</option>
                    <option value="01:15 PM">01:15 PM - 02:00 PM</option>
                    <option value="02:30 PM">02:30 PM - 03:15 PM</option>
                    <option value="04:00 PM">04:00 PM - 04:45 PM</option>
                  </select>
                </div>
              </div>

              {/* Delivery Mode: In-Person vs Virtual */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Consultation Delivery Mode</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setBookingMode('In-Person')}
                    className={`p-3 rounded-xl border text-left flex items-center space-x-2.5 transition ${
                      bookingMode === 'In-Person'
                        ? 'bg-blue-50 border-blue-600 text-blue-900 font-bold ring-1 ring-blue-600'
                        : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <Building2 className="w-4 h-4 text-blue-700 flex-shrink-0" />
                    <div>
                      <p className="text-xs">In-Person</p>
                      <p className="text-[10px] text-slate-500 font-normal">Campus Office Desk</p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setBookingMode('Virtual (Zoom)')}
                    className={`p-3 rounded-xl border text-left flex items-center space-x-2.5 transition ${
                      bookingMode === 'Virtual (Zoom)'
                        ? 'bg-blue-50 border-blue-600 text-blue-900 font-bold ring-1 ring-blue-600'
                        : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <Laptop className="w-4 h-4 text-blue-700 flex-shrink-0" />
                    <div>
                      <p className="text-xs">Virtual (Zoom)</p>
                      <p className="text-[10px] text-slate-500 font-normal">Secure Video Call</p>
                    </div>
                  </button>
                </div>
              </div>

              {/* Topic / Note Description */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Session Topic & Goals (Required)
                </label>
                <textarea
                  rows={3}
                  value={bookingTopic}
                  onChange={(e) => setBookingTopic(e.target.value)}
                  placeholder="e.g. Need assistance proofreading essay draft for Bioethics capstone, or questions about financial aid appeal deadline..."
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-900 font-medium"
                  required
                />
              </div>

              {/* Attendee Confirmation Info */}
              <div className="bg-amber-50/70 p-3 rounded-xl border border-amber-200 flex items-center space-x-2.5">
                <Info className="w-4 h-4 text-amber-700 flex-shrink-0" />
                <div className="text-[11px] text-amber-900">
                  Booking for: <strong>{ROLE_PROFILES[activeRole].name}</strong> ({ROLE_PROFILES[activeRole].role.toUpperCase()}). Confirmation will be dispatched to <strong>{ROLE_PROFILES[activeRole].email}</strong>.
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-200 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsBookingModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold rounded-xl text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold rounded-xl bg-blue-950 text-white hover:bg-blue-900 flex items-center space-x-1.5 shadow-md"
                >
                  <Check className="w-4 h-4 text-amber-400" />
                  <span>Confirm Reservation</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL: ADD / PUBLISH NEW RESOURCE (ADMIN & FACULTY)
         ========================================================================= */}
      {isAddResourceModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="bg-slate-900 text-white p-5 flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
                  <PlusCircle className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold font-academic">Register New Campus Resource</h3>
                  <p className="text-[11px] text-slate-300">Authorized Faculty & Administrative Directory Publisher</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsAddResourceModalOpen(false)}
                className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleCreateResource} className="p-6 space-y-4 text-xs max-h-[75vh] overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Center / Program Title *</label>
                  <input
                    type="text"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="e.g. Quantum Computing Collaborative Lab"
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-900"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Category *</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as ResourceCategory)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-900"
                  >
                    <option value="academic">Academic Support</option>
                    <option value="counseling">Counseling & Wellness</option>
                    <option value="financial">Financial Aid</option>
                    <option value="career">Career & Co-Op</option>
                    <option value="housing">Housing & Residential</option>
                    <option value="it">IT & Tech Support</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Short Summary (Catalog Preview) *</label>
                <input
                  type="text"
                  value={newShortDesc}
                  onChange={(e) => setNewShortDesc(e.target.value)}
                  placeholder="One sentence describing primary student value..."
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-900"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Detailed Description & Services</label>
                <textarea
                  rows={2}
                  value={newDetailed}
                  onChange={(e) => setNewDetailed(e.target.value)}
                  placeholder="Comprehensive service details, equipment available, eligibility..."
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-900"
                />
              </div>

              {/* Location & Hours */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">Campus Building *</label>
                  <input
                    type="text"
                    value={newBuilding}
                    onChange={(e) => setNewBuilding(e.target.value)}
                    placeholder="e.g. Science & Engineering Complex"
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-900"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Room / Suite</label>
                  <input
                    type="text"
                    value={newRoom}
                    onChange={(e) => setNewRoom(e.target.value)}
                    placeholder="e.g. Suite 412"
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-900"
                  />
                </div>
              </div>

              {/* Contact info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Operating Hours</label>
                  <input
                    type="text"
                    value={newHours}
                    onChange={(e) => setNewHours(e.target.value)}
                    placeholder="Mon-Fri: 9:00 AM - 5:00 PM"
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Contact Phone</label>
                  <input
                    type="text"
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    placeholder="(555) 839-XXXX"
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Tags (Comma-separated)</label>
                <input
                  type="text"
                  value={newTags}
                  onChange={(e) => setNewTags(e.target.value)}
                  placeholder="WalkInWelcome, FreePrinting, PeerLed, VirtualAvailable"
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-900"
                />
              </div>

              {/* Checkboxes */}
              <div className="flex items-center space-x-6 pt-2">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newIsUrgent}
                    onChange={(e) => setNewIsUrgent(e.target.checked)}
                    className="rounded border-slate-300 text-rose-600 focus:ring-rose-500 w-4 h-4"
                  />
                  <span className="text-xs font-semibold text-slate-700">Designate as 24/7 Urgent Center</span>
                </label>

                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newIsVirtual}
                    onChange={(e) => setNewIsVirtual(e.target.checked)}
                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-4 h-4"
                  />
                  <span className="text-xs font-semibold text-slate-700">Zoom / Virtual Available</span>
                </label>
              </div>

              {/* Submit Buttons */}
              <div className="pt-4 border-t border-slate-200 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsAddResourceModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold rounded-xl text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 flex items-center space-x-1.5 shadow-sm"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Publish to Portal Directory</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL: EMERGENCY & 24/7 CAMPUS CRISIS DIRECTORY
         ========================================================================= */}
      {isEmergencyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full border border-rose-300 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="bg-gradient-to-r from-rose-900 via-rose-800 to-rose-950 text-white p-5 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-rose-500/30 text-rose-200 flex items-center justify-center border border-rose-400/40 animate-pulse">
                  <ShieldAlert className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold font-academic">24/7 Campus Emergency Directory</h3>
                  <p className="text-xs text-rose-200">Immediate, confidential crisis dispatch for all community members</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsEmergencyModalOpen(false)}
                className="p-1.5 rounded-full text-rose-300 hover:text-white hover:bg-rose-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Emergency Contacts List */}
            <div className="p-5 space-y-3 text-xs">
              <div className="bg-rose-50 border border-rose-200 p-3.5 rounded-2xl flex items-center justify-between">
                <div>
                  <p className="font-bold text-rose-950 text-sm">Campus Police & Immediate Threat</p>
                  <p className="text-[11px] text-rose-700">For active physical emergencies, fire, or acute crime</p>
                </div>
                <a
                  href="tel:5558399111"
                  className="px-3.5 py-1.5 bg-rose-700 hover:bg-rose-800 text-white font-bold rounded-xl text-xs flex items-center space-x-1.5 shadow-sm"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>(555) 839-9111</span>
                </a>
              </div>

              <div className="bg-blue-50 border border-blue-200 p-3.5 rounded-2xl flex items-center justify-between">
                <div>
                  <p className="font-bold text-blue-950 text-sm">24/7 Mental Health Crisis Line</p>
                  <p className="text-[11px] text-blue-700">Confidential de-escalation, suicide prevention & triage</p>
                </div>
                <a
                  href="tel:5558392273"
                  className="px-3.5 py-1.5 bg-blue-900 hover:bg-blue-800 text-white font-bold rounded-xl text-xs flex items-center space-x-1.5 shadow-sm"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>(555) 839-CARE</span>
                </a>
              </div>

              <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-2xl flex items-center justify-between">
                <div>
                  <p className="font-bold text-slate-900 text-sm">Campus Night Escort & SafeWalk</p>
                  <p className="text-[11px] text-slate-600">Free walking accompaniment across campus (6 PM - 4 AM)</p>
                </div>
                <a
                  href="tel:5558399255"
                  className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl text-xs flex items-center space-x-1.5 shadow-sm"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>(555) 839-WALK</span>
                </a>
              </div>

              <div className="bg-emerald-50 border border-emerald-200 p-3.5 rounded-2xl flex items-center justify-between">
                <div>
                  <p className="font-bold text-emerald-950 text-sm">Student Emergency Medical Clinic</p>
                  <p className="text-[11px] text-emerald-700">Health Pavilion Ground Floor Urgent Triage</p>
                </div>
                <a
                  href="tel:5558394325"
                  className="px-3.5 py-1.5 bg-emerald-800 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center space-x-1.5 shadow-sm"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>(555) 839-HEAL</span>
                </a>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 text-center">
              <button
                type="button"
                onClick={() => setIsEmergencyModalOpen(false)}
                className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs"
              >
                Close Emergency Directory
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- FOOTER --- */}
      <footer className="bg-slate-900 text-slate-400 text-xs border-t border-slate-800 py-8 px-4 sm:px-6 mt-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
              <GraduationCap className="w-4 h-4 text-amber-300" />
            </div>
            <div>
              <p className="text-white font-bold font-academic">APEX UNIVERSITY PORTAL</p>
              <p className="text-[11px] text-slate-400">Veritas, Praxis, & Student Well-Being • Office of Information & Campus Affairs</p>
            </div>
          </div>

          <div className="flex items-center space-x-6 text-[11px] text-slate-400">
            <button
              type="button"
              onClick={() => {
                const guide = INITIAL_DOCUMENTS.find((d) => d.id === 'doc-09');
                if (guide) handleDownloadDocument(guide);
              }}
              className="hover:text-amber-400 transition"
            >
              Emergency Protocols (.PDF)
            </button>
            <span>•</span>
            <button
              type="button"
              onClick={() => {
                const ferpa = INITIAL_DOCUMENTS.find((d) => d.id === 'doc-10');
                if (ferpa) handleDownloadDocument(ferpa);
              }}
              className="hover:text-amber-400 transition"
            >
              FERPA Privacy Rights
            </button>
            <span>•</span>
            <button
              type="button"
              onClick={() => setIsEmergencyModalOpen(true)}
              className="text-rose-400 hover:underline font-semibold"
            >
              Crisis Hotline: (555) 839-CARE
            </button>
          </div>
        </div>
      </footer>

      {/* --- FLOATING TOAST NOTIFICATION CONTAINER --- */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col space-y-2.5 max-w-sm w-full pointer-events-none">
        {toasts.map((toast) => {
          const typeStyles = {
            success: 'bg-slate-900 text-white border-emerald-500/50',
            info: 'bg-slate-900 text-white border-blue-500/50',
            warning: 'bg-slate-900 text-white border-amber-500/50',
            error: 'bg-slate-900 text-white border-rose-500/50'
          }[toast.type];

          const iconMap = {
            success: <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />,
            info: <Sparkles className="w-4 h-4 text-blue-400 flex-shrink-0" />,
            warning: <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0" />,
            error: <XCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
          }[toast.type];

          return (
            <div
              key={toast.id}
              className={`p-3.5 rounded-2xl shadow-2xl border flex items-start space-x-3 pointer-events-auto animate-in slide-in-from-bottom-3 duration-200 ${typeStyles}`}
            >
              {iconMap}
              <div className="flex-1 overflow-hidden">
                <p className="text-xs font-bold leading-tight">{toast.title}</p>
                <p className="text-[11px] text-slate-300 mt-0.5 leading-snug">{toast.message}</p>
              </div>
              <button
                type="button"
                onClick={() => removeToast(toast.id)}
                className="text-slate-400 hover:text-white p-0.5"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
