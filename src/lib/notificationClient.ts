'use client';

import { supabase } from '@/lib/supabase';
import { type PreserveWorkOrder, type WorkOrderStatus } from '@/lib/localData';

type NotificationPayload = {
  type: 'new-work-order-management' | 'work-order-progress-customer';
  workOrder: PreserveWorkOrder;
  customerEmail?: string;
  previousStatus?: WorkOrderStatus;
  newStatus?: WorkOrderStatus;
};

async function getCustomerEmail() {
  const { data } = await supabase.auth.getUser();
  return data.user?.email || '';
}

export async function notifyNewWorkOrder(workOrder: PreserveWorkOrder) {
  const customerEmail = await getCustomerEmail();
  await sendNotification({
    type: 'new-work-order-management',
    workOrder,
    customerEmail,
  });
}

export async function notifyWorkOrderProgress(
  workOrder: PreserveWorkOrder,
  previousStatus: WorkOrderStatus | undefined,
  newStatus: WorkOrderStatus
) {
  if (previousStatus && previousStatus === newStatus) return;

  const customerEmail = await getCustomerEmail();
  await sendNotification({
    type: 'work-order-progress-customer',
    workOrder,
    customerEmail,
    previousStatus,
    newStatus,
  });
}

async function sendNotification(payload: NotificationPayload) {
  try {
    await fetch('/api/notifications/email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  } catch (error) {
    console.warn('Email notification failed', error);
  }
}
