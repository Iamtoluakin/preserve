export type WorkOrderStatus = 'pending' | 'in-progress' | 'completed' | 'cancelled';

export type PreserveProperty = {
  id: string;
  address: string;
  city?: string;
  county?: string;
  state?: string;
  serviceArea?: string;
  zip?: string;
  propertyType?: string;
  acquisitionDate?: string;
  status?: string;
  bankReference?: string;
  parcelId?: string;
  notes?: string;
};

export type PreserveWorkOrder = {
  id: string;
  orderNumber?: string;
  propertyId?: string;
  propertyAddress: string;
  serviceType: string;
  services?: unknown[];
  status: WorkOrderStatus;
  priority: string;
  scheduledDate?: string;
  billingFrequency: string;
  totalCost: number;
  billingAmount: number;
  description?: string;
  accessInstructions?: string;
  createdAt: string;
  completedDate?: string;
};

const PROPERTIES_KEY = 'preserve_properties';
const WORK_ORDERS_KEY = 'workOrders';

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

function normalizeStatus(status: unknown): WorkOrderStatus {
  const normalized = String(status || 'pending').toLowerCase().replace('_', '-');

  if (normalized === 'in-progress') return 'in-progress';
  if (normalized === 'completed') return 'completed';
  if (normalized === 'cancelled' || normalized === 'canceled') return 'cancelled';
  return 'pending';
}

export function normalizeWorkOrder(order: Partial<PreserveWorkOrder> & Record<string, unknown>): PreserveWorkOrder {
  return {
    ...order,
    id: String(order.id || Date.now()),
    status: normalizeStatus(order.status),
    priority: String(order.priority || 'normal'),
    serviceType: String(order.serviceType || ''),
    propertyAddress: String(order.propertyAddress || ''),
    billingFrequency: String(order.billingFrequency || 'one-time'),
    totalCost: Number(order.totalCost || 0),
    billingAmount: Number(order.billingAmount || order.totalCost || 0),
    createdAt: String(order.createdAt || new Date().toISOString()),
  };
}

export function readProperties(): PreserveProperty[] {
  return readJsonArray<PreserveProperty>(PROPERTIES_KEY);
}

export function writeProperties(properties: PreserveProperty[]) {
  window.localStorage.setItem(PROPERTIES_KEY, JSON.stringify(properties));
}

export function readWorkOrders(): PreserveWorkOrder[] {
  return readJsonArray<Record<string, unknown>>(WORK_ORDERS_KEY).map(normalizeWorkOrder);
}

export function writeWorkOrders(workOrders: PreserveWorkOrder[]) {
  window.localStorage.setItem(WORK_ORDERS_KEY, JSON.stringify(workOrders.map(normalizeWorkOrder)));
}

export function formatWorkOrderStatus(status: string) {
  return normalizeStatus(status).replace('-', ' ');
}
