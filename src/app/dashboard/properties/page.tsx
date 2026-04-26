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
            <div className="flex items-center gap-3">
              <Link href="/dashboard" className="hidden sm:flex items-center gap-2 px-4 py-2 text-slate-600 hover:text-blue-600 transition text-sm font-medium">
                <ArrowLeft className="w-4 h-4" />
                Dashboard
              </Link>
              <button
                onClick={loadData}
                className="flex items-center gap-2 px-4 py-2 border border-slate-300 text-slate-600 rounded-lg hover:bg-slate-50 transition text-sm"
              >
                <RefreshCw className="w-4 h-4" />
                Refresh
              </button>
              <Link
                href="/dashboard/properties/add"
                className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 transition font-semibold text-sm"
              >
                <Plus className="w-4 h-4" />
                Add Property
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 md:px-6 py-8 pb-24 lg:pb-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Building2 className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Your Properties</h1>
              <p className="text-slate-600">Manage and track all your foreclosed and REO properties</p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
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
              bg: 'bg-green-100',
            },
            {
              label: 'Added This Month',
              value: thisMonthCount,
              sub: 'New properties',
              icon: <Calendar className="w-5 h-5 text-purple-600" />,
              bg: 'bg-purple-100',
            },
          ].map(s => (
            <div key={s.label} className="bg-white rounded-xl shadow-sm border p-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-slate-600">{s.label}</span>
                <div className={`w-9 h-9 ${s.bg} rounded-lg flex items-center justify-center`}>{s.icon}</div>
              </div>
              <div className="text-3xl font-bold text-slate-900">{s.value}</div>
              <div className="text-xs text-slate-500 mt-1">{s.sub}</div>
            </div>
          ))}
        </div>

        {/* Search & Filter */}
        <div className="bg-white rounded-xl shadow-sm border p-4 mb-6 flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search by address, city, county, or reference..."
              className="w-full pl-9 pr-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <select
              value={filterType}
              onChange={e => setFilterType(e.target.value)}
              className="pl-9 pr-8 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 bg-white"
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
          <div className="bg-white rounded-xl shadow-sm border p-14 text-center">
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
                <div key={property.id} className="bg-white rounded-xl shadow-sm border hover:shadow-md transition">
                  <div className="p-5 md:p-6">
                    <div className="flex items-start gap-4">
                      {/* Icon */}
                      <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Home className="w-6 h-6 text-blue-600" />
                      </div>

                      {/* Main Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-start justify-between gap-2 mb-1">
                          <h3 className="text-lg font-semibold text-slate-900">{property.address}</h3>
                          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-800 flex-shrink-0">
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
                        </div>

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
                    <div className="mt-4 pt-4 border-t border-slate-100 flex flex-wrap items-center gap-2">
                      <Link
                        href={`/dashboard/properties/${property.id}`}
                        className="flex items-center gap-1.5 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition text-sm font-medium"
                      >
                        <Eye className="w-4 h-4" />
                        View Details
                      </Link>
                      <Link
                        href={`/dashboard/work-orders/create?propertyId=${property.id}`}
                        className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium"
                      >
                        <Plus className="w-4 h-4" />
                        Create Work Order
                      </Link>

                      {confirmDelete === property.id ? (
                        <div className="flex items-center gap-2 ml-auto">
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
                          className="flex items-center gap-1.5 px-3 py-1.5 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition text-sm ml-auto"
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
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t z-50 flex items-center justify-around px-2 py-2">
        <Link href="/dashboard" className="flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-lg text-slate-500 hover:text-blue-600 transition">
          <Home className="w-5 h-5" />
          <span className="text-xs font-medium">Home</span>
        </Link>
        <Link href="/dashboard/properties" className="flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-600">
          <MapPin className="w-5 h-5" />
          <span className="text-xs font-medium">Properties</span>
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
