import { NextResponse } from 'next/server';
import { type PreserveWorkOrder, type WorkOrderStatus } from '@/lib/localData';

type EmailPayload = {
  type?: 'new-work-order-management' | 'work-order-progress-customer';
  workOrder?: PreserveWorkOrder;
  customerEmail?: string;
  previousStatus?: WorkOrderStatus;
  newStatus?: WorkOrderStatus;
};

const statusLabels: Partial<Record<WorkOrderStatus, string>> = {
  submitted: 'Received',
  'under-review': 'Under review',
  'awaiting-assignment': 'Awaiting assignment',
  offered: 'Offered',
  assigned: 'Assigned',
  accepted: 'Accepted',
  scheduled: 'Scheduled',
  'in-progress': 'In progress',
  'awaiting-bid-approval': 'Awaiting bid approval',
  'awaiting-quality-review': 'Awaiting quality review',
  'awaiting-customer-approval': 'Awaiting customer approval',
  completed: 'Completed',
  invoiced: 'Invoiced',
  paid: 'Paid',
  cancelled: 'Cancelled',
  disputed: 'Disputed',
};

function getStatusLabel(status: WorkOrderStatus) {
  return statusLabels[status] || status.replace(/-/g, ' ');
}

export async function POST(request: Request) {
  const payload = (await request.json()) as EmailPayload;

  if (!payload.type || !payload.workOrder) {
    return NextResponse.json({ message: 'Notification type and workOrder are required.' }, { status: 400 });
  }

  const email = buildEmail(payload);
  if (!email) {
    return NextResponse.json({ message: 'Unable to build notification email.' }, { status: 400 });
  }

  const result = await sendEmail(email);
  return NextResponse.json(result, { status: result.ok ? 200 : 500 });
}

function buildEmail(payload: EmailPayload) {
  const workOrder = payload.workOrder;
  if (!workOrder) return null;

  const orderLabel = workOrder.orderNumber || `WO-${workOrder.id}`;
  const service = workOrder.serviceType || 'Preservation service';
  const property = workOrder.propertyAddress || 'Property address not assigned';

  if (payload.type === 'new-work-order-management') {
    const to = process.env.MANAGEMENT_NOTIFICATION_EMAIL || process.env.NOTIFICATION_TO_EMAIL;
    if (!to) {
      return {
        skipped: true,
        reason: 'MANAGEMENT_NOTIFICATION_EMAIL is not configured.',
        subject: `New Preserve work order: ${orderLabel}`,
        preview: { orderLabel, service, property, customerEmail: payload.customerEmail || 'Unknown customer' },
      };
    }

    return {
      to,
      subject: `New Preserve work order: ${orderLabel}`,
      html: wrapEmail(`
        <h1>New work order received</h1>
        <p>A customer submitted a new Preserve work order.</p>
        ${detailTable([
          ['Work order', orderLabel],
          ['Customer', payload.customerEmail || 'Unknown customer'],
          ['Property', property],
          ['Service', service],
          ['Priority', workOrder.priority || 'normal'],
          ['Scheduled date', formatDate(workOrder.scheduledDate)],
          ['Billing', `$${Number(workOrder.billingAmount || 0).toLocaleString()} ${workOrder.billingFrequency || 'one-time'}`],
        ])}
      `),
    };
  }

  if (payload.type === 'work-order-progress-customer') {
    const to = payload.customerEmail;
    if (!to) {
      return {
        skipped: true,
        reason: 'Customer email is not available.',
        subject: `Update on ${orderLabel}`,
        preview: { orderLabel, service, property, status: payload.newStatus },
      };
    }

    const status = payload.newStatus || workOrder.status;
    return {
      to,
      subject: `Preserve update: ${getStatusLabel(status)} for ${orderLabel}`,
      html: wrapEmail(`
        <h1>Your work order is ${getStatusLabel(status).toLowerCase()}</h1>
        <p>We wanted to keep you updated on the progress of your Preserve service.</p>
        ${detailTable([
          ['Work order', orderLabel],
          ['Property', property],
          ['Service', service],
          ['Previous status', payload.previousStatus ? getStatusLabel(payload.previousStatus) : 'Not available'],
          ['Current status', getStatusLabel(status)],
          ['Scheduled date', formatDate(workOrder.scheduledDate)],
        ])}
        <p style="margin-top:24px;">You can sign in to your Preserve dashboard to view the full work order details.</p>
      `),
    };
  }

  return null;
}

async function sendEmail(email: {
  to?: string;
  subject: string;
  html?: string;
  skipped?: boolean;
  reason?: string;
  preview?: unknown;
}) {
  if (email.skipped) {
    console.info('Email notification skipped:', email.reason, email.preview);
    return { ok: true, skipped: true, reason: email.reason };
  }

  if (!process.env.RESEND_API_KEY) {
    console.info('Email notification ready but RESEND_API_KEY is not configured:', {
      to: email.to,
      subject: email.subject,
    });
    return { ok: true, skipped: true, reason: 'RESEND_API_KEY is not configured.' };
  }

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: process.env.EMAIL_FROM || 'Preserve <notifications@preserve.app>',
      to: email.to,
      subject: email.subject,
      html: email.html,
    }),
  });

  if (!response.ok) {
    const message = await response.text();
    console.error('Email notification failed:', message);
    return { ok: false, message };
  }

  return { ok: true };
}

function wrapEmail(content: string) {
  return `
    <div style="font-family:Inter,Arial,sans-serif;background:#f8fafc;padding:24px;color:#0f172a;">
      <div style="max-width:640px;margin:0 auto;background:#ffffff;border:1px solid #e2e8f0;border-radius:12px;padding:24px;">
        <div style="font-size:22px;font-weight:800;margin-bottom:20px;color:#1d4ed8;">Preserve</div>
        ${content}
      </div>
    </div>
  `;
}

function detailTable(rows: Array<[string, string]>) {
  return `
    <table style="width:100%;border-collapse:collapse;margin-top:20px;">
      <tbody>
        ${rows
          .map(
            ([label, value]) => `
              <tr>
                <td style="padding:10px 0;border-bottom:1px solid #e2e8f0;color:#64748b;font-size:14px;">${escapeHtml(label)}</td>
                <td style="padding:10px 0;border-bottom:1px solid #e2e8f0;color:#0f172a;font-size:14px;font-weight:700;text-align:right;">${escapeHtml(value)}</td>
              </tr>
            `
          )
          .join('')}
      </tbody>
    </table>
  `;
}

function formatDate(date?: string) {
  if (!date) return 'Not scheduled';
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return 'Not scheduled';
  return parsed.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
