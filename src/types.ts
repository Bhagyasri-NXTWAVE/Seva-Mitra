export type Language = 'en' | 'te' | 'tenglish' | 'hi';

export type ProfessionType =
  | 'Student'
  | 'Employee'
  | 'Business Owner'
  | 'Farmer'
  | 'Self-employed'
  | 'Homemaker'
  | 'Unemployed'
  | 'Retired'
  | 'Government Employee'
  | 'Other';

export interface CitizenProfile {
  fullName: string;
  dob: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  
  // Professional
  profession: ProfessionType;
  organizationOrInstitution: string;
  idNumber: string;
  proofDocumentName: string;
  businessType?: string;

  // Identity
  nationality: string;
  aadhaarMasked: string;
  panMasked: string;
  rationCard: string;
  digiLockerVerified: boolean;
  digiLockerVerifiedDate?: string;

  // Social / Eligibility
  casteCategory: 'General' | 'OBC' | 'SC' | 'ST' | 'EWS';
  subCaste: string;
  religion: string;
  physicallyDisabled: boolean;
  disabilityPercentage?: number;
  maritalStatus: 'Married' | 'Unmarried' | 'Divorced';
  retirementStatus: boolean;
  govRetirementStatus: boolean;
  annualHouseholdIncome: number;
  incomeBracket: 'Below 1.5 Lakh' | '1.5 Lakh - 3 Lakh' | '3 Lakh - 5 Lakh' | '5 Lakh - 8 Lakh' | 'Above 8 Lakh';

  // Location
  state: string;
  district: string;
  cityOrVillage: string;
  locality: string;
  landmark: string;

  // Contact
  email: string;
  mobile: string;
  guardianMobile?: string;
}

export type ApplicationStatus = 'Applied' | 'Under Review' | 'Shortlisted' | 'Approved' | 'Declined';

export interface SchemeApplication {
  id: string;
  applicationNo: string;
  schemeId: string;
  schemeName: string;
  department: string;
  appliedDate: string;
  status: ApplicationStatus;
  lastUpdated: string;
  benefitSanctioned?: string;
  declineReason?: string;
  nextStepsGuidance?: string;
  officialRefDoc?: string;
}

export interface Scheme {
  id: string;
  title: string;
  title_te?: string;
  title_tenglish?: string;
  title_hi?: string;
  department: string;
  ministry: string;
  category: 'Education' | 'Agriculture' | 'Housing' | 'Healthcare' | 'Financial & MSME' | 'Social Welfare' | 'Water & Infrastructure';
  shortDescription: string;
  eligibilitySummary: string;
  benefits: string;
  financialAssistance: string;
  deadline?: string;
  whoCanApply: string[];
  eligibilityCriteria: string[];
  requiredDocuments: string[];
  applicationProcess: string[];
  officialSourceUrl: string;
  officialSourceLabel: string;
  status: 'Open' | 'Expiring Soon' | 'Always Open';
  
  // Matching benchmarks
  targetProfessions: ProfessionType[];
  maxIncome?: number;
  minAge?: number;
  maxAge?: number;
  allowedGenders?: ('Male' | 'Female' | 'Other')[];
  casteRestrictions?: ('General' | 'OBC' | 'SC' | 'ST' | 'EWS')[];
  requiresDisability?: boolean;
}

export type ComplaintStatus = 'Submitted' | 'Assigned' | 'Under Review' | 'In Progress' | 'Resolved' | 'Rejected';

export interface ComplaintTimelineStage {
  stage: string;
  timestamp: string;
  statusKey: ComplaintStatus;
  note: string;
  officerName?: string;
}

export interface Complaint {
  id: string;
  complaintId: string; // e.g. SV-2026-004128
  citizenName: string;
  citizenPhone: string;
  category: string;
  subCategory?: string;
  problemDescription: string;
  location: string;
  district: string;
  state: string;
  landmark: string;
  affectedCount: number | string;
  urgency: 'Normal' | 'Urgent' | 'Emergency';
  assignedDepartment: string;
  assignedOffice: string;
  evidenceUrl?: string;
  evidenceType?: 'photo' | 'video';
  generatedLetter: string;
  letterLanguage?: Language;
  status: ComplaintStatus;
  submittedDate: string;
  lastUpdated: string;
  timeline: ComplaintTimelineStage[];
  officerRemarks?: string;
  resolutionPhotoUrl?: string;
  priorityScore?: 'High' | 'Medium' | 'Low';
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  type: 'scheme' | 'complaint' | 'system';
  read: boolean;
  relatedId?: string;
}

export interface DepartmentRoutingRule {
  category: string;
  departmentName: string;
  assignedOffice: string;
  nodalOfficer: string;
  contactDesk: string;
}
