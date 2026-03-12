'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Plus,
  Clock,
  CheckCircle2,
  AlertCircle,
  Calendar,
  MapPin,
  Search,
  Filter,
  Trash2,
  RefreshCw,
  FileText,
  ChevronDown,
} from 'lucide-react';

type WorkOrder = {
  id: string;
  orderNumber: string;
  propertyAddress: string;
  serviceType: string;
  status: 'pending' | 'in-progress' | 'completed' | 'cancelled';
  priority: string;
  scheduledDate: string;
  billingFrequency: string;
  totalCost: number;
  createdAt: string;
};

const STATUS_OPTIONS = ['all', 'pending', 'in-progress', 'completed', 'cancelled'];

export default function WorkOrdersPage() {
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);

  const loadOrders = useCallback(() => {
    const stored = localStorage.getItem('workOrders');
    if (stored) {
      try {
        setWorkOrders(JSON.parse(stored));
      } catch {
        setWorkOrders([]);
      }
    } else {
      setWorkOrders([]);
    }
  }, []);

  useEffect(() => {
    loadOrders();
    window.addEventListener('focus', loadOrders);
    return () => window.removeEventListener('focus', loadOrders);
  }, [loadOrders]);

  const updateStatus = (id: string, newStatus: WorkOrder['status']) => {
    const updated = workOrders.map(wo =>
      wo.id === id ? { ...wo, status: newStatus } : wo
    );
    setWorkOrders(updated);
    localStorage.setItem('workOrders', JSON.stringify(updated));
    setUpdatingStatus(null);
  };

  const deleteOrder = (id: string) => {
    const updated = workOrders.filter(wo => wo.id !== id);
    setWorkOrders(updated);
    localStorage.setItem('workOrders', JSON.stringify(updated));
    setConfirmDelete(null);
  };

  const filtered = workOrders.filter(wo => {
    const matchesSearch =
      (wo.orderNumber?.toLowerCase().includes(search.toLowerCase())) ||
      (wo.propertyAddress?.toLowerCase().includes(search.toLowerCase())) ||
      (wo.serviceType?.toLowerCase().includes(search.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || wo.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const counts = {
    total: workOrders.length,
    pending: workOrders.filter(wo => wo.status === 'pending').length,
    inProgress: workOrders.filter(wo => wo.status === 'in-progress').length,
    completed: workOrders.filter(wo => wo.status === 'completed').length,
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':   return 'bg-green-100 text-green-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'pending':     return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':   return 'bg-red-100 text-red-800';
      default:            return 'bg-slate-100 text-slate-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':   return <CheckCircle2 className="w-5 h-5 text-green-600" />;
      case 'in-progress': return <Clock className="w-5 h-5 text-blue-600" />;
      case 'pending':     return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      default:            return <Clock className="w-5 h-5 text-slate-400" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority?.toLowerCase()) {
      case 'emergency': return 'text-red-600 bg-red-50';
      case 'high':      return 'text-orange-600 bg-orange-50';
      case 'low':       return 'text-green-600 bg-green-50';
      default:          return 'text-blue-600 bg-blue-50';
    }
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return 'Not scheduled';
    try {
      return new Date(dateStr).toLocaleDateString('en-US', {
        month: 'short', day: 'numeric', year: 'numeric'
      });
    } catch { return 'Invalid date'; }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
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

      <main className="max-w-7xl mx-auto px-4 md:px-6 py-8">
        {/* Page Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-1">Work Orders</h1>
            <p className="text-slate-600">Manage and track all service requests</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={loadOrders}
              className="flex items-center gap-2 px-4 py-2 border border-slate-300 text-slate-600 rounded-lg hover:bg-slate-50 transition text-sm"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
            <Link
              href="/dashboard/work-orders/create"
              className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 transition font-semibold text-sm"
            >
              <Plus className="w-4 h-4" />
              Create Work Order
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Orders', value: counts.total, icon: <FileText className="w-5 h-5 text-slate-500" />, color: 'text-slate-900' },
            { label: 'Pending', value: counts.pending, icon: <AlertCircle className="w-5 h-5 text-yellow-500" />, color: 'text-yellow-600' },
            { label: 'In Progress', value: counts.inProgress, icon: <Clock className="w-5 h-5 text-blue-500" />, color: 'text-blue-600' },
            { label: 'Completed', value: counts.completed, icon: <CheckCircle2 className="w-5 h-5 text-green-500" />, color: 'text-green-600' },
          ].map(stat => (
            <div key={stat.label} className="bg-white rounded-xl shadow-sm border p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-slate-600">{stat.label}</span>
                {stat.icon}
              </div>
              <div className={`text-3xl font-bold ${stat.color}`}>{stat.value}</div>
            </div>
          ))}
        </div>

        {/* Search & Filter */}
        <div className="bg-white rounded-xl border shadow-sm p-4 mb-6 flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by order #, address, or service..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="pl-9 pr-8 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 bg-white"
            >
              {STATUS_OPTIONS.map(s => (
                <option key={s} value={s}>
                  {s === 'all' ? 'All Statuses' : s.charAt(0).toUpperCase() + s.slice(1).replace('-', ' ')}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Work Orders List */}
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <div className="px-6 py-4 border-b flex items-center justify-between">
            <h2 className="font-semibold text-slate-900">
              {filtered.length} Work Order{filtered.length !== 1 ? 's' : ''}
              {statusFilter !== 'all' && ` · ${statusFilter}`}
            </h2>
          </div>

          {filtered.length === 0 ? (
            <div className="py-16 text-center">
              <FileText className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-700 mb-2">No work orders found</h3>
              <p className="text-slate-500 mb-6 text-sm">
                {workOrders.length === 0
                  ? 'Create your first work order to get started.'
                  : 'Try adjusting your search or filter.'}
              </p>
              {workOrders.length === 0 && (
                <Link
                  href="/dashboard/work-orders/create"
                  className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-semibold"
                >
                  <Plus className="w-4 h-4" />
                  Create Work Order
                </Link>
              )}
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {filtered.map(order => (
                <div key={order.id} className="p-5 md:p-6 hover:bg-slate-50 transition">
                  <div className="flex items-start gap-4">
                    <div className="mt-0.5 flex-shrink-0">{getStatusIcon(order.status)}</div>

                    <div className="flex-1 min-w-0">
                      {/* Top Row */}
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <span className="font-bold text-slate-900 text-sm">
                          {order.orderNumber || `WO-${order.id}`}
                        </span>
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
                          {order.status?.replace('-', ' ').toUpperCase()}
                        </span>
                        {order.priority && (
                          <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${getPriorityColor(order.priority)}`}>
                            {order.priority.charAt(0).toUpperCase() + order.priority.slice(1)} Priority
                          </span>
                        )}
                      </div>

                      {/* Service Type */}
                      <p className="text-base font-semibold text-slate-800 mb-2 truncate">
                        {order.serviceType || 'Service not specified'}
                      </p>

                      {/* Details */}
                      <div className="flex flex-wrap gap-x-5 gap-y-1 text-sm text-slate-600">
                        {order.propertyAddress && (
                          <div className="flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                            <span className="truncate max-w-xs">{order.propertyAddress}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 flex-shrink-0" />
                          <span>{formatDate(order.scheduledDate)}</span>
                        </div>
                        {order.totalCost > 0 && (
                          <div className="flex items-center gap-1.5 font-medium text-green-700">
                            <span>${order.totalCost.toLocaleString()}</span>
                            {order.billingFrequency && order.billingFrequency !== 'one-time' && (
                              <span className="text-slate-400 font-normal">/ {order.billingFrequency}</span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Created date on desktop */}
                    <div className="hidden md:block text-right flex-shrink-0">
                      <p className="text-xs text-slate-400">
                        {order.createdAt
                          ? new Date(order.createdAt).toLocaleDateString()
                          : ''}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-4 pt-4 border-t border-slate-100 flex flex-wrap items-center gap-2">
                    {/* Status Update */}
                    {updatingStatus === order.id ? (
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs text-slate-500 font-medium">Set status:</span>
                        {(['pending', 'in-progress', 'completed', 'cancelled'] as WorkOrder['status'][]).map(s => (
                          <button
                            key={s}
                            onClick={() => updateStatus(order.id, s)}
                            className={`px-3 py-1 rounded-full text-xs font-semibold border transition ${getStatusColor(s)} border-transparent hover:opacity-80`}
                          >
                            {s.replace('-', ' ')}
                          </button>
                        ))}
                        <button
                          onClick={() => setUpdatingStatus(null)}
                          className="px-3 py-1 text-xs text-slate-500 hover:text-slate-700"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <>
                        <button
                          onClick={() => setUpdatingStatus(order.id)}
                          className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition text-sm"
                        >
                          <ChevronDown className="w-3.5 h-3.5" />
                          Update Status
                        </button>

                        {order.status !== 'completed' && (
                          <button
                            onClick={() => updateStatus(order.id, 'completed')}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm font-medium"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Mark Complete
                          </button>
                        )}

                        {confirmDelete === order.id ? (
                          <div className="flex items-center gap-2 ml-auto">
                            <span className="text-xs text-red-600 font-medium">Delete this order?</span>
                            <button
                              onClick={() => deleteOrder(order.id)}
                              className="px-3 py-1.5 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition"
                            >
                              Yes, Delete
                            </button>
                            <button
                              onClick={() => setConfirmDelete(null)}
                              className="px-3 py-1.5 border border-slate-300 text-slate-600 rounded-lg text-sm hover:bg-slate-50 transition"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setConfirmDelete(order.id)}
                            className="flex items-center gap-1.5 px-3 py-1.5 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition text-sm ml-auto"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            Delete
                          </button>
                        )}
                      </>
                    )}
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
