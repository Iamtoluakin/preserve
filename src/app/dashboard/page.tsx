'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Home,
  FileText, 
  Camera, 
  Settings,
  Plus,
  Search,
  Bell,
  MapPin,
  Calendar,
  ChevronDown,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  BarChart3,
  LogOut,
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import WorkOrderAnalytics from '@/components/WorkOrderAnalytics';
import WorkOrderCalendar from '@/components/WorkOrderCalendar';
import { readProperties, readWorkOrders, type PreserveProperty, type PreserveWorkOrder } from '@/lib/localData';

export default function DashboardPage() {
  const router = useRouter();
  const [workOrders, setWorkOrders] = useState<PreserveWorkOrder[]>([]);
  const [properties, setProperties] = useState<PreserveProperty[]>([]);
  const [userEmail, setUserEmail] = useState('');
  const accountInitial = (userEmail?.trim()[0] || 'U').toUpperCase();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    await fetch('/api/auth/session', { method: 'DELETE' });
    router.push('/login');
  };

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) setUserEmail(data.user.email || '');
    });
  }, []);
  const [showAnalytics, setShowAnalytics] = useState(true);
  const [showCalendar, setShowCalendar] = useState(true);

  const loadData = () => {
    setWorkOrders(readWorkOrders());
    setProperties(readProperties());
  };

  useEffect(() => {
    loadData();

    // Reload data when window gains focus (user returns to tab)
    const handleFocus = () => loadData();
    window.addEventListener('focus', handleFocus);

    // Reload data on storage events (changes in other tabs)
    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'workOrders' || e.key === 'preserve_properties') {
        loadData();
      }
    };
    window.addEventListener('storage', handleStorage);

    // Set up interval to check for changes every 2 seconds
    const interval = setInterval(loadData, 2000);

    return () => {
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('storage', handleStorage);
      clearInterval(interval);
    };
  }, []);
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Dashboard Header */}
      <header className="bg-white/95 backdrop-blur border-b border-slate-200 sticky top-0 z-40">
        <div className="px-3 sm:px-4 md:px-6 py-3">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 md:gap-5 min-w-0">
              <Link href="/" className="flex items-center gap-2 md:gap-3 flex-shrink-0">
                <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center shadow-sm">
                  <span className="text-white font-bold text-lg md:text-2xl">P</span>
                </div>
                <span className="text-lg md:text-2xl font-bold text-slate-900">Preserve</span>
              </Link>
              <div className="hidden md:block h-9 w-px bg-slate-200" />
              <div className="hidden sm:block min-w-0">
                <h1 className="text-base md:text-lg font-bold text-slate-950 leading-tight">Property Dashboard</h1>
                <p className="text-xs text-slate-500 truncate">Track preservation services, cleaning, inspections, and work orders</p>
              </div>
            </div>

            <div className="flex items-center gap-2 md:gap-3">
              <div className="relative hidden lg:block">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search properties, orders, services..."
                  className="h-11 w-[22rem] rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm text-slate-900 placeholder:text-slate-400 shadow-inner focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
                />
              </div>
              <button
                className="relative h-10 w-10 flex items-center justify-center text-slate-600 hover:text-blue-700 hover:bg-blue-50 rounded-xl transition-colors"
                aria-label="Notifications"
              >
                <Bell className="w-5 h-5" />
                <span className="absolute right-2.5 top-2.5 w-2.5 h-2.5 bg-red-500 border-2 border-white rounded-full" />
              </button>
              <div className="hidden md:flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-2.5 py-1.5 shadow-sm">
                <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-sm">
                  {accountInitial}
                </div>
                <div className="min-w-0 leading-tight">
                  <p className="text-xs font-semibold text-slate-900 truncate max-w-[150px]">
                    {userEmail || 'Signed in'}
                  </p>
                  <p className="text-[11px] text-slate-500">Owner account</p>
                </div>
                <ChevronDown className="w-4 h-4 text-slate-400" />
              </div>
              <button
                onClick={handleLogout}
                className="h-10 w-10 sm:w-auto flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-0 sm:px-3 text-sm font-semibold text-slate-600 hover:border-red-200 hover:bg-red-50 hover:text-red-600 transition"
                title="Sign out"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden xl:inline">Sign Out</span>
              </button>
            </div>
          </div>

          <div className="mt-3 sm:hidden">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search properties..."
                className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
              />
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r min-h-screen hidden lg:block">
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
            <Link href="/dashboard/inspections">
              <NavItem icon={<Camera />} label="Inspections" />
            </Link>
            <Link href="/dashboard/settings">
              <NavItem icon={<Settings />} label="Settings" />
            </Link>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-3 sm:p-4 md:p-6 pb-28 lg:pb-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 mb-5 md:mb-8">
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
          <div className="bg-white rounded-xl shadow-sm border p-3 md:p-4 mb-5 md:mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 md:gap-4">
            <div className="grid grid-cols-2 sm:flex sm:items-center gap-2 md:gap-4">
              <Link href="/dashboard/properties/add" className="bg-blue-600 text-white px-3 md:px-4 py-2.5 rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-2 text-sm md:text-base font-semibold">
                <Plus className="w-4 h-4 md:w-5 md:h-5" />
                Add Property
              </Link>
              <Link href="/dashboard/work-orders/create" className="border border-slate-300 text-slate-700 px-3 md:px-4 py-2.5 rounded-lg hover:border-blue-600 hover:text-blue-600 transition text-sm md:text-base font-semibold text-center">
                Create Work Order
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:flex sm:items-center gap-2">
              <button
                onClick={() => setShowAnalytics(!showAnalytics)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition flex items-center gap-2 ${
                  showAnalytics ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <BarChart3 className="w-4 h-4" />
                <span>Analytics</span>
              </button>
              <button
                onClick={() => setShowCalendar(!showCalendar)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition flex items-center gap-2 ${
                  showCalendar ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <Calendar className="w-4 h-4" />
                <span>Calendar</span>
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
          <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
            <div className="p-4 border-b flex items-center justify-between">
              <h2 className="text-xl font-semibold text-slate-900">Your Properties</h2>
              <Link 
                href="/dashboard/properties"
                className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center gap-1"
              >
                View All Properties
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
            <div className="sm:hidden divide-y divide-slate-100">
              {properties.length === 0 ? (
                <div className="px-6 py-12 text-center">
                  <Home className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  <p className="text-slate-600 mb-4">No properties added yet</p>
                  <Link
                    href="/dashboard/properties/add"
                    className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-lg hover:bg-blue-700 transition font-semibold text-sm"
                  >
                    <Plus className="w-4 h-4" />
                    Add Your First Property
                  </Link>
                </div>
              ) : (
                properties.slice(0, 5).map(property => (
                  <MobilePropertyCard
                    key={property.id}
                    id={property.id}
                    address={property.address || 'Untitled property'}
                    county={property.county || 'N/A'}
                  />
                ))
              )}
            </div>
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b">
                  <tr>
                    <th className="px-4 md:px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      Property Address
                    </th>
                    <th className="px-4 md:px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider hidden sm:table-cell">
                      County
                    </th>
                    <th className="px-4 md:px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-4 md:px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider hidden lg:table-cell">
                      Last Inspection
                    </th>
                    <th className="px-4 md:px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider hidden lg:table-cell">
                      Next Service
                    </th>
                    <th className="px-4 md:px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {properties.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center">
                        <Home className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                        <p className="text-slate-600 mb-4">No properties added yet</p>
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
                        address={property.address || 'Untitled property'}
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
          <div className="mt-6 bg-white rounded-xl shadow-sm border p-4 md:p-6">            <h2 className="text-xl font-semibold text-slate-900 mb-4">Recent Activity</h2>
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

      {/* Mobile Bottom Nav */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur border-t z-50 grid grid-cols-5 px-2 pt-2 pb-[calc(0.5rem+env(safe-area-inset-bottom))] shadow-[0_-8px_24px_rgba(15,23,42,0.08)]">
        <Link href="/dashboard" className="flex flex-col items-center gap-0.5 px-1 py-1.5 rounded-lg bg-blue-50 text-blue-600">
          <Home className="w-5 h-5" />
          <span className="text-xs font-medium">Home</span>
        </Link>
        <Link href="/dashboard/properties" className="flex flex-col items-center gap-0.5 px-1 py-1.5 rounded-lg text-slate-500 hover:text-blue-600 transition">
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

function NavItem({ icon, label, active = false }: { icon: React.ReactNode; label: string; active?: boolean }) {
  return (
    <button
      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition ${
        active
          ? 'bg-blue-50 text-blue-600 font-medium'
          : 'text-slate-600 hover:bg-slate-50'
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
    <div className="bg-white rounded-xl shadow-sm border p-3 md:p-6">
      <div className="flex items-start justify-between gap-2 mb-3 md:mb-4">
        <div className="text-slate-600 text-xs md:text-base leading-snug">{title}</div>
        <div className="text-slate-400 [&>svg]:w-5 [&>svg]:h-5 md:[&>svg]:w-6 md:[&>svg]:h-6 flex-shrink-0">{icon}</div>
      </div>
      <div className="text-2xl md:text-3xl font-bold text-slate-900 mb-1 md:mb-2">{value}</div>
      <div className={`text-sm font-medium ${
        trend === 'up' ? 'text-green-600' :
        trend === 'down' ? 'text-red-600' :
        'text-slate-600'
      }`}>
        <span className="md:hidden">{change}</span>
        <span className="hidden md:inline">{change} from last month</span>
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
    active: 'bg-green-100 text-green-800',
    pending: 'bg-yellow-100 text-yellow-800',
    attention: 'bg-red-100 text-red-800'
  };

  return (
    <tr className="hover:bg-slate-50">
      <td className="px-4 md:px-6 py-4">
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-slate-400" />
          <span className="font-medium text-slate-900 text-sm md:text-base">{address}</span>
        </div>
      </td>
      <td className="px-4 md:px-6 py-4 text-slate-600 hidden sm:table-cell">{county}</td>
      <td className="px-4 md:px-6 py-4">
        <span className={`px-2 md:px-3 py-1 rounded-full text-xs font-semibold ${statusColors[status]}`}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
      </td>
      <td className="px-4 md:px-6 py-4 text-slate-600 hidden lg:table-cell">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-slate-400" />
          {lastInspection}
        </div>
      </td>
      <td className="px-4 md:px-6 py-4 text-slate-600 hidden lg:table-cell">{nextService}</td>
      <td className="px-4 md:px-6 py-4">
        <button className="text-blue-600 hover:text-blue-800 font-medium text-sm">
          View Details
        </button>
      </td>
    </tr>
  );
}

function MobilePropertyCard({ id, address, county }: { id: string; address: string; county: string }) {
  return (
    <div className="p-4">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0">
          <MapPin className="w-5 h-5" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-semibold text-slate-900 break-words">{address}</p>
          <p className="text-xs text-slate-500 mt-1">{county}</p>
          <div className="mt-3 flex items-center justify-between gap-3">
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
              Active
            </span>
            <Link href={`/dashboard/properties/${id}`} className="text-sm font-semibold text-blue-600">
              View Details
            </Link>
          </div>
        </div>
      </div>
    </div>
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
    <div className="flex gap-4 pb-4 border-b last:border-b-0 last:pb-0">
      <div className="flex-shrink-0 w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center">
        {icon}
      </div>
      <div className="flex-1">
        <h3 className="font-medium text-slate-900">{title}</h3>
        <p className="text-sm text-slate-600">{description}</p>
        <p className="text-xs text-slate-400 mt-1">{time}</p>
      </div>
    </div>
  );
}
