'use client';

import Link from 'next/link';
import { useState } from 'react';
import { 
  Home,
  FileText,
  Users,
  TrendingUp,
  Calendar,
  MapPin,
  Clock,
  DollarSign,
  AlertCircle,
  CheckCircle2,
  UserCheck,
  Search,
  Filter
} from 'lucide-react';

// Sample data - will come from Supabase in production
const incomingWorkOrders = [
  {
    id: 'WO-2025-0234',
    client: 'First National Bank',
    property: '1234 Main Street, Durham, NC',
    services: ['Lawn Mowing', 'Exterior Cleaning'],
    totalCost: 300,
    priority: 'normal',
    status: 'pending',
    requestedDate: '2025-12-15',
    createdAt: '2025-12-13 09:30 AM'
  },
  {
    id: 'WO-2025-0235',
    client: 'Community Savings Bank',
    property: '5678 Oak Avenue, Raleigh, NC',
    services: ['Winterization', 'Property Securing'],
    totalCost: 600,
    priority: 'high',
    status: 'pending',
    requestedDate: '2025-12-14',
    createdAt: '2025-12-13 10:15 AM'
  },
  {
    id: 'WO-2025-0236',
    client: 'Regional Credit Union',
    property: '9012 Pine Road, Charlotte, NC',
    services: ['Full Inspection', 'Photo Documentation'],
    totalCost: 250,
    priority: 'normal',
    status: 'in_progress',
    assignedTo: 'Mike Johnson',
    requestedDate: '2025-12-13',
    createdAt: '2025-12-12 02:45 PM'
  },
  {
    id: 'WO-2025-0237',
    client: 'First National Bank',
    property: '3456 Elm Court, Durham, NC',
    services: ['Debris Removal', 'Pressure Washing'],
    totalCost: 700,
    priority: 'emergency',
    status: 'pending',
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
  const [filter, setFilter] = useState<'all' | 'pending' | 'in_progress' | 'completed'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredOrders = incomingWorkOrders.filter(order => {
    const matchesFilter = filter === 'all' || order.status === filter;
    const matchesSearch = 
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.property.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const pendingCount = incomingWorkOrders.filter(o => o.status === 'pending').length;
  const inProgressCount = incomingWorkOrders.filter(o => o.status === 'in_progress').length;
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
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      default: return 'bg-slate-100 text-slate-800';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 to-blue-800 text-white border-b">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                <span className="text-blue-600 font-bold text-2xl">P</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold">Preserve</h1>
                <p className="text-blue-100 text-sm">Vendor Dashboard</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg transition">
                <Users className="w-5 h-5" />
                <span className="hidden md:inline">Team</span>
              </button>
              <Link 
                href="/dashboard"
                className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg transition"
              >
                Switch to Client View
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-red-500 to-red-600 text-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                <AlertCircle className="w-6 h-6" />
              </div>
              <span className="text-3xl font-bold">{pendingCount}</span>
            </div>
            <h3 className="font-semibold mb-1">Pending Orders</h3>
            <p className="text-red-100 text-sm">Requires assignment</p>
          </div>

          <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6" />
              </div>
              <span className="text-3xl font-bold">{inProgressCount}</span>
            </div>
            <h3 className="font-semibold mb-1">In Progress</h3>
            <p className="text-blue-100 text-sm">Active jobs</p>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6" />
              </div>
              <span className="text-3xl font-bold">${(totalRevenue / 1000).toFixed(1)}k</span>
            </div>
            <h3 className="font-semibold mb-1">Total Revenue</h3>
            <p className="text-green-100 text-sm">This week</p>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                <UserCheck className="w-6 h-6" />
              </div>
              <span className="text-3xl font-bold">{activeTechs}/{technicians.length}</span>
            </div>
            <h3 className="font-semibold mb-1">Active Technicians</h3>
            <p className="text-purple-100 text-sm">On duty today</p>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by work order, client, or property..."
                className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900"
              />
            </div>
            <Link 
              href="/vendor/work-orders"
              className="bg-sky-500 hover:bg-sky-600 text-white font-semibold px-6 py-3 rounded-lg transition-colors flex items-center gap-2 whitespace-nowrap"
            >
              <FileText className="w-5 h-5" />
              Manage Work Orders
            </Link>
          </div>
          <div className="flex gap-2 mt-4">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                filter === 'all' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('pending')}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                filter === 'pending' 
                  ? 'bg-yellow-600 text-white' 
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Pending
            </button>
            <button
              onClick={() => setFilter('in_progress')}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                filter === 'in_progress' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              In Progress
            </button>
          </div>
        </div>

        {/* Work Orders List */}
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden mb-8">
          <div className="p-6 border-b bg-gradient-to-r from-slate-50 to-white">
            <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
              <FileText className="w-6 h-6 text-blue-600" />
              Incoming Work Orders
            </h2>
            <p className="text-slate-600 mt-1">New service requests from your clients</p>
          </div>

          <div className="divide-y">
            {filteredOrders.length === 0 ? (
              <div className="p-12 text-center">
                <FileText className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-slate-900 mb-2">No work orders found</h3>
                <p className="text-slate-600">
                  {searchQuery || filter !== 'all' 
                    ? 'Try adjusting your search or filter' 
                    : 'New work orders will appear here'}
                </p>
              </div>
            ) : (
              filteredOrders.map((order) => (
                <div key={order.id} className="p-6 hover:bg-slate-50 transition">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-bold text-slate-900">{order.id}</h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getPriorityColor(order.priority)}`}>
                          {order.priority === 'emergency' ? '🚨 EMERGENCY' : order.priority.toUpperCase()}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
                          {order.status.replace('_', ' ').toUpperCase()}
                        </span>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-slate-600">
                          <Users className="w-4 h-4" />
                          <span className="font-medium">{order.client}</span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-600">
                          <MapPin className="w-4 h-4" />
                          <span>{order.property}</span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-600">
                          <Calendar className="w-4 h-4" />
                          <span>Requested: {new Date(order.requestedDate).toLocaleDateString()}</span>
                          {order.assignedTo && (
                            <>
                              <span className="text-slate-400">•</span>
                              <UserCheck className="w-4 h-4" />
                              <span>Assigned to: {order.assignedTo}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="text-right ml-6">
                      <div className="text-3xl font-bold text-green-600 mb-1">
                        ${order.totalCost}
                      </div>
                      <p className="text-sm text-slate-500">Revenue</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t">
                    <div>
                      <p className="text-sm text-slate-600 mb-2">Services Requested:</p>
                      <div className="flex flex-wrap gap-2">
                        {order.services.map((service, idx) => (
                          <span key={idx} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                            {service}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {order.status === 'pending' && (
                        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium">
                          Assign Technician
                        </button>
                      )}
                      <button className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:border-blue-600 hover:text-blue-600 transition font-medium">
                        View Details
                      </button>
                    </div>
                  </div>

                  <div className="mt-3 text-xs text-slate-500">
                    Submitted: {order.createdAt}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Technicians Panel */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
            <Users className="w-6 h-6 text-blue-600" />
            Field Technicians
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {technicians.map((tech) => (
              <div 
                key={tech.id} 
                className={`p-4 rounded-lg border-2 ${
                  tech.active 
                    ? 'border-green-200 bg-green-50' 
                    : 'border-slate-200 bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className={`w-3 h-3 rounded-full ${tech.active ? 'bg-green-500' : 'bg-slate-400'}`} />
                  <span className="font-semibold text-slate-900">{tech.name}</span>
                </div>
                <p className="text-sm text-slate-600">
                  {tech.active ? `${tech.jobsToday} jobs today` : 'Off duty'}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
