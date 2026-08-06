import { rankContractorsForJob } from './operations.js';
import type { PreserveWorkOrder } from './localData';

export type ContractorApprovalStatus = 'draft' | 'submitted' | 'under-review' | 'approved' | 'rejected' | 'suspended';

export type ContractorProfile = {
  id: string;
  userId?: string;
  companyName: string;
  contactName: string;
  email?: string;
  phone: string;
  approvalStatus: ContractorApprovalStatus;
  serviceCategories: string[];
  coverageZipCodes: string[];
  coverageRadiusMiles: number;
  insuranceStatus: 'missing' | 'submitted' | 'verified';
  licenses: string[];
  available: boolean;
  qualityScore: number;
  onTimeRate: number;
  completionRate: number;
  openJobCount: number;
  complaintCount: number;
  notes?: string;
};

export type AssignmentRecommendation = {
  contractor: ContractorProfile;
  score: number;
  reasons: string[];
};

const CONTRACTOR_PROFILES_KEY = 'preserve_contractor_profiles';

export const serviceCategoryOptions = [
  { id: 'inspection', label: 'Property inspections' },
  { id: 'lawn-maintenance', label: 'Lawn maintenance' },
  { id: 'trash-out', label: 'Trash-outs and debris removal' },
  { id: 'securing', label: 'Lock changes and securing' },
  { id: 'winterization', label: 'Winterization' },
  { id: 'turnover-cleaning', label: 'Rental turns and cleaning' },
  { id: 'minor-repairs', label: 'Minor repairs' },
  { id: 'emergency', label: 'Emergency property services' },
];

export const sampleContractors: ContractorProfile[] = [
  {
    id: 'contractor-1',
    companyName: 'Triangle Field Services',
    contactName: 'Mike Johnson',
    phone: '(919) 555-0198',
    approvalStatus: 'approved',
    serviceCategories: ['inspection', 'lawn-maintenance', 'turnover-cleaning', 'minor-repairs'],
    coverageZipCodes: ['27701', '27703', '27513', '27603'],
    coverageRadiusMiles: 35,
    insuranceStatus: 'verified',
    licenses: ['general-liability'],
    available: true,
    qualityScore: 94,
    onTimeRate: 96,
    completionRate: 98,
    openJobCount: 2,
    complaintCount: 0,
  },
  {
    id: 'contractor-2',
    companyName: 'Oak City Preservation',
    contactName: 'Sarah Williams',
    phone: '(984) 555-0144',
    approvalStatus: 'approved',
    serviceCategories: ['securing', 'winterization', 'trash-out', 'emergency'],
    coverageZipCodes: ['27601', '27603', '27610', '27529'],
    coverageRadiusMiles: 45,
    insuranceStatus: 'verified',
    licenses: ['general-liability', 'locksmith'],
    available: true,
    qualityScore: 90,
    onTimeRate: 92,
    completionRate: 94,
    openJobCount: 1,
    complaintCount: 0,
  },
  {
    id: 'contractor-3',
    companyName: 'Queen City Turns',
    contactName: 'David Brown',
    phone: '(704) 555-0171',
    approvalStatus: 'approved',
    serviceCategories: ['inspection', 'trash-out', 'turnover-cleaning', 'minor-repairs'],
    coverageZipCodes: ['28202', '28205', '28208'],
    coverageRadiusMiles: 30,
    insuranceStatus: 'verified',
    licenses: ['general-liability'],
    available: false,
    qualityScore: 88,
    onTimeRate: 89,
    completionRate: 91,
    openJobCount: 4,
    complaintCount: 1,
  },
  {
    id: 'contractor-4',
    companyName: 'Submitted Vendor LLC',
    contactName: 'Lisa Garcia',
    phone: '(336) 555-0132',
    approvalStatus: 'submitted',
    serviceCategories: ['lawn-maintenance', 'inspection'],
    coverageZipCodes: ['27401', '27405'],
    coverageRadiusMiles: 25,
    insuranceStatus: 'submitted',
    licenses: [],
    available: true,
    qualityScore: 0,
    onTimeRate: 0,
    completionRate: 0,
    openJobCount: 0,
    complaintCount: 0,
  },
];

function readJsonArray<T>(key: string): T[] {
  if (typeof window === 'undefined') return [];

  const stored = window.localStorage.getItem(key);
  if (!stored) return [];

  try {
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function readContractorProfiles(): ContractorProfile[] {
  const stored = readJsonArray<ContractorProfile>(CONTRACTOR_PROFILES_KEY);
  return stored.length > 0 ? stored : sampleContractors;
}

export function writeContractorProfiles(contractors: ContractorProfile[]) {
  window.localStorage.setItem(CONTRACTOR_PROFILES_KEY, JSON.stringify(contractors));
}

export function saveContractorProfile(profile: ContractorProfile) {
  const contractors = readContractorProfiles();
  const existingIndex = contractors.findIndex(contractor => contractor.id === profile.id || contractor.userId === profile.userId);

  if (existingIndex >= 0) {
    contractors[existingIndex] = profile;
  } else {
    contractors.unshift(profile);
  }

  writeContractorProfiles(contractors);
  return profile;
}

export function inferServiceCategory(serviceType: string) {
  const normalized = serviceType.toLowerCase();

  if (normalized.includes('inspection') || normalized.includes('photo')) return 'inspection';
  if (normalized.includes('lawn') || normalized.includes('mow') || normalized.includes('yard')) return 'lawn-maintenance';
  if (normalized.includes('trash') || normalized.includes('debris')) return 'trash-out';
  if (normalized.includes('secure') || normalized.includes('lock') || normalized.includes('board')) return 'securing';
  if (normalized.includes('winter')) return 'winterization';
  if (normalized.includes('clean') || normalized.includes('turn')) return 'turnover-cleaning';
  if (normalized.includes('repair')) return 'minor-repairs';
  if (normalized.includes('emergency') || normalized.includes('urgent')) return 'emergency';

  return 'inspection';
}

export function buildAssignmentRecommendations(workOrder: PreserveWorkOrder, contractors: ContractorProfile[]): AssignmentRecommendation[] {
  const zip = workOrder.propertyAddress.match(/\b\d{5}\b/)?.[0];
  const serviceCategoryId = inferServiceCategory(workOrder.serviceType);
  const ranked = rankContractorsForJob(
    contractors.map(contractor => ({
      ...contractor,
      distanceMiles: zip && contractor.coverageZipCodes.includes(zip) ? 8 : 24,
    })),
    {
      serviceCategoryId,
      requiredLicenses: workOrder.priority === 'emergency' ? ['general-liability'] : [],
    }
  );

  return ranked.map(({ contractor, score }) => {
    const typedContractor = contractor as ContractorProfile;
    const reasons = [
      `${serviceCategoryOptions.find(option => option.id === serviceCategoryId)?.label || 'Service'} match`,
      typedContractor.insuranceStatus === 'verified' ? 'Insurance verified' : 'Insurance pending',
      typedContractor.available ? 'Available now' : 'Limited availability',
      `${typedContractor.openJobCount} open job${typedContractor.openJobCount === 1 ? '' : 's'}`,
    ];

    if (zip && typedContractor.coverageZipCodes.includes(zip)) reasons.unshift(`Covers ${zip}`);

    return {
      contractor: typedContractor,
      score,
      reasons,
    };
  });
}
