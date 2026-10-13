'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft, Home, MapPin, FileText, Calendar, Building2, Plus, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import {
  formatWorkOrderStatus,
  readProperties,
  readWorkOrders,
  type PreserveProperty,
  type PreserveWorkOrder,
} from '@/lib/localData';

export default function PropertyDetailPage() {
  const params = useParams();
  const [property, setProperty] = useState<PreserveProperty | null>(null);
  const [workOrders, setWorkOrders] = useState<PreserveWorkOrder[]>([]);

  useEffect(() => {
    const propertyId = String(params.id);
    setProperty(readProperties().find(p => p.id === propertyId) || null);
    setWorkOrders(readWorkOrders().filter(wo => wo.propertyId === propertyId));
  }, [params.id]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':   return 'bg-green-100 text-green-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'submitted':
      case 'under-review':
      case 'awaiting-assignment':
      case 'awaiting-bid-approval':
      case 'awaiting-quality-review':
      case 'awaiting-customer-approval':
        return 'bg-yellow-100 text-yellow-800';
      default:            return 'bg-slate-100 text-slate-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':   return <CheckCircle2 className="w-4 h-4 text-green-600" />;
      case 'in-progress': return <Clock className="w-4 h-4 text-blue-600" />;
      default:            return <AlertCircle className="w-4 h-4 text-yellow-500" />;
    }
  };

  if (!property) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <Home className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-slate-700 mb-2">Property not found</h2>
          <Link href="/dashboard/properties" className="text-blue-600 hover:underline">Back to Properties</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7fbff] text-slate-950">
      <header className="sticky top-0 z-40 border-b border-blue-100 bg-white/90 shadow-sm backdrop-blur-xl">
        <div className="px-3 sm:px-4 md:px-6 py-3 md:py-4 flex items-center justify-between gap-3">
          <Link href="/dashboard" className="flex items-center space-x-3">
            <div className="w-9 h-9 md:w-10 md:h-10 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl md:text-2xl">P</span>
            </div>
            <span className="text-xl md:text-2xl font-bold text-slate-900">Preserve</span>
          </Link>
          <Link href="/dashboard/properties" className="flex items-center gap-2 text-slate-600 hover:text-blue-600 transition text-sm">
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Back to Properties</span>
            <span className="sm:hidden">Properties</span>
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-3 py-6 sm:px-4 md:px-6 md:py-8">
        <div className="relative isolate mb-6 overflow-hidden rounded-[1.75rem] border border-blue-100 bg-gradient-to-br from-blue-50 via-white to-sky-50 p-5 shadow-sm md:p-7">
          <div aria-hidden="true" className="pointer-events-none absolute -right-12 -top-20 -z-10 h-56 w-56 rounded-full bg-blue-200/40 blur-3xl" />
          <p className="inline-flex rounded-full border border-blue-200 bg-white/85 px-3 py-1.5 text-[0.65rem] font-black uppercase tracking-[0.18em] text-blue-700 shadow-sm">Property profile</p>
          <h1 className="mt-3 text-2xl font-black tracking-tight text-slate-950 md:text-3xl">Home details and care history</h1>
          <p className="mt-1 text-sm leading-6 text-slate-600">Review this home and keep its maintenance and service work organized.</p>
        </div>
        {/* Property Header */}
        <div className="mb-6 rounded-[1.5rem] border border-blue-100 bg-white p-4 shadow-sm md:p-6">
          <div className="flex flex-col gap-4 min-[520px]:flex-row min-[520px]:items-start md:gap-4">
            <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-sky-500 shadow-md shadow-blue-100 md:h-14 md:w-14">
              <Home className="h-6 w-6 text-white md:h-7 md:w-7" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="mb-1 flex flex-col-reverse items-start justify-between gap-2 min-[440px]:flex-row">
                <h2 className="break-words text-xl font-black text-slate-950 md:text-2xl">{property.address}</h2>
                <span className="px-3 py-1 rounded-full text-sm font-semibold bg-green-100 text-green-800">
                  {property.status || 'Active'}
                </span>
              </div>
              <p className="text-sm md:text-base text-slate-600 flex items-start gap-1 mb-4 break-words">
                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>{property.city}, {property.state} {property.zip} · {property.county}</span>
              </p>
              <div className="grid grid-cols-1 gap-3 min-[380px]:grid-cols-2 md:grid-cols-4 md:gap-4 text-sm">
                <div>
                  <p className="text-slate-500 mb-0.5">Property Type</p>
                  <p className="font-semibold text-slate-800 flex items-center gap-1 break-words">
                    <Building2 className="w-3.5 h-3.5" />{property.propertyType || 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-slate-500 mb-0.5">Bank Reference</p>
                  <p className="font-semibold text-slate-800 flex items-center gap-1 break-all">
                    <FileText className="w-3.5 h-3.5" />{property.bankReference || 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-slate-500 mb-0.5">Acquired</p>
                  <p className="font-semibold text-slate-800 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {property.acquisitionDate ? new Date(property.acquisitionDate).toLocaleDateString() : 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-slate-500 mb-0.5">Parcel ID</p>
                  <p className="font-semibold text-slate-800 break-all">{property.parcelId || 'N/A'}</p>
                </div>
              </div>
              {property.notes && (
                <div className="mt-4 p-3 bg-slate-50 rounded-lg text-sm text-slate-600">
                  <strong>Notes:</strong> {property.notes}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Work Orders */}
        <div className="overflow-hidden rounded-[1.5rem] border border-blue-100 bg-white shadow-sm">
          <div className="flex flex-col gap-3 border-b border-blue-50 px-4 py-4 min-[440px]:flex-row min-[440px]:items-center min-[440px]:justify-between md:px-6">
            <h2 className="font-semibold text-slate-900">
              Work Orders &amp; Maintenance ({workOrders.length})
            </h2>
            <Link
              href={`/dashboard/work-orders/create?propertyId=${property.id}`}
              className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-sky-500 px-4 py-2.5 text-sm font-bold text-white shadow-md shadow-blue-100 transition hover:-translate-y-0.5 hover:from-blue-700 hover:to-sky-600 min-[380px]:w-auto"
            >
              <Plus className="w-4 h-4" />
              Create Work Order
            </Link>
          </div>

          {workOrders.length === 0 ? (
            <div className="py-14 text-center">
              <FileText className="w-10 h-10 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500 mb-4 text-sm">No work orders for this property yet.</p>
              <Link
                href={`/dashboard/work-orders/create?propertyId=${property.id}`}
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-sky-500 px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-blue-100 transition hover:-translate-y-0.5"
              >
                <Plus className="w-4 h-4" />
                Create First Work Order
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {workOrders.map(wo => (
                <Link
                  key={wo.id}
                  href={`/dashboard/work-orders/${wo.id}`}
                  className="flex items-start gap-3 px-4 py-4 transition hover:bg-blue-50/40 md:px-6"
                >
                  <div className="mt-0.5">{getStatusIcon(wo.status)}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="font-semibold text-slate-900 text-sm">{wo.orderNumber || `WO-${wo.id}`}</span>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${getStatusColor(wo.status)}`}>
                        {formatWorkOrderStatus(wo.status).toUpperCase()}
                      </span>
                    </div>
                    <p className="text-sm text-slate-700 break-words md:truncate">{wo.serviceType || 'Service not specified'}</p>
                    {wo.maintenancePlan?.length ? <span className="mt-1 inline-flex rounded-full bg-sky-50 px-2 py-0.5 text-xs font-bold text-sky-800">Maintenance plan · {wo.maintenancePlan.length} tasks · {wo.billingFrequency} preferred</span> : null}
                    {wo.pricingStatus === 'quote-pending' && <span className="ml-2 mt-1 inline-flex rounded-full bg-amber-50 px-2 py-0.5 text-xs font-bold text-amber-800">Quote pending</span>}
                    <p className="text-xs text-slate-400 mt-0.5">
                      {wo.scheduledDate ? new Date(wo.scheduledDate).toLocaleDateString() : 'No date'} ·{' '}
                      {wo.totalCost > 0 ? `$${wo.totalCost.toLocaleString()}` : ''}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
