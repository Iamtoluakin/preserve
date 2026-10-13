'use client';

import Link from 'next/link';
import { useState, useEffect, useCallback } from 'react';
import {
  ArrowLeft,
  Home,
  Plus,
  MapPin,
  Calendar,
  Building2,
  Search,
  Filter,
  Eye,
  FileText,
  Trash2,
  RefreshCw,
  Settings,
} from 'lucide-react';
import {
  readProperties,
  readWorkOrders,
  type PreserveProperty,
  type PreserveWorkOrder,
  writeProperties,
} from '@/lib/localData';

export default function PropertiesPage() {
  const [properties, setProperties] = useState<PreserveProperty[]>([]);
  const [workOrders, setWorkOrders] = useState<PreserveWorkOrder[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const loadData = useCallback(() => {
    setProperties(readProperties());
    setWorkOrders(readWorkOrders());
  }, []);

  useEffect(() => {
    loadData();
    window.addEventListener('focus', loadData);
    return () => window.removeEventListener('focus', loadData);
  }, [loadData]);

  const deleteProperty = (id: string) => {
    const updated = properties.filter(p => p.id !== id);
    setProperties(updated);
    writeProperties(updated);
    setConfirmDelete(null);
  };

  const getWorkOrderCount = (propertyId: string) =>
    workOrders.filter(wo => wo.propertyId === propertyId).length;

  const filteredProperties = properties.filter(p => {
    const matchesSearch =
      p.address?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.city?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.bankReference?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.county?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter =
      filterType === 'all' ||
      p.propertyType?.toLowerCase().replace(/[\s/]/g, '_') === filterType;
    return matchesSearch && matchesFilter;
  });

  const thisMonthCount = properties.filter(p => {
    if (!p.acquisitionDate) return false;
    const d = new Date(p.acquisitionDate);
    const now = new Date();
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  }).length;

  return (
    <div className="min-h-screen bg-[#f7fbff] text-slate-950">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-blue-100 bg-white/90 shadow-sm backdrop-blur-xl">
        <div className="px-3 sm:px-4 md:px-6 py-3 md:py-4">
          <div className="flex items-center justify-between gap-3">
            <Link href="/dashboard" className="flex items-center space-x-3">
              <div className="w-9 h-9 md:w-10 md:h-10 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl md:text-2xl">P</span>
              </div>
              <span className="text-xl md:text-2xl font-bold text-slate-900">Preserve</span>
            </Link>
            <div className="flex items-center gap-2 md:gap-3">
              <Link href="/dashboard" className="hidden sm:flex items-center gap-2 px-4 py-2 text-slate-600 hover:text-blue-600 transition text-sm font-medium">
                <ArrowLeft className="w-4 h-4" />
                Dashboard
              </Link>
              <button
                onClick={loadData}
                className="flex h-10 w-10 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-0 text-sm text-slate-700 shadow-sm transition hover:border-blue-200 hover:text-blue-700 sm:w-auto sm:px-4"
              >
                <RefreshCw className="w-4 h-4" />
                <span className="hidden sm:inline">Refresh</span>
              </button>
              <Link
                href="/dashboard/properties/add"
                className="flex h-10 items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-sky-500 px-3 text-sm font-bold text-white shadow-sm transition hover:-translate-y-0.5 sm:px-5"
              >
                <Plus className="w-4 h-4" />
                <span>Add<span className="hidden sm:inline"> Property</span></span>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-3 py-6 sm:px-4 md:px-6 md:py-8 pb-28 lg:pb-8">
        {/* Page Header */}
        <div className="relative isolate mb-6 overflow-hidden rounded-[1.75rem] border border-blue-100 bg-gradient-to-br from-blue-50 via-white to-sky-50 p-5 shadow-sm md:mb-8 md:p-7">
          <div aria-hidden="true" className="pointer-events-none absolute -right-12 -top-20 -z-10 h-56 w-56 rounded-full bg-blue-200/40 blur-3xl" />
          <p className="inline-flex rounded-full border border-blue-200 bg-white/85 px-3 py-1.5 text-[0.65rem] font-black uppercase tracking-[0.18em] text-blue-700 shadow-sm">Your homes in one place</p>
          <h1 className="mt-3 text-2xl font-black tracking-tight text-slate-950 md:text-3xl">Your Properties</h1>
          <p className="mt-1 text-sm leading-6 text-slate-600 md:text-base">Manage your homes and start a care plan for any property.</p>
        </div>

        {/* Stats */}
        <div className="mb-6 grid grid-cols-1 gap-3 min-[420px]:grid-cols-2 md:mb-8 md:grid-cols-3 md:gap-4">
          {[
            {
              label: 'Total Properties',
              value: properties.length,
              sub: 'Active listings',
              icon: <Home className="w-5 h-5 text-blue-600" />,
              bg: 'bg-blue-100',
            },
            {
              label: 'Total Work Orders',
              value: workOrders.length,
              sub: 'Across all properties',
              icon: <FileText className="w-5 h-5 text-green-600" />,
              bg: 'bg-sky-50',
            },
            {
              label: 'Added This Month',
              value: thisMonthCount,
              sub: 'New properties',
              icon: <Calendar className="w-5 h-5 text-purple-600" />,
              bg: 'bg-blue-50',
            },
          ].map(s => (
            <div key={s.label} className={`rounded-2xl border border-blue-100 bg-white p-3 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md md:p-5 ${s.label === 'Added This Month' ? 'min-[420px]:col-span-2 md:col-span-1' : ''}`}>
              <div className="flex items-start justify-between gap-2 mb-2">
                <span className="text-xs md:text-sm font-medium text-slate-600 leading-snug">{s.label}</span>
                <div className={`w-9 h-9 ${s.bg} rounded-lg flex items-center justify-center`}>{s.icon}</div>
              </div>
              <div className="text-2xl md:text-3xl font-bold text-slate-900">{s.value}</div>
              <div className="text-xs text-slate-500 mt-1">{s.sub}</div>
            </div>
          ))}
        </div>

        {/* Search & Filter */}
        <div className="mb-6 grid gap-3 rounded-2xl border border-blue-100 bg-white p-3 shadow-sm sm:flex sm:flex-wrap md:p-4">
          <div className="relative sm:flex-1 sm:min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search by address, city, county, or reference..."
              className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-xl bg-slate-50/70 text-sm text-slate-900 transition focus:border-blue-400 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-100"
            />
          </div>
          <div className="relative sm:w-auto">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <select
              value={filterType}
              onChange={e => setFilterType(e.target.value)}
              className="w-full sm:w-auto pl-9 pr-8 py-2.5 border border-slate-200 rounded-xl bg-slate-50/70 text-sm text-slate-900 transition focus:border-blue-400 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-100 bg-white"
            >
              <option value="all">All Property Types</option>
              <option value="single_family">Single Family</option>
              <option value="condo">Condo/Townhouse</option>
              <option value="multi_family">Multi-Family</option>
              <option value="commercial">Commercial</option>
            </select>
          </div>
        </div>

        {/* Properties List */}
        {filteredProperties.length === 0 ? (
          <div className="rounded-[1.5rem] border border-blue-100 bg-gradient-to-br from-white via-blue-50/40 to-white px-5 py-12 text-center shadow-sm md:p-14">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Home className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">No properties found</h3>
            <p className="text-slate-500 mb-6 text-sm">
              {searchQuery || filterType !== 'all'
                ? 'Try adjusting your search or filter criteria.'
                : 'Get started by adding your first property.'}
            </p>
            {!searchQuery && filterType === 'all' && (
              <Link
                href="/dashboard/properties/add"
                className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-semibold"
              >
                <Plus className="w-5 h-5" />
                Add Your First Property
              </Link>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredProperties.map(property => {
              const woCount = getWorkOrderCount(property.id);
              return (
                <div key={property.id} className="rounded-[1.5rem] border border-blue-100 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg">
                  <div className="p-4 sm:p-5 md:p-6">
                    <div className="flex items-start gap-3 md:gap-4">
                      {/* Icon */}
                      <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-sky-500 shadow-md shadow-blue-100 md:h-12 md:w-12">
                        <Home className="h-5 w-5 text-white md:h-6 md:w-6" />
                      </div>

                      {/* Main Info */}
                      <div className="flex-1 min-w-0">
                        <div className="mb-1 flex flex-col-reverse items-start justify-between gap-2 min-[440px]:flex-row min-[440px]:items-start">
                          <h3 className="break-words text-base font-black text-slate-950 md:text-lg">{property.address}</h3>
                          <span className="shrink-0 rounded-full bg-green-100 px-2.5 py-1 text-xs font-bold text-green-800">
                            {property.status || 'Active'}
                          </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-600 mb-3">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5" />
                            {property.city}, {property.state} {property.zip}
                          </span>
                          {property.county && (
                            <span className="text-slate-400">· {property.county}</span>
                          )}
                          {property.serviceArea && (
                            <span className="text-slate-400">· {property.serviceArea}</span>
                          )}
                        </div>

                        {woCount === 0 && <p className="mb-3 text-xs font-medium text-blue-700">Ready for its first home-care schedule?</p>}
                        <div className="flex flex-wrap gap-3 text-xs text-slate-500">
                          <span className="flex items-center gap-1">
                            <Building2 className="w-3.5 h-3.5" />
                            {property.propertyType || 'N/A'}
                          </span>
                          {property.acquisitionDate && (
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3.5 h-3.5" />
                              Added {new Date(property.acquisitionDate).toLocaleDateString()}
                            </span>
                          )}
                          {property.bankReference && (
                            <span className="flex items-center gap-1">
                              <FileText className="w-3.5 h-3.5" />
                              {property.bankReference}
                            </span>
                          )}
                          <span className={`flex items-center gap-1 font-semibold ${woCount > 0 ? 'text-blue-600' : 'text-slate-400'}`}>
                            {woCount} work order{woCount !== 1 ? 's' : ''}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="mt-4 grid grid-cols-1 gap-2 border-t border-blue-50 pt-4 min-[440px]:grid-cols-2 sm:flex sm:flex-wrap sm:items-center">
                      <Link
                        href={`/dashboard/properties/${property.id}`}
                        className="flex min-h-12 items-center justify-center gap-1.5 rounded-xl border border-blue-100 bg-white px-3 py-3 text-sm font-bold text-blue-700 transition hover:bg-blue-50 sm:min-h-11 sm:border-transparent sm:py-2.5"
                      >
                        <Eye className="w-4 h-4" />
                        View Details
                      </Link>
                      <Link
                        href={`/dashboard/work-orders/create?propertyId=${property.id}`}
                        className="flex min-h-12 items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-sky-500 px-3 py-3 text-sm font-bold text-white shadow-md shadow-blue-100 transition hover:-translate-y-0.5 sm:min-h-11 sm:py-2.5"
                      >
                        <Plus className="w-4 h-4" />
                        Start a Care Plan
                      </Link>

                      {confirmDelete === property.id ? (
                        <div className="min-[380px]:col-span-2 sm:col-span-1 flex flex-wrap items-center gap-2 sm:ml-auto">
                          <span className="text-xs text-red-600 font-medium">Delete this property?</span>
                          <button
                            onClick={() => deleteProperty(property.id)}
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
                          onClick={() => setConfirmDelete(property.id)}
                          className="flex min-h-12 items-center justify-center gap-1.5 rounded-xl border border-red-200 px-3 py-3 text-sm text-red-600 transition hover:bg-red-50 min-[440px]:col-span-2 sm:min-h-11 sm:ml-auto sm:py-2"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          Delete
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur border-t z-50 grid grid-cols-5 px-2 pt-2 pb-[calc(0.5rem+env(safe-area-inset-bottom))] shadow-[0_-8px_24px_rgba(15,23,42,0.08)]">
        <Link href="/dashboard" className="flex flex-col items-center gap-0.5 px-1 py-1.5 rounded-lg text-slate-500 hover:text-blue-600 transition">
          <Home className="w-5 h-5" />
          <span className="text-xs font-medium">Home</span>
        </Link>
        <Link href="/dashboard/properties" className="flex flex-col items-center gap-0.5 px-1 py-1.5 rounded-lg bg-blue-50 text-blue-600">
          <MapPin className="w-5 h-5" />
          <span className="text-xs font-medium">Properties</span>
        </Link>
        <Link href="/dashboard/work-orders/create" className="flex flex-col items-center gap-0.5">
          <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center shadow-lg -mt-5">
            <Plus className="w-6 h-6 text-white" />
          </div>
          <span className="text-xs font-medium text-slate-500 mt-0.5">New</span>
        </Link>
        <Link href="/dashboard/work-orders" className="flex flex-col items-center gap-0.5 px-1 py-1.5 rounded-lg text-slate-500 hover:text-blue-600 transition">
          <FileText className="w-5 h-5" />
          <span className="text-xs font-medium">Orders</span>
        </Link>
        <Link href="/dashboard/settings" className="flex flex-col items-center gap-0.5 px-1 py-1.5 rounded-lg text-slate-500 hover:text-blue-600 transition">
          <Settings className="w-5 h-5" />
          <span className="text-xs font-medium">Settings</span>
        </Link>
      </nav>
    </div>
  );
}
