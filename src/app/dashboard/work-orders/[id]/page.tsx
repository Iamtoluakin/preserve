'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Clock,
  DollarSign,
  FileText,
  Home,
  MapPin,
  NotebookText,
  ShieldCheck,
  Trash2,
} from 'lucide-react';
import {
  formatWorkOrderStatus,
  readProperties,
  readWorkOrders,
  type PreserveProperty,
  type PreserveWorkOrder,
  type WorkOrderStatus,
  writeWorkOrders,
} from '@/lib/localData';
import { notifyWorkOrderProgress } from '@/lib/notificationClient';

type ServiceLine = {
  id?: string;
  name?: string;
  basePrice?: number;
  quantity?: number;
  frequency?: string;
  unit?: string;
  total?: number;
};

const STATUSES: WorkOrderStatus[] = ['pending', 'in-progress', 'completed', 'cancelled'];

export default function WorkOrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [workOrder, setWorkOrder] = useState<PreserveWorkOrder | null>(null);
  const [property, setProperty] = useState<PreserveProperty | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    const id = String(params.id);
    const order = readWorkOrders().find(wo => wo.id === id || wo.orderNumber === id) || null;
    setWorkOrder(order);
    setProperty(order?.propertyId ? readProperties().find(p => p.id === order.propertyId) || null : null);
  }, [params.id]);

  const services = useMemo(() => {
    if (!workOrder?.services || !Array.isArray(workOrder.services)) return [];
    return workOrder.services.filter((service): service is ServiceLine => {
      return typeof service === 'object' && service !== null;
    });
  }, [workOrder]);

  const updateStatus = (status: WorkOrderStatus) => {
    if (!workOrder) return;

    const updatedOrder: PreserveWorkOrder = {
      ...workOrder,
      status,
      completedDate: status === 'completed' ? workOrder.completedDate || new Date().toISOString() : undefined,
    };
    const updated = readWorkOrders().map(order => (order.id === workOrder.id ? updatedOrder : order));
    writeWorkOrders(updated);
    setWorkOrder(updatedOrder);
    void notifyWorkOrderProgress(updatedOrder, workOrder.status, status);
  };

  const deleteOrder = () => {
    if (!workOrder) return;

    writeWorkOrders(readWorkOrders().filter(order => order.id !== workOrder.id));
    router.push('/dashboard/work-orders');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'in-progress': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'emergency': return 'bg-red-50 text-red-700 border-red-200';
      case 'high': return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'low': return 'bg-green-50 text-green-700 border-green-200';
      default: return 'bg-blue-50 text-blue-700 border-blue-200';
    }
  };

  const formatDate = (date?: string, includeTime = false) => {
    if (!date) return 'Not set';
    const parsed = new Date(date);
    if (Number.isNaN(parsed.getTime())) return 'Invalid date';

    return parsed.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      ...(includeTime ? { hour: 'numeric', minute: '2-digit' } : {}),
    });
  };

  if (!workOrder) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <div className="bg-white border rounded-xl shadow-sm p-8 max-w-md w-full text-center">
          <FileText className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h1 className="text-xl font-bold text-slate-900 mb-2">Work order not found</h1>
          <p className="text-sm text-slate-500 mb-6">This work order may have been deleted or is only available in another workspace.</p>
          <Link href="/dashboard/work-orders" className="inline-flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 transition font-semibold text-sm">
            <ArrowLeft className="w-4 h-4" />
            Back to Work Orders
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b sticky top-0 z-40">
        <div className="px-3 sm:px-4 md:px-6 py-3 md:py-4 flex items-center justify-between gap-3">
          <Link href="/dashboard/work-orders" className="flex items-center gap-2 text-slate-600 hover:text-blue-600 transition text-sm">
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Back to Work Orders</span>
            <span className="sm:hidden">Orders</span>
          </Link>
          <Link href="/dashboard" className="flex items-center space-x-3">
            <div className="w-8 h-8 md:w-9 md:h-9 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg md:text-xl">P</span>
            </div>
            <span className="text-lg md:text-xl font-bold text-slate-900">Preserve</span>
          </Link>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-3 sm:px-4 md:px-6 py-6 md:py-8 pb-10">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-6">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className={`px-3 py-1 rounded-full border text-xs font-bold ${getStatusColor(workOrder.status)}`}>
                {formatWorkOrderStatus(workOrder.status).toUpperCase()}
              </span>
              <span className={`px-3 py-1 rounded-full border text-xs font-bold ${getPriorityColor(workOrder.priority)}`}>
                {workOrder.priority.toUpperCase()} PRIORITY
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900 break-words">{workOrder.orderNumber || `WO-${workOrder.id}`}</h1>
            <p className="text-sm md:text-base text-slate-600 mt-1 break-words">{workOrder.serviceType || 'Service request'}</p>
          </div>

          <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2">
            {STATUSES.map(status => (
              <button
                key={status}
                onClick={() => updateStatus(status)}
                className={`px-3 py-2.5 rounded-lg border text-sm font-semibold transition ${
                  workOrder.status === status
                    ? getStatusColor(status)
                    : 'bg-white text-slate-600 border-slate-200 hover:border-blue-300 hover:text-blue-700'
                }`}
              >
                {formatWorkOrderStatus(status)}
              </button>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <section className="bg-white rounded-xl shadow-sm border p-4 md:p-6">
              <div className="flex items-center gap-3 mb-5">
                <ShieldCheck className="w-5 h-5 text-blue-600" />
                <h2 className="text-lg font-semibold text-slate-900">Job Overview</h2>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <InfoItem icon={<MapPin className="w-4 h-4" />} label="Property" value={workOrder.propertyAddress || 'Not assigned'} />
                <InfoItem icon={<Calendar className="w-4 h-4" />} label="Scheduled" value={formatDate(workOrder.scheduledDate)} />
                <InfoItem icon={<Clock className="w-4 h-4" />} label="Created" value={formatDate(workOrder.createdAt, true)} />
                <InfoItem icon={<DollarSign className="w-4 h-4" />} label="Billing" value={`$${workOrder.billingAmount.toLocaleString()} ${workOrder.billingFrequency === 'one-time' ? 'one-time' : `/ ${workOrder.billingFrequency}`}`} />
              </div>

              {property && (
                <Link
                  href={`/dashboard/properties/${property.id}`}
                  className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700"
                >
                  <Home className="w-4 h-4" />
                  View property profile
                </Link>
              )}
            </section>

            <section className="bg-white rounded-xl shadow-sm border p-4 md:p-6">
              <div className="flex items-center gap-3 mb-5">
                <FileText className="w-5 h-5 text-blue-600" />
                <h2 className="text-lg font-semibold text-slate-900">Services</h2>
              </div>

              {services.length > 0 ? (
                <div className="divide-y divide-slate-100">
                  {services.map((service, index) => (
                    <div key={service.id || `${service.name}-${index}`} className="py-4 first:pt-0 last:pb-0 flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="font-semibold text-slate-900">{service.name || 'Service'}</p>
                        <p className="text-sm text-slate-500 mt-1">
                          {service.quantity || 1} x ${Number(service.basePrice || 0).toLocaleString()}
                          {service.unit ? ` ${service.unit}` : ''}
                          {service.frequency ? ` · ${service.frequency}` : ''}
                        </p>
                      </div>
                      <p className="font-bold text-slate-900 flex-shrink-0">${Number(service.total || 0).toLocaleString()}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-slate-500">No itemized service lines were saved for this order.</p>
              )}
            </section>

            <section className="bg-white rounded-xl shadow-sm border p-4 md:p-6">
              <div className="flex items-center gap-3 mb-5">
                <NotebookText className="w-5 h-5 text-blue-600" />
                <h2 className="text-lg font-semibold text-slate-900">Instructions</h2>
              </div>
              <div className="space-y-4">
                <TextBlock label="Service notes" value={workOrder.description} empty="No service notes added." />
                <TextBlock label="Access instructions" value={workOrder.accessInstructions} empty="No access instructions added." />
              </div>
            </section>
          </div>

          <aside className="space-y-6">
            <section className="bg-white rounded-xl shadow-sm border p-4 md:p-5">
              <h2 className="font-semibold text-slate-900 mb-4">Timeline</h2>
              <div className="space-y-4">
                <TimelineItem icon={<FileText className="w-4 h-4" />} title="Created" detail={formatDate(workOrder.createdAt, true)} active />
                <TimelineItem icon={<Calendar className="w-4 h-4" />} title="Scheduled" detail={formatDate(workOrder.scheduledDate)} active={Boolean(workOrder.scheduledDate)} />
                <TimelineItem icon={<Clock className="w-4 h-4" />} title="In progress" detail={workOrder.status === 'in-progress' ? 'Currently active' : 'Not started'} active={workOrder.status === 'in-progress' || workOrder.status === 'completed'} />
                <TimelineItem icon={<CheckCircle2 className="w-4 h-4" />} title="Completed" detail={workOrder.completedDate ? formatDate(workOrder.completedDate, true) : 'Not complete'} active={workOrder.status === 'completed'} />
              </div>
            </section>

            <section className="bg-white rounded-xl shadow-sm border p-4 md:p-5">
              <h2 className="font-semibold text-slate-900 mb-4">Service Cost</h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between gap-4">
                  <span className="text-slate-500">Service total</span>
                  <span className="font-semibold text-slate-900">${workOrder.totalCost.toLocaleString()}</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-slate-500">Billing amount</span>
                  <span className="font-semibold text-slate-900">${workOrder.billingAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-slate-500">Frequency</span>
                  <span className="font-semibold text-slate-900 capitalize">{workOrder.billingFrequency}</span>
                </div>
              </div>
            </section>

            <section className="bg-white rounded-xl shadow-sm border p-4 md:p-5">
              <h2 className="font-semibold text-slate-900 mb-4">Danger Zone</h2>
              {confirmDelete ? (
                <div className="space-y-3">
                  <p className="text-sm text-red-600">Delete this work order permanently?</p>
                  <div className="flex gap-2">
                    <button onClick={deleteOrder} className="flex-1 bg-red-600 text-white px-3 py-2 rounded-lg text-sm font-semibold hover:bg-red-700 transition">
                      Delete
                    </button>
                    <button onClick={() => setConfirmDelete(false)} className="flex-1 border border-slate-300 text-slate-600 px-3 py-2 rounded-lg text-sm font-semibold hover:bg-slate-50 transition">
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setConfirmDelete(true)}
                  className="w-full flex items-center justify-center gap-2 border border-red-200 text-red-600 px-3 py-2 rounded-lg text-sm font-semibold hover:bg-red-50 transition"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete Work Order
                </button>
              )}
            </section>
          </aside>
        </div>
      </main>
    </div>
  );
}

function InfoItem({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="border border-slate-200 rounded-lg p-4">
      <div className="flex items-center gap-2 text-slate-500 text-sm mb-1">
        {icon}
        <span>{label}</span>
      </div>
      <p className="font-semibold text-slate-900 break-words">{value}</p>
    </div>
  );
}

function TextBlock({ label, value, empty }: { label: string; value?: string; empty: string }) {
  return (
    <div>
      <p className="text-sm font-semibold text-slate-700 mb-2">{label}</p>
      <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 text-sm text-slate-700">
        {value?.trim() || empty}
      </div>
    </div>
  );
}

function TimelineItem({ icon, title, detail, active }: { icon: React.ReactNode; title: string; detail: string; active: boolean }) {
  return (
    <div className="flex gap-3">
      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${active ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-400'}`}>
        {icon}
      </div>
      <div>
        <p className="text-sm font-semibold text-slate-900">{title}</p>
        <p className="text-xs text-slate-500">{detail}</p>
      </div>
    </div>
  );
}
