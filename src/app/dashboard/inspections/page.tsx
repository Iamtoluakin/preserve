'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Camera,
  Calendar,
  CheckCircle2,
  Clock,
  FileText,
  Home,
  MapPin,
  Plus,
  Settings,
} from 'lucide-react';
import { readWorkOrders, type PreserveWorkOrder } from '@/lib/localData';

export default function InspectionsPage() {
  const [workOrders, setWorkOrders] = useState<PreserveWorkOrder[]>([]);

  useEffect(() => {
    setWorkOrders(readWorkOrders());
  }, []);

  const inspectionOrders = useMemo(() => {
    return workOrders.filter(order => {
      const text = `${order.serviceType} ${order.description || ''}`.toLowerCase();
      return text.includes('inspection') || text.includes('photo') || text.includes('documentation');
    });
  }, [workOrders]);

  const completed = inspectionOrders.filter(order => order.status === 'completed').length;
  const upcoming = inspectionOrders.filter(order => order.status === 'pending' || order.status === 'in-progress').length;

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b sticky top-0 z-40">
        <div className="px-4 md:px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/dashboard" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-2xl">P</span>
              </div>
              <span className="text-2xl font-bold text-slate-900">Preserve</span>
            </Link>
            <Link href="/dashboard" className="flex items-center gap-2 text-slate-600 hover:text-blue-600 transition text-sm">
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 md:px-6 py-8 pb-24 lg:pb-8">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Camera className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Inspections</h1>
              <p className="text-slate-600">Review photo documentation and property checkups</p>
            </div>
          </div>
          <Link
            href="/dashboard/work-orders/create"
            className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 transition font-semibold text-sm"
          >
            <Plus className="w-4 h-4" />
            Request Inspection
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <MetricCard title="Inspection Orders" value={inspectionOrders.length.toString()} icon={<FileText className="w-5 h-5 text-blue-600" />} />
          <MetricCard title="Upcoming" value={upcoming.toString()} icon={<Clock className="w-5 h-5 text-amber-600" />} />
          <MetricCard title="Completed" value={completed.toString()} icon={<CheckCircle2 className="w-5 h-5 text-green-600" />} />
        </div>

        <section className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <div className="p-5 border-b">
            <h2 className="text-xl font-semibold text-slate-900">Inspection Activity</h2>
          </div>

          {inspectionOrders.length === 0 ? (
            <div className="p-12 text-center">
              <Camera className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-slate-900 mb-2">No inspections yet</h3>
              <p className="text-sm text-slate-500 mb-6">Create a work order for a full inspection or photo documentation.</p>
              <Link
                href="/dashboard/work-orders/create"
                className="inline-flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 transition font-semibold text-sm"
              >
                <Plus className="w-4 h-4" />
                Create Inspection Work Order
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {inspectionOrders.map(order => (
                <Link
                  key={order.id}
                  href={`/dashboard/work-orders/${order.id}`}
                  className="block p-5 hover:bg-slate-50 transition"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-slate-900">{order.serviceType || 'Inspection'}</p>
                      <p className="text-sm text-slate-500 flex items-center gap-1 mt-1">
                        <MapPin className="w-3.5 h-3.5" />
                        {order.propertyAddress || 'Property not assigned'}
                      </p>
                    </div>
                    <div className="text-sm text-slate-500 flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {order.scheduledDate ? new Date(order.scheduledDate).toLocaleDateString() : 'Not scheduled'}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      </main>

      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t z-50 flex items-center justify-around px-2 py-2">
        <Link href="/dashboard" className="flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-lg text-slate-500 hover:text-blue-600 transition">
          <Home className="w-5 h-5" />
          <span className="text-xs font-medium">Home</span>
        </Link>
        <Link href="/dashboard/inspections" className="flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-600">
          <Camera className="w-5 h-5" />
          <span className="text-xs font-medium">Inspect</span>
        </Link>
        <Link href="/dashboard/work-orders/create" className="flex flex-col items-center gap-0.5">
          <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center shadow-lg -mt-5">
            <Plus className="w-6 h-6 text-white" />
          </div>
          <span className="text-xs font-medium text-slate-500 mt-0.5">New</span>
        </Link>
        <Link href="/dashboard/work-orders" className="flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-lg text-slate-500 hover:text-blue-600 transition">
          <FileText className="w-5 h-5" />
          <span className="text-xs font-medium">Orders</span>
        </Link>
        <Link href="/dashboard/settings" className="flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-lg text-slate-500 hover:text-blue-600 transition">
          <Settings className="w-5 h-5" />
          <span className="text-xs font-medium">Settings</span>
        </Link>
      </nav>
    </div>
  );
}

function MetricCard({ title, value, icon }: { title: string; value: string; icon: React.ReactNode }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border p-5">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-slate-600">{title}</span>
        <div className="w-9 h-9 bg-slate-100 rounded-lg flex items-center justify-center">{icon}</div>
      </div>
      <div className="text-3xl font-bold text-slate-900">{value}</div>
    </div>
  );
}
