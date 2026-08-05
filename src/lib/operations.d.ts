export const USER_ROLES: Readonly<{
  CUSTOMER: 'customer';
  CONTRACTOR: 'contractor';
  ADMIN: 'admin';
}>;

export const CONTRACTOR_APPLICATION_STATUSES: readonly string[];
export const WORK_ORDER_STATUSES: readonly string[];
export const LEGAL_WORK_ORDER_TRANSITIONS: Readonly<Record<string, readonly string[]>>;
export const SERVICE_CATEGORIES: readonly {
  id: string;
  name: string;
  requiresPhotos: boolean;
  requiresCheckIn: boolean;
  defaultPriority: string;
}[];

export type PreserveUserRole = 'customer' | 'contractor' | 'admin';

export function normalizeWorkflowStatus(status: unknown): string;
export function formatWorkflowStatus(status: unknown): string;
export function canTransitionWorkOrder(fromStatus: unknown, toStatus: unknown): boolean;
export function assertWorkOrderTransition(fromStatus: unknown, toStatus: unknown): void;
export function createStatusAuditEvent(input: {
  workOrderId: string;
  fromStatus: unknown;
  toStatus: unknown;
  actorId: string;
  actorRole: unknown;
  note?: string;
}): {
  workOrderId: string;
  fromStatus: string;
  toStatus: string;
  actorId: string;
  actorRole: PreserveUserRole;
  note: string | null;
  createdAt: string;
};
export function normalizeRole(role: unknown): PreserveUserRole;
export function canAccessWorkOrder(
  actor: { role?: unknown; userId?: string; contractorId?: string } | null | undefined,
  workOrder: { customerId?: string; assignedContractorId?: string } | null | undefined
): boolean;
export function canSeeContractorPerformance(actor: { role?: unknown } | null | undefined): boolean;
export function scoreContractorMatch(contractor: Record<string, any> | null | undefined, job: Record<string, any>): number;
export function rankContractorsForJob(contractors: Record<string, any>[], job: Record<string, any>): { contractor: Record<string, any>; score: number }[];
