'use client';

import Link from 'next/link';
import { useState } from 'react';
import { 
  Home,
  FileText,
  Users,
  Calendar,
  MapPin,
  Clock,
  DollarSign,
  AlertCircle,
  CheckCircle2,
  UserCheck,
  Search,
  Settings,
  Filter
} from 'lucide-react';

// Sample data - will come from Supabase in production
const incomingWorkOrders = [
  {
    id: 'WO-2025-0234',
    customer: 'First National Bank',
    property: '1234 Main Street, Durham, NC',
    services: ['Lawn Mowing', 'Exterior Cleaning'],
    totalCost: 300,
    priority: 'normal',
    status: 'submitted',
    requestedDate: '2025-12-15',
    createdAt: '2025-12-13 09:30 AM'
  },
  {
    id: 'WO-2025-0235',
    customer: 'Community Savings Bank',
    property: '5678 Oak Avenue, Raleigh, NC',
    services: ['Winterization', 'Property Securing'],
    totalCost: 600,
    priority: 'high',
    status: 'submitted',
    requestedDate: '2025-12-14',
    createdAt: '2025-12-13 10:15 AM'
  },
  {
    id: 'WO-2025-0236',
    customer: 'Regional Credit Union',
    property: '9012 Pine Road, Charlotte, NC',
    services: ['Full Inspection', 'Photo Documentation'],
    totalCost: 250,
    priority: 'normal',
    status: 'in-progress',
    assignedTo: 'Mike Johnson',
    requestedDate: '2025-12-13',
    createdAt: '2025-12-12 02:45 PM'
  },
  {
    id: 'WO-2025-0237',
    customer: 'First National Bank',
    property: '3456 Elm Court, Durham, NC',
    services: ['Debris Removal', 'Pressure Washing'],
    totalCost: 700,
    priority: 'emergency',
    status: 'submitted',
    requestedDate: '2025-12-13',
    createdAt: '2025-12-13 11:00 AM'
  }
];

const technicians = [
  { id: '1', name: 'Mike Johnson', active: true, jobsToday: 3 },
  { id: '2', name: 'Sarah Williams', active: true, jobsToday: 2 },
  { id: '3', name: 'David Brown', active: false, jobsToday: 0 },
  { id: '4', name: 'Lisa Garcia', active: true, jobsToday: 4 }
];

