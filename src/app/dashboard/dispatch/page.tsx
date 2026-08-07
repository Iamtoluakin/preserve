'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import {
  ArrowLeft,
  CheckCircle2,
  ClipboardList,
  FileText,
  Home,
  MapPin,
  Plus,
  Settings,
  ShieldCheck,
  Star,
  UserCheck,
} from 'lucide-react';
import {
  PreserveWorkOrder,
  readWorkOrders,
  writeWorkOrders,
  formatWorkOrderStatus,
} from '@/lib/localData';
import { supabase } from '@/lib/supabase';
import {
  AssignmentRecommendation,
  ContractorProfile,
  buildAssignmentRecommendations,
  readContractorProfiles,
} from '@/lib/vendorData';

type Assignment = {
  workOrderId: string;
  contractorId: string;
  contractorName: string;
  companyName: string;
  score: number;
  assignedAt: string;
};

const ASSIGNMENTS_KEY = 'preserve_work_order_assignments';

function readAssignments(): Assignment[] {
  if (typeof window === 'undefined') return [];
  const stored = window.localStorage.getItem(ASSIGNMENTS_KEY);
  if (!stored) return [];

  try {
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeAssignments(assignments: Assignment[]) {
  window.localStorage.setItem(ASSIGNMENTS_KEY, JSON.stringify(assignments));
}

function seedDispatchOrders() {
  const existing = readWorkOrders();
  if (existing.length > 0) return existing;

  const seeded: PreserveWorkOrder[] = [
    {
      id: 'dispatch-1',
      orderNumber: 'WO-2026-0101',
      propertyAddress: '1234 Main Street, Durham, NC 27701',
      serviceType: 'Lawn maintenance and exterior cleanup',
      status: 'awaiting-assignment',
      priority: 'normal',
      billingFrequency: 'one-time',
      totalCost: 300,
      billingAmount: 300,
      description: 'Vacant property needs lawn service, walkway cleanup, and completion photos.',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'dispatch-2',
      orderNumber: 'WO-2026-0102',
      propertyAddress: '5678 Oak Avenue, Raleigh, NC 27603',
      serviceType: 'Winterization and property securing',
      status: 'awaiting-assignment',
      priority: 'high',
      billingFrequency: 'one-time',
      totalCost: 600,
      billingAmount: 600,
      description: 'Freeze expected this week. Secure property and complete photo report.',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'dispatch-3',
      orderNumber: 'WO-2026-0103',
      propertyAddress: '9012 Pine Road, Charlotte, NC 28202',
      serviceType: 'Full inspection and photo documentation',
      status: 'submitted',
      priority: 'normal',
      billingFrequency: 'one-time',
      totalCost: 250,
      billingAmount: 250,
      description: 'Full exterior/interior inspection with room-by-room photos.',
      createdAt: new Date().toISOString(),
    },
  ];

  writeWorkOrders(seeded);
  return seeded;
}

export default function DispatchPage() {
  const [workOrders, setWorkOrders] = useState<PreserveWorkOrder[]>([]);
  const [selectedId, setSelectedId] = useState('');
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [contractors, setContractors] = useState<ContractorProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState('');
  const [assigningId, setAssigningId] = useState('');

  useEffect(() => {
    async function loadDispatchData() {
      setLoading(true);
      setNotice('');

      const { data } = await supabase.auth.getSession();
      const token = data.session?.access_token;
      const headers = token ? { Authorization: `Bearer ${token}` } : undefined;

      try {
        const [ordersResponse, contractorsResponse] = await Promise.all([
          fetch('/api/dispatch/work-orders', { cache: 'no-store', headers }),
          fetch('/api/dispatch/contractors', { cache: 'no-store', headers }),
        ]);

        if (!ordersResponse.ok || !contractorsResponse.ok) {
          throw new Error('Dispatch APIs are not available yet.');
        }

        const [ordersResult, contractorsResult] = await Promise.all([
          ordersResponse.json(),
          contractorsResponse.json(),
        ]);

        const apiOrders = Array.isArray(ordersResult.workOrders) ? ordersResult.workOrders : [];
        const apiContractors = Array.isArray(contractorsResult.contractors) ? contractorsResult.contractors : [];

        if (apiOrders.length > 0) {
          setWorkOrders(apiOrders);
          setSelectedId(apiOrders.find((order: PreserveWorkOrder) => ['submitted', 'under-review', 'awaiting-assignment'].includes(order.status))?.id || apiOrders[0]?.id || '');
        } else {
          const fallbackOrders = seedDispatchOrders();
          setWorkOrders(fallbackOrders);
          setSelectedId(fallbackOrders.find(order => ['submitted', 'under-review', 'awaiting-assignment'].includes(order.status))?.id || fallbackOrders[0]?.id || '');
          setNotice('No live dispatch queue found yet. Showing starter work orders.');
        }

        if (apiContractors.length > 0) {
          setContractors(apiContractors);
        } else {
          setContractors(readContractorProfiles());
          setNotice(current => current || 'No approved live contractors found yet. Showing starter contractor profiles.');
        }

        setAssignments(readAssignments());
      } catch (err: any) {
        const orders = seedDispatchOrders();
        setWorkOrders(orders);
        setSelectedId(orders.find(order => ['submitted', 'under-review', 'awaiting-assignment'].includes(order.status))?.id || orders[0]?.id || '');
        setContractors(readContractorProfiles());
        setAssignments(readAssignments());
        setNotice(err.message || 'Using local dispatch data until Supabase is available.');
      } finally {
        setLoading(false);
      }
    }

    loadDispatchData();
  }, []);

  const selectedOrder = workOrders.find(order => order.id === selectedId) || workOrders[0];
  const existingAssignment = assignments.find(assignment => assignment.workOrderId === selectedOrder?.id);
  const recommendations: AssignmentRecommendation[] = selectedOrder
    ? buildAssignmentRecommendations(selectedOrder, contractors)
    : [];

  const assignContractor = async (recommendation: AssignmentRecommendation) => {
    if (!selectedOrder) return;
    setAssigningId(recommendation.contractor.id);
    setNotice('');

    const assignment: Assignment = {
      workOrderId: selectedOrder.id,
      contractorId: recommendation.contractor.id,
      contractorName: recommendation.contractor.contactName,
      companyName: recommendation.contractor.companyName,
      score: recommendation.score,
      assignedAt: new Date().toISOString(),
    };

    const nextAssignments = [
      assignment,
      ...assignments.filter(item => item.workOrderId !== selectedOrder.id),
    ];
    const nextOrders = workOrders.map(order => order.id === selectedOrder.id ? { ...order, status: 'assigned' as const } : order);

    try {
      const { data } = await supabase.auth.getSession();
      const token = data.session?.access_token;

      if (!token) throw new Error('No Supabase session found. Saved locally for now.');

      const response = await fetch('/api/dispatch/assign', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          workOrderId: selectedOrder.id,
          contractorId: recommendation.contractor.id,
          score: recommendation.score,
          scoreBreakdown: { reasons: recommendation.reasons },
        }),
      });

      if (!response.ok) {
        const result = await response.json().catch(() => ({}));
        throw new Error(result.message || 'Could not save assignment to Supabase.');
      }

      const result = await response.json();
      const savedAssignment = result.assignment ? {
        workOrderId: result.assignment.workOrderId,
        contractorId: result.assignment.contractorId,
        contractorName: result.assignment.contractorName,
        companyName: result.assignment.companyName,
        score: result.assignment.score,
        assignedAt: result.assignment.assignedAt,
      } : assignment;

      const savedAssignments = [
        savedAssignment,
        ...assignments.filter(item => item.workOrderId !== selectedOrder.id),
      ];
      setAssignments(savedAssignments);
      setWorkOrders(nextOrders);
      writeAssignments(savedAssignments);
      writeWorkOrders(nextOrders);
      setNotice(`Assigned to ${savedAssignment.companyName}.`);
    } catch (err: any) {
      setAssignments(nextAssignments);
      setWorkOrders(nextOrders);
      writeAssignments(nextAssignments);
      writeWorkOrders(nextOrders);
      setNotice(err.message || 'Assignment saved locally.');
    } finally {
      setAssigningId('');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="sticky top-0 z-40 border-b bg-white">
        <div className="px-3 py-3 sm:px-4 md:px-6 md:py-4">
          <div className="flex items-center justify-between gap-3">
            <Link href="/dashboard" className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-blue-600 text-xl font-black text-white">P</div>
              <div>
                <p className="text-lg font-black text-slate-950">Dispatch</p>
                <p className="text-xs font-semibold text-slate-500">Rank and assign field pros</p>
              </div>
            </Link>
            <Link href="/dashboard" className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-slate-200 px-3 text-sm font-bold text-slate-700 hover:text-blue-700">
              <ArrowLeft className="h-4 w-4" />
              Dashboard
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-3 py-6 pb-28 sm:px-4 md:px-6 lg:pb-8">
        {notice && (
          <div className="mb-5 rounded-xl border border-blue-200 bg-blue-50 p-3 text-sm font-semibold text-blue-800">
            {notice}
          </div>
        )}
        <div className="mb-6 grid gap-4 md:grid-cols-3">
          <Metric title="Needs assignment" value={workOrders.filter(order => ['submitted', 'under-review', 'awaiting-assignment'].includes(order.status)).length.toString()} />
          <Metric title="Assigned" value={workOrders.filter(order => order.status === 'assigned').length.toString()} />
          <Metric title="Approved pros" value={contractors.filter(contractor => contractor.approvalStatus === 'approved').length.toString()} />
        </div>

        <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
          <section className="rounded-2xl border bg-white shadow-sm">
            <div className="border-b p-4 md:p-5">
              <h1 className="flex items-center gap-2 text-xl font-black text-slate-950">
                <ClipboardList className="h-5 w-5 text-blue-600" />
                Work Queue
              </h1>
              <p className="mt-1 text-sm text-slate-500">Select a job to see ranked contractor matches.</p>
            </div>
            <div className="divide-y">
              {loading ? (
                <div className="p-8 text-center text-sm font-semibold text-slate-500">Loading dispatch queue...</div>
              ) : workOrders.map(order => (
                <button
                  key={order.id}
                  onClick={() => setSelectedId(order.id)}
                  className={`w-full p-4 text-left transition hover:bg-slate-50 md:p-5 ${selectedOrder?.id === order.id ? 'bg-blue-50' : 'bg-white'}`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-black text-slate-950">{order.orderNumber || order.id}</p>
                      <p className="mt-1 truncate text-sm font-semibold text-slate-700">{order.serviceType}</p>
                    </div>
                    <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold capitalize text-slate-700">
                      {formatWorkOrderStatus(order.status)}
                    </span>
                  </div>
                  <p className="mt-3 flex items-start gap-2 text-sm text-slate-500">
                    <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0" />
                    <span className="line-clamp-2">{order.propertyAddress}</span>
                  </p>
                </button>
              ))}
            </div>
          </section>

          <section className="space-y-4">
            {selectedOrder && (
              <div className="rounded-2xl border bg-white p-5 shadow-sm md:p-6">
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.2em] text-blue-700">Selected work order</p>
                    <h2 className="mt-2 text-2xl font-black text-slate-950">{selectedOrder.orderNumber || selectedOrder.id}</h2>
                    <p className="mt-2 text-sm leading-6 text-slate-600">{selectedOrder.description || selectedOrder.serviceType}</p>
                  </div>
                  <div className="rounded-2xl bg-slate-50 p-4 text-right">
                    <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Budget</p>
                    <p className="text-2xl font-black text-green-600">${selectedOrder.totalCost}</p>
                  </div>
                </div>
                {existingAssignment && (
                  <div className="mt-5 rounded-xl border border-green-200 bg-green-50 p-4 text-sm font-semibold text-green-800">
                    Assigned to {existingAssignment.companyName} with a {existingAssignment.score}/100 match score.
                  </div>
                )}
              </div>
            )}

            <div className="rounded-2xl border bg-white shadow-sm">
              <div className="border-b p-4 md:p-5">
                <h2 className="flex items-center gap-2 text-lg font-black text-slate-950">
                  <Star className="h-5 w-5 text-blue-600" />
                  Ranked Contractor Matches
                </h2>
                <p className="mt-1 text-sm text-slate-500">Scored by approval, service fit, coverage, insurance, availability, quality, and workload.</p>
              </div>
              <div className="divide-y">
                {recommendations.length === 0 ? (
                  <div className="p-8 text-center">
                    <ShieldCheck className="mx-auto mb-3 h-10 w-10 text-slate-300" />
                    <p className="font-semibold text-slate-700">No approved contractors match this job yet.</p>
                  </div>
                ) : (
                  recommendations.map(recommendation => (
                    <article key={recommendation.contractor.id} className="p-4 md:p-5">
                      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="text-lg font-black text-slate-950">{recommendation.contractor.companyName}</h3>
                            <span className="rounded-full bg-blue-100 px-2.5 py-1 text-xs font-bold text-blue-700">{recommendation.score}/100</span>
                          </div>
                          <p className="mt-1 text-sm font-semibold text-slate-600">{recommendation.contractor.contactName} · {recommendation.contractor.phone}</p>
                          <div className="mt-3 flex flex-wrap gap-2">
                            {recommendation.reasons.map(reason => (
                              <span key={reason} className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-700">
                                <CheckCircle2 className="h-3.5 w-3.5 text-green-600" />
                                {reason}
                              </span>
                            ))}
                          </div>
                        </div>
                        <button
                          onClick={() => assignContractor(recommendation)}
                          disabled={assigningId === recommendation.contractor.id}
                          className="inline-flex min-h-11 items-center justify-center rounded-xl bg-blue-600 px-4 text-sm font-bold text-white transition hover:bg-blue-700"
                        >
                          {assigningId === recommendation.contractor.id ? 'Assigning...' : 'Assign Job'}
                        </button>
                      </div>
                    </article>
                  ))
                )}
              </div>
            </div>
          </section>
        </div>
      </main>

      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 grid grid-cols-5 border-t bg-white/95 px-2 pb-[calc(0.5rem+env(safe-area-inset-bottom))] pt-2 shadow-[0_-8px_24px_rgba(15,23,42,0.08)] backdrop-blur">
        <Link href="/dashboard" className="flex flex-col items-center gap-0.5 rounded-lg px-1 py-1.5 text-slate-500">
          <Home className="h-5 w-5" />
          <span className="text-xs font-medium">Home</span>
        </Link>
        <Link href="/dashboard/properties" className="flex flex-col items-center gap-0.5 rounded-lg px-1 py-1.5 text-slate-500">
          <MapPin className="h-5 w-5" />
          <span className="text-xs font-medium">Properties</span>
        </Link>
        <Link href="/dashboard/work-orders/create" className="flex flex-col items-center gap-0.5">
          <div className="-mt-5 grid h-12 w-12 place-items-center rounded-full bg-blue-600 shadow-lg">
            <Plus className="h-6 w-6 text-white" />
          </div>
          <span className="mt-0.5 text-xs font-medium text-slate-500">New</span>
        </Link>
        <Link href="/dashboard/work-orders" className="flex flex-col items-center gap-0.5 rounded-lg px-1 py-1.5 text-slate-500">
          <FileText className="h-5 w-5" />
          <span className="text-xs font-medium">Orders</span>
        </Link>
        <Link href="/dashboard/settings" className="flex flex-col items-center gap-0.5 rounded-lg px-1 py-1.5 text-slate-500">
          <Settings className="h-5 w-5" />
          <span className="text-xs font-medium">Settings</span>
        </Link>
      </nav>
    </div>
  );
}

function Metric({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-2xl border bg-white p-4 shadow-sm md:p-5">
      <p className="text-sm font-semibold text-slate-500">{title}</p>
      <p className="mt-2 text-3xl font-black text-slate-950">{value}</p>
    </div>
  );
}
