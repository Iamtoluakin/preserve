import assert from 'node:assert/strict';
import { test } from 'node:test';

import {
  canAccessWorkOrder,
  canSeeContractorPerformance,
  canTransitionWorkOrder,
  createStatusAuditEvent,
  normalizeWorkflowStatus,
  rankContractorsForJob,
  USER_ROLES,
} from '../src/lib/operations.js';

test('normalizes legacy work order statuses into the managed lifecycle', () => {
  assert.equal(normalizeWorkflowStatus('pending'), 'submitted');
  assert.equal(normalizeWorkflowStatus('in_progress'), 'in-progress');
  assert.equal(normalizeWorkflowStatus('unknown'), 'submitted');
});

test('validates legal work order transitions', () => {
  assert.equal(canTransitionWorkOrder('submitted', 'under-review'), true);
  assert.equal(canTransitionWorkOrder('submitted', 'paid'), false);

  const audit = createStatusAuditEvent({
    workOrderId: 'wo_1',
    fromStatus: 'submitted',
    toStatus: 'under-review',
    actorId: 'admin_1',
    actorRole: USER_ROLES.ADMIN,
    note: 'Scoped by dispatch',
  });

  assert.equal(audit.fromStatus, 'submitted');
  assert.equal(audit.toStatus, 'under-review');
  assert.equal(audit.actorRole, 'admin');
  assert.ok(audit.createdAt);
});

test('enforces role-scoped work order access', () => {
  const workOrder = { customerId: 'customer_1', assignedContractorId: 'contractor_1' };

  assert.equal(canAccessWorkOrder({ role: 'customer', userId: 'customer_1' }, workOrder), true);
  assert.equal(canAccessWorkOrder({ role: 'customer', userId: 'customer_2' }, workOrder), false);
  assert.equal(canAccessWorkOrder({ role: 'contractor', contractorId: 'contractor_1' }, workOrder), true);
  assert.equal(canAccessWorkOrder({ role: 'contractor', contractorId: 'contractor_2' }, workOrder), false);
  assert.equal(canAccessWorkOrder({ role: 'admin', userId: 'admin_1' }, workOrder), true);
  assert.equal(canSeeContractorPerformance({ role: 'contractor' }), false);
  assert.equal(canSeeContractorPerformance({ role: 'admin' }), true);
});

test('ranks only eligible approved contractors for a job', () => {
  const job = { serviceCategoryId: 'inspection', requiredLicenses: ['home-inspection'] };
  const ranked = rankContractorsForJob(
    [
      {
        id: 'contractor_a',
        approvalStatus: 'approved',
        serviceCategories: ['inspection'],
        licenses: ['home-inspection'],
        distanceMiles: 12,
        coverageRadiusMiles: 30,
        available: true,
        insuranceStatus: 'verified',
        qualityScore: 90,
        onTimeRate: 92,
        completionRate: 95,
        openJobCount: 1,
      },
      {
        id: 'contractor_b',
        approvalStatus: 'submitted',
        serviceCategories: ['inspection'],
        distanceMiles: 3,
        coverageRadiusMiles: 20,
      },
      {
        id: 'contractor_c',
        approvalStatus: 'approved',
        serviceCategories: ['lawn-maintenance'],
        distanceMiles: 60,
        coverageRadiusMiles: 15,
      },
    ],
    job
  );

  assert.equal(ranked.length, 1);
  assert.equal(ranked[0].contractor.id, 'contractor_a');
  assert.ok(ranked[0].score > 70);
});