export default function VendorDashboardPage() {
  const [filter, setFilter] = useState<'all' | 'submitted' | 'in-progress' | 'completed'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredOrders = incomingWorkOrders.filter(order => {
    const matchesFilter = filter === 'all' || order.status === filter;
    const matchesSearch = 
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.property.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const pendingCount = incomingWorkOrders.filter(o => o.status === 'submitted').length;
  const inProgressCount = incomingWorkOrders.filter(o => o.status === 'in-progress').length;
  const totalRevenue = incomingWorkOrders.reduce((sum, o) => sum + o.totalCost, 0);
  const activeTechs = technicians.filter(t => t.active).length;

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'emergency': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'normal': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'low': return 'bg-slate-100 text-slate-800 border-slate-200';
      default: return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'submitted': return 'bg-yellow-100 text-yellow-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      default: return 'bg-slate-100 text-slate-800';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 to-blue-800 text-white border-b sticky top-0 z-40">
        <div className="px-4 md:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 md:w-10 md:h-10 bg-white rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-blue-600 font-bold text-xl md:text-2xl">P</span>
              </div>
              <div>
                <h1 className="text-lg md:text-2xl font-bold leading-tight">Preserve</h1>
                <p className="text-blue-100 text-xs md:text-sm">Operations Portal</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 px-3 py-2 rounded-lg transition text-sm">
                <Users className="w-4 h-4" />
                <span className="hidden sm:inline">Team</span>
              </button>
              <Link 
                href="/dashboard"
                className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 px-3 py-2 rounded-lg transition text-sm"
              >
                <Home className="w-4 h-4" />
                <span className="hidden sm:inline">Client View</span>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 pb-24 lg:pb-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-gradient-to-br from-red-500 to-red-600 text-white rounded-xl shadow-lg p-4 md:p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="w-9 h-9 md:w-12 md:h-12 bg-white/20 rounded-lg flex items-center justify-center">
                <AlertCircle className="w-5 h-5 md:w-6 md:h-6" />
              </div>
              <span className="text-2xl md:text-3xl font-bold">{pendingCount}</span>
            </div>
            <h3 className="font-semibold text-sm md:text-base">Submitted Requests</h3>
            <p className="text-red-100 text-xs md:text-sm">Requires assignment</p>
          </div>

          <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl shadow-lg p-4 md:p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="w-9 h-9 md:w-12 md:h-12 bg-white/20 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 md:w-6 md:h-6" />
              </div>
              <span className="text-2xl md:text-3xl font-bold">{inProgressCount}</span>
            </div>
            <h3 className="font-semibold text-sm md:text-base">In Progress</h3>
            <p className="text-blue-100 text-xs md:text-sm">Active jobs</p>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-xl shadow-lg p-4 md:p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="w-9 h-9 md:w-12 md:h-12 bg-white/20 rounded-lg flex items-center justify-center">
                <DollarSign className="w-5 h-5 md:w-6 md:h-6" />
              </div>
              <span className="text-2xl md:text-3xl font-bold">${(totalRevenue / 1000).toFixed(1)}k</span>
            </div>
            <h3 className="font-semibold text-sm md:text-base">Total Revenue</h3>
            <p className="text-green-100 text-xs md:text-sm">This week</p>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-xl shadow-lg p-4 md:p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="w-9 h-9 md:w-12 md:h-12 bg-white/20 rounded-lg flex items-center justify-center">
                <UserCheck className="w-5 h-5 md:w-6 md:h-6" />
              </div>
              <span className="text-2xl md:text-3xl font-bold">{activeTechs}/{technicians.length}</span>
            </div>
            <h3 className="font-semibold text-sm md:text-base">Technicians</h3>
            <p className="text-purple-100 text-xs md:text-sm">On duty today</p>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white rounded-xl shadow-sm border p-4 md:p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search orders, customers, properties..."
                className="w-full pl-9 pr-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 text-sm"
              />
            </div>
            <Link 
              href="/vendor/work-orders"
              className="bg-sky-500 hover:bg-sky-600 text-white font-semibold px-4 py-2.5 rounded-lg transition flex items-center justify-center gap-2 text-sm whitespace-nowrap"
            >
              <FileText className="w-4 h-4" />
              Manage Work Orders
            </Link>
          </div>
          <div className="flex gap-2 flex-wrap">
            {(['all', 'submitted', 'in-progress'] as const).map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 rounded-lg font-medium transition text-sm ${
                  filter === f
                    ? f === 'submitted' ? 'bg-yellow-600 text-white' : 'bg-blue-600 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {f === 'all' ? 'All' : f === 'in-progress' ? 'In Progress' : 'Submitted'}
              </button>
            ))}
          </div>
        </div>

        {/* Work Orders List */}
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden mb-6">
          <div className="p-4 md:p-6 border-b bg-gradient-to-r from-slate-50 to-white">
            <h2 className="text-xl md:text-2xl font-bold text-slate-900 flex items-center gap-3">
              <FileText className="w-5 h-5 md:w-6 md:h-6 text-blue-600" />
              Incoming Work Orders
            </h2>
            <p className="text-slate-600 mt-1 text-sm">Service requests routed through PreserveHQ</p>
          </div>

          <div className="divide-y">
            {filteredOrders.length === 0 ? (
              <div className="p-10 text-center">
                <FileText className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-slate-900 mb-2">No work orders found</h3>
                <p className="text-slate-600 text-sm">
                  {searchQuery || filter !== 'all' ? 'Try adjusting your search or filter' : 'New work orders will appear here'}
                </p>
              </div>
            ) : (
              filteredOrders.map((order) => (
                <div key={order.id} className="p-4 md:p-6 hover:bg-slate-50 transition">
                  {/* Top row */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <h3 className="text-base font-bold text-slate-900">{order.id}</h3>
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getPriorityColor(order.priority)}`}>
                          {order.priority === 'emergency' ? '🚨 EMERGENCY' : order.priority.toUpperCase()}
                        </span>
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
                          {order.status.replace(/-/g, ' ').toUpperCase()}
                        </span>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-slate-600 text-sm">
                          <Users className="w-3.5 h-3.5 flex-shrink-0" />
                          <span className="font-medium truncate">{order.customer}</span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-600 text-sm">
                          <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                          <span className="truncate">{order.property}</span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-600 text-sm">
                          <Calendar className="w-3.5 h-3.5 flex-shrink-0" />
                          <span>Requested: {new Date(order.requestedDate).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="text-2xl md:text-3xl font-bold text-green-600">${order.totalCost}</div>
                      <p className="text-xs text-slate-500">Revenue</p>
                    </div>
                  </div>

                  {/* Services */}
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {order.services.map((service, idx) => (
                      <span key={idx} className="px-2.5 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                        {service}
                      </span>
                    ))}
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap items-center gap-2 pt-3 border-t">
                    {order.status === 'submitted' && (
                      <button className="px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium text-sm">
                        Assign Field Pro
                      </button>
                    )}
                    <button className="px-3 py-1.5 border border-slate-300 text-slate-700 rounded-lg hover:border-blue-600 hover:text-blue-600 transition font-medium text-sm">
                      View Details
                    </button>
                    <span className="text-xs text-slate-400 ml-auto">{order.createdAt}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Technicians Panel */}
        <div className="bg-white rounded-xl shadow-sm border p-4 md:p-6">
          <h3 className="text-lg md:text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-600" />
            Verified Field Pros
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {technicians.map((tech) => (
              <div 
                key={tech.id} 
                className={`p-3 md:p-4 rounded-lg border-2 ${
                  tech.active ? 'border-green-200 bg-green-50' : 'border-slate-200 bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${tech.active ? 'bg-green-500' : 'bg-slate-400'}`} />
                  <span className="font-semibold text-slate-900 text-sm truncate">{tech.name}</span>
                </div>
                <p className="text-xs text-slate-600">
                  {tech.active ? `${tech.jobsToday} jobs today` : 'Off duty'}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile Bottom Nav */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t z-50 flex items-center justify-around px-2 py-2">
        <Link href="/vendor/dashboard" className="flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-600">
          <Home className="w-5 h-5" />
          <span className="text-xs font-medium">Home</span>
        </Link>
        <Link href="/vendor/work-orders" className="flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-lg text-slate-500 hover:text-blue-600 transition">
          <FileText className="w-5 h-5" />
          <span className="text-xs font-medium">Orders</span>
        </Link>
        <Link href="/dashboard" className="flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-lg text-slate-500 hover:text-blue-600 transition">
          <Users className="w-5 h-5" />
          <span className="text-xs font-medium">Client View</span>
        </Link>
        <Link href="/vendor/onboarding" className="flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-lg text-slate-500">
          <Settings className="w-5 h-5" />
          <span className="text-xs font-medium">Profile</span>
        </Link>
      </nav>
    </div>
  );
}
