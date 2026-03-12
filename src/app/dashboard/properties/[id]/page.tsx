'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft, Home, MapPin, FileText, Calendar, Building2, Plus, Clock, CheckCircle2, AlertCircle } from 'lucide-react';

export default function PropertyDetailPage() {
  const params = useParams();
  const [property, setProperty] = useState<any>(null);
  const [workOrders, setWorkOrders] = useState<any[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem('preserve_properties');
    if (stored) {
      const props = JSON.parse(stored);
      const found = props.find((p: any) => p.id === params.id);
      setProperty(found || null);
    }
    const storedWOs = localStorage.getItem('workOrders');
    if (storedWOs) {
      const all = JSON.parse(storedWOs);
      setWorkOrders(all.filter((wo: any) => wo.propertyId === params.id));
    }
  }, [params.id]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':   return 'bg-green-100 text-green-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'pending':     return 'bg-yellow-100 text-yellow-800';
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
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b sticky top-0 z-40">
        <div className="px-4 md:px-6 py-4 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-2xl">P</span>
            </div>
            <span className="text-2xl font-bold text-slate-900">Preserve</span>
          </Link>
          <Link href="/dashboard/properties" className="flex items-center gap-2 text-slate-600 hover:text-blue-600 transition text-sm">
            <ArrowLeft className="w-4 h-4" />
            Back to Properties
          </Link>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 md:px-6 py-8">
        {/* Property Header */}
        <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <Home className="w-7 h-7 text-blue-600" />
            </div>
            <div className="flex-1">
              <div className="flex flex-wrap items-start justify-between gap-2 mb-1">
                <h1 className="text-2xl font-bold text-slate-900">{property.address}</h1>
                <span className="px-3 py-1 rounded-full text-sm font-semibold bg-green-100 text-green-800">
                  {property.status || 'Active'}
                </span>
              </div>
              <p className="text-slate-600 flex items-center gap-1 mb-4">
                <MapPin className="w-4 h-4" />
                {property.city}, {property.state} {property.zip} · {property.county}
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="text-slate-500 mb-0.5">Property Type</p>
                  <p className="font-semibold text-slate-800 flex items-center gap-1">
                    <Building2 className="w-3.5 h-3.5" />{property.propertyType || 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-slate-500 mb-0.5">Bank Reference</p>
                  <p className="font-semibold text-slate-800 flex items-center gap-1">
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
                  <p className="font-semibold text-slate-800">{property.parcelId || 'N/A'}</p>
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
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <div className="px-6 py-4 border-b flex items-center justify-between">
            <h2 className="font-semibold text-slate-900">
              Work Orders ({workOrders.length})
            </h2>
            <Link
              href={`/dashboard/work-orders/create?propertyId=${property.id}`}
              className="flex items-center gap-1.5 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition text-sm font-medium"
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
                className="inline-flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 transition font-semibold text-sm"
              >
                <Plus className="w-4 h-4" />
                Create First Work Order
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {workOrders.map(wo => (
                <div key={wo.id} className="px-6 py-4 flex items-start gap-3 hover:bg-slate-50">
                  <div className="mt-0.5">{getStatusIcon(wo.status)}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="font-semibold text-slate-900 text-sm">{wo.orderNumber || `WO-${wo.id}`}</span>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${getStatusColor(wo.status)}`}>
                        {wo.status?.replace('-', ' ').toUpperCase()}
                      </span>
                    </div>
                    <p className="text-sm text-slate-700 truncate">{wo.serviceType || 'Service not specified'}</p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {wo.scheduledDate ? new Date(wo.scheduledDate).toLocaleDateString() : 'No date'} ·{' '}
                      {wo.totalCost > 0 ? `$${wo.totalCost.toLocaleString()}` : ''}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
