export const USER_ROLES = Object.freeze({
  CUSTOMER: 'customer',
  CONTRACTOR: 'contractor',
  ADMIN: 'admin',
});

export const CONTRACTOR_APPLICATION_STATUSES = Object.freeze([
  'draft',
  'submitted',
  'under-review',
  'approved',
  'rejected',
  'suspended',
]);

export const WORK_ORDER_STATUSES = Object.freeze([
  'draft',
  'submitted',
  'under-review',
  'awaiting-assignment',
  'offered',
  'assigned',
  'accepted',
  'scheduled',
  'in-progress',
  'awaiting-bid-approval',
  'awaiting-quality-review',
  'awaiting-customer-approval',
  'completed',
  'invoiced',
  'paid',
  'cancelled',
  'disputed',
]);

const STATUS_ALIASES = Object.freeze({
  pending: 'submitted',
  'in_progress': 'in-progress',
  complete: 'completed',
  canceled: 'cancelled',
});

export const LEGAL_WORK_ORDER_TRANSITIONS = Object.freeze({
  draft: ['submitted', 'cancelled'],
  submitted: ['under-review', 'cancelled'],
  'under-review': ['awaiting-assignment', 'awaiting-bid-approval', 'cancelled'],
  'awaiting-assignment': ['offered', 'assigned', 'cancelled'],
  offered: ['assigned', 'awaiting-assignment', 'cancelled'],
  assigned: ['accepted', 'scheduled', 'awaiting-assignment', 'cancelled'],
  accepted: ['scheduled', 'in-progress', 'cancelled'],
  scheduled: ['in-progress', 'cancelled'],
  'in-progress': ['awaiting-bid-approval', 'awaiting-quality-review', 'completed', 'disputed'],
  'awaiting-bid-approval': ['in-progress', 'cancelled', 'disputed'],
  'awaiting-quality-review': ['in-progress', 'awaiting-customer-approval', 'completed', 'disputed'],
  'awaiting-customer-approval': ['completed', 'in-progress', 'disputed'],
  completed: ['invoiced', 'disputed'],
  invoiced: ['paid', 'disputed'],
  paid: [],
  cancelled: [],
  disputed: ['under-review', 'cancelled'],
});

export const SERVICE_CATEGORIES = Object.freeze([
  {
    id: 'inspection',
    name: 'Property inspections',
    requiresPhotos: true,
    requiresCheckIn: true,
    defaultPriority: 'normal',
  },
  {
    id: 'lawn-maintenance',
    name: 'Lawn maintenance',
    requiresPhotos: true,
    requiresCheckIn: true,
    defaultPriority: 'normal',
  },
  {
    id: 'trash-out',
    name: 'Trash-outs and debris removal',
    requiresPhotos: true,
    requiresCheckIn: true,
    defaultPriority: 'high',
  },
  {
    id: 'securing',
    name: 'Lock changes, rekeying, board-ups, and securing',
    requiresPhotos: true,
    requiresCheckIn: true,
    defaultPriority: 'high',
  },
  {
    id: 'winterization',
    name: 'Winterization and de-winterization',
    requiresPhotos: true,
    requiresCheckIn: true,
    defaultPriority: 'normal',
  },
  {
    id: 'turnover-cleaning',
    name: 'Rental turns and cleaning',
    requiresPhotos: true,
    requiresCheckIn: true,
    defaultPriority: 'normal',
  },
  {
    id: 'minor-repairs',
    name: 'Minor repairs',
    requiresPhotos: true,
    requiresCheckIn: true,
    defaultPriority: 'normal',
  },
  {
    id: 'emergency',
    name: 'Emergency property services',
    requiresPhotos: true,
    requiresCheckIn: true,
    defaultPriority: 'emergency',
  },
]);

export function normalizeWorkflowStatus(status) {
  const normalized = String(status || 'submitted').trim().toLowerCase().replace(/\s+/g, '-');
  const aliased = STATUS_ALIASES[normalized] || normalized;
  return WORK_ORDER_STATUSES.includes(aliased) ? aliased : 'submitted';
}

export function formatWorkflowStatus(status) {
  return normalizeWorkflowStatus(status).replace(/-/g, ' ');
}

export function canTransitionWorkOrder(fromStatus, toStatus) {
  const from = normalizeWorkflowStatus(fromStatus);
  const to = normalizeWorkflowStatus(toStatus);
  return Boolean(LEGAL_WORK_ORDER_TRANSITIONS[from]?.includes(to));
}

export function assertWorkOrderTransition(fromStatus, toStatus) {
  if (!canTransitionWorkOrder(fromStatus, toStatus)) {
    throw new Error(`Illegal work order transition: ${fromStatus} -> ${toStatus}`);
  }
}

export function createStatusAuditEvent({ workOrderId, fromStatus, toStatus, actorId, actorRole, note }) {
  assertWorkOrderTransition(fromStatus, toStatus);

  return {
    workOrderId,
    fromStatus: normalizeWorkflowStatus(fromStatus),
    toStatus: normalizeWorkflowStatus(toStatus),
    actorId,
    actorRole: normalizeRole(actorRole),
    note: note || null,
    createdAt: new Date().toISOString(),
  };
}

export function normalizeRole(role) {
  const normalized = String(role || USER_ROLES.CUSTOMER).trim().toLowerCase();
  return Object.values(USER_ROLES).includes(normalized) ? normalized : USER_ROLES.CUSTOMER;
}

export function canAccessWorkOrder(actor, workOrder) {
  const role = normalizeRole(actor?.role);

  if (role === USER_ROLES.ADMIN) return true;
  if (role === USER_ROLES.CUSTOMER) return actor?.userId === workOrder?.customerId;
  if (role === USER_ROLES.CONTRACTOR) return actor?.contractorId === workOrder?.assignedContractorId;

  return false;
}

export function canSeeContractorPerformance(actor) {
  return normalizeRole(actor?.role) === USER_ROLES.ADMIN;
}

export function scoreContractorMatch(contractor, job) {
  if (!contractor || contractor.approvalStatus !== 'approved') return 0;

  let score = 0;
  const serviceCategories = contractor.serviceCategories || [];
  const requiredLicenses = job.requiredLicenses || [];
  const licenses = contractor.licenses || [];

  if (!serviceCategories.includes(job.serviceCategoryId)) return 0;
  score += 30;
  if (Number(contractor.distanceMiles ?? Infinity) <= Number(contractor.coverageRadiusMiles ?? 0)) score += 20;
  if (contractor.available !== false) score += 15;
  if (contractor.insuranceStatus === 'verified') score += 10;
  if (requiredLicenses.every((license) => licenses.includes(license))) score += 10;

  score += Math.round(Number(contractor.qualityScore || 0) * 0.08);
  score += Math.round(Number(contractor.onTimeRate || 0) * 0.05);
  score += Math.round(Number(contractor.completionRate || 0) * 0.05);
  score -= Number(contractor.openJobCount || 0) * 2;
  score -= Number(contractor.complaintCount || 0) * 5;

  return Math.max(0, Math.min(100, score));
}

export function rankContractorsForJob(contractors, job) {
  return [...contractors]
    .map((contractor) => ({
      contractor,
      score: scoreContractorMatch(contractor, job),
    }))
    .filter((result) => result.score > 0)
    .sort((a, b) => b.score - a.score);
}
