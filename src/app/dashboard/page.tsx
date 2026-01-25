'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import ThemeToggle from '@/components/ThemeToggle';
import {
  Home,
  FileText, 
  Camera, 
  Settings,
  Plus,
  Search,
  Bell,
  User,
  MapPin,
  Calendar,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  BarChart3
} from 'lucide-react';
import WorkOrderAnalytics from '@/components/WorkOrderAnalytics';
import WorkOrderCalendar from '@/components/WorkOrderCalendar';

export default function DashboardPage() {
  const [workOrders, setWorkOrders] = useState<any[]>([]);
  const [properties, setProperties] = useState<any[]>([]);
  const [showAnalytics, setShowAnalytics] = useState(true);
  const [showCalendar, setShowCalendar] = useState(true);

  useEffect(() => {
    // Load work orders from localStorage
    const storedWorkOrders = localStorage.getItem('workOrders');
    if (storedWorkOrders) {
      setWorkOrders(JSON.parse(storedWorkOrders));
    }

    // Load properties from localStorage
    const storedProperties = localStorage.getItem('properties');
    if (storedProperties) {
      setProperties(JSON.parse(storedProperties));
    }
  }, []);
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Dashboard Header */}
      <header className="bg-white dark:bg-slate-800 border-b dark:border-slate-700 sticky top-0 z-40">
        <div className="px-4 md:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 md:space-x-4">
              <Link href="/" className="flex items-center space-x-2 md:space-x-3">
                <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-xl md:text-2xl">P</span>
                </div>
                <span className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white">Preserve</span>
              </Link>
              <div className="hidden md:block border-l dark:border-slate-600 pl-4 ml-4">
                <h1 className="text-lg font-semibold text-slate-900 dark:text-white">Property Dashboard</h1>
              </div>
            </div>
            <div className="flex items-center space-x-2 md:space-x-4">
              <div className="relative hidden lg:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search properties..."
                  className="pl-10 pr-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-64 text-slate-900 dark:text-white dark:bg-slate-700"
                />
              </div>
              <ThemeToggle />
              <button className="relative p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors">
                <Bell className="w-5 h-5 md:w-6 md:h-6" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <button className="flex items-center space-x-2 p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors">
                <User className="w-5 h-5 md:w-6 md:h-6" />
                <span className="hidden md:block">Bank Admin</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white dark:bg-slate-800 border-r dark:border-slate-700 min-h-screen hidden lg:block">
          <nav className="p-4 space-y-2">
            <Link href="/dashboard">
              <NavItem icon={<Home />} label="Dashboard" active />
            </Link>
            <Link href="/dashboard/properties">
              <NavItem icon={<MapPin />} label="Your Properties" />
            </Link>
            <Link href="/dashboard/work-orders">
              <NavItem icon={<FileText />} label="Work Orders" />
            </Link>
            <NavItem icon={<Camera />} label="Inspections" />
            <NavItem icon={<Settings />} label="Settings" />
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-4 md:p-6">
          {/* Stats Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              title="Active Properties"
              value={properties.length.toString()}
              change="+12%"
              trend="up"
              icon={<Home className="w-6 h-6" />}
            />
            <StatCard
              title="Pending Work Orders"
              value={workOrders.filter(wo => wo.status === 'pending').length.toString()}
              change="-5%"
              trend="down"
              icon={<FileText className="w-6 h-6" />}
            />
            <StatCard
              title="Total Work Orders"
              value={workOrders.length.toString()}
              change="+8%"
              trend="up"
              icon={<Camera className="w-6 h-6" />}
            />
            <StatCard
              title="Completed"
              value={workOrders.filter(wo => wo.status === 'completed').length.toString()}
              change="0%"
              trend="neutral"
              icon={<CheckCircle2 className="w-6 h-6" />}
            />
          </div>

          {/* Actions Bar */}
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border dark:border-slate-700 p-4 mb-6 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2 md:gap-4 flex-wrap">
              <Link href="/dashboard/properties/add" className="bg-blue-600 text-white px-3 md:px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center gap-2 text-sm md:text-base">
                <Plus className="w-4 h-4 md:w-5 md:h-5" />
                Add Property
              </Link>
              <Link href="/dashboard/work-orders/create" className="border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 px-3 md:px-4 py-2 rounded-lg hover:border-blue-600 hover:text-blue-600 dark:hover:border-blue-500 dark:hover:text-blue-400 transition text-sm md:text-base">
                Create Work Order
              </Link>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowAnalytics(!showAnalytics)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition flex items-center gap-2 ${
                  showAnalytics ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                }`}
              >
                <BarChart3 className="w-4 h-4" />
                <span className="hidden sm:inline">Analytics</span>
              </button>
              <button
                onClick={() => setShowCalendar(!showCalendar)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition flex items-center gap-2 ${
                  showCalendar ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                }`}
              >
                <Calendar className="w-4 h-4" />
                <span className="hidden sm:inline">Calendar</span>
              </button>
            </div>
          </div>

          {/* Analytics Section */}
          {showAnalytics && workOrders.length > 0 && (
            <div className="mb-6">
              <WorkOrderAnalytics workOrders={workOrders} />
            </div>
          )}

          {/* Calendar Section */}
          {showCalendar && workOrders.length > 0 && (
            <div className="mb-6">
              <WorkOrderCalendar workOrders={workOrders} />
            </div>
          )}

          {/* Properties Table */}
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border dark:border-slate-700 overflow-hidden">
            <div className="p-4 border-b dark:border-slate-700 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Your Properties</h2>
              <Link 
                href="/dashboard/properties"
                className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium text-sm flex items-center gap-1"
              >
                View All Properties
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 dark:bg-slate-700 border-b dark:border-slate-600">
                  <tr>
                    <th className="px-4 md:px-6 py-3 text-left text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                      Property Address
                    </th>
                    <th className="px-4 md:px-6 py-3 text-left text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider hidden sm:table-cell">
                      County
                    </th>
                    <th className="px-4 md:px-6 py-3 text-left text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-4 md:px-6 py-3 text-left text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider hidden lg:table-cell">
                      Last Inspection
                    </th>
                    <th className="px-4 md:px-6 py-3 text-left text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider hidden lg:table-cell">
                      Next Service
                    </th>
                    <th className="px-4 md:px-6 py-3 text-left text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                  {properties.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center">
                        <Home className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
                        <p className="text-slate-600 dark:text-slate-400 mb-4">No properties added yet</p>
                        <Link 
                          href="/dashboard/properties/add"
                          className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                        >
                          <Plus className="w-4 h-4" />
                          Add Your First Property
                        </Link>
                      </td>
                    </tr>
                  ) : (
                    properties.slice(0, 5).map((property) => (
                      <PropertyRow
                        key={property.id}
                        address={property.address}
                        county={property.county || 'N/A'}
                        status="active"
                        lastInspection="N/A"
                        nextService="N/A"
                      />
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="mt-6 bg-white dark:bg-slate-800 rounded-lg shadow-sm border dark:border-slate-700 p-4 md:p-6">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">Recent Activity</h2>
            <div className="space-y-4">
              <ActivityItem
                icon={<Camera className="w-5 h-5 text-blue-600" />}
                title="Inspection completed"
                description="1234 Main Street, Durham - All clear"
                time="2 hours ago"
              />
              <ActivityItem
                icon={<FileText className="w-5 h-5 text-green-600" />}
                title="Work order completed"
                description="Lawn maintenance at 5678 Oak Avenue"
                time="5 hours ago"
              />
              <ActivityItem
                icon={<AlertCircle className="w-5 h-5 text-yellow-600" />}
                title="Attention required"
                description="7890 Maple Drive - Minor repair needed"
                time="1 day ago"
              />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

function NavItem({ icon, label, active = false }: { icon: React.ReactNode; label: string; active?: boolean }) {
  return (
    <button
      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition ${
        active
          ? 'bg-blue-50 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 font-medium'
          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700'
      }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}

function StatCard({ 
  title, 
  value, 
  change, 
  trend, 
  icon 
}: { 
  title: string; 
  value: string; 
  change: string; 
  trend: 'up' | 'down' | 'neutral';
  icon: React.ReactNode;
}) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border dark:border-slate-700 p-4 md:p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="text-slate-600 dark:text-slate-400 text-sm md:text-base">{title}</div>
        <div className="text-slate-400 dark:text-slate-500">{icon}</div>
      </div>
      <div className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2">{value}</div>
      <div className={`text-sm font-medium ${
        trend === 'up' ? 'text-green-600 dark:text-green-400' :
        trend === 'down' ? 'text-red-600 dark:text-red-400' :
        'text-slate-600 dark:text-slate-400'
      }`}>
        {change} from last month
      </div>
    </div>
  );
}

function PropertyRow({
  address,
  county,
  status,
  lastInspection,
  nextService,
}: {
  address: string;
  county: string;
  status: 'active' | 'pending' | 'attention';
  lastInspection: string;
  nextService: string;
}) {
  const statusColors = {
    active: 'bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-300',
    pending: 'bg-yellow-100 dark:bg-yellow-900/50 text-yellow-800 dark:text-yellow-300',
    attention: 'bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-300',
  };

  return (
    <tr className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
      <td className="px-4 md:px-6 py-4">
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-slate-400 dark:text-slate-500" />
          <span className="font-medium text-slate-900 dark:text-white text-sm md:text-base">{address}</span>
        </div>
      </td>
      <td className="px-4 md:px-6 py-4 text-slate-600 dark:text-slate-400 hidden sm:table-cell">{county}</td>
      <td className="px-4 md:px-6 py-4">
        <span className={`px-2 md:px-3 py-1 rounded-full text-xs font-semibold ${statusColors[status]}`}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
      </td>
      <td className="px-4 md:px-6 py-4 text-slate-600 dark:text-slate-400 hidden lg:table-cell">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-slate-400 dark:text-slate-500" />
          {lastInspection}
        </div>
      </td>
      <td className="px-4 md:px-6 py-4 text-slate-600 dark:text-slate-400 hidden lg:table-cell">{nextService}</td>
      <td className="px-4 md:px-6 py-4">
        <button className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium text-sm">
          View Details
        </button>
      </td>
    </tr>
  );
}

function ActivityItem({ 
  icon, 
  title, 
  description, 
  time 
}: { 
  icon: React.ReactNode; 
  title: string; 
  description: string; 
  time: string;
}) {
  return (
    <div className="flex gap-4 pb-4 border-b dark:border-slate-700 last:border-b-0 last:pb-0">
      <div className="flex-shrink-0 w-10 h-10 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center">
        {icon}
      </div>
      <div className="flex-1">
        <h3 className="font-medium text-slate-900 dark:text-white">{title}</h3>
        <p className="text-sm text-slate-600 dark:text-slate-400">{description}</p>
        <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">{time}</p>
      </div>
    </div>
  );
}
